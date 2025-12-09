// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import CustomInput from "../../../../components/common/UI/CustomInput";
// import CustomButton from "../../../../components/common/UI/CustomButton";
// import CustomSelect from "../../../../components/common/UI/CustomSelect";
// import { useCreateCard } from "../../../../api/hooks/card/one-piece/useCards";

// interface SellForm {
//   name: string;
//   price: number;
//   category?: string;
//   condition?: string;
//   description?: string;
//   images: FileList;
// }

// const CATEGORY_OPTIONS = [
//   "OP01 Foil",
//   "OP02 Foil",
//   "OP03 Foil",
//   "OP04 Foil",
//   "OP05 Foil",
//   "OP06 Foil",
//   "OP07 Foil",
//   "OP08 Foil",
//   "OP09 Foil",
//   "OP10 Foil",
//   "OP11 Foil",
//   "OP12 Foil",
//   "OP13 Foil",
//   "OP14 Foil",
//   "EB01 Foil",
//   "EB02 Foil",
//   "EB03 Foil",
//   "ST01 Leader",
//   "ST02 Leader",
//   "ST03 Leader",
//   "ST04 Leader",
//   "ST05 Leader",
//   "ST06 Leader",
//   "ST07 Leader",
//   "ST08 Leader",
//   "ST09 Leader",
//   "ST10 Leader",
//   "Parallel Rare (SP)",
//   "Alternate Art (AA)",
//   "Full Art",
//   "Manga Rare",
//   "Secret Rare (SEC)",
// ];

// const CONDITION_OPTIONS = ["Mint", "Near-Mint", "Good", "Fair"];
// const MAX_FILE_SIZE_MB = 3; // Max 3MB per image
// const MIN_IMAGES = 6;

// export default function SellPage() {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState,
//     setError,
//     clearErrors,
//     reset,
//   } = useForm<SellForm>();
//   const createCard = useCreateCard();

//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const images = watch("images");

//   // Validate images whenever they change
//   useEffect(() => {
//     if (!images || images.length < MIN_IMAGES) {
//       setError("images", {
//         type: "manual",
//         message: `Select at least ${MIN_IMAGES} images`,
//       });
//       setIsFormValid(false);
//       return;
//     }

//     // Validate file size
//     for (let i = 0; i < images.length; i++) {
//       if (images[i].size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
//         setError("images", {
//           type: "manual",
//           message: `Each image must be ≤ ${MAX_FILE_SIZE_MB}MB`,
//         });
//         setIsFormValid(false);
//         return;
//       }
//     }

//     clearErrors("images");
//     setIsFormValid(true);
//   }, [images, setError, clearErrors]);

//   const onSubmit = (data: SellForm) => {
//     if (!isFormValid) return;

//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("price", String(data.price));
//     formData.append("category", data.category || "");
//     formData.append("condition", data.condition?.toLowerCase() || "");
//     formData.append("description", data.description || "");

//     Array.from(data.images).forEach((file) => formData.append("images", file));

//     createCard.mutate(formData, {
//       onSuccess: () => {
//         reset();
//         setPreviewImage(null);
//         setIsFormValid(false);
//       },
//       onError: (err: any) => {
//         alert(
//           err?.response?.data?.message || "Server error. Please try again."
//         );
//       },
//     });
//   };

//   return (
//     <>
//       {/* IMAGE PREVIEW MODAL */}
//       {previewImage && (
//         <div
//           className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
//           onClick={() => setPreviewImage(null)}
//         >
//           <img
//             src={previewImage}
//             alt="preview"
//             className="max-w-full max-h-full rounded-xl shadow-2xl"
//           />
//         </div>
//       )}

//       <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-luffyYellow/50 to-seaBlue/20">
//         <div className="w-full max-w-3xl bg-parchment/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-animeBlack">
//           <h2 className="text-4xl font-extrabold mb-8 text-strawRed text-center tracking-wide">
//             Sell Your Pirate Card
//           </h2>

//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="grid gap-6 md:grid-cols-2 md:gap-6"
//           >
//             {/* CARD NAME */}
//             <CustomInput
//               label="Card Name"
//               {...register("name", { required: "Card name is required" })}
//               error={formState.errors.name?.message}
//             />

//             {/* PRICE */}
//             <CustomInput
//               label="Price (₹)"
//               type="number"
//               {...register("price", {
//                 required: "Price is required",
//                 min: { value: 1, message: "Price must be > 0" },
//               })}
//               error={formState.errors.price?.message}
//             />

