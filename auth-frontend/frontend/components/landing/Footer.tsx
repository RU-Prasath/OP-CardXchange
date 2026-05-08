import Link from 'next/link';

const navLinks = ['Templates', 'Features', 'Pricing', 'FAQ'];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] mt-10 pt-12 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 font-bold text-base mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-[13px] text-[#0A0D14]" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>F</div>
              Folioforge
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-[280px]">The portfolio platform for developers, designers, and writers who care about the craft.</p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {navLinks.map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="text-sm text-white/40 hover:text-white transition-colors">{l}</Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex gap-2">
            {['𝕏','🐙','💬','in'].map((s,i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white hover:border-white/[0.18] hover:bg-white/[0.04] transition-all text-sm">{s}</a>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-white/[0.07] text-sm text-white/30 flex-wrap gap-4">
          <span>© 2026 Folioforge Labs · Built by DevHood Tech Team. Contact: 9876543127.</span>
          <span className="font-mono flex items-center gap-1.5"><span className="text-emerald-400">✓</span> All systems operational</span>
        </div>
      </div>
    </footer>
  );
}
