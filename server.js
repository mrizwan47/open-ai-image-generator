import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const VALID_SIZES = {
  "1024x1024": "1024x1024",
  "1536x1024": "1536x1024", // landscape
  "1024x1536": "1024x1536", // portrait
};

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, size = "1024x1024", quality = "low" } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!VALID_SIZES[size]) {
      return res.status(400).json({ error: "Invalid size" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: "OPENAI_API_KEY is not set in .env" });
    }

    const response = await openai.images.generate({
      model: "gpt-image-1-mini",
      prompt: prompt.trim(),
      n: 1,
      size,
      quality,
    });

    const imageBase64 = response.data[0].b64_json;
    res.json({ image: `data:image/png;base64,${imageBase64}` });
  } catch (err) {
    console.error("OpenAI error:", err?.message || err);
    const message =
      err?.error?.message || err?.message || "Failed to generate image";
    res.status(500).json({ error: message });
  }
});

const PORT = 3088;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
