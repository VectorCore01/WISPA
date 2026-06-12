import { useState } from "react";
import WaspLock from "./WaspLock.jsx";
import { FACE_MONO } from "../lib/theme.js";

export default function WispLanding({ C, onStart, onLight }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    setTimeout(() => onStart(), 460);
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
      userSelect: "none",
      position: "relative",
      overflow: "hidden",
    }}>
      {clicked && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {[0, 0.09, 0.18].map((d, i) => (
            <svg key={i} viewBox="0 0 100 100" width="160" height="160"
              style={{ position: "absolute", animation: `hexRipple 0.55s ease-out ${d}s forwards`, opacity: 0 }}>
              <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill="none" stroke={C.accent} strokeWidth="2.5" />
            </svg>
          ))}
        </div>
      )}

      <div
        onClick={handleClick}
        role="button"
        aria-label="Enter WISPA"
        title="Tap the mark to enter"
        style={{
          cursor: "pointer",
          animation: clicked ? "logoPop 0.45s cubic-bezier(.4,0,.6,1) forwards" : "drift 7s ease-in-out infinite",
          opacity: clicked ? 0 : 1,
          pointerEvents: clicked ? "none" : "auto",
        }}>
        <WaspLock size={144} C={C} />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onLight(); }}
        style={{
          marginTop: 40,
          background: "transparent",
          border: "none",
          color: C.textDim,
          fontSize: 12,
          cursor: "pointer",
          fontFamily: FACE_MONO,
          padding: "6px 14px",
          borderRadius: 4,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textDim; }}
      >
        ☀ Light
      </button>

      <style>{`
        @keyframes drift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes logoPop {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.3); }
        }
        @keyframes hexRipple {
          0% { opacity: 0.5; transform: scale(0.7); }
          100% { opacity: 0; transform: scale(3.4); }
        }
      `}</style>
    </div>
  );
}
