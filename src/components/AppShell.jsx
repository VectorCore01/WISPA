import WaspLock from "./WaspLock.jsx";
import CellsTab from "./CellsTab.jsx";
import HiveTab from "./HiveTab.jsx";
import AccountTab from "./AccountTab.jsx";
import { FACE_MONO, ENGRAVE } from "../lib/theme.js";

export default function AppShell(props) {
  const { C, wispId, tab, setTab, setScreen } = props;
  const tabs = [["cells", "Cells"], ["hive", "Hive"], ["account", "Account"]];
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", paddingBottom: 90 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, background: C.bg, zIndex: 10 }}>
        <button onClick={() => setScreen("landing")} aria-label="Back to home" style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", padding: 0 }}>
          <WaspLock size={28} C={C} />
          <span style={{ fontFamily: FACE_MONO, color: C.text, fontSize: 17, fontWeight: 700, letterSpacing: "0.3em" }}>WISPA</span>
        </button>
        <div style={{ fontSize: 12, color: C.textDim, fontFamily: FACE_MONO }}>{wispId}</div>
      </div>

      <div style={{ padding: "22px" }}>
        {tab === "cells" && <CellsTab {...props} />}
        {tab === "hive" && <HiveTab {...props} />}
        {tab === "account" && <AccountTab {...props} />}
      </div>

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", background: C.surface, borderTop: `1px solid ${C.line}`, padding: "10px 8px" }}>
        <div style={{ display: "flex", maxWidth: 760, width: "100%", justifyContent: "space-around" }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ background: "transparent", color: tab === id ? C.text : C.textDim, fontSize: 11, ...ENGRAVE, letterSpacing: "0.1em", padding: "8px 14px", borderBottom: tab === id ? `2px solid ${C.accent}` : "2px solid transparent" }}>{label}</button>
          ))}
        </div>
      </nav>
    </div>
  );
}
