import { useState } from "react";
import { FACE_MONO } from "../lib/theme.js";

// --- expression evaluator (recursive descent) ---

const FNS = { sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan, log: Math.log10, ln: Math.log };

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
      t.push({ t: s[i] === "(" ? "lp" : "rp" });
      i++;
    } else if (s[i] === "π") { t.push({ t: "num", v: Math.PI }); i++; }
    else if (s[i] === "e" && !/[a-z]/i.test(s[i + 1])) { t.push({ t: "num", v: Math.E }); i++; }
    else {
      let w = "";
      while (i < s.length && /[a-z]/i.test(s[i])) w += s[i++];
      if (w === "pi") { t.push({ t: "num", v: Math.PI }); }
      else if (w === "e") { t.push({ t: "num", v: Math.E }); }
      else if (FNS[w]) { t.push({ t: "fn", v: w }); }
      else { return null; }
    }
  }
  return t;
}

function parse(tokens) {
  let i = 0;
  function peek() { return tokens[i]; }
  function consume() { return tokens[i++]; }

  function parseExpr() {
    let a = parseTerm();
    while (peek() && peek().t === "op" && (peek().v === "+" || peek().v === "-")) {
      const op = consume().v;
      const b = parseTerm();
      a = op === "+" ? a + b : a - b;
    }
    return a;
  }

  function parseTerm() {
    let a = parsePow();
    while (peek() && peek().t === "op" && (peek().v === "*" || peek().v === "/")) {
      const op = consume().v;
      const b = parsePow();
      a = op === "*" ? a * b : (b !== 0 ? a / b : "Error");
    }
    return a;
  }

  function parsePow() {
    let a = parseUnary();
    while (peek() && peek().t === "op" && peek().v === "^") {
      consume();
      const b = parseUnary();
      a = Math.pow(a, b);
    }
    return a;
  }

  function parseUnary() {
    if (peek() && peek().t === "op" && peek().v === "-") {
      consume();
      return -parseUnary();
    }
    return parseAtom();
  }

  function parseAtom() {
    if (!peek()) return 0;
    if (peek().t === "num") return consume().v;
    if (peek().t === "lp") {
      consume();
      const v = parseExpr();
      if (peek() && peek().t === "rp") consume();
      return v;
    }
    if (peek().t === "fn") {
      const f = consume().v;
      if (peek() && peek().t === "lp") consume();
      const arg = parseExpr();
      if (peek() && peek().t === "rp") consume();
      return FNS[f](arg);
    }
    return 0;
  }

  const r = parseExpr();
  return isNaN(r) || !isFinite(r) ? "Error" : r;
}

function evalExpr(s) {
  const t = tokenize(s);
  if (!t) return "Error";
  return parse(t);
}

// --- helpers for inserting functions with auto-paren ---

function needsParenBefore(expr) {
  if (!expr.length) return false;
  const c = expr[expr.length - 1];
  return /[0-9.)πe]/.test(c);
}

// --- component ---

