import { useState, useEffect, useRef } from "react";
import { FACE_MONO, honeycombBg } from "../../lib/theme.js";
import { evalExpr, toFraction } from "../../lib/calculator/evaluator.js";
import { fmtDisplay } from "../../lib/calculator/formatter.jsx";
import { needsMul } from "../../lib/calculator/lexer.js";
import {
  ROW1_NORM, ROW1_2ND, ROW2_NORM, ROW2_2ND,
  ROW3_NORM, ROW3_2ND,
} from "../../lib/calculator/buttons.js";

// CLCLTR — a real scientific calculator that also hides the WISPA entrance.
// Typing a number and pressing the honeycomb (Cell) logo asks for a code; that
// code unlocks WISPA. `onUnlock(code)` hands the code to the parent.
// `returning` is true when this is the panic-cover shown over a live session.
export default function Landing({ C, mode, toggleMode, onUnlock, onReset, returning, expectedCode }) {
  const K = C.calc;
  const [display, setDisplay] = useState("0");
  const [result, setResult] = useState(null);
  const [lastExpr, setLastExpr] = useState("");
  const [mode2, setMode2] = useState(false);
  const [deg, setDeg] = useState(true);
  const [showFrac, setShowFrac] = useState(false);

  // Setting a code (first time) is hidden: tap the cell to "arm" the typed code,
  // the display silently returns to 0, then the same digits + "=" confirm it.
  const [armCode, setArmCode] = useState(null);
  // Trash on the 2nd page arms a hidden reset: tap it, then "=" wipes the code
  // and logs out — no dialog, nothing shown.
  const [resetArmed, setResetArmed] = useState(false);

  // Activation feel: when the right code unlocks WISPA, the grey honeycomb behind
  // the calculator ignites honey-orange, spreading from the cell logo (top-left)
  // across the whole background — then the parent runs the bloom into WISPA.
  const [activating, setActivating] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const cellRef = useRef(null);

  // Light the grey pattern up from the cell logo, then hand the code to the parent.
  const triggerUnlock = (code) => {
    const el = cellRef.current;
    if (el) { const r = el.getBoundingClientRect(); setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 }); }
    setActivating(true);
    setTimeout(() => { setActivating(false); onUnlock(code); }, 980);
  };

  const refs = useRef({ display, result, deg, showFrac });
  refs.current.display = display;
  refs.current.result = result;
  refs.current.deg = deg;
  refs.current.showFrac = showFrac;
  refs.current.armCode = armCode;
  refs.current.returning = returning;
  refs.current.onUnlock = onUnlock;
  refs.current.resetArmed = resetArmed;
  refs.current.onReset = onReset;
  refs.current.triggerUnlock = triggerUnlock;

  useEffect(() => {
    const fn = (e) => {
      const d = refs.current.display;
      const r = refs.current.result;
      const de = refs.current.deg;
      const s = (v) => setDisplay(v);
      const sr = (v) => setResult(v);
      const op = (ch) => {
        if (r !== null) { s(String(r) + ch); sr(null); setShowFrac(false); return; }
        const last = d.slice(-1);
        s("+-×÷^".indexOf(last) !== -1 ? d.slice(0, -1) + ch : d + ch);
      };
      if (/^[0-9]$/.test(e.key)) {
        if (r !== null) { s(e.key); sr(null); } else { s(d === "0" ? e.key : d + e.key); }
        setShowFrac(false); return;
      }
      if (e.key === ".") {
        if (r !== null) { s("0."); sr(null); return; }
        const parts = d.split(/[+\-×÷^()]/);
        if (!parts[parts.length - 1].includes(".")) s(d + ".");
        return;
      }
      if (e.key === "+") { op("+"); return; }
      if (e.key === "-") { op("-"); return; }
      if (e.key === "*") { op("×"); return; }
      if (e.key === "/") { e.preventDefault(); op("÷"); return; }
      if (e.key === "^") { op("^"); return; }
      if (e.key === "(") {
        if (r !== null) { s("("); sr(null); return; }
        s(needsMul(d) ? d + "×(" : d + "(");
        return;
      }
      if (e.key === ")") { s(d + ")"); return; }
      if (e.key === "Enter" || e.key === "=") {
        if (refs.current.resetArmed) {
          setResetArmed(false); s("0"); sr(null); setShowFrac(false); setLastExpr("");
          refs.current.onReset && refs.current.onReset();
          return;
        }
        if (refs.current.armCode != null) {
          const ac = refs.current.armCode;
          setArmCode(null); s("0"); sr(null); setShowFrac(false); setLastExpr("");
          if (d === ac) refs.current.triggerUnlock(ac);
          return;
        }
        const v = evalExpr(d, de);
        setLastExpr(d);
        s(String(v));
        sr(v); setShowFrac(false); return;
      }
      if (e.key === "Backspace") {
        if (r !== null) { s("0"); sr(null); return; }
        s(d.length > 1 ? d.slice(0, -1) : "0"); return;
      }
      if (e.key === "Escape" || e.key === "Delete") { s("0"); sr(null); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const input = (val) => {
    if (result !== null) { setDisplay(val); setResult(null); setShowFrac(false); return; }
    setDisplay(display === "0" ? val : display + val);
    setShowFrac(false);
  };

  const operate = (ch) => {
    if (result !== null) { setDisplay(String(result) + ch); setResult(null); setShowFrac(false); return; }
    const last = display.slice(-1);
    setDisplay("+-×÷^".indexOf(last) !== -1 ? display.slice(0, -1) + ch : display + ch);
    setShowFrac(false);
  };

  const openParen = () => {
    if (result !== null) { setDisplay("("); setResult(null); return; }
    setDisplay(needsMul(display) ? display + "×(" : display + "(");
  };
  const closeParen = () => { setDisplay(display + ")"); };

  const fnInsert = (name) => {
    const ex = name + "(";
    if (result !== null) { setDisplay(ex); setResult(null); setShowFrac(false); return; }
    setDisplay(needsMul(display) ? display + "×" + ex : display + ex);
    setShowFrac(false);
  };

  const insertConst = (label) => {
    if (result !== null) { setDisplay(label); setResult(null); setShowFrac(false); return; }
    setDisplay(needsMul(display) ? display + "×" + label : display + label);
    setShowFrac(false);
  };

  const power2 = () => {
    if (result !== null) { setDisplay(String(result) + "^2"); setResult(null); setShowFrac(false); return; }
    setDisplay(needsMul(display) ? display + "^2" : display + "^2");
    setShowFrac(false);
  };
  const power3 = () => {
    if (result !== null) { setDisplay(String(result) + "^3"); setResult(null); setShowFrac(false); return; }
    setDisplay(needsMul(display) ? display + "^3" : display + "^3");
    setShowFrac(false);
  };

  const doFactorial = () => {
    if (result !== null) { setDisplay(String(result) + "!"); setResult(null); setShowFrac(false); return; }
    setDisplay(needsMul(display) ? display + "!" : display + "!");
    setShowFrac(false);
  };

  const insertMod = () => { operate("mod"); };
  const insertRand = () => {
    setDisplay(needsMul(display) ? display + "×rand" : display + "rand");
    setShowFrac(false);
  };

  const toggleDR = () => { setDeg(!deg); };

  // ± — toggle the sign of a plain number (the common case, like a phone).
  const negate = () => {
    if (result !== null) { const v = -result; setDisplay(String(v)); setResult(v); setShowFrac(false); return; }
    if (/^-?\d*\.?\d+$/.test(display)) {
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
    }
  };

  // % — turn the trailing number into a percentage of itself (50 → 0.5).
  const percent = () => {
    if (result !== null) { const v = result / 100; setDisplay(String(v)); setResult(v); setShowFrac(false); return; }
    const m = display.match(/(\d*\.?\d+)$/);
    if (!m) return;
    const v = parseFloat(m[1]) / 100;
    setDisplay(display.slice(0, display.length - m[1].length) + String(v));
    setShowFrac(false);
  };

  const equals = () => {
    // Hidden reset: trash was tapped, "=" wipes the code and logs out — silently.
    if (resetArmed) {
      setResetArmed(false); clearAll();
      onReset && onReset();
      return;
    }
    // While a code is armed, "=" confirms it: matching digits unlock, anything
    // else just silently clears (looks like an ordinary calculator).
    if (armCode != null) {
      const ac = armCode;
      setArmCode(null); clearAll();
      if (display === ac) triggerUnlock(ac);
      return;
    }
    const v = evalExpr(display, deg);
    setLastExpr(display);
    setDisplay(String(v));
    setResult(v);
    setShowFrac(false);
  };

  const toggleFD = () => {
    if (result !== null && Number.isFinite(result) && result !== "Error") {
      if (showFrac) {
        setDisplay(String(result));
        setShowFrac(false);
      } else {
        const f = toFraction(result, 1000);
        if (f && f.d !== 1) {
          setDisplay(f.n + "/" + f.d);
          setShowFrac(true);
        }
      }
    }
  };

  const allClear = () => { setDisplay("0"); setResult(null); setShowFrac(false); setLastExpr(""); setArmCode(null); setResetArmed(false); };
  const backspace = () => {
    if (result !== null) { allClear(); return; }
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  };
  const addDot = () => {
    if (result !== null) { setDisplay("0."); setResult(null); return; }
    const parts = display.split(/[+\-×÷^()]/);
    if (!parts[parts.length - 1].includes(".")) setDisplay(display + ".");
  };

  const handle2ndAction = (action) => {
    switch (action) {
      case "op": return openParen;
      case "cp": return closeParen;
      case "π": return () => insertConst("π");
      case "e": return () => insertConst("e");
      case "x²": return power2;
      case "x³": return power3;
      case "^": return () => operate("^");
      case "log": return () => fnInsert("log");
      case "sin": return () => fnInsert("sin");
      case "cos": return () => fnInsert("cos");
      case "tan": return () => fnInsert("tan");
      case "ln": return () => fnInsert("ln");
      case "√": return () => fnInsert("sqrt");
      case "n!": return doFactorial;
      case "abs": return () => fnInsert("abs");
      case "asin": return () => fnInsert("asin");
      case "acos": return () => fnInsert("acos");
      case "atan": return () => fnInsert("atan");
      case "floor": return () => fnInsert("floor");
      case "ceil": return () => fnInsert("ceil");
      case "mod": return insertMod;
      case "rand": return insertRand;
      case "dr": return toggleDR;
      default: return () => {};
    }
  };

  const clearAll = () => { setDisplay("0"); setResult(null); setShowFrac(false); setLastExpr(""); };

  // The secret entrance: type a 4-digit number, then tap the honeycomb.
  // Anything that is not exactly 4 digits leaves it a dead logo, drawing no attention.
  // Returning from the panic cover: the 4 digits are checked straight away (parent
  //   plays the honeycomb burst only if the code is right).
  // First time: tapping the cell silently "arms" the code and resets to 0 — you
  //   then re-type the same digits and press "=" to confirm (no dialog, hidden).
  const tapCell = () => {
    if (!/^\d{4}$/.test(display)) return;
    const c = display;
    clearAll();
    if (returning) {
      // Wrong code on the panic cover: hand it straight to the parent (it rejects);
      // only ignite the honeycomb when the code is actually right.
      if (expectedCode && c !== expectedCode) { onUnlock(c); return; }
      triggerUnlock(c); return;
    }
    setArmCode(c);
  };

  const B = ({ label, action, kind, style: extra, s }) => {
    const bg = kind === "op" ? K.op : kind === "fn" ? K.fn : K.num;
    const fg = kind === "op" ? K.opText : kind === "fn" ? K.fnText : K.numText;
    return (
      <button onClick={action} style={{
        border: "none", borderRadius: 12,
        background: bg, color: fg,
        fontSize: s || 18, fontWeight: 600, fontFamily: FACE_MONO,
        cursor: "pointer", aspectRatio: "1",
        display: "flex", alignItems: "center", justifyContent: "center",
        ...(extra || {}),
      }}>{label}</button>
    );
  };

  const grid = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 };

  const row = (btns) => (
    <div style={grid}>
      {btns.map((b, i) => {
        if (b.a === "none") return <div key={i} />;
        if (b.a === "reset") return (
          <button key={i} onClick={() => { setArmCode(null); setResetArmed(true); }} aria-label="reset" style={{
            border: "none", borderRadius: 12, background: K.fn, color: K.fnText,
            aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        );
        const fn = handle2ndAction(b.a);
        return <B key={i} label={b.l} action={fn} kind="fn" s={b.s || 14} />;
      })}
    </div>
  );

  const fracLabel = showFrac ? "→Dec" : "→Frac";

  // Honeycomb cell — both the WISPA mark and the hidden trigger.
  const CellMark = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={K.op} strokeWidth="2" strokeLinejoin="round">
      <polygon points="12,2.5 20,7 20,17 12,21.5 4,17 4,7" />
    </svg>
  );

  return (
    <div translate="no" className="notranslate" style={{
      minHeight: "100vh", background: K.page,
      backgroundImage: honeycombBg(K.cellGrid, 0.5),
      backgroundSize: "56px 96px",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "0 24px", fontFamily: FACE_MONO,
      transition: "background-color .1s linear",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes calcFade { from { opacity: 1; transform: scale(1); filter: blur(0); } to { opacity: 0; transform: scale(.96); filter: blur(2px); } }
        @keyframes calcIgnite {
          0%   { opacity: 0; clip-path: circle(0px at var(--ox) var(--oy)); }
          18%  { opacity: 1; }
          100% { opacity: 1; clip-path: circle(160vmax at var(--ox) var(--oy)); }
        }
        @keyframes calcGlowCore { 0% { opacity: 0; } 32% { opacity: 1; } 100% { opacity: 0; } }
      `}</style>

      {/* Activation: the calculator fades, revealing the grey honeycomb, which then
          ignites honey-orange from the cell logo — then WISPA appears. */}
      {activating && (
        <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none", "--ox": origin.x + "px", "--oy": origin.y + "px" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: honeycombBg(K.op, 0.8), backgroundSize: "56px 96px", filter: `drop-shadow(0 0 6px ${K.op})`, animation: "calcIgnite .72s ease-out .2s both" }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at var(--ox) var(--oy), ${K.op}55, transparent 60%)`, animation: "calcGlowCore .85s ease-out .2s both" }} />
        </div>
      )}

      <div style={{
        background: K.card, borderRadius: 26, padding: "16px 14px 20px",
        boxShadow: mode === "dark" ? "0 16px 50px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.10)",
        width: "100%", maxWidth: 330, position: "relative",
        animation: activating ? "calcFade .45s ease forwards" : undefined,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <button onClick={tapCell} aria-label="menu" ref={cellRef} style={{
              background: "transparent", border: "none", padding: 0, cursor: "pointer",
              display: "flex", alignItems: "center",
            }}>
              <CellMark size={20} />
            </button>
            <button onClick={() => window.location.reload()} aria-label="CLCLTR" style={{
              background: "transparent", border: "none", padding: 0, cursor: "pointer",
              fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", color: K.muted, fontFamily: FACE_MONO,
            }}>CLCLTR</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setMode2(!mode2)} style={{
              background: mode2 ? K.op : K.fn, border: "none", borderRadius: 5,
              color: mode2 ? K.opText : K.fnText, fontSize: 10, fontWeight: 700,
              padding: "3px 7px", cursor: "pointer", fontFamily: FACE_MONO,
            }}>2nd</button>
            <button onClick={toggleMode} aria-label="theme" style={{
              background: K.fn, border: "none", borderRadius: 5, color: K.fnText,
              fontSize: 13, cursor: "pointer", width: 28, height: 24, padding: 0,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>{mode === "dark" ? "☀" : "☾"}</button>
          </div>
        </div>

        <div style={{
          background: K.display, borderRadius: 14, padding: "12px 14px",
          marginBottom: 12, textAlign: "right", fontFamily: FACE_MONO,
          color: K.displayText, minHeight: 64, overflow: "hidden",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
        }}>
          <div style={{ fontSize: 12, color: K.muted, minHeight: 16, letterSpacing: "0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {lastExpr}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.02em", wordBreak: "break-all", lineHeight: 1.3 }}>
            {fmtDisplay(display, showFrac)}
          </div>
        </div>

        {row(mode2 ? ROW1_2ND : ROW1_NORM)}
        <div style={{ height: 6 }} />
        {row(mode2 ? ROW2_2ND : ROW2_NORM)}
        <div style={{ height: 6 }} />
        {row(mode2 ? ROW3_2ND : ROW3_NORM)}
        <div style={{ height: 6 }} />

        <div style={grid}>
          <B label="C" action={allClear} kind="fn" s={16} />
          <B label="±" action={negate} kind="fn" s={18} />
          <B label="%" action={percent} kind="fn" s={16} />
          <B label="⌫" action={backspace} kind="fn" s={14} />
          <B label="7" action={() => input("7")} />
          <B label="8" action={() => input("8")} />
          <B label="9" action={() => input("9")} />
          <B label="÷" action={() => operate("÷")} kind="op" s={20} />
          <B label="4" action={() => input("4")} />
          <B label="5" action={() => input("5")} />
          <B label="6" action={() => input("6")} />
          <B label="×" action={() => operate("×")} kind="op" s={20} />
          <B label="1" action={() => input("1")} />
          <B label="2" action={() => input("2")} />
          <B label="3" action={() => input("3")} />
          <B label="-" action={() => operate("-")} kind="op" s={22} />
          <B label={fracLabel} action={toggleFD} kind="fn" s={11} />
          <B label="0" action={() => input("0")} />
          <B label="." action={addDot} s={20} />
          <B label="+" action={() => operate("+")} kind="op" s={22} />
          <B label="=" action={equals} kind="op" style={{ aspectRatio: "auto", gridColumn: "span 4", height: 52 }} s={22} />
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 9, color: K.muted, letterSpacing: "0.08em", opacity: 0.7 }}>
        CLCLTR v2.0 · {deg ? "DEG" : "RAD"}
      </div>
    </div>
  );
}
