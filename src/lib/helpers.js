const WORDLIST = [
  "hive","honey","sting","wing","queen","swarm","nectar","wax",
  "hum","whisper","shadow","chamber","key","seal","brood","dark",
  "gold","pattern","hexagon","scent","trail","dance","night","silence",
];

export function genSeed() {
  const pick = () => WORDLIST[Math.floor(Math.random() * WORDLIST.length)];
  return Array.from({ length: 24 }, pick);
}

function rand6() {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

// Every account is a WISP with a fixed id. WISP Pro additionally owns a Hive.
// The message key is the 6-digit code others must type (with your WISP id)
// to open a cell with you.
export function genWispId() { return "WISP-" + rand6(); }
export function genHiveId() { return "HIVE-" + rand6(); }
export function genMsgKey() { return rand6(); }

export const ATTACH_ICON = { image: "▣", video: "▶", file: "▤" };
export const ATTACH_LABEL = { image: "Photo", video: "Video", file: "File" };

export function attachKindOf(file) {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "file";
}

export function fmtSize(bytes) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function nowTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export const DEMO_LIFETIME_MS = 90 * 1000;

export function fmtCountdown(ms) {
  if (ms <= 0) return "0:00";
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Simulated account directory. In a real app this lives on the server:
// to open a cell with someone you must know their WISP id AND their 6-digit
// message key. Without both, no cell can be opened — this stops anyone from
// messaging random people. `name` is the username they chat under.
export const DIRECTORY = {
  "WISP-204913": { key: "418027", name: "nightjar" },
  "WISP-771028": { key: "650194", name: "driftwood" },
  "WISP-318864": { key: "203865", name: "ember" },
};

export function lookupPeer(wispId, key) {
  const entry = DIRECTORY[wispId];
  if (!entry) return { ok: false, reason: "unknown" };
  if (entry.key !== key) return { ok: false, reason: "wrong-key" };
  return { ok: true, name: entry.name };
}

// Demo join requests + members for a freshly opened Hive channel, so the
// "approve individual users" flow is visible right away.
export function seedHiveMembers() {
  return [
    { id: "WISP-118402", name: "moth", status: "pending" },
    { id: "WISP-552071", name: "petal", status: "pending" },
    { id: "WISP-660913", name: "cedar", status: "approved" },
  ];
}

// `authed` = you have entered this peer's 6-digit key for this cell. Cells you
// start yourself are authed (you typed the key to open them). Incoming cells
// start un-authed: you must enter the peer's key before you can reply.
export function seedCells() {
  const now = Date.now();
  return [
    { id: 1, peer: "WISP-204913", peerName: "nightjar", authed: false, lastActivity: now - 30 * 1000, current: { from: "them", text: "Are we still on for tonight?", kind: "text", time: "21:04" }, seen: false },
    { id: 2, peer: "WISP-771028", peerName: "driftwood", authed: false, lastActivity: now - 55 * 1000, current: { from: "them", text: "Sent you the files. Open when ready.", kind: "text", time: "18:30" }, seen: false },
    { id: 3, peer: "WISP-318864", peerName: "ember", authed: false, lastActivity: now, current: null, seen: true },
  ];
}
