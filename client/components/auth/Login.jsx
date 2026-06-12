import { useState } from "react";
import { CalcButton, WispIdInput, CellLogo } from "../app/shared.jsx";
import { FACE_MONO, ENGRAVE } from "../../lib/theme.js";
import { t } from "../../lib/data/translations.js";

export default function Login({ C, lang, onFinish, onBack, onCalc }) {
  const [code, setCode] = useState(""); // the part after WISP-
  const [mode, setMode] = useState("password"); // "password" (free WISP) | "words" (WISP Pro)
  const [pass, setPass] = useState("");
  const [words, setWords] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    const id = "WISP-" + code.trim().toUpperCase();
    if (!/^WISP-[A-Z0-9]{6}$/.test(id)) { setError(t(lang, "Enter a WISP id like WISP-7K2X9A.")); return; }
    if (mode === "words") {
      const count = words.trim().split(/\s+/).filter(Boolean).length;
      if (count !== 12) { setError(`${t(lang, "Expected 12 words, got")} ${count}.`); return; }
      setError("");
      onFinish(id, "pro");
    } else {
      if (pass.trim().length < 4) { setError(t(lang, "Your password needs at least 4 characters.")); return; }
      setError("");
      onFinish(id, "wisp");
    }
  }

  const tab = (key, label) => (
    <button onClick={() => { setMode(key); setError(""); }}
      style={{ flex: 1, background: mode === key ? C.surface2 : "transparent", color: mode === key ? C.text : C.textDim, border: `1px solid ${C.line}`, borderRadius: 4, padding: "10px 0", fontSize: 12, ...ENGRAVE, letterSpacing: "0.08em" }}>
      {label}
    </button>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
      <CalcButton C={C} onClick={onCalc} />
      <button onClick={onBack} style={{ background: "transparent", color: C.textDim, fontSize: 13, marginBottom: 20 }}>← {t(lang, "Back")}</button>

      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <CellLogo size={56} C={C} />
        <h2 style={{ fontFamily: FACE_MONO, fontSize: 26, fontWeight: 700, letterSpacing: "0.1em", margin: "14px 0 6px" }}>{t(lang, "Log in")}</h2>
        <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.6 }}>
          {t(lang, "Enter your WISP id and password. Forgot it? A Pro account can be recovered with its 12 words.")}
        </p>
      </div>

      <label style={{ display: "block", fontSize: 13, color: C.textDim, marginBottom: 6, fontFamily: FACE_MONO }}>{t(lang, "WISP id")}</label>
      <WispIdInput C={C} value={code} onChange={(v) => { setCode(v); setError(""); }} onEnter={handleSubmit}
        wrapStyle={{ background: C.surface, border: `1px solid ${error ? C.danger : C.line}`, borderRadius: 6, marginBottom: 16 }} />

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {tab("password", t(lang, "Password"))}
        {tab("words", t(lang, "Forgot? · 12 words"))}
      </div>

      {mode === "password" ? (
        <input type="password" value={pass} onChange={(e) => { setPass(e.target.value); setError(""); }} placeholder={t(lang, "your login password")}
          style={{ width: "100%", background: C.surface, border: `1px solid ${error ? C.danger : C.line}`, borderRadius: 6, padding: "12px 14px", color: C.text, fontSize: 15, fontFamily: FACE_MONO, outline: "none", marginBottom: 16 }} />
      ) : (
        <div style={{ background: C.surface, border: `1px solid ${error ? C.danger : C.line}`, borderRadius: 6, padding: 4, marginBottom: 16 }}>
          <textarea value={words} onChange={(e) => { setWords(e.target.value); setError(""); }}
            placeholder="hive honey sting wing queen swarm nectar wax hum whisper shadow chamber"
            rows={4}
            style={{ width: "100%", background: "transparent", border: "none", resize: "none", color: C.text, fontSize: 15, fontFamily: FACE_MONO, lineHeight: 1.8, padding: "12px 14px", outline: "none" }} />
        </div>
      )}

      {error && <div style={{ color: C.danger, fontSize: 13, marginBottom: 12 }}>{error}</div>}

      <button onClick={handleSubmit} style={{ width: "100%", padding: 15, borderRadius: 4, fontSize: 13, ...ENGRAVE, letterSpacing: "0.12em", background: C.text, color: C.bg, border: "none" }}>
        {mode === "words" ? t(lang, "Restore Pro") : t(lang, "Log in")}
      </button>
    </div>
  );
}
