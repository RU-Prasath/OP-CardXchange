// import { useState } from "react";
// import CardList from "../../../../components/admin/card/one-piece/CardList";
// import { customToast } from "../../../../utils/customToast";
// import type { Card } from "../../../../api/types/card/opCard/card";
// import {
//   useFetchApprovedCards,
//   useFetchPendingCards,
//   useFetchRejectedCards,
//   useUpdateCardStatus,
// } from "../../../../api/hooks/card/one-piece/useCards";
// import CardFilters from "../../../../components/admin/common/CardFilters";

// export default function OnePieceAdmin() {
//   const [activeTab, setActiveTab] = useState<
//     "pending" | "approved" | "rejected"
//   >("pending");
//   const [search, setSearch] = useState("");
//   const [selectedCard, setSelectedCard] = useState<Card | null>(null);
//   const [rejectReason, setRejectReason] = useState("");

//   const { data: pendingData, refetch: refetchPending } = useFetchPendingCards();
//   const { data: approvedData, refetch: refetchApproved } =
//     useFetchApprovedCards();
//   const { data: rejectedData, refetch: refetchRejected } =
//     useFetchRejectedCards();

//   const updateStatus = useUpdateCardStatus();

//   const pendingCards = pendingData?.cards || [];
//   const approvedCards = approvedData?.cards || [];
//   const rejectedCards = rejectedData?.cards || [];

//   const handleApprove = (cardId: string) => {
//     updateStatus.mutate(
//       { id: cardId, status: "approved" },
//       {
//         onSuccess: () => {
//           customToast.success("Card approved successfully");
//           refetchPending();
//           refetchApproved();
//         },
//         onError: () => customToast.error("Failed to approve card"),
//       }
//     );
//   };

//   // const handleReject = (cardId: string, reason: string) => {
//   //   if (!reason.trim()) {
//   //     customToast.warning("Please provide a rejection reason");
//   //     return;
//   //   }

//   //   updateStatus.mutate(
//   //     { id: cardId, status: "rejected" },
//   //     {
//   //       onSuccess: () => {
//   //         customToast.success("Card rejected");
//   //         setSelectedCard(null);
//   //         setRejectReason("");
//   //         refetchPending();
//   //         refetchRejected();
//   //       },
//   //       onError: () => customToast.error("Failed to reject card"),
//   //     }
//   //   );
//   // };

//   // In your OnePieceAdmin component
//   const handleReject = (cardId: string) => {
//     if (!rejectReason.trim()) {
//       customToast.warning("Please provide a rejection reason");
//       return;
//     }

//     updateStatus.mutate(
//       { id: cardId, status: "rejected", rejectionReason: rejectReason },
//       {
//         onSuccess: () => {
//           customToast.success("Card rejected");
//           setSelectedCard(null);
//           setRejectReason("");
//           refetchPending();
//           refetchRejected();
//         },
//         onError: () => customToast.error("Failed to reject card"),
//       }
//     );
//   };

//   const renderCards = () => {
//     if (activeTab === "pending") return pendingCards;
//     if (activeTab === "approved") return approvedCards;
//     return rejectedCards;
//   };

//   return (
//     <div className="p-6 bg-gray-900 text-white min-h-screen">
//       {/* Tabs */}
//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setActiveTab("pending")}
//           className={`px-4 py-2 rounded-lg font-semibold ${
//             activeTab === "pending" ? "bg-yellow-500 text-black" : "bg-gray-800"
//           }`}
//         >
//           Pending ({pendingCards.length})
//         </button>
//         <button
//           onClick={() => setActiveTab("approved")}
//           className={`px-4 py-2 rounded-lg font-semibold ${
//             activeTab === "approved" ? "bg-green-500 text-black" : "bg-gray-800"
//           }`}
//         >
//           Approved ({approvedCards.length})
//         </button>
//         <button
//           onClick={() => setActiveTab("rejected")}
//           className={`px-4 py-2 rounded-lg font-semibold ${
//             activeTab === "rejected" ? "bg-red-500 text-black" : "bg-gray-800"
//           }`}
//         >
//           Rejected ({rejectedCards.length})
//         </button>
//       </div>

