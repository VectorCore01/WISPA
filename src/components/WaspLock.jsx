export default function WaspLock({ size = 80, C }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="WISPA logo" fill="none">
      <ellipse cx="50" cy="55" rx="36" ry="40"
        fill={C.surface} stroke={C.line} strokeWidth="2.5" />
      <circle cx="50" cy="28" r="12"
        fill={C.surface} stroke={C.line} strokeWidth="2" />
      <path d="M39 14 Q42 4 50 1 M61 14 Q58 4 50 1"
        stroke={C.textDim} strokeWidth="3" strokeLinecap="round" />
      <path d="M42 18 L58 41 M58 18 L42 41"
        stroke={C.line} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
