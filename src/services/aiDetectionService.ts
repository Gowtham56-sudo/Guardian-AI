export interface ThreatAnalysisResult {
  isThreat: boolean;
  confidence: number;
  threatType: 'shouting' | 'panic' | 'distress' | 'none';
  recommendedAction: string;
}

export async function analyzeDistressSignal(audioTranscript: string): Promise<ThreatAnalysisResult> {
  try {
    const response = await fetch('/api/ai/analyze-distress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ audioTranscript })
    });

    if (!response.ok) {
      throw new Error(`AI distress analysis failed with status ${response.status}`);
    }

    return await response.json();
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
    const response = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, language })
    });

    if (!response.ok) {
      throw new Error(`AI assistant request failed with status ${response.status}`);
    }

    const data = (await response.json()) as { text?: string };
    return data.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm having trouble connecting right now. Please try again.";
  }
}
