/**
 * Check if a file type is previewable in the browser
 */
export const isPreviewable = (mimeType) => {
  if (!mimeType) return false;
  return (
    mimeType.startsWith("image/") ||
    mimeType.startsWith("video/") ||
    mimeType.startsWith("audio/") ||
    mimeType === "application/pdf" ||
    mimeType.startsWith("text/") ||
    mimeType === "application/json"
  );
};

/**
 * Get the preview category for a file
 */
export const getPreviewType = (mimeType) => {
  if (!mimeType) return "unsupported";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("text/") || mimeType === "application/json")
    return "text";
  return "unsupported";
};