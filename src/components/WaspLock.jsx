export default function WaspLock({ size = 80, C }) {
  const gray = C.textDim;
  const orange = C.accent;
  const dark = C.surface2;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="WISPA logo" fill="none">
      <polygon points="50,5 88,27 88,73 50,95 12,73 12,27"
        stroke={gray} strokeWidth="3.5" />
      <path d="M33 44 V36 a17 17 0 0 1 34 0 V44"
        stroke={orange} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M39 20 Q43 10 50 8 M61 20 Q57 10 50 8"
        stroke={gray} strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="50" cy="28" r="5" fill={orange} opacity="0.8" />
      <rect x="30" y="44" width="40" height="42" rx="9" fill={dark} stroke={gray} strokeWidth="1.5" />
      <g stroke={orange} strokeWidth="3.2" strokeLinecap="round" opacity="0.9">
        <line x1="36" y1="56" x2="64" y2="56" />
        <line x1="36" y1="77" x2="64" y2="77" />
      </g>
      <circle cx="50" cy="64" r="5" fill={dark} stroke={orange} strokeWidth="1.5" />
      <rect x="47.6" y="66" width="4.8" height="9" rx="1.4" fill={orange} opacity="0.9" />
      <path d="M50 86 L46 92 L50 96 L54 92 Z" fill={orange} opacity="0.85" />
    </svg>
  );
}
