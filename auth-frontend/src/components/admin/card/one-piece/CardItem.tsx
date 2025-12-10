// import { useState, useMemo } from "react";
// import { API_BASE_URL } from "../../../../api/clients/axiosClient";
// import { useFetchAllUsers } from "../../../../api/hooks/user/useUser";

// interface Card {
//   _id: string;
//   name: string;
//   description: string;
//   images: string[];
//   category: string;
//   condition: string;
//   seller?: string; // ✅ ONLY ID
//   createdAt: string;
// }

// interface CardItemProps {
//   card: Card;
//   onApprove?: (id: string) => void;
//   onReject?: (id: string) => void;
// }

// export default function CardItem({ card, onApprove, onReject }: CardItemProps) {
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   // ✅ Fetch all users
//   const { data: usersData } = useFetchAllUsers();

//   // ✅ Match seller ID with users
//   const sellerName = useMemo(() => {
//     if (!card.seller || !usersData?.users) return "Unknown";

//     const matchedUser = usersData.users.find((u: any) => u._id === card.seller);

//     return matchedUser?.fullName || "Unknown";
//   }, [card.seller, usersData]);

//   return (
//     <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition shadow-lg">
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Images */}
//         <div className="md:w-64 shrink-0">
//           {card.images?.length ? (
//             <div className="flex flex-col gap-2">
//               <img
//                 src={`${API_BASE_URL}${card.images[0]}`}
//                 alt={card.name}
//                 className="w-full h-48 object-cover rounded-lg cursor-pointer"
//                 onClick={() =>
//                   setPreviewImage(`${API_BASE_URL}${card.images[0]}`)
//                 }
//               />
//               <div className="flex gap-2 overflow-x-auto">
//                 {card.images.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={`${API_BASE_URL}${img}`}
//                     alt={`${card.name} ${idx + 1}`}
//                     className="w-20 h-20 object-cover rounded cursor-pointer"
//                     onClick={() => setPreviewImage(`${API_BASE_URL}${img}`)}
//                   />
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
//               <span className="text-gray-500">No image</span>
//             </div>
//           )}
//         </div>

//         {/* Details */}
//         <div className="flex-1 flex flex-col justify-between">
//           <div className="mb-4">
//             <h3 className="text-xl font-bold text-white mb-2">{card.name}</h3>

//             <div className="flex gap-3 mb-4">
//               <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
//                 {card.category}
//               </span>
//               <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
//                 {card.condition}
//               </span>
//             </div>

//             <p className="text-gray-400">{card.description}</p>
//           </div>

//           <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
//             <div className="text-sm text-gray-400">
//               ✅ <div>Submitted by: {sellerName}</div>
//               <div>{new Date(card.createdAt).toLocaleDateString()}</div>
//             </div>

//             {(onApprove || onReject) && (
//               <div className="flex gap-3">
//                 {onApprove && (
//                   <button
//                     onClick={() => onApprove(card._id)}
//                     className="bg-green-600 px-4 py-2 rounded-lg"
//                   >
//                     Approve
//                   </button>
//                 )}
//                 {onReject && (
//                   <button
//                     onClick={() => onReject(card._id)}
//                     className="bg-red-600 px-4 py-2 rounded-lg"
//                   >
//                     Reject
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Preview Modal */}
//       {previewImage && (
//         <div
//           className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
//           onClick={() => setPreviewImage(null)}
//         >
//           <img
//             src={previewImage}
//             className="max-h-full max-w-full rounded-lg"
//           />
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState, useMemo } from "react";
// import { API_BASE_URL } from "../../../../api/clients/axiosClient";
// import { useFetchAllUsers } from "../../../../api/hooks/user/useUser";
// import { Icon } from "@iconify/react";

// interface Card {
//   _id: string;
//   name: string;
//   description: string;
//   images: string[];
//   category: string;
//   condition: string;
//   seller?: string;
//   createdAt: string;
//   price?: number;
//   status?: string;
// }

// interface CardItemProps {
//   card: Card;
//   onApprove?: (id: string) => void;
//   onReject?: (id: string) => void;
// }

// export default function CardItem({ card, onApprove, onReject }: CardItemProps) {
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   // Fetch all users
//   const { data: usersData } = useFetchAllUsers();

//   // Match seller ID with users
//   const sellerName = useMemo(() => {
//     if (!card.seller || !usersData?.users) return "Unknown Seller";
//     const matchedUser = usersData.users.find((u: any) => u._id === card.seller);
//     return matchedUser?.fullName || "Unknown Seller";
//   }, [card.seller, usersData]);

//   // Format date
//   const formattedDate = new Date(card.createdAt).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });

