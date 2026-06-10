import { useState } from "react";
import WaspLock from "./WaspLock.jsx";
import { FACE_MONO } from "../lib/theme.js";
import { LANG_NAMES, LANG_LIST, t } from "../lib/translations.js";

export default function EntryChoice({ C, lang, setLang, onCreate, onLogin, onBack }) {
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
    }}>
      <button onClick={onBack} style={{ position: "fixed", top: 22, left: 22, background: "transparent", color: C.textDim, fontSize: 13 }}>← {t(lang, "Back")}</button>

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

      <WaspLock size={72} C={C} />
      <div style={{ fontSize: 13, color: C.textDim, marginTop: 20, marginBottom: 36 }}>{t(lang, "say it once. then it's gone.")}</div>

      <button onClick={onCreate} style={{
        width: 280, background: "transparent", color: C.accent,
        border: `1px solid ${C.accent}`, borderRadius: 4,
        padding: "15px 0", fontSize: 13, fontWeight: 700,
        letterSpacing: "0.3em", marginBottom: 14,
      }}>
        {t(lang, "Create my WISP")}
      </button>

      <button onClick={onLogin} style={{
        width: 280, background: C.text, color: C.bg, borderRadius: 4,
        padding: "15px 0", fontSize: 13, fontWeight: 700,
        letterSpacing: "0.3em",
      }}>
        {t(lang, "Log in")}
      </button>
    </div>
  );
}
