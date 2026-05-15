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
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const DribbbleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72M3.92 8.39c4.95-.7 9.04-.4 16.04 1.94M3.5 14.78c4.6-1.31 9.7-1.31 14.43.32" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

const SOCIAL_LINKS = [
  { key: 'linkedinUrl', label: 'LinkedIn', Icon: LinkedinIcon },
  { key: 'twitterUrl', label: 'Twitter', Icon: TwitterIcon },
  { key: 'instagramUrl', label: 'Instagram', Icon: InstagramIcon },
  { key: 'dribbbleUrl', label: 'Dribbble', Icon: DribbbleIcon },
];

const PROJECT_GRADIENTS = [
  'linear-gradient(135deg, #f3b89e 0%, #c95f3f 100%)',
  'linear-gradient(135deg, #b9d0b6 0%, #7d9b7d 100%)',
  'linear-gradient(135deg, #f4d6b4 0%, #d49a5a 100%)',
  'linear-gradient(135deg, #e8c3b4 0%, #b4756a 100%)',
  'linear-gradient(135deg, #d4c8e0 0%, #8c7aa4 100%)',
  'linear-gradient(135deg, #f0c9c1 0%, #c95f3f 100%)',
];

export default function SolaceTemplate({ content, username, hideBranding }: Props) {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formState, setFormState] = useState<'idle' | 'sent'>('idle');
  const c = content || {};

  const bgLight = c.colorBg || '#fdf6ee';
  const fgLight = c.colorFg || '#2a1f1a';
  const accent = c.colorAccent || '#c95f3f';
  const accent2 = c.colorAccent2 || '#7d9b7d';
  const lineLight = c.colorLine || '#ecddc8';
  const cardLight = c.colorCard || '#fffaf3';

  const lightVars = `
    --bg: ${bgLight};
    --fg: ${fgLight};
    --fg-muted: #6b574b;
    --fg-faint: #9b8676;
    --card: ${cardLight};
    --card-elev: #fff5e6;
    --line: ${lineLight};
    --line-strong: #d9c4a8;
    --accent: ${accent};
    --accent-soft: #f7d9cd;
    --accent-tint: #fde6dc;
    --accent2: ${accent2};
    --accent2-soft: #d8e3d4;
    --shadow-sm: 0 2px 8px rgba(74, 49, 30, 0.06);
    --shadow-md: 0 8px 24px rgba(74, 49, 30, 0.08);
    --shadow-lg: 0 16px 48px rgba(74, 49, 30, 0.12);
    --blob-1: radial-gradient(circle at 20% 30%, rgba(201, 95, 63, 0.18), transparent 55%);
    --blob-2: radial-gradient(circle at 80% 20%, rgba(125, 155, 125, 0.18), transparent 60%);
  `;

  const darkVars = `
    --bg: #1f1812;
    --fg: #f5e9d8;
    --fg-muted: #c4b3a0;
    --fg-faint: #8f7d6c;
    --card: #2a2017;
    --card-elev: #322619;
    --line: #3a2c1f;
    --line-strong: #4d3b29;
    --accent: ${accent};
    --accent-soft: #5a2a1c;
    --accent-tint: #3d1d13;
    --accent2: ${accent2};
    --accent2-soft: #2f4030;
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.5);
    --blob-1: radial-gradient(circle at 20% 30%, rgba(201, 95, 63, 0.18), transparent 55%);
    --blob-2: radial-gradient(circle at 80% 20%, rgba(125, 155, 125, 0.14), transparent 60%);
  `;

  const cssVars = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    .solace-template {
      ${dark ? darkVars : lightVars}
      font-family: 'Outfit', 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--fg);
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      letter-spacing: -0.01em;
    }
    .solace-template * { box-sizing: border-box; margin: 0; padding: 0; }
    .solace-template a { color: inherit; text-decoration: none; }
    .solace-template button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    .solace-template input, .solace-template textarea, .solace-template select {
      font-family: inherit; color: inherit;
    }
    .solace-template html { scroll-behavior: smooth; }

    @keyframes solace-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.6); opacity: 0.35; }
    }
    @keyframes solace-pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.55; }
    }
    @keyframes solace-float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-12px) rotate(2deg); }
    }
    @keyframes solace-float-slow {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      50% { transform: translateY(-20px) translateX(10px); }
    }
    @keyframes solace-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: none; }
    }
    @keyframes solace-marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

    .solace-template .solace-pulse-ring {
      animation: solace-pulse 2s ease-in-out infinite;
    }
    .solace-template .solace-pulse-dot {
      animation: solace-pulse-dot 2s ease-in-out infinite;
    }
    .solace-template .solace-float {
      animation: solace-float 6s ease-in-out infinite;
    }
    .solace-template .solace-float-slow {
      animation: solace-float-slow 9s ease-in-out infinite;
    }
    .solace-template .solace-fade {
      animation: solace-fade-in 0.4s ease;
    }

    .solace-template .solace-card-hover {
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .solace-template .solace-card-hover:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--accent);
    }

    .solace-template .solace-btn {
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
    }
    .solace-template .solace-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    .solace-template .solace-btn:active {
      transform: translateY(0);
    }

    .solace-template .solace-link-underline {
      position: relative;
    }
    .solace-template .solace-link-underline::after {
      content: '';
      position: absolute;
      left: 0; right: 100%; bottom: -3px;
      height: 2px;
      background: var(--accent);
      border-radius: 2px;
      transition: right 0.25s ease;
    }
    .solace-template .solace-link-underline:hover::after {
      right: 0;
    }

    .solace-template input:focus, .solace-template textarea:focus, .solace-template select:focus {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .solace-template ::selection {
      background: var(--accent);
      color: #fff;
    }

    @media (max-width: 900px) {
      .solace-desktop-nav { display: none !important; }
      .solace-nav-cta-desktop { display: none !important; }
      .solace-mobile-toggle { display: inline-flex !important; }
      .solace-hero-grid { grid-template-columns: 1fr !important; }
      .solace-hero-illus { display: none !important; }
      .solace-hero-headline { font-size: 44px !important; }
      .solace-trust-strip { grid-template-columns: 1fr !important; gap: 14px !important; }
      .solace-services-grid { grid-template-columns: 1fr !important; }
      .solace-process-grid { grid-template-columns: 1fr !important; }
      .solace-projects-grid { grid-template-columns: 1fr !important; }
      .solace-packages-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
      .solace-package-highlight { transform: none !important; }
      .solace-testimonials-grid { grid-template-columns: 1fr !important; }
      .solace-contact-grid { grid-template-columns: 1fr !important; }
      .solace-section { padding-left: 20px !important; padding-right: 20px !important; }
      .solace-section-head { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
      .solace-footer-row { flex-direction: column !important; gap: 14px !important; text-align: center !important; }
      .solace-availability-pill-hero { font-size: 12px !important; }
    }
    @media (max-width: 520px) {
      .solace-hero-headline { font-size: 36px !important; line-height: 1.05 !important; }
      .solace-section-title { font-size: 28px !important; }
      .solace-hero-cta-row { flex-direction: column !important; align-items: stretch !important; }
      .solace-hero-cta-row .solace-btn { width: 100% !important; justify-content: center !important; }
      .solace-package-card { padding: 24px !important; }
      .solace-form-row { grid-template-columns: 1fr !important; }
    }
  `;

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#process', label: 'Process' },
    { href: '#work', label: 'Work' },
    { href: '#packages', label: 'Packages' },
    { href: '#testimonials', label: 'Praise' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  const name = c.name || 'Avery Hart';
  const initial = (name.trim().charAt(0) || 'A').toUpperCase();
  const title = c.title || 'Independent Brand & Web Designer';
  const tagline = c.tagline || 'I help small teams launch warm, human websites that actually convert.';
  const subtitle = c.subtitle || 'Working with founders, studios and indie makers since 2018. Cozy process, sharp output.';
  const availability = c.availability || 'Available for new projects · Booking June onward';

  type Stat = { label: string; value: string };
  const heroStats = parseJ<Stat[]>(c.heroStatsJson, [
    { label: 'Happy clients', value: '60+' },
    { label: 'Projects shipped', value: '120' },
    { label: 'Years freelancing', value: '6' },
    { label: 'Avg. rating', value: '4.9/5' },
  ]);

  type Service = { icon?: string; title: string; description: string; startingPrice?: string; features?: string };
  const services = parseJ<Service[]>(c.servicesJson, [
    {
      icon: 'brush',
      title: 'Brand Identity',
      description: 'Logos, type systems and visual languages that feel like you — not a stock template.',
      startingPrice: 'from $2,400',
      features: 'Logo suite, Color & type system, Brand guidelines',
    },
    {
      icon: 'monitor',
      title: 'Website Design',
      description: 'Warm, conversion-minded websites designed in Figma and ready to hand off or build.',
      startingPrice: 'from $3,800',
      features: 'Up to 6 pages, Mobile-first, Figma source files',
    },
    {
      icon: 'code',
      title: 'Web Development',
      description: 'Hand-coded Next.js sites with smooth motion and accessible, semantic markup.',
      startingPrice: 'from $4,500',
      features: 'Next.js + TypeScript, CMS integration, SEO ready',
    },
    {
      icon: 'spark',
      title: 'Landing Pages',
      description: 'Single-page sprints for launches, product drops, and campaigns. Fast turnaround.',
      startingPrice: 'from $1,400',
      features: '2-week turnaround, Copy + visuals, A/B variants',
    },
    {
      icon: 'compass',
      title: 'Brand Strategy',
      description: 'Positioning, voice and messaging workshops to find the words before we design.',
      startingPrice: 'from $1,800',
      features: 'Discovery workshop, Voice + tone guide, Messaging map',
    },
    {
      icon: 'palette',
      title: 'Design Retainers',
      description: 'Ongoing design support for teams that need a steady hand each month.',
      startingPrice: 'from $2,000/mo',
      features: 'Async + sync, Slack + Figma, Priority queue',
    },
  ]);

  type Process = { step?: string; title: string; description: string; duration?: string };
  const processSteps = parseJ<Process[]>(c.processJson, [
    { step: '01', title: 'Discovery call', description: 'A friendly 30-minute chat to understand your goals, audience and timeline.', duration: '30 min' },
    { step: '02', title: 'Proposal & scope', description: 'A clear, fixed-price proposal with deliverables, milestones and dates — no surprises.', duration: '2 days' },
    { step: '03', title: 'Design sprints', description: 'Weekly check-ins, shared Figma boards and async Loom updates so you always know where we are.', duration: '2–4 weeks' },
    { step: '04', title: 'Handoff & launch', description: 'Polished files, recorded walkthroughs, and 30 days of post-launch support included.', duration: '1 week' },
  ]);

  type Project = { title: string; client?: string; industry?: string; summary?: string; result?: string; tags?: string; liveUrl?: string };
  const projects = parseJ<Project[]>(c.projectsJson, [
    {
      title: 'Foundry & Loom',
      client: 'Foundry & Loom',
      industry: 'E-commerce · Home goods',
      summary: 'Rebuilt the brand and Shopify storefront for a small-batch textile studio in Portland.',
      result: '+38% conversion · 2.4× avg. order value',
      tags: 'Brand, Shopify, Photography',
      liveUrl: '#',
    },
    {
      title: 'Northbound Coffee',
      client: 'Northbound Coffee',
      industry: 'Hospitality · DTC',
      summary: 'A warm subscription site with playful illustrations and a quiz-driven onboarding flow.',
      result: '5,200 new subscribers in 90 days',
      tags: 'Web, Illustration, Copy',
      liveUrl: '#',
    },
    {
      title: 'Maple Health',
      client: 'Maple Health',
      industry: 'SaaS · Wellness',
      summary: 'Marketing site refresh for a Series A wellness platform with a strict accessibility bar.',
      result: 'WCAG AA · 96 Lighthouse',
      tags: 'Next.js, Design system, A11y',
      liveUrl: '#',
    },
    {
      title: 'Pebble Studio',
      client: 'Pebble Studio',
      industry: 'Agency · Design',
      summary: 'Identity and website for a two-person creative studio relaunching after a 3-year hiatus.',
      result: 'Booked solid through Q3',
      tags: 'Brand, Web, Print',
      liveUrl: '#',
    },
  ]);

  type Package = { name: string; price: string; period?: string; description?: string; features?: string; cta?: string; highlighted?: boolean };
  const packages = parseJ<Package[]>(c.packagesJson, [
    {
      name: 'Starter',
      price: '$1,400',
      period: 'one-time',
      description: 'Perfect for solo founders who need a beautiful one-pager to launch this month.',
      features: 'One-page website,Mobile responsive,Basic SEO setup,2 revision rounds,2-week delivery',
      cta: 'Get started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$3,800',
      period: 'one-time',
      description: 'Most teams pick this. A complete website, brand polish, and a smooth launch.',
      features: 'Up to 6 pages,Custom brand polish,CMS integration,Unlimited revisions,4-week delivery,30-day support',
      cta: 'Book Pro package',
      highlighted: true,
    },
    {
      name: 'Custom',
      price: 'Let\'s talk',
      period: 'project-based',
      description: 'For ambitious projects: design systems, multi-language, complex integrations.',
      features: 'Everything in Pro,Design system,Custom integrations,Dedicated Slack channel,Flexible timeline,Priority support',
      cta: 'Start a conversation',
      highlighted: false,
    },
  ]);

  type Testimonial = { quote: string; name: string; role?: string; company?: string; rating?: number };
  const testimonials = parseJ<Testimonial[]>(c.testimonialsJson, [
    {
      quote: 'Avery felt like a true partner from day one. The kind of designer who actually listens, then quietly makes everything better.',
      name: 'Jules Tanaka',
      role: 'Founder',
      company: 'Foundry & Loom',
      rating: 5,
    },
    {
      quote: 'We went from a rough idea to a launched site in five weeks. The process was calm, organized, and surprisingly fun.',
      name: 'Marcus Bell',
      role: 'CEO',
      company: 'Northbound Coffee',
      rating: 5,
    },
    {
      quote: 'Detail-oriented without being precious. Avery pushed back on the right things and trusted us on the rest.',
      name: 'Priya Reddy',
      role: 'Head of Marketing',
      company: 'Maple Health',
      rating: 5,
    },
    {
      quote: 'Hands down the best freelancer we\'ve worked with. We\'ve already booked her for next year.',
      name: 'Sam Okafor',
      role: 'Co-founder',
      company: 'Pebble Studio',
      rating: 5,
    },
  ]);

  type Faq = { question: string; answer: string };
  const faqs = parseJ<Faq[]>(c.faqJson, [
    { question: 'How does the process actually start?', answer: 'Book a free 30-minute call. If we\'re a fit, I send a fixed-price proposal within 2 business days. A 30% deposit kicks things off.' },
    { question: 'How long does a typical project take?', answer: 'Landing pages take 1–2 weeks. Full sites and brand projects usually run 4–6 weeks. I only take on 2–3 projects at a time so each one gets real attention.' },
    { question: 'Do you work with international clients?', answer: 'Yes! Roughly half of my clients are outside the US. I keep flexible hours and use async tools (Loom, Notion, Slack) so timezones rarely matter.' },
    { question: 'What if I need ongoing help after launch?', answer: 'Every project includes 30 days of post-launch support. After that, I offer monthly design retainers starting at $2,000/mo.' },
    { question: 'Do you write the copy too?', answer: 'I do light editing and headlines as part of every project. For long-form copy I partner with two trusted writers and can bring them in.' },
    { question: 'What does payment look like?', answer: '30% deposit to kick off, 40% at design approval, 30% at launch. I accept bank transfer, Wise and Stripe.' },
  ]);

  const contactEmail = c.contactEmail || 'hello@averyhart.co';
  const contactPhone = c.contactPhone || '+1 (555) 014-2230';
  const contactLocation = c.contactLocation || 'Portland, OR · Working worldwide';
  const calendlyUrl = c.calendlyUrl || '#contact';

  const socialUrls = SOCIAL_LINKS
    .map((s) => ({ ...s, url: c[s.key] }))
    .filter((s) => Boolean(s.url));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sent');
    setTimeout(() => setFormState('idle'), 4000);
  };

  const ServiceIcon = ({ name }: { name?: string }) => {
    const key = (name || 'spark').toLowerCase();
    const common = { width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, viewBox: '0 0 24 24' };
    if (key === 'brush') {
      return (
        <svg {...common}>
          <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 114.03 4.03l-8.06 8.08" />
          <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 00-3-3.02z" />
        </svg>
      );
    }
    if (key === 'monitor') {
      return (
        <svg {...common}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    }
    if (key === 'code') {
      return (
        <svg {...common}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    }
    if (key === 'compass') {
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    }
    if (key === 'palette') {
      return (
        <svg {...common}>
          <circle cx="13.5" cy="6.5" r="1" />
          <circle cx="17.5" cy="10.5" r="1" />
          <circle cx="8.5" cy="7.5" r="1" />
          <circle cx="6.5" cy="12.5" r="1" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.5-9-10-9z" />
        </svg>
      );
    }
    return (
      <svg {...common}>
        <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" />
      </svg>
    );
  };

  return (
    <div className="solace-template" style={{ position: 'relative', overflowX: 'hidden' }}>
      <style suppressHydrationWarning>{cssVars}</style>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'var(--blob-1), var(--blob-2)',
        }}
      />

      <header
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          background: dark ? 'rgba(31, 24, 18, 0.78)' : 'rgba(253, 246, 238, 0.78)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            maxWidth: 1200, margin: '0 auto',
            padding: '14px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <a
            href="#top"
            onClick={(e) => scrollTo(e, '#top')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}
          >
            <span
              style={{
                width: 38, height: 38, borderRadius: '50%',
                background: `linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)`,
                color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 16, letterSpacing: '0.02em',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0,
              }}
            >
              {initial}
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, minWidth: 0 }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
              <span style={{ fontSize: 11, color: 'var(--fg-faint)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Freelance design</span>
            </span>
          </a>

          <nav className="solace-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => scrollTo(e, l.href)}
                className="solace-link-underline"
                style={{
                  padding: '8px 12px', fontSize: 14, fontWeight: 500,
                  color: 'var(--fg-muted)', borderRadius: 999,
                  transition: 'color 0.2s ease',
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              className="solace-availability-pill-hero"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 12px',
                background: 'var(--accent2-soft)',
                color: dark ? 'var(--fg)' : '#3d5a3d',
                borderRadius: 999,
                fontSize: 12, fontWeight: 600,
                border: '1px solid var(--line)',
              }}
            >
              <span style={{ position: 'relative', width: 8, height: 8 }}>
                <span
                  className="solace-pulse-ring"
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'var(--accent2)',
                  }}
                />
                <span
                  className="solace-pulse-dot"
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'var(--accent2)',
                  }}
                />
              </span>
              Available
            </span>

            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--fg-muted)',
                border: '1px solid var(--line)',
                background: 'var(--card)',
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            <a
              href={calendlyUrl}
              onClick={(e) => calendlyUrl.startsWith('#') ? scrollTo(e, calendlyUrl) : undefined}
              className="solace-btn solace-nav-cta-desktop"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 999,
                background: 'var(--fg)', color: 'var(--bg)',
                fontSize: 14, fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              <CalendarIcon /> Book a call
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="solace-mobile-toggle"
              aria-label="Toggle menu"
              style={{
                display: 'none',
                width: 36, height: 36, borderRadius: '50%',
                alignItems: 'center', justifyContent: 'center',
                color: 'var(--fg)',
                border: '1px solid var(--line)',
                background: 'var(--card)',
              }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="solace-fade"
            style={{
              borderTop: '1px solid var(--line)',
              background: 'var(--card)',
              padding: '12px 20px 20px',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => scrollTo(e, l.href)}
                style={{
                  padding: '12px 14px', borderRadius: 12,
                  fontSize: 15, fontWeight: 500, color: 'var(--fg)',
                  background: 'transparent',
                  transition: 'background 0.2s ease',
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={calendlyUrl}
              onClick={(e) => calendlyUrl.startsWith('#') ? scrollTo(e, calendlyUrl) : undefined}
              style={{
                marginTop: 8,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 18px', borderRadius: 999,
                background: 'var(--accent)', color: '#fff',
                fontSize: 14, fontWeight: 600,
              }}
            >
              <CalendarIcon /> Book a call
            </a>
          </div>
        )}
      </header>

      <main id="top" style={{ position: 'relative', zIndex: 1 }}>
        <section
          className="solace-section"
          style={{
            maxWidth: 1200, margin: '0 auto',
            padding: '80px 28px 60px',
            position: 'relative',
          }}
        >
          <div
            aria-hidden="true"
            className="solace-float-slow"
            style={{
              position: 'absolute', top: 80, right: '8%',
              width: 220, height: 220,
              background: 'linear-gradient(135deg, var(--accent-soft), transparent 70%)',
              borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
              filter: 'blur(4px)',
              opacity: 0.7,
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden="true"
            className="solace-float"
            style={{
              position: 'absolute', bottom: 40, left: '4%',
              width: 160, height: 160,
              background: 'linear-gradient(135deg, var(--accent2-soft), transparent 70%)',
              borderRadius: '50% 60% 40% 60% / 60% 40% 60% 40%',
              filter: 'blur(4px)',
              opacity: 0.7,
              pointerEvents: 'none',
            }}
          />

          <div
            className="solace-hero-grid"
            style={{
              display: 'grid', gridTemplateColumns: '1.4fr 1fr',
              gap: 64, alignItems: 'center',
              position: 'relative',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 14px',
                  background: 'var(--accent2-soft)',
                  color: dark ? 'var(--fg)' : '#3d5a3d',
                  borderRadius: 999,
                  fontSize: 13, fontWeight: 600,
                  border: '1px solid var(--line)',
                  marginBottom: 24,
                }}
              >
                <span style={{ position: 'relative', width: 8, height: 8 }}>
                  <span
                    className="solace-pulse-ring"
                    style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: 'var(--accent2)',
                    }}
                  />
                  <span
                    className="solace-pulse-dot"
                    style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: 'var(--accent2)',
                    }}
                  />
                </span>
                {availability}
              </span>

              <h1
                className="solace-hero-headline"
                style={{
                  fontSize: 64,
                  lineHeight: 1.02,
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: 'var(--fg)',
                  marginBottom: 20,
                }}
              >
                Hi, I'm{' '}
                <span style={{ position: 'relative', whiteSpace: 'nowrap' }}>
                  <span style={{ position: 'relative', zIndex: 1 }}>{name.split(' ')[0]}</span>
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: -4, right: -4, bottom: 4, height: '32%',
                      background: 'var(--accent-soft)',
                      borderRadius: 8,
                      zIndex: 0,
                    }}
                  />
                </span>
                .
                <br />
                {title.split(' ').slice(0, 3).join(' ')}{' '}
                <span style={{ color: 'var(--accent)' }}>
                  {title.split(' ').slice(3).join(' ') || 'for kind humans.'}
                </span>
              </h1>

              <p
                style={{
                  fontSize: 19, lineHeight: 1.55,
                  color: 'var(--fg-muted)',
                  maxWidth: 560,
                  marginBottom: 14,
                  fontWeight: 400,
                }}
              >
                {tagline}
              </p>
              <p
                style={{
                  fontSize: 16, lineHeight: 1.6,
                  color: 'var(--fg-faint)',
                  maxWidth: 560,
                  marginBottom: 32,
                }}
              >
                {subtitle}
              </p>

              <div
                className="solace-hero-cta-row"
                style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}
              >
                <a
                  href="#services"
                  onClick={(e) => scrollTo(e, '#services')}
                  className="solace-btn"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '14px 22px', borderRadius: 999,
                    background: 'var(--accent)', color: '#fff',
                    fontSize: 15, fontWeight: 600,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  View services <ArrowRightIcon />
                </a>
                <a
                  href={calendlyUrl}
                  onClick={(e) => calendlyUrl.startsWith('#') ? scrollTo(e, calendlyUrl) : undefined}
                  className="solace-btn"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '14px 22px', borderRadius: 999,
                    background: 'var(--card)',
                    color: 'var(--fg)',
                    border: '1px solid var(--line-strong)',
                    fontSize: 15, fontWeight: 600,
                  }}
                >
                  <CalendarIcon /> Book a call
                </a>
              </div>

              {heroStats.length > 0 && (
                <div
                  className="solace-trust-strip"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(heroStats.length, 4)}, 1fr)`,
                    gap: 28,
                    paddingTop: 28,
                    borderTop: '1px dashed var(--line-strong)',
                    maxWidth: 600,
                  }}
                >
                  {heroStats.map((s, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.02em' }}>{s.value}</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="solace-hero-illus" style={{ position: 'relative', height: 480 }}>
              <div
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div
                  className="solace-float-slow"
                  style={{
                    width: 320, height: 380, borderRadius: 32,
                    background: `linear-gradient(135deg, var(--accent) 0%, var(--accent2) 120%)`,
                    boxShadow: 'var(--shadow-lg)',
                    transform: 'rotate(-4deg)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute', top: -40, right: -40,
                      width: 200, height: 200, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.18)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute', bottom: -60, left: -60,
                      width: 240, height: 240, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.12)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff',
                      fontSize: 140, fontWeight: 700, letterSpacing: '-0.04em',
                      opacity: 0.95,
                      textShadow: '0 6px 24px rgba(0,0,0,0.16)',
                    }}
                  >
                    {initial}
                  </div>
                </div>

                <div
                  className="solace-float"
                  style={{
                    position: 'absolute', top: 30, right: 0,
                    padding: '12px 16px', borderRadius: 16,
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transform: 'rotate(6deg)',
                  }}
                >
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--accent2-soft)',
                      color: 'var(--accent2)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <CheckIcon />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>
                    Project shipped<br />
                    <span style={{ color: 'var(--fg-faint)', fontWeight: 500 }}>2 hours ago</span>
                  </div>
                </div>

                <div
                  className="solace-float-slow"
                  style={{
                    position: 'absolute', bottom: 60, left: -20,
                    padding: '12px 16px', borderRadius: 16,
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transform: 'rotate(-5deg)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 2, color: '#e5a443' }}>
                    {[0, 1, 2, 3, 4].map((i) => <StarIcon key={i} filled />)}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>
                    4.9 / 5<br />
                    <span style={{ color: 'var(--fg-faint)', fontWeight: 500 }}>60+ reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="services"
          className="solace-section"
          style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 28px' }}
        >
          <div
            className="solace-section-head"
            style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              gap: 24, marginBottom: 40,
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '4px 12px', borderRadius: 999,
                  background: 'var(--accent-tint)', color: 'var(--accent)',
                  fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: 14,
                }}
              >
                Services
              </div>
              <h2
                className="solace-section-title"
                style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.1 }}
              >
                Ways I can help
              </h2>
              <p style={{ fontSize: 16, color: 'var(--fg-muted)', marginTop: 12, maxWidth: 540 }}>
                A small menu of things I do really well. Mix and match, or build something custom together.
              </p>
            </div>
          </div>

          <div
            className="solace-services-grid"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
            }}
          >
            {services.map((s, i) => {
              const featureList = pl(s.features).length ? pl(s.features) : lines(s.features);
              return (
                <div
                  key={i}
                  className="solace-card-hover"
                  style={{
                    padding: 26,
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 22,
                    display: 'flex', flexDirection: 'column',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: 'var(--accent-tint)',
                      color: 'var(--accent)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 18,
                    }}
                  >
                    <ServiceIcon name={s.icon} />
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: 'var(--fg)', marginBottom: 8, letterSpacing: '-0.01em' }}>{s.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--fg-muted)', marginBottom: 16 }}>{s.description}</p>

                  {featureList.length > 0 && (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
                      {featureList.map((f, fi) => (
                        <li
                          key={fi}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            fontSize: 13, color: 'var(--fg-muted)',
                          }}
                        >
                          <span style={{ color: 'var(--accent2)', display: 'inline-flex' }}>
                            <CheckIcon />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.startingPrice && (
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: 16,
                        borderTop: '1px dashed var(--line-strong)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>{s.startingPrice}</span>
                      <a
                        href="#contact"
                        onClick={(e) => scrollTo(e, '#contact')}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: 13, fontWeight: 600, color: 'var(--accent)',
                        }}
                      >
                        Inquire <ArrowRightIcon />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="process"
          className="solace-section"
          style={{
            maxWidth: 1200, margin: '0 auto',
            padding: '60px 28px',
          }}
        >
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '4px 12px', borderRadius: 999,
                background: 'var(--accent2-soft)', color: dark ? 'var(--accent2)' : '#3d5a3d',
                fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: 14,
              }}
            >
              Process
            </div>
            <h2
              className="solace-section-title"
              style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.1 }}
            >
              How we'll work together
            </h2>
            <p style={{ fontSize: 16, color: 'var(--fg-muted)', marginTop: 12, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
              Calm, collaborative and clear. Here's what to expect from kickoff to launch day.
            </p>
          </div>

          <div
            className="solace-process-grid"
            style={{
              display: 'grid', gridTemplateColumns: `repeat(${Math.min(processSteps.length, 4)}, 1fr)`,
              gap: 16, position: 'relative',
            }}
          >
            {processSteps.map((p, i) => (
              <div
                key={i}
                className="solace-card-hover"
                style={{
                  padding: 24,
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 20,
                  display: 'flex', flexDirection: 'column',
                  position: 'relative',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                    color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 15,
                    marginBottom: 16,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {p.step || String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--fg-muted)', marginBottom: 14 }}>{p.description}</p>
                {p.duration && (
                  <span
                    style={{
                      marginTop: 'auto',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      alignSelf: 'flex-start',
                      padding: '4px 10px', borderRadius: 999,
                      background: 'var(--accent-tint)', color: 'var(--accent)',
                      fontSize: 12, fontWeight: 600,
                    }}
                  >
                    <CalendarIcon /> {p.duration}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section
          id="work"
          className="solace-section"
          style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 28px' }}
        >
          <div
            className="solace-section-head"
            style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              gap: 24, marginBottom: 40,
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '4px 12px', borderRadius: 999,
                  background: 'var(--accent-tint)', color: 'var(--accent)',
                  fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: 14,
                }}
              >
                Recent Work
              </div>
              <h2
                className="solace-section-title"
                style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.1 }}
              >
                A few projects I'm proud of
              </h2>
            </div>
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, '#contact')}
              className="solace-link-underline"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 14, fontWeight: 600, color: 'var(--accent)',
              }}
            >
              Request the full case study deck <ArrowRightIcon />
            </a>
          </div>

          <div
            className="solace-projects-grid"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20,
            }}
          >
            {projects.map((p, i) => {
              const tagList = pl(p.tags);
              const grad = PROJECT_GRADIENTS[i % PROJECT_GRADIENTS.length];
              return (
                <a
                  key={i}
                  href={p.liveUrl || '#'}
                  target={p.liveUrl && !p.liveUrl.startsWith('#') ? '_blank' : undefined}
                  rel={p.liveUrl && !p.liveUrl.startsWith('#') ? 'noopener noreferrer' : undefined}
                  className="solace-card-hover"
                  style={{
                    display: 'block',
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 24,
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div
                    style={{
                      height: 200,
                      background: grad,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute', top: -30, right: -30,
                        width: 140, height: 140, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.16)',
                      }}
                    />
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute', bottom: -50, left: -50,
                        width: 180, height: 180, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'flex-end',
                        padding: 20, color: '#fff',
                      }}
                    >
                      <div
                        style={{
                          padding: '6px 12px', borderRadius: 999,
                          background: 'rgba(255,255,255,0.22)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          fontSize: 12, fontWeight: 600,
                        }}
                      >
                        {p.industry || 'Case study'}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.01em' }}>{p.title}</h3>
                      {p.client && p.client !== p.title && (
                        <span style={{ fontSize: 13, color: 'var(--fg-faint)', fontWeight: 500 }}>{p.client}</span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg-muted)', marginBottom: 14 }}>{p.summary}</p>

                    {p.result && (
                      <div
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          padding: '8px 14px', borderRadius: 12,
                          background: 'var(--accent2-soft)',
                          color: dark ? 'var(--fg)' : '#3d5a3d',
                          fontSize: 13, fontWeight: 600,
                          marginBottom: 14,
                        }}
                      >
                        <CheckIcon /> {p.result}
                      </div>
                    )}

                    {tagList.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                        {tagList.map((t, ti) => (
                          <span
                            key={ti}
                            style={{
                              padding: '4px 10px', borderRadius: 999,
                              background: 'var(--card-elev)',
                              border: '1px solid var(--line)',
                              fontSize: 11, fontWeight: 600,
                              color: 'var(--fg-muted)',
                              letterSpacing: '0.02em',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section
          id="packages"
          className="solace-section"
          style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 28px' }}
        >
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '4px 12px', borderRadius: 999,
                background: 'var(--accent-tint)', color: 'var(--accent)',
                fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: 14,
              }}
            >
              Packages
            </div>
            <h2
              className="solace-section-title"
              style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.1 }}
            >
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: 16, color: 'var(--fg-muted)', marginTop: 12, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
              Fixed prices, no hourly surprises. Pick a starting point — we'll tailor it on our intro call.
            </p>
          </div>

          <div
            className="solace-packages-grid"
            style={{
              display: 'grid', gridTemplateColumns: `repeat(${packages.length}, 1fr)`,
              gap: 20, alignItems: 'stretch',
            }}
          >
            {packages.map((pkg, i) => {
              const features = pl(pkg.features).length ? pl(pkg.features) : lines(pkg.features);
              const isHighlighted = pkg.highlighted;
              return (
                <div
                  key={i}
                  className={`solace-package-card ${isHighlighted ? 'solace-package-highlight' : ''}`}
                  style={{
                    position: 'relative',
                    padding: 32,
                    background: isHighlighted ? 'linear-gradient(160deg, var(--fg) 0%, #3a2a20 100%)' : 'var(--card)',
                    color: isHighlighted ? '#fdf6ee' : 'var(--fg)',
                    border: isHighlighted ? '1px solid var(--fg)' : '1px solid var(--line)',
                    borderRadius: 24,
                    display: 'flex', flexDirection: 'column',
                    boxShadow: isHighlighted ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                    transform: isHighlighted ? 'scale(1.03)' : 'none',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  {isHighlighted && (
                    <div
                      style={{
                        position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                        padding: '6px 14px', borderRadius: 999,
                        background: 'var(--accent)', color: '#fff',
                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                        boxShadow: 'var(--shadow-md)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Most popular
                    </div>
                  )}

                  <div style={{ marginBottom: 20 }}>
                    <h3
                      style={{
                        fontSize: 14, fontWeight: 700,
                        color: isHighlighted ? 'rgba(253,246,238,0.7)' : 'var(--accent)',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        marginBottom: 14,
                      }}
                    >
                      {pkg.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: 42, fontWeight: 700, letterSpacing: '-0.025em',
                          color: isHighlighted ? '#fdf6ee' : 'var(--fg)',
                          lineHeight: 1,
                        }}
                      >
                        {pkg.price}
                      </span>
                      {pkg.period && (
                        <span style={{ fontSize: 13, color: isHighlighted ? 'rgba(253,246,238,0.6)' : 'var(--fg-faint)', fontWeight: 500 }}>
                          {pkg.period}
                        </span>
                      )}
                    </div>
                    {pkg.description && (
                      <p style={{ fontSize: 14, lineHeight: 1.55, color: isHighlighted ? 'rgba(253,246,238,0.75)' : 'var(--fg-muted)' }}>{pkg.description}</p>
                    )}
                  </div>

                  {features.length > 0 && (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                      {features.map((f, fi) => (
                        <li
                          key={fi}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                            fontSize: 14,
                            color: isHighlighted ? 'rgba(253,246,238,0.92)' : 'var(--fg)',
                          }}
                        >
                          <span
                            style={{
                              flexShrink: 0,
                              width: 20, height: 20, borderRadius: '50%',
                              background: isHighlighted ? 'var(--accent)' : 'var(--accent-tint)',
                              color: isHighlighted ? '#fff' : 'var(--accent)',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              marginTop: 1,
                            }}
                          >
                            <CheckIcon />
                          </span>
                          <span style={{ lineHeight: 1.45 }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <a
                    href="#contact"
                    onClick={(e) => scrollTo(e, '#contact')}
                    className="solace-btn"
                    style={{
                      marginTop: 'auto',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '14px 22px', borderRadius: 999,
                      background: isHighlighted ? 'var(--accent)' : 'var(--card-elev)',
                      color: isHighlighted ? '#fff' : 'var(--fg)',
                      border: isHighlighted ? 'none' : '1px solid var(--line-strong)',
                      fontSize: 14, fontWeight: 600,
                    }}
                  >
                    {pkg.cta || 'Get started'} <ArrowRightIcon />
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="testimonials"
          className="solace-section"
          style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 28px' }}
        >
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '4px 12px', borderRadius: 999,
                background: 'var(--accent2-soft)', color: dark ? 'var(--accent2)' : '#3d5a3d',
                fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: 14,
              }}
            >
              Kind words
            </div>
            <h2
              className="solace-section-title"
              style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.1 }}
            >
              From the people I've worked with
            </h2>
          </div>

          <div
            className="solace-testimonials-grid"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20,
            }}
          >
            {testimonials.map((t, i) => {
              const rating = typeof t.rating === 'number' ? t.rating : 5;
              const tInitial = (t.name || 'A').trim().charAt(0).toUpperCase();
              return (
                <div
                  key={i}
                  className="solace-card-hover"
                  style={{
                    padding: 28,
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 22,
                    display: 'flex', flexDirection: 'column',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute', top: 18, right: 22,
                      fontSize: 72, lineHeight: 1, color: 'var(--accent-tint)',
                      fontFamily: 'Georgia, serif', fontWeight: 700,
                      pointerEvents: 'none',
                    }}
                  >
                    &ldquo;
                  </div>

                  <div style={{ display: 'flex', gap: 2, color: '#e5a443', marginBottom: 14 }}>
                    {[0, 1, 2, 3, 4].map((s) => <StarIcon key={s} filled={s < rating} />)}
                  </div>

                  <p
                    style={{
                      fontSize: 16, lineHeight: 1.6,
                      color: 'var(--fg)',
                      marginBottom: 22,
                      flex: 1,
                      position: 'relative', zIndex: 1,
                    }}
                  >
                    "{t.quote}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px dashed var(--line-strong)' }}>
                    <div
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: `linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)`,
                        color: '#fff',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {tInitial}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)' }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--fg-faint)', fontWeight: 500 }}>
                        {t.role}{t.role && t.company ? ' · ' : ''}{t.company}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="faq"
          className="solace-section"
          style={{ maxWidth: 820, margin: '0 auto', padding: '60px 28px' }}
        >
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '4px 12px', borderRadius: 999,
                background: 'var(--accent-tint)', color: 'var(--accent)',
                fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: 14,
              }}
            >
              FAQ
            </div>
            <h2
              className="solace-section-title"
              style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.1 }}
            >
              Common questions
            </h2>
            <p style={{ fontSize: 16, color: 'var(--fg-muted)', marginTop: 12 }}>
              Can't find what you're looking for? <a href="#contact" onClick={(e) => scrollTo(e, '#contact')} style={{ color: 'var(--accent)', fontWeight: 600 }}>Just ask</a>.
            </p>
          </div>

          <div
            style={{
              display: 'flex', flexDirection: 'column', gap: 12,
            }}
          >
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 18,
                    overflow: 'hidden',
                    boxShadow: open ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'box-shadow 0.25s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 16,
                      textAlign: 'left',
                      fontSize: 16, fontWeight: 600, color: 'var(--fg)',
                      lineHeight: 1.4,
                    }}
                  >
                    <span>{f.question}</span>
                    <span
                      style={{
                        flexShrink: 0,
                        width: 32, height: 32, borderRadius: '50%',
                        background: open ? 'var(--accent)' : 'var(--accent-tint)',
                        color: open ? '#fff' : 'var(--accent)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.25s ease, color 0.25s ease',
                      }}
                    >
                      <ChevronDownIcon open={open} />
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: open ? 300 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 0.3s ease',
                    }}
                  >
                    <p
                      style={{
                        padding: '0 24px 22px',
                        fontSize: 15, lineHeight: 1.6,
                        color: 'var(--fg-muted)',
                      }}
                    >
                      {f.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="contact"
          className="solace-section"
          style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 28px 80px' }}
        >
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 28,
              padding: 48,
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', top: -100, right: -80,
                width: 280, height: 280, borderRadius: '50%',
                background: 'var(--accent-tint)',
                opacity: 0.6, filter: 'blur(8px)',
                pointerEvents: 'none',
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', bottom: -80, left: -60,
                width: 240, height: 240, borderRadius: '50%',
                background: 'var(--accent2-soft)',
                opacity: 0.5, filter: 'blur(8px)',
                pointerEvents: 'none',
              }}
            />

            <div
              className="solace-contact-grid"
              style={{
                position: 'relative',
                display: 'grid', gridTemplateColumns: '1fr 1.2fr',
                gap: 48, alignItems: 'flex-start',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '4px 12px', borderRadius: 999,
                    background: 'var(--accent2-soft)', color: dark ? 'var(--accent2)' : '#3d5a3d',
                    fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
                    marginBottom: 14,
                  }}
                >
                  Let's talk
                </div>
                <h2
                  className="solace-section-title"
                  style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.1, marginBottom: 14 }}
                >
                  Got a project in mind?
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--fg-muted)', marginBottom: 28 }}>
                  Tell me a bit about it and I'll get back within one business day. No long forms, no sales pitches — just a real conversation.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                  <a
                    href={`mailto:${contactEmail}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px', borderRadius: 14,
                      background: 'var(--card-elev)',
                      border: '1px solid var(--line)',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    <span
                      style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'var(--accent-tint)', color: 'var(--accent)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MailIcon />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</div>
                      <div style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{contactEmail}</div>
                    </div>
                  </a>

                  <a
                    href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px', borderRadius: 14,
                      background: 'var(--card-elev)',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <span
                      style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'var(--accent-tint)', color: 'var(--accent)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <PhoneIcon />
                    </span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Phone</div>
                      <div style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 600 }}>{contactPhone}</div>
                    </div>
                  </a>

                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px', borderRadius: 14,
                      background: 'var(--card-elev)',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <span
                      style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'var(--accent-tint)', color: 'var(--accent)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MapPinIcon />
                    </span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Based in</div>
                      <div style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 600 }}>{contactLocation}</div>
                    </div>
                  </div>
                </div>

                {socialUrls.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                      Find me elsewhere
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {socialUrls.map(({ key, label, Icon, url }) => (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="solace-btn"
                          style={{
                            width: 40, height: 40, borderRadius: '50%',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--card-elev)',
                            border: '1px solid var(--line)',
                            color: 'var(--fg-muted)',
                          }}
                        >
                          <Icon />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 16,
                  padding: 28,
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRadius: 22,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div className="solace-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)' }}>Your name</span>
                    <input
                      type="text"
                      required
                      placeholder="Jane Cooper"
                      style={{
                        padding: '12px 14px', borderRadius: 12,
                        border: '1px solid var(--line-strong)',
                        background: 'var(--card)',
                        fontSize: 14,
                      }}
                    />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)' }}>Email</span>
                    <input
                      type="email"
                      required
                      placeholder="jane@studio.co"
                      style={{
                        padding: '12px 14px', borderRadius: 12,
                        border: '1px solid var(--line-strong)',
                        background: 'var(--card)',
                        fontSize: 14,
                      }}
                    />
                  </label>
                </div>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)' }}>What can I help with?</span>
                  <select
                    style={{
                      padding: '12px 14px', borderRadius: 12,
                      border: '1px solid var(--line-strong)',
                      background: 'var(--card)',
                      fontSize: 14,
                    }}
                  >
                    <option>Brand identity</option>
                    <option>Website design</option>
                    <option>Web development</option>
                    <option>Landing page</option>
                    <option>Design retainer</option>
                    <option>Something else</option>
                  </select>
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)' }}>Tell me about it</span>
                  <textarea
                    rows={4}
                    required
                    placeholder="A quick paragraph about your project, timeline and budget range…"
                    style={{
                      padding: '12px 14px', borderRadius: 12,
                      border: '1px solid var(--line-strong)',
                      background: 'var(--card)',
                      fontSize: 14, resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </label>

                <button
                  type="submit"
                  className="solace-btn"
                  style={{
                    marginTop: 4,
                    padding: '14px 22px', borderRadius: 999,
                    background: formState === 'sent' ? 'var(--accent2)' : 'var(--accent)',
                    color: '#fff',
                    fontSize: 14, fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.25s ease',
                  }}
                >
                  {formState === 'sent' ? (
                    <>
                      <CheckIcon /> Message sent — talk soon!
                    </>
                  ) : (
                    <>
                      Send message <ArrowRightIcon />
                    </>
                  )}
                </button>

                <p style={{ fontSize: 12, color: 'var(--fg-faint)', textAlign: 'center', marginTop: 4 }}>
                  Or email me directly at <a href={`mailto:${contactEmail}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>{contactEmail}</a>
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer
        style={{
          position: 'relative', zIndex: 1,
          borderTop: '1px solid var(--line)',
          padding: '28px 28px',
          background: 'var(--card)',
        }}
      >
        <div
          className="solace-footer-row"
          style={{
            maxWidth: 1200, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)`,
                color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13,
              }}
            >
              {initial}
            </span>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
              &copy; {new Date().getFullYear()} {name}
              {username ? <span style={{ color: 'var(--fg-faint)' }}> · @{username}</span> : null}
            </div>
          </div>

          {!hideBranding && (
            <div style={{ fontSize: 12, color: 'var(--fg-faint)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Built with</span>
              <span
                style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: 'var(--accent-tint)', color: 'var(--accent)',
                  fontWeight: 700, fontSize: 11, letterSpacing: '0.04em',
                }}
              >
                FolioForge
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {socialUrls.slice(0, 4).map(({ key, label, Icon, url }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--fg-muted)',
                  border: '1px solid var(--line)',
                  background: 'var(--card-elev)',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