//       {/* Search */}
//       <CardFilters search={search} setSearch={setSearch} />

//       {/* Card List */}
//       <CardList
//         cards={renderCards().filter(
//           (c: { name: string; description: string }) =>
//             c.name.toLowerCase().includes(search.toLowerCase()) ||
//             c.description.toLowerCase().includes(search.toLowerCase())
//         )}
//         onApprove={
//           activeTab === "pending" || activeTab === "rejected"
//             ? handleApprove
//             : undefined
//         }
//         onReject={
//           activeTab === "pending" || activeTab === "approved"
//             ? (id: string) => {
//                 const card =
//                   pendingCards.find((c) => c._id === id) ||
//                   approvedCards.find((c) => c._id === id);
//                 if (card) setSelectedCard(card);
//               }
//             : undefined
//         }
//       />

//       {/* Rejection Modal */}
//       {selectedCard && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
//           <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
//             <h3 className="text-2xl font-bold text-white mb-4">
//               Reject Card Submission
//             </h3>
//             <textarea
//               value={rejectReason}
//               onChange={(e) => setRejectReason(e.target.value)}
//               placeholder="Enter rejection reason..."
//               className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white mb-6 focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             />
//             <div className="flex gap-4">
//               {/* <button
//                 onClick={() => handleReject(selectedCard._id, rejectReason)}
//                 className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
//                 disabled={!rejectReason.trim()}
//               >
//                 Confirm Reject
//               </button> */}
//               <button
//                 onClick={() => handleReject(selectedCard._id)} // Don't pass reason here
//                 className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
//                 disabled={!rejectReason.trim()}
//               >
//                 Confirm Reject
//               </button>
//               <button
//                 onClick={() => {
//                   setSelectedCard(null);
//                   setRejectReason("");
//                 }}
//                 className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useState } from "react";
// import CardList from "../../../../components/admin/card/one-piece/CardList";
// import { customToast } from "../../../../utils/customToast";
// import type { Card } from "../../../../api/types/card/opCard/card";
// import {
//   useFetchApprovedCards,
//   useFetchPendingCards,
//   useFetchRejectedCards,
//   useUpdateCardStatus,
// } from "../../../../api/hooks/card/one-piece/useCards";
// import CardFilters from "../../../../components/admin/common/CardFilters";

// export default function OnePieceAdmin() {
//   const [activeTab, setActiveTab] = useState<
//     "pending" | "approved" | "rejected"
//   >("pending");
//   const [search, setSearch] = useState("");
//   const [selectedCard, setSelectedCard] = useState<Card | null>(null);
//   const [rejectReason, setRejectReason] = useState("");

//   const { data: pendingData, refetch: refetchPending } = useFetchPendingCards();
//   const { data: approvedData, refetch: refetchApproved } =
//     useFetchApprovedCards();
//   const { data: rejectedData, refetch: refetchRejected } =
//     useFetchRejectedCards();

//   const updateStatus = useUpdateCardStatus();

//   const pendingCards = pendingData?.cards || [];
//   const approvedCards = approvedData?.cards || [];
//   const rejectedCards = rejectedData?.cards || [];

//   const handleApprove = (cardId: string) => {
//     updateStatus.mutate(
//       { id: cardId, status: "approved" },
//       {
//         onSuccess: () => {
//           customToast.success("Card approved successfully");
//           refetchPending();
//           refetchApproved();
//         },
//         onError: () => customToast.error("Failed to approve card"),
//       }
//     );
//   };

//   const handleReject = (cardId: string) => {
//     if (!rejectReason.trim()) {
//       customToast.warning("Please provide a rejection reason");
//       return;
//     }

//     console.log("Sending rejection with:", {
//       id: cardId,
//       status: "rejected",
//       rejectionReason: rejectReason,
//     });

