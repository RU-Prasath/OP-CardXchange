'use client';
import { useState, useEffect, useRef } from 'react';

interface Props { content: Record<string, string>; username: string; hideBranding?: boolean; }

function pl(v?: string) { return v ? v.split(',').map(s => s.trim()).filter(Boolean) : []; }
function ls(v?: string) { return v ? v.split('\n').map(s => s.trim()).filter(Boolean) : []; }
function parseJ<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

// ── Icons ──
const InstaIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>;
const BeIcon = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M7.5 4.5H2v15h6c2.8 0 4.5-1.5 4.5-4 0-1.7-.9-3-2.4-3.5 1.1-.5 1.8-1.6 1.8-3 0-2.6-1.6-4.5-4.4-4.5zm-.3 6.2H4.5V7h2.7c1.2 0 1.9.7 1.9 1.8 0 1.2-.7 1.9-1.9 1.9zm.5 6.3H4.5v-4h3.2c1.5 0 2.3.7 2.3 2 0 1.3-.8 2-2.3 2zm14.3-2.5c0-2.5-1.4-4.5-4.3-4.5s-4.5 2-4.5 4.5 1.6 4.5 4.5 4.5c2.2 0 3.7-1 4.2-2.7h-2.2c-.3.6-.9 1-1.9 1-1.3 0-2-.8-2.1-2.1h6.3c.1-.2 0-.4 0-.7zm-6.2-1c.2-1.1.9-1.7 2-1.7s1.8.7 1.9 1.7H15.8zM14.5 6h5v1.5h-5V6z"/></svg>;
const DribIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72M5 8.5c5.45 1.85 11 1.55 16-.5M3 17.5c5 0 9-1 14-4"/></svg>;
const TwIcon = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LiIcon = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>;
const MailIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
const ArrowIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
const ExtIcon = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>;
const SparkIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/></svg>;
const PaletteIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1 0 1.5-.5 1.5-1.2 0-.3-.1-.7-.4-1-.3-.4-.4-.7-.4-1 0-.7.5-1.2 1.2-1.2H16c3.3 0 6-2.7 6-6 0-5-4.5-9-10-9z"/></svg>;

