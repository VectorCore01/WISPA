import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

function rand6() { return String(Math.floor(100000 + Math.random() * 900000)); }

router.get("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const db = await getDb();
  const user = db._get("SELECT * FROM users WHERE wisp_id = ?", [req.user.wisp_id]);
  if (!user.hive_id) return res.json({ hiveId: null });

  const members = db._query(
    "SELECT u.wisp_id, u.username, hm.status FROM hive_members hm JOIN users u ON hm.wisp_id = u.wisp_id WHERE hm.hive_id = ?",
    [user.hive_id]
  );
  const posts = db._query("SELECT * FROM hive_posts WHERE hive_id = ? ORDER BY id", [user.hive_id]);
  res.json({ hiveId: user.hive_id, members, posts, isOwner: user.tier === "pro" });
});

router.post("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const db = await getDb();
  const user = db._get("SELECT * FROM users WHERE wisp_id = ?", [req.user.wisp_id]);
  if (user.tier !== "pro") return res.status(403).json({ error: "Only WISP Pro can create a Hive." });

  const hiveId = "HIVE-" + rand6();
  db.run("UPDATE users SET hive_id = ? WHERE wisp_id = ?", [hiveId, req.user.wisp_id]);
  db.run("INSERT INTO hive_members (wisp_id, hive_id, status) VALUES (?,?,?)",
    [req.user.wisp_id, hiveId, "approved"]);
  res.json({ hiveId });
});

router.delete("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const db = await getDb();
  const user = db._get("SELECT * FROM users WHERE wisp_id = ?", [req.user.wisp_id]);
  if (user.tier !== "pro" || !user.hive_id) return res.status(403).json({ error: "Not allowed." });

  db.run("DELETE FROM hive_posts WHERE hive_id = ?", [user.hive_id]);
  db.run("DELETE FROM hive_members WHERE hive_id = ?", [user.hive_id]);
  db.run("UPDATE users SET hive_id = NULL WHERE wisp_id = ?", [req.user.wisp_id]);
  res.json({ ok: true });
});

router.post("/join", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const { hiveId } = req.body;
  if (!hiveId) return res.status(400).json({ error: "Hive id required." });

  const db = await getDb();
  const owner = db._get("SELECT * FROM users WHERE hive_id = ? AND tier = 'pro'", [hiveId]);
  if (!owner) return res.status(404).json({ error: "Hive not found." });

  try {
    db.run("INSERT INTO hive_members (wisp_id, hive_id, status) VALUES (?,?,?)",
      [req.user.wisp_id, hiveId, "pending"]);
  } catch { return res.status(409).json({ error: "Already requested or joined." }); }
  res.json({ ok: true });
});

router.post("/approve", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const { wispId } = req.body;
  const db = await getDb();
  const user = db._get("SELECT * FROM users WHERE wisp_id = ?", [req.user.wisp_id]);
  if (user.tier !== "pro" || !user.hive_id) return res.status(403).json({ error: "Not allowed." });

  db.run("UPDATE hive_members SET status = 'approved' WHERE wisp_id = ? AND hive_id = ?",
    [wispId, user.hive_id]);
  res.json({ ok: true });
});

router.post("/reject", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const { wispId } = req.body;
  const db = await getDb();
  const user = db._get("SELECT * FROM users WHERE wisp_id = ?", [req.user.wisp_id]);
  if (user.tier !== "pro" || !user.hive_id) return res.status(403).json({ error: "Not allowed." });

  db.run("DELETE FROM hive_members WHERE wisp_id = ? AND hive_id = ?", [wispId, user.hive_id]);
  res.json({ ok: true });
});

router.post("/posts", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Content required." });

  const db = await getDb();
  const user = db._get("SELECT * FROM users WHERE wisp_id = ?", [req.user.wisp_id]);
  if (!user.hive_id) return res.status(403).json({ error: "No Hive." });

  const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  db.run("INSERT INTO hive_posts (hive_id, wisp_id, author, content, time) VALUES (?,?,?,?,?)",
    [user.hive_id, req.user.wisp_id, user.username, content, time]);
  const posts = db._query("SELECT * FROM hive_posts WHERE id = last_insert_rowid()");
  res.json(posts[0] || {});
});

export default router;
