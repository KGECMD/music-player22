import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

// Monochrome Music API - Search endpoint
app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q) {
      return res.json({ data: [] });
    }

    // Using Audius Discovery Provider as primary API
    const r = await fetch(
      `https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(q)}&limit=10`
    );

    const data = await r.json();
    
    // Format response for consistent UI
    const formatted = {
      data: (data.data || []).map(track => ({
        id: track.id,
        title: track.title,
        artist: track.user?.name || "Unknown",
        stream_url: track.preview_url || track.download?.cid || "",
        artwork_url: track.artwork?."150x150" || "",
        duration: track.duration || 0
      }))
    };
    
    res.json(formatted);
  } catch (error) {
    console.error("Search error:", error);
    res.json({ data: [] });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎵 Harmony Player running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
