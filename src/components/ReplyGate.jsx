import { useState } from "react";
import { FACE_MONO, ENGRAVE } from "../lib/theme.js";

export default function ReplyGate({ C, cell, unlockCell }) {
  const [key, setKey] = useState("");
  function submit() {
    if (!/^\d{6}$/.test(key)) return;
    if (unlockCell(cell.id, key)) setKey("");
  }
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, padding: 14 }}>
      <div style={{ fontSize: 13, color: C.text, marginBottom: 4, fontWeight: 600 }}>
        <span style={{ color: C.accent }}>🔒</span> Reply locked
      </div>
      <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10, lineHeight: 1.5 }}>
        To write to <span style={{ fontFamily: FACE_MONO, color: C.text }}>{cell.peerName || cell.peer}</span> you need their 6-digit message key — just like they needed yours to reach you.
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={key} onChange={(e) => setKey(e.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={(e) => e.key === "Enter" && submit()} inputMode="numeric" placeholder="Their 6-digit key" style={{ flex: 1, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 4, padding: "12px 16px", color: C.text, fontSize: 15, fontFamily: FACE_MONO, letterSpacing: "0.2em", outline: "none" }} />
        <button onClick={submit} style={{ background: C.text, color: C.bg, borderRadius: 4, padding: "0 20px", ...ENGRAVE, letterSpacing: "0.08em", fontSize: 12 }}>Unlock</button>
      </div>
    </div>
  );
}
