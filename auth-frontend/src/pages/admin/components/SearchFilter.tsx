interface SearchFilterProps {
  search: string;
  setSearch: (val: string) => void;
  categoryOptions?: string[];
  selectedCategory?: string;
  setCategory?: (val: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  search,
  setSearch,
  categoryOptions,
  selectedCategory,
  setCategory,
}) => (
  <div className="flex flex-col md:flex-row gap-4 mb-4">
    <input
      type="text"
      placeholder="Search by name or user..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full md:w-1/2 p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
    />
    {categoryOptions && setCategory && (
      <select
        value={selectedCategory}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full md:w-1/4 p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
      >
        <option value="">All Categories</option>
        {categoryOptions.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    )}
  </div>
);