//     updateStatus.mutate(
//       {
//         id: cardId,
//         status: "rejected",
//         rejectionReason: rejectReason,
//       },
//       {
//         onSuccess: () => {
//           customToast.success("Card rejected");
//           setSelectedCard(null);
//           setRejectReason("");
//           refetchPending();
//           refetchRejected();
//         },
//         onError: (error: any) => {
//           console.error("Rejection error:", error);
//           customToast.error(
//             error.response?.data?.message || "Failed to reject card"
//           );
//         },
//       }
//     );
//   };

//   const renderCards = () => {
//     if (activeTab === "pending") return pendingCards;
//     if (activeTab === "approved") return approvedCards;
//     return rejectedCards;
//   };

//   return (
//     <div className="p-6 bg-gray-900 text-white min-h-screen">
//       {/* Tabs */}
//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setActiveTab("pending")}
//           className={`px-4 py-2 rounded-lg font-semibold ${
//             activeTab === "pending" ? "bg-yellow-500 text-black" : "bg-gray-800"
//           }`}
//         >
//           Pending ({pendingCards.length})
//         </button>
//         <button
//           onClick={() => setActiveTab("approved")}
//           className={`px-4 py-2 rounded-lg font-semibold ${
//             activeTab === "approved" ? "bg-green-500 text-black" : "bg-gray-800"
//           }`}
//         >
//           Approved ({approvedCards.length})
//         </button>
//         <button
//           onClick={() => setActiveTab("rejected")}
//           className={`px-4 py-2 rounded-lg font-semibold ${
//             activeTab === "rejected" ? "bg-red-500 text-black" : "bg-gray-800"
//           }`}
//         >
//           Rejected ({rejectedCards.length})
//         </button>
//       </div>

//       {/* Search */}
//       <CardFilters search={search} setSearch={setSearch} />

//       {/* Card List */}
//       <CardList
//         cards={renderCards().filter(
//           (c: { name: string; description: string }) =>
//             c.name.toLowerCase().includes(search.toLowerCase()) ||
//             c.description.toLowerCase().includes(search.toLowerCase())
//         )}
//         onApprove={
//           activeTab === "pending" || activeTab === "rejected"
//             ? handleApprove
//             : undefined
//         }
//         onReject={
//           activeTab === "pending" || activeTab === "approved"
//             ? (id: string) => {
//                 const card =
//                   pendingCards.find((c) => c._id === id) ||
//                   approvedCards.find((c) => c._id === id);
//                 if (card) setSelectedCard(card);
//               }
//             : undefined
//         }
//       />

//       {/* Rejection Modal */}
//       {selectedCard && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
//           <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
//             <h3 className="text-2xl font-bold text-white mb-4">
//               Reject Card Submission
//             </h3>
//             <textarea
//               value={rejectReason}
//               onChange={(e) => setRejectReason(e.target.value)}
//               placeholder="Enter rejection reason..."
//               className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white mb-6 focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             />
//             <div className="flex gap-4">
//               <button
//                 onClick={() => handleReject(selectedCard._id)}
//                 className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
//                 disabled={!rejectReason.trim()}
//               >
//                 Confirm Reject
//               </button>
//               <button
//                 onClick={() => {
//                   setSelectedCard(null);
//                   setRejectReason("");
//                 }}
//                 className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// OnePieceAdmin.tsx
import { useState } from "react";
import CardList from "../../../../components/admin/card/one-piece/CardList";
import { customToast } from "../../../../utils/customToast";
import type { Card } from "../../../../api/types/card/opCard/card";
import {
  useFetchApprovedCards,
  useFetchPendingCards,
  useFetchRejectedCards,
  useUpdateCardStatus,
  useDeleteCard, // Add this import
} from "../../../../api/hooks/card/one-piece/useCards";
import CardFilters from "../../../../components/admin/common/CardFilters";

