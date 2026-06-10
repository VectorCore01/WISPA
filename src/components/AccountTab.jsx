import { FACE_MONO, HIVE_PRICE } from "../lib/theme.js";

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

export default function AccountTab({ C, wispId, hasHive }) {
  return (
    <div>
      <TermHead C={C} mb={18}>account</TermHead>

      <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Your WISP id</div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>This is all anyone ever sees of you. No name, no phone, no email — share it with people you want to reach.</p>
        <div style={{ fontFamily: FACE_MONO, fontSize: 22, color: C.text, letterSpacing: "0.05em" }}>{wispId}</div>
      </Panel>

      <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Hive subscription</div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5 }}>
          {hasHive ? `Active — €${HIVE_PRICE.toFixed(2)}/month. Your encrypted channel is live.` : "Not subscribed. Open the Hive tab to start a channel."}
        </p>
      </Panel>

      <Panel C={C} style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>About this demo</div>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.5 }}>This is a prototype. Messages, channels and payments are simulated and run only in your browser. Nothing is stored or sent.</p>
      </Panel>
    </div>
  );
}
