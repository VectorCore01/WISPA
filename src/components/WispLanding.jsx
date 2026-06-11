import { useState } from "react";
import WaspLock from "./WaspLock.jsx";
import { FACE_MONO } from "../lib/theme.js";

export default function WispLanding({ C, onStart, onLight }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
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
      userSelect: "none",
      position: "relative",
      overflow: "hidden",
    }} onClick={handleClick}>
      <div style={{
        animation: clicked ? "logoPop 0.3s ease forwards" : "drift 7s ease-in-out infinite",
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
          100% { opacity: 0; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
