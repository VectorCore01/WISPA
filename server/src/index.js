import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { loadSession } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import cellRoutes from "./routes/cells.js";
import hiveRoutes from "./routes/hive.js";
import { getDb } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(loadSession);

app.use("/api/auth", authRoutes);
app.use("/api/cells", cellRoutes);
app.use("/api/hive", hiveRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, user: req.user || null });
});

async function start() {
  await getDb();
  app.listen(PORT, () => console.log(`WISPA server on http://localhost:${PORT}`));
}

start();
