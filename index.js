import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static("public"));

app.get("/api/audius", async (req, res) => {
  const q = req.query.q || "";

  const r = await fetch(
    `https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(q)}`
  );

  const data = await r.json();
  res.json(data);
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Harmony running")
);
