import { useQuery } from "@tanstack/react-query";
import { Database } from "lucide-react";
import { adminApi } from "../../services/api";

const FREE_TIER_MB = 512;

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DbStorageWidget() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["db-stats"],
    queryFn: () => adminApi.getDbStats(),
    refetchInterval: 5 * 60 * 1000,
  });

  const stats = data?.data;
  const usedMB = stats ? stats.totalSize / (1024 * 1024) : 0;
  const pct = Math.min(100, (usedMB / FREE_TIER_MB) * 100);
  const barColor = pct > 85 ? "#f87171" : pct > 60 ? "#fbbf24" : "#C9A84C";

  return (
    <div className="bg-[#0a0e17] border border-white/5 p-6 hover:border-gold/20 transition-all">
      <div className="flex items-center gap-3 mb-5">
        <div className="text-gold">
          <Database size={20} />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">MongoDB Storage</h3>
          <p className="text-silver/30 text-[11px] tracking-widest uppercase font-mono">
            Free tier · 512 MB
          </p>
        </div>
      </div>

      {isError ? (
        <p className="text-red-400 text-xs">Failed to load DB stats</p>
      ) : isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-2 bg-white/5 rounded-full" />
          <div className="h-8 bg-white/5 rounded w-28" />
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>

          {/* Usage numbers */}
          <div className="flex items-end justify-between mb-5">
            <span className="text-2xl font-semibold tracking-tight" style={{ color: barColor }}>
              {usedMB.toFixed(2)} MB
            </span>
            <span className="text-silver/30 text-xs font-mono">
              {pct.toFixed(1)}% of {FREE_TIER_MB} MB
            </span>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: "Data Size", value: fmt(stats.dataSize) },
              { label: "Index Size", value: fmt(stats.indexSize) },
              { label: "Collections", value: stats.collections },
              { label: "Documents", value: stats.objects.toLocaleString() },
            ].map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-0.5 px-3 py-2 border border-white/5 bg-white/[0.02]"
              >
                <span className="text-silver/30 font-mono text-[10px] uppercase tracking-wider">
                  {row.label}
                </span>
                <span className="text-silver/70 font-medium">{row.value}</span>
              </div>
            ))}
          </div>

          {pct > 85 && (
            <div className="mt-3 px-3 py-2 border border-red-500/20 bg-red-500/10 text-red-300 text-xs">
              ⚠ Storage above 85% — consider upgrading MongoDB Atlas.
            </div>
          )}
        </>
      )}
    </div>
  );
}
