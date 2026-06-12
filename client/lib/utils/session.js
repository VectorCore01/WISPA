const SAVE_KEY = "wispa_session";

export function loadSession() {
  try {
    const raw = sessionStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveSession(data) {
  try { sessionStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch {}
}

export function clearSession() {
  try { sessionStorage.removeItem(SAVE_KEY); } catch {}
}
