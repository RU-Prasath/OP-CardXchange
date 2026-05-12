import { useState } from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

/**
 * Reusable image upload field with dimension validation and warning.
 *
 * Props:
 *   label        – field label
 *   recommended  – human-readable hint e.g. "1920×1080px (16:9)"
 *   recWidth     – recommended pixel width
 *   recHeight    – recommended pixel height
 *   tolerance    – allowed deviation fraction (default 0.25 = ±25%)
 *   maxMB        – max file size in MB (default 10)
 *   preview      – current preview URL (string | null)
 *   aspectClass  – tailwind aspect-ratio class for preview box (default "aspect-video")
 *   onChange     – called with (file, previewUrl)
 *   onClear      – called when user removes the image
 *   required     – show asterisk
 */
export default function ImageUploadField({
  label,
  recommended,
  recWidth,
  recHeight,
  tolerance = 0.25,
  maxMB = 10,
  preview,
  aspectClass = "aspect-video",
  onChange,
  onClear,
  required = false,
}) {
  const [warning, setWarning] = useState(null);
  const [sizeOk, setSizeOk] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setWarning(null);
    setSizeOk(null);

    // File size check
    const fileMB = file.size / (1024 * 1024);
    if (fileMB > maxMB) {
      setWarning(`File is too large (${fileMB.toFixed(1)} MB). Maximum allowed is ${maxMB} MB.`);
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    // Dimension check
    if (recWidth && recHeight) {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const wOk = Math.abs(w - recWidth) / recWidth <= tolerance;
        const hOk = Math.abs(h - recHeight) / recHeight <= tolerance;

        if (!wOk || !hOk) {
          const ratio = (recWidth / recHeight).toFixed(2);
          const actualRatio = (w / h).toFixed(2);
          setWarning(
            `Image is ${w}×${h}px. Recommended is ~${recWidth}×${recHeight}px. ` +
            (actualRatio !== ratio
              ? `Aspect ratio mismatch (yours: ${w}:${h}, ideal: ${recWidth}:${recHeight}) — the image may appear cropped or stretched on the site.`
              : `Size is outside the recommended range — the image may appear blurry or incorrectly cropped.`)
          );
        } else {
          setSizeOk(`${w}×${h}px — looks good!`);
        }
        onChange(file, previewUrl);
      };
      img.src = previewUrl;
    } else {
      onChange(file, previewUrl);
    }
  };

  return (
    <div>
      <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">
        {label}{required && " *"}
      </label>

      {/* Hint */}
      <div className="flex items-center gap-1.5 mb-2">
        <Info size={11} className="text-gold/60 shrink-0" />
        <p className="text-silver/40 text-[11px]">
          Recommended: <span className="text-gold/70">{recommended}</span>. Max {maxMB} MB.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="text-silver/50 text-xs w-full file:mr-3 file:py-1.5 file:px-3 file:border file:border-gold/30 file:bg-gold/10 file:text-gold file:text-xs file:cursor-pointer hover:file:bg-gold/20 file:transition-colors"
      />

      {/* Warning */}
      {warning && (
        <div className="flex items-start gap-2 mt-2 bg-amber-500/10 border border-amber-500/30 px-3 py-2">
          <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-300 text-[11px] leading-relaxed">{warning}</p>
        </div>
      )}

      {/* OK */}
      {sizeOk && !warning && (
        <div className="flex items-center gap-2 mt-2">
          <CheckCircle size={12} className="text-green-400 shrink-0" />
          <p className="text-green-400 text-[11px]">{sizeOk}</p>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className={`relative mt-2 w-full ${aspectClass} overflow-hidden border border-white/10`}>
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          {onClear && (
            <button
              type="button"
              onClick={() => { setWarning(null); setSizeOk(null); onClear(); }}
              className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white/70 hover:text-white flex items-center justify-center text-sm leading-none"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}
