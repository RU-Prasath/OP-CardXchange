// import { useState, useMemo, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useFetchApprovedCards } from "../../../../api/hooks/card/one-piece/useCards";
// import { Icon } from "@iconify/react";
// import { ICONS } from "../../../../assets/icons";
// import OPCardLayout from "../../../../components/card/one-piece/cards/OPCardLayout";
// import { OP_CATEGORIES } from "../../../../constants/card/one-piece/categories";
// import { useWishlist } from "../../../../hooks/useWishlist";

// const AllCards = () => {
//   const { data } = useFetchApprovedCards();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const allCards = data?.cards || [];

//   const { toggleWishlist, isWishlisted } = useWishlist();

//   // Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
//   const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");
//   const [view, setView] = useState<"grid" | "list">("grid");

//   // Initialize from URL params
//   useEffect(() => {
//     const category = searchParams.get("category");
//     if (category) {
//       setSelectedCategory(category);
//     }
//   }, [searchParams]);

//   // Calculate price bounds
//   const priceBounds = useMemo(() => {
//     if (allCards.length === 0) return [0, 10000];
//     const prices = allCards.map(card => card.price || 0);
//     return [Math.min(...prices), Math.max(...prices)];
//   }, [allCards]);

//   // Apply filters
//   const filteredCards = useMemo(() => {
//     let filtered = [...allCards];

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(card =>
//         card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         card.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Category filter
//     if (selectedCategory !== "all") {
//       filtered = filtered.filter(card =>
//         card.category.toLowerCase().includes(selectedCategory.toLowerCase())
//       );
//     }

//     // Price filter
//     filtered = filtered.filter(card => {
//       const price = card.price || 0;
//       return price >= priceRange[0] && price <= priceRange[1];
//     });

//     // Sort
//     switch (sortBy) {
//       case "price-low":
//         filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
//         break;
//       case "price-high":
//         filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
//         break;
//       case "newest":
//       default:
//         filtered.sort((a, b) =>
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
//     }

//     return filtered;
//   }, [allCards, searchTerm, selectedCategory, priceRange, sortBy]);

//   const handleCategoryChange = (category: string) => {
//     setSelectedCategory(category);
//     setSearchParams(category === "all" ? {} : { category });
//   };

//   const handlePriceChange = (min: number, max: number) => {
//     setPriceRange([min, max]);
//   };

//   const toggleView = () => {
//     setView(prev => prev === "grid" ? "list" : "grid");
//   };

//   return (
//     <div className="px-4 sm:px-6 md:px-20 max-w-[1440px] mx-auto py-6 md:py-8">
//       {/* Header */}
//       <div className="text-center mb-6 md:mb-8">
//         <h1 className="text-2xl md:text-4xl font-bold text-[#1c1c1c] mb-3">
//           <span className="bg-[#c0392b] text-[#f6f2ee] px-4 py-2 rounded-2xl">
//             One Piece
//           </span>{" "}
//           <span className="text-2xl lg:text-4xl">All Cards Collection</span>
//         </h1>
//         <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
//           Browse through our complete collection of premium One Piece cards. Filter by category, price, and more.
//         </p>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Filters Sidebar */}
//         <div className="lg:w-1/4">
//           <div className="bg-[#f6f2ee] rounded-2xl p-5 md:p-6 sticky top-6">
//             <h2 className="text-xl font-bold text-[#1c1c1c] mb-6 pb-3 border-b border-[#fdd18e]">
//               <Icon icon="ic:round-filter-list" className="inline mr-2 text-[#0097a7]" />
//               Filters
//             </h2>

//             {/* Search */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-[#1c1c1c] mb-2">
//                 Search Cards
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search by name or description..."
//                   className="w-full px-4 py-3 pl-10 bg-white rounded-lg border border-[#fdd18e] focus:outline-none focus:ring-2 focus:ring-[#0097a7]/30 focus:border-[#0097a7]"
//                 />
//                 <Icon
//                   icon="ic:round-search"
//                   className="absolute left-3 top-3.5 text-gray-400"
//                   width="18"
//                 />
//               </div>
//             </div>

//             {/* Categories */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-[#1c1c1c] mb-3">
//                 Categories
//               </label>
//               <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
//                 {OP_CATEGORIES.map((category) => (
//                   <button
//                     key={category.id}
//                     onClick={() => handleCategoryChange(category.id)}
//                     className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
//                       selectedCategory === category.id
//                         ? "bg-[#c0392b] text-white"
//                         : "bg-white hover:bg-[#fdd18e]/30 text-[#1c1c1c]"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="font-medium">{category.label}</span>
//                       {selectedCategory === category.id && (
//                         <Icon icon="mdi:check" width="16" />
//                       )}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Price Range */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-[#1c1c1c] mb-3">
//                 Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
//               </label>
//               <div className="px-2">
//                 <input
//                   type="range"
//                   min={priceBounds[0]}
//                   max={priceBounds[1]}
//                   step={1000}
//                   value={priceRange[0]}
//                   onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
//                   className="w-full h-2 bg-[#fdd18e] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c0392b]"
//                 />
//                 <input
//                   type="range"
//                   min={priceBounds[0]}
//                   max={priceBounds[1]}
//                   step={1000}
//                   value={priceRange[1]}
//                   onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
//                   className="w-full h-2 bg-[#fdd18e] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c0392b] mt-2"
//                 />
//               </div>
//               <div className="flex justify-between text-sm text-gray-600 mt-2">
//                 <span>₹{priceBounds[0].toLocaleString()}</span>
//                 <span>₹{priceBounds[1].toLocaleString()}</span>
//               </div>
//             </div>

//             {/* Sort */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-[#1c1c1c] mb-3">
//                 Sort By
//               </label>
//               <div className="space-y-2">
//                 {[
//                   { value: "newest", label: "Newest First" },
//                   { value: "price-low", label: "Price: Low to High" },
//                   { value: "price-high", label: "Price: High to Low" }
//                 ].map((option) => (
//                   <button
//                     key={option.value}
//                     onClick={() => setSortBy(option.value as any)}
//                     className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
//                       sortBy === option.value
//                         ? "bg-[#0097a7] text-white"
//                         : "bg-white hover:bg-[#0097a7]/10 text-[#1c1c1c]"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span>{option.label}</span>
//                       {sortBy === option.value && (
//                         <Icon icon="mdi:check" width="16" />
//                       )}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Reset Filters */}
//             <button
//               onClick={() => {
//                 setSearchTerm("");
//                 setSelectedCategory("all");
//                 setPriceRange([priceBounds[0], priceBounds[1]]);
//                 setSortBy("newest");
//                 setSearchParams({});
//               }}
//               className="w-full px-4 py-3 bg-linear-to-r from-[#c0392b] to-[#1c1c1c] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2"
//             >
//               <Icon icon="mdi:refresh" width="18" />
//               Reset All Filters
//             </button>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="lg:w-3/4">
//           {/* Results Header */}
//           <div className="bg-linear-to-r from-[#f6f2ee] to-white rounded-xl p-4 md:p-5 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
//             <div>
//               <h3 className="text-lg font-bold text-[#1c1c1c]">
//                 Showing {filteredCards.length} of {allCards.length} cards
//               </h3>
//               {searchTerm && (
//                 <p className="text-sm text-gray-600">
//                   Search results for: <span className="font-semibold text-[#c0392b]">{searchTerm}</span>
//                 </p>
//               )}
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <span className="hidden sm:inline text-sm font-medium text-[#1c1c1c]">
//                   {view === "grid" ? "Grid View" : "List View"}
//                 </span>
//                 <button
//                   onClick={toggleView}
//                   className="relative w-12 h-7 rounded-full bg-linear-to-r from-[#fdd18e] to-[#0097a7] p-1 transition-all duration-300 hover:shadow-lg"
//                   aria-label={`Switch to ${view === "grid" ? "list" : "grid"} view`}
//                 >
//                   <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#fdd18e]/30 to-[#0097a7]/30"></div>
//                   <div
//                     className={`relative w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 transform ${
//                       view === "list" ? "translate-x-5" : "translate-x-0"
//                     }`}
//                   >
//                     <Icon
//                       icon={ICONS.grid}
//                       className={`absolute transition-all duration-300 ${
//                         view === "grid"
//                           ? "opacity-100 scale-100 text-[#0097a7]"
//                           : "opacity-0 scale-50 text-gray-400"
//                       }`}
//                       width="12"
//                       height="12"
//                     />
//                     <Icon
//                       icon={ICONS.list}
//                       className={`absolute transition-all duration-300 ${
//                         view === "list"
//                           ? "opacity-100 scale-100 text-[#c0392b]"
//                           : "opacity-0 scale-50 text-gray-400"
//                       }`}
//                       width="12"
//                       height="12"
//                     />
//                   </div>
//                 </button>
//               </div>

//               {/* Active Filters Badges */}
//               <div className="flex flex-wrap gap-2">
//                 {selectedCategory !== "all" && (
//                   <span className="px-3 py-1 bg-[#0097a7] text-white text-xs font-medium rounded-full">
//                     {OP_CATEGORIES.find(c => c.id === selectedCategory)?.label}
//                   </span>
//                 )}
//                 {priceRange[0] > priceBounds[0] || priceRange[1] < priceBounds[1] ? (
//                   <span className="px-3 py-1 bg-[#fdd18e] text-[#1c1c1c] text-xs font-medium rounded-full">
//                     ₹{priceRange[0].toLocaleString()}+
//                   </span>
//                 ) : null}
//               </div>
//             </div>
//           </div>

//           {/* Cards Grid */}
//           {filteredCards.length > 0 ? (
//             <OPCardLayout
//               cards={filteredCards}
//               view={view}
//               isWishlisted={isWishlisted}
//               onToggleWishlist={toggleWishlist}
//             />
//           ) : (
//             <div className="text-center py-16 bg-linear-to-b from-white to-[#f6f2ee] rounded-2xl">
//               <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#fdd18e]/20 flex items-center justify-center">
//                 <Icon
//                   icon="mdi:cards-outline"
//                   className="w-12 h-12 text-[#c0392b]"
//                 />
//               </div>
//               <h3 className="text-2xl font-bold text-[#1c1c1c] mb-3">
//                 No Cards Found
//               </h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 Try adjusting your filters or search term to find what you're looking for.
//               </p>
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSelectedCategory("all");
//                   setPriceRange([priceBounds[0], priceBounds[1]]);
//                 }}
//                 className="px-6 py-3 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200"
//               >
//                 Reset Filters
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllCards;
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetchApprovedCards } from "../../../../api/hooks/card/one-piece/useCards";
import { Icon } from "@iconify/react";
import { ICONS } from "../../../../assets/icons";
import OPCardLayout from "../../../../components/card/one-piece/cards/OPCardLayout";
import { OP_CATEGORIES } from "../../../../constants/card/one-piece/categories";
import { useWishlist } from "../../../../hooks/useWishlist";

