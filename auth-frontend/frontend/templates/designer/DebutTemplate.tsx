'use client';
import { useState, useEffect } from 'react';

interface Props { content: Record<string, string>; username: string; hideBranding?: boolean; }

function pl(v?: string) { return v ? v.split(',').map(s => s.trim()).filter(Boolean) : []; }
function parseJ<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

// ── Icons ──
const InstaIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>;
const BeIcon = () => <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M7.5 4.5H2v15h6c2.8 0 4.5-1.5 4.5-4 0-1.7-.9-3-2.4-3.5 1.1-.5 1.8-1.6 1.8-3 0-2.6-1.6-4.5-4.4-4.5zm-.3 6.2H4.5V7h2.7c1.2 0 1.9.7 1.9 1.8 0 1.2-.7 1.9-1.9 1.9zm.5 6.3H4.5v-4h3.2c1.5 0 2.3.7 2.3 2 0 1.3-.8 2-2.3 2zm14.3-2.5c0-2.5-1.4-4.5-4.3-4.5s-4.5 2-4.5 4.5 1.6 4.5 4.5 4.5c2.2 0 3.7-1 4.2-2.7h-2.2c-.3.6-.9 1-1.9 1-1.3 0-2-.8-2.1-2.1h6.3c.1-.2 0-.4 0-.7zm-6.2-1c.2-1.1.9-1.7 2-1.7s1.8.7 1.9 1.7H15.8zM14.5 6h5v1.5h-5V6z"/></svg>;
const DribIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72M5 8.5c5.45 1.85 11 1.55 16-.5M3 17.5c5 0 9-1 14-4"/></svg>;
const TwIcon = () => <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LiIcon = () => <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>;
const MailIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
const ArrowIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
const ExtIcon = () => <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>;
const SparkIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/></svg>;
const StarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const ChevronDown = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6"/></svg>;

