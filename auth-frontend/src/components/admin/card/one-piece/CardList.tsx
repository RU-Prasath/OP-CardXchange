import CardItem from "./CardItem";

interface CardListProps {
  cards: any[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function CardList({ cards, onApprove, onReject }: CardListProps) {
  if (!cards.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-white mb-2">No cards found!</h3>
        <p className="text-gray-400">Try adjusting your filters or search</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {cards.map((card) => (
        <CardItem key={card._id} card={card} onApprove={onApprove} onReject={onReject} />
      ))}
    </div>
  );
}
