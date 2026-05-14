'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Template { _id: string; name: string; slug: string; category: string; pricingType: 'free'|'paid'; monthlyPrice: number; yearlyPrice: number; thumbnail: string; createdAt: string; }

const MAX_TILES = 6;
interface SiteContact { contactEmail: string; contactPhone: string; }

const THUMB_STYLES: Record<string, React.ReactNode> = {
  maren: (
    <div className="h-full p-4" style={{background:'oklch(0.16 0.008 260)'}}>
      <div className="text-[10px] font-mono" style={{color:'oklch(0.78 0.18 145)'}}>● open to work</div>
      <div className="font-bold text-2xl mt-4 leading-[0.95]" style={{color:'oklch(0.96 0.004 90)'}}>Building thoughtful interfaces.</div>
      <div className="h-px mt-4 mb-3" style={{background:'oklch(0.28 0.012 260)'}}/>
      <div className="flex gap-1.5 flex-wrap">
        {['TypeScript','React','Node.js'].map(t=><span key={t} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{background:'oklch(0.28 0.012 260)',color:'oklch(0.7 0.01 260)'}}>{t}</span>)}
      </div>
    </div>
  ),
  mintslate: (
    <div className="h-full p-4" style={{background:'#f0faf6',fontFamily:'sans-serif'}}>
      <div className="text-[9px] font-mono px-2 py-0.5 rounded-full inline-block mb-3" style={{background:'#d1fae5',color:'#065f46'}}>● Open to opportunities</div>
      <div className="font-bold text-xl leading-tight mb-1" style={{color:'#0f2b20'}}>Taylor Chen</div>
      <div className="text-[10px] mb-3" style={{color:'#4b7a65'}}>Full-Stack Engineer</div>
      <div className="h-px mb-3" style={{background:'#a7f3d0'}}/>
      <div className="flex gap-1 flex-wrap">
        {['React','TypeScript','Node.js'].map(t=><span key={t} className="text-[8px] px-1.5 py-0.5 rounded font-mono" style={{background:'#ccfbf1',color:'#0f766e'}}>{t}</span>)}
      </div>
    </div>
  ),
};

function DefaultThumb({ name, category }: { name: string; category: string }) {
  const colors: Record<string,string> = { developer:'rgba(99,102,241,0.25)', designer:'rgba(236,72,153,0.2)', writer:'rgba(245,158,11,0.2)', photographer:'rgba(34,211,238,0.2)', minimal:'rgba(156,163,175,0.15)' };
  return (
    <div className="h-full flex items-center justify-center flex-col gap-2" style={{background:`linear-gradient(135deg,${colors[category]||'rgba(99,102,241,0.2)'},rgba(17,21,31,0.9))`}}>
      <div className="text-4xl font-bold text-white/20">{name[0]}</div>
      <div className="text-[10px] font-mono text-white/20 uppercase">{name}</div>
    </div>
  );
}