//   return (
//     <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition shadow-lg">
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Images */}
//         <div className="md:w-64 shrink-0">
//           {card.images?.length ? (
//             <div className="flex flex-col gap-2">
//               {/* Main Image */}
//               <div 
//                 className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer group"
//                 onClick={() => setPreviewImage(`${API_BASE_URL}${card.images[selectedImageIndex]}`)}
//               >
//                 <img
//                   src={`${API_BASE_URL}${card.images[selectedImageIndex]}`}
//                   alt={card.name}
//                   className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                 />
//                 <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm">
//                     <Icon icon="mdi:fullscreen" className="w-4 h-4" />
//                     <span>Click to enlarge</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Thumbnail Strip */}
//               <div className="flex gap-2 overflow-x-auto py-1">
//                 {card.images.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setSelectedImageIndex(idx)}
//                     className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border transition-all ${
//                       selectedImageIndex === idx 
//                         ? 'border-blue-500 ring-1 ring-blue-500' 
//                         : 'border-gray-600 hover:border-gray-500'
//                     }`}
//                   >
//                     <img
//                       src={`${API_BASE_URL}${img}`}
//                       alt={`${card.name} ${idx + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>

//               {/* Image Counter */}
//               <div className="flex items-center justify-between text-xs text-gray-500">
//                 <div className="flex items-center gap-1">
//                   <Icon icon="dashicons:category" className="w-3 h-3" />
//                   <span>{card.images.length} image{card.images.length !== 1 ? 's' : ''}</span>
//                 </div>
//                 <span className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">
//                   {selectedImageIndex + 1}/{card.images.length}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <div className="w-full h-48 bg-gray-800 rounded-lg flex flex-col items-center justify-center">
//               <Icon icon="dashicons:category" className="w-12 h-12 text-gray-600 mb-2" />
//               <span className="text-gray-500">No image available</span>
//             </div>
//           )}
//         </div>

//         {/* Details */}
//         <div className="flex-1 flex flex-col">
//           <div className="mb-4">
//             {/* Title and Status */}
//             <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
//               <h3 className="text-xl font-bold text-white">{card.name}</h3>
//               {card.status && (
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                   card.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
//                   card.status === 'approved' ? 'bg-green-500/20 text-green-400' :
//                   'bg-red-500/20 text-red-400'
//                 }`}>
//                   {card.status.toUpperCase()}
//                 </span>
//               )}
//             </div>

//             {/* Badges */}
//             <div className="flex flex-wrap gap-2 mb-4">
//               <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
//                 <Icon icon="line-md:arrow-right" className="w-3 h-3" />
//                 {card.category}
//               </span>
//               <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
//                 {card.condition}
//               </span>
//             </div>

//             {/* Description */}
//             <div className="mb-4">
//               <h4 className="text-sm font-semibold text-gray-400 mb-1">Description</h4>
//               <p className="text-gray-400 bg-gray-800/30 rounded-lg p-3 text-sm">
//                 {card.description}
//               </p>
//             </div>

//             {/* Price Display */}
//             {card.price && (
//               <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gray-800 rounded-lg">
//                 <Icon icon="lets-icons:order" className="w-4 h-4 text-gray-400" />
//                 <span className="text-lg font-bold text-white">
//                   {'\u20B9'} {card.price.toLocaleString()}
//                 </span>
//               </div>
//             )}

//             {/* Metadata */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
//               <div className="flex items-center gap-2">
//                 <Icon icon="mdi:account" className="w-5 h-5 text-gray-500" />
//                 <div>
//                   <div className="text-xs text-gray-500">Seller</div>
//                   <div className="text-white text-sm font-medium">{sellerName}</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Icon icon="mdi:calendar" className="w-5 h-5 text-gray-500" />
//                 <div>
//                   <div className="text-xs text-gray-500">Submitted</div>
//                   <div className="text-white text-sm font-medium">{formattedDate}</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer with Actions */}
//           <div className="mt-auto pt-4 border-t border-gray-800">
//             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//               <div className="text-sm text-gray-500 flex items-center gap-2">
//                 <Icon icon="mdi:identifier" className="w-4 h-4" />
//                 <span>ID: <code className="ml-1 text-gray-400 font-mono text-xs">{card._id.slice(-8)}</code></span>
//               </div>

