import { CardImagePreview } from "./CardImagePreview";

interface CardTableProps {
  cards: any[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
}

export const CardTable: React.FC<CardTableProps> = ({ cards, onApprove, onReject, showActions = true }) => (
  <div className="grid gap-4">
    {cards.map((card) => (
      <div key={card._id} className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-48">
            <CardImagePreview images={card.images} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{card.name}</h3>
            <div className="flex gap-3 my-2">
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">{card.category}</span>
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">{card.condition}</span>
            </div>
            <p className="text-gray-400 mb-4">{card.description}</p>
            <div className="text-sm text-gray-400">
              Submitted by {card.user?.fullName} on {new Date(card.createdAt).toLocaleDateString()}
            </div>

            {showActions && (
              <div className="flex gap-3 mt-4">
                {onApprove && <button onClick={() => onApprove(card._id)} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:opacity-90">Approve</button>}
                {onReject && <button onClick={() => onReject(card._id)} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:opacity-90">Reject</button>}
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);
