import { useState } from "react";
import CardList from "../../../../components/admin/card/one-piece/CardList";
import type { Card } from "../../../../api/types/card/opCard/card";
import { useFetchRejectedCards } from "../../../../api/hooks/card/one-piece/useCards";
import CardFilters from "../../../../components/admin/common/CardFilters";

export default function Rejected() {
  const [search, setSearch] = useState("");
  const { data } = useFetchRejectedCards();

  const cards: Card[] =
    data?.cards.filter(
      (c: { name: string; description: string }) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div>
      <CardFilters
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search rejected cards by name or description..."
        searchClassName="bg-gray-800 text-white border-gray-700 focus:ring-indigo-500"
      />
      <CardList cards={cards} />
    </div>
  );
}
