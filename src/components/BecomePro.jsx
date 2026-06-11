import WaspLock from "./WaspLock.jsx";
import { FACE_DISPLAY, FACE_MONO, ENGRAVE, HEX_CLIP, HIVE_PRICE, honeycombBg } from "../lib/theme.js";
import { TermHead, Panel } from "./shared.jsx";

export default function BecomePro({ C, startUpgrade }) {
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
