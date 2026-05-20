import {
  EyeOff,
  Eye,
  AlertCircle,
  CheckCircle2,
  Hash,
  Image as ImageIcon,
} from "lucide-react";
import { formatFileSize, formatDate, shortHash } from "../utils/formatters.js";

const HistoryEntry = ({ entry }) => {
  const isHide = entry.operation === "HIDE";
  const isSuccess = entry.success;

  const config = isHide
    ? {
        icon: EyeOff,
        label: "Hide",
        iconColor: "text-violet-400",
        iconBg: "bg-violet-500/10",
      }
    : {
        icon: Eye,
        label: "Reveal",
        iconColor: "text-cyan-400",
        iconBg: "bg-cyan-500/10",
      };

  const Icon = config.icon;

  return (
    <div
      className={`bg-slate-900 border rounded-2xl p-4 hover:border-slate-700 transition-colors ${
        isSuccess ? "border-slate-800" : "border-red-500/20 bg-red-500/3"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
          <Icon className={`w-4.5 h-4.5 ${config.iconColor}`} style={{ width: 18, height: 18 }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2.5">
            <span className={`text-sm font-semibold ${config.iconColor}`}>{config.label}</span>
            {isSuccess ? (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/10 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Success
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full border border-red-500/10 font-medium">
                <AlertCircle className="w-3 h-3" />
                Failed
              </span>
            )}
            <span className="text-xs text-slate-500 ml-auto">{formatDate(entry.created_at)}</span>
          </div>

          {!isSuccess && entry.error && (
            <div className="text-xs text-red-300 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2 mb-2.5">
              {entry.error}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-xs">
            {isHide && entry.cover_size && (
              <div>
                <p className="text-slate-500 mb-0.5 font-medium">Cover</p>
                <p className="text-slate-300 font-semibold flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {entry.cover_size.width} × {entry.cover_size.height}
                </p>
              </div>
            )}

            {entry.secret_size && (
              <div>
                <p className="text-slate-500 mb-0.5 font-medium">Secret</p>
                <p className="text-slate-300 font-semibold flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {entry.secret_size.width} × {entry.secret_size.height}
                </p>
              </div>
            )}

            {entry.payload_bytes != null && (
              <div>
                <p className="text-slate-500 mb-0.5 font-medium">Payload</p>
                <p className="text-slate-300 font-semibold">{formatFileSize(entry.payload_bytes)}</p>
              </div>
            )}

            {entry.quality?.psnr_label && (
              <div>
                <p className="text-slate-500 mb-0.5 font-medium">PSNR</p>
                <p className="text-slate-300 font-semibold">{entry.quality.psnr_label}</p>
              </div>
            )}

            {entry.secret_hash && (
              <div className="col-span-2 md:col-span-4">
                <p className="text-slate-500 mb-0.5 font-medium flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  Secret hash
                </p>
                <p className="text-slate-300 font-mono" title={entry.secret_hash}>
                  {shortHash(entry.secret_hash, 12, 12)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryEntry;
