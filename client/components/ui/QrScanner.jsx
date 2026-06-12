import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { FACE_MONO } from "../../lib/theme.js";

// Opens the camera and scans for a QR code, calling onResult(text) on the first
// hit. Needs a secure context — localhost and https both qualify.
export default function QrScanner({ C, onResult, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    function tick() {
      const v = videoRef.current;
      if (v && v.readyState === v.HAVE_ENOUGH_DATA) {
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
        if (code && code.data) { onResult(code.data.trim()); return; }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    async function start() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera is not available in this browser.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        const v = videoRef.current;
        v.srcObject = stream;
        await v.play();
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        setError("Camera access was blocked. Allow it to scan a QR.");
      }
    }
    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 80, padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: 16, width: "100%", maxWidth: 340, textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: C.text, marginBottom: 12 }}>SCAN A QR CODE</div>
        <div style={{ position: "relative", width: "100%", aspectRatio: "1", background: "#000", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
          <video ref={videoRef} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: "16%", border: `2px solid ${C.accent}`, borderRadius: 10, pointerEvents: "none" }} />
          {error && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, color: "#fff", fontSize: 13, fontFamily: FACE_MONO, lineHeight: 1.5 }}>{error}</div>
          )}
        </div>
        <button onClick={onClose} style={{ width: "100%", background: "transparent", color: C.textDim, border: `1px solid ${C.line}`, borderRadius: 8, padding: "11px 0", fontSize: 12, cursor: "pointer" }}>cancel</button>
      </div>
    </div>
  );
}
