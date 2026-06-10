import { useState } from "react";
import WaspLock from "./WaspLock.jsx";
import { FACE_DISPLAY, FACE_MONO, ENGRAVE, HEX_CLIP, HIVE_PRICE, honeycombBg } from "../lib/theme.js";

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
  const { C, hasHive, buyHive } = props;
  if (!hasHive) return <HiveOffer C={C} buyHive={buyHive} />;
  return <HiveChannel {...props} />;
}

function HiveOffer({ C, buyHive }) {
  return (
    <div>
      <TermHead C={C} mb={18}>hive_channel</TermHead>

      <div style={{ position: "relative", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, padding: "30px 24px", marginBottom: 18, textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: honeycombBg(C.lineSoft), backgroundSize: "56px 96px", opacity: 0.5 }} />
        <div style={{ position: "relative" }}>
          <WaspLock size={64} C={C} />
          <div style={{ fontFamily: FACE_DISPLAY, fontSize: 26, fontWeight: 700, ...ENGRAVE, letterSpacing: "0.12em", marginTop: 10 }}>Run a hive</div>
          <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.6, maxWidth: 360, margin: "10px auto 0" }}>
            An encrypted channel where one voice broadcasts to many. Your followers
            stay anonymous; your posts stay sealed until opened.
          </p>
        </div>
      </div>

      <Panel C={C} style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {["Keep your cells alive — no more 1-hour self-destruct", "Send videos and files in your cells", "Broadcast to unlimited anonymous followers", "Your channel, your rules — no names, no trace"].map((line) => (
            <div key={line} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 14 }}>
              <span style={{ width: 14, height: 16, clipPath: HEX_CLIP, background: C.accent, display: "inline-block", flexShrink: 0 }} />
              {line}
            </div>
          ))}
        </div>
      </Panel>

      <button onClick={buyHive} style={{ width: "100%", background: C.text, color: C.bg, padding: 15, borderRadius: 4, ...ENGRAVE, letterSpacing: "0.12em", fontSize: 13 }}>
        Subscribe · €{HIVE_PRICE.toFixed(2)} / month
      </button>
      <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", marginTop: 10 }}>Cancel anytime. Demo — no real charge.</div>
    </div>
  );
}

function HiveChannel({ C, hivePosts, postToHive, wispId }) {
  const [draft, setDraft] = useState("");
  function post() {
    if (!draft.trim()) return;
    postToHive(draft.trim());
    setDraft("");
  }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <TermHead C={C} mb={4}>your_hive</TermHead>
          <div style={{ fontFamily: FACE_MONO, fontSize: 13 }}>{wispId} · channel</div>
        </div>
        <span style={{ fontSize: 11, color: C.accent, ...ENGRAVE, letterSpacing: "0.1em" }}>active</span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && post()} placeholder="Broadcast to your followers…" style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 4, padding: "12px 18px", color: C.text, fontSize: 15 }} />
        <button onClick={post} style={{ background: C.text, color: C.bg, borderRadius: 4, padding: "0 20px", ...ENGRAVE, letterSpacing: "0.08em", fontSize: 12 }}>Post</button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {hivePosts.length === 0 && (
          <div style={{ color: C.textDim, fontSize: 14, textAlign: "center", marginTop: 30 }}>No broadcasts yet. Your first post will reach every follower — sealed until they open it.</div>
        )}
        {[...hivePosts].reverse().map((p) => (
          <Panel key={p.id} C={C} style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 15, lineHeight: 1.4 }}>{p.text}</div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 8, fontFamily: FACE_MONO, display: "flex", justifyContent: "space-between" }}>
              <span>{p.time}</span>
              <span>{p.reads} opened · then burned</span>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
