'use client';
import { useState, useEffect, useRef } from 'react';

interface Props { content: Record<string, string>; username: string; }

function pl(v?: string) { return v ? v.split(',').map(s => s.trim()).filter(Boolean) : []; }
function ls(v?: string) { return v ? v.split('\n').map(s => s.trim()).filter(Boolean) : []; }
function bold(v: string) { return v.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); }

// ── SVG Icons ──────────────────────────────────────────────────────
const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);
const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const MailIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const ExternalIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);
const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const PdfIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// ── Base CSS ──────────────────────────────────────────────────────
const CSS = `
  .ms{--p:#2dd4bf;--ph:#14b8a6;--pd:#0f766e;--ps:#ccfbf1;--pf:#ecfdf5;
    --bg:#f0fdf4;--bg2:#f8fafc;--card:#ffffff;--bdr:#e2e8f0;--bdrs:#cbd5e1;
    --tx:#1e293b;--tx2:#475569;--tx3:#94a3b8;
    --sh:0 2px 8px -2px rgba(15,118,110,.08),0 1px 3px rgba(0,0,0,.04);
    --shh:0 16px 40px -12px rgba(15,118,110,.22),0 4px 12px -4px rgba(0,0,0,.07);
    font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--tx);
    font-size:.95rem;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
  .ms *{box-sizing:border-box;margin:0;padding:0;}
  .ms a{color:inherit;text-decoration:none;}
  .ms button{font:inherit;cursor:pointer;border:none;background:none;color:inherit;}
  .ms-mono{font-family:'JetBrains Mono',ui-monospace,monospace;}
  @keyframes ms-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(1.35)}}
  @keyframes ms-shimmer{to{background-position:200% 0}}
  @keyframes ms-rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
  @keyframes ms-fadein{from{opacity:0}to{opacity:1}}
  .ms-reveal{opacity:0;transform:translateY(20px);}
  .ms-reveal.in{animation:ms-rise .55s cubic-bezier(.2,.8,.3,1) forwards;}

  /* ── Nav ── */
  .ms-nav{position:sticky;top:0;z-index:50;transition:all .25s;}
  .ms-nav.scrolled{background:rgba(255,255,255,.96);backdrop-filter:blur(16px) saturate(150%);
    border-bottom:1px solid var(--bdr);box-shadow:0 2px 12px -4px rgba(0,0,0,.06);}
  .ms-nav-inner{display:flex;align-items:center;justify-content:space-between;height:60px;
    max-width:1280px;margin:0 auto;padding:0 1.5rem;gap:1rem;}
  .ms-logo{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:1rem;
    letter-spacing:-.02em;color:var(--tx);}
  .ms-logo-mark{width:32px;height:32px;border-radius:9px;flex-shrink:0;
    background:linear-gradient(135deg,var(--p),var(--ph));color:#fff;
    display:grid;place-items:center;font-family:'JetBrains Mono',monospace;
    font-size:.9rem;font-weight:700;box-shadow:0 4px 12px -3px rgba(45,212,191,.5);}
  .ms-nav-links{display:flex;gap:2px;list-style:none;}
  .ms-nav-link{padding:7px 13px;border-radius:7px;font-size:.875rem;font-weight:500;
    color:var(--tx2);transition:color .15s,background .15s;cursor:pointer;position:relative;}
  .ms-nav-link:hover{color:var(--tx);background:rgba(0,0,0,.04);}
  .ms-nav-link.active{color:var(--ph);font-weight:600;}
  .ms-badge{font-family:'JetBrains Mono',monospace;font-size:.72rem;font-weight:600;
    padding:5px 11px;border:1.5px solid var(--p);color:var(--pd);border-radius:999px;
    background:var(--pf);white-space:nowrap;display:inline-flex;align-items:center;gap:6px;}
  .ms-pulse{width:6px;height:6px;border-radius:50%;background:var(--ph);
    animation:ms-pulse 1.8s infinite;display:inline-block;flex-shrink:0;}
  .ms-ham{display:none;width:40px;height:40px;border-radius:7px;
    border:1.5px solid var(--bdr);background:var(--card);align-items:center;
    justify-content:center;color:var(--tx);}
  .ms-mobile-menu{display:none;position:fixed;inset:60px 0 0 0;background:var(--card);
    z-index:49;flex-direction:column;padding:1rem;border-top:1px solid var(--bdr);
    gap:4px;overflow-y:auto;}
  .ms-mobile-menu.open{display:flex;}
  .ms-mobile-link{padding:.9rem 1rem;font-size:1rem;font-weight:500;border-radius:8px;
    cursor:pointer;color:var(--tx);transition:background .15s;}
  .ms-mobile-link:hover{background:var(--bg2);}

  /* ── Hero ── */
  .ms-hero{padding:3.5rem 0 3rem;position:relative;overflow:hidden;}
  .ms-hero-bg{position:absolute;inset:0;
    background-image:linear-gradient(var(--bdr) 1px,transparent 1px),
      linear-gradient(90deg,var(--bdr) 1px,transparent 1px);
    background-size:52px 52px;
    mask-image:radial-gradient(ellipse 70% 90% at 50% 0%,#000,transparent 80%);
    -webkit-mask-image:radial-gradient(ellipse 70% 90% at 50% 0%,#000,transparent 80%);
    opacity:.35;pointer-events:none;}
  .ms-hero-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:1.5rem;align-items:stretch;position:relative;}
  .ms-card{background:var(--card);border:1px solid var(--bdr);border-radius:1.125rem;
    box-shadow:var(--sh);position:relative;overflow:hidden;}
  .ms-bio-card{padding:2.25rem 2rem;}
  .ms-bio-card::before{content:'';position:absolute;top:-50px;right:-50px;width:250px;height:250px;
    background:radial-gradient(circle,var(--ps),transparent 60%);pointer-events:none;opacity:.6;}
  .ms-bio-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,transparent,var(--p),var(--ph),transparent);
    background-size:200% 100%;animation:ms-shimmer 5s linear infinite;}
  .ms-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:5px 12px;
    background:var(--ps);color:var(--pd);font-size:.74rem;font-weight:600;
    border-radius:999px;font-family:'JetBrains Mono',monospace;margin-bottom:1.5rem;
    border:1px solid rgba(45,212,191,.35);}
  .ms-h1{font-size:clamp(1.85rem,3.5vw,2.6rem);font-weight:800;letter-spacing:-.04em;
    line-height:1.02;margin-bottom:.9rem;}
  .ms-h1 em{color:var(--ph);font-style:italic;font-weight:600;}
  .ms-role-pill{display:inline-flex;align-items:center;gap:8px;font-size:.88rem;font-weight:500;
    margin-bottom:1.1rem;padding:6px 14px;background:var(--bg2);border:1.5px solid var(--bdr);
    border-radius:999px;color:var(--tx2);}
  .ms-bio{font-size:.97rem;color:var(--tx2);line-height:1.72;margin-bottom:1.75rem;max-width:52ch;}
  .ms-bio strong{color:var(--pd);font-weight:600;background:linear-gradient(180deg,transparent 58%,var(--ps) 58%);padding:0 3px;}
  .ms-actions{display:flex;flex-wrap:wrap;gap:.65rem;margin-bottom:1.75rem;}
  .ms-btn{padding:.65rem 1.15rem;border-radius:7px;font-size:.875rem;font-weight:600;
    display:inline-flex;align-items:center;gap:8px;transition:all .18s;
    border:1.5px solid transparent;min-height:42px;cursor:pointer;white-space:nowrap;}
  .ms-btn-primary{background:linear-gradient(135deg,var(--p),var(--ph));color:#fff;
    box-shadow:0 4px 14px -3px rgba(45,212,191,.45);}
  .ms-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px -6px rgba(45,212,191,.55);}
  .ms-btn-outline{background:var(--card);color:var(--tx);border-color:var(--bdrs);}
  .ms-btn-outline:hover{border-color:var(--p);color:var(--ph);transform:translateY(-1px);}
  .ms-meta-row{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;padding:.85rem 1rem;
    background:var(--bg2);border-radius:.875rem;border:1px dashed var(--bdr);}
  .ms-meta-item{display:flex;flex-direction:column;gap:3px;padding:0 .25rem;border-right:1px solid var(--bdr);}
  .ms-meta-item:last-child{border-right:none;}
  .ms-meta-label{font-family:'JetBrains Mono',monospace;font-size:.62rem;color:var(--tx3);
    text-transform:uppercase;letter-spacing:.1em;}
  .ms-meta-value{font-size:.82rem;font-weight:600;color:var(--tx);}
  .ms-stats-card{padding:1.5rem;display:flex;flex-direction:column;
    background:linear-gradient(160deg,var(--card) 0%,var(--pf) 100%);}
  .ms-stats-head{display:flex;justify-content:space-between;align-items:baseline;
    padding-bottom:.75rem;margin-bottom:1rem;border-bottom:1px solid var(--bdr);}
  .ms-stats-head h3{font-size:.92rem;font-weight:700;color:var(--tx);}
  .ms-stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;flex:1;}
  .ms-stat{background:var(--card);border:1px solid var(--bdr);border-radius:.875rem;
    padding:1.1rem;transition:all .2s;position:relative;overflow:hidden;}
  .ms-stat::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
    background:linear-gradient(180deg,var(--p),var(--ph));transform:scaleY(0);
    transform-origin:bottom;transition:transform .22s;}
  .ms-stat:hover{border-color:var(--p);transform:translateY(-2px);box-shadow:var(--sh);}
  .ms-stat:hover::before{transform:scaleY(1);}
  .ms-stat-num{font-size:1.55rem;font-weight:800;letter-spacing:-.03em;line-height:1.05;
    background:linear-gradient(135deg,var(--ph),var(--pd));-webkit-background-clip:text;
    background-clip:text;color:transparent;margin-bottom:.25rem;}
  .ms-stat-label{font-size:.76rem;color:var(--tx2);font-weight:500;line-height:1.3;}

  /* ── Section ── */
  .ms-section{padding:5rem 0 4rem;}
  .ms-container{width:100%;max-width:1280px;margin:0 auto;padding:0 1.75rem;}
  .ms-section-head{margin-bottom:2.75rem;display:grid;grid-template-columns:auto 1fr auto;
    align-items:end;gap:1.5rem;}
  .ms-eyebrow-tag{display:inline-flex;align-items:center;gap:8px;
    font-family:'JetBrains Mono',monospace;font-size:.72rem;font-weight:600;
    color:var(--pd);text-transform:uppercase;letter-spacing:.12em;
    padding:6px 12px;background:var(--ps);border-radius:999px;white-space:nowrap;
    border:1px solid rgba(45,212,191,.3);}
  .ms-eyebrow-tag .num{width:18px;height:18px;display:inline-grid;place-items:center;
    background:var(--ph);color:#fff;border-radius:50%;font-size:.62rem;font-weight:700;}
  .ms-section-title{font-size:clamp(1.5rem,2.8vw,2rem);font-weight:700;
    letter-spacing:-.03em;line-height:1.1;color:var(--tx);}
  .ms-section-title .mint{color:var(--ph);font-weight:600;}
  .ms-section-sub{font-size:.9rem;color:var(--tx2);max-width:56ch;margin-top:5px;line-height:1.55;}
  .ms-section-meta{font-family:'JetBrains Mono',monospace;font-size:.74rem;color:var(--tx3);
    text-align:right;line-height:1.6;white-space:nowrap;}
  .ms-section-meta .ping{color:var(--ph);font-weight:700;}

  /* ── Skills ── */
  .ms-skills-frame{background:var(--card);border:1px solid var(--bdr);border-radius:1.25rem;
    padding:2rem;box-shadow:var(--sh);position:relative;overflow:hidden;margin-bottom:1.25rem;}
  .ms-skills-frame::before{content:'';position:absolute;top:-70px;right:-70px;width:220px;height:220px;
    background:radial-gradient(circle,var(--pf),transparent 70%);pointer-events:none;}
  .ms-skills-frame-head{display:flex;justify-content:space-between;align-items:center;
    margin-bottom:1.25rem;padding-bottom:1rem;border-bottom:1px dashed var(--bdr);position:relative;}
  .ms-skills-frame-head h3{font-size:1rem;font-weight:700;color:var(--ph);}
  .ms-chips{display:flex;flex-wrap:wrap;gap:.6rem;position:relative;}
  .ms-chip{padding:.48rem .95rem;background:var(--bg2);color:var(--tx);border-radius:7px;
    font-size:.855rem;font-weight:500;border:1.5px solid var(--bdr);transition:all .18s;
    display:inline-flex;align-items:center;gap:6px;cursor:default;}
  .ms-chip::after{content:'';width:5px;height:5px;border-radius:50%;background:var(--p);
    margin-left:4px;box-shadow:0 0 0 2px var(--pf);flex-shrink:0;}
  .ms-chip:hover{border-color:var(--p);background:var(--pf);transform:translateY(-2px);
    box-shadow:0 4px 12px -3px rgba(45,212,191,.22);}
  .ms-learn-strip{background:linear-gradient(135deg,var(--ps),var(--pf));
    border:1.5px solid rgba(45,212,191,.4);border-radius:1.25rem;
    padding:1.25rem 1.5rem;display:flex;align-items:center;gap:1.5rem;
    margin-bottom:1.25rem;position:relative;overflow:hidden;flex-wrap:wrap;}
  .ms-learn-strip::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--ph);}
  .ms-learn-label{font-size:.92rem;font-weight:700;color:var(--pd);
    display:inline-flex;align-items:center;gap:10px;white-space:nowrap;flex-shrink:0;}
  .ms-learn-ico{width:34px;height:34px;background:var(--card);color:var(--ph);
    border-radius:9px;display:grid;place-items:center;font-size:15px;
    box-shadow:var(--sh);flex-shrink:0;}
  .ms-learn-items{display:flex;flex-wrap:wrap;gap:.5rem;flex:1;}
  .ms-learn-item{font-size:.83rem;font-weight:600;padding:5px 11px;background:var(--card);
    border:1.5px solid rgba(45,212,191,.5);border-radius:6px;color:var(--pd);
    font-family:'JetBrains Mono',monospace;}
  .ms-learn-hrs{font-size:.78rem;font-family:'JetBrains Mono',monospace;
    color:var(--pd);text-align:right;white-space:nowrap;flex-shrink:0;line-height:1.4;}
  .ms-tools-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;}
  .ms-tool{background:var(--card);border:1px solid var(--bdr);border-radius:1rem;
    padding:1.2rem;display:flex;align-items:center;gap:13px;transition:all .2s;
    position:relative;overflow:hidden;}
  .ms-tool::after{content:'';position:absolute;bottom:0;left:0;height:2px;width:0;
    background:linear-gradient(90deg,var(--p),var(--ph));transition:width .25s;}
  .ms-tool:hover{border-color:var(--p);transform:translateY(-2px);box-shadow:var(--sh);}
  .ms-tool:hover::after{width:100%;}
  .ms-tool-ico{width:46px;height:46px;border-radius:10px;
    background:linear-gradient(135deg,var(--pf),var(--ps));color:var(--pd);
    display:grid;place-items:center;font-size:1rem;flex-shrink:0;
    border:1px solid rgba(45,212,191,.3);overflow:hidden;}
  .ms-tool-ico img{width:100%;height:100%;object-fit:contain;padding:8px;}
  .ms-tool-ico .ms-tool-letter{font-weight:700;font-size:1.1rem;font-family:'JetBrains Mono',monospace;color:var(--pd);}

  /* ── Experience / Timeline ── */
  .ms-timeline{position:relative;padding-left:2rem;}
  .ms-timeline::before{content:'';position:absolute;left:7px;top:10px;bottom:10px;width:2px;
    background:linear-gradient(180deg,var(--p),var(--ps),transparent);}
  .ms-exp-card{background:var(--card);border:1px solid var(--bdr);border-radius:1.25rem;
    padding:1.75rem;box-shadow:var(--sh);transition:all .25s;position:relative;margin-bottom:1.25rem;}
  .ms-exp-card::before{content:'';position:absolute;left:-2.05rem;top:1.75rem;
    width:16px;height:16px;border-radius:50%;background:var(--card);
    border:3px solid var(--p);box-shadow:0 0 0 4px var(--pf);z-index:1;}
  .ms-exp-card.current::before{background:var(--p);animation:ms-pulse 1.8s infinite;}
  .ms-exp-card:hover{border-color:var(--p);box-shadow:var(--shh);transform:translateY(-2px);}
  .ms-exp-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;
    flex-wrap:wrap;padding-bottom:1rem;margin-bottom:1.2rem;border-bottom:1px dashed var(--bdr);}
  .ms-exp-role{font-size:1.15rem;font-weight:700;letter-spacing:-.015em;margin-bottom:4px;color:var(--tx);}
  .ms-exp-company{color:var(--ph);font-weight:600;}
  .ms-exp-tagline{font-size:.86rem;color:var(--tx2);line-height:1.5;margin-top:2px;}
  .ms-exp-date{font-family:'JetBrains Mono',monospace;font-size:.74rem;padding:4px 11px;
    background:var(--ps);color:var(--pd);border-radius:999px;font-weight:600;
    white-space:nowrap;display:inline-flex;align-items:center;gap:6px;}
  .ms-exp-date.now::before{content:'';width:6px;height:6px;border-radius:50%;
    background:var(--ph);animation:ms-pulse 1.8s infinite;}
  .ms-exp-duration{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--tx3);margin-top:4px;}
  .ms-bullets{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:.7rem 1.25rem;}
  .ms-bullets li{font-size:.88rem;color:var(--tx);padding:8px 12px 8px 30px;position:relative;
    line-height:1.5;background:var(--bg2);border-radius:6px;border-left:2.5px solid var(--p);
    transition:background .15s;}
  .ms-bullets li:hover{background:var(--pf);}
  .ms-bullets li::before{content:'✓';position:absolute;left:9px;top:8px;width:15px;height:15px;
    background:var(--p);color:#fff;border-radius:50%;display:grid;place-items:center;
    font-size:.58rem;font-weight:700;}
  .ms-bullets li b{font-weight:700;color:var(--pd);background:var(--ps);padding:1px 5px;
    border-radius:3px;font-size:.8rem;font-family:'JetBrains Mono',monospace;}
  .ms-stack-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:1.2rem;padding-top:1rem;
    border-top:1px dashed var(--bdr);}
  .ms-stack-tag{font-family:'JetBrains Mono',monospace;font-size:.73rem;font-weight:500;
    padding:4px 10px;border:1px solid var(--bdr);border-radius:5px;color:var(--tx2);
    background:var(--card);transition:all .15s;}
  .ms-stack-tag:hover{border-color:var(--p);color:var(--ph);}

  /* ── Projects ── */
  .ms-projects-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;}
  .ms-project{background:var(--card);border:1px solid var(--bdr);border-radius:1.25rem;
    overflow:hidden;box-shadow:var(--sh);transition:all .3s cubic-bezier(.2,.7,.3,1);
    display:flex;flex-direction:column;}
  .ms-project:hover{border-color:var(--p);box-shadow:var(--shh);transform:translateY(-5px);}
  .ms-project-visual{height:126px;position:relative;overflow:hidden;
    display:grid;place-items:center;}
  .ms-project-visual::before{content:'';position:absolute;inset:0;
    background-image:linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px);
    background-size:22px 22px;}
  .ms-project-num{position:absolute;top:11px;left:13px;font-family:'JetBrains Mono',monospace;
    font-size:.7rem;font-weight:600;color:rgba(255,255,255,.8);letter-spacing:.1em;z-index:1;}
  .ms-project-emoji{font-size:2.6rem;filter:drop-shadow(0 4px 10px rgba(0,0,0,.18));position:relative;z-index:1;}
  .ms-project-impact{position:absolute;bottom:10px;left:12px;right:12px;color:#fff;
    font-family:'JetBrains Mono',monospace;font-size:.76rem;font-weight:600;
    background:rgba(0,0,0,.22);backdrop-filter:blur(6px);padding:4px 9px;
    border-radius:6px;border:1px solid rgba(255,255,255,.18);
    display:inline-flex;align-items:center;gap:5px;width:fit-content;z-index:1;}
  .ms-project-body{padding:1.4rem;display:flex;flex-direction:column;gap:.8rem;flex:1;}
  .ms-project-title{font-size:1.05rem;font-weight:700;letter-spacing:-.015em;color:var(--tx);}
  .ms-project-year{font-family:'JetBrains Mono',monospace;font-size:.71rem;color:var(--tx3);
    padding:2px 7px;border:1px solid var(--bdr);border-radius:4px;flex-shrink:0;}
  .ms-project-desc{font-size:.86rem;color:var(--tx2);line-height:1.55;}
  .ms-project-stack{display:flex;flex-wrap:wrap;gap:5px;}
  .ms-project-stack span{font-family:'JetBrains Mono',monospace;font-size:.71rem;font-weight:500;
    padding:3px 8px;background:var(--pf);color:var(--pd);border-radius:4px;border:1px solid var(--ps);}
  .ms-project-challenge{font-size:.78rem;font-style:italic;color:var(--tx2);padding:.6rem .8rem;
    background:var(--bg2);border-left:3px solid var(--p);border-radius:0 6px 6px 0;line-height:1.5;}
  .ms-project-challenge b{font-style:normal;font-weight:700;color:var(--pd);
    font-family:'JetBrains Mono',monospace;font-size:.68rem;text-transform:uppercase;
    letter-spacing:.08em;margin-right:4px;}
  .ms-project-actions{display:flex;gap:7px;margin-top:auto;padding-top:.5rem;}
  .ms-proj-btn{flex:1;padding:.5rem .85rem;border-radius:6px;font-size:.79rem;font-weight:600;
    display:inline-flex;align-items:center;justify-content:center;gap:6px;
    border:1.5px solid transparent;transition:all .15s;min-height:37px;cursor:pointer;}
  .ms-proj-btn.solid{background:linear-gradient(135deg,var(--p),var(--ph));color:#fff;
    box-shadow:0 2px 8px -2px rgba(45,212,191,.4);}
  .ms-proj-btn.solid:hover{transform:translateY(-1px);box-shadow:0 5px 14px -3px rgba(45,212,191,.5);}
  .ms-proj-btn.ghost{color:var(--tx);border-color:var(--bdrs);background:var(--card);}
  .ms-proj-btn.ghost:hover{border-color:var(--p);color:var(--ph);}
  .ms-proj-btn.disabled{opacity:.4;cursor:default;pointer-events:none;}


  /* ── Testimonials ── */
  .ms-test-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;}
  .ms-test{background:var(--card);border:1px solid var(--bdr);border-radius:1.25rem;
    padding:2rem;box-shadow:var(--sh);transition:all .25s;position:relative;overflow:hidden;}
  .ms-test::before{content:'"';position:absolute;top:-16px;left:14px;font-size:7rem;
    font-family:Georgia,serif;color:var(--ps);line-height:1;pointer-events:none;font-weight:700;}
  .ms-test:hover{border-color:var(--p);transform:translateY(-3px);box-shadow:var(--shh);}
  .ms-test p{font-size:.95rem;font-style:italic;color:var(--tx);line-height:1.65;
    margin-bottom:1.25rem;position:relative;z-index:1;}
  .ms-test-author{display:flex;align-items:center;gap:12px;padding-top:1rem;
    border-top:1px dashed var(--bdr);position:relative;z-index:1;}
  .ms-test-avi{width:38px;height:38px;border-radius:50%;
    background:linear-gradient(135deg,var(--p),var(--pd));color:#fff;
    display:grid;place-items:center;font-size:.85rem;font-weight:700;
    font-family:'JetBrains Mono',monospace;flex-shrink:0;}

  /* ── Contact ── */
  .ms-contact-row{background:linear-gradient(135deg,var(--card),var(--pf));
    border:1px solid var(--bdr);border-radius:1.25rem;padding:2rem;
    display:grid;grid-template-columns:1.2fr 1fr;gap:2rem;box-shadow:var(--sh);
    margin-bottom:1.25rem;align-items:center;position:relative;overflow:hidden;}
  .ms-contact-row::before{content:'';position:absolute;top:-70px;right:-70px;width:260px;height:260px;
    background:radial-gradient(circle,var(--ps),transparent 65%);pointer-events:none;}
  .ms-contact-avail h3{font-size:1.2rem;font-weight:700;margin-bottom:.5rem;
    display:flex;align-items:center;gap:10px;letter-spacing:-.015em;color:var(--tx);}
  .ms-live{width:10px;height:10px;border-radius:50%;background:var(--ph);
    box-shadow:0 0 0 4px var(--ps);animation:ms-pulse 1.8s infinite;
    display:inline-block;flex-shrink:0;}
  .ms-contact-avail p{font-size:.9rem;color:var(--tx2);line-height:1.6;margin-bottom:.75rem;}
  .ms-tz-pill{font-family:'JetBrains Mono',monospace;font-size:.77rem;font-weight:600;
    color:var(--pd);display:inline-flex;align-items:center;gap:8px;padding:5px 12px;
    background:var(--card);border:1px solid var(--ps);border-radius:999px;}
  .ms-contact-channels{display:flex;flex-direction:column;gap:.85rem;position:relative;z-index:1;}
  .ms-contact-icons{display:flex;flex-wrap:wrap;gap:8px;}
  .ms-icon-btn{width:44px;height:44px;border:1.5px solid var(--bdr);border-radius:7px;
    display:grid;place-items:center;color:var(--tx2);background:var(--card);
    transition:all .18s;cursor:pointer;}
  .ms-icon-btn:hover{color:var(--pd);border-color:var(--p);background:var(--ps);transform:translateY(-2px);}
  .ms-email-copy{display:inline-flex;align-items:center;gap:10px;padding:.6rem 1rem;
    background:var(--card);border:1.5px dashed var(--p);border-radius:7px;
    font-family:'JetBrains Mono',monospace;font-size:.86rem;font-weight:500;
    color:var(--tx);cursor:pointer;transition:all .15s;min-height:44px;
    overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .ms-email-copy:hover{background:var(--pf);color:var(--pd);border-style:solid;}
  .ms-divider{font-size:.77rem;color:var(--tx3);text-align:center;margin:1.25rem 0;
    font-family:'JetBrains Mono',monospace;display:flex;align-items:center;gap:1rem;}
  .ms-divider::before,.ms-divider::after{content:'';flex:1;height:1px;background:var(--bdr);}
  .ms-contact-form{background:var(--card);border:1px solid var(--bdr);border-radius:1.25rem;
    padding:1.75rem;box-shadow:var(--sh);display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
  .ms-field{display:flex;flex-direction:column;gap:5px;}
  .ms-field.full{grid-column:1 / -1;}
  .ms-field label{font-size:.71rem;color:var(--tx2);font-weight:600;
    font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.08em;}
  .ms-field input,.ms-field textarea{padding:.68rem .95rem;background:var(--bg2);
    border:1.5px solid var(--bdr);border-radius:7px;color:var(--tx);font:inherit;
    font-size:.9rem;outline:none;transition:all .15s;min-height:42px;}
  .ms-field textarea{resize:vertical;min-height:72px;line-height:1.5;}
  .ms-field input:focus,.ms-field textarea:focus{border-color:var(--p);background:var(--card);
    box-shadow:0 0 0 3px rgba(45,212,191,.16);}
  .ms-form-footer{grid-column:1 / -1;display:flex;align-items:center;gap:1rem;
    padding-top:.75rem;border-top:1px dashed var(--bdr);flex-wrap:wrap;}

  /* ── Footer ── */
  .ms-footer{border-top:1px solid var(--bdr);padding:2rem 0;background:var(--card);position:relative;}
  .ms-footer::before{content:'';position:absolute;top:-1px;left:50%;transform:translateX(-50%);
    width:60px;height:2px;background:linear-gradient(90deg,var(--p),var(--ph));border-radius:0 0 3px 3px;}
  .ms-footer-inner{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;
    gap:.4rem 1.25rem;font-size:.78rem;color:var(--tx2);font-family:'JetBrains Mono',monospace;}
  .ms-footer-inner .sep{color:var(--tx3);}
  .ms-footer-inner .v{color:var(--pd);font-weight:600;padding:2px 7px;background:var(--ps);border-radius:4px;}

  /* ── Toast ── */
  .ms-toast{position:fixed;bottom:24px;left:50%;transform:translate(-50%,120px);
    background:var(--tx);color:#fff;padding:11px 18px;border-radius:999px;
    font-size:.84rem;font-weight:500;z-index:200;transition:transform .35s cubic-bezier(.2,.7,.3,1);
    box-shadow:var(--shh);display:inline-flex;align-items:center;gap:8px;pointer-events:none;}
  .ms-toast.show{transform:translate(-50%,0);}

  /* ── Responsive ── */
  @media(max-width:1100px){
    .ms-projects-grid{grid-template-columns:1fr 1fr;}
    .ms-tools-grid{grid-template-columns:1fr 1fr 1fr;}
  }
  @media(max-width:900px){
    .ms-hero-grid{grid-template-columns:1fr;}
    .ms-tools-grid{grid-template-columns:1fr 1fr;}
    .ms-section-head{grid-template-columns:auto 1fr;gap:1rem;}
    .ms-section-meta{display:none;}
  }
  @media(max-width:768px){
    .ms-nav-links,.ms-badge{display:none!important;}
    .ms-ham{display:flex!important;}
    .ms-hero{padding:2.5rem 0 2rem;}
    .ms-hero-grid{gap:1rem;}
    .ms-bio-card{padding:1.5rem!important;}
    .ms-meta-row{grid-template-columns:1fr 1fr!important;}
    .ms-meta-item:nth-child(even){border-right:none!important;}
    .ms-contact-row{grid-template-columns:1fr!important;gap:1.25rem!important;padding:1.5rem!important;}
    .ms-test-grid{grid-template-columns:1fr!important;}
    .ms-bullets{grid-template-columns:1fr!important;}
    .ms-projects-grid{grid-template-columns:1fr!important;}
    .ms-tools-grid{grid-template-columns:1fr!important;}
    .ms-learn-strip{gap:.85rem!important;}
    .ms-contact-form{grid-template-columns:1fr!important;}
    .ms-timeline{padding-left:1.5rem!important;}
    .ms-section{padding:3.5rem 0 2.5rem;}
    .ms-section-head{grid-template-columns:1fr!important;gap:.65rem!important;}

  }
  @media(max-width:480px){
    .ms-container{padding:0 1rem;}
    .ms-actions{flex-direction:column;}
    .ms-btn{width:100%;justify-content:center;}
    .ms-stats-grid{grid-template-columns:1fr 1fr;}
  }
`;

