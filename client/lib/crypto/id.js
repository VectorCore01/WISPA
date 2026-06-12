const WORDLIST = [
  "hive","honey","sting","wing","queen","swarm","nectar","wax",
  "hum","whisper","shadow","chamber","key","seal","brood","dark",
  "gold","pattern","hexagon","scent","trail","dance","night","silence",
];

export function genSeed() {
  const pick = () => WORDLIST[Math.floor(Math.random() * WORDLIST.length)];
  return Array.from({ length: 12 }, pick);
}

export function rand6() {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

// WISP ids: exactly 3 letters + 3 digits in random order (ambiguous chars left
// out for readability). Old all-digit demo ids stay valid since digits count.
const ID_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const ID_DIGITS = "23456789";
export function randCode() {
  const pick = (set) => set[Math.floor(Math.random() * set.length)];
  const chars = [pick(ID_LETTERS), pick(ID_LETTERS), pick(ID_LETTERS), pick(ID_DIGITS), pick(ID_DIGITS), pick(ID_DIGITS)];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export function genWispId() { return "WISP-" + randCode(); }
export function genHiveId() { return "HIVE-" + rand6(); }
export function genMsgKey() { return rand6(); }
export function genHiveKey() { return rand6(); }
