// interface CardFiltersProps {
//   status?: string;
//   category?: string;
//   search: string;
//   setSearch: (s: string) => void;
// }

import CustomInput from "../../common/UI/CustomInput";

// export default function CardFilters({ search, setSearch }: CardFiltersProps) {
//   return (
//     <div className="flex flex-col md:flex-row gap-4 mb-6">
//       <input
//         type="text"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search cards by name or description..."
//         className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//       />
//     </div>
//   );
// }



interface CardFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  searchPlaceholder?: string;
  searchClassName?: string;
  containerClassName?: string;
  showLabel?: boolean;
  searchLabel?: string;
  customFilters?: React.ReactNode;
}

export default function CardFilters({
  search,
  setSearch,
  searchPlaceholder = "Search...",
  searchClassName = "bg-gray-800 text-white border-gray-700 focus:ring-indigo-500",
  containerClassName = "flex flex-col md:flex-row gap-4 mb-6",
  showLabel = false,
  searchLabel = "Search",
  customFilters
}: CardFiltersProps) {
  return (
    <div className={containerClassName}>
      <CustomInput
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={searchPlaceholder}
        label={showLabel ? searchLabel : undefined}
        className={`${searchClassName} focus:outline-none focus:ring-2`}
      />
      
      {customFilters && (
        <div className="flex gap-4">
          {customFilters}
        </div>
      )}
    </div>
  );
}