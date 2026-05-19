/**
 * Map a mimeType to a category for filtering
 */
const getCategory = (mimeType) => {
  if (!mimeType) return "other";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("word") || mimeType.includes("document"))
    return "document";
  if (mimeType.includes("sheet") || mimeType.includes("excel"))
    return "spreadsheet";
  if (mimeType.startsWith("text/") || mimeType === "application/json")
    return "text";
  if (mimeType.includes("zip") || mimeType.includes("compressed"))
    return "archive";
  return "other";
};

/**
 * Apply search, type filter, and sorting to a list of files
 */
export const applyFilters = (files, { searchQuery, fileType, sortBy }) => {
  let result = [...files];

  // Search filter
  if (searchQuery && searchQuery.trim() !== "") {
    const query = searchQuery.trim().toLowerCase();
    result = result.filter((f) =>
      f.originalName.toLowerCase().includes(query)
    );
  }

  // Type filter
  if (fileType && fileType !== "all") {
    result = result.filter((f) => getCategory(f.mimeType) === fileType);
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "date-desc":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "name-asc":
        return a.originalName.localeCompare(b.originalName);
      case "name-desc":
        return b.originalName.localeCompare(a.originalName);
      case "size-asc":
        return a.originalSize - b.originalSize;
      case "size-desc":
        return b.originalSize - a.originalSize;
      default:
        return 0;
    }
  });

  return result;
};