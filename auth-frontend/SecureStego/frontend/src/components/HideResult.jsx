import { useState, useEffect } from "react";
import {
  Download,
  RotateCcw,
  Layers,
  HardDrive,
  Hash,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import QualityMetricsCard from "./QualityMetricsCard.jsx";
import { formatFileSize, shortHash } from "../utils/formatters.js";

const HideResult = ({ result, coverFile, onReset }) => {
  const [stegoUrl, setStegoUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);

  useEffect(() => {
    if (!result?.stegoBlob || !coverFile) return;

    const sUrl = URL.createObjectURL(result.stegoBlob);
    const cUrl = URL.createObjectURL(coverFile);
    setStegoUrl(sUrl);
    setCoverUrl(cUrl);

    return () => {
      URL.revokeObjectURL(sUrl);
      URL.revokeObjectURL(cUrl);
    };
  }, [result, coverFile]);

  const handleDownload = () => {
    if (!stegoUrl) return;
    const link = document.createElement("a");
    link.href = stegoUrl;
    link.download = `stego-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Stego image downloaded");
  };

  const metadata = result?.metadata;

  return (
    <div className="space-y-5">
      {/* Success banner */}
      <div className="flex items-center gap-3 p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Secret hidden successfully</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            The secret image is now invisibly encoded inside the cover image.
          </p>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-300">Cover image</h4>
            <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-800 rounded-full">Original</span>
          </div>
          {coverUrl && (
            <img src={coverUrl} alt="Cover" className="w-full h-56 object-contain bg-slate-950 rounded-xl" />
          )}
          {metadata?.cover_size && (
            <p className="text-xs text-slate-500 mt-2 text-center">
              {metadata.cover_size.width} × {metadata.cover_size.height}
            </p>
          )}
        </div>

        <div className="bg-slate-900 border border-violet-500/25 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white">Stego image</h4>
            <span className="text-xs text-violet-400 font-medium px-2 py-0.5 bg-violet-500/10 rounded-full">Contains secret</span>
          </div>
          {stegoUrl && (
            <img src={stegoUrl} alt="Stego" className="w-full h-56 object-contain bg-slate-950 rounded-xl" />
          )}
          {metadata?.cover_size && (
            <p className="text-xs text-slate-500 mt-2 text-center">
              {metadata.cover_size.width} × {metadata.cover_size.height}
            </p>
          )}
        </div>
      </div>

      {/* Metrics + Stats grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {metadata?.quality && <QualityMetricsCard quality={metadata.quality} />}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Encryption details</h3>
              <p className="text-xs text-slate-500">What was actually embedded</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-800">
            {[
              { label: "Payload size", icon: HardDrive, value: metadata?.payload_bytes ? formatFileSize(metadata.payload_bytes) : "—" },
              { label: "Cover capacity", value: metadata?.capacity_bytes ? formatFileSize(metadata.capacity_bytes) : "—" },
              { label: "Utilization", value: `${metadata?.capacity_utilization_pct?.toFixed(2)}%` },
              { label: "Secret size", value: metadata?.secret_size ? `${metadata.secret_size.width} × ${metadata.secret_size.height}` : "—" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center text-sm">
                <span className="text-slate-400">{row.label}</span>
                <span className="text-white font-semibold">{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                Secret hash
              </span>
              <span className="text-white font-mono text-xs" title={metadata?.secret_hash}>
                {metadata?.secret_hash ? shortHash(metadata.secret_hash) : "—"}
              </span>
            </div>
          </div>

          {/* Utilization bar */}
          <div className="pt-1">
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-violet-500 to-indigo-500"
                style={{ width: `${Math.min(metadata?.capacity_utilization_pct || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 text-sm"
        >
          <Download className="w-4 h-4" />
          Download stego image
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold rounded-xl text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Hide another
        </button>
      </div>

      <div className="flex items-start gap-2.5 p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-xs text-slate-400">
        <span className="text-base leading-none">💡</span>
        <p>
          Use the <span className="text-slate-300 font-medium">Reveal</span> page with this stego image and the same passphrase to recover the secret. Anyone without the passphrase will see only the cover image.
        </p>
      </div>
    </div>
  );
};

export default HideResult;
