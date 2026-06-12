import { useState } from "react";
import { FACE_MONO, ENGRAVE, HIVE_PRICE } from "../../lib/theme.js";
import { TermHead, Panel } from "../app/shared.jsx";
import QrCode from "../ui/QrCode.jsx";

// A value that stays hidden behind asterisks until you press Reveal.
// Used for the WISP id and message key — they're special, so kept private.
function Secret({ C, value, size = 22, ls = "0.05em" }) {
  const [show, setShow] = useState(false);
  const masked = "*".repeat(Math.max((value || "").length, 6));
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div style={{ fontFamily: FACE_MONO, fontSize: size, color: C.text, letterSpacing: ls, overflow: "hidden", textOverflow: "ellipsis" }}>
        {show ? (value || "—") : masked}
      </div>
      <button onClick={() => setShow((s) => !s)} style={{ flexShrink: 0, background: "transparent", border: `1px solid ${C.line}`, borderRadius: 4, padding: "6px 12px", color: C.accent, fontSize: 11, ...ENGRAVE, letterSpacing: "0.08em" }}>
        {show ? "Hide" : "Reveal"}
      </button>
    </div>
  );
}

export default function AccountTab({ C, tier, isPro, wispId, hiveId, username, msgKey, loginPass, changeName, startUpgrade, logout }) {
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(username);
  const [passDraft, setPassDraft] = useState("");

  function saveName() {
    const before = username;
    changeName(nameDraft, passDraft);
    // changeName only updates on success; close the editor once the name took.
    setPassDraft("");
    if (nameDraft.trim().length >= 3 && passDraft) setEditing(false);
    void before;
  }

  return (
    <div>
      <TermHead C={C} mb={18}>account</TermHead>

      <Panel C={C} style={{ padding: 18, marginBottom: 16, borderColor: isPro ? C.accent : C.line }}>
        <div style={{ fontWeight: 700, ...ENGRAVE, letterSpacing: "0.12em", color: isPro ? C.accent : C.text }}>{isPro ? "WISP PRO" : "WISP"}</div>
        <p style={{ color: C.textDim, fontSize: 13, marginTop: 4 }}>
          {isPro
            ? "Video + files, your own Hive. Cells roll 4 messages (2 per person). Recoverable with your 12 words."
            : "Free account. Messages + images only. Cells roll 4 messages (2 per person)."}
        </p>
      </Panel>

      <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontWeight: 700 }}>Your name</div>
          {!editing && (
            <button onClick={() => { setNameDraft(username); setPassDraft(""); setEditing(true); }} style={{ background: "transparent", color: C.accent, fontSize: 12, ...ENGRAVE, letterSpacing: "0.08em" }}>Edit</button>
          )}
        </div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>
          The name people see when you chat. Change it anytime by confirming your password.
        </p>
        {editing ? (
          <div style={{ display: "grid", gap: 8 }}>
            <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} maxLength={24} placeholder="new name" style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 4, padding: "10px 12px", color: C.text, fontSize: 16, fontFamily: FACE_MONO, outline: "none" }} />
            <input type="password" value={passDraft} onChange={(e) => setPassDraft(e.target.value)} placeholder="your password" style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 4, padding: "10px 12px", color: C.text, fontSize: 16, fontFamily: FACE_MONO, outline: "none" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveName} style={{ flex: 1, background: C.text, color: C.bg, borderRadius: 4, padding: "10px 16px", ...ENGRAVE, letterSpacing: "0.08em", fontSize: 12 }}>Save</button>
              <button onClick={() => { setEditing(false); setPassDraft(""); }} style={{ background: "transparent", color: C.textDim, fontSize: 12, padding: "0 8px" }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: FACE_MONO, fontSize: 20, color: C.text }}>{username || "—"}</div>
        )}
      </Panel>

      <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Your WISP id <span style={{ color: C.textDim, fontWeight: 400, fontSize: 12 }}>· share to be reached</span></div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>Someone can only open a cell with you if they know <em>both</em> this id and your message key below.</p>
        <Secret C={C} value={wispId} size={22} ls="0.05em" />
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
          <QrCode value={wispId} size={84} />
          <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>Let people scan this to get your WISP id.</div>
        </div>
      </Panel>

      <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Your message key</div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>The 6-digit code others type (with your WISP id) to reach you. Share it only with people you want to hear from.</p>
        <Secret C={C} value={msgKey} size={26} ls="0.3em" />
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
            €{HIVE_PRICE.toFixed(2)}/month. Get a 12-word recovery key, video + file sending, and your own Hive channel with 6-digit key.
          </p>
          <button onClick={startUpgrade} style={{ width: "100%", background: C.text, color: C.bg, padding: 14, borderRadius: 4, ...ENGRAVE, letterSpacing: "0.12em", fontSize: 13 }}>
            Go Pro · €{HIVE_PRICE.toFixed(2)} / month
          </button>
        </Panel>
      )}

      <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>About this demo</div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5 }}>This is a prototype. Messages, channels and payments are simulated and run only in your browser. Nothing is stored or sent.</p>
      </Panel>

      <button onClick={logout} style={{
        width: "100%", background: "transparent", color: C.danger,
        border: `1px solid ${C.danger}55`, borderRadius: 8, padding: 14,
        fontSize: 13, ...ENGRAVE, letterSpacing: "0.1em",
      }}>
        Log out
      </button>
      {!isPro && (
        <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.5, marginTop: 10, textAlign: "center" }}>
          A free WISP has no 12-word key — log back in with your WISP id and password.
        </p>
      )}
    </div>
  );
}
