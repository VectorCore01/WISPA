import { useState, useEffect, useRef } from "react";
import { FACE_MONO } from "../lib/theme.js";

// --- evaluator ---

const trig = (Math.PI / 180).toString();

const FNS = {
  sqrt: Math.sqrt, sin: () => {}, cos: () => {}, tan: () => {},
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  log: Math.log10, ln: Math.log,
  abs: Math.abs, floor: Math.floor, ceil: Math.ceil,
};

function tokenize(s) {
  const t = [];
  let i = 0;
  while (i < s.length) {
    if (" \t".indexOf(s[i]) !== -1) { i++; continue; }
    if ("0123456789.".indexOf(s[i]) !== -1) {
      let n = "";
      while (i < s.length && "0123456789.".indexOf(s[i]) !== -1) n += s[i++];
      t.push({ t: "num", v: parseFloat(n) });
    } else if ("+-*/×÷^".indexOf(s[i]) !== -1) {
      t.push({ t: "op", v: s[i] === "×" ? "*" : s[i] === "÷" ? "/" : s[i] });
      i++;
    } else if (s[i] === "(" || s[i] === ")") {
      t.push({ t: s[i] === "(" ? "lp" : "rp" }); i++;
    } else if (s[i] === "π") { t.push({ t: "num", v: Math.PI }); i++; }
    else if (s[i] === "!") { t.push({ t: "fact" }); i++; }
    else {
      let w = "";
      while (i < s.length && /[a-z]/i.test(s[i])) w += s[i++];
      if (w === "pi" || w === "π") t.push({ t: "num", v: Math.PI });
      else if (w === "e") t.push({ t: "num", v: Math.E });
      else if (w === "rand") t.push({ t: "num", v: Math.random() });
      else if (FNS[w]) t.push({ t: "fn", v: w });
      else if (w === "mod") t.push({ t: "op", v: "mod" });
      else if (w === "deg") t.push({ t: "num", v: parseFloat(trig) });
      else if (w === "rad") t.push({ t: "num", v: 1 });
      else return null;
    }
  }
  return t;
}

function parse(tokens, deg) {
  let i = 0;
  const peek = () => tokens[i];
  const consume = () => tokens[i++];
  const trigScale = deg ? Math.PI / 180 : 1;

  const sinFn = (x) => Math.sin(x * trigScale);
  const cosFn = (x) => Math.cos(x * trigScale);
  const tanFn = (x) => Math.tan(x * trigScale);

  function expr() {
    let a = term();
    while (peek() && peek().t === "op" && (peek().v === "+" || peek().v === "-")) {
      const op = consume().v; const b = term();
      a = op === "+" ? a + b : a - b;
    }
    return a;
  }

  function term() {
    let a = pow();
    while (peek() && peek().t === "op" && (peek().v === "*" || peek().v === "/" || peek().v === "mod")) {
      const op = consume().v; const b = pow();
      if (op === "mod") a = a % b;
      else a = op === "*" ? a * b : (b !== 0 ? a / b : "Error");
    }
    return a;
  }

  function pow() {
    let a = unary();
    while (peek() && peek().t === "op" && peek().v === "^") {
      consume(); a = Math.pow(a, unary());
    }
    return a;
  }

  function unary() {
    if (peek() && peek().t === "op" && peek().v === "-") { consume(); return -unary(); }
    return atom();
  }

  function atom() {
    if (!peek()) return 0;
    if (peek().t === "num") {
      const v = consume().v;
      if (peek() && peek().t === "fact") { consume(); return factorial(v); }
      return v;
    }
    if (peek().t === "fact") { consume(); return 0; }
    if (peek().t === "lp") {
      consume(); const v = expr();
      if (peek() && peek().t === "rp") consume();
      if (peek() && peek().t === "fact") { consume(); return factorial(v); }
      return v;
    }
    if (peek().t === "fn") {
      const f = consume().v;
      if (peek() && peek().t === "lp") consume();
      const arg = expr();
      if (peek() && peek().t === "rp") consume();
      let v;
      if (f === "sin") v = sinFn(arg);
      else if (f === "cos") v = cosFn(arg);
      else if (f === "tan") v = tanFn(arg);
      else v = FNS[f](arg);
      if (peek() && peek().t === "fact") { consume(); return factorial(v); }
      return v;
    }
    return 0;
  }

  const r = expr();
  return isNaN(r) || !isFinite(r) ? "Error" : r;
}

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return "Error";
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function evalExpr(s, deg) {
  if (s === "Error") return "Error";
  const t = tokenize(s);
  if (!t) return "Error";
  return parse(t, deg);
}

