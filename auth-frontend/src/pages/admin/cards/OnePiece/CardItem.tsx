import { useState, useMemo } from "react";
import { API_BASE_URL } from "../../../../api/clients/axiosClient";
import { useFetchAllUsers } from "../../../../api/hooks/user/useUser";

interface Card {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  seller?: string; // ✅ ONLY ID
  createdAt: string;
}

interface CardItemProps {
  card: Card;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function CardItem({ card, onApprove, onReject }: CardItemProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ✅ Fetch all users
  const { data: usersData } = useFetchAllUsers();

  // ✅ Match seller ID with users
  const sellerName = useMemo(() => {
    if (!card.seller || !usersData?.users) return "Unknown";

    const matchedUser = usersData.users.find((u: any) => u._id === card.seller);

    return matchedUser?.fullName || "Unknown";
  }, [card.seller, usersData]);

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Images */}
        <div className="md:w-64 shrink-0">
          {card.images?.length ? (
            <div className="flex flex-col gap-2">
              <img
                src={`${API_BASE_URL}${card.images[0]}`}
                alt={card.name}
                className="w-full h-48 object-cover rounded-lg cursor-pointer"
                onClick={() =>
                  setPreviewImage(`${API_BASE_URL}${card.images[0]}`)
                }
              />
              <div className="flex gap-2 overflow-x-auto">
                {card.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${API_BASE_URL}${img}`}
                    alt={`${card.name} ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded cursor-pointer"
                    onClick={() => setPreviewImage(`${API_BASE_URL}${img}`)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2">{card.name}</h3>

            <div className="flex gap-3 mb-4">
              <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {card.category}
              </span>
              <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {card.condition}
              </span>
            </div>

            <p className="text-gray-400">{card.description}</p>
          </div>

          <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
            <div className="text-sm text-gray-400">
              ✅ <div>Submitted by: {sellerName}</div>
              <div>{new Date(card.createdAt).toLocaleDateString()}</div>
            </div>

            {(onApprove || onReject) && (
              <div className="flex gap-3">
                {onApprove && (
                  <button
                    onClick={() => onApprove(card._id)}
                    className="bg-green-600 px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>
                )}
                {onReject && (
                  <button
                    onClick={() => onReject(card._id)}
                    className="bg-red-600 px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="max-h-full max-w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
