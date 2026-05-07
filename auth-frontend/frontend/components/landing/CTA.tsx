import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative text-center px-10 py-20 rounded-[28px] border border-white/[0.12] overflow-hidden"
          style={{background:'radial-gradient(ellipse 50% 80% at 50% 100%, rgba(99,102,241,0.25), transparent 70%), radial-gradient(ellipse 30% 50% at 20% 0%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(ellipse 30% 50% at 80% 0%, rgba(168,85,247,0.18), transparent 60%), #11151F'}}>
          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-30"
            style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>

          <div className="relative">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-[-0.04em] leading-[1.05] mb-4">
              Launch your portfolio<br/>today.
            </h2>
            <p className="text-white/50 text-lg max-w-lg mx-auto mb-8">It takes about 12 minutes. We&apos;ll be honest if it takes longer.</p>
            <div className="flex gap-3 justify-center flex-wrap mb-8">
              <Link href="/login" className="btn-grad text-base px-6 py-3">Start building free →</Link>
              <Link href="#" className="btn-secondary-ff text-base px-6 py-3">📖 Read the docs</Link>
            </div>
            <div className="flex gap-7 justify-center flex-wrap text-sm text-white/30">
              <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Free forever plan</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Ship in &lt; 30 minutes</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
