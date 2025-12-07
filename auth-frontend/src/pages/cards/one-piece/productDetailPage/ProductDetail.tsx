// import { useParams } from "react-router-dom";
// import { useContext, useState } from "react";
// import { useFetchCardById } from "../../../../api/hooks/card/opCard/card";
// import { AuthContext } from "../../../../context/AuthContext";
// import { API_BASE_URL } from "../../../../api/config/axiosClient";

// export default function ProductDetail() {
//   const { id } = useParams();
//   const { data } = useFetchCardById(id!);
//   const card = data?.card;

//   const { user } = useContext(AuthContext);
//   const [activeImg, setActiveImg] = useState(0);

//   if (!card) return (
//     <div className="flex items-center justify-center min-h-[60vh]">
//       <div className="text-center">
//         <div className="w-16 h-16 border-4 border-[#fdd18e] border-t-[#c0392b] rounded-full animate-spin mx-auto"></div>
//         <p className="mt-4 text-gray-600">Loading card details...</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Breadcrumb */}
//       {/* <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
//         <span className="hover:text-[#0097a7] cursor-pointer">Home</span>
//         <span>/</span>
//         <span className="hover:text-[#0097a7] cursor-pointer">Cards</span>
//         <span>/</span>
//         <span className="hover:text-[#0097a7] cursor-pointer">One Piece</span>
//         <span>/</span>
//         <span className="text-[#1c1c1c] font-medium">{card.name}</span>
//       </div> */}

//       <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
//         <div className="grid lg:grid-cols-2 gap-8 p-8">
//           {/* IMAGE SECTION */}
//           <div>
//             <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#f6f2ee] to-white p-6">
//               <div className="relative aspect-square overflow-hidden rounded-xl">
//                 <img
//                   src={`${API_BASE_URL}${card.images[activeImg]}`}
//                   className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
//                   alt={card.name}
//                 />

//                 {/* Premium Badge */}
//                 {/* <div className="absolute top-4 left-4">
//                   <span className="px-4 py-2 bg-linear-to-r from-[#fdd18e] to-[#c0392b] text-white text-sm font-bold rounded-full shadow-lg">
//                     PREMIUM
//                   </span>
//                 </div> */}
//               </div>
//             </div>

//             {/* Thumbnail Gallery */}
//             <div className="mt-6">
//               <h3 className="text-lg font-semibold text-[#1c1c1c] mb-3">Gallery</h3>
//               <div className="flex gap-3 overflow-x-auto pb-2">
//                 {card.images.map((img: string, i: number) => (
//                   <button
//                     key={i}
//                     onClick={() => setActiveImg(i)}
//                     className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300
//                       ${activeImg === i
//                         ? "border-[#0097a7] ring-2 ring-[#0097a7]/20"
//                         : "border-gray-200 hover:border-[#fdd18e]"
//                       }
//                     `}
//                   >
//                     <img
//                       src={`${API_BASE_URL}${img}`}
//                       className="w-full h-full object-cover"
//                       alt={`Thumbnail ${i + 1}`}
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* DETAILS SECTION */}
//           <div className="lg:pl-4">
//             {/* Header */}
//             <div className="border-b border-[#f6f2ee] pb-6">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h1 className="text-4xl font-bold text-[#1c1c1c]">{card.name}</h1>
//                   <div className="flex items-center gap-3 mt-3">
//                     <span className="px-4 py-1.5 bg-[#0097a7]/10 text-[#0097a7] font-semibold rounded-full text-sm">
//                       {card.category}
//                     </span>
//                     <span className={`px-4 py-1.5 rounded-full text-sm font-semibold
//                       ${card.condition === "Mint" ? "bg-[#0097a7] text-white" :
//                         card.condition === "Near Mint" ? "bg-[#fdd18e] text-[#1c1c1c]" :
//                         "bg-[#c0392b]/10 text-[#c0392b]"
//                       }`}
//                     >
//                       {card.condition}
//                     </span>
//                   </div>
//                 </div>

