// server/index.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// LEGAL music metadata API (iTunes)
app.get("/api/search", async (req, res) => {
  const q = req.query.q;

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&limit=15`;

  const data = await fetch(url).then(r => r.json());

  const cleaned = data.results.map(t => ({
    title: t.trackName || t.collectionName,
    artist: t.artistName,
    preview: t.previewUrl,
    cover: t.artworkUrl100
  }));

  res.json(cleaned);
});

app.listen(3000, () => console.log("Server running"));
