import { useState, useRef } from "react";
import WaspLock from "./WaspLock.jsx";
import { FACE_DISPLAY, FACE_MONO, ENGRAVE, HEX_CLIP, HIVE_PRICE, honeycombBg } from "../lib/theme.js";
import { attachKindOf } from "../lib/helpers.js";
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

export default function HiveTab(props) {
  const { isPro, hiveCfg } = props;
  if (!isPro) return <BecomePro {...props} />;
  if (!hiveCfg) return <CreateHive {...props} />;
  return <HiveChannel {...props} />;
}

// ── For free WISPs: the upgrade offer ────────────────────────────────────────
function BecomePro({ C, startUpgrade }) {
  return (
    <div>
      <TermHead C={C} mb={18}>hive_channel</TermHead>

      <div style={{ position: "relative", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, padding: "30px 24px", marginBottom: 18, textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: honeycombBg(C.lineSoft), backgroundSize: "56px 96px", opacity: 0.5 }} />
        <div style={{ position: "relative" }}>
          <WaspLock size={64} C={C} />
          <div style={{ fontFamily: FACE_DISPLAY, fontSize: 26, fontWeight: 700, ...ENGRAVE, letterSpacing: "0.12em", marginTop: 10 }}>Get WISP Pro</div>
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.6, maxWidth: 360, margin: "10px auto 0" }}>
            A Hive is a channel only WISP Pro can run. Upgrade to unlock it —
            then open your own channel and post anything you like.
          </p>
        </div>
      </div>

      <Panel C={C} style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {["A 24-word key to secure your account", "A fixed Hive id that never changes", "Send videos and files in your cells", "Run a Hive channel with a 6-digit key", "Download attachments from sealed cells"].map((line) => (
            <div key={line} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 14 }}>
              <span style={{ width: 14, height: 16, clipPath: HEX_CLIP, background: C.accent, display: "inline-block", flexShrink: 0 }} />
              {line}
            </div>
          ))}
        </div>
      </Panel>

      <button onClick={startUpgrade} style={{ width: "100%", background: C.text, color: C.bg, padding: 15, borderRadius: 4, ...ENGRAVE, letterSpacing: "0.12em", fontSize: 13 }}>
        Upgrade · €{HIVE_PRICE.toFixed(2)} / month
      </button>
      <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", marginTop: 10 }}>Cancel anytime. Demo — no real charge.</div>
    </div>
  );
}

// ── For WISPs without a channel yet: create it ───────────────────────────────
function CreateHive({ C, hiveId, createHive, notify }) {
  const [name, setName] = useState("");

  function submit() {
    if (name.trim().length < 3) return notify("Give your channel a name (3+ characters).");
    createHive(name);
  }

  const field = { width: "100%", background: C.bg, border: `1px solid ${C.line}`, borderRadius: 4, padding: "12px 14px", color: C.text, fontSize: 15, fontFamily: FACE_MONO, outline: "none", marginBottom: 12 };

  return (
    <div>
      <TermHead C={C} mb={18}>create_hive</TermHead>
      <Panel C={C} style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Open your channel</div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
          Your Hive lives at <span style={{ fontFamily: FACE_MONO, color: C.text }}>{hiveId}</span>. Give it a name — a 6-digit Hive-Key will be generated. Share your WISP id + the 6-digit key so people can request to join.
        </p>
        <label style={{ display: "block", fontSize: 13, color: C.textDim, marginBottom: 6, fontFamily: FACE_MONO }}>Channel name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. night-signal" maxLength={32} style={field} />
        <p style={{ fontSize: 12, color: C.textDim, marginBottom: 12, lineHeight: 1.5 }}>A random 6-digit Hive-Key will be created. Share it with people you want to invite. Nothing happens without the 6-digit key.</p>
        <button onClick={submit} style={{ width: "100%", background: C.text, color: C.bg, padding: 14, borderRadius: 4, ...ENGRAVE, letterSpacing: "0.12em", fontSize: 13 }}>Create channel</button>
      </Panel>
    </div>
  );
}

// ── For WISPs with a live channel ────────────────────────────────────────────
function HiveChannel({ C, isPro, hiveId, hiveCfg, hivePosts, postToHive, hiveMembers, approveMember, rejectMember, destroyHive, notify }) {
  const [draft, setDraft] = useState("");
  const [opened, setOpened] = useState({}); // post id → revealed
  const fileRef = useRef(null);

  function post() {
    if (!draft.trim()) return;
    postToHive({ text: draft.trim() });
    setDraft("");
  }

  function onPickFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-picking the same file
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