const PROJECT_GRADIENTS = [
  'linear-gradient(135deg,#2dd4bf,#0f766e)',
  'linear-gradient(135deg,#0d9488,#134e4a)',
  'linear-gradient(135deg,#14b8a6,#0f766e)',
  'linear-gradient(135deg,#5eead4,#14b8a6)',
  'linear-gradient(135deg,#0f766e,#064e3b)',
  'linear-gradient(135deg,#2dd4bf,#6366f1)',
  'linear-gradient(135deg,#14b8a6,#8b5cf6)',
  'linear-gradient(135deg,#0d9488,#3b82f6)',
];
const FALLBACK_EMOJIS = ['🚀','⚡','🔧','🎨','🌱','📊','🛠️','✨'];

export default function MintSlateTemplate({ content: c }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.ms-reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  function toast(msg: string) {
    setToastMsg(msg); setToastShow(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 2400);
  }

  function scrollTo(e: React.MouseEvent, href: string) {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  }

  // ── Color overrides from theme section ──
  const themeOverride = [
    c.colorAccent && `--p:${c.colorAccent};`,
    c.colorAccentHover && `--ph:${c.colorAccentHover};`,
    c.colorAccentDark && `--pd:${c.colorAccentDark};`,
    c.colorAccentSoft && `--ps:${c.colorAccentSoft};`,
    c.colorAccentFaint && `--pf:${c.colorAccentFaint};`,
    c.colorBg && `--bg:${c.colorBg};`,
    c.colorBg2 && `--bg2:${c.colorBg2};`,
    c.colorCard && `--card:${c.colorCard};`,
    c.colorBorder && `--bdr:${c.colorBorder};`,
    c.colorBorderStrong && `--bdrs:${c.colorBorderStrong};`,
    c.colorText && `--tx:${c.colorText};`,
    c.colorTextMuted && `--tx2:${c.colorTextMuted};`,
    c.colorTextFaint && `--tx3:${c.colorTextFaint};`,
  ].filter(Boolean).join('');

  // ── JSON parse helper ──
  function parseJ<T>(key: string, fallback: T[]): T[] {
    if (!c[key]) return fallback;
    try { return JSON.parse(c[key]); } catch { return fallback; }
  }

  // ── Parsed content ──
  const name        = c.name         || 'Taylor Chen';
  const initials    = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const availability = c.availability || 'Open to opportunities';
  const title       = c.title        || 'Full-Stack Engineer';
  const yoe         = c.yoe          || '5';
  const bio         = c.bio          || 'I build **fast**, **accessible** web products that scale.';
  const photoUrl    = c.photoUrl     || '';

  const stats = [1,2,3,4,5,6,7,8].map(i => ({
    num: c[`stat${i}Num`], label: c[`stat${i}Label`],
  })).filter(s => s.num);

  const skills      = pl(c.skillCore);
  const learning    = pl(c.skillLearning);
  const learningHrs = c.learningHrs || '';

  // Dynamic entries — read from JSON first
  const tools: { name: string; ctx: string; image: string }[] =
    parseJ('toolsJson', []);

  const experiences: { role: string; company: string; tagline: string; period: string; duration: string; isCurrent: boolean; bullets: string[]; stack: string[] }[] =
    parseJ<{ role: string; company: string; tagline: string; period: string; duration: string; isCurrent: boolean; bullets: string; stack: string }>('expJson', [])
      .map(e => ({ ...e, bullets: ls(e.bullets), stack: pl(e.stack) }));

  const projects: { title: string; year: string; emoji: string; desc: string; stack: string[]; impact: string; challenge: string; liveUrl: string; githubUrl: string }[] =
    parseJ<{ title: string; year: string; emoji: string; desc: string; stack: string; impact: string; challenge: string; liveUrl: string; githubUrl: string }>('projJson', [])
      .map(p => ({ ...p, stack: pl(p.stack) }));

  const testimonials: { quote: string; initials: string; name: string; role: string }[] =
    parseJ('testJson', []);

  // Section headings
  const skillsHeading      = c.skillsHeading      || 'Core stack';
  const skillsSub          = c.skillsSub          || 'The tools I reach for when I need to ship something today, with confidence.';
  const expHeading         = c.expHeading         || 'Track record';
  const expSub             = c.expSub             || 'Ship measurable wins, leave the codebase better than I found it.';
  const projHeading        = c.projHeading        || "Things I've shipped";
  const projSub            = c.projSub            || 'Projects where I owned the architecture, implementation, and the metric that mattered.';
  const testimonialsHeading = c.testimonialsHeading || 'What others say';
  const testimonialsSub    = c.testimonialsSub    || "From the people I've shipped with and engineers who've reviewed my code.";
  const contactHeading     = c.contactHeading     || "Let's build something.";

  const navLinks = [
    { label: 'Stack', href: '#stack' },
    { label: 'Experience', href: '#experience' },
    { label: 'Work', href: '#work' },
    ...(testimonials.length > 0 ? [{ label: 'References', href: '#references' }] : []),
    { label: 'Contact', href: '#contact' },
  ];

  const metaItems = [
    { label: 'Location', value: c.location || '' },
    { label: 'Timezone', value: c.timezone || '' },
  ].filter(m => m.value);

  return (
    <div className="ms" style={themeOverride ? ({ '--override': '' } as React.CSSProperties) : undefined}>
      <style suppressHydrationWarning>{CSS}</style>
      {themeOverride && (
        <style suppressHydrationWarning>{`.ms{${themeOverride}}`}</style>
      )}

      {/* ── NAV ── */}
      <nav className={`ms-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="ms-nav-inner">
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="ms-logo">
            <span className="ms-logo-mark">{initials}</span>
            <span>{name.split(' ').map((w: string) => w[0]).join('')}<span style={{ color: 'var(--ph)' }}>.</span>dev</span>
          </a>
          <ul className="ms-nav-links">
            {navLinks.map(l => (
              <li key={l.href}>
                <span className="ms-nav-link" onClick={e => scrollTo(e as unknown as React.MouseEvent, l.href)}>{l.label}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="ms-badge"><span className="ms-pulse" />{yoe} yrs exp</span>
            <button className="ms-ham" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen
                  ? <path d="M6 18L18 6M6 6l12 12"/>
                  : <path d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>
        <div className={`ms-mobile-menu${menuOpen ? ' open' : ''}`}>
          {navLinks.map(l => (
            <span key={l.href} className="ms-mobile-link" onClick={e => scrollTo(e as unknown as React.MouseEvent, l.href)}>{l.label}</span>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="ms-hero" id="top">
        <div className="ms-hero-bg" />
        <div className="ms-container">
          <div className="ms-hero-grid">

            {/* Bio card */}
            <div className="ms-card ms-bio-card ms-reveal">
              {photoUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.5rem' }}>
                  <img src={photoUrl} alt={name}
                    style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover',
                      border: '3px solid var(--ps)', boxShadow: '0 4px 14px -4px rgba(45,212,191,.4)', flexShrink: 0 }}/>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-.01em', color: 'var(--tx)' }}>{name}</div>
                    <div style={{ fontSize: '.84rem', color: 'var(--tx2)' }}>{title}</div>
                  </div>
                </div>
              )}
              <span className="ms-eyebrow"><span className="ms-pulse" />{availability}</span>
              <h1 className="ms-h1">
                {!photoUrl && <>{name}<br /></>}
                <em>— {c.heroTagline || 'builds things that ship.'}</em>
              </h1>
              <p className="ms-role-pill">
                <span style={{ color: 'var(--ph)', marginRight: 4 }}>◈</span>
                {title} · {yoe}+ yrs production
              </p>
              <p className="ms-bio" dangerouslySetInnerHTML={{ __html: bold(bio) }} />
              <div className="ms-actions">
                <span className="ms-btn ms-btn-primary" onClick={e => scrollTo(e as unknown as React.MouseEvent, '#work')}>
                  See my work →
                </span>
                {c.resumeUrl ? (
                  <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer" className="ms-btn ms-btn-outline">
                    <PdfIcon /> Resume
                  </a>
                ) : (
                  <span className="ms-btn ms-btn-outline" style={{ opacity: .5 }}>
                    <PdfIcon /> Resume
                  </span>
                )}
                {c.contactEmail && (
                  <a href={`mailto:${c.contactEmail}`} className="ms-btn ms-btn-outline">
                    <MailIcon size={15} /> Hire me
                  </a>
                )}
              </div>
              {metaItems.length > 0 && (
                <div className="ms-meta-row" style={{ gridTemplateColumns: `repeat(${Math.min(metaItems.length, 4)}, 1fr)` }}>
                  {metaItems.map((m, i) => (
                    <div key={i} className="ms-meta-item">
                      <span className="ms-meta-label">{m.label}</span>
                      <span className="ms-meta-value">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats card */}
            <div className="ms-card ms-stats-card ms-reveal" style={{ animationDelay: '.12s' }}>
              <div className="ms-stats-head">
                <h3>📈 By the numbers</h3>
                <span className="ms-mono" style={{ fontSize: '.7rem', color: 'var(--tx3)' }}>
                  {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="ms-stats-grid">
                {(stats.length > 0 ? stats : [
                  { num: '5+', label: 'Years Experience' },
                  { num: '30+', label: 'Projects Shipped' },
                  { num: '99%', label: 'Uptime Record' },
                  { num: '12', label: 'OSS Contributions' },
                ]).map((s, i) => (
                  <div key={i} className="ms-stat">
                    <div className="ms-stat-num">{s.num}</div>
                    <div className="ms-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              {(c.githubUrl || c.linkedinUrl) && (
                <div style={{ display: 'flex', gap: 8, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--bdr)' }}>
                  {c.githubUrl && (
                    <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="ms-icon-btn" title="GitHub">
                      <GithubIcon />
                    </a>
                  )}
                  {c.linkedinUrl && (
                    <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="ms-icon-btn" title="LinkedIn">
                      <LinkedinIcon />
                    </a>
                  )}
                  {c.twitterUrl && (
                    <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer" className="ms-icon-btn" title="Twitter/X">
                      <XIcon />
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="ms-section" id="stack">
        <div className="ms-container">
          <div className="ms-section-head">
            <span className="ms-eyebrow-tag"><span className="num">01</span>{skillsHeading}</span>
            <div>
              <h2 className="ms-section-title">{skillsHeading} <span className="mint">· {yoe} yrs mastery</span></h2>
              <p className="ms-section-sub">{skillsSub}</p>
            </div>
            <div className="ms-section-meta"><span className="ping">●</span> daily drivers<br />▾ calibrated by what I&apos;ve shipped</div>
          </div>

          <div className="ms-skills-frame ms-reveal">
            <div className="ms-skills-frame-head">
              <h3>Languages, frameworks &amp; tools</h3>
              <span className="ms-mono" style={{ fontSize: '.72rem', color: 'var(--tx3)' }}>● = production-grade</span>
            </div>
            <div className="ms-chips">
              {(skills.length > 0 ? skills : ['React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker']).map((s, i) => (
                <span key={i} className="ms-chip">{s}</span>
              ))}
            </div>
          </div>

          {learning.length > 0 && (
            <div className="ms-learn-strip ms-reveal" style={{ animationDelay: '.08s' }}>
              <span className="ms-learn-label"><span className="ms-learn-ico">📖</span>Currently learning</span>
              <div className="ms-learn-items">
                {learning.map((l, i) => <span key={i} className="ms-learn-item">{l}</span>)}
              </div>
              {learningHrs && (
                <span className="ms-learn-hrs">
                  <strong style={{ fontSize: '1.1rem', display: 'block' }}>{learningHrs}</strong>
                  dedicated weekly
                </span>
              )}
            </div>
          )}

          {tools.length > 0 && (
            <div className="ms-tools-grid ms-reveal" style={{ animationDelay: '.16s' }}>
              {tools.map((t, i) => (
                <div key={i} className="ms-tool">
                  <div className="ms-tool-ico">
                    {t.image
                      ? <img src={t.image} alt={t.name} />
                      : <span className="ms-tool-letter">{t.name.charAt(0)}</span>}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.93rem', color: 'var(--tx)' }}>{t.name}</div>
                    <div className="ms-mono" style={{ fontSize: '.74rem', color: 'var(--tx3)', marginTop: 2 }}>{t.ctx}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className="ms-section" id="experience" style={{ background: 'var(--bg2)' }}>
        <div className="ms-container">
          <div className="ms-section-head">
            <span className="ms-eyebrow-tag"><span className="num">02</span>Experience</span>
            <div>
              <h2 className="ms-section-title">{expHeading} <span className="mint">· by the commits</span></h2>
              <p className="ms-section-sub">{expSub}</p>
            </div>
            <div className="ms-section-meta"><span className="ping">●</span> {experiences.length || 2} roles<br />▾ full-time &amp; contract</div>
          </div>

          <div className="ms-timeline">
            {(experiences.length > 0 ? experiences : [
              {
                role: 'Full-Stack Engineer', company: 'Acme Inc', isCurrent: true,
                tagline: 'Building scalable web infrastructure for a growing product team.',
                period: '2023 – Present', duration: '~2 years · current',
                bullets: ['Reduced API latency by **40%** via caching layer', 'Led migration to TypeScript with **100%** coverage'],
                stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
              },
            ]).map((job, i) => (
              <article key={i} className={`ms-exp-card ms-reveal${job.isCurrent ? ' current' : ''}`} style={{ animationDelay: `${i * .1}s` }}>
                <div className="ms-exp-head">
                  <div>
                    <h3 className="ms-exp-role">
                      {job.role} <span style={{ color: 'var(--tx3)', fontWeight: 400 }}>@</span>
                      <span className="ms-exp-company"> {job.company}</span>
                    </h3>
                    {job.tagline && <p className="ms-exp-tagline">{job.tagline}</p>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className={`ms-exp-date${job.isCurrent ? ' now' : ''}`}>{job.period}</span>
                    {job.duration && <span className="ms-exp-duration">{job.duration}</span>}
                  </div>
                </div>
                {job.bullets.length > 0 && (
                  <ul className="ms-bullets">
                    {job.bullets.map((b, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: bold(b) }} />
                    ))}
                  </ul>
                )}
                {job.stack.length > 0 && (
                  <div className="ms-stack-tags">
                    <span className="ms-mono" style={{ fontSize: '.68rem', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.1em', marginRight: 4 }}>Stack</span>
                    {job.stack.map((t, j) => <span key={j} className="ms-stack-tag">{t}</span>)}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="ms-section" id="work">
        <div className="ms-container">
          <div className="ms-section-head">
            <span className="ms-eyebrow-tag"><span className="num">03</span>Projects</span>
            <div>
              <h2 className="ms-section-title"><span className="mint">{projHeading}</span></h2>
              <p className="ms-section-sub">{projSub}</p>
            </div>
            <div className="ms-section-meta"><span className="ping">●</span> {projects.length || 3} featured<br />▾ links go to live demos</div>
          </div>

          <div className="ms-projects-grid">
            {(projects.length > 0 ? projects : [
              { title: 'DevFlow', year: '2024', emoji: '🚀', impact: '10k MAU', desc: 'Developer workflow tool integrating GitHub, Linear, and Slack.', stack: ['React', 'TypeScript', 'Node.js'], challenge: 'Real-time collaboration at scale', liveUrl: '', githubUrl: '' },
              { title: 'PerfPulse', year: '2023', emoji: '⚡', impact: '2k npm/mo', desc: 'Lightweight performance monitoring SDK for Next.js apps.', stack: ['TypeScript', 'ClickHouse'], challenge: '<1kb bundle overhead', liveUrl: '', githubUrl: '' },
              { title: 'SchemaForge', year: '2023', emoji: '🔧', impact: '5k GitHub ⭐', desc: 'Visual database schema designer with TypeScript type generation.', stack: ['React', 'SQLite'], challenge: 'Accurate type inference across SQL dialects', liveUrl: '', githubUrl: '' },
            ]).map((p, i) => (
              <article key={i} className="ms-project ms-reveal" style={{ animationDelay: `${i * .08}s` }}>
                <div className="ms-project-visual" style={{ background: PROJECT_GRADIENTS[i % PROJECT_GRADIENTS.length] }}>
                  <span className="ms-project-num">{String(i+1).padStart(2,'0')} / {p.title?.toUpperCase().slice(0, 12)}</span>
                  <span className="ms-project-emoji">{p.emoji}</span>
                  {p.impact && <span className="ms-project-impact">⚡ {p.impact}</span>}
                </div>
                <div className="ms-project-body">
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                    <h3 className="ms-project-title">{p.title}</h3>
                    {p.year && <span className="ms-project-year">{p.year}</span>}
                  </div>
                  {p.desc && <p className="ms-project-desc">{p.desc}</p>}
                  {p.stack.length > 0 && (
                    <div className="ms-project-stack">{p.stack.map((s, j) => <span key={j}>{s}</span>)}</div>
                  )}
                  {p.challenge && (
                    <div className="ms-project-challenge"><b>Challenge →</b>{p.challenge}</div>
                  )}
                  <div className="ms-project-actions">
                    {p.liveUrl
                      ? <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="ms-proj-btn solid">Demo <ExternalIcon /></a>
                      : <span className="ms-proj-btn solid disabled">Demo <ExternalIcon /></span>}
                    {p.githubUrl
                      ? <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="ms-proj-btn ghost">Code <GithubIcon size={13} /></a>
                      : <span className="ms-proj-btn ghost disabled">Code <GithubIcon size={13} /></span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="ms-section" id="references">
          <div className="ms-container">
            <div className="ms-section-head">
              <span className="ms-eyebrow-tag"><span className="num">04</span>References</span>
              <div>
                <h2 className="ms-section-title">{testimonialsHeading}</h2>
                <p className="ms-section-sub">{testimonialsSub}</p>
              </div>
              <div className="ms-section-meta"><span className="ping">●</span> {testimonials.length} references<br />▾ available on request</div>
            </div>
            <div className="ms-test-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="ms-test ms-reveal" style={{ animationDelay: `${i * .08}s` }}>
                  <p>&ldquo;{t.quote}&rdquo;</p>
                  <div className="ms-test-author">
                    <span className="ms-test-avi">{t.initials || (t.name || 'XX').slice(0, 2).toUpperCase()}</span>
                    <div>
                      <strong style={{ display: 'block', fontSize: '.9rem', color: 'var(--tx)' }}>{t.name}</strong>
                      <span style={{ color: 'var(--tx2)', fontSize: '.78rem' }}>{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      <section className="ms-section" id="contact" style={{ background: testimonials.length > 0 ? 'var(--bg2)' : undefined }}>
        <div className="ms-container">
          <div className="ms-section-head">
            <span className="ms-eyebrow-tag"><span className="num">0{testimonials.length > 0 ? '5' : '4'}</span>Get in touch</span>
            <div>
              <h2 className="ms-section-title">Let&apos;s <span className="mint">{contactHeading}</span></h2>
              <p className="ms-section-sub">{c.contactSub || 'Picking up freelance & full-time work. The form is fine — email is faster.'}</p>
            </div>
            <div className="ms-section-meta"><span className="ping">●</span> replies within 24h<br />▾ async-friendly</div>
          </div>

          <div className="ms-contact-row ms-reveal">
            <div className="ms-contact-avail">
              <h3><span className="ms-live" />{c.contactSub || 'Open for freelance & full-time'}</h3>
              <p>{c.contactDesc || 'Remote-first, comfortable across time zones — async by design.'}</p>
              {c.timezone && <span className="ms-tz-pill">🕐 {c.timezone}</span>}
            </div>
            <div className="ms-contact-channels">
              <div className="ms-contact-icons">
                {c.githubUrl && <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="ms-icon-btn" title="GitHub"><GithubIcon /></a>}
                {c.linkedinUrl && <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="ms-icon-btn" title="LinkedIn"><LinkedinIcon /></a>}
                {c.twitterUrl && <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer" className="ms-icon-btn" title="X / Twitter"><XIcon /></a>}
                {c.contactEmail && <a href={`mailto:${c.contactEmail}`} className="ms-icon-btn" title="Email"><MailIcon /></a>}
              </div>
              {c.contactEmail && (
                <button className="ms-email-copy" onClick={() => { navigator.clipboard?.writeText(c.contactEmail); toast('📧 Email copied!'); }}>
                  📋 {c.contactEmail}
                </button>
              )}
            </div>
          </div>

          <div className="ms-divider">— or send a quick message —</div>

          <form className="ms-contact-form ms-reveal" onSubmit={e => { e.preventDefault(); setSubmitted(true); toast('✓ Message sent! (demo)'); }}>
            <div className="ms-field">
              <label>Name</label>
              <input type="text" placeholder="Your name" required />
            </div>
            <div className="ms-field">
              <label>Email</label>
              <input type="email" placeholder="you@company.com" required />
            </div>
            <div className="ms-field full">
              <label>Message</label>
              <textarea rows={3} placeholder="Quick message — project, scope, timing…" required />
            </div>
            <div className="ms-form-footer">
              <span className="ms-mono" style={{ fontSize: '.77rem', color: 'var(--tx3)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                🔒 Your details stay between us.
              </span>
              {submitted && (
                <span style={{ fontSize: '.84rem', color: 'var(--pd)', fontFamily: 'JetBrains Mono,monospace', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', background: 'var(--ps)', borderRadius: 6 }}>✓ Thanks! Reply within 24h.</span>
              )}
              <button type="submit" className="ms-btn ms-btn-primary" style={{ marginLeft: 'auto' }}>
                Send message →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ms-footer">
        <div className="ms-footer-inner ms-container">
          <span>© {new Date().getFullYear()} {name}</span>
          <span className="sep">·</span>
          <span>Mint Slate</span>
          <span className="sep">·</span>
          <span>Powered by FolioForge</span>
          <span className="sep">·</span>
          <span className="v">v2.0</span>
        </div>
      </footer>

      {/* ── TOAST ── */}
      <div className={`ms-toast${toastShow ? ' show' : ''}`}>{toastMsg}</div>
    </div>
  );
}
