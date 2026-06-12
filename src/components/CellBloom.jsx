import { honeycombBg } from "../lib/theme.js";

// The calculator→WISPA transition. The plain calculator dissolves under a base
// layer, the cell flies to the centre and grows, and the honeycomb pattern
// blooms outward from the centre until it fills the screen — becoming WISPA.
export default function CellBloom({ C }) {
  const bg = C.calc.page;                 // plain black / white, like the calculator
  const accent = C.accent;
  const pattern = honeycombBg(accent, 0.5);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 70, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        @keyframes cbBase { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cbReveal {
          0% { clip-path: circle(0% at 50% 50%); opacity: 0; }
          12% { opacity: 1; }
          100% { clip-path: circle(150% at 50% 50%); opacity: 1; }
        }
        @keyframes cbCell {
          0%   { opacity: 0; transform: translate(-50%,-170%) scale(.35) rotate(-16deg); }
          32%  { opacity: 1; transform: translate(-50%,-50%) scale(1) rotate(0deg); }
          72%  { opacity: 1; transform: translate(-50%,-50%) scale(1.18); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(1.7); }
        }
      `}</style>

      {/* base colour fades in — the calculator dissolves beneath it */}
      <div style={{ position: "absolute", inset: 0, background: bg, animation: "cbBase .35s ease forwards" }} />

      {/* honeycomb pattern blooms out from the centre, cell after cell */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: bg, backgroundImage: pattern, backgroundSize: "56px 96px", animation: "cbReveal 1.05s ease-out .25s both" }} />

      {/* the cell rises to the centre, grows, then melts into the pattern */}
      <svg viewBox="0 0 24 24" width="140" height="140" style={{ position: "absolute", left: "50%", top: "50%", animation: "cbCell 1.15s ease-out .08s forwards" }} fill={accent + "22"} stroke={accent} strokeWidth="1.4" strokeLinejoin="round">
        <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
        <polygon points="12,7.4 16.4,9.9 16.4,14.9 12,17.4 7.6,14.9 7.6,9.9" fill={accent} stroke="none" />
      </svg>
    </div>
  );
}
