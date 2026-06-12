// A centered dialog with a dimmed backdrop. Click outside or pass your own
// buttons to close. Keeps every overlay in the app visually consistent.
export default function Modal({ C, onClose, children, maxWidth = 320 }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "26px 22px", width: "100%", maxWidth, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        {children}
      </div>
    </div>
  );
}