//               {(onApprove || onReject) && (
//                 <div className="flex gap-3">
//                   {onReject && (
//                     <button
//                       onClick={() => onReject(card._id)}
//                       className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
//                     >
//                       <Icon icon="line-md:close" className="w-4 h-4" />
//                       <span>Reject</span>
//                     </button>
//                   )}
//                   {onApprove && (
//                     <button
//                       onClick={() => onApprove(card._id)}
//                       className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
//                     >
//                       <Icon icon="line-md:check-all" className="w-4 h-4" />
//                       <span>Approve</span>
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Preview Modal */}
//       {previewImage && (
//         <div
//           className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
//           onClick={() => setPreviewImage(null)}
//         >
//           <div className="relative max-w-4xl max-h-[80vh]">
//             <img
//               src={previewImage}
//               alt="Preview"
//               className="max-h-[80vh] max-w-full rounded-lg"
//             />
//             <button
//               onClick={() => setPreviewImage(null)}
//               className="absolute -top-10 right-0 text-white hover:text-gray-300"
//             >
//               <Icon icon="mdi:close" className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// components/admin/card/one-piece/CardItem.tsx
// import { useState, useMemo } from "react";
// import { API_BASE_URL } from "../../../../api/clients/axiosClient";
// import { useFetchAllUsers } from "../../../../api/hooks/user/useUser";
// import { Icon } from "@iconify/react";

// interface Card {
//   _id: string;
//   name: string;
//   description: string;
//   images: string[];
//   category: string;
//   condition: string;
//   seller?: string;
//   createdAt: string;
//   price?: number;
//   status?: string;
// }

// interface CardItemProps {
//   card: Card;
//   onApprove?: (id: string) => void;
//   onReject?: (id: string) => void;
//   onDelete?: (id: string) => void; // Add delete prop
//   showDelete?: boolean; // Add this to control delete button visibility
// }

// export default function CardItem({ 
//   card, 
//   onApprove, 
//   onReject, 
//   onDelete,
//   showDelete = false 
// }: CardItemProps) {
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   // Fetch all users
//   const { data: usersData } = useFetchAllUsers();

//   // Match seller ID with users
//   const sellerName = useMemo(() => {
//     if (!card.seller || !usersData?.users) return "Unknown Seller";
//     const matchedUser = usersData.users.find((u: any) => u._id === card.seller);
//     return matchedUser?.fullName || "Unknown Seller";
//   }, [card.seller, usersData]);

//   // Format date
//   const formattedDate = new Date(card.createdAt).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });

//   const handleDeleteClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setShowDeleteConfirm(true);
//   };

//   const handleConfirmDelete = () => {
//     if (onDelete) {
//       onDelete(card._id);
//     }
//     setShowDeleteConfirm(false);
//   };

//   const handleCancelDelete = () => {
//     setShowDeleteConfirm(false);
//   };

//   return (
//     <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition shadow-lg">
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Images */}
//         <div className="md:w-64 shrink-0">
//           {card.images?.length ? (
//             <div className="flex flex-col gap-2">
//               {/* Main Image */}
//               <div 
//                 className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer group"
//                 onClick={() => setPreviewImage(`${API_BASE_URL}${card.images[selectedImageIndex]}`)}
//               >
//                 <img
//                   src={`${API_BASE_URL}${card.images[selectedImageIndex]}`}
//                   alt={card.name}
//                   className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                 />
//                 <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm">
//                     <Icon icon="mdi:fullscreen" className="w-4 h-4" />
//                     <span>Click to enlarge</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Thumbnail Strip */}
//               <div className="flex gap-2 overflow-x-auto py-1">
//                 {card.images.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setSelectedImageIndex(idx)}
//                     className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border transition-all ${
//                       selectedImageIndex === idx 
//                         ? 'border-blue-500 ring-1 ring-blue-500' 
//                         : 'border-gray-600 hover:border-gray-500'
//                     }`}
//                   >
//                     <img
//                       src={`${API_BASE_URL}${img}`}
//                       alt={`${card.name} ${idx + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>

//               {/* Image Counter */}
//               <div className="flex items-center justify-between text-xs text-gray-500">
//                 <div className="flex items-center gap-1">
//                   <Icon icon="dashicons:category" className="w-3 h-3" />
//                   <span>{card.images.length} image{card.images.length !== 1 ? 's' : ''}</span>
//                 </div>
//                 <span className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">
//                   {selectedImageIndex + 1}/{card.images.length}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <div className="w-full h-48 bg-gray-800 rounded-lg flex flex-col items-center justify-center">
//               <Icon icon="dashicons:category" className="w-12 h-12 text-gray-600 mb-2" />
//               <span className="text-gray-500">No image available</span>
//             </div>
//           )}
//         </div>

//         {/* Details */}
//         <div className="flex-1 flex flex-col">
//           <div className="mb-4">
//             {/* Title and Status */}
//             <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
//               <h3 className="text-xl font-bold text-white">{card.name}</h3>
//               {card.status && (
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                   card.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
//                   card.status === 'approved' ? 'bg-green-500/20 text-green-400' :
//                   'bg-red-500/20 text-red-400'
//                 }`}>
//                   {card.status.toUpperCase()}
//                 </span>
//               )}
//             </div>

