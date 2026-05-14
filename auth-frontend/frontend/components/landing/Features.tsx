const features = [
  {
    icon: '🔑',
    title: 'Passwordless OTP auth',
    desc: 'Built-in email + 6-digit OTP login. No password resets, no leaked credentials. Magic links available on Pro.',
    color: 'rgba(168,85,247,0.1)',
    iconColor: '#A855F7',
    span: 'md:col-span-3 md:row-span-2',
    visual: (
      <div className="mt-5 p-3 sm:p-5 rounded-xl border border-white/[0.07] bg-black/30">
        <div className="flex gap-1.5 sm:gap-2 justify-center mb-4">
          {['2','6','0','4','',''].map((d,i) => (
            <div key={i} className={`w-[clamp(28px,9vw,40px)] aspect-[5/6] rounded-lg border flex items-center justify-center font-mono font-semibold text-base sm:text-lg ${d ? 'bg-indigo-500/15 border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]' : i===4 ? 'border-cyan-400' : 'border-white/[0.12]'}`}>
              {d || (i===4 ? <span className="w-px h-5 bg-cyan-400 blink"/> : '')}
            </div>
          ))}
        </div>
        <div className="text-center font-mono text-[11px] sm:text-xs text-emerald-400">● code sent · expires in 04:11</div>
      </div>
    ),
  },
  {
    icon: '⚡',
    title: 'Dynamic, swappable templates',
    desc: 'Switch templates without losing content. Bio, projects, resume re-flow automatically.',
    span: 'md:col-span-3',
    visual: (
      <div className="mt-4 flex gap-2">
        {[
          'linear-gradient(135deg,#1E1B4B,#0F1729)',
          '#FAFAF9',
          '#0F1117',
          'linear-gradient(135deg,#1E293B,#0F172A)',
          '#FFF8E7',
        ].map((bg,i) => (
          <div key={i} className="flex-1 aspect-square rounded-lg border border-white/[0.1]" style={{background:bg}}/>
        ))}
      </div>
    ),
  },
  {
    icon: '🚀',
    title: 'Edge-deployed in 1.2s',
    desc: 'Global CDN. Static-first. No build step on your end.',
    span: 'md:col-span-2',
    visual: (
      <div className="mt-3.5 flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-black/30 border border-white/[0.07] font-mono text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]"/>
        <span className="text-white/40">prod ·</span>
        <span className="text-white">taylor.dev</span>
        <span className="ml-auto text-white/30">just now</span>
      </div>
    ),
  },
  {
    icon: '🔍',
    title: 'SEO + OG, automatic',
    desc: 'Sitemap, schema.org, dynamic OG images — generated for every page.',
    span: 'md:col-span-2',
  },
  {
    icon: '📊',
    title: 'Privacy-first analytics',
    desc: 'No cookies. Visitor counts, top pages, referrers straight in your dashboard.',
    span: 'md:col-span-2 md:row-span-2',
    visual: (
      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight">12,847 <span className="text-sm text-emerald-400 font-medium ml-1">↑ 23%</span></div>
        <div className="font-mono text-xs text-white/30 mt-1">visitors · last 30 days</div>
        <div className="flex items-end gap-1 mt-4 h-20">
          {[20,32,28,48,40,60,55,75,65,90,80,100].map((h,i) => (
            <div key={i} className="flex-1 rounded-t" style={{height:`${h}%`,background:h>60?'linear-gradient(180deg,#22D3EE,#6366F1)':'linear-gradient(180deg,#22D3EE40,#6366F140)'}}/>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: '📄',
    title: 'Resume-as-data',
    desc: 'Edit JSON-Resume once. Render to /resume, /resume.pdf, and your hero.',
    span: 'md:col-span-2',
  },
  {
    icon: '👥',
    title: 'Team workspaces',
    desc: 'Bring your studio. Share editor seats, billing, and template libraries.',
    span: 'md:col-span-2',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="eyebrow-tag mb-5 inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]"/>What&apos;s inside</div>
          <h2 className="section-heading max-w-2xl mx-auto mb-4">A complete platform behind<br/>every portfolio you ship.</h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">From passwordless auth to global edge deploys — every feature you&apos;d otherwise glue together yourself, ready out of the box.</p>
        </div>

        <div className="grid md:grid-cols-6 gap-4 auto-rows-min">
          {features.map(f => (
            <div key={f.title} className={`card-panel p-6 hover:border-white/[0.12] transition-colors ${f.span || ''}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base mb-4 border border-white/[0.07] bg-white/[0.04]"
                style={f.color ? {background: f.color} : {}}>{f.icon}</div>
              <h3 className="font-semibold text-base tracking-tight mb-1.5">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              {f.visual}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
