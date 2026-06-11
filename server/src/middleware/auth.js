import { getDb } from "../db.js";

export async function loadSession(req, res, next) {
  const sid = req.cookies?.sid;
  if (!sid) { req.user = null; return next(); }

  const db = await getDb();
  const session = db._get("SELECT * FROM sessions WHERE id = ?", [sid]);
  if (!session) { req.user = null; return next(); }

  const user = db._get("SELECT wisp_id, username, tier, hive_id FROM users WHERE wisp_id = ?", [session.wisp_id]);
  if (!user) { req.user = null; return next(); }

  req.user = { ...user, sessionId: sid };
  next();
}
