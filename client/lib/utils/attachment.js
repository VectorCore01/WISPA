export const ATTACH_ICON = { image: "▣", video: "▶", file: "▤" };
export const ATTACH_LABEL = { image: "Photo", video: "Video", file: "File" };

export function attachKindOf(file) {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "file";
}

export function fmtSize(bytes) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