export default function OnePieceAdmin() {
  const [activeTab, setActiveTab] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: pendingData, refetch: refetchPending } = useFetchPendingCards();
  const { data: approvedData, refetch: refetchApproved } =
    useFetchApprovedCards();
  const { data: rejectedData, refetch: refetchRejected } =
    useFetchRejectedCards();

  const updateStatus = useUpdateCardStatus();
  const deleteCard = useDeleteCard(); // Add this

  const pendingCards = pendingData?.cards || [];
  const approvedCards = approvedData?.cards || [];
  const rejectedCards = rejectedData?.cards || [];

  const handleApprove = (cardId: string) => {
    updateStatus.mutate(
      { id: cardId, status: "approved" },
      {
        onSuccess: () => {
          customToast.success("Card approved successfully");
          refetchPending();
          refetchApproved();
        },
        onError: () => customToast.error("Failed to approve card"),
      }
    );
  };

  const handleReject = (cardId: string) => {
    if (!rejectReason.trim()) {
      customToast.warning("Please provide a rejection reason");
      return;
    }

    console.log("Sending rejection with:", {
      id: cardId,
      status: "rejected",
      rejectionReason: rejectReason,
    });

    updateStatus.mutate(
      {
        id: cardId,
        status: "rejected",
        rejectionReason: rejectReason,
      },
      {
        onSuccess: () => {
          customToast.success("Card rejected");
          setSelectedCard(null);
          setRejectReason("");
          refetchPending();
          refetchRejected();
        },
        onError: (error: any) => {
          console.error("Rejection error:", error);
          customToast.error(
            error.response?.data?.message || "Failed to reject card"
          );
        },
      }
    );
  };

  const handleDelete = (cardId: string) => {
    deleteCard.mutate(cardId, {
      onSuccess: () => {
        customToast.success("Card deleted successfully");
        // Refetch based on current tab
        if (activeTab === "pending") refetchPending();
        if (activeTab === "approved") refetchApproved();
        if (activeTab === "rejected") refetchRejected();
      },
      onError: (error: any) => {
        customToast.error(
          error.response?.data?.message || "Failed to delete card"
        );
      },
    });
  };

  const renderCards = () => {
    if (activeTab === "pending") return pendingCards;
    if (activeTab === "approved") return approvedCards;
    return rejectedCards;
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="px-4 sm:px-6 md:px-20 max-w-[1440px] mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-scroll scrollbar-hide">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === "pending"
                ? "bg-yellow-500 text-black"
                : "bg-gray-800"
            }`}
          >
            Pending ({pendingCards.length})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === "approved"
                ? "bg-green-500 text-black"
                : "bg-gray-800"
            }`}
          >
            Approved ({approvedCards.length})
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === "rejected" ? "bg-red-500 text-black" : "bg-gray-800"
            }`}
          >
            Rejected ({rejectedCards.length})
          </button>
        </div>

        {/* Search */}
        <CardFilters search={search} setSearch={setSearch} />

        {/* Card List */}
        <CardList
          cards={renderCards().filter(
            (c: { name: string; description: string }) =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.description.toLowerCase().includes(search.toLowerCase())
          )}
          onApprove={
            activeTab === "pending" || activeTab === "rejected"
              ? handleApprove
              : undefined
          }
          onReject={
            activeTab === "pending" || activeTab === "approved"
              ? (id: string) => {
                  const card =
                    pendingCards.find((c) => c._id === id) ||
                    approvedCards.find((c) => c._id === id);
                  if (card) setSelectedCard(card);
                }
              : undefined
          }
          onDelete={handleDelete} // Add this
          showDelete={true} // Show delete button for admin
        />

        {/* Rejection Modal */}
        {selectedCard && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">
                Reject Card Submission
              </h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white mb-6 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => handleReject(selectedCard._id)}
                  className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
                  disabled={!rejectReason.trim()}
                >
                  Confirm Reject
                </button>
                <button
                  onClick={() => {
                    setSelectedCard(null);
                    setRejectReason("");
                  }}
                  className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
