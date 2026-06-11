import { useState } from "react";
import { FACE_MONO, ENGRAVE, HIVE_PRICE } from "../lib/theme.js";

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

export default function AccountTab({ C, tier, isPro, wispId, hiveId, username, msgKey, loginPass, changeName, startUpgrade }) {
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(username);

  function saveName() {
    changeName(nameDraft);
    setEditing(false);
  }

  return (
    <div>
      <TermHead C={C} mb={18}>account</TermHead>

      <Panel C={C} style={{ padding: 18, marginBottom: 16, borderColor: isPro ? C.accent : C.line }}>
        <div style={{ fontWeight: 700, ...ENGRAVE, letterSpacing: "0.12em", color: isPro ? C.accent : C.text }}>{isPro ? "WISP PRO" : "WISP"}</div>
        <p style={{ color: C.textDim, fontSize: 13, marginTop: 4 }}>
          {isPro
            ? "Video + files, your own Hive. Cells roll 4 messages (2 per person). Secured by your 24 words."
            : "Free account. Messages + images only. Cells roll 4 messages (2 per person)."}
        </p>
      </Panel>

      <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontWeight: 700 }}>Your name</div>
          {isPro && !editing && (
            <button onClick={() => { setNameDraft(username); setEditing(true); }} style={{ background: "transparent", color: C.accent, fontSize: 12, ...ENGRAVE, letterSpacing: "0.08em" }}>Edit</button>
          )}
        </div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>
          {isPro ? "The name people see when you chat. Only WISP Pro can change it." : "The name people see when you chat. Go Pro to change it."}
        </p>
        {editing ? (
          <div style={{ display: "flex", gap: 8 }}>
            <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} maxLength={24} style={{ flex: 1, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 4, padding: "10px 12px", color: C.text, fontSize: 16, fontFamily: FACE_MONO, outline: "none" }} />
            <button onClick={saveName} style={{ background: C.text, color: C.bg, borderRadius: 4, padding: "0 16px", ...ENGRAVE, letterSpacing: "0.08em", fontSize: 12 }}>Save</button>
            <button onClick={() => setEditing(false)} style={{ background: "transparent", color: C.textDim, fontSize: 12 }}>Cancel</button>
          </div>
        ) : (
          <div style={{ fontFamily: FACE_MONO, fontSize: 20, color: C.text }}>{username || "—"}</div>
        )}
      </Panel>

      <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Your WISP id <span style={{ color: C.textDim, fontWeight: 400, fontSize: 12 }}>· share to be reached</span></div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>Someone can only open a cell with you if they know <em>both</em> this id and your message key below.</p>
        <div style={{ fontFamily: FACE_MONO, fontSize: 22, color: C.text, letterSpacing: "0.05em" }}>{wispId}</div>
      </Panel>

      <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Your message key</div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>The 6-digit code others type (with your WISP id) to reach you. Share it only with people you want to hear from.</p>
        <div style={{ fontFamily: FACE_MONO, fontSize: 26, color: C.text, letterSpacing: "0.3em" }}>{msgKey || "------"}</div>
      </Panel>

      <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>How you log in</div>
        {isPro ? (
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5 }}>With your WISP id and your <strong style={{ color: C.text }}>24-word key</strong>. Keep the words offline — they're the only way back.</p>
        ) : (
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5 }}>With your WISP id and your password: <span style={{ fontFamily: FACE_MONO, color: C.text }}>{loginPass || "—"}</span></p>
        )}
      </Panel>

      {isPro ? (
        <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Your Hive id</div>
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>The fixed address of your channel. Open the Hive tab to run it. As Pro owner, you can destroy and recreate your Hive anytime.</p>
          <div style={{ fontFamily: FACE_MONO, fontSize: 22, color: C.text, letterSpacing: "0.05em" }}>{hiveId}</div>
        </Panel>
      ) : (
        <Panel C={C} style={{ padding: 18, marginBottom: 16, borderColor: C.accent }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Upgrade to WISP Pro</div>
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
            €{HIVE_PRICE.toFixed(2)}/month. Get a 24-word key, video + file sending, an editable name, and your own Hive channel with 6-digit key.
          </p>
          <button onClick={startUpgrade} style={{ width: "100%", background: C.text, color: C.bg, padding: 14, borderRadius: 4, ...ENGRAVE, letterSpacing: "0.12em", fontSize: 13 }}>
            Go Pro · €{HIVE_PRICE.toFixed(2)} / month
          </button>
        </Panel>
      )}

      <Panel C={C} style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>About this demo</div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5 }}>This is a prototype. Messages, channels and payments are simulated and run only in your browser. Nothing is stored or sent.</p>
      </Panel>
    </div>
  );
}
