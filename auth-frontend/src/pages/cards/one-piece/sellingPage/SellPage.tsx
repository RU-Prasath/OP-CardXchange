// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { useCreateCard } from "../../../api/hooks/card";
// import CustomInput from "../../../components/UI/CustomInput";
// import CustomButton from "../../../components/UI/CustomButton";

// interface SellForm {
//   name: string;
//   category?: string;
//   condition?: string;
//   description?: string;
//   status?: string;
//   images: FileList;
// }

// export default function SellPage() {
//   const { register, handleSubmit, watch } = useForm<SellForm>();
//   const createCard = useCreateCard();
//   const navigate = useNavigate();

//   const onSubmit = (data: SellForm) => {
//     if (!data.images || data.images.length < 6) {
//       return alert("Please upload at least 6 images");
//     }

//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("category", data.category || "");
//     formData.append("condition", data.condition || "");
//     formData.append("description", data.description || "");
//     // append images
//     Array.from(data.images).forEach((file) => formData.append("images", file));

//     createCard.mutate(formData, {
//       onSuccess: () => navigate("/"), // back to home
//     });
//   };

//   const images = watch("images");

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-4">Sell Your Card</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//         <CustomInput label="Card Name" {...register("name", { required: true })} />
//         <CustomInput label="Category" {...register("category")} />
//         <CustomInput label="Condition" {...register("condition")} />
//         <label className="font-medium">Images (min 6)</label>
//         <input type="file" multiple accept="image/*" {...register("images")} />
//         {images && images.length > 0 && (
//           <p className="text-sm text-gray-500">{images.length} files selected</p>
//         )}
//         <textarea placeholder="Description" {...register("description")} className="border rounded p-2" />
//         <CustomButton label="Submit for Review" type="submit" loading={createCard.isPending} />
//       </form>
//     </div>
//   );
// }

// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { useCreateCard } from "../../../../api/hooks/card";
// import CustomInput from "../../../../components/UI/CustomInput";
// import CustomButton from "../../../../components/UI/CustomButton";

// interface SellForm {
//   name: string;
//   category?: string;
//   condition?: string;
//   description?: string;
//   status?: string;
//   images: FileList;
// }

// export default function SellPage() {
//   const { register, handleSubmit, watch } = useForm<SellForm>();
//   const createCard = useCreateCard();
//   const navigate = useNavigate();

//   const onSubmit = (data: SellForm) => {
//     if (!data.images || data.images.length < 6) {
//       return alert("Please upload at least 6 images");
//     }

//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("category", data.category || "");
//     formData.append("condition", data.condition || "");
//     formData.append("description", data.description || "");
//     Array.from(data.images).forEach((file) => formData.append("images", file));

//     createCard.mutate(formData, {
//       onSuccess: () => navigate("/"),
//     });
//   };

//   const images = watch("images");

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-luffyYellow/50 to-seaBlue/20"
//     >
//       <div className="w-full max-w-3xl bg-parchment/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-animeBlack">
//         <h2 className="text-4xl font-extrabold mb-8 text-strawRed text-center tracking-wide">
//           Sell Your Pirate Card
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2 md:gap-6">
//           <CustomInput
//             label="Card Name"
//             {...register("name", { required: true })}
//             className="focus:border-strawRed focus:ring-strawRed/40 text-animeBlack"
//             labelClassName="text-animeBlack font-semibold"
//           />

//           <CustomInput
//             label="Category"
//             {...register("category")}
//             className="focus:border-seaBlue focus:ring-seaBlue/40 text-animeBlack"
//             labelClassName="text-animeBlack font-semibold"
//           />

//           <CustomInput
//             label="Condition"
//             {...register("condition")}
//             className="focus:border-luffyYellow focus:ring-luffyYellow/40 text-animeBlack"
//             labelClassName="text-animeBlack font-semibold"
//           />

//           <div className="md:col-span-2">
//             <label className="font-medium text-animeBlack">Images (min 6)</label>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               {...register("images")}
//               className="w-full border rounded p-2 focus:border-strawRed focus:ring-strawRed/40"
//             />
//             {images && images.length > 0 && (
//               <p className="text-sm text-animeBlack mt-1">{images.length} files selected</p>
//             )}
//           </div>

//           <div className="md:col-span-2">
//             <textarea
//               placeholder="Description"
//               {...register("description")}
//               className="w-full border rounded p-2 focus:border-seaBlue focus:ring-seaBlue/40 text-animeBlack"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <CustomButton
//               label="Submit for Review"
//               type="submit"
//               loading={createCard.isPending}
//               className="w-full bg-strawRed hover:bg-strawRed/80 text-parchment font-bold py-3 rounded-xl mt-2 shadow-lg transition-all duration-200"
//             />
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateCard } from "../../../../api/hooks/card";
import CustomInput from "../../../../components/UI/CustomInput";
import CustomButton from "../../../../components/UI/CustomButton";
import CustomSelect from "../../../../components/UI/CustomSelect";

