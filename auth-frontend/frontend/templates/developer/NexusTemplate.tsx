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
const FolderIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>;
const ChevronIcon = ({ open }: { open: boolean }) => <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .15s' }}><path d="M9 6l6 6-6 6"/></svg>;
const FileIcon = ({ color = '#6b7280' }: { color?: string }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>;
const CloseTabIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const GitIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M9 6h6M6 9v6"/></svg>;
const ExplorerIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>;
const TerminalIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
const BugIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="8" y="6" width="8" height="14" rx="4"/><path d="M2 12h4M18 12h4M5 7l3 3M19 7l-3 3M5 17l3-3M19 17l-3-3"/></svg>;
const GhIcon = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>;
const LiIcon = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const TwIcon = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const MailIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
const ExtIcon = () => <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>;
const CmdIcon = () => <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2v-4a3 3 0 116 0v6zM9 3h6v6H9zM21 9v6a3 3 0 11-6 0V9h6zM3 9V5a2 2 0 012-2h4v6H5a2 2 0 01-2-2z"/></svg>;

// ── CSS ──
const CSS = `
.nx{--bg:#0d1117;--bg2:#161b22;--bg3:#1c2230;--bdr:#21262d;--bdrs:#30363d;
  --tx:#e6edf3;--tx2:#9ca3af;--tx3:#6b7280;
  --acc:#58a6ff;--acc2:#79c0ff;--grn:#3fb950;--ylw:#d29922;--rd:#f85149;
  --pur:#bc8cff;--cy:#39d0d8;--or:#ffa657;--pnk:#ff7b72;
  --shx:0 8px 24px rgba(0,0,0,.4);
  font-family:'Inter','SF Pro Display',system-ui,sans-serif;background:var(--bg);color:var(--tx);
  min-height:100vh;font-size:14px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
.nx *{box-sizing:border-box;margin:0;padding:0;}
.nx a{color:inherit;text-decoration:none;}
.nx button{font:inherit;cursor:pointer;border:none;background:none;color:inherit;}
.nx-mono{font-family:'JetBrains Mono','Fira Code',ui-monospace,monospace;}
@keyframes nx-blink{50%{opacity:0}}
@keyframes nx-pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes nx-glow{0%,100%{box-shadow:0 0 0 0 rgba(88,166,255,.0)}50%{box-shadow:0 0 0 8px rgba(88,166,255,.18)}}
@keyframes nx-typing{from{width:0}to{width:100%}}
@keyframes nx-slidein{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes nx-prl-up{0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1}}

/* ── Top Title Bar ── */
.nx-titlebar{height:34px;background:#0a0e14;border-bottom:1px solid var(--bdr);
  display:flex;align-items:center;padding:0 14px;font-size:12px;color:var(--tx2);gap:10px;
  position:sticky;top:0;z-index:50;}
.nx-dots{display:flex;gap:7px;align-items:center;}
.nx-dots span{width:11px;height:11px;border-radius:50%;display:block;}
.nx-dots .d1{background:#ff5f56;}.nx-dots .d2{background:#ffbd2e;}.nx-dots .d3{background:#27c93f;}
.nx-titlebar-center{flex:1;text-align:center;font-family:'JetBrains Mono',monospace;font-size:12px;}
.nx-titlebar-center b{color:var(--tx);font-weight:500;}
.nx-titlebar-right{display:flex;align-items:center;gap:14px;font-family:'JetBrains Mono',monospace;font-size:11px;}
.nx-online{display:inline-flex;align-items:center;gap:6px;color:var(--grn);}
.nx-online::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--grn);animation:nx-pulse 2s infinite;}

/* ── Main layout ── */
.nx-layout{display:grid;grid-template-columns:48px 240px 1fr;min-height:calc(100vh - 34px);}

/* Activity bar */
.nx-activity{background:#0a0e14;border-right:1px solid var(--bdr);
  display:flex;flex-direction:column;align-items:center;padding:8px 0;gap:4px;}
.nx-act-btn{width:32px;height:32px;border-radius:6px;color:var(--tx3);
  display:grid;place-items:center;transition:all .15s;position:relative;}
.nx-act-btn:hover{color:var(--tx);background:var(--bg2);}
.nx-act-btn.active{color:var(--tx);}
.nx-act-btn.active::before{content:'';position:absolute;left:-8px;top:6px;bottom:6px;width:2px;
  background:var(--acc);border-radius:2px;}
.nx-act-spacer{flex:1;}

/* Sidebar */
.nx-sidebar{background:#0e1320;border-right:1px solid var(--bdr);overflow-y:auto;display:flex;flex-direction:column;}
.nx-sb-head{padding:11px 14px 7px;font-size:10.5px;font-weight:600;color:var(--tx3);
  text-transform:uppercase;letter-spacing:.1em;font-family:'JetBrains Mono',monospace;
  display:flex;justify-content:space-between;align-items:center;}
.nx-sb-tree{flex:1;padding:0 4px 14px;}
.nx-sb-folder{padding:5px 10px;font-size:13px;color:var(--tx);cursor:pointer;
  display:flex;align-items:center;gap:6px;border-radius:4px;transition:background .12s;
  font-family:'JetBrains Mono',monospace;}
.nx-sb-folder:hover{background:var(--bg2);}
.nx-sb-folder-name{font-weight:500;font-size:12.5px;}
.nx-sb-folder-cnt{margin-left:auto;font-size:10.5px;color:var(--tx3);}
.nx-sb-files{padding-left:22px;display:flex;flex-direction:column;gap:1px;margin-bottom:4px;}
.nx-sb-file{padding:5px 8px;border-radius:4px;cursor:pointer;font-size:12.5px;
  display:flex;align-items:center;gap:7px;color:var(--tx2);transition:all .12s;
  font-family:'JetBrains Mono',monospace;}
.nx-sb-file:hover{background:var(--bg2);color:var(--tx);}
.nx-sb-file.active{background:rgba(88,166,255,.12);color:var(--tx);}
.nx-sb-file-mod{margin-left:auto;color:var(--ylw);font-size:11px;}
.nx-sb-footer{padding:10px 14px;border-top:1px solid var(--bdr);display:flex;flex-direction:column;gap:7px;}
.nx-sb-stat{display:flex;justify-content:space-between;font-size:11px;
  font-family:'JetBrains Mono',monospace;color:var(--tx3);}
.nx-sb-stat b{color:var(--acc2);font-weight:600;}

/* Main content area */
.nx-main{display:flex;flex-direction:column;overflow:hidden;background:var(--bg);}

/* Tab bar */
.nx-tabs{display:flex;background:#0e1320;border-bottom:1px solid var(--bdr);
  overflow-x:auto;scrollbar-width:thin;flex-shrink:0;height:36px;}
.nx-tab{padding:0 14px;height:100%;display:inline-flex;align-items:center;gap:8px;
  font-size:12.5px;color:var(--tx2);border-right:1px solid var(--bdr);
  cursor:pointer;font-family:'JetBrains Mono',monospace;
  transition:background .12s;white-space:nowrap;position:relative;}
.nx-tab:hover{background:var(--bg2);color:var(--tx);}
.nx-tab.active{background:var(--bg);color:var(--tx);}
.nx-tab.active::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;background:var(--acc);}
.nx-tab-close{width:16px;height:16px;border-radius:3px;display:grid;place-items:center;
  opacity:.4;transition:opacity .12s,background .12s;}
.nx-tab:hover .nx-tab-close{opacity:1;}
.nx-tab-close:hover{background:var(--bdrs);}
.nx-tab-dot{width:6px;height:6px;border-radius:50%;background:var(--acc);display:none;}
.nx-tab.modified .nx-tab-dot{display:inline-block;}

/* Breadcrumb */
.nx-breadcrumb{padding:6px 16px;border-bottom:1px solid var(--bdr);font-size:11.5px;
  color:var(--tx3);font-family:'JetBrains Mono',monospace;
  display:flex;align-items:center;gap:6px;background:var(--bg);flex-shrink:0;}
.nx-breadcrumb span.sep{opacity:.5;}
.nx-breadcrumb span.cur{color:var(--tx2);}

/* Editor area */
.nx-editor{flex:1;overflow-y:auto;padding:0 0 80px;position:relative;}
.nx-editor-pane{display:flex;}
.nx-gutter{width:54px;padding:24px 0;text-align:right;color:var(--tx3);
  font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.8;
  flex-shrink:0;user-select:none;background:var(--bg);position:sticky;left:0;}
.nx-content{flex:1;padding:24px 28px;font-family:'JetBrains Mono',monospace;font-size:13.5px;line-height:1.8;
  animation:nx-slidein .35s ease;}

/* Syntax highlighting */
.tk-key{color:var(--pnk);}
.tk-str{color:var(--acc2);}
.tk-num{color:var(--or);}
.tk-cmt{color:#6b7280;font-style:italic;}
.tk-fn{color:var(--pur);}
.tk-var{color:var(--cy);}
.tk-bool{color:var(--or);}
.tk-tag{color:var(--pnk);}
.tk-attr{color:var(--acc2);}
.tk-op{color:#ff7b72;}
.tk-mute{color:var(--tx3);}

/* Hero section (README) */
.nx-hero{padding:8px 0;}
.nx-hero-prompt{display:flex;align-items:center;gap:8px;margin-bottom:32px;
  font-family:'JetBrains Mono',monospace;font-size:12.5px;color:var(--tx3);}
.nx-hero-prompt b{color:var(--grn);}
.nx-hero-cursor{display:inline-block;width:8px;height:14px;background:var(--acc);margin-left:2px;
  animation:nx-blink 1.1s steps(1) infinite;vertical-align:middle;}

.nx-hero-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:34px;align-items:flex-start;}
.nx-hero-name{font-family:'Inter',sans-serif;font-size:42px;font-weight:800;letter-spacing:-.03em;
  line-height:1.05;background:linear-gradient(135deg,#fff 30%,var(--acc));
  -webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:14px;}
.nx-hero-role{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--tx2);
  margin-bottom:22px;padding:7px 12px;background:var(--bg2);border:1px solid var(--bdr);
  border-radius:6px;display:inline-flex;align-items:center;gap:8px;}
.nx-hero-role::before{content:'>';color:var(--grn);font-weight:600;}
.nx-hero-bio{font-family:'Inter',sans-serif;font-size:16px;color:var(--tx2);
  line-height:1.7;margin-bottom:24px;max-width:54ch;}
.nx-hero-bio strong{color:var(--tx);font-weight:600;background:linear-gradient(180deg,transparent 60%,rgba(88,166,255,.2) 60%);padding:0 3px;}
.nx-cta-row{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:30px;}
.nx-cta{padding:9px 18px;border-radius:6px;font-size:13.5px;font-weight:500;
  display:inline-flex;align-items:center;gap:9px;transition:all .15s;border:1px solid transparent;
  font-family:'Inter',sans-serif;cursor:pointer;}
.nx-cta-primary{background:var(--acc);color:#0a0e14;font-weight:600;}
.nx-cta-primary:hover{background:var(--acc2);transform:translateY(-1px);box-shadow:0 6px 14px -4px rgba(88,166,255,.4);}
.nx-cta-ghost{background:var(--bg2);color:var(--tx);border-color:var(--bdr);}
.nx-cta-ghost:hover{border-color:var(--bdrs);background:var(--bg3);}

.nx-info-card{background:var(--bg2);border:1px solid var(--bdr);border-radius:10px;
  padding:18px;font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:2;
  position:sticky;top:80px;}
.nx-info-row{display:flex;align-items:center;gap:8px;}
.nx-info-key{color:var(--pnk);min-width:78px;}
.nx-info-val{color:var(--acc2);}
.nx-info-val.mut{color:var(--tx2);}
.nx-info-divider{border-top:1px dashed var(--bdr);margin:10px 0;}

.nx-hero-photo-wrap{margin-bottom:18px;border:1px solid var(--bdr);border-radius:10px;overflow:hidden;
  background:linear-gradient(135deg,var(--bg2),var(--bg3));aspect-ratio:1;display:grid;place-items:center;position:relative;}
.nx-hero-photo-wrap img{width:100%;height:100%;object-fit:cover;}
.nx-hero-photo-init{font-family:'JetBrains Mono',monospace;font-size:64px;font-weight:700;
  background:linear-gradient(135deg,var(--acc),var(--pur));-webkit-background-clip:text;background-clip:text;color:transparent;}
.nx-hero-photo-wrap::after{content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 70%,rgba(0,0,0,.4));pointer-events:none;}

.nx-stats-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:30px;}
.nx-stat{background:var(--bg2);border:1px solid var(--bdr);border-radius:8px;padding:12px 14px;
  transition:all .2s;}
.nx-stat:hover{border-color:var(--acc);transform:translateY(-2px);}
.nx-stat-num{font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;
  color:var(--acc2);letter-spacing:-.02em;}
.nx-stat-lbl{font-size:11.5px;color:var(--tx3);margin-top:2px;}

/* Section header style */
.nx-sect{padding:48px 0 12px;}
.nx-sect-head{margin-bottom:24px;padding-bottom:14px;border-bottom:1px solid var(--bdr);}
.nx-sect-tag{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--tx3);margin-bottom:6px;
  display:inline-flex;align-items:center;gap:6px;}
.nx-sect-tag::before{content:'//';color:var(--grn);font-weight:600;}
.nx-sect-title{font-family:'Inter',sans-serif;font-size:26px;font-weight:700;letter-spacing:-.02em;color:var(--tx);}
.nx-sect-title .at{color:var(--acc);font-weight:500;}

/* Skills (skills.json) */
.nx-json{font-family:'JetBrains Mono',monospace;font-size:13.5px;line-height:1.95;}
.nx-json-bracket{color:var(--tx3);}
.nx-json-row{padding-left:22px;display:flex;align-items:flex-start;flex-wrap:wrap;gap:8px 4px;}
.nx-skill-chips{display:flex;flex-wrap:wrap;gap:6px;}
.nx-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;
  background:var(--bg2);border:1px solid var(--bdr);border-radius:5px;font-size:12px;
  color:var(--tx);transition:all .15s;cursor:default;
  font-family:'JetBrains Mono',monospace;}
.nx-chip::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--grn);box-shadow:0 0 6px var(--grn);}
.nx-chip:hover{border-color:var(--acc);background:var(--bg3);transform:translateY(-1px);}
.nx-chip.learn::before{background:var(--ylw);box-shadow:0 0 6px var(--ylw);}

.nx-tools-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px;
  padding-left:22px;}
.nx-tool{background:var(--bg2);border:1px solid var(--bdr);border-radius:8px;padding:14px;
  display:flex;align-items:center;gap:12px;transition:all .18s;}
.nx-tool:hover{border-color:var(--acc);transform:translateY(-2px);}
.nx-tool-ico{width:38px;height:38px;border-radius:8px;background:var(--bg3);
  display:grid;place-items:center;color:var(--acc2);flex-shrink:0;overflow:hidden;
  font-family:'JetBrains Mono',monospace;font-weight:700;font-size:15px;}
.nx-tool-ico img{width:100%;height:100%;object-fit:contain;padding:6px;}
.nx-tool-name{font-size:13px;font-weight:600;color:var(--tx);}
.nx-tool-ctx{font-size:11.5px;color:var(--tx3);font-family:'JetBrains Mono',monospace;margin-top:2px;}

/* Experience timeline (experience.tsx) */
.nx-code-block{background:var(--bg2);border:1px solid var(--bdr);border-radius:10px;
  padding:0;overflow:hidden;font-family:'JetBrains Mono',monospace;}
.nx-code-bar{padding:8px 14px;background:var(--bg3);border-bottom:1px solid var(--bdr);
  display:flex;align-items:center;gap:10px;font-size:11.5px;color:var(--tx3);}
.nx-code-bar-name{font-weight:500;color:var(--tx2);}
.nx-code-body{padding:18px 22px;font-size:13px;line-height:1.85;overflow-x:auto;}

.nx-exp-list{display:flex;flex-direction:column;gap:18px;}
.nx-exp-card{background:var(--bg2);border:1px solid var(--bdr);border-radius:10px;
  padding:18px 22px;transition:all .2s;position:relative;overflow:hidden;}
.nx-exp-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:linear-gradient(180deg,var(--acc),transparent);}
.nx-exp-card.current::before{background:var(--grn);}
.nx-exp-card:hover{border-color:var(--bdrs);transform:translateX(4px);}
.nx-exp-head{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;
  padding-bottom:10px;margin-bottom:12px;border-bottom:1px dashed var(--bdr);}
.nx-exp-role{font-family:'Inter',sans-serif;font-size:16px;font-weight:600;color:var(--tx);}
.nx-exp-co{color:var(--acc2);font-weight:500;}
.nx-exp-tag{font-size:13px;color:var(--tx2);margin-top:4px;line-height:1.5;}
.nx-exp-period{font-family:'JetBrains Mono',monospace;font-size:11.5px;
  background:var(--bg3);border:1px solid var(--bdr);border-radius:999px;
  padding:4px 11px;color:var(--ylw);display:inline-flex;align-items:center;gap:6px;height:fit-content;}
.nx-exp-period.now{color:var(--grn);}
.nx-exp-period.now::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--grn);animation:nx-pulse 2s infinite;}
.nx-exp-bullets{list-style:none;display:flex;flex-direction:column;gap:7px;}
.nx-exp-bullets li{font-family:'Inter',sans-serif;font-size:13.5px;color:var(--tx);
  padding-left:22px;position:relative;line-height:1.55;}
.nx-exp-bullets li::before{content:'▸';position:absolute;left:6px;color:var(--acc);}
.nx-exp-bullets li b{color:var(--acc2);font-weight:600;background:rgba(88,166,255,.1);padding:0 4px;border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:12.5px;}
.nx-exp-stack{display:flex;flex-wrap:wrap;gap:5px;margin-top:14px;padding-top:12px;border-top:1px dashed var(--bdr);}
.nx-exp-stack span{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--tx2);
  padding:2px 8px;background:var(--bg3);border:1px solid var(--bdr);border-radius:4px;}

/* Projects */
.nx-proj-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;}
.nx-proj{background:var(--bg2);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;
  transition:all .25s;display:flex;flex-direction:column;}
.nx-proj:hover{border-color:var(--acc);transform:translateY(-3px);box-shadow:var(--shx);}
.nx-proj-hdr{padding:11px 14px;background:var(--bg3);border-bottom:1px solid var(--bdr);
  display:flex;align-items:center;gap:10px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--tx2);}
.nx-proj-circles{display:flex;gap:5px;}
.nx-proj-circles span{width:9px;height:9px;border-radius:50%;}
.nx-proj-circles span:nth-child(1){background:#ff5f56;}
.nx-proj-circles span:nth-child(2){background:#ffbd2e;}
.nx-proj-circles span:nth-child(3){background:#27c93f;}
.nx-proj-name{flex:1;text-align:center;font-size:11.5px;}
.nx-proj-yr{font-size:11px;color:var(--tx3);}
.nx-proj-visual{height:140px;position:relative;display:grid;place-items:center;overflow:hidden;}
.nx-proj-visual::before{content:'';position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:18px 18px;}
.nx-proj-emoji{font-size:48px;filter:drop-shadow(0 6px 12px rgba(0,0,0,.4));position:relative;z-index:1;}
.nx-proj-impact{position:absolute;bottom:10px;left:12px;background:rgba(0,0,0,.6);
  border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(6px);
  padding:4px 9px;border-radius:5px;font-family:'JetBrains Mono',monospace;font-size:11px;
  color:#fff;display:inline-flex;align-items:center;gap:5px;z-index:2;}
.nx-proj-body{padding:16px;display:flex;flex-direction:column;gap:10px;flex:1;}
.nx-proj-title{font-family:'Inter',sans-serif;font-size:16px;font-weight:600;color:var(--tx);}
.nx-proj-desc{font-size:13px;color:var(--tx2);line-height:1.55;}
.nx-proj-stack{display:flex;flex-wrap:wrap;gap:5px;}
.nx-proj-stack span{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--acc2);
  padding:2px 7px;background:rgba(88,166,255,.08);border:1px solid rgba(88,166,255,.18);border-radius:4px;}
.nx-proj-chal{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--tx2);
  padding:8px 11px;background:var(--bg3);border-left:2.5px solid var(--ylw);border-radius:0 5px 5px 0;line-height:1.5;font-style:normal;}
.nx-proj-chal b{color:var(--ylw);font-weight:700;text-transform:uppercase;font-size:10px;letter-spacing:.08em;margin-right:5px;}
.nx-proj-actions{display:flex;gap:8px;margin-top:auto;padding-top:6px;}
.nx-proj-btn{flex:1;padding:7px 11px;border-radius:5px;font-size:12px;font-weight:500;
  display:inline-flex;align-items:center;justify-content:center;gap:6px;
  font-family:'JetBrains Mono',monospace;transition:all .12s;border:1px solid var(--bdr);
  background:var(--bg3);color:var(--tx);}
.nx-proj-btn.solid{background:var(--acc);color:#0a0e14;border-color:var(--acc);font-weight:600;}
.nx-proj-btn:hover{transform:translateY(-1px);border-color:var(--acc);}
.nx-proj-btn.disabled{opacity:.35;cursor:default;pointer-events:none;}

.nx-show-more{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:6px;
  background:var(--bg2);border:1px solid var(--bdr);color:var(--tx);
  font-family:'JetBrains Mono',monospace;font-size:12px;cursor:pointer;transition:all .15s;}
.nx-show-more:hover{border-color:var(--acc);color:var(--acc2);}

/* Testimonials (refs.md) */
.nx-test-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
.nx-test{background:var(--bg2);border:1px solid var(--bdr);border-radius:10px;padding:18px;
  transition:all .2s;position:relative;}
.nx-test::before{content:'/*';position:absolute;top:8px;left:14px;font-family:'JetBrains Mono',monospace;
  color:var(--tx3);font-size:11px;}
.nx-test::after{content:'*/';position:absolute;bottom:8px;right:14px;font-family:'JetBrains Mono',monospace;
  color:var(--tx3);font-size:11px;}
.nx-test:hover{border-color:var(--acc);transform:translateY(-2px);}
.nx-test p{font-family:'Inter',sans-serif;font-size:14px;color:var(--tx);line-height:1.65;
  font-style:italic;margin:14px 0;}
.nx-test-author{display:flex;align-items:center;gap:11px;padding-top:12px;border-top:1px dashed var(--bdr);}
.nx-test-avi{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--acc),var(--pur));
  display:grid;place-items:center;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;color:#fff;flex-shrink:0;}
.nx-test-meta{font-size:12.5px;line-height:1.4;}
.nx-test-meta b{color:var(--tx);font-weight:600;display:block;}
.nx-test-meta span{color:var(--tx3);font-family:'JetBrains Mono',monospace;font-size:11.5px;}

/* Contact (contact.sh) */
.nx-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.nx-contact-card{background:var(--bg2);border:1px solid var(--bdr);border-radius:10px;padding:22px;
  min-width:0;overflow:hidden;}
.nx-contact-term{font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.95;word-break:break-word;}
.nx-prompt{color:var(--grn);}
.nx-prompt::before{content:'$ ';}
.nx-out{color:var(--tx2);padding-left:14px;}
.nx-out.success{color:var(--grn);}
.nx-out.warn{color:var(--ylw);}
.nx-contact-icons{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:14px;}
.nx-contact-link{padding:11px 14px;border-radius:7px;background:var(--bg3);border:1px solid var(--bdr);
  display:flex;align-items:center;gap:10px;font-size:13px;color:var(--tx);transition:all .15s;min-width:0;}
.nx-contact-link:hover{border-color:var(--acc);background:rgba(88,166,255,.08);}
.nx-contact-link .label{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--tx3);flex-shrink:0;}
.nx-contact-link .val{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--acc2);
  min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.nx-form{display:flex;flex-direction:column;gap:11px;}
.nx-form-field{display:flex;flex-direction:column;gap:5px;}
.nx-form-field label{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx3);
  text-transform:uppercase;letter-spacing:.08em;}
.nx-form-field input, .nx-form-field textarea{padding:9px 12px;background:var(--bg);border:1px solid var(--bdr);
  border-radius:6px;color:var(--tx);font-family:'JetBrains Mono',monospace;font-size:13px;outline:none;
  transition:border-color .15s;}
.nx-form-field input:focus, .nx-form-field textarea:focus{border-color:var(--acc);}
.nx-form-field textarea{resize:vertical;min-height:80px;}
.nx-form-submit{align-self:flex-start;padding:9px 18px;background:var(--acc);color:#0a0e14;
  font-family:'JetBrains Mono',monospace;font-size:12.5px;font-weight:700;border-radius:6px;cursor:pointer;
  transition:all .15s;}
.nx-form-submit:hover{background:var(--acc2);transform:translateY(-1px);}

/* ── Status bar (bottom) ── */
.nx-statusbar{position:fixed;bottom:0;left:0;right:0;height:24px;
  background:#0a0e14;border-top:1px solid var(--bdr);display:flex;align-items:center;
  padding:0 14px;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--tx2);gap:14px;z-index:40;
  overflow-x:auto;overflow-y:hidden;scrollbar-width:none;}
.nx-statusbar::-webkit-scrollbar{display:none;}
.nx-sb-item{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;flex-shrink:0;}
.nx-sb-item.acc{color:var(--acc2);}
.nx-sb-item.grn{color:var(--grn);}
.nx-sb-spacer{flex:1;min-width:8px;}
.nx-sb-pill{background:var(--acc);color:#0a0e14;padding:1px 8px;border-radius:3px;font-weight:600;flex-shrink:0;}

/* Toast */
.nx-toast{position:fixed;bottom:38px;right:18px;background:var(--bg3);border:1px solid var(--acc);
  padding:9px 14px;border-radius:6px;font-size:12.5px;color:var(--tx);
  font-family:'JetBrains Mono',monospace;z-index:100;transform:translateY(80px);opacity:0;
  transition:transform .25s cubic-bezier(.2,.7,.3,1),opacity .25s;
  box-shadow:0 10px 28px rgba(0,0,0,.45);display:inline-flex;align-items:center;gap:8px;}
.nx-toast.show{transform:translateY(0);opacity:1;}

/* Mobile */
.nx-mobile-toggle{display:none;}
@media(max-width:1100px){
  .nx-hero-grid{grid-template-columns:1fr;}
  .nx-info-card{position:relative;top:0;}
  .nx-tools-grid{grid-template-columns:repeat(2,1fr);}
  .nx-proj-grid{grid-template-columns:1fr;}
  .nx-test-grid{grid-template-columns:1fr;}
  .nx-contact-grid{grid-template-columns:1fr;}
}
@media(max-width:768px){
  .nx-layout{grid-template-columns:1fr;}
  .nx-activity{display:none;}
  .nx-sidebar{display:none;}
  .nx-sidebar.open{display:flex;position:fixed;top:34px;left:0;bottom:0;width:240px;z-index:60;}
  .nx-mobile-toggle{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;
    border:1px solid var(--bdr);border-radius:5px;font-size:11.5px;
    font-family:'JetBrains Mono',monospace;color:var(--tx2);background:var(--bg2);}
  .nx-hero-name{font-size:30px;}
  .nx-stats-strip{grid-template-columns:1fr 1fr;}
  .nx-tools-grid{grid-template-columns:1fr;}
  .nx-content{padding:18px 14px;}
  .nx-gutter{width:38px;font-size:11px;}
  .nx-titlebar-center{display:none;}
  .nx-titlebar-right .nx-mb-hide{display:none;}

  /* Contact section mobile fixes */
  .nx-contact-card{padding:16px;border-radius:8px;}
  .nx-contact-icons{grid-template-columns:1fr;gap:6px;}
  .nx-contact-link{padding:10px 12px;font-size:12.5px;}
  .nx-contact-link .val{font-size:11px;}
  .nx-form-field input,.nx-form-field textarea{font-size:12.5px;padding:8px 10px;}

  /* Status bar — only essentials */
  .nx-statusbar{padding:0 10px;gap:10px;}
  .nx-statusbar .nx-mb-hide{display:none!important;}
  .nx-statusbar{font-size:10.5px;}
}
@media(max-width:480px){
  .nx-content{padding:14px 10px;}
  .nx-gutter{display:none;}
  .nx-editor{padding-bottom:60px;}
  .nx-statusbar{height:22px;font-size:10px;gap:8px;padding:0 8px;}
  .nx-sb-pill{padding:1px 6px;font-size:9.5px;}
  .nx-tabs{height:32px;}
  .nx-tab{padding:0 10px;font-size:11.5px;}
  .nx-breadcrumb{font-size:10.5px;padding:5px 12px;}
}
`;

const PROJECT_GRADS = [
  'linear-gradient(135deg,#58a6ff,#1f6feb)',
  'linear-gradient(135deg,#bc8cff,#6e40c9)',
  'linear-gradient(135deg,#39d0d8,#0969da)',
  'linear-gradient(135deg,#ffa657,#bf8700)',
  'linear-gradient(135deg,#3fb950,#1a7f37)',
  'linear-gradient(135deg,#ff7b72,#cf222e)',
];
const PROJ_EMOJIS = ['🚀','⚡','🛠️','🌐','📦','🎯','🔮','🧪'];

export default function NexusTemplate({ content: c, hideBranding }: Props) {
  const [activeTab, setActiveTab] = useState('README.md');
  const [openTabs, setOpenTabs] = useState<string[]>(['README.md']);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [foldersOpen, setFoldersOpen] = useState<Record<string, boolean>>({ portfolio: true });
  const [time, setTime] = useState('');
  const [showAllProj, setShowAllProj] = useState(false);
  const [showAllExp, setShowAllExp] = useState(false);
  const [showAllTest, setShowAllTest] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const upd = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    upd(); const i = setInterval(upd, 30000); return () => clearInterval(i);
  }, []);

  function toast(msg: string) {
    setToastMsg(msg); setToastShow(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 2200);
  }

  function openTab(name: string) {
    if (!openTabs.includes(name)) setOpenTabs(t => [...t, name]);
    setActiveTab(name);
    setSidebarOpen(false);
  }
  function closeTab(e: React.MouseEvent, name: string) {
    e.stopPropagation();
    setOpenTabs(t => {
      const newTabs = t.filter(x => x !== name);
      if (activeTab === name) setActiveTab(newTabs[newTabs.length - 1] || 'README.md');
      if (newTabs.length === 0) setActiveTab('README.md');
      return newTabs.length === 0 ? ['README.md'] : newTabs;
    });
  }

  // ── theme overrides ──
  const themeOverride = [
    c.colorAccent && `--acc:${c.colorAccent};`,
    c.colorAccentHover && `--acc2:${c.colorAccentHover};`,
    c.colorBg && `--bg:${c.colorBg};`,
    c.colorBg2 && `--bg2:${c.colorBg2};`,
    c.colorBg3 && `--bg3:${c.colorBg3};`,
    c.colorBorder && `--bdr:${c.colorBorder};`,
    c.colorText && `--tx:${c.colorText};`,
    c.colorTextMuted && `--tx2:${c.colorTextMuted};`,
  ].filter(Boolean).join('');

  // ── Content ──
  const name = c.name || 'Alex Rivera';
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const title = c.title || 'Full-Stack Engineer';
  const yoe = c.yoe || '5';
  const bio = c.bio || 'I build **performant**, **type-safe** systems that scale. Focused on developer experience and shipping things that matter.';
  const photoUrl = c.photoUrl || '';
  const availability = c.availability || 'Open to opportunities';
  const location = c.location || '';
  const timezone = c.timezone || '';

  const skills = pl(c.skillCore);
  const learning = pl(c.skillLearning);

  const tools = parseJ<{ name: string; ctx: string; image: string }[]>(c.toolsJson, []);

  const stats = [1,2,3,4,5,6,7,8].map(i => ({
    num: c[`stat${i}Num`], label: c[`stat${i}Label`],
  })).filter(s => s.num);

  const experiences = parseJ<{ role: string; company: string; tagline: string; period: string; duration: string; isCurrent: boolean; bullets: string; stack: string }[]>(c.expJson, [])
    .map(e => ({ ...e, bullets: ls(e.bullets), stack: pl(e.stack) }));

  const projects = parseJ<{ title: string; year: string; image: string; desc: string; stack: string; impact: string; challenge: string; liveUrl: string; githubUrl: string }[]>(c.projJson, [])
    .map(p => ({ ...p, stack: pl(p.stack) }));

  const testimonials = parseJ<{ quote: string; initials: string; name: string; role: string }[]>(c.testJson, []);

  // ── File tree ──
  const files = [
    { name: 'README.md', icon: '📄', color: '#58a6ff', mod: false },
    { name: 'skills.json', icon: '⚙️', color: '#79c0ff', mod: false },
    { name: 'experience.tsx', icon: '⚛️', color: '#39d0d8', mod: false },
    { name: 'projects.json', icon: '📦', color: '#79c0ff', mod: false },
    ...(testimonials.length > 0 ? [{ name: 'refs.md', icon: '💬', color: '#58a6ff', mod: false }] : []),
    { name: 'contact.sh', icon: '🔧', color: '#3fb950', mod: true },
  ];

  const EXP_LIMIT = 3, PROJ_LIMIT = 4, TEST_LIMIT = 4;

  function copyEmail() {
    if (c.contactEmail) {
      navigator.clipboard?.writeText(c.contactEmail);
      toast(`✓ ${c.contactEmail} copied`);
    }
  }

  function lineNums(count: number) {
    return Array.from({ length: count }, (_, i) => i + 1).join('\n');
  }

  // current content for tab
  const currentContentLines = (() => {
    switch (activeTab) {
      case 'README.md': return 40;
      case 'skills.json': return 30;
      case 'experience.tsx': return 50;
      case 'projects.json': return 50;
      case 'refs.md': return 30;
      case 'contact.sh': return 35;
      default: return 30;
    }
  })();

  return (
    <div className="nx">
      <style suppressHydrationWarning>{CSS}</style>
      {themeOverride && <style suppressHydrationWarning>{`.nx{${themeOverride}}`}</style>}

      {/* ── Title bar ── */}
      <div className="nx-titlebar">
        <div className="nx-dots"><span className="d1"/><span className="d2"/><span className="d3"/></div>
        <button className="nx-mobile-toggle" onClick={() => setSidebarOpen(s => !s)}>☰ Files</button>
        <div className="nx-titlebar-center nx-mono">
          <b>{name.toLowerCase().replace(/\s+/g, '-')}</b> — portfolio · <span style={{ color: 'var(--acc)' }}>{activeTab}</span>
        </div>
        <div className="nx-titlebar-right">
          <span className="nx-mb-hide nx-online">connected</span>
          <span className="nx-mb-hide">UTF-8</span>
          <span>{time}</span>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="nx-layout">
        {/* Activity bar */}
        <aside className="nx-activity">
          <button className="nx-act-btn active" title="Explorer"><ExplorerIcon/></button>
          <button className="nx-act-btn" title="Search"><SearchIcon/></button>
          <button className="nx-act-btn" title="Git"><GitIcon/></button>
          <button className="nx-act-btn" title="Debug"><BugIcon/></button>
          <button className="nx-act-btn" title="Terminal" onClick={() => openTab('contact.sh')}><TerminalIcon/></button>
          <div className="nx-act-spacer"/>
        </aside>

        {/* Sidebar */}
        <aside className={`nx-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="nx-sb-head">
            <span>Explorer</span>
            <span style={{ color: 'var(--tx3)' }}>···</span>
          </div>
          <div className="nx-sb-tree">
            <div className="nx-sb-folder" onClick={() => setFoldersOpen(f => ({ ...f, portfolio: !f.portfolio }))}>
              <ChevronIcon open={foldersOpen.portfolio} />
              <FolderIcon/>
              <span className="nx-sb-folder-name">portfolio/</span>
              <span className="nx-sb-folder-cnt">{files.length}</span>
            </div>
            {foldersOpen.portfolio && (
              <div className="nx-sb-files">
                {files.map(f => (
                  <div key={f.name} className={`nx-sb-file${activeTab === f.name ? ' active' : ''}`} onClick={() => openTab(f.name)}>
                    <FileIcon color={f.color}/>
                    <span>{f.name}</span>
                    {f.mod && <span className="nx-sb-file-mod">M</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="nx-sb-footer">
            <div className="nx-sb-stat"><span>BRANCH</span><b>main</b></div>
            <div className="nx-sb-stat"><span>YOE</span><b>{yoe}+</b></div>
            <div className="nx-sb-stat"><span>STATUS</span><b style={{ color: 'var(--grn)' }}>● active</b></div>
          </div>
        </aside>

        {/* Main editor */}
        <main className="nx-main">
          {/* Tab bar */}
          <div className="nx-tabs">
            {openTabs.map(tab => (
              <div key={tab} className={`nx-tab${activeTab === tab ? ' active' : ''}${tab === 'contact.sh' ? ' modified' : ''}`} onClick={() => setActiveTab(tab)}>
                <FileIcon color={files.find(f => f.name === tab)?.color || '#6b7280'}/>
                <span>{tab}</span>
                <span className="nx-tab-dot"/>
                <span className="nx-tab-close" onClick={(e) => closeTab(e, tab)}><CloseTabIcon/></span>
              </div>
            ))}
          </div>

          {/* Breadcrumb */}
          <div className="nx-breadcrumb">
            <FolderIcon/>
            <span>portfolio</span>
            <span className="sep">›</span>
            <span className="cur">{activeTab}</span>
          </div>

          {/* Editor */}
          <div className="nx-editor">
            <div className="nx-editor-pane">
              <div className="nx-gutter nx-mono" style={{ whiteSpace: 'pre' }}>{lineNums(currentContentLines)}</div>
              <div className="nx-content">

                {/* ── README.md ── */}
                {activeTab === 'README.md' && (
                  <div className="nx-hero">
                    <div className="nx-hero-prompt">
                      <b>~/{(name.split(' ')[0] || 'home').toLowerCase()}</b>
                      <span style={{ color: 'var(--acc)' }}>$</span>
                      <span>cat README.md</span>
                    </div>

                    <div className="nx-hero-grid">
                      <div>
                        <div style={{ color: 'var(--tx3)', fontSize: 12.5, marginBottom: 4 }}>
                          <span className="tk-cmt"># Header</span>
                        </div>
                        <h1 className="nx-hero-name">{name}<span className="nx-hero-cursor"/></h1>
                        <div className="nx-hero-role">{title} · {yoe}+ years building production systems</div>
                        <p className="nx-hero-bio" dangerouslySetInnerHTML={{ __html: bio.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>

                        <div className="nx-cta-row">
                          <button className="nx-cta nx-cta-primary" onClick={() => openTab('projects.json')}>
                            View projects.json →
                          </button>
                          {c.resumeUrl && (
                            <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer" className="nx-cta nx-cta-ghost">
                              📄 resume.pdf
                            </a>
                          )}
                          <button className="nx-cta nx-cta-ghost" onClick={() => openTab('contact.sh')}>
                            ./contact.sh
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="nx-hero-photo-wrap">
                          {photoUrl ? <img src={photoUrl} alt={name}/> : <span className="nx-hero-photo-init">{initials}</span>}
                        </div>
                        <div className="nx-info-card">
                          <div className="nx-info-row"><span className="nx-info-key">"status"</span><span className="tk-op">:</span><span className="nx-info-val" style={{ color: 'var(--grn)' }}>"{availability}"</span></div>
                          {location && <div className="nx-info-row"><span className="nx-info-key">"location"</span><span className="tk-op">:</span><span className="nx-info-val">"{location}"</span></div>}
                          {timezone && <div className="nx-info-row"><span className="nx-info-key">"timezone"</span><span className="tk-op">:</span><span className="nx-info-val">"{timezone}"</span></div>}
                          <div className="nx-info-row"><span className="nx-info-key">"experience"</span><span className="tk-op">:</span><span className="tk-num">{yoe}</span><span className="nx-info-val mut">// years</span></div>
                          <div className="nx-info-divider"/>
                          <div className="nx-info-row" style={{ fontSize: 11.5 }}><span className="tk-cmt">// connect</span></div>
                          <div style={{ display: 'flex', gap: 7, marginTop: 6 }}>
                            {c.githubUrl && <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" style={{ padding: 7, background: 'var(--bg3)', borderRadius: 6, color: 'var(--tx2)' }}><GhIcon/></a>}
                            {c.linkedinUrl && <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ padding: 7, background: 'var(--bg3)', borderRadius: 6, color: 'var(--tx2)' }}><LiIcon/></a>}
                            {c.twitterUrl && <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer" title="X" style={{ padding: 7, background: 'var(--bg3)', borderRadius: 6, color: 'var(--tx2)' }}><TwIcon/></a>}
                            {c.contactEmail && <a href={`mailto:${c.contactEmail}`} title="Email" style={{ padding: 7, background: 'var(--bg3)', borderRadius: 6, color: 'var(--tx2)' }}><MailIcon/></a>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    {stats.length > 0 && (
                      <div className="nx-stats-strip">
                        {stats.slice(0, 4).map((s, i) => (
                          <div key={i} className="nx-stat">
                            <div className="nx-stat-num">{s.num}</div>
                            <div className="nx-stat-lbl">{s.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── skills.json ── */}
                {activeTab === 'skills.json' && (
                  <div className="nx-sect">
                    <div className="nx-sect-head">
                      <div className="nx-sect-tag">{c.skillsHeading || 'core stack & tools'}</div>
                      <h2 className="nx-sect-title"><span className="at">{`{`}</span> skills <span className="at">{`}`}</span></h2>
                    </div>

                    <div className="nx-json">
                      <div><span className="tk-mute">{`{`}</span></div>
                      <div style={{ paddingLeft: 22 }}>
                        <span className="tk-key">"core"</span><span className="tk-op">:</span> <span className="tk-mute">[</span>
                      </div>
                      {skills.length > 0 ? (
                        <div className="nx-skill-chips" style={{ paddingLeft: 44, marginTop: 8, marginBottom: 8 }}>
                          {skills.map((s, i) => (
                            <span key={i} className="nx-chip">{s}</span>
                          ))}
                        </div>
                      ) : (
                        <div style={{ paddingLeft: 44, color: 'var(--tx3)', fontSize: 12.5, padding: '10px 44px' }}>
                          <span className="tk-cmt">// no core skills listed</span>
                        </div>
                      )}
                      <div style={{ paddingLeft: 22 }}><span className="tk-mute">],</span></div>

                      {learning.length > 0 && (
                        <>
                          <div style={{ paddingLeft: 22, marginTop: 12 }}>
                            <span className="tk-key">"learning"</span><span className="tk-op">:</span> <span className="tk-mute">[</span>
                          </div>
                          <div className="nx-skill-chips" style={{ paddingLeft: 44, marginTop: 8, marginBottom: 8 }}>
                            {learning.map((s, i) => (
                              <span key={i} className="nx-chip learn">{s}</span>
                            ))}
                          </div>
                          <div style={{ paddingLeft: 22 }}><span className="tk-mute">],</span></div>
                        </>
                      )}

                      <div style={{ paddingLeft: 22, marginTop: 14 }}>
                        <span className="tk-key">"tools"</span><span className="tk-op">:</span> <span className="tk-mute">[</span>
                      </div>
                      {tools.length > 0 ? (
                        <div className="nx-tools-grid">
                          {tools.map((t, i) => (
                            <div key={i} className="nx-tool">
                              <div className="nx-tool-ico">
                                {t.image ? <img src={t.image} alt={t.name}/> : <span>{t.name.charAt(0).toUpperCase()}</span>}
                              </div>
                              <div>
                                <div className="nx-tool-name">{t.name}</div>
                                {t.ctx && <div className="nx-tool-ctx">{t.ctx}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ paddingLeft: 44, color: 'var(--tx3)', fontSize: 12.5, padding: '10px 44px' }}>
                          <span className="tk-cmt">// no tools listed</span>
                        </div>
                      )}
                      <div style={{ paddingLeft: 22, marginTop: 8 }}><span className="tk-mute">]</span></div>
                      <div style={{ marginTop: 4 }}><span className="tk-mute">{`}`}</span></div>
                    </div>
                  </div>
                )}

                {/* ── experience.tsx ── */}
                {activeTab === 'experience.tsx' && (
                  <div className="nx-sect">
                    <div className="nx-sect-head">
                      <div className="nx-sect-tag">{c.expHeading || 'professional track record'}</div>
                      <h2 className="nx-sect-title"><span className="at">function</span> getExperience<span className="at">()</span></h2>
                    </div>

                    <div className="nx-exp-list">
                      {experiences.length === 0 && (
                        <div style={{ padding: 28, textAlign: 'center', border: '1px dashed var(--bdr)', borderRadius: 10, color: 'var(--tx3)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5 }}>
                          <span className="tk-cmt">// no experience entries yet</span>
                        </div>
                      )}
                      {(showAllExp ? experiences : experiences.slice(0, EXP_LIMIT)).map((job, i) => (
                        <article key={i} className={`nx-exp-card${job.isCurrent ? ' current' : ''}`}>
                          <div className="nx-exp-head">
                            <div>
                              <h3 className="nx-exp-role">{job.role} <span style={{ color: 'var(--tx3)', fontWeight: 400 }}>@</span> <span className="nx-exp-co">{job.company}</span></h3>
                              {job.tagline && <p className="nx-exp-tag">{job.tagline}</p>}
                            </div>
                            <span className={`nx-exp-period${job.isCurrent ? ' now' : ''}`}>{job.period}</span>
                          </div>
                          {job.bullets.length > 0 && (
                            <ul className="nx-exp-bullets">
                              {job.bullets.map((b, j) => (
                                <li key={j} dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}/>
                              ))}
                            </ul>
                          )}
                          {job.stack.length > 0 && (
                            <div className="nx-exp-stack">
                              <span style={{ fontSize: 10.5, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.1em', marginRight: 5 }}>stack:</span>
                              {job.stack.map((t, j) => <span key={j}>{t}</span>)}
                            </div>
                          )}
                        </article>
                      ))}
                      {experiences.length > EXP_LIMIT && (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button onClick={() => setShowAllExp(s => !s)} className="nx-show-more">
                            {showAllExp ? '↑ show less' : `↓ load ${experiences.length - EXP_LIMIT} more`}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── projects.json ── */}
                {activeTab === 'projects.json' && (
                  <div className="nx-sect">
                    <div className="nx-sect-head">
                      <div className="nx-sect-tag">{c.projHeading || 'featured shipped projects'}</div>
                      <h2 className="nx-sect-title"><span className="at">const</span> projects <span className="at">=</span> [...]</h2>
                    </div>

                    {projects.length === 0 && (
                      <div style={{ padding: 28, textAlign: 'center', border: '1px dashed var(--bdr)', borderRadius: 10, color: 'var(--tx3)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5 }}>
                        <span className="tk-cmt">// no projects yet — [] empty array</span>
                      </div>
                    )}
                    <div className="nx-proj-grid">
                      {(showAllProj ? [...projects].reverse() : [...projects].reverse().slice(0, PROJ_LIMIT)).map((p, i) => (
                        <article key={i} className="nx-proj">
                          <div className="nx-proj-hdr">
                            <div className="nx-proj-circles"><span/><span/><span/></div>
                            <span className="nx-proj-name">{p.title.toLowerCase().replace(/\s+/g,'-')}.app</span>
                            <span className="nx-proj-yr">{p.year}</span>
                          </div>
                          <div className="nx-proj-visual" style={p.image ? { background: 'var(--bg3)', padding: 0 } : { background: PROJECT_GRADS[i % PROJECT_GRADS.length] }}>
                            {p.image
                              ? <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                              : <span className="nx-proj-emoji">{PROJ_EMOJIS[i % PROJ_EMOJIS.length]}</span>}
                            {p.impact && <span className="nx-proj-impact">⚡ {p.impact}</span>}
                          </div>
                          <div className="nx-proj-body">
                            <h3 className="nx-proj-title">{p.title}</h3>
                            <p className="nx-proj-desc">{p.desc}</p>
                            {p.stack.length > 0 && (
                              <div className="nx-proj-stack">{p.stack.map((s, j) => <span key={j}>{s}</span>)}</div>
                            )}
                            {p.challenge && (
                              <div className="nx-proj-chal"><b>challenge:</b>{p.challenge}</div>
                            )}
                            <div className="nx-proj-actions">
                              {p.liveUrl
                                ? <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="nx-proj-btn solid">demo <ExtIcon/></a>
                                : <span className="nx-proj-btn solid disabled">demo <ExtIcon/></span>}
                              {p.githubUrl
                                ? <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="nx-proj-btn">code <GhIcon/></a>
                                : <span className="nx-proj-btn disabled">code <GhIcon/></span>}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                    {projects.length > PROJ_LIMIT && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
                        <button onClick={() => setShowAllProj(s => !s)} className="nx-show-more">
                          {showAllProj ? '↑ show less' : `↓ load ${projects.length - PROJ_LIMIT} more`}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── refs.md ── */}
                {activeTab === 'refs.md' && testimonials.length > 0 && (
                  <div className="nx-sect">
                    <div className="nx-sect-head">
                      <div className="nx-sect-tag">{c.testimonialsHeading || 'references from collaborators'}</div>
                      <h2 className="nx-sect-title"># <span className="at">references</span></h2>
                    </div>

                    <div className="nx-test-grid">
                      {(showAllTest ? testimonials : testimonials.slice(0, TEST_LIMIT)).map((t, i) => (
                        <div key={i} className="nx-test">
                          <p>{t.quote}</p>
                          <div className="nx-test-author">
                            <div className="nx-test-avi">{t.initials || (t.name || 'XX').slice(0, 2).toUpperCase()}</div>
                            <div className="nx-test-meta">
                              <b>{t.name}</b>
                              <span>{t.role}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {testimonials.length > TEST_LIMIT && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
                        <button onClick={() => setShowAllTest(s => !s)} className="nx-show-more">
                          {showAllTest ? '↑ show less' : `↓ load ${testimonials.length - TEST_LIMIT} more`}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── contact.sh ── */}
                {activeTab === 'contact.sh' && (
                  <div className="nx-sect">
                    <div className="nx-sect-head">
                      <div className="nx-sect-tag">{c.contactHeading || 'get in touch'}</div>
                      <h2 className="nx-sect-title">$ <span className="at">./contact.sh</span></h2>
                    </div>

                    <div className="nx-contact-grid">
                      <div className="nx-contact-card">
                        <div className="nx-contact-term">
                          <div className="nx-prompt">whoami</div>
                          <div className="nx-out">{name}</div>
                          <div className="nx-prompt" style={{ marginTop: 8 }}>echo $STATUS</div>
                          <div className="nx-out success">{availability}</div>
                          <div className="nx-prompt" style={{ marginTop: 8 }}>cat response.txt</div>
                          <div className="nx-out">{c.contactSub || 'Replies within 24h. Async-friendly across time zones.'}</div>
                          {timezone && (
                            <>
                              <div className="nx-prompt" style={{ marginTop: 8 }}>date</div>
                              <div className="nx-out warn">{timezone}</div>
                            </>
                          )}
                        </div>

                        <div className="nx-contact-icons">
                          {c.contactEmail && (
                            <button onClick={copyEmail} className="nx-contact-link">
                              <MailIcon/>
                              <div>
                                <div className="label">email</div>
                              </div>
                              <span className="val">{c.contactEmail}</span>
                            </button>
                          )}
                          {c.githubUrl && (
                            <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="nx-contact-link">
                              <GhIcon/>
                              <span className="label">github</span>
                              <span className="val">→</span>
                            </a>
                          )}
                          {c.linkedinUrl && (
                            <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="nx-contact-link">
                              <LiIcon/>
                              <span className="label">linkedin</span>
                              <span className="val">→</span>
                            </a>
                          )}
                          {c.twitterUrl && (
                            <a href={c.twitterUrl} target="_blank" rel="noopener noreferrer" className="nx-contact-link">
                              <TwIcon/>
                              <span className="label">twitter</span>
                              <span className="val">→</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <form className="nx-contact-card" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); toast('✓ Message sent'); }}>
                        <div className="nx-contact-term" style={{ marginBottom: 14 }}>
                          <div className="nx-prompt">./send-message.sh</div>
                          <div className="nx-out" style={{ fontSize: 11.5, color: 'var(--tx3)' }}>// fill out the form below</div>
                        </div>
                        <div className="nx-form">
                          <div className="nx-form-field">
                            <label>--name</label>
                            <input type="text" placeholder="Your name" required/>
                          </div>
                          <div className="nx-form-field">
                            <label>--email</label>
                            <input type="email" placeholder="you@company.com" required/>
                          </div>
                          <div className="nx-form-field">
                            <label>--message</label>
                            <textarea rows={3} placeholder="Project scope, timing, …" required/>
                          </div>
                          <button type="submit" className="nx-form-submit">
                            {submitted ? '✓ Sent' : 'execute →'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Status bar ── */}
      <div className="nx-statusbar">
        <span className="nx-sb-item grn"><GitIcon/> main</span>
        <span className="nx-sb-item">↑0 ↓0</span>
        <span className="nx-sb-item">⚠ 0</span>
        <span className="nx-sb-item">✕ 0</span>
        <div className="nx-sb-spacer"/>
        <span className="nx-sb-item nx-mb-hide">Ln 1, Col 1</span>
        <span className="nx-sb-item nx-mb-hide">Spaces: 2</span>
        <span className="nx-sb-item nx-mb-hide">UTF-8</span>
        <span className="nx-sb-item nx-mb-hide">{activeTab.split('.').pop()}</span>
        {!hideBranding && <span className="nx-sb-pill">FolioForge</span>}
      </div>

      {/* Toast */}
      <div className={`nx-toast${toastShow ? ' show' : ''}`}>{toastMsg}</div>
    </div>
  );
}
