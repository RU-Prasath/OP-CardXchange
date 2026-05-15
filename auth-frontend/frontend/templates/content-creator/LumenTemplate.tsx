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

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M19.6 6.3a5.6 5.6 0 0 1-3.4-1.2 5.6 5.6 0 0 1-2.1-3.5h-3.6v14.4a3 3 0 1 1-2.1-2.9V9.4a6.6 6.6 0 1 0 5.7 6.5V9.1a9.2 9.2 0 0 0 5.5 1.8V7.3a5.5 5.5 0 0 1 0-1z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TwitchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M2.5 2L1 5.7v14h5v3.3h2.8l3.3-3.3h4.2l5.7-5.7V2H2.5zm17.5 11.3l-3.3 3.3h-5.2l-3.3 3.3v-3.3H4V3.7h16v9.6zm-4.7-6.5h-1.9v5.6h1.9V6.8zm-5.1 0h-1.9v5.6h1.9V6.8z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4a.6.6 0 0 1-.9.2c-2.4-1.5-5.5-1.8-9.1-1a.6.6 0 1 1-.3-1.2c4-.9 7.4-.5 10.1 1.1.3.2.4.6.2.9zm1.2-2.7a.8.8 0 0 1-1 .3c-2.8-1.7-7-2.2-10.3-1.2a.8.8 0 1 1-.5-1.5c3.8-1.1 8.5-.6 11.6 1.4.4.2.5.7.2 1zm.1-2.8c-3.3-2-8.8-2.1-11.9-1.2a.9.9 0 1 1-.6-1.8c3.6-1.1 9.7-.9 13.5 1.4.5.3.6.9.3 1.3-.3.4-.9.5-1.3.3z" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 6l10 7 10-7" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16" />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

const PLATFORM_ICONS: Record<string, () => React.JSX.Element> = {
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  x: TwitterIcon,
  twitch: TwitchIcon,
  spotify: SpotifyIcon,
};

function getPlatformIcon(name: string) {
  const key = name.toLowerCase().trim();
  const Comp = PLATFORM_ICONS[key];
  return Comp ? <Comp /> : <PlayIcon />;
}

const VIDEO_GRADIENTS = [
  'linear-gradient(135deg, #ff4ea1 0%, #9b5cff 100%)',
  'linear-gradient(135deg, #9b5cff 0%, #4ecdff 100%)',
  'linear-gradient(135deg, #4ecdff 0%, #ff4ea1 100%)',
  'linear-gradient(135deg, #ff4ea1 0%, #4ecdff 100%)',
  'linear-gradient(135deg, #9b5cff 0%, #ff4ea1 100%)',
  'linear-gradient(135deg, #ffd86b 0%, #ff4ea1 100%)',
];

interface PlatformItem { platform: string; handle: string; followers: string; url: string; color?: string }
interface FeaturedItem { title: string; platform: string; thumbnail?: string; views: string; duration: string; type: string; url: string; year?: string }
interface NicheItem { name: string; icon?: string }
interface BrandItem { name: string; year?: string; type?: string }
interface CampaignItem { brand: string; title: string; summary: string; deliverables?: string; year?: string; image?: string }
interface PressItem { outlet: string; headline: string; year?: string; url?: string }
interface ServiceItem { title: string; description: string; deliverables?: string; startingPrice?: string }
interface TestimonialItem { quote: string; author: string; role?: string; brand?: string }