//                 {card.price && (
//                   <div className="text-right">
//                     <div className="text-sm text-gray-500 mb-1">Market Price</div>
//                     <div className="text-5xl font-bold bg-linear-to-r from-[#0097a7] to-[#c0392b] bg-clip-text text-transparent">
//                       ₹{card.price.toLocaleString()}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Description */}
//             <div className="py-6 border-b border-[#f6f2ee]">
//               <h2 className="text-xl font-bold text-[#1c1c1c] mb-3">Description</h2>
//               <p className="text-gray-700 leading-relaxed">{card.description}</p>
//             </div>

//             {/* Features */}
//             <div className="py-6 border-b border-[#f6f2ee]">
//               <h2 className="text-xl font-bold text-[#1c1c1c] mb-4">Card Features</h2>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-lg bg-[#fdd18e]/20 flex items-center justify-center">
//                     <svg className="w-5 h-5 text-[#c0392b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <div className="font-semibold text-[#1c1c1c]">Authentic</div>
//                     <div className="text-sm text-gray-500">Verified Original</div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-lg bg-[#0097a7]/20 flex items-center justify-center">
//                     <svg className="w-5 h-5 text-[#0097a7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <div className="font-semibold text-[#1c1c1c]">Secure</div>
//                     <div className="text-sm text-gray-500">Protected Shipping</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="pt-6">
//               {user ? (
//                 <div className="space-y-4">
//                   <button className="w-full py-4 bg-linear-to-r from-[#c0392b] to-[#fdd18e] text-white font-bold text-lg rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
//                     Buy Now - ₹{card.price?.toLocaleString()}
//                   </button>
//                   <button className="w-full py-4 border-2 border-[#0097a7] text-[#0097a7] font-bold text-lg rounded-xl hover:bg-[#0097a7] hover:text-white transition-all duration-300">
//                     Add to Collection
//                   </button>
//                 </div>
//               ) : (
//                 <div className="text-center p-6 bg-linear-to-r from-[#f6f2ee] to-white rounded-2xl">
//                   <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0097a7]/10 flex items-center justify-center">
//                     <svg className="w-8 h-8 text-[#0097a7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-bold text-[#1c1c1c] mb-2">Login to Purchase</h3>
//                   <p className="text-gray-600 mb-4">Sign in to add this premium card to your collection</p>
//                   <button className="px-8 py-3 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
//                     Login / Register
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useParams } from "react-router-dom";
// import { useContext, useState, useEffect } from "react";
// import { useFetchCardById } from "../../../../api/hooks/card/opCard/card";
// import { AuthContext } from "../../../../context/AuthContext";
// import { API_BASE_URL } from "../../../../api/config/axiosClient";
// import { Icon } from "@iconify/react";
// import { ICONS } from "../../../../assets/icons";

// // Wishlist hook
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

// export default function ProductDetail() {
//   const { id } = useParams();
//   const { data } = useFetchCardById(id!);
//   const card = data?.card;

//   const { user } = useContext(AuthContext);
//   const [activeImg, setActiveImg] = useState(0);
//   const { toggleWishlist, isWishlisted } = useWishlist();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   if (!card) return (
//     <div className="flex items-center justify-center min-h-[60vh] px-4">
//       <div className="text-center">
//         <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#fdd18e] border-t-[#c0392b] rounded-full animate-spin mx-auto"></div>
//         <p className="mt-4 text-gray-600 text-sm md:text-base">Loading card details...</p>
//       </div>
//     </div>
//   );

//   const handleWishlistClick = () => {
//     toggleWishlist(card._id);
//   };

