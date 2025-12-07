// import { useState, useRef, useContext } from "react";
// import { useNavigate } from "react-router-dom"; // Add this import
// import { Icon } from "@iconify/react";
// import { AuthContext } from "../../../../../context/AuthContext";
// import { useFetchApprovedCards } from "../../../../../api/hooks/card/opCard/card";
// import { ICONS } from "../../../../../assets/icons";
// import { API_BASE_URL } from "../../../../../api/config/axiosClient";

// interface OPCardType {
//   _id: string;
//   name: string;
//   category: string;
//   condition: string;
//   images: string[];
//   description: string;
//   price?: number;
//   createdAt: string;
// }

// interface OPCardScrollableProps {
//   heading: string;
//   categoryFilter: string;
//   maxCards?: number;
// }

// // Custom hook for wishlist - User Specific
// const useWishlist = () => {
//   const { user } = useContext(AuthContext);

//   const [wishlist, setWishlist] = useState<string[]>(() => {
//     if (!user) {
//       const saved = localStorage.getItem('onePieceWishlist_anonymous');
//       return saved ? JSON.parse(saved) : [];
//     }
//     const saved = localStorage.getItem(`onePieceWishlist_${user.id}`);
//     return saved ? JSON.parse(saved) : [];
//   });

//   const toggleWishlist = (cardId: string) => {
//     setWishlist(prev => {
//       const newWishlist = prev.includes(cardId)
//         ? prev.filter(id => id !== cardId)
//         : [...prev, cardId];

//       if (!user) {
//         localStorage.setItem('onePieceWishlist_anonymous', JSON.stringify(newWishlist));
//       } else {
//         localStorage.setItem(`onePieceWishlist_${user.id}`, JSON.stringify(newWishlist));
//       }

//       return newWishlist;
//     });
//   };

//   const isWishlisted = (cardId: string) => wishlist.includes(cardId);

//   return { wishlist, toggleWishlist, isWishlisted };
// };

// const OPCardScrollable = ({ heading, categoryFilter, maxCards = 10 }: OPCardScrollableProps) => {
//   const navigate = useNavigate(); // Initialize navigate
//   const { data } = useFetchApprovedCards();
//   const allCards = data?.cards || [];

//   // Filter cards by category and limit to maxCards
//   const filteredCards = allCards
//     .filter((card: OPCardType) =>
//       categoryFilter === "all" ? true : card.category.includes(categoryFilter)
//     )
//     .slice(0, maxCards);

//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const { toggleWishlist, isWishlisted } = useWishlist();

//   const scroll = (direction: "left" | "right") => {
//     if (scrollContainerRef.current) {
//       const scrollAmount = 400;
//       scrollContainerRef.current.scrollBy({
//         left: direction === "left" ? -scrollAmount : scrollAmount,
//         behavior: "smooth"
//       });
//     }
//   };

//   // Handle card click to navigate to product details
//   const handleCardClick = (cardId: string) => {
//     navigate(`/cards/one-piece/cards/${cardId}`);
//   };

//   if (filteredCards.length === 0) return null;

//   return (
//     <div className="px-4 sm:px-6 md:px-20 max-w-[1440px] mx-auto mb-12 md:mb-16">
//       {/* Header with Navigation */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
//         <div>
//           <h2 className="text-2xl md:text-3xl font-bold text-[#1c1c1c]">
//             <span className="bg-linear-to-r from-[#0097a7] to-[#c0392b] bg-clip-text text-transparent">
//               {heading}
//             </span>
//           </h2>
//           <p className="text-gray-600 mt-2 text-sm md:text-base">
//             {filteredCards.length} premium {categoryFilter === "all" ? "" : categoryFilter} cards
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <span className="text-sm text-gray-600 hidden sm:block">
//             Scroll to discover
//           </span>
//           <div className="flex gap-2">
//             <button
//               onClick={() => scroll("left")}
//               className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-r from-[#f6f2ee] to-white border border-[#fdd18e]/30 flex items-center justify-center hover:border-[#0097a7] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               aria-label="Scroll left"
//               disabled={filteredCards.length === 0}
//             >
//               <Icon icon={ICONS.leftArrow} className="text-xl text-[#1c1c1c]" />
//             </button>
//             <button
//               onClick={() => scroll("right")}
//               className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-r from-[#f6f2ee] to-white border border-[#fdd18e]/30 flex items-center justify-center hover:border-[#0097a7] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               aria-label="Scroll right"
//               disabled={filteredCards.length === 0}
//             >
//               <Icon icon={ICONS.rightArrow} className="text-xl text-[#1c1c1c]" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Scrollable Cards Container */}
//       <div className="relative">
//         {/* Scroll Container */}
//         <div
//           ref={scrollContainerRef}
//           className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
//           style={{ scrollBehavior: "smooth" }}
//         >
//           {filteredCards.map((card: OPCardType) => (
//             <div
//               key={card._id}
//               onClick={() => handleCardClick(card._id)} // Add click handler here
//               className="group relative shrink-0 w-64 md:w-72 lg:w-80 bg-white rounded-2xl border border-[#f6f2ee] hover:border-[#fdd18e] transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer"
//             >
//               {/* Image Container */}
//               <div className="relative h-48 md:h-56 overflow-hidden">
//                 <img
//                   src={`${API_BASE_URL}${card.images?.[0]}`}
//                   alt={card.name}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                 />

