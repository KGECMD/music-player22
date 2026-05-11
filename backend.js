// server/index.js
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
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Harmony v7 running"));
