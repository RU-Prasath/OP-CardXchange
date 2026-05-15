'use client';

import { useState } from 'react';

interface Props {
  content: Record<string, string>;
  username: string;
  hideBranding?: boolean;
}

function pl(val: string | undefined): string[] {
  if (!val) return [];
  return val.split(',').map((s) => s.trim()).filter(Boolean);
}

function lines(val: string | undefined): string[] {
  if (!val) return [];
  return val.split('\n').map((s) => s.trim()).filter(Boolean);
}

function parseJ<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const BarChartIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const MegaphoneIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l18-8v18l-18-8v-2z" />
    <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

interface Stat { value: string; label: string; suffix?: string; }
interface Service { title: string; description: string; channels: string; deliverables: string; }
interface CaseResult { label: string; value: string; }
interface CaseStudy { client: string; industry: string; challenge: string; solution: string; results: CaseResult[]; channels: string; period: string; image?: string; }
interface ChannelGroup { category: string; items: string; }
interface Brand { name: string; }
interface Press { title: string; venue: string; year: string; url?: string; }
interface Testimonial { quote: string; author: string; role: string; company: string; result?: string; }

export default function PulseTemplate({ content, username, hideBranding }: Props) {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sent'>('idle');
  const c = content;

  const bg = c.colorBg || '#0d0d12';
  const fg = c.colorFg || '#f4f4f0';
  const accent = c.colorAccent || '#e8ff5a';
  const accent2 = c.colorAccent2 || '#ff3d8b';
  const line = c.colorLine || '#26262e';
  const card = c.colorCard || '#16161c';

  const darkVars = `
    --bg: ${bg};
    --fg: ${fg};
    --muted: #9a9aa6;
    --faint: #6a6a76;
    --line: ${line};
    --card: ${card};
    --card-alt: #1d1d24;
    --shadow: 0 20px 60px rgba(0,0,0,0.55);
  `;
  const lightVars = `
    --bg: #fafaf5;
    --fg: #0d0d12;
    --muted: #4a4a52;
    --faint: #7a7a82;
    --line: #e6e6df;
    --card: #ffffff;
    --card-alt: #f1f1ea;
    --shadow: 0 20px 60px rgba(0,0,0,0.08);
  `;

  const cssVars = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Archivo+Black&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    .pulse-template {
      ${dark ? darkVars : lightVars}
      --accent: ${accent};
      --accent-2: ${accent2};
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      background: var(--bg);
      color: var(--fg);
      min-height: 100vh;
      overflow-x: hidden;
    }
    .pulse-template * { box-sizing: border-box; margin: 0; padding: 0; }
    .pulse-template a { color: inherit; text-decoration: none; }
    .pulse-template button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    .pulse-template input, .pulse-template textarea { font-family: inherit; }
    .pulse-display { font-family: 'Archivo Black', 'Space Grotesk', sans-serif; letter-spacing: -0.02em; line-height: 0.92; text-transform: uppercase; }
    .pulse-grotesk { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
    .pulse-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

    @keyframes pulse-marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes pulse-ticker {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    @keyframes pulse-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    @keyframes pulse-grow {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }
    @keyframes pulse-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pulse-float {
      0%, 100% { transform: translateY(0) rotate(-8deg); }
      50% { transform: translateY(-8px) rotate(-4deg); }
    }

    .pulse-template .pulse-blink { animation: pulse-blink 1.6s ease-in-out infinite; }
    .pulse-template .pulse-bar { transform-origin: bottom; animation: pulse-grow 1.2s cubic-bezier(0.2,0.8,0.2,1) both; }

    .pulse-template .pulse-cta-primary {
      background: var(--accent);
      color: #0d0d12;
      font-weight: 700;
      padding: 16px 28px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
      box-shadow: 0 8px 0 rgba(0,0,0,0.2);
    }
    .pulse-template .pulse-cta-primary:hover {
      transform: translate(-2px, -2px);
      box-shadow: 10px 10px 0 rgba(0,0,0,0.25);
    }
    .pulse-template .pulse-cta-secondary {
      border: 2px solid var(--fg);
      color: var(--fg);
      font-weight: 600;
      padding: 14px 26px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: background 0.18s ease, color 0.18s ease;
    }
    .pulse-template .pulse-cta-secondary:hover {
      background: var(--fg);
      color: var(--bg);
    }

    .pulse-template .pulse-card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 28px;
      transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
    }
    .pulse-template .pulse-card:hover {
      transform: translateY(-4px);
      border-color: var(--accent);
    }

    .pulse-template .pulse-service-card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 28px;
      padding: 32px;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s ease;
    }
    .pulse-template .pulse-service-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
      opacity: 0;
      transition: opacity 0.35s ease;
      z-index: 0;
    }
    .pulse-template .pulse-service-card:hover { transform: translateY(-6px); }
    .pulse-template .pulse-service-card:hover::before { opacity: 1; }
    .pulse-template .pulse-service-card:hover .pulse-service-text { color: #0d0d12; }
    .pulse-template .pulse-service-content { position: relative; z-index: 1; }

    .pulse-template .pulse-channel-chip {
      display: inline-flex;
      align-items: center;
      padding: 10px 18px;
      border: 1.5px solid var(--line);
      border-radius: 999px;
      font-size: 14px;
      font-weight: 500;
      background: var(--card);
      transition: all 0.18s ease;
    }
    .pulse-template .pulse-channel-chip:hover {
      border-color: var(--accent);
      background: var(--accent);
      color: #0d0d12;
      transform: translateY(-2px);
    }

    .pulse-template .pulse-press-row {
      display: grid;
      grid-template-columns: 60px 1fr auto auto;
      gap: 24px;
      align-items: center;
      padding: 24px 0;
      border-bottom: 1px solid var(--line);
      transition: padding 0.2s ease;
    }
    .pulse-template .pulse-press-row:hover { padding-left: 12px; }

    .pulse-template .pulse-nav-link {
      position: relative;
      padding: 6px 0;
    }
    .pulse-template .pulse-nav-link::after {
      content: '';
      position: absolute;
      left: 0; bottom: 0;
      width: 0; height: 2px;
      background: var(--accent);
      transition: width 0.22s ease;
    }
    .pulse-template .pulse-nav-link:hover::after { width: 100%; }

    .pulse-template .pulse-input {
      width: 100%;
      padding: 16px 20px;
      background: var(--card);
      border: 1.5px solid var(--line);
      border-radius: 14px;
      color: var(--fg);
      font-size: 15px;
      transition: border-color 0.2s ease;
      outline: none;
    }
    .pulse-template .pulse-input:focus { border-color: var(--accent); }
    .pulse-template .pulse-input::placeholder { color: var(--faint); }

    .pulse-template .pulse-marquee-track {
      display: flex;
      gap: 64px;
      animation: pulse-marquee 32s linear infinite;
      width: max-content;
    }
    .pulse-template .pulse-ticker-track {
      display: flex;
      gap: 36px;
      animation: pulse-marquee 22s linear infinite;
      width: max-content;
    }

    .pulse-template .pulse-rotated-tag {
      display: inline-block;
      animation: pulse-float 5s ease-in-out infinite;
    }

    .pulse-template .pulse-mobile-menu { display: none; }
    .pulse-template .pulse-mobile-toggle { display: none; }

    @media (max-width: 1024px) {
      .pulse-template .pulse-services-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .pulse-template .pulse-stats-row { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 768px) {
      .pulse-template .pulse-desktop-nav { display: none !important; }
      .pulse-template .pulse-mobile-toggle { display: inline-flex !important; }
      .pulse-template .pulse-services-grid { grid-template-columns: 1fr !important; }
      .pulse-template .pulse-stats-row { grid-template-columns: 1fr !important; }
      .pulse-template .pulse-case-grid { grid-template-columns: 1fr !important; }
      .pulse-template .pulse-channels-grid { grid-template-columns: 1fr !important; }
      .pulse-template .pulse-brands-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .pulse-template .pulse-testimonial-grid { grid-template-columns: 1fr !important; }
      .pulse-template .pulse-contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      .pulse-template .pulse-press-row { grid-template-columns: 1fr; gap: 8px !important; padding: 18px 0 !important; }
      .pulse-template .pulse-section { padding: 80px 20px !important; }
      .pulse-template .pulse-hero { padding: 120px 20px 60px !important; }
      .pulse-template .pulse-nav-inner { padding: 14px 20px !important; }
      .pulse-template .pulse-cta-row { flex-direction: column; align-items: stretch !important; }
      .pulse-template .pulse-cta-primary, .pulse-template .pulse-cta-secondary { justify-content: center; }
      .pulse-template .pulse-hero-meta { flex-direction: column; align-items: flex-start !important; gap: 16px !important; }
    }
    @media (max-width: 480px) {
      .pulse-template .pulse-brands-grid { grid-template-columns: 1fr !important; }
    }
  `;

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navLinks = [
    { href: '#work', label: 'Work' },
    { href: '#services', label: 'Services' },
    { href: '#results', label: 'Results' },
    { href: '#press', label: 'Press' },
    { href: '#contact', label: 'Contact' },
  ];

  const name = c.name || 'Alex Rivera';
  const title = c.title || 'Growth Marketing Lead';
  const heroHeadline = c.heroHeadline || 'I help SaaS brands grow from $1M to $10M ARR.';
  const subtitle = c.subtitle || 'Performance-driven marketer with 8+ years scaling B2B and DTC brands through paid, organic, and lifecycle channels.';
  const brandStrip = pl(c.brandStrip);
  const brandStripDefault = brandStrip.length > 0 ? brandStrip : ['Notion', 'Linear', 'Figma', 'Vercel', 'Stripe', 'Webflow'];

  const stats = parseJ<Stat[]>(c.statsJson, [
    { value: '50', label: 'Revenue driven', suffix: 'M+' },
    { value: '300', label: 'Average ROAS', suffix: '%' },
    { value: '120', label: 'Campaigns shipped', suffix: '+' },
    { value: '8', label: 'Years scaling brands', suffix: 'y' },
  ]);

  const services = parseJ<Service[]>(c.servicesJson, [
    { title: 'Paid Media', description: 'Multi-channel paid acquisition that scales profitably from $10k to $1M+/mo.', channels: 'Google Ads, Meta, LinkedIn, TikTok', deliverables: 'Strategy, Creative, Reporting' },
    { title: 'SEO & Content', description: 'Topic clusters, technical audits, and content engines that compound.', channels: 'Ahrefs, Surfer, Clearscope', deliverables: 'Audit, Roadmap, Briefs' },
    { title: 'Lifecycle & Email', description: 'Onboarding, retention, and re-engagement flows that move the needle.', channels: 'HubSpot, Klaviyo, Customer.io', deliverables: 'Flows, Segments, Tests' },
    { title: 'Growth Experiments', description: 'High-tempo experimentation across funnel — from ads to activation.', channels: 'Mixpanel, Amplitude, GA4', deliverables: 'Backlog, A/Bs, Insights' },
    { title: 'Brand & Positioning', description: 'Sharp messaging that converts. Built on customer research, not vibes.', channels: 'JTBD interviews, Wynter, UserTesting', deliverables: 'Messaging, Site copy' },
    { title: 'GTM Strategy', description: 'Launch plans for new products, segments, and regions.', channels: 'Cross-functional', deliverables: 'GTM doc, KPIs, Rituals' },
  ]);

  const caseStudies = parseJ<CaseStudy[]>(c.caseStudiesJson, [
    {
      client: 'NorthBeam SaaS',
      industry: 'B2B SaaS · Series A',
      challenge: 'Stuck at $1.2M ARR with rising CAC and unclear ICP signal across channels.',
      solution: 'Rebuilt ICP, killed unprofitable spend, launched ABM motion + content engine.',
      results: [
        { label: 'ARR growth', value: '+412%' },
        { label: 'CAC payback', value: '6 mo' },
        { label: 'Pipeline lift', value: '3.2x' },
        { label: 'Demo-to-close', value: '+38%' },
      ],
      channels: 'LinkedIn Ads, ABM, SEO',
      period: '2023 — 2024',
    },
    {
      client: 'Lumen DTC',
      industry: 'DTC · Wellness',
      challenge: 'Black Friday roadmap with $80k budget vs $400k goal. Inventory risk on both ends.',
      solution: 'Creative testing sprint, retention flow rebuild, lookalike laddering on Meta.',
      results: [
        { label: 'BFCM revenue', value: '$1.1M' },
        { label: 'Blended ROAS', value: '4.8x' },
        { label: 'New customers', value: '+9,400' },
        { label: 'Email rev share', value: '32%' },
      ],
      channels: 'Meta, TikTok, Klaviyo',
      period: 'Q4 2023',
    },
    {
      client: 'Orbit Analytics',
      industry: 'B2B SaaS · Seed',
      challenge: 'Pre-PMF launch with no demand signal and a generic positioning story.',
      solution: 'JTBD research, repositioned to a niche, launched founder-led content + community.',
      results: [
        { label: 'Waitlist', value: '6,200' },
        { label: 'Trial conv.', value: '+62%' },
        { label: 'Inbound MQLs', value: '180/mo' },
        { label: 'CAC', value: '-44%' },
      ],
      channels: 'LinkedIn, Newsletter, Community',
      period: '2024',
    },
  ]);

  const channels = parseJ<ChannelGroup[]>(c.channelsJson, [
    { category: 'Paid', items: 'Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads, Reddit Ads' },
    { category: 'Analytics', items: 'GA4, Mixpanel, Amplitude, Looker, Hotjar' },
    { category: 'CRM & Lifecycle', items: 'HubSpot, Salesforce, Klaviyo, Customer.io, Iterable' },
    { category: 'SEO & Content', items: 'Ahrefs, Semrush, Surfer, Clearscope, Frase' },
    { category: 'Web & CRO', items: 'Webflow, Framer, VWO, Optimizely' },
    { category: 'Ops', items: 'Notion, Linear, Slack, Zapier, Make' },
  ]);

  const brands = parseJ<Brand[]>(c.brandsJson, [
    { name: 'NorthBeam' }, { name: 'Lumen' }, { name: 'Orbit' }, { name: 'Cobalt' },
    { name: 'Harbor' }, { name: 'Atlas Labs' }, { name: 'Ember' }, { name: 'Forge' },
    { name: 'Mira' }, { name: 'Volt' }, { name: 'Beacon' }, { name: 'Quill' },
  ]);

  const press = parseJ<Press[]>(c.pressJson, [
    { title: 'How to build a content engine in 90 days', venue: 'SaaStr Podcast', year: '2024', url: '#' },
    { title: 'The death of CAC: rethinking acquisition in 2025', venue: 'Demand Curve', year: '2024', url: '#' },
    { title: 'Lifecycle marketing for early-stage SaaS', venue: 'Reforge Summit', year: '2023', url: '#' },
    { title: 'Cracking ABM at Series A', venue: 'GTM Live', year: '2023', url: '#' },
  ]);

  const testimonials = parseJ<Testimonial[]>(c.testimonialsJson, [
    { quote: 'We tripled pipeline in 6 months and finally felt confident in our numbers. Best growth hire I have ever made.', author: 'Sarah Chen', role: 'CEO', company: 'NorthBeam', result: '3x pipeline in 6 mo' },
    { quote: 'Sharpest marketer I have worked with. Owns the number, ships the work, and brings the whole team up.', author: 'Marcus Patel', role: 'Founder', company: 'Orbit Analytics', result: '+62% trial conversion' },
    { quote: 'BFCM was a masterclass. Beat our stretch goal by 175% with half the team we expected to need.', author: 'Jade Morales', role: 'VP Marketing', company: 'Lumen', result: '$1.1M in 4 days' },
  ]);

  const tickerItems = parseJ<string[]>(c.tickerJson, [
    '$50M+ REVENUE DRIVEN',
    '300% AVG ROAS',
    '120+ CAMPAIGNS',
    'AVAILABLE Q3 2025',
    'B2B SAAS · DTC · MARKETPLACES',
    'BASED IN ' + (c.location || 'NEW YORK').toUpperCase(),
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sent');
    setTimeout(() => setFormStatus('idle'), 3000);
  };

  const contactEmail = c.contactEmail || 'hello@alexrivera.co';
  const calendarUrl = c.calendarUrl || '#';
  const location = c.location || 'New York, NY';
  const linkedinUrl = c.linkedinUrl || '#';
  const twitterUrl = c.twitterUrl || '#';
  const websiteUrl = c.websiteUrl || '';

  const accentInk = '#0d0d12';

  return (
    <div className="pulse-template">
      <style suppressHydrationWarning>{cssVars}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: dark ? 'rgba(13,13,18,0.82)' : 'rgba(250,250,245,0.85)',
        backdropFilter: 'saturate(180%) blur(16px)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div className="pulse-nav-inner" style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '18px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <a href="#top" onClick={(e) => scrollTo(e, '#top')} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--accent)', color: accentInk,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Archivo Black, sans-serif', fontSize: 18,
            }}>P</span>
            <span className="pulse-grotesk" style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
              {name.split(' ')[0]}<span style={{ color: 'var(--accent)' }}>.</span>
            </span>
          </a>

          <div className="pulse-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {navLinks.map((l) => (
              <a key={l.href} className="pulse-nav-link pulse-grotesk" href={l.href} onClick={(e) => scrollTo(e, l.href)}
                style={{ fontSize: 14, fontWeight: 500 }}>
                {l.label}
              </a>
            ))}
            <button onClick={() => setDark(!dark)} aria-label="Toggle theme"
              style={{
                width: 38, height: 38, borderRadius: 999,
                border: '1.5px solid var(--line)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--fg)',
              }}>
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <a href="#contact" onClick={(e) => scrollTo(e, '#contact')} className="pulse-cta-primary" style={{ padding: '12px 22px', fontSize: 14 }}>
              Work with me <ArrowUpRightIcon />
            </a>
          </div>

          <button className="pulse-mobile-toggle" aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              width: 42, height: 42, borderRadius: 12,
              border: '1.5px solid var(--line)',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}>
            <span style={{ width: 18, height: 2, background: 'var(--fg)', transform: menuOpen ? 'rotate(45deg) translateY(5px)' : 'none', transition: 'transform 0.2s' }} />
            <span style={{ width: 18, height: 2, background: 'var(--fg)', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
            <span style={{ width: 18, height: 2, background: 'var(--fg)', transform: menuOpen ? 'rotate(-45deg) translateY(-5px)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {menuOpen && (
          <div style={{
            padding: '12px 20px 24px',
            borderTop: '1px solid var(--line)',
            background: 'var(--bg)',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => scrollTo(e, l.href)}
                className="pulse-grotesk"
                style={{
                  padding: '14px 12px', fontSize: 18, fontWeight: 600,
                  borderBottom: '1px solid var(--line)',
                }}>
                {l.label}
              </a>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={() => setDark(!dark)} aria-label="Toggle theme"
                style={{
                  flex: 1, padding: 12, borderRadius: 12,
                  border: '1.5px solid var(--line)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                {dark ? <SunIcon /> : <MoonIcon />}
                <span style={{ fontSize: 14 }}>{dark ? 'Light' : 'Dark'}</span>
              </button>
              <a href="#contact" onClick={(e) => scrollTo(e, '#contact')} className="pulse-cta-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px 18px', fontSize: 14 }}>
                Work with me
              </a>
            </div>
          </div>
        )}
      </nav>

      <section id="top" className="pulse-hero" style={{
        position: 'relative',
        padding: '120px 32px 100px',
        maxWidth: 1280, margin: '0 auto',
      }}>
        <div style={{
          position: 'absolute', top: 80, right: 40,
          width: 220, height: 220,
          background: 'var(--accent)',
          opacity: 0.18, filter: 'blur(60px)',
          borderRadius: '50%', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span className="pulse-blink" style={{
              width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)',
              boxShadow: '0 0 12px var(--accent)',
            }} />
            <span className="pulse-mono" style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Available · {title}
            </span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <span className="pulse-grotesk" style={{
              fontSize: 18, fontWeight: 500, color: 'var(--muted)',
            }}>
              {name}
            </span>
          </div>

          <h1 className="pulse-display" style={{
            fontSize: 'clamp(48px, 9vw, 140px)',
            fontWeight: 900,
            marginBottom: 36,
            maxWidth: 1100,
          }}>
            {heroHeadline.split(' ').map((word, i, arr) => {
              const isAccent = i === arr.length - 1 || /\$|\d|%|ARR|ROI/i.test(word);
              return (
                <span key={i} style={{
                  color: isAccent ? 'var(--accent)' : 'inherit',
                  marginRight: '0.25em',
                  display: 'inline-block',
                }}>
                  {word}
                </span>
              );
            })}
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 1.4vw, 20px)',
            color: 'var(--muted)',
            maxWidth: 680, lineHeight: 1.55,
            marginBottom: 44,
          }}>
            {subtitle}
          </p>

          <div className="pulse-cta-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 64, flexWrap: 'wrap' }}>
            <a href="#contact" onClick={(e) => scrollTo(e, '#contact')} className="pulse-cta-primary">
              Book a call <ArrowUpRightIcon />
            </a>
            <a href="#work" onClick={(e) => scrollTo(e, '#work')} className="pulse-cta-secondary">
              See the work
            </a>
            <span className="pulse-rotated-tag pulse-mono" style={{
              padding: '8px 14px',
              background: 'var(--accent)',
              color: accentInk,
              fontSize: 12, fontWeight: 700,
              borderRadius: 6,
              transform: 'rotate(-8deg)',
              marginLeft: 8,
            }}>
              NOW BOOKING
            </span>
          </div>

          <div className="pulse-hero-meta" style={{
            display: 'flex', alignItems: 'center', gap: 32,
            paddingTop: 28,
            borderTop: '1px solid var(--line)',
          }}>
            <span className="pulse-mono" style={{ fontSize: 12, color: 'var(--faint)', letterSpacing: '0.1em' }}>
              TRUSTED BY
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center' }}>
              {brandStripDefault.map((b, i) => (
                <span key={i} className="pulse-grotesk" style={{
                  fontSize: 18, fontWeight: 600, color: 'var(--muted)',
                  letterSpacing: '-0.01em',
                }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{
        background: 'var(--accent)',
        color: accentInk,
        padding: '18px 0',
        borderTop: '1px solid ' + accentInk,
        borderBottom: '1px solid ' + accentInk,
        overflow: 'hidden',
      }}>
        <div className="pulse-ticker-track">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className="pulse-display" style={{ fontSize: 22, fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: 36 }}>
              {t}
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: accentInk }} />
            </span>
          ))}
        </div>
      </section>

      <section id="results" className="pulse-section" style={{
        padding: '120px 32px',
        maxWidth: 1280, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 64, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="pulse-mono" style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 16 }}>
              / 01 — THE NUMBERS
            </div>
            <h2 className="pulse-display" style={{ fontSize: 'clamp(40px, 6vw, 88px)' }}>
              Results that<br /><span style={{ color: 'var(--accent)' }}>compound.</span>
            </h2>
          </div>
          <p style={{ maxWidth: 380, color: 'var(--muted)', fontSize: 17, lineHeight: 1.5 }}>
            Eight years of scaling brands has taught me one thing — the work shows up in the numbers, or it does not show up at all.
          </p>
        </div>

        <div className="pulse-stats-row" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
          gap: 1,
          background: 'var(--line)',
          border: '1px solid var(--line)',
          borderRadius: 24,
          overflow: 'hidden',
        }}>
          {stats.map((s, i) => {
            const barHeights = [62, 78, 45, 88, 55, 70];
            return (
              <div key={i} style={{
                background: 'var(--card)',
                padding: '40px 28px',
                position: 'relative',
              }}>
                <div className="pulse-display" style={{
                  fontSize: 'clamp(56px, 8vw, 120px)',
                  fontWeight: 900,
                  color: 'var(--fg)',
                  lineHeight: 0.9,
                }}>
                  {s.value}
                  <span style={{ color: 'var(--accent)' }}>{s.suffix || ''}</span>
                </div>
                <div className="pulse-grotesk" style={{ fontSize: 14, color: 'var(--muted)', marginTop: 16, fontWeight: 500 }}>
                  {s.label}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'flex-end', gap: 4, height: 32, marginTop: 20,
                }}>
                  {[0, 1, 2, 3, 4, 5].map((b) => (
                    <div key={b} className="pulse-bar" style={{
                      flex: 1,
                      height: `${(barHeights[(i + b) % barHeights.length])}%`,
                      background: b === 5 ? 'var(--accent)' : 'var(--line)',
                      borderRadius: 2,
                      animationDelay: `${b * 0.05}s`,
                    }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="services" className="pulse-section" style={{
        padding: '120px 32px',
        background: 'var(--card-alt)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 64, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="pulse-mono" style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 16 }}>
                / 02 — WHAT I DO
              </div>
              <h2 className="pulse-display" style={{ fontSize: 'clamp(40px, 6vw, 88px)' }}>
                Full-funnel<br />growth, end<br />to <span style={{ color: 'var(--accent)' }}>end.</span>
              </h2>
            </div>
            <p style={{ maxWidth: 380, color: 'var(--muted)', fontSize: 17, lineHeight: 1.5 }}>
              I run paid, organic, lifecycle and brand as one machine — not six disconnected channels chasing different KPIs.
            </p>
          </div>

          <div className="pulse-services-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}>
            {services.map((s, i) => {
              const ServiceIcons = [MegaphoneIcon, TargetIcon, MailIcon, BarChartIcon, TrendingUpIcon, GlobeIcon];
              const Icon = ServiceIcons[i % ServiceIcons.length];
              return (
                <div key={i} className="pulse-service-card">
                  <div className="pulse-service-content pulse-service-text">
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: 'var(--bg)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 24,
                      color: 'var(--accent)',
                    }}>
                      <Icon />
                    </div>
                    <div className="pulse-mono" style={{ fontSize: 12, opacity: 0.6, letterSpacing: '0.08em', marginBottom: 8 }}>
                      0{i + 1}
                    </div>
                    <h3 className="pulse-display" style={{ fontSize: 28, marginBottom: 14, letterSpacing: '-0.01em' }}>
                      {s.title}
                    </h3>
                    <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 24, opacity: 0.85 }}>
                      {s.description}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <div className="pulse-mono" style={{ fontSize: 11, opacity: 0.55, letterSpacing: '0.08em', marginBottom: 4 }}>
                          CHANNELS
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{s.channels}</div>
                      </div>
                      <div>
                        <div className="pulse-mono" style={{ fontSize: 11, opacity: 0.55, letterSpacing: '0.08em', marginBottom: 4 }}>
                          DELIVERABLES
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{s.deliverables}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="work" className="pulse-section" style={{
        padding: '120px 32px',
        maxWidth: 1280, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 64, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="pulse-mono" style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 16 }}>
              / 03 — SELECTED WORK
            </div>
            <h2 className="pulse-display" style={{ fontSize: 'clamp(40px, 6vw, 88px)' }}>
              Case<br />stud<span style={{ color: 'var(--accent)' }}>ies.</span>
            </h2>
          </div>
          <p style={{ maxWidth: 380, color: 'var(--muted)', fontSize: 17, lineHeight: 1.5 }}>
            A few of my favorite wins. Real numbers, real teams, real revenue.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {caseStudies.map((cs, i) => (
            <article key={i} style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 32,
              padding: 'clamp(28px, 4vw, 56px)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 160, height: 160,
                background: i % 2 === 0 ? 'var(--accent)' : 'var(--accent-2)',
                opacity: 0.08, filter: 'blur(40px)', borderRadius: '50%',
              }} />

              <div className="pulse-case-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 48,
                position: 'relative',
                zIndex: 1,
              }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
                    <span className="pulse-mono" style={{
                      fontSize: 11, padding: '6px 12px',
                      background: 'var(--accent)', color: accentInk,
                      borderRadius: 999, fontWeight: 700, letterSpacing: '0.06em',
                    }}>
                      CASE 0{i + 1}
                    </span>
                    <span className="pulse-mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.05em' }}>
                      {cs.period}
                    </span>
                  </div>

                  <h3 className="pulse-display" style={{ fontSize: 'clamp(32px, 4.5vw, 64px)', marginBottom: 12 }}>
                    {cs.client}
                  </h3>
                  <div className="pulse-grotesk" style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32, fontWeight: 500 }}>
                    {cs.industry}
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <div className="pulse-mono" style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '0.1em', marginBottom: 10 }}>
                      THE CHALLENGE
                    </div>
                    <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--fg)' }}>
                      {cs.challenge}
                    </p>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <div className="pulse-mono" style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '0.1em', marginBottom: 10 }}>
                      THE PLAY
                    </div>
                    <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--fg)' }}>
                      {cs.solution}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {pl(cs.channels).map((ch, j) => (
                      <span key={j} style={{
                        padding: '6px 12px',
                        border: '1px solid var(--line)',
                        borderRadius: 999,
                        fontSize: 12, fontWeight: 500,
                      }}>
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="pulse-mono" style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '0.1em', marginBottom: 20 }}>
                    THE RESULTS
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 1,
                    background: 'var(--line)',
                    border: '1px solid var(--line)',
                    borderRadius: 20,
                    overflow: 'hidden',
                  }}>
                    {cs.results.map((r, j) => (
                      <div key={j} style={{
                        background: 'var(--card-alt)',
                        padding: '28px 22px',
                      }}>
                        <div className="pulse-display" style={{
                          fontSize: 'clamp(34px, 4.5vw, 56px)',
                          color: j === 0 ? 'var(--accent)' : 'var(--fg)',
                          lineHeight: 0.95,
                          marginBottom: 8,
                        }}>
                          {r.value}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
                          {r.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    marginTop: 24,
                    padding: '18px 22px',
                    background: 'var(--bg)',
                    border: '1.5px dashed var(--line)',
                    borderRadius: 16,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <TrendingUpIcon />
                    <span className="pulse-grotesk" style={{ fontSize: 14, fontWeight: 600 }}>
                      Headline result: <span style={{ color: 'var(--accent)' }}>{cs.results[0]?.value} {cs.results[0]?.label}</span>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="channels" className="pulse-section" style={{
        padding: '120px 32px',
        background: 'var(--card-alt)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 64, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="pulse-mono" style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 16 }}>
                / 04 — THE STACK
              </div>
              <h2 className="pulse-display" style={{ fontSize: 'clamp(40px, 6vw, 88px)' }}>
                Channels<br /><span style={{ color: 'var(--accent)' }}>+ tools.</span>
              </h2>
            </div>
            <p style={{ maxWidth: 380, color: 'var(--muted)', fontSize: 17, lineHeight: 1.5 }}>
              Channels I have shipped in production — and the tools I reach for to make them sing.
            </p>
          </div>

          <div className="pulse-channels-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 24,
          }}>
            {channels.map((g, i) => (
              <div key={i} style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 24,
                padding: 32,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h3 className="pulse-display" style={{ fontSize: 26 }}>
                    {g.category}
                  </h3>
                  <span className="pulse-mono" style={{
                    fontSize: 12, color: 'var(--muted)',
                    padding: '4px 10px',
                    border: '1px solid var(--line)',
                    borderRadius: 999,
                  }}>
                    {pl(g.items).length} tools
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {pl(g.items).map((item, j) => (
                    <span key={j} className="pulse-channel-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="brands" className="pulse-section" style={{
        padding: '100px 0',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 60px' }}>
          <div className="pulse-mono" style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 16 }}>
            / 05 — BRANDS
          </div>
          <h2 className="pulse-display" style={{ fontSize: 'clamp(40px, 6vw, 88px)' }}>
            Worked<br />with<span style={{ color: 'var(--accent)' }}>.</span>
          </h2>
        </div>

        <div style={{ overflow: 'hidden', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '32px 0' }}>
          <div className="pulse-marquee-track">
            {[...brands, ...brands].map((b, i) => (
              <span key={i} className="pulse-display" style={{
                fontSize: 'clamp(40px, 5vw, 72px)',
                color: 'var(--muted)',
                whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center', gap: 64,
              }}>
                {b.name}
                <span style={{
                  display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
                  background: 'var(--accent)',
                }} />
              </span>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 32px 0' }}>
          <div className="pulse-brands-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: 'var(--line)',
            border: '1px solid var(--line)',
            borderRadius: 20,
            overflow: 'hidden',
          }}>
            {brands.map((b, i) => (
              <div key={i} style={{
                background: 'var(--card)',
                padding: '36px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s ease',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--card)')}>
                <span className="pulse-display" style={{ fontSize: 22 }}>
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="press" className="pulse-section" style={{
        padding: '120px 32px',
        background: 'var(--card-alt)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="pulse-mono" style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 16 }}>
                / 06 — PRESS & SPEAKING
              </div>
              <h2 className="pulse-display" style={{ fontSize: 'clamp(40px, 6vw, 88px)' }}>
                On the<br /><span style={{ color: 'var(--accent)' }}>record.</span>
              </h2>
            </div>
            <p style={{ maxWidth: 380, color: 'var(--muted)', fontSize: 17, lineHeight: 1.5 }}>
              Selected talks, podcasts and articles where I have shared what is working — and what is not.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--line)' }}>
            {press.map((p, i) => (
              <a key={i} href={p.url || '#'} target="_blank" rel="noopener noreferrer" className="pulse-press-row">
                <span className="pulse-mono" style={{ fontSize: 14, color: 'var(--muted)' }}>
                  0{i + 1}
                </span>
                <span className="pulse-grotesk" style={{ fontSize: 'clamp(18px, 2vw, 22px)', fontWeight: 600 }}>
                  {p.title}
                </span>
                <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>
                  {p.venue} · {p.year}
                </span>
                <span style={{ color: 'var(--accent)' }}>
                  <ArrowUpRightIcon />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="pulse-section" style={{
        padding: '120px 32px',
        maxWidth: 1280, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 64, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="pulse-mono" style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 16 }}>
              / 07 — KIND WORDS
            </div>
            <h2 className="pulse-display" style={{ fontSize: 'clamp(40px, 6vw, 88px)' }}>
              From the<br />people I<br /><span style={{ color: 'var(--accent)' }}>worked with.</span>
            </h2>
          </div>
        </div>

        <div className="pulse-testimonial-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }}>
          {testimonials.map((t, i) => {
            const isFeatured = i === 0;
            return (
              <div key={i} style={{
                background: isFeatured ? 'var(--accent)' : 'var(--card)',
                color: isFeatured ? accentInk : 'var(--fg)',
                border: '1px solid ' + (isFeatured ? 'var(--accent)' : 'var(--line)'),
                borderRadius: 28,
                padding: 36,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                minHeight: 320,
                gridColumn: isFeatured ? 'span 1' : 'span 1',
              }}>
                <div>
                  <div className="pulse-display" style={{
                    fontSize: 64,
                    lineHeight: 1,
                    marginBottom: 16,
                    opacity: 0.5,
                  }}>
                    &ldquo;
                  </div>
                  <p className="pulse-grotesk" style={{
                    fontSize: 'clamp(18px, 1.7vw, 22px)',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    letterSpacing: '-0.01em',
                  }}>
                    {t.quote}
                  </p>
                </div>

                <div style={{ marginTop: 28 }}>
                  {t.result && (
                    <div style={{
                      display: 'inline-flex',
                      padding: '6px 12px',
                      background: isFeatured ? accentInk : 'var(--accent)',
                      color: isFeatured ? 'var(--accent)' : accentInk,
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 18,
                      fontFamily: 'JetBrains Mono, monospace',
                      letterSpacing: '0.04em',
                    }}>
                      {t.result}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44, height: 44,
                      borderRadius: '50%',
                      background: isFeatured ? accentInk : 'var(--accent)',
                      color: isFeatured ? 'var(--accent)' : accentInk,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Archivo Black, sans-serif',
                      fontSize: 16,
                    }}>
                      {t.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="pulse-grotesk" style={{ fontWeight: 700, fontSize: 15 }}>
                        {t.author}
                      </div>
                      <div style={{ fontSize: 13, opacity: 0.7 }}>
                        {t.role} · {t.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="contact" className="pulse-section" style={{
        padding: '120px 32px',
        background: 'var(--card-alt)',
        borderTop: '1px solid var(--line)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div className="pulse-mono" style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 16 }}>
              / 08 — GET IN TOUCH
            </div>
            <h2 className="pulse-display" style={{ fontSize: 'clamp(48px, 9vw, 140px)', marginBottom: 24 }}>
              Let&rsquo;s<br /><span style={{ color: 'var(--accent)' }}>talk.</span>
            </h2>
            <p style={{ maxWidth: 540, color: 'var(--muted)', fontSize: 18, lineHeight: 1.55 }}>
              Working on a new launch, stuck at a growth ceiling, or just want to compare notes on what is working? Drop a line.
            </p>
          </div>

          <div className="pulse-contact-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
          }}>
            <div>
              <div className="pulse-mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 20 }}>
                DIRECT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
                <a href={`mailto:${contactEmail}`} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '18px 22px',
                  background: 'var(--card)',
                  border: '1.5px solid var(--line)',
                  borderRadius: 16,
                  transition: 'border-color 0.2s ease',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}>
                  <span style={{ color: 'var(--accent)' }}><MailIcon /></span>
                  <div style={{ flex: 1 }}>
                    <div className="pulse-mono" style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '0.06em' }}>EMAIL</div>
                    <div style={{ fontSize: 15, fontWeight: 500, wordBreak: 'break-all' }}>{contactEmail}</div>
                  </div>
                  <ArrowUpRightIcon />
                </a>

                <a href={calendarUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '18px 22px',
                  background: 'var(--card)',
                  border: '1.5px solid var(--line)',
                  borderRadius: 16,
                  transition: 'border-color 0.2s ease',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}>
                  <span style={{ color: 'var(--accent)' }}><CalendarIcon /></span>
                  <div style={{ flex: 1 }}>
                    <div className="pulse-mono" style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '0.06em' }}>BOOK A CALL</div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>30-min intro call</div>
                  </div>
                  <ArrowUpRightIcon />
                </a>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '18px 22px',
                  background: 'var(--card)',
                  border: '1.5px solid var(--line)',
                  borderRadius: 16,
                }}>
                  <span style={{ color: 'var(--accent)' }}><MapPinIcon /></span>
                  <div style={{ flex: 1 }}>
                    <div className="pulse-mono" style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '0.06em' }}>BASED IN</div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{location}</div>
                  </div>
                </div>
              </div>

              <div className="pulse-mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 16 }}>
                ELSEWHERE
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{
                  width: 48, height: 48,
                  border: '1.5px solid var(--line)',
                  borderRadius: 14,
                  background: 'var(--card)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = accentInk; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--fg)'; }}>
                  <LinkedinIcon />
                </a>
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" style={{
                  width: 48, height: 48,
                  border: '1.5px solid var(--line)',
                  borderRadius: 14,
                  background: 'var(--card)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = accentInk; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--fg)'; }}>
                  <TwitterIcon />
                </a>
                {websiteUrl && (
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Website" style={{
                    width: 48, height: 48,
                    border: '1.5px solid var(--line)',
                    borderRadius: 14,
                    background: 'var(--card)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = accentInk; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--fg)'; }}>
                    <GlobeIcon />
                  </a>
                )}
              </div>
            </div>

            <div>
              <div className="pulse-mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 20 }}>
                OR SEND A NOTE
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input className="pulse-input" placeholder="Your name" type="text" required />
                <input className="pulse-input" placeholder="Email address" type="email" required />
                <input className="pulse-input" placeholder="Company / project" type="text" />
                <textarea className="pulse-input" placeholder="What are you working on?" rows={5} required style={{ resize: 'vertical', minHeight: 120 }} />
                <button type="submit" className="pulse-cta-primary" style={{ justifyContent: 'center', marginTop: 6 }}>
                  {formStatus === 'sent' ? 'Sent — talk soon!' : 'Send message'}
                  <ArrowUpRightIcon />
                </button>
                <p className="pulse-mono" style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '0.06em', textAlign: 'center', marginTop: 4 }}>
                  TYPICAL REPLY · UNDER 24 HOURS
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--line)',
        padding: '40px 32px',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--accent)', color: accentInk,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Archivo Black, sans-serif', fontSize: 14,
            }}>P</span>
            <span className="pulse-grotesk" style={{ fontWeight: 600, fontSize: 14 }}>
              {name} &copy; {new Date().getFullYear()}
            </span>
          </div>

          {!hideBranding && (
            <div className="pulse-mono" style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em' }}>
              {name} · Built with <span style={{ color: 'var(--accent)', fontWeight: 700 }}>FolioForge</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="pulse-mono" style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '0.06em' }}>
              @{username}
            </span>
            <a href="#top" onClick={(e) => scrollTo(e, '#top')} style={{
              padding: '8px 14px',
              border: '1.5px solid var(--line)',
              borderRadius: 999,
              fontSize: 12, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--fg)'; }}>
              Back to top <ArrowUpRightIcon />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
