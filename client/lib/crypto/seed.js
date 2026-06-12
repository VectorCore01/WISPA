export function seedHiveMembers() {
  return [
    { id: "WISP-118402", name: "moth", status: "pending", key: "771203" },
    { id: "WISP-552071", name: "petal", status: "pending", key: "094412" },
    { id: "WISP-660913", name: "cedar", status: "approved", key: "330821" },
  ];
}

// Sample public Hives for the directory. Value is measured in Honey.
export function seedHives() {
  return [
    { id: "HIVE-204913", name: "night-signal", honey: 1840, members: 312 },
    { id: "HIVE-771028", name: "driftwood", honey: 920, members: 144 },
    { id: "HIVE-318864", name: "ember", honey: 410, members: 73 },
    { id: "HIVE-660913", name: "low-tide", honey: 155, members: 28 },
    { id: "HIVE-118402", name: "paper-moth", honey: 60, members: 9 },
  ];
}

export function seedCells() {
  const now = Date.now();
  return [
    { id: 1, peer: "WISP-204913", peerName: "nightjar", authed: false, lastActivity: now - 30 * 1000, seen: false, messages: [{ id: 11, from: "them", text: "Are we still on for tonight?", kind: "text", time: "21:04" }] },
    { id: 2, peer: "WISP-771028", peerName: "driftwood", authed: false, lastActivity: now - 55 * 1000, seen: false, messages: [{ id: 21, from: "them", text: "Sent you the files. Open when ready.", kind: "text", time: "18:30" }] },
    { id: 3, peer: "WISP-318864", peerName: "ember", authed: false, lastActivity: now, seen: true, messages: [] },
  ];
}
