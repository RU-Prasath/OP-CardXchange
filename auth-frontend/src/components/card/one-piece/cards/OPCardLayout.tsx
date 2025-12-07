// import OPCard, { type OPCardType } from "./OPCard";

import type { OPCardType } from "./OPCard";
import OPCard from "./OPCard";

// interface Props {
//   cards: OPCardType[];
//   view: "grid" | "list";
// }

// export default function OPCardLayout({ cards, view }: Props) {
//   return (
//     <div
//       className={`
//         ${view === "grid" 
//           ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
//           : "flex flex-col gap-5"
//         }
//       `}
//     >
//       {cards.map((card) => (
//         <OPCard key={card._id} card={card} view={view} />
//       ))}
//     </div>
//   );
// }


interface Props {
  cards: OPCardType[];
  view: "grid" | "list";
  isWishlisted?: (cardId: string) => boolean;
  onToggleWishlist?: (cardId: string) => void;
}

export default function OPCardLayout({ cards, view, isWishlisted, onToggleWishlist }: Props) {
  return (
    <div
      className={`
        ${view === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" 
          : "flex flex-col gap-4 md:gap-5"
        }
      `}
    >
      {cards.map((card) => (
        <OPCard
          key={card._id} 
          card={card} 
          view={view}
          isWishlisted={isWishlisted ? isWishlisted(card._id) : false}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}