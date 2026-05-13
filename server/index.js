import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// API Endpoints with fallbacks
const TIDAL_APIS = [
  "https://hifi.geeked.wtf",
  "https://api.monochrome.tf",
  "https://monochrome-api.samidy.com",
  "https://tidal.kinoplus.online"
];

const LUCIDA_APIS = [
  "https://wolf.qqdl.site",
  "https://maus.qqdl.site",
  "https://vogel.qqdl.site",
  "https://katze.qqdl.site",
  "https://hund.qqdl.site"
];

const AUDIUS_API = "https://discoveryprovider.audius.co/v1";

// Utility: Try multiple endpoints
async function tryMultipleAPIs(endpoints, path, options = {}) {
  for (const base of endpoints) {
    try {
      const url = `${base}${path}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        timeout: 5000
      });
      
      clearTimeout(timeout);
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log(`API ${base} failed, trying next...`);
      continue;
    }
  }
  return null;
}

// Search Tidal (HiFi)
app.get("/api/search/tidal", async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q) return res.json({ data: [] });

    const data = await tryMultipleAPIs(TIDAL_APIS, `/search?q=${encodeURIComponent(q)}&type=tracks&limit=20`);
    
    if (data?.tracks) {
      const formatted = {
        source: "tidal",
        data: data.tracks.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist?.name || "Unknown",
          duration: track.duration || 0,
          quality: track.audioQuality || "HQ",
          url: track.url || "",
          cover: track.album?.cover || "",
          isrc: track.isrc || "",
          source: "tidal"
        }))
      };
      return res.json(formatted);
    }
    
    res.json({ data: [] });
  } catch (error) {
    console.error("Tidal search error:", error);
    res.json({ data: [] });
  }
});

// Search Audius (Free)
app.get("/api/search/audius", async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q) return res.json({ data: [] });

    const response = await fetch(
      `${AUDIUS_API}/tracks/search?query=${encodeURIComponent(q)}&limit=20`,
      { signal: AbortSignal.timeout(5000) }
    );

    const data = await response.json();
    
    const formatted = {
      source: "audius",
      data: (data.data || []).map(track => ({
        id: track.id,
        title: track.title,
        artist: track.user?.name || "Unknown",
        duration: track.duration || 0,
        quality: "192kbps",
        url: track.preview_url || "",
        cover: track.artwork?."150x150" || "",
        source: "audius"
      }))
    };
    
    res.json(formatted);
  } catch (error) {
    console.error("Audius search error:", error);
    res.json({ data: [] });
  }
});

// Unified Search (all sources)
app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q) return res.json({ data: [] });

    const [tidalData, audiusData] = await Promise.allSettled([
      fetch(`http://localhost:${process.env.PORT || 3000}/api/search/tidal?q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .catch(() => ({ data: [] })),
      fetch(`http://localhost:${process.env.PORT || 3000}/api/search/audius?q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .catch(() => ({ data: [] }))
    ]);

    const allResults = [
      ...(tidalData.value?.data || []),
      ...(audiusData.value?.data || [])
    ].slice(0, 20);

    res.json({ data: allResults, sources: { tidal: tidalData.value?.data?.length || 0, audius: audiusData.value?.data?.length || 0 } });
  } catch (error) {
    console.error("Search error:", error);
    res.json({ data: [] });
  }
});

// Trending from Audius
app.get("/api/trending", async (req, res) => {
  try {
    const response = await fetch(`${AUDIUS_API}/tracks/trending?limit=20`, {
      signal: AbortSignal.timeout(5000)
    });

    const data = await response.json();
    
    const formatted = {
      data: (data.data || []).map(track => ({
        id: track.id,
        title: track.title,
        artist: track.user?.name || "Unknown",
        duration: track.duration || 0,
        quality: "192kbps",
        url: track.preview_url || "",
        cover: track.artwork?."150x150" || "",
        source: "audius"
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
  res.json({ 
    status: "ok", 
    version: "3.0.0",
    timestamp: new Date().toISOString(),
    sources: ["tidal", "audius", "lucida"]
  });
});

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🎵 Harmony Player v3.0 running on port ${PORT}`);
  console.log(`📍 Visit: http://localhost:${PORT}`);
  console.log(`🌍 Sources: Tidal (HiFi), Audius (Free), Lucida (QQDL)`);
});
