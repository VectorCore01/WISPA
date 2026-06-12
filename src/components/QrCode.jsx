import { useMemo } from "react";
import QRCode from "qrcode";

// A scannable QR whose data modules are drawn as little hexagons (honeycomb look).
// The three corner finder patterns stay solid so cameras still read it, and high
// error correction keeps the stylised code robust.
export default function QrCode({ value, size = 160 }) {
  const qr = useMemo(() => {
    try {
      return QRCode.create(String(value || ""), { errorCorrectionLevel: "H" });
    } catch { return null; }
  }, [value]);

  if (!qr) return <div style={{ width: size, height: size }} />;

  const n = qr.modules.size;
  const data = qr.modules.data;
  const pad = 2;                 // quiet zone (modules)
  const total = n + pad * 2;
  const cell = size / total;
  const R = cell * 0.62;
  const dark = "#0A0A0A";

  // A finder pattern is the 7x7 block in three corners — keep those solid.
  const inFinder = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);

  const hex = (cx, cy) => {
    const p = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i - 90);
      p.push(`${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`);
    }
    return p.join(" ");
  };

  const dots = [];
  const blocks = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!data[r * n + c]) continue;
      const cx = (pad + c + 0.5) * cell;
      const cy = (pad + r + 0.5) * cell;
      if (inFinder(r, c)) {
        blocks.push(<rect key={`b${r}-${c}`} x={cx - cell / 2} y={cy - cell / 2} width={cell + 0.4} height={cell + 0.4} fill={dark} />);
      } else {
        dots.push(<polygon key={`h${r}-${c}`} points={hex(cx, cy)} fill={dark} />);
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 8, display: "block", background: "#FFFFFF" }}>
      <rect width={size} height={size} fill="#FFFFFF" />
      {blocks}
      {dots}
    </svg>
  );
}
