// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../../../../../api/config/axiosClient";
// import CustomButton from "../../../../../components/UI/CustomButton";

// export interface OPCardType {
//   _id: string;
//   name: string;
//   category: string;
//   condition: string;
//   images: string[];
//   description: string;
//   price?: number;
// }

// interface Props {
//   card: OPCardType;
//   view?: "grid" | "list";
// }

// export default function OPCard({ card, view = "grid" }: Props) {
//   const navigate = useNavigate();

//   return (
//     <div
//       onClick={() => navigate(`/cards/one-piece/cards/${card._id}`)}
//       className={`group cursor-pointer bg-white rounded-2xl border border-[#f6f2ee] hover:border-[#fdd18e] transition-all duration-300 hover:shadow-2xl overflow-hidden
//         ${view === "list" ? "flex gap-6 p-6" : ""}
//       `}
//     >
//       {/* Image Container */}
//       <div
//         className={`relative overflow-hidden ${
//           view === "list" ? "w-48 h-48 shrink-0" : ""
//         }`}
//       >
//         <img
//           src={`${API_BASE_URL}${card.images?.[0]}`}
//           alt={card.name}
//           className={`object-cover transition-transform duration-500 group-hover:scale-110
//             ${view === "list" ? "w-full h-full" : "w-full h-64"}
//           `}
//         />
//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//         {/* Condition Badge */}
//         <div className="absolute top-3 left-3">
//           <span
//             className={`px-3 py-1 rounded-full text-xs font-semibold
//             ${
//               card.condition === "Good" || "New Card" || "Excellent"
//                 ? "bg-[#0097a7] text-white"
//                 : card.condition === "Poor" || "Not Bad"
//                 ? "bg-[#fdd18e] text-[#1c1c1c]"
//                 : "bg-[#c0392b]/10 text-[#c0392b]"
//             }`}
//           >
//             {card.condition}
//           </span>
//         </div>
//       </div>

//       {/* Info */}
//       <div className={`${view === "list" ? "flex-1 py-2" : "p-5"}`}>
//         <div className="flex justify-between items-start">
//           <div>
//             <h3 className="font-bold text-xl text-[#1c1c1c] group-hover:text-[#c0392b] transition-colors duration-300 line-clamp-1">
//               {card.name}
//             </h3>
//             <div className="flex items-center gap-2 mt-1">
//               <span className="text-sm text-[#0097a7] font-medium px-3 py-1 bg-[#0097a7]/10 rounded-full">
//                 {card.category}
//               </span>
//             </div>
//           </div>

//           {card.price && (
//             <div className="flex flex-col items-end">
//               <span className="text-xs text-gray-500">Price</span>
//               <div className="font-bold md:text-2xl text-[#0097a7]">
//                 ₹{card.price.toLocaleString()}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* <p
//           className={`text-gray-600 mt-3 ${
//             view === "grid" ? "line-clamp-2" : ""
//           }`}
//         >
//           {card.description}
//         </p> */}

//         {/* Action Button */}
//         <div
//           className={`mt-4 ${
//             view === "list" ? "flex items-center justify-between" : ""
//           }`}
//         >
//           <CustomButton
//             label="View Details"
//             className="px-2 md:px-4 py-2 bg-[#1c1c1c] text-white text-sm font-semibold rounded-lg hover:bg-[#c0392b] transition-colors duration-300"
//           />

//           {view === "list" && (
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-500">
//                 Click card for full details
//               </span>
//               <div className="w-8 h-8 rounded-full bg-[#f6f2ee] flex items-center justify-center">
//                 <svg
//                   className="w-4 h-4 text-[#0097a7]"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M14 5l7 7m0 0l-7 7m7-7H3"
//                   />
//                 </svg>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../../../../../api/config/axiosClient";
// import CustomButton from "../../../../../components/UI/CustomButton";
// import { Icon } from "@iconify/react";
// import { ICONS } from "../../../../../assets/icons";

// export interface OPCardType {
//   _id: string;
//   name: string;
//   category: string;
//   condition: string;
//   images: string[];
//   description: string;
//   price?: number;
// }

// interface Props {
//   card: OPCardType;
//   view?: "grid" | "list";
//   isWishlisted?: boolean;
//   onToggleWishlist?: (cardId: string) => void;
// }

