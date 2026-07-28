import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { generateDynamicOrganicReflection } from "./src/lib/guidance";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const ACTIVITY_LABELS: Record<string, string> = {
  sleep: "Slept 7+ hours",
  assignment: "Finished an assignment",
  alone: "Spent the day alone",
  fresh_air: "Got some fresh air",
  exam: "Exam or quiz day",
  chores: "Did chores",
};

// API route for dynamic personalized AI guidance blurb
app.post("/api/gemini/guidance", async (req, res) => {
  try {
    const { mood, activities, note, verse, history } = req.body || {};

    const moodName = mood?.label || mood?.id || "calm & contemplative";
    
    let activityText = "taking time to pause and reflect";
    if (Array.isArray(activities) && activities.length > 0) {
      const mapped = activities.map((act) => ACTIVITY_LABELS[act] || act);
      activityText = mapped.join(", ");
    } else if (Array.isArray(activities) && activities.length === 0) {
      activityText = "taking time to be still without pressing tasks";
    }

    const userThoughtNote = typeof note === "string" && note.trim() ? note.trim() : "";
    const scriptureContext = verse ? `"${verse.text}" (${verse.theme || verse.reference || ""})` : "";
    const historySummary = typeof history === "string" && history.trim() ? history.trim() : "";

    const systemInstruction = `You are a warm, thoughtful, and perceptive companion for Rippl (a serene koi pond mindfulness reflection space). Your goal is to write a concise, deeply personalized 2-to-3 sentence reflection that sounds like a real, grounded human friend responding directly to the user's logged day.

### CRITICAL STYLE & PERSONALIZATION RULES:
1. SUBTLE WATER & POND ATMOSPHERE:
   - Softly weave in subtle, poetic imagery inspired by a peaceful water or koi pond (e.g., gentle ripples settling, still quiet waters, calm currents, soft reflections, or letting thoughts float smoothly) in a natural and comforting way.
   - Keep the water/pond theme subtle, graceful, and soothing—never cheesy, overly heavy, or forced.

2. REAL-LIFE SYNTHESIS & EMPATHY:
   - If the user wrote a personal note or detail ("${userThoughtNote}"), directly acknowledge and respond to their exact words, situation, or emotions with genuine empathy and insight.
   - Synthesize their mood (${moodName}) and activities (${activityText}) realistically.
   - ACCURACY REQUIREMENT: Be strictly accurate to the logged activities. Do NOT mention getting fresh air or stepping outdoors unless "Got some fresh air" (fresh_air) was logged. Do NOT confuse spending time alone ("Spent the day alone") with outdoor activities or sleep.
   - Always maintain an encouraging, deeply supportive, and comforting tone.

3. DYNAMIC VARIETY:
   - Vary your sentence structures, openings, and tone every time so every response feels distinct, fresh, and uniquely tailored to this moment.

4. LENGTH & FORMAT:
   - Exactly 2 to 3 fluid, warm sentences.
   - Do NOT offer medical/therapist advice. Do NOT use bullet points, quotes, or markdown headers.`;

    let prompt = `User's Reflection Inputs Today:
- Current Mood: ${moodName}
- Activities Logged: ${activityText}`;

    if (userThoughtNote) {
      prompt += `\n- Personal Detail/Thought Written by User: "${userThoughtNote}"`;
    }
    if (scriptureContext) {
      prompt += `\n- Daily Verse/Theme Context: ${scriptureContext}`;
    }
    if (historySummary) {
      prompt += `\n- Recent Mood History Context: ${historySummary}`;
    }

    prompt += `\n\nWrite a 2-3 sentence personalized human reflection paragraph tailored specifically to this unique combination. Return ONLY the reflection text with no headers, quotes, or markdown.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.9,
          topP: 0.95,
        },
      });

      const guidance = response.text ? response.text.trim().replace(/^["']|["']$/g, "") : "";
      if (guidance) {
        return res.json({ guidance, source: "gemini-3.6-flash" });
      }
    } catch (_primaryError: any) {
      // Primary model rate-limited or quota exceeded; attempt fallback model
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.9,
            topP: 0.95,
          },
        });

        const fallbackGuidance = fallbackResponse.text ? fallbackResponse.text.trim().replace(/^["']|["']$/g, "") : "";
        if (fallbackGuidance) {
          return res.json({ guidance: fallbackGuidance, source: "gemini-2.5-flash" });
        }
      } catch (_secondaryError: any) {
        // Fallback model also rate-limited or quota exceeded
      }
    }

    // Dynamic, non-template local reflection generator
    const localFallback = generateDynamicOrganicReflection(mood?.id || "", moodName, Array.isArray(activities) ? activities : [], userThoughtNote);

    res.json({ guidance: localFallback, source: "local-organic-generator" });
  } catch (_error: any) {
    res.json({
      guidance: "Taking a quiet moment to check in with yourself is a meaningful habit. Honor where you are right now and allow your evening to unfold at an unhurried, comfortable pace.",
      source: "emergency-fallback"
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
