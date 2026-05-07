'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';

export default function LandingNav() {
  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState<{ authenticated: boolean; role?: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(setAuth).catch(() => setAuth({ authenticated: false }));
  }, []);

  const dashHref = auth?.role === 'superadmin' ? '/super-admin' : '/dashboard';

  return (
    <div className="sticky top-0 z-50 py-4 container mx-auto px-6">
      <nav className="flex items-center justify-between px-5 py-2.5 rounded-2xl nav-glass shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)] bg-[#0A0D14]/80 backdrop-blur-xl">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-base">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-[13px] text-[#0A0D14] shadow-[0_0_24px_-4px_rgba(99,102,241,0.6)] relative overflow-hidden" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>
            <span className="relative z-10">F</span>
            <div className="absolute inset-[1px] rounded-[6px]" style={{background:'linear-gradient(180deg,rgba(255,255,255,0.4),transparent 60%)'}} />
          </div>
          <span>Folioforge</span>
          <span className="font-mono text-[11px] text-white/30 font-normal ml-1">v2.4</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {['Templates','Features','Pricing','FAQ'].map(l => (
            <Link key={l} href={`#${l.toLowerCase()}`} className="text-sm px-3.5 py-2 text-white/50 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all font-medium">{l}</Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2">
          {auth?.authenticated ? (
            <Link href={dashHref} className="btn-grad text-xs px-4 py-2 flex items-center gap-1.5">
              <LayoutDashboard size={12}/> Dashboard →
            </Link>
          ) : (
            <Link href="/login" className="btn-grad text-xs px-4 py-2">Sign in →</Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white/60 p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </nav>

      {open && (
        <div className="md:hidden mt-2 rounded-2xl card-panel p-4 flex flex-col gap-2">
          {['Templates','Features','Pricing','FAQ'].map(l => (
            <Link key={l} href={`#${l.toLowerCase()}`} className="text-sm px-3 py-2 text-white/60 hover:text-white rounded-lg" onClick={() => setOpen(false)}>{l}</Link>
          ))}
          {auth?.authenticated ? (
            <Link href={dashHref} className="btn-grad text-center mt-2 flex items-center justify-center gap-1.5" onClick={() => setOpen(false)}>
              <LayoutDashboard size={13}/> Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-grad text-center mt-2">Sign in</Link>
          )}
        </div>
      )}
    </div>
  );
}