//   return (
//     <div className="px-4 sm:px-6 md:px-20 max-w-[1440px] mx-auto py-6 md:py-8">
//       <div className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-xl overflow-hidden">
//         <div className="grid lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8">
//           {/* IMAGE SECTION */}
//           <div>
//             <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-br from-[#f6f2ee] to-white p-4 md:p-6">
//               <div className="relative aspect-square overflow-hidden rounded-lg md:rounded-xl">
//                 <img
//                   src={`${API_BASE_URL}${card.images[activeImg]}`}
//                   className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
//                   alt={card.name}
//                 />

//                 {/* Wishlist Button */}
//                 <button
//                   onClick={handleWishlistClick}
//                   className="absolute top-3 right-3 md:top-4 md:right-4 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
//                   aria-label={isWishlisted(card._id) ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   <Icon
//                     icon={isWishlisted(card._id) ? ICONS.heartFilled : ICONS.heartOutline}
//                     className={`text-xl md:text-2xl ${
//                       isWishlisted(card._id) ? "text-[#c0392b]" : "text-[#1c1c1c] hover:text-[#c0392b]"
//                     } transition-colors duration-300`}
//                   />
//                 </button>
//               </div>
//             </div>

//             {/* Thumbnail Gallery */}
//             <div className="mt-4 md:mt-6">
//               <h3 className="text-base md:text-lg font-semibold text-[#1c1c1c] mb-2 md:mb-3">Gallery</h3>
//               <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
//                 {card.images.map((img: string, i: number) => (
//                   <button
//                     key={i}
//                     onClick={() => setActiveImg(i)}
//                     className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all duration-300
//                       ${activeImg === i
//                         ? "border-[#0097a7] ring-2 ring-[#0097a7]/20"
//                         : "border-gray-200 hover:border-[#fdd18e]"
//                       }
//                     `}
//                   >
//                     <img
//                       src={`${API_BASE_URL}${img}`}
//                       className="w-full h-full object-cover"
//                       alt={`Thumbnail ${i + 1}`}
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* DETAILS SECTION */}
//           <div className="lg:pl-0 md:lg:pl-4">
//             {/* Header */}
//             <div className="border-b border-[#f6f2ee] pb-4 md:pb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
//                 <div className="flex-1 min-w-0">
//                   <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1c1c1c] wrap-break-word">
//                     {card.name}
//                   </h1>
//                   <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-3">
//                     <span className="px-3 py-1 md:px-4 md:py-1.5 bg-[#0097a7]/10 text-[#0097a7] font-semibold rounded-full text-xs md:text-sm">
//                       {card.category}
//                     </span>
//                     <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold
//                       ${card.condition === "Mint" || card.condition === "Excellent" || card.condition === "New Card" ? "bg-[#0097a7] text-white" :
//                         card.condition === "Near Mint" || card.condition === "Good" || card.condition === "Not Bad" ? "bg-[#fdd18e] text-[#1c1c1c]" :
//                         "bg-[#c0392b]/10 text-[#c0392b]"
//                       }`}
//                     >
//                       {card.condition}
//                     </span>
//                   </div>
//                 </div>

//                 {card.price && (
//                   <div className="text-right">
//                     <div className="text-xs md:text-sm text-gray-500 mb-1">Market Price</div>
//                     <div className="text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-[#0097a7] to-[#c0392b] bg-clip-text text-transparent">
//                       ₹{card.price.toLocaleString()}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Description */}
//             <div className="py-4 md:py-6 border-b border-[#f6f2ee]">
//               <h2 className="text-lg md:text-xl font-bold text-[#1c1c1c] mb-2 md:mb-3">Description</h2>
//               <p className="text-gray-700 leading-relaxed text-sm md:text-base">{card.description}</p>
//             </div>

