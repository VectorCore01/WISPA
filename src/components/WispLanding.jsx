import { useState } from "react";
import WaspLock from "./WaspLock.jsx";
import { FACE_MONO } from "../lib/theme.js";

export default function WispLanding({ C, onStart, onLight }) {
  const [anim, setAnim] = useState("idle");

  const handleClick = () => {
    if (anim !== "idle") return;
    setAnim("expand");
    setTimeout(() => setAnim("flash"), 380);
    setTimeout(() => setAnim("out"), 500);
    setTimeout(() => onStart(), 820);
  };

  const burstParticles = anim === "expand" ? Array.from({ length: 20 }).map((_, i) => {
    const angle = (i / 20) * 360 + Math.random() * 20;
    const dist = 80 + Math.random() * 160;
    return {
      dx: Math.cos((angle * Math.PI) / 180) * dist,
      dy: Math.sin((angle * Math.PI) / 180) * dist,
      size: 4 + Math.random() * 9,
      delay: Math.random() * 0.08,
      dur: 0.3 + Math.random() * 0.15,
    };
  }) : [];

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
      background: anim === "flash" ? C.accent : C.bg,
      transition: "background 0.08s",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      userSelect: "none",
    }} onClick={anim === "idle" ? handleClick : undefined}>
      <div style={{
        position: "relative",
        animation: anim === "idle" ? "drift 7s ease-in-out infinite" : "none",
        transform:
          anim === "expand" ? "scale(3.2)" :
          anim === "out" ? "scale(5) rotate(12deg)" :
          "scale(1)",
        opacity: anim === "out" ? 0 : 1,
        filter: anim === "expand" ? "brightness(1.6) blur(0.5px)" : "none",
        transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.16s, filter 0.2s",
        zIndex: 2,
      }}>
        <WaspLock size={144} C={C} />
      </div>

      {anim === "idle" && (
        [...Array(20)].map((_, i) => {
          const angle = (i / 20) * 360;
          const dist = 30 + Math.random() * 50;
          const size = 3 + Math.random() * 4;
          const dx = Math.cos((angle * Math.PI) / 180) * dist;
          const dy = Math.sin((angle * Math.PI) / 180) * dist;
          return (
            <div key={i} style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              width: size,
              height: size * 1.15,
              background: C.textDim,
              opacity: 0.06,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)`,
              "--dx": `${dx}px`,
              "--dy": `${dy}px`,
              animation: `pulseRing ${3 + Math.random() * 2}s ease-in-out ${Math.random()}s infinite`,
              pointerEvents: "none",
              zIndex: 1,
            }} />
          );
        })
      )}

      {anim === "expand" && burstParticles.map((p, i) => (
        <div key={i} style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          width: p.size,
          height: p.size * 1.15,
          background: C.accent,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          transform: "translate(-50%, -50%) scale(0.3)",
          animation: `burst ${p.dur}s ease-out ${p.delay}s forwards`,
          "--dx": `${p.dx}px`,
          "--dy": `${p.dy}px`,
          pointerEvents: "none",
          zIndex: 1,
        }} />
      ))}

      <button
        onClick={(e) => { e.stopPropagation(); onLight(); }}
        style={{
          marginTop: 40,
          background: "transparent",
          border: "none",
          color: anim === "flash" ? C.bg : C.textDim,
          fontSize: 12,
          cursor: "pointer",
          fontFamily: FACE_MONO,
          position: "relative",
          zIndex: 3,
          padding: "6px 14px",
          borderRadius: 4,
          opacity: anim === "out" ? 0 : 1,
          transition: "opacity 0.2s, color 0.3s, background 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = anim === "flash" ? C.bg : C.textDim; }}
      >
        ☀ Light
      </button>

      <style>{`
        @keyframes drift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseRing {
          0%, 100% { opacity: 0.04; transform: translate(-50%, -50%) translate(var(--dx, 0px), var(--dy, 0px)) scale(0.8); }
          50% { opacity: 0.14; transform: translate(-50%, -50%) translate(var(--dx, 0px), var(--dy, 0px)) scale(1.3); }
        }
        @keyframes burst {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0.3); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(2.2); }
        }
      `}</style>
    </div>
  );
}
