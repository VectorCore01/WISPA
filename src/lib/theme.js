export const THEMES = {
  dark: {
    bg: "#0A0A0A", surface: "#141414", surface2: "#1C1C1C",
    text: "#EAEAEA", textDim: "#9A9A9A", textBright: "#FFFFFF",
    line: "#2A2A2A", lineSoft: "#1F1F1F",
    accent: "#FFB300", onAccent: "#0A0A0A", danger: "#E0664A",
    // Taschenrechner-Tarnung: schwarz · orange · weiß
    calc: {
      page: "#0A0A0A", card: "#141414", display: "#0A0A0A", displayText: "#FFFFFF",
      num: "#1E1E1E", numText: "#FFFFFF", fn: "#2C2C2C", fnText: "#F2F2F2",
      op: "#FFB300", opText: "#0A0A0A", muted: "#8A8A8A", grid: "#B3D4FF",
    },
  },
  light: {
    bg: "#FAFAF7", surface: "#FFFFFF", surface2: "#F0F0EC",
    text: "#1A1A1A", textDim: "#6B6B6B", textBright: "#000000",
    line: "#E2E2DE", lineSoft: "#EEEEEA",
    accent: "#E8861E", onAccent: "#FFFFFF", danger: "#D9543A",
    // Taschenrechner-Tarnung: weiß · orange · schwarz
    calc: {
      page: "#FFFFFF", card: "#FFFFFF", display: "#F5F5F5", displayText: "#1A1A1A",
      num: "#1A1A1A", numText: "#FFFFFF", fn: "#E8E8E8", fnText: "#1A1A1A",
      op: "#E8861E", opText: "#FFFFFF", muted: "#6B6B6B", grid: "#B3D4FF",
    },
  },
};

export const FACE_UI = "'Rajdhani', 'Helvetica Neue', 'Arial Narrow', sans-serif";
export const FACE_MONO = "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace";

export const ENGRAVE = { textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600 };
export const HEX_CLIP = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
export const HIVE_PRICE = 4.99;

export function honeycombBg(stroke) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='96' viewBox='0 0 56 96'><g fill='none' stroke='${stroke}' stroke-width='1'><path d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z'/><path d='M28 64 L56 80 L56 96 M28 64 L0 80 L0 96 M56 16 L56 0 M0 16 L0 0'/></g></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}
