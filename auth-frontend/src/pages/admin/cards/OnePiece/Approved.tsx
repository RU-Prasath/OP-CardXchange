import { useState } from "react";
import CardList from "../../../../components/admin/card/one-piece/CardList";
import type { Card } from "../../../../api/types/card/opCard/card";
import { useFetchApprovedCards } from "../../../../api/hooks/card/one-piece/useCards";
import CardFilters from "../../../../components/admin/common/CardFilters";

export default function Approved() {
  const [search, setSearch] = useState("");
  const { data } = useFetchApprovedCards();

  const cards: Card[] =
    data?.cards.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div>
      <CardFilters
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search approved cards by name or description..."
        searchClassName="bg-gray-800 text-white border-gray-700 focus:ring-indigo-500"
      />
      <CardList cards={cards} />
    </div>
  );
}