const AllCards = () => {
  const { data } = useFetchApprovedCards();
  const [searchParams, setSearchParams] = useSearchParams();
  const allCards = data?.cards || [];

  const { toggleWishlist, isWishlisted } = useWishlist();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">(
    "newest"
  );
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Close mobile filters on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowMobileFilters(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call initially

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate price bounds
  const priceBounds = useMemo(() => {
    if (allCards.length === 0) return [0, 10000];
    const prices = allCards.map((card) => card.price || 0);
    return [Math.min(...prices), Math.max(...prices)];
  }, [allCards]);

  // Apply filters
  const filteredCards = useMemo(() => {
    let filtered = [...allCards];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (card) =>
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((card) =>
        card.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter((card) => {
      const price = card.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return filtered;
  }, [allCards, searchTerm, selectedCategory, priceRange, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams(category === "all" ? {} : { category });
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const toggleView = () => {
    setView((prev) => (prev === "grid" ? "list" : "grid"));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange([priceBounds[0], priceBounds[1]]);
    setSortBy("newest");
    setSearchParams({});
  };

  return (
    <div className="px-4 sm:px-6 md:px-20 max-w-[1440px] mx-auto py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-[#1c1c1c] mb-3">
          <span className="bg-[#c0392b] text-[#f6f2ee] px-4 py-2 rounded-2xl">
            One Piece
          </span>{" "}
          <span className="text-2xl lg:text-4xl">All Cards Collection</span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          Browse through our complete collection of premium One Piece cards.
          Filter by category, price, and more.
        </p>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="w-full px-4 py-3 bg-linear-to-r from-[#c0392b] to-[#1c1c1c] text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200"
        >
          <Icon icon="ic:round-filter-list" width="20" />
          Show Filters
          <span className="ml-auto flex items-center gap-1">
            {selectedCategory !== "all" && (
              <span className="w-2 h-2 bg-[#0097a7] rounded-full"></span>
            )}
            {searchTerm && (
              <span className="w-2 h-2 bg-[#fdd18e] rounded-full"></span>
            )}
          </span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />

            {/* Filters Sidebar - Mobile */}
            <div className="fixed left-0 top-0 h-full w-4/5 max-w-sm bg-white z-50 lg:hidden overflow-y-auto shadow-2xl animate-slide-in">
              <div className="p-5">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#fdd18e]">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="ic:round-filter-list"
                      className="text-[#0097a7] text-xl"
                    />
                    <h2 className="text-xl font-bold text-[#1c1c1c]">
                      Filters
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <Icon
                      icon="mdi:close"
                      className="text-2xl text-[#c0392b]"
                    />
                  </button>
                </div>

                {/* Search - Mobile */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#1c1c1c] mb-2">
                    Search Cards
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or description..."
                      className="w-full px-4 py-3 pl-10 bg-gray-50 rounded-lg border border-[#fdd18e] focus:outline-none focus:ring-2 focus:ring-[#0097a7]/30 focus:border-[#0097a7]"
                    />
                    <Icon
                      icon="ic:round-search"
                      className="absolute left-3 top-3.5 text-gray-400"
                      width="18"
                    />
                  </div>
                </div>

                {/* Categories - Mobile */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#1c1c1c] mb-3">
                    Categories
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {OP_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          handleCategoryChange(category.id);
                          setShowMobileFilters(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                          selectedCategory === category.id
                            ? "bg-[#c0392b] text-white"
                            : "bg-gray-50 hover:bg-[#fdd18e]/30 text-[#1c1c1c]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.label}</span>
                          {selectedCategory === category.id && (
                            <Icon icon="mdi:check" width="16" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range - Mobile */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#1c1c1c] mb-3">
                    Price Range: ₹{priceRange[0].toLocaleString()} - ₹
                    {priceRange[1].toLocaleString()}
                  </label>
                  <div className="px-2">
                    <div className="relative pt-6">
                      <div className="relative h-1 bg-[#fdd18e] rounded-full">
                        <div
                          className="absolute h-1 bg-[#0097a7] rounded-full"
                          style={{
                            left: `${
                              ((priceRange[0] - priceBounds[0]) /
                                (priceBounds[1] - priceBounds[0])) *
                              100
                            }%`,
                            width: `${
                              ((priceRange[1] - priceRange[0]) /
                                (priceBounds[1] - priceBounds[0])) *
                              100
                            }%`,
                          }}
                        />
                        <input
                          type="range"
                          min={priceBounds[0]}
                          max={priceBounds[1]}
                          step={1000}
                          value={priceRange[0]}
                          onChange={(e) =>
                            handlePriceChange(
                              Number(e.target.value),
                              priceRange[1]
                            )
                          }
                          className="absolute top-0 w-full h-1 opacity-0 cursor-pointer"
                        />
                        <input
                          type="range"
                          min={priceBounds[0]}
                          max={priceBounds[1]}
                          step={1000}
                          value={priceRange[1]}
                          onChange={(e) =>
                            handlePriceChange(
                              priceRange[0],
                              Number(e.target.value)
                            )
                          }
                          className="absolute top-0 w-full h-1 opacity-0 cursor-pointer"
                        />
                        <div
                          className="absolute -top-2"
                          style={{
                            left: `${
                              ((priceRange[0] - priceBounds[0]) /
                                (priceBounds[1] - priceBounds[0])) *
                              100
                            }%`,
                          }}
                        >
                          <div className="w-6 h-6 bg-[#c0392b] rounded-full border-4 border-white shadow-md"></div>
                        </div>
                        <div
                          className="absolute -top-2"
                          style={{
                            left: `${
                              ((priceRange[1] - priceBounds[0]) /
                                (priceBounds[1] - priceBounds[0])) *
                              100
                            }%`,
                          }}
                        >
                          <div className="w-6 h-6 bg-[#c0392b] rounded-full border-4 border-white shadow-md"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-4">
                    <span>₹{priceBounds[0].toLocaleString()}</span>
                    <span>₹{priceBounds[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Sort - Mobile */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#1c1c1c] mb-3">
                    Sort By
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "newest", label: "Newest First" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as any)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                          sortBy === option.value
                            ? "bg-[#0097a7] text-white"
                            : "bg-gray-50 hover:bg-[#0097a7]/10 text-[#1c1c1c]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          {sortBy === option.value && (
                            <Icon icon="mdi:check" width="16" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons - Mobile */}
                <div className="space-y-3">
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-3 bg-linear-to-r from-[#c0392b] to-[#1c1c1c] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2"
                  >
                    <Icon icon="mdi:refresh" width="18" />
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full px-4 py-3 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-1/4">
          <div className="bg-[#f6f2ee] rounded-2xl p-5 md:p-6 sticky top-6">
            <h2 className="text-xl font-bold text-[#1c1c1c] mb-6 pb-3 border-b border-[#fdd18e]">
              <Icon
                icon="ic:round-filter-list"
                className="inline mr-2 text-[#0097a7]"
              />
              Filters
            </h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1c1c1c] mb-2">
                Search Cards
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-4 py-3 pl-10 bg-white rounded-lg border border-[#fdd18e] focus:outline-none focus:ring-2 focus:ring-[#0097a7]/30 focus:border-[#0097a7]"
                />
                <Icon
                  icon="ic:round-search"
                  className="absolute left-3 top-3.5 text-gray-400"
                  width="18"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1c1c1c] mb-3">
                Categories
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {OP_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? "bg-[#c0392b] text-white"
                        : "bg-white hover:bg-[#fdd18e]/30 text-[#1c1c1c]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.label}</span>
                      {selectedCategory === category.id && (
                        <Icon icon="mdi:check" width="16" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1c1c1c] mb-3">
                Price Range: ₹{priceRange[0].toLocaleString()} - ₹
                {priceRange[1].toLocaleString()}
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min={priceBounds[0]}
                  max={priceBounds[1]}
                  step={1000}
                  value={priceRange[0]}
                  onChange={(e) =>
                    handlePriceChange(Number(e.target.value), priceRange[1])
                  }
                  className="w-full h-2 bg-[#fdd18e] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c0392b]"
                />
                <input
                  type="range"
                  min={priceBounds[0]}
                  max={priceBounds[1]}
                  step={1000}
                  value={priceRange[1]}
                  onChange={(e) =>
                    handlePriceChange(priceRange[0], Number(e.target.value))
                  }
                  className="w-full h-2 bg-[#fdd18e] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c0392b] mt-2"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>₹{priceBounds[0].toLocaleString()}</span>
                <span>₹{priceBounds[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1c1c1c] mb-3">
                Sort By
              </label>
              <div className="space-y-2">
                {[
                  { value: "newest", label: "Newest First" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as any)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      sortBy === option.value
                        ? "bg-[#0097a7] text-white"
                        : "bg-white hover:bg-[#0097a7]/10 text-[#1c1c1c]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <Icon icon="mdi:check" width="16" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={resetFilters}
              className="w-full px-4 py-3 bg-linear-to-r from-[#c0392b] to-[#1c1c1c] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:refresh" width="18" />
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Results Header with Mobile Filter Indicator */}
          <div className="bg-linear-to-r from-[#f6f2ee] to-white rounded-xl p-4 md:p-5 mb-6 flex flex-row justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-[#1c1c1c]">
                  Showing {filteredCards.length} of {allCards.length} cards
                </h3>
                {/* Active Filters Indicator for Mobile */}
                <div className="lg:hidden flex items-center gap-1">
                  {(selectedCategory !== "all" || searchTerm) && (
                    <span className="text-xs bg-[#0097a7] text-white px-2 py-0.5 rounded-full">
                      {selectedCategory !== "all" ? "1+" : ""}
                      {searchTerm ? "+1" : ""}
                    </span>
                  )}
                </div>
              </div>
              {searchTerm && (
                <p className="text-sm text-gray-600">
                  Search results for:{" "}
                  <span className="font-semibold text-[#c0392b]">
                    {searchTerm}
                  </span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm font-medium text-[#1c1c1c]">
                  {view === "grid" ? "Grid View" : "List View"}
                </span>
                <button
                  onClick={toggleView}
                  className="relative w-12 h-7 rounded-full bg-linear-to-r from-[#fdd18e] to-[#0097a7] p-1 transition-all duration-300 hover:shadow-lg"
                  aria-label={`Switch to ${
                    view === "grid" ? "list" : "grid"
                  } view`}
                >
                  <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#fdd18e]/30 to-[#0097a7]/30"></div>
                  <div
                    className={`relative w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 transform ${
                      view === "list" ? "translate-x-5" : "translate-x-0"
                    }`}
                  >
                    <Icon
                      icon={ICONS.grid}
                      className={`absolute transition-all duration-300 ${
                        view === "grid"
                          ? "opacity-100 scale-100 text-[#0097a7]"
                          : "opacity-0 scale-50 text-gray-400"
                      }`}
                      width="12"
                      height="12"
                    />
                    <Icon
                      icon={ICONS.list}
                      className={`absolute transition-all duration-300 ${
                        view === "list"
                          ? "opacity-100 scale-100 text-[#c0392b]"
                          : "opacity-0 scale-50 text-gray-400"
                      }`}
                      width="12"
                      height="12"
                    />
                  </div>
                </button>
              </div>

              {/* Active Filters Badges */}
              <div className="hidden sm:flex flex-wrap gap-2">
                {selectedCategory !== "all" && (
                  <span className="px-3 py-1 bg-[#0097a7] text-white text-xs font-medium rounded-full flex items-center gap-1">
                    {
                      OP_CATEGORIES.find((c) => c.id === selectedCategory)
                        ?.label
                    }
                    <button
                      onClick={() => handleCategoryChange("all")}
                      className="ml-1 hover:text-[#fdd18e]"
                    >
                      <Icon icon="mdi:close" width="12" />
                    </button>
                  </span>
                )}
                {priceRange[0] > priceBounds[0] ||
                priceRange[1] < priceBounds[1] ? (
                  <span className="px-3 py-1 bg-[#fdd18e] text-[#1c1c1c] text-xs font-medium rounded-full flex items-center gap-1">
                    ₹{priceRange[0].toLocaleString()}+
                    <button
                      onClick={() =>
                        setPriceRange([priceBounds[0], priceBounds[1]])
                      }
                      className="ml-1 hover:text-[#c0392b]"
                    >
                      <Icon icon="mdi:close" width="12" />
                    </button>
                  </span>
                ) : null}
                {searchTerm && (
                  <span className="px-3 py-1 bg-[#c0392b] text-white text-xs font-medium rounded-full flex items-center gap-1">
                    "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-[#fdd18e]"
                    >
                      <Icon icon="mdi:close" width="12" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredCards.length > 0 ? (
            <OPCardLayout
              cards={filteredCards}
              view={view}
              isWishlisted={isWishlisted}
              onToggleWishlist={toggleWishlist}
            />
          ) : (
            <div className="text-center py-16 bg-linear-to-b from-white to-[#f6f2ee] rounded-2xl">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#fdd18e]/20 flex items-center justify-center">
                <Icon
                  icon="mdi:cards-outline"
                  className="w-12 h-12 text-[#c0392b]"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#1c1c1c] mb-3">
                No Cards Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Try adjusting your filters or search term to find what you're
                looking for.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange([priceBounds[0], priceBounds[1]]);
                  }}
                  className="px-6 py-3 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="px-6 py-3 bg-linear-to-r from-[#c0392b] to-[#1c1c1c] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200 lg:hidden"
                >
                  Adjust Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS for slide animation */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AllCards;
