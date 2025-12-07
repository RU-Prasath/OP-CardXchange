import { useState } from "react";
import CardFilters from "./CardFilters";
import CardList from "./CardList";
import { useFetchPendingCards } from "../../../../api/hooks/card/one-piece/useCards";

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
      <CardFilters search={search} setSearch={setSearch} />
      <CardList cards={cards} />
    </div>
  );
}
