import Link from 'next/link';

const footerLinks = {
  Product: ['Templates','Features','Dashboard','Pricing','Changelog'],
  Resources: ['Documentation','Component library','Status','Showcase','Migration guides'],
  Company: ['About','Blog','Careers','Press kit','Contact'],
  Legal: ['Terms','Privacy','Security','DPA','Cookies'],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] mt-10 pt-16 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 font-bold text-base mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-[13px] text-[#0A0D14]" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>F</div>
              Folioforge
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-5 max-w-[280px]">The portfolio platform for developers, designers, and writers who care about the craft.</p>
            <div className="flex gap-2">
              {['𝕏','🐙','💬','in'].map((s,i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white hover:border-white/[0.18] hover:bg-white/[0.04] transition-all text-sm">{s}</a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([col, links]) => (
            <div key={col}>
              <h5 className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/30 mb-4 font-medium">{col}</h5>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l}><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-white/[0.07] text-sm text-white/30 flex-wrap gap-4">
          <span>© 2026 Folioforge Labs · Built with care in Brooklyn & Berlin</span>
          <div className="flex items-center gap-6">
            <span className="font-mono flex items-center gap-1.5"><span className="text-emerald-400">✓</span> All systems operational</span>
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
