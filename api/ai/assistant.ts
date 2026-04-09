import { GoogleGenAI } from "@google/genai";

function parseGeminiError(error: unknown): { isBlockedKey: boolean; reason: string } {
  const reason = error instanceof Error ? error.message : "Unknown provider error";
  const normalizedReason = reason.toLowerCase();

  const isBlockedKey =
    normalizedReason.includes("api key was reported as leaked") ||
    normalizedReason.includes("permission_denied") ||
    normalizedReason.includes("status\":\"permission_denied") ||
    normalizedReason.includes("code\":403") ||
    normalizedReason.includes("code: 403");

  return { isBlockedKey, reason };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, language } = (req.body ?? {}) as { query?: string; language?: string };

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "query must be a non-empty string" });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are GuardianAI, a personal safety assistant. Respond to the user's query in ${language || "English"}. User Query: "${query}"`,
    });

    return res.status(200).json({ text: response.text || "I'm sorry, I couldn't process that." });
  } catch (error) {
    const { isBlockedKey, reason } = parseGeminiError(error);

    if (isBlockedKey) {
      return res.status(403).json({
        error: "GEMINI_API_KEY_BLOCKED",
        reason:
          "Configured Gemini API key is blocked or revoked. Rotate the key in Google AI Studio, then update GEMINI_API_KEY in your deployment environment.",
        providerReason: reason,
      });
    }

    return res.status(502).json({
      error: "AI assistant provider request failed",
      reason,
    });
  }
}
