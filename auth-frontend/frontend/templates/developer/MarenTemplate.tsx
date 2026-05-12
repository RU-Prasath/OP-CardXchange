'use client';

import { useState } from 'react';

interface Props {
  content: Record<string, string>;
  username: string;
}

function pl(val: string | undefined): string[] {
  if (!val) return [];
  return val.split(',').map((s) => s.trim()).filter(Boolean);
}

function lines(val: string | undefined): string[] {
  if (!val) return [];
  return val.split('\n').map((s) => s.trim()).filter(Boolean);
}

// SVG Icons
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const SunIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const PROJECT_VISUALS = [
  `linear-gradient(135deg, var(--accent-soft) 0%, transparent 60%), repeating-linear-gradient(135deg, var(--line) 0 1px, transparent 1px 16px), var(--bg-elev)`,
  `radial-gradient(circle at 30% 30%, var(--accent-soft), transparent 50%), var(--bg-elev)`,
  `conic-gradient(from 180deg at 50% 50%, var(--accent-soft), transparent, var(--accent-soft)), repeating-linear-gradient(0deg, var(--line) 0 1px, transparent 1px 24px), var(--bg-elev)`,
  `linear-gradient(45deg, var(--accent-soft) 0%, transparent 50%), repeating-linear-gradient(45deg, var(--line) 0 1px, transparent 1px 10px), var(--bg-elev)`,
];

