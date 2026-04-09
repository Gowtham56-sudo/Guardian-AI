import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { audioTranscript } = (req.body ?? {}) as { audioTranscript?: string };

  if (!audioTranscript || typeof audioTranscript !== "string") {
    return res.status(400).json({ error: "audioTranscript must be a non-empty string" });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
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

    return res.status(200).json(JSON.parse(response.text));
  } catch {
    return res.status(500).json({
      isThreat: false,
      confidence: 0,
      threatType: "none",
      recommendedAction: "Continue monitoring",
    });
  }
}
