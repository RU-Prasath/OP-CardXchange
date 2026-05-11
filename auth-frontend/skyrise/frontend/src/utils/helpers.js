export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return path;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const truncate = (str, n = 120) => (str?.length > n ? str.slice(0, n) + "..." : str);

export const downloadCSV = (blob, filename = "export.csv") => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
