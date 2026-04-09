import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

function isBlockedGeminiKey(error: unknown): boolean {
  const reason = error instanceof Error ? error.message.toLowerCase() : "";
  return (
    reason.includes("api key was reported as leaked") ||
    reason.includes("permission_denied") ||
    reason.includes("status\":\"permission_denied") ||
    reason.includes("code\":403") ||
    reason.includes("code: 403")
  );
}

interface SosAlertRequest {
  triggerSource?: "button" | "shake" | "voice";
  location?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  };
  mapLink?: string;
  userName?: string;
  userPhone?: string;
  recipients?: {
    phones?: string[];
    emails?: string[];
  };
}

interface DeliveryResult {
  requestedWhatsappCount: number;
  requestedEmailCount: number;
  deliveredWhatsappCount: number;
  deliveredEmailCount: number;
  diagnostics: string[];
}

function toUniqueValues(values: string[] | undefined): string[] {
  if (!values || !Array.isArray(values)) {
    return [];
  }

  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function normalizePhoneForSms(phone: string): string | null {
  const compact = phone.replace(/[\s()-]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : null;
}

function normalizePhoneForWhatsapp(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  const defaultCountryCode = (process.env.SMSALERT_WHATSAPP_DEFAULT_COUNTRY_CODE || "91").replace(/\D/g, "") || "91";

  if (digits.length === 10) {
    return digits;
  }

  if (defaultCountryCode && digits.startsWith(defaultCountryCode) && digits.length === defaultCountryCode.length + 10) {
    return digits.slice(-10);
  }

  if (digits.length >= 8 && digits.length <= 15) {
    return digits;
  }

  return null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendSosWhatsapp(
  recipients: string[],
  message: string
): Promise<{ deliveredCount: number; diagnostics: string[] }> {
  const diagnostics: string[] = [];
  const apiKey = process.env.SMSALERT_WHATSAPP_API_KEY;
  const sender = process.env.SMSALERT_WHATSAPP_SENDER_ID;
  const route = process.env.SMSALERT_WHATSAPP_ROUTE || "whatsapp";
  const endpoint = process.env.SMSALERT_WHATSAPP_URL || "https://www.smsalert.co.in/api/mwhatsapp.php";
  const textParam = process.env.SMSALERT_WHATSAPP_TEXT_PARAM || "text";
  const apiKeyParam = process.env.SMSALERT_WHATSAPP_APIKEY_PARAM || "apikey";
  const mobileParam = process.env.SMSALERT_WHATSAPP_MOBILE_PARAM || "mobileno";
  const senderParam = process.env.SMSALERT_WHATSAPP_SENDER_PARAM || "sender";
  const routeParam = process.env.SMSALERT_WHATSAPP_ROUTE_PARAM || "route";

  if (!apiKey || !sender) {
    diagnostics.push("WhatsApp transport not configured: missing SMSALERT_WHATSAPP_API_KEY or SMSALERT_WHATSAPP_SENDER_ID.");
    return { deliveredCount: 0, diagnostics };
  }

  const normalizedRecipients = recipients
    .map((phone) => normalizePhoneForWhatsapp(phone))
    .filter((phone): phone is string => Boolean(phone));

  if (normalizedRecipients.length === 0) {
    console.error("No recipient phone numbers are valid for smsalert.co WhatsApp delivery.");
    diagnostics.push("No valid WhatsApp recipient numbers after normalization.");
    return { deliveredCount: 0, diagnostics };
  }

  try {
    const body = new URLSearchParams({
      [apiKeyParam]: apiKey,
      [senderParam]: sender,
      [mobileParam]: normalizedRecipients.join(","),
      [routeParam]: route,
      [textParam]: message,
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("smsalert.co WhatsApp send failed: %s", errorText);
      diagnostics.push(`WhatsApp delivery failed: HTTP ${response.status}${errorText ? ` - ${errorText}` : ""}`);
      return { deliveredCount: 0, diagnostics };
    }

    return { deliveredCount: normalizedRecipients.length, diagnostics };
  } catch (error) {
    console.error("smsalert.co WhatsApp transport error:", error);
    diagnostics.push(`WhatsApp transport error: ${error instanceof Error ? error.message : "Unknown error"}`);
    return { deliveredCount: 0, diagnostics };
  }
}

async function sendSosEmail(
  recipients: string[],
  subject: string,
  message: string
): Promise<{ deliveredCount: number; diagnostics: string[] }> {
  const diagnostics: string[] = [];
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const fromName = process.env.EMAILJS_FROM_NAME || "GuardianAI Alerts";

  if (!serviceId || !templateId || !publicKey) {
    diagnostics.push("EmailJS transport not configured: missing EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, or EMAILJS_PUBLIC_KEY.");
    return { deliveredCount: 0, diagnostics };
  }

  try {
    let deliveredCount = 0;

    for (const recipient of recipients) {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          ...(privateKey ? { accessToken: privateKey } : {}),
          template_params: {
            to_email: recipient,
            to_name: recipient,
            subject,
            message,
            from_name: fromName,
            app_name: "GuardianAI",
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorMessage = `EmailJS send failed (${response.status}): ${errorText}`;

        if (
          response.status === 403 &&
          errorText.includes("API access from non-browser environments is currently disabled")
        ) {
          const policyMessage =
            "EmailJS blocked server-side API usage. Enable 'API access from non-browser environments' at https://dashboard.emailjs.com/admin/account/security.";
          console.warn(policyMessage);
          diagnostics.push(policyMessage);
          return { deliveredCount, diagnostics };
        }

        console.error("EmailJS email transport error:", errorMessage);
        diagnostics.push(`EmailJS recipient send error: ${errorMessage}`);
        continue;
      }

      deliveredCount += 1;
    }

    return { deliveredCount, diagnostics };
  } catch (error) {
    console.error("EmailJS email transport error:", error);
    diagnostics.push(`EmailJS transport error: ${error instanceof Error ? error.message : "Unknown error"}`);
    return { deliveredCount: 0, diagnostics };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "GuardianAI Backend is live" });
  });

  app.post("/api/ai/analyze-distress", async (req, res) => {
    const { audioTranscript } = req.body as { audioTranscript?: string };

    if (!audioTranscript || typeof audioTranscript !== "string") {
      return res.status(400).json({ error: "audioTranscript must be a non-empty string" });
    }

    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following audio transcript for signs of immediate danger, panic, or distress. Transcript: "${audioTranscript}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isThreat: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER },
              threatType: {
                type: Type.STRING,
                enum: ["shouting", "panic", "distress", "none"],
              },
              recommendedAction: { type: Type.STRING },
            },
            required: ["isThreat", "confidence", "threatType", "recommendedAction"],
          },
        },
      });

      if (!response.text) {
        throw new Error("Gemini response text is empty");
      }

      return res.json(JSON.parse(response.text));
    } catch (error) {
      if (isBlockedGeminiKey(error)) {
        return res.status(403).json({
          error: "GEMINI_API_KEY_BLOCKED",
          reason:
            "Configured Gemini API key is blocked or revoked. Rotate the key in Google AI Studio, then update GEMINI_API_KEY in your deployment environment.",
        });
      }

      console.error("AI Threat Detection Error:", error);
      return res.status(500).json({
        isThreat: false,
        confidence: 0,
        threatType: "none",
        recommendedAction: "Continue monitoring",
      });
    }
  });

  app.post("/api/ai/assistant", async (req, res) => {
    const { query, language } = req.body as { query?: string; language?: string };

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "query must be a non-empty string" });
    }

    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured on the server",
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are GuardianAI, a personal safety assistant. Respond to the user's query in ${language || "English"}. User Query: "${query}"`,
      });

      return res.json({ text: response.text || "I'm sorry, I couldn't process that." });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown provider error";

      if (isBlockedGeminiKey(error)) {
        return res.status(403).json({
          error: "GEMINI_API_KEY_BLOCKED",
          reason:
            "Configured Gemini API key is blocked or revoked. Rotate the key in Google AI Studio, then update GEMINI_API_KEY in your deployment environment.",
          providerReason: reason,
        });
      }

      console.error("AI Assistant Error:", error);
      return res.status(502).json({
        error: "AI assistant provider request failed",
        reason,
      });
    }
  });

  app.post("/api/sos/alert", async (req, res) => {
    const body = (req.body ?? {}) as SosAlertRequest;
    const phones = toUniqueValues(body.recipients?.phones)
      .map((phone) => normalizePhoneForSms(phone))
      .filter((phone): phone is string => Boolean(phone));
    const emails = toUniqueValues(body.recipients?.emails).filter((email) => isValidEmail(email));

    if (phones.length === 0 && emails.length === 0) {
      return res.status(400).json({ error: "No recipients configured for SOS alerts." });
    }

    const triggerSource = body.triggerSource ?? "button";
    const userName = body.userName || "Guardian user";
    const userPhone = body.userPhone || "Unknown";
    const latitude = body.location?.latitude;
    const longitude = body.location?.longitude;
    const accuracy = body.location?.accuracy;
    const mapLink = body.mapLink || "Location unavailable";

    const locationText =
      typeof latitude === "number" && typeof longitude === "number"
        ? `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}${typeof accuracy === "number" ? `, Accuracy: ${Math.round(accuracy)}m` : ""}`
        : "Location unavailable";

    const message = [
      `SOS ALERT from ${userName}`,
      `Source: ${triggerSource}`,
      `Phone: ${userPhone}`,
      `Location: ${locationText}`,
      `Map: ${mapLink}`,
      `Time: ${new Date().toISOString()}`,
    ].join("\n");

    const diagnostics: string[] = [];

    let deliveredWhatsappCount = 0;
    if (phones.length > 0) {
      const whatsappResult = await sendSosWhatsapp(phones, message);
      deliveredWhatsappCount = whatsappResult.deliveredCount;
      diagnostics.push(...whatsappResult.diagnostics);
      if (deliveredWhatsappCount === 0) {
        console.log("[SOS WHATSAPP FALLBACK] recipients=%o\n%s", phones, message);
      }
    }

    let deliveredEmailCount = 0;
    if (emails.length > 0) {
      try {
        const emailResult = await sendSosEmail(emails, `Guardian SOS Alert - ${userName}`, message);
        deliveredEmailCount = emailResult.deliveredCount;
        diagnostics.push(...emailResult.diagnostics);
      } catch (error) {
        console.error("SOS email delivery failed:", error);
        deliveredEmailCount = 0;
        diagnostics.push(`SOS email delivery failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    if (deliveredEmailCount === 0 && emails.length > 0) {
      console.log("[SOS EMAIL FALLBACK] recipients=%o\n%s", emails, message);
    }

    const result: DeliveryResult = {
      requestedWhatsappCount: phones.length,
      requestedEmailCount: emails.length,
      deliveredWhatsappCount,
      deliveredEmailCount,
      diagnostics,
    };

    const deliveredTotal = result.deliveredWhatsappCount + result.deliveredEmailCount;
    const requestedTotal = result.requestedWhatsappCount + result.requestedEmailCount;

    if (requestedTotal > 0 && deliveredTotal === 0) {
      console.warn("SOS alert fell back to simulation because no transport delivered the message.");
    }

    return res.json({
      ok: true,
      ...result,
      simulated: deliveredTotal < requestedTotal,
    });
  });

  app.get("/favicon.ico", (req, res) => {
    const faviconPath = path.join(process.cwd(), "public", "favicon.ico");
    if (fs.existsSync(faviconPath)) {
      return res.sendFile(faviconPath);
    }

    return res.status(204).end();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
