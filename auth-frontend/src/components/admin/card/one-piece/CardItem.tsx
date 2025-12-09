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
}

export default function CardItem({ card, onApprove, onReject }: CardItemProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Images */}
        <div className="md:w-64 shrink-0">
          {card.images?.length ? (
            <div className="flex flex-col gap-2">
              {/* Main Image */}
              <div 
                className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setPreviewImage(`${API_BASE_URL}${card.images[selectedImageIndex]}`)}
              >
                <img
                  src={`${API_BASE_URL}${card.images[selectedImageIndex]}`}
                  alt={card.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm">
                    <Icon icon="mdi:fullscreen" className="w-4 h-4" />
                    <span>Click to enlarge</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 overflow-x-auto py-1">
                {card.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border transition-all ${
                      selectedImageIndex === idx 
                        ? 'border-blue-500 ring-1 ring-blue-500' 
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
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Icon icon="dashicons:category" className="w-3 h-3" />
                  <span>{card.images.length} image{card.images.length !== 1 ? 's' : ''}</span>
                </div>
                <span className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">
                  {selectedImageIndex + 1}/{card.images.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-800 rounded-lg flex flex-col items-center justify-center">
              <Icon icon="dashicons:category" className="w-12 h-12 text-gray-600 mb-2" />
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            {/* Title and Status */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <h3 className="text-xl font-bold text-white">{card.name}</h3>
              {card.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  card.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  card.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {card.status.toUpperCase()}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                <Icon icon="line-md:arrow-right" className="w-3 h-3" />
                {card.category}
              </span>
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                {card.condition}
              </span>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-1">Description</h4>
              <p className="text-gray-400 bg-gray-800/30 rounded-lg p-3 text-sm">
                {card.description}
              </p>
            </div>

            {/* Price Display */}
            {card.price && (
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gray-800 rounded-lg">
                <Icon icon="lets-icons:order" className="w-4 h-4 text-gray-400" />
                <span className="text-lg font-bold text-white">
                  {'\u20B9'} {card.price.toLocaleString()}
                </span>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:account" className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Seller</div>
                  <div className="text-white text-sm font-medium">{sellerName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:calendar" className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Submitted</div>
                  <div className="text-white text-sm font-medium">{formattedDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="mt-auto pt-4 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Icon icon="mdi:identifier" className="w-4 h-4" />
                <span>ID: <code className="ml-1 text-gray-400 font-mono text-xs">{card._id.slice(-8)}</code></span>
              </div>

              {(onApprove || onReject) && (
                <div className="flex gap-3">
                  {onReject && (
                    <button
                      onClick={() => onReject(card._id)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Icon icon="line-md:close" className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  )}
                  {onApprove && (
                    <button
                      onClick={() => onApprove(card._id)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Icon icon="line-md:check-all" className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[80vh]">
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[80vh] max-w-full rounded-lg"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}