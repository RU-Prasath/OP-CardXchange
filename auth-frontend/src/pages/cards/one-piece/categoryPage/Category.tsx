import { OP_CATEGORIES } from "../../../../constants/one-piece/Categories";

const Category = () => {
  return (
    <div className="px-5 md:px-10 py-6">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-lg font-semibold mb-4 text-center">Categories</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {OP_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-sm font-medium">
                  {cat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
