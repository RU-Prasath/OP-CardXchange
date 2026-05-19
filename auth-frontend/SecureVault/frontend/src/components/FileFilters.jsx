import { Search, X, SlidersHorizontal } from "lucide-react";

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "size-desc", label: "Largest first" },
  { value: "size-asc", label: "Smallest first" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "audio", label: "Audio" },
  { value: "pdf", label: "PDFs" },
  { value: "document", label: "Documents" },
  { value: "spreadsheet", label: "Spreadsheets" },
  { value: "text", label: "Text" },
  { value: "archive", label: "Archives" },
  { value: "other", label: "Other" },
];

const FileFilters = ({
  searchQuery,
  onSearchChange,
  fileType,
  onFileTypeChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== "" || fileType !== "all" || sortBy !== "date-desc";

  const clearFilters = () => {
    onSearchChange("");
    onFileTypeChange("all");
    onSortChange("date-desc");
  };

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search files by name..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Type filter */}
        <select
          value={fileType}
          onChange={(e) => onFileTypeChange(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results count + clear button */}
      {(hasActiveFilters || filteredCount !== totalCount) && (
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <span className="text-white font-medium">{filteredCount}</span>{" "}
            of {totalCount} files
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium"
            >
              <SlidersHorizontal className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileFilters;