import { useState } from "react";
import { CalcButton } from "./shared.jsx";
import { FACE_MONO } from "../lib/theme.js";
import { LANG_NAMES, LANG_LIST, t } from "../lib/translations.js";

export default function EntryChoice({ C, mode, toggleMode, lang, setLang, onCreate, onLogin, onBack, onCalc }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px",
      fontFamily: FACE_MONO,
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <button onClick={onBack} style={{ position: "fixed", top: 22, left: 22, background: "transparent", color: C.textDim, fontSize: 13 }}>← {t(lang, "Back")}</button>
      <CalcButton C={C} onClick={onCalc} style={{ top: 56, left: 22, right: "auto" }} />
      <button onClick={toggleMode} aria-label="Toggle theme" style={{ position: "fixed", top: 56, right: 22, zIndex: 20, width: 36, height: 36, borderRadius: 8, background: C.surface, border: `1px solid ${C.line}`, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer" }}>{mode === "dark" ? "☀" : "☾"}</button>

      <div style={{ position: "fixed", top: 22, right: 22 }}>
        <button onClick={() => setOpen(!open)}
          style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, padding: "6px 12px", color: C.text, fontSize: 12 }}>
          {LANG_NAMES[lang]}
        </button>
        {open && (
          <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, zIndex: 20, maxHeight: 240, overflowY: "auto" }}>
            {LANG_LIST.map((code) => (
              <button key={code} onClick={() => { setLang(code); setOpen(false); }}
                style={{ display: "block", width: "100%", background: code === lang ? C.surface2 : "transparent", border: "none", padding: "8px 16px", color: C.text, fontSize: 12, textAlign: "left" }}>
                {LANG_NAMES[code]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: 420, height: 420, borderRadius: "50%", transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${C.accent}22 0%, transparent 65%)`,
        pointerEvents: "none", animation: "ecGlow 0.9s ease both",
      }} />

      <div style={{
        position: "relative",
        fontSize: 48, fontWeight: 700, letterSpacing: "0.16em",
        color: C.accent, fontFamily: FACE_MONO, marginBottom: 8,
        animation: "ecHex 0.55s cubic-bezier(.2,.8,.2,1) both",
      }}>WISPA</div>
      <div style={{ position: "relative", fontSize: 13, color: C.textDim, marginBottom: 36, animation: "ecRise 0.5s ease both 0.14s" }}>{t(lang, "say it once. then it's gone.")}</div>

      <button onClick={onCreate} style={{
        position: "relative",
        width: 280, background: "transparent", color: C.accent,
        border: `1px solid ${C.accent}`, borderRadius: 4,
        padding: "15px 0", fontSize: 13, fontWeight: 700,
        letterSpacing: "0.3em", marginBottom: 14,
        animation: "ecRise 0.5s ease both 0.26s",
      }}>
        {t(lang, "Create a Wisp")}
      </button>

      <button onClick={onLogin} style={{
        position: "relative",
        width: 280, background: C.text, color: C.bg, borderRadius: 4,
        padding: "15px 0", fontSize: 13, fontWeight: 700,
        letterSpacing: "0.3em",
        animation: "ecRise 0.5s ease both 0.36s",
      }}>
        {t(lang, "Log in")}
      </button>

      <div style={{ position: "relative", fontSize: 11, color: C.textDim, marginTop: 18, maxWidth: 280, lineHeight: 1.6, animation: "ecRise 0.5s ease both 0.46s" }}>
        {t(lang, "Create a Wisp. Log in if you already have one.")}
      </div>

      <style>{`
        @keyframes ecRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ecHex { 0% { opacity: 0; transform: scale(.6); } 60% { opacity: 1; transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes ecGlow { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
