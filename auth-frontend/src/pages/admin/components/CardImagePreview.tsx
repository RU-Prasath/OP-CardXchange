import { useState } from "react";

interface CardImagePreviewProps {
  images: string[];
}

export const CardImagePreview: React.FC<CardImagePreviewProps> = ({ images }) => {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`card-${idx}`}
            className="w-16 h-16 object-cover rounded cursor-pointer"
            onClick={() => setPreview(img)}
          />
        ))}
      </div>

      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setPreview(null)}
        >
          <img src={preview} alt="preview" className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
};