export default function TemplateShowcase() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [contactModal, setContactModal] = useState(false);
  const [freeModal, setFreeModal] = useState(false);
  const [selectedTpl, setSelectedTpl] = useState('');
  const [siteContact, setSiteContact] = useState<SiteContact>({ contactEmail: '', contactPhone: '' });

  useEffect(() => {
    fetch('/api/landing/templates').then(r => r.json()).then(d => {
      if (d.success) setTemplates(d.data);
      setLoading(false);
    });
    fetch('/api/landing/settings').then(r => r.json()).then(d => {
      if (d.success) setSiteContact(d.data);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category.charAt(0).toUpperCase() + t.category.slice(1))))];

  // Newest first
  const byNewest = (a: Template, b: Template) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  // Apply category filter, then prefer latest free; top-up with latest paid until MAX_TILES
  const pool = (filter === 'All' ? templates : templates.filter(t => t.category.toLowerCase() === filter.toLowerCase()));
  const freeSorted = pool.filter(t => t.pricingType === 'free').sort(byNewest);
  const paidSorted = pool.filter(t => t.pricingType === 'paid').sort(byNewest);
  const filtered = (freeSorted.length >= MAX_TILES
    ? freeSorted.slice(0, MAX_TILES)
    : [...freeSorted, ...paidSorted.slice(0, MAX_TILES - freeSorted.length)]);

  return (
    <section id="templates" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end gap-6 mb-10 flex-wrap">
          <div>
            <div className="eyebrow-tag mb-4"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]"/>Template gallery</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4">Hand-crafted by designers,<br/>engineered for performance.</h2>
            <p className="text-white/50 text-base max-w-xl">Every template ships with a Lighthouse score above 95 and a content schema you can edit visually.</p>
          </div>
          {categories.length > 1 && (
            <div className="flex gap-1 p-1 rounded-xl border border-white/[0.07] bg-[#11151F]">
              {categories.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter===f ? 'bg-white/[0.06] text-white' : 'text-white/40 hover:text-white'}`}>{f}</button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-white/30 text-sm">Loading templates…</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {filtered.map(tpl => (
              <div key={tpl._id} className="card-panel overflow-hidden group hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_24px_48px_-24px_rgba(99,102,241,0.4)] transition-all duration-300">
                <div className="aspect-[4/3] border-b border-white/[0.07] relative overflow-hidden">
                  {tpl.thumbnail
                    ? <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-full object-cover"/>
                    : THUMB_STYLES[tpl.slug] || <DefaultThumb name={tpl.name} category={tpl.category}/>}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#0A0D14]/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/preview/${tpl.slug}`} target="_blank" className="btn-secondary-ff text-xs px-3 py-2 flex items-center gap-1.5">
                      <Eye size={12}/> Preview
                    </Link>
                    <button className="btn-grad text-xs px-3 py-2" onClick={() => { setSelectedTpl(tpl.name); if (tpl.pricingType === 'paid') { setContactModal(true); } else { setFreeModal(true); } }}>
                      Use template
                    </button>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-start gap-3">
                  <div>
                    <div className="font-semibold text-sm mb-1">{tpl.name}</div>
                    <div className="text-[11px] text-white/30 font-mono capitalize">{tpl.category}</div>
                  </div>
                  <div className="text-right shrink-0">
                    {tpl.pricingType === 'free' ? (
                      <span className="text-sm font-semibold text-emerald-400">Free</span>
                    ) : (
                      <div>
                        <div className="text-sm font-semibold text-white">₹{tpl.monthlyPrice || 0}<span className="text-xs text-white/40 font-normal">/mo</span></div>
                        <div className="text-[10px] text-white/30 font-mono">₹{tpl.yearlyPrice || 0}/yr</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-9">
          <Link href="/templates" className="btn-secondary-ff px-6 py-3">Browse all templates →</Link>
        </div>
      </div>

      {/* Paid template contact modal */}
      <Dialog open={contactModal} onOpenChange={setContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Get {selectedTpl}</DialogTitle>
            <DialogDescription>This is a premium template. Contact us to purchase access.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] space-y-3">
              {siteContact.contactEmail && (
                <div className="flex items-center gap-3"><span className="text-lg">📧</span><div><div className="text-sm font-medium">Email</div><div className="text-sm text-white/40 font-mono">{siteContact.contactEmail}</div></div></div>
              )}
              {siteContact.contactPhone && (
                <div className="flex items-center gap-3"><span className="text-lg">📞</span><div><div className="text-sm font-medium">Phone / WhatsApp</div><div className="text-sm text-white/40 font-mono">{siteContact.contactPhone}</div></div></div>
              )}
            </div>
            <p className="text-sm text-white/40">Our team will respond within 24 hours with access details.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Free template contact modal */}
      <Dialog open={freeModal} onOpenChange={setFreeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Get {selectedTpl}</DialogTitle>
            <DialogDescription>This is a free template. Contact us and we will set up your portfolio.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] space-y-3">
              {siteContact.contactEmail && (
                <div className="flex items-center gap-3"><span className="text-lg">📧</span><div><div className="text-sm font-medium">Email</div><div className="text-sm text-white/40 font-mono">{siteContact.contactEmail}</div></div></div>
              )}
              {siteContact.contactPhone && (
                <div className="flex items-center gap-3"><span className="text-lg">📞</span><div><div className="text-sm font-medium">Phone / WhatsApp</div><div className="text-sm text-white/40 font-mono">{siteContact.contactPhone}</div></div></div>
              )}
            </div>
            <p className="text-sm text-white/40">Our team will respond within 24 hours with access details.</p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