//                 {/* Gradient Overlay */}
//                 <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                 {/* Category Badge */}
//                 <div className="absolute top-3 left-3">
//                   <span className="px-3 py-1 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white text-xs font-semibold rounded-full">
//                     {card.category}
//                   </span>
//                 </div>

//                 {/* Wishlist Button */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevent card click when clicking wishlist button
//                     toggleWishlist(card._id);
//                   }}
//                   className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
//                   aria-label={isWishlisted(card._id) ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   <Icon
//                     icon={isWishlisted(card._id) ? ICONS.heartFilled : ICONS.heartOutline}
//                     className={`text-lg md:text-xl ${
//                       isWishlisted(card._id) ? "text-[#c0392b]" : "text-[#1c1c1c] hover:text-[#c0392b]"
//                     } transition-colors duration-300`}
//                   />
//                 </button>
//               </div>

//               {/* Card Info */}
//               <div className="p-4 md:p-5">
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-bold text-lg md:text-xl text-[#1c1c1c] group-hover:text-[#c0392b] transition-colors duration-300 line-clamp-1">
//                       {card.name}
//                     </h3>
//                     <div className="flex items-center gap-2 mt-1">
//                       <span className="text-xs md:text-sm text-[#0097a7] font-medium px-2 md:px-3 py-1 bg-[#0097a7]/10 rounded-full">
//                         {card.condition}
//                       </span>
//                     </div>
//                   </div>

//                   {card.price && (
//                     <div className="ml-2">
//                       <div className="font-bold text-xl md:text-2xl text-[#0097a7]">
//                         ₹{card.price.toLocaleString()}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <p className="text-gray-600 text-sm mt-3 line-clamp-2">
//                   {card.description}
//                 </p>

//                 <div className="mt-4 pt-4 border-t border-[#f6f2ee]">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent card click when clicking "View Details"
//                       handleCardClick(card._id);
//                     }}
//                     className="w-full px-4 py-2 bg-[#1c1c1c] text-white text-sm font-semibold rounded-lg hover:bg-[#c0392b] transition-colors duration-300"
//                   >
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Gradient Fade Edges */}
//         <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-white to-transparent pointer-events-none" />
//         <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-white to-transparent pointer-events-none" />
//       </div>

//       {/* Custom Scrollbar Styles */}
//       <style>{`
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default OPCardScrollable;
import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import { useFetchApprovedCards } from "../../../../../api/hooks/card/one-piece/useCards";
import { ICONS } from "../../../../../assets/icons";
import { Icon } from "@iconify/react";
import type { OPCardType } from "../../../../../components/card/one-piece/cards/OPCard";
import OPCard from "../../../../../components/card/one-piece/cards/OPCard";

interface OPCardScrollableProps {
  heading: string;
  categoryFilter: string;
  maxCards?: number;
}

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

const OPCardScrollable = ({
  heading,
  categoryFilter,
  maxCards = 10,
}: OPCardScrollableProps) => {
  const { data } = useFetchApprovedCards();
  const allCards = data?.cards || [];

  // Filter cards by category and limit to maxCards
  const filteredCards = allCards
    .filter((card: OPCardType) =>
      categoryFilter === "all" ? true : card.category.includes(categoryFilter)
    )
    .slice(0, maxCards);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toggleWishlist, isWishlisted } = useWishlist();

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (filteredCards.length === 0) return null;

  return (
    <div className="px-4 sm:px-6 md:px-20 max-w-[1440px] mx-auto mb-12 md:mb-16">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1c1c1c]">
            <span className="bg-linear-to-r from-[#0097a7] to-[#c0392b] bg-clip-text text-transparent">
              {heading}
            </span>
          </h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            {filteredCards.length} premium{" "}
            {categoryFilter === "all" ? "" : categoryFilter} cards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:block">
            Scroll to discover
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-r from-[#f6f2ee] to-white border border-[#fdd18e]/30 flex items-center justify-center hover:border-[#0097a7] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll left"
              disabled={filteredCards.length === 0}
            >
              <Icon icon={ICONS.leftArrow} className="text-xl text-[#1c1c1c]" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-r from-[#f6f2ee] to-white border border-[#fdd18e]/30 flex items-center justify-center hover:border-[#0097a7] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll right"
              disabled={filteredCards.length === 0}
            >
              <Icon
                icon={ICONS.rightArrow}
                className="text-xl text-[#1c1c1c]"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Cards Container */}
      <div className="relative">
        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          {filteredCards.map((card: OPCardType) => (
            <div key={card._id} className="shrink-0 w-64 md:w-72 lg:w-80">
              <OPCard
                card={card}
                view="grid"
                isWishlisted={isWishlisted(card._id)}
                onToggleWishlist={toggleWishlist}
              />
            </div>
          ))}
        </div>

        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default OPCardScrollable;
