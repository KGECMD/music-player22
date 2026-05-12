import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

// Search tracks from Audius
app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q) {
      return res.json({ data: [] });
    }

    const r = await fetch(
      `https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(q)}&limit=20`
    );

    const data = await r.json();
    
    const formatted = {
      data: (data.data || []).map(track => ({
        id: track.id,
        title: track.title,
        artist: track.user?.name || "Unknown",
        artwork_url: track.artwork?."150x150" || track.artwork?."480x480" || "",
        duration: track.duration || 0,
        stream_url: track.preview_url || "",
        download_url: track.download?.cid || "",
        genre: track.genre || "Unknown",
        release_date: track.release_date || "",
        preview_url: track.preview_url || ""
      }))
    };
    
    res.json(formatted);
  } catch (error) {
    console.error("Search error:", error);
    res.json({ data: [] });
  }
});

// Trending tracks
app.get("/api/trending", async (req, res) => {
  try {
    const r = await fetch(
      `https://discoveryprovider.audius.co/v1/tracks/trending?limit=20`
    );

    const data = await r.json();
    
    const formatted = {
      data: (data.data || []).map(track => ({
        id: track.id,
        title: track.title,
        artist: track.user?.name || "Unknown",
        artwork_url: track.artwork?."150x150" || "",
        duration: track.duration || 0,
        stream_url: track.preview_url || "",
        genre: track.genre || "Unknown"
      }))
    };
    
    res.json(formatted);
  } catch (error) {
    console.error("Trending error:", error);
    res.json({ data: [] });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", version: "2.0.0" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎵 Harmony Player v2.0 running on port ${PORT}`);
  console.log(`📱 Visit: http://localhost:${PORT}`);
});
