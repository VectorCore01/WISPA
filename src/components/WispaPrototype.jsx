import { useState, useRef, useEffect } from "react";
import { THEMES, FACE_UI, honeycombBg } from "../lib/theme.js";
import { genSeed, genWispId, genMsgKey } from "../lib/id.js";
import { capPerSender, CELL_MSG_PER_SENDER } from "../lib/cell.js";
import { nowTime } from "../lib/time.js";
import { seedCells, seedHiveMembers } from "../lib/seed.js";
import { lookupPeer } from "../lib/directory.js";
import { loadSession, saveSession, clearSession } from "../lib/session.js";
import { t } from "../lib/translations.js";
import { api, normCell } from "../lib/api.js";
import Landing from "./Landing.jsx";
import WispLanding from "./WispLanding.jsx";
import EntryChoice from "./EntryChoice.jsx";
import Profile from "./Profile.jsx";
import Onboard from "./Onboard.jsx";
import Login from "./Login.jsx";
import AppShell from "./AppShell.jsx";
import IntroOverlay from "./IntroOverlay.jsx";

export default function WispaPrototype() {
  const saved = loadSession();

  const [mode, setMode] = useState(saved.mode === "light" ? "light" : "dark");
  const C = THEMES[mode];
  function toggleMode() { setMode((m) => (m === "dark" ? "light" : "dark")); }

  // Vault-Code: wird beim Eintritt über die Cell-Taste gesetzt, ersetzt in WISPA
  // den 6-stelligen Cell-Key und wird beim Logout wieder gelöscht.
  const [vaultCode, setVaultCode] = useState("");

  const [lang, setLang] = useState("en");
  // On refresh, only a real logged-in app session is restored. Every pre-app
  // screen (gatekeeper, choice, login…) falls back to the calculator cover,
  // so reloading never exposes the gatekeeper.
  const [screen, setScreen] = useState(saved.screen === "app" && saved.wispId ? "app" : "landing");
  const [tier, setTier] = useState(saved.tier || "wisp");
  const [seed, setSeed] = useState([]);
  const [seedConfirmed, setSeedConfirmed] = useState(false);
  const [wispId, setWispId] = useState(saved.wispId || "");
  const [hiveId, setHiveId] = useState(saved.hiveId || "");
  const [msgKey, setMsgKey] = useState(saved.msgKey || "");
  const [username, setUsername] = useState(saved.username || "");
  const [loginPass, setLoginPass] = useState("");
  const [tab, setTab] = useState(saved.tab || "cells");
  const [toast, setToast] = useState(null);
  const [cells, setCells] = useState([]);
  const [activeCell, setActiveCell] = useState(null);
  const msgIdRef = useRef(Date.now());
  const [hiveCfg, setHiveCfg] = useState(saved.hiveCfg || null);
  const [hiveMembers, setHiveMembers] = useState([]);
  const [hivePosts, setHivePosts] = useState([]);
  const isPro = tier === "pro";
  const mounted = useRef(false);
  const [visor, setVisor] = useState(false);
  const [intro, setIntro] = useState(null); // "create" | "login" | null
  const prevRef = useRef(null);

  function showVisor() {
    prevRef.current = screen;
    setVisor(true);
  }

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    saveSession({ screen, tier, wispId, hiveId, msgKey, username, tab, hiveCfg, mode });
  }, [screen, tier, wispId, hiveId, msgKey, username, tab, hiveCfg, mode]);

  // Aufgerufen vom Taschenrechner, wenn Zahl getippt + Cell-Logo gedrückt + Code
  // eingegeben wurde. Aus der Panik-Tarnung (visor) kehren wir nur zurück, wenn der
  // Code stimmt; vom Cover aus setzt der Code die Sitzung und öffnet WISPA.
  function calcUnlock(code) {
    if (visor) {
      if (vaultCode && code !== vaultCode) { notify("Wrong code."); return; }
      setVisor(false);
      return;
    }
    setVaultCode(code);
    setScreen("wisp-landing");
  }

  function notify(msg) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  function startProfile() { setUsername(""); setLoginPass(""); setScreen("profile"); }
  function startLogin() { setScreen("login"); }

  async function finishFreeWisp() {
    const res = await api.register(username || "anon", loginPass || "demo").catch(() => null);
    if (res) {
      setTier("wisp");
      setWispId(res.wispId);
      setMsgKey(res.msgKey);
      setUsername(res.username);
      setHiveId("");
      setCells([]);
      setHiveCfg(null);
      setHiveMembers([]);
      setHivePosts([]);
      setScreen("app");
      setTab("account");
      setIntro("create");
      notify("Your free WISP is ready.");
    } else {
      const fake = genWispId();
      setTier("wisp");
      setWispId(fake);
      setMsgKey(genMsgKey());
      setUsername(username || "anon");
      setHiveId("");
      setCells([]);
      setHiveCfg(null);
      setHiveMembers([]);
      setHivePosts([]);
      setScreen("app");
      setTab("account");
      setIntro("create");
      notify("Offline mode — your WISP is local only.");
    }
  }

  function startUpgrade() { setSeed(genSeed()); setSeedConfirmed(false); setScreen("onboard"); }
  function finishUpgrade() {
    setTier("pro");
    setHiveId("");
    setSeed([]);
    setScreen("app");
    setTab("account");
    notify("You're WISP Pro now. Videos, files and your own Hive are unlocked.");
  }

  async function finishLogin(id, restoredTier) {
    let ok = false;
    if (restoredTier === "pro") {
      const fakeWords = genSeed().join(" ");
      ok = await api.restorePro(id, fakeWords).then(() => true).catch(() => false);
    } else {
      ok = await api.login(id, loginPass || "demo").then(() => true).catch(() => false);
    }
    if (ok) {
      const me = await api.me().catch(() => null);
      if (me) {
        setTier(me.tier || "wisp");
        setWispId(me.wisp_id);
        setUsername(me.username || "");
        setHiveId(me.hive_id || "");
        setMsgKey("");
        const cs = (await api.getCells().catch(() => [])).map(normCell);
        setCells(cs);
        setHiveCfg(null);
        setHivePosts([]);
        setHiveMembers([]);
        setScreen("app");
        setTab("cells");
        setIntro("login");
        notify("WISP restored. Welcome back.");
        return;
      }
    }
    setTier("wisp");
    setWispId(id);
    setMsgKey("");
    setUsername(id.replace("WISP-", "user_"));
    setHiveId("");
    setCells([]);
    setHiveCfg(null);
    setHivePosts([]);
    setHiveMembers([]);
    setScreen("app");
    setTab("cells");
    setIntro("login");
    notify("Offline mode — restored locally.");
  }

  function logout() {
    api.logout().catch(() => {});
    clearSession();
    setTier("wisp");
    setWispId("");
    setHiveId("");
    setMsgKey("");
    setUsername("");
    setLoginPass("");
    setSeed([]);
    setCells([]);
    setActiveCell(null);
    setHiveCfg(null);
    setHiveMembers([]);
    setHivePosts([]);
    setTab("cells");
    setVaultCode("");           // Code löschen → beim nächsten Mal neuen Code nötig
    setVisor(false);
    setScreen("landing");       // zurück zur Taschenrechner-Tarnung
    notify("Logged out.");
  }

  function changeName(name) {
    if (!isPro) return notify("Only WISP Pro can change its name.");
    const v = name.trim();
    if (v.length < 3) return notify("Pick a username with at least 3 characters.");
    setUsername(v);
    notify("Name updated.");
  }

  async function createHive(name) {
    try {
      const res = await api.createHive();
      setHiveId(res.hiveId);
      setHiveCfg({ name: name || "My Hive", key: res.hiveId });
      notify("Hive channel created.");
    } catch (e) { notify(e.message); }
  }

  async function approveMember(id) {
    try { await api.approveMember(id); setHiveMembers((m) => m.map((x) => (x.wisp_id === id ? { ...x, status: "approved" } : x))); } catch (e) { notify(e.message); }
  }

  async function rejectMember(id) {
    try { await api.rejectMember(id); setHiveMembers((m) => m.filter((x) => x.wisp_id !== id)); } catch (e) { notify(e.message); }
  }

  async function destroyHive() {
    try {
      await api.destroyHive();
      setHiveCfg(null);
      setHiveMembers([]);
      setHivePosts([]);
      setHiveId("");
      notify("Hive destroyed. You can create a new one anytime.");
    } catch (e) { notify(e.message); }
  }

  function sendInCell(cellId, msg) {
    const entry = { id: ++msgIdRef.current, from: "me", kind: "text", time: nowTime(), opened: false, ...msg };
    api.sendMessage(cellId, entry.kind, entry.text || entry.content || "").catch(() => {});
    setCells((cs) => cs.map((c) => {
      if (c.id !== cellId) return c;
      return { ...c, lastActivity: Date.now(), seen: true, messages: capPerSender([...(c.messages || []), entry], CELL_MSG_PER_SENDER) };
    }));
  }

  function openCellAttachment(cellId, msgId) {
    setCells((cs) => cs.map((c) =>
      c.id === cellId ? { ...c, messages: (c.messages || []).map((m) => m.id === msgId ? { ...m, opened: true } : m) } : c
    ));
  }

  async function openCell(cellId) {
    setCells((cs) => cs.map((c) => c.id === cellId ? { ...c, seen: true } : c));
    setActiveCell(cellId);
    api.markOpened(cellId).catch(() => {});
  }

  async function startNewCell(peer, key) {
    try {
      const res = await api.openCell(peer, key);
      const existing = cells.find((c) => c.peer_id === peer || c.peer === peer);
      if (existing || res.exists) {
        if (res.cell) {
          setActiveCell(res.cell.id);
          setTab("cells");
          return true;
        }
        setActiveCell(existing.id);
        setTab("cells");
        return true;
      }
      const cell = { ...normCell(res.cell), lastActivity: Date.now(), messages: [], seen: true };
      setCells((cs) => [cell, ...cs]);
      setActiveCell(cell.id);
      setTab("cells");
      return true;
    } catch (e) {
      notify(e.message);
      return false;
    }
  }

  async function unlockCell(cellId, key) {
    try {
      await api.unlockCell(cellId, key);
      setCells((cs) => cs.map((c) => (c.id === cellId ? { ...c, authed: 1 } : c)));
      return true;
    } catch (e) {
      notify(e.message);
      return false;
    }
  }

  async function postToHive(payload) {
    try {
      const p = await api.postToHive(payload.content || payload.text || "");
      setHivePosts((posts) => [...posts, { id: p.id || Date.now(), time: p.time || nowTime(), ...payload }]);
    } catch (e) { notify(e.message); }
  }

  async function loadHive() {
    try {
      const h = await api.getHive();
      if (h.hiveId) {
        setHiveId(h.hiveId);
        setHiveMembers(h.members || []);
        setHivePosts(h.posts || []);
        setHiveCfg({ id: h.hiveId, name: h.hiveId });
      }
    } catch {}
  }

  function useSeedFallback() {
    if (!cells.length && !wispId) {
      setCells(seedCells());
      setHiveMembers(seedHiveMembers());
    }
  }

  const shared = {
    C, mode, toggleMode, lang, setLang,
    tier, isPro, wispId, hiveId, myId: wispId, username, msgKey, loginPass, vaultCode,
    hasHive: isPro && !!hiveId,
    tab, setTab, showVisor, notify, setScreen,
    cells, activeCell, setActiveCell, openCell, sendInCell, openCellAttachment, startNewCell, unlockCell,
    startUpgrade, changeName, logout,
    hiveCfg, createHive, hiveMembers, approveMember, rejectMember, destroyHive,
    hivePosts, postToHive,
  };

  return (
    <div style={{
      fontFamily: FACE_UI,
      background: C.bg,
      color: C.text,
      minHeight: "100vh",
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: "0.01em",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textRendering: "optimizeLegibility",
      transition: "background .3s, color .3s",
      backgroundImage: honeycombBg(C.lineSoft),
      backgroundSize: "56px 96px"
    }}>
      <style>{`
        * { box-sizing: border-box; }
        html { overflow-y: scroll; scrollbar-gutter: stable; }
        body { margin: 0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        button, input, textarea, select { font-family: inherit; letter-spacing: inherit; }
        button { cursor: pointer; border: none; }
        h1, h2, h3, h4 { margin: 0; line-height: 1.2; }
        p { margin: 0; }
        input::placeholder, textarea::placeholder { color: ${C.textDim}; opacity: 0.7; }
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

      {visor ? (
        <Landing C={C} mode={mode} toggleMode={toggleMode} onUnlock={calcUnlock} returning />
      ) : screen === "landing" ? (
        <Landing C={C} mode={mode} toggleMode={toggleMode} onUnlock={calcUnlock} />
      ) : screen === "wisp-landing" ? (
        <WispLanding C={C} onStart={() => setScreen("choice")} onLight={toggleMode} />
      ) : screen === "choice" ? (
        <EntryChoice C={C} lang={lang} setLang={setLang} onCreate={startProfile} onLogin={startLogin} onBack={() => setScreen("wisp-landing")} />
      ) : screen === "profile" ? (
        <Profile C={C} lang={lang} username={username} setUsername={setUsername} loginPass={loginPass} setLoginPass={setLoginPass} onContinue={finishFreeWisp} onBack={() => setScreen("choice")} />
      ) : screen === "onboard" ? (
        <Onboard C={C} lang={lang} seed={seed} confirmed={seedConfirmed} setConfirmed={setSeedConfirmed} onFinish={finishUpgrade} onBack={() => setScreen("app")} />
      ) : screen === "login" ? (
        <Login C={C} lang={lang} onFinish={finishLogin} onBack={() => setScreen("choice")} />
      ) : screen === "app" ? (
        <AppShell {...shared} />
      ) : null}

      {intro && (
        <IntroOverlay C={C} variant={intro} name={username} onDone={() => setIntro(null)} />
      )}
    </div>
  );
}
