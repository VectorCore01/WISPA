import { Router } from "express";
import bcrypt from "bcryptjs";
import { getDb } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const db = await getDb();
  const cells = db._query(
    "SELECT c.*, u.username AS peer_name FROM cells c JOIN users u ON c.peer_id = u.wisp_id WHERE c.owner_id = ? ORDER BY c.created_at DESC",
    [req.user.wisp_id]
  );
  res.json(cells);
});

router.get("/:id/messages", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const db = await getDb();
  const cell = db._get("SELECT * FROM cells WHERE id = ? AND owner_id = ?", [req.params.id, req.user.wisp_id]);
  if (!cell) return res.status(404).json({ error: "Cell not found." });
  const messages = db._query("SELECT * FROM messages WHERE cell_id = ? ORDER BY id", [req.params.id]);
  res.json({ cell, messages });
});

router.post("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const { peerId, key } = req.body;
  if (!peerId || !key) return res.status(400).json({ error: "Peer id and key required." });

  const db = await getDb();
  const peer = db._get("SELECT * FROM users WHERE wisp_id = ?", [peerId]);
  if (!peer) return res.status(404).json({ error: "No WISP found with that id." });
  if (!bcrypt.compareSync(key, peer.msg_key))
    return res.status(403).json({ error: "Wrong message key." });

  const existing = db._get("SELECT * FROM cells WHERE owner_id = ? AND peer_id = ?", [req.user.wisp_id, peerId]);
  if (existing) return res.json({ cell: existing, exists: true });

  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const keyHash = bcrypt.hashSync(key, 10);
  db.run("INSERT INTO cells (id, owner_id, peer_id, peer_key, authed) VALUES (?,?,?,?,1)",
    [id, req.user.wisp_id, peerId, keyHash]);
  const cell = db._get("SELECT * FROM cells WHERE id = ?", [id]);
  res.json({ cell, exists: false });
});

router.post("/:id/messages", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const { kind, content } = req.body;
  if (!content) return res.status(400).json({ error: "Content required." });

  const db = await getDb();
  const cell = db._get("SELECT * FROM cells WHERE id = ? AND owner_id = ?", [req.params.id, req.user.wisp_id]);
  if (!cell) return res.status(404).json({ error: "Cell not found." });

  const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  db.run("INSERT INTO messages (cell_id, sender, kind, content, time) VALUES (?, 'me', ?, ?, ?)",
    [req.params.id, kind || "text", content, time]);
  const msgs = db._query("SELECT * FROM messages WHERE cell_id = ? ORDER BY id DESC LIMIT 1", [req.params.id]);
  res.json(msgs[0] || {});
});

router.post("/:id/unlock", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const { key } = req.body;
  if (!key) return res.status(400).json({ error: "Key required." });

  const db = await getDb();
  const cell = db._get("SELECT * FROM cells WHERE id = ? AND owner_id = ?", [req.params.id, req.user.wisp_id]);
  if (!cell) return res.status(404).json({ error: "Cell not found." });
  if (cell.authed) return res.json({ ok: true });

  if (bcrypt.compareSync(key, cell.peer_key)) {
    db.run("UPDATE cells SET authed = 1 WHERE id = ?", [req.params.id]);
    return res.json({ ok: true });
  }
  res.status(403).json({ error: "Wrong key." });
});

router.post("/:id/open", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const db = await getDb();
  db.run("UPDATE messages SET opened = 1 WHERE cell_id = ? AND sender = 'them'", [req.params.id]);
  res.json({ ok: true });
});

export default router;