export default function Landing({ C, lang, onStart }) {
  const [display, setDisplay] = useState("0");
  const [result, setResult] = useState(null);

  const input = (val) => {
    if (result !== null) { setDisplay(val); setResult(null); return; }
    setDisplay(display === "0" ? val : display + val);
  };

  const operate = (op) => {
    if (result !== null) { setDisplay(String(result) + op); setResult(null); return; }
    const last = display.slice(-1);
    if ("+-×÷^".indexOf(last) !== -1) {
      setDisplay(display.slice(0, -1) + op);
    } else {
      setDisplay(display + op);
    }
  };

  const openParen = () => {
    if (result !== null) { setDisplay("("); setResult(null); return; }
    if (needsParenBefore(display)) setDisplay(display + "×(");
    else setDisplay(display + "(");
  };

  const closeParen = () => {
    setDisplay(display + ")");
  };

  const fnInsert = (name) => {
    const expr = name + "(";
    if (result !== null) { setDisplay(expr); setResult(null); return; }
    if (needsParenBefore(display)) setDisplay(display + "×" + expr);
    else setDisplay(display + expr);
  };

  const insertConst = (label) => {
    if (result !== null) { setDisplay(label); setResult(null); return; }
    if (needsParenBefore(display)) setDisplay(display + "×" + label);
    else setDisplay(display + label);
  };

  const power2 = () => {
    if (result !== null) { setDisplay(String(result) + "^2"); setResult(null); return; }
    if (needsParenBefore(display)) setDisplay(display + "^2");
    else setDisplay(display + "^2");
  };

  const power3 = () => {
    if (result !== null) { setDisplay(String(result) + "^3"); setResult(null); return; }
    if (needsParenBefore(display)) setDisplay(display + "^3");
    else setDisplay(display + "^3");
  };

  const equals = () => {
    const v = evalExpr(display);
    setDisplay(String(v));
    setResult(v);
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

  const grid = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 };

  return (
    <div style={{
      minHeight: "100vh", background: "#FFFFFF",
      backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='96' viewBox='0 0 56 96'><g fill='none' stroke='#B3D4FF' stroke-width='1.5'><path d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z'/><path d='M28 64 L56 80 L56 96 M28 64 L0 80 L0 96 M56 16 L56 0 M0 16 L0 0'/></g></svg>`)}")`,
      backgroundSize: "56px 96px",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "0 24px", fontFamily: FACE_MONO,
    }}>
      <div style={{
        background: "#FFFFFF", borderRadius: 24, padding: "20px 16px 24px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        width: "100%", maxWidth: 320,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.12em", color: "#6B6B6B" }}>CLCLTR</span>
          <button onClick={onStart} style={{
            background: "transparent", border: "none", color: "#6B6B6B",
            fontSize: 12, cursor: "pointer", fontFamily: FACE_MONO,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 15 }}>☽</span> Dark
          </button>
        </div>

        <div style={{
          background: "#F5F5F5", borderRadius: 12, padding: "14px 16px",
          marginBottom: 16, textAlign: "right", fontSize: 24, fontWeight: 700,
          color: "#1A1A1A", fontFamily: FACE_MONO, minHeight: 48,
          letterSpacing: "0.02em", overflow: "hidden", wordBreak: "break-all", lineHeight: 1.3,
        }}>
          {display}
        </div>

        <div style={grid}>
          <B label="(" s={16} action={openParen} light />
          <B label=")" s={16} action={closeParen} light />
          <B label="π" s={16} action={() => insertConst("π")} light />
          <B label="√" s={18} action={() => fnInsert("sqrt")} light />
          <B label="x²" s={14} action={power2} light />
          <B label="x³" s={14} action={power3} light />
          <B label="^" s={18} action={() => operate("^")} light />
          <B label="log" s={13} action={() => fnInsert("log")} light />
          <B label="sin" s={13} action={() => fnInsert("sin")} light />
          <B label="cos" s={13} action={() => fnInsert("cos")} light />
          <B label="tan" s={13} action={() => fnInsert("tan")} light />
          <B label="ln" s={14} action={() => fnInsert("ln")} light />
          <B label="C" action={allClear} light />
          <B label="÷" action={() => operate("÷")} light />
          <B label="×" action={() => operate("×")} light />
          <B label="⌫" action={backspace} light />
          <B label="7" action={() => input("7")} />
          <B label="8" action={() => input("8")} />
          <B label="9" action={() => input("9")} />
          <B label="-" action={() => operate("-")} light />
          <B label="4" action={() => input("4")} />
          <B label="5" action={() => input("5")} />
          <B label="6" action={() => input("6")} />
          <B label="+" action={() => operate("+")} light />
          <B label="1" action={() => input("1")} />
          <B label="2" action={() => input("2")} />
          <B label="3" action={() => input("3")} />
          <B label="=" action={equals} blue />
          <B label="0" action={() => input("0")} style={{ aspectRatio: "auto", gridColumn: "span 2" }} />
          <B label="." action={addDot} />
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 20, fontSize: 10, color: "#AAA", letterSpacing: "0.08em" }}>
        v1.0.3
      </div>
    </div>
  );
}
