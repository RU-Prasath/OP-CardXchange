import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { IMAGES } from "../../../../assets";

const HeroSection: React.FC = () => {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSellClick = () => {
    if (!user) return navigate("/register");
    navigate("/sell");
  }

  return (
    <>
      <div className="relative w-full h-[650px] md:h-[700px]">
        {/* Background Image */}
        <img
          src={IMAGES.heroSecBg}
          alt="Luffy"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-[1440px] mx-auto">
          {/* Responsive H1 — no BR below sm */}
          <h1 className="text-[#fdd18e] text-3xl md:text-6xl font-extrabold drop-shadow-xxl leading-tight max-w-[700px]">
            Trade One Piece Cards
            <span className="hidden sm:inline">
              <br />
            </span>
            <span className="sm:hidden"> </span>
            Like a True Pirate!
          </h1>

          <p className="text-[#f6f2ee] text-lg md:text-2xl mt-5 max-w-[600px] font-medium">
            Discover, buy, and sell One Piece cards with fans across the Grand
            Line. Browse freely — login only when you want to collect or sell!
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 mt-8">
            {/* Explore Marketplace */}
            <a
              href="/marketplace"
              className="border-2 border-[#c0392b] bg-[#c0392b] hover:bg-transparent hover:text-black text-[#f6f2ee] 
              px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 
              rounded-xl text-xs whitespace-nowrap sm:text-lg md:font-semibold shadow-xl transition"
            >
              <p>Explore Marketplace</p>
            </a>

            <a
              onClick={onSellClick}
              className="border-2 border-[#fdd18e] text-[#fdd18e] hover:bg-[#fdd18e] hover:text-black transition px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl text-xs whitespace-nowrap sm:text-lg md:font-semibold shadow-xl"
            >
              <p>Sell Your Card</p>
            </a>
          </div>

          {/* Features */}
          <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-[#f6f2ee] text-sm md:text-base font-semibold">
            <p>
              <span className="text-[#c0392b]">✔ </span>No Login to Browse
            </p>
            <p>
              <span className="text-[#c0392b]">✔ </span>Admin Verified Cards
            </p>
            <p>
              <span className="text-[#c0392b]">✔ </span>Safe Trades
            </p>
            <p>
              <span className="text-[#c0392b]">✔ </span>Anime-Themed UI
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