//             {/* Badges */}
//             <div className="flex flex-wrap gap-2 mb-4">
//               <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
//                 <Icon icon="line-md:arrow-right" className="w-3 h-3" />
//                 {card.category}
//               </span>
//               <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
//                 {card.condition}
//               </span>
//             </div>

//             {/* Description */}
//             <div className="mb-4">
//               <h4 className="text-sm font-semibold text-gray-400 mb-1">Description</h4>
//               <p className="text-gray-400 bg-gray-800/30 rounded-lg p-3 text-sm">
//                 {card.description}
//               </p>
//             </div>

//             {/* Price Display */}
//             {card.price && (
//               <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gray-800 rounded-lg">
//                 <Icon icon="lets-icons:order" className="w-4 h-4 text-gray-400" />
//                 <span className="text-lg font-bold text-white">
//                   {'\u20B9'} {card.price.toLocaleString()}
//                 </span>
//               </div>
//             )}

//             {/* Metadata */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
//               <div className="flex items-center gap-2">
//                 <Icon icon="mdi:account" className="w-5 h-5 text-gray-500" />
//                 <div>
//                   <div className="text-xs text-gray-500">Seller</div>
//                   <div className="text-white text-sm font-medium">{sellerName}</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Icon icon="mdi:calendar" className="w-5 h-5 text-gray-500" />
//                 <div>
//                   <div className="text-xs text-gray-500">Submitted</div>
//                   <div className="text-white text-sm font-medium">{formattedDate}</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer with Actions */}
//           <div className="mt-auto pt-4 border-t border-gray-800">
//             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//               <div className="text-sm text-gray-500 flex items-center gap-2">
//                 <Icon icon="mdi:identifier" className="w-4 h-4" />
//                 <span>ID: <code className="ml-1 text-gray-400 font-mono text-xs">{card._id.slice(-8)}</code></span>
//               </div>

//               <div className="flex gap-3">
//                 {(onApprove || onReject) && (
//                   <>
//                     {onReject && (
//                       <button
//                         onClick={() => onReject(card._id)}
//                         className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
//                       >
//                         <Icon icon="line-md:close" className="w-4 h-4" />
//                         <span>Reject</span>
//                       </button>
//                     )}
//                     {onApprove && (
//                       <button
//                         onClick={() => onApprove(card._id)}
//                         className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
//                       >
//                         <Icon icon="line-md:check-all" className="w-4 h-4" />
//                         <span>Approve</span>
//                       </button>
//                     )}
//                   </>
//                 )}
                
//                 {/* Delete Button */}
//                 {showDelete && onDelete && (
//                   <button
//                     onClick={handleDeleteClick}
//                     className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
//                   >
//                     <Icon icon="mdi:delete" className="w-4 h-4" />
//                     <span>Delete</span>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
//             <h3 className="text-2xl font-bold text-white mb-4">
//               Confirm Delete
//             </h3>
//             <p className="text-gray-300 mb-6">
//               Are you sure you want to delete "{card.name}"? This action cannot be undone and all images will be permanently removed.
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={handleConfirmDelete}
//                 className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={handleCancelDelete}
//                 className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Preview Modal */}
//       {previewImage && (
//         <div
//           className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
//           onClick={() => setPreviewImage(null)}
//         >
//           <div className="relative max-w-4xl max-h-[80vh]">
//             <img
//               src={previewImage}
//               alt="Preview"
//               className="max-h-[80vh] max-w-full rounded-lg"
//             />
//             <button
//               onClick={() => setPreviewImage(null)}
//               className="absolute -top-10 right-0 text-white hover:text-gray-300"
//             >
//               <Icon icon="mdi:close" className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import { API_BASE_URL } from "../../../../api/clients/axiosClient";
import { useFetchAllUsers } from "../../../../api/hooks/user/useUser";
import { Icon } from "@iconify/react";

interface Card {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  seller?: string;
  createdAt: string;
  price?: number;
  status?: string;
}

