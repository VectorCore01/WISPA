import { useState, useEffect } from "react";
import { THEMES, honeycombBg } from "../lib/theme.js";
import { genSeed, genWispId, nowTime, DEMO_LIFETIME_MS, seedCells } from "../lib/helpers.js";
import { t } from "../lib/translations.js";
import Landing from "./Landing.jsx";
import EntryChoice from "./EntryChoice.jsx";
import Onboard from "./Onboard.jsx";
import Login from "./Login.jsx";
import AppShell from "./AppShell.jsx";

export default function WispaPrototype() {
  const [mode] = useState("dark");
  const C = THEMES[mode];

  const [lang, setLang] = useState("de");
  const [screen, setScreen] = useState("landing");
  const [seed, setSeed] = useState([]);
  const [seedConfirmed, setSeedConfirmed] = useState(false);
  const [wispId, setWispId] = useState("");
  const [hasHive, setHasHive] = useState(false);
  const [tab, setTab] = useState("cells");
  const [toast, setToast] = useState(null);

  const [cells, setCells] = useState(seedCells());
  const [activeCell, setActiveCell] = useState(null);
  const [now, setNow] = useState(Date.now());

  const [hivePosts, setHivePosts] = useState([]);

  useEffect(() => {
    const iv = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (!hasHive) {
        setCells((cs) => {
          const survivors = cs.filter((c) => t - c.lastActivity < DEMO_LIFETIME_MS);
          if (survivors.length !== cs.length) {
            setActiveCell((a) => (survivors.some((c) => c.id === a) ? a : null));
          }
          return survivors;
        });
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [hasHive]);

  function notify(msg) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  function startOnboard() { setSeed(genSeed()); setSeedConfirmed(false); setScreen("onboard"); }
  function startLogin() { setScreen("login"); }
  function finishOnboard() {
    setWispId(genWispId());
    setCells(seedCells());
    setHasHive(false);
    setScreen("app");
    setTab("cells");
    notify(t(lang, "Welcome. Your anonymous WISP is ready."));
  }
  function finishLogin() {
    setWispId(genWispId());
    setCells(seedCells());
    setHasHive(false);
    setScreen("app");
    setTab("cells");
    notify(t(lang, "WISP restored. Welcome back."));
  }

  function buyHive() {
    if (hasHive) return notify("You already run a hive channel.");
    setHasHive(true);
    setTab("hive");
    notify(`Hive active — your cells now survive. €4.99/month.`);
  }

  function sendInCell(cellId, text, kind = "text") {
    setCells((cs) => cs.map((c) =>
      c.id === cellId
        ? { ...c, lastActivity: Date.now(), seen: true, current: { from: "me", text, kind, time: nowTime() } }
        : c
    ));
  }

  function openCell(cellId) {
    setCells((cs) => cs.map((c) => c.id === cellId ? { ...c, seen: true } : c));
    setActiveCell(cellId);
  }

  function startNewCell(peer) {
    const id = Date.now();
    setCells((cs) => [{ id, peer, lastActivity: Date.now(), current: null, seen: true }, ...cs]);
    setActiveCell(id);
    setTab("cells");
  }

  function postToHive(text) {
    setHivePosts((p) => [...p, { id: Date.now(), text, time: nowTime(), reads: Math.floor(Math.random() * 40) }]);
  }

  const shared = {
    C, mode, lang, setLang, wispId, hasHive, tab, setTab, notify, setScreen,
    cells, activeCell, setActiveCell, openCell, sendInCell, startNewCell,
    buyHive, hivePosts, postToHive, now, lifetime: DEMO_LIFETIME_MS,
  };

  return (
    <div style={{
      fontFamily: "'SF Mono', 'Consolas', 'Menlo', 'Courier New', monospace",
      background: C.bg,
      color: C.text,
      minHeight: "100vh",
      WebkitFontSmoothing: "antialiased",
      transition: "background .3s, color .3s",
      backgroundImage: honeycombBg(C.lineSoft),
      backgroundSize: "56px 96px"
    }}>
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; border: none; }
        button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
        @keyframes rise { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes drift { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
        @keyframes burn { from { opacity: 1; transform: scale(1) } to { opacity: 0; transform: scale(0.96) } }
        @keyframes blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)", background: C.text, color: C.bg, padding: "10px 18px", borderRadius: 4, fontWeight: 600, fontSize: 14, zIndex: 50, boxShadow: "0 8px 30px rgba(0,0,0,.4)", animation: "rise .25s ease" }}>
          {toast}
        </div>
      )}

      {screen === "landing" && <Landing C={C} lang={lang} onStart={() => setScreen("choice")} />}
      {screen === "choice" && <EntryChoice C={C} lang={lang} setLang={setLang} onCreate={startOnboard} onLogin={startLogin} onBack={() => setScreen("landing")} />}
      {screen === "onboard" && <Onboard C={C} lang={lang} seed={seed} confirmed={seedConfirmed} setConfirmed={setSeedConfirmed} onFinish={finishOnboard} onBack={() => setScreen("choice")} />}
      {screen === "login" && <Login C={C} lang={lang} onFinish={finishLogin} onBack={() => setScreen("choice")} />}
      {screen === "app" && <AppShell {...shared} />}
    </div>
  );
}
