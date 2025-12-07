interface CardFiltersProps {
  status?: string;
  category?: string;
  search: string;
  setSearch: (s: string) => void;
}

export default function CardFilters({ search, setSearch }: CardFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search cards by name or description..."
        className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
