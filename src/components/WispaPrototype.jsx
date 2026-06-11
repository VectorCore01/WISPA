import { useState, useRef } from "react";
import { THEMES, honeycombBg } from "../lib/theme.js";
import { genSeed, genWispId, genHiveId, genMsgKey, genHiveKey, nowTime, seedCells, seedHiveMembers, lookupPeer, capPerSender, CELL_MSG_PER_SENDER } from "../lib/helpers.js";
import { t } from "../lib/translations.js";
import Landing from "./Landing.jsx";
import EntryChoice from "./EntryChoice.jsx";
import Profile from "./Profile.jsx";
import Onboard from "./Onboard.jsx";
import Login from "./Login.jsx";
import AppShell from "./AppShell.jsx";

export default function WispaPrototype() {
  const [mode] = useState("dark");
  const C = THEMES[mode];

  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("landing");
  const [tier, setTier] = useState("wisp"); // "wisp" | "pro"
  const [seed, setSeed] = useState([]);
  const [seedConfirmed, setSeedConfirmed] = useState(false);
  const [wispId, setWispId] = useState("");
  const [hiveId, setHiveId] = useState("");
  const [msgKey, setMsgKey] = useState("");      // 6-digit code others type to reach you
  const [username, setUsername] = useState("");
  const [loginPass, setLoginPass] = useState(""); // free WISP logs in with id + this password
  const [tab, setTab] = useState("cells");
  const [toast, setToast] = useState(null);

  const [cells, setCells] = useState(seedCells());
  const [activeCell, setActiveCell] = useState(null);

  const msgIdRef = useRef(Date.now());

  const [hiveCfg, setHiveCfg] = useState(null); // { name, key } once the channel is created
  const [hiveMembers, setHiveMembers] = useState([]);
  const [hivePosts, setHivePosts] = useState([]);

  const isPro = tier === "pro";

  function notify(msg) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  function startProfile() { setUsername(""); setLoginPass(""); setScreen("profile"); }
  function startLogin() { setScreen("login"); }

  // Free signup → a WISP. Logs back in with id + the password chosen here.
  // No 24 words. Cells roll max 4 messages (2 per person).
  function finishFreeWisp() {
    setTier("wisp");
    setWispId(genWispId());
    setMsgKey(genMsgKey());
    setHiveId("");
    setSeed([]);
    setCells(seedCells());
    setHiveCfg(null);
    setHiveMembers([]);
    setHivePosts([]);
    setScreen("app");
    setTab("account");
    notify(t(lang, "Your free WISP is ready."));
  }

  // Upgrade flow: pay €4.99 → generate 24 words → become WISP Pro.
  // Keeps the same WISP id and message key.
  function startUpgrade() { setSeed(genSeed()); setSeedConfirmed(false); setScreen("onboard"); }
  function finishUpgrade() {
    setTier("pro");
    setHiveId(genHiveId());
    setHiveMembers(seedHiveMembers());
    setScreen("app");
    setTab("account");
    notify(t(lang, "You're WISP Pro now. Videos, files and your own Hive are unlocked."));
  }

  // Restore: Pro logs in with id + 24 words, free WISP with id + password.
  function finishLogin(id, restoredTier) {
    setTier(restoredTier);
    setWispId(id);
    setMsgKey(genMsgKey());
    setUsername("nomad");
    setLoginPass("amber");
    setCells(seedCells());
    setHiveCfg(null);
    if (restoredTier === "pro") {
      setHiveId(genHiveId());
      setHiveMembers(seedHiveMembers());
    } else {
      setHiveId("");
      setHiveMembers([]);
    }
    setHivePosts([]);
    setScreen("app");
    setTab("cells");
    notify(t(lang, "WISP restored. Welcome back."));
  }

  function changeName(name) {
    if (!isPro) return notify(t(lang, "Only WISP Pro can change its name."));
    const v = name.trim();
    if (v.length < 3) return notify(t(lang, "Pick a username with at least 3 characters."));
    setUsername(v);
    notify(t(lang, "Name updated."));
  }

  function createHive(name) {
    const key = genHiveKey();
    setHiveCfg({ name: name.trim(), key });
    notify(t(lang, "Hive channel created."));
  }
  function approveMember(id) {
    setHiveMembers((m) => m.map((x) => (x.id === id ? { ...x, status: "approved" } : x)));
  }
  function rejectMember(id) {
    setHiveMembers((m) => m.filter((x) => x.id !== id));
  }

  function destroyHive() {
    setHiveCfg(null);
    setHiveMembers([]);
    setHivePosts([]);
    notify("Hive destroyed. You can create a new one anytime.");
  }

  // msg is either { text } or an attachment { kind, name, size, url }.
  // Attachments start sealed (opened: false) and must be opened to be seen.
  // Rolling window: max 4 messages (2 per sender) — oldest drops off.
  function sendInCell(cellId, msg) {
    const entry = { id: ++msgIdRef.current, from: "me", kind: "text", time: nowTime(), opened: false, ...msg };
    setCells((cs) => cs.map((c) => {
      if (c.id !== cellId) return c;
      const updated = [...c.messages, entry];
      return { ...c, lastActivity: Date.now(), seen: true, messages: capPerSender(updated, CELL_MSG_PER_SENDER) };
    }));
  }

  function openCellAttachment(cellId, msgId) {
    setCells((cs) => cs.map((c) =>
      c.id === cellId
        ? { ...c, messages: c.messages.map((m) => m.id === msgId ? { ...m, opened: true } : m) }
        : c
    ));
  }

  function openCell(cellId) {
    setCells((cs) => cs.map((c) => c.id === cellId ? { ...c, seen: true } : c));
    setActiveCell(cellId);
  }

  function startNewCell(peer, key) {
    // You can only open a cell if you know their WISP id AND their 6-digit
    // message key. Otherwise the cell is refused.
    const res = lookupPeer(peer, key);
    if (!res.ok) {
      notify(res.reason === "unknown"
        ? t(lang, "No WISP found with that id.")
        : t(lang, "Wrong message key — you can't open a cell with them."));
      return false;
    }
    const existing = cells.find((c) => c.peer === peer);
    if (existing) {
      openCell(existing.id);
      setTab("cells");
      return true;
    }
    const id = Date.now();
    // authed: true — you typed their key to open this cell.
    setCells((cs) => [{ id, peer, peerName: res.name, authed: true, lastActivity: Date.now(), messages: [], seen: true }, ...cs]);
    setActiveCell(id);
    setTab("cells");
    return true;
  }

  // To reply in an incoming cell you must enter the peer's 6-digit key first —
  // the same way they had to enter yours to reach you.
  function unlockCell(cellId, key) {
    const cell = cells.find((c) => c.id === cellId);
    if (!cell) return false;
    const res = lookupPeer(cell.peer, key);
    if (!res.ok) {
      notify(t(lang, "Wrong message key — you can't reply yet."));
      return false;
    }
    setCells((cs) => cs.map((c) => (c.id === cellId ? { ...c, authed: true } : c)));
    return true;
  }

  // A post is either text ({ text }) or an attachment ({ kind, name, url, size }).
  function postToHive(payload) {
    setHivePosts((p) => [...p, { id: Date.now(), time: nowTime(), ...payload }]);
  }

  const shared = {
    C, mode, lang, setLang,
    tier, isPro, wispId, hiveId, myId: wispId, username, msgKey, loginPass,
    hasHive: isPro, // Pro can send video/files and owns a Hive
    tab, setTab, notify, setScreen,
    cells, activeCell, setActiveCell, openCell, sendInCell, openCellAttachment, startNewCell, unlockCell,
    startUpgrade, changeName,
    hiveCfg, createHive, hiveMembers, approveMember, rejectMember, destroyHive,
    hivePosts, postToHive,
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
      {screen === "choice" && <EntryChoice C={C} lang={lang} setLang={setLang} onCreate={startProfile} onLogin={startLogin} onBack={() => setScreen("landing")} />}
      {screen === "profile" && <Profile C={C} lang={lang} username={username} setUsername={setUsername} loginPass={loginPass} setLoginPass={setLoginPass} onContinue={finishFreeWisp} onBack={() => setScreen("choice")} />}
      {screen === "onboard" && <Onboard C={C} lang={lang} seed={seed} confirmed={seedConfirmed} setConfirmed={setSeedConfirmed} onFinish={finishUpgrade} onBack={() => setScreen("app")} />}
      {screen === "login" && <Login C={C} lang={lang} onFinish={finishLogin} onBack={() => setScreen("choice")} />}
      {screen === "app" && <AppShell {...shared} />}
    </div>
  );
}
