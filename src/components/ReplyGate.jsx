import { useState } from "react";
import { FACE_MONO, ENGRAVE } from "../lib/theme.js";

// After the first contact, a chat is opened with your own PIN — the access code
// you entered on the calculator. Not the peer's message key.
export default function ReplyGate({ C, cell, unlockCell }) {
  const [pin, setPin] = useState("");
  function submit() {
    if (!pin) return;
    if (unlockCell(cell.id, pin)) setPin("");
  }
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, padding: 14 }}>
      <div style={{ fontSize: 13, color: C.text, marginBottom: 4, fontWeight: 600 }}>
        <span style={{ color: C.accent }}>🔒</span> Locked
      </div>
      <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10, lineHeight: 1.5 }}>
        Open your chat with <span style={{ fontFamily: FACE_MONO, color: C.text }}>{cell.peerName || cell.peer}</span> using your PIN — the code you entered on the calculator.
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))} onKeyDown={(e) => e.key === "Enter" && submit()} type="password" inputMode="numeric" placeholder="Your PIN" style={{ flex: 1, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 4, padding: "12px 16px", color: C.text, fontSize: 15, fontFamily: FACE_MONO, letterSpacing: "0.3em", outline: "none" }} />
        <button onClick={submit} style={{ background: C.text, color: C.bg, borderRadius: 4, padding: "0 20px", ...ENGRAVE, letterSpacing: "0.08em", fontSize: 12 }}>Open</button>
      </div>
    </div>
  );
}
