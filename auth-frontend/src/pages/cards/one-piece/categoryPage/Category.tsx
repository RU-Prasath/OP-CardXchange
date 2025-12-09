import { useNavigate } from "react-router-dom";
import { OP_CATEGORIES } from "../../../../constants/card/one-piece/categories";

const Category = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/cards/one-piece/all-cards?category=${categoryId}`);
  };

  return (
    <div className="px-5 md:px-10 py-6">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#c0392b] uppercase">
          Categories
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {OP_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* For All Cards - Always visible overlay */}
              {cat.id === "all" ? (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <p className="text-white text-lg font-bold px-4 py-2 bg-[#c0392b] rounded-lg">
                    {cat.label}
                  </p>
                </div>
              ) : (
                // For other categories - Hover overlay
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-sm font-medium px-3 py-1 bg-[#0097a7] rounded">
                    {cat.label}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