// export default function OPCard({
//   card,
//   view = "grid",
//   isWishlisted = false,
//   onToggleWishlist,
// }: Props) {
//   const navigate = useNavigate();

//   const handleWishlistClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (onToggleWishlist) {
//       onToggleWishlist(card._id);
//     }
//   };

//   const getConditionColor = (condition: string) => {
//     const goodConditions = [
//       "Good",
//       "New Card",
//       "Excellent",
//       "Mint",
//       "Near Mint",
//     ];
//     const poorConditions = ["Poor", "Not Bad", "Fair"];

//     if (goodConditions.includes(condition)) {
//       return "bg-[#0097a7] text-white";
//     } else if (poorConditions.includes(condition)) {
//       return "bg-[#fdd18e] text-[#1c1c1c]";
//     } else {
//       return "bg-[#c0392b]/10 text-[#c0392b]";
//     }
//   };

//   return (
//     <div
//       onClick={() => navigate(`/cards/one-piece/cards/${card._id}`)}
//       className={`group cursor-pointer bg-white rounded-xl md:rounded-2xl border border-[#f6f2ee] hover:border-[#fdd18e] transition-all duration-300 hover:shadow-lg md:hover:shadow-2xl overflow-hidden
//         ${
//           view === "list"
//             ? "flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6"
//             : ""
//         }
//       `}
//     >
//       {/* Image Container */}
//       <div
//         className={`relative overflow-hidden ${
//           view === "list" ? "w-full h-48 md:w-30 md:h-30 shrink-0" : "w-full"
//         }`}
//       >
//         <img
//           src={`${API_BASE_URL}${card.images?.[0]}`}
//           alt={card.name}
//           className={`object-cover transition-transform duration-500 group-hover:scale-110
//             ${view === "list" ? "w-full h-full" : "w-full h-48 sm:h-56 md:h-64"}
//           `}
//         />

//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//         {/* Condition Badge */}
//         {view === "grid" && (
//           <div className="absolute top-2 md:top-3 left-2 md:left-3">
//             <span
//               className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${getConditionColor(
//                 card.condition
//               )}`}
//             >
//               {card.condition}
//             </span>
//           </div>
//         )}

//         {/* Wishlist Button */}
//         <button
//           onClick={handleWishlistClick}
//           className="absolute top-2 md:top-3 right-2 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
//           aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           <Icon
//             icon={isWishlisted ? ICONS.heartFilled : ICONS.heartOutline}
//             className={`text-lg md:text-xl ${
//               isWishlisted
//                 ? "text-[#c0392b]"
//                 : "text-[#1c1c1c] hover:text-[#c0392b]"
//             } transition-colors duration-300`}
//           />
//         </button>
//       </div>

//       {/* Info */}
//       <div className={`${view === "list" ? "flex-1" : "p-3 md:p-5"}`}>
//         <div className="flex justify-between items-start">
//           <div className="flex-1 min-w-0">
//             <h3 className="font-bold text-base md:text-xl text-[#1c1c1c] group-hover:text-[#c0392b] transition-colors duration-300 line-clamp-1">
//               {card.name}
//             </h3>
//             <div className="flex items-center gap-2 mt-1">
//               <span className="text-xs md:text-sm text-[#0097a7] font-medium px-2 md:px-3 py-1 bg-[#0097a7]/10 rounded-full">
//                 {card.category}
//               </span>
//             </div>
//           </div>

//           {card.price && (
//             <div className="flex flex-col items-end ml-2">
//               <span className="text-xs text-gray-500">Price</span>
//               <div className="font-bold text-lg md:text-2xl text-[#0097a7]">
//                 ₹{card.price.toLocaleString()}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Action Button */}
//         <div
//           className={`mt-3 md:mt-4 ${
//             view === "list"
//               ? "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
//               : ""
//           }`}
//         >
//           <CustomButton
//             label="View Details"
//             className="px-3 md:px-4 py-2 bg-[#1c1c1c] text-white text-xs md:text-sm font-semibold rounded-lg hover:bg-[#c0392b] transition-colors duration-300 w-full sm:w-auto"
//           />

