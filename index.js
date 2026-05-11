import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static("public"));

app.get("/api/audius", async (req, res) => {
  const q = req.query.q;

  const r = await fetch(
    `https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(q)}`
  );

  const data = await r.json();

  const cleaned = data.data.map(t => ({
    id: t.id,
    title: t.title,
    artist: t.user?.name,
    stream: t.stream_url
  }));

  res.json(cleaned);
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Harmony v8 running")
);