export default function MarenTemplate({ content, username }: Props) {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAllExp, setShowAllExp] = useState(false);
  const [showAllProj, setShowAllProj] = useState(false);
  const EXP_LIMIT = 3;
  const PROJ_LIMIT = 4;
  const c = content;

  // Content-driven dark mode defaults (user-editable)
  const bg = c.colorBg || 'oklch(0.16 0.008 260)';
  const bgElev = c.colorBgElev || 'oklch(0.2 0.01 260)';
  const bgCard = c.colorBgCard || 'oklch(0.22 0.012 260)';
  const fg = c.colorFg || 'oklch(0.96 0.004 90)';
  const fgMuted = c.colorFgMuted || 'oklch(0.7 0.01 260)';
  const fgFaint = c.colorFgFaint || 'oklch(0.52 0.012 260)';
  const line = c.colorLine || 'oklch(0.28 0.012 260)';
  const lineStrong = c.colorLineStrong || 'oklch(0.36 0.014 260)';
  const accent = c.colorAccent || 'oklch(0.78 0.18 145)';
  const accentSoft = c.colorAccentSoft || 'oklch(0.28 0.06 145)';
  const accentFg = c.colorAccentFg || 'oklch(0.92 0.14 145)';

  const darkVars = `
    --bg: ${bg};
    --bg-elev: ${bgElev};
    --bg-card: ${bgCard};
    --fg: ${fg};
    --fg-muted: ${fgMuted};
    --fg-faint: ${fgFaint};
    --line: ${line};
    --line-strong: ${lineStrong};
    --shadow-md: 0 4px 24px oklch(0 0 0 / 0.4);
    --shadow-lg: 0 8px 40px oklch(0 0 0 / 0.5);
  `;
  const lightVars = `
    --bg: oklch(0.98 0.002 90);
    --bg-elev: oklch(0.94 0.004 90);
    --bg-card: oklch(0.97 0.002 90);
    --fg: oklch(0.15 0.008 260);
    --fg-muted: oklch(0.4 0.01 260);
    --fg-faint: oklch(0.6 0.012 260);
    --line: oklch(0.88 0.006 260);
    --line-strong: oklch(0.78 0.01 260);
    --shadow-md: 0 4px 24px oklch(0 0 0 / 0.08);
    --shadow-lg: 0 8px 40px oklch(0 0 0 / 0.12);
  `;

  const cssVars = `
    .maren-template {
      ${dark ? darkVars : lightVars}
      --accent: ${accent};
      --accent-soft: ${accentSoft};
      --accent-fg: ${accentFg};
      font-family: 'Geist', 'Inter', ui-sans-serif, system-ui, sans-serif;
      background: var(--bg);
      color: var(--fg);
    }
    .maren-template * { box-sizing: border-box; margin: 0; padding: 0; }
    .maren-template a { color: inherit; }

    @keyframes maren-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes maren-spin {
      to { transform: rotate(360deg); }
    }
    .maren-pulse { animation: maren-pulse 2s ease infinite; }

    .maren-template .reveal {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .maren-template .reveal.in {
      opacity: 1;
      transform: none;
    }

    @media (max-width: 768px) {
      .maren-desktop-nav { display: none !important; }
      .maren-mobile-toggle { display: flex !important; }
      .maren-about-grid { grid-template-columns: 1fr !important; }
      .maren-skills-grid { grid-template-columns: 1fr 1fr !important; }
      .maren-exp-item { grid-template-columns: 1fr !important; gap: 16px !important; }
      .maren-exp-bullets { grid-template-columns: 1fr !important; }
      .maren-projects-grid { grid-template-columns: 1fr !important; }
      .maren-contact-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
      .maren-contact-wrap { padding: 28px 20px !important; }
      .maren-hero-stats { grid-template-columns: repeat(2,1fr) !important; }
      .maren-section-subtitle { display: none !important; }
      .maren-project-tag { white-space: normal !important; word-break: break-word !important; }
      .maren-contact-value { font-size: 13px !important; word-break: break-all !important; white-space: normal !important; overflow: visible !important; text-overflow: clip !important; }
      .maren-edu-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
    }
    @media (max-width: 480px) {
      .maren-skills-grid { grid-template-columns: 1fr !important; }
      .maren-contact-wrap { padding: 24px 16px !important; border-radius: 16px !important; }
    }
  `;

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navLinks = [
    { num: '01', href: '#about', label: 'About' },
    { num: '02', href: '#skills', label: 'Skills' },
    { num: '03', href: '#experience', label: 'Experience' },
    { num: '04', href: '#projects', label: 'Work' },
    { num: '05', href: '#education', label: 'Education' },
    { num: '06', href: '#contact', label: 'Contact' },
  ];

  const name = c.name || 'Your Name';
  const initial = name.charAt(0).toUpperCase();

  // Skills
  // Skills — read from JSON first, fall back to old fields
  function parseJ<T>(key: string, fallback: T[]): T[] {
    if (!c[key]) return fallback;
    try { return JSON.parse(c[key]); } catch { return fallback; }
  }
  const skillsJsonArr = parseJ<{ category: string; items: string }>('skillsJson', []);
  const skillCategories = skillsJsonArr.length > 0
    ? skillsJsonArr.map(s => ({ title: s.category, items: pl(s.items) }))
    : [
        { title: 'Languages',       items: pl(c.skillLang) },
        { title: 'Frameworks & UI', items: pl(c.skillFramework) },
        { title: 'Backend & Data',  items: pl(c.skillBackend) },
        { title: 'Tooling',         items: pl(c.skillTooling) },
        { title: 'Platform & Ops',  items: pl(c.skillPlatform) },
        { title: 'Craft',           items: pl(c.skillCraft) },
      ].filter(s => s.items.length > 0);

  // Experience — read from JSON first, fall back to old fields
  const expJsonArr = parseJ<{ period: string; nowLabel: string; duration: string; role: string; company: string; summary: string; bullets: string; stack: string; isCurrent: boolean }>('expJson', []);
  const experiences = expJsonArr.length > 0
    ? expJsonArr.map(e => ({
        period: e.period, nowLabel: e.nowLabel, durationLabel: e.duration,
        role: e.role, company: e.company, summary: e.summary,
        bullets: lines(e.bullets), stack: pl(e.stack),
        isCurrent: !!e.isCurrent,
      }))
    : [
        {
          period: c.exp1Period, nowLabel: c.exp1Now, durationLabel: c.exp1Duration,
          role: c.exp1Role, company: c.exp1Company, summary: c.exp1Summary,
          bullets: lines(c.exp1Bullets), stack: pl(c.exp1Stack),
          isCurrent: !!c.exp1Now,
        },
        {
          period: c.exp2Period, nowLabel: c.exp2Now, durationLabel: c.exp2Duration,
          role: c.exp2Role, company: c.exp2Company, summary: c.exp2Summary,
          bullets: lines(c.exp2Bullets), stack: pl(c.exp2Stack),
          isCurrent: false,
        },
      ].filter((e) => e.role || e.company);

  // Projects — read from JSON first, fall back to old fields
  const projJsonArr = parseJ<{ title: string; tag: string; desc: string; stack: string; liveUrl: string; githubUrl: string }>('projJson', []);
  const projects = projJsonArr.length > 0
    ? projJsonArr.map((p, i) => ({
        title: p.title, tag: p.tag, desc: p.desc,
        stack: pl(p.stack), liveUrl: p.liveUrl, githubUrl: p.githubUrl,
        visual: PROJECT_VISUALS[i % PROJECT_VISUALS.length],
      })).filter(p => p.title)
    : [1, 2, 3, 4].map((i) => ({
        title: c[`proj${i}Title`],
        tag: c[`proj${i}Tag`],
        desc: c[`proj${i}Desc`],
        stack: pl(c[`proj${i}Stack`]),
        liveUrl: c[`proj${i}LiveUrl`],
        githubUrl: c[`proj${i}GithubUrl`],
        visual: PROJECT_VISUALS[(i - 1) % PROJECT_VISUALS.length],
      })).filter((p) => p.title);

  // Education & Certifications
  const educationArr = parseJ<{ school: string; degree: string; period: string; detail: string }>('educationJson', []);
  const certsArr = parseJ<{ name: string; issuer: string; year: string; url: string }>('certsJson', []);

  const monoFont = "'Geist Mono', ui-monospace, monospace";

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  };

  const sectionNumStyle: React.CSSProperties = {
    fontFamily: monoFont,
    fontSize: '12px',
    color: 'var(--fg-faint)',
    whiteSpace: 'nowrap',
  };

  const dividerStyle: React.CSSProperties = {
    flex: 1,
    height: '1px',
    background: 'var(--line)',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 'clamp(28px, 4vw, 44px)',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    marginBottom: '64px',
  };

  const pillStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid var(--line)',
    fontFamily: monoFont,
    fontSize: '12px',
    color: 'var(--fg-muted)',
    background: 'var(--bg-elev)',
    cursor: 'default',
  };

  return (
    <div
      className="maren-template"
      data-theme={dark ? 'dark' : 'light'}
      style={{ minHeight: '100vh' }}
    >
      <style suppressHydrationWarning>{cssVars}</style>

      {/* Nav */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          background: 'color-mix(in oklch, var(--bg) 85%, transparent)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0 32px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'var(--fg)',
                color: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontWeight: 500, fontSize: '14px', lineHeight: 1.2, color: 'var(--fg)' }}>
                {name}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span
                  className="maren-pulse"
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '11px', fontFamily: monoFont, color: 'var(--fg-faint)' }}>
                  {c.availability || 'available for work'}
                </span>
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="maren-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--fg-muted)',
                  textDecoration: 'none',
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--fg)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-elev)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--fg-muted)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '11px', fontFamily: monoFont, color: 'var(--fg-faint)' }}>
                  {link.num}
                </span>
                {link.label}
              </a>
            ))}

            {/* Theme toggle */}
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                background: 'var(--bg-elev)',
                color: 'var(--fg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginLeft: '8px',
                flexShrink: 0,
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-strong)';
                (e.currentTarget as HTMLElement).style.color = 'var(--fg)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)';
                (e.currentTarget as HTMLElement).style.color = 'var(--fg-muted)';
              }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            <a
              href="#contact"
              onClick={(e) => scrollTo(e, '#contact')}
              style={{
                marginLeft: '8px',
                padding: '7px 16px',
                borderRadius: '8px',
                background: 'var(--fg)',
                color: 'var(--bg)',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              Get in touch
            </a>
          </div>

          {/* Mobile controls */}
          <div className="maren-mobile-toggle" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setDark(!dark)}
              style={{
                width: '34px', height: '34px', borderRadius: '8px',
                border: '1px solid var(--line)', background: 'var(--bg-elev)',
                color: 'var(--fg-muted)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
              }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: '34px', height: '34px', borderRadius: '8px',
                border: '1px solid var(--line)', background: 'var(--bg-elev)',
                color: 'var(--fg-muted)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
              }}
            >
              {menuOpen ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              position: 'absolute', top: '64px', left: 0, right: 0,
              background: 'var(--bg-card)', borderBottom: '1px solid var(--line)',
              padding: '16px 32px 24px', display: 'flex', flexDirection: 'column', gap: '4px',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                style={{
                  display: 'flex', alignItems: 'baseline', gap: '8px',
                  padding: '10px 12px', borderRadius: '8px',
                  fontSize: '15px', fontWeight: 500, color: 'var(--fg-muted)', textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: '11px', fontFamily: monoFont, color: 'var(--fg-faint)' }}>
                  {link.num}
                </span>
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, '#contact')}
              style={{
                marginTop: '8px', padding: '10px 16px', borderRadius: '8px',
                background: 'var(--fg)', color: 'var(--bg)',
                fontSize: '14px', fontWeight: 500, textDecoration: 'none', textAlign: 'center',
              }}
            >
              Get in touch
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section
        id="hero"
        style={{ padding: '144px 0 96px', position: 'relative', overflow: 'hidden' }}
      >
        {/* Grid bg */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 20%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 20%, black 30%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <h1
            style={{
              fontSize: 'clamp(48px, 8vw, 104px)',
              fontWeight: 500,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              marginBottom: '32px',
            }}
          >
            <span style={{ display: 'block' }}>{name}</span>
            <span style={{ display: 'block', fontStyle: 'italic', color: 'var(--fg-muted)' }}>
              <span style={{ color: 'var(--accent)' }}>— </span>
              {c.title || 'Software Engineer'}
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(17px, 1.6vw, 20px)',
              color: 'var(--fg-muted)',
              maxWidth: '600px',
              lineHeight: 1.6,
              marginBottom: '40px',
            }}
          >
            {c.subtitle || 'I build thoughtful interfaces for products people return to.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '64px' }}>
            <a
              href="#projects"
              onClick={(e) => scrollTo(e, '#projects')}
              style={{
                padding: '12px 28px', borderRadius: '10px', background: 'var(--fg)',
                color: 'var(--bg)', fontWeight: 500, fontSize: '15px', textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              View Work
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, '#contact')}
              style={{
                padding: '12px 28px', borderRadius: '10px', background: 'var(--bg-elev)',
                color: 'var(--fg)', fontWeight: 500, fontSize: '15px', border: '1px solid var(--line)',
                textDecoration: 'none', transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-strong)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}
            >
              Get in touch
            </a>
            {c.resumeUrl && (
              <a
                href={c.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px 28px', borderRadius: '10px', background: 'var(--bg-elev)',
                  color: 'var(--fg)', fontWeight: 500, fontSize: '15px',
                  border: '1px solid var(--line)', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}
              >
                📄 Resume (PDF)
              </a>
            )}
          </div>

          {/* Stats */}
          <div
            className="maren-hero-stats"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              borderTop: '1px solid var(--line)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            {[1, 2, 3, 4].map((i) => {
              const num = c[`stat${i}Num`];
              const unit = c[`stat${i}Unit`];
              const label = c[`stat${i}Label`];
              if (!num && !label) return null;
              return (
                <div
                  key={i}
                  style={{
                    padding: '24px 0',
                    borderRight: i < 4 ? '1px solid var(--line)' : 'none',
                    paddingLeft: i === 1 ? 0 : '24px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '4px' }}>
                    <span style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 600, lineHeight: 1 }}>
                      {num || '—'}
                    </span>
                    {unit && (
                      <span style={{ fontSize: '18px', fontWeight: 500, color: 'var(--accent)', fontFamily: monoFont }}>
                        {unit}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', fontFamily: monoFont, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: '120px 0' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 32px' }}>
          <div style={sectionHeaderStyle}>
            <span style={sectionNumStyle}>{c.aboutSectionLabel || '01 / About'}</span>
            <div style={dividerStyle} />
          </div>
          <h2 style={sectionTitleStyle}>{c.aboutHeading || 'A short version of a longer story.'}</h2>

          <div
            className="maren-about-grid"
            style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '64px', alignItems: 'start' }}
          >
            {/* Bio */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[c.aboutPara1, c.aboutPara2, c.aboutPara3].filter(Boolean).map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: i === 0 ? '22px' : '19px',
                    lineHeight: 1.65,
                    color: i === 0 ? 'var(--fg)' : 'var(--fg-muted)',
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Card */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '8px',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  aspectRatio: '1 / 1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, var(--accent-soft) 0%, transparent 60%), repeating-linear-gradient(45deg, var(--line) 0 1px, transparent 1px 12px), var(--bg-elev)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {c.photoUrl ? (
                  <img
                    src={c.photoUrl}
                    alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: '96px',
                      fontWeight: 300,
                      color: 'var(--fg-faint)',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >
                    {name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Meta grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1px',
                  background: 'var(--line)',
                  marginTop: '8px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                {[
                  { label: 'Based in', value: c.location || 'Your City' },
                  { label: 'Timezone', value: c.timezone || 'UTC' },
                  { label: 'Education', value: c.education || c.pronouns || '' },
                  { label: 'Languages', value: c.languages || 'English' },
                ].filter(item => item.value).map((item, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-card)' }}>
                    <div
                      style={{
                        fontFamily: monoFont,
                        fontSize: '10px',
                        color: 'var(--fg-faint)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: '4px',
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--fg-muted)', fontWeight: 500 }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" style={{ padding: '120px 0', background: 'var(--bg-elev)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 32px' }}>
          <div style={sectionHeaderStyle}>
            <span style={sectionNumStyle}>{c.skillsSectionLabel || '02 / Skills'}</span>
            <div style={dividerStyle} />
            <span className="maren-section-subtitle" style={sectionNumStyle}>Calibrated by what I&apos;ve shipped</span>
          </div>
          <h2 style={sectionTitleStyle}>{c.skillsHeading || 'The toolkit I reach for first.'}</h2>

          <div
            className="maren-skills-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
          >
            {skillCategories.map((cat, i) => {
              const skills = cat.items;
              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--line)',
                    borderRadius: '16px',
                    padding: '24px',
                    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-2px)';
                    el.style.boxShadow = 'var(--shadow-md)';
                    el.style.borderColor = 'var(--line-strong)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                    el.style.borderColor = 'var(--line)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontWeight: 500, fontSize: '15px' }}>{cat.title}</span>
                    <span style={{ fontFamily: monoFont, fontSize: '11px', color: 'var(--fg-faint)' }}>
                      /{String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {skills.length > 0 ? skills.map((skill, j) => (
                      <span
                        key={j}
                        style={pillStyle}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = 'var(--accent)';
                          el.style.background = 'var(--accent-soft)';
                          el.style.color = 'var(--accent-fg)';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = 'var(--line)';
                          el.style.background = 'var(--bg-elev)';
                          el.style.color = 'var(--fg-muted)';
                        }}
                      >
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                        {skill}
                      </span>
                    )) : (
                      <span style={{ fontSize: '13px', color: 'var(--fg-faint)' }}>Add skills</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" style={{ padding: '120px 0' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 32px' }}>
          <div style={sectionHeaderStyle}>
            <span style={sectionNumStyle}>{c.expSectionLabel || '03 / Experience'}</span>
            <div style={dividerStyle} />
          </div>
          <h2 style={sectionTitleStyle}>{c.expHeading || "Where I've done the work."}</h2>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {experiences.length > 0 ? (showAllExp ? experiences : experiences.slice(0, EXP_LIMIT)).map((job, i) => (
              <div
                key={i}
                className="maren-exp-item"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr',
                  gap: '48px',
                  borderTop: '1px solid var(--line)',
                  padding: '32px 0',
                  borderRadius: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'color-mix(in oklch, var(--bg-elev) 60%, transparent)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {/* Left */}
                <div style={{ paddingTop: '4px' }}>
                  {job.isCurrent && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span
                        className="maren-pulse"
                        style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }}
                      />
                      <span style={{ fontFamily: monoFont, fontSize: '12px', color: 'var(--accent)' }}>
                        {job.nowLabel || 'Present'}
                      </span>
                    </div>
                  )}
                  <div style={{ fontFamily: monoFont, fontSize: '12px', color: 'var(--fg-faint)', lineHeight: 1.5 }}>
                    {job.period}
                  </div>
                  {job.durationLabel && (
                    <div style={{ fontFamily: monoFont, fontSize: '11px', color: 'var(--fg-faint)', marginTop: '4px' }}>
                      {job.durationLabel}
                    </div>
                  )}
                </div>

                {/* Right */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.01em' }}>
                      {job.role}
                    </span>
                    <span style={{ fontFamily: monoFont, fontSize: '13px', color: 'var(--fg-faint)' }}>
                      {job.company} · {(job as any).employmentType || 'Full-time'}
                    </span>
                  </div>

                  {job.summary && (
                    <p style={{ fontSize: '15px', color: 'var(--fg-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
                      {job.summary}
                    </p>
                  )}

                  {job.bullets.length > 0 && (
                    <div
                      className="maren-exp-bullets"
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: '20px' }}
                    >
                      {job.bullets.map((bullet, j) => {
                        const metricMatch = bullet.match(/(~?\d+%?)/);
                        return (
                          <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }}>—</span>
                            <span style={{ fontSize: '14px', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
                              {metricMatch ? (
                                <>
                                  {bullet.replace(metricMatch[0], '').trim()}{' '}
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      padding: '1px 6px',
                                      borderRadius: '4px',
                                      background: 'var(--accent-soft)',
                                      color: 'var(--accent-fg)',
                                      fontFamily: monoFont,
                                      fontSize: '11px',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {metricMatch[0]}
                                  </span>
                                </>
                              ) : bullet}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {job.stack.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {job.stack.map((tech, j) => (
                        <span
                          key={j}
                          style={{
                            padding: '3px 10px',
                            border: '1px solid var(--line)',
                            borderRadius: '6px',
                            fontFamily: monoFont,
                            fontSize: '11px',
                            color: 'var(--fg-faint)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div style={{ padding: '32px 0', borderTop: '1px solid var(--line)', color: 'var(--fg-faint)', fontFamily: monoFont, fontSize: '13px' }}>
                Add your experience entries
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--line)' }} />
            {experiences.length > EXP_LIMIT && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                <button
                  onClick={() => setShowAllExp(s => !s)}
                  style={{
                    padding: '10px 22px', borderRadius: '10px',
                    background: 'var(--bg-elev)', color: 'var(--fg)',
                    border: '1px solid var(--line)', fontSize: '14px', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}
                >
                  {showAllExp ? 'Show less ↑' : `Show ${experiences.length - EXP_LIMIT} more ↓`}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" style={{ padding: '120px 0', background: 'var(--bg-elev)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 32px' }}>
          <div style={sectionHeaderStyle}>
            <span style={sectionNumStyle}>{c.projSectionLabel || '04 / Selected Work'}</span>
            <div style={dividerStyle} />
            <span className="maren-section-subtitle" style={sectionNumStyle}>Personal + professional</span>
          </div>
          <h2 style={sectionTitleStyle}>{c.projHeading || "Selected work I'm proud of."}</h2>

          <div
            className="maren-projects-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}
          >
            {projects.length > 0 ? (() => {
              const reversed = [...projects].reverse();
              const visible = showAllProj ? reversed : reversed.slice(0, PROJ_LIMIT);
              return visible;
            })().map((project, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = 'var(--shadow-lg)';
                  el.style.borderColor = 'var(--line-strong)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                  el.style.borderColor = 'var(--line)';
                }}
              >
                {/* Visual */}
                <div
                  style={{
                    aspectRatio: '16 / 10',
                    position: 'relative',
                    background: project.visual,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontFamily: monoFont, fontSize: '14px', color: 'var(--fg-faint)', letterSpacing: '0.04em' }}>
                    ◇ {project.title}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.01em' }}>
                      {project.title}
                    </h3>
                    {project.tag && (
                      <span
                        className="maren-project-tag"
                        style={{
                          fontFamily: monoFont,
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          border: '1px solid var(--line)',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          color: 'var(--fg-faint)',
                          marginTop: '4px',
                          maxWidth: '100%',
                        }}
                      >
                        {project.tag}
                      </span>
                    )}
                  </div>

                  {project.desc && (
                    <p style={{ fontSize: '14.5px', color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: '16px', flex: 1 }}>
                      {project.desc}
                    </p>
                  )}

                  {project.stack.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      {project.stack.map((tech, j) => (
                        <span
                          key={j}
                          style={{
                            fontFamily: monoFont, fontSize: '11px', padding: '3px 8px',
                            borderRadius: '5px', background: 'var(--bg-elev)',
                            color: 'var(--fg-faint)', border: '1px solid var(--line)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', borderTop: '1px dashed var(--line)', paddingTop: '20px' }}>
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1, textAlign: 'center', padding: '8px 14px',
                          borderRadius: '8px', background: 'var(--fg)', color: 'var(--bg)',
                          fontSize: '13px', fontWeight: 500, textDecoration: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                      >
                        Live demo <ExternalLinkIcon />
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1, textAlign: 'center', padding: '8px 14px',
                          borderRadius: '8px', background: 'var(--bg-elev)', color: 'var(--fg-muted)',
                          border: '1px solid var(--line)', fontSize: '13px', fontWeight: 500,
                          textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          transition: 'border-color 0.2s, color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = 'var(--line-strong)';
                          el.style.color = 'var(--fg)';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = 'var(--line)';
                          el.style.color = 'var(--fg-muted)';
                        }}
                      >
                        <GithubIcon /> Source
                      </a>
                    )}
                    {(!project.liveUrl || project.liveUrl === '#') && (!project.githubUrl || project.githubUrl === '#') && (
                      <span style={{ fontSize: '12px', fontFamily: monoFont, color: 'var(--fg-faint)' }}>
                        Links coming soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '48px',
                  borderRadius: '16px',
                  border: '1px dashed var(--line)',
                  textAlign: 'center',
                  color: 'var(--fg-faint)',
                  fontFamily: monoFont,
                  fontSize: '14px',
                }}
              >
                Add your projects above to display them here
              </div>
            )}
          </div>
          {projects.length > PROJ_LIMIT && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <button
                onClick={() => setShowAllProj(s => !s)}
                style={{
                  padding: '10px 22px', borderRadius: '10px',
                  background: 'var(--bg-card)', color: 'var(--fg)',
                  border: '1px solid var(--line)', fontSize: '14px', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}
              >
                {showAllProj ? 'Show less ↑' : `Show ${projects.length - PROJ_LIMIT} more ↓`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Education & Certifications */}
      <section id="education" style={{ padding: '120px 0' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 32px' }}>
          <div style={sectionHeaderStyle}>
            <span style={sectionNumStyle}>{c.eduSectionLabel || '05 / Education'}</span>
            <div style={dividerStyle} />
          </div>
          <h2 style={sectionTitleStyle}>{c.eduHeading || 'Where I learned to build.'}</h2>

          <div
            className="maren-edu-grid"
            style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '64px', alignItems: 'start' }}
          >
            {/* Education entries */}
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '11px', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '24px' }}>
                Degrees &amp; Study
              </div>
              {educationArr.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {educationArr.map((edu, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '24px',
                        borderRadius: '14px',
                        border: '1px solid var(--line)',
                        background: 'var(--bg-card)',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        marginBottom: i < educationArr.length - 1 ? '12px' : 0,
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = 'var(--accent)';
                        el.style.boxShadow = 'var(--shadow-md)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = 'var(--line)';
                        el.style.boxShadow = 'none';
                      }}
                    >
                      {/* Accent left bar */}
                      <div style={{ position: 'absolute', left: 0, top: '16px', bottom: '16px', width: '3px', borderRadius: '0 2px 2px 0', background: 'var(--accent)', opacity: 0.7 }} />
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '2px' }}>
                            {edu.degree}
                          </div>
                          <div style={{ fontFamily: monoFont, fontSize: '12px', color: 'var(--fg-muted)' }}>
                            {edu.school}
                          </div>
                        </div>
                        {edu.period && (
                          <span style={{
                            fontFamily: monoFont, fontSize: '11px', color: 'var(--accent-fg)',
                            background: 'var(--accent-soft)', border: '1px solid color-mix(in oklch, var(--accent) 30%, transparent)',
                            padding: '3px 10px', borderRadius: '6px', whiteSpace: 'nowrap', flexShrink: 0,
                          }}>
                            {edu.period}
                          </span>
                        )}
                      </div>
                      {edu.detail && (
                        <p style={{ fontSize: '13.5px', color: 'var(--fg-faint)', lineHeight: 1.6, marginTop: '10px' }}>
                          {edu.detail}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '32px', borderRadius: '14px', border: '1px dashed var(--line)', color: 'var(--fg-faint)', fontFamily: monoFont, fontSize: '13px', textAlign: 'center' }}>
                  Add education entries in the admin panel
                </div>
              )}
            </div>

            {/* Certifications */}
            <div>
              <div style={{ fontFamily: monoFont, fontSize: '11px', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '24px' }}>
                Certifications
              </div>
              {certsArr.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {certsArr.map((cert, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        border: '1px solid var(--line)',
                        background: 'var(--bg-card)',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = 'var(--line-strong)';
                        el.style.background = 'var(--bg-elev)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = 'var(--line)';
                        el.style.background = 'var(--bg-card)';
                      }}
                    >
                      {/* Badge icon */}
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                        background: 'var(--accent-soft)', border: '1px solid color-mix(in oklch, var(--accent) 25%, transparent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                          <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--fg)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {cert.name}
                        </div>
                        <div style={{ fontFamily: monoFont, fontSize: '11px', color: 'var(--fg-faint)' }}>
                          {cert.issuer}{cert.year ? ` · ${cert.year}` : ''}
                        </div>
                      </div>
                      {cert.url ? (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer"
                          style={{
                            flexShrink: 0, padding: '5px 12px', borderRadius: '7px',
                            border: '1px solid var(--line)', background: 'var(--bg-elev)',
                            fontFamily: monoFont, fontSize: '11px', color: 'var(--fg-muted)',
                            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px',
                            transition: 'border-color 0.15s, color 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = 'var(--accent)';
                            el.style.color = 'var(--accent-fg)';
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = 'var(--line)';
                            el.style.color = 'var(--fg-muted)';
                          }}
                        >
                          View <ExternalLinkIcon />
                        </a>
                      ) : (
                        <span style={{ flexShrink: 0, fontFamily: monoFont, fontSize: '11px', color: 'var(--accent)', padding: '4px 8px', borderRadius: '6px', background: 'var(--accent-soft)' }}>
                          {cert.year}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '32px', borderRadius: '14px', border: '1px dashed var(--line)', color: 'var(--fg-faint)', fontFamily: monoFont, fontSize: '13px', textAlign: 'center' }}>
                  Add certifications in the admin panel
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '120px 0', background: 'var(--bg-elev)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 32px' }}>
          <div
            className="maren-contact-wrap"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--line)',
              borderRadius: '24px',
              padding: '64px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Blob */}
            <div
              style={{
                position: 'absolute', top: '-80px', right: '-80px',
                width: '320px', height: '320px', borderRadius: '50%',
                background: 'radial-gradient(circle, var(--accent-soft), transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div
              className="maren-contact-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', position: 'relative' }}
            >
              {/* Left */}
              <div>
                <div style={{ fontFamily: monoFont, fontSize: '12px', color: 'var(--fg-faint)', marginBottom: '12px' }}>
                  {c.contactSectionLabel || '05 / Contact'}
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(24px, 3.5vw, 40px)',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    marginBottom: '16px',
                  }}
                >
                  {c.contactHeadline || "Got an interesting project? Let's talk."}
                </h2>
                <p style={{ fontSize: '16px', color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: '40px' }}>
                  {c.contactSub || "I'm open to freelance work and full-time opportunities."}
                </p>

                {/* Channels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {[
                    {
                      label: 'Email', value: c.contactEmail, href: `mailto:${c.contactEmail}`,
                      icon: (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                    },
                    {
                      label: 'GitHub', value: c.githubUrl ? c.githubUrl.replace('https://', '') : '', href: c.githubUrl,
                      icon: <GithubIcon />,
                    },
                    {
                      label: 'LinkedIn', value: c.linkedinUrl ? c.linkedinUrl.replace('https://', '') : '', href: c.linkedinUrl,
                      icon: <LinkedinIcon />,
                    },
                    {
                      label: 'Blog', value: c.blogHandle ? `@${c.blogHandle}` : '', href: c.blogHandle ? `https://${c.blogHandle}` : '',
                      icon: (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      ),
                    },
                  ].filter(ch => ch.value).map((ch, i) => (
                    <a
                      key={i}
                      href={ch.href}
                      target={ch.href && ch.href.startsWith('http') ? '_blank' : undefined}
                      rel={ch.href && ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                        borderRadius: '10px', textDecoration: 'none', transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elev)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <span style={{ color: 'var(--fg-faint)', flexShrink: 0 }}>{ch.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: monoFont, fontSize: '10px', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                          {ch.label}
                        </div>
                        <div className="maren-contact-value" style={{ fontSize: '14px', color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ch.value}
                        </div>
                      </div>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--fg-faint)', flexShrink: 0 }}>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Right: form (UI only) */}
              <div>
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Name', type: 'text', placeholder: 'Your name' },
                    { label: 'Email', type: 'email', placeholder: 'your@email.com' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label style={{ display: 'block', fontFamily: monoFont, fontSize: '11px', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        style={{
                          width: '100%', padding: '12px 14px', borderRadius: '10px',
                          border: '1px solid var(--line)', background: 'var(--bg-elev)',
                          color: 'var(--fg)', fontSize: '14px', outline: 'none', fontFamily: 'inherit',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--accent)'; }}
                        onBlur={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--line)'; }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontFamily: monoFont, fontSize: '11px', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Message
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Tell me about your project..."
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '10px',
                        border: '1px solid var(--line)', background: 'var(--bg-elev)',
                        color: 'var(--fg)', fontSize: '14px', outline: 'none', fontFamily: 'inherit',
                        resize: 'none', transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--accent)'; }}
                      onBlur={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--line)'; }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '13px', borderRadius: '10px', background: 'var(--fg)',
                      color: 'var(--bg)', fontSize: '15px', fontWeight: 500,
                      border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  >
                    Send message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '32px 0' }}>
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <span style={{ fontFamily: monoFont, fontSize: '12px', color: 'var(--fg-faint)' }}>
            {name} · Built with FolioForge
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            {c.githubUrl && (
              <a
                href={c.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--fg-faint)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fg)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fg-faint)'; }}
              >
                <GithubIcon />
              </a>
            )}
            {c.linkedinUrl && (
              <a
                href={c.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--fg-faint)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fg)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fg-faint)'; }}
              >
                <LinkedinIcon />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
