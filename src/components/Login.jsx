import { useState } from "react";
import WaspLock from "./WaspLock.jsx";
import { FACE_MONO, ENGRAVE } from "../lib/theme.js";
import { t } from "../lib/translations.js";

export default function Login({ C, lang, onFinish, onBack }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    const words = input.trim().split(/\s+/);
    if (words.length !== 24) {
      setError(`${t(lang, "Expected 24 words, got")} ${words.length}.`);
      return;
    }
    setError("");
    onFinish();
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={onBack} style={{ background: "transparent", color: C.textDim, fontSize: 13, marginBottom: 20 }}>← {t(lang, "Back")}</button>

      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <WaspLock size={60} C={C} />
        <h2 style={{ fontFamily: FACE_MONO, fontSize: 26, fontWeight: 700, letterSpacing: "0.1em", margin: "14px 0 6px" }}>{t(lang, "Log in")}</h2>
        <p style={{ color: C.textDim, fontSize: 15, lineHeight: 1.6 }}>
          {t(lang, "Paste or type your 24 words to restore your WISP.")}
        </p>
      </div>

      <div style={{
        background: C.surface, border: `1px solid ${error ? C.danger : C.line}`,
        borderRadius: 6, padding: 4, marginBottom: 16,
      }}>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          placeholder="hive honey sting wing queen swarm nectar wax hum whisper shadow chamber key seal brood dark gold pattern hexagon scent trail dance night silence"
          rows={6}
          style={{
            width: "100%", background: "transparent", border: "none", resize: "none",
            color: C.text, fontSize: 15, fontFamily: FACE_MONO, lineHeight: 1.8,
            padding: "12px 14px",
          }}
        />
      </div>

      {error && <div style={{ color: C.danger, fontSize: 13, marginBottom: 12 }}>{error}</div>}

      <button onClick={handleSubmit} style={{ width: "100%", padding: 15, borderRadius: 4, fontSize: 13, ...ENGRAVE, letterSpacing: "0.12em", background: C.text, color: C.bg, border: "none" }}>
        {t(lang, "Restore")}
      </button>
    </div>
  );
}
