import { GoogleGenAI } from "@google/genai";

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
    return res.status(502).json({
      error: "AI assistant provider request failed",
      reason: error instanceof Error ? error.message : "Unknown provider error",
    });
  }
}
