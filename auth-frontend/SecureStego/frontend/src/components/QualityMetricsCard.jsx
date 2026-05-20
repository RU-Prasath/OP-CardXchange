import { Activity, CheckCircle2, Eye } from "lucide-react";

const QualityMetricsCard = ({ quality }) => {
  if (!quality) return null;

  const psnr = quality.psnr_db;
  let verdictColor = "text-slate-400";
  let bgColor = "bg-slate-500/10";
  let borderColor = "border-slate-500/10";

  if (psnr === null) {
    verdictColor = "text-emerald-400";
    bgColor = "bg-emerald-500/10";
    borderColor = "border-emerald-500/10";
  } else if (psnr >= 50) {
    verdictColor = "text-emerald-400";
    bgColor = "bg-emerald-500/10";
    borderColor = "border-emerald-500/10";
  } else if (psnr >= 40) {
    verdictColor = "text-green-400";
    bgColor = "bg-green-500/10";
    borderColor = "border-green-500/10";
  } else if (psnr >= 30) {
    verdictColor = "text-amber-400";
    bgColor = "bg-amber-500/10";
    borderColor = "border-amber-500/10";
  } else {
    verdictColor = "text-red-400";
    bgColor = "bg-red-500/10";
    borderColor = "border-red-500/10";
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Activity className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Quality metrics</h3>
          <p className="text-xs text-slate-500">Cover vs stego image comparison</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
          <p className="text-xs text-slate-500 mb-1 font-medium">PSNR</p>
          <p className="text-xl font-bold text-white">{quality.psnr_label}</p>
          <p className="text-xs text-slate-600 mt-0.5">Peak Signal-to-Noise Ratio</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
          <p className="text-xs text-slate-500 mb-1 font-medium">MSE</p>
          <p className="text-xl font-bold text-white">{quality.mse}</p>
          <p className="text-xs text-slate-600 mt-0.5">Mean Squared Error</p>
        </div>
      </div>

      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${bgColor} border ${borderColor}`}>
        <CheckCircle2 className={`w-4 h-4 ${verdictColor} shrink-0`} />
        <p className={`text-sm font-semibold ${verdictColor}`}>{quality.verdict}</p>
      </div>

      {psnr !== null && psnr >= 40 && (
        <div className="mt-3 flex items-start gap-2 text-xs text-slate-500">
          <Eye className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p>A PSNR above 40 dB means the human eye cannot distinguish the stego image from the original cover.</p>
        </div>
      )}
    </div>
  );
};

export default QualityMetricsCard;
