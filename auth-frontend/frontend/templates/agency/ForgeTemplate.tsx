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
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ArrowUpRightIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const ArrowRightIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

const WORK_GRADIENTS = [
  'linear-gradient(135deg, var(--accent) 0%, #2a1505 60%, var(--bg-card) 100%)',
  'linear-gradient(45deg, #1a1a1a 0%, var(--accent-soft) 50%, var(--accent) 100%)',
  'radial-gradient(circle at 25% 30%, var(--accent) 0%, transparent 55%), linear-gradient(160deg, var(--bg-card), #0a0a0a)',
  'conic-gradient(from 200deg at 60% 40%, var(--accent), #1a0a02, var(--accent-soft), var(--accent))',
  'linear-gradient(120deg, var(--bg-card) 0%, var(--accent-soft) 100%), repeating-linear-gradient(45deg, transparent 0 12px, var(--line) 12px 13px)',
  'radial-gradient(ellipse at 80% 20%, var(--accent) 0%, transparent 50%), linear-gradient(200deg, #0c0c0c, var(--bg-card))',
];

const TEAM_GRADIENTS = [
  'linear-gradient(135deg, var(--accent) 0%, #6b2a05 100%)',
  'linear-gradient(135deg, #2a1505 0%, var(--accent) 100%)',
  'linear-gradient(135deg, var(--accent) 0%, #1a1a1a 100%)',
  'linear-gradient(135deg, #f4c430 0%, var(--accent) 100%)',
  'linear-gradient(135deg, #c93c00 0%, #f4c430 100%)',
];

interface ServiceItem { number?: string; title?: string; description?: string; deliverables?: string; leadName?: string }
interface WorkItem { title?: string; client?: string; year?: string; sector?: string; services?: string; summary?: string; result?: string; image?: string; liveUrl?: string }
interface ClientItem { name?: string; sector?: string }
interface ProcessItem { number?: string; title?: string; description?: string; duration?: string; deliverables?: string }
interface TeamItem { name?: string; role?: string; bio?: string; initial?: string; linkedinUrl?: string; twitterUrl?: string }
interface AwardItem { name?: string; work?: string; year?: string; level?: string }
interface PressItem { outlet?: string; headline?: string; year?: string; url?: string }
interface TestimonialItem { quote?: string; author?: string; role?: string; company?: string }
interface CareerItem { role?: string; type?: string; location?: string; url?: string }