//             {/* CATEGORY */}
//             <CustomSelect
//               label="Category"
//               options={CATEGORY_OPTIONS}
//               {...register("category", { required: "Category is required" })}
//             />
//             {formState.errors.category && (
//               <p className="text-red-500 text-sm mt-1">
//                 {formState.errors.category.message}
//               </p>
//             )}

//             {/* CONDITION */}
//             <CustomSelect
//               label="Condition"
//               options={CONDITION_OPTIONS}
//               {...register("condition", { required: "Condition is required" })}
//             />
//             {formState.errors.condition && (
//               <p className="text-red-500 text-sm mt-1">
//                 {formState.errors.condition.message}
//               </p>
//             )}

//             {/* IMAGE UPLOAD */}
//             <div className="md:col-span-2">
//               <label className="font-medium text-animeBlack">
//                 Images (min 6, ≤3MB each)
//               </label>
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 {...register("images", { required: "Please upload images" })}
//                 className="w-full border rounded p-2"
//               />
//               {formState.errors.images && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {formState.errors.images.message}
//                 </p>
//               )}
//               {images && images.length > 0 && (
//                 <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
//                   {Array.from(images).map((file, index) => {
//                     const previewUrl = URL.createObjectURL(file);
//                     return (
//                       <div
//                         key={index}
//                         className="w-full h-24 rounded-lg overflow-hidden border cursor-pointer"
//                         onClick={() => setPreviewImage(previewUrl)}
//                       >
//                         <img
//                           src={previewUrl}
//                           alt={`preview-${index}`}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* DESCRIPTION */}
//             <div className="md:col-span-2">
//               <textarea
//                 placeholder="Description"
//                 {...register("description")}
//                 className="w-full border rounded p-2"
//               />
//             </div>

//             {/* SUBMIT BUTTON */}
//             <div className="md:col-span-2">
//               <CustomButton
//                 label="Submit for Review"
//                 type="submit"
//                 loading={createCard.isPending}
//                 disabled={!isFormValid || createCard.isPending}
//                 className="w-full bg-[#c0392b] hover:bg-[#c0392b]/60 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import CustomInput from "../../../../components/common/UI/CustomInput";
import CustomButton from "../../../../components/common/UI/CustomButton";
import CustomSelect from "../../../../components/common/UI/CustomSelect";
import { useCreateCard } from "../../../../api/hooks/card/one-piece/useCards";
import { IMAGES } from "../../../../assets";

interface SellForm {
  name: string;
  price: number;
  category?: string;
  condition?: string;
  description?: string;
  images: FileList;
}

const CATEGORY_OPTIONS = [
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
  "EB01 Foil",
  "EB02 Foil",
  "EB03 Foil",
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
  "Parallel Rare (SP)",
  "Alternate Art (AA)",
  "Full Art",
  "Manga Rare",
  "Secret Rare (SEC)",
];

const CONDITION_OPTIONS = ["Mint", "Near-Mint", "Good", "Fair"];
const MAX_FILE_SIZE_MB = 3; // Max 3MB per image
const MIN_IMAGES = 6;