//           {view === "list" && (
//             <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm">
//               <span className="text-gray-500 hidden sm:inline">
//                 Click card for full details
//               </span>
//               <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#f6f2ee] flex items-center justify-center ml-auto">
//                 <svg
//                   className="w-3 h-3 md:w-4 md:h-4 text-[#0097a7]"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M14 5l7 7m0 0l-7 7m7-7H3"
//                   />
//                 </svg>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useNavigate } from "react-router-dom";
// import { Icon } from "@iconify/react";
// import { API_BASE_URL } from "../../../../api/clients/axiosClient";
// import { ICONS } from "../../../../assets/icons";

// export interface OPCardType {
//   _id: string;
//   name: string;
//   category: string;
//   condition: string;
//   images: string[];
//   description: string;
//   price?: number;
// }

// interface Props {
//   card: OPCardType;
//   view?: "grid" | "list";
//   isWishlisted?: boolean;
//   onToggleWishlist?: (cardId: string) => void;
// }

// export default function OPCard({
//   card,
//   view = "grid",
//   isWishlisted = false,
//   onToggleWishlist,
// }: Props) {
//   const navigate = useNavigate();

//   const handleCardClick = () => {
//     navigate(`/cards/one-piece/cards/${card._id}`);
//   };

//   const handleWishlistClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (onToggleWishlist) {
//       onToggleWishlist(card._id);
//     }
//   };

//   // For list view, use a different layout
//   if (view === "list") {
//     return (
//       <div
//         onClick={handleCardClick}
//         className="group cursor-pointer flex flex-col md:flex-row gap-6 bg-white rounded-2xl border border-[#f6f2ee] hover:border-[#fdd18e] transition-all duration-300 hover:shadow-xl overflow-hidden p-6"
//       >
//         {/* Image Container for List View */}
//         <div className="relative shrink-0 w-full md:w-60 h-48 md:h-60 overflow-hidden rounded-xl">
//           <img
//             src={`${API_BASE_URL}${card.images?.[0]}`}
//             alt={card.name}
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//           />

//           {/* Gradient Overlay */}
//           <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//           {/* Category Badge */}
//           <div className="absolute top-3 left-3">
//             <span className="px-3 py-1 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white text-xs font-semibold rounded-full">
//               {card.category}
//             </span>
//           </div>

//           {/* Wishlist Button */}
//           <button
//             onClick={handleWishlistClick}
//             className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
//             aria-label={
//               isWishlisted ? "Remove from wishlist" : "Add to wishlist"
//             }
//           >
//             <Icon
//               icon={isWishlisted ? ICONS.heartFilled : ICONS.heartOutline}
//               className={`text-xl ${
//                 isWishlisted
//                   ? "text-[#c0392b]"
//                   : "text-[#1c1c1c] hover:text-[#c0392b]"
//               } transition-colors duration-300`}
//             />
//           </button>
//         </div>

