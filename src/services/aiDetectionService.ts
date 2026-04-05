import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ThreatAnalysisResult {
  isThreat: boolean;
  confidence: number;
  threatType: 'shouting' | 'panic' | 'distress' | 'none';
  recommendedAction: string;
}

export async function analyzeDistressSignal(audioTranscript: string): Promise<ThreatAnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following audio transcript for signs of immediate danger, panic, or distress. 
      Transcript: "${audioTranscript}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isThreat: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            threatType: { 
              type: Type.STRING, 
              enum: ['shouting', 'panic', 'distress', 'none'] 
            },
            recommendedAction: { type: Type.STRING }
          },
          required: ["isThreat", "confidence", "threatType", "recommendedAction"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Threat Detection Error:", error);
    return {
      isThreat: false,
      confidence: 0,
      threatType: 'none',
      recommendedAction: "Continue monitoring"
    };
  }
}

export async function getMultilingualAssistantResponse(query: string, language: string = 'English'): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are GuardianAI, a personal safety assistant. Respond to the user's query in ${language}.
      User Query: "${query}"`,
    });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm having trouble connecting right now. Please try again.";
  }
}
