import { useState } from "react";
import CardList from "../../../../components/admin/card/one-piece/CardList";
import { useFetchPendingCards } from "../../../../api/hooks/card/one-piece/useCards";
import CardFilters from "../../../../components/admin/common/CardFilters";

export default function Pending() {
  const [search, setSearch] = useState("");
  const { data } = useFetchPendingCards();

  const cards =
    data?.cards.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Pending One Piece Cards</h1>
      
      <CardFilters
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search pending cards by name or description..."
        searchClassName="bg-gray-800 text-white border-gray-700 focus:ring-indigo-500"
      />
      
      <CardList cards={cards} />
    </div>
  );
}