// ── CSS ──
const CSS = `
.db{--bg:#FAF8F4;--surface:#FFFFFF;--ink:#0F0F14;--ink2:#3D3D45;--ink3:#7A7A85;--line:#E8E4DC;--line2:#D8D3C8;
  --accent:#FF4F5E;--accent2:#3F58FF;--accent3:#FFC940;--accent4:#5BD68C;--accent5:#A964FF;
  --display-font:'Fraunces','DM Serif Display',Georgia,serif;
  --sans-font:'Inter','SF Pro Display',system-ui,sans-serif;
  --mono-font:'JetBrains Mono','Fira Code',ui-monospace,monospace;
  font-family:var(--sans-font);background:var(--bg);color:var(--ink);
  font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative;}
.db *{box-sizing:border-box;margin:0;padding:0;}
.db a{color:inherit;text-decoration:none;}
.db button{font:inherit;cursor:pointer;border:none;background:none;color:inherit;}
.db-display{font-family:var(--display-font);}
.db-mono{font-family:var(--mono-font);}

@keyframes db-blink{50%{opacity:.45}}
@keyframes db-pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.4);opacity:1}}
@keyframes db-fadein{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes db-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes db-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes db-jitter{0%,100%{transform:rotate(-1deg)}50%{transform:rotate(1deg)}}
.db-reveal{opacity:0;transform:translateY(20px);}
.db-reveal.in{animation:db-fadein .6s cubic-bezier(.2,.85,.3,1) forwards;}

/* ── Status banner (top) ── */
.db-status-bar{position:relative;background:var(--ink);color:#fff;overflow:hidden;
  padding:10px 0;border-bottom:1px solid var(--ink);font-family:var(--mono-font);font-size:12px;
  letter-spacing:.18em;text-transform:uppercase;font-weight:600;}
.db-status-marquee{display:flex;width:max-content;gap:36px;animation:db-marquee 26s linear infinite;align-items:center;}
.db-status-marquee span{display:inline-flex;align-items:center;gap:12px;white-space:nowrap;}
.db-status-marquee .dot{width:8px;height:8px;border-radius:50%;background:var(--accent4);box-shadow:0 0 12px var(--accent4);
  animation:db-pulse 1.6s infinite;}
.db-status-marquee em{font-style:normal;color:var(--accent3);font-weight:700;}
.db-status-marquee .sep{color:var(--accent);}

/* ── Nav ── */
.db-nav{position:sticky;top:0;z-index:50;padding:18px 0;transition:all .25s;background:rgba(250,248,244,.92);backdrop-filter:blur(14px) saturate(170%);
  border-bottom:1px solid transparent;}
.db-nav.scrolled{padding:12px 0;border-bottom-color:var(--line);}
.db-nav-inner{max-width:1280px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:20px;}
.db-logo{display:flex;align-items:center;gap:11px;}
.db-logo-mark{width:40px;height:40px;border-radius:50%;background:var(--ink);color:#fff;
  display:grid;place-items:center;font-family:var(--display-font);font-size:18px;font-weight:600;position:relative;}
.db-logo-mark::after{content:'';position:absolute;top:-2px;right:-2px;width:12px;height:12px;border-radius:50%;
  background:var(--accent4);border:2px solid var(--bg);box-shadow:0 0 0 1px var(--ink);}
.db-logo-text{font-family:var(--sans-font);font-weight:700;font-size:18px;letter-spacing:-.02em;}
.db-logo-text span{color:var(--ink3);font-weight:500;}
.db-nav-links{display:flex;gap:2px;list-style:none;}
.db-nav-link{padding:8px 14px;border-radius:8px;font-size:13.5px;font-weight:500;color:var(--ink2);
  transition:all .15s;cursor:pointer;font-family:var(--mono-font);}
.db-nav-link:hover{color:var(--ink);background:var(--surface);}
.db a.db-nav-cta,a.db-nav-cta{padding:10px 18px;border-radius:999px;font-size:13.5px;font-weight:700;
  background:var(--ink);color:#fff !important;display:inline-flex;align-items:center;gap:8px;
  transition:all .2s;text-decoration:none;}
.db a.db-nav-cta:hover{background:var(--accent);transform:translateY(-2px);}
.db-ham{display:none;width:42px;height:42px;border-radius:10px;border:1.5px solid var(--line);background:var(--surface);
  align-items:center;justify-content:center;color:var(--ink);}
.db-mobile-menu{display:none;position:fixed;inset:64px 0 0 0;background:rgba(250,248,244,.97);
  backdrop-filter:blur(18px);z-index:49;flex-direction:column;padding:24px;gap:6px;overflow-y:auto;}
.db-mobile-menu.open{display:flex;}
.db-mobile-link{padding:14px 18px;font-size:18px;font-weight:600;border-radius:12px;cursor:pointer;
  color:var(--ink);border:1.5px solid var(--line);background:var(--surface);}

.db-container{max-width:1280px;margin:0 auto;padding:0 32px;position:relative;}

/* ── HERO ── */
.db-hero{padding:48px 0 88px;position:relative;}
.db-hero-grid{display:grid;grid-template-columns:1.35fr 1fr;gap:48px;align-items:stretch;}

.db-hero-left{display:flex;flex-direction:column;justify-content:space-between;}
.db-hero-eyebrow{display:inline-flex;align-items:center;gap:9px;font-family:var(--mono-font);font-size:11.5px;
  color:var(--ink);text-transform:uppercase;letter-spacing:.18em;font-weight:700;
  padding:7px 14px;background:var(--accent3);border-radius:999px;align-self:flex-start;
  margin-bottom:28px;border:1.5px solid var(--ink);}
.db-hero-eyebrow .dot{width:7px;height:7px;border-radius:50%;background:var(--ink);}

.db-hero-h1{font-family:var(--display-font);font-size:clamp(56px,8.8vw,128px);font-weight:500;
  line-height:.96;letter-spacing:-.04em;margin-bottom:28px;color:var(--ink);position:relative;}
.db-hero-h1 .em{font-style:italic;color:var(--accent);font-weight:500;}
.db-hero-h1 .underline{position:relative;display:inline-block;}
.db-hero-h1 .underline::after{content:'';position:absolute;left:0;right:0;bottom:.08em;height:.18em;
  background:var(--accent3);z-index:-1;border-radius:4px;}
.db-hero-wave{display:inline-block;animation:db-jitter 1.4s ease-in-out infinite;transform-origin:bottom right;font-style:normal;}

.db-hero-bio{font-size:18px;color:var(--ink2);line-height:1.7;max-width:56ch;margin-bottom:32px;}
.db-hero-bio strong{color:var(--ink);font-weight:600;background:linear-gradient(180deg,transparent 64%,rgba(255,79,94,.22) 64%);padding:0 4px;}

.db-hero-actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:24px;}
.db a.db-btn,a.db-btn,button.db-btn{padding:13px 24px;border-radius:999px;font-size:14.5px;font-weight:600;
  display:inline-flex;align-items:center;gap:9px;transition:all .2s;cursor:pointer;border:1.5px solid transparent;text-decoration:none;}
.db a.db-btn-primary,a.db-btn-primary,button.db-btn-primary{background:var(--ink);color:#fff !important;}
.db a.db-btn-primary:hover{background:var(--accent);transform:translateY(-2px);box-shadow:0 10px 22px -8px rgba(255,79,94,.5);}
.db a.db-btn-ghost,a.db-btn-ghost,button.db-btn-ghost{background:var(--surface);color:var(--ink) !important;border-color:var(--line);}
.db a.db-btn-ghost:hover{border-color:var(--ink);transform:translateY(-2px);}

.db-hero-quick{display:flex;flex-wrap:wrap;gap:20px;padding-top:24px;border-top:1.5px dashed var(--line);
  font-family:var(--mono-font);font-size:12px;color:var(--ink3);text-transform:uppercase;letter-spacing:.12em;}
.db-hero-quick b{color:var(--ink);font-family:var(--sans-font);font-size:14px;text-transform:none;letter-spacing:0;font-weight:600;display:block;margin-top:2px;}

/* Right column — photo collage */
.db-hero-right{position:relative;min-height:480px;}
.db-photo-main{position:absolute;inset:0;border-radius:24px;overflow:hidden;background:linear-gradient(135deg,var(--accent),var(--accent5));
  box-shadow:0 24px 60px -16px rgba(15,15,20,.25);}
.db-photo-main img{width:100%;height:100%;object-fit:cover;}
.db-photo-init{width:100%;height:100%;display:grid;place-items:center;color:#fff;font-family:var(--display-font);font-size:140px;font-weight:500;letter-spacing:-.02em;}
.db-photo-badge{position:absolute;top:20px;left:20px;padding:7px 14px;background:#fff;color:var(--ink);
  border-radius:999px;font-family:var(--mono-font);font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;
  display:inline-flex;align-items:center;gap:8px;z-index:2;box-shadow:0 4px 12px rgba(0,0,0,.18);}
.db-photo-badge .dot{width:7px;height:7px;border-radius:50%;background:var(--accent4);box-shadow:0 0 8px var(--accent4);animation:db-pulse 1.6s infinite;}

.db-photo-card{position:absolute;background:#fff;padding:14px 16px;border-radius:14px;font-family:var(--mono-font);
  box-shadow:0 14px 30px -10px rgba(15,15,20,.25);font-size:11px;color:var(--ink2);
  display:flex;flex-direction:column;gap:4px;border:1.5px solid var(--line);z-index:3;}
.db-photo-card.c1{bottom:-18px;left:-18px;background:var(--accent3);border-color:var(--ink);}
.db-photo-card.c2{top:-12px;right:-14px;background:var(--surface);}
.db-photo-card .label{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--ink3);}
.db-photo-card .value{font-family:var(--display-font);font-size:24px;font-weight:600;color:var(--ink);line-height:1;letter-spacing:-.02em;}

/* ── Section common ── */
.db-sect{padding:96px 0;position:relative;}
.db-sect-head{display:grid;grid-template-columns:auto 1fr auto;gap:32px;align-items:end;
  margin-bottom:56px;padding-bottom:24px;border-bottom:1.5px solid var(--line);}
.db-sect-num{font-family:var(--mono-font);font-size:11.5px;color:var(--accent);font-weight:700;
  letter-spacing:.18em;text-transform:uppercase;display:inline-flex;align-items:center;gap:8px;}
.db-sect-num::before{content:'';width:28px;height:1.5px;background:var(--accent);}
.db-sect-title{font-family:var(--display-font);font-size:clamp(40px,5.2vw,68px);font-weight:500;
  letter-spacing:-.03em;line-height:1;color:var(--ink);}
.db-sect-title em{font-style:italic;color:var(--accent);font-weight:500;}
.db-sect-title .mark{position:relative;display:inline-block;}
.db-sect-title .mark::after{content:'';position:absolute;left:0;right:0;bottom:.06em;height:.16em;background:var(--accent3);z-index:-1;}
.db-sect-meta{font-family:var(--mono-font);font-size:11px;color:var(--ink3);text-align:right;letter-spacing:.12em;text-transform:uppercase;line-height:1.7;white-space:nowrap;}
.db-sect-meta b{color:var(--accent);font-weight:700;}

/* ── About ── */
.db-about{display:grid;grid-template-columns:1fr 1fr;gap:48px;}
.db-about-text{font-family:var(--display-font);font-size:24px;font-weight:400;line-height:1.45;color:var(--ink);letter-spacing:-.005em;margin-bottom:18px;}
.db-about-text strong{color:var(--accent);font-style:italic;font-weight:500;}
.db-about-passion{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px;}
.db-about-passion span{padding:7px 14px;border:1.5px solid var(--ink);border-radius:999px;
  font-family:var(--mono-font);font-size:12.5px;font-weight:600;color:var(--ink);background:var(--surface);
  transition:all .15s;}
.db-about-passion span:hover{background:var(--ink);color:#fff;transform:translateY(-2px);}

.db-about-right{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.db-stat-card{padding:24px;background:var(--surface);border:1.5px solid var(--line);border-radius:18px;
  transition:all .25s;display:flex;flex-direction:column;justify-content:space-between;min-height:160px;}
.db-stat-card:hover{border-color:var(--ink);transform:translateY(-3px);}
.db-stat-card.feat{background:var(--ink);color:#fff;border-color:var(--ink);}
.db-stat-card.feat .db-stat-label{color:rgba(255,255,255,.6);}
.db-stat-card.feat .db-stat-num{color:#fff;}
.db-stat-card.accent{background:var(--accent3);border-color:var(--ink);}
.db-stat-label{font-family:var(--mono-font);font-size:11px;color:var(--ink3);text-transform:uppercase;letter-spacing:.15em;font-weight:600;}
.db-stat-num{font-family:var(--display-font);font-size:64px;font-weight:500;letter-spacing:-.04em;line-height:.9;color:var(--ink);margin-top:8px;}
.db-stat-sub{font-size:13px;color:var(--ink2);margin-top:10px;line-height:1.4;}
.db-stat-card.feat .db-stat-sub{color:rgba(255,255,255,.7);}

/* ── Education ── */
.db-edu-grid{display:flex;flex-direction:column;gap:18px;}
.db-edu-card{display:grid;grid-template-columns:140px 1fr auto;gap:32px;padding:28px 32px;background:var(--surface);
  border:1.5px solid var(--line);border-radius:18px;transition:all .25s;align-items:center;}
.db-edu-card:hover{border-color:var(--ink);transform:translateX(4px);}
.db-edu-period{font-family:var(--mono-font);font-size:12px;font-weight:700;color:var(--ink);text-transform:uppercase;letter-spacing:.12em;line-height:1.4;}
.db-edu-period .end{display:block;color:var(--ink3);font-weight:500;}
.db-edu-info .school{font-family:var(--display-font);font-size:28px;font-weight:500;color:var(--ink);letter-spacing:-.015em;line-height:1.1;margin-bottom:4px;}
.db-edu-info .degree{font-size:14px;color:var(--ink2);font-weight:500;}
.db-edu-info .detail{font-size:13.5px;color:var(--ink3);margin-top:8px;line-height:1.55;}
.db-edu-grade{text-align:right;}
.db-edu-grade .label{font-family:var(--mono-font);font-size:10px;color:var(--ink3);text-transform:uppercase;letter-spacing:.15em;font-weight:600;}
.db-edu-grade .value{font-family:var(--display-font);font-size:32px;font-weight:500;letter-spacing:-.02em;line-height:1;color:var(--accent);margin-top:4px;}

/* ── Internships ── */
.db-int-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;}
.db-int-card{padding:28px;background:var(--surface);border:1.5px solid var(--line);border-radius:18px;
  transition:all .25s;position:relative;}
.db-int-card:hover{border-color:var(--ink);transform:translateY(-3px);box-shadow:0 18px 36px -16px rgba(15,15,20,.18);}
.db-int-card .period{font-family:var(--mono-font);font-size:11px;color:var(--ink3);text-transform:uppercase;letter-spacing:.15em;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
.db-int-card .period.current::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--accent4);box-shadow:0 0 8px var(--accent4);animation:db-pulse 1.6s infinite;}
.db-int-card .role{font-family:var(--display-font);font-size:22px;font-weight:500;color:var(--ink);letter-spacing:-.015em;margin-bottom:4px;}
.db-int-card .co{font-size:14px;color:var(--accent);font-weight:600;margin-bottom:12px;}
.db-int-card .desc{font-size:14px;color:var(--ink2);line-height:1.6;margin-bottom:16px;}
.db-int-card .tags{display:flex;flex-wrap:wrap;gap:6px;}
.db-int-card .tags span{padding:4px 10px;background:var(--bg);border:1px solid var(--line);border-radius:6px;font-family:var(--mono-font);font-size:11px;color:var(--ink2);}

/* ── Projects ── */
.db-proj-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;}
.db-proj{background:var(--surface);border:1.5px solid var(--line);border-radius:24px;overflow:hidden;transition:all .3s cubic-bezier(.2,.85,.3,1);
  display:flex;flex-direction:column;position:relative;}
.db-proj:hover{border-color:var(--ink);transform:translateY(-5px);box-shadow:0 26px 50px -16px rgba(15,15,20,.2);}
.db-proj-img{aspect-ratio:5/3;background:linear-gradient(135deg,var(--accent),var(--accent2));display:grid;place-items:center;overflow:hidden;position:relative;}
.db-proj-img img{width:100%;height:100%;object-fit:cover;}
.db-proj-emoji{font-size:64px;filter:drop-shadow(0 6px 16px rgba(0,0,0,.25));}
.db-proj:nth-child(3n+1) .db-proj-img{background:linear-gradient(135deg,var(--accent),var(--accent3));}
.db-proj:nth-child(3n+2) .db-proj-img{background:linear-gradient(135deg,var(--accent2),var(--accent4));}
.db-proj:nth-child(3n+3) .db-proj-img{background:linear-gradient(135deg,var(--accent5),var(--accent));}
.db-proj-pill{position:absolute;top:16px;left:16px;padding:5px 11px;background:rgba(255,255,255,.95);backdrop-filter:blur(8px);
  border-radius:999px;font-family:var(--mono-font);font-size:11px;font-weight:700;color:var(--ink);letter-spacing:.1em;text-transform:uppercase;}
.db-proj-body{padding:24px;display:flex;flex-direction:column;gap:10px;flex:1;}
.db-proj-title{font-family:var(--display-font);font-size:24px;font-weight:500;color:var(--ink);letter-spacing:-.015em;line-height:1.15;}
.db-proj-desc{font-size:14px;color:var(--ink2);line-height:1.6;}
.db-proj-meta{display:flex;justify-content:space-between;align-items:center;padding-top:14px;margin-top:auto;border-top:1px solid var(--line);font-family:var(--mono-font);font-size:11.5px;color:var(--ink3);letter-spacing:.08em;text-transform:uppercase;}
.db-proj-meta b{color:var(--ink);font-weight:700;}
.db a.db-proj-link,a.db-proj-link{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono-font);font-size:12px;font-weight:700;color:var(--accent) !important;text-decoration:none;letter-spacing:.08em;text-transform:uppercase;}
.db-proj-link.disabled{opacity:.3;pointer-events:none;}
.db-proj-tags{display:flex;flex-wrap:wrap;gap:5px;}
.db-proj-tags span{padding:3px 9px;background:var(--bg);border:1px solid var(--line);border-radius:6px;font-family:var(--mono-font);font-size:11px;color:var(--ink2);font-weight:500;}

/* ── Skills ── */
.db-skills-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.db-skill-cat{padding:24px;background:var(--surface);border:1.5px solid var(--line);border-radius:18px;}
.db-skill-cat-head{font-family:var(--mono-font);font-size:11px;color:var(--ink3);text-transform:uppercase;letter-spacing:.18em;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.db-skill-cat-head::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--accent);}
.db-skill-cat:nth-child(2) .db-skill-cat-head::before{background:var(--accent2);}
.db-skill-cat:nth-child(3) .db-skill-cat-head::before{background:var(--accent3);}
.db-skill-cat:nth-child(4) .db-skill-cat-head::before{background:var(--accent4);}
.db-skill-list{display:flex;flex-direction:column;gap:7px;}
.db-skill-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px dashed var(--line);}
.db-skill-row:last-child{border-bottom:none;}
.db-skill-name{font-size:14px;font-weight:500;color:var(--ink);}
.db-skill-dots{display:flex;gap:4px;}
.db-skill-dot{width:8px;height:8px;border-radius:50%;background:var(--line2);}
.db-skill-dot.on{background:var(--ink);}
.db-skill-cat:nth-child(1) .db-skill-dot.on{background:var(--accent);}
.db-skill-cat:nth-child(2) .db-skill-dot.on{background:var(--accent2);}
.db-skill-cat:nth-child(3) .db-skill-dot.on{background:var(--accent3);}
.db-skill-cat:nth-child(4) .db-skill-dot.on{background:var(--accent4);}

/* ── Currently Learning ── */
.db-learning{background:var(--ink);color:#fff;border-radius:24px;padding:40px 44px;display:grid;grid-template-columns:auto 1fr auto;gap:32px;align-items:center;}
.db-learning-icon{width:64px;height:64px;border-radius:50%;background:var(--accent3);color:var(--ink);
  display:grid;place-items:center;font-size:32px;flex-shrink:0;animation:db-jitter 3s ease-in-out infinite;}
.db-learning-main .label{font-family:var(--mono-font);font-size:11.5px;color:var(--accent4);text-transform:uppercase;letter-spacing:.18em;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:8px;}
.db-learning-main .label .live{width:7px;height:7px;border-radius:50%;background:var(--accent4);box-shadow:0 0 10px var(--accent4);animation:db-pulse 1.6s infinite;}
.db-learning-main h3{font-family:var(--display-font);font-size:32px;font-weight:500;letter-spacing:-.02em;line-height:1.1;margin-bottom:6px;}
.db-learning-main p{font-size:14.5px;color:rgba(255,255,255,.68);line-height:1.5;max-width:50ch;}
.db-learning-items{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;max-width:280px;}
.db-learning-item{padding:7px 13px;border:1.5px solid rgba(255,255,255,.18);border-radius:999px;font-family:var(--mono-font);font-size:12px;color:#fff;font-weight:600;background:rgba(255,255,255,.04);}

/* ── Looking For (wishlist) ── */
.db-wishlist{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;}
.db-wishlist-card{padding:36px;background:var(--accent3);color:var(--ink);border-radius:24px;border:1.5px solid var(--ink);position:relative;overflow:hidden;}
.db-wishlist-card.alt{background:var(--surface);border-color:var(--line);}
.db-wishlist-card .eyebrow{font-family:var(--mono-font);font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;margin-bottom:12px;display:inline-flex;align-items:center;gap:8px;}
.db-wishlist-card h3{font-family:var(--display-font);font-size:32px;font-weight:500;letter-spacing:-.02em;line-height:1.15;margin-bottom:14px;color:var(--ink);}
.db-wishlist-card h3 em{font-style:italic;color:var(--accent);}
.db-wishlist-card p{font-size:15.5px;color:var(--ink2);line-height:1.6;margin-bottom:20px;}
.db-wishlist-list{display:flex;flex-wrap:wrap;gap:8px;}
.db-wishlist-list span{padding:7px 14px;background:var(--ink);color:#fff;border-radius:999px;font-size:13px;font-weight:600;}
.db-wishlist-card.alt .db-wishlist-list span{background:var(--bg);color:var(--ink);border:1.5px solid var(--ink);}

/* ── Testimonials ── */
.db-test-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;}
.db-test{padding:32px;background:var(--surface);border:1.5px solid var(--line);border-radius:24px;transition:all .25s;position:relative;}
.db-test:hover{border-color:var(--accent);transform:translateY(-3px);}
.db-test-mark{font-family:var(--display-font);font-size:68px;line-height:.5;color:var(--accent);font-style:italic;margin-bottom:10px;}
.db-test-quote{font-family:var(--display-font);font-size:20px;font-weight:400;line-height:1.5;color:var(--ink);margin-bottom:24px;letter-spacing:-.005em;}
.db-test-author{display:flex;align-items:center;gap:14px;padding-top:18px;border-top:1px dashed var(--line);}
.db-test-avi{width:48px;height:48px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;
  font-family:var(--display-font);font-size:20px;font-weight:600;flex-shrink:0;}
.db-test-meta b{font-size:15px;font-weight:600;color:var(--ink);display:block;line-height:1.2;}
.db-test-meta span{font-family:var(--mono-font);font-size:11.5px;color:var(--ink3);}

/* ── Contact ── */
.db-contact{background:var(--ink);color:#fff;border-radius:32px;padding:64px 56px;position:relative;overflow:hidden;}
.db-contact::before{content:'';position:absolute;top:-100px;right:-100px;width:380px;height:380px;border-radius:50%;
  background:radial-gradient(circle,rgba(255,79,94,.4),transparent 65%);filter:blur(20px);}
.db-contact::after{content:'';position:absolute;bottom:-100px;left:-100px;width:380px;height:380px;border-radius:50%;
  background:radial-gradient(circle,rgba(63,88,255,.35),transparent 65%);filter:blur(20px);}
.db-contact-inner{position:relative;z-index:1;display:grid;grid-template-columns:1.4fr 1fr;gap:48px;align-items:end;}
.db-contact-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;
  background:var(--accent3);color:var(--ink);font-family:var(--mono-font);font-size:11.5px;font-weight:700;
  text-transform:uppercase;letter-spacing:.15em;margin-bottom:24px;}
.db-contact-title{font-family:var(--display-font);font-size:clamp(40px,5.5vw,72px);font-weight:500;
  letter-spacing:-.03em;line-height:1.05;margin-bottom:18px;color:#fff;}
.db-contact-title em{font-style:italic;color:var(--accent3);}
.db-contact-sub{font-size:17px;color:rgba(255,255,255,.7);max-width:50ch;line-height:1.6;}
.db-contact-channels{display:flex;flex-direction:column;gap:10px;}
.db a.db-contact-link,a.db-contact-link{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 22px;
  background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.14);border-radius:14px;
  color:#fff !important;font-size:14.5px;font-weight:600;transition:all .2s;text-decoration:none;}
.db a.db-contact-link.primary{background:var(--accent3);color:var(--ink) !important;border-color:var(--accent3);}
.db a.db-contact-link:hover{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.28);transform:translateY(-2px);}
.db a.db-contact-link.primary:hover{background:#fff;}
.db-contact-link .left{display:flex;align-items:center;gap:11px;font-family:var(--mono-font);font-size:12px;text-transform:uppercase;letter-spacing:.12em;font-weight:700;color:rgba(255,255,255,.75);}
.db-contact-link.primary .left{color:rgba(15,15,20,.65);}
.db-contact-link .right{font-family:var(--sans-font);font-weight:600;font-size:14.5px;color:#fff;
  min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.db-contact-link.primary .right{color:var(--ink);}

/* ── Footer ── */
.db-footer{padding:32px 0;border-top:1.5px solid var(--line);margin-top:48px;}
.db-footer-inner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;
  font-family:var(--mono-font);font-size:11.5px;color:var(--ink3);letter-spacing:.05em;}
.db-footer-mark{padding:3px 10px;background:var(--ink);color:#fff;border-radius:6px;font-weight:700;}

/* ── Responsive ── */
@media(max-width:1100px){
  .db-hero-grid{grid-template-columns:1fr;gap:36px;}
  .db-hero-right{min-height:380px;}
  .db-about{grid-template-columns:1fr;gap:32px;}
  .db-skills-grid{grid-template-columns:repeat(2,1fr);}
  .db-int-grid{grid-template-columns:1fr;}
  .db-proj-grid{grid-template-columns:1fr;}
  .db-test-grid{grid-template-columns:1fr;}
  .db-wishlist{grid-template-columns:1fr;}
  .db-learning{grid-template-columns:auto 1fr;gap:24px;padding:32px;}
  .db-learning-items{grid-column:1 / -1;justify-content:flex-start;max-width:none;}
  .db-contact-inner{grid-template-columns:1fr;}
}
@media(max-width:768px){
  .db-nav-links{display:none;}
  .db a.db-nav-cta{display:none;}
  .db-ham{display:flex !important;}
  .db-hero{padding:32px 0 56px;}
  .db-sect{padding:64px 0;}
  .db-sect-head{grid-template-columns:1fr;gap:14px;}
  .db-sect-meta{text-align:left;}
  .db-edu-card{grid-template-columns:1fr;gap:14px;}
  .db-edu-grade{text-align:left;}
  .db-skills-grid{grid-template-columns:1fr;}
  .db-stat-num{font-size:48px;}
  .db-contact{padding:40px 28px;border-radius:24px;}
  .db-container{padding:0 20px;}
  .db-status-marquee{font-size:11px;gap:24px;}
  .db-status-marquee span{gap:8px;}
}
@media(max-width:480px){
  .db-about-right{grid-template-columns:1fr;}
  .db-hero-actions{flex-direction:column;align-items:stretch;}
  .db a.db-btn{width:100%;justify-content:center;}
}
`;

