// Honeycomb burst that plays over the calculator→WISPA transition on a correct
// code. Relies on the global `hexBurst` / `hexPop` keyframes defined in the app
// shell. Purely decorative, so it ignores pointer events.
export default function HexBurst({ C }) {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, pointerEvents: "none", background: `radial-gradient(circle at center, ${C.accent}14, transparent 60%)` }}>
      {[0, 0.12, 0.24].map((d, i) => (
        <svg key={i} viewBox="0 0 100 100" width="220" height="220" style={{ position: "absolute", animation: `hexBurst .66s ease-out ${d}s forwards`, opacity: 0 }}>
          <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill="none" stroke={C.accent} strokeWidth="2.5" />
        </svg>
      ))}
      <svg viewBox="0 0 100 100" width="120" height="120" style={{ position: "absolute", animation: "spin360 1s linear infinite" }}>
        <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="none" stroke={C.accent} strokeWidth="3" strokeDasharray="38 200" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 24 24" width="64" height="64" fill={C.accent + "22"} stroke={C.accent} strokeWidth="1.8" strokeLinejoin="round" style={{ animation: "hexPop .5s ease-out forwards" }}>
        <polygon points="12,2.5 20,7 20,17 12,21.5 4,17 4,7" />
      </svg>
    </div>
  );
}
