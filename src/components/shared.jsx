import { FACE_MONO } from "../lib/theme.js";

export function TermHead({ C, children, mb = 4 }) {
  return (
    <h2 style={{ fontFamily: FACE_MONO, fontSize: 13, color: C.textDim, letterSpacing: "0.08em", marginBottom: mb, fontWeight: 600 }}>
      <span style={{ color: C.accent }}>&gt;</span> {children}
      <span style={{ color: C.accent, animation: "blink 1.1s step-end infinite" }}>_</span>
    </h2>
  );
}

export function Panel({ C, children, style }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 6, ...style }}>{children}</div>;
}

// The WISPA mark — simply a honeycomb cell (a hexagon within a hexagon).
export function CellLogo({ C, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.6" strokeLinejoin="round">
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill={C.accent + "1f"} />
      <polygon points="12,7.4 16.4,9.9 16.4,14.9 12,17.4 7.6,14.9 7.6,9.9" fill={C.accent} stroke="none" />
    </svg>
  );
}

// WISP id field with a fixed "WISP-" prefix — the user only types the 6-char code.
// `value` holds just the code; it's cleaned to uppercase letters + digits.
export function WispIdInput({ C, value, onChange, onEnter, autoFocus, wrapStyle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", ...wrapStyle }}>
      <span style={{ fontFamily: FACE_MONO, color: C.textDim, fontSize: 14, paddingLeft: 12, userSelect: "none", letterSpacing: "0.05em" }}>WISP-</span>
      <input
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
        onKeyDown={(e) => { if (e.key === "Enter" && onEnter) onEnter(); }}
        placeholder="A1B2C3"
        style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", padding: "11px 10px", color: C.text, fontSize: 14, fontFamily: FACE_MONO, letterSpacing: "0.12em" }}
      />
    </div>
  );
}

// Panik-Knopf: tarnt den Bildschirm sofort wieder als Taschenrechner.
// Standardposition oben rechts, per `style` überschreibbar.
export function CalcButton({ C, onClick, style }) {
  return (
    <button onClick={onClick} aria-label="Calculator" title="Hide" style={{
      position: "fixed", top: 18, right: 18, zIndex: 30,
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 38, height: 38, borderRadius: 9, background: C.surface,
      border: `1px solid ${C.line}`, color: C.textDim, cursor: "pointer", ...style,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
        <rect x="7.5" y="5" width="9" height="4" rx="1" />
        <line x1="8" y1="13" x2="8" y2="13" /><line x1="12" y1="13" x2="12" y2="13" /><line x1="16" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="8" y2="17" /><line x1="12" y1="17" x2="12" y2="17" /><line x1="16" y1="17" x2="16" y2="17" />
      </svg>
    </button>
  );
}
