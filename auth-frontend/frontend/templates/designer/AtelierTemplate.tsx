'use client';

import { useState, useEffect } from 'react';

interface Props {
  content: Record<string, string>;
  username: string;
}

function parseJ<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}
function pl(v?: string): string[] {
  return v ? v.split(',').map(s => s.trim()).filter(Boolean) : [];
}

// Hardcoded Atelier typography — editorial serif display + clean sans body + mono captions.
const ATELIER_FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

// ── SVG Icons ──
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
  </svg>
);
const BehanceIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M7.5 4.5H2v15h6c2.8 0 4.5-1.5 4.5-4 0-1.7-.9-3-2.4-3.5 1.1-.5 1.8-1.6 1.8-3 0-2.6-1.6-4.5-4.4-4.5zm-.3 6.2H4.5V7h2.7c1.2 0 1.9.7 1.9 1.8 0 1.2-.7 1.9-1.9 1.9zm.5 6.3H4.5v-4h3.2c1.5 0 2.3.7 2.3 2 0 1.3-.8 2-2.3 2zm14.3-2.5c0-2.5-1.4-4.5-4.3-4.5s-4.5 2-4.5 4.5 1.6 4.5 4.5 4.5c2.2 0 3.7-1 4.2-2.7h-2.2c-.3.6-.9 1-1.9 1-1.3 0-2-.8-2.1-2.1h6.3c.1-.2 0-.4 0-.7zm-6.2-1c.2-1.1.9-1.7 2-1.7s1.8.7 1.9 1.7H15.8zM14.5 6h5v1.5h-5V6z"/>
  </svg>
);
const DribbbleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72M5 8.5c5.45 1.85 11 1.55 16-.5M3 17.5c5 0 9-1 14-4"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const ArrowOutIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M7 17L17 7M9 7h8v8"/>
  </svg>
);
const SunIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4L4.2 19.8M19.8 4.2l-1.4 1.4"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
  </svg>
);

const PROJECT_VISUALS = [
  'linear-gradient(135deg, #d4856b, #8a3a25)',
  'linear-gradient(160deg, #2c3531, #6b8e7f)',
  'linear-gradient(120deg, #e8d4b8, #b09872)',
  'linear-gradient(140deg, #4a5d6e, #2b3a47)',
  'linear-gradient(110deg, #c89bab, #8a5a6e)',
  'linear-gradient(150deg, #d5c5a8, #8a7a5c)',
];

interface WorkItem { title: string; category: string; year: string; role: string; description: string; image: string; liveUrl: string; }
interface DiscItem { number: string; title: string; description: string; items: string; }
interface ProcItem { number: string; title: string; description: string; }
interface PressItem { publication: string; item: string; year: string; url: string; }
interface ClientItem { name: string; }
interface TestItem { quote: string; author: string; role: string; company: string; }

