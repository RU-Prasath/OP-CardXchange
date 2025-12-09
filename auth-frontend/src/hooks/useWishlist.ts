// hooks/useWishlist.ts
import { useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";

export const useWishlist = () => {
  const { user } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (!user) {
      const saved = localStorage.getItem("onePieceWishlist_anonymous");
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem(`onePieceWishlist_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = useCallback((cardId: string) => {
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
  }, [user]);

  const isWishlisted = useCallback((cardId: string) => 
    wishlist.includes(cardId), [wishlist]);

  return { wishlist, toggleWishlist, isWishlisted };
};