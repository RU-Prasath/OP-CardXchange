const steps = [
  {
    num: 1,
    title: 'Choose a template',
    desc: 'Pick from 42 hand-crafted starts. Light, dark, brutalist, editorial.',
    visual: (
      <div className="grid grid-cols-3 gap-1.5">
        <div className="aspect-[4/3] rounded-md border-indigo-500 border-2 shadow-[0_0_0_3px_rgba(99,102,241,0.3)] relative" style={{background:'linear-gradient(135deg,#1E1B4B,#0F1729)'}}>
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-[#0A0D14]" style={{background:'linear-gradient(135deg,#22D3EE,#A855F7)'}}>✓</span>
        </div>
        <div className="aspect-[4/3] rounded-md border border-white/[0.07] bg-[#FAFAF9]"/>
        <div className="aspect-[4/3] rounded-md border border-white/[0.07] bg-[#0F1117]"/>
        <div className="col-span-3 font-mono text-[11px] text-white/30 mt-1">✦ Aurora selected</div>
      </div>
    ),
  },
  {
    num: 2,
    title: 'Customize content',
    desc: 'Edit each section in the visual admin. No code, no rebuilds.',
    visual: (
      <div className="font-mono text-xs space-y-1.5">
        {[
          {k:'name',v:'Taylor Chen'},
          {k:'role',v:'Staff Engineer',active:true},
          {k:'skills',v:'[ Rust, Go, K8s ]'},
          {k:'resume',v:'resume.pdf'},
        ].map(r => (
          <div key={r.k} className={`flex items-center justify-between px-2.5 py-1.5 rounded-md border ${r.active ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/[0.07] bg-white/[0.02]'}`}>
            <span className="text-white/30">{r.k}</span>
            <span className={r.active ? 'text-white' : 'text-white/60'}>{r.v}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: 3,
    title: 'Publish & share',
    desc: 'Share your portfolio URL with the world.',
    visual: (
      <div className="flex flex-col items-center gap-2.5">
        <div className="font-mono text-xs px-3 py-2 rounded-lg bg-black/40 border border-white/[0.07] text-white/40 w-full text-center">
          folioforge.com/portfolio/taylor
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]"/>
          deployed · 1.2s build
        </div>
        <div className="font-mono text-[10px] text-white/30">SSL provisioned · CDN active · 312 regions</div>
      </div>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="eyebrow-tag mb-5 inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]"/>How it works</div>
          <h2 className="section-heading max-w-2xl mx-auto">Three steps from blank<br/>to live portfolio.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map(s => (
            <div key={s.num} className="card-panel p-7">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-[#0A0D14] mb-5 shadow-[0_0_20px_-4px_rgba(99,102,241,0.6)]" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>{s.num}</div>
              <h3 className="text-lg font-semibold tracking-tight mb-2">{s.title}</h3>
              <p className="text-white/40 text-sm mb-5">{s.desc}</p>
              <div className="p-4 rounded-xl border border-white/[0.07] bg-black/30">{s.visual}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
