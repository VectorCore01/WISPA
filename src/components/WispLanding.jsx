import { useState } from "react";
import WaspLock from "./WaspLock.jsx";
import { FACE_MONO } from "../lib/theme.js";
import { t } from "../lib/translations.js";

export default function WispLanding({ C, lang, onStart, onLight }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => onStart(), 300);
  };

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
      cursor: "pointer",
    }}>
      <div
        onClick={handleClick}
        style={{
          animation: clicked ? "logoPop 0.3s ease forwards" : "drift 7s ease-in-out infinite",
          opacity: clicked ? 0 : 1,
          transform: clicked ? "scale(1.4)" : "none",
          transition: "opacity 0.3s, transform 0.3s",
        }}
      >
        <WaspLock size={160} C={C} />
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
        onClick={onLight}
        style={{
          marginTop: 32,
          background: "transparent",
          border: "none",
          color: C.textDim,
          fontSize: 12,
          cursor: "pointer",
          fontFamily: FACE_MONO,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        ☀ Light
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

      <style>{`
        @keyframes logoPop {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}
