'use client';
import { useState, useEffect, useRef } from 'react';

interface Props { content: Record<string, string>; username: string; hideBranding?: boolean; }

function pl(v?: string) { return v ? v.split(',').map(s => s.trim()).filter(Boolean) : []; }
function ls(v?: string) { return v ? v.split('\n').map(s => s.trim()).filter(Boolean) : []; }
function parseJ<T>(raw: string | undefined, fallback: T[]): T[] {
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

const Github = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
);
const Linkedin = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
);
const X = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const Mail = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
);
const Arrow = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
);
const Sun = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
);
const Moon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
);
const Sparkle = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.5 7.5L22 10l-7.5 2.5L12 20l-2.5-7.5L2 10l7.5-2.5L12 0z"/></svg>
);
const Copy = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
);
const Check = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
);

const PROJECT_GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
  'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #6366f1 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%)',
];

export default function ApexTemplate({ content, hideBranding }: Props) {
  const c = content;
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAllExp, setShowAllExp] = useState(false);
  const [showAllProj, setShowAllProj] = useState(false);
  const [activeSkillIdx, setActiveSkillIdx] = useState(0);
  const [emailCopied, setEmailCopied] = useState(false);
  const EXP_LIMIT = 3;
  const PROJ_LIMIT = 4;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const revealRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('apx-in')),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealRef.current?.querySelectorAll('.apx-reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const name = c.name || 'Your Name';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const accent = c.colorAccent || '#a78bfa';
  const accent2 = c.colorAccent2 || '#22d3ee';

  const skillCats = parseJ<{ category: string; items: string }>(c.skillsJson, [
    { category: 'Languages', items: 'TypeScript, JavaScript, Python' },
    { category: 'Frameworks', items: 'React, Next.js, Node.js' },
    { category: 'Tooling', items: 'Git, Docker, Vite' },
  ]).map(s => ({ title: s.category, items: pl(s.items) }));

  const profs = parseJ<{ name: string; level: number }>(c.proficienciesJson, []);
  const learning = pl(c.currentlyLearning);

  const experiences = parseJ<{ period: string; nowLabel: string; duration: string; role: string; company: string; summary: string; bullets: string; stack: string; isCurrent: boolean }>(c.expJson, []).map(e => ({
    period: e.period,
    nowLabel: e.nowLabel,
    duration: e.duration,
    role: e.role,
    company: e.company,
    summary: e.summary,
    bullets: ls(e.bullets),
    stack: pl(e.stack),
    isCurrent: !!e.isCurrent,
  }));

  const projects = parseJ<{ title: string; tag: string; desc: string; stack: string; liveUrl: string; githubUrl: string }>(c.projJson, []).map((p, i) => ({
    title: p.title, tag: p.tag, desc: p.desc,
    stack: pl(p.stack), liveUrl: p.liveUrl, githubUrl: p.githubUrl,
    gradient: PROJECT_GRADIENTS[i % PROJECT_GRADIENTS.length],
  })).filter(p => p.title);

  const education = parseJ<{ school: string; degree: string; period: string; detail: string }>(c.educationJson, []);
  const certs = parseJ<{ name: string; issuer: string; year: string; url: string }>(c.certsJson, []);
  const testimonials = parseJ<{ quote: string; author: string; role: string }>(c.testimonialsJson, []);

  const stats = [1, 2, 3, 4].map(i => ({
    num: c[`stat${i}Num`],
    label: c[`stat${i}Label`],
  })).filter(s => s.num || s.label);

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  const copyEmail = async () => {
    if (!c.contactEmail) return;
    try {
      await navigator.clipboard.writeText(c.contactEmail);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 1800);
    } catch {}
  };

  const aboutFacts = [
    { label: 'Based In', value: c.location },
    { label: 'Timezone', value: c.timezone },
    { label: 'Languages', value: c.languages },
    { label: 'Focus', value: c.focus },
  ].filter(f => f.value);

  const aboutParas = [c.aboutPara1, c.aboutPara2, c.aboutPara3].filter(Boolean);

  const CSS = `
    .apx{
      --accent:${accent};
      --accent-2:${accent2};
      --accent-glow:${accent}40;
      ${dark ? `
        --bg:#0a0a0f;
        --bg-2:#0f0f17;
        --surface:rgba(255,255,255,.025);
        --surface-2:rgba(255,255,255,.04);
        --surface-hi:rgba(255,255,255,.06);
        --line:rgba(255,255,255,.08);
        --line-2:rgba(255,255,255,.14);
        --tx:#f1f5f9;
        --tx-2:#a3a3b8;
        --tx-3:#6b6b85;
        --grid:rgba(255,255,255,.04);
      ` : `
        --bg:#f3f3ee;
        --bg-2:#ecebe5;
        --surface:rgba(255,255,255,.55);
        --surface-2:rgba(255,255,255,.78);
        --surface-hi:#ffffff;
        --line:rgba(15,23,42,.10);
        --line-2:rgba(15,23,42,.18);
        --tx:#1a1a1f;
        --tx-2:#4a4a55;
        --tx-3:#86868f;
        --grid:rgba(15,23,42,.06);
      `}
      font-family:'Inter','Geist',ui-sans-serif,system-ui,sans-serif;
      background:var(--bg);
      color:var(--tx);
      min-height:100vh;
      -webkit-font-smoothing:antialiased;
      overflow-x:hidden;
    }
    .apx *{box-sizing:border-box;margin:0;padding:0;}
    .apx a{color:inherit;text-decoration:none;}
    .apx button{font:inherit;cursor:pointer;border:none;background:none;color:inherit;}
    .apx-serif{font-family:'Instrument Serif','Cormorant Garamond',Georgia,serif;font-weight:400;}
    .apx-mono{font-family:'JetBrains Mono','Geist Mono',ui-monospace,monospace;}

    @keyframes apx-pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes apx-rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
    @keyframes apx-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes apx-pop{0%{opacity:0;transform:scale(.9)}100%{opacity:1;transform:scale(1)}}
    .apx-pulse{animation:apx-pulse 2.2s ease infinite;}
    .apx-reveal{opacity:0;transform:translateY(24px);}
    .apx-reveal.apx-in{animation:apx-rise .65s cubic-bezier(.2,.8,.3,1) forwards;}

    .apx-shell{max-width:1200px;margin:0 auto;padding:0 28px;}

    /* ── Nav ── */
    .apx-nav{position:sticky;top:0;z-index:50;transition:all .3s;}
    .apx-nav-inner{display:flex;align-items:center;justify-content:space-between;
      height:64px;max-width:1200px;margin:0 auto;padding:0 28px;gap:16px;}
    .apx-nav.apx-scrolled{background:color-mix(in oklab, var(--bg) 78%, transparent);
      backdrop-filter:blur(18px) saturate(150%);border-bottom:1px solid var(--line);}
    .apx-logo{display:inline-flex;align-items:center;gap:10px;letter-spacing:-.01em;}
    .apx-logo-name{font-size:15px;line-height:1.2;color:var(--tx);font-weight:600;}
    .apx-logo-sub{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--tx-3);
      font-family:'JetBrains Mono',monospace;margin-top:2px;}
    .apx-logo-sub-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;
      box-shadow:0 0 8px #22c55e;animation:apx-pulse 2s infinite;}
    .apx-logo-block{display:flex;flex-direction:column;}
    .apx-nav-links{display:flex;gap:2px;}
    .apx-nav-link{padding:7px 13px;border-radius:8px;font-size:13.5px;font-weight:500;
      color:var(--tx-2);transition:all .2s;}
    .apx-nav-link:hover{color:var(--tx);background:var(--surface-2);}
    .apx-btn-primary{padding:8px 18px;border-radius:9px;font-size:13.5px;font-weight:500;
      background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#fff;
      box-shadow:0 6px 24px -6px var(--accent-glow);transition:all .2s;
      display:inline-flex;align-items:center;gap:6px;white-space:nowrap;}
    .apx-btn-primary:hover{transform:translateY(-1px);box-shadow:0 10px 30px -6px var(--accent-glow);}
    .apx-btn-ghost{padding:8px 18px;border-radius:9px;font-size:13.5px;font-weight:500;
      background:var(--surface);border:1px solid var(--line);color:var(--tx);transition:all .2s;
      display:inline-flex;align-items:center;gap:6px;}
    .apx-btn-ghost:hover{border-color:var(--line-2);background:var(--surface-hi);}
    .apx-icon-btn{width:36px;height:36px;border-radius:9px;border:1px solid var(--line);
      background:var(--surface);color:var(--tx-2);display:grid;place-items:center;transition:all .2s;}
    .apx-icon-btn:hover{color:var(--tx);border-color:var(--line-2);}
    .apx-ham{display:none;}
    .apx-mobile-menu{display:none;}

    /* ── Hero ── */
    .apx-hero{position:relative;padding:120px 0 80px;overflow:hidden;}
    .apx-hero-grid-bg{position:absolute;inset:0;
      background-image:linear-gradient(var(--grid) 1px,transparent 1px),
        linear-gradient(90deg,var(--grid) 1px,transparent 1px);
      background-size:60px 60px;
      mask-image:radial-gradient(ellipse 80% 70% at 50% 0%,#000,transparent 75%);
      -webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 0%,#000,transparent 75%);
      pointer-events:none;}
    .apx-hero-orb{position:absolute;width:520px;height:520px;border-radius:50%;
      background:radial-gradient(circle,var(--accent) 0%,transparent 65%);
      filter:blur(60px);opacity:.18;top:-180px;left:-100px;pointer-events:none;}
    .apx-hero-orb-2{position:absolute;width:480px;height:480px;border-radius:50%;
      background:radial-gradient(circle,var(--accent-2) 0%,transparent 65%);
      filter:blur(70px);opacity:.14;top:60px;right:-120px;pointer-events:none;}
    .apx-hero-title{font-size:clamp(48px,8vw,108px);line-height:.96;letter-spacing:-.045em;
      font-weight:500;margin-bottom:18px;}
    .apx-hero-title .apx-gradient{
      background:linear-gradient(135deg,var(--accent) 0%,var(--accent-2) 100%);
      -webkit-background-clip:text;background-clip:text;color:transparent;}
    .apx-hero-role{font-size:clamp(20px,2.5vw,32px);color:var(--tx-2);
      margin-bottom:26px;font-weight:400;line-height:1.3;}
    .apx-hero-sub{font-size:clamp(16px,1.5vw,18.5px);color:var(--tx-2);
      max-width:640px;line-height:1.65;margin-bottom:40px;}
    .apx-hero-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:56px;}
    .apx-hero-socials{display:flex;gap:8px;}
    .apx-hero-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;
      border-top:1px solid var(--line);border-bottom:1px solid var(--line);
      margin-top:56px;}
    .apx-stat{padding:24px 8px;border-right:1px solid var(--line);}
    .apx-stat:last-child{border-right:none;}
    .apx-stat-num{font-size:clamp(28px,3.6vw,40px);font-weight:600;letter-spacing:-.02em;
      background:linear-gradient(135deg,var(--tx) 30%,var(--accent) 100%);
      -webkit-background-clip:text;background-clip:text;color:transparent;line-height:1;}
    .apx-stat-label{font-size:11px;color:var(--tx-3);text-transform:uppercase;
      letter-spacing:.08em;margin-top:8px;font-family:'JetBrains Mono',monospace;}

    /* ── Section header ── */
    .apx-section{padding:96px 0;position:relative;}
    .apx-section.apx-alt{background:var(--bg-2);}
    .apx-sec-head{display:flex;align-items:center;gap:14px;margin-bottom:14px;}
    .apx-sec-tag{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;
      font-family:'JetBrains Mono',monospace;color:var(--accent);
      padding:4px 10px;border-radius:999px;background:color-mix(in oklab, var(--accent) 12%, transparent);
      border:1px solid color-mix(in oklab, var(--accent) 28%, transparent);}
    .apx-sec-line{flex:1;height:1px;background:linear-gradient(90deg,var(--line),transparent);}
    .apx-sec-title{font-size:clamp(30px,4.2vw,48px);font-weight:500;letter-spacing:-.025em;
      line-height:1.1;margin-bottom:14px;}
    .apx-sec-title em{font-style:normal;
      background:linear-gradient(135deg,var(--accent),var(--accent-2));
      -webkit-background-clip:text;background-clip:text;color:transparent;}
    .apx-sec-sub{font-size:16.5px;color:var(--tx-2);max-width:640px;line-height:1.6;
      margin-bottom:56px;}

    /* ────────────────────────────────────────────────────────────── */
    /* ── ABOUT — Editorial Magazine Layout                       ── */
    /* ────────────────────────────────────────────────────────────── */
    .apx-about-layout{display:grid;grid-template-columns:360px 1fr;gap:64px;align-items:start;}
    .apx-about-portrait{position:sticky;top:90px;border-radius:20px;overflow:hidden;
      aspect-ratio:4/5;background:linear-gradient(135deg,
        color-mix(in oklab,var(--accent) 24%,transparent),
        color-mix(in oklab,var(--accent-2) 24%,transparent));
      border:1px solid var(--line);display:flex;align-items:flex-end;}
    .apx-about-portrait img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
    .apx-about-portrait::after{content:'';position:absolute;inset:0;
      background:linear-gradient(to bottom,transparent 40%,rgba(0,0,0,.55) 100%);
      pointer-events:none;}
    .apx-about-portrait-fallback{width:100%;height:100%;display:grid;place-items:center;
      font-family:'Instrument Serif',serif;font-size:120px;color:var(--tx-2);font-weight:300;
      letter-spacing:-.04em;}
    .apx-about-portrait-meta{position:relative;z-index:2;padding:24px 26px;width:100%;
      display:flex;flex-direction:column;gap:6px;color:#fff;}
    .apx-about-portrait-name{font-family:'Instrument Serif',serif;font-size:34px;line-height:1.05;
      letter-spacing:-.02em;}
    .apx-about-portrait-loc{font-family:'JetBrains Mono',monospace;font-size:12px;
      color:rgba(255,255,255,.78);}
    .apx-about-text{display:flex;flex-direction:column;gap:0;}
    .apx-about-headline{font-family:'Instrument Serif',serif;font-size:clamp(34px,5vw,56px);
      letter-spacing:-.02em;line-height:1.05;margin-bottom:14px;color:var(--tx);}
    .apx-about-headline em{font-style:italic;
      background:linear-gradient(135deg,var(--accent),var(--accent-2));
      -webkit-background-clip:text;background-clip:text;color:transparent;}
    .apx-about-tag{display:inline-flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;
      font-size:11.5px;color:var(--tx-3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:28px;}
    .apx-about-tag::before{content:'';width:24px;height:1px;background:var(--accent);display:inline-block;}
    .apx-about-blocks{display:flex;flex-direction:column;gap:0;margin-bottom:36px;}
    .apx-about-block{display:grid;grid-template-columns:60px 1fr;gap:24px;
      padding:24px 0;border-top:1px solid var(--line);}
    .apx-about-block:last-child{border-bottom:1px solid var(--line);}
    .apx-about-block-num{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--accent);
      padding-top:4px;font-weight:500;}
    .apx-about-block-text{font-size:17px;line-height:1.7;color:var(--tx-2);}
    .apx-about-block:first-of-type .apx-about-block-text{font-size:19px;color:var(--tx);}
    .apx-about-facts{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
    .apx-fact{padding:18px 20px;border-radius:14px;background:var(--surface);
      border:1px solid var(--line);transition:border-color .2s,transform .2s;}
    .apx-fact:hover{border-color:var(--line-2);transform:translateY(-2px);}
    .apx-fact-label{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--tx-3);
      text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;
      display:flex;align-items:center;gap:6px;}
    .apx-fact-label::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--accent);}
    .apx-fact-value{font-size:15px;color:var(--tx);font-weight:500;}

    /* ────────────────────────────────────────────────────────────── */
    /* ── SKILLS — Inspector Panel + Mastery Blocks               ── */
    /* ────────────────────────────────────────────────────────────── */
    .apx-skills-layout{display:grid;grid-template-columns:320px 1fr;gap:48px;align-items:start;}
    .apx-skill-nav{display:flex;flex-direction:column;gap:4px;
      padding:8px;border-radius:18px;background:var(--surface);
      border:1px solid var(--line);position:sticky;top:90px;}
    .apx-skill-nav-item{display:flex;align-items:center;gap:14px;padding:14px 18px;
      border-radius:12px;cursor:pointer;transition:all .25s;border:1px solid transparent;text-align:left;
      width:100%;}
    .apx-skill-nav-item:hover{background:var(--surface-2);}
    .apx-skill-nav-item.apx-active{background:linear-gradient(135deg,
      color-mix(in oklab,var(--accent) 14%,transparent),
      color-mix(in oklab,var(--accent-2) 14%,transparent));
      border-color:color-mix(in oklab,var(--accent) 32%,transparent);}
    .apx-skill-nav-idx{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--tx-3);
      width:24px;flex-shrink:0;}
    .apx-skill-nav-item.apx-active .apx-skill-nav-idx{color:var(--accent);}
    .apx-skill-nav-title{font-size:14.5px;font-weight:500;color:var(--tx-2);flex:1;}
    .apx-skill-nav-item.apx-active .apx-skill-nav-title{color:var(--tx);font-weight:600;}
    .apx-skill-nav-count{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx-3);
      padding:3px 8px;border-radius:5px;background:var(--surface-2);}
    .apx-skill-nav-item.apx-active .apx-skill-nav-count{background:color-mix(in oklab,var(--accent) 18%,transparent);color:var(--accent);}
    .apx-skill-panel{padding:36px 40px;border-radius:20px;background:var(--surface);
      border:1px solid var(--line);position:relative;overflow:hidden;min-height:360px;}
    .apx-skill-panel::before{content:'';position:absolute;top:-80px;right:-80px;width:280px;height:280px;
      border-radius:50%;background:radial-gradient(circle,var(--accent-glow),transparent 70%);
      pointer-events:none;opacity:.4;}
    .apx-skill-panel-head{display:flex;align-items:baseline;gap:14px;margin-bottom:28px;position:relative;}
    .apx-skill-panel-title{font-size:24px;font-weight:500;letter-spacing:-.015em;}
    .apx-skill-panel-meta{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--tx-3);}
    .apx-skill-tags{display:flex;flex-wrap:wrap;gap:8px;position:relative;}
    .apx-skill-tag{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;
      border-radius:8px;background:var(--surface-2);border:1px solid var(--line);
      font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--tx);
      transition:all .2s;animation:apx-pop .35s cubic-bezier(.2,.8,.3,1) backwards;}
    .apx-skill-tag:hover{border-color:var(--accent);transform:translateY(-2px);
      box-shadow:0 6px 18px -6px var(--accent-glow);}
    .apx-skill-tag-bar{display:flex;gap:2px;}
    .apx-skill-tag-bar span{width:4px;height:4px;border-radius:1px;background:var(--line-2);}
    .apx-skill-tag-bar span.apx-on{background:var(--accent);}
    .apx-skill-mastery{margin-top:32px;padding-top:28px;border-top:1px dashed var(--line);}
    .apx-skill-mastery-head{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx-3);
      text-transform:uppercase;letter-spacing:.08em;margin-bottom:18px;}
    .apx-mastery-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px 28px;}
    .apx-mastery-row{display:flex;flex-direction:column;gap:6px;}
    .apx-mastery-top{display:flex;justify-content:space-between;align-items:center;font-size:13px;}
    .apx-mastery-name{color:var(--tx);font-weight:500;}
    .apx-mastery-level{color:var(--tx-3);font-family:'JetBrains Mono',monospace;font-size:11px;}
    .apx-mastery-blocks{display:flex;gap:4px;}
    .apx-mastery-blocks span{flex:1;height:6px;border-radius:3px;background:var(--line);}
    .apx-mastery-blocks span.apx-on{background:linear-gradient(90deg,var(--accent),var(--accent-2));
      box-shadow:0 0 8px var(--accent-glow);}

    /* Learning marquee */
    .apx-learning-strip{margin-top:48px;padding:18px 0;
      border-top:1px solid var(--line);border-bottom:1px solid var(--line);
      overflow:hidden;position:relative;mask-image:linear-gradient(90deg,transparent 0,#000 8%,#000 92%,transparent 100%);
      -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 8%,#000 92%,transparent 100%);}
    .apx-learning-track{display:flex;gap:18px;animation:apx-marquee 32s linear infinite;
      white-space:nowrap;}
    .apx-learning-chip{display:inline-flex;align-items:center;gap:8px;
      font-family:'JetBrains Mono',monospace;font-size:13.5px;color:var(--tx-2);flex-shrink:0;}
    .apx-learning-chip::before{content:'◆';color:var(--accent);font-size:9px;}
    .apx-learning-prefix{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--accent);
      text-transform:uppercase;letter-spacing:.1em;flex-shrink:0;padding-right:18px;border-right:1px solid var(--line);}

    /* ────────────────────────────────────────────────────────────── */
    /* ── EXPERIENCE — Vertical Center Timeline                    ── */
    /* ────────────────────────────────────────────────────────────── */
    .apx-exp-timeline{position:relative;padding:20px 0;}
    .apx-exp-timeline::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:1px;
      background:linear-gradient(to bottom,transparent,var(--line) 6%,var(--line) 94%,transparent);
      transform:translateX(-.5px);}
    .apx-exp-row{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:64px;
      margin-bottom:48px;}
    .apx-exp-row:last-child{margin-bottom:0;}
    .apx-exp-row.apx-right .apx-exp-card{grid-column:2;}
    .apx-exp-row.apx-right .apx-exp-meta{grid-column:1;text-align:right;}
    .apx-exp-row.apx-left .apx-exp-card{grid-column:1;}
    .apx-exp-row.apx-left .apx-exp-meta{grid-column:2;}
    .apx-exp-dot{position:absolute;left:50%;top:32px;width:18px;height:18px;border-radius:50%;
      background:var(--bg);border:2px solid var(--accent);transform:translateX(-50%);z-index:2;
      box-shadow:0 0 0 6px color-mix(in oklab,var(--accent) 18%,transparent);}
    .apx-exp-dot.apx-current{background:linear-gradient(135deg,var(--accent),var(--accent-2));
      box-shadow:0 0 0 6px color-mix(in oklab,var(--accent) 22%,transparent),
        0 0 16px var(--accent-glow);}
    .apx-exp-card{padding:28px 32px;border-radius:18px;background:var(--surface);
      border:1px solid var(--line);transition:all .3s;position:relative;}
    .apx-exp-card:hover{border-color:var(--line-2);transform:translateY(-3px);
      box-shadow:0 16px 40px -16px var(--accent-glow);}
    .apx-exp-role{font-size:21px;font-weight:500;letter-spacing:-.01em;margin-bottom:6px;color:var(--tx);}
    .apx-exp-company{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--accent);
      margin-bottom:14px;}
    .apx-exp-summary{font-size:14.5px;color:var(--tx-2);line-height:1.65;margin-bottom:16px;}
    .apx-exp-bullets{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
    .apx-exp-bullet{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;color:var(--tx-2);line-height:1.55;}
    .apx-exp-bullet::before{content:'';width:4px;height:4px;border-radius:50%;
      background:var(--accent);flex-shrink:0;margin-top:8px;}
    .apx-exp-stack{display:flex;flex-wrap:wrap;gap:6px;}
    .apx-exp-stack-pill{padding:3px 10px;border-radius:6px;border:1px solid var(--line);
      font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx-3);}
    .apx-exp-meta{padding-top:24px;}
    .apx-exp-period{font-family:'Instrument Serif',serif;font-size:32px;letter-spacing:-.02em;
      line-height:1;color:var(--tx);margin-bottom:8px;}
    .apx-exp-period em{font-style:italic;color:var(--accent);}
    .apx-exp-dates{font-family:'JetBrains Mono',monospace;font-size:12.5px;color:var(--tx-3);}
    .apx-exp-now{display:inline-flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;
      font-size:11.5px;color:var(--accent);margin-bottom:6px;
      padding:3px 10px;border-radius:999px;background:color-mix(in oklab,var(--accent) 14%,transparent);
      border:1px solid color-mix(in oklab,var(--accent) 32%,transparent);}

    /* ────────────────────────────────────────────────────────────── */
    /* ── PROJECTS — List with Hover Preview                       ── */
    /* ────────────────────────────────────────────────────────────── */
    .apx-proj-list{display:flex;flex-direction:column;}
    .apx-proj-row{display:grid;grid-template-columns:64px 1fr auto;gap:32px;align-items:center;
      padding:32px 24px;border-top:1px solid var(--line);transition:all .35s;
      position:relative;cursor:default;border-radius:0;}
    .apx-proj-row:last-child{border-bottom:1px solid var(--line);}
    .apx-proj-row::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
      background:linear-gradient(to bottom,var(--accent),var(--accent-2));
      transform:scaleY(0);transform-origin:top;transition:transform .35s;border-radius:2px;}
    .apx-proj-row:hover::before{transform:scaleY(1);}
    .apx-proj-row:hover{background:var(--surface);padding-left:36px;}
    .apx-proj-row:hover .apx-proj-preview{opacity:1;transform:translateX(0) rotate(-3deg) scale(1);}
    .apx-proj-num{font-family:'Instrument Serif',serif;font-size:30px;color:var(--tx-3);
      letter-spacing:-.02em;line-height:1;font-style:italic;}
    .apx-proj-row:hover .apx-proj-num{color:var(--accent);}
    .apx-proj-body{display:flex;flex-direction:column;gap:8px;min-width:0;}
    .apx-proj-row-top{display:flex;align-items:baseline;gap:16px;flex-wrap:wrap;}
    .apx-proj-title{font-size:24px;font-weight:500;letter-spacing:-.01em;}
    .apx-proj-tag{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx-3);
      padding:3px 9px;border-radius:5px;border:1px solid var(--line);text-transform:uppercase;
      letter-spacing:.06em;white-space:nowrap;}
    .apx-proj-desc{font-size:14.5px;color:var(--tx-2);line-height:1.6;max-width:640px;}
    .apx-proj-row-meta{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:4px;}
    .apx-proj-stack-inline{display:flex;flex-wrap:wrap;gap:6px;}
    .apx-proj-stack-pill{font-family:'JetBrains Mono',monospace;font-size:11px;padding:3px 9px;
      border-radius:6px;background:var(--surface-2);border:1px solid var(--line);color:var(--tx-3);}
    .apx-proj-actions{display:flex;align-items:center;gap:10px;flex-shrink:0;}
    .apx-proj-action{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;
      border-radius:10px;border:1px solid var(--line);background:var(--surface-2);
      color:var(--tx-2);font-size:13px;font-weight:500;white-space:nowrap;
      transition:all .2s;}
    .apx-proj-action:hover{color:var(--tx);border-color:var(--accent);transform:translateY(-1px);
      box-shadow:0 6px 16px -6px var(--accent-glow);}
    .apx-proj-action.apx-primary{background:linear-gradient(135deg,var(--accent),var(--accent-2));
      color:#fff;border:none;box-shadow:0 4px 14px -4px var(--accent-glow);}
    .apx-proj-action.apx-primary:hover{filter:brightness(1.08);}
    .apx-proj-action-empty{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--tx-3);
      padding:9px 14px;border-radius:10px;border:1px dashed var(--line);}
    .apx-proj-preview{position:absolute;right:130px;top:50%;width:160px;height:100px;
      border-radius:12px;opacity:0;transform:translateX(12px) rotate(-3deg) scale(.92);
      transform-origin:right center;
      transition:all .35s cubic-bezier(.2,.8,.3,1);pointer-events:none;
      box-shadow:0 16px 40px -10px rgba(0,0,0,.3);
      border:1px solid rgba(255,255,255,.18);margin-top:-50px;display:none;}
    @media (min-width:980px){.apx-proj-preview{display:block;}}
    .apx-proj-preview-noise{position:absolute;inset:0;border-radius:12px;
      background-image:radial-gradient(circle at 2px 2px,rgba(255,255,255,.35) 1px,transparent 1px);
      background-size:12px 12px;opacity:.4;}
    .apx-proj-empty{padding:48px;border-radius:16px;border:1px dashed var(--line);
      text-align:center;color:var(--tx-3);font-family:'JetBrains Mono',monospace;font-size:13.5px;}

    /* ────────────────────────────────────────────────────────────── */
    /* ── EDU / CERTS / TESTIMONIALS (kept compact)               ── */
    /* ────────────────────────────────────────────────────────────── */
    .apx-edu-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
    .apx-edu-card{padding:24px 26px;background:var(--surface);border:1px solid var(--line);
      border-radius:16px;transition:border-color .2s;}
    .apx-edu-card:hover{border-color:var(--line-2);}
    .apx-edu-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;}
    .apx-edu-school{font-size:17px;font-weight:500;letter-spacing:-.005em;}
    .apx-edu-period{font-size:11.5px;font-family:'JetBrains Mono',monospace;color:var(--tx-3);
      padding:3px 9px;border-radius:5px;border:1px solid var(--line);white-space:nowrap;flex-shrink:0;}
    .apx-edu-degree{font-size:14px;color:var(--accent);margin-bottom:6px;}
    .apx-edu-detail{font-size:13.5px;color:var(--tx-2);line-height:1.6;}
    .apx-cert-list{display:flex;flex-direction:column;gap:10px;margin-top:32px;}
    .apx-cert{display:flex;align-items:center;gap:14px;padding:14px 18px;
      background:var(--surface);border:1px solid var(--line);border-radius:12px;transition:all .2s;}
    .apx-cert:hover{border-color:var(--line-2);}
    .apx-cert-mark{width:40px;height:40px;border-radius:9px;display:grid;place-items:center;
      background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#fff;
      flex-shrink:0;font-size:12px;font-family:'JetBrains Mono',monospace;font-weight:600;}
    .apx-cert-body{flex:1;min-width:0;}
    .apx-cert-name{font-size:14px;font-weight:500;}
    .apx-cert-meta{font-size:12px;color:var(--tx-3);font-family:'JetBrains Mono',monospace;margin-top:2px;}

    .apx-test-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;}
    .apx-test{padding:28px 30px;background:var(--surface);border:1px solid var(--line);
      border-radius:18px;transition:border-color .2s;}
    .apx-test:hover{border-color:var(--line-2);}
    .apx-test-quote{font-size:17px;line-height:1.6;color:var(--tx);margin-bottom:18px;
      font-family:'Instrument Serif',serif;font-style:italic;}
    .apx-test-author{display:flex;align-items:center;gap:12px;}
    .apx-test-avatar{width:38px;height:38px;border-radius:50%;
      background:linear-gradient(135deg,var(--accent),var(--accent-2));
      display:grid;place-items:center;color:#fff;font-weight:600;font-size:13px;flex-shrink:0;}
    .apx-test-meta-name{font-size:13.5px;font-weight:500;}
    .apx-test-meta-role{font-size:12px;color:var(--tx-3);font-family:'JetBrains Mono',monospace;}

    /* ────────────────────────────────────────────────────────────── */
    /* ── CONTACT — Centered Statement + Channel Tiles            ── */
    /* ────────────────────────────────────────────────────────────── */
    .apx-contact-canvas{position:relative;padding:24px 0;text-align:center;}
    .apx-contact-canvas::before{content:'';position:absolute;left:50%;top:-40px;
      width:560px;height:560px;border-radius:50%;transform:translateX(-50%);
      background:radial-gradient(circle,var(--accent-glow),transparent 65%);
      pointer-events:none;opacity:.55;}
    .apx-contact-eyebrow{display:inline-flex;align-items:center;gap:8px;
      font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--accent);
      padding:6px 14px;border-radius:999px;background:color-mix(in oklab,var(--accent) 12%,transparent);
      border:1px solid color-mix(in oklab,var(--accent) 28%,transparent);
      margin-bottom:32px;position:relative;}
    .apx-contact-head{font-family:'Instrument Serif',serif;font-size:clamp(40px,7vw,88px);
      line-height:1.02;letter-spacing:-.03em;margin-bottom:24px;position:relative;}
    .apx-contact-head em{font-style:italic;
      background:linear-gradient(135deg,var(--accent),var(--accent-2));
      -webkit-background-clip:text;background-clip:text;color:transparent;}
    .apx-contact-sub{font-size:18px;color:var(--tx-2);line-height:1.65;max-width:580px;
      margin:0 auto 40px;position:relative;}
    .apx-email-pill{display:inline-flex;align-items:center;gap:14px;padding:14px 20px;
      border-radius:14px;background:var(--surface);border:1px solid var(--line);
      font-family:'JetBrains Mono',monospace;font-size:15px;color:var(--tx);
      margin-bottom:48px;position:relative;transition:all .2s;cursor:pointer;}
    .apx-email-pill:hover{border-color:var(--accent);box-shadow:0 10px 28px -10px var(--accent-glow);}
    .apx-email-pill-copy{display:inline-flex;align-items:center;gap:6px;
      padding:6px 12px;border-radius:8px;font-size:12px;color:var(--accent);
      background:color-mix(in oklab,var(--accent) 12%,transparent);
      border:1px solid color-mix(in oklab,var(--accent) 28%,transparent);
      font-family:'JetBrains Mono',monospace;}
    .apx-channels-tile{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;
      max-width:680px;margin:0 auto;position:relative;}
    .apx-channel-tile{padding:22px 16px;border-radius:14px;background:var(--surface);
      border:1px solid var(--line);transition:all .25s;display:flex;flex-direction:column;
      align-items:center;gap:10px;text-align:center;}
    .apx-channel-tile:hover{border-color:var(--accent);transform:translateY(-3px);
      background:var(--surface-2);box-shadow:0 12px 28px -10px var(--accent-glow);}
    .apx-channel-tile-icon{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;
      background:linear-gradient(135deg,
        color-mix(in oklab,var(--accent) 18%,transparent),
        color-mix(in oklab,var(--accent-2) 18%,transparent));
      color:var(--accent);}
    .apx-channel-tile-label{font-size:13px;font-weight:500;color:var(--tx);}
    .apx-channel-tile-sub{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--tx-3);
      max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

    /* ── Footer ── */
    .apx-footer{padding-top:36px;padding-bottom:36px;border-top:1px solid var(--line);
      display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;
      font-size:12.5px;color:var(--tx-3);font-family:'JetBrains Mono',monospace;}
    .apx-footer-socials{display:flex;gap:14px;}
    .apx-footer-socials a{color:var(--tx-3);transition:color .2s;}
    .apx-footer-socials a:hover{color:var(--tx);}

    .apx-more{display:flex;justify-content:center;margin-top:36px;}

    /* ── Responsive ── */
    @media (max-width:1024px){
      .apx-about-layout{grid-template-columns:300px 1fr;gap:48px;}
      .apx-skills-layout{grid-template-columns:260px 1fr;gap:32px;}
      .apx-exp-row{gap:40px;}
      .apx-exp-period{font-size:28px;}
      .apx-channels-tile{grid-template-columns:repeat(4,1fr);}
    }
    @media (max-width:880px){
      .apx-nav-links{display:none;}
      .apx-ham{display:grid;}
      .apx-nav-cta-desktop{display:none !important;}
      .apx-logo-sub{font-size:10.5px;white-space:nowrap;}
      .apx-mobile-menu.apx-open{display:flex;position:absolute;top:64px;left:0;right:0;
        background:var(--bg);border-bottom:1px solid var(--line);
        padding:16px 28px 24px;flex-direction:column;gap:4px;}

      /* About → stacked */
      .apx-about-layout{grid-template-columns:1fr;gap:32px;}
      .apx-about-portrait{position:static;aspect-ratio:5/4;max-height:380px;}
      .apx-about-facts{grid-template-columns:1fr 1fr;}

      /* Skills → stacked */
      .apx-skills-layout{grid-template-columns:1fr;gap:24px;}
      .apx-skill-nav{position:static;flex-direction:row;overflow-x:auto;padding:6px;gap:6px;
        scrollbar-width:none;}
      .apx-skill-nav::-webkit-scrollbar{display:none;}
      .apx-skill-nav-item{flex-shrink:0;padding:10px 14px;}
      .apx-skill-nav-count{display:none;}
      .apx-skill-panel{padding:24px 22px;}
      .apx-mastery-grid{grid-template-columns:1fr;}

      /* Experience → left-only timeline */
      .apx-exp-timeline::before{left:18px;transform:none;}
      .apx-exp-row{grid-template-columns:1fr;gap:14px;margin-bottom:36px;padding-left:48px;}
      .apx-exp-row.apx-right .apx-exp-card,
      .apx-exp-row.apx-left .apx-exp-card{grid-column:1;}
      .apx-exp-row.apx-right .apx-exp-meta,
      .apx-exp-row.apx-left .apx-exp-meta{grid-column:1;text-align:left;order:-1;padding-top:0;}
      .apx-exp-dot{left:18px;top:10px;transform:translateX(-50%);}
      .apx-exp-period{font-size:24px;}

      /* Projects → simplify list */
      .apx-proj-row{grid-template-columns:48px 1fr;gap:16px;padding:24px 16px;}
      .apx-proj-actions{grid-column:1/-1;justify-self:flex-start;margin-top:8px;}
      .apx-proj-num{font-size:24px;}
      .apx-proj-title{font-size:20px;}
      .apx-proj-row:hover{padding-left:24px;}

      /* Edu/Testimonials → single col */
      .apx-edu-grid,.apx-test-grid{grid-template-columns:1fr;}

      /* Contact → tighter */
      .apx-channels-tile{grid-template-columns:repeat(2,1fr);max-width:380px;}
      .apx-email-pill{font-size:13.5px;padding:12px 16px;flex-wrap:wrap;gap:10px;}

      .apx-hero-stats{grid-template-columns:repeat(2,1fr);}
      .apx-stat:nth-child(2){border-right:none;}
      .apx-stat:nth-child(1),.apx-stat:nth-child(2){border-bottom:1px solid var(--line);}
    }
    @media (max-width:520px){
      .apx-section{padding:64px 0;}
      .apx-shell{padding:0 18px;}
      .apx-nav-inner{padding:0 18px;}
      .apx-footer{padding-top:28px;padding-bottom:28px;flex-direction:column;text-align:center;gap:12px;}
      .apx-about-block{grid-template-columns:42px 1fr;gap:14px;padding:18px 0;}
      .apx-about-block-text{font-size:15.5px;}
      .apx-about-block:first-of-type .apx-about-block-text{font-size:16.5px;}
      .apx-about-facts{grid-template-columns:1fr;}
      .apx-exp-card{padding:22px 20px;}
      .apx-exp-role{font-size:18px;}
      .apx-contact-head{font-size:clamp(32px,9vw,52px);}
      .apx-contact-sub{font-size:15px;}
      .apx-channels-tile{grid-template-columns:repeat(2,1fr);}
    }
  `;

  const activeSkill = skillCats[Math.min(activeSkillIdx, skillCats.length - 1)];

  return (
    <div className="apx" ref={revealRef as any}>
      <style suppressHydrationWarning>{CSS}</style>

      {/* ── Nav ── */}
      <nav className={`apx-nav ${scrolled ? 'apx-scrolled' : ''}`}>
        <div className="apx-nav-inner">
          <a href="#" className="apx-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="apx-logo-block">
              <div className="apx-logo-name">{name}</div>
              <div className="apx-logo-sub">
                <span className="apx-logo-sub-dot" />
                {c.availability || 'available for work'}
              </div>
            </div>
          </a>

          <div className="apx-nav-links">
            {navLinks.map(l => (
              <a key={l.id} href={`#${l.id}`} onClick={(e) => scrollTo(e, l.id)} className="apx-nav-link">{l.label}</a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="apx-icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">
              {dark ? <Sun /> : <Moon />}
            </button>
            <a href="#contact" onClick={(e) => scrollTo(e, 'contact')} className="apx-btn-primary apx-nav-cta-desktop" style={{ display: 'inline-flex' }}>
              Get in touch
            </a>
            <button className="apx-icon-btn apx-ham" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen
                ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>}
            </button>
          </div>
        </div>
        <div className={`apx-mobile-menu ${menuOpen ? 'apx-open' : ''}`}>
          {navLinks.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={(e) => scrollTo(e, l.id)} className="apx-nav-link" style={{ padding: '12px 14px', fontSize: 15 }}>{l.label}</a>
          ))}
          <a href="#contact" onClick={(e) => scrollTo(e, 'contact')} className="apx-btn-primary" style={{ marginTop: 10, justifyContent: 'center' }}>
            Get in touch <Arrow s={13} />
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="apx-hero">
        <div className="apx-hero-grid-bg" />
        <div className="apx-hero-orb" />
        <div className="apx-hero-orb-2" />
        <div className="apx-shell" style={{ position: 'relative' }}>
          <h1 className="apx-hero-title apx-reveal">
            <span style={{ display: 'block' }} className="apx-serif">{c.heroPrefix || 'Hi, I’m'}</span>
            <span className="apx-gradient" style={{ display: 'block' }}>{name}</span>
          </h1>
          <div className="apx-hero-role apx-serif apx-reveal" style={{ fontStyle: 'italic' }}>
            {c.title || 'Software Engineer & Builder'}
          </div>
          <p className="apx-hero-sub apx-reveal">
            {c.subtitle || 'I design and build refined web products — from first prototype to production-grade interfaces. Crafting work that feels considered, fast, and human.'}
          </p>
          <div className="apx-hero-ctas apx-reveal">
            <a href="#projects" onClick={(e) => scrollTo(e, 'projects')} className="apx-btn-primary">
              View my work <Arrow />
            </a>
            <a href="#contact" onClick={(e) => scrollTo(e, 'contact')} className="apx-btn-ghost">
              Get in touch
            </a>
            {c.resumeUrl && (
              <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer" className="apx-btn-ghost">
                Resume (PDF)
              </a>
            )}
          </div>
          <div className="apx-hero-socials apx-reveal">
            {c.githubUrl && <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="apx-icon-btn"><Github s={16} /></a>}
            {c.linkedinUrl && <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="apx-icon-btn"><Linkedin s={16} /></a>}
            {c.twitterUrl && <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer" className="apx-icon-btn"><X s={14} /></a>}
            {c.contactEmail && <a href={`mailto:${c.contactEmail}`} className="apx-icon-btn"><Mail s={16} /></a>}
          </div>

          {stats.length > 0 && (
            <div className="apx-hero-stats apx-reveal">
              {stats.map((s, i) => (
                <div key={i} className="apx-stat">
                  <div className="apx-stat-num">{s.num || '—'}</div>
                  <div className="apx-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT — Editorial ── */}
      <section id="about" className="apx-section">
        <div className="apx-shell">
          <div className="apx-about-layout">
            {/* Left: portrait */}
            <div className="apx-about-portrait apx-reveal">
              {c.photoUrl
                ? <img src={c.photoUrl} alt={name} />
                : <div className="apx-about-portrait-fallback">{initials}</div>
              }
              <div className="apx-about-portrait-meta">
                <div className="apx-about-portrait-name">{name}</div>
                {(c.location || c.timezone) && (
                  <div className="apx-about-portrait-loc">{[c.location, c.timezone].filter(Boolean).join(' · ')}</div>
                )}
              </div>
            </div>

            {/* Right: text */}
            <div className="apx-about-text">
              <div className="apx-about-tag apx-reveal">{c.aboutTag || '01 / About'}</div>
              <h2 className="apx-about-headline apx-reveal">
                {c.aboutHeading || (<>A short story <em>so far.</em></>)}
              </h2>

              <div className="apx-about-blocks apx-reveal">
                {aboutParas.map((p, i) => (
                  <div key={i} className="apx-about-block">
                    <div className="apx-about-block-num">/{String(i + 1).padStart(2, '0')}</div>
                    <div className="apx-about-block-text">{p}</div>
                  </div>
                ))}
              </div>

              {aboutFacts.length > 0 && (
                <div className="apx-about-facts apx-reveal">
                  {aboutFacts.map((f, i) => (
                    <div key={i} className="apx-fact">
                      <div className="apx-fact-label">{f.label}</div>
                      <div className="apx-fact-value">{f.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS — Inspector ── */}
      <section id="skills" className="apx-section apx-alt">
        <div className="apx-shell">
          <div className="apx-sec-head apx-reveal">
            <span className="apx-sec-tag"><Sparkle s={11} /> {c.skillsTag || '02 / Skills'}</span>
            <div className="apx-sec-line" />
          </div>
          <h2 className="apx-sec-title apx-reveal">{c.skillsHeading || (<>What I <em>work with.</em></>)}</h2>
          {c.skillsSub && <p className="apx-sec-sub apx-reveal">{c.skillsSub}</p>}

          <div className="apx-skills-layout">
            {/* Left: category nav */}
            <div className="apx-skill-nav apx-reveal">
              {skillCats.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSkillIdx(i)}
                  className={`apx-skill-nav-item ${i === activeSkillIdx ? 'apx-active' : ''}`}
                >
                  <span className="apx-skill-nav-idx">/{String(i + 1).padStart(2, '0')}</span>
                  <span className="apx-skill-nav-title">{cat.title}</span>
                  <span className="apx-skill-nav-count">{cat.items.length}</span>
                </button>
              ))}
            </div>

            {/* Right: active panel */}
            <div className="apx-skill-panel apx-reveal">
              <div className="apx-skill-panel-head">
                <span className="apx-skill-panel-title">{activeSkill?.title || 'Skills'}</span>
                <span className="apx-skill-panel-meta">{activeSkill?.items.length || 0} tools</span>
              </div>
              <div className="apx-skill-tags" key={activeSkillIdx}>
                {(activeSkill?.items || []).map((s, j) => (
                  <span key={j} className="apx-skill-tag" style={{ animationDelay: `${j * 30}ms` }}>
                    {s}
                  </span>
                ))}
              </div>

              {profs.length > 0 && (
                <div className="apx-skill-mastery">
                  <div className="apx-skill-mastery-head">Core mastery</div>
                  <div className="apx-mastery-grid">
                    {profs.map((p, i) => {
                      const lvl = Math.max(1, Math.min(5, Number(p.level) || 3));
                      const labels = ['Beginner', 'Familiar', 'Working', 'Proficient', 'Expert'];
                      return (
                        <div key={i} className="apx-mastery-row">
                          <div className="apx-mastery-top">
                            <span className="apx-mastery-name">{p.name}</span>
                            <span className="apx-mastery-level">{labels[lvl - 1]}</span>
                          </div>
                          <div className="apx-mastery-blocks">
                            {[1, 2, 3, 4, 5].map(b => (
                              <span key={b} className={b <= lvl ? 'apx-on' : ''} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {learning.length > 0 && (
            <div className="apx-learning-strip apx-reveal">
              <div className="apx-learning-track">
                <span className="apx-learning-prefix">Currently learning</span>
                {[...learning, ...learning].map((s, i) => (
                  <span key={i} className="apx-learning-chip">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── EXPERIENCE — Vertical Center Timeline ── */}
      {experiences.length > 0 && (
        <section id="experience" className="apx-section">
          <div className="apx-shell">
            <div className="apx-sec-head apx-reveal">
              <span className="apx-sec-tag"><Sparkle s={11} /> {c.expTag || '03 / Experience'}</span>
              <div className="apx-sec-line" />
            </div>
            <h2 className="apx-sec-title apx-reveal">{c.expHeading || (<>Where I’ve <em>done the work.</em></>)}</h2>

            <div className="apx-exp-timeline">
              {(showAllExp ? experiences : experiences.slice(0, EXP_LIMIT)).map((job, i) => {
                const side = i % 2 === 0 ? 'apx-right' : 'apx-left';
                return (
                  <div key={i} className={`apx-exp-row ${side} apx-reveal`}>
                    <div className={`apx-exp-dot ${job.isCurrent ? 'apx-current' : ''}`} />
                    <div className="apx-exp-meta">
                      {job.isCurrent && (
                        <div className="apx-exp-now"><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} />{job.nowLabel || 'Present'}</div>
                      )}
                      <div className="apx-exp-period">{job.period?.split(' ')[0] || job.period}</div>
                      <div className="apx-exp-dates">{job.period}{job.duration ? ` · ${job.duration}` : ''}</div>
                    </div>
                    <div className="apx-exp-card">
                      <div className="apx-exp-role">{job.role}</div>
                      <div className="apx-exp-company">{job.company}</div>
                      {job.summary && <p className="apx-exp-summary">{job.summary}</p>}
                      {job.bullets.length > 0 && (
                        <div className="apx-exp-bullets">
                          {job.bullets.slice(0, 4).map((b, j) => <div key={j} className="apx-exp-bullet">{b}</div>)}
                        </div>
                      )}
                      {job.stack.length > 0 && (
                        <div className="apx-exp-stack">
                          {job.stack.map((t, j) => <span key={j} className="apx-exp-stack-pill">{t}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {experiences.length > EXP_LIMIT && (
              <div className="apx-more">
                <button onClick={() => setShowAllExp(s => !s)} className="apx-btn-ghost">
                  {showAllExp ? 'Show less ↑' : `Show ${experiences.length - EXP_LIMIT} more ↓`}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── PROJECTS — Editorial List ── */}
      <section id="projects" className="apx-section apx-alt">
        <div className="apx-shell">
          <div className="apx-sec-head apx-reveal">
            <span className="apx-sec-tag"><Sparkle s={11} /> {c.projTag || '04 / Selected work'}</span>
            <div className="apx-sec-line" />
          </div>
          <h2 className="apx-sec-title apx-reveal">{c.projHeading || (<>Things I’ve <em>built.</em></>)}</h2>
          {c.projSub && <p className="apx-sec-sub apx-reveal">{c.projSub}</p>}

          <div className="apx-proj-list">
            {projects.length > 0 ? (showAllProj ? projects : projects.slice(0, PROJ_LIMIT)).map((p, i) => (
              <div key={i} className="apx-proj-row apx-reveal">
                <div className="apx-proj-num">/{String(i + 1).padStart(2, '0')}</div>
                <div className="apx-proj-body">
                  <div className="apx-proj-row-top">
                    <span className="apx-proj-title">{p.title}</span>
                    {p.tag && <span className="apx-proj-tag">{p.tag}</span>}
                  </div>
                  {p.desc && <p className="apx-proj-desc">{p.desc}</p>}
                  {p.stack.length > 0 && (
                    <div className="apx-proj-row-meta">
                      <div className="apx-proj-stack-inline">
                        {p.stack.map((s, j) => <span key={j} className="apx-proj-stack-pill">{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="apx-proj-actions">
                  {p.liveUrl && p.liveUrl !== '#' && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="apx-proj-action apx-primary">
                      Visit project <Arrow s={13} />
                    </a>
                  )}
                  {p.githubUrl && p.githubUrl !== '#' && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="apx-proj-action">
                      <Github s={14} /> Source
                    </a>
                  )}
                  {(!p.liveUrl || p.liveUrl === '#') && (!p.githubUrl || p.githubUrl === '#') && (
                    <span className="apx-proj-action-empty">Coming soon</span>
                  )}
                </div>
                <div className="apx-proj-preview" style={{ background: p.gradient }}>
                  <div className="apx-proj-preview-noise" />
                </div>
              </div>
            )) : (
              <div className="apx-proj-empty">Add your projects above to showcase them here</div>
            )}
          </div>

          {projects.length > PROJ_LIMIT && (
            <div className="apx-more">
              <button onClick={() => setShowAllProj(s => !s)} className="apx-btn-ghost">
                {showAllProj ? 'Show less ↑' : `Show ${projects.length - PROJ_LIMIT} more ↓`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Education + Certifications ── */}
      {(education.length > 0 || certs.length > 0) && (
        <section id="education" className="apx-section">
          <div className="apx-shell">
            <div className="apx-sec-head apx-reveal">
              <span className="apx-sec-tag"><Sparkle s={11} /> {c.eduTag || '05 / Background'}</span>
              <div className="apx-sec-line" />
            </div>
            <h2 className="apx-sec-title apx-reveal">{c.eduHeading || (<>Education & <em>Certifications.</em></>)}</h2>

            {education.length > 0 && (
              <div className="apx-edu-grid">
                {education.map((e, i) => (
                  <div key={i} className="apx-edu-card apx-reveal">
                    <div className="apx-edu-head">
                      <div className="apx-edu-school">{e.school}</div>
                      {e.period && <span className="apx-edu-period">{e.period}</span>}
                    </div>
                    {e.degree && <div className="apx-edu-degree">{e.degree}</div>}
                    {e.detail && <div className="apx-edu-detail">{e.detail}</div>}
                  </div>
                ))}
              </div>
            )}

            {certs.length > 0 && (
              <div className="apx-cert-list">
                {certs.map((cert, i) => {
                  const inner = (
                    <>
                      <div className="apx-cert-mark">{(cert.issuer || 'C').slice(0, 2).toUpperCase()}</div>
                      <div className="apx-cert-body">
                        <div className="apx-cert-name">{cert.name}</div>
                        <div className="apx-cert-meta">{[cert.issuer, cert.year].filter(Boolean).join(' · ')}</div>
                      </div>
                      {cert.url && <Arrow s={14} />}
                    </>
                  );
                  return cert.url
                    ? <a key={i} href={cert.url} target="_blank" rel="noopener noreferrer" className="apx-cert apx-reveal">{inner}</a>
                    : <div key={i} className="apx-cert apx-reveal">{inner}</div>;
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <section className="apx-section apx-alt">
          <div className="apx-shell">
            <div className="apx-sec-head apx-reveal">
              <span className="apx-sec-tag"><Sparkle s={11} /> {c.testTag || '06 / Kind words'}</span>
              <div className="apx-sec-line" />
            </div>
            <h2 className="apx-sec-title apx-reveal">{c.testHeading || (<>What people <em>say.</em></>)}</h2>

            <div className="apx-test-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="apx-test apx-reveal">
                  <p className="apx-test-quote">“{t.quote}”</p>
                  <div className="apx-test-author">
                    <div className="apx-test-avatar">{(t.author || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</div>
                    <div>
                      <div className="apx-test-meta-name">{t.author}</div>
                      <div className="apx-test-meta-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT — Centered Statement ── */}
      <section id="contact" className="apx-section">
        <div className="apx-shell">
          <div className="apx-contact-canvas apx-reveal">
            <div className="apx-contact-eyebrow">
              <Sparkle s={11} />
              {c.contactTag || '07 / Contact'}
            </div>
            <h2 className="apx-contact-head">
              {c.contactHeadline || (<>Let’s build something <em>worth shipping.</em></>)}
            </h2>
            <p className="apx-contact-sub">
              {c.contactSub || 'I’m always open to interesting conversations — collaborations, freelance work, or just trading notes on craft.'}
            </p>

            {c.contactEmail && (
              <button className="apx-email-pill" onClick={copyEmail}>
                <Mail s={16} />
                <span>{c.contactEmail}</span>
                <span className="apx-email-pill-copy">
                  {emailCopied ? <><Check s={12} /> Copied</> : <><Copy s={12} /> Copy</>}
                </span>
              </button>
            )}

            <div className="apx-channels-tile">
              {[
                { label: 'Email', sub: c.contactEmail, href: c.contactEmail ? `mailto:${c.contactEmail}` : '', icon: <Mail s={20} /> },
                { label: 'GitHub', sub: c.githubUrl?.replace(/^https?:\/\//, ''), href: c.githubUrl, icon: <Github s={20} /> },
                { label: 'LinkedIn', sub: c.linkedinUrl?.replace(/^https?:\/\//, ''), href: c.linkedinUrl, icon: <Linkedin s={20} /> },
                { label: 'Twitter / X', sub: c.twitterUrl?.replace(/^https?:\/\//, ''), href: c.twitterUrl, icon: <X s={18} /> },
              ].filter(ch => ch.sub).map((ch, i) => (
                <a key={i} href={ch.href} target={ch.href?.startsWith('http') ? '_blank' : undefined} rel={ch.href?.startsWith('http') ? 'noopener noreferrer' : undefined} className="apx-channel-tile">
                  <div className="apx-channel-tile-icon">{ch.icon}</div>
                  <div className="apx-channel-tile-label">{ch.label}</div>
                  <div className="apx-channel-tile-sub">{ch.sub}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="apx-shell apx-footer">
          <span>{hideBranding ? name : `${name} · Built with FolioForge`}</span>
          <div className="apx-footer-socials">
            {c.githubUrl && <a href={c.githubUrl} target="_blank" rel="noopener noreferrer"><Github s={16} /></a>}
            {c.linkedinUrl && <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin s={16} /></a>}
            {c.twitterUrl && <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer"><X s={14} /></a>}
          </div>
        </div>
      </footer>
    </div>
  );
}
