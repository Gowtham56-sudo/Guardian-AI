function normalizePhoneForSms(phone: string): string | null {
  const compact = phone.replace(/[\s()-]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : null;
}

function normalizePhoneForWhatsapp(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  const defaultCountryCode =
    (process.env.SMSALERT_WHATSAPP_DEFAULT_COUNTRY_CODE || "91").replace(/\D/g, "") || "91";

  if (digits.length === 10) {
    return digits;
  }

  if (
    defaultCountryCode &&
    digits.startsWith(defaultCountryCode) &&
    digits.length === defaultCountryCode.length + 10
  ) {
    return digits.slice(-10);
  }

  if (digits.length >= 8 && digits.length <= 15) {
    return digits;
  }

  return null;
}

function toUniqueValues(values: string[] | undefined): string[] {
  if (!values || !Array.isArray(values)) {
    return [];
  }

  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface SosMessageInput {
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

interface SosResult {
  ok: boolean;
  requestedWhatsappCount: number;
  requestedEmailCount: number;
  deliveredWhatsappCount: number;
  deliveredEmailCount: number;
  simulated: boolean;
  diagnostics: string[];
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
      diagnostics.push(`WhatsApp delivery failed: HTTP ${response.status}${errorText ? ` - ${errorText}` : ""}`);
      return { deliveredCount: 0, diagnostics };
    }

    return { deliveredCount: normalizedRecipients.length, diagnostics };
  } catch (error) {
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

        if (
          response.status === 403 &&
          errorText.includes("API access from non-browser environments is currently disabled")
        ) {
          diagnostics.push(
            "EmailJS blocked server-side API usage. Enable 'API access from non-browser environments' at https://dashboard.emailjs.com/admin/account/security."
          );
          return { deliveredCount, diagnostics };
        }

        diagnostics.push(`EmailJS recipient send error: EmailJS send failed (${response.status}): ${errorText}`);
        continue;
      }

      deliveredCount += 1;
    }

    return { deliveredCount, diagnostics };
  } catch (error) {
    diagnostics.push(`EmailJS transport error: ${error instanceof Error ? error.message : "Unknown error"}`);
    return { deliveredCount: 0, diagnostics };
  }
}

async function processSosAlert(input: SosMessageInput): Promise<SosResult> {
  const phones = toUniqueValues(input.recipients?.phones)
    .map((phone) => normalizePhoneForSms(phone))
    .filter((phone): phone is string => Boolean(phone));
  const emails = toUniqueValues(input.recipients?.emails).filter((email) => isValidEmail(email));

  if (phones.length === 0 && emails.length === 0) {
    return {
      ok: false,
      requestedWhatsappCount: 0,
      requestedEmailCount: 0,
      deliveredWhatsappCount: 0,
      deliveredEmailCount: 0,
      simulated: true,
      diagnostics: ["No recipients configured for SOS alerts."],
    };
  }

  const triggerSource = input.triggerSource ?? "button";
  const userName = input.userName || "Guardian user";
  const userPhone = input.userPhone || "Unknown";
  const latitude = input.location?.latitude;
  const longitude = input.location?.longitude;
  const accuracy = input.location?.accuracy;
  const mapLink = input.mapLink || "Location unavailable";

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
  }

  let deliveredEmailCount = 0;
  if (emails.length > 0) {
    const emailResult = await sendSosEmail(emails, `Guardian SOS Alert - ${userName}`, message);
    deliveredEmailCount = emailResult.deliveredCount;
    diagnostics.push(...emailResult.diagnostics);
  }

  const requestedWhatsappCount = phones.length;
  const requestedEmailCount = emails.length;
  const deliveredTotal = deliveredWhatsappCount + deliveredEmailCount;
  const requestedTotal = requestedWhatsappCount + requestedEmailCount;

  return {
    ok: true,
    requestedWhatsappCount,
    requestedEmailCount,
    deliveredWhatsappCount,
    deliveredEmailCount,
    simulated: deliveredTotal < requestedTotal,
    diagnostics,
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await processSosAlert((req.body ?? {}) as SosMessageInput);

    if (!result.ok) {
      return res.status(400).json({
        error: result.diagnostics[0] || "Invalid SOS request",
        diagnostics: result.diagnostics,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Unexpected SOS processing failure",
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
