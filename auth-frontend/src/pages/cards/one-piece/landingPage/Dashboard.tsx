import { API_BASE_URL } from "../../../../api/config/axiosClient";
import { useFetchApprovedCards } from "../../../../api/hooks/card";
import HeroSection from "./HeroSection";

const Dashboard = () => {
  const { data } = useFetchApprovedCards();
  const cards = data?.data?.cards || [];

  return (
    <div>
      <HeroSection />
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((c:any) => (
          <div key={c._id} className="bg-white rounded shadow p-3">
            <img src={`${API_BASE_URL}${c.images?.[0]}`} className="w-full h-48 object-cover rounded" />
            <div className="font-bold mt-2">{c.name}</div>
            <div className="text-sm text-gray-600">{c.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Dashboard