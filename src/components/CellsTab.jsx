import { useState, useRef } from "react";
import { FACE_MONO, ENGRAVE } from "../lib/theme.js";
import { fmtCountdown, attachKindOf } from "../lib/helpers.js";
import Attachment from "./Attachment.jsx";

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
          ? "WISP Pro — your cells are permanent and you can send videos and files."
          : "Free WISP — messages and images only, and each cell self-destructs 1h after the last message."}
      </p>

      {!hasHive && (
        <button onClick={() => setTab("hive")} style={{ width: "100%", textAlign: "left", background: C.surface, border: `1px dashed ${C.accent}`, borderRadius: 6, padding: "11px 14px", color: C.text, fontSize: 13, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span><span style={{ color: C.accent }}>!</span> Cells fade on free WISP — go Pro to keep them forever</span>
          <span style={{ color: C.accent, ...ENGRAVE, letterSpacing: "0.08em", fontSize: 11 }}>Get Pro →</span>
        </button>
      )}

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, padding: 8, marginBottom: 18 }}>
        <input value={newPeer} onChange={(e) => setNewPeer(e.target.value)} onKeyDown={(e) => e.key === "Enter" && start()} placeholder="Their WISP id — WISP-000000" style={{ width: "100%", background: "transparent", border: "none", outline: "none", borderBottom: `1px solid ${C.line}`, borderRadius: 0, padding: "10px 8px", color: C.text, fontSize: 14, fontFamily: FACE_MONO }} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input value={newKey} onChange={(e) => setNewKey(e.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={(e) => e.key === "Enter" && start()} inputMode="numeric" placeholder="Their message key — 6 digits" style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "10px 8px", color: C.text, fontSize: 14, fontFamily: FACE_MONO, letterSpacing: "0.2em" }} />
          <button onClick={start} style={{ background: C.text, color: C.bg, borderRadius: 4, padding: "0 18px", ...ENGRAVE, letterSpacing: "0.08em", fontSize: 12 }}>Open</button>
        </div>
        <div style={{ fontSize: 11, color: C.textDim, padding: "4px 8px 2px" }}>You need both their WISP id and their 6-digit message key.</div>
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
                <div style={{ fontFamily: FACE_MONO, fontWeight: 700, fontSize: 15 }}>{cell.peerName || cell.peer}</div>
                <div style={{ fontSize: 13, color: unread ? C.accent : C.textDim, fontWeight: unread ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: FACE_MONO, opacity: 0.7 }}>{cell.peer}</span> · {preview}
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

function CellChat({ C, cell, onBack, sendInCell, openCellAttachment, unlockCell, hasHive, isPro, setTab, notify, now, lifetime }) {
  const [draft, setDraft] = useState("");
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const left = lifetime - (now - cell.lastActivity);
  const expiring = !hasHive && left < lifetime * 0.3;
  const msg = cell.current;
  const isAttachment = msg && (msg.kind === "image" || msg.kind === "video" || msg.kind === "file");

  function send() {
    if (!draft.trim()) return;
    sendInCell(cell.id, { text: draft.trim() });
    setDraft("");
  }

  function pickAttach(kind) {
    if ((kind === "video" || kind === "file") && !isPro) {
      notify("Video and files need WISP Pro.");
      return;
    }
    const ref = { image: imageRef, video: videoRef, file: fileRef }[kind];
    ref.current && ref.current.click();
  }

  function onFileChosen(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    sendInCell(cell.id, { kind: attachKindOf(file), name: file.name, size: file.size, url: URL.createObjectURL(file) });
  }

  const attachBtn = (kind, label, locked) => (
    <button onClick={() => pickAttach(kind)} title={locked ? "WISP Pro only" : label}
      style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, padding: "0 12px", height: 44, color: locked ? C.textDim : C.text, fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
      {label}{locked && <span style={{ fontSize: 10 }}>🔒</span>}
    </button>
  );

  return (
    <div>
      <button onClick={onBack} style={{ background: "transparent", color: C.textDim, fontSize: 13, marginBottom: 14 }}>← All cells</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: FACE_MONO, fontWeight: 700, fontSize: 17 }}>{cell.peerName || cell.peer}</div>
          <div style={{ fontFamily: FACE_MONO, fontSize: 11, color: C.textDim }}>{cell.peer}</div>
        </div>
        <div style={{ fontSize: 12, fontFamily: FACE_MONO, color: hasHive ? C.textDim : expiring ? C.danger : C.accent }}>
          {hasHive ? "permanent" : `⛬ self-destruct ${fmtCountdown(left)}`}
        </div>
      </div>

      <div style={{ minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
        {!msg && (
          <div style={{ color: C.textDim, fontSize: 14, textAlign: "center" }}>Empty cell. Whisper something — only your last message is ever shown.</div>
        )}
        {msg && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: msg.from === "me" ? "flex-end" : "flex-start" }}>
            {isAttachment ? (
              <div style={{ maxWidth: "80%", padding: 10, borderRadius: 8, background: C.surface, border: `1px solid ${C.line}` }}>
                <Attachment C={C} post={msg} isPro={isPro} opened={!!msg.opened} onOpen={() => openCellAttachment(cell.id)} />
              </div>
            ) : (
              <div style={{ maxWidth: "80%", padding: "16px 18px", borderRadius: 8, background: msg.from === "me" ? C.text : C.surface, color: msg.from === "me" ? C.bg : C.text, border: msg.from === "me" ? "none" : `1px solid ${C.line}`, fontSize: 17, lineHeight: 1.45 }}>
                {msg.text}
              </div>
            )}
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 6, fontFamily: FACE_MONO }}>
              {msg.from === "me" ? "you · waiting for reply" : "from them · reply to clear"} · {msg.time}
            </div>
          </div>
        )}
      </div>

      {cell.authed ? (
        <>
          <input ref={imageRef} type="file" accept="image/*" onChange={onFileChosen} style={{ display: "none" }} />
          <input ref={videoRef} type="file" accept="video/*" onChange={onFileChosen} style={{ display: "none" }} />
          <input ref={fileRef} type="file" onChange={onFileChosen} style={{ display: "none" }} />
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {attachBtn("image", "Photo", false)}
            {attachBtn("video", "Video", !isPro)}
            {attachBtn("file", "File", !isPro)}
            {!isPro && (
              <button onClick={() => setTab("hive")} style={{ marginLeft: "auto", background: "transparent", color: C.accent, fontSize: 11, ...ENGRAVE, letterSpacing: "0.08em" }}>
                Get Pro →
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Whisper a message…" style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, padding: "12px 18px", color: C.text, fontSize: 15 }} />
            <button onClick={send} style={{ background: C.text, color: C.bg, borderRadius: 4, padding: "0 22px", ...ENGRAVE, letterSpacing: "0.1em", fontSize: 12 }}>Send</button>
          </div>
        </>
      ) : (
        <ReplyGate C={C} cell={cell} unlockCell={unlockCell} />
      )}
    </div>
  );
}

// To reply you must enter the peer's 6-digit key — mirrors how they entered
// yours to reach you.
function ReplyGate({ C, cell, unlockCell }) {
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
