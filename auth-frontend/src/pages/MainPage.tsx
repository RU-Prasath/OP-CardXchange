import { Link } from "react-router-dom";
import { IMAGES } from "../assets";

interface CardCategory {
  id: string;
  title: string;
  description: string;
  route: string;
  color: string;
}

export default function MainPage() {
  const cardCategories: CardCategory[] = [
    {
      id: "op",
      title: "ONE PIECE",
      description: "Explore the Grand Line with iconic characters from the world of pirates",
      route: "/cards/one-piece",
      color: "from-red-600 to-orange-500",
    },
    {
      id: "naruto",
      title: "NARUTO",
      description: "Discover ninja cards from the Hidden Leaf Village",
      route: "/cards/naruto",
      color: "from-orange-500 to-yellow-500",
    },
    {
      id: "dragonball",
      title: "DRAGON BALL",
      description: "Power up with Super Saiyan and Z-Fighter cards",
      route: "/cards/dragon-ball",
      color: "from-blue-600 to-purple-500",
    },
    {
      id: "pokemon",
      title: "POKÉMON",
      description: "Gotta catch 'em all! Classic Pokémon trading cards",
      route: "/cards/pokemon",
      color: "from-yellow-400 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#1c1c1c] to-[#2c2c2c] p-4 md:p-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-12 pt-10">
        <div className="flex justify-center items-center gap-4 mb-6">
          <img 
            src={IMAGES.flag} 
            alt="TCG Flag" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain animate-pulse" 
          />
          <h1 className="text-4xl md:text-6xl font-extrabold bg-linear-to-r from-[#c0392b] via-[#fdd18e] to-[#0097a7] bg-clip-text text-transparent">
            TCG CardXChange
          </h1>
        </div>
        <p className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto">
          Trade, collect, and discover anime trading cards with fans worldwide.
          Your ultimate destination for authentic TCG cards.
        </p>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          Featured Card Categories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cardCategories.map((category) => (
            <Link 
              key={category.id} 
              to={category.route}
              className="group"
            >
              <div className={`h-64 rounded-2xl bg-linear-to-br ${category.color} p-1 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
                <div className="h-full w-full bg-[#1c1c1c] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-gray-400 mb-2">
                      TCG COLLECTION
                    </div>
                    <div className="text-2xl font-bold text-white mb-3">
                      {category.title}
                    </div>
                    <p className="text-sm text-gray-300">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400 group-hover:text-white transition">
                      Explore →
                    </span>
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-white/20 to-transparent flex items-center justify-center group-hover:bg-white/30 transition">
                      <span className="text-white font-bold">›</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Grid */}
        <div className="bg-linear-to-r from-[#1c1c1c] to-[#2c2c2c] rounded-2xl p-8 border border-gray-800 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Why Choose CardXChange?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-gray-900/50 border border-gray-800">
              <div className="text-4xl mb-4">🛡️</div>
              <h4 className="text-xl font-bold text-white mb-2">Verified Cards</h4>
              <p className="text-gray-400">All cards are authenticated by our experts</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-900/50 border border-gray-800">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-white mb-2">Secure Trading</h4>
              <p className="text-gray-400">Safe and reliable transactions</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-900/50 border border-gray-800">
              <div className="text-4xl mb-4">🌐</div>
              <h4 className="text-xl font-bold text-white mb-2">Global Community</h4>
              <p className="text-gray-400">Connect with collectors worldwide</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-12">
          <Link
            to="/register"
            className="inline-block bg-linear-to-r from-[#c0392b] to-[#e74c3c] text-white font-bold text-lg px-8 py-4 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Start Your Collection Journey
          </Link>
          <p className="text-gray-400 mt-4">
            No account needed to browse. Create an account only when you want to trade!
          </p>
        </div>
      </div>
    </div>
  );
}