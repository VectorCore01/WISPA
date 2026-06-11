import initSqlJs from "sql.js";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "wispa.db");

let db;

function rows(results) {
  if (!results.length) return [];
  const { columns, values } = results[0];
  return values.map((row) =>
    Object.fromEntries(columns.map((c, i) => [c, row[i]]))
  );
}

function row(results) {
  const r = rows(results);
  return r.length ? r[0] : null;
}

function query(sql, params) {
  if (!db) throw new Error("DB not initialized");
  if (params) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) results.push(stmt.getAsObject());
    stmt.free();
    return results;
  }
  return rows(db.exec(sql));
}

function get(sql, params) {
  const r = query(sql, params);
  return r.length ? r[0] : null;
}

function run(sql, params) {
  if (!db) throw new Error("DB not initialized");
  if (params && params.length) {
    db.run(sql, params);
  } else {
    db.exec(sql);
  }
  saveDb();
  return { changes: db.getRowsModified() };
}

export async function getDb() {
  if (db) return db;
  const SQL = await initSqlJs();

  if (existsSync(DB_PATH)) {
    const buf = readFileSync(DB_PATH);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }

  db.run("PRAGMA foreign_keys = ON");
  initSchema(db);
  await seedIfEmpty();
  saveDb();
  prepareHelpers();
  return db;
}

function prepareHelpers() {
  db._query = query;
  db._get = get;
  db._run = run;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  writeFileSync(DB_PATH, Buffer.from(data));
}

function initSchema(s) {
  s.run(`CREATE TABLE IF NOT EXISTS users (
    wisp_id TEXT PRIMARY KEY, username TEXT NOT NULL DEFAULT '',
    login_hash TEXT NOT NULL, msg_key TEXT NOT NULL,
    tier TEXT NOT NULL DEFAULT 'wisp' CHECK(tier IN ('wisp','pro')),
    pro_key TEXT, hive_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  s.run(`CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY, wisp_id TEXT NOT NULL REFERENCES users(wisp_id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  s.run(`CREATE TABLE IF NOT EXISTS cells (
    id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(wisp_id) ON DELETE CASCADE,
    peer_id TEXT NOT NULL REFERENCES users(wisp_id),
    peer_key TEXT NOT NULL, authed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  s.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cell_id TEXT NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK(sender IN ('me','them')),
    kind TEXT NOT NULL DEFAULT 'text' CHECK(kind IN ('text','image','video','file')),
    content TEXT NOT NULL, opened INTEGER NOT NULL DEFAULT 0,
    time TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  s.run(`CREATE TABLE IF NOT EXISTS hive_members (
    wisp_id TEXT NOT NULL REFERENCES users(wisp_id) ON DELETE CASCADE,
    hive_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending'
    CHECK(status IN ('pending','approved','rejected')),
    PRIMARY KEY (wisp_id, hive_id)
  )`);
  s.run(`CREATE TABLE IF NOT EXISTS hive_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hive_id TEXT NOT NULL, wisp_id TEXT NOT NULL REFERENCES users(wisp_id),
    author TEXT NOT NULL, content TEXT NOT NULL,
    time TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  s.run("CREATE INDEX IF NOT EXISTS idx_cells_owner ON cells(owner_id)");
  s.run("CREATE INDEX IF NOT EXISTS idx_messages_cell ON messages(cell_id)");
  s.run("CREATE INDEX IF NOT EXISTS idx_hive_members_hive ON hive_members(hive_id)");
  s.run("CREATE INDEX IF NOT EXISTS idx_hive_posts_hive ON hive_posts(hive_id)");
}

async function seedIfEmpty() {
  const r = db.exec("SELECT COUNT(*) as c FROM users");
  if (r.length && r[0].values[0][0] > 0) return;

  const hash = bcrypt.hashSync("demo", 10);
  const k1 = bcrypt.hashSync("418027", 10);
  const k2 = bcrypt.hashSync("650194", 10);
  const k3 = bcrypt.hashSync("203865", 10);

  db.run("INSERT INTO users (wisp_id, username, login_hash, msg_key, tier, hive_id) VALUES (?,?,?,?,?,?)",
    ["WISP-204913", "nightjar", hash, k1, "pro", "HIVE-001"]);
  db.run("INSERT INTO users (wisp_id, username, login_hash, msg_key, tier) VALUES (?,?,?,?,?)",
    ["WISP-771028", "driftwood", hash, k2, "wisp"]);
  db.run("INSERT INTO users (wisp_id, username, login_hash, msg_key, tier) VALUES (?,?,?,?,?)",
    ["WISP-318864", "ember", hash, k3, "wisp"]);
  db.run("INSERT INTO hive_members (wisp_id, hive_id, status) VALUES (?,?,?)",
    ["WISP-204913", "HIVE-001", "approved"]);
  db.run("INSERT INTO hive_members (wisp_id, hive_id, status) VALUES (?,?,?)",
    ["WISP-771028", "HIVE-001", "approved"]);
  db.run("INSERT INTO hive_members (wisp_id, hive_id, status) VALUES (?,?,?)",
    ["WISP-318864", "HIVE-001", "approved"]);
}
