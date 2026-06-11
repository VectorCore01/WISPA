import { useState } from "react";
import { FACE_MONO, ENGRAVE } from "../lib/theme.js";
import { TermHead, Panel } from "./shared.jsx";

export default function CreateHive({ C, hiveId, createHive, notify }) {
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