function toFraction(v, maxD) {
  if (v === "Error" || !isFinite(v)) return null;
  if (Number.isInteger(v)) return { n: v, d: 1 };
  const sgn = v < 0 ? -1 : 1;
  v = Math.abs(v);
  let n1 = 0, d1 = 1, n2 = 1, d2 = 0, n = Math.floor(v), d = 1;
  while (d <= maxD) {
    const cand = n / d;
    if (Math.abs(v - cand) < 1e-10) return { n: sgn * n, d };
    const next = n1 + n2; const dnext = d1 + d2;
    if (dnext > maxD) break;
    if (v * dnext > next) { n = next; d = dnext; n1 = next; d1 = dnext; }
    else { n2 = next; d2 = dnext; }
    n = n1 + n2; d = d1 + d2;
  }
  return null;
}

function needsMul(expr) {
  return expr.length > 0 && /[0-9.)πe!]/.test(expr[expr.length - 1]);
}

// --- grid rows ---

const ROW1_NORM = [
  { l: "(", a: "op" }, { l: ")", a: "cp" },
  { l: "π", a: "π" }, { l: "e", a: "e" },
];
const ROW1_2ND = [
  { l: "n!", a: "n!" }, { l: "abs", a: "abs", s: 12 },
  { l: "asin", a: "asin", s: 11 }, { l: "acos", a: "acos", s: 11 },
];

const ROW2_NORM = [
  { l: "x²", a: "x²", s: 14 }, { l: "x³", a: "x³", s: 14 },
  { l: "^", a: "^" }, { l: "log", a: "log", s: 13 },
];
const ROW2_2ND = [
  { l: "atan", a: "atan", s: 11 }, { l: "floor", a: "floor", s: 11 },
  { l: "ceil", a: "ceil", s: 12 }, { l: "mod", a: "mod" },
];

const ROW3_NORM = [
  { l: "sin", a: "sin", s: 13 }, { l: "cos", a: "cos", s: 13 },
  { l: "tan", a: "tan", s: 13 }, { l: "ln", a: "ln", s: 14 },
];
const ROW3_2ND = [
  { l: "rand", a: "rand", s: 11 }, { l: "D/R", a: "dr", s: 11 },
  { l: "√", a: "√", s: 16 }, { l: " ", a: "none" },
];

// --- component ---

