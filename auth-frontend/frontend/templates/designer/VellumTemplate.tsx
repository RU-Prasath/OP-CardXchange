'use client';

import { useState, useEffect } from 'react';

interface Props {
  content: Record<string, string>;
  username: string;
  hideBranding?: boolean;
}

function pl(val: string | undefined): string[] {
  if (!val) return [];
  return val.split(',').map(s => s.trim()).filter(Boolean);
}
function parseJ<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

const VELLUM_FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4">
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
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4">
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
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6">
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
const MenuIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
    <path d="M4 7h16M4 12h16M4 17h16"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
    <path d="M6 6l12 12M18 6L6 18"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <path d="M3 7l9 6 9-6"/>
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M12 22s7-7.6 7-13a7 7 0 10-14 0c0 5.4 7 13 7 13z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);
const DotIcon = () => (
  <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor">
    <circle cx="6" cy="6" r="4"/>
  </svg>
);

const SPREAD_VISUALS = [
  'linear-gradient(135deg, #c2a878, #6e4a2c)',
  'linear-gradient(155deg, #5e1f1f, #2a0e0e)',
  'linear-gradient(125deg, #d8c9a8, #9a7c4e)',
  'linear-gradient(140deg, #3a2a20, #1a120c)',
  'linear-gradient(115deg, #b8915a, #6a4d2c)',
  'linear-gradient(165deg, #8a4a3a, #3a1e16)',
];

interface WorkItem { title: string; category: string; year: string; role: string; description: string; image: string; liveUrl: string; }
interface DiscItem { number: string; title: string; description: string; items: string; }
interface ProcItem { number: string; title: string; description: string; }
interface PressItem { publication: string; item: string; year: string; url: string; }
interface ClientItem { name: string; }
interface TestItem { quote: string; author: string; role: string; company: string; }

const DEFAULT_DISCIPLINES: DiscItem[] = [
  { number: '01', title: 'Brand Identity', description: 'Considered visual systems built around enduring narrative.', items: 'Logo,Typography,Guidelines,Stationery' },
  { number: '02', title: 'Editorial Design', description: 'Magazines, books, and print artefacts with measured cadence.', items: 'Layout,Typesetting,Print Direction' },
  { number: '03', title: 'Art Direction', description: 'Cinematic styling and conceptual direction for campaigns.', items: 'Concept,Casting,Set,Photography' },
];
const DEFAULT_WORKS: WorkItem[] = [
  { title: 'Maison Aurelle', category: 'Brand Identity', year: '2024', role: 'Creative Direction', description: 'A heritage parfumerie rebrand grounded in restraint and ritual.', image: '', liveUrl: '' },
  { title: 'The Atlas Quarterly', category: 'Editorial', year: '2024', role: 'Art Direction', description: 'A quarterly travel journal printed on uncoated stock.', image: '', liveUrl: '' },
  { title: 'Verre & Or', category: 'Packaging', year: '2023', role: 'Design Lead', description: 'Champagne packaging system inspired by Belle Epoque ironwork.', image: '', liveUrl: '' },
];
const DEFAULT_PROCESS: ProcItem[] = [
  { number: '01', title: 'Discover', description: 'Listen, read, walk the room. Locate the brief inside the brand.' },
  { number: '02', title: 'Define', description: 'Sharpen the concept into a one-line proposition the work can carry.' },
  { number: '03', title: 'Design', description: 'Iterate quietly until the form serves the idea without ornament.' },
  { number: '04', title: 'Deliver', description: 'Hand off with care — guidelines, files, and follow-through.' },
];
const DEFAULT_PRESS: PressItem[] = [
  { publication: 'It’s Nice That', item: 'Feature: A Year in Print', year: '2024', url: '' },
  { publication: 'Communication Arts', item: 'Typography Annual Selection', year: '2023', url: '' },
  { publication: 'Eye Magazine', item: 'Interview, Issue 104', year: '2023', url: '' },
];
const DEFAULT_CLIENTS: ClientItem[] = [
  { name: 'Maison Aurelle' }, { name: 'Atlas Quarterly' }, { name: 'Verre & Or' },
  { name: 'Studio Vellum' }, { name: 'House of Linen' }, { name: 'Cellier Paris' },
];
const DEFAULT_TESTS: TestItem[] = [
  { quote: 'A rare designer who reads the room and the brief in the same breath. The work feels inevitable, which is the highest compliment.', author: 'Camille Roux', role: 'Founder', company: 'Maison Aurelle' },
  { quote: 'Patient, exacting, generous. The identity has carried us through three seasons without a wrinkle.', author: 'Tomas Linden', role: 'Editor', company: 'The Atlas Quarterly' },
];

