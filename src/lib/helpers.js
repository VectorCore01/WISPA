const WORDLIST = [
  "hive","honey","sting","wing","queen","swarm","nectar","wax",
  "hum","whisper","shadow","chamber","key","seal","brood","dark",
  "gold","pattern","hexagon","scent","trail","dance","night","silence",
];

export function genSeed() {
  const pick = () => WORDLIST[Math.floor(Math.random() * WORDLIST.length)];
  return Array.from({ length: 24 }, pick);
}

export function genWispId() {
  return "WISP-" + String(Math.floor(Math.random() * 900000) + 100000);
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

export function seedCells() {
  const now = Date.now();
  return [
    { id: 1, peer: "WISP-204913", lastActivity: now - 30 * 1000, current: { from: "them", text: "Are we still on for tonight?", kind: "text", time: "21:04" }, seen: false },
    { id: 2, peer: "WISP-771028", lastActivity: now - 55 * 1000, current: { from: "them", text: "Sent you the files. Open when ready.", kind: "text", time: "18:30" }, seen: false },
    { id: 3, peer: "WISP-318864", lastActivity: now, current: null, seen: true },
  ];
}