export default function ForgeTemplate({ content, username, hideBranding }: Props) {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', budget: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const c = content || {};

  const colorBg = c.colorBg || '#111111';
  const colorBgLight = c.colorBgLight || '#f3f0e8';
  const colorFg = c.colorFg || '#f3f0e8';
  const colorFgLight = c.colorFgLight || '#111111';
  const colorAccent = c.colorAccent || '#ff5e1f';
  const colorAccentSoft = c.colorAccentSoft || 'rgba(255, 94, 31, 0.14)';
  const colorLine = c.colorLine || 'rgba(243, 240, 232, 0.14)';
  const colorLineLight = c.colorLineLight || 'rgba(17, 17, 17, 0.14)';
  const colorCard = c.colorCard || '#181818';
  const colorCardLight = c.colorCardLight || '#ebe7dc';
  const colorMuted = c.colorMuted || 'rgba(243, 240, 232, 0.62)';
  const colorMutedLight = c.colorMutedLight || 'rgba(17, 17, 17, 0.62)';

  const darkVars = `
    --bg: ${colorBg};
    --fg: ${colorFg};
    --line: ${colorLine};
    --card: ${colorCard};
    --muted: ${colorMuted};
  `;
  const lightVars = `
    --bg: ${colorBgLight};
    --fg: ${colorFgLight};
    --line: ${colorLineLight};
    --card: ${colorCardLight};
    --muted: ${colorMutedLight};
  `;

  const cssVars = `
    @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

    .forge-template {
      ${dark ? darkVars : lightVars}
      --accent: ${colorAccent};
      --accent-soft: ${colorAccentSoft};
      --bg-card: var(--card);
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      background: var(--bg);
      color: var(--fg);
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
      transition: background 0.3s ease, color 0.3s ease;
    }
    .forge-template * { box-sizing: border-box; margin: 0; padding: 0; }
    .forge-template a { color: inherit; text-decoration: none; }
    .forge-template button { font-family: inherit; cursor: pointer; }
    .forge-template input, .forge-template textarea, .forge-template select {
      font-family: inherit; color: inherit; background: transparent; border: none; outline: none;
    }
    .forge-template h1, .forge-template h2, .forge-template h3, .forge-template h4 {
      font-family: 'Inter Tight', 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 0.95;
    }
    .forge-template ::selection {
      background: var(--accent);
      color: #ffffff;
    }

    .forge-grain::before {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 1;
      opacity: 0.06;
      mix-blend-mode: overlay;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    }

    @keyframes forge-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }
    @keyframes forge-marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    .forge-pulse-dot { animation: forge-pulse 2s ease-in-out infinite; }

    .forge-work-card {
      position: relative;
      overflow: hidden;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .forge-work-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--accent);
      transform: translateY(101%);
      transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
      z-index: 1;
    }
    .forge-work-card:hover::before {
      transform: translateY(0);
    }
    .forge-work-card:hover .forge-work-content {
      color: #ffffff;
    }
    .forge-work-card:hover .forge-work-meta { color: rgba(255,255,255,0.85); }
    .forge-work-card:hover .forge-work-arrow { transform: translate(4px, -4px); }
    .forge-work-content { position: relative; z-index: 2; transition: color 0.4s ease; }
    .forge-work-arrow { transition: transform 0.4s ease; }

    .forge-service-card {
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s ease;
    }
    .forge-service-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--accent);
      transform: translateY(101%);
      transition: transform 0.55s cubic-bezier(0.65, 0, 0.35, 1);
      z-index: 0;
    }
    .forge-service-card:hover::before { transform: translateY(0); }
    .forge-service-card:hover .forge-service-content { color: #ffffff; }
    .forge-service-card:hover .forge-service-num { color: rgba(255,255,255,0.9); }
    .forge-service-card:hover .forge-service-deliv { color: rgba(255,255,255,0.78); border-top-color: rgba(255,255,255,0.25); }
    .forge-service-content { position: relative; z-index: 1; transition: color 0.4s ease; }

    .forge-client-cell {
      position: relative;
      overflow: hidden;
      transition: background 0.3s ease, color 0.3s ease;
    }
    .forge-client-cell:hover {
      background: var(--accent);
      color: #ffffff;
    }
    .forge-client-cell:hover .forge-client-sector { color: rgba(255,255,255,0.85); }

    .forge-cta-button {
      position: relative;
      overflow: hidden;
      transition: transform 0.25s ease;
    }
    .forge-cta-button::before {
      content: '';
      position: absolute;
      inset: 0;
      background: #000;
      transform: translateY(101%);
      transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
    }
    .forge-cta-button:hover::before { transform: translateY(0); }
    .forge-cta-button > * { position: relative; z-index: 1; }

    .forge-link-underline {
      position: relative;
      display: inline-block;
    }
    .forge-link-underline::after {
      content: '';
      position: absolute;
      left: 0; right: 0; bottom: -2px;
      height: 1px;
      background: currentColor;
      transform-origin: right;
      transform: scaleX(1);
      transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1);
    }
    .forge-link-underline:hover::after {
      transform-origin: left;
      transform: scaleX(0);
    }

    .forge-mobile-menu {
      position: fixed;
      inset: 0;
      background: var(--bg);
      z-index: 90;
      display: flex;
      flex-direction: column;
      padding: 96px 24px 32px;
    }

    @media (max-width: 900px) {
      .forge-desktop-nav { display: none !important; }
      .forge-mobile-toggle { display: flex !important; }
      .forge-hero-row { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
      .forge-hero-meta { flex-direction: column !important; gap: 16px !important; align-items: flex-start !important; }
      .forge-services-grid { grid-template-columns: 1fr !important; }
      .forge-work-grid { grid-template-columns: 1fr !important; }
      .forge-clients-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .forge-process-row { grid-template-columns: 1fr !important; gap: 16px !important; }
      .forge-team-grid { grid-template-columns: 1fr !important; }
      .forge-press-row { grid-template-columns: 1fr !important; gap: 8px !important; }
      .forge-contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
      .forge-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
      .forge-cta-row { flex-direction: column !important; align-items: stretch !important; }
      .forge-cta-row > a { width: 100% !important; justify-content: space-between !important; }
      .forge-section { padding: 96px 24px !important; }
      .forge-hero { padding: 140px 24px 80px !important; }
      .forge-section-head { flex-direction: column !important; gap: 24px !important; align-items: flex-start !important; }
      .forge-careers-row { grid-template-columns: 1fr !important; gap: 12px !important; }
      .forge-awards-row { grid-template-columns: 1fr !important; gap: 8px !important; }
      .forge-testimonial-quote { font-size: 28px !important; }
    }
    @media (max-width: 520px) {
      .forge-clients-grid { grid-template-columns: 1fr !important; }
      .forge-footer-grid { grid-template-columns: 1fr !important; }
    }
  `;

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const name = c.name || 'Forge & Co.';
  const location = c.location || 'Brooklyn, NY';
  const foundedYear = c.foundedYear || '2018';
  const heroHeadline = c.heroHeadline || 'We build brands that move people.';
  const tagline = c.tagline || 'Independent creative studio.';
  const subtitle = c.subtitle || 'A multi-disciplinary practice working at the intersection of brand, product, and culture. We partner with ambitious teams to ship work that earns attention and compounds value.';
  const availability = c.availability || 'Booking projects for Q3';
  const contactEmail = c.contactEmail || 'hello@forge.studio';
  const newBizEmail = c.newBizEmail || 'newbiz@forge.studio';
  const contactPhone = c.contactPhone || '+1 (212) 555-0123';
  const linkedinUrl = c.linkedinUrl || '#';
  const twitterUrl = c.twitterUrl || '#';
  const instagramUrl = c.instagramUrl || '#';

  const services = parseJ<ServiceItem[]>(c.servicesJson, [
    { number: '01', title: 'Brand Identity', description: 'Names, marks, systems, and the strategy that holds them together. We build identity systems flexible enough to live across every surface and decade.', deliverables: 'Naming, Logo, Type System, Color, Guidelines', leadName: 'Lena Park' },
    { number: '02', title: 'Digital Product', description: 'End-to-end product design from research to release. Native apps, dashboards, and tools that feel inevitable to the people who use them.', deliverables: 'UX, UI, Design Systems, Prototypes', leadName: 'Marcus Reid' },
    { number: '03', title: 'Web & Interactive', description: 'Marketing sites, e-commerce, and bespoke web experiences engineered for speed, accessibility, and conversion.', deliverables: 'Strategy, Design, Build, CMS', leadName: 'Iris Tanaka' },
    { number: '04', title: 'Motion & Film', description: 'Brand films, product motion, and identity in motion. We treat the moving image as a first-class brand surface.', deliverables: 'Direction, Animation, Edit, Sound', leadName: 'Sam Okafor' },
    { number: '05', title: 'Strategy', description: 'Positioning, narrative, and go-to-market planning. The thinking that makes the work do more than look good.', deliverables: 'Research, Positioning, Naming, Narrative', leadName: 'Devin Halle' },
    { number: '06', title: 'Campaigns', description: 'Integrated campaign work spanning film, OOH, social, and experiential. Built to be felt, not just seen.', deliverables: 'Concept, Production, Rollout, Measurement', leadName: 'Ana Vidal' },
  ]);

  const works = parseJ<WorkItem[]>(c.workJson, [
    { title: 'Northwind Outfitters', client: 'Northwind', year: '2024', sector: 'Outdoor / Retail', services: 'Brand, Web, Campaign', summary: 'A full rebrand and direct-to-consumer relaunch for a 40-year-old outdoor goods company entering a new generation of customer.', result: '+218% e-commerce revenue in 6 months', liveUrl: '#' },
    { title: 'Halcyon Sleep', client: 'Halcyon', year: '2024', sector: 'Consumer Health', services: 'Identity, Packaging, Product', summary: 'Identity and product design for a sleep wellness brand that wanted to feel less like pharma and more like a ritual.', result: 'Sold out of launch run in 11 days', liveUrl: '#' },
    { title: 'Field Notes Quarterly', client: 'Field Notes', year: '2023', sector: 'Publishing', services: 'Editorial, Web, Print', summary: 'A complete redesign of the quarterly print publication and its digital companion. Built around a new editorial voice and a more confident grid.', result: '3.4x increase in paid subscriptions', liveUrl: '#' },
    { title: 'Mercer Tools', client: 'Mercer', year: '2023', sector: 'B2B SaaS', services: 'Brand, Product, Web', summary: 'Repositioning a developer tooling company from open-source side project to enterprise platform without losing the engineers who built it.', result: 'Series B closed at $80M', liveUrl: '#' },
    { title: 'Loam Coffee', client: 'Loam', year: '2022', sector: 'F&B / Hospitality', services: 'Identity, Packaging, Spatial', summary: 'Brand and spatial identity for a third-wave coffee operator opening three locations across the boroughs.', result: 'James Beard Best New Restaurant semifinalist', liveUrl: '#' },
    { title: 'Polaris Civic', client: 'City of Pittsburgh', year: '2022', sector: 'Government / Civic', services: 'Strategy, Brand, Product', summary: 'A digital service design engagement reshaping how residents access twenty-three city services through a single front door.', result: '62% reduction in support volume', liveUrl: '#' },
  ]);

  const clients = parseJ<ClientItem[]>(c.clientsJson, [
    { name: 'Northwind', sector: 'Outdoor' },
    { name: 'Halcyon', sector: 'Wellness' },
    { name: 'Mercer', sector: 'SaaS' },
    { name: 'Field Notes', sector: 'Publishing' },
    { name: 'Loam', sector: 'F&B' },
    { name: 'Polaris', sector: 'Civic' },
    { name: 'Atlas Bank', sector: 'Fintech' },
    { name: 'Westgate', sector: 'Real Estate' },
    { name: 'Kindred', sector: 'Healthcare' },
    { name: 'Bluebird Air', sector: 'Travel' },
    { name: 'Otto Studios', sector: 'Entertainment' },
    { name: 'Cardinal', sector: 'Logistics' },
  ]);

  const processSteps = parseJ<ProcessItem[]>(c.processJson, [
    { number: '01', title: 'Discover', description: 'We start by listening. Stakeholder interviews, audits, audience research, and competitive landscaping. The output is a sharper brief than the one we walked in with.', duration: '2 — 3 weeks', deliverables: 'Research, Audit, Strategy Brief' },
    { number: '02', title: 'Define', description: 'We translate research into direction. Positioning, narrative, and the strategic posture the work will be built on. Nothing moves into design until this is sharp.', duration: '2 weeks', deliverables: 'Positioning, Narrative, Principles' },
    { number: '03', title: 'Design', description: 'Concepts, iterations, and the long slow work of getting the details right. Two to three concept directions reduced to one, then refined until it is the obvious answer.', duration: '4 — 8 weeks', deliverables: 'Concepts, Systems, Guidelines' },
    { number: '04', title: 'Build', description: 'Production, engineering, and rollout. We work in tight loops with your team so the handoff is not a handoff. We stay involved until it ships.', duration: '4 — 12 weeks', deliverables: 'Production, Code, Assets, Launch' },
    { number: '05', title: 'Evolve', description: 'We do not believe in launch-and-leave. We stay on retainer with most partners, evolving the system as the business grows and learns.', duration: 'Ongoing', deliverables: 'Retainer, Optimization, Expansion' },
  ]);

  const team = parseJ<TeamItem[]>(c.teamJson, [
    { name: 'Lena Park', role: 'Founder & Executive Creative Director', bio: 'Previously design director at Pentagram and Instrument. AIGA Medal recipient. Lena leads brand identity engagements and oversees creative direction across the studio.', initial: 'L', linkedinUrl: '#', twitterUrl: '#' },
    { name: 'Marcus Reid', role: 'Partner, Head of Product', bio: 'Fifteen years designing software at Stripe, Linear, and as a solo practitioner. Marcus leads our product practice and writes our point of view on the craft.', initial: 'M', linkedinUrl: '#', twitterUrl: '#' },
    { name: 'Iris Tanaka', role: 'Design Director, Web', bio: 'Iris leads web and interactive engagements. Formerly at Active Theory and Resn. Two-time FWA Site of the Year.', initial: 'I', linkedinUrl: '#', twitterUrl: '#' },
    { name: 'Sam Okafor', role: 'Director of Motion', bio: 'Director and animator with a background in commercial film. Sam leads our motion practice and our in-house edit suite.', initial: 'S', linkedinUrl: '#', twitterUrl: '#' },
    { name: 'Devin Halle', role: 'Head of Strategy', bio: 'Former planner at Wieden+Kennedy and a small handful of independents. Devin runs strategy across the studio and writes most of our case studies.', initial: 'D', linkedinUrl: '#', twitterUrl: '#' },
  ]);

  const awards = parseJ<AwardItem[]>(c.awardsJson, [
    { name: 'D&AD Wood Pencil', work: 'Northwind Outfitters', year: '2024', level: 'Brand Identity' },
    { name: 'Brand New — Notable', work: 'Halcyon Sleep', year: '2024', level: 'Identity Work' },
    { name: 'Webby Award', work: 'Mercer Tools', year: '2023', level: 'Best B2B Website' },
    { name: 'Type Directors Club', work: 'Field Notes Quarterly', year: '2023', level: 'Editorial Design' },
    { name: 'Awwwards SOTY', work: 'Loam Coffee', year: '2022', level: 'Site of the Year, Honorable' },
    { name: 'Communication Arts', work: 'Polaris Civic', year: '2022', level: 'Interactive Annual' },
  ]);

  const press = parseJ<PressItem[]>(c.pressJson, [
    { outlet: 'It’s Nice That', headline: 'Inside Forge & Co.’s rebrand of Northwind', year: '2024', url: '#' },
    { outlet: 'Brand New', headline: 'New logo and identity for Halcyon Sleep', year: '2024', url: '#' },
    { outlet: 'Fast Company', headline: 'How a Brooklyn studio is rebuilding civic digital design', year: '2023', url: '#' },
    { outlet: 'Eye on Design', headline: 'A conversation with Lena Park', year: '2023', url: '#' },
    { outlet: 'The Drum', headline: 'Forge & Co. named Independent Studio of the Year shortlist', year: '2022', url: '#' },
  ]);

  const testimonials = parseJ<TestimonialItem[]>(c.testimonialsJson, [
    { quote: 'Forge did not just rebrand us. They rebuilt the way we think about ourselves. The work shipped on time, on budget, and reset the trajectory of the company.', author: 'Rachel Yoon', role: 'CEO', company: 'Northwind Outfitters' },
    { quote: 'They are the rare studio that holds the strategic line as fiercely as the craft line. Six months in and the work is still teaching our team how to operate.', author: 'David Friedman', role: 'Chief Marketing Officer', company: 'Mercer Tools' },
    { quote: 'Working with Forge feels like adding a senior creative team to your roster. They show up, they push back, and they ship work that wins awards and revenue.', author: 'Priya Chandra', role: 'Founder', company: 'Halcyon Sleep' },
  ]);

  const careers = parseJ<CareerItem[]>(c.careersJson, [
    { role: 'Senior Brand Designer', type: 'Full-time', location: 'Brooklyn / Hybrid', url: '#' },
    { role: 'Product Designer', type: 'Full-time', location: 'Remote (US)', url: '#' },
    { role: 'Motion Designer', type: 'Contract', location: 'Brooklyn / On-site', url: '#' },
    { role: 'Strategy Director', type: 'Full-time', location: 'Brooklyn / Hybrid', url: '#' },
  ]);

  const navLinks = [
    { num: '01', href: '#work', label: 'Work' },
    { num: '02', href: '#services', label: 'Services' },
    { num: '03', href: '#process', label: 'Process' },
    { num: '04', href: '#studio', label: 'Studio' },
    { num: '05', href: '#contact', label: 'Contact' },
  ];

  const wordmarkInitial = name.charAt(0).toUpperCase();
  const accentBarStyle: React.CSSProperties = {
    height: 6,
    background: 'var(--accent)',
    width: '100%',
  };
  const heavyDividerStyle: React.CSSProperties = {
    height: 1,
    background: 'var(--fg)',
    width: '100%',
    opacity: 1,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormState({ name: '', email: '', budget: '', message: '' });
  };

  const onField = (k: keyof typeof formState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [k]: e.target.value });
  };

  return (
    <div className="forge-template forge-grain">
      <style suppressHydrationWarning>{cssVars}</style>

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: dark ? 'rgba(17,17,17,0.82)' : 'rgba(243,240,232,0.82)',
          backdropFilter: 'saturate(180%) blur(14px)',
          WebkitBackdropFilter: 'saturate(180%) blur(14px)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#top" onClick={(e) => scrollTo(e, '#top')} style={{ display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '-0.02em' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                background: 'var(--accent)',
                color: '#fff',
                fontFamily: "'Inter Tight', sans-serif",
                fontWeight: 900,
                fontSize: 18,
                borderRadius: 2,
              }}
            >
              {wordmarkInitial}
            </span>
            <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
              {name}
            </span>
          </a>

          <nav className="forge-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => scrollTo(e, l.href)}
                className="forge-link-underline"
                style={{ fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'baseline', gap: 6 }}
              >
                <span style={{ fontSize: 10, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{l.num}</span>
                <span>{l.label}</span>
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setDark(!dark)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                width: 36,
                height: 36,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: '1px solid var(--line)',
                color: 'var(--fg)',
                borderRadius: 999,
              }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            <a
              href="#contact"
              onClick={(e) => scrollTo(e, '#contact')}
              className="forge-cta-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 18px',
                background: 'var(--accent)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '-0.005em',
                borderRadius: 999,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span
                  className="forge-pulse-dot"
                  style={{ width: 6, height: 6, background: '#ffffff', borderRadius: '50%' }}
                />
                Start a project
              </span>
            </a>

            <button
              className="forge-mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{
                display: 'none',
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: '1px solid var(--line)',
                color: 'var(--fg)',
                borderRadius: 999,
              }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="forge-mobile-menu">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 16 }}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => scrollTo(e, l.href)}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 16,
                  padding: '24px 0',
                  borderBottom: '1px solid var(--line)',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontWeight: 700,
                  fontSize: 36,
                  letterSpacing: '-0.03em',
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{l.num}</span>
                <span>{l.label}</span>
              </a>
            ))}
          </nav>
        </div>
      )}

      <main id="top" style={{ position: 'relative', zIndex: 2 }}>
        <section
          className="forge-hero"
          style={{
            position: 'relative',
            padding: '120px 32px 100px',
            maxWidth: 1440,
            margin: '0 auto',
          }}
        >
          <div
            className="forge-hero-meta"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 56,
              fontWeight: 500,
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
              <span>{location}</span>
              <span style={{ width: 24, height: 1, background: 'var(--line)' }} />
              <span>Est. {foundedYear}</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span className="forge-pulse-dot" style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%' }} />
              <span style={{ color: 'var(--fg)' }}>{availability}</span>
            </div>
          </div>

          <h1
            style={{
              fontSize: 'clamp(54px, 11vw, 168px)',
              lineHeight: 0.92,
              letterSpacing: '-0.045em',
              fontWeight: 800,
              maxWidth: 1280,
              marginBottom: 56,
            }}
          >
            {heroHeadline}
          </h1>

          <div
            className="forge-hero-row"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 64,
              marginBottom: 80,
            }}
          >
            <div style={{ maxWidth: 620 }}>
              <p
                style={{
                  fontSize: 'clamp(18px, 1.8vw, 22px)',
                  lineHeight: 1.4,
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  color: 'var(--fg)',
                  marginBottom: 16,
                }}
              >
                {tagline}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 540 }}>
                {subtitle}
              </p>
            </div>

            <div className="forge-cta-row" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <a
                href="#work"
                onClick={(e) => scrollTo(e, '#work')}
                className="forge-cta-button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 24px',
                  background: 'var(--fg)',
                  color: 'var(--bg)',
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 999,
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  See the work
                  <ArrowRightIcon size={16} />
                </span>
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollTo(e, '#contact')}
                className="forge-cta-button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 24px',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 999,
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  Start a project
                  <ArrowUpRightIcon size={16} />
                </span>
              </a>
            </div>
          </div>

          <div style={accentBarStyle} />
        </section>

        <section
          id="services"
          className="forge-section"
          style={{ padding: '140px 32px', maxWidth: 1440, margin: '0 auto' }}
        >
          <div
            className="forge-section-head"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 32,
              marginBottom: 80,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--accent)', fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <span style={{ width: 28, height: 2, background: 'var(--accent)' }} />
                What we do
              </div>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 88px)', maxWidth: 900, letterSpacing: '-0.035em' }}>
                Six disciplines, one studio.
              </h2>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 360, fontWeight: 400 }}>
              We staff every engagement from a single integrated team. No subcontracted creative, no opaque handoffs, no diluted craft.
            </p>
          </div>

          <div
            className="forge-services-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0,
              borderTop: '1px solid var(--fg)',
              borderLeft: '1px solid var(--line)',
            }}
          >
            {services.map((s, i) => (
              <article
                key={i}
                className="forge-service-card"
                style={{
                  padding: '40px 32px 36px',
                  borderRight: '1px solid var(--line)',
                  borderBottom: '1px solid var(--line)',
                  minHeight: 360,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="forge-service-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div
                    className="forge-service-num"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "'Inter Tight', sans-serif",
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                      marginBottom: 56,
                    }}
                  >
                    <span>{s.number || String(i + 1).padStart(2, '0')} — service</span>
                    <ArrowUpRightIcon size={14} />
                  </div>

                  <h3 style={{ fontSize: 'clamp(28px, 3vw, 38px)', marginBottom: 16, letterSpacing: '-0.03em' }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: 'inherit', opacity: 0.78, marginBottom: 24, flex: 1 }}>
                    {s.description}
                  </p>
                  <div
                    className="forge-service-deliv"
                    style={{
                      paddingTop: 16,
                      borderTop: '1px solid var(--line)',
                      fontSize: 11,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      fontWeight: 500,
                      transition: 'color 0.4s ease, border-color 0.4s ease',
                    }}
                  >
                    <div style={{ marginBottom: 6 }}>{s.deliverables}</div>
                    {s.leadName && (
                      <div style={{ opacity: 0.7 }}>Lead — {s.leadName}</div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="forge-section" style={{ padding: '40px 32px 140px', maxWidth: 1440, margin: '0 auto' }}>
          <div style={heavyDividerStyle} />
          <div
            className="forge-section-head"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 32,
              padding: '64px 0 80px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--accent)', fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <span style={{ width: 28, height: 2, background: 'var(--accent)' }} />
                Selected work
              </div>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 88px)', maxWidth: 900, letterSpacing: '-0.035em' }}>
                Case studies.
              </h2>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 380 }}>
              A working sample of recent engagements. We measure success in shipped work and business outcomes, not awards alone.
            </p>
          </div>

          <div className="forge-work-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {works.map((w, i) => (
              <a
                key={i}
                href={w.liveUrl || '#'}
                target={w.liveUrl && w.liveUrl !== '#' ? '_blank' : undefined}
                rel="noreferrer"
                className="forge-work-card"
                style={{
                  display: 'block',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 4,
                  textDecoration: 'none',
                }}
              >
                <div
                  className="forge-work-content"
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 3',
                    background: w.image && /^https?:\/\//.test(w.image) ? `url(${w.image}) center/cover` : WORK_GRADIENTS[i % WORK_GRADIENTS.length],
                    position: 'relative',
                  }}
                >
                  <div
                    className="forge-work-meta"
                    style={{
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      right: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: 'rgba(255,255,255,0.86)',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      transition: 'color 0.4s ease',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      <span style={{ width: 18, height: 1, background: 'currentColor', opacity: 0.6 }} />
                      <span>{w.sector}</span>
                    </span>
                    <span>{w.year}</span>
                  </div>
                </div>

                <div className="forge-work-content" style={{ padding: '28px 28px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 'clamp(28px, 3vw, 40px)', marginBottom: 6, letterSpacing: '-0.03em' }}>
                        {w.title}
                      </h3>
                      <div className="forge-work-meta" style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500, transition: 'color 0.4s ease' }}>
                        {w.client}
                      </div>
                    </div>
                    <span
                      className="forge-work-arrow"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 44,
                        height: 44,
                        background: 'var(--bg)',
                        border: '1px solid var(--line)',
                        borderRadius: 999,
                        flexShrink: 0,
                      }}
                    >
                      <ArrowUpRightIcon size={16} />
                    </span>
                  </div>

                  <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.78, marginBottom: 24 }}>
                    {w.summary}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
                    <div className="forge-work-meta" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 500 }}>
                      {pl(w.services).join('  /  ')}
                    </div>
                    {w.result && (
                      <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', textAlign: 'right' }}>
                        {w.result}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section style={{ padding: '0 32px', maxWidth: 1440, margin: '0 auto' }}>
          <div style={heavyDividerStyle} />
        </section>

        <section id="clients" className="forge-section" style={{ padding: '120px 32px', maxWidth: 1440, margin: '0 auto' }}>
          <div
            className="forge-section-head"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 32,
              marginBottom: 56,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--accent)', fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <span style={{ width: 28, height: 2, background: 'var(--accent)' }} />
                Clients
              </div>
              <h2 style={{ fontSize: 'clamp(36px, 5vw, 72px)', letterSpacing: '-0.035em' }}>
                In good company.
              </h2>
            </div>
            <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 320 }}>
              A partial list of teams we have worked with across sectors.
            </p>
          </div>

          <div
            className="forge-clients-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              borderTop: '1px solid var(--fg)',
              borderLeft: '1px solid var(--line)',
            }}
          >
            {clients.map((cl, i) => (
              <div
                key={i}
                className="forge-client-cell"
                style={{
                  padding: '36px 24px',
                  borderRight: '1px solid var(--line)',
                  borderBottom: '1px solid var(--line)',
                  minHeight: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                  }}
                  className="forge-client-sector"
                >
                  {String(i + 1).padStart(2, '0')} — {cl.sector}
                </span>
                <div
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(22px, 2.4vw, 32px)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {cl.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '0 32px', maxWidth: 1440, margin: '0 auto' }}>
          <div style={heavyDividerStyle} />
        </section>

        <section id="process" className="forge-section" style={{ padding: '140px 32px', maxWidth: 1440, margin: '0 auto' }}>
          <div
            className="forge-section-head"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 32,
              marginBottom: 96,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--accent)', fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <span style={{ width: 28, height: 2, background: 'var(--accent)' }} />
                How we work
              </div>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 88px)', maxWidth: 1000, letterSpacing: '-0.035em' }}>
                A process built for the long haul.
              </h2>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 360 }}>
              Five phases. Tightly scoped. Built around standing relationships rather than transactional sprints.
            </p>
          </div>

          <div>
            {processSteps.map((p, i) => (
              <div
                key={i}
                className="forge-process-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 1fr',
                  gap: 48,
                  padding: '40px 0',
                  borderTop: i === 0 ? '1px solid var(--fg)' : '1px solid var(--line)',
                  borderBottom: i === processSteps.length - 1 ? '1px solid var(--fg)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 'clamp(36px, 5vw, 72px)',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    color: 'var(--accent)',
                    lineHeight: 0.9,
                  }}
                >
                  {p.number || String(i + 1).padStart(2, '0')}
                </div>

                <div>
                  <h3 style={{ fontSize: 'clamp(28px, 3vw, 40px)', marginBottom: 16, letterSpacing: '-0.03em' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 540 }}>
                    {p.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>
                      Typical duration
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{p.duration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>
                      Deliverables
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--fg)' }}>{p.deliverables}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="studio" className="forge-section" style={{ padding: '140px 32px', maxWidth: 1440, margin: '0 auto' }}>
          <div
            className="forge-section-head"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 32,
              marginBottom: 80,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--accent)', fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <span style={{ width: 28, height: 2, background: 'var(--accent)' }} />
                The studio
              </div>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 88px)', letterSpacing: '-0.035em' }}>
                People who do the work.
              </h2>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 360 }}>
              A small senior team. Every project is staffed and led by partners — never juniored out.
            </p>
          </div>

          <div className="forge-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {team.map((m, i) => (
              <article
                key={i}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 4,
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: TEAM_GRADIENTS[i % TEAM_GRADIENTS.length],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: "'Inter Tight', sans-serif",
                    fontWeight: 800,
                    fontSize: 28,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {(m.initial || m.name || '·').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: 22, marginBottom: 4, letterSpacing: '-0.02em' }}>
                    {m.name}
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
                    {m.role}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)' }}>{m.bio}</p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                  {m.linkedinUrl && (
                    <a
                      href={m.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${m.name} on LinkedIn`}
                      style={{
                        width: 36,
                        height: 36,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--line)',
                        borderRadius: 999,
                      }}
                    >
                      <LinkedinIcon />
                    </a>
                  )}
                  {m.twitterUrl && (
                    <a
                      href={m.twitterUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${m.name} on Twitter`}
                      style={{
                        width: 36,
                        height: 36,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--line)',
                        borderRadius: 999,
                      }}
                    >
                      <TwitterIcon />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="awards" className="forge-section" style={{ padding: '0 32px 140px', maxWidth: 1440, margin: '0 auto' }}>
          <div style={heavyDividerStyle} />
          <div
            className="forge-section-head"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 32,
              padding: '80px 0 56px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--accent)', fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <span style={{ width: 28, height: 2, background: 'var(--accent)' }} />
                Recognition
              </div>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 80px)', letterSpacing: '-0.035em' }}>
                Awards & press.
              </h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }} className="forge-press-row">
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16, fontWeight: 500 }}>
                Awards
              </div>
              <div style={{ borderTop: '1px solid var(--fg)' }}>
                {awards.map((a, i) => (
                  <div
                    key={i}
                    className="forge-awards-row"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 80px',
                      gap: 16,
                      padding: '20px 0',
                      borderBottom: '1px solid var(--line)',
                      alignItems: 'baseline',
                    }}
                  >
                    <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>{a.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{a.work} · {a.level}</div>
                    <div style={{ fontSize: 13, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', textAlign: 'right', fontWeight: 600 }}>{a.year}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16, fontWeight: 500 }}>
                Press
              </div>
              <div style={{ borderTop: '1px solid var(--fg)' }}>
                {press.map((p, i) => (
                  <a
                    key={i}
                    href={p.url || '#'}
                    target={p.url && p.url !== '#' ? '_blank' : undefined}
                    rel="noreferrer"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 16,
                      padding: '20px 0',
                      borderBottom: '1px solid var(--line)',
                      alignItems: 'baseline',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600, marginBottom: 6 }}>{p.outlet} · {p.year}</div>
                      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1.25 }}>{p.headline}</div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
                      <ArrowUpRightIcon size={14} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" style={{ background: 'var(--accent)', color: '#ffffff', padding: '120px 32px' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto' }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: 80 }}>
              Said about us
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 80 }}>
              {testimonials.map((t, i) => (
                <figure key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24, alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 64, lineHeight: 0.8, color: '#ffffff' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <blockquote
                      className="forge-testimonial-quote"
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontWeight: 600,
                        fontSize: 'clamp(24px, 3.4vw, 48px)',
                        lineHeight: 1.15,
                        letterSpacing: '-0.025em',
                        marginBottom: 24,
                        color: '#ffffff',
                      }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 600 }}>
                      <span style={{ width: 24, height: 1, background: '#ffffff' }} />
                      <span>{t.author}, {t.role} · {t.company}</span>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {careers.length > 0 && (
          <section id="careers" className="forge-section" style={{ padding: '140px 32px', maxWidth: 1440, margin: '0 auto' }}>
            <div
              className="forge-section-head"
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 32,
                marginBottom: 64,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--accent)', fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  <span style={{ width: 28, height: 2, background: 'var(--accent)' }} />
                  Careers
                </div>
                <h2 style={{ fontSize: 'clamp(40px, 6vw, 88px)', letterSpacing: '-0.035em', maxWidth: 900 }}>
                  We&rsquo;re hiring.
                </h2>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 360 }}>
                We hire infrequently and carefully. If the work resonates and a role fits, please reach out — we read every note.
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--fg)' }}>
              {careers.map((j, i) => (
                <a
                  key={i}
                  href={j.url || '#'}
                  target={j.url && j.url !== '#' ? '_blank' : undefined}
                  rel="noreferrer"
                  className="forge-careers-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 2fr 1fr 1fr 60px',
                    gap: 24,
                    alignItems: 'center',
                    padding: '28px 0',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700, fontSize: 'clamp(22px, 2.4vw, 30px)', letterSpacing: '-0.025em' }}>
                    {j.role}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
                    {j.type}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                    {j.location}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, border: '1px solid var(--line)', borderRadius: 999 }}>
                      <ArrowUpRightIcon size={14} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <section id="contact" className="forge-section" style={{ padding: '0 32px 80px', maxWidth: 1440, margin: '0 auto' }}>
          <div style={heavyDividerStyle} />
          <div style={{ padding: '120px 0 80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--accent)', fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              <span style={{ width: 28, height: 2, background: 'var(--accent)' }} />
              Start a project
            </div>
            <h2 style={{ fontSize: 'clamp(48px, 8vw, 128px)', maxWidth: 1280, letterSpacing: '-0.04em', marginBottom: 64 }}>
              Let&rsquo;s build something that matters.
            </h2>

            <div className="forge-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 96, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12, fontWeight: 500 }}>
                    New business
                  </div>
                  <a
                    href={`mailto:${newBizEmail}`}
                    className="forge-link-underline"
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontWeight: 700,
                      fontSize: 'clamp(22px, 2.6vw, 32px)',
                      letterSpacing: '-0.02em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <MailIcon />
                    {newBizEmail}
                  </a>
                </div>

                <div>
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12, fontWeight: 500 }}>
                    General
                  </div>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="forge-link-underline"
                    style={{ fontSize: 16, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 10 }}
                  >
                    {contactEmail}
                  </a>
                </div>

                <div>
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12, fontWeight: 500 }}>
                    Phone
                  </div>
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, '')}`}
                    className="forge-link-underline"
                    style={{ fontSize: 16, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 10 }}
                  >
                    <PhoneIcon />
                    {contactPhone}
                  </a>
                </div>

                <div>
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12, fontWeight: 500 }}>
                    Studio
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <MapPinIcon />
                    {location}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      style={{ width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)', borderRadius: 999 }}
                    >
                      <LinkedinIcon />
                    </a>
                  )}
                  {twitterUrl && (
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Twitter"
                      style={{ width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)', borderRadius: 999 }}
                    >
                      <TwitterIcon />
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      style={{ width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)', borderRadius: 999 }}
                    >
                      <InstagramIcon />
                    </a>
                  )}
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 4,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 24,
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>
                    Your name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={onField('name')}
                    placeholder="Jane Smith"
                    style={{
                      width: '100%',
                      borderBottom: '1px solid var(--line)',
                      padding: '10px 0',
                      fontSize: 16,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={onField('email')}
                    placeholder="you@company.com"
                    style={{
                      width: '100%',
                      borderBottom: '1px solid var(--line)',
                      padding: '10px 0',
                      fontSize: 16,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>
                    Budget range
                  </label>
                  <select
                    value={formState.budget}
                    onChange={onField('budget')}
                    style={{
                      width: '100%',
                      borderBottom: '1px solid var(--line)',
                      padding: '10px 0',
                      fontSize: 16,
                      background: 'transparent',
                      appearance: 'none',
                    }}
                  >
                    <option value="">Select a range</option>
                    <option value="50-100">$50k — $100k</option>
                    <option value="100-250">$100k — $250k</option>
                    <option value="250-500">$250k — $500k</option>
                    <option value="500+">$500k+</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>
                    Tell us about the project
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={onField('message')}
                    placeholder="Goals, timeline, anything we should know..."
                    style={{
                      width: '100%',
                      borderBottom: '1px solid var(--line)',
                      padding: '10px 0',
                      fontSize: 16,
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="forge-cta-button"
                  style={{
                    marginTop: 8,
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 26px',
                    background: 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 600,
                    borderRadius: 999,
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    {submitted ? 'Thanks — we’ll be in touch' : 'Send inquiry'}
                    <ArrowUpRightIcon size={16} />
                  </span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ position: 'relative', zIndex: 2, borderTop: '1px solid var(--line)', padding: '80px 32px 40px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div className="forge-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, background: 'var(--accent)', color: '#fff', fontFamily: "'Inter Tight', sans-serif", fontWeight: 900, fontSize: 22, borderRadius: 2 }}>
                  {wordmarkInitial}
                </span>
                <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>{name}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)', maxWidth: 380 }}>
                {tagline} Building brands, products, and campaigns since {foundedYear}.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16, fontWeight: 600 }}>
                Studio
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} onClick={(e) => scrollTo(e, l.href)} style={{ fontSize: 14 }} className="forge-link-underline">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16, fontWeight: 600 }}>
                Contact
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <a href={`mailto:${newBizEmail}`} className="forge-link-underline">{newBizEmail}</a>
                <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="forge-link-underline">{contactPhone}</a>
                <span style={{ color: 'var(--muted)' }}>{location}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16, fontWeight: 600 }}>
                Follow
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)', borderRadius: 999 }}>
                    <LinkedinIcon />
                  </a>
                )}
                {twitterUrl && (
                  <a href={twitterUrl} target="_blank" rel="noreferrer" aria-label="Twitter" style={{ width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)', borderRadius: 999 }}>
                    <TwitterIcon />
                  </a>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" style={{ width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)', borderRadius: 999 }}>
                    <InstagramIcon />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div style={accentBarStyle} />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              paddingTop: 32,
              fontSize: 12,
              color: 'var(--muted)',
              letterSpacing: '0.04em',
            }}
          >
            <div>
              &copy; {new Date().getFullYear()} {name} — All rights reserved.
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
              <span>@{username}</span>
              {!hideBranding && (
                <span>
                  {name} · Built with <a href="https://folioforge.app" target="_blank" rel="noreferrer" className="forge-link-underline" style={{ fontWeight: 600 }}>FolioForge</a>
                </span>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
