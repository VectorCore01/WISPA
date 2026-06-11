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
