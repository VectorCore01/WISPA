import { useState } from "react";
import { FACE_MONO, HONEY } from "../lib/theme.js";
import { TermHead, Panel } from "./shared.jsx";
import { HoneyMark } from "./HoneyTab.jsx";
import { seedHives } from "../lib/seed.js";
import CreateHive from "./CreateHive.jsx";
import HiveChannel from "./HiveChannel.jsx";
import QrScanner from "./QrScanner.jsx";

// Hive is a public room everyone can browse and search. Only WISP Pro can create
// one (for Honey). Results are ranked by Honey value — richest Hives on top.
export default function HiveTab(props) {
  const { C, isPro, hiveCfg, hiveId, hiveMembers, startUpgrade, notify } = props;
  const [query, setQuery] = useState("");
  const [view, setView] = useState("dir"); // dir | create | channel
  const [scanning, setScanning] = useState(false);

  if (view === "create") return <CreateHive {...props} onBack={() => setView("dir")} />;
  if (view === "channel" && hiveCfg) return <HiveChannel {...props} onBack={() => setView("dir")} />;

  const own = hiveCfg
    ? [{ id: hiveId, name: hiveCfg.name, honey: hiveCfg.honey || HONEY.hiveCreate, members: (hiveMembers || []).filter((m) => m.status === "approved").length, own: true }]
    : [];
  const q = query.trim().toLowerCase();
  const results = [...own, ...seedHives()]
    .filter((h) => !q || h.id.toLowerCase().includes(q) || h.name.toLowerCase().includes(q))
    .sort((a, b) => b.honey - a.honey);

  function openHive(h) {
    if (h.own) { setView("channel"); return; }
    notify(`Joining "${h.name}" for ${HONEY.hiveJoin} Honey — full Hive joining is coming next.`);
  }
  function onCreate() {
    if (!isPro) return notify("Only WISP Pro can create a Hive.");
    setView("create");
  }

  return (
    <div>
      <TermHead C={C} mb={14}>hive</TermHead>

      {/* Search by name or HIVE-ID, or scan a QR */}
      <Panel C={C} style={{ padding: 8, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Hives — name or HIVE-ID" style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "10px 10px", color: C.text, fontSize: 14, fontFamily: FACE_MONO }} />
          <button onClick={() => setScanning(true)} aria-label="Scan QR" style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 6, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: C.text, flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3M21 14v7h-7M17.5 21v-2.5" /></svg>
          </button>
        </div>
      </Panel>

      {/* Create — Pro only */}
      <Panel C={C} style={{ padding: 14, marginBottom: 16, borderColor: isPro ? C.accent : C.line }}>
        {isPro ? (
          <button onClick={onCreate} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", color: C.text }}>
            <span style={{ fontWeight: 700 }}>+ Create your Hive</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.accent, fontFamily: FACE_MONO, fontSize: 13 }}><HoneyMark C={C} size={16} />{HONEY.hiveCreate}</span>
          </button>
        ) : (
          <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.5 }}>
            Browse and join any Hive. Only <span style={{ color: C.accent, fontWeight: 700 }}>WISP Pro</span> can create one.{" "}
            <button onClick={startUpgrade} style={{ background: "transparent", color: C.accent, fontWeight: 700, padding: 0 }}>Go Pro</button>
          </div>
        )}
      </Panel>

      {/* Results — most Honey first */}
      <div style={{ display: "grid", gap: 10 }}>
        {results.length === 0 && <div style={{ color: C.textDim, fontSize: 14, textAlign: "center", marginTop: 20 }}>No Hives match “{query}”.</div>}
        {results.map((h) => (
          <button key={h.id} onClick={() => openHive(h)} style={{ textAlign: "left", background: C.surface, border: `1px solid ${h.own ? C.accent : C.line}`, borderRadius: 6, padding: "14px 16px", color: C.text, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: FACE_MONO, fontWeight: 700, fontSize: 15 }}>{h.name}{h.own && <span style={{ color: C.accent, fontSize: 11, marginLeft: 8 }}>· yours</span>}</div>
              <div style={{ fontFamily: FACE_MONO, fontSize: 12, color: C.textDim }}>{h.id} · {h.members} member{h.members === 1 ? "" : "s"}</div>
            </div>
            <span style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, color: C.accent, fontFamily: FACE_MONO, fontSize: 14, fontWeight: 700 }}>
              <HoneyMark C={C} size={16} />{h.honey}
            </span>
          </button>
        ))}
      </div>

      {scanning && (
        <QrScanner C={C} onClose={() => setScanning(false)} onResult={(text) => { setScanning(false); setQuery(text); notify(`Scanned: ${text}`); }} />
      )}
    </div>
  );
}
