import { useState } from "react";
import { CellLogo } from "../app/shared.jsx";
import { FACE_UI, FACE_MONO, ENGRAVE } from "../../lib/theme.js";
import { t } from "../../lib/data/translations.js";

export default function Onboard({ C, lang, seed, confirmed, setConfirmed, onFinish, onBack }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={onBack} style={{ background: "transparent", color: C.textDim, fontSize: 13, marginBottom: 20 }}>← {t(lang, "Back")}</button>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <CellLogo size={56} C={C} />
        <h2 style={{ fontFamily: FACE_UI, fontSize: 30, fontWeight: 700, ...ENGRAVE, letterSpacing: "0.14em", margin: "14px 0 6px" }}>{t(lang, "Your 12 words")}</h2>
        <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.6 }}>
          {t(lang, "These words are your only way back. There's no name, email or phone tied to your WISP — so if you lose these, no one can recover it. Keep them offline.")}
        </p>
      </div>

      <div style={{ position: "relative", marginBottom: 22 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, filter: revealed ? "none" : "blur(7px)", transition: "filter .2s", userSelect: revealed ? "auto" : "none" }}>
          {seed.map((w, i) => (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, padding: "10px 12px", fontSize: 14, fontFamily: FACE_MONO }}>
              <span style={{ color: C.textDim, marginRight: 8 }}>{i + 1}</span>{w}
            </div>
          ))}
        </div>
        {!revealed && (
          <button onClick={() => setRevealed(true)} style={{ position: "absolute", inset: 0, margin: "auto", width: 200, height: 46, background: C.text, color: C.bg, borderRadius: 4, ...ENGRAVE, letterSpacing: "0.1em", fontSize: 12 }}>{t(lang, "Reveal")}</button>
        )}
      </div>

      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer", padding: "14px 16px", background: C.surface, borderRadius: 6, border: `1px solid ${C.line}`, marginBottom: 18 }}>
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18, accentColor: C.accent }} />
        <span style={{ fontSize: 14, lineHeight: 1.5 }}>{t(lang, "I have safely written down my 12 words and understand they cannot be recovered.")}</span>
      </label>

      <button disabled={!confirmed || !revealed} onClick={onFinish} style={{ width: "100%", padding: 15, borderRadius: 4, fontSize: 13, ...ENGRAVE, letterSpacing: "0.12em", background: confirmed && revealed ? C.text : C.surface2, color: confirmed && revealed ? C.bg : C.textDim, cursor: confirmed && revealed ? "pointer" : "not-allowed", border: `1px solid ${C.line}` }}>
        {t(lang, "Create my WISP")}
      </button>
    </div>
  );
}