export default function AtelierTemplate({ content }: Props) {
  const c = content;
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeWorkIdx, setActiveWorkIdx] = useState<number>(0);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.atl-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('atl-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const name = c.name || 'Your Name';
  const works = parseJ<WorkItem[]>(c.workJson, []);
  const disciplines = parseJ<DiscItem[]>(c.discJson, []);
  const process = parseJ<ProcItem[]>(c.procJson, []);
  const press = parseJ<PressItem[]>(c.pressJson, []);
  const clients = parseJ<ClientItem[]>(c.clientsJson, []);
  const tests = parseJ<TestItem[]>(c.testimonialsJson, []);

  // Theme colour vars
  const bg = dark ? '#0f0c08' : (c.colorBg || '#f5f0e8');
  const bgElev = dark ? '#1a1611' : (c.colorBgElev || '#eee6d8');
  const bgCard = dark ? '#221d16' : (c.colorBgCard || '#ffffff');
  const fg = dark ? '#f5efe2' : (c.colorFg || '#0d0d0d');
  const fgMuted = dark ? '#bdb3a1' : (c.colorFgMuted || '#4a4a48');
  const fgFaint = dark ? '#8a8275' : (c.colorFgFaint || '#8a8a85');
  const line = dark ? '#2e2820' : (c.colorLine || '#d8d2c4');
  const lineStrong = dark ? '#4a4234' : (c.colorLineStrong || '#b9b2a2');
  const accent = c.colorAccent || '#b8503a';
  const accentSoft = dark ? '#3a1f17' : (c.colorAccentSoft || '#f4d9cf');

  const css = `
    .atl-root {
      --bg: ${bg}; --bg-elev: ${bgElev}; --bg-card: ${bgCard};
      --fg: ${fg}; --fg-muted: ${fgMuted}; --fg-faint: ${fgFaint};
      --line: ${line}; --line-strong: ${lineStrong};
      --accent: ${accent}; --accent-soft: ${accentSoft};
      --f-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
      --f-body: 'Inter', system-ui, -apple-system, sans-serif;
      --f-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
      background: var(--bg);
      color: var(--fg);
      font-family: var(--f-body);
      min-height: 100vh;
      transition: background 0.4s ease, color 0.4s ease;
    }
    .atl-root *, .atl-root *::before, .atl-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .atl-root :where(a) { color: inherit; text-decoration: none; }

    .atl-reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .atl-reveal.atl-in { opacity: 1; transform: none; }

    @keyframes atl-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }
    .atl-dot { animation: atl-pulse 2.4s ease-in-out infinite; }

    @keyframes atl-marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }

    .atl-shell { max-width: 1240px; margin: 0 auto; padding: 0 40px; }

    .atl-display { font-family: var(--f-display); letter-spacing: -0.025em; }
    .atl-mono { font-family: var(--f-mono); letter-spacing: 0.04em; text-transform: uppercase; font-size: 11px; }

    /* Nav */
    .atl-nav {
      position: sticky; top: 0; z-index: 50;
      backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
      background: color-mix(in srgb, var(--bg) 80%, transparent);
      border-bottom: 1px solid transparent;
      transition: border-color 0.3s ease, padding 0.3s ease;
    }
    .atl-nav.scrolled { border-bottom-color: var(--line); }
    .atl-nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-top: 22px; padding-bottom: 22px; }
    .atl-nav-name { font-family: var(--f-display); font-size: 22px; font-weight: 500; letter-spacing: -0.01em; }
    .atl-nav-name em { font-style: italic; color: var(--accent); }
    .atl-nav-links { display: flex; align-items: center; gap: 6px; }
    .atl-nav-link {
      padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 500;
      color: var(--fg-muted); transition: color 0.2s ease, background 0.2s ease;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .atl-nav-link:hover { color: var(--fg); background: var(--bg-elev); }
    .atl-nav-num { font-family: var(--f-mono); font-size: 10px; color: var(--fg-faint); letter-spacing: 0.05em; }
    .atl-nav-cta {
      margin-left: 6px; padding: 9px 18px; border-radius: 999px;
      background: var(--fg); color: var(--bg); font-size: 13px; font-weight: 500;
      transition: opacity 0.2s ease; white-space: nowrap;
    }
    .atl-nav-cta:hover { opacity: 0.85; }
    .atl-icon-btn {
      width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--line);
      background: var(--bg-elev); color: var(--fg-muted);
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      transition: border-color 0.2s ease, color 0.2s ease;
    }
    .atl-icon-btn:hover { border-color: var(--line-strong); color: var(--fg); }
    .atl-mobile-toggle { display: none; }

    /* Section header */
    .atl-section-head { display: flex; align-items: center; gap: 18px; margin-bottom: 14px; }
    .atl-section-head .atl-mono { color: var(--fg-faint); white-space: nowrap; }
    .atl-section-head-line { flex: 1; height: 1px; background: var(--line); }
    .atl-section-title {
      font-family: var(--f-display); font-size: clamp(36px, 5.5vw, 72px);
      font-weight: 500; line-height: 1.05; letter-spacing: -0.03em;
      margin-bottom: 56px; max-width: 22ch;
    }
    .atl-section-title em { font-style: italic; color: var(--accent); }
    .atl-section-sub { font-size: 16px; color: var(--fg-muted); max-width: 50ch; line-height: 1.55; margin-bottom: 64px; margin-top: -36px; }

    /* Hero — Magazine Masthead */
    .atl-hero { padding: 32px 0 90px; position: relative; overflow: hidden; }
    .atl-hero-dateline {
      display: grid; grid-template-columns: 1fr 1fr 1fr;
      padding-bottom: 14px; border-bottom: 2px solid var(--fg);
      margin-bottom: 80px;
      font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--fg-muted);
    }
    .atl-hero-dateline > :nth-child(2) { text-align: center; }
    .atl-hero-dateline > :nth-child(3) { text-align: right; }
    .atl-hero-dateline strong { color: var(--fg); font-weight: 600; letter-spacing: 0.12em; }

    .atl-hero-stage {
      display: grid; grid-template-columns: minmax(0, 1fr) 280px;
      gap: 60px; align-items: end;
    }
    .atl-hero-headline {
      font-family: var(--f-display); line-height: 0.84;
      letter-spacing: -0.05em; font-weight: 500;
    }
    .atl-hero-headline-first {
      font-size: clamp(72px, 14vw, 232px); display: block;
    }
    .atl-hero-headline-last {
      font-size: clamp(56px, 11vw, 180px); display: block;
      font-style: italic; color: var(--accent);
      margin-top: -8px; margin-left: 6%;
    }

    .atl-hero-side { display: flex; flex-direction: column; gap: 14px; }
    .atl-hero-portrait-mini {
      aspect-ratio: 3 / 4; border-radius: 4px; overflow: hidden;
      background: linear-gradient(160deg, var(--accent-soft), var(--bg-elev));
      position: relative; border: 1px solid var(--line);
    }
    .atl-hero-portrait-mini img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .atl-hero-portrait-mini-init {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      font-family: var(--f-display); font-size: 84px; font-weight: 500;
      color: rgba(255,255,255,0.55); font-style: italic;
    }
    .atl-hero-portrait-frame {
      position: absolute; inset: 8px; border: 1px solid rgba(255,255,255,0.5);
      pointer-events: none;
    }
    .atl-hero-portrait-caption {
      font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--fg-faint); text-align: center;
      padding-top: 4px;
    }
    .atl-hero-portrait-caption strong { color: var(--fg); font-weight: 600; }

    .atl-hero-meta-row {
      display: grid; grid-template-columns: 0.9fr 2fr 1fr;
      gap: 56px; margin-top: 64px;
      border-top: 1px solid var(--line); padding-top: 36px;
      align-items: start;
    }
    .atl-hero-role-tag {
      font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--accent);
    }
    .atl-hero-role-tag div { color: var(--fg-faint); margin-top: 6px; font-size: 10px; }
    .atl-hero-statement {
      font-family: var(--f-display); font-style: italic;
      font-size: clamp(20px, 2.2vw, 30px); line-height: 1.32;
      color: var(--fg); letter-spacing: -0.015em;
    }
    .atl-hero-statement span.q { color: var(--accent); display: inline-block; transform: translateY(2px); }
    .atl-hero-quick {
      display: flex; flex-direction: column; gap: 10px; align-items: flex-end;
    }
    .atl-hero-quick a {
      font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--fg);
      display: inline-flex; align-items: center; gap: 6px;
      border-bottom: 1px solid var(--fg); padding-bottom: 2px;
      transition: color 0.2s ease, border-color 0.2s ease;
    }
    .atl-hero-quick a:hover { color: var(--accent); border-color: var(--accent); }

    .atl-hero-stats-strip {
      display: grid; grid-template-columns: auto repeat(4, 1fr);
      gap: 24px; align-items: baseline;
      margin-top: 56px;
      padding: 24px 0;
      border-top: 1px solid var(--fg);
      border-bottom: 1px solid var(--line);
    }
    .atl-hero-stats-strip.no-label { grid-template-columns: repeat(4, 1fr); }
    .atl-hero-stats-label {
      font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--fg-faint);
      white-space: nowrap;
    }
    .atl-hero-stats-label strong { color: var(--fg); font-weight: 600; display: block; }
    .atl-hero-stat-item {
      display: flex; flex-direction: column; gap: 4px;
      border-left: 1px solid var(--line); padding-left: 18px;
    }
    .atl-hero-stat-num {
      font-family: var(--f-display); font-size: clamp(28px, 3.4vw, 44px);
      line-height: 1; font-weight: 500; letter-spacing: -0.02em;
    }
    .atl-hero-stat-label {
      font-family: var(--f-mono); font-size: 9.5px; letter-spacing: 0.08em;
      color: var(--fg-faint); text-transform: uppercase;
    }

    /* About — Editorial Spread with Drop Cap */
    .atl-about { padding: 130px 0; border-top: 1px solid var(--line); background: var(--bg-elev); }
    .atl-about-layout {
      display: grid; grid-template-columns: 1.6fr 1fr;
      gap: 96px; align-items: start;
    }
    .atl-about-body {
      font-size: 18px; line-height: 1.7; color: var(--fg-muted);
    }
    .atl-about-body p { margin-bottom: 28px; }
    .atl-about-body p:first-of-type::first-letter {
      font-family: var(--f-display); font-size: 112px;
      font-weight: 500; line-height: 0.85; font-style: italic;
      float: left; margin: 8px 14px -4px 0;
      color: var(--accent);
    }
    .atl-about-body p:first-of-type {
      font-size: 19px; line-height: 1.65; color: var(--fg);
    }
    .atl-about-quote-spread {
      font-family: var(--f-display); font-style: italic;
      font-size: clamp(26px, 3vw, 42px); line-height: 1.22;
      color: var(--fg); text-align: center; letter-spacing: -0.02em;
      margin: 12px 0; padding: 44px 0;
      border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
      position: relative;
    }
    .atl-about-quote-spread::before, .atl-about-quote-spread::after {
      content: ''; position: absolute; left: 50%;
      width: 11px; height: 11px; border-radius: 50%;
      background: var(--accent);
      transform: translateX(-50%);
    }
    .atl-about-quote-spread::before { top: -6px; }
    .atl-about-quote-spread::after { bottom: -6px; }
    .atl-about-quote-spread span.q {
      color: var(--accent); display: inline-block;
      font-size: 1.4em; line-height: 0; vertical-align: -0.25em;
    }

    .atl-about-sidebar {
      position: sticky; top: 110px;
      display: flex; flex-direction: column; gap: 18px;
    }
    .atl-about-portrait-sm {
      aspect-ratio: 4 / 5; border-radius: 4px; overflow: hidden;
      background: linear-gradient(165deg, var(--accent-soft), var(--bg-elev));
      border: 1px solid var(--line); position: relative;
    }
    .atl-about-portrait-sm img { width: 100%; height: 100%; object-fit: cover; }
    .atl-about-portrait-sm-init {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      font-family: var(--f-display); font-size: 88px; font-style: italic;
      color: rgba(255,255,255,0.55);
    }
    .atl-about-portrait-cap {
      position: absolute; bottom: 12px; left: 12px; right: 12px;
      font-family: var(--f-mono); font-size: 9.5px; letter-spacing: 0.08em;
      text-transform: uppercase; color: #fff;
      background: rgba(0,0,0,0.55); padding: 8px 12px; border-radius: 2px;
      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    }
    .atl-about-portrait-cap strong { font-weight: 600; }
    .atl-about-portrait-cap-sub { opacity: 0.75; margin-top: 2px; }

    .atl-about-colophon {
      background: var(--bg-card); border: 1px solid var(--line);
      padding: 24px; border-radius: 4px;
    }
    .atl-about-colophon-title {
      font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--fg-faint);
      border-bottom: 1px solid var(--line); padding-bottom: 12px; margin-bottom: 14px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .atl-about-colophon-title em {
      font-family: var(--f-display); font-style: italic; text-transform: none;
      color: var(--accent); letter-spacing: -0.01em; font-size: 13px;
    }
    .atl-footnote-row {
      display: grid; grid-template-columns: 24px 1fr;
      gap: 14px; padding: 12px 0;
      border-bottom: 1px dashed var(--line);
    }
    .atl-footnote-row:last-child { border-bottom: none; padding-bottom: 0; }
    .atl-footnote-num {
      font-family: var(--f-display); font-size: 17px; font-style: italic;
      color: var(--accent); line-height: 1.1; font-weight: 500;
    }
    .atl-footnote-label {
      font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--fg-faint); margin-bottom: 3px;
    }
    .atl-footnote-value {
      font-size: 13.5px; color: var(--fg); line-height: 1.4;
    }

    /* Work — Index + Preview Reader */
    .atl-work { padding: 130px 0; border-top: 1px solid var(--line); }
    .atl-work-stage {
      display: grid; grid-template-columns: 0.85fr 1.15fr;
      gap: 64px; align-items: start;
    }

    /* Index list */
    .atl-work-index { display: flex; flex-direction: column; }
    .atl-work-index-row {
      display: grid; grid-template-columns: 36px 1fr 64px 16px;
      gap: 18px; align-items: center;
      padding: 20px 14px 20px 6px;
      margin-left: -6px; margin-right: -14px;
      border-bottom: 1px solid var(--line);
      cursor: pointer; position: relative;
      transition: padding 0.3s ease, background 0.25s ease;
      border-radius: 4px;
    }
    .atl-work-index-row:first-child { border-top: 1px solid var(--line); }
    .atl-work-index-row:hover { padding-left: 14px; }
    .atl-work-index-row.active {
      background: color-mix(in srgb, var(--accent-soft) 60%, transparent);
      padding-left: 14px;
    }
    .atl-work-index-num {
      font-family: var(--f-mono); font-size: 11px;
      color: var(--fg-faint); letter-spacing: 0.05em;
    }
    .atl-work-index-row.active .atl-work-index-num { color: var(--accent); }
    .atl-work-index-info { min-width: 0; }
    .atl-work-index-title {
      font-family: var(--f-display); font-size: clamp(20px, 1.7vw, 24px);
      font-weight: 500; letter-spacing: -0.015em; line-height: 1.15;
    }
    .atl-work-index-cat {
      font-family: var(--f-mono); font-size: 10px;
      letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--fg-faint); margin-top: 5px;
    }
    .atl-work-index-year {
      font-family: var(--f-mono); font-size: 11px;
      color: var(--fg-faint); letter-spacing: 0.05em; text-align: right;
    }
    .atl-work-index-arrow {
      color: var(--fg-faint); display: flex;
      opacity: 0; transform: translateX(-4px);
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .atl-work-index-row:hover .atl-work-index-arrow,
    .atl-work-index-row.active .atl-work-index-arrow {
      opacity: 1; transform: translateX(0); color: var(--accent);
    }

    /* Preview panel (sticky) */
    .atl-work-preview {
      position: sticky; top: 110px;
      display: flex; flex-direction: column; gap: 24px;
    }
    .atl-work-preview-visual {
      aspect-ratio: 5 / 4; border-radius: 6px; overflow: hidden;
      background: var(--bg-card); border: 1px solid var(--line);
      position: relative;
    }
    .atl-work-preview-visual img {
      width: 100%; height: 100%; object-fit: cover; display: block;
      animation: atl-fade-in 0.5s ease;
    }
    @keyframes atl-fade-in {
      from { opacity: 0; transform: scale(1.02); }
      to { opacity: 1; transform: none; }
    }
    .atl-work-preview-placeholder {
      width: 100%; height: 100%;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 14px; padding: 32px; text-align: center;
      animation: atl-fade-in 0.5s ease;
    }
    .atl-work-preview-placeholder-cat {
      font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.1em;
      text-transform: uppercase; color: rgba(255,255,255,0.7);
    }
    .atl-work-preview-placeholder-title {
      font-family: var(--f-display); font-size: clamp(36px, 4vw, 60px);
      font-weight: 500; letter-spacing: -0.03em;
      color: rgba(255,255,255,0.95); line-height: 1.05;
    }
    .atl-work-preview-stamp {
      position: absolute; top: 16px; left: 16px;
      padding: 7px 14px; border-radius: 4px; background: rgba(255,255,255,0.95);
      font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.08em;
      text-transform: uppercase; color: #0d0d0d;
    }
    .atl-work-preview-corner {
      position: absolute; bottom: 16px; right: 16px;
      padding: 6px 12px; border-radius: 4px; background: rgba(0,0,0,0.55);
      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
      font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.06em;
      text-transform: uppercase; color: #fff;
    }

    .atl-work-preview-meta { display: flex; flex-direction: column; gap: 14px; }
    .atl-work-preview-title {
      font-family: var(--f-display); font-size: clamp(32px, 3.6vw, 52px);
      font-weight: 500; letter-spacing: -0.03em; line-height: 1.02;
    }
    .atl-work-preview-title em { font-style: italic; color: var(--accent); }
    .atl-work-preview-rows {
      display: grid; grid-template-columns: 90px 1fr;
      gap: 10px 18px;
      border-top: 1px solid var(--line);
      padding-top: 16px;
    }
    .atl-work-preview-row-label {
      font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--fg-faint);
      padding-top: 1px;
    }
    .atl-work-preview-row-value {
      font-size: 14px; color: var(--fg); line-height: 1.5;
    }
    .atl-work-preview-link {
      display: inline-flex; align-items: center; gap: 8px;
      align-self: flex-start; margin-top: 8px;
      padding: 11px 20px; border-radius: 999px;
      background: var(--fg); color: var(--bg);
      font-family: var(--f-mono); font-size: 11px;
      letter-spacing: 0.08em; text-transform: uppercase;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    .atl-work-preview-link:hover { opacity: 0.85; transform: translateX(2px); }

    /* Disciplines */
    .atl-disc { padding: 130px 0; border-top: 1px solid var(--line); }
    .atl-disc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--line); border-radius: 18px; overflow: hidden; border: 1px solid var(--line); }
    .atl-disc-card {
      padding: 36px; background: var(--bg);
      display: flex; flex-direction: column; gap: 14px;
      transition: background 0.25s ease;
      position: relative;
    }
    .atl-disc-card:hover { background: var(--bg-elev); }
    .atl-disc-num {
      font-family: var(--f-display); font-size: 36px; line-height: 1; color: var(--accent);
      font-style: italic; font-weight: 500;
    }
    .atl-disc-title { font-family: var(--f-display); font-size: 28px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; }
    .atl-disc-desc { font-size: 15px; color: var(--fg-muted); line-height: 1.55; }
    .atl-disc-items { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
    .atl-disc-item {
      padding: 4px 11px; border: 1px solid var(--line); border-radius: 999px;
      font-family: var(--f-mono); font-size: 10.5px; letter-spacing: 0.05em;
      color: var(--fg-faint); background: var(--bg-card);
    }

    /* Process */
    .atl-proc { padding: 130px 0; border-top: 1px solid var(--line); background: var(--bg-elev); }
    .atl-proc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; position: relative; }
    .atl-proc-grid::before {
      content: ''; position: absolute; top: 28px; left: 7%; right: 7%; height: 1px;
      background: repeating-linear-gradient(to right, var(--line) 0 6px, transparent 6px 12px);
      z-index: 0;
    }
    .atl-proc-step { display: flex; flex-direction: column; gap: 14px; position: relative; z-index: 1; }
    .atl-proc-dot {
      width: 56px; height: 56px; border-radius: 50%;
      background: var(--bg); border: 1px solid var(--line);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--f-display); font-size: 20px; font-weight: 500; color: var(--accent);
      font-style: italic;
    }
    .atl-proc-title { font-family: var(--f-display); font-size: 24px; font-weight: 500; letter-spacing: -0.02em; }
    .atl-proc-desc { font-size: 14px; color: var(--fg-muted); line-height: 1.6; }

    /* Recognition */
    .atl-recog { padding: 130px 0; border-top: 1px solid var(--line); }
    .atl-recog-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 80px; align-items: start; }
    .atl-press-label { font-family: var(--f-mono); font-size: 11px; color: var(--fg-faint); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 22px; }
    .atl-press-list { display: flex; flex-direction: column; }
    .atl-press-row {
      display: grid; grid-template-columns: 0.7fr 1.3fr 80px 28px;
      gap: 20px; align-items: center;
      padding: 18px 0; border-top: 1px solid var(--line);
      transition: padding 0.25s ease;
    }
    .atl-press-row:last-child { border-bottom: 1px solid var(--line); }
    .atl-press-row:hover { padding-left: 6px; }
    .atl-press-pub { font-family: var(--f-display); font-size: 19px; font-weight: 500; letter-spacing: -0.01em; }
    .atl-press-item { font-size: 14px; color: var(--fg-muted); line-height: 1.4; }
    .atl-press-year { font-family: var(--f-mono); font-size: 11px; color: var(--fg-faint); letter-spacing: 0.06em; }
    .atl-press-arrow { color: var(--fg-faint); display: flex; justify-content: flex-end; }
    .atl-press-row:hover .atl-press-arrow { color: var(--accent); }
    .atl-clients-wrap { background: var(--bg-card); border: 1px solid var(--line); border-radius: 20px; padding: 28px; position: sticky; top: 110px; }
    .atl-clients-list { display: flex; flex-direction: column; }
    .atl-client-row {
      padding: 14px 0; border-bottom: 1px solid var(--line);
      font-family: var(--f-display); font-size: 19px; letter-spacing: -0.01em;
      display: flex; justify-content: space-between; align-items: center; color: var(--fg);
    }
    .atl-client-row:last-child { border-bottom: none; }
    .atl-client-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); opacity: 0.4; }

    /* Testimonials */
    .atl-test { padding: 130px 0; border-top: 1px solid var(--line); background: var(--bg-elev); }
    .atl-test-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
    .atl-test-card {
      background: var(--bg-card); border: 1px solid var(--line);
      padding: 40px; border-radius: 20px; position: relative;
      display: flex; flex-direction: column; gap: 28px;
      transition: border-color 0.25s ease, transform 0.25s ease;
    }
    .atl-test-card:hover { border-color: var(--accent); transform: translateY(-3px); }
    .atl-test-card:first-child { grid-column: span 2; }
    .atl-test-quotemark {
      font-family: var(--f-display); font-size: 80px; line-height: 0.4;
      color: var(--accent); opacity: 0.4;
    }
    .atl-test-quote {
      font-family: var(--f-display); font-size: clamp(18px, 1.8vw, 24px);
      line-height: 1.45; font-style: italic; color: var(--fg); font-weight: 400;
    }
    .atl-test-author { display: flex; align-items: center; gap: 14px; }
    .atl-test-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent-soft));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-family: var(--f-display); font-size: 17px; font-weight: 500;
    }
    .atl-test-author-info { display: flex; flex-direction: column; }
    .atl-test-name { font-size: 14px; font-weight: 500; color: var(--fg); }
    .atl-test-role { font-family: var(--f-mono); font-size: 11px; color: var(--fg-faint); letter-spacing: 0.04em; }

    /* Contact — Studio Letter */
    .atl-contact { padding: 140px 0 100px; border-top: 1px solid var(--line); background: var(--bg-elev); }
    .atl-contact-letter {
      max-width: 820px; margin: 0 auto;
      background: var(--bg-card); border: 1px solid var(--line);
      border-radius: 4px;
      box-shadow: 0 40px 80px -24px rgba(0,0,0,0.14), 0 12px 40px -12px rgba(0,0,0,0.08);
      position: relative; overflow: hidden;
    }
    .atl-contact-letter::before {
      content: ''; position: absolute;
      top: 12px; left: 12px; right: 12px; bottom: 12px;
      border: 1px solid var(--line); pointer-events: none;
      border-radius: 2px;
    }

    /* Letterhead */
    .atl-contact-letterhead {
      padding: 48px 64px 32px;
      border-bottom: 1px solid var(--line);
      display: grid; grid-template-columns: 1fr auto;
      gap: 32px; align-items: flex-start;
      position: relative;
    }
    .atl-contact-letterhead-mark {
      display: flex; align-items: center; gap: 16px;
    }
    .atl-contact-letterhead-monogram {
      width: 56px; height: 56px;
      border: 2px solid var(--fg); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--f-display); font-style: italic; font-size: 26px;
      font-weight: 500; color: var(--fg); letter-spacing: -0.02em;
      flex-shrink: 0;
    }
    .atl-contact-letterhead-text { display: flex; flex-direction: column; gap: 3px; }
    .atl-contact-letterhead-name {
      font-family: var(--f-display); font-size: 24px;
      font-weight: 500; letter-spacing: -0.015em; line-height: 1.05;
    }
    .atl-contact-letterhead-name em { font-style: italic; color: var(--accent); }
    .atl-contact-letterhead-sub {
      font-family: var(--f-mono); font-size: 10px;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--fg-faint);
    }
    .atl-contact-letterhead-stamp {
      display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
      font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--fg-faint);
      text-align: right; line-height: 1.5;
    }
    .atl-contact-letterhead-stamp strong { color: var(--fg); font-weight: 600; }

    /* Letter body */
    .atl-contact-letter-body {
      padding: 48px 64px 40px;
      position: relative;
    }
    .atl-contact-letter-ref {
      font-family: var(--f-mono); font-size: 10px;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--fg-faint); margin-bottom: 32px;
      display: flex; justify-content: space-between;
    }
    .atl-contact-greeting {
      font-family: var(--f-display); font-size: 22px;
      font-style: italic; color: var(--fg);
      margin-bottom: 20px; letter-spacing: -0.01em;
    }
    .atl-contact-greeting strong { color: var(--accent); font-weight: 500; }
    .atl-contact-headline {
      font-family: var(--f-display);
      font-size: clamp(32px, 4vw, 52px);
      font-weight: 500; letter-spacing: -0.03em; line-height: 1.05;
      color: var(--fg); margin-bottom: 24px;
    }
    .atl-contact-headline em { font-style: italic; color: var(--accent); }
    .atl-contact-sub {
      font-size: 17px; line-height: 1.65; color: var(--fg-muted);
      margin-bottom: 36px; max-width: 60ch;
    }
    .atl-contact-email-pill {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 26px; background: var(--fg); color: var(--bg);
      border-radius: 999px; font-size: 15px; font-weight: 500;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    .atl-contact-email-pill:hover { opacity: 0.85; transform: translateX(2px); }

    /* Signature */
    .atl-contact-signature {
      margin-top: 44px; padding-top: 28px;
      border-top: 1px dashed var(--line);
      display: flex; flex-direction: column; gap: 4px;
    }
    .atl-contact-signature-closing {
      font-family: var(--f-mono); font-size: 11px;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--fg-faint);
    }
    .atl-contact-signature-name {
      font-family: var(--f-display); font-style: italic;
      font-size: 44px; font-weight: 500; color: var(--accent);
      letter-spacing: -0.02em; line-height: 1.05; margin: 4px 0;
    }
    .atl-contact-signature-role {
      font-family: var(--f-mono); font-size: 11px;
      letter-spacing: 0.06em; color: var(--fg-faint);
      text-transform: uppercase;
    }

    /* Letter footer */
    .atl-contact-letter-footer {
      padding: 28px 64px;
      background: var(--bg-elev);
      border-top: 1px solid var(--line);
      display: grid; grid-template-columns: 1fr 1fr 1fr;
      gap: 28px; align-items: flex-start;
    }
    .atl-contact-footer-block {
      font-family: var(--f-mono); font-size: 10px;
      letter-spacing: 0.08em; color: var(--fg-faint);
      line-height: 1.7; text-transform: uppercase;
    }
    .atl-contact-footer-block strong {
      color: var(--fg); font-weight: 600;
      display: block; margin-bottom: 6px; font-size: 9px;
      border-bottom: 1px solid var(--line); padding-bottom: 4px;
    }
    .atl-contact-footer-socials {
      display: flex; gap: 8px; justify-content: flex-end; align-self: center;
    }
    .atl-social-btn {
      width: 36px; height: 36px; border-radius: 50%;
      border: 1px solid var(--line); background: var(--bg);
      color: var(--fg-muted);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease;
    }
    .atl-social-btn:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

    /* Footer */
    .atl-footer {
      border-top: 1px solid var(--line);
      padding-top: 36px; padding-bottom: 36px;
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
    }
    .atl-footer-text { font-family: var(--f-mono); font-size: 11px; color: var(--fg-faint); letter-spacing: 0.05em; }
    .atl-footer-sig { font-family: var(--f-display); font-style: italic; font-size: 16px; color: var(--fg); }

    /* Mobile */
    @media (max-width: 960px) {
      .atl-shell { padding: 0 24px; }
      .atl-nav-inner { padding-top: 20px; padding-bottom: 20px; }
      .atl-footer { padding-top: 30px; padding-bottom: 30px; }
      .atl-nav-links { display: none; }
      .atl-mobile-toggle { display: flex; gap: 8px; }
      .atl-hero-dateline { font-size: 9px; gap: 10px; }
      .atl-hero-stage { grid-template-columns: 1fr; gap: 40px; }
      .atl-hero-side { max-width: 220px; order: -1; }
      .atl-hero-headline-last { margin-left: 0; }
      .atl-hero-meta-row { grid-template-columns: 1fr; gap: 24px; }
      .atl-hero-quick { align-items: flex-start; }
      .atl-hero-stats-strip { grid-template-columns: 1fr 1fr; gap: 18px 24px; }
      .atl-hero-stats-strip.has-label > .atl-hero-stats-label { grid-column: span 2; }
      .atl-hero-stats-strip.no-label { grid-template-columns: 1fr 1fr; }
      .atl-hero-stat-item { padding-left: 14px; }
      .atl-about-layout { grid-template-columns: 1fr; gap: 48px; }
      .atl-about-sidebar { position: static; max-width: 380px; }
      .atl-about-body p:first-of-type::first-letter { font-size: 88px; }
      .atl-work-stage { grid-template-columns: 1fr; gap: 40px; }
      .atl-work-preview { position: static; order: -1; }
      .atl-disc-grid { grid-template-columns: 1fr; }
      .atl-proc-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
      .atl-proc-grid::before { display: none; }
      .atl-recog-grid { grid-template-columns: 1fr; gap: 56px; }
      .atl-clients-wrap { position: static; }
      .atl-test-grid { grid-template-columns: 1fr; }
      .atl-test-card:first-child { grid-column: span 1; }
      .atl-contact-letterhead { padding: 36px 32px 24px; grid-template-columns: 1fr; gap: 18px; }
      .atl-contact-letterhead-stamp { align-items: flex-start; text-align: left; flex-direction: row; gap: 12px; }
      .atl-contact-letter-body { padding: 36px 32px 28px; }
      .atl-contact-letter-footer { padding: 24px 32px; grid-template-columns: 1fr; gap: 18px; }
      .atl-contact-footer-socials { justify-content: flex-start; }
    }
    @media (max-width: 560px) {
      .atl-shell { padding: 0 18px; }
      .atl-nav-inner { padding-top: 15px; padding-bottom: 15px; }
      .atl-footer { padding-top: 15px; padding-bottom: 15px; }
      .atl-hero-dateline { grid-template-columns: 1fr; text-align: left !important; gap: 6px; }
      .atl-hero-dateline > * { text-align: left !important; }
      .atl-hero-headline-first { font-size: clamp(56px, 16vw, 88px); }
      .atl-hero-headline-last { font-size: clamp(44px, 13vw, 72px); }
      .atl-hero-stats-strip { grid-template-columns: 1fr 1fr; }
      .atl-work-index-row { grid-template-columns: 30px 1fr 46px 14px; gap: 12px; }
      .atl-work-index-title { font-size: 17px; }
      .atl-press-row { grid-template-columns: 1fr 60px 24px; gap: 14px; }
      .atl-press-item { display: none; }
      .atl-section-title { font-size: clamp(32px, 9vw, 48px); }
      .atl-disc-card { padding: 24px; }
      .atl-contact-signature-name { font-size: 36px; }
    }
  `;

  const navLinks = [
    { num: '01', href: '#about', label: 'About' },
    { num: '02', href: '#work', label: 'Work' },
    { num: '03', href: '#disciplines', label: 'Disciplines' },
    { num: '04', href: '#process', label: 'Process' },
    { num: '05', href: '#recognition', label: 'Recognition' },
    { num: '06', href: '#contact', label: 'Contact' },
  ];

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="atl-root">
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
      <link rel="stylesheet" href={ATELIER_FONTS_HREF}/>
      <style suppressHydrationWarning>{css}</style>

      {/* Nav */}
      <nav className={`atl-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="atl-shell atl-nav-inner">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="atl-nav-name">
            <em>{name.split(' ')[0]}</em> {name.split(' ').slice(1).join(' ')}
          </a>
          <div className="atl-nav-links">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} onClick={(e) => scrollTo(e, link.href)} className="atl-nav-link">
                <span className="atl-nav-num">{link.num}</span> {link.label}
              </a>
            ))}
            <button className="atl-icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme" style={{ marginLeft: 6 }}>
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <a href="#contact" onClick={(e) => scrollTo(e, '#contact')} className="atl-nav-cta">Say hello</a>
          </div>
          <div className="atl-mobile-toggle">
            <button className="atl-icon-btn" onClick={() => setDark(!dark)}>{dark ? <SunIcon /> : <MoonIcon />}</button>
            <button className="atl-icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ borderTop: '1px solid var(--line)', padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--bg-elev)' }}>
            {navLinks.map(link => (
              <a key={link.href} href={link.href} onClick={(e) => scrollTo(e, link.href)} className="atl-nav-link" style={{ padding: '10px 12px' }}>
                <span className="atl-nav-num">{link.num}</span> {link.label}
              </a>
            ))}
            <a href="#contact" onClick={(e) => scrollTo(e, '#contact')} className="atl-nav-cta" style={{ marginTop: 6, textAlign: 'center' }}>Say hello</a>
          </div>
        )}
      </nav>

      {/* Hero — Magazine Masthead */}
      <section className="atl-hero">
        <div className="atl-shell">
          {(c.studioMark !== '' || c.heroTagline || c.location) && (
            <div className="atl-hero-dateline atl-reveal">
              <span>{(() => {
                const mark = c.studioMark === undefined ? 'ATELIER · STUDIO' : c.studioMark;
                if (!mark) return null;
                const parts = mark.split('·');
                if (parts.length > 1) return <><strong>{parts[0].trim()}</strong> · {parts.slice(1).join('·').trim()}</>;
                return <strong>{mark}</strong>;
              })()}</span>
              <span>{c.heroTagline || ''}</span>
              <span>{c.location ? `${c.location.toUpperCase()} · ${new Date().getFullYear()}` : ''}</span>
            </div>
          )}

          <div className="atl-hero-stage atl-reveal">
            <h1 className="atl-hero-headline">
              {(() => {
                const parts = name.trim().split(' ');
                if (parts.length < 2) return <span className="atl-hero-headline-first">{name}</span>;
                return <>
                  <span className="atl-hero-headline-first">{parts[0]}</span>
                  <span className="atl-hero-headline-last">{parts.slice(1).join(' ')}</span>
                </>;
              })()}
            </h1>
            <div className="atl-hero-side">
              <div className="atl-hero-portrait-mini">
                {c.photoUrl
                  ? <img src={c.photoUrl} alt={name}/>
                  : <div className="atl-hero-portrait-mini-init">{name.split(' ').map(w => w[0]).join('').slice(0,2)}</div>}
                <div className="atl-hero-portrait-frame"/>
              </div>
              <div className="atl-hero-portrait-caption">
                <strong>{name}</strong><br/>
                Studio Portrait, {new Date().getFullYear()}
              </div>
            </div>
          </div>

          <div className="atl-hero-meta-row atl-reveal">
            <div className="atl-hero-role-tag">
              {c.role || 'Designer'}
              <div>· {c.availability || 'Available'}</div>
            </div>
            <p className="atl-hero-statement">
              <span className="q">“</span>{c.subtitle || 'I design things people are glad to come back to.'}<span className="q">”</span>
            </p>
            <div className="atl-hero-quick">
              <a href="#work" onClick={(e) => scrollTo(e, '#work')}>View Work <ArrowOutIcon/></a>
              <a href="#contact" onClick={(e) => scrollTo(e, '#contact')}>Get in touch <ArrowOutIcon/></a>
              {c.resumeUrl && <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer">Download CV <ArrowOutIcon/></a>}
            </div>
          </div>

          <div className={`atl-hero-stats-strip atl-reveal ${c.statsLabel === undefined || c.statsLabel ? 'has-label' : 'no-label'}`}>
            {(c.statsLabel === undefined || c.statsLabel) && (() => {
              const text = c.statsLabel === undefined ? 'By the numbers' : c.statsLabel;
              const words = text.trim().split(/\s+/);
              if (words.length > 1) {
                return (
                  <div className="atl-hero-stats-label">
                    <strong>{words.slice(0, -1).join(' ')}</strong>{words[words.length - 1]}
                  </div>
                );
              }
              return <div className="atl-hero-stats-label">{text}</div>;
            })()}
            {[1,2,3,4].map(i => {
              const num = c[`stat${i}Num`], label = c[`stat${i}Label`];
              if (!num && !label) return null;
              return (
                <div key={i} className="atl-hero-stat-item">
                  <span className="atl-hero-stat-num">{num || '—'}</span>
                  <span className="atl-hero-stat-label">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About — Editorial Spread */}
      <section id="about" className="atl-about">
        <div className="atl-shell">
          <div className="atl-section-head atl-reveal">
            <span className="atl-mono">{c.aboutSectionLabel || '01 — About'}</span>
            <div className="atl-section-head-line"/>
            <span className="atl-mono" style={{ color: 'var(--fg-faint)' }}>Essay</span>
          </div>
          <h2 className="atl-section-title atl-reveal">{c.aboutHeading || 'A short story so far.'}</h2>

          <div className="atl-about-layout">
            <div className="atl-about-body atl-reveal">
              {c.aboutPara1 && <p>{c.aboutPara1}</p>}
              {c.aboutQuote && (
                <blockquote className="atl-about-quote-spread">
                  <span className="q">“</span>{c.aboutQuote}<span className="q">”</span>
                </blockquote>
              )}
              {c.aboutPara2 && <p>{c.aboutPara2}</p>}
              {c.aboutPara3 && <p>{c.aboutPara3}</p>}
            </div>

            <aside className="atl-about-sidebar atl-reveal">
              <div className="atl-about-portrait-sm">
                {c.aboutPhotoUrl
                  ? <img src={c.aboutPhotoUrl} alt={name}/>
                  : <div className="atl-about-portrait-sm-init">{name.split(' ').map(w => w[0]).join('').slice(0,2)}</div>}
                <div className="atl-about-portrait-cap">
                  <strong>Fig. 01 — {name}</strong>
                  <div className="atl-about-portrait-cap-sub">{c.speciality || 'Designer'} · {c.location || 'Studio'}</div>
                </div>
              </div>

              <div className="atl-about-colophon">
                <div className="atl-about-colophon-title">
                  <span>The Colophon</span>
                  <em>Notes &amp; details</em>
                </div>
                {[
                  { label: 'Based in', value: c.location || '—' },
                  { label: 'Focus area', value: c.speciality || '—' },
                  { label: 'Education', value: c.education || '—' },
                  { label: 'Languages', value: c.languages || '—' },
                ].map((m, i) => (
                  <div key={i} className="atl-footnote-row">
                    <span className="atl-footnote-num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="atl-footnote-label">{m.label}</div>
                      <div className="atl-footnote-value">{m.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Selected Work — Index + Preview Reader */}
      <section id="work" className="atl-work">
        <div className="atl-shell">
          <div className="atl-section-head atl-reveal">
            <span className="atl-mono">{c.workSectionLabel || '02 — Selected Work'}</span>
            <div className="atl-section-head-line"/>
            <span className="atl-mono" style={{ color: 'var(--fg-faint)' }}>{works.length.toString().padStart(2,'0')} projects · Hover the list</span>
          </div>
          <h2 className="atl-section-title atl-reveal">{c.workHeading || 'Recent work.'}</h2>
          {c.workSubtitle && <p className="atl-section-sub atl-reveal">{c.workSubtitle}</p>}

          {works.length > 0 ? (
            <div className="atl-work-stage atl-reveal">
              {/* Index list */}
              <div className="atl-work-index">
                {works.map((w, i) => (
                  <div
                    key={i}
                    className={`atl-work-index-row ${activeWorkIdx === i ? 'active' : ''}`}
                    onMouseEnter={() => setActiveWorkIdx(i)}
                    onClick={() => setActiveWorkIdx(i)}
                  >
                    <span className="atl-work-index-num">№ {String(i + 1).padStart(2, '0')}</span>
                    <div className="atl-work-index-info">
                      <div className="atl-work-index-title">{w.title}</div>
                      {w.category && <div className="atl-work-index-cat">{w.category}</div>}
                    </div>
                    <span className="atl-work-index-year">{w.year}</span>
                    <span className="atl-work-index-arrow"><ArrowOutIcon/></span>
                  </div>
                ))}
              </div>

              {/* Preview panel */}
              <div className="atl-work-preview">
                {(() => {
                  const w = works[activeWorkIdx] || works[0];
                  return (
                    <>
                      <div
                        className="atl-work-preview-visual"
                        style={{ background: w.image ? 'var(--bg-card)' : PROJECT_VISUALS[activeWorkIdx % PROJECT_VISUALS.length] }}
                        key={`vis-${activeWorkIdx}`}
                      >
                        {w.image ? (
                          <img src={w.image} alt={w.title}/>
                        ) : (
                          <div className="atl-work-preview-placeholder">
                            <span className="atl-work-preview-placeholder-cat">{w.category}</span>
                            <span className="atl-work-preview-placeholder-title">{w.title}</span>
                          </div>
                        )}
                        <span className="atl-work-preview-stamp">№ {String(activeWorkIdx + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}</span>
                        {w.year && <span className="atl-work-preview-corner">{w.year}</span>}
                      </div>
                      <div className="atl-work-preview-meta">
                        <h3 className="atl-work-preview-title">
                          {(() => {
                            const parts = w.title.split(' ');
                            if (parts.length < 2) return w.title;
                            return <>{parts.slice(0, -1).join(' ')} <em>{parts[parts.length - 1]}</em></>;
                          })()}
                        </h3>
                        <div className="atl-work-preview-rows">
                          {w.category && <><span className="atl-work-preview-row-label">Category</span><span className="atl-work-preview-row-value">{w.category}</span></>}
                          {w.year && <><span className="atl-work-preview-row-label">Year</span><span className="atl-work-preview-row-value">{w.year}</span></>}
                          {w.role && <><span className="atl-work-preview-row-label">Role</span><span className="atl-work-preview-row-value">{w.role}</span></>}
                          {w.description && <><span className="atl-work-preview-row-label">Brief</span><span className="atl-work-preview-row-value">{w.description}</span></>}
                        </div>
                        {w.liveUrl && (
                          <a href={w.liveUrl} target="_blank" rel="noopener noreferrer" className="atl-work-preview-link">
                            Read case study <ArrowOutIcon/>
                          </a>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div style={{ padding: 64, border: '1px dashed var(--line)', borderRadius: 4, textAlign: 'center', color: 'var(--fg-faint)', fontFamily: 'var(--f-mono)', fontSize: 13 }}>
              Add projects in the admin to display them here.
            </div>
          )}
        </div>
      </section>

      {/* Disciplines */}
      <section id="disciplines" className="atl-disc">
        <div className="atl-shell">
          <div className="atl-section-head atl-reveal">
            <span className="atl-mono">{c.discSectionLabel || '03 — Disciplines'}</span>
            <div className="atl-section-head-line"/>
          </div>
          <h2 className="atl-section-title atl-reveal">{c.discHeading || 'What I make.'}</h2>
          {c.discSubtitle && <p className="atl-section-sub atl-reveal">{c.discSubtitle}</p>}

          <div className="atl-disc-grid atl-reveal">
            {disciplines.map((d, i) => (
              <div key={i} className="atl-disc-card">
                <span className="atl-disc-num">{d.number || String(i+1).padStart(2,'0')}</span>
                <h3 className="atl-disc-title">{d.title}</h3>
                <p className="atl-disc-desc">{d.description}</p>
                {d.items && (
                  <div className="atl-disc-items">
                    {pl(d.items).map((item, j) => <span key={j} className="atl-disc-item">{item}</span>)}
                  </div>
                )}
              </div>
            ))}
            {disciplines.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: 48, textAlign: 'center', color: 'var(--fg-faint)', fontFamily: 'var(--f-mono)', fontSize: 13 }}>
                Add disciplines in the admin.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="atl-proc">
        <div className="atl-shell">
          <div className="atl-section-head atl-reveal">
            <span className="atl-mono">{c.procSectionLabel || '04 — Process'}</span>
            <div className="atl-section-head-line"/>
          </div>
          <h2 className="atl-section-title atl-reveal">{c.procHeading || 'How I work.'}</h2>
          {c.procSubtitle && <p className="atl-section-sub atl-reveal">{c.procSubtitle}</p>}

          <div className="atl-proc-grid atl-reveal">
            {process.map((p, i) => (
              <div key={i} className="atl-proc-step">
                <div className="atl-proc-dot">{p.number || String(i+1).padStart(2,'0')}</div>
                <h3 className="atl-proc-title">{p.title}</h3>
                <p className="atl-proc-desc">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section id="recognition" className="atl-recog">
        <div className="atl-shell">
          <div className="atl-section-head atl-reveal">
            <span className="atl-mono">{c.recogSectionLabel || '05 — Recognition'}</span>
            <div className="atl-section-head-line"/>
          </div>
          <h2 className="atl-section-title atl-reveal">{c.recogHeading || 'Press, awards, & clients.'}</h2>

          <div className="atl-recog-grid">
            <div className="atl-reveal">
              <div className="atl-press-label">Press & Awards</div>
              <div className="atl-press-list">
                {press.map((p, i) => (
                  <a key={i} href={p.url || undefined} target={p.url ? '_blank' : undefined} rel="noopener noreferrer" className="atl-press-row" style={{ cursor: p.url ? 'pointer' : 'default' }}>
                    <span className="atl-press-pub">{p.publication}</span>
                    <span className="atl-press-item">{p.item}</span>
                    <span className="atl-press-year">{p.year}</span>
                    <span className="atl-press-arrow">{p.url && <ArrowOutIcon />}</span>
                  </a>
                ))}
                {press.length === 0 && <div style={{ padding: 32, color: 'var(--fg-faint)', fontFamily: 'var(--f-mono)', fontSize: 13, textAlign: 'center' }}>Add press entries in the admin.</div>}
              </div>
            </div>
            <div className="atl-clients-wrap atl-reveal">
              <div className="atl-press-label">Selected Clients</div>
              <div className="atl-clients-list">
                {clients.map((cl, i) => (
                  <div key={i} className="atl-client-row">
                    <span>{cl.name}</span>
                    <span className="atl-client-dot"/>
                  </div>
                ))}
                {clients.length === 0 && <div style={{ padding: 24, color: 'var(--fg-faint)', fontFamily: 'var(--f-mono)', fontSize: 13, textAlign: 'center' }}>Add clients in the admin.</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="atl-test">
        <div className="atl-shell">
          <div className="atl-section-head atl-reveal">
            <span className="atl-mono">{c.testSectionLabel || '06 — Words'}</span>
            <div className="atl-section-head-line"/>
          </div>
          <h2 className="atl-section-title atl-reveal">{c.testHeading || 'In their words.'}</h2>

          <div className="atl-test-grid">
            {tests.map((t, i) => (
              <div key={i} className="atl-test-card atl-reveal">
                <span className="atl-test-quotemark">“</span>
                <p className="atl-test-quote">{t.quote}</p>
                <div className="atl-test-author">
                  <div className="atl-test-avatar">{t.author?.split(' ').map(w => w[0]).join('').slice(0,2) || '·'}</div>
                  <div className="atl-test-author-info">
                    <span className="atl-test-name">{t.author}</span>
                    <span className="atl-test-role">{t.role}{t.company ? ` · ${t.company}` : ''}</span>
                  </div>
                </div>
              </div>
            ))}
            {tests.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: 48, textAlign: 'center', color: 'var(--fg-faint)', fontFamily: 'var(--f-mono)', fontSize: 13 }}>
                Add testimonials in the admin.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact — Studio Letter */}
      <section id="contact" className="atl-contact">
        <div className="atl-shell">
          <div className="atl-section-head atl-reveal" style={{ maxWidth: 820, margin: '0 auto 56px' }}>
            <span className="atl-mono">{c.contactSectionLabel || '07 — Contact'}</span>
            <div className="atl-section-head-line"/>
            <span className="atl-mono" style={{ color: 'var(--fg-faint)' }}>An open letter</span>
          </div>

          <div className="atl-contact-letter atl-reveal">
            {/* Letterhead */}
            <div className="atl-contact-letterhead">
              <div className="atl-contact-letterhead-mark">
                <div className="atl-contact-letterhead-monogram">
                  {name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="atl-contact-letterhead-text">
                  <div className="atl-contact-letterhead-name">
                    <em>{name.split(' ')[0]}</em> {name.split(' ').slice(1).join(' ')}
                  </div>
                  <div className="atl-contact-letterhead-sub">
                    {c.role || 'Independent Studio'} · {c.location || 'Worldwide'}
                  </div>
                </div>
              </div>
              <div className="atl-contact-letterhead-stamp">
                <strong>The Studio</strong>
                Est. {(() => {
                  const yrs = parseInt(c.stat1Num || '6', 10);
                  return isNaN(yrs) ? (new Date().getFullYear() - 6) : (new Date().getFullYear() - yrs);
                })()}
                <span>·</span>
                {c.availability || 'Available Q2'}
              </div>
            </div>

            {/* Letter body */}
            <div className="atl-contact-letter-body">
              <div className="atl-contact-letter-ref">
                <span>REF. {String(new Date().getFullYear())}-{String(new Date().getMonth() + 1).padStart(2, '0')}-CONTACT</span>
                <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
              </div>

              <p className="atl-contact-greeting">
                Dear <strong>future collaborator</strong>,
              </p>

              <h2 className="atl-contact-headline">
                {(() => {
                  const text = c.contactHeadline || 'Let us make something together.';
                  const words = text.split(' ');
                  if (words.length < 2) return <em>{text}</em>;
                  return <>{words.slice(0, -2).join(' ')} <em>{words.slice(-2).join(' ')}</em></>;
                })()}
              </h2>

              <p className="atl-contact-sub">
                {c.contactSub || 'I am taking on a small number of projects this year. If you are working on something thoughtful, I would like to hear about it.'}
              </p>

              {c.contactEmail && (
                <a href={`mailto:${c.contactEmail}`} className="atl-contact-email-pill">
                  Write to me — {c.contactEmail} <ArrowOutIcon/>
                </a>
              )}

              <div className="atl-contact-signature">
                <span className="atl-contact-signature-closing">Yours sincerely,</span>
                <span className="atl-contact-signature-name">{name}</span>
                <span className="atl-contact-signature-role">{c.role || 'Designer & Art Director'}</span>
              </div>
            </div>

            {/* Letter footer */}
            <div className="atl-contact-letter-footer">
              <div className="atl-contact-footer-block">
                <strong>The Studio</strong>
                {c.location || '—'}<br/>
                {c.speciality || 'Independent Practice'}
              </div>
              <div className="atl-contact-footer-block">
                <strong>Office Hours</strong>
                Mon–Fri · 10:00–18:00<br/>
                Reply within 48 hrs
              </div>
              <div className="atl-contact-footer-socials">
                {c.instagramUrl && <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="atl-social-btn" aria-label="Instagram"><InstagramIcon/></a>}
                {c.behanceUrl && <a href={c.behanceUrl} target="_blank" rel="noopener noreferrer" className="atl-social-btn" aria-label="Behance"><BehanceIcon/></a>}
                {c.dribbbleUrl && <a href={c.dribbbleUrl} target="_blank" rel="noopener noreferrer" className="atl-social-btn" aria-label="Dribbble"><DribbbleIcon/></a>}
                {c.linkedinUrl && <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="atl-social-btn" aria-label="LinkedIn"><LinkedinIcon/></a>}
                {c.twitterUrl && <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer" className="atl-social-btn" aria-label="Twitter"><TwitterIcon/></a>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="atl-shell atl-footer">
          <span className="atl-footer-text">© {new Date().getFullYear()} {name} · Built with FolioForge</span>
          {c.footerSig && <span className="atl-footer-sig">{c.footerSig}</span>}
        </div>
      </footer>
    </div>
  );
}
