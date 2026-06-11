const WORDLIST = [
  "hive","honey","sting","wing","queen","swarm","nectar","wax",
  "hum","whisper","shadow","chamber","key","seal","brood","dark",
  "gold","pattern","hexagon","scent","trail","dance","night","silence",
];

export function genSeed() {
  const pick = () => WORDLIST[Math.floor(Math.random() * WORDLIST.length)];
  return Array.from({ length: 24 }, pick);
}

export function rand6() {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

export function genWispId() { return "WISP-" + rand6(); }
export function genHiveId() { return "HIVE-" + rand6(); }
export function genMsgKey() { return rand6(); }
export function genHiveKey() { return rand6(); }