//             {/* Features */}
//             <div className="py-4 md:py-6 border-b border-[#f6f2ee]">
//               <h2 className="text-lg md:text-xl font-bold text-[#1c1c1c] mb-3 md:mb-4">Card Features</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#fdd18e]/20 flex items-center justify-center shrink-0">
//                     <svg className="w-4 h-4 md:w-5 md:h-5 text-[#c0392b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <div className="font-semibold text-[#1c1c1c] text-sm md:text-base">Authentic</div>
//                     <div className="text-xs md:text-sm text-gray-500">Verified Original</div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#0097a7]/20 flex items-center justify-center shrink-0">
//                     <svg className="w-4 h-4 md:w-5 md:h-5 text-[#0097a7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <div className="font-semibold text-[#1c1c1c] text-sm md:text-base">Secure</div>
//                     <div className="text-xs md:text-sm text-gray-500">Protected Shipping</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="pt-4 md:pt-6">
//               {user ? (
//                 <div className="space-y-3 md:space-y-4">
//                   <button className="w-full py-3 md:py-4 bg-linear-to-r from-[#c0392b] to-[#fdd18e] text-white font-bold text-base md:text-lg rounded-lg md:rounded-xl hover:shadow-lg md:hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
//                     Buy Now - ₹{card.price?.toLocaleString()}
//                   </button>
//                   <button className="w-full py-3 md:py-4 border-2 border-[#0097a7] text-[#0097a7] font-bold text-base md:text-lg rounded-lg md:rounded-xl hover:bg-[#0097a7] hover:text-white transition-all duration-300">
//                     Add to Collection
//                   </button>
//                 </div>
//               ) : (
//                 <div className="text-center p-4 md:p-6 bg-linear-to-r from-[#f6f2ee] to-white rounded-xl md:rounded-2xl">
//                   <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-[#0097a7]/10 flex items-center justify-center">
//                     <svg className="w-6 h-6 md:w-8 md:h-8 text-[#0097a7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-lg md:text-xl font-bold text-[#1c1c1c] mb-2">Login to Purchase</h3>
//                   <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">Sign in to add this premium card to your collection</p>
//                   <button className="px-6 md:px-8 py-2 md:py-3 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white font-semibold text-sm md:text-base rounded-lg hover:shadow-lg transition-all duration-300">
//                     Login / Register
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { useFetchCardById } from "../../../../api/hooks/card/one-piece/useCards";
import { AuthContext } from "../../../../context/AuthContext";
import { API_BASE_URL } from "../../../../api/clients/axiosClient";
import { Icon } from "@iconify/react";
import { ICONS } from "../../../../assets/icons";