export default function Landing({ C, lang, onStart }) {
  const [display, setDisplay] = useState("0");
  const [result, setResult] = useState(null);
  const [mode2, setMode2] = useState(false);
  const [deg, setDeg] = useState(true);

  const refs = useRef({ display, result, deg });
  refs.current.display = display;
  refs.current.result = result;
  refs.current.deg = deg;

  useEffect(() => {
    const fn = (e) => {
      const d = refs.current.display;
      const r = refs.current.result;
      const de = refs.current.deg;
      const s = (v) => setDisplay(v);
      const sr = (v) => setResult(v);
      const op = (ch) => {
        if (r !== null) { s(String(r) + ch); sr(null); return; }
        const last = d.slice(-1);
        s("+-×÷^".indexOf(last) !== -1 ? d.slice(0, -1) + ch : d + ch);
      };
      if (/^[0-9]$/.test(e.key)) {
        if (r !== null) { s(e.key); sr(null); } else { s(d === "0" ? e.key : d + e.key); }
        return;
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
        const v = evalExpr(d, de);
        s(String(v));
        sr(v); return;
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
    if (result !== null) { setDisplay(val); setResult(null); return; }
    setDisplay(display === "0" ? val : display + val);
  };

  const operate = (ch) => {
    if (result !== null) { setDisplay(String(result) + ch); setResult(null); return; }
    const last = display.slice(-1);
    setDisplay("+-×÷^".indexOf(last) !== -1 ? display.slice(0, -1) + ch : display + ch);
  };

  const openParen = () => {
    if (result !== null) { setDisplay("("); setResult(null); return; }
    setDisplay(needsMul(display) ? display + "×(" : display + "(");
  };
  const closeParen = () => { setDisplay(display + ")"); };

  const fnInsert = (name, label) => {
    const ex = name + "(";
    if (result !== null) { setDisplay(ex); setResult(null); return; }
    setDisplay(needsMul(display) ? display + "×" + ex : display + ex);
  };

  const insertConst = (label) => {
    if (result !== null) { setDisplay(label); setResult(null); return; }
    setDisplay(needsMul(display) ? display + "×" + label : display + label);
  };

  const power2 = () => {
    if (result !== null) { setDisplay(String(result) + "^2"); setResult(null); return; }
    setDisplay(needsMul(display) ? display + "^2" : display + "^2");
  };
  const power3 = () => {
    if (result !== null) { setDisplay(String(result) + "^3"); setResult(null); return; }
    setDisplay(needsMul(display) ? display + "^3" : display + "^3");
  };

  const doFactorial = () => {
    if (result !== null) { setDisplay(String(result) + "!"); setResult(null); return; }
    setDisplay(needsMul(display) ? display + "!" : display + "!");
  };

  const insertMod = () => { operate("mod"); };

  const insertRand = () => {
    setDisplay(needsMul(display) ? display + "×rand" : display + "rand");
  };

  const toggleDR = () => {
    setDeg(!deg);
    setDisplay(display);
  };

  const equals = () => {
    const v = evalExpr(display, deg);
    setDisplay(String(v));
    setResult(v);
  };

  const toggleFD = () => {
    if (result !== null && Number.isFinite(result) && result !== "Error") {
      const f = toFraction(result, 1000);
      if (f && f.d !== 1) setDisplay(f.n + "/" + f.d);
    }
  };

  const allClear = () => { setDisplay("0"); setResult(null); };
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

  const B = ({ label, action, light, blue, style: extra, s }) => (
    <button onClick={action} style={{
      border: "none", borderRadius: 10,
      background: blue ? "#4A90D9" : light ? "#E8E8E8" : "#1A1A1A",
      color: blue || !light ? "#FFFFFF" : "#1A1A1A",
      fontSize: s || 18, fontWeight: 600, fontFamily: FACE_MONO,
      cursor: "pointer", aspectRatio: "1",
      display: "flex", alignItems: "center", justifyContent: "center",
      ...(extra || {}),
    }}>{label}</button>
  );

  const grid = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 };

  const row = (btns) => (
    <div style={grid}>
      {btns.map((b, i) => {
        if (b.a === "none") return <div key={i} />;
        const fn = handle2ndAction(b.a);
        const isNum = !b.light && !b.blue;
        return <B key={i} label={b.l} action={fn} light={b.light} blue={b.blue} s={b.s || (isNum ? 18 : 14)} />;
      })}
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#FFFFFF",
      backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='96' viewBox='0 0 56 96'><g fill='none' stroke='#B3D4FF' stroke-width='1.5'><path d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z'/><path d='M28 64 L56 80 L56 96 M28 64 L0 80 L0 96 M56 16 L56 0 M0 16 L0 0'/></g></svg>`)}")`,
      backgroundSize: "56px 96px",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "0 24px", fontFamily: FACE_MONO,
    }}>
      <div style={{
        background: "#FFFFFF", borderRadius: 24, padding: "16px 14px 20px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        width: "100%", maxWidth: 320,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", color: "#6B6B6B" }}>CLCLTR</span>
            <button onClick={() => setMode2(!mode2)} style={{
              background: mode2 ? "#1A1A1A" : "#E8E8E8", border: "none", borderRadius: 4,
              color: mode2 ? "#FFF" : "#1A1A1A", fontSize: 10, fontWeight: 700,
              padding: "2px 6px", cursor: "pointer", fontFamily: FACE_MONO,
            }}>2nd</button>
          </div>
          <button onClick={onStart} style={{
            background: "transparent", border: "none", color: "#6B6B6B",
            fontSize: 12, cursor: "pointer", fontFamily: FACE_MONO,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 14 }}>☽</span> Dark
          </button>
        </div>

        <div style={{
          background: "#F5F5F5", borderRadius: 12, padding: "12px 14px",
          marginBottom: 12, textAlign: "right", fontSize: 22, fontWeight: 700,
          color: "#1A1A1A", fontFamily: FACE_MONO, minHeight: 40,
          letterSpacing: "0.02em", overflow: "hidden", wordBreak: "break-all", lineHeight: 1.3,
        }}>
          {display}
        </div>

        {row(mode2 ? ROW1_2ND : ROW1_NORM)}
        <div style={{ height: 5 }} />
        {row(mode2 ? ROW2_2ND : ROW2_NORM)}
        <div style={{ height: 5 }} />
        {row(mode2 ? ROW3_2ND : ROW3_NORM)}
        <div style={{ height: 5 }} />

        <div style={grid}>
          <B label="C" action={allClear} light s={16} />
          <B label="÷" action={() => operate("÷")} light s={16} />
          <B label="×" action={() => operate("×")} light s={16} />
          <B label="⌫" action={backspace} light s={14} />
          <B label="7" action={() => input("7")} />
          <B label="8" action={() => input("8")} />
          <B label="9" action={() => input("9")} />
          <B label="-" action={() => operate("-")} light s={18} />
          <B label="4" action={() => input("4")} />
          <B label="5" action={() => input("5")} />
          <B label="6" action={() => input("6")} />
          <B label="+" action={() => operate("+")} light s={18} />
          <B label="1" action={() => input("1")} />
          <B label="2" action={() => input("2")} />
          <B label="3" action={() => input("3")} />
          <B label="=" action={equals} blue />
          <B label="0" action={() => input("0")} style={{ aspectRatio: "auto", gridColumn: "span 2" }} />
          <B label="." action={addDot} s={18} />
          <B label="F↔D" action={toggleFD} s={10} light />
        </div>
      </div>

      <div style={{
        position: "fixed", bottom: 12, fontSize: 9, color: "#AAA", letterSpacing: "0.08em",
      }}>
        CLCLTR v2.0 · {deg ? "DEG" : "RAD"}
      </div>
    </div>
  );
}