export default function SellPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState,
    setError,
    clearErrors,
    reset,
  } = useForm<SellForm>();
  const createCard = useCreateCard();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const images = watch("images");

  // Handle image preview cleanup
  useEffect(() => {
    return () => {
      uploadedImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedImages]);

  // Validate images whenever they change
  useEffect(() => {
    if (!images || images.length < MIN_IMAGES) {
      setError("images", {
        type: "manual",
        message: `Select at least ${MIN_IMAGES} images`,
      });
      setIsFormValid(false);
      return;
    }

    // Validate file size
    for (let i = 0; i < images.length; i++) {
      if (images[i].size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
        setError("images", {
          type: "manual",
          message: `Each image must be ≤ ${MAX_FILE_SIZE_MB}MB`,
        });
        setIsFormValid(false);
        return;
      }
    }

    // Create preview URLs
    const newPreviewUrls = Array.from(images).map((file) =>
      URL.createObjectURL(file)
    );
    setUploadedImages(newPreviewUrls);

    clearErrors("images");
    setIsFormValid(true);
  }, [images, setError, clearErrors]);

  const onSubmit = (data: SellForm) => {
    if (!isFormValid) return;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", String(data.price));
    formData.append("category", data.category || "");
    formData.append("condition", data.condition?.toLowerCase() || "");
    formData.append("description", data.description || "");

    Array.from(data.images).forEach((file) => formData.append("images", file));

    createCard.mutate(formData, {
      onSuccess: () => {
        reset();
        setPreviewImage(null);
        setUploadedImages([]);
        setIsFormValid(false);
      },
      onError: (err: any) => {
        alert(
          err?.response?.data?.message || "Server error. Please try again."
        );
      },
    });
  };

  return (
    <>
      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#fdd18e] transition-colors duration-200"
            >
              <Icon icon="mdi:close" className="text-2xl" />
            </button>
            <img
              src={previewImage}
              alt="preview"
              className="max-w-full max-h-[80vh] rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      <div className="min-h-screen bg-linear-to-br from-[#f6f2ee] via-white to-[#fdd18e]/20">
        {/* Hero Section with Gradient Text */}
        <div className="relative overflow-hidden bg-linear-to-r from-[#1c1c1c] via-[#0a0a0a] to-[#1c1c1c] py-16 md:py-20">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#c0392b]/10 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#0097a7]/10 rounded-full translate-x-20 translate-y-20"></div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Jolly Roger Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  {/* ✅ Spinning Gradient Ring Only */}
                  <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#c0392b] via-[#fdd18e] to-[#0097a7] animate-spin-slow"></div>

                  {/* ✅ Static Inner Circle + Image (NO ROTATION) */}
                  <div className="relative w-[90%] h-[90%] rounded-full bg-[#1c1c1c] flex items-center justify-center z-10">
                    <img
                      src={IMAGES.flag}
                      alt="Logo"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>

                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#fdd18e] rounded-full flex items-center justify-center">
                  <Icon
                    icon="mdi:treasure-chest"
                    className="text-[#c0392b] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Gradient Text */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
              <span className="bg-linear-to-r from-[#c0392b] via-[#fdd18e] to-[#0097a7] bg-clip-text text-transparent animate-gradient">
                ONE PIECE
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 font-semibold">
              Sell Your Treasure • Become Part of the Legend
            </p>

            {/* Decorative Line */}
            <div className="w-32 h-1 bg-linear-to-r from-[#c0392b] via-[#fdd18e] to-[#0097a7] mx-auto rounded-full mb-10"></div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400">Authentic Cards</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24h</div>
                <div className="text-sm text-gray-400">Quick Approval</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">₹0</div>
                <div className="text-sm text-gray-400">Listing Fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">★ 4.9</div>
                <div className="text-sm text-gray-400">Seller Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="relative -mt-8 md:-mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Decorative Card Element */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 rounded-xl bg-linear-to-r from-[#c0392b] to-[#fdd18e] rotate-45 flex items-center justify-center">
              <Icon
                icon="mdi:cards"
                className="text-white text-xl -rotate-45"
              />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#fdd18e]/30 overflow-hidden">
            {/* Form Header */}
            <div className="bg-linear-to-r from-[#1c1c1c] via-[#2d2d2d] to-[#1c1c1c] p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    List Your Card
                  </h2>
                  <p className="text-gray-300 mt-2">
                    Fill in the details below to sell your One Piece card
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-[#c0392b]/20 px-4 py-2 rounded-full">
                  <Icon icon="mdi:shield-check" className="text-[#fdd18e]" />
                  <span className="text-sm text-white">Secure & Verified</span>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 md:p-8 grid gap-6 md:grid-cols-2 md:gap-8"
            >
              {/* CARD NAME */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="mdi:card-text" className="text-[#c0392b]" />
                  <label className="font-semibold text-[#1c1c1c] text-lg">
                    Card Name
                  </label>
                </div>
                <CustomInput
                  placeholder="e.g., Monkey D. Luffy - Gear Fifth"
                  {...register("name", { required: "Card name is required" })}
                  error={formState.errors.name?.message}
                  className="border-[#fdd18e] focus:border-[#0097a7] focus:ring-[#0097a7]/30"
                />
              </div>

              {/* PRICE */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="mdi:cash" className="text-[#0097a7]" />
                  <label className="font-semibold text-[#1c1c1c]">
                    Price (₹)
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <CustomInput
                    type="number"
                    placeholder="0.00"
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 1, message: "Price must be > 0" },
                    })}
                    error={formState.errors.price?.message}
                    className="pl-8 border-[#fdd18e] focus:border-[#0097a7] focus:ring-[#0097a7]/30"
                  />
                </div>
              </div>

              {/* CATEGORY */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="mdi:tag" className="text-[#c0392b]" />
                  <label className="font-semibold text-[#1c1c1c]">
                    Category
                  </label>
                </div>
                <CustomSelect
                  options={CATEGORY_OPTIONS}
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="border-[#fdd18e] focus:border-[#0097a7] focus:ring-[#0097a7]/30"
                />
                {formState.errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.category.message}
                  </p>
                )}
              </div>

              {/* CONDITION */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="mdi:quality-high" className="text-[#0097a7]" />
                  <label className="font-semibold text-[#1c1c1c]">
                    Condition
                  </label>
                </div>
                <CustomSelect
                  options={CONDITION_OPTIONS}
                  {...register("condition", {
                    required: "Condition is required",
                  })}
                  className="border-[#fdd18e] focus:border-[#0097a7] focus:ring-[#0097a7]/30"
                />
                {formState.errors.condition && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.condition.message}
                  </p>
                )}
              </div>

              {/* IMAGE UPLOAD */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="mdi:image-multiple" className="text-[#c0392b]" />
                  <label className="font-semibold text-[#1c1c1c] text-lg">
                    Images (min 6, ≤3MB each)
                  </label>
                </div>

                <div className="border-2 border-dashed border-[#fdd18e]/50 rounded-2xl p-6 text-center hover:border-[#0097a7] transition-colors duration-300">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    {...register("images", {
                      required: "Please upload images",
                    })}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#fdd18e]/20 flex items-center justify-center">
                      <Icon
                        icon="mdi:cloud-upload"
                        className="text-3xl text-[#c0392b]"
                      />
                    </div>
                    <p className="text-[#1c1c1c] font-medium mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-gray-500 text-sm">
                      PNG, JPG, WEBP up to {MAX_FILE_SIZE_MB}MB each
                    </p>
                  </label>
                </div>

                {formState.errors.images && (
                  <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
                    <Icon icon="mdi:alert-circle" />
                    {formState.errors.images.message}
                  </p>
                )}

                {/* Image Previews */}
                {uploadedImages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-[#1c1c1c] mb-3">
                      Uploaded Images ({uploadedImages.length}/{MIN_IMAGES})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      {uploadedImages.map((url, index) => (
                        <div
                          key={index}
                          className="relative group cursor-pointer"
                          onClick={() => setPreviewImage(url)}
                        >
                          <div className="aspect-square rounded-xl overflow-hidden border-2 border-transparent group-hover:border-[#0097a7] transition-all duration-300">
                            <img
                              src={url}
                              alt={`preview-${index}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Icon
                              icon="mdi:eye"
                              className="text-white text-xs"
                            />
                          </div>
                          <div className="absolute top-2 left-2 w-6 h-6 bg-[#0097a7] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="mdi:note-text" className="text-[#0097a7]" />
                  <label className="font-semibold text-[#1c1c1c] text-lg">
                    Description
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Describe your card in detail (condition, special features, any defects, etc.)"
                    {...register("description")}
                    rows={4}
                    className="w-full px-4 py-3 border border-[#fdd18e] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0097a7]/30 focus:border-[#0097a7] resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-gray-400 text-sm">
                    Optional
                  </div>
                </div>
              </div>

              {/* GUIDELINES */}
              <div className="md:col-span-2 p-4 bg-[#f6f2ee] rounded-xl">
                <h4 className="font-semibold text-[#1c1c1c] mb-3 flex items-center gap-2">
                  <Icon icon="mdi:information" className="text-[#c0392b]" />
                  Listing Guidelines
                </h4>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="text-[#0097a7] mt-0.5"
                    />
                    <span>Ensure all images are clear and well-lit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="text-[#0097a7] mt-0.5"
                    />
                    <span>Show all edges and any imperfections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="text-[#0097a7] mt-0.5"
                    />
                    <span>Price your card competitively</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="text-[#0097a7] mt-0.5"
                    />
                    <span>Cards will be reviewed within 24 hours</span>
                  </li>
                </ul>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="md:col-span-2">
                <CustomButton
                  label={
                    <div className="flex items-center justify-center gap-3">
                      <Icon icon="mdi:send" />
                      <span>Submit for Review</span>
                    </div>
                  }
                  type="submit"
                  loading={createCard.isPending}
                  disabled={!isFormValid || createCard.isPending}
                  className="w-full bg-linear-to-r from-[#c0392b] via-[#c0392b] to-[#1c1c1c] hover:from-[#1c1c1c] hover:to-[#c0392b] text-white font-bold py-4 rounded-xl text-lg transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                />

                {createCard.isPending && (
                  <p className="text-center text-gray-500 mt-3 flex items-center justify-center gap-2">
                    <Icon icon="mdi:loading" className="animate-spin" />
                    Submitting your card for review...
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add custom animation for gradient */}
      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
