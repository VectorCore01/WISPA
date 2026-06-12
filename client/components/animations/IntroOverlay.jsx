import { useEffect } from "react";
import WaspLock from "../ui/WaspLock.jsx";
import { FACE_UI, FACE_MONO, ENGRAVE } from "../../lib/theme.js";

// Plays once after creating a WISP or logging in, then fades into the app.
// create → honeycomb cells bloom around the logo.
// login  → the logo flies home into a glowing hive.
export default function IntroOverlay({ C, variant, name, onDone }) {
  const isCreate = variant === "create";
  const dur = isCreate ? 2000 : 1700;

  useEffect(() => {
    const id = setTimeout(onDone, dur);
    return () => clearTimeout(id);
  }, [onDone, dur]);

  // six hexagons in a ring + one behind the logo
  const ring = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return { x: 110 + 52 * Math.cos(a), y: 110 + 52 * Math.sin(a), i };
  });
  const cells = [{ x: 110, y: 110, i: -1 }, ...ring];

  const hex = (c) => {
    const anim = isCreate
      ? `cellPop 0.5s cubic-bezier(.2,.8,.2,1) both ${0.06 * (c.i + 1)}s`
      : `cellGlow 1.2s ease-in-out both ${0.04 * (c.i + 1)}s`;
    return (
      <svg key={c.i} viewBox="0 0 100 100" width="60" height="60"
        style={{ position: "absolute", left: c.x - 30, top: c.y - 30, animation: anim }}>
        <polygon points="50,6 88,28 88,72 50,94 12,72 12,28"
          fill={c.i === -1 ? C.surface : "none"} stroke={C.accent} strokeWidth="2.5"
          opacity={c.i === -1 ? 1 : 0.55} />
      </svg>
    );
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      animation: `introVeil ${dur}ms ease forwards`,
    }}>
      <div style={{ position: "relative", width: 220, height: 220 }}>
        {cells.map(hex)}
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          animation: isCreate ? "logoIn 0.6s cubic-bezier(.2,.8,.2,1) both 0.5s" : "flyHome 0.8s cubic-bezier(.2,.8,.2,1) both 0.1s",
        }}>
          <WaspLock size={92} C={C} />
        </div>
      </div>

      <div style={{
        fontFamily: FACE_UI, fontSize: 24, fontWeight: 700, color: C.text,
        ...ENGRAVE, letterSpacing: "0.16em", marginTop: 8,
        animation: `introRise 0.5s ease both ${isCreate ? "0.95s" : "0.6s"}`,
      }}>
        {isCreate ? "WISP created" : "Welcome back"}
      </div>
      {name && (
        <div style={{
          fontFamily: FACE_MONO, fontSize: 14, color: C.accent, marginTop: 6,
          animation: `introRise 0.5s ease both ${isCreate ? "1.1s" : "0.75s"}`,
        }}>
          {name}
        </div>
      )}

      <style>{`
        @keyframes cellPop { 0% { opacity: 0; transform: scale(.2); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes cellGlow { 0% { opacity: .15; } 50% { opacity: 1; } 100% { opacity: .55; } }
        @keyframes logoIn { 0% { opacity: 0; transform: translate(-50%, -50%) scale(.5); } 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes flyHome { 0% { opacity: 0; transform: translate(-50%, calc(-50% + 60px)) scale(.85); } 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes introRise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes introVeil { 0% { opacity: 1; } 82% { opacity: 1; } 100% { opacity: 0; } }
      `}</style>
    </div>
  );
}
