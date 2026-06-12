import { Router } from "express";
import bcrypt from "bcryptjs";
import { getDb } from "../db.js";

const router = Router();

function rand6() { return String(Math.floor(100000 + Math.random() * 900000)); }

// WISP ids: exactly 3 letters + 3 digits in random order (ambiguous chars out).
const ID_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const ID_DIGITS = "23456789";
function randCode() {
  const pick = (set) => set[Math.floor(Math.random() * set.length)];
  const chars = [pick(ID_LETTERS), pick(ID_LETTERS), pick(ID_LETTERS), pick(ID_DIGITS), pick(ID_DIGITS), pick(ID_DIGITS)];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 4)
    return res.status(400).json({ error: "Username and password (min 4 chars) required." });

  const db = await getDb();
  const wispId = "WISP-" + randCode();
  const msgKey = rand6();
  const hash = bcrypt.hashSync(password, 10);
  const keyHash = bcrypt.hashSync(msgKey, 10);

  db.run("INSERT INTO users (wisp_id, username, login_hash, msg_key, tier) VALUES (?,?,?,?,?)",
    [wispId, username.trim(), hash, keyHash, "wisp"]);
  const sid = rand6() + rand6();
  db.run("INSERT INTO sessions (id, wisp_id) VALUES (?,?)", [sid, wispId]);

  res.cookie("sid", sid, { httpOnly: true, sameSite: "lax", maxAge: 86400000 * 30 });
  res.json({ wispId, msgKey, username: username.trim(), tier: "wisp" });
});

router.post("/login", async (req, res) => {
  const { wispId, password } = req.body;
  if (!wispId || !password) return res.status(400).json({ error: "WISP id and password required." });

  const db = await getDb();
  const user = db._get("SELECT * FROM users WHERE wisp_id = ?", [wispId]);
  if (!user) return res.status(401).json({ error: "No account with that id." });
  if (!bcrypt.compareSync(password, user.login_hash))
    return res.status(401).json({ error: "Wrong password." });

  const sid = rand6() + rand6();
  db.run("INSERT INTO sessions (id, wisp_id) VALUES (?,?)", [sid, wispId]);

  res.cookie("sid", sid, { httpOnly: true, sameSite: "lax", maxAge: 86400000 * 30 });
  res.json({ wispId: user.wisp_id, username: user.username, tier: user.tier, hiveId: user.hive_id });
});

router.post("/restore-pro", async (req, res) => {
  const { wispId, words } = req.body;
  if (!wispId || !words) return res.status(400).json({ error: "WISP id and 24 words required." });

  const db = await getDb();
  const user = db._get("SELECT * FROM users WHERE wisp_id = ? AND tier = 'pro'", [wispId]);
  if (!user) return res.status(401).json({ error: "No Pro account with that id." });
  if (!bcrypt.compareSync(words, user.pro_key))
    return res.status(401).json({ error: "Wrong 24-word key." });

  const sid = rand6() + rand6();
  db.run("INSERT INTO sessions (id, wisp_id) VALUES (?,?)", [sid, wispId]);
  res.cookie("sid", sid, { httpOnly: true, sameSite: "lax", maxAge: 86400000 * 30 });
  res.json({ wispId: user.wisp_id, username: user.username, tier: "pro", hiveId: user.hive_id });
});

router.get("/me", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });
  const db = await getDb();
  const user = db._get("SELECT wisp_id, username, tier, hive_id FROM users WHERE wisp_id = ?", [req.user.wisp_id]);
  res.json(user || { error: "Not found" });
});

router.post("/logout", async (req, res) => {
  if (req.user) {
    const db = await getDb();
    db.run("DELETE FROM sessions WHERE id = ?", [req.user.sessionId]);
  }
  res.clearCookie("sid");
  res.json({ ok: true });
});

export default router;
