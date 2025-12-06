import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useFetchPendingCards, useUpdateCardStatus } from "../../api/hooks/card";
import { customToast } from "../../utils/customToast";
import { API_BASE_URL } from "../../api/config/axiosClient";

interface Card {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  user: {
    fullName: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { data, refetch } = useFetchPendingCards();
  const updateStatus = useUpdateCardStatus();
  
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (!user || !user.isAdmin) {
      customToast.error("Admin access required");
      navigate("/");
    }
  }, [user, navigate]);

  const cards = data?.data?.cards || [];

  const handleApprove = (cardId: string) => {
    updateStatus.mutate(
      { id: cardId, status: "approved" },
      {
        onSuccess: () => {
          customToast.success("Card approved successfully");
          refetch();
        },
        onError: () => customToast.error("Failed to approve card"),
      }
    );
  };

  const handleReject = (cardId: string, reason: string) => {
    if (!reason.trim()) {
      customToast.warning("Please provide a rejection reason");
      return;
    }
    
    updateStatus.mutate(
      // { id: cardId, status: "rejected", reason },
      { id: cardId, status: "rejected" },
      {
        onSuccess: () => {
          customToast.success("Card rejected");
          setSelectedCard(null);
          setRejectReason("");
          refetch();
        },
        onError: () => customToast.error("Failed to reject card"),
      }
    );
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600">Admin privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-400">Manage card submissions and users</p>
            </div>
            <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg">
              Welcome, {user?.fullName}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-white mb-2">
                {cards.length}
              </div>
              <div className="text-gray-400">Pending Cards</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-white mb-2">0</div>
              <div className="text-gray-400">Total Users</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-white mb-2">0</div>
              <div className="text-gray-400">Approved Cards</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-white mb-2">0</div>
              <div className="text-gray-400">Rejected Cards</div>
            </div>
          </div>
        </div>

        {/* Pending Cards Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Pending Card Reviews</h2>
            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
              {cards.length} pending
            </span>
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
              <p className="text-gray-400">No pending cards to review</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {cards.map((card: Card) => (
                <div
                  key={card._id}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Card Image */}
                    <div className="md:w-48">
                      {card.images?.[0] ? (
                        <img
                          src={`${API_BASE_URL}${card.images[0]}`}
                          alt={card.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                      <div className="flex gap-2 mt-3 overflow-x-auto">
                        {card.images?.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={`${API_BASE_URL}${img}`}
                            alt={`${card.name} ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {card.name}
                          </h3>
                          <div className="flex gap-3 mb-4">
                            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                              {card.category || "No Category"}
                            </span>
                            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                              {card.condition || "No Condition"}
                            </span>
                          </div>
                          <p className="text-gray-400 mb-4">
                            {card.description || "No description provided"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400 mb-1">
                            Submitted by
                          </div>
                          <div className="font-medium text-white">
                            {card.user?.fullName || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(card.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(card._id)}
                          className="flex-1 bg-linear-to-r from-green-600 to-emerald-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
                        >
                          Approve Card
                        </button>
                        <button
                          onClick={() => setSelectedCard(card)}
                          className="flex-1 bg-linear-to-r from-red-600 to-red-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
                        >
                          Reject Card
                        </button>
                        <button className="px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Reject Card Submission
            </h3>
            <p className="text-gray-400 mb-6">
              Please provide a reason for rejecting{" "}
              <span className="font-semibold text-white">
                "{selectedCard.name}"
              </span>
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white mb-6 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="flex gap-4">
              <button
                onClick={() => handleReject(selectedCard._id, rejectReason)}
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
  );
}