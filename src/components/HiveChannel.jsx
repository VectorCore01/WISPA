import { useState, useRef } from "react";
import { FACE_MONO, ENGRAVE } from "../lib/theme.js";
import { attachKindOf } from "../lib/helpers.js";
import Attachment from "./Attachment.jsx";
import { TermHead, Panel } from "./shared.jsx";

export default function HiveChannel({ C, isPro, hiveId, hiveCfg, hivePosts, postToHive, hiveMembers, approveMember, rejectMember, destroyHive, notify }) {
  const [draft, setDraft] = useState("");
  const [opened, setOpened] = useState({});
  const fileRef = useRef(null);

  function post() {
    if (!draft.trim()) return;
    postToHive({ text: draft.trim() });
    setDraft("");
  }

  function onPickFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    postToHive({ kind: attachKindOf(file), name: file.name, size: file.size, url: URL.createObjectURL(file) });
    if (notify) notify(`Posted "${file.name}" — sealed until a member opens it.`);
  }

  const pending = hiveMembers.filter((m) => m.status === "pending");
  const approved = hiveMembers.filter((m) => m.status === "approved");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <TermHead C={C} mb={4}>{hiveCfg.name}</TermHead>
          <div style={{ fontFamily: FACE_MONO, fontSize: 13, color: C.textDim }}>{hiveId} · {approved.length} member{approved.length === 1 ? "" : "s"}</div>
          <div style={{ fontFamily: FACE_MONO, fontSize: 13, color: C.accent, marginTop: 4 }}>Hive-Key: {hiveCfg.key}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <span style={{ fontSize: 11, color: C.accent, ...ENGRAVE, letterSpacing: "0.1em" }}>live</span>
          <button onClick={() => { if (window.confirm("Destroy Hive? All posts and members will be lost.")) destroyHive(); }} style={{ background: "transparent", color: C.danger, fontSize: 11, border: `1px solid ${C.line}`, borderRadius: 4, padding: "6px 12px", ...ENGRAVE, letterSpacing: "0.06em" }}>Destroy Hive</button>
        </div>
      </div>

      {pending.length > 0 && (
        <Panel C={C} style={{ padding: 16, marginBottom: 16, borderColor: C.accent }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
            <span style={{ color: C.accent }}>!</span> {pending.length} join request{pending.length === 1 ? "" : "s"} — approve who gets in
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {pending.map((m) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 4, padding: "10px 12px" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: FACE_MONO, fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontFamily: FACE_MONO, fontSize: 11, color: C.textDim }}>{m.id}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => approveMember(m.id)} style={{ background: C.text, color: C.bg, borderRadius: 4, padding: "8px 14px", ...ENGRAVE, letterSpacing: "0.06em", fontSize: 11 }}>Approve</button>
                  <button onClick={() => rejectMember(m.id)} style={{ background: "transparent", color: C.danger, border: `1px solid ${C.line}`, borderRadius: 4, padding: "8px 12px", fontSize: 11 }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <input ref={fileRef} type="file" onChange={onPickFile} style={{ display: "none" }} />
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && post()} placeholder="Post to your channel…" style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, padding: "12px 18px", color: C.text, fontSize: 15 }} />
        <button onClick={post} style={{ background: C.text, color: C.bg, borderRadius: 4, padding: "0 20px", ...ENGRAVE, letterSpacing: "0.08em", fontSize: 12 }}>Post</button>
      </div>
      <button onClick={() => fileRef.current && fileRef.current.click()} style={{ width: "100%", background: C.surface, border: `1px dashed ${C.line}`, borderRadius: 4, padding: "11px 14px", color: C.text, fontSize: 13, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ color: C.accent }}>↑</span> Attach a file, photo or video — members can download it
      </button>

      <div style={{ display: "grid", gap: 10 }}>
        {hivePosts.length === 0 && (
          <div style={{ color: C.textDim, fontSize: 14, textAlign: "center", marginTop: 30 }}>No posts yet. Everything you post here stays — your channel history is never deleted.</div>
        )}
        {[...hivePosts].reverse().map((p) => (
          <Panel key={p.id} C={C} style={{ padding: "14px 16px" }}>
            {p.url ? (
              <Attachment C={C} post={p} isPro={isPro} opened={!!opened[p.id]} onOpen={() => setOpened((o) => ({ ...o, [p.id]: true }))} />
            ) : (
              <div style={{ fontSize: 15, lineHeight: 1.4 }}>{p.text}</div>
            )}
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 8, fontFamily: FACE_MONO, display: "flex", justifyContent: "space-between" }}>
              <span>{p.time}</span>
              <span>{approved.length} member{approved.length === 1 ? "" : "s"}</span>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