export default function LumenTemplate({ content, username, hideBranding }: Props) {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const c = content;

  const bg = c.colorBg || '#16091f';
  const fg = c.colorFg || '#ffffff';
  const accent = c.colorAccent || '#ff4ea1';
  const accent2 = c.colorAccent2 || '#9b5cff';
  const accent3 = c.colorAccent3 || '#4ecdff';
  const line = c.colorLine || 'rgba(255,255,255,0.12)';
  const card = c.colorCard || 'rgba(255,255,255,0.04)';

  const darkVars = `
    --bg: ${bg};
    --fg: ${fg};
    --fg-muted: rgba(255,255,255,0.72);
    --fg-faint: rgba(255,255,255,0.5);
    --line: ${line};
    --card: ${card};
    --card-strong: rgba(255,255,255,0.08);
    --nav-bg: rgba(22,9,31,0.78);
    --blob-opacity: 0.55;
  `;
  const lightVars = `
    --bg: #fbf7ff;
    --fg: #1a0a2e;
    --fg-muted: rgba(26,10,46,0.7);
    --fg-faint: rgba(26,10,46,0.45);
    --line: rgba(26,10,46,0.12);
    --card: rgba(255,255,255,0.85);
    --card-strong: rgba(255,255,255,1);
    --nav-bg: rgba(251,247,255,0.82);
    --blob-opacity: 0.35;
  `;

  const cssVars = `
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    .lumen-template {
      ${dark ? darkVars : lightVars}
      --accent: ${accent};
      --accent-2: ${accent2};
      --accent-3: ${accent3};
      --gradient: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 50%, var(--accent-3) 100%);
      --gradient-soft: linear-gradient(135deg, color-mix(in srgb, var(--accent) 22%, transparent), color-mix(in srgb, var(--accent-3) 22%, transparent));
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      background: var(--bg);
      color: var(--fg);
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }
    .lumen-template * { box-sizing: border-box; margin: 0; padding: 0; }
    .lumen-template a { color: inherit; text-decoration: none; }
    .lumen-template button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
    .lumen-template input, .lumen-template textarea { font-family: inherit; }
    .lumen-display { font-family: 'Bricolage Grotesque', 'Inter', sans-serif; letter-spacing: -0.02em; }

    .lumen-grad-text {
      background: var(--gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }

    .lumen-btn-grad {
      background: var(--gradient);
      color: #fff;
      transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
      box-shadow: 0 8px 30px -8px color-mix(in srgb, var(--accent-2) 60%, transparent);
    }
    .lumen-btn-grad:hover {
      transform: translateY(-2px);
      filter: brightness(1.08);
      box-shadow: 0 14px 38px -8px color-mix(in srgb, var(--accent-2) 80%, transparent);
    }

    .lumen-card {
      background: var(--card);
      border: 1px solid var(--line);
      transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
      backdrop-filter: blur(8px);
    }
    .lumen-card:hover {
      transform: translateY(-4px);
      border-color: color-mix(in srgb, var(--accent-2) 55%, var(--line));
      box-shadow: 0 18px 50px -18px color-mix(in srgb, var(--accent-2) 50%, transparent);
    }

    .lumen-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid var(--line);
      background: var(--card);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .lumen-chip:hover { border-color: var(--accent); }

    .lumen-sticker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 14px;
      font-weight: 700;
      font-size: 14px;
      background: var(--card-strong);
      border: 1.5px solid var(--line);
      box-shadow: 0 6px 18px -10px rgba(0,0,0,0.45);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .lumen-sticker:hover {
      transform: rotate(0deg) translateY(-3px) !important;
      box-shadow: 0 12px 28px -10px color-mix(in srgb, var(--accent-2) 55%, transparent);
    }

    @keyframes lumen-blob-1 {
      0%, 100% { transform: translate(0,0) scale(1); }
      33% { transform: translate(60px,-40px) scale(1.15); }
      66% { transform: translate(-40px,40px) scale(0.9); }
    }
    @keyframes lumen-blob-2 {
      0%, 100% { transform: translate(0,0) scale(1); }
      50% { transform: translate(-80px,60px) scale(1.2); }
    }
    @keyframes lumen-blob-3 {
      0%, 100% { transform: translate(0,0) scale(1); }
      40% { transform: translate(50px,80px) scale(1.1); }
      80% { transform: translate(-60px,-20px) scale(0.95); }
    }
    @keyframes lumen-pulse {
      0%, 100% { opacity: 0.95; }
      50% { opacity: 0.5; }
    }
    @keyframes lumen-shimmer {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .lumen-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: var(--blob-opacity);
      pointer-events: none;
    }
    .lumen-blob-1 { animation: lumen-blob-1 18s ease-in-out infinite; }
    .lumen-blob-2 { animation: lumen-blob-2 22s ease-in-out infinite; }
    .lumen-blob-3 { animation: lumen-blob-3 26s ease-in-out infinite; }

    .lumen-glow:hover { box-shadow: 0 0 0 1px var(--accent), 0 18px 50px -12px color-mix(in srgb, var(--accent) 60%, transparent); }

    .lumen-nav-link {
      position: relative;
      padding: 8px 4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--fg-muted);
      transition: color 0.18s ease;
    }
    .lumen-nav-link:hover { color: var(--fg); }
    .lumen-nav-link::after {
      content: '';
      position: absolute;
      left: 4px; right: 4px; bottom: 2px;
      height: 2px;
      background: var(--gradient);
      border-radius: 2px;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
    .lumen-nav-link:hover::after { transform: scaleX(1); }

    .lumen-thumb-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%);
      opacity: 0.85;
      transition: opacity 0.25s ease;
    }
    .lumen-card:hover .lumen-thumb-overlay { opacity: 1; }
    .lumen-play-btn {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .lumen-card:hover .lumen-play-btn { opacity: 1; }

    .lumen-input {
      width: 100%;
      padding: 14px 16px;
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 14px;
      color: var(--fg);
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .lumen-input:focus { border-color: var(--accent-2); background: var(--card-strong); }
    .lumen-input::placeholder { color: var(--fg-faint); }

    @media (max-width: 768px) {
      .lumen-desktop-nav { display: none !important; }
      .lumen-mobile-toggle { display: flex !important; }
      .lumen-hero-title { font-size: 44px !important; line-height: 1.05 !important; }
      .lumen-hero-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
      .lumen-section-title { font-size: 32px !important; }
      .lumen-stats-grid { grid-template-columns: 1fr !important; }
      .lumen-videos-grid { grid-template-columns: 1fr !important; }
      .lumen-brands-grid { grid-template-columns: repeat(2,1fr) !important; }
      .lumen-campaigns-grid { grid-template-columns: 1fr !important; }
      .lumen-about-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
      .lumen-press-grid { grid-template-columns: 1fr !important; }
      .lumen-services-grid { grid-template-columns: 1fr !important; }
      .lumen-testimonials-grid { grid-template-columns: 1fr !important; }
      .lumen-contact-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
      .lumen-section { padding: 64px 20px !important; }
      .lumen-hero { padding: 110px 20px 60px !important; }
      .lumen-nav-inner { padding: 12px 20px !important; }
      .lumen-mobile-menu { display: flex !important; }
      .lumen-quick-stats { grid-template-columns: repeat(3,1fr) !important; gap: 12px !important; }
      .lumen-hero-cta { flex-direction: column !important; align-items: stretch !important; }
      .lumen-hero-cta > * { width: 100% !important; justify-content: center !important; }
    }
    @media (max-width: 480px) {
      .lumen-brands-grid { grid-template-columns: 1fr !important; }
      .lumen-hero-title { font-size: 36px !important; }
      .lumen-section-title { font-size: 26px !important; }
    }
  `;

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const name = c.name || 'Lumen Rivera';
  const handle = c.handle || '@lumencreates';
  const tagline = c.tagline || 'Storytelling on the internet, since 2019.';
  const subtitle = c.subtitle || 'I make short films, video essays, and the occasional podcast about culture, tech, and the chaos in between.';
  const initial = name.charAt(0).toUpperCase();

  const niches = pl(c.niches).length ? pl(c.niches) : ['Video Essays', 'Tech Culture', 'Storytelling', 'Behind the Scenes'];

  const youtubeUrl = c.youtubeUrl || '';
  const tiktokUrl = c.tiktokUrl || '';
  const instagramUrl = c.instagramUrl || '';
  const twitterUrl = c.twitterUrl || '';
  const twitchUrl = c.twitchUrl || '';
  const spotifyUrl = c.spotifyUrl || '';

  const socialStrip: { name: string; url: string; icon: React.JSX.Element }[] = [
    { name: 'YouTube', url: youtubeUrl, icon: <YouTubeIcon /> },
    { name: 'TikTok', url: tiktokUrl, icon: <TikTokIcon /> },
    { name: 'Instagram', url: instagramUrl, icon: <InstagramIcon /> },
    { name: 'Twitter', url: twitterUrl, icon: <TwitterIcon /> },
    { name: 'Twitch', url: twitchUrl, icon: <TwitchIcon /> },
    { name: 'Spotify', url: spotifyUrl, icon: <SpotifyIcon /> },
  ].filter((s) => s.url);

  const platforms = parseJ<PlatformItem[]>(c.platformsJson, [
    { platform: 'YouTube', handle: '@lumencreates', followers: '482K', url: '#', color: '#ff0033' },
    { platform: 'TikTok', handle: '@lumencreates', followers: '1.2M', url: '#', color: '#25f4ee' },
    { platform: 'Instagram', handle: '@lumen.rivera', followers: '218K', url: '#', color: '#e1306c' },
    { platform: 'Spotify', handle: 'Lumen Podcast', followers: '54K', url: '#', color: '#1db954' },
  ]);

  const featured = parseJ<FeaturedItem[]>(c.featuredJson, [
    { title: 'Why every brand sounds the same now', platform: 'YouTube', views: '2.1M', duration: '14:22', type: 'long', url: '#', year: '2025' },
    { title: '60 seconds inside a creator house', platform: 'TikTok', views: '4.8M', duration: '0:58', type: 'short', url: '#', year: '2025' },
    { title: 'Episode 24 — Going indie in 2025', platform: 'Spotify', views: '72K', duration: '46:10', type: 'podcast', url: '#', year: '2025' },
    { title: 'A day in my edit suite', platform: 'YouTube', views: '988K', duration: '11:04', type: 'long', url: '#', year: '2024' },
    { title: 'The algorithm changed again', platform: 'Instagram', views: '320K', duration: '0:42', type: 'reel', url: '#', year: '2025' },
    { title: 'Behind the lens — Tokyo trip', platform: 'YouTube', views: '1.6M', duration: '18:33', type: 'long', url: '#', year: '2024' },
  ]);

  const nicheChips = parseJ<NicheItem[]>(c.nichesJson, [
    { name: 'Video Essays', icon: '🎬' },
    { name: 'Tech Culture', icon: '💻' },
    { name: 'Behind the Scenes', icon: '🎥' },
    { name: 'Creator Economy', icon: '💸' },
    { name: 'Storytelling', icon: '📖' },
    { name: 'Travel Vlogs', icon: '✈️' },
    { name: 'Interviews', icon: '🎙️' },
    { name: 'Short Films', icon: '🎞️' },
    { name: 'Podcasting', icon: '🎧' },
    { name: 'Productivity', icon: '⚡' },
  ]);

  const brands = parseJ<BrandItem[]>(c.brandsJson, [
    { name: 'Notion', year: '2024', type: 'Long-form integration' },
    { name: 'Squarespace', year: '2024', type: 'Sponsored video' },
    { name: 'Adobe', year: '2023', type: 'Campaign series' },
    { name: 'Audible', year: '2024', type: 'Podcast sponsor' },
    { name: 'Shopify', year: '2023', type: 'Brand spot' },
    { name: 'Canva', year: '2025', type: 'Tutorial series' },
    { name: 'NordVPN', year: '2022', type: 'Sponsored video' },
    { name: 'Squarespace', year: '2025', type: 'Campaign' },
  ]);

  const campaigns = parseJ<CampaignItem[]>(c.campaignsJson, [
    { brand: 'Notion', title: 'Building a creator OS', summary: 'A 3-part long-form series showing how I plan, script, and ship every video using Notion.', deliverables: '3 YouTube long-form, 6 Shorts, 4 Reels', year: '2024' },
    { brand: 'Adobe', title: 'Premiere Pro in the wild', summary: 'Documentary-style integration showing my real edit workflow on a feature-length project.', deliverables: '1 hero YouTube video, social cutdowns', year: '2024' },
    { brand: 'Audible', title: 'Listen to your obsessions', summary: 'A six-episode podcast sponsorship arc tied to a themed reading list.', deliverables: '6 mid-rolls, 2 host-read promos', year: '2024' },
  ]);

  const press = parseJ<PressItem[]>(c.pressJson, [
    { outlet: 'The Verge', headline: 'The new wave of essayists redefining YouTube', year: '2024', url: '#' },
    { outlet: 'Fast Company', headline: '30 under 30 — Media & Marketing', year: '2024', url: '#' },
    { outlet: 'Creator Spotlight', headline: 'How Lumen turned a curiosity into a media company', year: '2025', url: '#' },
    { outlet: 'Podcast Magazine', headline: 'Indie podcasts to watch this year', year: '2024', url: '#' },
  ]);

  const services = parseJ<ServiceItem[]>(c.servicesJson, [
    { title: 'Dedicated YouTube integration', description: 'A 60–90 second integration inside a long-form video, with my voice and editorial.', deliverables: '1 long-form, scripted in collaboration', startingPrice: 'from $9,500' },
    { title: 'Sponsored long-form video', description: 'Full episode produced around your product or theme, hero campaign asset.', deliverables: '1 video + 3 short cutdowns', startingPrice: 'from $22,000' },
    { title: 'UGC content package', description: 'Polished UGC for paid social — concepted, shot, and edited end-to-end.', deliverables: '4 vertical assets', startingPrice: 'from $4,500' },
    { title: 'Podcast host-read sponsorship', description: 'Authentic 60–90s host-reads inside the Lumen podcast, with clip rights.', deliverables: '3 episodes', startingPrice: 'from $3,800' },
    { title: 'Event hosting & VO', description: 'On-camera hosting, voiceover, and creator panels for brand activations.', deliverables: 'Custom scope', startingPrice: 'on request' },
  ]);

  const testimonials = parseJ<TestimonialItem[]>(c.testimonialsJson, [
    { quote: 'Lumen turned our product brief into the most-watched piece of brand content we shipped last year.', author: 'Maya Chen', role: 'Head of Brand', brand: 'Notion' },
    { quote: 'The editorial bar is unreasonably high. We just hand over the brief and trust the process.', author: 'Daniel Park', role: 'Creator Partnerships', brand: 'Adobe' },
    { quote: 'One of the smartest, easiest creators we have worked with. Repeat partner for a reason.', author: 'Priya Anand', role: 'Talent Manager', brand: 'Audible' },
  ]);

  const yearsCreating = c.yearsCreating || '6';
  const cadence = c.cadence || '2/week';
  const totalContent = c.totalContent || '480+';

  const aboutP1 = c.aboutP1 || `I started filming short documentaries on a borrowed camera in 2019 and somehow built a little media company along the way. Today I split my time between long-form video essays, a weekly podcast, and short-form storytelling experiments.`;
  const aboutP2 = c.aboutP2 || `My work sits at the intersection of culture, technology, and how the internet is changing what we pay attention to. I work with brands I genuinely use, and I take editorial control very seriously.`;

  const contactEmail = c.contactEmail || 'hello@lumen.studio';
  const managerEmail = c.managerEmail || 'partnerships@lumen.studio';
  const calendarUrl = c.calendarUrl || '#';
  const mediaKitUrl = c.mediaKitUrl || '#';

  const navLinks = [
    { href: '#platforms', label: 'Platforms' },
    { href: '#work', label: 'Work' },
    { href: '#brands', label: 'Brands' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Media kit' },
    { href: '#contact', label: 'Contact' },
  ];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const stickerRotations = ['-3deg', '2deg', '-1deg', '3deg', '-2deg', '1deg', '-4deg', '2deg', '-2deg', '3deg'];

  return (
    <div className="lumen-template">
      <style suppressHydrationWarning>{cssVars}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div className="lumen-blob lumen-blob-1" style={{ width: 520, height: 520, top: -120, left: -120, background: accent }} />
        <div className="lumen-blob lumen-blob-2" style={{ width: 460, height: 460, top: 200, right: -160, background: accent3 }} />
        <div className="lumen-blob lumen-blob-3" style={{ width: 600, height: 600, bottom: -200, left: '30%', background: accent2 }} />
      </div>

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div
          className="lumen-nav-inner"
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '14px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <a href="#top" onClick={(e) => scrollTo(e, '#top')} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'var(--gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 16,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                boxShadow: '0 6px 20px -6px rgba(155,92,255,0.6)',
              }}
            >
              {initial}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 16 }}>{name.split(' ')[0]}</span>
              <span style={{ fontSize: 11, color: 'var(--fg-faint)' }}>{handle}</span>
            </div>
          </a>

          <nav className="lumen-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => scrollTo(e, l.href)} className="lumen-nav-link">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="lumen-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid var(--line)',
                background: 'var(--card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg)',
              }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, '#contact')}
              className="lumen-btn-grad"
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Collab with me
            </a>
          </div>

          <button
            className="lumen-mobile-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            style={{
              display: 'none',
              width: 40,
              height: 40,
              borderRadius: 12,
              border: '1px solid var(--line)',
              background: 'var(--card)',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--fg)',
            }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {menuOpen && (
          <div
            className="lumen-mobile-menu"
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: 4,
              padding: '12px 20px 20px',
              borderTop: '1px solid var(--line)',
              background: 'var(--nav-bg)',
            }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => scrollTo(e, l.href)}
                style={{
                  padding: '12px 8px',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--fg)',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                {l.label}
              </a>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button
                onClick={() => setDark((d) => !d)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 12,
                  border: '1px solid var(--line)',
                  background: 'var(--card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {dark ? <><SunIcon /> Light</> : <><MoonIcon /> Dark</>}
              </button>
              <a
                href="#contact"
                onClick={(e) => scrollTo(e, '#contact')}
                className="lumen-btn-grad"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 12,
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Collab
              </a>
            </div>
          </div>
        )}
      </header>

      <div id="top" style={{ position: 'relative', zIndex: 1 }}>
        <section
          className="lumen-hero"
          style={{
            position: 'relative',
            padding: '120px 32px 90px',
            maxWidth: 1240,
            margin: '0 auto',
          }}
        >
          <div
            className="lumen-hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: 64,
              alignItems: 'center',
            }}
          >
            <div>
              <div
                className="lumen-sticker"
                style={{ marginBottom: 28, transform: 'rotate(-2deg)' }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 0 4px rgba(34,197,94,0.25)',
                  }}
                />
                Available for Q3 partnerships
              </div>

              <h1
                className="lumen-display lumen-hero-title"
                style={{
                  fontSize: 'clamp(56px, 7vw, 88px)',
                  fontWeight: 800,
                  lineHeight: 1,
                  marginBottom: 18,
                }}
              >
                <span>Hey, I'm </span>
                <span className="lumen-grad-text">{name}</span>
                <span style={{ display: 'block', color: 'var(--fg-muted)', fontSize: '0.55em', fontWeight: 600, marginTop: 12 }}>
                  {handle}
                </span>
              </h1>

              <p
                className="lumen-display"
                style={{
                  fontSize: 'clamp(20px, 2vw, 24px)',
                  fontWeight: 500,
                  color: 'var(--fg)',
                  marginBottom: 14,
                  maxWidth: 620,
                }}
              >
                {tagline}
              </p>

              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: 'var(--fg-muted)',
                  maxWidth: 560,
                  marginBottom: 28,
                }}
              >
                {subtitle}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
                {niches.map((n, i) => (
                  <span
                    key={n + i}
                    className="lumen-sticker"
                    style={{ fontSize: 12, padding: '6px 12px', transform: `rotate(${stickerRotations[i % stickerRotations.length]})` }}
                  >
                    {n}
                  </span>
                ))}
              </div>

              <div className="lumen-hero-cta" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}>
                <a
                  href={featured[0]?.url || '#work'}
                  onClick={(e) => { if (!featured[0]?.url || featured[0]?.url === '#') scrollTo(e, '#work'); }}
                  className="lumen-btn-grad"
                  style={{
                    padding: '15px 24px',
                    borderRadius: 999,
                    fontSize: 15,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <PlayIcon /> Watch latest
                </a>
                <a
                  href="#contact"
                  onClick={(e) => scrollTo(e, '#contact')}
                  style={{
                    padding: '15px 24px',
                    borderRadius: 999,
                    fontSize: 15,
                    fontWeight: 700,
                    border: '1.5px solid var(--line)',
                    background: 'var(--card)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  Brand collab <ArrowUpRightIcon />
                </a>
              </div>

              {socialStrip.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: 2, marginRight: 6 }}>
                    Find me
                  </span>
                  {socialStrip.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={s.name}
                      className="lumen-glow"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: '1px solid var(--line)',
                        background: 'var(--card)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '9/16',
                  maxWidth: 360,
                  marginLeft: 'auto',
                  borderRadius: 28,
                  overflow: 'hidden',
                  border: '1.5px solid var(--line)',
                  background: VIDEO_GRADIENTS[0],
                  boxShadow: '0 30px 80px -30px rgba(155,92,255,0.6)',
                  transform: 'rotate(2deg)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    padding: '6px 10px',
                    borderRadius: 999,
                    background: 'rgba(0,0,0,0.55)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff4444', boxShadow: '0 0 0 3px rgba(255,68,68,0.3)' }} />
                  LATEST
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.18)',
                      backdropFilter: 'blur(10px)',
                      border: '1.5px solid rgba(255,255,255,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <PlayIcon />
                  </div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: 16,
                    color: '#fff',
                  }}
                >
                  <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>
                    {featured[0]?.platform || 'YouTube'} · {featured[0]?.duration || '14:22'}
                  </div>
                  <div className="lumen-display" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
                    {featured[0]?.title || 'Latest video'}
                  </div>
                </div>
              </div>

              <div
                className="lumen-sticker"
                style={{
                  position: 'absolute',
                  bottom: -10,
                  left: -10,
                  background: 'var(--gradient)',
                  color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  transform: 'rotate(-6deg)',
                  fontSize: 13,
                }}
              >
                <HeartIcon /> {platforms[0]?.followers || '482K'} fans
              </div>
            </div>
          </div>
        </section>

        <section
          id="platforms"
          className="lumen-section"
          style={{ padding: '90px 32px', maxWidth: 1240, margin: '0 auto' }}
        >
          <div style={{ marginBottom: 48, maxWidth: 720 }}>
            <div className="lumen-sticker" style={{ marginBottom: 16, transform: 'rotate(-1deg)' }}>
              Platforms
            </div>
            <h2
              className="lumen-display lumen-section-title"
              style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, marginBottom: 14, lineHeight: 1.05 }}
            >
              Where I post, every <span className="lumen-grad-text">single week.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--fg-muted)', lineHeight: 1.65 }}>
              I treat each platform like a different room — same voice, different energy.
            </p>
          </div>

          <div
            className="lumen-stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(platforms.length, 4)}, 1fr)`,
              gap: 18,
            }}
          >
            {platforms.map((p, i) => (
              <a
                key={p.platform + i}
                href={p.url || '#'}
                target="_blank"
                rel="noreferrer noopener"
                className="lumen-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 24,
                  borderRadius: 22,
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 220,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    background: p.color || (i % 2 === 0 ? accent : accent3),
                    opacity: 0.18,
                    filter: 'blur(40px)',
                    top: -40,
                    right: -40,
                  }}
                />
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'var(--card-strong)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: p.color || 'var(--fg)',
                    marginBottom: 24,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {getPlatformIcon(p.platform)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-faint)', marginBottom: 4, fontWeight: 600, position: 'relative', zIndex: 1 }}>
                  {p.platform}
                </div>
                <div className="lumen-display" style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, marginBottom: 6, position: 'relative', zIndex: 1 }}>
                  {p.followers}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 24, fontWeight: 500, position: 'relative', zIndex: 1 }}>
                  {p.handle}
                </div>
                <div
                  style={{
                    marginTop: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--fg)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  Visit channel <ArrowUpRightIcon />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          id="work"
          className="lumen-section"
          style={{ padding: '90px 32px', maxWidth: 1240, margin: '0 auto' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 20,
              marginBottom: 48,
            }}
          >
            <div style={{ maxWidth: 720 }}>
              <div className="lumen-sticker" style={{ marginBottom: 16, transform: 'rotate(1.5deg)' }}>
                Featured Work
              </div>
              <h2
                className="lumen-display lumen-section-title"
                style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, marginBottom: 14, lineHeight: 1.05 }}
              >
                A few things <span className="lumen-grad-text">people watched.</span>
              </h2>
              <p style={{ fontSize: 16, color: 'var(--fg-muted)', lineHeight: 1.65 }}>
                Long-form, shorts, podcasts. Same brain, different format.
              </p>
            </div>
          </div>

          <div
            className="lumen-videos-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 22,
            }}
          >
            {featured.map((v, i) => {
              const isVertical = v.type === 'short' || v.type === 'reel';
              const aspect = isVertical ? '9 / 16' : '16 / 9';
              return (
                <a
                  key={(v.title || 'video') + i}
                  href={v.url || '#'}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="lumen-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 20,
                    overflow: 'hidden',
                    gridRow: isVertical ? 'span 2' : 'span 1',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: aspect,
                      background: VIDEO_GRADIENTS[i % VIDEO_GRADIENTS.length],
                      overflow: 'hidden',
                    }}
                  >
                    {v.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: VIDEO_GRADIENTS[i % VIDEO_GRADIENTS.length],
                        }}
                      />
                    )}
                    <div className="lumen-thumb-overlay" />
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        padding: '5px 10px',
                        borderRadius: 999,
                        background: 'rgba(0,0,0,0.55)',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      {getPlatformIcon(v.platform)}
                      <span>{v.platform}</span>
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        padding: '5px 9px',
                        borderRadius: 8,
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      {v.duration}
                    </div>
                    <div className="lumen-play-btn">
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.18)',
                          border: '1.5px solid rgba(255,255,255,0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <PlayIcon />
                      </div>
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        right: 12,
                        color: '#fff',
                      }}
                    >
                      <div className="lumen-display" style={{ fontSize: isVertical ? 17 : 16, fontWeight: 700, lineHeight: 1.25, marginBottom: 4 }}>
                        {v.title}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 8,
                      borderTop: '1px solid var(--line)',
                    }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-muted)', fontWeight: 500 }}>
                      <EyeIcon /> {v.views} views
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fg-faint)' }}>{v.year || ''}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section
          id="niches"
          className="lumen-section"
          style={{ padding: '90px 32px', maxWidth: 1240, margin: '0 auto' }}
        >
          <div style={{ marginBottom: 36, maxWidth: 720 }}>
            <div className="lumen-sticker" style={{ marginBottom: 16, transform: 'rotate(-2deg)' }}>
              Topics
            </div>
            <h2
              className="lumen-display lumen-section-title"
              style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, marginBottom: 14, lineHeight: 1.05 }}
            >
              Things I will not <span className="lumen-grad-text">shut up about.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--fg-muted)', lineHeight: 1.65 }}>
              Curiosity is the job. Here is where it usually points.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {nicheChips.map((n, i) => {
              const palette = [
                'linear-gradient(135deg, #ff4ea1, #9b5cff)',
                'linear-gradient(135deg, #9b5cff, #4ecdff)',
                'linear-gradient(135deg, #4ecdff, #ff4ea1)',
                'linear-gradient(135deg, #ffd86b, #ff4ea1)',
                'linear-gradient(135deg, #4ecdff, #9b5cff)',
              ];
              return (
                <span
                  key={n.name + i}
                  className="lumen-sticker"
                  style={{
                    fontSize: 15,
                    padding: '12px 18px',
                    color: '#fff',
                    background: palette[i % palette.length],
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    transform: `rotate(${stickerRotations[i % stickerRotations.length]})`,
                  }}
                >
                  {n.icon && <span style={{ fontSize: 16 }}>{n.icon}</span>}
                  {n.name}
                </span>
              );
            })}
          </div>
        </section>

        <section
          id="brands"
          className="lumen-section"
          style={{ padding: '90px 32px', maxWidth: 1240, margin: '0 auto' }}
        >
          <div style={{ marginBottom: 48, maxWidth: 720 }}>
            <div className="lumen-sticker" style={{ marginBottom: 16, transform: 'rotate(2deg)' }}>
              Brand collabs
            </div>
            <h2
              className="lumen-display lumen-section-title"
              style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, marginBottom: 14, lineHeight: 1.05 }}
            >
              Brands I've <span className="lumen-grad-text">worked with.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--fg-muted)', lineHeight: 1.65 }}>
              Mostly repeat partners. Editorial-first, always.
            </p>
          </div>

          <div
            className="lumen-brands-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 14,
              marginBottom: 56,
            }}
          >
            {brands.map((b, i) => (
              <div
                key={b.name + i}
                className="lumen-card"
                style={{
                  padding: '24px 18px',
                  borderRadius: 18,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 110,
                  gap: 6,
                }}
              >
                <div className="lumen-display" style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.1 }}>
                  {b.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-faint)', fontWeight: 500 }}>
                  {b.type ? `${b.type}${b.year ? ' · ' + b.year : ''}` : b.year || ''}
                </div>
              </div>
            ))}
          </div>

          <div
            className="lumen-campaigns-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 22,
            }}
          >
            {campaigns.map((c2, i) => (
              <article
                key={(c2.title || 'campaign') + i}
                className="lumen-card"
                style={{
                  borderRadius: 22,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    aspectRatio: '16 / 9',
                    background: VIDEO_GRADIENTS[(i + 1) % VIDEO_GRADIENTS.length],
                    position: 'relative',
                  }}
                >
                  {c2.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c2.image} alt={c2.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : null}
                  <div
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      padding: '5px 10px',
                      borderRadius: 999,
                      background: 'rgba(0,0,0,0.55)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {c2.brand}{c2.year ? ` · ${c2.year}` : ''}
                  </div>
                </div>
                <div style={{ padding: '22px 22px 24px' }}>
                  <h3 className="lumen-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, lineHeight: 1.2 }}>
                    {c2.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.65, marginBottom: 16 }}>
                    {c2.summary}
                  </p>
                  {c2.deliverables && (
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--fg-faint)',
                        textTransform: 'uppercase',
                        letterSpacing: 1.2,
                        fontWeight: 600,
                        paddingTop: 14,
                        borderTop: '1px solid var(--line)',
                      }}
                    >
                      {c2.deliverables}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="lumen-section"
          style={{ padding: '90px 32px', maxWidth: 1240, margin: '0 auto' }}
        >
          <div
            className="lumen-about-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '0.8fr 1.2fr',
              gap: 64,
              alignItems: 'start',
            }}
          >
            <div>
              <div
                style={{
                  position: 'relative',
                  width: 'min(320px, 100%)',
                  aspectRatio: '1 / 1',
                  borderRadius: '50%',
                  padding: 6,
                  background: 'var(--gradient)',
                  boxShadow: '0 30px 70px -25px rgba(155,92,255,0.5)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: VIDEO_GRADIENTS[2],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: 96,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {c.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    initial
                  )}
                </div>
              </div>

              <div className="lumen-sticker" style={{ marginTop: 28, transform: 'rotate(-3deg)' }}>
                <HeartIcon /> Hand-edited every frame
              </div>
            </div>

            <div>
              <div className="lumen-sticker" style={{ marginBottom: 16, transform: 'rotate(1deg)' }}>
                About
              </div>
              <h2
                className="lumen-display lumen-section-title"
                style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, marginBottom: 22, lineHeight: 1.05 }}
              >
                My story, the <span className="lumen-grad-text">short cut.</span>
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--fg-muted)', marginBottom: 16 }}>
                {aboutP1}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--fg-muted)', marginBottom: 32 }}>
                {aboutP2}
              </p>

              <div
                className="lumen-quick-stats"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 14,
                }}
              >
                {[
                  { label: 'Years creating', value: yearsCreating },
                  { label: 'Upload cadence', value: cadence },
                  { label: 'Pieces published', value: totalContent },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="lumen-card"
                    style={{ padding: 18, borderRadius: 16 }}
                  >
                    <div className="lumen-display lumen-grad-text" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, marginBottom: 6 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="press"
          className="lumen-section"
          style={{ padding: '90px 32px', maxWidth: 1240, margin: '0 auto' }}
        >
          <div style={{ marginBottom: 40, maxWidth: 720 }}>
            <div className="lumen-sticker" style={{ marginBottom: 16, transform: 'rotate(-1.5deg)' }}>
              Press
            </div>
            <h2
              className="lumen-display lumen-section-title"
              style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, marginBottom: 14, lineHeight: 1.05 }}
            >
              Nice things <span className="lumen-grad-text">people wrote.</span>
            </h2>
          </div>

          <div
            className="lumen-press-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 16,
            }}
          >
            {press.map((p, i) => (
              <a
                key={p.outlet + i}
                href={p.url || '#'}
                target="_blank"
                rel="noreferrer noopener"
                className="lumen-card"
                style={{
                  padding: '22px 24px',
                  borderRadius: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 18,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontWeight: 600 }}>
                    {p.outlet}{p.year ? ` · ${p.year}` : ''}
                  </div>
                  <div className="lumen-display" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.35 }}>
                    {p.headline}
                  </div>
                </div>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: 'var(--card-strong)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--fg)',
                  }}
                >
                  <ArrowUpRightIcon />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          id="services"
          className="lumen-section"
          style={{ padding: '90px 32px', maxWidth: 1240, margin: '0 auto' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 24,
              flexWrap: 'wrap',
              marginBottom: 48,
            }}
          >
            <div style={{ maxWidth: 720 }}>
              <div className="lumen-sticker" style={{ marginBottom: 16, transform: 'rotate(2deg)' }}>
                Media kit
              </div>
              <h2
                className="lumen-display lumen-section-title"
                style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, marginBottom: 14, lineHeight: 1.05 }}
              >
                Ways to <span className="lumen-grad-text">work together.</span>
              </h2>
              <p style={{ fontSize: 16, color: 'var(--fg-muted)', lineHeight: 1.65 }}>
                Pick a format or talk to me about a custom package.
              </p>
            </div>
            <a
              href={mediaKitUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="lumen-btn-grad"
              style={{
                padding: '14px 22px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <DownloadIcon /> Download media kit
            </a>
          </div>

          <div
            className="lumen-services-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 18,
            }}
          >
            {services.map((s, i) => (
              <article
                key={(s.title || 'svc') + i}
                className="lumen-card"
                style={{
                  padding: 26,
                  borderRadius: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: i % 2 === 0 ? accent : accent3,
                    opacity: 0.1,
                    filter: 'blur(30px)',
                  }}
                />
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'var(--gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 16,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="lumen-display" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25, position: 'relative', zIndex: 1 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.65, position: 'relative', zIndex: 1 }}>
                  {s.description}
                </p>
                {s.deliverables && (
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--fg-faint)',
                      fontWeight: 600,
                      paddingTop: 12,
                      borderTop: '1px solid var(--line)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {s.deliverables}
                  </div>
                )}
                {s.startingPrice && (
                  <div
                    className="lumen-grad-text"
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 17,
                      fontWeight: 700,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {s.startingPrice}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section
          id="testimonials"
          className="lumen-section"
          style={{ padding: '90px 32px', maxWidth: 1240, margin: '0 auto' }}
        >
          <div style={{ marginBottom: 48, maxWidth: 720 }}>
            <div className="lumen-sticker" style={{ marginBottom: 16, transform: 'rotate(-2deg)' }}>
              Testimonials
            </div>
            <h2
              className="lumen-display lumen-section-title"
              style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, marginBottom: 14, lineHeight: 1.05 }}
            >
              What <span className="lumen-grad-text">partners</span> say.
            </h2>
          </div>

          <div
            className="lumen-testimonials-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 18,
            }}
          >
            {testimonials.map((t, i) => (
              <figure
                key={(t.author || 'q') + i}
                className="lumen-card"
                style={{
                  padding: 26,
                  borderRadius: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                }}
              >
                <div
                  className="lumen-display lumen-grad-text"
                  style={{ fontSize: 48, lineHeight: 0.6, fontWeight: 800 }}
                  aria-hidden
                >
                  "
                </div>
                <blockquote className="lumen-display" style={{ fontSize: 17, lineHeight: 1.45, fontWeight: 500, flex: 1 }}>
                  {t.quote}
                </blockquote>
                <figcaption
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    paddingTop: 16,
                    borderTop: '1px solid var(--line)',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'var(--gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 14,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    {t.author?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.author}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-faint)' }}>
                      {t.role}{t.brand ? ` · ${t.brand}` : ''}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="lumen-section"
          style={{ padding: '90px 32px 110px', maxWidth: 1240, margin: '0 auto' }}
        >
          <div
            className="lumen-card"
            style={{
              padding: 'clamp(28px, 5vw, 56px)',
              borderRadius: 28,
              position: 'relative',
              overflow: 'hidden',
              border: '1.5px solid var(--line)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -120,
                right: -120,
                width: 360,
                height: 360,
                borderRadius: '50%',
                background: accent,
                filter: 'blur(100px)',
                opacity: 0.35,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -120,
                left: -120,
                width: 360,
                height: 360,
                borderRadius: '50%',
                background: accent3,
                filter: 'blur(100px)',
                opacity: 0.3,
                pointerEvents: 'none',
              }}
            />

            <div
              className="lumen-contact-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 56,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div>
                <div className="lumen-sticker" style={{ marginBottom: 18, transform: 'rotate(-2deg)' }}>
                  For brand inquiries
                </div>
                <h2
                  className="lumen-display lumen-section-title"
                  style={{ fontSize: 'clamp(34px, 4.5vw, 48px)', fontWeight: 700, marginBottom: 18, lineHeight: 1.05 }}
                >
                  Let's make <span className="lumen-grad-text">something good.</span>
                </h2>
                <p style={{ fontSize: 16, color: 'var(--fg-muted)', lineHeight: 1.65, marginBottom: 28 }}>
                  Send a brief, book a call, or just say hi. I read every message myself.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="lumen-card"
                    style={{
                      padding: 16,
                      borderRadius: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: 'var(--gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      <MailIcon />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: 'var(--fg-faint)', marginBottom: 2, fontWeight: 600 }}>Direct</div>
                      <div style={{ fontSize: 14, fontWeight: 600, wordBreak: 'break-all' }}>{contactEmail}</div>
                    </div>
                  </a>

                  <a
                    href={`mailto:${managerEmail}`}
                    className="lumen-card"
                    style={{
                      padding: 16,
                      borderRadius: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: 'var(--gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      <UsersIcon />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: 'var(--fg-faint)', marginBottom: 2, fontWeight: 600 }}>Management</div>
                      <div style={{ fontSize: 14, fontWeight: 600, wordBreak: 'break-all' }}>{managerEmail}</div>
                    </div>
                  </a>

                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="lumen-card"
                    style={{
                      padding: 16,
                      borderRadius: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: 'var(--gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      <CalendarIcon />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: 'var(--fg-faint)', marginBottom: 2, fontWeight: 600 }}>Book a 20-min call</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>View my calendar</div>
                    </div>
                  </a>
                </div>

                {socialStrip.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {socialStrip.map((s) => (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={s.name}
                        className="lumen-glow"
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          border: '1px solid var(--line)',
                          background: 'var(--card)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input className="lumen-input" type="text" placeholder="Your name" required />
                  <input className="lumen-input" type="text" placeholder="Brand / company" />
                </div>
                <input className="lumen-input" type="email" placeholder="Email" required />
                <input className="lumen-input" type="text" placeholder="Budget range" />
                <textarea
                  className="lumen-input"
                  placeholder="Tell me about the project, audience, and timing."
                  rows={5}
                  style={{ resize: 'vertical', minHeight: 120 }}
                  required
                />
                <button
                  type="submit"
                  className="lumen-btn-grad"
                  style={{
                    padding: '15px 22px',
                    borderRadius: 14,
                    fontSize: 14,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  {sent ? 'Got it — talk soon' : 'Send brief'} <ArrowUpRightIcon />
                </button>
                <div style={{ fontSize: 12, color: 'var(--fg-faint)', textAlign: 'center' }}>
                  Replies usually within 48 hours.
                </div>
              </form>
            </div>
          </div>
        </section>

        <footer
          style={{
            borderTop: '1px solid var(--line)',
            padding: '36px 32px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              maxWidth: 1240,
              margin: '0 auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 13,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                {initial}
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
                {!hideBranding && (
                  <>
                    {name} <span style={{ color: 'var(--fg-faint)' }}>·</span> Built with{' '}
                    <span className="lumen-grad-text" style={{ fontWeight: 700 }}>FolioForge</span>
                  </>
                )}
                {hideBranding && name}
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-faint)' }}>
              © {new Date().getFullYear()} {username || handle.replace('@', '')}. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
