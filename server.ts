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

      return res.json(JSON.parse(response.text));
    } catch (error) {
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
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are GuardianAI, a personal safety assistant. Respond to the user's query in ${language || "English"}. User Query: "${query}"`,
      });

      return res.json({ text: response.text || "I'm sorry, I couldn't process that." });
    } catch (error) {
      console.error("AI Assistant Error:", error);
      return res.status(500).json({ text: "I'm having trouble connecting right now. Please try again." });
    }
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