//         {/* Card Info for List View */}
//         <div className="flex-1 flex flex-col justify-between">
//           <div>
//             <div className="flex justify-between items-start">
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-bold text-2xl text-[#1c1c1c] group-hover:text-[#c0392b] transition-colors duration-300 line-clamp-1">
//                   {card.name}
//                 </h3>
//                 <div className="flex items-center gap-2 mt-3">
//                   <span className="text-sm text-[#0097a7] font-medium px-3 py-1 bg-[#0097a7]/10 rounded-full">
//                     {card.condition}
//                   </span>
//                 </div>
//               </div>

//               {card.price && (
//                 <div className="ml-4">
//                   <div className="font-bold text-3xl text-[#0097a7]">
//                     ₹{card.price.toLocaleString()}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <p className="text-gray-600 text-base mt-4 line-clamp-3">
//               {card.description}
//             </p>
//           </div>

//           <div className="mt-6 pt-4 border-t border-[#f6f2ee]">
//             <button
//               onClick={handleCardClick}
//               className="px-6 py-3 bg-[#1c1c1c] text-white text-sm font-semibold rounded-lg hover:bg-[#c0392b] transition-colors duration-300"
//             >
//               View Details
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Grid View (same as OPCardScrollable)
//   return (
//     <div
//       onClick={handleCardClick}
//       className="group cursor-pointer relative shrink-0 w-full bg-white rounded-2xl border border-[#f6f2ee] hover:border-[#fdd18e] transition-all duration-300 hover:shadow-xl overflow-hidden"
//     >
//       {/* Image Container */}
//       <div className="relative h-56 overflow-hidden">
//         <img
//           src={`${API_BASE_URL}${card.images?.[0]}`}
//           alt={card.name}
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//         />

//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//         {/* Category Badge */}
//         <div className="absolute top-3 left-3">
//           <span className="px-3 py-1 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white text-xs font-semibold rounded-full">
//             {card.category}
//           </span>
//         </div>

//         {/* Wishlist Button */}
//         <button
//           onClick={handleWishlistClick}
//           className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
//           aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           <Icon
//             icon={isWishlisted ? ICONS.heartFilled : ICONS.heartOutline}
//             className={`text-xl ${
//               isWishlisted
//                 ? "text-[#c0392b]"
//                 : "text-[#1c1c1c] hover:text-[#c0392b]"
//             } transition-colors duration-300`}
//           />
//         </button>
//       </div>

//       {/* Card Info */}
//       <div className="p-5">
//         <div className="flex justify-between items-start">
//           <div className="flex-1 min-w-0">
//             <h3 className="font-bold text-xl text-[#1c1c1c] group-hover:text-[#c0392b] transition-colors duration-300 line-clamp-1">
//               {card.name}
//             </h3>
//             <div className="flex items-center gap-2 mt-2">
//               <span className="text-sm text-[#0097a7] font-medium px-3 py-1 bg-[#0097a7]/10 rounded-full">
//                 {card.condition}
//               </span>
//             </div>
//           </div>

//           {card.price && (
//             <div className="ml-2">
//               <div className="font-bold text-2xl text-[#0097a7]">
//                 ₹{card.price.toLocaleString()}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* <p className="text-gray-600 text-sm mt-3 line-clamp-2">
//           {card.description}
//         </p> */}

//         <div className="mt-4 pt-4 border-t border-[#f6f2ee]">
//           <button
//             onClick={handleCardClick}
//             className="w-full px-4 py-2 bg-[#1c1c1c] text-white text-sm font-semibold rounded-lg hover:bg-[#c0392b] transition-colors duration-300"
//           >
//             View Details
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/card/one-piece/cards/OPCard.tsx
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { API_BASE_URL } from "../../../../api/clients/axiosClient";
import { ICONS } from "../../../../assets/icons";
import { AuthContext } from "../../../../context/AuthContext";

export interface OPCardType {
  _id: string;
  name: string;
  category: string;
  condition: string;
  images: string[];
  description: string;
  price?: number;
  status?: "pending" | "approved" | "rejected";
  seller?: {
    _id: string;
    fullName?: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
  rejectionReason?: string;
}

interface Props {
  card: OPCardType;
  view?: "grid" | "list";
  isWishlisted?: boolean;
  onToggleWishlist?: (cardId: string) => void;
  onDelete?: (cardId: string) => void;
  showDelete?: boolean;
}

export default function OPCard({
  card,
  view = "grid",
  isWishlisted = false,
  onToggleWishlist,
  onDelete,
  showDelete = false,
}: Props) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCardClick = () => {
    navigate(`/cards/one-piece/cards/${card._id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(card._id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(card._id);
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // For list view, use a different layout
  if (view === "list") {
    return (
      <>
        <div
          onClick={handleCardClick}
          className="group cursor-pointer flex flex-col md:flex-row gap-6 bg-white rounded-2xl border border-[#f6f2ee] hover:border-[#fdd18e] transition-all duration-300 hover:shadow-xl overflow-hidden p-6"
        >
          {/* Image Container for List View */}
          <div className="relative shrink-0 w-full md:w-60 h-48 md:h-60 overflow-hidden rounded-xl">
            <img
              src={`${API_BASE_URL}${card.images?.[0]}`}
              alt={card.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white text-xs font-semibold rounded-full">
                {card.category}
              </span>
            </div>

            {/* Delete Button */}
            {showDelete && onDelete && (
              <button
                onClick={handleDeleteClick}
                className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-100 transition-all duration-300 hover:scale-110"
                aria-label="Delete card"
              >
                <Icon
                  icon="mdi:delete"
                  className="text-xl text-red-500 hover:text-red-700"
                />
              </button>
            )}

            {/* Wishlist Button */}
            {onToggleWishlist && (
              <button
                onClick={handleWishlistClick}
                className={`absolute top-3 ${
                  showDelete ? "right-14" : "right-3"
                } w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110`}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Icon
                  icon={isWishlisted ? ICONS.heartFilled : ICONS.heartOutline}
                  className={`text-xl ${
                    isWishlisted
                      ? "text-[#c0392b]"
                      : "text-[#1c1c1c] hover:text-[#c0392b]"
                  } transition-colors duration-300`}
                />
              </button>
            )}
          </div>

          {/* Card Info for List View */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-2xl text-[#1c1c1c] group-hover:text-[#c0392b] transition-colors duration-300 line-clamp-1">
                    {card.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm text-[#0097a7] font-medium px-3 py-1 bg-[#0097a7]/10 rounded-full">
                      {card.condition}
                    </span>
                    {card.status && (
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          card.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : card.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {card.status}
                      </span>
                    )}
                  </div>
                </div>

                {card.price && (
                  <div className="ml-4">
                    <div className="font-bold text-3xl text-[#0097a7]">
                      ₹{card.price.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-base mt-4 line-clamp-3">
                {card.description}
              </p>

              {card.status === "rejected" && card.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800">
                    Rejection Reason:
                  </p>
                  <p className="text-sm text-red-600">{card.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#f6f2ee]">
              <button
                onClick={handleCardClick}
                className="px-6 py-3 bg-[#1c1c1c] text-white text-sm font-semibold rounded-lg hover:bg-[#c0392b] transition-colors duration-300"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-300">
              <h3 className="text-2xl font-bold text-[#1c1c1c] mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{card.name}"? This action
                cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Grid View
  return (
    <>
      <div
        onClick={handleCardClick}
        className="group cursor-pointer relative shrink-0 w-full bg-white rounded-2xl border border-[#f6f2ee] hover:border-[#fdd18e] transition-all duration-300 hover:shadow-xl overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={`${API_BASE_URL}${card.images?.[0]}`}
            alt={card.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white text-xs font-semibold rounded-full">
              {card.category}
            </span>
          </div>

          {/* Delete Button */}
          {showDelete && onDelete && (
            <button
              onClick={handleDeleteClick}
              className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-100 transition-all duration-300 hover:scale-110"
              aria-label="Delete card"
            >
              <Icon
                icon="mdi:delete"
                className="text-xl text-red-500 hover:text-red-700"
              />
            </button>
          )}

          {/* Wishlist Button */}
          {user && onToggleWishlist && (
            <button
              onClick={handleWishlistClick}
              className={`absolute top-3 ${
                showDelete ? "right-14" : "right-3"
              } w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110`}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Icon
                icon={isWishlisted ? ICONS.heartFilled : ICONS.heartOutline}
                className={`text-xl ${
                  isWishlisted
                    ? "text-[#c0392b]"
                    : "text-[#1c1c1c] hover:text-[#c0392b]"
                } transition-colors duration-300`}
              />
            </button>
          )}
        </div>

        {/* Card Info */}
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-[#1c1c1c] group-hover:text-[#c0392b] transition-colors duration-300 line-clamp-1">
                {card.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-[#0097a7] font-medium px-3 py-1 bg-[#0097a7]/10 rounded-full">
                  {card.condition}
                </span>
                {card.status && (
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      card.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : card.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {card.status}
                  </span>
                )}
              </div>
            </div>

            {card.price && (
              <div className="ml-2">
                <div className="font-bold text-2xl text-[#0097a7]">
                  ₹{card.price.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {card.status === "rejected" && card.rejectionReason && (
            <div className="mt-3 p-2 bg-red-50 rounded-lg">
              <p className="text-xs font-medium text-red-800">
                Rejection Reason:
              </p>
              <p className="text-xs text-red-600 line-clamp-1">
                {card.rejectionReason}
              </p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-[#f6f2ee]">
            <button
              onClick={handleCardClick}
              className="w-full px-4 py-2 bg-[#1c1c1c] text-white text-sm font-semibold rounded-lg hover:bg-[#c0392b] transition-colors duration-300"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-300">
            <h3 className="text-2xl font-bold text-[#1c1c1c] mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{card.name}"? This action cannot
              be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
