const BASE = "";

async function req(method, path, body) {
  const opts = { method, credentials: "include", headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(BASE + path, opts);
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Request failed");
  return data;
}

export function normCell(c) {
  return { ...c, peer: c.peer_id || c.peer, peerName: c.peer_name || c.peerName, authed: c.authed ? 1 : 0 };
}

export const api = {
  register: (username, password) => req("POST", "/api/auth/register", { username, password }),
  login: (wispId, password) => req("POST", "/api/auth/login", { wispId, password }),
  restorePro: (wispId, words) => req("POST", "/api/auth/restore-pro", { wispId, words }),
  me: () => req("GET", "/api/auth/me"),
  logout: () => req("POST", "/api/auth/logout"),

  getCells: () => req("GET", "/api/cells"),
  openCell: (peerId, key) => req("POST", "/api/cells", { peerId, key }),
  getMessages: (cellId) => req("GET", `/api/cells/${cellId}/messages`),
  sendMessage: (cellId, kind, content) => req("POST", `/api/cells/${cellId}/messages`, { kind, content }),
  unlockCell: (cellId, key) => req("POST", `/api/cells/${cellId}/unlock`, { key }),
  markOpened: (cellId) => req("POST", `/api/cells/${cellId}/open`),

  getHive: () => req("GET", "/api/hive"),
  createHive: () => req("POST", "/api/hive"),
  destroyHive: () => req("DELETE", "/api/hive"),
  joinHive: (hiveId) => req("POST", "/api/hive/join", { hiveId }),
  approveMember: (wispId) => req("POST", "/api/hive/approve", { wispId }),
  rejectMember: (wispId) => req("POST", "/api/hive/reject", { wispId }),
  postToHive: (content) => req("POST", "/api/hive/posts", { content }),
};