export default function DebutTemplate({ content: c, hideBranding }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.db-reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  function scrollTo(e: React.MouseEvent, href: string) {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  }

  // theme overrides
  const themeOverride = [
    c.colorBg && `--bg:${c.colorBg};`,
    c.colorSurface && `--surface:${c.colorSurface};`,
    c.colorText && `--ink:${c.colorText};`,
    c.colorAccent && `--accent:${c.colorAccent};`,
    c.colorAccent2 && `--accent2:${c.colorAccent2};`,
    c.colorAccent3 && `--accent3:${c.colorAccent3};`,
    c.colorAccent4 && `--accent4:${c.colorAccent4};`,
    c.colorAccent5 && `--accent5:${c.colorAccent5};`,
  ].filter(Boolean).join('');

  // Content
  const name = c.name || 'Riya Kapoor';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const role = c.title || c.role || 'Visual Designer';
  const tagline = c.heroTagline || '';
  const taglineLines = tagline.split('\n');
  const bio = c.bio || "I'm a recent grad obsessed with **brand identity** and **editorial design**. Currently looking for my first full-time role.";
  const photoUrl = c.photoUrl || '';
  const availability = c.availability || 'Available · graduating June 2026';
  const location = c.location || '';

  const passions = pl(c.passions);
  const stats = [1,2,3,4].map(i => ({
    num: c[`stat${i}Num`],
    label: c[`stat${i}Label`],
    sub: c[`stat${i}Sub`],
  })).filter(s => s.num);

  const education = parseJ<{ period: string; school: string; degree: string; detail: string; grade: string }[]>(c.educationJson, []);
  const internships = parseJ<{ period: string; isCurrent: boolean; role: string; company: string; description: string; tags: string }[]>(c.internshipsJson, [])
    .map(i => ({ ...i, tags: pl(i.tags) }));
  const projects = parseJ<{ title: string; year: string; category: string; image: string; desc: string; stack: string; impact: string; liveUrl: string }[]>(c.projJson, [])
    .map(p => ({ ...p, stack: pl(p.stack) }));

  interface SkillItem { name: string; level: number; }
  const skillCategories = parseJ<{ title: string; items: SkillItem[] }[]>(c.skillCategoriesJson, [])
    .map(cat => ({ ...cat, items: Array.isArray(cat.items) ? cat.items : [] }));

  const learning = pl(c.currentlyLearning);
  const learningTitle = c.learningTitle || 'Currently learning';
  const learningSub = c.learningSub || "I'm always picking up new tools and skills. Right now I'm focused on these.";

  const dreamRoles = pl(c.dreamRoles);
  const dreamCompanies = pl(c.dreamCompanies);

  const testimonials = parseJ<{ quote: string; initials: string; name: string; role: string }[]>(c.testJson, []);

  const navLinks = [
    { label: c.navAboutLabel || 'About', href: '#about' },
    { label: c.navEduLabel || 'Education', href: '#education' },
    { label: c.navWorkLabel || 'Work', href: '#work' },
    { label: c.navSkillsLabel || 'Skills', href: '#skills' },
    ...(internships.length > 0 ? [{ label: c.navInternsLabel || 'Internships', href: '#internships' }] : []),
    ...(testimonials.length > 0 ? [{ label: c.navWordsLabel || 'Words', href: '#words' }] : []),
    { label: c.navContactLabel || 'Hire me', href: '#contact' },
  ];

  const statusItems = pl(c.statusBarItems).length > 0 ? pl(c.statusBarItems) : ['Open to work · class of 2026', 'Looking for first role', 'Junior visual designer', 'Available for internships'];

  return (
    <div className="db">
      <style suppressHydrationWarning>{CSS}</style>
      {themeOverride && <style suppressHydrationWarning>{`.db{${themeOverride}}`}</style>}

      {/* ── Status bar ── */}
      <div className="db-status-bar">
        <div className="db-status-marquee">
          {[...Array(2)].flatMap((_, k) =>
            statusItems.map((it, i) => (
              <span key={`${k}-${i}`}><span className="dot"/>{it} <em className="sep">✦</em></span>
            ))
          )}
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className={`db-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="db-nav-inner">
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="db-logo">
            <span className="db-logo-mark">{initials.charAt(0)}</span>
            <span className="db-logo-text">{name.split(' ')[0]} <span>· portfolio</span></span>
          </a>
          <ul className="db-nav-links">
            {navLinks.map(l => (
              <li key={l.href}>
                <span className="db-nav-link" onClick={e => scrollTo(e as unknown as React.MouseEvent, l.href)}>{l.label}</span>
              </li>
            ))}
          </ul>
          <a href="#contact" onClick={e => scrollTo(e, '#contact')} className="db-nav-cta">
            {c.navCtaLabel || 'Get in touch'} <ArrowIcon/>
          </a>
          <button className="db-ham" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              {menuOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}
            </svg>
          </button>
        </div>
        <div className={`db-mobile-menu${menuOpen ? ' open' : ''}`}>
          {navLinks.map(l => (
            <span key={l.href} className="db-mobile-link" onClick={e => scrollTo(e as unknown as React.MouseEvent, l.href)}>{l.label}</span>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="db-hero">
        <div className="db-container">
          <div className="db-hero-grid">
            <div className="db-hero-left db-reveal">
              <div className="db-hero-eyebrow">
                <span className="dot"/>
                {availability}
              </div>

              <div>
                <h1 className="db-hero-h1">
                  {taglineLines[0] || (
                    <>Hi <span className="db-hero-wave">👋</span> I&apos;m {name.split(' ')[0]}.</>
                  )}<br/>
                  <span className="em">{taglineLines[1] || `A ${role.toLowerCase()}`}</span>{' '}
                  <span className="underline">{taglineLines[2] || 'in the making.'}</span>
                </h1>

                <p className="db-hero-bio" dangerouslySetInnerHTML={{ __html: bio.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>

                <div className="db-hero-actions">
                  <a href="#work" onClick={e => scrollTo(e, '#work')} className="db-btn db-btn-primary">
                    {c.heroCtaPrimary || 'See my work'} <ArrowIcon/>
                  </a>
                  {c.resumeUrl && (
                    <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer" className="db-btn db-btn-ghost">
                      {c.heroCtaSecondary || 'Download resume'}
                    </a>
                  )}
                </div>
              </div>

              <div className="db-hero-quick">
                {location && (
                  <div>
                    {c.heroQuickLocationLabel || 'Based in'}
                    <b>{location}</b>
                  </div>
                )}
                {c.heroQuickFocus && (
                  <div>
                    {c.heroQuickFocusLabel || 'Focused on'}
                    <b>{c.heroQuickFocus}</b>
                  </div>
                )}
                {c.heroQuickStatus && (
                  <div>
                    {c.heroQuickStatusLabel || 'Status'}
                    <b>{c.heroQuickStatus}</b>
                  </div>
                )}
              </div>
            </div>

            <div className="db-hero-right db-reveal" style={{ animationDelay: '.12s' }}>
              <div className="db-photo-main">
                {photoUrl ? <img src={photoUrl} alt={name}/> : <div className="db-photo-init">{initials.charAt(0)}</div>}
                <div className="db-photo-badge">
                  <span className="dot"/>
                  {c.photoBadge || 'Open to work'}
                </div>
              </div>
              {(c.photoCard1Label || c.photoCard1Value) && (
                <div className="db-photo-card c1">
                  <span className="label">{c.photoCard1Label || 'Class of'}</span>
                  <span className="value">{c.photoCard1Value || '2026'}</span>
                </div>
              )}
              {(c.photoCard2Label || c.photoCard2Value) && (
                <div className="db-photo-card c2">
                  <span className="label">{c.photoCard2Label || 'Currently'}</span>
                  <span className="value">{c.photoCard2Value || 'Final year'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="db-sect" id="about">
        <div className="db-container">
          <div className="db-sect-head db-reveal">
            <div className="db-sect-num">{c.aboutSectionLabel || '01 / About me'}</div>
            <h2 className="db-sect-title">{c.aboutHeading || 'A little'} <em>{c.aboutHeadingEm || 'about me.'}</em></h2>
            <div className="db-sect-meta">{c.aboutMeta || 'who · what · why'}</div>
          </div>

          <div className="db-about">
            <div className="db-reveal">
              <p className="db-about-text" dangerouslySetInnerHTML={{ __html: (c.aboutPara1 || "I'm a recent graduate from design school, **passionate** about visual storytelling, brand systems, and the small joys of typography. I'm looking for my first full-time role.").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>
              {c.aboutPara2 && <p className="db-about-text" style={{ fontSize: 18, color: 'var(--ink2)' }} dangerouslySetInnerHTML={{ __html: c.aboutPara2.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>}
              {passions.length > 0 && (
                <>
                  <div style={{ fontFamily: 'var(--mono-font)', fontSize: 11, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.15em', fontWeight: 700, marginTop: 28, marginBottom: 14 }}>
                    {c.passionsLabel || 'Things that light me up'}
                  </div>
                  <div className="db-about-passion">
                    {passions.slice(0, 8).map((p, i) => <span key={i}>{p}</span>)}
                  </div>
                </>
              )}
            </div>

            <div className="db-about-right db-reveal" style={{ animationDelay: '.1s' }}>
              {(stats.length > 0 ? stats : [
                { num: '12', label: 'Projects', sub: 'Shipped' },
                { num: '3', label: 'Internships', sub: 'completed' },
                { num: '2026', label: 'Class of', sub: '' },
                { num: '8.7', label: 'GPA', sub: '' },
              ]).slice(0, 4).map((s, i) => (
                <div key={i} className={`db-stat-card${i === 0 ? ' feat' : i === 1 ? ' accent' : ''}`}>
                  <div className="db-stat-label">{s.label}</div>
                  <div>
                    <div className="db-stat-num">{s.num}</div>
                    {s.sub && <div className="db-stat-sub">{s.sub}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      {education.length > 0 && (
        <section className="db-sect" id="education">
          <div className="db-container">
            <div className="db-sect-head db-reveal">
              <div className="db-sect-num">{c.eduSectionLabel || '02 / Education'}</div>
              <h2 className="db-sect-title">{c.eduHeading || 'Where I'} <em>{c.eduHeadingEm || 'studied.'}</em></h2>
              <div className="db-sect-meta">{c.eduMeta || `${education.length} institution${education.length > 1 ? 's' : ''}`}</div>
            </div>

            <div className="db-edu-grid">
              {education.map((ed, i) => (
                <div key={i} className="db-edu-card db-reveal" style={{ animationDelay: `${i * .08}s` }}>
                  <div className="db-edu-period">
                    {ed.period}
                  </div>
                  <div className="db-edu-info">
                    <div className="school">{ed.school}</div>
                    <div className="degree">{ed.degree}</div>
                    {ed.detail && <div className="detail">{ed.detail}</div>}
                  </div>
                  {ed.grade && (
                    <div className="db-edu-grade">
                      <div className="label">{c.eduGradeLabel || 'Grade'}</div>
                      <div className="value">{ed.grade}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Internships ── */}
      {internships.length > 0 && (
        <section className="db-sect" id="internships">
          <div className="db-container">
            <div className="db-sect-head db-reveal">
              <div className="db-sect-num">{c.internsSectionLabel || '03 / Internships'}</div>
              <h2 className="db-sect-title">{c.internsHeading || 'Real-world'} <em>{c.internsHeadingEm || 'experience.'}</em></h2>
              <div className="db-sect-meta">{c.internsMeta || `${internships.length} role${internships.length > 1 ? 's' : ''}`}</div>
            </div>

            <div className="db-int-grid">
              {internships.map((it, i) => (
                <div key={i} className="db-int-card db-reveal" style={{ animationDelay: `${i * .06}s` }}>
                  <div className={`period${it.isCurrent ? ' current' : ''}`}>{it.period}</div>
                  <div className="role">{it.role}</div>
                  <div className="co">@ {it.company}</div>
                  {it.description && <div className="desc">{it.description}</div>}
                  {it.tags.length > 0 && (
                    <div className="tags">
                      {it.tags.map((t, j) => <span key={j}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Work ── */}
      <section className="db-sect" id="work">
        <div className="db-container">
          <div className="db-sect-head db-reveal">
            <div className="db-sect-num">{c.workSectionLabel || '04 / Selected work'}</div>
            <h2 className="db-sect-title">{c.workHeading || 'Things I'}<em>{c.workHeadingEm || 've made.'}</em></h2>
            <div className="db-sect-meta">{c.workMeta || 'click any tile'}</div>
          </div>

          {projects.length === 0 ? (
            <div style={{ padding: 56, textAlign: 'center', border: '1.5px dashed var(--line2)', borderRadius: 20, color: 'var(--ink3)', fontFamily: 'var(--display-font)', fontSize: 20 }}>
              {c.workEmptyText || 'No projects yet — add your work from the dashboard ✦'}
            </div>
          ) : (
            <div className="db-proj-grid">
              {projects.slice(0, 6).map((p, i) => (
                <article key={i} className="db-proj db-reveal" style={{ animationDelay: `${i * .07}s` }}>
                  <div className="db-proj-img">
                    {p.image ? <img src={p.image} alt={p.title}/> : <span className="db-proj-emoji">{['🎨','📐','✨','💎','📦','🌸'][i % 6]}</span>}
                    {p.category && <span className="db-proj-pill">{p.category}</span>}
                  </div>
                  <div className="db-proj-body">
                    <h3 className="db-proj-title">{p.title}</h3>
                    {p.desc && <p className="db-proj-desc">{p.desc}</p>}
                    {p.stack.length > 0 && (
                      <div className="db-proj-tags">
                        {p.stack.map((s, j) => <span key={j}>{s}</span>)}
                      </div>
                    )}
                    <div className="db-proj-meta">
                      <span>{p.year} {p.impact && <>· <b>{p.impact}</b></>}</span>
                      {p.liveUrl ? (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="db-proj-link">
                          {c.workLinkLabel || 'View case'} <ExtIcon/>
                        </a>
                      ) : (
                        <span className="db-proj-link disabled">{c.workLinkLabelEmpty || 'Case study'} <ExtIcon/></span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Skills ── */}
      {skillCategories.length > 0 && (
        <section className="db-sect" id="skills">
          <div className="db-container">
            <div className="db-sect-head db-reveal">
              <div className="db-sect-num">{c.skillsSectionLabel || '05 / Skills'}</div>
              <h2 className="db-sect-title">{c.skillsHeading || 'My'} <em>{c.skillsHeadingEm || 'toolbox.'}</em></h2>
              <div className="db-sect-meta">{c.skillsMeta || `${skillCategories.length} categor${skillCategories.length > 1 ? 'ies' : 'y'} · dots = level`}</div>
            </div>

            <div className="db-skills-grid">
              {skillCategories.map((cat, i) => (
                <div key={i} className="db-skill-cat db-reveal" style={{ animationDelay: `${i * .06}s` }}>
                  <div className="db-skill-cat-head">{cat.title}</div>
                  <div className="db-skill-list">
                    {cat.items.map((item, j) => (
                      <div key={j} className="db-skill-row">
                        <span className="db-skill-name">{item.name}</span>
                        <div className="db-skill-dots">
                          {[1,2,3,4,5].map(n => (
                            <span key={n} className={`db-skill-dot${n <= (item.level || 0) ? ' on' : ''}`}/>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Currently Learning ── */}
      {learning.length > 0 && (
        <section className="db-sect" style={{ paddingTop: 24 }}>
          <div className="db-container">
            <div className="db-learning db-reveal">
              <div className="db-learning-icon">📚</div>
              <div className="db-learning-main">
                <div className="label"><span className="live"/>{c.learningEyebrow || 'Currently exploring'}</div>
                <h3>{learningTitle}</h3>
                <p>{learningSub}</p>
              </div>
              <div className="db-learning-items">
                {learning.slice(0, 6).map((l, i) => <span key={i} className="db-learning-item">{l}</span>)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Looking For (wishlist) ── */}
      {(dreamRoles.length > 0 || dreamCompanies.length > 0) && (
        <section className="db-sect" id="wishlist">
          <div className="db-container">
            <div className="db-sect-head db-reveal">
              <div className="db-sect-num">{c.wishlistSectionLabel || '06 / Looking for'}</div>
              <h2 className="db-sect-title">{c.wishlistHeading || 'My'} <em>{c.wishlistHeadingEm || 'wishlist.'}</em></h2>
              <div className="db-sect-meta">{c.wishlistMeta || 'big dreams, real list'}</div>
            </div>

            <div className="db-wishlist">
              {dreamRoles.length > 0 && (
                <div className="db-wishlist-card db-reveal">
                  <div className="eyebrow"><StarIcon/> {c.dreamRolesLabel || 'Roles I want'}</div>
                  <h3 dangerouslySetInnerHTML={{ __html: (c.dreamRolesHeading || "Looking for my first <em>full-time</em> design role.").replace(/<em>/g, '<em>').replace(/<\/em>/g, '</em>') }}/>
                  <p>{c.dreamRolesSub || "I'm open to junior or associate roles. Open to relocation, hybrid, or remote — whichever fits the team best."}</p>
                  <div className="db-wishlist-list">
                    {dreamRoles.map((r, i) => <span key={i}>{r}</span>)}
                  </div>
                </div>
              )}
              {dreamCompanies.length > 0 && (
                <div className="db-wishlist-card alt db-reveal" style={{ animationDelay: '.08s' }}>
                  <div className="eyebrow"><SparkIcon/> {c.dreamCompaniesLabel || 'Studios I admire'}</div>
                  <h3 dangerouslySetInnerHTML={{ __html: (c.dreamCompaniesHeading || "Dream teams I'd <em>love</em> to work with.").replace(/<em>/g, '<em>').replace(/<\/em>/g, '</em>') }}/>
                  <p>{c.dreamCompaniesSub || "A short list of studios doing work I genuinely admire. If you're hiring — I'd love to chat."}</p>
                  <div className="db-wishlist-list">
                    {dreamCompanies.map((co, i) => <span key={i}>{co}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <section className="db-sect" id="words">
          <div className="db-container">
            <div className="db-sect-head db-reveal">
              <div className="db-sect-num">{c.testSectionLabel || '07 / Kind words'}</div>
              <h2 className="db-sect-title">{c.testHeading || 'What'} <em>{c.testHeadingEm || 'people say.'}</em></h2>
              <div className="db-sect-meta">{c.testMeta || 'from mentors · classmates · clients'}</div>
            </div>

            <div className="db-test-grid">
              {testimonials.slice(0, 4).map((t, i) => (
                <div key={i} className="db-test db-reveal" style={{ animationDelay: `${i * .07}s` }}>
                  <div className="db-test-mark">&ldquo;</div>
                  <p className="db-test-quote">{t.quote}</p>
                  <div className="db-test-author">
                    <div className="db-test-avi">{t.initials || (t.name || 'XX').slice(0, 2).toUpperCase()}</div>
                    <div className="db-test-meta">
                      <b>{t.name}</b>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact ── */}
      <section className="db-sect" id="contact">
        <div className="db-container">
          <div className="db-contact db-reveal">
            <div className="db-contact-inner">
              <div>
                <div className="db-contact-eyebrow">
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ink)', boxShadow: '0 0 8px var(--ink)' }}/>
                  {c.contactEyebrow || "Let's chat"}
                </div>
                <h2 className="db-contact-title">{c.contactHeading || "Hire me, or"} <em>{c.contactHeadingEm || 'just say hi.'}</em></h2>
                <p className="db-contact-sub">{c.contactSub || "I'm looking for my first full-time role. If your team is hiring junior designers — or if you just want to chat about design — I'd love to hear from you."}</p>
              </div>
              <div className="db-contact-channels">
                {c.contactEmail && (
                  <a href={`mailto:${c.contactEmail}`} className="db-contact-link primary">
                    <span className="left"><MailIcon/> Email</span>
                    <span className="right">{c.contactEmail}</span>
                  </a>
                )}
                {c.linkedinUrl && (
                  <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="db-contact-link">
                    <span className="left"><LiIcon/> LinkedIn</span>
                    <span className="right">{c.linkedinHandle || 'View profile'}</span>
                  </a>
                )}
                {c.behanceUrl && (
                  <a href={c.behanceUrl} target="_blank" rel="noopener noreferrer" className="db-contact-link">
                    <span className="left"><BeIcon/> Behance</span>
                    <span className="right">{c.behanceHandle || 'View work'}</span>
                  </a>
                )}
                {c.dribbbleUrl && (
                  <a href={c.dribbbleUrl} target="_blank" rel="noopener noreferrer" className="db-contact-link">
                    <span className="left"><DribIcon/> Dribbble</span>
                    <span className="right">{c.dribbbleHandle || 'View shots'}</span>
                  </a>
                )}
                {c.instagramUrl && (
                  <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="db-contact-link">
                    <span className="left"><InstaIcon/> Instagram</span>
                    <span className="right">{c.instagramHandle || 'Follow'}</span>
                  </a>
                )}
                {c.twitterUrl && (
                  <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer" className="db-contact-link">
                    <span className="left"><TwIcon/> Twitter</span>
                    <span className="right">{c.twitterHandle || 'Follow'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="db-footer">
        <div className="db-container">
          <div className="db-footer-inner">
            <span>© {new Date().getFullYear()} · {name} · Portfolio</span>
            <span>
              {!hideBranding && <>Powered by <span className="db-footer-mark">FolioForge</span> · </>}{c.footerVersion || 'Debut v1.0'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
