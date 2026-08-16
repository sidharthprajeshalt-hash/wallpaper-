import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Google GenAI initialization
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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// PWA web manifest
app.get("/manifest.json", (req, res) => {
  res.setHeader("Content-Type", "application/manifest+json");
  res.json({
    name: "WallArt HD - 4K Wallpapers & APK",
    short_name: "WallArt HD",
    description: "High-resolution 4K & Mobile Wallpapers with live lockscreen preview",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    icons: [
      {
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=192&auto=format&fit=crop&q=80",
        sizes: "192x192",
        type: "image/jpeg"
      },
      {
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&auto=format&fit=crop&q=80",
        sizes: "512x512",
        type: "image/jpeg"
      }
    ]
  });
});

// AI Wallpaper Studio & Prompt Enhancer
app.post("/api/ai/suggest-wallpaper", async (req, res) => {
  try {
    const { prompt, style, mood, colorPalette } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if API key is not configured yet
      return res.json({
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
    res.json({ success: true, ...data });
  } catch (error: any) {
    console.error("AI Wallpaper Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate wallpaper concept",
      fallback: {
        title: "Abstract Luminary Flow",
        description: "Intricate fluid waves shimmering under soft studio ambient lighting.",
        tags: ["4K", "Fluid", "Abstract", "AMOLED"],
        colorPalette: ["#090d16", "#1e293b", "#38bdf8", "#a855f7", "#ec4899"]
      }
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wallpaper server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
