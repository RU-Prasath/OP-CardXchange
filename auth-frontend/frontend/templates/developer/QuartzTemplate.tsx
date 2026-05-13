'use client';

import { useState, useEffect, useRef } from 'react';

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
function lines(v?: string): string[] {
  return v ? v.split('\n').map(s => s.trim()).filter(Boolean) : [];
}
function parseStartPeriod(period: string): { month: string; year: string } {
  if (!period) return { month: '', year: '' };
  const m = period.match(/(\w{3,9})\s+(\d{4})/);
  if (m) return { month: m[1].slice(0, 3).toUpperCase(), year: m[2] };
  const yOnly = period.match(/(\d{4})/);
  return { month: '', year: yOnly ? yOnly[1] : period };
}

const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

// ── Icons ──
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const ArrowOutIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M9 7h8v8"/></svg>
);
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
);
const SunIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4L4.2 19.8M19.8 4.2l-1.4 1.4"/></svg>
);
const MoonIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
);
const DotIcon = () => (
  <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="currentColor"/></svg>
);

interface SkillEntry { category: string; items: string; }
interface ExpEntry { period: string; nowLabel?: string; duration?: string; role: string; company: string; employmentType?: string; summary?: string; bullets?: string; stack?: string; isCurrent?: boolean; }
interface ProjEntry { title: string; tag: string; desc: string; stack: string; liveUrl: string; githubUrl: string; }
interface EduEntry { school: string; degree: string; period: string; detail: string; }
interface CertEntry { name: string; issuer: string; year: string; url: string; }

