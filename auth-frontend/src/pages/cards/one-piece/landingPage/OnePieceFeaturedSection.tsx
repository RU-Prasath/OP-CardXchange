import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OnePieceFeaturedSection = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      title: "Premium Quality",
      description: "Each card is meticulously crafted with premium materials and vibrant artwork that captures the essence of One Piece characters.",
      icon: "✨",
      stats: "100+ Premium Cards",
      color: "from-[#fdd18e] to-[#ffb347]"
    },
    {
      title: "Rarity & Exclusivity",
      description: "Limited edition releases and rare finds that make your collection stand out. Some cards have less than 100 copies worldwide.",
      icon: "🏆",
      stats: "50+ Rare Editions",
      color: "from-[#c0392b] to-[#e74c3c]"
    },
    {
      title: "Investment Value",
      description: "One Piece cards appreciate in value over time. Many early edition cards have increased 300% in value within 2 years.",
      icon: "📈",
      stats: "300% Avg. ROI",
      color: "from-[#0097a7] to-[#00bcd4]"
    },
    {
      title: "Community Verified",
      description: "All cards are verified by our expert community. Every listing undergoes authenticity checks before approval.",
      icon: "✅",
      stats: "100% Authentic",
      color: "from-[#2ecc71] to-[#27ae60]"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-4 sm:px-6 md:px-20 max-w-[1440px] mx-auto py-12 md:py-16">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <span className="inline-block px-4 py-2 bg-linear-to-r from-[#fdd18e] to-[#c0392b] text-white font-bold rounded-full text-sm md:text-base mb-4">
          WHY COLLECT WITH US
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1c1c1c] mb-4">
          The Ultimate{" "}
          <span className="bg-linear-to-r from-[#c0392b] to-[#0097a7] bg-clip-text text-transparent">
            One Piece
          </span>{" "}
          Experience
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Join thousands of collectors in building the most impressive One Piece card collection. 
          We provide everything you need from discovery to secure transactions.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Side - Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveFeature(index)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer group ${
                activeFeature === index
                  ? "border-[#c0392b] bg-linear-to-br from-white to-[#f6f2ee] shadow-xl scale-[1.02]"
                  : "border-[#f6f2ee] bg-white hover:border-[#fdd18e]"
              }`}
            >
              {/* Icon */}
              <div className={`mb-4 w-14 h-14 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center text-2xl shadow-lg`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-[#1c1c1c] mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm md:text-base mb-4">{feature.description}</p>
              
              {/* Stats */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0097a7]">{feature.stats}</span>
                <div className={`w-8 h-8 rounded-full bg-linear-to-r ${feature.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
              
              {/* Active Indicator */}
              {activeFeature === index && (
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-linear-to-r from-[#c0392b] to-[#fdd18e] animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Right Side - Featured Content */}
        <div className="relative">
          {/* Animated Background Element */}
          <div className="hidden md:flex absolute -top-8 -right-8 w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-br from-[#fdd18e]/10 to-[#0097a7]/10 animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 md:w-32 md:h-32 rounded-full bg-linear-to-br from-[#c0392b]/10 to-[#1c1c1c]/10 animate-pulse delay-1000"></div>
          
          <div className="relative bg-linear-to-br from-[#f6f2ee] to-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#fdd18e]/30">
            {/* Featured Card Display */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                style={{
                  backgroundImage: `url(${features[activeFeature].icon === "✨" ? "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&w=800" :
                                  features[activeFeature].icon === "🏆" ? "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=800" :
                                  features[activeFeature].icon === "📈" ? "https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?auto=format&fit=crop&w=800" :
                                  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800"})`,
                  filter: "brightness(0.9)"
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <div className={`px-4 py-2 bg-linear-to-r ${features[activeFeature].color} text-white font-bold rounded-full shadow-lg`}>
                  {features[activeFeature].title}
                </div>
              </div>
              
              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeFeature === index
                        ? `bg-linear-to-r ${features[index].color} scale-125`
                        : "bg-white/50 hover:bg-white"
                    }`}
                    aria-label={`View ${features[index].title}`}
                  />
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-xl border border-[#f6f2ee]">
                <div className="text-2xl md:text-3xl font-bold bg-linear-to-r from-[#c0392b] to-[#fdd18e] bg-clip-text text-transparent">
                  10,000+
                </div>
                <div className="text-sm text-gray-600 mt-1">Active Collectors</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-[#f6f2ee]">
                <div className="text-2xl md:text-3xl font-bold bg-linear-to-r from-[#0097a7] to-[#1c1c1c] bg-clip-text text-transparent">
                  5,000+
                </div>
                <div className="text-sm text-gray-600 mt-1">Premium Cards</div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-gray-700 mb-6">
                Ready to start or expand your One Piece collection?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/cards/one-piece")}
                  className="px-8 py-3 bg-linear-to-r from-[#c0392b] to-[#fdd18e] text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Start Collecting
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="px-8 py-3 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white font-bold rounded-xl border border-[#0097a7] hover:bg-[#0097a7] transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-[#f6f2ee] hover:border-[#fdd18e] transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-r from-[#fdd18e] to-[#c0392b] flex items-center justify-center text-white font-bold">
              RK
            </div>
            <div>
              <div className="font-bold text-[#1c1c1c]">Roronoa Zoro Fan</div>
              <div className="text-sm text-gray-500">Collector since 2022</div>
            </div>
          </div>
          <p className="text-gray-600 italic">
            "Found my grail Zoro card here after searching for months. The authentication process gave me complete peace of mind!"
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-2xl border border-[#f6f2ee] hover:border-[#fdd18e] transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-r from-[#0097a7] to-[#1c1c1c] flex items-center justify-center text-white font-bold">
              SN
            </div>
            <div>
              <div className="font-bold text-[#1c1c1c]">Sanji Collector</div>
              <div className="text-sm text-gray-500">Investor & Collector</div>
            </div>
          </div>
          <p className="text-gray-600 italic">
            "My collection has doubled in value in just one year. The rare finds section is absolutely incredible!"
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-2xl border border-[#f6f2ee] hover:border-[#fdd18e] transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-r from-[#2ecc71] to-[#27ae60] flex items-center justify-center text-white font-bold">
              NL
            </div>
            <div>
              <div className="font-bold text-[#1c1c1c]">Nami Enthusiast</div>
              <div className="text-sm text-gray-500">New Collector</div>
            </div>
          </div>
          <p className="text-gray-600 italic">
            "As a new collector, the community guides and card verification made starting so much easier. Highly recommended!"
          </p>
        </div>
      </div>
    </section>
  );
};

export default OnePieceFeaturedSection;