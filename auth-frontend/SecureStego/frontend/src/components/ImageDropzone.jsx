import { useRef, useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

const ImageDropzone = ({
  label,
  helperText,
  file,
  onFileSelect,
  accent = "purple",
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setDimensions(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    onFileSelect(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const accentClasses = {
    purple: {
      border: "border-violet-500",
      bg: "bg-violet-500/5",
      icon: "text-violet-400",
      iconBg: "bg-violet-500/10",
    },
    violet: {
      border: "border-violet-500",
      bg: "bg-violet-500/5",
      icon: "text-violet-400",
      iconBg: "bg-violet-500/10",
    },
    indigo: {
      border: "border-indigo-500",
      bg: "bg-indigo-500/5",
      icon: "text-indigo-400",
      iconBg: "bg-indigo-500/10",
    },
    cyan: {
      border: "border-cyan-500",
      bg: "bg-cyan-500/5",
      icon: "text-cyan-400",
      iconBg: "bg-cyan-500/10",
    },
    pink: {
      border: "border-violet-500",
      bg: "bg-violet-500/5",
      icon: "text-violet-400",
      iconBg: "bg-violet-500/10",
    },
  }[accent] ?? {
    border: "border-violet-500",
    bg: "bg-violet-500/5",
    icon: "text-violet-400",
    iconBg: "bg-violet-500/10",
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer
          ${
            isDragging
              ? `${accentClasses.border} ${accentClasses.bg}`
              : file
              ? "border-slate-700 bg-slate-900"
              : "border-slate-700/60 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-900"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
          disabled={disabled}
        />

        {file && previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-contain bg-slate-950"
            />
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-500/80 text-white rounded-lg disabled:opacity-50"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent px-3 pt-6 pb-3">
              <p className="text-xs text-white truncate font-semibold">{file.name}</p>
              <p className="text-xs text-slate-400">
                {dimensions
                  ? `${dimensions.width} × ${dimensions.height} · ${(file.size / 1024).toFixed(1)} KB`
                  : `${(file.size / 1024).toFixed(1)} KB`}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${accentClasses.iconBg} mb-3`}>
              <Upload className={`w-5 h-5 ${accentClasses.icon}`} />
            </div>
            <p className="text-sm font-semibold text-slate-300">Drop or click to upload</p>
            {helperText && (
              <p className="text-xs text-slate-500 mt-1">{helperText}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDropzone;
