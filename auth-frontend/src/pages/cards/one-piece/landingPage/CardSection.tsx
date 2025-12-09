// import { useState } from "react";
// import { useFetchApprovedCards } from "../../../../api/hooks/card/opCard/card";
// import OPCardLayout from "../components/cards/OPCardLayout";
// import { ICONS } from "../../../../assets/icons";
// import { Icon } from "@iconify/react";

// export default function CardSection() {
//   const { data } = useFetchApprovedCards();
//   const cards = data?.cards || [];

//   const [view, setView] = useState<"grid" | "list">("grid");

//   const toggleView = () => {
//     setView((prev) => (prev === "grid" ? "list" : "grid"));
//   };

//   return (
//     <div className=" px-6 md:px-20 max-w-[1440px] mx-auto py-8">
//       {/* Header */}
//       <div className="text-center mb-6">
//         <h1 className="text-3xl md:text-4xl font-bold text-[#1c1c1c] mb-4">
//           <span className="bg-[#c0392b] text-[#f6f2ee] px-3 py-2 rounded-2xl">
//             One Piece
//           </span>{" "}
//           Cards
//         </h1>
//         <p className="md:text-[20px] text-gray-600 max-w-2xl mx-auto">
//           Discover premium collectible cards from the world of One Piece. Each
//           card is verified authentic and carefully curated.
//         </p>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-row justify-between items-center gap-4 mb-8 p-3 bg-linear-to-r from-[#f6f2ee] to-white rounded-2xl shadow-sm">
//         <div className="text-sm text-gray-600">
//           Showing{" "}
//           <span className="font-bold text-[#c0392b]">{cards.length}</span>{" "}
//           premium cards
//         </div>

//         <div className="flex items-center gap-3">
//           <span className="sm:flex hidden text-sm font-medium text-[#1c1c1c]">
//             {view === "grid" ? "Grid View" : "List View"}
//           </span>
//           <button
//             onClick={toggleView}
//             className="relative w-14 h-8 rounded-full bg-linear-to-r from-[#fdd18e] to-[#0097a7] p-1 transition-all duration-500 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#c0392b]/30"
//             aria-label={`Switch to ${view === "grid" ? "list" : "grid"} view`}
//           >
//             {/* Track */}
//             <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#fdd18e]/30 to-[#0097a7]/30"></div>

//             {/* Thumb with icon */}
//             <div
//               className={`relative w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-500 transform ${
//                 view === "list" ? "translate-x-6" : "translate-x-0"
//               }`}
//             >
//               <div className="relative w-full h-full flex items-center justify-center">
//                 {/* Grid Icon */}
//                 <Icon
//                   icon={ICONS.grid}
//                   className={`absolute transition-all duration-500 ${
//                     view === "grid"
//                       ? "opacity-100 scale-100 text-[#0097a7]"
//                       : "opacity-0 scale-50 text-gray-400"
//                   }`}
//                   width="16"
//                   height="16"
//                 />
//                 {/* List Icon */}
//                 <Icon
//                   icon={ICONS.list}
//                   className={`absolute transition-all duration-500 ${
//                     view === "list"
//                       ? "opacity-100 scale-100 text-[#c0392b]"
//                       : "opacity-0 scale-50 text-gray-400"
//                   }`}
//                   width="16"
//                   height="16"
//                 />
//               </div>
//             </div>

//             {/* Background icons (faint) */}
//             <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
//               <Icon
//                 icon={ICONS.grid}
//                 className={`transition-all duration-500 ${
//                   view === "grid"
//                     ? "opacity-30 text-[#0097a7]"
//                     : "opacity-20 text-gray-400"
//                 }`}
//                 width="12"
//                 height="12"
//               />
//               <Icon
//                 icon={ICONS.list}
//                 className={`transition-all duration-500 ${
//                   view === "list"
//                     ? "opacity-30 text-[#c0392b]"
//                     : "opacity-20 text-gray-400"
//                 }`}
//                 width="12"
//                 height="12"
//               />
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Cards */}
//       {cards.length > 0 ? (
//         <OPCardLayout cards={cards} view={view} />
//       ) : (
//         <div className="text-center py-16 bg-linear-to-b from-white to-[#f6f2ee] rounded-3xl">
//           <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#fdd18e]/20 flex items-center justify-center">
//             <svg
//               className="w-12 h-12 text-[#c0392b]"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
//               />
//             </svg>
//           </div>
//           <h3 className="text-2xl font-bold text-[#1c1c1c] mb-2">
//             No Cards Available
//           </h3>
//           <p className="text-gray-600">
//             Check back later for new premium One Piece cards
//           </p>
//         </div>
//       )}

//       {/* Footer Note */}
//       {/* <div className="mt-12 text-center text-sm text-gray-500">
//         <p>All cards are verified authentic and come with premium protection</p>
//       </div> */}
//     </div>
//   );
// }

