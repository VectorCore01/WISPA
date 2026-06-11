import { useState, useRef } from "react";
import { FACE_MONO, ENGRAVE } from "../lib/theme.js";
import { attachKindOf } from "../lib/helpers.js";
import Attachment from "./Attachment.jsx";
import ReplyGate from "./ReplyGate.jsx";

export default function CellChat({ C, cell, onBack, sendInCell, openCellAttachment, unlockCell, isPro, setTab, notify }) {
  const [draft, setDraft] = useState("");
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);
  const scrollRef = useRef(null);

  const msgs = cell.messages || [];
  const full = msgs.length >= 4;

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
        <div style={{ fontSize: 12, fontFamily: FACE_MONO, color: C.textDim }}>
          {full ? "4/4 · full" : `${msgs.length}/4`}
        </div>
      </div>

      <div ref={scrollRef} style={{ minHeight: 300, display: "flex", flexDirection: "column", gap: 10, marginBottom: 14, overflowY: "auto", padding: "4px 0" }}>
        {msgs.length === 0 && (
          <div style={{ color: C.textDim, fontSize: 14, textAlign: "center", marginTop: 120 }}>Empty cell. Send a message to start.</div>
        )}
        {full && msgs.length > 0 && (
          <div style={{ fontSize: 11, color: C.textDim, textAlign: "center", fontFamily: FACE_MONO, padding: "4px 0" }}>
            ⛛ oldest messages dropped · rolling window of 4
          </div>
        )}
        {msgs.map((msg) => {
          const isAttachment = msg.kind === "image" || msg.kind === "video" || msg.kind === "file";
          const isMine = msg.from === "me";
          return (
            <div key={msg.id} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start" }}>
              {isAttachment ? (
                <div style={{ maxWidth: "80%", padding: 10, borderRadius: 8, background: C.surface, border: `1px solid ${C.line}` }}>
                  <Attachment C={C} post={msg} isPro={isPro} opened={!!msg.opened} onOpen={() => openCellAttachment(cell.id, msg.id)} />
                  {isPro && msg.opened && (
                    <div style={{ marginTop: 6, fontSize: 11, color: C.textDim, fontFamily: FACE_MONO }}>● download enabled (Pro)</div>
                  )}
                </div>
              ) : (
                <div style={{ maxWidth: "80%", padding: "16px 18px", borderRadius: 8, background: isMine ? C.text : C.surface, color: isMine ? C.bg : C.text, border: isMine ? "none" : `1px solid ${C.line}`, fontSize: 17, lineHeight: 1.45 }}>
                  {msg.text}
                </div>
              )}
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 6, fontFamily: FACE_MONO }}>
                {msg.from === "me" ? "you" : "them"} · {msg.time}
              </div>
            </div>
          );
        })}
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
