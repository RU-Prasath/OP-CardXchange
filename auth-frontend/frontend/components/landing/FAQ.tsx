'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const faqs = [
  { q: 'How is my portfolio URL structured?', a: 'Your portfolio is available at folioforge.com/portfolio/your-username — no setup needed. Your URL is ready the moment your account is created by an admin.' },
  { q: 'What happens to my content if I switch templates?', a: 'Nothing. Every template binds to the same content schema, so your name, projects, skills, and resume re-flow into the new design. You can switch templates without losing any data.' },
  { q: 'How does OTP login work?', a: 'We send a 6-digit code to your email. Codes expire in 5 minutes and can\'t be reused. There\'s nothing to remember — just your email address.' },
  { q: 'Can a team manage multiple portfolios?', a: 'Yes. Premium workspaces let admins manage multiple user portfolios, share a template library, and control access. Each user gets their own portfolio with its own URL.' },
  { q: 'Do I own my content?', a: 'Always. Your portfolio content is yours. You can export it at any time as JSON. If you ever leave Folioforge, your data comes with you.' },
  { q: 'Is there a free plan?', a: 'The Starter plan is free forever. You get one portfolio with access to all free templates. Upgrade only when you want premium templates or team features.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="eyebrow-tag mb-5 inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]"/>FAQ</div>
          <h2 className="section-heading">Questions, answered.</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className={`card-panel overflow-hidden transition-all ${open === i ? 'border-white/[0.12]' : ''}`}>
              <button className="w-full flex items-center justify-between p-5 text-left text-sm font-medium hover:text-white/80 transition-colors" onClick={() => setOpen(open === i ? null : i)}>
                {f.q}
                {open === i ? <X size={14} className="text-cyan-400 shrink-0"/> : <Plus size={14} className="text-white/30 shrink-0"/>}
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed max-w-xl">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