// import { useState } from "react";
// import { useFetchApprovedCards } from "../../../../api/hooks/card/opCard/card";
// import OPCardLayout from "../components/cards/OPCardLayout";
// import { ICONS } from "../../../../assets/icons";
// import { Icon } from "@iconify/react";

// // Custom hook for wishlist
// const useWishlist = () => {
//   const [wishlist, setWishlist] = useState<string[]>(() => {
//     const saved = localStorage.getItem('onePieceWishlist');
//     return saved ? JSON.parse(saved) : [];
//   });

//   const toggleWishlist = (cardId: string) => {
//     setWishlist(prev => {
//       const newWishlist = prev.includes(cardId)
//         ? prev.filter(id => id !== cardId)
//         : [...prev, cardId];
//       localStorage.setItem('onePieceWishlist', JSON.stringify(newWishlist));
//       return newWishlist;
//     });
//   };

//   const isWishlisted = (cardId: string) => wishlist.includes(cardId);

//   return { wishlist, toggleWishlist, isWishlisted };
// };

// export default function CardSection() {
//   const { data } = useFetchApprovedCards();
//   const cards = data?.cards || [];
//   console.log(cards)

//   const [view, setView] = useState<"grid" | "list">("grid");
//   const { toggleWishlist, isWishlisted } = useWishlist();

//   const toggleView = () => {
//     setView((prev) => (prev === "grid" ? "list" : "grid"));
//   };

//   return (
//     <div className="px-4 sm:px-6 md:px-20 max-w-[1440px] mx-auto py-6 md:py-8">
//       {/* Header */}
//       <div className="text-center mb-4 md:mb-6">
//         <h1 className="text-2xl md:text-3xl font-bold text-[#1c1c1c] mb-3 md:mb-4">
//           <span className="bg-[#c0392b] text-[#f6f2ee] px-3 py-1 md:px-3 md:py-2 rounded-2xl">
//             One Piece
//           </span>{" "}
//           <span className="text-2xl lg:text-3xl">Cards</span>
//         </h1>
//         <p className="text-sm md:text-base lg:text-[20px] text-gray-600 max-w-2xl mx-auto px-2">
//           Discover premium collectible cards from the world of One Piece. Each
//           card is verified authentic and carefully curated.
//         </p>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-row justify-between items-center gap-3 md:gap-4 mb-6 md:mb-8 p-3 md:p-4 bg-linear-to-r from-[#f6f2ee] to-white rounded-xl md:rounded-2xl shadow-sm">
//         <div className="text-xs md:text-sm text-gray-600">
//           Showing{" "}
//           <span className="font-bold text-[#c0392b]">{cards.length}</span>{" "}
//           premium cards
//         </div>

//         <div className="flex items-center gap-2 md:gap-3">
//           <span className="hidden sm:inline text-xs md:text-sm font-medium text-[#1c1c1c]">
//             {view === "grid" ? "Grid View" : "List View"}
//           </span>
//           <button
//             onClick={toggleView}
//             className="relative w-12 h-7 md:w-14 md:h-8 rounded-full bg-linear-to-r from-[#fdd18e] to-[#0097a7] p-1 transition-all duration-500 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#c0392b]/30"
//             aria-label={`Switch to ${view === "grid" ? "list" : "grid"} view`}
//           >
//             {/* Track */}
//             <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#fdd18e]/30 to-[#0097a7]/30"></div>

//             {/* Thumb with icon */}
//             <div
//               className={`relative w-5 h-5 md:w-6 md:h-6 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-500 transform ${
//                 view === "list" ? "translate-x-5 md:translate-x-6" : "translate-x-0"
//               }`}
//             >
//               <div className="relative w-full h-full flex items-center justify-center">
//                 {/* Grid Icon */}
//                 <Icon
//                   icon={ICONS.grid}
//                   className={`absolute transition-all duration-500 ${
//                     view === "grid"
//                       ? "opacity-100 scale-100 text-[#0097a7]"
//                       : "opacity-0 scale-50 text-gray-400"
//                   }`}
//                   width="12"
//                   height="12"
//                 />
//                 {/* List Icon */}
//                 <Icon
//                   icon={ICONS.list}
//                   className={`absolute transition-all duration-500 ${
//                     view === "list"
//                       ? "opacity-100 scale-100 text-[#c0392b]"
//                       : "opacity-0 scale-50 text-gray-400"
//                   }`}
//                   width="12"
//                   height="12"
//                 />
//               </div>
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Cards */}
//       {cards.length > 0 ? (
//         <OPCardLayout
//           cards={cards}
//           view={view}
//           isWishlisted={isWishlisted}
//           onToggleWishlist={toggleWishlist}
//         />
//       ) : (
//         <div className="text-center py-12 md:py-16 bg-linear-to-b from-white to-[#f6f2ee] rounded-2xl md:rounded-3xl">
//           <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full bg-[#fdd18e]/20 flex items-center justify-center">
//             <svg
//               className="w-8 h-8 md:w-12 md:h-12 text-[#c0392b]"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
//               />
//             </svg>
//           </div>
//           <h3 className="text-xl md:text-2xl font-bold text-[#1c1c1c] mb-2">
//             No Cards Available
//           </h3>
//           <p className="text-gray-600 text-sm md:text-base">
//             Check back later for new premium One Piece cards
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useContext } from "react";
import { useFetchApprovedCards } from "../../../../api/hooks/card/one-piece/useCards";
import { ICONS } from "../../../../assets/icons";
import { Icon } from "@iconify/react";
import { AuthContext } from "../../../../context/AuthContext";
import OPCardLayout from "../../../../components/card/one-piece/cards/OPCardLayout";

