import WaspLock from "./WaspLock.jsx";
import CellsTab from "./CellsTab.jsx";
import HiveTab from "./HiveTab.jsx";
import AccountTab from "./AccountTab.jsx";
import { FACE_MONO, ENGRAVE } from "../lib/theme.js";

// A compact wasp drawn around (0,0): head, striped abdomen, two wings.
// Reused once for Account (you) and twice for Hive (a swarm).
function Wasp({ x = 0, y = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.4 -7.4 L-2.8 -9 M1.4 -7.4 L2.8 -9" />
      <circle cx="0" cy="-5.4" r="1.7" />
      <ellipse cx="0" cy="0.6" rx="3.1" ry="5.2" />
      <path d="M-2.7 -1.4 H2.7 M-3 1.1 H3 M-2.4 3.4 H2.4" />
      <path d="M-3 -3 C-6.4 -4.8 -6.6 -0.6 -3.2 0.2" />
      <path d="M3 -3 C6.4 -4.8 6.6 -0.6 3.2 0.2" />
      <path d="M0 5.8 L0 7.8" />
    </g>
  );
}

// Tab glyphs so each section reads at a glance:
// cells = a honeycomb cell, hive = a swarm of wasps, account = a single wasp.
function TabIcon({ id, size = 22 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  if (id === "cells") {
    return (
      <svg {...common} strokeWidth="2">
        <polygon points="12,2.5 20,7 20,17 12,21.5 4,17 4,7" />
      </svg>
    );
  }
  if (id === "hive") {
    return (
      <svg {...common}>
        <Wasp x={8.5} y={8} s={0.82} />
        <Wasp x={15.5} y={14} s={0.82} />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <Wasp x={12} y={11.5} s={1.15} />
    </svg>
  );
}

export default function AppShell(props) {
  const { C, mode, toggleMode, username, isPro, tab, setTab, setScreen, showVisor } = props;
  const tabs = [["cells", "Cells"], ["hive", "Hive"], ["account", "Account"]];
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", paddingBottom: 90 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "16px 22px", borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, background: C.bg, zIndex: 10 }}>
        <button onClick={() => setTab("cells")} aria-label="Cells" style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", padding: 0, justifySelf: "start" }}>
          <WaspLock size={28} C={C} />
          <span style={{ fontFamily: FACE_MONO, color: C.text, fontSize: 17, fontWeight: 700, letterSpacing: "0.3em" }}>WISPA</span>
        </button>

        {/* Panik-Knopf: tarnt die Sitzung sofort wieder als Taschenrechner */}
        <button onClick={showVisor} aria-label="Calculator" title="Hide" style={{
          justifySelf: "center", display: "flex", alignItems: "center", justifyContent: "center",
          width: 38, height: 38, borderRadius: 9, background: C.surface, border: `1px solid ${C.line}`,
          color: C.textDim, cursor: "pointer",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
            <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
            <rect x="7.5" y="5" width="9" height="4" rx="1" />
            <line x1="8" y1="13" x2="8" y2="13" /><line x1="12" y1="13" x2="12" y2="13" /><line x1="16" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="8" y2="17" /><line x1="12" y1="17" x2="12" y2="17" /><line x1="16" y1="17" x2="16" y2="17" />
          </svg>
        </button>

        <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 8, fontFamily: FACE_MONO }}>
          <span style={{ fontSize: 11, color: isPro ? C.accent : C.textDim, ...ENGRAVE, letterSpacing: "0.1em" }}>{isPro ? "WISP PRO" : "WISP"}</span>
          {username && <span style={{ fontSize: 12, color: C.textDim }}>{username}</span>}
          <button onClick={toggleMode} aria-label="Toggle theme" style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.text, fontSize: 14, cursor: "pointer", padding: "4px 9px", borderRadius: 6 }}>{mode === "dark" ? "☀" : "☾"}</button>
        </div>
      </div>

      <div style={{ padding: "22px" }}>
        {tab === "cells" && <CellsTab {...props} />}
        {tab === "hive" && <HiveTab {...props} />}
        {tab === "account" && <AccountTab {...props} />}
      </div>

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", background: C.surface, borderTop: `1px solid ${C.line}`, padding: "8px 8px" }}>
        <div style={{ display: "flex", maxWidth: 760, width: "100%", justifyContent: "space-around" }}>
          {tabs.map(([id, label]) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                background: active ? C.accent + "15" : "transparent",
                color: active ? C.accent : C.textDim,
                fontSize: 11, fontWeight: active ? 700 : 500,
                letterSpacing: "0.06em",
                padding: "8px 22px",
                borderRadius: 8,
                border: active ? `1.5px solid ${C.accent}40` : "1.5px solid transparent",
                transition: "all 0.15s",
              }}>
                <TabIcon id={id} />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
