import WaspLock from "./WaspLock.jsx";
import { FACE_MONO } from "../lib/theme.js";
import { t } from "../lib/translations.js";

export default function Landing({ C, lang, onStart }) {
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
      <div style={{ animation: "drift 7s ease-in-out infinite" }}>
        <WaspLock size={108} C={C} />
      </div>

      <div style={{
        fontSize: 13,
        color: C.textDim,
        marginTop: 26,
        letterSpacing: "0.04em",
      }}>
        {t(lang, "say it once. then it's gone.")}
      </div>

      <button
        onClick={onStart}
        style={{
          marginTop: 40,
          background: "transparent",
          color: C.accent,
          border: `1px solid ${C.accent}`,
          padding: "13px 40px",
          borderRadius: 4,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.3em",
          paddingLeft: "calc(40px + 0.3em)",
        }}
      >
        {t(lang, "ENTER")}
      </button>

      <div style={{
        position: "fixed",
        bottom: 22,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 10.5,
        color: C.textDim,
        letterSpacing: "0.04em",
        lineHeight: 1.8,
      }}>
        <div>xchacha20-poly1305 · x25519 · zero-knowledge</div>
        <div style={{ opacity: 0.6, marginTop: 2 }}>
          no logs · no metadata · no accounts
          <span style={{ color: C.accent, animation: "blink 1.1s step-end infinite" }}>_</span>
        </div>
      </div>
    </div>
  );
}
