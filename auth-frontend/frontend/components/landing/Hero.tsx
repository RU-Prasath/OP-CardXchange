import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative text-center overflow-hidden px-6 py-20 md:py-28">
      {/* Glow */}
      <div className="absolute left-1/2 -top-[20%] w-[1100px] h-[700px] -translate-x-1/2 pointer-events-none" style={{background:'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(ellipse 30% 30% at 30% 50%, rgba(34,211,238,0.25), transparent 60%), radial-gradient(ellipse 30% 30% at 70% 60%, rgba(168,85,247,0.25), transparent 60%)',filter:'blur(60px)'}}/>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Pill */}
        {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.03] text-sm text-white/50 mb-7 backdrop-blur-lg">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-[#0A0D14]" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>NEW</span>
          AI-assisted bio writing now in beta
          <span className="text-white/30 ml-1">→</span>
        </div> */}

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-[-0.04em] max-w-[920px] mx-auto mb-6">
          Build your premium developer<br/>
          portfolio <span className="grad-text">in minutes.</span>
        </h1>

        {/* Sub */}
        <p className="text-lg text-white/50 max-w-[620px] mx-auto mb-9 leading-relaxed">
          Choose from hand-crafted templates, customize every section in a no-code editor, and publish your portfolio instantly. No frameworks, no deploy configs, no maintenance.
        </p>

        {/* CTAs */}
        <div className="flex gap-3 justify-center flex-wrap mb-7">
          <Link href="/login" className="btn-grad text-base px-6 py-3">Start building free →</Link>
          <Link href="#templates" className="btn-secondary-ff text-base px-6 py-3">▶ View templates</Link>
        </div>

        {/* Meta */}
        <div className="flex gap-7 justify-center flex-wrap text-sm text-white/30">
          <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Free forever plan</span>
          <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> No credit card</span>
        </div>

        {/* Browser mock */}
        <div className="mt-16 relative max-w-4xl mx-auto">
          {/* Float cards */}
          <div className="hidden lg:block absolute -left-12 top-[12%] w-52 rounded-2xl p-3.5 z-10 bg-[rgba(17,21,31,0.85)] border border-white/[0.12] backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-400/10 text-emerald-400 text-sm">⚡</div>
              <div><div className="text-sm font-semibold">Deploy ready</div><div className="text-[11px] text-white/30 font-mono">build · 1.2s</div></div>
            </div>
            <div className="mt-2.5 h-1 rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full w-full rounded-full" style={{background:'linear-gradient(90deg,#22D3EE,#A855F7)'}}/></div>
            <div className="mt-1.5 text-[11px] text-white/30 font-mono">100/100 lighthouse</div>
          </div>

          <div className="hidden lg:block absolute -right-12 bottom-[18%] w-56 rounded-2xl p-3.5 z-10 bg-[rgba(17,21,31,0.85)] border border-white/[0.12] backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-400/10 text-cyan-400 text-sm">📈</div>
              <div className="flex-1"><div className="text-sm font-semibold">12,847 visitors</div><div className="text-[11px] text-emerald-400">↑ 23% this week</div></div>
            </div>
            <svg viewBox="0 0 220 40" className="mt-2.5 w-full h-9">
              <polyline points="0,30 30,26 60,28 90,18 120,22 150,12 180,16 220,6" fill="none" stroke="url(#hg)" strokeWidth="1.8"/>
              <defs><linearGradient id="hg" x1="0" x2="1"><stop offset="0" stopColor="#22D3EE"/><stop offset="1" stopColor="#A855F7"/></linearGradient></defs>
            </svg>
          </div>

          {/* Browser */}
          <div className="rounded-xl border border-white/[0.12] overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8),0_20px_40px_-20px_rgba(99,102,241,0.4),0_0_120px_-40px_rgba(168,85,247,0.4)]" style={{background:'#11151F'}}>
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"/>
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"/>
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"/>
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-white/[0.07] font-mono text-xs text-white/40">
                <span className="text-emerald-400 text-[10px]">🔒</span>
                <span className="text-white">taylor.dev</span>
                <span className="text-white/30">/portfolio</span>
              </div>
            </div>
            <div className="p-12 md:p-16 bg-gradient-to-b from-[#0E121C] to-[#11151F] min-h-[460px]">
              <div className="flex justify-between items-center mb-12">
                <div className="font-mono text-sm font-semibold">~/taylor.dev</div>
                <div className="flex gap-6 text-sm text-white/40">
                  <span className="text-white border-b border-cyan-400 pb-1">Work</span>
                  <span>Writing</span><span>About</span><span>Contact</span>
                </div>
              </div>
              <div className="grid md:grid-cols-[1.4fr_1fr] gap-12 items-center">
                <div>
                  <div className="font-mono text-xs text-cyan-400 mb-3.5">$ whoami</div>
                  <h3 className="text-4xl font-bold leading-[1.05] tracking-tight mb-4">
                    Taylor Chen <span className="text-cyan-400">//</span><br/>building infra<br/>at <span className="grad-text">scale.</span>
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md">Staff engineer at Plane. Previously Stripe and Vercel. I write about distributed systems, runtime observability, and the messier corners of TypeScript.</p>
                  <div className="flex gap-2 flex-wrap mb-7">
                    {['Distributed Systems','Rust','Observability','+4'].map(t => (
                      <span key={t} className="px-2.5 py-1 rounded-full border border-white/[0.07] text-xs text-white/40 font-mono">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-2.5">
                    <span className="btn-secondary-ff text-xs px-3 py-2">View work →</span>
                    <span className="text-xs px-3 py-2 text-white/40 hover:text-white rounded-lg cursor-pointer">Resume.pdf</span>
                  </div>
                </div>
                <div className="aspect-[4/5] rounded-xl border border-white/[0.12] flex items-center justify-center" style={{background:'repeating-linear-gradient(135deg,rgba(34,211,238,0.08) 0 2px,transparent 2px 12px),linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.2))'}}>
                  <span className="font-mono text-xs text-white/30 bg-black/40 px-2.5 py-1 rounded-full border border-white/[0.07]">portrait.jpg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
