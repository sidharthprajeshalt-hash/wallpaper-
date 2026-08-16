import type { IncomingMessage, ServerResponse } from "http";
import { GoogleGenAI } from "@google/genai";

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { prompt, style, mood, colorPalette } = body;
    const ai = getGeminiClient();

    if (!ai) {
      // Graceful fallback
      return res.status(200).json({
        success: true,
        title: prompt || "Cosmic Aurora Luminescence",
        description: `An ethereal ${mood || "vibrant"} wallpaper crafted in ${style || "digital art"} aesthetic with ${colorPalette || "deep jewel"} tones.`,
        tags: ["4K", style || "Digital Art", mood || "Aesthetic", "High-Resolution"],
        colorPalette: ["#0f172a", "#38bdf8", "#818cf8", "#c084fc", "#f472b6"],
        suggestedSearchQueries: [
          `${prompt || "abstract neon glow"} 4k wallpaper`,
          `${style || "minimalist landscape"} aesthetic`,
          `${mood || "dark amoled"} background`
        ]
      });
    }

    const systemPrompt = `You are a world-class digital art director and wallpaper curator.
Analyze the user's idea and generate a structured JSON wallpaper recommendation with:
- title: concise artistic title (3-5 words)
- description: evocative visual description (20-30 words)
- tags: array of 4-6 descriptive tags (e.g., ["AMOLED", "Minimalist", "Cyberpunk", "4K"])
- colorPalette: array of 5 hex color codes matching the theme
- suggestedKeywords: 3 search keywords for finding matching high-res imagery`;

    const userMessage = `User request: ${prompt || "Dreamy celestial aesthetic"}. Style: ${style || "Cinematic"}. Mood: ${mood || "Serene"}. Palette: ${colorPalette || "Deep blues and gold"}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.status(200).json({ success: true, ...data });
  } catch (error: any) {
    console.error("AI Wallpaper Error:", error);
    res.status(200).json({
      success: true,
      title: "Abstract Luminary Flow",
      description: "Intricate fluid waves shimmering under soft studio ambient lighting.",
      tags: ["4K", "Fluid", "Abstract", "AMOLED"],
      colorPalette: ["#090d16", "#1e293b", "#38bdf8", "#a855f7", "#ec4899"]
    });
  }
}
