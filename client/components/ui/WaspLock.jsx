export default function WaspLock({ size = 80, C }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="WISPA logo" fill="none">
      <polygon points="50,5 88,27 88,73 50,95 12,73 12,27"
        fill={C.surface} stroke={C.line} strokeWidth="2" />
      <path d="M33 44 V36 a17 17 0 0 1 34 0 V44"
        stroke={C.accent} strokeWidth="5" strokeLinecap="round" />
      <path d="M44 22 Q40 13 35 12 M56 22 Q60 13 65 12"
        stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="26" r="6.5" fill={C.accent} />
      <rect x="30" y="44" width="40" height="42" rx="9" fill={C.accent} />
      <g stroke={C.surface} strokeWidth="3.4" strokeLinecap="round">
        <line x1="36" y1="58" x2="64" y2="58" />
        <line x1="36" y1="79" x2="64" y2="79" />
      </g>
      <circle cx="50" cy="64" r="5" fill={C.surface} />
      <rect x="47.6" y="66" width="4.8" height="9" rx="1.4" fill={C.surface} />
      <path d="M50 86 L46 92 L50 96 L54 92 Z" fill={C.accent} />
    </svg>
  );
}