// Wishlist hook - User Specific
const useWishlist = () => {
  const { user } = useContext(AuthContext); // Get current user

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (!user) {
      // For non-logged in users, use anonymous wishlist
      const saved = localStorage.getItem("onePieceWishlist_anonymous");
      return saved ? JSON.parse(saved) : [];
    }
    // For logged in users, use user-specific wishlist
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

export default function ProductDetail() {
  const { id } = useParams();
  const { data } = useFetchCardById(id!);
  const card = data?.card;

  const { user } = useContext(AuthContext);
  const [activeImg, setActiveImg] = useState(0);
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!card)
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#fdd18e] border-t-[#c0392b] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm md:text-base">
            Loading card details...
          </p>
        </div>
      </div>
    );

  const handleWishlistClick = () => {
    toggleWishlist(card._id);
  };

  return (
    <div className="px-4 sm:px-6 md:px-20 max-w-[1440px] mx-auto py-6 md:py-8">
      <div className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8">
          {/* IMAGE SECTION */}
          <div>
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-br from-[#f6f2ee] to-white p-4 md:p-6">
              <div className="relative aspect-square overflow-hidden rounded-lg md:rounded-xl">
                <img
                  src={`${API_BASE_URL}${card.images[activeImg]}`}
                  className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                  alt={card.name}
                />

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistClick}
                  className="absolute top-3 right-3 md:top-4 md:right-4 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
                  aria-label={
                    isWishlisted(card._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <Icon
                    icon={
                      isWishlisted(card._id)
                        ? ICONS.heartFilled
                        : ICONS.heartOutline
                    }
                    className={`text-xl md:text-2xl ${
                      isWishlisted(card._id)
                        ? "text-[#c0392b]"
                        : "text-[#1c1c1c] hover:text-[#c0392b]"
                    } transition-colors duration-300`}
                  />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="mt-4 md:mt-6">
              <h3 className="text-base md:text-lg font-semibold text-[#1c1c1c] mb-2 md:mb-3">
                Gallery
              </h3>
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
                {card.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all duration-300
                      ${
                        activeImg === i
                          ? "border-[#0097a7] ring-2 ring-[#0097a7]/20"
                          : "border-gray-200 hover:border-[#fdd18e]"
                      }
                    `}
                  >
                    <img
                      src={`${API_BASE_URL}${img}`}
                      className="w-full h-full object-cover"
                      alt={`Thumbnail ${i + 1}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="lg:pl-0 md:lg:pl-4">
            {/* Header */}
            <div className="border-b border-[#f6f2ee] pb-4 md:pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1c1c1c] wrap-break-word">
                    {card.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-3">
                    <span className="px-3 py-1 md:px-4 md:py-1.5 bg-[#0097a7]/10 text-[#0097a7] font-semibold rounded-full text-xs md:text-sm">
                      {card.category}
                    </span>
                    <span
                      className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold
                      ${
                        card.condition === "Mint" ||
                        card.condition === "Excellent" ||
                        card.condition === "New Card"
                          ? "bg-[#0097a7] text-white"
                          : card.condition === "Near Mint" ||
                            card.condition === "Good" ||
                            card.condition === "Not Bad"
                          ? "bg-[#fdd18e] text-[#1c1c1c]"
                          : "bg-[#c0392b]/10 text-[#c0392b]"
                      }`}
                    >
                      {card.condition}
                    </span>
                  </div>
                </div>

                {card.price && (
                  <div className="text-right">
                    <div className="text-xs md:text-sm text-gray-500 mb-1">
                      Market Price
                    </div>
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-[#0097a7] to-[#c0392b] bg-clip-text text-transparent">
                      ₹{card.price.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="py-4 md:py-6 border-b border-[#f6f2ee]">
              <h2 className="text-lg md:text-xl font-bold text-[#1c1c1c] mb-2 md:mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {card.description}
              </p>
            </div>

            {/* Features */}
            <div className="py-4 md:py-6 border-b border-[#f6f2ee]">
              <h2 className="text-lg md:text-xl font-bold text-[#1c1c1c] mb-3 md:mb-4">
                Card Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#fdd18e]/20 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-[#c0392b]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1c1c1c] text-sm md:text-base">
                      Authentic
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">
                      Verified Original
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#0097a7]/20 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-[#0097a7]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1c1c1c] text-sm md:text-base">
                      Secure
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">
                      Protected Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 md:pt-6">
              {user ? (
                <div className="space-y-3 md:space-y-4">
                  <button className="w-full py-3 md:py-4 bg-linear-to-r from-[#c0392b] to-[#fdd18e] text-white font-bold text-base md:text-lg rounded-lg md:rounded-xl hover:shadow-lg md:hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                    Buy Now - ₹{card.price?.toLocaleString()}
                  </button>
                  <button className="w-full py-3 md:py-4 border-2 border-[#0097a7] text-[#0097a7] font-bold text-base md:text-lg rounded-lg md:rounded-xl hover:bg-[#0097a7] hover:text-white transition-all duration-300">
                    Add to Collection
                  </button>
                </div>
              ) : (
                <div className="text-center p-4 md:p-6 bg-linear-to-r from-[#f6f2ee] to-white rounded-xl md:rounded-2xl">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-[#0097a7]/10 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-[#0097a7]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[#1c1c1c] mb-2">
                    Login to Purchase
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                    Sign in to add this premium card to your collection
                  </p>
                  <button className="px-6 md:px-8 py-2 md:py-3 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white font-semibold text-sm md:text-base rounded-lg hover:shadow-lg transition-all duration-300">
                    Login / Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