interface SellForm {
  name: string;
  category?: string;
  condition?: string;
  description?: string;
  status?: string;
  images: FileList;
}

// ✅ FULL ONE PIECE TCG CATEGORY LIST
const CATEGORY_OPTIONS = [
  // OP Series
  "OP01 Foil",
  "OP02 Foil",
  "OP03 Foil",
  "OP04 Foil",
  "OP05 Foil",
  "OP06 Foil",
  "OP07 Foil",
  "OP08 Foil",
  "OP09 Foil",
  "OP10 Foil",
  "OP11 Foil",
  "OP12 Foil",
  "OP13 Foil",
  "OP14 Foil",

  // EB Series
  "EB01 Foil",
  "EB02 Foil",
  "EB03 Foil",

  // Starter Decks (ST)
  "ST01 Leader",
  "ST02 Leader",
  "ST03 Leader",
  "ST04 Leader",
  "ST05 Leader",
  "ST06 Leader",
  "ST07 Leader",
  "ST08 Leader",
  "ST09 Leader",
  "ST10 Leader",

  // Rarity Variants
  "Parallel Rare (SP)",
  "Alternate Art (AA)",
  "Full Art",
  "Manga Rare",
  "Secret Rare (SEC)",
];

// ✅ CONDITION OPTIONS
const CONDITION_OPTIONS = ["Good", "New Card", "Excellent", "Not Bad", "Poor"];

export default function SellPage() {
  const { register, handleSubmit, watch } = useForm<SellForm>();
  const createCard = useCreateCard();
  const navigate = useNavigate();

  const images = watch("images");

  const onSubmit = (data: SellForm) => {
    if (!data.images || data.images.length < 6) {
      alert("Minimum 6 images required (Front, Back & 4 Edges)");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("category", data.category || "");
    formData.append("condition", data.condition || "");
    formData.append("description", data.description || "");

    Array.from(data.images).forEach((file) => formData.append("images", file));

    createCard.mutate(formData, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-luffyYellow/50 to-seaBlue/20">
      <div className="w-full max-w-3xl bg-parchment/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-animeBlack">
        <h2 className="text-4xl font-extrabold mb-8 text-strawRed text-center tracking-wide">
          Sell Your Pirate Card
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-6 md:grid-cols-2 md:gap-6"
        >
          {/* CARD NAME */}
          <CustomInput
            label="Card Name"
            {...register("name", { required: true })}
            className="focus:border-strawRed focus:ring-strawRed/40 text-animeBlack"
            labelClassName="text-animeBlack font-semibold"
          />

          {/* CATEGORY SELECT */}
          <CustomSelect
            label="Category"
            options={CATEGORY_OPTIONS}
            {...register("category", { required: true })}
            className="focus:border-seaBlue focus:ring-seaBlue/40 text-animeBlack"
            labelClassName="text-animeBlack font-semibold"
          />

          {/* CONDITION SELECT (UPDATED) */}
          <CustomSelect
            label="Condition"
            options={CONDITION_OPTIONS}
            {...register("condition", { required: true })}
            className="focus:border-luffyYellow focus:ring-luffyYellow/40 text-animeBlack"
            labelClassName="text-animeBlack font-semibold"
          />

          {/* IMAGE UPLOAD */}
          <div className="md:col-span-2">
            <label className="font-medium text-animeBlack">
              Images (min 6)
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              {...register("images")}
              className="w-full border rounded p-2 focus:border-strawRed focus:ring-strawRed/40"
            />

            <p className="text-xs text-gray-700 mt-1">
              <span className="font-semibold">Note:</span> Minimum 6 images
              (Front, Back, Four Edges)
            </p>

            {images && images.length > 0 && (
              <p className="text-sm text-animeBlack mt-2">
                {images.length} files selected
              </p>
            )}

            {images && images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
                {Array.from(images).map((file, index) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <div
                      key={index}
                      className="w-full h-24 rounded-lg overflow-hidden border border-gray-300"
                    >
                      <img
                        src={previewUrl}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <textarea
              placeholder="Description"
              {...register("description")}
              className="w-full border rounded p-2 focus:border-seaBlue focus:ring-seaBlue/40 text-animeBlack"
            />
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2">
            <CustomButton
              label="Submit for Review"
              type="submit"
              loading={createCard.isPending}
              className="w-full bg-strawRed hover:bg-strawRed/80 text-parchment font-bold py-3 rounded-xl mt-2 shadow-lg transition-all duration-200"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