// Custom hook for wishlist - User Specific
const useWishlist = () => {
  const { user } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (!user) {
      const saved = localStorage.getItem("onePieceWishlist_anonymous");
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem(`onePieceWishlist_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (cardId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId];

      if (!user) {
        localStorage.setItem(
          "onePieceWishlist_anonymous",
          JSON.stringify(newWishlist)
        );
      } else {
        localStorage.setItem(
          `onePieceWishlist_${user.id}`,
          JSON.stringify(newWishlist)
        );
      }

      return newWishlist;
    });
  };

  const isWishlisted = (cardId: string) => wishlist.includes(cardId);

  return { wishlist, toggleWishlist, isWishlisted };
};

export default function CardSection() {
  const { data } = useFetchApprovedCards();
  console.log(data)
  const allCards = data?.cards || [];

  // Sort cards by createdAt in descending order and take latest 8
  const latestCards = [...allCards]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  const [view, setView] = useState<"grid" | "list">("grid");
  const { toggleWishlist, isWishlisted } = useWishlist();

  const toggleView = () => {
    setView((prev) => (prev === "grid" ? "list" : "grid"));
  };

  return (
    <div className="px-4 sm:px-6 md:px-20 max-w-[1440px] mx-auto py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1c1c1c] mb-3 md:mb-4">
          <span className="bg-[#c0392b] text-[#f6f2ee] px-3 py-1 md:px-3 md:py-2 rounded-2xl">
            One Piece
          </span>{" "}
          <span className="text-2xl lg:text-3xl">Cards</span>
        </h1>
        <p className="text-sm md:text-base lg:text-[20px] text-gray-600 max-w-2xl mx-auto px-2">
          Discover premium collectible cards from the world of One Piece. Each
          card is verified authentic and carefully curated.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-row justify-between items-center gap-3 md:gap-4 mb-6 md:mb-8 p-3 md:p-4 bg-linear-to-r from-[#f6f2ee] to-white rounded-xl md:rounded-2xl shadow-sm">
        <div className="text-xs md:text-sm text-gray-600">
          Showing{" "}
          <span className="font-bold text-[#c0392b]">{latestCards.length}</span>{" "}
          latest premium cards
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <span className="hidden sm:inline text-xs md:text-sm font-medium text-[#1c1c1c]">
            {view === "grid" ? "Grid View" : "List View"}
          </span>
          <button
            onClick={toggleView}
            className="relative w-12 h-7 md:w-14 md:h-8 rounded-full bg-linear-to-r from-[#fdd18e] to-[#0097a7] p-1 transition-all duration-500 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#c0392b]/30"
            aria-label={`Switch to ${view === "grid" ? "list" : "grid"} view`}
          >
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#fdd18e]/30 to-[#0097a7]/30"></div>
            <div
              className={`relative w-5 h-5 md:w-6 md:h-6 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-500 transform ${
                view === "list"
                  ? "translate-x-5 md:translate-x-6"
                  : "translate-x-0"
              }`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Icon
                  icon={ICONS.grid}
                  className={`absolute transition-all duration-500 ${
                    view === "grid"
                      ? "opacity-100 scale-100 text-[#0097a7]"
                      : "opacity-0 scale-50 text-gray-400"
                  }`}
                  width="12"
                  height="12"
                />
                <Icon
                  icon={ICONS.list}
                  className={`absolute transition-all duration-500 ${
                    view === "list"
                      ? "opacity-100 scale-100 text-[#c0392b]"
                      : "opacity-0 scale-50 text-gray-400"
                  }`}
                  width="12"
                  height="12"
                />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Cards */}
      {latestCards.length > 0 ? (
        <OPCardLayout
          cards={latestCards}
          view={view}
          isWishlisted={isWishlisted}
          onToggleWishlist={toggleWishlist}
        />
      ) : (
        <div className="text-center py-12 md:py-16 bg-linear-to-b from-white to-[#f6f2ee] rounded-2xl md:rounded-3xl">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full bg-[#fdd18e]/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 md:w-12 md:h-12 text-[#c0392b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[#1c1c1c] mb-2">
            No Cards Available
          </h3>
          <p className="text-gray-600 text-sm md:text-base">
            Check back later for new premium One Piece cards
          </p>
        </div>
      )}
    </div>
  );
}
