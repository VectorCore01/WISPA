import { FACE_MONO, ENGRAVE, HONEY } from "../lib/theme.js";
import { TermHead, Panel } from "./shared.jsx";

// Placeholder for now — Swarm = group chats where every member pays Honey.
// The full build comes next; this lays out the idea and the cost.
export default function SwarmTab({ C }) {
  return (
    <div>
      <TermHead C={C} mb={18}>swarm</TermHead>

      <Panel C={C} style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
            <circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" />
            <path d="M3 19c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" />
            <path d="M13 19c0-2.8 2.2-4.5 5-4.5 1 0 2 .2 2.8.7" />
          </svg>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Group chats</div>
        </div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.6 }}>
          Swarms are private group chats. Every WISP member pays{" "}
          <span style={{ color: C.accent, fontWeight: 700 }}>{HONEY.swarmJoin} Honey</span> to join — keeping rooms small and intentional.
        </p>
      </Panel>

      <Panel C={C} style={{ padding: 18, textAlign: "center" }}>
        <div style={{ fontFamily: FACE_MONO, fontSize: 12, color: C.textDim, ...ENGRAVE, letterSpacing: "0.18em" }}>coming next</div>
      </Panel>
    </div>
  );
}
