import { useEffect, useState, useContext } from "react";
import { useFetchApprovedCards } from "../../../../api/hooks/card/one-piece/useCards";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { ICONS } from "../../../../assets/icons";
import { API_BASE_URL } from "../../../../api/clients/axiosClient";
import CustomButton from "../../../../components/common/UI/CustomButton";
import { AuthContext } from "../../../../context/AuthContext"; // Import AuthContext

interface OPCardType {
  _id: string;
  name: string;
  category: string;
  condition: string;
  images: string[];
  description: string;
  price?: number;
}

// UPDATED Hook for wishlist management - User Specific
const useWishlist = () => {
  const { user } = useContext(AuthContext); // Get current user
  const { data, isLoading } = useFetchApprovedCards();
  const cards = data?.cards || [];

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

  const [wishlistCards, setWishlistCards] = useState<OPCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter approved cards to only include those in the wishlist
    if (cards.length > 0 && wishlist.length > 0) {
      const filteredCards = cards.filter((card: OPCardType) =>
        wishlist.includes(card._id)
      );
      setWishlistCards(filteredCards);
    } else {
      setWishlistCards([]);
    }
    setLoading(isLoading);
  }, [cards, wishlist, isLoading]);

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

  const clearWishlist = () => {
    setWishlist([]);
    if (!user) {
      localStorage.removeItem("onePieceWishlist_anonymous");
    } else {
      localStorage.removeItem(`onePieceWishlist_${user.id}`);
    }
  };

  return {
    wishlist,
    wishlistCards,
    loading,
    toggleWishlist,
    isWishlisted,
    clearWishlist,
  };
};

const WishList = () => {
  const navigate = useNavigate();
  const { wishlistCards, loading, toggleWishlist, clearWishlist } =
    useWishlist();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#fdd18e] border-t-[#c0392b] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm md:text-base">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-xl overflow-hidden p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1c1c1c]">
              <span className="bg-[#c0392b] text-[#f6f2ee] px-3 py-2 rounded-2xl">
                My Wishlist
              </span>
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              {wishlistCards.length} premium One Piece cards saved
            </p>
          </div>

          {wishlistCards.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 px-4 py-2 bg-[#f6f2ee] text-[#c0392b] rounded-lg hover:bg-[#c0392b]/10 transition-colors duration-300 text-sm md:text-base"
            >
              <Icon icon={ICONS.trash} className="text-lg" />
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Cards */}
        {wishlistCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {wishlistCards.map((card) => (
              <div
                key={card._id}
                className="group cursor-pointer bg-white rounded-xl border border-[#f6f2ee] hover:border-[#fdd18e] transition-all duration-300 hover:shadow-lg md:hover:shadow-xl overflow-hidden"
                onClick={() => navigate(`/cards/one-piece/cards/${card._id}`)}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={`${API_BASE_URL}${card.images?.[0]}`}
                    alt={card.name}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(card._id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                    aria-label="Remove from wishlist"
                  >
                    <Icon
                      icon={ICONS.heartFilled}
                      className="text-lg md:text-xl text-[#c0392b] transition-colors duration-300"
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3 md:p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base md:text-lg text-[#1c1c1c] group-hover:text-[#c0392b] transition-colors duration-300 line-clamp-1">
                        {card.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs md:text-sm text-[#0097a7] font-medium px-2 md:px-3 py-1 bg-[#0097a7]/10 rounded-full">
                          {card.category}
                        </span>
                      </div>
                    </div>

                    {card.price && (
                      <div className="ml-2">
                        <div className="font-bold text-lg md:text-xl text-[#0097a7]">
                          ₹{card.price.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  <CustomButton
                    label="View Details"
                    className="mt-3 px-3 md:px-4 py-2 bg-[#1c1c1c] text-white text-xs md:text-sm font-semibold rounded-lg hover:bg-[#c0392b] transition-colors duration-300 w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full bg-[#fdd18e]/20 flex items-center justify-center">
              <Icon
                icon={ICONS.heartOutline}
                className="w-10 h-10 md:w-12 md:h-12 text-[#c0392b]"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#1c1c1c] mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
              Start adding your favorite One Piece cards to your wishlist
            </p>
            <button
              onClick={() => navigate("/cards/one-piece")}
              className="px-6 md:px-8 py-3 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 text-sm md:text-base"
            >
              Browse Cards
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
