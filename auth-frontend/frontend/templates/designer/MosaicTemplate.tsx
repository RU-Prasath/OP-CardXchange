'use client';
import { useState, useEffect, useRef } from 'react';

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
const MailIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
const ArrowIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
const ExtIcon = () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>;
const HeartIcon = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const StarIcon = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;

// ── CSS ──
const CSS = `
.ms{--cream:#FDF8F0;--paper:#F7F0E1;--ink:#2A2622;--ink2:#5B544D;--ink3:#8B847C;
  --tape:#FFE5A8;--tape2:#FFC2C2;--tape3:#C7E5C7;--tape4:#C2D8FF;
  --accent:#E8533D;--accent2:#F4B233;--accent3:#6BA86B;--accent4:#5B7DB1;--accent5:#A66BB1;
  --hl-yellow:#FFE066;--hl-pink:#FFB6D9;--hl-mint:#A8E6CF;
  --shadow-paper:0 1px 0 rgba(0,0,0,.03),0 6px 14px -4px rgba(60,40,20,.12),0 18px 36px -10px rgba(60,40,20,.08);
  --shadow-paper-hover:0 2px 0 rgba(0,0,0,.04),0 14px 28px -6px rgba(60,40,20,.18),0 28px 56px -12px rgba(60,40,20,.14);
  --display-font:'Caveat','Kalam','Patrick Hand',cursive;
  --sans-font:'Inter','SF Pro Display',system-ui,sans-serif;
  --serif-font:'Fraunces','DM Serif Display',Georgia,serif;
  --mono-font:'Courier Prime','JetBrains Mono',monospace;
  font-family:var(--sans-font);background:var(--cream);color:var(--ink);
  font-size:15.5px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative;}
.ms *{box-sizing:border-box;margin:0;padding:0;}
.ms a{color:inherit;text-decoration:none;}
.ms button{font:inherit;cursor:pointer;border:none;background:none;color:inherit;}
.ms-handwritten{font-family:var(--display-font);}
.ms-serif{font-family:var(--serif-font);}
.ms-mono{font-family:var(--mono-font);}

@keyframes ms-wiggle{0%,100%{transform:rotate(var(--rot,0deg))}50%{transform:rotate(calc(var(--rot,0deg) + .8deg))}}
@keyframes ms-float{0%,100%{transform:translateY(0) rotate(var(--rot,0deg))}50%{transform:translateY(-10px) rotate(var(--rot,0deg))}}
@keyframes ms-fadein{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes ms-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes ms-tape-flutter{0%,100%{transform:rotate(var(--rot,0deg)) translateY(0)}50%{transform:rotate(calc(var(--rot,0deg) + .3deg)) translateY(-1px)}}
.ms-reveal{opacity:0;transform:translateY(20px) scale(.97);}
.ms-reveal.in{animation:ms-fadein .65s cubic-bezier(.2,.85,.3,1) forwards;}

/* Paper texture overlay */
.ms-bg-paper{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.5;
  background-image:url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/></svg>");
  mix-blend-mode:multiply;}
.ms-bg-dots{position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:radial-gradient(rgba(42,38,34,.07) 1px,transparent 1px);
  background-size:24px 24px;}

.ms-wrap{position:relative;z-index:1;}

/* ── Nav ── */
.ms-nav{position:sticky;top:0;z-index:50;padding:18px 0;transition:all .25s;}
.ms-nav.scrolled{padding:10px 0;background:rgba(253,248,240,.88);backdrop-filter:blur(12px);
  border-bottom:1px dashed rgba(42,38,34,.15);}
.ms-nav-inner{max-width:1280px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:20px;}
.ms-logo{display:flex;align-items:center;gap:10px;}
.ms-logo-mark{width:42px;height:42px;border-radius:8px;background:var(--accent);color:#fff;
  display:grid;place-items:center;font-family:var(--display-font);font-size:24px;font-weight:700;
  transform:rotate(-4deg);box-shadow:3px 3px 0 rgba(42,38,34,.18);
  border:2px solid var(--ink);position:relative;}
.ms-logo-mark::before{content:'';position:absolute;top:-6px;left:50%;transform:translateX(-50%) rotate(8deg);
  width:24px;height:6px;background:var(--tape2);border:1px solid rgba(42,38,34,.18);}
.ms-logo-text{font-family:var(--display-font);font-size:22px;font-weight:700;color:var(--ink);}
.ms-logo-text span{color:var(--accent);}
.ms-nav-links{display:flex;gap:6px;}
.ms-nav-link{padding:8px 14px;border-radius:999px;font-family:var(--display-font);font-size:17px;color:var(--ink2);
  transition:all .15s;cursor:pointer;}
.ms-nav-link:hover{color:var(--ink);background:var(--paper);}
.ms a.ms-nav-cta,a.ms-nav-cta{padding:10px 20px;border-radius:999px;font-family:var(--display-font);font-size:18px;font-weight:700;
  background:var(--ink);color:var(--cream) !important;box-shadow:3px 3px 0 var(--accent);
  border:2px solid var(--ink);transition:all .2s;display:inline-flex;align-items:center;gap:7px;
  transform:rotate(-1deg);text-decoration:none;}
.ms a.ms-nav-cta:hover{transform:rotate(0) translateY(-2px);box-shadow:4px 4px 0 var(--accent);}
.ms-ham{display:none;width:42px;height:42px;border:2px solid var(--ink);border-radius:8px;background:var(--cream);
  align-items:center;justify-content:center;color:var(--ink);box-shadow:2px 2px 0 rgba(42,38,34,.2);}
.ms-mobile-menu{display:none;position:fixed;inset:64px 0 0 0;background:rgba(253,248,240,.96);
  backdrop-filter:blur(20px);z-index:49;flex-direction:column;padding:24px;gap:6px;overflow-y:auto;}
.ms-mobile-menu.open{display:flex;}
.ms-mobile-link{padding:14px 18px;font-family:var(--display-font);font-size:24px;border-radius:12px;cursor:pointer;
  color:var(--ink);border:2px dashed rgba(42,38,34,.15);background:var(--paper);}

.ms-container{max-width:1280px;margin:0 auto;padding:0 32px;position:relative;}

/* ── Hero ── */
.ms-hero{padding:32px 0 100px;position:relative;}
.ms-hero-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:48px;align-items:center;}

.ms-hero-h1{font-family:var(--serif-font);font-size:clamp(64px,9vw,128px);font-weight:600;line-height:.95;letter-spacing:-.03em;color:var(--ink);
  margin-bottom:18px;position:relative;}
.ms-hero-h1 .hand{font-family:var(--display-font);font-style:normal;font-weight:700;color:var(--accent);
  font-size:1.05em;transform:rotate(-2deg);display:inline-block;line-height:1;}
.ms-hero-h1 .marker{position:relative;display:inline-block;z-index:1;}
.ms-hero-h1 .marker::before{content:'';position:absolute;inset:18% -8px 12% -8px;background:var(--hl-yellow);
  z-index:-1;transform:skew(-3deg);border-radius:4px;}

.ms-hero-bio{font-size:18px;color:var(--ink2);line-height:1.65;margin-bottom:32px;max-width:54ch;}
.ms-hero-bio strong{font-family:var(--display-font);font-weight:700;color:var(--ink);font-size:22px;background:var(--hl-pink);padding:0 6px;border-radius:3px;display:inline-block;transform:rotate(-1deg);}

.ms-hero-actions{display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin-bottom:18px;}
.ms-btn{padding:14px 26px;font-family:var(--display-font);font-size:20px;font-weight:700;display:inline-flex;align-items:center;gap:9px;
  transition:all .2s;cursor:pointer;border:2px solid var(--ink);border-radius:999px;}
.ms a.ms-btn-primary,a.ms-btn-primary,button.ms-btn-primary{background:var(--accent);color:#fff !important;box-shadow:4px 4px 0 var(--ink);transform:rotate(-1.5deg);text-decoration:none;}
.ms a.ms-btn-primary:hover,button.ms-btn-primary:hover{transform:rotate(0) translateY(-3px);box-shadow:5px 5px 0 var(--ink);}
.ms a.ms-btn-ghost,a.ms-btn-ghost,button.ms-btn-ghost{background:var(--cream);color:var(--ink) !important;box-shadow:4px 4px 0 var(--ink2);transform:rotate(1deg);text-decoration:none;}
.ms a.ms-btn-ghost:hover,button.ms-btn-ghost:hover{background:var(--paper);transform:rotate(0) translateY(-3px);box-shadow:5px 5px 0 var(--ink2);}

/* Hero stickers — decorative */
.ms-hero-stickers{margin-top:24px;display:flex;flex-wrap:wrap;gap:12px;}
.ms-sticker{font-family:var(--display-font);font-size:16px;font-weight:700;padding:6px 14px;
  border:2px solid var(--ink);border-radius:999px;background:var(--cream);
  box-shadow:2px 2px 0 rgba(42,38,34,.15);transform:rotate(var(--rot,-1deg));transition:transform .2s;}
.ms-sticker:hover{transform:rotate(0) translateY(-2px);}
.ms-sticker.c1{background:var(--tape);}
.ms-sticker.c2{background:var(--tape2);}
.ms-sticker.c3{background:var(--tape3);}
.ms-sticker.c4{background:var(--tape4);}
.ms-sticker.c5{background:var(--hl-mint);}

/* Polaroid photo */
.ms-polaroid-wrap{position:relative;padding:20px 20px 56px;background:#fff;
  box-shadow:var(--shadow-paper);transform:rotate(3deg);transition:transform .3s cubic-bezier(.2,.85,.3,1);
  border:1px solid rgba(42,38,34,.06);}
.ms-polaroid-wrap:hover{transform:rotate(0) scale(1.02);}
.ms-polaroid-wrap::before{content:'';position:absolute;top:-15px;left:50%;transform:translateX(-50%) rotate(-4deg);
  width:120px;height:32px;background:var(--tape);border:1px dashed rgba(42,38,34,.15);
  background-image:linear-gradient(90deg,rgba(0,0,0,.04) 50%,transparent 50%);background-size:8px 100%;}
.ms-polaroid-img{aspect-ratio:4/5;background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:grid;place-items:center;overflow:hidden;color:#fff;font-family:var(--serif-font);font-size:120px;font-weight:500;}
.ms-polaroid-img img{width:100%;height:100%;object-fit:cover;filter:contrast(1.05) saturate(1.05);}
.ms-polaroid-caption{position:absolute;bottom:14px;left:0;right:0;font-family:var(--display-font);font-size:22px;text-align:center;color:var(--ink);font-weight:700;transform:rotate(-1.5deg);}

/* Floating decorations around polaroid */
.ms-pin{position:absolute;width:36px;height:36px;background:var(--accent);border-radius:50%;
  border:3px solid #fff;box-shadow:0 4px 8px rgba(0,0,0,.18),inset 0 -2px 4px rgba(0,0,0,.18);z-index:2;}
.ms-pin.p1{top:-12px;right:30px;background:var(--accent2);}
.ms-pin.p2{bottom:60px;left:-14px;background:var(--accent3);width:30px;height:30px;}

.ms-doodle-arrow{position:absolute;font-family:var(--display-font);color:var(--accent);font-size:22px;font-weight:700;}

/* ── Marquee ── */
.ms-marquee{padding:24px 0;background:var(--ink);color:var(--cream);overflow:hidden;
  border-top:3px solid var(--ink);border-bottom:3px solid var(--ink);transform:rotate(-1.2deg);margin:0 -32px;position:relative;z-index:2;}
.ms-marquee-inner{display:flex;width:max-content;gap:36px;animation:ms-marquee 30s linear infinite;
  font-family:var(--display-font);font-size:32px;font-weight:700;}
@keyframes ms-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.ms-marquee span{white-space:nowrap;display:inline-flex;align-items:center;gap:36px;}
.ms-marquee span::after{content:'✻';color:var(--accent2);font-size:24px;}
.ms-marquee em{font-family:var(--display-font);font-style:normal;color:var(--accent2);}

/* ── Section common ── */
.ms-sect{padding:96px 0;position:relative;}
.ms-sect-num{font-family:var(--mono-font);font-size:13px;color:var(--accent);font-weight:700;letter-spacing:.18em;text-transform:uppercase;display:inline-flex;align-items:center;gap:8px;margin-bottom:8px;}
.ms-sect-num::before{content:'';width:32px;height:2px;background:var(--accent);display:inline-block;}
.ms-sect-title{font-family:var(--serif-font);font-size:clamp(40px,5.5vw,72px);font-weight:600;letter-spacing:-.025em;line-height:1.05;margin-bottom:14px;color:var(--ink);}
.ms-sect-title .hand{font-family:var(--display-font);color:var(--accent);font-weight:700;font-size:1.05em;line-height:1;display:inline-block;transform:rotate(-2deg);}
.ms-sect-title .marker{position:relative;display:inline-block;z-index:1;}
.ms-sect-title .marker::before{content:'';position:absolute;inset:25% -6px 18% -6px;background:var(--hl-mint);z-index:-1;transform:skew(-2deg);border-radius:3px;}
.ms-sect-sub{font-size:17px;color:var(--ink2);max-width:54ch;line-height:1.6;}

/* ── About ── */
.ms-about{display:grid;grid-template-columns:1fr 1.1fr;gap:64px;align-items:center;}

.ms-photo-collage{position:relative;height:520px;}
.ms-photo-1{position:absolute;top:0;left:0;width:60%;aspect-ratio:3/4;background:#fff;padding:14px 14px 42px;
  box-shadow:var(--shadow-paper);transform:rotate(-5deg);border:1px solid rgba(42,38,34,.06);}
.ms-photo-1 .ms-photo-inner{width:100%;height:100%;background:linear-gradient(135deg,var(--accent4),var(--accent5));overflow:hidden;display:grid;place-items:center;color:#fff;font-family:var(--serif-font);font-size:72px;font-weight:500;}
.ms-photo-1 .ms-photo-inner img{width:100%;height:100%;object-fit:cover;}
.ms-photo-2{position:absolute;bottom:24px;right:0;width:54%;aspect-ratio:1;background:#fff;padding:12px 12px 38px;
  box-shadow:var(--shadow-paper);transform:rotate(4deg);border:1px solid rgba(42,38,34,.06);}
.ms-photo-2 .ms-photo-inner{width:100%;height:100%;background:linear-gradient(135deg,var(--accent3),var(--accent2));}
.ms-photo-stickynote{position:absolute;top:48%;left:38%;background:var(--hl-yellow);padding:14px 20px;
  font-family:var(--display-font);font-size:22px;font-weight:700;color:var(--ink);line-height:1.25;
  box-shadow:3px 3px 0 rgba(42,38,34,.18);transform:rotate(-8deg);max-width:200px;z-index:3;}

.ms-about-text{font-size:17px;color:var(--ink2);line-height:1.75;margin-bottom:18px;}
.ms-about-text strong{font-family:var(--display-font);font-weight:700;color:var(--ink);font-size:1.15em;background:var(--hl-pink);padding:0 5px;border-radius:3px;}

.ms-meta-strip{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:24px;}
.ms-meta-item{padding:16px 18px;background:var(--cream);border:2px dashed rgba(42,38,34,.18);border-radius:14px;
  position:relative;transition:all .25s;}
.ms-meta-item:hover{border-style:solid;border-color:var(--accent);transform:translateY(-2px);}
.ms-meta-item .ms-meta-label{font-family:var(--mono-font);font-size:11px;color:var(--ink3);text-transform:uppercase;letter-spacing:.12em;margin-bottom:4px;}
.ms-meta-item .ms-meta-value{font-family:var(--display-font);font-size:24px;font-weight:700;color:var(--ink);line-height:1.1;}

/* ── Services / Skills (sticky notes) ── */
.ms-services{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:40px;}
.ms-service{padding:24px 22px;border-radius:6px;position:relative;transition:all .3s cubic-bezier(.2,.85,.3,1);
  box-shadow:3px 3px 0 rgba(42,38,34,.12),0 8px 20px -6px rgba(42,38,34,.18);
  transform:rotate(var(--rot,-1deg));cursor:default;border:1.5px solid rgba(42,38,34,.08);}
.ms-service:hover{transform:rotate(0) translateY(-6px);box-shadow:4px 4px 0 rgba(42,38,34,.16),0 14px 28px -8px rgba(42,38,34,.22);}
.ms-service:nth-child(4n+1){background:var(--hl-yellow);--rot:-2deg;}
.ms-service:nth-child(4n+2){background:var(--hl-pink);--rot:1.5deg;}
.ms-service:nth-child(4n+3){background:var(--hl-mint);--rot:-1deg;}
.ms-service:nth-child(4n+4){background:#FFD7B5;--rot:2deg;}
.ms-service-num{font-family:var(--mono-font);font-size:11px;color:var(--ink2);font-weight:700;margin-bottom:10px;}
.ms-service-title{font-family:var(--display-font);font-size:26px;font-weight:700;line-height:1.1;color:var(--ink);}
.ms-service::after{content:'';position:absolute;top:-12px;left:50%;transform:translateX(-50%) rotate(var(--tape-rot,-3deg));
  width:50%;height:18px;background:rgba(255,255,255,.6);border:1px dashed rgba(42,38,34,.18);}
.ms-service:nth-child(4n+1)::after{--tape-rot:-4deg;}
.ms-service:nth-child(4n+2)::after{--tape-rot:3deg;}
.ms-service:nth-child(4n+3)::after{--tape-rot:-2deg;}
.ms-service:nth-child(4n+4)::after{--tape-rot:5deg;}

/* ── Work / Selected ── */
.ms-work-grid{display:flex;flex-direction:column;gap:80px;margin-top:48px;}
.ms-work{display:grid;grid-template-columns:1.1fr 1fr;gap:56px;align-items:center;position:relative;}
.ms-work:nth-child(even){grid-template-columns:1fr 1.1fr;}
.ms-work:nth-child(even) .ms-work-img{order:2;}
.ms-work:nth-child(even) .ms-work-info{order:1;}

.ms-work-img-wrap{position:relative;}
.ms-work-img{aspect-ratio:5/4;background:linear-gradient(135deg,var(--accent),var(--accent2));
  padding:18px 18px 18px;box-shadow:var(--shadow-paper);transform:rotate(-1.5deg);transition:transform .35s cubic-bezier(.2,.85,.3,1);
  position:relative;border:1px solid rgba(42,38,34,.06);background-clip:padding-box;}
.ms-work:nth-child(even) .ms-work-img{transform:rotate(2deg);}
.ms-work:nth-child(3n+1) .ms-work-img{background:linear-gradient(135deg,var(--accent),var(--accent5));}
.ms-work:nth-child(3n+2) .ms-work-img{background:linear-gradient(135deg,var(--accent3),var(--accent4));}
.ms-work:nth-child(3n+3) .ms-work-img{background:linear-gradient(135deg,var(--accent2),var(--accent));}
.ms-work-img::before{content:'';position:absolute;top:-14px;left:30%;width:80px;height:22px;background:var(--tape);border:1px dashed rgba(42,38,34,.18);transform:rotate(-3deg);z-index:2;
  background-image:linear-gradient(90deg,rgba(0,0,0,.04) 50%,transparent 50%);background-size:8px 100%;}
.ms-work:hover .ms-work-img{transform:rotate(0) scale(1.02);}
.ms-work-img-inner{width:100%;height:100%;background:#fff;overflow:hidden;display:grid;place-items:center;font-size:96px;}
.ms-work-img-inner img{width:100%;height:100%;object-fit:cover;}

.ms-work-tag{position:absolute;top:24px;right:-12px;background:var(--ink);color:var(--cream);
  padding:7px 14px;font-family:var(--display-font);font-size:18px;font-weight:700;
  transform:rotate(8deg);box-shadow:2px 2px 0 var(--accent);z-index:3;border:2px solid var(--ink);}

.ms-work-info{padding:0;}
.ms-work-num{font-family:var(--display-font);font-size:18px;color:var(--accent);font-weight:700;margin-bottom:8px;letter-spacing:.05em;text-transform:uppercase;}
.ms-work-title{font-family:var(--serif-font);font-size:clamp(34px,4.5vw,56px);font-weight:600;letter-spacing:-.02em;line-height:1.05;margin-bottom:14px;color:var(--ink);}
.ms-work-title .mark{position:relative;display:inline-block;z-index:1;}
.ms-work-title .mark::before{content:'';position:absolute;inset:32% -4px 22% -4px;background:var(--hl-yellow);z-index:-1;transform:skew(-2deg);}
.ms-work-desc{font-size:17px;color:var(--ink2);line-height:1.7;margin-bottom:18px;max-width:54ch;}
.ms-work-meta{display:flex;flex-wrap:wrap;gap:18px;font-family:var(--mono-font);font-size:12px;color:var(--ink3);letter-spacing:.08em;text-transform:uppercase;margin-bottom:18px;}
.ms-work-meta b{color:var(--ink);font-weight:700;font-family:var(--display-font);font-size:16px;text-transform:none;letter-spacing:0;}
.ms-work-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;}
.ms-work-tag-chip{padding:5px 12px;border:1.5px solid var(--ink);border-radius:999px;font-family:var(--display-font);font-size:16px;color:var(--ink);background:var(--cream);font-weight:700;transition:all .15s;}
.ms-work-tag-chip:hover{background:var(--ink);color:var(--cream);}
.ms-work-link{display:inline-flex;align-items:center;gap:10px;font-family:var(--display-font);font-size:22px;color:var(--ink);font-weight:700;
  border-bottom:2px dashed var(--accent);padding-bottom:3px;transition:all .2s;}
.ms-work-link:hover{color:var(--accent);transform:translateX(4px);}
.ms-work-link.disabled{opacity:.35;pointer-events:none;}

/* ── Testimonials ── */
.ms-test-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:32px;margin-top:40px;}
.ms-test{background:#fff;padding:32px;border-radius:16px;position:relative;
  box-shadow:var(--shadow-paper);border:1.5px solid rgba(42,38,34,.06);
  transform:rotate(var(--rot,-1deg));transition:all .25s;}
.ms-test:nth-child(odd){--rot:-1.5deg;}
.ms-test:nth-child(even){--rot:1.5deg;}
.ms-test:hover{transform:rotate(0) translateY(-4px);box-shadow:var(--shadow-paper-hover);}
.ms-test::before{content:'';position:absolute;top:-16px;left:32px;width:80px;height:26px;background:var(--tape2);
  border:1px dashed rgba(42,38,34,.18);transform:rotate(-3deg);
  background-image:linear-gradient(90deg,rgba(0,0,0,.04) 50%,transparent 50%);background-size:8px 100%;}
.ms-test:nth-child(odd)::before{background:var(--tape3);}
.ms-test:nth-child(3n+2)::before{background:var(--tape4);}
.ms-test-mark{font-family:var(--serif-font);font-size:64px;line-height:.5;color:var(--accent);margin-bottom:12px;font-style:italic;}
.ms-test-quote{font-family:var(--serif-font);font-style:italic;font-size:19px;color:var(--ink);line-height:1.55;margin-bottom:22px;}
.ms-test-author{display:flex;align-items:center;gap:14px;padding-top:18px;border-top:1px dashed rgba(42,38,34,.18);}
.ms-test-avi{width:48px;height:48px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;
  font-family:var(--display-font);font-size:22px;font-weight:700;flex-shrink:0;
  border:2px solid var(--ink);box-shadow:2px 2px 0 rgba(42,38,34,.15);}
.ms-test:nth-child(2n) .ms-test-avi{background:var(--accent3);}
.ms-test:nth-child(3n) .ms-test-avi{background:var(--accent4);}
.ms-test:nth-child(4n) .ms-test-avi{background:var(--accent5);}
.ms-test-meta b{font-family:var(--display-font);font-size:22px;font-weight:700;color:var(--ink);display:block;line-height:1.2;}
.ms-test-meta span{font-family:var(--mono-font);font-size:12px;color:var(--ink3);}

/* ── Contact — Postcard layout ── */
.ms-postcard-wrap{max-width:980px;margin:0 auto;position:relative;}
.ms-postcard{position:relative;background:#FBF4E4;border:2px solid var(--ink);
  box-shadow:10px 10px 0 var(--accent),0 30px 60px -20px rgba(60,40,20,.25);
  transform:rotate(-1deg);overflow:hidden;border-radius:4px;}
.ms-postcard::before{content:'';position:absolute;inset:0;
  background-image:repeating-linear-gradient(135deg,transparent 0,transparent 28px,rgba(232,83,61,.04) 28px,rgba(232,83,61,.04) 29px),
                  repeating-linear-gradient(45deg,transparent 0,transparent 28px,rgba(91,125,177,.04) 28px,rgba(91,125,177,.04) 29px);
  pointer-events:none;}
.ms-postcard-top{display:flex;justify-content:space-between;align-items:flex-start;
  padding:24px 32px 18px;border-bottom:3px dashed rgba(42,38,34,.22);position:relative;z-index:1;}
.ms-postcard-stamp-strip{display:flex;flex-direction:column;gap:8px;}
.ms-postcard-stamped{display:inline-flex;align-items:center;gap:7px;padding:6px 14px;
  border:2px solid var(--ink);font-family:var(--mono-font);font-size:11px;font-weight:700;
  letter-spacing:.2em;text-transform:uppercase;color:var(--ink);background:rgba(255,255,255,.4);
  transform:rotate(-3deg);align-self:flex-start;}
.ms-postcard-stamped.airmail{background:#fff;border-style:solid;
  background-image:repeating-linear-gradient(45deg,var(--accent) 0,var(--accent) 6px,#fff 6px,#fff 12px,var(--accent4) 12px,var(--accent4) 18px,#fff 18px,#fff 24px);
  background-clip:padding-box;color:transparent;-webkit-text-stroke:0;padding:0;
  border:3px solid var(--ink);width:120px;height:14px;transform:rotate(2deg);}
.ms-postcard-date{font-family:var(--display-font);font-size:18px;color:var(--ink2);font-weight:700;transform:rotate(-1deg);padding-left:6px;}

.ms-postage{width:88px;min-height:108px;border:2.5px dashed var(--ink);padding:8px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
  background:var(--accent);color:#fff;transform:rotate(5deg);position:relative;flex-shrink:0;
  box-shadow:3px 3px 0 rgba(42,38,34,.2);}
.ms-postage::before{content:'';position:absolute;inset:-4px;border:2px dotted var(--ink);pointer-events:none;}
.ms-postage-icon{font-size:26px;line-height:1;}
.ms-postage-text{font-family:var(--mono-font);font-size:9.5px;font-weight:700;letter-spacing:.12em;text-align:center;line-height:1.2;}
.ms-postage-cost{font-family:var(--display-font);font-size:22px;font-weight:700;line-height:1;}

.ms-postcard-body{display:grid;grid-template-columns:1.25fr 1px 1fr;gap:36px;padding:36px;position:relative;z-index:1;}
.ms-postcard-divider{width:2px;background-image:linear-gradient(180deg,rgba(42,38,34,.4) 50%,transparent 50%);
  background-size:2px 9px;background-repeat:repeat-y;}

.ms-postcard-greeting{font-family:var(--display-font);font-size:38px;font-weight:700;color:var(--accent);
  line-height:1;margin-bottom:18px;transform:rotate(-1.5deg);display:inline-block;}
.ms-postcard-message{font-family:var(--display-font);font-size:23px;color:var(--ink);line-height:1.45;margin-bottom:24px;}
.ms-postcard-message strong{background:var(--hl-yellow);padding:0 5px;font-weight:700;border-radius:2px;transform:rotate(-1deg);display:inline-block;}
.ms-postcard-sign-row{display:flex;align-items:center;gap:14px;margin-top:18px;}
.ms-postcard-sign-row .label{font-family:var(--mono-font);font-size:11px;color:var(--ink3);text-transform:uppercase;letter-spacing:.15em;}
.ms-postcard-signature{font-family:var(--display-font);font-size:42px;font-weight:700;color:var(--ink);line-height:1;
  border-bottom:3px solid var(--accent);padding:0 4px 2px;display:inline-block;transform:rotate(-2deg);}

.ms-postcard-right{display:flex;flex-direction:column;gap:18px;}
.ms-postcard-section-label{font-family:var(--mono-font);font-size:10.5px;color:var(--ink2);
  text-transform:uppercase;letter-spacing:.18em;font-weight:700;display:flex;align-items:center;gap:10px;margin-bottom:6px;}
.ms-postcard-section-label::before{content:'';width:24px;height:1.5px;background:var(--ink);}

.ms a.ms-postcard-email,a.ms-postcard-email{display:flex;align-items:center;gap:11px;padding:14px 18px;
  background:var(--ink);color:var(--cream) !important;
  font-family:var(--display-font);font-size:20px;font-weight:700;
  border:2px solid var(--ink);box-shadow:4px 4px 0 var(--accent);transition:all .25s;
  transform:rotate(-1deg);text-decoration:none;word-break:break-all;line-height:1.2;}
.ms a.ms-postcard-email:hover{transform:rotate(0) translateY(-2px);box-shadow:5px 5px 0 var(--accent);}
.ms-postcard-email .stamp{flex-shrink:0;width:28px;height:28px;background:var(--accent);border:1.5px solid var(--cream);
  display:grid;place-items:center;border-radius:4px;}

.ms-postcard-channels{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}
.ms a.ms-postcard-channel,a.ms-postcard-channel{display:flex;align-items:center;gap:8px;padding:10px 14px;background:#fff;
  border:2px solid var(--ink);font-family:var(--display-font);font-size:17px;font-weight:700;color:var(--ink);
  box-shadow:2px 2px 0 rgba(42,38,34,.2);transition:all .15s;transform:rotate(var(--cr,-1deg));text-decoration:none;}
.ms-postcard-channel:nth-child(2n){transform:rotate(1deg);}
.ms-postcard-channel:nth-child(3n){background:var(--hl-yellow);}
.ms-postcard-channel:nth-child(4n){background:var(--hl-pink);}
.ms a.ms-postcard-channel:hover{background:var(--ink);color:var(--cream) !important;transform:rotate(0) translateY(-2px);box-shadow:3px 3px 0 var(--accent);}

.ms-postcard-doodle{position:absolute;font-family:var(--display-font);font-weight:700;color:var(--accent);font-size:20px;
  z-index:2;pointer-events:none;}
.ms-postcard-doodle.d1{top:-32px;left:-18px;transform:rotate(-12deg);}
.ms-postcard-doodle.d2{bottom:-28px;right:24px;transform:rotate(8deg);color:var(--accent3);}

/* paper-clip decoration */
.ms-paperclip{position:absolute;top:-8px;right:64px;width:38px;height:80px;z-index:3;
  border:3px solid var(--ink2);border-radius:18px 18px 6px 6px;border-bottom:none;
  background:transparent;transform:rotate(8deg);}
.ms-paperclip::after{content:'';position:absolute;top:14px;left:50%;transform:translateX(-50%);
  width:18px;height:42px;border:2.5px solid var(--ink2);border-radius:9px 9px 4px 4px;border-bottom:none;background:transparent;}

/* ── Footer ── */
.ms-footer{padding:48px 0 32px;border-top:2px dashed rgba(42,38,34,.18);margin-top:48px;}
.ms-footer-inner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;}
.ms-footer-inner b{font-family:var(--display-font);font-size:18px;color:var(--ink);font-weight:700;}
.ms-footer-inner span{font-family:var(--mono-font);font-size:12.5px;color:var(--ink3);}
.ms-footer-mark{padding:3px 10px;border-radius:6px;background:var(--ink);color:var(--cream);font-weight:700;}

/* Toast */
.ms-toast{position:fixed;bottom:32px;left:50%;transform:translate(-50%,150px);background:var(--ink);color:var(--cream);
  padding:13px 22px;border-radius:999px;font-family:var(--display-font);font-size:17px;font-weight:700;z-index:200;transition:transform .35s cubic-bezier(.2,.7,.3,1);
  box-shadow:0 14px 30px rgba(0,0,0,.3);display:inline-flex;align-items:center;gap:9px;}
.ms-toast.show{transform:translate(-50%,0);}

/* ── Responsive ── */
@media(max-width:1100px){
  .ms-hero-grid{grid-template-columns:1fr;gap:48px;}
  .ms-about{grid-template-columns:1fr;gap:36px;}
  .ms-services{grid-template-columns:repeat(2,1fr);}
  .ms-work{grid-template-columns:1fr!important;gap:32px;}
  .ms-work:nth-child(even) .ms-work-img{order:1;}
  .ms-work:nth-child(even) .ms-work-info{order:2;}
  .ms-test-grid{grid-template-columns:1fr;}
}
@media(max-width:768px){
  .ms-nav-links{display:none;}
  .ms-nav-cta{display:none;}
  .ms-ham{display:flex!important;}
  .ms-hero{padding:24px 0 56px;}
  .ms-sect{padding:64px 0;}
  .ms-services{grid-template-columns:1fr 1fr;gap:18px;}
  .ms-photo-collage{height:380px;}
  .ms-meta-strip{grid-template-columns:1fr;}
  .ms-marquee{margin:0 -22px;}
  .ms-marquee-inner{font-size:24px;gap:24px;}
  .ms-marquee span{gap:24px;}
  .ms-container{padding:0 22px;}

  /* Postcard mobile */
  .ms-postcard{transform:rotate(-.5deg);}
  .ms-postcard-body{grid-template-columns:1fr;gap:24px;padding:24px;}
  .ms-postcard-divider{display:none;}
  .ms-postcard-top{padding:18px 22px 14px;flex-wrap:wrap;gap:14px;}
  .ms-postage{width:74px;min-height:88px;}
  .ms-postage-icon{font-size:22px;}
  .ms-postcard-greeting{font-size:30px;}
  .ms-postcard-message{font-size:19px;}
  .ms-postcard-signature{font-size:32px;}
  .ms a.ms-postcard-email{font-size:17px;padding:12px 14px;}
  .ms-paperclip{display:none;}
}
@media(max-width:480px){
  .ms-services{grid-template-columns:1fr;}
  .ms-hero-actions{flex-direction:column;align-items:stretch;}
  .ms-hero-actions .ms-btn{width:100%;justify-content:center;}
  .ms-container{padding:0 16px;}
  .ms-postcard-channels{grid-template-columns:1fr;}
  .ms-postcard-doodle{display:none;}
}
`;

