import { useState, useRef, useEffect } from "react";
import { THEMES, FACE_UI, honeycombBg, HONEY } from "../lib/theme.js";
import { genSeed, genWispId, genMsgKey, genHiveId } from "../lib/id.js";
import { capPerSender, CELL_MSG_PER_SENDER } from "../lib/cell.js";
import { nowTime } from "../lib/time.js";
import { seedCells, seedHiveMembers } from "../lib/seed.js";
import { lookupPeer } from "../lib/directory.js";
import { loadSession, saveSession, clearSession } from "../lib/session.js";
import { t } from "../lib/translations.js";
import { api, normCell } from "../lib/api.js";
import { useHoney } from "../lib/useHoney.js";
import Landing from "./Landing.jsx";
import WispLanding from "./WispLanding.jsx";
import EntryChoice from "./EntryChoice.jsx";
import Profile from "./Profile.jsx";
import Onboard from "./Onboard.jsx";
import Login from "./Login.jsx";
import AppShell from "./AppShell.jsx";
import IntroOverlay from "./IntroOverlay.jsx";
import Modal from "./Modal.jsx";
import CellBloom from "./CellBloom.jsx";

export default function WispaPrototype() {
  const saved = loadSession();

  const [mode, setMode] = useState(saved.mode === "light" ? "light" : "dark");
  const C = THEMES[mode];
  function toggleMode() { setMode((m) => (m === "dark" ? "light" : "dark")); }

  // Vault-Code: beim Eintritt über die Cell-Taste gesetzt (4 Ziffern), ersetzt in
  // WISPA den 6-stelligen Cell-Key. Bleibt über das Aktualisieren erhalten und
  // wird erst beim Logout gelöscht.
  const [vaultCode, setVaultCode] = useState(saved.vaultCode || "");
  // Die Account-Seite ist extra geschützt: bei jedem Wechsel dorthin muss der
  // Code erneut eingegeben werden.
  const [accountGate, setAccountGate] = useState(false);
  const [accountInput, setAccountInput] = useState("");
  // Honeycomb success animation shown over the calculator→WISPA transition.
  const [unlockBurst, setUnlockBurst] = useState(false);
  // Wrong-code attempts; three in a row logs out automatically.
  const triesRef = useRef(0);

  const [lang, setLang] = useState("en");
  // On refresh we stay exactly where we were. Only "app" needs a wispId to be
  // valid; everything else (gatekeeper, choice, login…) restores as-is.
  const [screen, setScreen] = useState(
    saved.screen ? (saved.screen === "app" && !saved.wispId ? "landing" : saved.screen) : "landing"
  );
  const [tier, setTier] = useState(saved.tier || "wisp");

  // Honey currency — state + operations live in their own hook. Declared after
  // `tier` because the hook reads it (free vs Pro expiry).
  const {
    honey, honeyGifted, honeyExpiry,
    addHoney, buyHoney, spendHoney, giftHoney,
    grantWelcomeHoney, makeHoneyPermanent, resetHoney,
  } = useHoney({ tier, notify, saved });

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
  // Whether the calculator cover is on top. Persisted so that reloading while the
  // calculator is showing keeps the calculator — WISPA is only reachable by code.
  const [visor, setVisor] = useState(!!saved.visor);
  const [intro, setIntro] = useState(null); // "create" | "login" | null
  const prevRef = useRef(null);
  // Best-effort screenshot deterrent (a web page can't truly block captures).
  const [obscured, setObscured] = useState(false);

  function showVisor() {
    prevRef.current = screen;
    setVisor(true);
  }

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    saveSession({ screen, tier, wispId, hiveId, msgKey, username, tab, hiveCfg, mode, vaultCode, visor, honey, honeyGifted, honeyExpiry });
  }, [screen, tier, wispId, hiveId, msgKey, username, tab, hiveCfg, mode, vaultCode, visor, honey, honeyGifted, honeyExpiry]);

  // Screenshot deterrent (best-effort on the web): block the right-click "save"
  // menu, clear the clipboard on PrintScreen, and cover the screen whenever the
  // window loses focus (so app-switcher previews / off-focus captures show nothing).
  useEffect(() => {
    const onCtx = (e) => e.preventDefault();
    const onKey = (e) => {
      if (e.key === "PrintScreen") {
        try { navigator.clipboard && navigator.clipboard.writeText(" "); } catch {}
        notify("Screenshots are discouraged in WISPA.");
      }
    };
    const hide = () => setObscured(true);
    const show = () => setObscured(false);
    const onVis = () => setObscured(document.hidden);
    document.addEventListener("contextmenu", onCtx);
    window.addEventListener("keyup", onKey);
    window.addEventListener("blur", hide);
    window.addEventListener("focus", show);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", show);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After a refresh that lands back in the app, repopulate cells and hive so the
  // session is usable again (the login fetch is skipped on reload).
  useEffect(() => {
    if (screen === "app" && wispId) {
      api.getCells().then((cs) => setCells(cs.map(normCell))).catch(() => {});
      loadHive();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Account is gated: route there only after the code is re-entered.
  function goTab(id) {
    if (id === "account") { setAccountInput(""); setAccountGate(true); return; }
    setTab(id);
  }
  function submitAccountGate() {
    if (accountInput === vaultCode && vaultCode) {
      triesRef.current = 0;
      setAccountGate(false); setAccountInput(""); setTab("account");
    } else {
      setAccountInput("");
      wrongCode();
    }
  }

  // Notfall vom Taschenrechner aus (Mülleimer auf der 2nd-Seite) oder nach 3
  // Fehlversuchen: Access-Code löschen und aus WISPA abmelden.
  function resetAccess(silent) {
    triesRef.current = 0;
    setAccountGate(false);
    logout(true);
    if (!silent) notify("Access code cleared — you've been logged out.");
  }

  // A wrong code anywhere (panic unlock / account gate). Three strikes → logout.
  function wrongCode() {
    triesRef.current += 1;
    if (triesRef.current >= 3) { resetAccess(); return; }
    const left = 3 - triesRef.current;
    notify(`Wrong code — ${left} ${left === 1 ? "try" : "tries"} left.`);
  }

  // Honeycomb burst over the transition, then run the screen change.
  function runUnlockBurst(after) {
    setUnlockBurst(true);
    setTimeout(() => { setUnlockBurst(false); after(); }, 1300);
  }

  // Called by the calculator after a 4-digit code is entered + the cell tapped.
  // From the panic cover (visor) we only return when the code matches — and only
  // then play the animation. From the cover the (already confirmed) code is set
  // and opens WISPA.
  function calcUnlock(code) {
    if (visor) {
      if (vaultCode && code !== vaultCode) { wrongCode(); return; }
      triesRef.current = 0;
      // Returning from the panic cover: always land on Cells.
      runUnlockBurst(() => { setTab("cells"); setVisor(false); });
      return;
    }
    setVaultCode(code);
    triesRef.current = 0;
    if (wispId) {
      // Already signed in → straight to Cells, every time.
      runUnlockBurst(() => { setTab("cells"); setScreen("app"); });
    } else {
      // No session yet → straight to sign in / create (no gatekeeper in between).
      runUnlockBurst(() => setScreen("choice"));
    }
  }

  function notify(msg) { setToast(msg); setTimeout(() => setToast(null), 2600); }

  function startProfile() { setUsername(""); setLoginPass(""); setScreen("profile"); }
  function startLogin() { setScreen("login"); }

  async function finishFreeWisp() {
    // One free WISP per device every 24h (tracked locally on this device).
    const DAY = 24 * 60 * 60 * 1000;
    let last = 0;
    try { last = Number(localStorage.getItem("wispa_free_device") || 0); } catch {}
    if (last && Date.now() - last < DAY) {
      const hrs = Math.ceil((DAY - (Date.now() - last)) / 3600000);
      return notify(`One free WISP per device every 24h. Try again in ~${hrs}h — or go Pro.`);
    }
    try { localStorage.setItem("wispa_free_device", String(Date.now())); } catch {}

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
      grantWelcomeHoney();
      setScreen("app");
      setTab("cells");
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
      grantWelcomeHoney();
      setScreen("app");
      setTab("cells");
      setIntro("create");
      notify("Offline mode — your WISP is local only.");
    }
  }

  function startUpgrade() { setSeed(genSeed()); setSeedConfirmed(false); setScreen("onboard"); }
  function finishUpgrade() {
    setTier("pro");
    setHiveId("");
    setSeed([]);
    makeHoneyPermanent(); // Pro Honey no longer expires
    setScreen("app");
    setTab("cells");
    notify("You're WISP Pro now. Your Honey is permanent and your own Hive is unlocked.");
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

  function logout(silent) {
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
    resetHoney();
    setVaultCode("");           // Code löschen → beim nächsten Mal neuen Code nötig
    setVisor(false);
    setScreen("landing");       // zurück zur Taschenrechner-Tarnung
    if (!silent) notify("Logged out.");
  }

  function changeName(name, password) {
    const v = name.trim();
    if (v.length < 3) return notify("Pick a username with at least 3 characters.");
    if (!password) return notify("Enter your password to change the name.");
    if (loginPass && password !== loginPass) return notify("Wrong password.");
    setUsername(v);
    notify("Name updated.");
  }

  async function createHive(name) {
    if (!isPro) return notify("Only WISP Pro can create a Hive.");
    if (honey < HONEY.hiveCreate) return notify(`Creating a Hive costs ${HONEY.hiveCreate} Honey.`);
    spendHoney(HONEY.hiveCreate);
    let id;
    try { id = (await api.createHive()).hiveId; } catch { id = genHiveId(); }
    setHiveId(id);
    setHiveCfg({ name: name || "My Hive", key: id, honey: HONEY.hiveCreate });
    notify("Hive created.");
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
      // Established with the peer's message key — you can chat right away.
      const cell = { ...normCell(res.cell), authed: 1, lastActivity: Date.now(), messages: [], seen: true };
      setCells((cs) => [cell, ...cs]);
      setActiveCell(cell.id);
      setTab("cells");
      return true;
    } catch (e) {
      notify(e.message);
      return false;
    }
  }

  // The message key is only needed once (to start a cell). Opening an existing
  // chat afterwards is unlocked with your own PIN — the calculator access code.
  function unlockCell(cellId, pin) {
    if (!vaultCode || pin !== vaultCode) { notify("Wrong PIN."); return false; }
    setCells((cs) => cs.map((c) => (c.id === cellId ? { ...c, authed: 1 } : c)));
    return true;
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
    honey, honeyExpiry, addHoney, buyHoney, spendHoney, giftHoney,
    tab, setTab: goTab, showVisor, notify, setScreen,
    cells, activeCell, setActiveCell, openCell, sendInCell, openCellAttachment, startNewCell, unlockCell,
    startUpgrade, changeName, logout,
    hiveCfg, createHive, hiveMembers, approveMember, rejectMember, destroyHive,
    hivePosts, postToHive,
  };

  return (
    <div className="app-root" style={{
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
      transition: "background-color .1s linear, color .1s linear",
      backgroundImage: honeycombBg(C.accent, 0.28),
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
        img, video { -webkit-user-drag: none; user-select: none; }
        button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
        /* Light/Dark wechselt schnell wie ein Lichtschalter (nur kurz entkantet) */
        .app-root, .app-root * { transition: background-color .1s linear, color .1s linear, border-color .1s linear, fill .1s linear, stroke .1s linear, box-shadow .1s linear; }
        @keyframes rise { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes drift { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
        @keyframes burn { from { opacity: 1; transform: scale(1) } to { opacity: 0; transform: scale(0.96) } }
        @keyframes blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
        @keyframes hexBurst { 0% { opacity: .55; transform: scale(.5); } 100% { opacity: 0; transform: scale(2.7); } }
        @keyframes hexPop { 0% { opacity: 0; transform: scale(.35) rotate(-12deg); } 55% { opacity: 1; transform: scale(1.18) rotate(4deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
        @keyframes spin360 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)", background: C.text, color: C.bg, padding: "10px 18px", borderRadius: 4, fontWeight: 600, fontSize: 14, zIndex: 50, boxShadow: "0 8px 30px rgba(0,0,0,.4)", animation: "rise .25s ease" }}>
          {toast}
        </div>
      )}

      {unlockBurst && <CellBloom C={C} />}

      {obscured && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: C.bg, backgroundImage: honeycombBg(C.accent, 0.5), backgroundSize: "56px 96px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.6" strokeLinejoin="round">
            <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill={C.accent + "1f"} />
            <path d="M9.5 11V9.2a2.5 2.5 0 0 1 5 0V11" /><rect x="8.4" y="11" width="7.2" height="6" rx="1.2" fill={C.accent} stroke="none" />
          </svg>
          <div style={{ fontFamily: FACE_UI, fontSize: 14, fontWeight: 700, letterSpacing: "0.3em", color: C.textDim }}>WISPA · HIDDEN</div>
        </div>
      )}

      {visor ? (
        <Landing C={C} mode={mode} toggleMode={toggleMode} onUnlock={calcUnlock} onReset={() => resetAccess(true)} returning />
      ) : screen === "landing" ? (
        <Landing C={C} mode={mode} toggleMode={toggleMode} onUnlock={calcUnlock} onReset={() => resetAccess(true)} />
      ) : screen === "wisp-landing" ? (
        <WispLanding C={C} mode={mode} onStart={() => setScreen("choice")} onLight={toggleMode} onCalc={showVisor} />
      ) : screen === "choice" ? (
        <EntryChoice C={C} mode={mode} toggleMode={toggleMode} lang={lang} setLang={setLang} onCreate={startProfile} onLogin={startLogin} onBack={() => setScreen("landing")} onCalc={showVisor} />
      ) : screen === "profile" ? (
        <Profile C={C} lang={lang} username={username} setUsername={setUsername} loginPass={loginPass} setLoginPass={setLoginPass} onContinue={finishFreeWisp} onBack={() => setScreen("choice")} onCalc={showVisor} />
      ) : screen === "onboard" ? (
        <Onboard C={C} lang={lang} seed={seed} confirmed={seedConfirmed} setConfirmed={setSeedConfirmed} onFinish={finishUpgrade} onBack={() => setScreen("app")} />
      ) : screen === "login" ? (
        <Login C={C} lang={lang} onFinish={finishLogin} onBack={() => setScreen("choice")} onCalc={showVisor} />
      ) : screen === "app" ? (
        <AppShell {...shared} />
      ) : null}

      {intro && (
        <IntroOverlay C={C} variant={intro} name={username} onDone={() => setIntro(null)} />
      )}

      {accountGate && (
        <Modal C={C} onClose={() => setAccountGate(false)}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", color: C.text, marginBottom: 6 }}>ENTER YOUR CODE</div>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 16, lineHeight: 1.5 }}>Your 4-digit access code is needed to open your account.</div>
          <input
            autoFocus type="password" inputMode="numeric" maxLength={4} value={accountInput}
            onChange={(e) => setAccountInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onKeyDown={(e) => { if (e.key === "Enter") submitAccountGate(); if (e.key === "Escape") setAccountGate(false); }}
            placeholder="• • • •"
            style={{ width: "100%", background: C.bg, border: `1px solid ${C.line}`, outline: "none", borderRadius: 10, padding: "13px 14px", color: C.text, fontSize: 20, fontFamily: FACE_UI, textAlign: "center", letterSpacing: "0.4em", marginBottom: 14 }}
          />
          <button onClick={submitAccountGate} style={{ width: "100%", background: C.accent, color: C.onAccent, border: "none", borderRadius: 10, padding: "13px 0", fontSize: 13, fontWeight: 700, letterSpacing: "0.18em", cursor: "pointer" }}>UNLOCK</button>
          <button onClick={() => setAccountGate(false)} style={{ width: "100%", background: "transparent", color: C.textDim, border: "none", padding: "10px 0 0", fontSize: 12, cursor: "pointer" }}>cancel</button>
        </Modal>
      )}
    </div>
  );
}
