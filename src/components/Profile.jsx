import { useState } from "react";
import WaspLock from "./WaspLock.jsx";
import { FACE_DISPLAY, FACE_MONO, ENGRAVE } from "../lib/theme.js";
import { t } from "../lib/translations.js";

export default function Profile({ C, lang, username, setUsername, loginPass, setLoginPass, onContinue, onBack }) {
  const [error, setError] = useState("");

  function handleContinue() {
    const name = username.trim();
    const pass = loginPass.trim();
    if (name.length < 3) { setError(t(lang, "Pick a username with at least 3 characters.")); return; }
    if (pass.length < 4) { setError(t(lang, "Your password needs at least 4 characters.")); return; }
    setError("");
    onContinue();
  }

  const field = {
    width: "100%", background: "transparent", border: "none",
    color: C.text, fontSize: 15, fontFamily: FACE_MONO, padding: "13px 14px", outline: "none",
  };
  const wrap = (bad) => ({
    background: C.surface, border: `1px solid ${bad ? C.danger : C.line}`,
    borderRadius: 6, marginBottom: 14,
  });

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={onBack} style={{ background: "transparent", color: C.textDim, fontSize: 13, marginBottom: 20 }}>← {t(lang, "Back")}</button>

      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <WaspLock size={60} C={C} />
        <h2 style={{ fontFamily: FACE_DISPLAY, fontSize: 30, fontWeight: 700, ...ENGRAVE, letterSpacing: "0.14em", margin: "14px 0 6px" }}>{t(lang, "Set up your identity")}</h2>
        <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.6 }}>
          {t(lang, "Choose a name to chat under and a password to log back in. You'll get a WISP id and a 6-digit message key right after.")}
        </p>
      </div>

      <label style={{ display: "block", fontSize: 13, color: C.textDim, marginBottom: 6, fontFamily: FACE_MONO }}>{t(lang, "Username")}</label>
      <div style={wrap(error && username.trim().length < 3)}>
        <input
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError(""); }}
          placeholder={t(lang, "the name people see")}
          maxLength={24}
          style={field}
        />
      </div>

      <label style={{ display: "block", fontSize: 13, color: C.textDim, marginBottom: 6, fontFamily: FACE_MONO }}>{t(lang, "Login password")}</label>
      <div style={wrap(error && loginPass.trim().length < 4)}>
        <input
          type="password"
          value={loginPass}
          onChange={(e) => { setLoginPass(e.target.value); setError(""); }}
          placeholder={t(lang, "you'll log in with your id + this password")}
          maxLength={32}
          style={field}
        />
      </div>

      <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.5, marginBottom: 18 }}>
        <span style={{ color: C.accent }}>!</span> {t(lang, "Keep this password safe — a free WISP has no 24-word key to fall back on.")}
      </p>

      {error && <div style={{ color: C.danger, fontSize: 13, marginBottom: 12 }}>{error}</div>}

      <button onClick={handleContinue} style={{ width: "100%", padding: 15, borderRadius: 4, fontSize: 13, ...ENGRAVE, letterSpacing: "0.12em", background: C.text, color: C.bg, border: "none" }}>
        {t(lang, "Continue")}
      </button>
    </div>
  );
}