// ── CSS ──
const CSS = `
.pr{--c1:#FF6B6B;--c2:#FFD93D;--c3:#6BCB77;--c4:#4D96FF;--c5:#C780FA;--c6:#FF9F45;
  --bg:#0D0B1E;--bg2:#15122A;--bg3:#1d1936;--bdr:rgba(255,255,255,.08);--bdrs:rgba(255,255,255,.16);
  --tx:#F5F0FF;--tx2:#B8B0D1;--tx3:#6F6889;
  --display-font:'Fraunces','Playfair Display',Georgia,serif;
  --sans-font:'Inter','SF Pro Display',system-ui,sans-serif;
  --mono-font:'JetBrains Mono','Fira Code',ui-monospace,monospace;
  font-family:var(--sans-font);background:var(--bg);color:var(--tx);
  font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative;}
.pr *{box-sizing:border-box;margin:0;padding:0;}
.pr a{color:inherit;text-decoration:none;}
.pr button{font:inherit;cursor:pointer;border:none;background:none;color:inherit;}
.pr-mono{font-family:var(--mono-font);}
.pr-display{font-family:var(--display-font);}

@keyframes pr-float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-12px) rotate(2deg)}}
@keyframes pr-floatx{0%,100%{transform:translate(0,0)}50%{transform:translate(8px,-8px)}}
@keyframes pr-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes pr-shimmer{0%{background-position:0% 50%}100%{background-position:200% 50%}}
@keyframes pr-rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes pr-pulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.1);opacity:.8}}
@keyframes pr-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.pr-reveal{opacity:0;transform:translateY(28px);}
.pr-reveal.in{animation:pr-rise .65s cubic-bezier(.2,.85,.3,1) forwards;}

/* ── Background ── */
.pr-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.pr-blob{position:absolute;border-radius:50%;filter:blur(120px);opacity:.55;}
.pr-blob.b1{width:520px;height:520px;background:var(--c1);top:-200px;left:-150px;animation:pr-float 20s ease-in-out infinite;}
.pr-blob.b2{width:480px;height:480px;background:var(--c5);top:30%;right:-200px;animation:pr-floatx 24s ease-in-out infinite;}
.pr-blob.b3{width:420px;height:420px;background:var(--c4);bottom:-100px;left:30%;animation:pr-float 28s ease-in-out infinite reverse;}
.pr-grain{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.08;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/></svg>");}

.pr-wrap{position:relative;z-index:2;}

/* ── Nav ── */
.pr-nav{position:sticky;top:0;z-index:50;padding:18px 0;transition:all .3s;}
.pr-nav.scrolled{padding:10px 0;background:rgba(13,11,30,.7);backdrop-filter:blur(20px) saturate(180%);
  border-bottom:1px solid var(--bdr);}
.pr-nav-inner{display:flex;align-items:center;justify-content:space-between;
  max-width:1320px;margin:0 auto;padding:0 32px;gap:24px;}
.pr-logo{display:flex;align-items:center;gap:11px;font-weight:700;font-size:18px;letter-spacing:-.02em;}
.pr-logo-mark{width:38px;height:38px;border-radius:11px;
  background:linear-gradient(135deg,var(--c1),var(--c5),var(--c4));background-size:200% 200%;
  animation:pr-shimmer 4s linear infinite;color:#fff;
  display:grid;place-items:center;font-family:var(--mono-font);font-weight:800;font-size:14px;
  box-shadow:0 8px 20px -6px rgba(255,107,107,.45),inset 0 1px 0 rgba(255,255,255,.25);}
.pr-logo-name{font-family:var(--display-font);font-style:italic;font-weight:500;}
.pr-logo-name span{font-style:normal;font-weight:700;background:linear-gradient(90deg,var(--c1),var(--c5));-webkit-background-clip:text;background-clip:text;color:transparent;}
.pr-nav-links{display:flex;gap:4px;}
.pr-nav-link{padding:8px 14px;border-radius:8px;font-size:13.5px;font-weight:500;color:var(--tx2);
  transition:all .15s;cursor:pointer;}
.pr-nav-link:hover{color:var(--tx);background:rgba(255,255,255,.06);}
.pr-nav-cta{padding:9px 18px;border-radius:999px;font-size:13.5px;font-weight:600;
  background:linear-gradient(135deg,var(--c1),var(--c5));color:#fff;
  box-shadow:0 6px 16px -4px rgba(199,128,250,.4);transition:all .2s;
  display:inline-flex;align-items:center;gap:8px;}
.pr-nav-cta:hover{transform:translateY(-2px);box-shadow:0 10px 24px -4px rgba(199,128,250,.5);}
.pr-ham{display:none;width:42px;height:42px;border-radius:10px;border:1px solid var(--bdr);
  background:rgba(255,255,255,.04);align-items:center;justify-content:center;color:var(--tx);}
.pr-mobile-menu{display:none;position:fixed;inset:64px 0 0 0;background:rgba(13,11,30,.95);
  backdrop-filter:blur(20px);z-index:49;flex-direction:column;padding:24px;gap:6px;overflow-y:auto;}
.pr-mobile-menu.open{display:flex;}
.pr-mobile-link{padding:14px 16px;font-size:18px;font-weight:600;border-radius:10px;
  cursor:pointer;color:var(--tx);transition:background .15s;border:1px solid var(--bdr);}
.pr-mobile-link:hover{background:rgba(255,255,255,.06);}

/* ── Container ── */
.pr-container{max-width:1320px;margin:0 auto;padding:0 32px;}

/* ── Hero ── */
.pr-hero{padding:48px 0 80px;position:relative;}
.pr-hero-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;
  background:rgba(255,255,255,.06);border:1px solid var(--bdr);font-family:var(--mono-font);
  font-size:11.5px;color:var(--tx);letter-spacing:.1em;text-transform:uppercase;margin-bottom:32px;
  backdrop-filter:blur(10px);}
.pr-hero-eyebrow .dot{width:7px;height:7px;border-radius:50%;background:var(--c3);box-shadow:0 0 12px var(--c3);}

.pr-hero-h1{font-family:var(--display-font);font-size:clamp(54px,10vw,128px);font-weight:600;
  line-height:1.05;letter-spacing:-.04em;margin-bottom:32px;font-style:normal;
  padding:.12em 0;}
.pr-hero-h1 .it{font-style:italic;font-weight:500;background:linear-gradient(135deg,var(--c1),var(--c2),var(--c6));
  background-size:200% 200%;animation:pr-shimmer 6s linear infinite;
  -webkit-background-clip:text;background-clip:text;color:transparent;
  display:inline-block;padding:.06em .04em .12em;line-height:1.05;}
.pr-hero-h1 .out{-webkit-text-stroke:1.5px var(--c5);color:transparent;font-style:italic;}
.pr-hero-h1 .strike{position:relative;display:inline-block;}
.pr-hero-h1 .strike::after{content:'';position:absolute;left:-4px;right:-4px;top:50%;height:8px;
  background:linear-gradient(90deg,var(--c1),var(--c5));border-radius:4px;transform:rotate(-2deg);}

.pr-hero-sub{display:grid;grid-template-columns:1fr auto;gap:36px;align-items:end;margin-bottom:36px;}
.pr-hero-bio{font-family:var(--display-font);font-style:italic;font-size:clamp(20px,2.5vw,26px);
  color:var(--tx2);max-width:32ch;font-weight:400;line-height:1.45;}
.pr-hero-bio strong{font-style:normal;font-weight:600;color:var(--tx);background:linear-gradient(180deg,transparent 65%,rgba(199,128,250,.3) 65%);padding:0 4px;}
.pr-hero-meta{font-family:var(--mono-font);font-size:12px;color:var(--tx3);text-align:right;line-height:1.8;white-space:nowrap;}
.pr-hero-meta b{color:var(--c2);font-weight:500;}

.pr-hero-actions{display:flex;flex-wrap:wrap;gap:14px;align-items:center;}
.pr-btn{padding:13px 24px;border-radius:999px;font-size:14px;font-weight:600;
  display:inline-flex;align-items:center;gap:9px;transition:all .25s;cursor:pointer;border:1px solid transparent;}
.pr-btn-primary{background:linear-gradient(135deg,var(--c1),var(--c5));color:#fff;
  box-shadow:0 10px 25px -6px rgba(255,107,107,.45),inset 0 1px 0 rgba(255,255,255,.2);}
.pr-btn-primary:hover{transform:translateY(-3px) rotate(-1deg);box-shadow:0 14px 32px -8px rgba(255,107,107,.55);}
.pr-btn-ghost{background:rgba(255,255,255,.06);color:var(--tx);border:1px solid var(--bdr);backdrop-filter:blur(10px);}
.pr-btn-ghost:hover{background:rgba(255,255,255,.1);border-color:var(--bdrs);transform:translateY(-2px);}

/* ── Marquee strip ── */
.pr-marquee{margin:64px -32px;padding:18px 0;border-top:1px solid var(--bdr);border-bottom:1px solid var(--bdr);
  background:rgba(255,255,255,.02);overflow:hidden;position:relative;}
.pr-marquee-inner{display:flex;width:max-content;gap:38px;animation:pr-marquee 28s linear infinite;
  font-family:var(--display-font);font-style:italic;font-size:24px;font-weight:500;}
.pr-marquee-inner span{display:inline-flex;align-items:center;gap:38px;color:var(--tx);white-space:nowrap;}
.pr-marquee-inner span::after{content:'✦';color:var(--c2);font-size:18px;font-style:normal;}
.pr-marquee-inner em{font-style:italic;background:linear-gradient(135deg,var(--c1),var(--c5));-webkit-background-clip:text;background-clip:text;color:transparent;}

/* ── Bento grid (about section) ── */
.pr-bento{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:minmax(180px,auto);gap:16px;}
.pr-tile{background:rgba(255,255,255,.04);border:1px solid var(--bdr);border-radius:24px;padding:24px;
  position:relative;overflow:hidden;backdrop-filter:blur(10px);transition:all .3s;}
.pr-tile:hover{border-color:var(--bdrs);transform:translateY(-4px);box-shadow:0 16px 40px -12px rgba(0,0,0,.4);}
.pr-tile-eyebrow{font-family:var(--mono-font);font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:.12em;margin-bottom:10px;
  display:inline-flex;align-items:center;gap:6px;}

/* Photo tile */
.pr-tile-photo{grid-column:span 1;grid-row:span 2;padding:0;overflow:hidden;
  background:linear-gradient(135deg,var(--c1),var(--c5));position:relative;}
.pr-tile-photo img{width:100%;height:100%;object-fit:cover;display:block;}
.pr-tile-photo-init{width:100%;height:100%;display:grid;place-items:center;font-family:var(--display-font);
  font-style:italic;font-size:120px;font-weight:500;color:#fff;text-shadow:0 4px 30px rgba(0,0,0,.3);}
.pr-tile-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(13,11,30,.7));pointer-events:none;}
.pr-tile-photo-name{position:absolute;bottom:18px;left:18px;right:18px;z-index:2;color:#fff;}
.pr-tile-photo-name .role{font-family:var(--mono-font);font-size:11.5px;opacity:.85;text-transform:uppercase;letter-spacing:.1em;}
.pr-tile-photo-name .name{font-family:var(--display-font);font-style:italic;font-size:22px;font-weight:600;margin-top:2px;}

/* Big bio tile */
.pr-tile-bio{grid-column:span 2;grid-row:span 2;background:linear-gradient(135deg,rgba(255,107,107,.12),rgba(199,128,250,.08));border-color:rgba(255,107,107,.2);
  display:flex;flex-direction:column;justify-content:space-between;padding:32px;}
.pr-tile-bio-title{font-family:var(--display-font);font-size:36px;font-weight:500;line-height:1.15;margin-bottom:16px;letter-spacing:-.02em;}
.pr-tile-bio-title em{font-style:italic;color:var(--c2);}
.pr-tile-bio-text{font-size:15px;color:var(--tx2);line-height:1.7;max-width:50ch;}
.pr-tile-bio-text strong{color:var(--tx);font-weight:600;}
.pr-tile-bio-decoration{position:absolute;top:-20px;right:-20px;font-size:120px;opacity:.08;animation:pr-spin 30s linear infinite;}

/* Stats / metric tile */
.pr-tile-stat{display:flex;flex-direction:column;justify-content:space-between;}
.pr-tile-stat .num{font-family:var(--display-font);font-size:72px;font-weight:500;line-height:1;letter-spacing:-.04em;
  background:linear-gradient(135deg,var(--c2),var(--c6));-webkit-background-clip:text;background-clip:text;color:transparent;}
.pr-tile-stat .label{font-size:13px;color:var(--tx2);margin-top:6px;font-weight:500;}
.pr-tile-stat.c2 .num{background:linear-gradient(135deg,var(--c4),var(--c3));-webkit-background-clip:text;background-clip:text;color:transparent;}
.pr-tile-stat.c3 .num{background:linear-gradient(135deg,var(--c5),var(--c1));-webkit-background-clip:text;background-clip:text;color:transparent;}
.pr-tile-stat.c4 .num{background:linear-gradient(135deg,var(--c6),var(--c2));-webkit-background-clip:text;background-clip:text;color:transparent;}

/* Palette tile */
.pr-tile-palette{padding:20px;}
.pr-palette-swatches{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px;}
.pr-palette-swatch{aspect-ratio:1;border-radius:12px;position:relative;cursor:pointer;transition:transform .2s;
  box-shadow:0 6px 14px -4px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.18);}
.pr-palette-swatch:hover{transform:scale(1.08) rotate(-3deg);}
.pr-palette-swatch::after{content:attr(data-hex);position:absolute;bottom:6px;left:6px;right:6px;font-family:var(--mono-font);
  font-size:9px;color:rgba(255,255,255,.9);text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.5);}

/* Quote tile */
.pr-tile-quote{grid-column:span 2;padding:32px;display:flex;flex-direction:column;justify-content:center;
  background:linear-gradient(135deg,rgba(77,150,255,.1),rgba(107,203,119,.08));border-color:rgba(77,150,255,.18);}
.pr-tile-quote-mark{font-family:var(--display-font);font-size:80px;line-height:0.5;color:var(--c2);margin-bottom:14px;font-style:italic;}
.pr-tile-quote-text{font-family:var(--display-font);font-style:italic;font-size:24px;font-weight:500;line-height:1.35;color:var(--tx);margin-bottom:14px;}

/* Skills tile (services) */
.pr-tile-services{grid-column:span 2;padding:24px;}
.pr-services-list{display:flex;flex-direction:column;gap:0;margin-top:6px;}
.pr-service{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--bdr);
  font-family:var(--display-font);font-size:22px;font-weight:500;letter-spacing:-.01em;transition:all .15s;cursor:default;}
.pr-service:last-child{border-bottom:none;}
.pr-service:hover{padding-left:8px;color:var(--c2);}
.pr-service:hover .pr-service-num{color:var(--c1);}
.pr-service-num{font-family:var(--mono-font);font-size:12px;color:var(--tx3);font-weight:400;}

/* ── Section common ── */
.pr-sect{padding:80px 0;}
.pr-sect-head{display:grid;grid-template-columns:auto 1fr;gap:32px;align-items:end;margin-bottom:48px;}
.pr-sect-num{font-family:var(--mono-font);font-size:12px;color:var(--c1);font-weight:600;letter-spacing:.15em;
  text-transform:uppercase;writing-mode:vertical-rl;transform:rotate(180deg);align-self:start;padding-top:8px;}
.pr-sect-title{font-family:var(--display-font);font-size:clamp(42px,6vw,76px);font-weight:500;letter-spacing:-.03em;line-height:1.1;padding:.08em 0 .14em;}
.pr-sect-title em{font-style:italic;background:linear-gradient(135deg,var(--c1),var(--c5));-webkit-background-clip:text;background-clip:text;color:transparent;
  display:inline-block;padding:0 .04em .12em;line-height:1.1;}
.pr-sect-sub{font-size:16px;color:var(--tx2);max-width:50ch;margin-top:14px;line-height:1.6;}

/* ── Work / Projects ── */
.pr-work-grid{display:flex;flex-direction:column;gap:48px;}
.pr-work{display:grid;grid-template-columns:1fr 1.3fr;gap:48px;align-items:center;}
.pr-work:nth-child(even){grid-template-columns:1.3fr 1fr;}
.pr-work:nth-child(even) .pr-work-img-wrap{order:2;}
.pr-work:nth-child(even) .pr-work-info{order:1;}

.pr-work-img-wrap{position:relative;}
.pr-work-img{aspect-ratio:5/4;border-radius:32px;overflow:hidden;position:relative;
  background:linear-gradient(135deg,var(--c1),var(--c5));
  box-shadow:0 24px 60px -16px rgba(0,0,0,.6);transition:transform .4s cubic-bezier(.2,.85,.3,1);}
.pr-work:hover .pr-work-img{transform:translateY(-8px) rotate(-1deg);}
.pr-work-img img{width:100%;height:100%;object-fit:cover;display:block;}
.pr-work-img-emoji{width:100%;height:100%;display:grid;place-items:center;font-size:120px;filter:drop-shadow(0 10px 30px rgba(0,0,0,.4));}
.pr-work-img-decoration{position:absolute;width:140px;height:140px;border-radius:32px;
  background:linear-gradient(135deg,var(--c2),var(--c6));z-index:-1;
  bottom:-30px;right:-30px;animation:pr-float 8s ease-in-out infinite;
  box-shadow:0 16px 40px -10px rgba(255,217,61,.4);}
.pr-work:nth-child(even) .pr-work-img-decoration{left:-30px;right:auto;
  background:linear-gradient(135deg,var(--c4),var(--c3));box-shadow:0 16px 40px -10px rgba(77,150,255,.4);}

.pr-work-info{padding:0;}
.pr-work-meta{display:flex;align-items:center;gap:12px;margin-bottom:18px;font-family:var(--mono-font);font-size:11.5px;color:var(--tx3);text-transform:uppercase;letter-spacing:.12em;}
.pr-work-meta-num{padding:3px 10px;border-radius:999px;background:var(--bg3);border:1px solid var(--bdr);color:var(--c2);}
.pr-work-meta-yr{color:var(--tx2);}
.pr-work-title{font-family:var(--display-font);font-size:clamp(36px,5vw,56px);font-weight:500;line-height:1.05;letter-spacing:-.02em;margin-bottom:16px;}
.pr-work-title em{font-style:italic;color:var(--c2);}
.pr-work-desc{font-size:16px;color:var(--tx2);line-height:1.65;margin-bottom:20px;max-width:50ch;}
.pr-work-impact{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono-font);font-size:13px;font-weight:600;
  background:linear-gradient(135deg,rgba(255,217,61,.18),rgba(255,159,69,.12));border:1px solid rgba(255,217,61,.3);
  padding:7px 14px;border-radius:999px;color:var(--c2);margin-bottom:22px;}
.pr-work-tags{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:24px;}
.pr-work-tag{padding:5px 12px;border-radius:999px;font-family:var(--mono-font);font-size:11.5px;color:var(--tx2);
  background:rgba(255,255,255,.05);border:1px solid var(--bdr);}
.pr-work-link{display:inline-flex;align-items:center;gap:10px;font-family:var(--display-font);font-style:italic;
  font-size:18px;font-weight:500;color:var(--tx);transition:all .2s;}
.pr-work-link::after{content:'';display:inline-block;width:36px;height:1.5px;background:currentColor;transition:width .2s;}
.pr-work-link:hover{color:var(--c2);}
.pr-work-link:hover::after{width:50px;}
.pr-work-link.disabled{opacity:.35;pointer-events:none;}

/* Process / approach */
.pr-process{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.pr-step{background:rgba(255,255,255,.03);border:1px solid var(--bdr);border-radius:24px;padding:28px 24px;
  transition:all .3s;position:relative;overflow:hidden;}
.pr-step:hover{border-color:var(--bdrs);transform:translateY(-4px);}
.pr-step:hover::before{transform:translateY(0);}
.pr-step::before{content:'';position:absolute;left:0;right:0;bottom:0;height:3px;
  background:linear-gradient(90deg,var(--c1),var(--c5));transform:translateY(3px);transition:transform .25s;}
.pr-step-num{font-family:var(--display-font);font-style:italic;font-size:64px;font-weight:500;
  line-height:1;background:linear-gradient(135deg,var(--c1),var(--c5));
  -webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:12px;}
.pr-step-title{font-family:var(--display-font);font-size:22px;font-weight:600;margin-bottom:8px;letter-spacing:-.01em;}
.pr-step-desc{font-size:14px;color:var(--tx2);line-height:1.55;}

/* ── Testimonials ── */
.pr-test-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;}
.pr-test{background:rgba(255,255,255,.04);border:1px solid var(--bdr);border-radius:24px;padding:32px;
  position:relative;transition:all .25s;backdrop-filter:blur(10px);}
.pr-test:hover{border-color:var(--c5);transform:translateY(-4px);box-shadow:0 20px 50px -16px rgba(199,128,250,.25);}
.pr-test-mark{font-family:var(--display-font);font-size:80px;line-height:0;color:var(--c2);margin-top:18px;display:block;opacity:.5;}
.pr-test-text{font-family:var(--display-font);font-style:italic;font-size:20px;font-weight:500;
  line-height:1.5;color:var(--tx);margin:14px 0 22px;}
.pr-test-author{display:flex;align-items:center;gap:14px;padding-top:18px;border-top:1px solid var(--bdr);}
.pr-test-avi{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--c1),var(--c5));
  display:grid;place-items:center;color:#fff;font-family:var(--display-font);font-weight:600;font-size:18px;flex-shrink:0;
  box-shadow:0 6px 14px -4px rgba(255,107,107,.4);}
.pr-test-meta b{display:block;font-size:14px;font-weight:600;color:var(--tx);}
.pr-test-meta span{font-size:12.5px;color:var(--tx3);font-family:var(--mono-font);}

/* ── CTA / Contact ── */
.pr-cta-card{position:relative;background:linear-gradient(135deg,rgba(255,107,107,.18),rgba(199,128,250,.15) 40%,rgba(77,150,255,.15));
  border:1px solid var(--bdrs);border-radius:36px;padding:64px 48px;overflow:hidden;text-align:center;}
.pr-cta-card::before{content:'';position:absolute;top:-50%;left:-10%;width:120%;height:200%;
  background:conic-gradient(from 0deg, var(--c1),var(--c2),var(--c3),var(--c4),var(--c5),var(--c6),var(--c1));
  opacity:.12;filter:blur(80px);animation:pr-spin 30s linear infinite;}
.pr-cta-inner{position:relative;z-index:1;}
.pr-cta-title{font-family:var(--display-font);font-size:clamp(40px,6vw,72px);font-weight:500;letter-spacing:-.03em;line-height:1.15;margin-bottom:18px;padding:.08em 0 .12em;}
.pr-cta-title em{font-style:italic;background:linear-gradient(135deg,var(--c1),var(--c5));
  background-size:200% 200%;animation:pr-shimmer 5s linear infinite;
  -webkit-background-clip:text;background-clip:text;color:transparent;
  display:inline-block;padding:0 .04em .12em;line-height:1.15;}
.pr-cta-sub{font-size:17px;color:var(--tx2);max-width:50ch;margin:0 auto 32px;line-height:1.55;}
.pr-cta-channels{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-bottom:32px;}
.pr-channel{display:inline-flex;align-items:center;gap:10px;padding:12px 22px;border-radius:999px;
  background:rgba(255,255,255,.08);border:1px solid var(--bdr);backdrop-filter:blur(10px);transition:all .2s;
  font-size:14px;color:var(--tx);}
.pr-channel:hover{background:rgba(255,255,255,.14);border-color:var(--bdrs);transform:translateY(-2px);}
.pr a.pr-email-btn,a.pr-email-btn{display:inline-flex;align-items:center;gap:10px;padding:16px 36px;border-radius:999px;
  background:#fff;color:#0D0B1E !important;font-weight:700;font-size:16px;
  box-shadow:0 14px 40px -10px rgba(255,255,255,.4);transition:all .25s;font-family:var(--display-font);font-style:italic;
  word-break:break-all;text-align:center;}
.pr a.pr-email-btn:hover{transform:translateY(-3px) rotate(-1deg);box-shadow:0 20px 50px -12px rgba(255,255,255,.5);}

/* ── Footer ── */
.pr-footer{padding:48px 0 32px;text-align:center;border-top:1px solid var(--bdr);margin-top:48px;}
.pr-footer-inner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;
  font-family:var(--mono-font);font-size:12px;color:var(--tx3);}
.pr-footer-inner b{color:var(--tx2);font-weight:500;}
.pr-footer-mark{padding:3px 10px;border-radius:6px;background:linear-gradient(135deg,var(--c1),var(--c5));color:#fff;font-weight:700;}

/* Toast */
.pr-toast{position:fixed;bottom:32px;left:50%;transform:translate(-50%,160px);background:rgba(13,11,30,.95);
  backdrop-filter:blur(20px);border:1px solid var(--bdrs);padding:14px 24px;border-radius:999px;
  font-size:14px;color:var(--tx);z-index:200;transition:transform .35s cubic-bezier(.2,.7,.3,1);
  box-shadow:0 16px 40px rgba(0,0,0,.5);display:inline-flex;align-items:center;gap:10px;font-weight:500;}
.pr-toast.show{transform:translate(-50%,0);}

/* ── Responsive ── */
@media(max-width:1100px){
  .pr-bento{grid-template-columns:repeat(2,1fr);}
  .pr-tile-bio{grid-column:span 2;}
  .pr-tile-quote{grid-column:span 2;}
  .pr-tile-services{grid-column:span 2;}
  .pr-tile-photo{grid-row:span 1;}
  .pr-process{grid-template-columns:repeat(2,1fr);}
  .pr-work{grid-template-columns:1fr!important;gap:32px;}
  .pr-work:nth-child(even) .pr-work-img-wrap{order:1;}
  .pr-work:nth-child(even) .pr-work-info{order:2;}
  .pr-test-grid{grid-template-columns:1fr;}
}
@media(max-width:768px){
  .pr-nav-links{display:none;}
  .pr-nav-cta{display:none;}
  .pr-ham{display:flex!important;}
  .pr-hero{padding:32px 0 56px;}
  .pr-hero-sub{grid-template-columns:1fr;gap:18px;}
  .pr-hero-meta{text-align:left;}
  .pr-marquee-inner{font-size:18px;gap:24px;}
  .pr-marquee-inner span{gap:24px;}
  .pr-sect{padding:56px 0;}
  .pr-sect-head{grid-template-columns:1fr;gap:14px;}
  .pr-sect-num{writing-mode:horizontal-tb;transform:none;}
  .pr-bento{grid-template-columns:1fr;}
  .pr-tile-bio,.pr-tile-quote,.pr-tile-services{grid-column:span 1;}
  .pr-tile-bio-title{font-size:28px;}
  .pr-process{grid-template-columns:1fr;}
  .pr-cta-card{padding:40px 24px;border-radius:24px;}
  .pr-container{padding:0 20px;}
  .pr-marquee{margin:48px -20px;}
}
`;

