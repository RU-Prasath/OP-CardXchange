'use client';
import { useEffect, useState } from 'react';

interface StatsData { activePortfolios: number; templateCount: number; developerCount: number; avgLighthouse: number; }

export default function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch('/api/landing/stats').then(r => r.json()).then(d => { if (d.success) setStats(d.data); });
  }, []);

  const items = stats ? [
    { label: 'Active portfolios', value: stats.activePortfolios.toLocaleString(), trend: 'live right now', icon: '🌐' },
    { label: 'Templates', value: stats.templateCount.toString(), trend: 'hand-crafted', icon: '⚡' },
    { label: 'Developers', value: stats.developerCount >= 1000 ? `${(stats.developerCount/1000).toFixed(0)}k+` : `${stats.developerCount}+`, trend: 'and growing', icon: '🚀' },
    { label: 'Avg lighthouse', value: `${stats.avgLighthouse}/100`, trend: 'performance score', icon: '⭐' },
  ] : [
    { label: 'Active portfolios', value: '—', trend: 'loading…', icon: '🌐' },
    { label: 'Templates', value: '—', trend: 'loading…', icon: '⚡' },
    { label: 'Developers', value: '—', trend: 'loading…', icon: '🚀' },
    { label: 'Avg lighthouse', value: '—', trend: 'loading…', icon: '⭐' },
  ];

  return (
    <section className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl border border-white/[0.07] overflow-hidden" style={{background:'#11151F'}}>
          {items.map((s, i) => (
            <div key={s.label} className={`p-7 relative ${i < 3 ? 'border-r border-white/[0.07]' : ''} ${i < 2 ? 'max-md:border-b' : ''}`}>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/30 mb-3 flex items-center gap-2">
                <span>{s.icon}</span>{s.label}
              </div>
              <div className="text-4xl font-bold tracking-tight leading-none mb-2 grad-text">{s.value}</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">↑ {s.trend}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
