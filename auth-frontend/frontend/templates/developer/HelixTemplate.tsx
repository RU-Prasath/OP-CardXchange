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

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const SunIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const MenuIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

export default function HelixTemplate({ content, username, hideBranding }: Props) {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const c = content;

  const bg = c.colorBg || '#0a0a0a';
  const fg = c.colorFg || '#f5f5f0';
  const panel = c.colorPanel || '#f5f5f0';
  const panelFg = c.colorPanelFg || '#0a0a0a';
  const accent = c.colorAccent || '#9eff00';
  const line = c.colorLine || '#1f1f1f';
  const lineStrong = c.colorLineStrong || '#2a2a2a';
  const muted = c.colorMuted || '#7a7a72';

  const darkVars = `
    --hx-bg: ${bg};
    --hx-fg: ${fg};
    --hx-panel: ${panel};
    --hx-panel-fg: ${panelFg};
    --hx-accent: ${accent};
    --hx-line: ${line};
    --hx-line-strong: ${lineStrong};
    --hx-muted: ${muted};
    --hx-inv-bg: ${fg};
    --hx-inv-fg: ${bg};
  `;
  const lightVars = `
    --hx-bg: #f5f5f0;
    --hx-fg: #0a0a0a;
    --hx-panel: #0a0a0a;
    --hx-panel-fg: #f5f5f0;
    --hx-accent: ${accent};
    --hx-line: #d4d4cc;
    --hx-line-strong: #a8a89e;
    --hx-muted: #525248;
    --hx-inv-bg: #0a0a0a;
    --hx-inv-fg: #f5f5f0;
  `;

  const cssVars = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');

    .helix-template {
      ${dark ? darkVars : lightVars}
      font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: var(--hx-bg);
      color: var(--hx-fg);
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }
    .helix-template * { box-sizing: border-box; margin: 0; padding: 0; }
    .helix-template a { color: inherit; text-decoration: none; }
    .helix-template button { font-family: inherit; cursor: pointer; }
    .helix-template input, .helix-template textarea { font-family: inherit; }

    .helix-template::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 100;
      background-image: repeating-linear-gradient(
        0deg,
        rgba(0,0,0,0.04) 0px,
        rgba(0,0,0,0.04) 1px,
        transparent 1px,
        transparent 3px
      );
      mix-blend-mode: overlay;
      opacity: 0.5;
    }

    @keyframes hx-blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    @keyframes hx-marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    @keyframes hx-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .hx-blink { animation: hx-blink 1s steps(1) infinite; }
    .hx-pulse { animation: hx-pulse 1.4s ease-in-out infinite; }

    .helix-template .hx-link-underline {
      position: relative;
      display: inline-block;
    }
    .helix-template .hx-link-underline::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -2px;
      height: 2px;
      background: var(--hx-accent);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.25s ease;
    }
    .helix-template .hx-link-underline:hover::after { transform: scaleX(1); }

    .helix-template .hx-card-hover:hover {
      background: var(--hx-accent) !important;
      color: #0a0a0a !important;
    }
    .helix-template .hx-card-hover:hover .hx-card-meta {
      color: #0a0a0a !important;
      border-color: #0a0a0a !important;
    }
    .helix-template .hx-card-hover:hover .hx-card-chip {
      background: #0a0a0a !important;
      color: var(--hx-accent) !important;
      border-color: #0a0a0a !important;
    }

    .helix-template .hx-btn-primary:hover {
      background: var(--hx-fg) !important;
      color: var(--hx-bg) !important;
    }
    .helix-template .hx-btn-ghost:hover {
      background: var(--hx-accent) !important;
      color: #0a0a0a !important;
      border-color: var(--hx-accent) !important;
    }
    .helix-template .hx-nav-link:hover {
      color: var(--hx-accent) !important;
    }
    .helix-template .hx-chip:hover {
      background: var(--hx-accent) !important;
      color: #0a0a0a !important;
      border-color: var(--hx-accent) !important;
    }
    .helix-template .hx-social:hover {
      background: var(--hx-accent) !important;
      color: #0a0a0a !important;
      border-color: var(--hx-accent) !important;
    }

    .helix-template input:focus, .helix-template textarea:focus {
      outline: none;
      border-color: var(--hx-accent) !important;
      background: rgba(158,255,0,0.04) !important;
    }

    .helix-template .hx-marquee-track {
      display: inline-flex;
      animation: hx-marquee 40s linear infinite;
      white-space: nowrap;
    }

    .helix-template .hx-mobile-menu {
      display: none;
    }

    @media (max-width: 768px) {
      .hx-desktop-nav { display: none !important; }
      .hx-mobile-toggle { display: flex !important; }
      .helix-template .hx-mobile-menu.open { display: block !important; }
      .hx-hero-name { font-size: clamp(48px, 14vw, 96px) !important; }
      .hx-section-title { font-size: clamp(32px, 8vw, 56px) !important; }
      .hx-grid-asym { grid-template-columns: 1fr !important; }
      .hx-about-grid { grid-template-columns: 1fr !important; }
      .hx-skills-grid { grid-template-columns: 1fr !important; }
      .hx-projects-grid { grid-template-columns: 1fr !important; }
      .hx-edu-grid { grid-template-columns: 1fr !important; }
      .hx-contact-grid { grid-template-columns: 1fr !important; }
      .hx-exp-row { grid-template-columns: 1fr !important; }
      .hx-hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
      .hx-container { padding-left: 20px !important; padding-right: 20px !important; }
      .hx-section { padding: 64px 0 !important; }
      .hx-corner-bracket { display: none !important; }
      .hx-hero-meta { grid-template-columns: 1fr !important; }
      .hx-footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
      .hx-cta-group { flex-direction: column !important; align-items: stretch !important; }
      .hx-cta-group > * { width: 100% !important; justify-content: center !important; }
    }

    @media (max-width: 480px) {
      .hx-hero-name { font-size: clamp(40px, 16vw, 72px) !important; }
      .hx-section-num { font-size: 14px !important; }
    }
  `;

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navLinks = [
    { num: '01', href: '#about', label: 'ABOUT' },
    { num: '02', href: '#skills', label: 'STACK' },
    { num: '03', href: '#experience', label: 'WORK' },
    { num: '04', href: '#projects', label: 'BUILDS' },
    { num: '05', href: '#education', label: 'CREDS' },
    { num: '06', href: '#contact', label: 'CONTACT' },
  ];

  const name = c.name || 'Your Name';
  const initial = name.charAt(0).toUpperCase();
  const title = c.title || 'Software Engineer';
  const subtitle = c.subtitle || 'building thoughtful interfaces and resilient systems with an obsession for typography, performance, and the small details that compound.';
  const availability = c.availability || 'available for work';
  const resumeUrl = c.resumeUrl || '';

  const heroStats = parseJ<Array<{ label: string; value: string }>>(c.heroStats, [
    { label: 'YEARS', value: c.yearsExp || '5+' },
    { label: 'SHIPPED', value: '40+' },
    { label: 'STACK', value: 'TS/GO' },
    { label: 'TZ', value: c.timezone || 'UTC+0' },
  ]);

  const skillsJsonArr = parseJ<Array<{ category: string; items: string }>>(c.skillsJson, []);
  const skillCategories = skillsJsonArr.length > 0
    ? skillsJsonArr.map((s) => ({ title: s.category, items: pl(s.items) }))
    : [
        { title: 'LANGUAGES', items: pl(c.skillLang) },
        { title: 'FRAMEWORKS', items: pl(c.skillFramework) },
        { title: 'BACKEND', items: pl(c.skillBackend) },
        { title: 'TOOLING', items: pl(c.skillTooling) },
        { title: 'PLATFORM', items: pl(c.skillPlatform) },
      ].filter((s) => s.items.length > 0);

  const skillsToRender = skillCategories.length > 0 ? skillCategories : [
    { title: 'LANGUAGES', items: ['TypeScript', 'Go', 'Python', 'Rust', 'SQL'] },
    { title: 'FRAMEWORKS', items: ['React', 'Next.js', 'Remix', 'Svelte'] },
    { title: 'BACKEND', items: ['Node.js', 'PostgreSQL', 'Redis', 'gRPC'] },
    { title: 'TOOLING', items: ['Vite', 'Turborepo', 'Vitest', 'Playwright'] },
    { title: 'PLATFORM', items: ['Docker', 'Kubernetes', 'AWS', 'Vercel'] },
  ];

  const expJsonArr = parseJ<
    Array<{
      period: string;
      duration: string;
      role: string;
      company: string;
      summary: string;
      bullets: string;
      stack: string;
      isCurrent: boolean;
    }>
  >(c.expJson, []);

  const experiences = expJsonArr.length > 0
    ? expJsonArr.map((e) => ({
        period: e.period,
        duration: e.duration,
        role: e.role,
        company: e.company,
        summary: e.summary,
        bullets: lines(e.bullets),
        stack: pl(e.stack),
        isCurrent: !!e.isCurrent,
      }))
    : [
        {
          period: '2023 — NOW',
          duration: '2 yrs',
          role: 'Senior Software Engineer',
          company: 'Acme Labs',
          summary: 'Leading platform engineering for a distributed data product used by 200+ teams.',
          bullets: [
            'Architected a multi-tenant ingestion pipeline processing 4B events/day.',
            'Cut p99 query latency from 800ms to 90ms via query planning + caching.',
            'Mentored 6 engineers; ran the internal frontend guild.',
          ],
          stack: ['TypeScript', 'Go', 'Postgres', 'Kafka', 'K8s'],
          isCurrent: true,
        },
        {
          period: '2020 — 2023',
          duration: '3 yrs',
          role: 'Software Engineer',
          company: 'Northwind',
          summary: 'Full-stack engineer on the growth team, shipping experiments and core product.',
          bullets: [
            'Owned the onboarding flow that doubled W1 activation.',
            'Built the in-house A/B framework still used company-wide.',
          ],
          stack: ['React', 'Next.js', 'Node', 'Redis'],
          isCurrent: false,
        },
      ];

  const projJsonArr = parseJ<
    Array<{
      title: string;
      tag: string;
      desc: string;
      stack: string;
      liveUrl: string;
      githubUrl: string;
    }>
  >(c.projJson, []);

  const projects = projJsonArr.length > 0
    ? projJsonArr.map((p) => ({
        title: p.title,
        tag: p.tag,
        desc: p.desc,
        stack: pl(p.stack),
        liveUrl: p.liveUrl,
        githubUrl: p.githubUrl,
      })).filter((p) => p.title)
    : [
        {
          title: 'Lattice',
          tag: 'OSS / DEVTOOL',
          desc: 'A zero-config edge analytics SDK with type-safe events and SQL-style aggregation.',
          stack: ['TypeScript', 'Cloudflare', 'DuckDB'],
          liveUrl: '#',
          githubUrl: '#',
        },
        {
          title: 'Beacon',
          tag: 'PRODUCT',
          desc: 'Realtime infrastructure observability for distributed systems at scale.',
          stack: ['Go', 'ClickHouse', 'React'],
          liveUrl: '#',
          githubUrl: '#',
        },
        {
          title: 'Folio',
          tag: 'CLIENT WORK',
          desc: 'Editorial-grade publishing platform for independent writers — bring your own domain.',
          stack: ['Next.js', 'Postgres', 'Stripe'],
          liveUrl: '#',
          githubUrl: '',
        },
        {
          title: 'Halt',
          tag: 'OSS / CLI',
          desc: 'A frighteningly fast CLI for managing local dev environments and per-project secrets.',
          stack: ['Rust', 'TOML'],
          liveUrl: '',
          githubUrl: '#',
        },
      ];

  const educationArr = parseJ<
    Array<{ school: string; degree: string; period: string; detail: string }>
  >(c.educationJson, [
    {
      school: 'University of Somewhere',
      degree: 'B.Sc. Computer Science',
      period: '2016 — 2020',
      detail: 'Focus on distributed systems and programming languages. Graduated with honors.',
    },
  ]);

  const certsArr = parseJ<Array<{ name: string; issuer: string; year: string; url: string }>>(c.certsJson, [
    { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', year: '2023', url: '' },
    { name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2022', url: '' },
  ]);

  const contactEmail = c.contactEmail || 'hello@example.com';
  const contactPhone = c.contactPhone || '+00 0000 0000';
  const contactLocation = c.contactLocation || 'Earth';
  const githubUrl = c.githubUrl || '';
  const linkedinUrl = c.linkedinUrl || '';
  const twitterUrl = c.twitterUrl || '';

  const aboutP1 = c.aboutP1 || `I'm ${name}, a ${title.toLowerCase()} who treats software as a craft. I care about the substrate — the wiring beneath features — and the surface — the experience of using them.`;
  const aboutP2 = c.aboutP2 || 'Currently focused on developer tooling, performance, and the messy reality of distributed systems. Previously: design systems, infra, and a handful of zero-to-one products.';
  const locationLabel = c.locationLabel || contactLocation;
  const yearsExp = c.yearsExp || '5+';
  const timezone = c.timezone || 'UTC+0';

  const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
  const maxW = '1280px';

  const sectionHeader = (num: string, title: string, sub?: string) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: '24px',
        alignItems: 'start',
        borderTop: '3px solid var(--hx-fg)',
        paddingTop: '24px',
        marginBottom: '56px',
      }}
      className="hx-grid-asym"
    >
      <div
        className="hx-section-num"
        style={{
          fontFamily: mono,
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          color: 'var(--hx-accent)',
        }}
      >
        [{num}]
      </div>
      <div>
        <h2
          className="hx-section-title"
          style={{
            fontFamily: mono,
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            textTransform: 'uppercase',
            marginBottom: sub ? '16px' : 0,
          }}
        >
          {title}
        </h2>
        {sub && (
          <p
            style={{
              fontFamily: mono,
              fontSize: '13px',
              color: 'var(--hx-muted)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              maxWidth: '560px',
              lineHeight: 1.5,
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );

  const cornerBracket = (pos: 'tl' | 'tr' | 'bl' | 'br') => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: '16px',
      height: '16px',
      borderColor: 'var(--hx-fg)',
      borderStyle: 'solid',
      borderWidth: '0',
    };
    const map: Record<typeof pos, React.CSSProperties> = {
      tl: { top: '-2px', left: '-2px', borderTopWidth: '3px', borderLeftWidth: '3px' },
      tr: { top: '-2px', right: '-2px', borderTopWidth: '3px', borderRightWidth: '3px' },
      bl: { bottom: '-2px', left: '-2px', borderBottomWidth: '3px', borderLeftWidth: '3px' },
      br: { bottom: '-2px', right: '-2px', borderBottomWidth: '3px', borderRightWidth: '3px' },
    };
    return <span aria-hidden="true" style={{ ...base, ...map[pos] }} />;
  };

  return (
    <div className="helix-template" data-theme={dark ? 'dark' : 'light'}>
      <style suppressHydrationWarning>{cssVars}</style>

      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 60,
          background: 'var(--hx-bg)',
          borderBottom: '3px solid var(--hx-fg)',
        }}
      >
        <div
          className="hx-container"
          style={{
            maxWidth: maxW,
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px',
            gap: '16px',
          }}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'var(--hx-fg)',
                color: 'var(--hx-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: mono,
                fontWeight: 800,
                fontSize: '20px',
                border: '3px solid var(--hx-fg)',
              }}
            >
              {initial}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, gap: '2px' }}>
              <span
                style={{
                  fontFamily: mono,
                  fontWeight: 700,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: '10px',
                  color: 'var(--hx-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  className="hx-pulse"
                  style={{
                    width: '7px',
                    height: '7px',
                    background: 'var(--hx-accent)',
                    display: 'inline-block',
                  }}
                />
                {availability}
              </span>
            </div>
          </a>

          <div className="hx-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="hx-nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '6px',
                  padding: '10px 14px',
                  fontFamily: mono,
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'var(--hx-fg)',
                  transition: 'color 0.15s ease',
                }}
              >
                <span style={{ fontSize: '10px', color: 'var(--hx-muted)' }}>{link.num}</span>
                {link.label}
              </a>
            ))}
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              style={{
                marginLeft: '12px',
                width: '40px',
                height: '40px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--hx-fg)',
                background: 'transparent',
                color: 'var(--hx-fg)',
              }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hx-mobile-toggle"
            aria-label="Toggle menu"
            style={{
              display: 'none',
              width: '40px',
              height: '40px',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--hx-fg)',
              background: 'transparent',
              color: 'var(--hx-fg)',
            }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <div
          className={`hx-mobile-menu ${menuOpen ? 'open' : ''}`}
          style={{
            borderTop: menuOpen ? '3px solid var(--hx-fg)' : 'none',
            background: 'var(--hx-bg)',
          }}
        >
          <div
            style={{
              maxWidth: maxW,
              margin: '0 auto',
              padding: '12px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px',
                  padding: '14px 12px',
                  fontFamily: mono,
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  borderBottom: '1px solid var(--hx-line-strong)',
                }}
              >
                <span style={{ color: 'var(--hx-accent)', fontSize: '12px' }}>[{link.num}]</span>
                {link.label}
              </a>
            ))}
            <button
              onClick={() => setDark(!dark)}
              style={{
                marginTop: '16px',
                padding: '14px',
                fontFamily: mono,
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                border: '2px solid var(--hx-fg)',
                background: 'transparent',
                color: 'var(--hx-fg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
              {dark ? 'LIGHT MODE' : 'DARK MODE'}
            </button>
          </div>
        </div>
      </nav>

      <section
        id="top"
        className="hx-section"
        style={{
          position: 'relative',
          padding: '96px 0 80px',
          borderBottom: '3px solid var(--hx-fg)',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(var(--hx-line) 1px, transparent 1px), linear-gradient(90deg, var(--hx-line) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />
        <div
          className="hx-container"
          style={{
            position: 'relative',
            maxWidth: maxW,
            margin: '0 auto',
            padding: '0 32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: mono,
              fontSize: '12px',
              color: 'var(--hx-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '32px',
                height: '2px',
                background: 'var(--hx-accent)',
              }}
            />
            <span>PORTFOLIO / V.001 / {new Date().getFullYear()}</span>
            <span className="hx-blink" style={{ color: 'var(--hx-accent)' }}>_</span>
          </div>

          <h1
            className="hx-hero-name"
            style={{
              fontFamily: mono,
              fontSize: 'clamp(64px, 12vw, 180px)',
              fontWeight: 800,
              letterSpacing: '-0.06em',
              lineHeight: 0.85,
              textTransform: 'uppercase',
              marginBottom: '32px',
              wordBreak: 'break-word',
            }}
          >
            {name.split(' ').map((part, i, arr) => (
              <span key={i} style={{ display: 'block' }}>
                {i === arr.length - 1 ? (
                  <>
                    {part}
                    <span style={{ color: 'var(--hx-accent)' }}>.</span>
                  </>
                ) : (
                  part
                )}
              </span>
            ))}
          </h1>

          <div
            className="hx-hero-meta"
            style={{
              display: 'grid',
              gridTemplateColumns: '3fr 9fr',
              gap: '32px',
              alignItems: 'start',
              marginBottom: '48px',
              borderTop: '2px solid var(--hx-line-strong)',
              paddingTop: '24px',
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: '12px',
                color: 'var(--hx-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                lineHeight: 1.6,
              }}
            >
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: 'var(--hx-accent)' }}>{'>'}</span> ROLE
              </div>
              <div style={{ color: 'var(--hx-fg)', fontSize: '16px', fontWeight: 600 }}>
                {title}
              </div>
            </div>
            <p
              style={{
                fontFamily: mono,
                fontSize: 'clamp(16px, 1.5vw, 20px)',
                lineHeight: 1.55,
                color: 'var(--hx-fg)',
                maxWidth: '720px',
                textTransform: 'lowercase',
              }}
            >
              {subtitle}
            </p>
          </div>

          <div
            className="hx-cta-group"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '64px',
            }}
          >
            <a
              href="#projects"
              onClick={(e) => scrollTo(e, '#projects')}
              className="hx-btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 24px',
                background: 'var(--hx-accent)',
                color: '#0a0a0a',
                fontFamily: mono,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '3px solid var(--hx-fg)',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              VIEW WORK <ArrowDownIcon />
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, '#contact')}
              className="hx-btn-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 24px',
                background: 'transparent',
                color: 'var(--hx-fg)',
                fontFamily: mono,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '3px solid var(--hx-fg)',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              GET IN TOUCH <ArrowRightIcon />
            </a>
            {resumeUrl && (
              <a
                href={resumeUrl}
                download
                className="hx-btn-ghost"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 24px',
                  background: 'transparent',
                  color: 'var(--hx-fg)',
                  fontFamily: mono,
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: '3px solid var(--hx-fg)',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
              >
                RESUME.PDF <ExternalLinkIcon />
              </a>
            )}
          </div>

          <div
            className="hx-hero-stats"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${heroStats.length}, 1fr)`,
              border: '3px solid var(--hx-fg)',
              background: 'var(--hx-bg)',
            }}
          >
            {heroStats.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: '24px 20px',
                  borderRight: i < heroStats.length - 1 ? '2px solid var(--hx-line-strong)' : 'none',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--hx-muted)',
                    letterSpacing: '0.12em',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  [{String(i).padStart(2, '0')}] {s.label}
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 'clamp(24px, 3vw, 36px)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'var(--hx-fg)',
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
        style={{
          borderBottom: '3px solid var(--hx-fg)',
          padding: '20px 0',
          overflow: 'hidden',
          background: 'var(--hx-fg)',
          color: 'var(--hx-bg)',
        }}
      >
        <div className="hx-marquee-track" style={{ fontFamily: mono, fontWeight: 800, fontSize: '20px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} style={{ paddingRight: '40px' }}>
              {title} <span style={{ color: 'var(--hx-accent)' }}>///</span> {locationLabel} <span style={{ color: 'var(--hx-accent)' }}>///</span> {availability.toUpperCase()} <span style={{ color: 'var(--hx-accent)' }}>///</span>
            </span>
          ))}
        </div>
      </div>

      <section
        id="about"
        className="hx-section"
        style={{
          padding: '96px 0',
          borderBottom: '3px solid var(--hx-fg)',
        }}
      >
        <div className="hx-container" style={{ maxWidth: maxW, margin: '0 auto', padding: '0 32px' }}>
          {sectionHeader('00', 'ABOUT', 'who, why, and how I work.')}

          <div
            className="hx-about-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '7fr 5fr',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: mono,
                  fontSize: 'clamp(16px, 1.4vw, 19px)',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                  color: 'var(--hx-fg)',
                  textTransform: 'lowercase',
                }}
              >
                {aboutP1}
              </p>
              <p
                style={{
                  fontFamily: mono,
                  fontSize: 'clamp(16px, 1.4vw, 19px)',
                  lineHeight: 1.7,
                  color: 'var(--hx-muted)',
                  textTransform: 'lowercase',
                }}
              >
                {aboutP2}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
              {[
                { k: 'LOCATION', v: locationLabel },
                { k: 'EXPERIENCE', v: `${yearsExp} years` },
                { k: 'TIMEZONE', v: timezone },
                { k: 'STATUS', v: availability },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    padding: '20px 0',
                    borderTop: i === 0 ? '2px solid var(--hx-fg)' : '1px solid var(--hx-line-strong)',
                    borderBottom: i === 3 ? '2px solid var(--hx-fg)' : 'none',
                    alignItems: 'baseline',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: 'var(--hx-muted)',
                    }}
                  >
                    {row.k}
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--hx-fg)',
                      textTransform: 'lowercase',
                      wordBreak: 'break-word',
                    }}
                  >
                    {row.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="skills"
        className="hx-section"
        style={{
          padding: '96px 0',
          borderBottom: '3px solid var(--hx-fg)',
          background: 'var(--hx-bg)',
        }}
      >
        <div className="hx-container" style={{ maxWidth: maxW, margin: '0 auto', padding: '0 32px' }}>
          {sectionHeader('02', 'STACK', 'tools I reach for, grouped by where they live.')}

          <div
            className="hx-skills-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0',
              border: '3px solid var(--hx-fg)',
            }}
          >
            {skillsToRender.map((cat, i) => (
              <div
                key={cat.title}
                style={{
                  padding: '28px 24px',
                  borderRight: '2px solid var(--hx-line-strong)',
                  borderBottom: '2px solid var(--hx-line-strong)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    gap: '12px',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: mono,
                      fontSize: '14px',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--hx-fg)',
                    }}
                  >
                    {cat.title}
                  </h3>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: '11px',
                      color: 'var(--hx-accent)',
                      fontWeight: 700,
                    }}
                  >
                    [{String(i).padStart(2, '0')}]
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="hx-chip"
                      style={{
                        fontFamily: mono,
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '6px 10px',
                        border: '2px solid var(--hx-fg)',
                        background: 'transparent',
                        color: 'var(--hx-fg)',
                        letterSpacing: '0.02em',
                        textTransform: 'lowercase',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="experience"
        className="hx-section"
        style={{
          padding: '96px 0',
          borderBottom: '3px solid var(--hx-fg)',
        }}
      >
        <div className="hx-container" style={{ maxWidth: maxW, margin: '0 auto', padding: '0 32px' }}>
          {sectionHeader('03', 'WORK', 'where I have been and what I shipped.')}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {experiences.map((exp, i) => (
              <div
                key={i}
                className="hx-exp-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 9fr',
                  gap: '32px',
                  padding: '32px 0',
                  borderTop: '2px solid var(--hx-fg)',
                  borderBottom: i === experiences.length - 1 ? '2px solid var(--hx-fg)' : 'none',
                  position: 'relative',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: mono,
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: exp.isCurrent ? 'var(--hx-accent)' : 'var(--hx-muted)',
                      marginBottom: '8px',
                    }}
                  >
                    {exp.isCurrent && (
                      <span
                        className="hx-pulse"
                        style={{
                          width: '8px',
                          height: '8px',
                          background: 'var(--hx-accent)',
                          display: 'inline-block',
                        }}
                      />
                    )}
                    {exp.period || '—'} {exp.duration && `· ${exp.duration}`}
                  </div>
                  {exp.stack.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginTop: '16px',
                      }}
                    >
                      {exp.stack.map((s) => (
                        <span
                          key={s}
                          style={{
                            fontFamily: mono,
                            fontSize: '11px',
                            padding: '4px 8px',
                            border: '1.5px solid var(--hx-line-strong)',
                            color: 'var(--hx-muted)',
                            textTransform: 'lowercase',
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: mono,
                      fontSize: 'clamp(22px, 2.4vw, 30px)',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      marginBottom: '4px',
                      color: 'var(--hx-fg)',
                    }}
                  >
                    {exp.role || 'Role'}
                  </h3>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--hx-accent)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      marginBottom: '16px',
                    }}
                  >
                    @ {exp.company || 'Company'}
                  </div>
                  {exp.summary && (
                    <p
                      style={{
                        fontFamily: mono,
                        fontSize: '15px',
                        lineHeight: 1.6,
                        color: 'var(--hx-muted)',
                        marginBottom: '20px',
                        textTransform: 'lowercase',
                      }}
                    >
                      {exp.summary}
                    </p>
                  )}
                  {exp.bullets.length > 0 && (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {exp.bullets.map((b, bi) => (
                        <li
                          key={bi}
                          style={{
                            fontFamily: mono,
                            fontSize: '14px',
                            lineHeight: 1.6,
                            color: 'var(--hx-fg)',
                            display: 'grid',
                            gridTemplateColumns: '24px 1fr',
                            gap: '8px',
                            textTransform: 'lowercase',
                          }}
                        >
                          <span style={{ color: 'var(--hx-accent)', fontWeight: 700 }}>{'> '}</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="hx-section"
        style={{
          padding: '96px 0',
          borderBottom: '3px solid var(--hx-fg)',
        }}
      >
        <div className="hx-container" style={{ maxWidth: maxW, margin: '0 auto', padding: '0 32px' }}>
          {sectionHeader('04', 'BUILDS', 'selected work — products, tools, experiments.')}

          <div
            className="hx-projects-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0',
              border: '3px solid var(--hx-fg)',
            }}
          >
            {projects.map((p, i) => (
              <div
                key={i}
                className="hx-card-hover"
                style={{
                  position: 'relative',
                  padding: '32px 28px',
                  borderRight: i % 2 === 0 ? '2px solid var(--hx-line-strong)' : 'none',
                  borderBottom: i < projects.length - 2 ? '2px solid var(--hx-line-strong)' : 'none',
                  background: 'var(--hx-bg)',
                  color: 'var(--hx-fg)',
                  transition: 'background 0.15s ease, color 0.15s ease',
                  minHeight: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    gap: '16px',
                  }}
                >
                  <span
                    className="hx-card-meta"
                    style={{
                      fontFamily: mono,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      padding: '4px 8px',
                      border: '1.5px solid var(--hx-line-strong)',
                      color: 'var(--hx-muted)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {p.tag || 'PROJECT'}
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: '12px',
                      fontWeight: 800,
                      color: 'var(--hx-accent)',
                    }}
                  >
                    [{String(i).padStart(2, '0')}]
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: mono,
                    fontSize: 'clamp(28px, 3vw, 40px)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                  }}
                >
                  {p.title}
                </h3>

                <p
                  style={{
                    fontFamily: mono,
                    fontSize: '14px',
                    lineHeight: 1.6,
                    marginBottom: '24px',
                    flex: 1,
                    textTransform: 'lowercase',
                  }}
                >
                  {p.desc}
                </p>

                {p.stack.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '20px',
                    }}
                  >
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="hx-card-chip"
                        style={{
                          fontFamily: mono,
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '4px 8px',
                          border: '1.5px solid currentColor',
                          textTransform: 'lowercase',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hx-link-underline"
                      style={{
                        fontFamily: mono,
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      LIVE <ExternalLinkIcon />
                    </a>
                  )}
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hx-link-underline"
                      style={{
                        fontFamily: mono,
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <GithubIcon /> SOURCE
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="education"
        className="hx-section"
        style={{
          padding: '96px 0',
          borderBottom: '3px solid var(--hx-fg)',
        }}
      >
        <div className="hx-container" style={{ maxWidth: maxW, margin: '0 auto', padding: '0 32px' }}>
          {sectionHeader('05', 'CREDS', 'education and certifications.')}

          <div
            className="hx-edu-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0',
              border: '3px solid var(--hx-fg)',
            }}
          >
            <div
              style={{
                padding: '32px 28px',
                borderRight: '2px solid var(--hx-line-strong)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid var(--hx-fg)',
                  paddingBottom: '16px',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    fontFamily: mono,
                    fontSize: '16px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  EDUCATION
                </h3>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '11px',
                    color: 'var(--hx-accent)',
                    fontWeight: 700,
                  }}
                >
                  [{educationArr.length.toString().padStart(2, '0')}]
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {educationArr.map((edu, i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontFamily: mono,
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--hx-accent)',
                        letterSpacing: '0.1em',
                        marginBottom: '6px',
                      }}
                    >
                      {edu.period}
                    </div>
                    <h4
                      style={{
                        fontFamily: mono,
                        fontSize: '18px',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        marginBottom: '4px',
                        color: 'var(--hx-fg)',
                      }}
                    >
                      {edu.degree}
                    </h4>
                    <div
                      style={{
                        fontFamily: mono,
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--hx-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: edu.detail ? '10px' : 0,
                      }}
                    >
                      {edu.school}
                    </div>
                    {edu.detail && (
                      <p
                        style={{
                          fontFamily: mono,
                          fontSize: '13px',
                          lineHeight: 1.6,
                          color: 'var(--hx-fg)',
                          textTransform: 'lowercase',
                        }}
                      >
                        {edu.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '32px 28px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid var(--hx-fg)',
                  paddingBottom: '16px',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    fontFamily: mono,
                    fontSize: '16px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  CERTIFICATIONS
                </h3>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: '11px',
                    color: 'var(--hx-accent)',
                    fontWeight: 700,
                  }}
                >
                  [{certsArr.length.toString().padStart(2, '0')}]
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {certsArr.map((cert, i) => {
                  const inner = (
                    <>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontFamily: mono,
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--hx-fg)',
                            marginBottom: '4px',
                          }}
                        >
                          {cert.name}
                        </div>
                        <div
                          style={{
                            fontFamily: mono,
                            fontSize: '11px',
                            color: 'var(--hx-muted)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {cert.issuer} · {cert.year}
                        </div>
                      </div>
                      {cert.url && <ExternalLinkIcon />}
                    </>
                  );
                  const sharedStyle: React.CSSProperties = {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 0',
                    borderBottom: i < certsArr.length - 1 ? '1px solid var(--hx-line-strong)' : 'none',
                  };
                  return cert.url ? (
                    <a
                      key={i}
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={sharedStyle}
                      className="hx-link-underline"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={i} style={sharedStyle}>
                      {inner}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="hx-section"
        style={{
          padding: '96px 0',
          borderBottom: '3px solid var(--hx-fg)',
          position: 'relative',
        }}
      >
        <div className="hx-container" style={{ maxWidth: maxW, margin: '0 auto', padding: '0 32px' }}>
          {sectionHeader('06', 'CONTACT', 'have something to build? say hi.')}

          <div
            className="hx-contact-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '5fr 7fr',
              gap: '0',
              border: '3px solid var(--hx-fg)',
            }}
          >
            <div
              style={{
                padding: '40px 32px',
                borderRight: '2px solid var(--hx-line-strong)',
                background: 'var(--hx-inv-bg)',
                color: 'var(--hx-inv-fg)',
                position: 'relative',
              }}
            >
              <p
                style={{
                  fontFamily: mono,
                  fontSize: '18px',
                  lineHeight: 1.55,
                  marginBottom: '32px',
                  textTransform: 'lowercase',
                }}
              >
                always interested in ambitious teams, weird side projects, and rare conversations.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      opacity: 0.6,
                      marginBottom: '6px',
                    }}
                  >
                    [EMAIL]
                  </div>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hx-link-underline"
                    style={{
                      fontFamily: mono,
                      fontSize: '15px',
                      fontWeight: 600,
                      wordBreak: 'break-all',
                    }}
                  >
                    {contactEmail}
                  </a>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      opacity: 0.6,
                      marginBottom: '6px',
                    }}
                  >
                    [PHONE]
                  </div>
                  <a
                    href={`tel:${contactPhone}`}
                    className="hx-link-underline"
                    style={{
                      fontFamily: mono,
                      fontSize: '15px',
                      fontWeight: 600,
                    }}
                  >
                    {contactPhone}
                  </a>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      opacity: 0.6,
                      marginBottom: '6px',
                    }}
                  >
                    [LOCATION]
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: '15px',
                      fontWeight: 600,
                      textTransform: 'lowercase',
                    }}
                  >
                    {contactLocation}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '40px',
                  paddingTop: '24px',
                  borderTop: '2px solid currentColor',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="GitHub"
                    className="hx-social"
                    style={{
                      width: '44px',
                      height: '44px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid currentColor',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <GithubIcon />
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="LinkedIn"
                    className="hx-social"
                    style={{
                      width: '44px',
                      height: '44px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid currentColor',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <LinkedinIcon />
                  </a>
                )}
                {twitterUrl && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Twitter"
                    className="hx-social"
                    style={{
                      width: '44px',
                      height: '44px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid currentColor',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <TwitterIcon />
                  </a>
                )}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              style={{
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                background: 'var(--hx-bg)',
              }}
            >
              <div>
                <label
                  htmlFor="hx-name"
                  style={{
                    display: 'block',
                    fontFamily: mono,
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--hx-muted)',
                    marginBottom: '8px',
                  }}
                >
                  [01] NAME
                </label>
                <input
                  id="hx-name"
                  type="text"
                  required
                  placeholder="your name"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'transparent',
                    border: '2px solid var(--hx-fg)',
                    fontFamily: mono,
                    fontSize: '14px',
                    color: 'var(--hx-fg)',
                    transition: 'all 0.15s ease',
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="hx-email"
                  style={{
                    display: 'block',
                    fontFamily: mono,
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--hx-muted)',
                    marginBottom: '8px',
                  }}
                >
                  [02] EMAIL
                </label>
                <input
                  id="hx-email"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'transparent',
                    border: '2px solid var(--hx-fg)',
                    fontFamily: mono,
                    fontSize: '14px',
                    color: 'var(--hx-fg)',
                    transition: 'all 0.15s ease',
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="hx-msg"
                  style={{
                    display: 'block',
                    fontFamily: mono,
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--hx-muted)',
                    marginBottom: '8px',
                  }}
                >
                  [03] MESSAGE
                </label>
                <textarea
                  id="hx-msg"
                  required
                  rows={5}
                  placeholder="what are you building?"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'transparent',
                    border: '2px solid var(--hx-fg)',
                    fontFamily: mono,
                    fontSize: '14px',
                    color: 'var(--hx-fg)',
                    resize: 'vertical',
                    minHeight: '120px',
                    transition: 'all 0.15s ease',
                  }}
                />
              </div>
              <button
                type="submit"
                className="hx-btn-primary"
                style={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 28px',
                  background: 'var(--hx-accent)',
                  color: '#0a0a0a',
                  fontFamily: mono,
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: '3px solid var(--hx-fg)',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
              >
                TRANSMIT <ArrowRightIcon />
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer
        style={{
          padding: '40px 0 32px',
          background: 'var(--hx-bg)',
        }}
      >
        <div className="hx-container" style={{ maxWidth: maxW, margin: '0 auto', padding: '0 32px' }}>
          <div
            className="hx-footer-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '32px',
              alignItems: 'center',
              paddingBottom: '24px',
              borderBottom: '2px solid var(--hx-line-strong)',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: '11px',
                color: 'var(--hx-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              [ © {new Date().getFullYear()} / @{username || 'user'} ]
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GitHub"
                  className="hx-social"
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--hx-fg)',
                    color: 'var(--hx-fg)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <GithubIcon />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn"
                  className="hx-social"
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--hx-fg)',
                    color: 'var(--hx-fg)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <LinkedinIcon />
                </a>
              )}
              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Twitter"
                  className="hx-social"
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--hx-fg)',
                    color: 'var(--hx-fg)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <TwitterIcon />
                </a>
              )}
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: '11px',
                color: 'var(--hx-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textAlign: 'right',
              }}
            >
              [ HELIX / TEMPLATE ]
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              fontFamily: mono,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--hx-fg)',
            }}
          >
            <div>
              {hideBranding ? (
                <>{name}</>
              ) : (
                <>
                  {name} <span style={{ color: 'var(--hx-muted)' }}>· built with</span>{' '}
                  <span style={{ color: 'var(--hx-accent)' }}>FolioForge</span>
                </>
              )}
            </div>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hx-link-underline"
              style={{ textTransform: 'uppercase' }}
            >
              [BACK TO TOP ↑]
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
