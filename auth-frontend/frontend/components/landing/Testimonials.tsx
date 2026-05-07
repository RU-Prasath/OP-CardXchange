'use client';
import { useEffect, useState } from 'react';

interface Testimonial { _id: string; quote: string; name: string; role: string; gradient: string; }

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch('/api/landing/testimonials').then(r => r.json()).then(d => { if (d.success) setItems(d.data); });
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="eyebrow-tag mb-5 inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]"/>Testimonials</div>
          <h2 className="section-heading max-w-2xl mx-auto">Built by people who<br/>obsess over the details.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map(t => (
            <div key={t._id} className="card-panel p-6 flex flex-col">
              <p className="text-sm leading-relaxed text-white flex-1 mb-6" dangerouslySetInnerHTML={{__html: t.quote.replace(/<b>(.*?)<\/b>/g, '<span class="text-cyan-400 font-semibold">$1</span>')}}/>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} shrink-0`}/>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-white/30 font-mono">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
