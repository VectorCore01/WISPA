import { useState } from "react";
import { FACE_MONO, ENGRAVE } from "../lib/theme.js";
import { TermHead, Panel } from "./shared.jsx";
import CellChat from "./CellChat.jsx";

export default function CellsTab(props) {
  const { C, cells, activeCell, setActiveCell, openCell, startNewCell, notify, hasHive, setTab } = props;
  const [newPeer, setNewPeer] = useState("");
  const [newKey, setNewKey] = useState("");

  if (activeCell) {
    const cell = cells.find((c) => c.id === activeCell);
    if (cell) return <CellChat {...props} cell={cell} onBack={() => setActiveCell(null)} />;
  }

  function start() {
    const v = newPeer.trim().toUpperCase();
    if (!/^WISP-\d{6}$/.test(v)) return notify("Enter a WISP id like WISP-204913.");
    if (!/^\d{6}$/.test(newKey.trim())) return notify("Enter their 6-digit message key.");
    const ok = startNewCell(v, newKey.trim());
    if (ok) { setNewPeer(""); setNewKey(""); }
  }

  return (
    <div>
      <TermHead C={C} mb={4}>cells</TermHead>
      <p style={{ color: C.textDim, fontSize: 14, marginBottom: 14 }}>
        {hasHive
          ? "WISP Pro — send videos and files. Each cell shows the latest 4 messages (2 per person)."
          : "Free WISP — messages and images only. Each cell shows the latest 4 messages (2 per person)."}
      </p>

      <Panel C={C} style={{ padding: 8, marginBottom: 18 }}>
        <input value={newPeer} onChange={(e) => setNewPeer(e.target.value)} onKeyDown={(e) => e.key === "Enter" && start()} placeholder="Their WISP id — WISP-000000" style={{ width: "100%", background: "transparent", border: "none", outline: "none", borderBottom: `1px solid ${C.line}`, borderRadius: 0, padding: "10px 8px", color: C.text, fontSize: 14, fontFamily: FACE_MONO }} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input value={newKey} onChange={(e) => setNewKey(e.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={(e) => e.key === "Enter" && start()} inputMode="numeric" placeholder="Their message key — 6 digits" style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "10px 8px", color: C.text, fontSize: 14, fontFamily: FACE_MONO, letterSpacing: "0.2em" }} />
          <button onClick={start} style={{ background: C.text, color: C.bg, borderRadius: 4, padding: "0 18px", ...ENGRAVE, letterSpacing: "0.08em", fontSize: 12 }}>Open</button>
        </div>
        <div style={{ fontSize: 11, color: C.textDim, padding: "4px 8px 2px" }}>You need both their WISP id and their 6-digit message key.</div>
      </Panel>

      <div style={{ display: "grid", gap: 10 }}>
        {cells.map((cell) => {
          const latest = cell.messages.length > 0 ? cell.messages[cell.messages.length - 1] : null;
          const unread = latest && latest.from === "them" && !cell.seen;
          let preview;
          if (!latest) preview = "empty cell";
          else if (cell.messages.length === 4) preview = "cell full · 4 messages";
          else preview = `${cell.messages.length}/4 messages`;
          return (
            <button key={cell.id} onClick={() => openCell(cell.id)} style={{ textAlign: "left", background: C.surface, border: `1px solid ${unread ? C.accent : C.line}`, borderRadius: 6, padding: "14px 16px", color: C.text, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: FACE_MONO, fontWeight: 700, fontSize: 15 }}>{cell.peerName || cell.peer}</div>
                <div style={{ fontSize: 13, color: unread ? C.accent : C.textDim, fontWeight: unread ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: FACE_MONO, opacity: 0.7 }}>{cell.peer}</span> · {preview}
                </div>
              </div>
              <span style={{ flexShrink: 0, fontFamily: FACE_MONO, fontSize: 12, color: C.textDim }}>
                {hasHive ? "pro" : "free"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
