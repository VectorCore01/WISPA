import { useState } from "react";
import { FACE_MONO, ENGRAVE, HONEY } from "../../lib/theme.js";
import { TermHead, Panel, WispIdInput } from "../app/shared.jsx";

// The Honey coin — a gold coin with the honey drop. Stands for Honey app-wide.
export function HoneyMark({ C, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill={C.accent} />
      <circle cx="12" cy="12" r="9" fill="none" stroke={C.onAccent} strokeOpacity="0.4" strokeWidth="0.9" />
      <path d="M12 6 C14.6 9.3 15.9 11.4 15.9 13.3 a3.9 3.9 0 0 1 -7.8 0 C8.1 11.4 9.4 9.3 12 6 Z" fill={C.onAccent} />
      <ellipse cx="10.7" cy="12.4" rx="0.9" ry="1.4" fill={C.accent} opacity="0.55" />
    </svg>
  );
}

function hoursLeft(expiry) {
  if (!expiry) return null;
  const ms = expiry - Date.now();
  if (ms <= 0) return "expired";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function HoneyTab({ C, honey, honeyExpiry, isPro, buyHoney, giftHoney, startUpgrade }) {
  const [toWisp, setToWisp] = useState("");
  const [amt, setAmt] = useState("");
  const left = hoursLeft(honeyExpiry);

  function send() {
    const ok = giftHoney("WISP-" + toWisp, amt);
    if (ok) { setToWisp(""); setAmt(""); }
  }

  return (
    <div>
      <TermHead C={C} mb={18}>honey</TermHead>

      {/* Balance */}
      <Panel C={C} style={{ padding: 20, marginBottom: 16, borderColor: C.accent }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <HoneyMark C={C} size={34} />
          <div>
            <div style={{ fontFamily: FACE_MONO, fontSize: 34, fontWeight: 700, color: C.text, lineHeight: 1 }}>{honey}</div>
            <div style={{ fontSize: 12, color: C.textDim, ...ENGRAVE, letterSpacing: "0.14em", marginTop: 4 }}>Honey</div>
          </div>
        </div>
        {!isPro && (
          <p style={{ color: left === "expired" ? C.danger : C.textDim, fontSize: 13, lineHeight: 1.5, marginTop: 12 }}>
            {honey > 0 && left && left !== "expired"
              ? <>Free Honey expires in <span style={{ color: C.accent, fontWeight: 700 }}>{left}</span>. </>
              : "Free Honey is temporary. "}
            <button onClick={startUpgrade} style={{ background: "transparent", color: C.accent, fontWeight: 700, padding: 0 }}>Go Pro</button> to keep it forever.
          </p>
        )}
      </Panel>

      {/* Buy */}
      <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Buy Honey</div>
        <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
          Honey is the app currency — join Hives, download files, start Swarms, gift others. (Demo: no real payment.)
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {HONEY.packs.map((p) => (
            <button key={p.honey} onClick={() => buyHoney(p)} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, padding: "14px 16px", color: C.text,
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <HoneyMark C={C} size={22} />
                <span style={{ fontFamily: FACE_MONO, fontSize: 18, fontWeight: 700 }}>{p.honey} Honey</span>
              </span>
              <span style={{ background: C.accent, color: C.onAccent, borderRadius: 6, padding: "8px 14px", fontWeight: 700, fontSize: 13 }}>€{p.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </Panel>

      {/* Gift — Pro only */}
      {isPro ? (
        <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Gift Honey</div>
          <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>Send Honey to any WISP — a gift or a donation.</p>
          <WispIdInput C={C} value={toWisp} onChange={setToWisp} onEnter={send}
            wrapStyle={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 6, marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={amt} onChange={(e) => setAmt(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="Amount"
              style={{ flex: 1, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 6, padding: "11px 12px", color: C.text, fontSize: 14, fontFamily: FACE_MONO, outline: "none" }} />
            <button onClick={send} style={{ background: C.text, color: C.bg, borderRadius: 6, padding: "0 20px", ...ENGRAVE, letterSpacing: "0.08em", fontSize: 12 }}>Send</button>
          </div>
        </Panel>
      ) : (
        <Panel C={C} style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Gift Honey</div>
          <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.5 }}>
            Gifting Honey is a <span style={{ color: C.accent, fontWeight: 700 }}>WISP Pro</span> feature.{" "}
            <button onClick={startUpgrade} style={{ background: "transparent", color: C.accent, fontWeight: 700, padding: 0 }}>Go Pro</button> to send Honey to others.
          </p>
        </Panel>
      )}
    </div>
  );
}