export default function QuartzTemplate({ content }: Props) {
  const c = content;
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Particle background animation ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const setSize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const COUNT = Math.min(70, Math.floor((w * h) / 22000));
    const MAX_DIST = 140;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 1.6,
    }));

    let raf = 0;
    let running = true;

    function tick() {
      if (!ctx || !running) return;
      ctx.clearRect(0, 0, w, h);

      const dotColor = dark ? 'rgba(243, 241, 232, ' : 'rgba(110, 140, 100, ';
      const lineColor = dark ? 'rgba(243, 241, 232, ' : 'rgba(110, 140, 100, ';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor + '0.45)';
        ctx.fill();
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_DIST * MAX_DIST) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / MAX_DIST) * 0.22;
            ctx.strokeStyle = lineColor + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(tick);
    }
    tick();

    const onResize = () => setSize();
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [dark]);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.qz-reveal');
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('qz-in'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const name = c.name || 'Your Name';
  const skills = parseJ<SkillEntry[]>(c.skillsJson, []);
  const exps = parseJ<ExpEntry[]>(c.expJson, []);
  const projects = parseJ<ProjEntry[]>(c.projJson, []);
  const education = parseJ<EduEntry[]>(c.educationJson, []);
  const certs = parseJ<CertEntry[]>(c.certsJson, []);

  // Theme colours
  const lightBg     = c.colorBg          || '#f8f6f0';
  const lightSurf   = c.colorSurface     || '#ffffff';
  const lightSurfA  = c.colorSurfaceAlt  || '#f1eee5';
  const lightInk    = c.colorInk         || '#1a1a17';
  const lightMuted  = c.colorInkMuted    || '#5c5c54';
  const lightFaint  = c.colorInkFaint    || '#a09c8f';
  const lightLine   = c.colorLine        || '#e3dfd2';
  const accent      = c.colorAccent      || '#6e8c64';
  const accentSoft  = c.colorAccentSoft  || '#dfe7d8';

  const bg     = dark ? '#0e0f0d' : lightBg;
  const surf   = dark ? '#1a1c19' : lightSurf;
  const surfA  = dark ? '#23251f' : lightSurfA;
  const ink    = dark ? '#f3f1e8' : lightInk;
  const muted  = dark ? '#aeac9d' : lightMuted;
  const faint  = dark ? '#73716a' : lightFaint;
  const line   = dark ? '#2e3029' : lightLine;
  const accSoft= dark ? '#1f3320' : accentSoft;
  const inverted = dark ? '#f3f1e8' : '#1a1a17';
  const invertedFg = dark ? '#1a1a17' : '#f3f1e8';

  const css = `
    .qz-root {
      --bg: ${bg}; --surf: ${surf}; --surf-a: ${surfA};
      --ink: ${ink}; --muted: ${muted}; --faint: ${faint};
      --line: ${line};
      --accent: ${accent}; --accent-soft: ${accSoft};
      --inv-bg: ${inverted}; --inv-fg: ${invertedFg};
      --f-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;
      --f-body: 'Inter', system-ui, -apple-system, sans-serif;
      --f-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
      background: var(--bg);
      color: var(--ink);
      font-family: var(--f-body);
      min-height: 100vh;
      transition: background 0.3s ease, color 0.3s ease;
    }
    .qz-root *, .qz-root *::before, .qz-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .qz-root :where(a) { color: inherit; text-decoration: none; }
    .qz-bg-particles {
      position: fixed; inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .qz-shell { max-width: 1320px; margin: 0 auto; padding: 0 32px; }

    .qz-mono { font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--faint); }
    .qz-display { font-family: var(--f-display); letter-spacing: -0.02em; }

    .qz-reveal { opacity: 0; transform: translateY(14px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .qz-reveal.qz-in { opacity: 1; transform: none; }

    @keyframes qz-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .qz-pulse { animation: qz-pulse 2.2s ease-in-out infinite; }

    /* Cards */
    .qz-card {
      background: var(--surf);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 28px;
      position: relative;
      transition: border-color 0.2s ease, transform 0.25s ease, box-shadow 0.25s ease;
    }
    .qz-card-soft { background: var(--surf-a); border-color: transparent; }
    .qz-card-inverted { background: var(--inv-bg); color: var(--inv-fg); border-color: var(--inv-bg); }
    .qz-card-inverted .qz-mono { color: rgba(255,255,255,0.5); }
    .qz-card-accent {
      background: var(--accent); color: #fff; border-color: var(--accent);
    }
    .qz-card-accent .qz-mono { color: rgba(255,255,255,0.7); }
    .qz-card-id {
      font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--faint);
      position: absolute; top: 16px; right: 18px;
    }
    .qz-card-inverted .qz-card-id, .qz-card-accent .qz-card-id { color: rgba(255,255,255,0.5); }

    /* ── Nav — floating capsule pills ── */
    .qz-nav {
      position: fixed; top: 16px; left: 0; right: 0;
      z-index: 50;
      pointer-events: none;
    }
    .qz-nav-inner {
      max-width: 1320px; margin: 0 auto;
      padding: 0 32px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 14px;
    }
    .qz-nav-pill {
      pointer-events: auto;
      background: color-mix(in srgb, var(--surf) 86%, transparent);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--line);
      border-radius: 999px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      display: inline-flex; align-items: center;
      transition: box-shadow 0.25s ease, border-color 0.25s ease;
    }
    .qz-nav-pill-brand {
      padding: 5px 18px 5px 5px;
      gap: 12px;
    }
    .qz-nav-pill-brand .qz-nav-mark {
      width: 38px; height: 38px; border-radius: 50%;
      background: var(--inv-bg); color: var(--inv-fg);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--f-display); font-weight: 600; font-size: 14px;
      letter-spacing: -0.02em;
      flex-shrink: 0;
    }
    .qz-nav-name {
      font-family: var(--f-display); font-weight: 600; font-size: 15px;
      letter-spacing: -0.01em; color: var(--ink);
      line-height: 1.1;
    }
    .qz-nav-status {
      font-family: var(--f-mono); font-size: 10px;
      color: var(--faint); letter-spacing: 0.04em;
      display: flex; align-items: center; gap: 5px;
      margin-top: 2px;
    }
    .qz-nav-status .dot {
      width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
    }
    .qz-nav-pill-links {
      padding: 5px 6px;
      gap: 2px;
    }
    .qz-nav-link {
      padding: 7px 14px; border-radius: 999px; font-size: 12.5px; font-weight: 500;
      color: var(--muted); transition: color 0.2s ease, background 0.2s ease;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .qz-nav-link:hover { color: var(--ink); background: var(--surf-a); }
    .qz-nav-num {
      font-family: var(--f-mono); font-size: 10px; color: var(--faint);
      letter-spacing: 0.04em;
    }
    .qz-nav-pill-actions {
      padding: 5px;
      gap: 6px;
    }
    .qz-nav-pill-actions .qz-icon-btn { border: none; background: transparent; }
    .qz-nav-pill-actions .qz-icon-btn:hover { background: var(--surf-a); }
    .qz-nav-cta {
      padding: 8px 18px; border-radius: 999px;
      background: var(--inv-bg); color: var(--inv-fg);
      font-size: 13px; font-weight: 500;
      transition: opacity 0.2s ease, transform 0.2s ease;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .qz-nav-cta:hover { opacity: 0.88; transform: translateX(1px); }
    .qz-icon-btn {
      width: 34px; height: 34px; border-radius: 999px;
      background: transparent; color: var(--muted);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background 0.2s ease, color 0.2s ease;
    }
    .qz-icon-btn:hover { color: var(--ink); background: var(--surf-a); }
    .qz-mobile-toggle { display: none; gap: 6px; padding: 5px; }

    /* Section header */
    .qz-section { padding: 80px 0; }
    .qz-section-head {
      display: flex; align-items: flex-end; justify-content: space-between;
      flex-wrap: wrap; gap: 24px; margin-bottom: 32px;
    }
    .qz-section-tag { display: flex; flex-direction: column; gap: 8px; }
    .qz-section-tag .qz-mono { color: var(--accent); }
    .qz-section-title {
      font-family: var(--f-display); font-weight: 600;
      font-size: clamp(32px, 4.5vw, 56px);
      line-height: 1.05; letter-spacing: -0.03em;
      max-width: 22ch;
    }
    .qz-section-sub {
      font-size: 15px; color: var(--muted); max-width: 42ch; line-height: 1.55;
    }

    /* ── Hero ── */
    .qz-hero { padding-top: 130px; padding-bottom: 80px; position: relative; z-index: 1; }
    .qz-section { position: relative; z-index: 1; }
    .qz-root > footer { position: relative; z-index: 1; }
    .qz-hero-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      grid-template-rows: auto auto;
      gap: 16px;
      align-items: stretch;
    }
    .qz-hero-name-card {
      padding: 44px;
      display: flex; flex-direction: column; gap: 24px;
      position: relative;
    }
    .qz-hero-availability {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 7px 14px; border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      font-family: var(--f-mono); font-size: 11px;
      letter-spacing: 0.06em; text-transform: uppercase;
      align-self: flex-start;
    }
    .qz-hero-availability .dot {
      width: 7px; height: 7px; border-radius: 50%; background: var(--accent);
    }
    .qz-hero-name {
      font-family: var(--f-display); font-weight: 600;
      font-size: clamp(56px, 8vw, 104px);
      line-height: 0.92; letter-spacing: -0.04em;
      margin-top: 28px;
    }
    .qz-hero-name em {
      font-style: normal;
      color: var(--accent);
    }
    .qz-hero-role {
      display: inline-flex; align-items: center; gap: 6px;
      margin-top: 18px;
      font-family: var(--f-mono); font-size: 12px;
      letter-spacing: 0.05em; text-transform: uppercase;
      color: var(--muted);
    }
    .qz-hero-role span.bullet { color: var(--accent); }
    .qz-hero-tagline {
      margin-top: 36px;
      font-size: 22px; line-height: 1.4;
      color: var(--ink); font-weight: 500;
      max-width: 32ch;
    }
    .qz-hero-tagline em { color: var(--accent); font-style: normal; }
    .qz-hero-ctas {
      display: flex; gap: 10px; flex-wrap: wrap;
      margin-top: 28px;
    }
    .qz-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 20px; border-radius: 999px;
      font-size: 14px; font-weight: 500; cursor: pointer;
      transition: all 0.2s ease;
    }
    .qz-btn-primary { background: var(--inv-bg); color: var(--inv-fg); border: 1px solid var(--inv-bg); }
    .qz-btn-primary:hover { background: var(--accent); border-color: var(--accent); color: #fff; }
    .qz-btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }
    .qz-btn-ghost:hover { border-color: var(--ink); }

    .qz-hero-photo-card {
      padding: 0; overflow: hidden; position: relative;
      min-height: 360px;
      background: linear-gradient(150deg, var(--accent-soft), var(--surf-a));
    }
    .qz-hero-photo-card img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
    .qz-hero-photo-card-init {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      font-family: var(--f-display); font-size: 96px; font-weight: 500;
      color: rgba(0,0,0,0.18); letter-spacing: -0.04em;
    }
    .qz-hero-photo-meta {
      position: absolute; top: 16px; left: 16px;
      display: flex; flex-direction: column; gap: 4px;
      padding: 8px 12px; border-radius: 12px;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    }
    .qz-hero-photo-meta-label { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: #888; }
    .qz-hero-photo-meta-value { font-family: var(--f-mono); font-size: 11px; color: #1a1a17; font-weight: 600; }

    .qz-hero-stats {
      grid-column: 1 / -1;
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .qz-hero-stat {
      padding: 22px;
      display: flex; flex-direction: column; gap: 6px;
      justify-content: space-between;
      min-height: 120px;
    }
    .qz-hero-stat-num {
      font-family: var(--f-display); font-size: clamp(32px, 3.6vw, 44px);
      font-weight: 600; letter-spacing: -0.025em; line-height: 1;
    }
    .qz-hero-stat-label {
      font-family: var(--f-mono); font-size: 10px;
      letter-spacing: 0.06em; text-transform: uppercase;
    }

    /* ── About ── */
    .qz-about-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      grid-template-rows: auto auto;
      gap: 16px;
    }
    .qz-about-bio {
      grid-row: 1 / 3;
      padding: 40px;
      display: flex; flex-direction: column; gap: 22px;
    }
    .qz-about-bio p {
      font-size: 17px; line-height: 1.65; color: var(--muted);
    }
    .qz-about-bio p:first-of-type {
      font-size: 19px; color: var(--ink); line-height: 1.55;
    }
    .qz-about-bio-divider {
      width: 40px; height: 2px; background: var(--accent); border-radius: 2px;
      margin: 4px 0;
    }
    .qz-about-meta {
      display: flex; flex-direction: column; gap: 6px;
    }
    .qz-about-meta-label { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; }
    .qz-about-meta-value { font-family: var(--f-display); font-size: 22px; font-weight: 500; letter-spacing: -0.01em; }

    /* ── Skills — vertical category rows ── */
    .qz-skills-stack {
      background: var(--surf);
      border: 1px solid var(--line);
      border-radius: 28px;
      overflow: hidden;
    }
    .qz-skill-row {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 40px;
      padding: 32px 40px;
      border-bottom: 1px solid var(--line);
      align-items: center;
      transition: background 0.25s ease;
      position: relative;
    }
    .qz-skill-row::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: var(--accent);
      transform: scaleY(0); transform-origin: top;
      transition: transform 0.3s ease;
    }
    .qz-skill-row:hover { background: var(--surf-a); }
    .qz-skill-row:hover::before { transform: scaleY(1); }
    .qz-skill-row:last-child { border-bottom: none; }
    .qz-skill-row-label {
      display: flex; flex-direction: column; gap: 6px;
    }
    .qz-skill-row-num {
      font-family: var(--f-mono); font-size: 11px;
      color: var(--accent); letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .qz-skill-row-title {
      font-family: var(--f-display); font-size: 28px;
      font-weight: 600; letter-spacing: -0.02em;
      line-height: 1.05;
    }
    .qz-skill-row-count {
      font-family: var(--f-mono); font-size: 10.5px;
      color: var(--faint); letter-spacing: 0.06em;
      margin-top: 2px;
    }
    .qz-skill-row-tags {
      display: flex; flex-wrap: wrap; gap: 8px;
      align-items: center;
    }
    .qz-skill-chip {
      padding: 7px 14px; border-radius: 999px;
      background: var(--surf-a); color: var(--ink);
      font-family: var(--f-mono); font-size: 12px;
      letter-spacing: 0.02em;
      border: 1px solid transparent;
      transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
    }
    .qz-skill-row:hover .qz-skill-chip {
      background: var(--surf);
      border-color: var(--line);
    }
    .qz-skill-chip:hover {
      border-color: var(--accent) !important;
      color: var(--accent);
    }
    .qz-skill-row.featured {
      background: var(--inv-bg); color: var(--inv-fg);
    }
    .qz-skill-row.featured .qz-skill-row-num { color: var(--accent-soft); }
    .qz-skill-row.featured .qz-skill-row-count { color: rgba(255,255,255,0.55); }
    .qz-skill-row.featured .qz-skill-chip {
      background: rgba(255,255,255,0.08);
      color: var(--inv-fg);
      border-color: rgba(255,255,255,0.15);
    }

    /* ── Experience — left-edge timeline ── */
    .qz-exp-timeline {
      position: relative;
      padding-left: 170px;
    }
    .qz-exp-timeline::before {
      content: '';
      position: absolute;
      left: 110px; top: 32px; bottom: 32px;
      width: 2px;
      background: linear-gradient(to bottom, var(--accent), var(--line) 90%);
      border-radius: 2px;
    }
    .qz-exp-entry {
      position: relative;
      margin-bottom: 28px;
    }
    .qz-exp-entry:last-child { margin-bottom: 0; }
    .qz-exp-marker {
      position: absolute;
      left: -170px; top: 36px;
      width: 90px;
      display: flex; flex-direction: column; align-items: flex-end;
      gap: 4px;
    }
    .qz-exp-year {
      width: 100%; text-align: right;
      font-family: var(--f-display); font-size: 22px;
      font-weight: 600; letter-spacing: -0.02em;
      color: var(--ink); line-height: 1;
    }
    .qz-exp-month {
      font-family: var(--f-mono); font-size: 10px;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--faint);
    }
    .qz-exp-dot {
      position: absolute;
      left: -66px; top: 44px;
      width: 14px; height: 14px;
      border-radius: 50%;
      background: var(--ink);
      border: 4px solid var(--bg);
      z-index: 1;
      transition: transform 0.25s ease, background 0.25s ease;
    }
    .qz-exp-entry.current .qz-exp-dot {
      background: var(--accent);
    }
    .qz-exp-entry.current .qz-exp-dot::after {
      content: '';
      position: absolute; inset: -6px;
      border: 2px solid var(--accent);
      border-radius: 50%;
      animation: qz-pulse-ring 2.4s infinite;
    }
    @keyframes qz-pulse-ring {
      0% { transform: scale(0.85); opacity: 0.8; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    .qz-exp-card {
      background: var(--surf);
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 28px 32px;
      transition: border-color 0.25s ease, box-shadow 0.3s ease, transform 0.25s ease;
    }
    .qz-exp-entry:hover .qz-exp-card {
      border-color: var(--accent);
      box-shadow: 0 18px 40px -20px color-mix(in srgb, var(--accent) 30%, transparent);
      transform: translateX(2px);
    }
    .qz-exp-entry:hover .qz-exp-dot { transform: scale(1.2); }
    .qz-exp-head {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 16px; flex-wrap: wrap; margin-bottom: 8px;
    }
    .qz-exp-head-left { min-width: 0; }
    .qz-exp-role {
      font-family: var(--f-display); font-size: 22px;
      font-weight: 600; letter-spacing: -0.02em; line-height: 1.15;
    }
    .qz-exp-company {
      font-family: var(--f-mono); font-size: 12px; color: var(--muted);
      letter-spacing: 0.02em; margin-top: 4px;
    }
    .qz-exp-period-pill {
      font-family: var(--f-mono); font-size: 10.5px;
      letter-spacing: 0.06em; color: var(--muted);
      padding: 4px 10px; border-radius: 999px;
      background: var(--surf-a);
      white-space: nowrap;
    }
    .qz-exp-now {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 11px; border-radius: 999px;
      background: var(--accent-soft); color: var(--accent);
      font-family: var(--f-mono); font-size: 10px;
      letter-spacing: 0.06em; text-transform: uppercase;
      white-space: nowrap;
    }
    .qz-exp-now .dot {
      width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
    }
    .qz-exp-summary { font-size: 15px; line-height: 1.6; color: var(--muted); margin: 12px 0; }
    .qz-exp-bullets {
      list-style: none;
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 8px 24px;
      margin-bottom: 16px;
    }
    .qz-exp-bullets li {
      font-size: 14px; line-height: 1.55; color: var(--muted);
      display: flex; gap: 8px;
    }
    .qz-exp-bullets li::before {
      content: '→'; color: var(--accent); flex-shrink: 0;
    }
    .qz-exp-stack {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding-top: 14px; border-top: 1px dashed var(--line);
    }
    .qz-exp-stack span {
      padding: 3px 10px; border-radius: 6px;
      background: var(--surf-a); color: var(--muted);
      font-family: var(--f-mono); font-size: 10.5px;
    }

    /* ── Projects ── */
    .qz-proj-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 16px;
    }
    .qz-proj-card {
      padding: 28px;
      display: flex; flex-direction: column; gap: 14px;
      transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }
    .qz-proj-card:hover {
      transform: translateY(-3px);
      border-color: var(--accent);
      box-shadow: 0 24px 48px -20px color-mix(in srgb, var(--accent) 30%, transparent);
    }
    .qz-proj-card-featured {
      grid-row: 1 / 3;
      padding: 36px;
      min-height: 360px;
    }
    .qz-proj-tag {
      font-family: var(--f-mono); font-size: 10.5px;
      letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--accent);
    }
    .qz-proj-title {
      font-family: var(--f-display);
      font-size: 24px;
      font-weight: 600; letter-spacing: -0.02em;
      line-height: 1.15;
    }
    .qz-proj-card-featured .qz-proj-title { font-size: clamp(32px, 3vw, 42px); }
    .qz-proj-desc { font-size: 14px; line-height: 1.55; color: var(--muted); flex: 1; }
    .qz-proj-card-featured .qz-proj-desc { font-size: 16px; }
    .qz-proj-stack { display: flex; flex-wrap: wrap; gap: 6px; }
    .qz-proj-stack span {
      padding: 3px 8px; border-radius: 6px; background: var(--surf-a);
      font-family: var(--f-mono); font-size: 10px; color: var(--muted);
    }
    .qz-proj-links {
      display: flex; gap: 10px;
      padding-top: 14px; border-top: 1px dashed var(--line);
      margin-top: auto;
    }
    .qz-proj-link {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: var(--f-mono); font-size: 11px;
      letter-spacing: 0.04em; text-transform: uppercase;
      color: var(--ink);
      padding-bottom: 1px;
      border-bottom: 1px solid var(--ink);
      transition: color 0.2s ease, border-color 0.2s ease;
    }
    .qz-proj-link:hover { color: var(--accent); border-color: var(--accent); }
    .qz-proj-link.muted { color: var(--faint); border-color: var(--line); }

    /* ── Education ── */
    .qz-edu-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .qz-edu-card { padding: 28px; display: flex; flex-direction: column; gap: 16px; }
    .qz-edu-card h3 {
      font-family: var(--f-display); font-size: 18px;
      font-weight: 600; letter-spacing: -0.01em;
    }
    .qz-edu-entry { padding: 14px 0; border-bottom: 1px solid var(--line); }
    .qz-edu-entry:last-child { border-bottom: none; padding-bottom: 0; }
    .qz-edu-entry-row {
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 12px; margin-bottom: 6px; flex-wrap: wrap;
    }
    .qz-edu-degree {
      font-family: var(--f-display); font-size: 15px;
      font-weight: 500; letter-spacing: -0.005em;
    }
    .qz-edu-school {
      font-family: var(--f-mono); font-size: 11px;
      color: var(--muted); margin-top: 2px;
    }
    .qz-edu-period {
      font-family: var(--f-mono); font-size: 10.5px;
      color: var(--accent); white-space: nowrap;
      padding: 3px 8px; background: var(--accent-soft); border-radius: 6px;
    }
    .qz-edu-detail {
      font-size: 13px; line-height: 1.5; color: var(--muted);
      margin-top: 8px;
    }
    .qz-cert-row {
      display: grid; grid-template-columns: 1fr auto;
      gap: 14px; align-items: center;
      padding: 12px 0; border-bottom: 1px solid var(--line);
    }
    .qz-cert-row:last-child { border-bottom: none; padding-bottom: 0; }
    .qz-cert-info { min-width: 0; }
    .qz-cert-name { font-size: 14px; font-weight: 500; }
    .qz-cert-issuer { font-family: var(--f-mono); font-size: 11px; color: var(--muted); margin-top: 2px; }
    .qz-cert-year {
      font-family: var(--f-mono); font-size: 10px;
      padding: 3px 8px; border-radius: 6px;
      background: var(--surf-a); color: var(--muted);
      letter-spacing: 0.05em;
    }

    /* ── Contact ── */
    .qz-contact-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 16px;
    }
    .qz-contact-headline-card {
      grid-row: 1 / 3;
      padding: 48px;
      display: flex; flex-direction: column; justify-content: space-between;
      min-height: 320px;
    }
    .qz-contact-headline {
      font-family: var(--f-display); font-size: clamp(28px, 3.8vw, 44px);
      font-weight: 600; line-height: 1.05; letter-spacing: -0.025em;
    }
    .qz-contact-headline em { color: var(--accent); font-style: normal; }
    .qz-contact-sub {
      font-size: 15px; line-height: 1.6; color: var(--muted);
      max-width: 36ch; margin-top: 16px;
    }
    .qz-contact-email {
      display: inline-flex; align-items: center; gap: 8px;
      align-self: flex-start; margin-top: 24px;
      padding: 14px 22px; border-radius: 999px;
      background: var(--inv-bg); color: var(--inv-fg);
      font-size: 15px; font-weight: 500;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    .qz-contact-email:hover { opacity: 0.85; transform: translateX(2px); }
    .qz-contact-channel {
      padding: 22px;
      display: flex; flex-direction: column; gap: 8px;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }
    .qz-contact-channel:hover { border-color: var(--accent); transform: translateY(-2px); }
    .qz-contact-channel-icon {
      width: 38px; height: 38px; border-radius: 12px;
      background: var(--surf-a); color: var(--ink);
      display: flex; align-items: center; justify-content: center;
    }
    .qz-contact-channel-label {
      font-family: var(--f-mono); font-size: 10px;
      letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--faint); margin-top: 4px;
    }
    .qz-contact-channel-value {
      font-size: 14px; font-weight: 500; color: var(--ink);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    /* ── Footer ── */
    .qz-footer {
      border-top: 1px solid var(--line);
      padding: 32px 0;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 16px;
    }
    .qz-footer-text { font-family: var(--f-mono); font-size: 11px; color: var(--faint); }
    .qz-footer-links { display: flex; gap: 10px; }
    .qz-footer-icon {
      width: 32px; height: 32px; border-radius: 50%;
      border: 1px solid var(--line); color: var(--muted);
      display: flex; align-items: center; justify-content: center;
      transition: border-color 0.2s ease, color 0.2s ease;
    }
    .qz-footer-icon:hover { border-color: var(--accent); color: var(--accent); }

    /* ── Mobile ── */
    @media (max-width: 1024px) {
      .qz-shell { padding: 0 24px; }
      .qz-hero-grid { grid-template-columns: 1fr; }
      .qz-hero-name-card { min-height: auto; }
      .qz-hero-photo-card { min-height: 240px; max-height: 360px; }
      .qz-hero-stats { grid-template-columns: repeat(2, 1fr); }
      .qz-about-grid { grid-template-columns: 1fr; }
      .qz-about-bio { grid-row: auto; }
      .qz-skill-row { grid-template-columns: 1fr; gap: 16px; padding: 24px 28px; }
      .qz-proj-grid { grid-template-columns: 1fr 1fr; }
      .qz-proj-card-featured { grid-row: auto; grid-column: 1 / -1; }
      .qz-exp-timeline { padding-left: 36px; }
      .qz-exp-timeline::before { left: 8px; }
      .qz-exp-marker { left: -36px; top: 32px; flex-direction: row; align-items: baseline; gap: 6px; width: auto; }
      .qz-exp-year { width: auto; font-size: 16px; text-align: left; }
      .qz-exp-month { font-size: 9px; }
      .qz-exp-dot { left: -33px; top: 38px; width: 12px; height: 12px; border-width: 3px; }
      .qz-exp-marker { display: none; }
      .qz-exp-bullets { grid-template-columns: 1fr; }
      .qz-exp-card { padding: 22px 24px; }
      .qz-exp-head { flex-direction: column; align-items: flex-start; }
      .qz-edu-grid { grid-template-columns: 1fr; }
      .qz-contact-grid { grid-template-columns: 1fr 1fr; }
      .qz-contact-headline-card { grid-row: auto; grid-column: 1 / -1; min-height: 0; }
      .qz-nav-pill-links { display: none !important; }
      .qz-nav-pill-actions { display: none !important; }
      .qz-mobile-toggle { display: inline-flex !important; }
      .qz-hero { padding-top: 96px; }
    }
    @media (max-width: 640px) {
      .qz-shell { padding: 0 18px; }
      .qz-section { padding: 60px 0; }
      .qz-hero-name-card { padding: 32px; }
      .qz-hero-stats { grid-template-columns: 1fr 1fr; }
      .qz-skill-row { padding: 20px 22px; }
      .qz-proj-grid { grid-template-columns: 1fr; }
      .qz-contact-grid { grid-template-columns: 1fr; }
      .qz-contact-headline-card { padding: 32px; }
      .qz-card { padding: 22px; }
    }
  `;

  const navLinks = [
    { num: '/01', href: '#about', label: 'About' },
    { num: '/02', href: '#skills', label: 'Skills' },
    { num: '/03', href: '#experience', label: 'Experience' },
    { num: '/04', href: '#projects', label: 'Work' },
    { num: '/05', href: '#education', label: 'Background' },
    { num: '/06', href: '#contact', label: 'Contact' },
  ];

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const nameParts = name.trim().split(' ');
  const initials = nameParts.map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="qz-root">
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
      <link rel="stylesheet" href={FONTS_HREF}/>
      <style suppressHydrationWarning>{css}</style>
      <canvas ref={canvasRef} className="qz-bg-particles" aria-hidden="true"/>

      {/* Nav — three floating capsule pills */}
      <nav className="qz-nav">
        <div className="qz-nav-inner">
          {/* Brand pill */}
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="qz-nav-pill qz-nav-pill-brand">
            <div className="qz-nav-mark">{initials}</div>
            <div>
              <div className="qz-nav-name">{name}</div>
              <div className="qz-nav-status">
                <span className="dot qz-pulse"/> {c.availability || 'Available'}
              </div>
            </div>
          </a>

          {/* Links pill (desktop) */}
          <div className="qz-nav-pill qz-nav-pill-links" style={{ display: 'inline-flex' }}>
            {navLinks.map(link => (
              <a key={link.href} href={link.href} onClick={(e) => scrollTo(e, link.href)} className="qz-nav-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions pill (desktop) */}
          <div className="qz-nav-pill qz-nav-pill-actions" style={{ display: 'inline-flex' }}>
            <button className="qz-icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">
              {dark ? <SunIcon/> : <MoonIcon/>}
            </button>
            <a href="#contact" onClick={(e) => scrollTo(e, '#contact')} className="qz-nav-cta">
              Get in touch
            </a>
          </div>

          {/* Mobile toggle pill */}
          <div className="qz-nav-pill qz-mobile-toggle">
            <button className="qz-icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">
              {dark ? <SunIcon/> : <MoonIcon/>}
            </button>
            <button className="qz-icon-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
              ) : (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="qz-nav-pill" style={{ position: 'absolute', top: 60, left: 24, right: 24, borderRadius: 24, padding: '12px 12px 16px', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'stretch' }}>
            {navLinks.map(link => (
              <a key={link.href} href={link.href} onClick={(e) => scrollTo(e, link.href)} className="qz-nav-link" style={{ padding: '10px 14px' }}>
                <span className="qz-nav-num">{link.num}</span> {link.label}
              </a>
            ))}
            <a href="#contact" onClick={(e) => scrollTo(e, '#contact')} className="qz-nav-cta" style={{ marginTop: 8, justifyContent: 'center' }}>
              Get in touch
            </a>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="qz-hero qz-shell">
        <div className="qz-hero-grid qz-reveal">
          {/* Name card */}
          <div className="qz-card qz-hero-name-card">
            <span className="qz-card-id">/00 · INTRO</span>
            <div>
              <div className="qz-hero-availability">
                <span className="dot qz-pulse"/> {c.availability || 'Available for work'}
              </div>
              <h1 className="qz-hero-name">
                {nameParts.length > 1 ? <>{nameParts[0]} <em>{nameParts.slice(1).join(' ')}</em></> : <em>{name}</em>}
              </h1>
              <div className="qz-hero-role">
                <span className="bullet">●</span> {c.role || 'Developer'} <span className="bullet">●</span> {c.location || 'Remote'}
              </div>
              <p className="qz-hero-tagline">
                {(() => {
                  const text = c.tagline || c.subtitle || 'Building software people are glad to use.';
                  const words = text.split(' ');
                  if (words.length < 3) return text;
                  return <>{words.slice(0, -2).join(' ')} <em>{words.slice(-2).join(' ')}</em></>;
                })()}
              </p>
            </div>
            <div className="qz-hero-ctas">
              <a href="#projects" onClick={(e) => scrollTo(e, '#projects')} className="qz-btn qz-btn-primary">
                View Work <ArrowRightIcon/>
              </a>
              <a href="#contact" onClick={(e) => scrollTo(e, '#contact')} className="qz-btn qz-btn-ghost">
                Get in touch
              </a>
              {c.resumeUrl && (
                <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer" className="qz-btn qz-btn-ghost">
                  Resume <ArrowOutIcon/>
                </a>
              )}
            </div>
          </div>

          {/* Photo card */}
          <div className="qz-card qz-hero-photo-card">
            {c.photoUrl
              ? <img src={c.photoUrl} alt={name}/>
              : <div className="qz-hero-photo-card-init">{initials}</div>}
            <div className="qz-hero-photo-meta">
              <div className="qz-hero-photo-meta-label">Status</div>
              <div className="qz-hero-photo-meta-value">{c.availability ? c.availability.split('·')[0].trim() : 'Available'}</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="qz-hero-stats">
            {[1, 2, 3, 4].map(i => {
              const num = c[`stat${i}Num`], lbl = c[`stat${i}Label`];
              if (!num && !lbl) return null;
              const variants = ['qz-card-soft', 'qz-card-inverted', 'qz-card-accent', 'qz-card-soft'];
              return (
                <div key={i} className={`qz-card qz-hero-stat ${variants[i - 1] || ''}`}>
                  <span className="qz-mono">/0{i}</span>
                  <div>
                    <div className="qz-hero-stat-num">{num || '—'}</div>
                    <div className="qz-hero-stat-label">{lbl}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="qz-section qz-shell">
        <div className="qz-section-head qz-reveal">
          <div className="qz-section-tag">
            <span className="qz-mono">{c.aboutSectionLabel || '/01 — About'}</span>
            <h2 className="qz-section-title">{c.aboutHeading || 'A short version of a longer story.'}</h2>
          </div>
        </div>

        <div className="qz-about-grid qz-reveal">
          <div className="qz-card qz-about-bio">
            <span className="qz-card-id">/01.A · BIO</span>
            {c.aboutPara1 && <p>{c.aboutPara1}</p>}
            <div className="qz-about-bio-divider"/>
            {c.aboutPara2 && <p>{c.aboutPara2}</p>}
            {c.aboutPara3 && <p>{c.aboutPara3}</p>}
          </div>
          <div className="qz-card qz-card-inverted qz-about-meta">
            <span className="qz-mono">/01.B · LOCATION</span>
            <span className="qz-about-meta-value">{c.location || '—'}</span>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, opacity: 0.6, marginTop: 4 }}>{c.timezone || '—'}</span>
          </div>
          <div className="qz-card qz-card-accent qz-about-meta">
            <span className="qz-mono">/01.C · CURRENT FOCUS</span>
            <span className="qz-about-meta-value" style={{ color: '#fff' }}>{c.focus || '—'}</span>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{c.languages || ''} {c.education ? `· ${c.education}` : ''}</span>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" className="qz-section qz-shell">
        <div className="qz-section-head qz-reveal">
          <div className="qz-section-tag">
            <span className="qz-mono">{c.skillsSectionLabel || '/02 — Skills'}</span>
            <h2 className="qz-section-title">{c.skillsHeading || 'The tools I reach for.'}</h2>
          </div>
          {c.skillsSub && <p className="qz-section-sub">{c.skillsSub}</p>}
        </div>

        <div className="qz-skills-stack qz-reveal">
          {skills.length > 0 ? skills.map((sk, i) => {
            const tags = pl(sk.items);
            const isFeatured = i === 0;
            return (
              <div key={i} className={`qz-skill-row ${isFeatured ? 'featured' : ''}`}>
                <div className="qz-skill-row-label">
                  <span className="qz-skill-row-num">/0{i + 1}</span>
                  <h3 className="qz-skill-row-title">{sk.category}</h3>
                  <span className="qz-skill-row-count">{tags.length} item{tags.length === 1 ? '' : 's'}</span>
                </div>
                <div className="qz-skill-row-tags">
                  {tags.map((t, j) => <span key={j} className="qz-skill-chip">{t}</span>)}
                </div>
              </div>
            );
          }) : (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--faint)', fontFamily: 'var(--f-mono)', fontSize: 13 }}>
              Add skill categories in the admin.
            </div>
          )}
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience" className="qz-section qz-shell">
        <div className="qz-section-head qz-reveal">
          <div className="qz-section-tag">
            <span className="qz-mono">{c.expSectionLabel || '/03 — Experience'}</span>
            <h2 className="qz-section-title">{c.expHeading || "Where I've done the work."}</h2>
          </div>
        </div>

        {exps.length > 0 ? (
          <div className="qz-exp-timeline qz-reveal">
            {exps.map((e, i) => {
              const { month, year } = parseStartPeriod(e.period);
              return (
                <div key={i} className={`qz-exp-entry ${e.isCurrent ? 'current' : ''}`}>
                  <div className="qz-exp-marker">
                    <span className="qz-exp-year">{year || '—'}</span>
                    {month && <span className="qz-exp-month">{month}</span>}
                  </div>
                  <div className="qz-exp-dot"/>
                  <div className="qz-exp-card">
                    <div className="qz-exp-head">
                      <div className="qz-exp-head-left">
                        <h3 className="qz-exp-role">{e.role}</h3>
                        <div className="qz-exp-company">{e.company}{e.employmentType ? ` · ${e.employmentType}` : ''}</div>
                      </div>
                      {e.isCurrent
                        ? <span className="qz-exp-now"><span className="dot qz-pulse"/> {e.nowLabel || 'Now'}</span>
                        : <span className="qz-exp-period-pill">{e.period}{e.duration ? ` · ${e.duration}` : ''}</span>}
                    </div>
                    {e.isCurrent && (
                      <div className="qz-exp-period-pill" style={{ marginTop: 6, display: 'inline-block' }}>{e.period}{e.duration ? ` · ${e.duration}` : ''}</div>
                    )}
                    {e.summary && <p className="qz-exp-summary">{e.summary}</p>}
                    {e.bullets && (
                      <ul className="qz-exp-bullets">
                        {lines(e.bullets).map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    )}
                    {e.stack && (
                      <div className="qz-exp-stack">
                        {pl(e.stack).map((s, j) => <span key={j}>{s}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="qz-card qz-reveal" style={{ textAlign: 'center', padding: 48, color: 'var(--faint)', fontFamily: 'var(--f-mono)', fontSize: 13 }}>
            Add experience entries in the admin.
          </div>
        )}
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="qz-section qz-shell">
        <div className="qz-section-head qz-reveal">
          <div className="qz-section-tag">
            <span className="qz-mono">{c.projSectionLabel || '/04 — Selected Work'}</span>
            <h2 className="qz-section-title">{c.projHeading || 'Things I have built.'}</h2>
          </div>
          {c.projSub && <p className="qz-section-sub">{c.projSub}</p>}
        </div>

        {projects.length > 0 ? (
          <div className="qz-proj-grid qz-reveal">
            {projects.slice(0, 5).map((p, i) => (
              <div key={i} className={`qz-card qz-proj-card ${i === 0 ? 'qz-proj-card-featured' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <span className="qz-proj-tag">{p.tag}</span>
                  <span className="qz-mono" style={{ color: 'var(--faint)' }}>/{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="qz-proj-title">{p.title}</h3>
                {p.desc && <p className="qz-proj-desc">{p.desc}</p>}
                {p.stack && (
                  <div className="qz-proj-stack">
                    {pl(p.stack).map((s, j) => <span key={j}>{s}</span>)}
                  </div>
                )}
                <div className="qz-proj-links">
                  {p.liveUrl ? (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="qz-proj-link" onClick={(e) => e.stopPropagation()}>
                      Visit <ArrowOutIcon/>
                    </a>
                  ) : <span className="qz-proj-link muted">Coming soon</span>}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="qz-proj-link" onClick={(e) => e.stopPropagation()}>
                      Source <ArrowOutIcon/>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="qz-card" style={{ textAlign: 'center', padding: 48, color: 'var(--faint)', fontFamily: 'var(--f-mono)', fontSize: 13 }}>
            Add projects in the admin.
          </div>
        )}
      </section>

      {/* ── Education & Certifications ── */}
      <section id="education" className="qz-section qz-shell">
        <div className="qz-section-head qz-reveal">
          <div className="qz-section-tag">
            <span className="qz-mono">{c.eduSectionLabel || '/05 — Background'}</span>
            <h2 className="qz-section-title">{c.eduHeading || 'Where I learned to build.'}</h2>
          </div>
        </div>

        <div className="qz-edu-grid qz-reveal">
          <div className="qz-card qz-edu-card">
            <span className="qz-card-id">/05.A · STUDIED</span>
            <h3>Education</h3>
            {education.length > 0 ? education.map((edu, i) => (
              <div key={i} className="qz-edu-entry">
                <div className="qz-edu-entry-row">
                  <div>
                    <div className="qz-edu-degree">{edu.degree}</div>
                    <div className="qz-edu-school">{edu.school}</div>
                  </div>
                  {edu.period && <span className="qz-edu-period">{edu.period}</span>}
                </div>
                {edu.detail && <p className="qz-edu-detail">{edu.detail}</p>}
              </div>
            )) : <p style={{ color: 'var(--faint)', fontFamily: 'var(--f-mono)', fontSize: 12, textAlign: 'center', padding: '24px 0' }}>No education entries yet.</p>}
          </div>

          <div className="qz-card qz-card-soft qz-edu-card">
            <span className="qz-card-id">/05.B · CERTIFIED</span>
            <h3>Certifications</h3>
            {certs.length > 0 ? certs.map((cert, i) => (
              <div key={i} className="qz-cert-row">
                <div className="qz-cert-info">
                  <div className="qz-cert-name">{cert.name}</div>
                  <div className="qz-cert-issuer">{cert.issuer}</div>
                </div>
                {cert.url ? (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="qz-cert-year" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {cert.year} <ArrowOutIcon/>
                  </a>
                ) : (
                  <span className="qz-cert-year">{cert.year}</span>
                )}
              </div>
            )) : <p style={{ color: 'var(--faint)', fontFamily: 'var(--f-mono)', fontSize: 12, textAlign: 'center', padding: '24px 0' }}>No certifications yet.</p>}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="qz-section qz-shell">
        <div className="qz-section-head qz-reveal">
          <div className="qz-section-tag">
            <span className="qz-mono">{c.contactSectionLabel || '/06 — Contact'}</span>
          </div>
        </div>

        <div className="qz-contact-grid qz-reveal">
          <div className="qz-card qz-contact-headline-card">
            <span className="qz-card-id">/06.A · GET IN TOUCH</span>
            <div>
              <h2 className="qz-contact-headline">
                {(() => {
                  const text = c.contactHeadline || 'Have a project in mind?';
                  const words = text.split(' ');
                  if (words.length < 3) return <em>{text}</em>;
                  return <>{words.slice(0, -2).join(' ')} <em>{words.slice(-2).join(' ')}</em></>;
                })()}
              </h2>
              {c.contactSub && <p className="qz-contact-sub">{c.contactSub}</p>}
            </div>
            {c.contactEmail && (
              <a href={`mailto:${c.contactEmail}`} className="qz-contact-email">
                {c.contactEmail} <ArrowRightIcon/>
              </a>
            )}
          </div>

          {c.githubUrl && (
            <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="qz-card qz-contact-channel">
              <div className="qz-contact-channel-icon"><GithubIcon/></div>
              <span className="qz-contact-channel-label">GitHub</span>
              <span className="qz-contact-channel-value">{c.githubUrl.replace('https://', '').replace('github.com/', '@')}</span>
            </a>
          )}
          {c.linkedinUrl && (
            <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="qz-card qz-contact-channel">
              <div className="qz-contact-channel-icon"><LinkedinIcon/></div>
              <span className="qz-contact-channel-label">LinkedIn</span>
              <span className="qz-contact-channel-value">{c.linkedinUrl.replace('https://', '').replace('linkedin.com/in/', '/')}</span>
            </a>
          )}
          {c.twitterUrl && (
            <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer" className="qz-card qz-contact-channel">
              <div className="qz-contact-channel-icon"><TwitterIcon/></div>
              <span className="qz-contact-channel-label">Twitter</span>
              <span className="qz-contact-channel-value">{c.twitterUrl.replace('https://', '').replace('x.com/', '@').replace('twitter.com/', '@')}</span>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="qz-shell">
        <div className="qz-footer">
          <span className="qz-footer-text">© {new Date().getFullYear()} {name} · Built with FolioForge</span>
          <div className="qz-footer-links">
            {c.githubUrl && <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="qz-footer-icon" aria-label="GitHub"><GithubIcon/></a>}
            {c.linkedinUrl && <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="qz-footer-icon" aria-label="LinkedIn"><LinkedinIcon/></a>}
            {c.twitterUrl && <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer" className="qz-footer-icon" aria-label="Twitter"><TwitterIcon/></a>}
          </div>
        </div>
      </footer>
    </div>
  );
}
