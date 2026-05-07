'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Minus } from 'lucide-react';

interface Feature { text: string; highlighted: boolean; missing: boolean; }
interface Plan { _id: string; tier: string; desc: string; monthlyPrice: number; yearlyPrice: number; billNote: string; cta: string; isFeatured: boolean; features: Feature[]; }

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetch('/api/landing/pricing').then(r => r.json()).then(d => { if (d.success) setPlans(d.data); });
  }, []);

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="eyebrow-tag mb-5 inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]"/>Pricing</div>
          <h2 className="section-heading max-w-2xl mx-auto mb-4">Free forever.<br/>Pro when you&apos;re ready.</h2>
          <p className="text-white/50 text-base max-w-xl mx-auto mb-8">Start with a free portfolio. Upgrade for premium templates and team seats.</p>

          <div className="inline-flex gap-1 p-1 rounded-full border border-white/[0.07] bg-[#11151F]">
            <button onClick={() => setYearly(false)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!yearly ? 'bg-white/[0.06] text-white' : 'text-white/40'}`}>Monthly</button>
            <button onClick={() => setYearly(true)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${yearly ? 'bg-white/[0.06] text-white' : 'text-white/40'}`}>
              Yearly
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-[#0A0D14]" style={{background:'linear-gradient(135deg,#22D3EE,#A855F7)'}}>-20%</span>
            </button>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">Loading plans…</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map(p => (
              <div key={p._id} className={`card-panel p-7 relative transition-all ${p.isFeatured ? 'border-indigo-500/40 shadow-[0_24px_48px_-24px_rgba(99,102,241,0.5),0_0_0_1px_rgba(99,102,241,0.2)]' : ''}`}
                style={p.isFeatured ? {background:'linear-gradient(180deg,rgba(99,102,241,0.08),rgba(168,85,247,0.04)),#11151F'} : {}}>
                {p.isFeatured && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full text-[#0A0D14] tracking-wide shadow-lg" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>MOST POPULAR</div>
                )}
                <div className="font-semibold text-base mb-1.5">{p.tier}</div>
                <div className="text-white/40 text-sm mb-5 min-h-[40px]">{p.desc}</div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-lg font-semibold text-white/50">$</span>
                  <span className="text-5xl font-bold tracking-tight">{yearly ? p.yearlyPrice : p.monthlyPrice}</span>
                  <span className="text-white/30 text-sm">/mo</span>
                </div>
                <div className="font-mono text-xs text-white/30 mb-6">{p.billNote}</div>
                <Link href="/login" className={`w-full flex items-center justify-center py-2.5 rounded-xl font-semibold text-sm mb-6 transition-all ${p.isFeatured ? 'btn-grad' : 'btn-secondary-ff'}`}>
                  {p.cta}
                </Link>
                <ul className="space-y-2">
                  {p.features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-2.5 text-sm ${f.missing ? 'text-white/25' : 'text-white/60'}`}>
                      {f.missing ? <Minus size={14} className="mt-0.5 shrink-0 text-white/25"/> : <Check size={14} className="mt-0.5 shrink-0 text-cyan-400"/>}
                      {f.highlighted ? <span className="font-semibold text-white">{f.text}</span> : f.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
