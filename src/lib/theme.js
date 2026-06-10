export const THEMES = {
  dark: {
    bg: "#0A0A0A", surface: "#141414", surface2: "#1C1C1C",
    text: "#FAFAF7", textDim: "#8C8C88", line: "#2A2A2A", lineSoft: "#1F1F1F",
    accent: "#E8861E", onAccent: "#0A0A0A", danger: "#C75C3C",
  },
};

export const FACE_DISPLAY = "'Helvetica Neue', 'Arial Narrow', 'Roboto Condensed', 'Inter', sans-serif";
export const FACE_BODY = "'SF Mono', 'Consolas', 'Menlo', 'Courier New', monospace";
export const FACE_MONO = "'SF Mono', 'Consolas', 'Menlo', monospace";
export const FACE_SANS = "'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const ENGRAVE = { textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600 };
export const HEX_CLIP = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
export const HIVE_PRICE = 4.99;

export function honeycombBg(stroke) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='96' viewBox='0 0 56 96'><g fill='none' stroke='${stroke}' stroke-width='1'><path d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z'/><path d='M28 64 L56 80 L56 96 M28 64 L0 80 L0 96 M56 16 L56 0 M0 16 L0 0'/></g></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}
