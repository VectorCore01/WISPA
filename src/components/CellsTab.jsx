import { useState } from "react";
import { FACE_MONO, ENGRAVE } from "../lib/theme.js";
import { fmtCountdown } from "../lib/helpers.js";

function TermHead({ C, children, mb = 4 }) {
  return (
    <h2 style={{ fontFamily: FACE_MONO, fontSize: 13, color: C.textDim, letterSpacing: "0.08em", marginBottom: mb, fontWeight: 600 }}>
      <span style={{ color: C.accent }}>&gt;</span> {children}
      <span style={{ color: C.accent, animation: "blink 1.1s step-end infinite" }}>_</span>
    </h2>
  );
}

function Panel({ C, children, style }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, ...style }}>{children}</div>;
}

export default function CellsTab(props) {
  const { C, cells, activeCell, setActiveCell, openCell, startNewCell, notify, hasHive, now, lifetime, setTab } = props;
  const [newPeer, setNewPeer] = useState("");

  if (activeCell) {
    const cell = cells.find((c) => c.id === activeCell);
    if (cell) return <CellChat {...props} cell={cell} onBack={() => setActiveCell(null)} />;
  }

  function start() {
    const v = newPeer.trim().toUpperCase();
    if (!/^WISP-\d{6}$/.test(v)) return notify("Enter a WISP id like WISP-204913.");
    startNewCell(v);
    setNewPeer("");
  }

  return (
    <div>
      <TermHead C={C} mb={4}>cells</TermHead>
      <p style={{ color: C.textDim, fontSize: 14, marginBottom: 14 }}>
        {hasHive
          ? "Your Hive keeps these cells alive. Without it, each one self-destructs an hour after the last message."
          : "One message at a time — your reply replaces the last. Cells self-destruct 1h after the last message."}
      </p>

      {!hasHive && (
        <button onClick={() => setTab("hive")} style={{ width: "100%", textAlign: "left", background: C.surface, border: `1px dashed ${C.accent}`, borderRadius: 6, padding: "11px 14px", color: C.text, fontSize: 13, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span><span style={{ color: C.accent }}>!</span> Cells fade 1h after the last message — keep them with Hive</span>
          <span style={{ color: C.accent, ...ENGRAVE, letterSpacing: "0.08em", fontSize: 11 }}>Unlock →</span>
        </button>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <input value={newPeer} onChange={(e) => setNewPeer(e.target.value)} onKeyDown={(e) => e.key === "Enter" && start()} placeholder="Start a cell — WISP-000000" style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, padding: "12px 16px", color: C.text, fontSize: 14, fontFamily: FACE_MONO }} />
        <button onClick={start} style={{ background: C.text, color: C.bg, borderRadius: 4, padding: "0 18px", ...ENGRAVE, letterSpacing: "0.08em", fontSize: 12 }}>Open</button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {cells.map((cell) => {
          const left = lifetime - (now - cell.lastActivity);
          const expiring = !hasHive && left < lifetime * 0.3;
          const unread = cell.current && cell.current.from === "them" && !cell.seen;
          let preview;
          if (!cell.current) preview = "empty cell";
          else if (unread) preview = "● new message";
          else if (cell.current.from === "me") preview = "you · waiting for reply";
          else preview = "opened";
          return (
            <button key={cell.id} onClick={() => openCell(cell.id)} style={{ textAlign: "left", background: C.surface, border: `1px solid ${expiring ? C.danger : unread ? C.accent : C.line}`, borderRadius: 6, padding: "14px 16px", color: C.text, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: FACE_MONO, fontWeight: 700, fontSize: 15 }}>{cell.peer}</div>
                <div style={{ fontSize: 13, color: unread ? C.accent : C.textDim, fontWeight: unread ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {preview}
                </div>
              </div>
              <span style={{ flexShrink: 0, fontFamily: FACE_MONO, fontSize: 12, color: hasHive ? C.textDim : expiring ? C.danger : C.accent }}>
                {hasHive ? "kept" : `⛬ ${fmtCountdown(left)}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CellChat({ C, cell, onBack, sendInCell, hasHive, setTab, notify, now, lifetime }) {
  const [draft, setDraft] = useState("");

  const left = lifetime - (now - cell.lastActivity);
  const expiring = !hasHive && left < lifetime * 0.3;
  const msg = cell.current;

  function send() {
    if (!draft.trim()) return;
    sendInCell(cell.id, draft.trim(), "text");
    setDraft("");
  }

  function attach(kind) {
    if ((kind === "video" || kind === "file") && !hasHive) {
      notify("Video and files need a Hive subscription.");
      return;
    }
    const labels = { image: "Photo", video: "Video", file: "File" };
    sendInCell(cell.id, labels[kind], kind);
  }

  const attachBtn = (kind, label, locked) => (
    <button onClick={() => attach(kind)} title={locked ? "Hive subscribers only" : label}
      style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, padding: "0 12px", height: 44, color: locked ? C.textDim : C.text, fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
      {label}{locked && <span style={{ fontSize: 10 }}>🔒</span>}
    </button>
  );

  const icon = msg && { image: "▣ Photo", video: "▶ Video", file: "▤ File" }[msg.kind];

  return (
    <div>
      <button onClick={onBack} style={{ background: "transparent", color: C.textDim, fontSize: 13, marginBottom: 14 }}>← All cells</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontFamily: FACE_MONO, fontWeight: 700, fontSize: 17 }}>{cell.peer}</div>
        <div style={{ fontSize: 12, fontFamily: FACE_MONO, color: hasHive ? C.textDim : expiring ? C.danger : C.accent }}>
          {hasHive ? "kept by hive" : `⛬ self-destruct ${fmtCountdown(left)}`}
        </div>
      </div>

      <div style={{ minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
        {!msg && (
          <div style={{ color: C.textDim, fontSize: 14, textAlign: "center" }}>Empty cell. Whisper something — only your last message is ever shown.</div>
        )}
        {msg && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: msg.from === "me" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", padding: "16px 18px", borderRadius: 8, background: msg.from === "me" ? C.text : C.surface, color: msg.from === "me" ? C.bg : C.text, border: msg.from === "me" ? "none" : `1px solid ${C.line}`, fontSize: 17, lineHeight: 1.45 }}>
              {icon ? <span style={{ fontFamily: FACE_MONO, fontSize: 14 }}>{icon}</span> : msg.text}
            </div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 6, fontFamily: FACE_MONO }}>
              {msg.from === "me" ? "you · waiting for reply" : "from them · reply to clear"} · {msg.time}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {attachBtn("image", "Photo", false)}
        {attachBtn("video", "Video", !hasHive)}
        {attachBtn("file", "File", !hasHive)}
        {!hasHive && (
          <button onClick={() => setTab("hive")} style={{ marginLeft: "auto", background: "transparent", color: C.accent, fontSize: 11, ...ENGRAVE, letterSpacing: "0.08em" }}>
            Unlock →
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Whisper a message…" style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, padding: "12px 18px", color: C.text, fontSize: 15 }} />
        <button onClick={send} style={{ background: C.text, color: C.bg, borderRadius: 4, padding: "0 22px", ...ENGRAVE, letterSpacing: "0.1em", fontSize: 12 }}>Send</button>
      </div>
    </div>
  );
}