const HERO_STICKER_LABELS = ['design ✻','strategy ✦','typography ★','illustration ✿','art direction ✸'];

export default function MosaicTemplate({ content: c, hideBranding }: Props) {
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
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
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

  // ── theme overrides ──
  const themeOverride = [
    c.colorBg && `--cream:${c.colorBg};`,
    c.colorBg2 && `--paper:${c.colorBg2};`,
    c.colorText && `--ink:${c.colorText};`,
    c.colorAccent && `--accent:${c.colorAccent};`,
    c.colorAccent2 && `--accent2:${c.colorAccent2};`,
    c.colorAccent3 && `--accent3:${c.colorAccent3};`,
  ].filter(Boolean).join('');

  // ── Content ──
  const name = c.name || 'Sasha Park';
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const role = c.title || c.role || 'Independent Designer';
  const tagline = c.heroTagline || '';
  const bio = c.bio || 'I design **brand identities**, **editorial systems**, and the occasional poster — for studios, founders, and friends who care about the details.';
  const photoUrl = c.photoUrl || '';
  const aboutPhotoUrl = c.aboutPhotoUrl || '';
  const location = c.location || '';
  const yoe = c.yoe || '6';

  const services = pl(c.services);
  const stats = [1,2,3,4].map(i => ({ num: c[`stat${i}Num`], label: c[`stat${i}Label`] })).filter(s => s.num);

  const projects = parseJ<{ title: string; year: string; category: string; image: string; desc: string; stack: string; impact: string; liveUrl: string }[]>(c.projJson, [])
    .map(p => ({ ...p, stack: pl(p.stack) }));

  const testimonials = parseJ<{ quote: string; initials: string; name: string; role: string }[]>(c.testJson, []);

  const heroStickers = pl(c.heroStickers).length > 0 ? pl(c.heroStickers) : HERO_STICKER_LABELS;
  const marqueeItems = pl(c.marqueeItems);

  const navLinks = [
    { label: c.navWorkLabel || 'Work', href: '#work' },
    { label: c.navAboutLabel || 'About', href: '#about' },
    ...(services.length > 0 ? [{ label: c.navServicesLabel || 'What I do', href: '#services' }] : []),
    ...(testimonials.length > 0 ? [{ label: c.navWordsLabel || 'Words', href: '#words' }] : []),
    { label: c.navContactLabel || 'Hello', href: '#contact' },
  ];

  return (
    <div className="ms">
      <style suppressHydrationWarning>{CSS}</style>
      {themeOverride && <style suppressHydrationWarning>{`.ms{${themeOverride}}`}</style>}

      <div className="ms-bg-dots"/>
      <div className="ms-bg-paper"/>

      <div className="ms-wrap">
        {/* ── Nav ── */}
        <nav className={`ms-nav${scrolled ? ' scrolled' : ''}`}>
          <div className="ms-nav-inner">
            <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="ms-logo">
              <span className="ms-logo-mark">{initials.charAt(0)}</span>
              <span className="ms-logo-text">{name.split(' ')[0].toLowerCase()}<span>.</span></span>
            </a>
            <ul className="ms-nav-links" style={{ listStyle: 'none' }}>
              {navLinks.map(l => (
                <li key={l.href}>
                  <span className="ms-nav-link" onClick={e => scrollTo(e as unknown as React.MouseEvent, l.href)}>{l.label}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" onClick={e => scrollTo(e, '#contact')} className="ms-nav-cta">
              {c.navCtaLabel || 'Say hi'} <ArrowIcon/>
            </a>
            <button className="ms-ham" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                {menuOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}
              </svg>
            </button>
          </div>
          <div className={`ms-mobile-menu${menuOpen ? ' open' : ''}`}>
            {navLinks.map(l => (
              <span key={l.href} className="ms-mobile-link" onClick={e => scrollTo(e as unknown as React.MouseEvent, l.href)}>{l.label}</span>
            ))}
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="ms-hero">
          <div className="ms-container">
            <div className="ms-hero-grid">
              <div className="ms-reveal">
                <h1 className="ms-hero-h1">
                  {tagline ? (
                    <>
                      {tagline.split('\n')[0]}<br/>
                      <span className="hand">{tagline.split('\n')[1] || '— with feeling.'}</span>
                    </>
                  ) : (
                    <>
                      Hi, I&apos;m <span className="marker">{name.split(' ')[0]}</span>.<br/>
                      <span className="hand">I make things you&apos;ll love.</span>
                    </>
                  )}
                </h1>

                <p className="ms-hero-bio" dangerouslySetInnerHTML={{ __html: bio.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>

                <div className="ms-hero-actions">
                  <a href="#work" onClick={e => scrollTo(e, '#work')} className="ms-btn ms-btn-primary">
                    {c.heroCtaPrimary || 'See the work'} <ArrowIcon/>
                  </a>
                  {c.resumeUrl && (
                    <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer" className="ms-btn ms-btn-ghost">
                      {c.heroCtaSecondary || 'Grab my CV'}
                    </a>
                  )}
                </div>

                {heroStickers.length > 0 && (
                  <div className="ms-hero-stickers">
                    {heroStickers.slice(0, 5).map((s, i) => (
                      <span key={i} className={`ms-sticker c${(i % 5) + 1}`} style={{ '--rot': `${[-2, 1.5, -1, 2, -1.5][i % 5]}deg` } as React.CSSProperties}>{s}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="ms-reveal" style={{ animationDelay: '.15s', position: 'relative' }}>
                <div className="ms-polaroid-wrap">
                  <div className="ms-pin p1"/>
                  <div className="ms-pin p2"/>
                  <div className="ms-polaroid-img">
                    {photoUrl ? <img src={photoUrl} alt={name}/> : <span>{initials.charAt(0)}</span>}
                  </div>
                  <div className="ms-polaroid-caption">{c.heroPhotoCaption || `— ${name}, ${location || 'somewhere'}`}</div>
                </div>
                <span className="ms-doodle-arrow" style={{ top: -30, left: -40, transform: 'rotate(-20deg)' }}>{c.heroPhotoArrow || "that's me!"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Marquee ── */}
        {marqueeItems.length > 0 && (
          <div className="ms-marquee">
            <div className="ms-marquee-inner">
              {[...Array(2)].flatMap((_, k) =>
                marqueeItems.map((item, i) => (
                  <span key={`${k}-${i}`}>{item} <em>·</em></span>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── ABOUT ── */}
        <section className="ms-sect" id="about">
          <div className="ms-container">
            <div className="ms-about">
              <div className="ms-reveal">
                <div className="ms-photo-collage">
                  <div className="ms-photo-1">
                    <div className="ms-photo-inner">
                      {aboutPhotoUrl ? <img src={aboutPhotoUrl} alt="about"/> : photoUrl ? <img src={photoUrl} alt="about"/> : <span>{initials.charAt(0)}</span>}
                    </div>
                  </div>
                  <div className="ms-photo-2">
                    <div className="ms-photo-inner"/>
                  </div>
                  <div className="ms-photo-stickynote">{c.aboutStickyNote || 'always sketching first.'}</div>
                </div>
              </div>

              <div className="ms-reveal" style={{ animationDelay: '.1s' }}>
                <div className="ms-sect-num">{c.aboutSectionLabel || '01 · About'}</div>
                <h2 className="ms-sect-title">
                  {c.aboutHeading || 'A little'} {c.aboutHeadingHand && <span className="hand">{c.aboutHeadingHand}</span>}
                </h2>
                <p className="ms-about-text"
                  dangerouslySetInnerHTML={{ __html: (c.aboutPara1 || `I'm a designer based in ${location || 'the studio'} with **${yoe}+ years** of practice across brand, editorial, and product. I love making things by hand and refining them on screen.`).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
                {c.aboutPara2 && <p className="ms-about-text" dangerouslySetInnerHTML={{ __html: c.aboutPara2.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>}

                <div className="ms-meta-strip">
                  {location && (
                    <div className="ms-meta-item">
                      <div className="ms-meta-label">{c.metaLocationLabel || 'Based in'}</div>
                      <div className="ms-meta-value">{location}</div>
                    </div>
                  )}
                  <div className="ms-meta-item">
                    <div className="ms-meta-label">{c.metaPracticeLabel || 'Practice'}</div>
                    <div className="ms-meta-value">{yoe}+ {c.metaPracticeSuffix || 'years'}</div>
                  </div>
                  {c.education && (
                    <div className="ms-meta-item">
                      <div className="ms-meta-label">{c.metaEducationLabel || 'Studied'}</div>
                      <div className="ms-meta-value">{c.education}</div>
                    </div>
                  )}
                  {c.languages && (
                    <div className="ms-meta-item">
                      <div className="ms-meta-label">{c.metaLanguagesLabel || 'Speaks'}</div>
                      <div className="ms-meta-value">{c.languages}</div>
                    </div>
                  )}
                  {stats.slice(0, 4).map((s, i) => (
                    <div key={i} className="ms-meta-item">
                      <div className="ms-meta-label">{s.label}</div>
                      <div className="ms-meta-value">{s.num}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        {services.length > 0 && (
          <section className="ms-sect" id="services">
            <div className="ms-container">
              <div className="ms-reveal">
                <div className="ms-sect-num">{c.servicesSectionLabel || '02 · What I do'}</div>
                <h2 className="ms-sect-title">
                  {c.servicesHeadingMarker && <span className="marker">{c.servicesHeadingMarker}</span>}
                  {c.servicesHeadingMarker && c.servicesHeading ? ' ' : ''}
                  {c.servicesHeading || (!c.servicesHeadingMarker ? <><span className="marker">Services</span> on offer.</> : '')}
                </h2>
                <p className="ms-sect-sub">{c.servicesSub || 'A few of the things I help studios, founders, and teams make.'}</p>
              </div>
              <div className="ms-services">
                {services.slice(0, 8).map((s, i) => (
                  <div key={i} className="ms-service ms-reveal" style={{ animationDelay: `${i * .05}s` }}>
                    <div className="ms-service-num">{(c.servicesItemPrefix || 'SVC')} / 0{i + 1}</div>
                    <div className="ms-service-title">{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── WORK ── */}
        <section className="ms-sect" id="work">
          <div className="ms-container">
            <div className="ms-reveal">
              <div className="ms-sect-num">{c.workSectionLabel || '03 · Selected work'}</div>
              <h2 className="ms-sect-title">
                {c.workHeading || "Things I've"} {c.workHeadingHand && <span className="hand">{c.workHeadingHand}</span>}
                {!c.workHeading && !c.workHeadingHand && <span className="hand">made.</span>}
              </h2>
              <p className="ms-sect-sub">{c.projSub || 'A handful of recent projects across brand, editorial, and product. More on request.'}</p>
            </div>

            {projects.length === 0 ? (
              <div style={{ padding: 56, textAlign: 'center', border: '2px dashed rgba(42,38,34,.2)', borderRadius: 18, marginTop: 40, color: 'var(--ink3)', fontFamily: 'var(--display-font)', fontSize: 22 }}>
                {c.workEmptyText || 'No projects yet — add your work from the dashboard ✦'}
              </div>
            ) : (
              <div className="ms-work-grid">
                {projects.slice(0, 6).map((p, i) => (
                  <article key={i} className="ms-work ms-reveal" style={{ animationDelay: `${i * .08}s` }}>
                    <div className="ms-work-img-wrap">
                      <div className="ms-work-img">
                        <div className="ms-work-img-inner">
                          {p.image ? <img src={p.image} alt={p.title}/> : <span>{['🎨','✨','📐','🌸','💎','📦'][i % 6]}</span>}
                        </div>
                      </div>
                      {p.impact && <span className="ms-work-tag">✦ {p.impact}</span>}
                    </div>
                    <div className="ms-work-info">
                      <div className="ms-work-num">{(c.workItemPrefix || 'PROJECT')} · 0{i + 1}</div>
                      <h3 className="ms-work-title"><span className="mark">{p.title}</span></h3>
                      <p className="ms-work-desc">{p.desc}</p>
                      <div className="ms-work-meta">
                        {p.category && <span>{c.workMetaTypeLabel || 'Type'} · <b>{p.category}</b></span>}
                        {p.year && <span>{c.workMetaYearLabel || 'Year'} · <b>{p.year}</b></span>}
                      </div>
                      {p.stack.length > 0 && (
                        <div className="ms-work-tags">
                          {p.stack.map((s, j) => <span key={j} className="ms-work-tag-chip">{s}</span>)}
                        </div>
                      )}
                      {p.liveUrl ? (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="ms-work-link">
                          {c.workLinkLabel || 'Open case study'} <ExtIcon/>
                        </a>
                      ) : (
                        <span className="ms-work-link disabled">{c.workLinkLabelEmpty || 'Case study'} <ExtIcon/></span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        {testimonials.length > 0 && (
          <section className="ms-sect" id="words">
            <div className="ms-container">
              <div className="ms-reveal">
                <div className="ms-sect-num">{c.testimonialsSectionLabel || '04 · Words'}</div>
                <h2 className="ms-sect-title">
                  {c.testimonialsHeading || 'Kind'} {c.testimonialsHeadingHand && <span className="hand">{c.testimonialsHeadingHand}</span>}
                  {!c.testimonialsHeading && !c.testimonialsHeadingHand && <span className="hand">words.</span>}
                </h2>
                <p className="ms-sect-sub">{c.testimonialsSub || 'A few notes from the people I\'ve had the joy of making things with.'}</p>
              </div>
              <div className="ms-test-grid">
                {testimonials.slice(0, 4).map((t, i) => (
                  <div key={i} className="ms-test ms-reveal" style={{ animationDelay: `${i * .08}s` }}>
                    <div className="ms-test-mark">&ldquo;</div>
                    <p className="ms-test-quote">{t.quote}</p>
                    <div className="ms-test-author">
                      <div className="ms-test-avi">{t.initials || (t.name || 'XX').slice(0, 2).toUpperCase()}</div>
                      <div className="ms-test-meta">
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

        {/* ── CONTACT — Postcard ── */}
        <section className="ms-sect" id="contact">
          <div className="ms-container">
            <div className="ms-postcard-wrap ms-reveal">
              {c.postcardDoodle1 && <span className="ms-postcard-doodle d1">{c.postcardDoodle1}</span>}
              {c.postcardDoodle2 && <span className="ms-postcard-doodle d2">{c.postcardDoodle2}</span>}

              <div className="ms-postcard">
                <div className="ms-paperclip"/>

                {/* Top bar — stamps & postage */}
                <div className="ms-postcard-top">
                  <div className="ms-postcard-stamp-strip">
                    <div className="ms-postcard-stamped">{c.postcardStampLabel || '★ Postcard · No. 01'}</div>
                    <div className="ms-postcard-stamped airmail" aria-hidden="true"/>
                    <div className="ms-postcard-date">{c.postcardDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <div className="ms-postage">
                    <span className="ms-postage-cost">{c.postcardCost || '$1'}</span>
                    <span className="ms-postage-icon">✉</span>
                    <span className="ms-postage-text" dangerouslySetInnerHTML={{ __html: (c.postcardClassLabel || 'FIRST CLASS').replace(' ', '<br/>') }}/>
                  </div>
                </div>

                {/* Body — letter & contact details */}
                <div className="ms-postcard-body">
                  {/* Left: handwritten letter */}
                  <div>
                    <div className="ms-postcard-greeting">{c.postcardGreeting || 'Hi there,'}</div>
                    <p className="ms-postcard-message" dangerouslySetInnerHTML={{
                      __html: (c.contactSub || "I'd love to hear about your **project** — the brief, the timing, and what you're hoping to make. Pop me a line and let's get started.").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}/>
                    <div className="ms-postcard-sign-row">
                      <span className="label">{c.postcardSignLabel || '— signed,'}</span>
                      <span className="ms-postcard-signature">{c.postcardSignature || name.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="ms-postcard-divider"/>

                  {/* Right: address card */}
                  <div className="ms-postcard-right">
                    <div className="ms-postcard-section-label">{c.postcardReachLabel || 'Reach me at'}</div>
                    {c.contactEmail && (
                      <a href={`mailto:${c.contactEmail}`} className="ms-postcard-email">
                        <span className="stamp"><MailIcon/></span>
                        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.contactEmail}</span>
                      </a>
                    )}

                    {(c.instagramUrl || c.behanceUrl || c.dribbbleUrl || c.linkedinUrl || c.twitterUrl) && (
                      <>
                        <div className="ms-postcard-section-label" style={{ marginTop: 6 }}>{c.postcardFindLabel || 'Or find me'}</div>
                        <div className="ms-postcard-channels">
                          {c.instagramUrl && <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="ms-postcard-channel"><InstaIcon/> Instagram</a>}
                          {c.behanceUrl && <a href={c.behanceUrl} target="_blank" rel="noopener noreferrer" className="ms-postcard-channel"><BeIcon/> Behance</a>}
                          {c.dribbbleUrl && <a href={c.dribbbleUrl} target="_blank" rel="noopener noreferrer" className="ms-postcard-channel"><DribIcon/> Dribbble</a>}
                          {c.linkedinUrl && <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="ms-postcard-channel"><LiIcon/> LinkedIn</a>}
                          {c.twitterUrl && <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer" className="ms-postcard-channel"><TwIcon/> Twitter</a>}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="ms-footer">
          <div className="ms-container">
            <div className="ms-footer-inner">
              <b>{c.footerLabel || `${name} — Studio`}</b>
              <span>
                © {new Date().getFullYear()} · {!hideBranding && <>Powered by <span className="ms-footer-mark">FolioForge</span> · </>}{c.footerVersion || 'Mosaic v1.0'}
              </span>
            </div>
          </div>
        </footer>
      </div>

      <div className={`ms-toast${toastShow ? ' show' : ''}`}>{toastMsg}</div>
    </div>
  );
}
