import { useState } from "react";
import { FACE_MONO, ENGRAVE, HONEY } from "../lib/theme.js";
import { TermHead, Panel } from "./shared.jsx";

export default function CreateHive({ C, createHive, notify, onBack }) {
  const [name, setName] = useState("");

  function submit() {
    if (name.trim().length < 3) return notify("Give your Hive a name (3+ characters).");
    createHive(name);
  }

  const field = { width: "100%", background: C.bg, border: `1px solid ${C.line}`, borderRadius: 4, padding: "12px 14px", color: C.text, fontSize: 15, fontFamily: FACE_MONO, outline: "none", marginBottom: 12 };

  return (
    <div>
      {onBack && <button onClick={onBack} style={{ background: "transparent", color: C.textDim, fontSize: 13, marginBottom: 12 }}>← Hive directory</button>}
      <TermHead C={C} mb={18}>create_hive</TermHead>
      <Panel C={C} style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Open your Hive</div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
          Give your Hive a name. Creating it costs <span style={{ color: C.accent, fontWeight: 700 }}>{HONEY.hiveCreate} Honey</span> (WISP Pro only). It then appears in the Hive directory, ranked by its Honey value.
        </p>
        <label style={{ display: "block", fontSize: 13, color: C.textDim, marginBottom: 6, fontFamily: FACE_MONO }}>Hive name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. night-signal" maxLength={32} style={field} />
        <button onClick={submit} style={{ width: "100%", background: C.text, color: C.bg, padding: 14, borderRadius: 4, ...ENGRAVE, letterSpacing: "0.12em", fontSize: 13 }}>Create Hive · {HONEY.hiveCreate} Honey</button>
      </Panel>
    </div>
  );
}
