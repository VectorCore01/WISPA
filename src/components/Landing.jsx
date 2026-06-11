import { useState } from "react";
import { FACE_MONO } from "../lib/theme.js";

export default function Landing({ C, lang, onStart }) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [resetNext, setResetNext] = useState(false);

  const input = (val) => {
    if (resetNext) {
      setDisplay(val);
      setResetNext(false);
    } else {
      setDisplay(display === "0" ? val : display + val);
    }
  };

  const operate = (next) => {
    const cur = parseFloat(display);
    if (op && prev !== null) {
      const r = calc(prev, cur, op);
      setDisplay(String(r));
      setPrev(r);
    } else {
      setPrev(cur);
    }
    setOp(next);
    setResetNext(true);
  };

  const calc = (a, b, operator) => {
    switch (operator) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b !== 0 ? a / b : "Error";
      default: return b;
    }
  };

  const equals = () => {
    const cur = parseFloat(display);
    if (op && prev !== null) {
      const r = calc(prev, cur, op);
      setDisplay(String(r));
      setPrev(null);
      setOp(null);
      setResetNext(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setResetNext(false);
  };

  const backspace = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  };

  const B = ({ label, action, light, blue, style: extra }) => (
    <button
      onClick={action}
      style={{
        border: "none",
        borderRadius: 12,
        background: blue ? "#4A90D9" : light ? "#E8E8E8" : "#1A1A1A",
        color: blue || !light ? "#FFFFFF" : "#1A1A1A",
        fontSize: 20,
        fontWeight: 600,
        fontFamily: FACE_MONO,
        cursor: "pointer",
        aspectRatio: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(extra || {}),
      }}
    >
      {label}
    </button>
  );

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFFFFF",
      backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='96' viewBox='0 0 56 96'><g fill='none' stroke='#B3D4FF' stroke-width='1.5'><path d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z'/><path d='M28 64 L56 80 L56 96 M28 64 L0 80 L0 96 M56 16 L56 0 M0 16 L0 0'/></g></svg>`)}")`,
      backgroundSize: "56px 96px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px",
      fontFamily: FACE_MONO,
    }}>
      <div style={{
        background: "#FFFFFF",
        borderRadius: 24,
        padding: "24px 20px 28px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth: 320,
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}>
          <span style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#6B6B6B",
          }}>CLCLTR</span>
          <button
            onClick={onStart}
            style={{
              background: "transparent",
              border: "none",
              color: "#6B6B6B",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: FACE_MONO,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 16 }}>☽</span> Dark
          </button>
        </div>

        <div style={{
          background: "#F5F5F5",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 20,
          textAlign: "right",
          fontSize: 32,
          fontWeight: 700,
          color: "#1A1A1A",
          fontFamily: FACE_MONO,
          minHeight: 48,
          letterSpacing: "0.02em",
          overflow: "hidden",
        }}>
          {display}
        </div>

        <div style={grid}>
          <B label="C" action={clear} light />
          <B label="÷" action={() => operate("/")} light />
          <B label="×" action={() => operate("*")} light />
          <B label="⌫" action={backspace} light />
          <B label="7" action={() => input("7")} />
          <B label="8" action={() => input("8")} />
          <B label="9" action={() => input("9")} />
          <B label="−" action={() => operate("-")} light />
          <B label="4" action={() => input("4")} />
          <B label="5" action={() => input("5")} />
          <B label="6" action={() => input("6")} />
          <B label="+" action={() => operate("+")} light />
          <B label="1" action={() => input("1")} />
          <B label="2" action={() => input("2")} />
          <B label="3" action={() => input("3")} />
          <B label="=" action={equals} blue />
          <B label="0" action={() => input("0")} style={{ aspectRatio: "auto", gridColumn: "span 2" }} />
          <B label="." action={() => !display.includes(".") && input(".")} />
        </div>
      </div>

      <div style={{
        position: "fixed",
        bottom: 20,
        fontSize: 10,
        color: "#AAA",
        letterSpacing: "0.08em",
      }}>
        v1.0.3
      </div>
    </div>
  );
}
