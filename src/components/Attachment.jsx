import { FACE_MONO, ENGRAVE } from "../lib/theme.js";
import { fmtSize, ATTACH_ICON, ATTACH_LABEL } from "../lib/helpers.js";

// A sealed attachment: shown in the chat/hive but unrecognizable until opened.
// Once opened it reveals the image/video/file. Only WISP Pro can download.
export default function Attachment({ C, post, isPro, opened, onOpen, onDark }) {
  const icon = ATTACH_ICON[post.kind] || ATTACH_ICON.file;
  const label = ATTACH_LABEL[post.kind] || ATTACH_LABEL.file;

  if (!opened) {
    return (
      <button onClick={onOpen}
        style={{ width: "100%", minWidth: 200, background: onDark ? "rgba(0,0,0,0.06)" : C.bg, border: `1px dashed ${C.line}`, borderRadius: 8, padding: "18px 16px", color: onDark ? C.bg : C.text, display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
        <span style={{ fontSize: 22, filter: "blur(2px)", opacity: 0.7 }}>{icon}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.04em" }}>🔒 Sealed {label.toLowerCase()}</div>
          <div style={{ fontSize: 11, opacity: 0.7, fontFamily: FACE_MONO }}>tap to open · {fmtSize(post.size)}</div>
        </div>
      </button>
    );
  }

  return (
    <div style={{ minWidth: 200 }}>
      {post.kind === "image" && (
        <img src={post.url} alt={post.name} style={{ maxWidth: "100%", maxHeight: 320, borderRadius: 8, display: "block" }} />
      )}
      {post.kind === "video" && (
        <video src={post.url} controls style={{ maxWidth: "100%", maxHeight: 320, borderRadius: 8, display: "block", background: "#000" }} />
      )}
      {post.kind === "file" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: FACE_MONO, fontSize: 20, color: C.accent }}>{icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.name}</div>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: FACE_MONO }}>{fmtSize(post.size)}</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 10 }}>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: FACE_MONO, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {post.kind !== "file" ? post.name : ""}
        </div>
        {isPro ? (
          <a href={post.url} download={post.name} style={{ flexShrink: 0, background: C.text, color: C.bg, borderRadius: 4, padding: "8px 14px", ...ENGRAVE, letterSpacing: "0.06em", fontSize: 11, textDecoration: "none" }}>Download</a>
        ) : (
          <span style={{ flexShrink: 0, fontSize: 11, color: C.textDim, ...ENGRAVE, letterSpacing: "0.06em" }}>Pro to download 🔒</span>
        )}
      </div>
    </div>
  );
}
