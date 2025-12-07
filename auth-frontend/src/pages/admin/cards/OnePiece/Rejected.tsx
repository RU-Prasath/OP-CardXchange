import { useState } from "react";
import CardFilters from "./CardFilters";
import CardList from "./CardList";
import type { Card } from "../../../../api/types/card/opCard/card";
import { useFetchRejectedCards } from "../../../../api/hooks/card/opCard/card";

export default function Rejected() {
  const [search, setSearch] = useState("");
  const { data } = useFetchRejectedCards();

  const cards: Card[] = data?.cards.filter((c: { name: string; description: string; }) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div>
      <CardFilters search={search} setSearch={setSearch} />
      <CardList cards={cards} />
    </div>
  );
}