const PALETTE_HEX = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#C780FA','#FF9F45'];
const PROJECT_GRADS = [
  'linear-gradient(135deg,#FF6B6B,#C780FA)',
  'linear-gradient(135deg,#FFD93D,#FF9F45)',
  'linear-gradient(135deg,#4D96FF,#6BCB77)',
  'linear-gradient(135deg,#C780FA,#4D96FF)',
  'linear-gradient(135deg,#FF9F45,#FF6B6B)',
  'linear-gradient(135deg,#6BCB77,#FFD93D)',
];
const PROJ_EMOJIS = ['🎨','✨','🌈','💎','🔮','🌸','🚀','📐'];

export default function PrismTemplate({ content: c, hideBranding }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.pr-reveal').forEach(el => io.observe(el));
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

  // ── Theme overrides ──
  const themeOverride = [
    c.colorC1 && `--c1:${c.colorC1};`,
    c.colorC2 && `--c2:${c.colorC2};`,
    c.colorC3 && `--c3:${c.colorC3};`,
    c.colorC4 && `--c4:${c.colorC4};`,
    c.colorC5 && `--c5:${c.colorC5};`,
    c.colorBg && `--bg:${c.colorBg};`,
    c.colorBg2 && `--bg2:${c.colorBg2};`,
    c.colorText && `--tx:${c.colorText};`,
  ].filter(Boolean).join('');

  // ── Content ──
  const name = c.name || 'Maya Velasco';
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const role = c.title || c.role || 'Multidisciplinary Designer';
  const tagline = c.heroTagline || 'I make brands\nfeel alive';
  const taglineParts = tagline.split('\n');
  const bio = c.bio || 'Independent designer crafting **identities** and **products** for ambitious teams. Currently shaping visual systems for early-stage startups and culture-driven brands.';
  const photoUrl = c.photoUrl || '';
  const availability = c.availability || 'Open for new work · Q1-Q2';
  const location = c.location || '';
  const yoe = c.yoe || '7';

  const services = pl(c.services).length > 0 ? pl(c.services) : pl(c.skillCore);
  const stats = [1,2,3,4,5,6,7,8].map(i => ({
    num: c[`stat${i}Num`], label: c[`stat${i}Label`],
  })).filter(s => s.num);

  const projects = parseJ<{ title: string; year: string; category?: string; image: string; desc: string; stack: string; impact: string; liveUrl: string }[]>(c.projJson, [])
    .map(p => ({ ...p, stack: pl(p.stack) }));

  const process = parseJ<{ title: string; description: string }[]>(c.processJson, []);
  const testimonials = parseJ<{ quote: string; initials: string; name: string; role: string }[]>(c.testJson, []);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    ...(testimonials.length > 0 ? [{ label: 'Words', href: '#words' }] : []),
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="pr">
      <style suppressHydrationWarning>{CSS}</style>
      {themeOverride && <style suppressHydrationWarning>{`.pr{${themeOverride}}`}</style>}

      {/* Background */}
      <div className="pr-bg">
        <div className="pr-blob b1"/>
        <div className="pr-blob b2"/>
        <div className="pr-blob b3"/>
      </div>
      <div className="pr-grain"/>

      <div className="pr-wrap">
        {/* ── NAV ── */}
        <nav className={`pr-nav${scrolled ? ' scrolled' : ''}`}>
          <div className="pr-nav-inner">
            <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="pr-logo">
              <span className="pr-logo-mark">{initials}</span>
              <span className="pr-logo-name">{name.split(' ')[0]}<span>.studio</span></span>
            </a>
            <ul className="pr-nav-links">
              {navLinks.map(l => (
                <li key={l.href}>
                  <span className="pr-nav-link" onClick={e => scrollTo(e as unknown as React.MouseEvent, l.href)}>{l.label}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" onClick={e => scrollTo(e, '#contact')} className="pr-nav-cta">
              Start a project <ArrowIcon/>
            </a>
            <button className="pr-ham" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}
              </svg>
            </button>
          </div>
          <div className={`pr-mobile-menu${menuOpen ? ' open' : ''}`}>
            {navLinks.map(l => (
              <span key={l.href} className="pr-mobile-link" onClick={e => scrollTo(e as unknown as React.MouseEvent, l.href)}>{l.label}</span>
            ))}
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="pr-hero">
          <div className="pr-container">
            <div className="pr-hero-eyebrow pr-reveal">
              <span className="dot"/>
              {availability}
            </div>

            <h1 className="pr-hero-h1 pr-display pr-reveal">
              {taglineParts[0]}<br/>
              <span className="it">{taglineParts[1] || 'beautifully'}</span>
            </h1>

            <div className="pr-hero-sub pr-reveal">
              <p className="pr-hero-bio" dangerouslySetInnerHTML={{ __html: bio.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>
              <div className="pr-hero-meta">
                {role.toUpperCase()}<br/>
                {location && <><b>· {location}</b><br/></>}
                <b>· {yoe}+ years</b><br/>
                <b>· est. {new Date().getFullYear() - parseInt(yoe || '7', 10)}</b>
              </div>
            </div>

            <div className="pr-hero-actions pr-reveal">
              <a href="#work" onClick={e => scrollTo(e, '#work')} className="pr-btn pr-btn-primary">
                <SparkIcon/> View selected work
              </a>
              {c.resumeUrl && (
                <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer" className="pr-btn pr-btn-ghost">
                  Download CV
                </a>
              )}
            </div>
          </div>

          {/* Marquee */}
          <div className="pr-marquee">
            <div className="pr-marquee-inner">
              {[...Array(2)].flatMap((_, k) => [
                <span key={`a-${k}`}>Brand identity <em>·</em></span>,
                <span key={`b-${k}`}>Visual systems <em>·</em></span>,
                <span key={`c-${k}`}>Editorial design <em>·</em></span>,
                <span key={`d-${k}`}>Art direction <em>·</em></span>,
                <span key={`e-${k}`}>Digital products <em>·</em></span>,
                <span key={`f-${k}`}>Motion design <em>·</em></span>,
              ])}
            </div>
          </div>
        </section>

        {/* ── ABOUT (Bento) ── */}
        <section className="pr-sect" id="about">
          <div className="pr-container">
            <div className="pr-sect-head pr-reveal">
              <span className="pr-sect-num">01 / About</span>
              <div>
                <h2 className="pr-sect-title">A little about <em>me</em>.</h2>
                <p className="pr-sect-sub">The short version: ideas first, polish always. Working across digital and print for brands that care about the details.</p>
              </div>
            </div>

            <div className="pr-bento">
              {/* Photo tile */}
              <div className="pr-tile pr-tile-photo pr-reveal">
                {photoUrl ? <img src={photoUrl} alt={name}/> : <div className="pr-tile-photo-init">{initials.charAt(0)}</div>}
                <div className="pr-tile-photo-name">
                  <div className="role">{role}</div>
                  <div className="name">{name}</div>
                </div>
              </div>

              {/* Bio tile */}
              <div className="pr-tile pr-tile-bio pr-reveal" style={{ animationDelay: '.08s' }}>
                <div className="pr-tile-bio-decoration">✦</div>
                <div className="pr-tile-eyebrow"><span style={{ color: 'var(--c1)' }}>●</span> The studio</div>
                <h3 className="pr-tile-bio-title">Crafting brands that <em>feel</em> as good as they look.</h3>
                <p className="pr-tile-bio-text" dangerouslySetInnerHTML={{ __html: bio.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>
              </div>

              {/* Stats tiles */}
              {stats.slice(0, 4).map((s, i) => (
                <div key={i} className={`pr-tile pr-tile-stat c${i + 1} pr-reveal`} style={{ animationDelay: `${.12 + i * .04}s` }}>
                  <div className="pr-tile-eyebrow">{i === 0 ? '✦ Stat' : i === 1 ? '◆ Stat' : i === 2 ? '★ Stat' : '☕ Stat'}</div>
                  <div>
                    <div className="num">{s.num}</div>
                    <div className="label">{s.label}</div>
                  </div>
                </div>
              ))}

              {/* Quote tile */}
              <div className="pr-tile pr-tile-quote pr-reveal" style={{ animationDelay: '.28s' }}>
                <div className="pr-tile-eyebrow"><PaletteIcon/> Philosophy</div>
                <div className="pr-tile-quote-mark">"</div>
                <p className="pr-tile-quote-text">{c.philosophy || 'Good design is invisible. Great design tells a story you remember.'}</p>
                <span style={{ fontFamily: 'var(--mono-font)', fontSize: 12, color: 'var(--tx3)' }}>— {c.philosophyAuthor || 'the studio'}</span>
              </div>

              {/* Palette tile */}
              <div className="pr-tile pr-tile-palette pr-reveal" style={{ animationDelay: '.32s' }}>
                <div className="pr-tile-eyebrow"><PaletteIcon/> Current palette</div>
                <div className="pr-palette-swatches">
                  {PALETTE_HEX.map((hex, i) => (
                    <div key={i} className="pr-palette-swatch" style={{ background: hex }} data-hex={hex} onClick={() => { navigator.clipboard?.writeText(hex); toast(`${hex} copied`); }}/>
                  ))}
                </div>
              </div>

              {/* Services tile */}
              {services.length > 0 && (
                <div className="pr-tile pr-tile-services pr-reveal" style={{ animationDelay: '.36s' }}>
                  <div className="pr-tile-eyebrow"><SparkIcon/> Services</div>
                  <div className="pr-services-list">
                    {services.slice(0, 5).map((s, i) => (
                      <div key={i} className="pr-service">
                        <span>{s}</span>
                        <span className="pr-service-num">/0{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── WORK ── */}
        <section className="pr-sect" id="work">
          <div className="pr-container">
            <div className="pr-sect-head pr-reveal">
              <span className="pr-sect-num">02 / Work</span>
              <div>
                <h2 className="pr-sect-title">Selected <em>work</em>.</h2>
                <p className="pr-sect-sub">{c.projSub || 'A small selection of recent client engagements and personal explorations.'}</p>
              </div>
            </div>

            {projects.length === 0 && (
              <div style={{ padding: 48, textAlign: 'center', border: '1px dashed var(--bdr)', borderRadius: 24, color: 'var(--tx3)', fontStyle: 'italic', fontFamily: 'var(--display-font)', fontSize: 18 }}>
                No projects yet — add your work from the dashboard.
              </div>
            )}
            <div className="pr-work-grid">
              {projects.slice(0, 6).map((p, i) => (
                <article key={i} className="pr-work pr-reveal" style={{ animationDelay: `${i * .08}s` }}>
                  <div className="pr-work-img-wrap">
                    <div className="pr-work-img" style={p.image ? {} : { background: PROJECT_GRADS[i % PROJECT_GRADS.length] }}>
                      {p.image
                        ? <img src={p.image} alt={p.title}/>
                        : <div className="pr-work-img-emoji">{PROJ_EMOJIS[i % PROJ_EMOJIS.length]}</div>}
                    </div>
                    <div className="pr-work-img-decoration"/>
                  </div>
                  <div className="pr-work-info">
                    <div className="pr-work-meta">
                      <span className="pr-work-meta-num">{String(i + 1).padStart(2, '0')}</span>
                      <span>{p.category || 'Project'}</span>
                      <span className="pr-work-meta-yr">— {p.year}</span>
                    </div>
                    <h3 className="pr-work-title">{p.title}<span style={{ color: 'var(--c2)' }}>.</span></h3>
                    <p className="pr-work-desc">{p.desc}</p>
                    {p.impact && <div className="pr-work-impact">✦ {p.impact}</div>}
                    {p.stack.length > 0 && (
                      <div className="pr-work-tags">
                        {p.stack.map((s, j) => <span key={j} className="pr-work-tag">{s}</span>)}
                      </div>
                    )}
                    {p.liveUrl ? (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="pr-work-link">
                        View case study <ExtIcon/>
                      </a>
                    ) : (
                      <span className="pr-work-link disabled">View case study <ExtIcon/></span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        {process.length > 0 && (
          <section className="pr-sect" id="process">
            <div className="pr-container">
              <div className="pr-sect-head pr-reveal">
                <span className="pr-sect-num">03 / Process</span>
                <div>
                  <h2 className="pr-sect-title">How it <em>works</em>.</h2>
                  <p className="pr-sect-sub">{c.processSub || 'A simple, transparent process built around collaboration and bold thinking.'}</p>
                </div>
              </div>
              <div className="pr-process">
                {process.map((step, i) => (
                  <div key={i} className="pr-step pr-reveal" style={{ animationDelay: `${i * .08}s` }}>
                    <div className="pr-step-num">0{i + 1}</div>
                    <h3 className="pr-step-title">{step.title}</h3>
                    <p className="pr-step-desc">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ── */}
        {testimonials.length > 0 && (
          <section className="pr-sect" id="words">
            <div className="pr-container">
              <div className="pr-sect-head pr-reveal">
                <span className="pr-sect-num">04 / Words</span>
                <div>
                  <h2 className="pr-sect-title">Kind <em>words</em>.</h2>
                  <p className="pr-sect-sub">{c.testimonialsSub || 'A few words from the people I\'ve had the pleasure of working with.'}</p>
                </div>
              </div>
              <div className="pr-test-grid">
                {testimonials.slice(0, 4).map((t, i) => (
                  <div key={i} className="pr-test pr-reveal" style={{ animationDelay: `${i * .08}s` }}>
                    <span className="pr-test-mark">"</span>
                    <p className="pr-test-text">{t.quote}</p>
                    <div className="pr-test-author">
                      <div className="pr-test-avi">{t.initials || (t.name || 'XX').slice(0, 2).toUpperCase()}</div>
                      <div className="pr-test-meta">
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

        {/* ── CTA / CONTACT ── */}
        <section className="pr-sect" id="contact">
          <div className="pr-container">
            <div className="pr-cta-card pr-reveal">
              <div className="pr-cta-inner">
                <div className="pr-tile-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c3)', boxShadow: '0 0 12px var(--c3)' }}/>
                  Let's make something
                </div>
                <h2 className="pr-cta-title">Got a project in <em>mind</em>?</h2>
                <p className="pr-cta-sub">{c.contactSub || 'Currently booking new client work. Drop me a note with the project, timing, and what you\'re hoping to achieve.'}</p>
                {c.contactEmail && (
                  <a href={`mailto:${c.contactEmail}`} className="pr-email-btn">
                    <MailIcon/> {c.contactEmail}
                  </a>
                )}
                <div className="pr-cta-channels" style={{ marginTop: 32 }}>
                  {c.instagramUrl && <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="pr-channel"><InstaIcon/> Instagram</a>}
                  {c.behanceUrl && <a href={c.behanceUrl} target="_blank" rel="noopener noreferrer" className="pr-channel"><BeIcon/> Behance</a>}
                  {c.dribbbleUrl && <a href={c.dribbbleUrl} target="_blank" rel="noopener noreferrer" className="pr-channel"><DribIcon/> Dribbble</a>}
                  {c.linkedinUrl && <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="pr-channel"><LiIcon/> LinkedIn</a>}
                  {c.twitterUrl && <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer" className="pr-channel"><TwIcon/> Twitter</a>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="pr-footer">
          <div className="pr-container">
            <div className="pr-footer-inner">
              <span>© {new Date().getFullYear()} <b>{name}</b> · Designed with care</span>
              <span>
                {!hideBranding && <>Powered by <span className="pr-footer-mark">FolioForge</span> · </>}
                Prism v1.0
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast */}
      <div className={`pr-toast${toastShow ? ' show' : ''}`}>{toastMsg}</div>
    </div>
  );
}