interface CardItemProps {
  card: Card;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export default function CardItem({ 
  card, 
  onApprove, 
  onReject, 
  onDelete,
  showDelete = false 
}: CardItemProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch all users
  const { data: usersData } = useFetchAllUsers();

  // Match seller ID with users
  const sellerName = useMemo(() => {
    if (!card.seller || !usersData?.users) return "Unknown Seller";
    const matchedUser = usersData.users.find((u: any) => u._id === card.seller);
    return matchedUser?.fullName || "Unknown Seller";
  }, [card.seller, usersData]);

  // Format date
  const formattedDate = new Date(card.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

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

  return (
    <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Images Section */}
        <div className="lg:w-64 lg:shrink-0">
          {card.images?.length ? (
            <div className="flex flex-col gap-2 sm:gap-3">
              {/* Main Image */}
              <div 
                className="relative w-full h-48 sm:h-56 md:h-60 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setPreviewImage(`${API_BASE_URL}${card.images[selectedImageIndex]}`)}
              >
                <img
                  src={`${API_BASE_URL}${card.images[selectedImageIndex]}`}
                  alt={card.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 flex items-center gap-1 text-white text-xs sm:text-sm">
                    <Icon icon="mdi:fullscreen" className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Click to enlarge</span>
                    <span className="xs:hidden">Enlarge</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-1 sm:gap-2 overflow-x-scroll py-1 sm:py-2 scrollbar-hide">
                {card.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-md sm:rounded-lg overflow-hidden border transition-all ${
                      selectedImageIndex === idx 
                        ? 'border-blue-500 ring-1 sm:ring-2 ring-blue-500' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={`${API_BASE_URL}${img}`}
                      alt={`${card.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Image Counter */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Icon icon="dashicons:category" className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{card.images.length} image{card.images.length !== 1 ? 's' : ''}</span>
                </div>
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-800 rounded text-xs sm:text-sm">
                  {selectedImageIndex + 1}/{card.images.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-48 sm:h-56 md:h-60 bg-gray-800 rounded-lg sm:rounded-xl flex flex-col items-center justify-center">
              <Icon icon="dashicons:category" className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mb-2" />
              <span className="text-gray-500 text-sm sm:text-base">No image available</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-3 sm:mb-4">
            {/* Title and Status */}
            <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white wrap-break-word pr-2">
                {card.name}
              </h3>
              {card.status && (
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${
                  card.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  card.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {card.status.toUpperCase()}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-blue-500/20 text-blue-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap">
                <Icon icon="line-md:arrow-right" className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {card.category}
              </span>
              <span className="bg-purple-500/20 text-purple-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap">
                {card.condition}
              </span>
            </div>

            {/* Description */}
            <div className="mb-3 sm:mb-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-1">Description</h4>
              <p className="text-gray-400 bg-gray-800/30 rounded-lg p-2 sm:p-3 text-xs sm:text-sm line-clamp-3 sm:line-clamp-4">
                {card.description}
              </p>
            </div>

            {/* Price Display */}
            {card.price && (
              <div className="inline-flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 rounded-lg">
                <Icon icon="lets-icons:order" className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <span className="text-base sm:text-lg md:text-xl font-bold text-white">
                  {'\u20B9'} {card.price.toLocaleString()}
                </span>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Icon icon="mdi:account" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">Seller</div>
                  <div className="text-white text-sm font-medium truncate">{sellerName}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Icon icon="mdi:calendar" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">Submitted</div>
                  <div className="text-white text-sm font-medium truncate">{formattedDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-800">
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 sm:gap-2">
                <Icon icon="mdi:identifier" className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">
                  ID: <code className="ml-0.5 sm:ml-1 text-gray-400 font-mono text-xs">{card._id.slice(-8)}</code>
                </span>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 w-full xs:w-auto">
                {(onApprove || onReject) && (
                  <>
                    {onReject && (
                      <button
                        onClick={() => onReject(card._id)}
                        className="flex-1 xs:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors min-w-[100px]"
                      >
                        <Icon icon="line-md:close" className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">Reject</span>
                      </button>
                    )}
                    {onApprove && (
                      <button
                        onClick={() => onApprove(card._id)}
                        className="flex-1 xs:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-green-600 hover:bg-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors min-w-[100px]"
                      >
                        <Icon icon="line-md:check-all" className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">Approve</span>
                      </button>
                    )}
                  </>
                )}
                
                {/* Delete Button */}
                {showDelete && onDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="flex-1 xs:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-700 hover:bg-gray-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors min-w-[100px]"
                  >
                    <Icon icon="mdi:delete" className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md w-full border border-gray-700 mx-2">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
              Are you sure you want to delete "{card.name}"? This action cannot be undone and all images will be permanently removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-gray-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-full max-h-full sm:max-w-2xl sm:max-h-[70vh] md:max-w-3xl md:max-h-[80vh]">
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] max-w-full rounded-lg sm:rounded-xl"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-8 sm:-top-10 right-0 sm:right-2 text-white hover:text-gray-300"
            >
              <Icon icon="mdi:close" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}