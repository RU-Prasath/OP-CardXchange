'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Template { _id: string; name: string; slug: string; category: string; pricingType: 'free'|'paid'; thumbnail: string; }
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

export default function TemplatesPage() {
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
  const filtered = filter === 'All' ? templates : templates.filter(t => t.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen" style={{background:'#0A0D14',color:'#ECEEF3'}}>
      {/* Nav */}
      <div className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0A0D14]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={14}/> Back
            </Link>
            <div className="w-px h-4 bg-white/[0.12]"/>
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-base">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-[13px] text-[#0A0D14]" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>F</div>
              Folioforge
            </Link>
          </div>
          <Link href="/login" className="btn-grad text-xs px-4 py-2">Sign in →</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-xs font-mono text-white/30 uppercase tracking-[0.14em] mb-3">Template Gallery</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">All templates</h1>
          <p className="text-white/50 text-base max-w-lg">Browse all published templates. Click Preview to see the full design. Paid templates require contacting us for access.</p>
        </div>

        {categories.length > 1 && (
          <div className="flex gap-1 p-1 rounded-xl border border-white/[0.07] bg-[#11151F] w-fit mb-10">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter===c ? 'bg-white/[0.06] text-white' : 'text-white/40 hover:text-white'}`}>{c}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-24 text-white/30 text-sm">Loading templates…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-white/30 text-sm">No templates in this category yet.</div>
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
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-sm mb-0.5">{tpl.name}</div>
                    <div className="text-[11px] text-white/30 font-mono capitalize">{tpl.category}</div>
                  </div>
                  <span className={`text-sm font-semibold ${tpl.pricingType === 'free' ? 'text-emerald-400' : 'text-white'}`}>
                    {tpl.pricingType === 'free' ? 'Free' : 'Paid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
}