export default function VellumTemplate({ content, username, hideBranding }: Props) {
  const c = content || {};
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.vlm-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('vlm-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const name = c.name || 'Eloise Marchand';
  const title = c.title || 'Designer & Art Director';
  const tagline = c.tagline || 'Editorial systems for considered brands.';
  const location = c.location || 'Paris — London';
  const issueLabel = c.issueLabel || 'Issue No. XII';
  const email = c.email || 'studio@vellum.design';
  const availability = c.availability || 'Accepting commissions for Autumn 2026';
  const heroDate = c.heroDate || 'Spring — Summer 2026';

  const aboutP1 = c.aboutP1 || 'Studio Vellum is the independent practice of a designer working at the intersection of editorial, identity, and art direction. The work is unhurried, the typography deliberate, the references wide.';
  const aboutP2 = c.aboutP2 || 'Over the last decade, the studio has built systems for parfumeries, publishing houses, and small luxury houses across Europe. The approach is print-first, typographically literate, and committed to the long view.';
  const aboutQuote = c.aboutQuote || '“A brand is a kept promise, set in type and bound in cloth.”';

  const works = parseJ<WorkItem[]>(c.workJson, DEFAULT_WORKS);
  const disciplines = parseJ<DiscItem[]>(c.disciplinesJson, DEFAULT_DISCIPLINES);
  const process = parseJ<ProcItem[]>(c.processJson, DEFAULT_PROCESS);
  const press = parseJ<PressItem[]>(c.pressJson, DEFAULT_PRESS);
  const clients = parseJ<ClientItem[]>(c.clientsJson, DEFAULT_CLIENTS);
  const tests = parseJ<TestItem[]>(c.testJson, DEFAULT_TESTS);

  const social = {
    instagram: c.instagram || '',
    behance: c.behance || '',
    dribbble: c.dribbble || '',
    linkedin: c.linkedin || '',
    twitter: c.twitter || '',
  };

  const bg = dark ? '#1a120c' : (c.colorBg || '#f5f0e8');
  const bgElev = dark ? '#231a12' : (c.colorBgElev || '#ece4d3');
  const bgCard = dark ? '#2a1f15' : (c.colorBgCard || '#fbf7ef');
  const fg = dark ? '#f3ead8' : (c.colorFg || '#3a2a20');
  const fgMuted = dark ? '#c4b89c' : (c.colorFgMuted || '#5a4a3e');
  const fgFaint = dark ? '#8a7b62' : (c.colorFgFaint || '#8e7e6a');
  const line = dark ? '#3c2e22' : (c.colorLine || '#d8cdb6');
  const lineStrong = dark ? '#5a4632' : (c.colorLineStrong || '#a89776');
  const accent = c.colorAccent || '#b8915a';
  const primary = dark ? '#a8483d' : (c.colorPrimary || '#5e1f1f');

  const cssVars = `
    @import url('${VELLUM_FONTS_HREF}');

    .vlm-root {
      --bg: ${bg}; --bg-elev: ${bgElev}; --bg-card: ${bgCard};
      --fg: ${fg}; --fg-muted: ${fgMuted}; --fg-faint: ${fgFaint};
      --line: ${line}; --line-strong: ${lineStrong};
      --accent: ${accent}; --primary: ${primary};
      --f-display: 'Playfair Display', 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
      --f-body: 'Inter', system-ui, -apple-system, sans-serif;
      --f-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
      background: var(--bg);
      color: var(--fg);
      font-family: var(--f-body);
      font-weight: 400;
      min-height: 100vh;
      transition: background 0.5s ease, color 0.5s ease;
      position: relative;
      overflow-x: hidden;
    }
    .vlm-root *, .vlm-root *::before, .vlm-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .vlm-root :where(a) { color: inherit; text-decoration: none; }
    .vlm-root :where(button) { font-family: inherit; }
    html { scroll-behavior: smooth; }

    .vlm-root::before {
      content: '';
      position: fixed; inset: 0;
      pointer-events: none; z-index: 1;
      opacity: ${dark ? 0.06 : 0.05};
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.23 0 0 0 0 0.17 0 0 0 0 0.13 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
      mix-blend-mode: ${dark ? 'screen' : 'multiply'};
    }

    .vlm-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.9s ease, transform 0.9s ease; }
    .vlm-reveal.vlm-in { opacity: 1; transform: none; }

    .vlm-shell { max-width: 1240px; margin: 0 auto; padding: 0 48px; position: relative; z-index: 2; }
    .vlm-shell-narrow { max-width: 980px; margin: 0 auto; padding: 0 48px; position: relative; z-index: 2; }

    .vlm-display { font-family: var(--f-display); letter-spacing: -0.02em; }
    .vlm-mono { font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; }
    .vlm-smallcaps {
      font-family: var(--f-body); font-size: 11px; letter-spacing: 0.32em;
      text-transform: uppercase; font-weight: 500;
    }

    .vlm-rule { height: 1px; background: var(--accent); width: 100%; opacity: 0.7; }
    .vlm-rule-thin { height: 1px; background: var(--line); width: 100%; }
    .vlm-rule-double {
      height: 5px; border-top: 1px solid var(--accent); border-bottom: 1px solid var(--accent);
      width: 100%;
    }

    /* ─── Nav ─── */
    .vlm-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 60;
      transition: background 0.4s ease, border-color 0.4s ease, padding 0.3s ease;
      background: transparent;
      border-bottom: 1px solid transparent;
    }
    .vlm-nav.scrolled {
      background: color-mix(in srgb, var(--bg) 92%, transparent);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border-bottom-color: var(--line);
    }
    .vlm-nav-inner {
      display: flex; align-items: center; justify-content: space-between;
      gap: 24px; padding: 22px 48px;
      max-width: 1480px; margin: 0 auto;
      transition: padding 0.3s ease;
    }
    .vlm-nav.scrolled .vlm-nav-inner { padding-top: 16px; padding-bottom: 16px; }
    .vlm-nav-brand {
      font-family: var(--f-display); font-size: 24px; font-weight: 600;
      letter-spacing: -0.01em; line-height: 1;
      display: flex; align-items: baseline; gap: 8px;
    }
    .vlm-nav-brand em { font-style: italic; color: var(--accent); font-weight: 500; }
    .vlm-nav-brand-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--accent); display: inline-block;
    }
    .vlm-nav-links { display: flex; align-items: center; gap: 4px; }
    .vlm-nav-link {
      padding: 8px 14px; font-size: 12.5px; font-weight: 500;
      letter-spacing: 0.04em; color: var(--fg-muted);
      transition: color 0.25s ease;
      position: relative;
    }
    .vlm-nav-link::after {
      content: ''; position: absolute; left: 14px; right: 14px; bottom: 4px;
      height: 1px; background: var(--accent);
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.3s ease;
    }
    .vlm-nav-link:hover { color: var(--accent); }
    .vlm-nav-link:hover::after { transform: scaleX(1); }
    .vlm-nav-actions { display: flex; align-items: center; gap: 8px; }
    .vlm-icon-btn {
      width: 36px; height: 36px; border-radius: 50%;
      border: 1px solid var(--line); background: transparent;
      color: var(--fg-muted); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .vlm-icon-btn:hover { border-color: var(--accent); color: var(--accent); }
    .vlm-nav-cta {
      padding: 10px 20px; border-radius: 0;
      border: 1px solid var(--fg); color: var(--fg);
      font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500;
      background: transparent; cursor: pointer;
      transition: background 0.25s, color 0.25s;
    }
    .vlm-nav-cta:hover { background: var(--fg); color: var(--bg); }
    .vlm-mobile-toggle { display: none; }
    .vlm-mobile-menu { display: none; }

    /* ─── Hero ─── */
    .vlm-hero {
      padding: 160px 0 100px;
      position: relative;
      border-bottom: 1px solid var(--accent);
    }
    .vlm-hero-masthead {
      display: grid; grid-template-columns: 1fr auto 1fr;
      align-items: center; gap: 24px;
      padding-bottom: 18px; margin-bottom: 56px;
      border-bottom: 1px solid var(--fg);
    }
    .vlm-hero-masthead > :nth-child(3) { text-align: right; }
    .vlm-hero-masthead > :nth-child(2) { text-align: center; }
    .vlm-hero-masthead strong { color: var(--fg); font-weight: 600; letter-spacing: 0.22em; }
    .vlm-hero-masthead-issue {
      font-family: var(--f-display); font-style: italic;
      font-size: 16px; color: var(--accent); letter-spacing: -0.01em;
      text-transform: none;
    }
    .vlm-hero-feature {
      display: inline-flex; align-items: center; gap: 14px;
      margin-bottom: 36px;
    }
    .vlm-hero-feature-line { width: 56px; height: 1px; background: var(--accent); }
    .vlm-hero-feature span {
      font-family: var(--f-body); font-size: 11px; font-weight: 600;
      letter-spacing: 0.34em; text-transform: uppercase; color: var(--accent);
    }
    .vlm-hero-stage {
      display: grid; grid-template-columns: 1.5fr 1fr;
      gap: 80px; align-items: end;
    }
    .vlm-hero-headline {
      font-family: var(--f-display); font-weight: 500;
      line-height: 0.92; letter-spacing: -0.035em;
      font-size: clamp(64px, 11vw, 168px);
      color: var(--fg);
    }
    .vlm-hero-headline-line { display: block; }
    .vlm-hero-headline-italic {
      display: block; font-style: italic; font-weight: 400;
      color: var(--primary);
      margin-left: 8%;
      margin-top: -8px;
    }
    .vlm-hero-headline-amp {
      font-family: var(--f-display); font-style: italic;
      color: var(--accent); display: inline-block;
      margin: 0 0.1em;
    }
    .vlm-hero-side {
      display: flex; flex-direction: column; gap: 28px;
      padding-bottom: 16px;
    }
    .vlm-hero-tagline {
      font-family: var(--f-display); font-style: italic;
      font-size: clamp(22px, 2.2vw, 28px); line-height: 1.32;
      color: var(--fg); letter-spacing: -0.015em;
    }
    .vlm-hero-tagline::before {
      content: '“'; color: var(--accent);
      font-size: 1.6em; line-height: 0; vertical-align: -0.2em;
      margin-right: 4px;
    }
    .vlm-hero-meta {
      display: flex; flex-direction: column; gap: 14px;
      padding-top: 22px; border-top: 1px solid var(--line);
    }
    .vlm-hero-meta-row {
      display: flex; justify-content: space-between; align-items: baseline;
      gap: 24px;
    }
    .vlm-hero-meta-label {
      font-family: var(--f-body); font-size: 10px; font-weight: 600;
      letter-spacing: 0.28em; text-transform: uppercase; color: var(--fg-faint);
    }
    .vlm-hero-meta-value {
      font-family: var(--f-display); font-size: 17px; font-weight: 500;
      color: var(--fg); letter-spacing: -0.005em;
      text-align: right;
    }
    .vlm-hero-meta-value em { font-style: italic; color: var(--accent); }
    .vlm-hero-folio {
      display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 0; margin-top: 64px;
      padding: 26px 0; border-top: 1px solid var(--fg); border-bottom: 1px solid var(--line);
    }
    .vlm-hero-folio-item {
      padding: 0 28px;
      border-left: 1px solid var(--line);
    }
    .vlm-hero-folio-item:first-child { border-left: none; padding-left: 0; }
    .vlm-hero-folio-num {
      font-family: var(--f-display); font-size: clamp(36px, 4vw, 54px);
      font-weight: 500; letter-spacing: -0.025em; line-height: 1;
      color: var(--fg);
    }
    .vlm-hero-folio-num em { font-style: italic; color: var(--accent); }
    .vlm-hero-folio-label {
      margin-top: 10px;
      font-family: var(--f-body); font-size: 10px; font-weight: 500;
      letter-spacing: 0.24em; text-transform: uppercase; color: var(--fg-faint);
    }

    /* ─── Section common ─── */
    .vlm-section { padding: 130px 0; position: relative; }
    .vlm-section-head {
      display: flex; align-items: baseline; gap: 22px;
      margin-bottom: 24px;
    }
    .vlm-section-head-num {
      font-family: var(--f-body); font-size: 11px; font-weight: 600;
      letter-spacing: 0.32em; text-transform: uppercase; color: var(--accent);
      white-space: nowrap;
    }
    .vlm-section-head-line { flex: 1; height: 1px; background: var(--accent); opacity: 0.7; }
    .vlm-section-title {
      font-family: var(--f-display); font-weight: 500;
      font-size: clamp(44px, 6vw, 84px); line-height: 1; letter-spacing: -0.035em;
      color: var(--fg);
      margin-bottom: 64px;
      max-width: 18ch;
    }
    .vlm-section-title em { font-style: italic; color: var(--primary); }

    /* ─── About ─── */
    .vlm-about { background: var(--bg-elev); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .vlm-about-grid {
      display: grid; grid-template-columns: 1fr 1.5fr;
      gap: 80px; align-items: start;
    }
    .vlm-about-aside {
      position: sticky; top: 120px;
      display: flex; flex-direction: column; gap: 28px;
    }
    .vlm-about-aside-title {
      font-family: var(--f-display); font-style: italic;
      font-size: clamp(40px, 5vw, 60px); line-height: 1; letter-spacing: -0.03em;
      color: var(--primary);
    }
    .vlm-about-aside-mono {
      font-family: var(--f-mono); font-size: 10.5px; letter-spacing: 0.16em;
      text-transform: uppercase; color: var(--fg-faint);
      line-height: 1.8;
    }
    .vlm-about-aside-mono strong { color: var(--fg); font-weight: 600; }
    .vlm-about-aside-monogram {
      width: 92px; height: 92px;
      border: 1px solid var(--accent); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--f-display); font-style: italic; font-weight: 500;
      font-size: 36px; color: var(--accent);
    }
    .vlm-about-body { font-size: 17px; line-height: 1.78; color: var(--fg-muted); }
    .vlm-about-body p { margin-bottom: 28px; }
    .vlm-about-body p:first-of-type {
      font-size: 18.5px; line-height: 1.7; color: var(--fg);
    }
    .vlm-about-body p:first-of-type::first-letter {
      font-family: var(--f-display); font-size: 124px;
      font-weight: 600; line-height: 0.82; font-style: italic;
      float: left; margin: 12px 16px -6px 0;
      color: var(--primary);
    }
    .vlm-about-quote {
      font-family: var(--f-display); font-style: italic; font-weight: 400;
      font-size: clamp(28px, 3.4vw, 44px); line-height: 1.25;
      color: var(--fg); letter-spacing: -0.02em;
      padding: 50px 0; margin: 36px 0;
      border-top: 1px solid var(--accent); border-bottom: 1px solid var(--accent);
      position: relative; text-align: center;
    }
    .vlm-about-quote::before {
      content: ''; position: absolute;
      left: 50%; top: -5px; transform: translateX(-50%);
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--accent);
    }
    .vlm-about-quote::after {
      content: ''; position: absolute;
      left: 50%; bottom: -5px; transform: translateX(-50%);
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--accent);
    }

    /* ─── Disciplines ─── */
    .vlm-disc-list { display: flex; flex-direction: column; }
    .vlm-disc-row {
      display: grid; grid-template-columns: 100px 1fr 1.4fr 1fr;
      gap: 40px; align-items: start;
      padding: 40px 0;
      border-top: 1px solid var(--line);
      transition: padding 0.4s ease;
    }
    .vlm-disc-row:last-child { border-bottom: 1px solid var(--line); }
    .vlm-disc-row:hover { background: var(--bg-elev); padding-left: 16px; padding-right: 16px; }
    .vlm-disc-num {
      font-family: var(--f-display); font-style: italic;
      font-size: 28px; font-weight: 500; color: var(--accent);
      line-height: 1;
    }
    .vlm-disc-title {
      font-family: var(--f-display); font-weight: 500;
      font-size: clamp(26px, 3vw, 38px); line-height: 1.05;
      letter-spacing: -0.025em; color: var(--fg);
    }
    .vlm-disc-desc { font-size: 15.5px; line-height: 1.65; color: var(--fg-muted); }
    .vlm-disc-items {
      display: flex; flex-direction: column; gap: 8px;
    }
    .vlm-disc-item {
      font-family: var(--f-body); font-size: 11px; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--fg-muted);
      display: flex; align-items: center; gap: 10px;
    }
    .vlm-disc-item-bullet {
      width: 4px; height: 4px; border-radius: 50%; background: var(--accent);
    }

    /* ─── Work ─── */
    .vlm-work { background: var(--bg-card); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .vlm-work-list { display: flex; flex-direction: column; gap: 140px; }
    .vlm-work-spread {
      display: grid; gap: 64px; align-items: center;
    }
    .vlm-work-spread.left { grid-template-columns: 1.2fr 1fr; }
    .vlm-work-spread.right { grid-template-columns: 1fr 1.2fr; }
    .vlm-work-spread.right .vlm-work-image { order: 2; }
    .vlm-work-image {
      aspect-ratio: 4 / 5; position: relative; overflow: hidden;
      border: 1px solid var(--line);
    }
    .vlm-work-image-bg {
      position: absolute; inset: 0;
      transition: transform 0.9s ease;
    }
    .vlm-work-spread:hover .vlm-work-image-bg { transform: scale(1.04); }
    .vlm-work-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .vlm-work-image-frame {
      position: absolute; inset: 14px;
      border: 1px solid rgba(255,255,255,0.35);
      pointer-events: none;
    }
    .vlm-work-image-caption {
      position: absolute; top: 18px; left: 18px;
      font-family: var(--f-body); font-size: 9.5px; font-weight: 600;
      letter-spacing: 0.28em; text-transform: uppercase;
      color: rgba(255,255,255,0.92);
      background: rgba(0,0,0,0.32);
      padding: 6px 10px; backdrop-filter: blur(4px);
    }
    .vlm-work-image-folio {
      position: absolute; bottom: 18px; right: 18px;
      font-family: var(--f-display); font-style: italic; font-weight: 500;
      font-size: 60px; line-height: 1;
      color: rgba(255,255,255,0.85);
    }
    .vlm-work-info { display: flex; flex-direction: column; gap: 22px; }
    .vlm-work-info-feature {
      display: flex; align-items: center; gap: 12px;
      color: var(--accent);
    }
    .vlm-work-info-feature span {
      font-family: var(--f-body); font-size: 10.5px; font-weight: 600;
      letter-spacing: 0.32em; text-transform: uppercase;
    }
    .vlm-work-info-feature-line { width: 36px; height: 1px; background: var(--accent); }
    .vlm-work-title {
      font-family: var(--f-display); font-weight: 500;
      font-size: clamp(36px, 4.2vw, 60px); line-height: 1.05;
      letter-spacing: -0.03em; color: var(--fg);
    }
    .vlm-work-title em { font-style: italic; color: var(--primary); }
    .vlm-work-tags {
      display: flex; align-items: center; gap: 16px;
      padding: 14px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
    }
    .vlm-work-tag {
      font-family: var(--f-mono); font-size: 10.5px; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--fg-muted);
    }
    .vlm-work-tag strong { color: var(--fg); font-weight: 500; }
    .vlm-work-tag-sep { width: 1px; height: 14px; background: var(--line); }
    .vlm-work-desc { font-size: 16px; line-height: 1.75; color: var(--fg-muted); }
    .vlm-work-link {
      display: inline-flex; align-items: center; gap: 10px;
      font-family: var(--f-body); font-size: 11px; font-weight: 600;
      letter-spacing: 0.28em; text-transform: uppercase; color: var(--fg);
      padding-bottom: 6px; border-bottom: 1px solid var(--fg);
      align-self: flex-start;
      transition: color 0.25s, border-color 0.25s, gap 0.25s;
    }
    .vlm-work-link:hover { color: var(--accent); border-color: var(--accent); gap: 14px; }

    /* ─── Process ─── */
    .vlm-process-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 0;
    }
    .vlm-process-step {
      padding: 36px 28px 36px 0;
      border-top: 1px solid var(--accent);
      border-right: 1px solid var(--line);
      position: relative;
    }
    .vlm-process-step:last-child { border-right: none; padding-right: 0; }
    .vlm-process-step:first-child { padding-left: 0; }
    .vlm-process-step:not(:first-child) { padding-left: 28px; }
    .vlm-process-num {
      font-family: var(--f-display); font-style: italic;
      font-size: 56px; font-weight: 500; color: var(--accent);
      line-height: 1; margin-bottom: 22px;
    }
    .vlm-process-title {
      font-family: var(--f-display); font-weight: 500;
      font-size: 26px; line-height: 1.15; letter-spacing: -0.02em;
      color: var(--fg); margin-bottom: 14px;
    }
    .vlm-process-desc { font-size: 14.5px; line-height: 1.7; color: var(--fg-muted); }

    /* ─── Press ─── */
    .vlm-press { background: var(--bg-elev); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .vlm-press-list { display: flex; flex-direction: column; }
    .vlm-press-row {
      display: grid; grid-template-columns: 80px 1.4fr 1fr 80px;
      gap: 32px; align-items: center;
      padding: 28px 0;
      border-top: 1px solid var(--line);
      transition: padding 0.3s ease, background 0.3s ease;
    }
    .vlm-press-row:last-child { border-bottom: 1px solid var(--line); }
    .vlm-press-row:hover { padding-left: 12px; padding-right: 12px; background: var(--bg-card); }
    .vlm-press-year {
      font-family: var(--f-mono); font-size: 12px; color: var(--accent);
      letter-spacing: 0.12em;
    }
    .vlm-press-pub {
      font-family: var(--f-display); font-style: italic;
      font-size: clamp(22px, 2.4vw, 30px); font-weight: 500;
      color: var(--fg); letter-spacing: -0.015em; line-height: 1.15;
    }
    .vlm-press-item {
      font-size: 14.5px; color: var(--fg-muted); line-height: 1.55;
    }
    .vlm-press-arrow {
      display: flex; justify-content: flex-end; color: var(--fg-faint);
      transition: color 0.25s, transform 0.25s;
    }
    .vlm-press-row:hover .vlm-press-arrow { color: var(--accent); transform: translateX(4px); }

    /* ─── Clients ─── */
    .vlm-clients-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      border-top: 1px solid var(--line);
      border-left: 1px solid var(--line);
    }
    .vlm-client-cell {
      padding: 56px 24px;
      border-right: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      display: flex; align-items: center; justify-content: center;
      text-align: center;
      font-family: var(--f-display); font-weight: 500;
      font-size: clamp(20px, 2.2vw, 28px);
      letter-spacing: -0.01em; color: var(--fg);
      transition: background 0.3s, color 0.3s;
    }
    .vlm-client-cell:hover { background: var(--bg-elev); color: var(--accent); font-style: italic; }

    /* ─── Testimonials ─── */
    .vlm-test { background: var(--primary); color: #f5efdf; border-top: 1px solid var(--accent); border-bottom: 1px solid var(--accent); position: relative; }
    .vlm-test .vlm-section-head-num { color: ${dark ? '#d8b888' : '#e4c896'}; }
    .vlm-test .vlm-section-head-line { background: ${dark ? '#d8b888' : '#e4c896'}; opacity: 0.5; }
    .vlm-test .vlm-section-title { color: #f5efdf; }
    .vlm-test .vlm-section-title em { color: ${accent}; }
    .vlm-test-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 64px;
    }
    .vlm-test-card {
      padding: 44px 36px;
      border: 1px solid ${dark ? '#5a3a2c' : '#7a3030'};
      position: relative;
      display: flex; flex-direction: column; gap: 28px;
    }
    .vlm-test-card::before {
      content: '“';
      position: absolute; top: -6px; left: 30px;
      background: var(--primary); padding: 0 12px;
      font-family: var(--f-display); font-style: italic;
      font-size: 72px; line-height: 1; color: ${accent};
    }
    .vlm-test-quote {
      font-family: var(--f-display); font-style: italic; font-weight: 400;
      font-size: clamp(20px, 2.2vw, 26px); line-height: 1.45;
      color: #f5efdf; letter-spacing: -0.015em;
      padding-top: 24px;
    }
    .vlm-test-attr {
      display: flex; align-items: baseline; gap: 14px;
      padding-top: 24px; border-top: 1px solid ${dark ? '#5a3a2c' : '#7a3030'};
    }
    .vlm-test-author {
      font-family: var(--f-display); font-weight: 500;
      font-size: 18px; color: #f5efdf;
    }
    .vlm-test-role {
      font-family: var(--f-mono); font-size: 10.5px; letter-spacing: 0.14em;
      text-transform: uppercase; color: ${dark ? '#d8b888' : '#e4c896'};
    }

    /* ─── Contact ─── */
    .vlm-contact-grid {
      display: grid; grid-template-columns: 1fr 1.2fr;
      gap: 88px; align-items: start;
    }
    .vlm-contact-aside { display: flex; flex-direction: column; gap: 28px; }
    .vlm-contact-tag {
      font-family: var(--f-display); font-style: italic;
      font-size: clamp(40px, 5vw, 64px); line-height: 1;
      letter-spacing: -0.03em; color: var(--primary);
    }
    .vlm-contact-detail {
      display: flex; flex-direction: column; gap: 6px;
      padding: 18px 0; border-top: 1px solid var(--line);
    }
    .vlm-contact-detail:last-of-type { border-bottom: 1px solid var(--line); }
    .vlm-contact-detail-label {
      font-family: var(--f-body); font-size: 10px; font-weight: 600;
      letter-spacing: 0.3em; text-transform: uppercase; color: var(--fg-faint);
    }
    .vlm-contact-detail-value {
      font-family: var(--f-display); font-weight: 500;
      font-size: 19px; color: var(--fg); letter-spacing: -0.01em;
      display: flex; align-items: center; gap: 10px;
    }
    .vlm-contact-detail-value em { font-style: italic; color: var(--accent); }
    .vlm-contact-detail-value a { transition: color 0.2s; }
    .vlm-contact-detail-value a:hover { color: var(--accent); }
    .vlm-contact-status {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--f-mono); font-size: 10.5px;
      letter-spacing: 0.16em; text-transform: uppercase; color: var(--fg-muted);
    }
    .vlm-contact-status-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #6a9460; box-shadow: 0 0 0 4px rgba(106,148,96,0.18);
    }
    .vlm-contact-socials { display: flex; gap: 10px; margin-top: 8px; }
    .vlm-form {
      background: var(--bg-card);
      border: 1px solid var(--line);
      padding: 48px 44px;
      display: flex; flex-direction: column; gap: 24px;
      position: relative;
    }
    .vlm-form::before {
      content: ''; position: absolute; top: 14px; left: 14px; right: 14px; bottom: 14px;
      border: 1px solid var(--accent); pointer-events: none;
      opacity: 0.4;
    }
    .vlm-form-title {
      font-family: var(--f-display); font-weight: 500;
      font-size: 30px; letter-spacing: -0.02em; color: var(--fg);
      margin-bottom: 8px;
      position: relative; z-index: 1;
    }
    .vlm-form-title em { font-style: italic; color: var(--accent); }
    .vlm-form-field { display: flex; flex-direction: column; gap: 8px; position: relative; z-index: 1; }
    .vlm-form-label {
      font-family: var(--f-body); font-size: 10px; font-weight: 600;
      letter-spacing: 0.3em; text-transform: uppercase; color: var(--fg-faint);
    }
    .vlm-form-input, .vlm-form-textarea {
      background: transparent;
      border: none; border-bottom: 1px solid var(--line);
      padding: 10px 0; font-family: var(--f-display);
      font-size: 18px; color: var(--fg);
      transition: border-color 0.25s;
      outline: none; width: 100%;
    }
    .vlm-form-input:focus, .vlm-form-textarea:focus { border-bottom-color: var(--accent); }
    .vlm-form-textarea { resize: vertical; min-height: 110px; font-family: var(--f-body); font-size: 15px; line-height: 1.6; }
    .vlm-form-submit {
      align-self: flex-start;
      padding: 14px 32px;
      background: var(--primary); color: #f5efdf;
      border: none; font-family: var(--f-body);
      font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; font-weight: 600;
      cursor: pointer; transition: background 0.25s, transform 0.25s;
      position: relative; z-index: 1;
    }
    .vlm-form-submit:hover { background: var(--accent); }
    .vlm-form-sent {
      font-family: var(--f-display); font-style: italic;
      font-size: 15px; color: var(--accent);
      position: relative; z-index: 1;
    }

    /* ─── Footer ─── */
    .vlm-footer {
      padding: 60px 0 40px;
      border-top: 1px solid var(--accent);
      background: var(--bg-elev);
    }
    .vlm-footer-masthead {
      display: grid; grid-template-columns: 1fr 1fr 1fr;
      gap: 24px; padding-bottom: 18px;
      border-bottom: 1px solid var(--fg);
      margin-bottom: 36px;
      font-family: var(--f-body); font-size: 10px; font-weight: 600;
      letter-spacing: 0.24em; text-transform: uppercase; color: var(--fg-muted);
    }
    .vlm-footer-masthead > :nth-child(2) { text-align: center; }
    .vlm-footer-masthead > :nth-child(3) { text-align: right; }
    .vlm-footer-masthead strong { color: var(--fg); font-weight: 700; }
    .vlm-footer-bottom {
      display: flex; justify-content: space-between; align-items: center;
      gap: 24px; flex-wrap: wrap;
    }
    .vlm-footer-colophon {
      font-family: var(--f-display); font-style: italic;
      font-size: 14px; color: var(--fg-muted);
    }
    .vlm-footer-colophon strong { font-style: normal; color: var(--fg); font-weight: 500; }
    .vlm-footer-meta {
      font-family: var(--f-mono); font-size: 10px;
      letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-faint);
    }
    .vlm-footer-meta a { color: var(--accent); }
    .vlm-footer-meta a:hover { text-decoration: underline; }

    /* ─── Responsive ─── */
    @media (max-width: 1024px) {
      .vlm-hero-stage { grid-template-columns: 1fr; gap: 40px; }
      .vlm-about-grid { grid-template-columns: 1fr; gap: 56px; }
      .vlm-about-aside { position: static; flex-direction: row; align-items: center; flex-wrap: wrap; gap: 20px; }
      .vlm-disc-row { grid-template-columns: 60px 1fr 1fr; gap: 24px; }
      .vlm-disc-row .vlm-disc-items { grid-column: 1 / -1; flex-direction: row; flex-wrap: wrap; gap: 12px 20px; padding-left: 60px; }
      .vlm-process-grid { grid-template-columns: repeat(2, 1fr); }
      .vlm-process-step:nth-child(2) { border-right: none; padding-right: 0; }
      .vlm-process-step:nth-child(3) { border-left: none; padding-left: 0; }
      .vlm-process-step:nth-child(n+3) { padding-left: 0; padding-right: 28px; }
      .vlm-test-grid { grid-template-columns: 1fr; gap: 28px; }
      .vlm-contact-grid { grid-template-columns: 1fr; gap: 56px; }
      .vlm-clients-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .vlm-shell, .vlm-shell-narrow { padding: 0 24px; }
      .vlm-nav-inner { padding: 18px 24px; }
      .vlm-nav-links, .vlm-nav-cta { display: none; }
      .vlm-mobile-toggle {
        display: flex; align-items: center; justify-content: center;
        width: 38px; height: 38px; border: 1px solid var(--line);
        background: transparent; color: var(--fg); cursor: pointer;
      }
      .vlm-mobile-menu {
        display: ${menuOpen ? 'flex' : 'none'};
        position: fixed; top: 70px; left: 0; right: 0; bottom: 0;
        background: var(--bg); z-index: 55;
        flex-direction: column; padding: 40px 24px;
        gap: 6px;
        border-top: 1px solid var(--line);
      }
      .vlm-mobile-menu a {
        font-family: var(--f-display); font-weight: 500;
        font-size: 32px; letter-spacing: -0.02em; color: var(--fg);
        padding: 14px 0; border-bottom: 1px solid var(--line);
        display: flex; align-items: baseline; gap: 14px;
      }
      .vlm-mobile-menu a em { font-style: italic; color: var(--accent); font-size: 14px; }
      .vlm-hero { padding: 130px 0 80px; }
      .vlm-hero-masthead { grid-template-columns: 1fr; gap: 6px; text-align: center !important; }
      .vlm-hero-masthead > * { text-align: center !important; }
      .vlm-hero-headline-italic { margin-left: 4%; }
      .vlm-hero-folio { grid-template-columns: 1fr 1fr; gap: 24px 0; }
      .vlm-hero-folio-item { padding: 12px 16px; border-left: 1px solid var(--line); }
      .vlm-hero-folio-item:first-child, .vlm-hero-folio-item:nth-child(3) { border-left: none; padding-left: 0; }
      .vlm-section { padding: 80px 0; }
      .vlm-section-title { margin-bottom: 44px; }
      .vlm-disc-row { grid-template-columns: 44px 1fr; gap: 18px; padding: 24px 0; }
      .vlm-disc-row .vlm-disc-desc, .vlm-disc-row .vlm-disc-items { grid-column: 1 / -1; padding-left: 0; }
      .vlm-disc-row:hover { padding-left: 0; padding-right: 0; }
      .vlm-work-list { gap: 80px; }
      .vlm-work-spread, .vlm-work-spread.left, .vlm-work-spread.right { grid-template-columns: 1fr; gap: 32px; }
      .vlm-work-spread.right .vlm-work-image { order: 0; }
      .vlm-process-grid { grid-template-columns: 1fr; }
      .vlm-process-step { padding: 28px 0 !important; border-right: none !important; }
      .vlm-press-row { grid-template-columns: 60px 1fr 50px; gap: 16px; padding: 22px 0; }
      .vlm-press-row .vlm-press-item { grid-column: 1 / -1; padding-left: 76px; }
      .vlm-press-row:hover { padding-left: 0; padding-right: 0; background: transparent; }
      .vlm-clients-grid { grid-template-columns: 1fr; }
      .vlm-form { padding: 32px 22px; }
      .vlm-footer-masthead { grid-template-columns: 1fr; gap: 8px; text-align: center !important; }
      .vlm-footer-masthead > * { text-align: center !important; }
      .vlm-footer-bottom { flex-direction: column; gap: 14px; text-align: center; }
    }
  `;

  const navLinks = [
    { num: '01', label: 'Index', href: '#about' },
    { num: '02', label: 'Practice', href: '#disciplines' },
    { num: '03', label: 'Works', href: '#work' },
    { num: '04', label: 'Method', href: '#process' },
    { num: '05', label: 'Press', href: '#press' },
    { num: '06', label: 'Contact', href: '#contact' },
  ];

  const initials = name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const yearsExperience = c.yearsExperience || '12';
  const projectsCount = c.projectsCount || '84';
  const awardsCount = c.awardsCount || '17';
  const clientsCount = c.clientsCount || '46';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4200);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <div className="vlm-root">
      <style suppressHydrationWarning>{cssVars}</style>

      <nav className={`vlm-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="vlm-nav-inner">
          <a href="#top" className="vlm-nav-brand">
            <span>Vellum</span>
            <span className="vlm-nav-brand-dot" />
            <em>{username || 'studio'}</em>
          </a>
          <div className="vlm-nav-links">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="vlm-nav-link">
                <span style={{ color: 'var(--fg-faint)', fontFamily: 'var(--f-mono)', fontSize: 9.5, marginRight: 6, letterSpacing: '0.16em' }}>{l.num}</span>
                {l.label}
              </a>
            ))}
          </div>
          <div className="vlm-nav-actions">
            <button className="vlm-icon-btn" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <a href="#contact" className="vlm-nav-cta">Commission</a>
            <button className="vlm-mobile-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
        <div className="vlm-mobile-menu" onClick={() => setMenuOpen(false)}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href}>
              <em>{l.num}</em>{l.label}
            </a>
          ))}
          <a href="#contact"><em>07</em>Commission</a>
        </div>
      </nav>

      <header id="top" className="vlm-hero">
        <div className="vlm-shell">
          <div className="vlm-hero-masthead">
            <div className="vlm-smallcaps"><strong>{issueLabel}</strong></div>
            <div className="vlm-hero-masthead-issue">{heroDate}</div>
            <div className="vlm-smallcaps">{location}</div>
          </div>

          <div className="vlm-reveal" style={{ marginBottom: 0 }}>
            <div className="vlm-hero-feature">
              <span className="vlm-hero-feature-line" />
              <span>Featured — Folio of the Designer</span>
              <span className="vlm-hero-feature-line" />
            </div>
          </div>

          <div className="vlm-hero-stage">
            <h1 className="vlm-hero-headline vlm-reveal">
              {(() => {
                const parts = name.split(' ');
                const first = parts[0] || name;
                const rest = parts.slice(1).join(' ');
                return (
                  <>
                    <span className="vlm-hero-headline-line">{first}</span>
                    {rest && <span className="vlm-hero-headline-italic">{rest}</span>}
                  </>
                );
              })()}
            </h1>
            <aside className="vlm-hero-side vlm-reveal">
              <p className="vlm-hero-tagline">{tagline}</p>
              <div className="vlm-hero-meta">
                <div className="vlm-hero-meta-row">
                  <div className="vlm-hero-meta-label">Discipline</div>
                  <div className="vlm-hero-meta-value">{title}</div>
                </div>
                <div className="vlm-hero-meta-row">
                  <div className="vlm-hero-meta-label">Atelier</div>
                  <div className="vlm-hero-meta-value">{location}</div>
                </div>
                <div className="vlm-hero-meta-row">
                  <div className="vlm-hero-meta-label">Status</div>
                  <div className="vlm-hero-meta-value"><em>Open</em></div>
                </div>
              </div>
            </aside>
          </div>

          <div className="vlm-hero-folio vlm-reveal">
            <div className="vlm-hero-folio-item">
              <div className="vlm-hero-folio-num">{yearsExperience}<em>+</em></div>
              <div className="vlm-hero-folio-label">Years Practising</div>
            </div>
            <div className="vlm-hero-folio-item">
              <div className="vlm-hero-folio-num">{projectsCount}</div>
              <div className="vlm-hero-folio-label">Projects Delivered</div>
            </div>
            <div className="vlm-hero-folio-item">
              <div className="vlm-hero-folio-num">{awardsCount}</div>
              <div className="vlm-hero-folio-label">Awards & Mentions</div>
            </div>
            <div className="vlm-hero-folio-item">
              <div className="vlm-hero-folio-num">{clientsCount}</div>
              <div className="vlm-hero-folio-label">Clients Served</div>
            </div>
          </div>
        </div>
      </header>

      <section id="about" className="vlm-section vlm-about">
        <div className="vlm-shell">
          <div className="vlm-section-head vlm-reveal">
            <span className="vlm-section-head-num">Feature No. 01</span>
            <span className="vlm-section-head-line" />
            <span className="vlm-section-head-num">Index & Intro</span>
          </div>
          <h2 className="vlm-section-title vlm-reveal">A studio of <em>quiet rigour</em>.</h2>

          <div className="vlm-about-grid">
            <aside className="vlm-about-aside vlm-reveal">
              <div className="vlm-about-aside-monogram">{initials}</div>
              <div className="vlm-about-aside-title">{name.split(' ')[0]}</div>
              <div className="vlm-about-aside-mono">
                <div><strong>Born</strong> {c.born || 'Marseille'}</div>
                <div><strong>Based</strong> {location}</div>
                <div><strong>Trained</strong> {c.trained || 'ECAL, Lausanne'}</div>
                <div><strong>Practising</strong> Since {c.practiceSince || '2014'}</div>
              </div>
            </aside>
            <div className="vlm-about-body vlm-reveal">
              <p>{aboutP1}</p>
              <p>{aboutP2}</p>
              <div className="vlm-about-quote">{aboutQuote}</div>
              <p style={{ marginBottom: 0 }}>{c.aboutP3 || 'Beyond the studio, the practice contributes to typography journals, lectures occasionally, and maintains a personal archive of vernacular print sourced from flea markets and family attics.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="disciplines" className="vlm-section">
        <div className="vlm-shell">
          <div className="vlm-section-head vlm-reveal">
            <span className="vlm-section-head-num">Feature No. 02</span>
            <span className="vlm-section-head-line" />
            <span className="vlm-section-head-num">Practice</span>
          </div>
          <h2 className="vlm-section-title vlm-reveal">Disciplines <em>of the house</em>.</h2>

          <div className="vlm-disc-list vlm-reveal">
            {disciplines.map((d, i) => (
              <div key={i} className="vlm-disc-row">
                <div className="vlm-disc-num">{d.number || String(i + 1).padStart(2, '0')}</div>
                <div className="vlm-disc-title">{d.title}</div>
                <div className="vlm-disc-desc">{d.description}</div>
                <div className="vlm-disc-items">
                  {pl(d.items).map((it, j) => (
                    <div key={j} className="vlm-disc-item">
                      <span className="vlm-disc-item-bullet" />
                      {it}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="vlm-section vlm-work">
        <div className="vlm-shell">
          <div className="vlm-section-head vlm-reveal">
            <span className="vlm-section-head-num">Feature No. 03</span>
            <span className="vlm-section-head-line" />
            <span className="vlm-section-head-num">Selected Works</span>
          </div>
          <h2 className="vlm-section-title vlm-reveal">Folio of <em>selected works</em>.</h2>

          <div className="vlm-work-list">
            {works.map((w, i) => {
              const side = i % 2 === 0 ? 'left' : 'right';
              const grad = SPREAD_VISUALS[i % SPREAD_VISUALS.length];
              return (
                <article key={i} className={`vlm-work-spread ${side} vlm-reveal`}>
                  <div className="vlm-work-image">
                    <div className="vlm-work-image-bg" style={{ background: grad }}>
                      {w.image && <img src={w.image} alt={w.title} />}
                    </div>
                    <div className="vlm-work-image-frame" />
                    <div className="vlm-work-image-caption">{w.category || 'Plate'}</div>
                    <div className="vlm-work-image-folio">{String(i + 1).padStart(2, '0')}</div>
                  </div>
                  <div className="vlm-work-info">
                    <div className="vlm-work-info-feature">
                      <span className="vlm-work-info-feature-line" />
                      <span>Plate No. {String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="vlm-work-title">{w.title}{w.year && <em> — {w.year}</em>}</h3>
                    <div className="vlm-work-tags">
                      <span className="vlm-work-tag"><strong>{w.category}</strong></span>
                      {w.role && <span className="vlm-work-tag-sep" />}
                      {w.role && <span className="vlm-work-tag">{w.role}</span>}
                      {w.year && <span className="vlm-work-tag-sep" />}
                      {w.year && <span className="vlm-work-tag">{w.year}</span>}
                    </div>
                    <p className="vlm-work-desc">{w.description}</p>
                    {w.liveUrl && (
                      <a href={w.liveUrl} target="_blank" rel="noreferrer" className="vlm-work-link">
                        View the spread <ArrowOutIcon />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="process" className="vlm-section">
        <div className="vlm-shell">
          <div className="vlm-section-head vlm-reveal">
            <span className="vlm-section-head-num">Feature No. 04</span>
            <span className="vlm-section-head-line" />
            <span className="vlm-section-head-num">Method</span>
          </div>
          <h2 className="vlm-section-title vlm-reveal">A measured <em>method</em>.</h2>

          <div className="vlm-process-grid vlm-reveal">
            {process.map((p, i) => (
              <div key={i} className="vlm-process-step">
                <div className="vlm-process-num">{p.number || String(i + 1).padStart(2, '0')}</div>
                <h3 className="vlm-process-title">{p.title}</h3>
                <p className="vlm-process-desc">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="press" className="vlm-section vlm-press">
        <div className="vlm-shell">
          <div className="vlm-section-head vlm-reveal">
            <span className="vlm-section-head-num">Feature No. 05</span>
            <span className="vlm-section-head-line" />
            <span className="vlm-section-head-num">Press & Recognition</span>
          </div>
          <h2 className="vlm-section-title vlm-reveal">Reviewed <em>in print</em>.</h2>

          <div className="vlm-press-list vlm-reveal">
            {press.map((p, i) => {
              const Wrap: any = p.url ? 'a' : 'div';
              const wrapProps = p.url ? { href: p.url, target: '_blank', rel: 'noreferrer' } : {};
              return (
                <Wrap key={i} className="vlm-press-row" {...wrapProps}>
                  <div className="vlm-press-year">{p.year}</div>
                  <div className="vlm-press-pub">{p.publication}</div>
                  <div className="vlm-press-item">{p.item}</div>
                  <div className="vlm-press-arrow"><ArrowOutIcon /></div>
                </Wrap>
              );
            })}
          </div>
        </div>
      </section>

      <section id="clients" className="vlm-section">
        <div className="vlm-shell">
          <div className="vlm-section-head vlm-reveal">
            <span className="vlm-section-head-num">Feature No. 06</span>
            <span className="vlm-section-head-line" />
            <span className="vlm-section-head-num">Patrons</span>
          </div>
          <h2 className="vlm-section-title vlm-reveal">In trusted <em>company</em>.</h2>
          <div className="vlm-clients-grid vlm-reveal">
            {clients.map((cl, i) => (
              <div key={i} className="vlm-client-cell">{cl.name}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="vlm-section vlm-test">
        <div className="vlm-shell">
          <div className="vlm-section-head vlm-reveal">
            <span className="vlm-section-head-num">Feature No. 07</span>
            <span className="vlm-section-head-line" />
            <span className="vlm-section-head-num">Letters Received</span>
          </div>
          <h2 className="vlm-section-title vlm-reveal">Notes from <em>the patrons</em>.</h2>

          <div className="vlm-test-grid">
            {tests.map((t, i) => (
              <figure key={i} className="vlm-test-card vlm-reveal">
                <blockquote className="vlm-test-quote">{t.quote}</blockquote>
                <figcaption className="vlm-test-attr">
                  <div className="vlm-test-author">{t.author}</div>
                  <div className="vlm-test-role">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="vlm-section">
        <div className="vlm-shell">
          <div className="vlm-section-head vlm-reveal">
            <span className="vlm-section-head-num">Feature No. 08</span>
            <span className="vlm-section-head-line" />
            <span className="vlm-section-head-num">Correspondence</span>
          </div>
          <h2 className="vlm-section-title vlm-reveal">Get in <em>touch</em>.</h2>

          <div className="vlm-contact-grid">
            <aside className="vlm-contact-aside vlm-reveal">
              <div className="vlm-contact-tag">Yours, <br/>by post or pixel.</div>
              <div className="vlm-contact-detail">
                <span className="vlm-contact-detail-label">Correspondence</span>
                <span className="vlm-contact-detail-value">
                  <MailIcon />
                  <a href={`mailto:${email}`}>{email}</a>
                </span>
              </div>
              <div className="vlm-contact-detail">
                <span className="vlm-contact-detail-label">Atelier</span>
                <span className="vlm-contact-detail-value">
                  <PinIcon />
                  {location}
                </span>
              </div>
              <div className="vlm-contact-detail">
                <span className="vlm-contact-detail-label">Availability</span>
                <span className="vlm-contact-status">
                  <span className="vlm-contact-status-dot" />
                  {availability}
                </span>
              </div>
              <div className="vlm-contact-socials">
                {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" className="vlm-icon-btn" aria-label="Instagram"><InstagramIcon /></a>}
                {social.behance && <a href={social.behance} target="_blank" rel="noreferrer" className="vlm-icon-btn" aria-label="Behance"><BehanceIcon /></a>}
                {social.dribbble && <a href={social.dribbble} target="_blank" rel="noreferrer" className="vlm-icon-btn" aria-label="Dribbble"><DribbbleIcon /></a>}
                {social.linkedin && <a href={social.linkedin} target="_blank" rel="noreferrer" className="vlm-icon-btn" aria-label="LinkedIn"><LinkedinIcon /></a>}
                {social.twitter && <a href={social.twitter} target="_blank" rel="noreferrer" className="vlm-icon-btn" aria-label="Twitter"><TwitterIcon /></a>}
                {!social.instagram && !social.behance && !social.dribbble && !social.linkedin && !social.twitter && (
                  <>
                    <span className="vlm-icon-btn" aria-hidden><InstagramIcon /></span>
                    <span className="vlm-icon-btn" aria-hidden><BehanceIcon /></span>
                    <span className="vlm-icon-btn" aria-hidden><DribbbleIcon /></span>
                    <span className="vlm-icon-btn" aria-hidden><LinkedinIcon /></span>
                  </>
                )}
              </div>
            </aside>

            <form className="vlm-form vlm-reveal" onSubmit={handleSubmit}>
              <h3 className="vlm-form-title">A letter <em>for the studio</em>.</h3>
              <div className="vlm-form-field">
                <label className="vlm-form-label" htmlFor="vlm-n">Name</label>
                <input id="vlm-n" className="vlm-form-input" value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))} placeholder="Your name" required />
              </div>
              <div className="vlm-form-field">
                <label className="vlm-form-label" htmlFor="vlm-e">Email</label>
                <input id="vlm-e" type="email" className="vlm-form-input" value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))} placeholder="you@example.com" required />
              </div>
              <div className="vlm-form-field">
                <label className="vlm-form-label" htmlFor="vlm-m">Brief</label>
                <textarea id="vlm-m" className="vlm-form-textarea" value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))} placeholder="Tell me about the project, the season, the scope." required />
              </div>
              <button type="submit" className="vlm-form-submit">Send Letter</button>
              {formSent && <div className="vlm-form-sent">Thank you — the studio will reply within two working days.</div>}
            </form>
          </div>
        </div>
      </section>

      <footer className="vlm-footer">
        <div className="vlm-shell">
          <div className="vlm-footer-masthead">
            <div><strong>Vellum</strong> · {issueLabel}</div>
            <div>Printed in {location}</div>
            <div>{new Date().getFullYear()} · All Rights Reserved</div>
          </div>
          <div className="vlm-footer-bottom">
            <div className="vlm-footer-colophon">
              Set in <strong>Playfair Display</strong> & <strong>Inter</strong>. Pressed on cream stock.
            </div>
            <div className="vlm-footer-meta">
              {!hideBranding ? <>{name} · Built with <a href="https://folioforge.app" target="_blank" rel="noreferrer">FolioForge</a></> : <>{name}</>}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
