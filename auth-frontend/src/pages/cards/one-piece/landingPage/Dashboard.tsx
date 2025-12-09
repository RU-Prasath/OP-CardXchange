// import { API_BASE_URL } from "../../../../api/config/axiosClient";
import { useFetchApprovedCards } from "../../../../api/hooks/card/one-piece/useCards";
import OPCardScrollable from "../../../../components/card/one-piece/sections/OPCardScrollable";
import CardSection from "./CardSection";
import HeroSection from "./HeroSection";
import OnePieceMarquee from "./MarqueeSection";
import OnePieceFeaturedSection from "./OnePieceFeaturedSection";

const Dashboard = () => {
  const { data } = useFetchApprovedCards();
  const cards = data?.cards || [];

  console.log(cards);

  return (
    <div>
      <HeroSection />
      <OnePieceMarquee />
      <CardSection />
      <OnePieceFeaturedSection />
      <OPCardScrollable
        heading="Secret Rare Cards"
        categoryFilter="Secret Rare (SEC)"
        maxCards={10}
      />
      {/* <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((c:any) => (
          <div key={c._id} className="bg-white rounded shadow p-3">
            <img src={`${API_BASE_URL}${c.images?.[0]}`} className="w-full h-48 object-cover rounded" />
            <div className="font-bold mt-2">{c.name}</div>
            <div className="text-sm text-gray-600">{c.category}</div>
          </div>
        ))}
      </div> */}
    </div>
  );
};
export default Dashboard;
