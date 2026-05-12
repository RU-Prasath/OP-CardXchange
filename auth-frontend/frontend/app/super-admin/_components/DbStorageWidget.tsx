'use client';
import { useEffect, useState } from 'react';
import { Database } from 'lucide-react';

interface DbStats {
  dataSize: number;
  storageSize: number;
  indexSize: number;
  totalSize: number;
  collections: number;
  objects: number;
}

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const FREE_TIER_MB = 512;

export default function DbStorageWidget() {
  const [stats, setStats] = useState<DbStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/super-admin/db-stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d); else setError(d.error || 'Failed'); })
      .catch(() => setError('Failed to load'));
  }, []);

  const usedMB = stats ? (stats.totalSize / (1024 * 1024)) : 0;
  const pct = Math.min(100, (usedMB / FREE_TIER_MB) * 100);
  const barColor = pct > 85 ? '#f87171' : pct > 60 ? '#fbbf24' : '#34d399';

  return (
    <div className="card-panel p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-sky-400/10 flex items-center justify-center text-sky-400">
          <Database size={18}/>
        </div>
        <div>
          <h2 className="font-semibold text-sm leading-tight">MongoDB Storage</h2>
          <p className="text-[11px] text-white/30 font-mono">Free tier · 512 MB</p>
        </div>
      </div>

      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : !stats ? (
        <p className="text-xs text-white/30 animate-pulse">Loading…</p>
      ) : (
        <>
          {/* Progress bar */}
          <div className="h-2 rounded-full bg-white/[0.07] overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: barColor }}/>
          </div>

          <div className="flex items-end justify-between mb-4">
            <span className="text-2xl font-bold tracking-tight" style={{ color: barColor }}>
              {usedMB.toFixed(2)} MB
            </span>
            <span className="text-xs text-white/30 font-mono">
              {pct.toFixed(1)}% of {FREE_TIER_MB} MB
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Data Size', value: fmt(stats.dataSize) },
              { label: 'Index Size', value: fmt(stats.indexSize) },
              { label: 'Collections', value: stats.collections },
              { label: 'Documents', value: stats.objects.toLocaleString() },
            ].map(row => (
              <div key={row.label} className="flex flex-col gap-0.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <span className="text-white/30 font-mono text-[10px] uppercase tracking-wide">{row.label}</span>
                <span className="text-white/70 font-medium">{row.value}</span>
              </div>
            ))}
          </div>

          {pct > 85 && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              ⚠ Storage above 85% — consider upgrading MongoDB Atlas.
            </div>
          )}
        </>
      )}
    </div>
  );
}
