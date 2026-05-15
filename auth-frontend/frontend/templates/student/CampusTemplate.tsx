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

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const GraduationIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const AwardIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <path d="M15 3h6v6M10 14L21 3" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default function CampusTemplate({ content, username, hideBranding }: Props) {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const c = content || {};

  const bg = c.colorBg || '#fcfaf5';
  const fg = c.colorFg || '#1f3a5f';
  const accent = c.colorAccent || '#ffd75a';
  const accent2 = c.colorAccent2 || '#ff7b6e';
  const line = c.colorLine || '#d9d2c1';
  const card = c.colorCard || '#ffffff';

  const lightVars = `
    --bg: ${bg};
    --fg: ${fg};
    --fg-muted: #5b6d85;
    --fg-faint: #8a96aa;
    --accent: ${accent};
    --accent-soft: #fff3c1;
    --accent2: ${accent2};
    --accent2-soft: #ffd5cf;
    --line: ${line};
    --line-strong: #b8af9a;
    --card: ${card};
    --card-shadow: 0 2px 8px rgba(31, 58, 95, 0.06), 0 8px 24px rgba(31, 58, 95, 0.04);
    --card-shadow-lg: 0 8px 32px rgba(31, 58, 95, 0.12);
    --paper-line: rgba(31, 58, 95, 0.06);
  `;
  const darkVars = `
    --bg: #15243a;
    --fg: #f5efde;
    --fg-muted: #b9c4d6;
    --fg-faint: #8595ad;
    --accent: ${accent};
    --accent-soft: rgba(255, 215, 90, 0.18);
    --accent2: ${accent2};
    --accent2-soft: rgba(255, 123, 110, 0.22);
    --line: #2c3d5b;
    --line-strong: #3f5275;
    --card: #1c2e4a;
    --card-shadow: 0 2px 12px rgba(0, 0, 0, 0.25), 0 8px 28px rgba(0, 0, 0, 0.18);
    --card-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.4);
    --paper-line: rgba(245, 239, 222, 0.06);
  `;

  const cssVars = `
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=Caveat:wght@500;700&display=swap');

    .campus-template {
      ${dark ? darkVars : lightVars}
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      background: var(--bg);
      color: var(--fg);
      min-height: 100vh;
      transition: background 0.3s ease, color 0.3s ease;
    }
    .campus-template * { box-sizing: border-box; margin: 0; padding: 0; }
    .campus-template a { color: inherit; text-decoration: none; }
    .campus-template button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }

    .campus-serif { font-family: 'Lora', Georgia, serif; }
    .campus-hand { font-family: 'Caveat', cursive; }

    .campus-highlight {
      background: linear-gradient(transparent 62%, var(--accent) 62%, var(--accent) 92%, transparent 92%);
      padding: 0 4px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
    .campus-highlight-coral {
      background: linear-gradient(transparent 62%, var(--accent2-soft) 62%, var(--accent2-soft) 92%, transparent 92%);
      padding: 0 4px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
    .campus-underline-wave {
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'><path d='M0 2 Q 5 0 10 2 T 20 2' stroke='%23ff7b6e' stroke-width='1.4' fill='none'/></svg>");
      background-repeat: repeat-x;
      background-position: 0 100%;
      background-size: 16px 4px;
      padding-bottom: 6px;
    }

    .campus-paper-lines {
      background-image: repeating-linear-gradient(to bottom, transparent, transparent 31px, var(--paper-line) 31px, var(--paper-line) 32px);
    }

    .campus-card {
      background: var(--card);
      border: 1px dashed var(--line-strong);
      border-radius: 10px;
      box-shadow: var(--card-shadow);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .campus-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--card-shadow-lg);
    }

    .campus-sticky {
      background: var(--card);
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 8px 18px rgba(31, 58, 95, 0.12);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
    }
    .campus-sticky::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 36px;
      height: 12px;
      background: rgba(31, 58, 95, 0.18);
      border-radius: 2px;
    }
    .campus-sticky:hover {
      transform: rotate(0deg) translateY(-4px) !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.08), 0 14px 28px rgba(31, 58, 95, 0.18);
    }

    .campus-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 999px;
      background: var(--card);
      border: 1px solid var(--line);
      font-size: 12.5px;
      font-weight: 500;
      color: var(--fg);
      transition: all 0.2s ease;
    }
    .campus-chip:hover {
      border-color: var(--accent2);
      transform: translateY(-1px);
    }
    .campus-chip-yellow {
      background: var(--accent-soft);
      border-color: var(--accent);
    }
    .campus-chip-coral {
      background: var(--accent2-soft);
      border-color: var(--accent2);
    }

    .campus-tab {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 18px 7px 16px;
      background: var(--accent);
      color: #1f3a5f;
      font-family: 'Lora', Georgia, serif;
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border-radius: 8px 8px 0 0;
      position: relative;
      box-shadow: 0 -2px 6px rgba(31,58,95,0.06);
    }
    .campus-tab::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--accent);
    }

    .campus-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 22px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      border: 2px solid transparent;
      cursor: pointer;
    }
    .campus-btn-primary {
      background: var(--fg);
      color: var(--bg);
    }
    .campus-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(31, 58, 95, 0.25);
    }
    .campus-btn-outline {
      background: transparent;
      color: var(--fg);
      border: 2px dashed var(--fg);
    }
    .campus-btn-outline:hover {
      background: var(--accent-soft);
      border-style: solid;
    }
    .campus-btn-accent {
      background: var(--accent);
      color: #1f3a5f;
    }
    .campus-btn-accent:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(255, 215, 90, 0.5);
    }

    .campus-margin-line {
      position: relative;
      padding-left: 28px;
    }
    .campus-margin-line::before {
      content: '';
      position: absolute;
      left: 14px;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--accent2);
      opacity: 0.55;
    }

    .campus-section-title {
      font-family: 'Lora', Georgia, serif;
      font-weight: 700;
      font-size: 38px;
      line-height: 1.15;
      letter-spacing: -0.5px;
    }

    .campus-mobile-menu {
      display: none;
    }
    .campus-mobile-menu.open {
      display: flex;
    }

    .campus-form-input {
      width: 100%;
      padding: 11px 14px;
      border: 1px dashed var(--line-strong);
      border-radius: 8px;
      background: var(--card);
      color: var(--fg);
      font-family: inherit;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }
    .campus-form-input:focus {
      outline: none;
      border-color: var(--accent2);
      border-style: solid;
    }

    .campus-nav-link {
      position: relative;
      padding: 6px 2px;
      font-size: 14px;
      font-weight: 500;
      color: var(--fg-muted);
      transition: color 0.2s ease;
    }
    .campus-nav-link:hover {
      color: var(--fg);
    }
    .campus-nav-link::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -2px;
      height: 6px;
      background: var(--accent);
      opacity: 0;
      transform: scaleX(0.5);
      transition: opacity 0.2s ease, transform 0.2s ease;
      border-radius: 2px;
    }
    .campus-nav-link:hover::after {
      opacity: 0.7;
      transform: scaleX(1);
    }

    .campus-social {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--line);
      color: var(--fg);
      transition: all 0.2s ease;
    }
    .campus-social:hover {
      background: var(--accent);
      border-color: var(--accent);
      color: #1f3a5f;
      transform: translateY(-2px);
    }

    .campus-timeline {
      position: relative;
      padding-left: 32px;
    }
    .campus-timeline::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background: var(--line);
      border-style: dashed;
    }
    .campus-timeline-dot {
      position: absolute;
      left: 0;
      top: 6px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--accent);
      border: 3px solid var(--bg);
      box-shadow: 0 0 0 1px var(--line-strong);
    }

    @keyframes campus-wiggle {
      0%, 100% { transform: rotate(-1deg); }
      50% { transform: rotate(1.5deg); }
    }

    @media (max-width: 768px) {
      .campus-desktop-nav { display: none !important; }
      .campus-mobile-toggle { display: inline-flex !important; }
      .campus-hero-grid { grid-template-columns: 1fr !important; }
      .campus-about-grid { grid-template-columns: 1fr !important; }
      .campus-edu-grid { grid-template-columns: 1fr !important; }
      .campus-skills-grid { grid-template-columns: 1fr !important; }
      .campus-projects-grid { grid-template-columns: 1fr !important; }
      .campus-achievements-grid { grid-template-columns: 1fr !important; }
      .campus-activities-grid { grid-template-columns: 1fr !important; }
      .campus-certs-grid { grid-template-columns: 1fr !important; }
      .campus-contact-grid { grid-template-columns: 1fr !important; }
      .campus-section-title { font-size: 30px !important; }
      .campus-hero-title { font-size: 44px !important; }
      .campus-section { padding: 60px 18px !important; }
      .campus-nav-cta-desktop { display: none !important; }
      .campus-stats-row { flex-wrap: wrap !important; }
    }
  `;

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#education', label: 'Education' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
  ];

  const name = c.name || 'Alex Morgan';
  const initial = name.charAt(0).toUpperCase();
  const title = c.title || 'Computer Science Student & Aspiring Engineer';
  const degree = c.degree || 'B.S. in Computer Science';
  const university = c.university || 'State University';
  const graduation = c.graduation || 'Expected May 2026';
  const gpa = c.gpa || '3.87 / 4.0';
  const tagline = c.tagline || 'Curious learner building things at the intersection of code, research, and creativity.';
  const location = c.location || 'San Francisco, CA';
  const languages = c.languages || 'English (Native), Spanish (Fluent)';
  const interests = c.interests || 'Hiking, Chess, Pixel Art, Open Source';
  const aboutP1 = c.aboutP1 || `I'm a third-year computer science student passionate about turning ideas into useful software. My favorite kinds of problems live somewhere between systems thinking and user experience — making technology that's both technically solid and genuinely helpful.`;
  const aboutP2 = c.aboutP2 || `Outside of class, I work on side projects, contribute to small open-source libraries, and TA an introductory programming course. I'm currently looking for a Summer 2026 software engineering internship.`;
  const contactEmail = c.contactEmail || 'alex@university.edu';
  const contactPhone = c.contactPhone || '+1 (555) 123-4567';
  const githubUrl = c.githubUrl || '#';
  const linkedinUrl = c.linkedinUrl || '#';
  const twitterUrl = c.twitterUrl || '';
  const resumeUrl = c.resumeUrl || '#';

  type EduItem = { school: string; degree: string; period: string; gpa: string; location: string; coursework: string; achievements: string };
  const education = parseJ<EduItem[]>(c.educationJson, [
    {
      school: 'State University',
      degree: 'B.S. in Computer Science, Minor in Mathematics',
      period: '2022 — 2026 (Expected)',
      gpa: '3.87 / 4.0',
      location: 'San Francisco, CA',
      coursework: 'Data Structures, Algorithms, Operating Systems, Machine Learning, Databases, Computer Networks, Compilers, Linear Algebra',
      achievements: "Dean's List (5 semesters), Honors Program, ACM Programming Team",
    },
    {
      school: 'Central High School',
      degree: 'High School Diploma, Valedictorian',
      period: '2018 — 2022',
      gpa: '4.0 / 4.0',
      location: 'Portland, OR',
      coursework: 'AP Computer Science A, AP Calculus BC, AP Physics C',
      achievements: 'National Merit Scholar, Robotics Club President',
    },
  ]);

  type SkillCat = { category: string; items: string };
  const skillCats = parseJ<SkillCat[]>(c.skillsJson, [
    { category: 'Technical', items: 'Python, Java, JavaScript, TypeScript, C++, SQL, Go' },
    { category: 'Frameworks', items: 'React, Next.js, Node.js, Express, FastAPI, PyTorch, TensorFlow' },
    { category: 'Tools', items: 'Git, Docker, Linux, AWS, PostgreSQL, MongoDB, Figma' },
    { category: 'Languages', items: 'English (Native), Spanish (Fluent), Mandarin (Basic)' },
    { category: 'Soft Skills', items: 'Collaboration, Technical Writing, Mentoring, Public Speaking' },
  ]);

  type Project = { title: string; context: string; description: string; tags: string; githubUrl: string; liveUrl: string; year: string };
  const projects = parseJ<Project[]>(c.projectsJson, [
    {
      title: 'StudyBuddy AI',
      context: 'Personal Project · 2025',
      description: 'A flashcard app that auto-generates study questions from lecture PDFs using a fine-tuned language model. Used by 200+ students in my CS program.',
      tags: 'Next.js, OpenAI API, PostgreSQL, Tailwind',
      githubUrl: '#',
      liveUrl: '#',
      year: '2025',
    },
    {
      title: 'Campus Bike Routing',
      context: 'CS 360 — Algorithms · 2024',
      description: 'Implemented a modified A* algorithm that optimizes bike routes across campus, factoring in hills and traffic. Won "Best Project" in the course.',
      tags: 'Python, NetworkX, Flask, Leaflet',
      githubUrl: '#',
      liveUrl: '',
      year: '2024',
    },
    {
      title: 'Distributed Key-Value Store',
      context: 'CS 425 — Distributed Systems · 2024',
      description: 'Built a Raft-based distributed key-value store from scratch in Go. Handles node failures, leader elections, and log replication across a cluster.',
      tags: 'Go, gRPC, Raft, Docker',
      githubUrl: '#',
      liveUrl: '',
      year: '2024',
    },
    {
      title: 'Pixel Garden',
      context: 'Game Jam · 2023',
      description: 'A cozy pixel-art gardening game built in 48 hours for Ludum Dare. Placed in the top 10% of entries for "Mood" category.',
      tags: 'Godot, GDScript, Aseprite',
      githubUrl: '#',
      liveUrl: '#',
      year: '2023',
    },
  ]);

  type Research = { title: string; authors: string; venue: string; year: string; url: string; abstract: string };
  const research = parseJ<Research[]>(c.researchJson, [
    {
      title: 'Lightweight Transformer Models for On-Device Translation',
      authors: 'A. Morgan, J. Patel, Dr. R. Chen',
      venue: 'Undergraduate Research Symposium',
      year: '2025',
      url: '#',
      abstract: 'Explored quantization and distillation techniques to fit transformer translation models on mobile devices with minimal quality loss.',
    },
    {
      title: 'Visualizing Algorithmic Bias in Recommendation Systems',
      authors: 'A. Morgan, Dr. K. Lin',
      venue: 'Campus Data Science Poster Session',
      year: '2024',
      url: '#',
      abstract: 'Built an interactive dashboard that exposes how collaborative filtering can amplify popularity bias over time.',
    },
  ]);

  type Experience = { role: string; company: string; period: string; location: string; bullets: string; stack: string };
  const experience = parseJ<Experience[]>(c.experienceJson, [
    {
      role: 'Software Engineering Intern',
      company: 'Northwind Labs',
      period: 'Summer 2025',
      location: 'Remote',
      bullets: 'Built a usage analytics pipeline processing 5M events/day in Kafka & ClickHouse\nShipped a customer-facing dashboard in React; cut support tickets 18%\nWrote unit + integration tests, raising coverage from 64% → 89%',
      stack: 'TypeScript, React, Node.js, Kafka, ClickHouse',
    },
    {
      role: 'Undergraduate Teaching Assistant',
      company: 'State University — Dept. of CS',
      period: 'Sep 2024 — Present',
      location: 'San Francisco, CA',
      bullets: 'Lead 2 weekly lab sections for CS 101 (Intro to Programming), ~50 students total\nHold office hours and grade assignments; consistently rated 4.8/5 by students\nAuthored 3 new lab handouts adopted by the department',
      stack: 'Python, pedagogy, mentorship',
    },
    {
      role: 'Research Assistant',
      company: 'University NLP Lab',
      period: 'Jan 2024 — Aug 2024',
      location: 'San Francisco, CA',
      bullets: 'Co-authored a paper on lightweight translation models (poster at URS 2025)\nFine-tuned and benchmarked 6 transformer variants on a 4-GPU cluster\nMaintained the lab\'s shared experiment-tracking infrastructure',
      stack: 'PyTorch, HuggingFace, SLURM, Weights & Biases',
    },
  ]);

  type Achievement = { title: string; issuer: string; year: string; description: string };
  const achievements = parseJ<Achievement[]>(c.achievementsJson, [
    { title: "Dean's List", issuer: 'State University', year: '2022 – 2025', description: 'Awarded for maintaining a GPA above 3.85 across five consecutive semesters.' },
    { title: '1st Place — Campus Hackathon', issuer: 'HackState 2024', year: '2024', description: 'Built an accessibility-focused note-taking tool in 36 hours; team of four.' },
    { title: 'Goldwater Scholar Nominee', issuer: 'State University', year: '2025', description: 'Selected as one of four campus nominees for the national STEM scholarship.' },
    { title: 'Outstanding TA Award', issuer: 'Dept. of Computer Science', year: '2025', description: 'Recognized for top teaching evaluations and lab material contributions.' },
  ]);

  type Activity = { role: string; org: string; period: string; description: string };
  const activities = parseJ<Activity[]>(c.activitiesJson, [
    { role: 'President', org: 'ACM Student Chapter', period: '2024 — Present', description: 'Lead a 12-person board organizing weekly tech talks, a yearly hackathon, and an industry mentorship program.' },
    { role: 'Volunteer Tutor', org: 'CodePath After-School', period: '2023 — Present', description: 'Teach Python fundamentals to local high-school students every Saturday.' },
    { role: 'Member', org: 'Women in Computing', period: '2022 — Present', description: 'Participate in workshops, mentorship pairs, and outreach events with local middle schools.' },
  ]);

  type Cert = { name: string; issuer: string; year: string; url: string };
  const certs = parseJ<Cert[]>(c.certsJson, [
    { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2025', url: '#' },
    { name: 'Deep Learning Specialization', issuer: 'Coursera / DeepLearning.AI', year: '2024', url: '#' },
    { name: 'Google Data Analytics Certificate', issuer: 'Coursera / Google', year: '2024', url: '#' },
  ]);

  const stickyRotations = ['-2deg', '1.5deg', '-1deg', '2deg', '-1.5deg', '1deg'];

  return (
    <div className="campus-template">
      <style suppressHydrationWarning>{cssVars}</style>

      {/* NAV */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: dark ? 'rgba(21, 36, 58, 0.92)' : 'rgba(252, 250, 245, 0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px dashed var(--line-strong)',
        }}
      >
        <nav
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <a
            href="#top"
            onClick={(e) => scrollTo(e, '#top')}
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'var(--accent)',
                color: '#1f3a5f',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Lora', serif",
                fontWeight: 700,
                fontSize: 18,
                transform: 'rotate(-4deg)',
                boxShadow: '0 2px 0 var(--accent2)',
              }}
            >
              {initial}
            </span>
            <span
              className="campus-serif"
              style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.2px' }}
            >
              {name.split(' ')[0]}
              <span style={{ color: 'var(--accent2)' }}>.</span>
            </span>
          </a>

          <div
            className="campus-desktop-nav"
            style={{ display: 'flex', alignItems: 'center', gap: 26 }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => scrollTo(e, l.href)}
                className="campus-nav-link"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: '1px dashed var(--line-strong)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg)',
              }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="campus-btn campus-btn-accent campus-nav-cta-desktop"
              style={{ padding: '9px 16px', fontSize: 13 }}
            >
              <DownloadIcon /> CV
            </a>
            <button
              className="campus-mobile-toggle"
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'none',
                width: 36,
                height: 36,
                borderRadius: 8,
                border: '1px dashed var(--line-strong)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div
            className="campus-mobile-menu open"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              padding: '12px 28px 18px',
              borderTop: '1px dashed var(--line)',
            }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => scrollTo(e, l.href)}
                style={{
                  padding: '10px 4px',
                  fontSize: 15,
                  fontWeight: 500,
                  borderBottom: '1px dashed var(--line)',
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="campus-btn campus-btn-accent"
              style={{ marginTop: 12, justifyContent: 'center' }}
            >
              <DownloadIcon /> Download CV
            </a>
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO */}
        <section
          className="campus-section campus-paper-lines"
          style={{
            padding: '92px 28px 84px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              position: 'relative',
            }}
          >
            <div
              className="campus-hand"
              style={{
                fontSize: 24,
                color: 'var(--accent2)',
                transform: 'rotate(-3deg)',
                display: 'inline-block',
                marginBottom: 14,
              }}
            >
              Hello there
            </div>
            <h1
              className="campus-serif campus-hero-title"
              style={{
                fontSize: 64,
                lineHeight: 1.08,
                fontWeight: 700,
                letterSpacing: '-1.2px',
                marginBottom: 18,
              }}
            >
              Hi, I&apos;m{' '}
              <span className="campus-highlight">{name}</span>
            </h1>
            <p
              className="campus-serif"
              style={{
                fontSize: 22,
                lineHeight: 1.5,
                color: 'var(--fg-muted)',
                fontStyle: 'italic',
                marginBottom: 18,
                maxWidth: 760,
              }}
            >
              {title}
            </p>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: 'var(--fg-muted)',
                maxWidth: 680,
                marginBottom: 26,
              }}
            >
              Studying <span className="campus-highlight-coral">{degree}</span> at{' '}
              <strong style={{ color: 'var(--fg)' }}>{university}</strong>. {tagline}
            </p>

            <div
              className="campus-stats-row"
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 30,
                flexWrap: 'wrap',
              }}
            >
              {gpa && (
                <span
                  className="campus-chip campus-chip-yellow"
                  style={{ padding: '8px 16px', fontSize: 13.5 }}
                >
                  <AwardIcon /> GPA {gpa}
                </span>
              )}
              {graduation && (
                <span
                  className="campus-chip"
                  style={{ padding: '8px 16px', fontSize: 13.5 }}
                >
                  <GraduationIcon /> {graduation}
                </span>
              )}
              {location && (
                <span
                  className="campus-chip"
                  style={{ padding: '8px 16px', fontSize: 13.5 }}
                >
                  <MapPinIcon /> {location}
                </span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                marginBottom: 28,
              }}
            >
              <a
                href="#projects"
                onClick={(e) => scrollTo(e, '#projects')}
                className="campus-btn campus-btn-primary"
              >
                View my projects
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollTo(e, '#contact')}
                className="campus-btn campus-btn-outline"
              >
                Get in touch
              </a>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="campus-social" aria-label="GitHub">
                  <GithubIcon />
                </a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="campus-social" aria-label="LinkedIn">
                  <LinkedinIcon />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="campus-social" aria-label="Twitter">
                  <TwitterIcon />
                </a>
              )}
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="campus-social" aria-label="Email">
                  <MailIcon />
                </a>
              )}
            </div>

            <div
              style={{
                position: 'absolute',
                top: -10,
                right: 10,
                transform: 'rotate(8deg)',
                fontFamily: "'Caveat', cursive",
                color: 'var(--accent2)',
                fontSize: 20,
                opacity: 0.85,
                pointerEvents: 'none',
              }}
            >
              {/* page corner doodle */}
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M10 40 Q 25 12, 45 18 T 70 35" />
                <path d="M65 30 L70 35 L66 41" />
                <circle cx="20" cy="58" r="2" fill="currentColor" />
                <circle cx="32" cy="64" r="1.6" fill="currentColor" />
              </svg>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="campus-section"
          style={{ padding: '90px 28px', borderTop: '1px dashed var(--line)' }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <span className="campus-tab"><BookIcon /> About</span>
              <h2 className="campus-section-title" style={{ marginTop: 10 }}>
                A few <span className="campus-highlight">notes</span> about me
              </h2>
            </div>

            <div
              className="campus-about-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.6fr 1fr',
                gap: 36,
                alignItems: 'start',
              }}
            >
              <div
                className="campus-margin-line campus-paper-lines"
                style={{
                  padding: '6px 28px 6px 32px',
                }}
              >
                <p
                  className="campus-serif"
                  style={{
                    fontSize: 18,
                    lineHeight: 1.85,
                    color: 'var(--fg)',
                    marginBottom: 18,
                  }}
                >
                  {aboutP1}
                </p>
                <p
                  className="campus-serif"
                  style={{
                    fontSize: 18,
                    lineHeight: 1.85,
                    color: 'var(--fg-muted)',
                  }}
                >
                  {aboutP2}
                </p>
              </div>

              <aside
                className="campus-sticky"
                style={{
                  padding: '28px 24px 24px',
                  transform: 'rotate(-1.5deg)',
                  background: 'var(--accent-soft)',
                }}
              >
                <div
                  className="campus-hand"
                  style={{ fontSize: 26, marginBottom: 10, color: 'var(--fg)' }}
                >
                  Quick facts!
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--fg-muted)', marginBottom: 3, fontWeight: 600 }}>Location</div>
                    <div style={{ fontSize: 14, color: 'var(--fg)' }}>{location}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--fg-muted)', marginBottom: 3, fontWeight: 600 }}>Languages</div>
                    <div style={{ fontSize: 14, color: 'var(--fg)' }}>{languages}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--fg-muted)', marginBottom: 3, fontWeight: 600 }}>Interests</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                      {pl(interests).map((it) => (
                        <span key={it} className="campus-chip" style={{ padding: '3px 10px', fontSize: 12 }}>{it}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section
          id="education"
          className="campus-section"
          style={{ padding: '90px 28px', borderTop: '1px dashed var(--line)', background: dark ? 'rgba(255,255,255,0.015)' : 'rgba(31, 58, 95, 0.025)' }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <span className="campus-tab"><GraduationIcon /> Education</span>
              <h2 className="campus-section-title" style={{ marginTop: 10 }}>
                Where I&apos;m <span className="campus-highlight-coral">learning</span>
              </h2>
            </div>

            <div className="campus-timeline">
              {education.map((edu, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: 38 }}>
                  <span className="campus-timeline-dot" />
                  <div className="campus-card" style={{ padding: '22px 26px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
                      <div>
                        <h3 className="campus-serif" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{edu.school}</h3>
                        <div style={{ fontSize: 15, color: 'var(--fg-muted)' }}>{edu.degree}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-muted)', marginBottom: 4 }}>
                          <CalendarIcon /> {edu.period}
                        </div>
                        {edu.location && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, fontSize: 12.5, color: 'var(--fg-faint)' }}>
                            <MapPinIcon /> {edu.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {edu.gpa && (
                      <div style={{ marginBottom: 12 }}>
                        <span className="campus-chip campus-chip-yellow"><AwardIcon /> GPA {edu.gpa}</span>
                      </div>
                    )}

                    {edu.coursework && (
                      <div style={{ marginBottom: 12 }}>
                        <div className="campus-hand" style={{ fontSize: 18, color: 'var(--accent2)', marginBottom: 6 }}>Relevant coursework</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {pl(edu.coursework).map((cw) => (
                            <span key={cw} className="campus-chip" style={{ fontSize: 12 }}>{cw}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {edu.achievements && (
                      <div>
                        <div className="campus-hand" style={{ fontSize: 18, color: 'var(--accent2)', marginBottom: 6 }}>Highlights</div>
                        <div style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6 }}>{edu.achievements}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section
          id="skills"
          className="campus-section"
          style={{ padding: '90px 28px', borderTop: '1px dashed var(--line)' }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <span className="campus-tab">Skills</span>
              <h2 className="campus-section-title" style={{ marginTop: 10 }}>
                Things I&apos;m <span className="campus-highlight">good at</span>
              </h2>
            </div>

            <div
              className="campus-skills-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 22,
              }}
            >
              {skillCats.map((cat, i) => (
                <div key={i} className="campus-card" style={{ padding: '22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 50,
                        background: i % 2 === 0 ? 'var(--accent)' : 'var(--accent2)',
                        boxShadow: `0 0 0 4px ${i % 2 === 0 ? 'var(--accent-soft)' : 'var(--accent2-soft)'}`,
                      }}
                    />
                    <h3 className="campus-serif" style={{ fontSize: 18, fontWeight: 700 }}>
                      {cat.category}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {pl(cat.items).map((s, idx) => (
                      <span
                        key={s + idx}
                        className={`campus-chip${idx % 5 === 0 ? ' campus-chip-yellow' : idx % 5 === 2 ? ' campus-chip-coral' : ''}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="campus-section"
          style={{ padding: '90px 28px', borderTop: '1px dashed var(--line)', background: dark ? 'rgba(255,255,255,0.015)' : 'rgba(31, 58, 95, 0.025)' }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span className="campus-tab">Projects</span>
                <h2 className="campus-section-title" style={{ marginTop: 10 }}>
                  Things I&apos;ve <span className="campus-highlight-coral">built</span>
                </h2>
              </div>
              <span className="campus-hand" style={{ fontSize: 22, color: 'var(--fg-muted)' }}>
                ↓ a mix of coursework & side projects
              </span>
            </div>

            <div
              className="campus-projects-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 22,
              }}
            >
              {projects.map((p, i) => (
                <article
                  key={i}
                  className="campus-card"
                  style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                  <div
                    style={{
                      padding: '10px 18px',
                      borderBottom: '1px dashed var(--line)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: i % 2 === 0 ? 'var(--accent-soft)' : 'var(--accent2-soft)',
                    }}
                  >
                    <span
                      className="campus-hand"
                      style={{ fontSize: 18, color: 'var(--fg)', lineHeight: 1 }}
                    >
                      {p.context}
                    </span>
                    {p.year && (
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--fg-muted)' }}>{p.year}</span>
                    )}
                  </div>
                  <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 className="campus-serif" style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--fg-muted)', marginBottom: 16, flex: 1 }}>
                      {p.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                      {pl(p.tags).map((t) => (
                        <span key={t} className="campus-chip" style={{ fontSize: 11.5, padding: '3px 9px' }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, fontWeight: 600 }}>
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--fg)' }}
                        >
                          <GithubIcon /> Code
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent2)' }}
                        >
                          <ExternalLinkIcon /> Live demo
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* RESEARCH */}
        {research.length > 0 && (
          <section
            id="research"
            className="campus-section"
            style={{ padding: '90px 28px', borderTop: '1px dashed var(--line)' }}
          >
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ marginBottom: 32 }}>
                <span className="campus-tab"><BookIcon /> Research</span>
                <h2 className="campus-section-title" style={{ marginTop: 10 }}>
                  Papers & <span className="campus-highlight">posters</span>
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {research.map((r, i) => (
                  <article
                    key={i}
                    className="campus-card campus-margin-line"
                    style={{ padding: '22px 26px 22px 38px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
                      <h3 className="campus-serif" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, flex: 1, minWidth: 240 }}>
                        {r.url ? (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <span className="campus-underline-wave">{r.title}</span>
                            <ExternalLinkIcon />
                          </a>
                        ) : r.title}
                      </h3>
                      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: 'var(--fg-muted)', textTransform: 'uppercase' }}>{r.year}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginBottom: 6 }}>
                      <em>{r.authors}</em>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--fg-faint)', marginBottom: 10 }}>
                      {r.venue}
                    </div>
                    {r.abstract && (
                      <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--fg-muted)' }}>{r.abstract}</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        <section
          id="experience"
          className="campus-section"
          style={{ padding: '90px 28px', borderTop: '1px dashed var(--line)', background: dark ? 'rgba(255,255,255,0.015)' : 'rgba(31, 58, 95, 0.025)' }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <span className="campus-tab">Experience</span>
              <h2 className="campus-section-title" style={{ marginTop: 10 }}>
                Internships & <span className="campus-highlight-coral">roles</span>
              </h2>
            </div>

            <div className="campus-timeline">
              {experience.map((e, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: 36 }}>
                  <span className="campus-timeline-dot" style={{ background: i % 2 === 0 ? 'var(--accent)' : 'var(--accent2)' }} />
                  <div className="campus-card" style={{ padding: '22px 26px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                      <div>
                        <h3 className="campus-serif" style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{e.role}</h3>
                        <div style={{ fontSize: 14.5, color: 'var(--fg-muted)' }}>{e.company}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-muted)' }}>
                          <CalendarIcon /> {e.period}
                        </div>
                        {e.location && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, fontSize: 12.5, color: 'var(--fg-faint)', marginTop: 4 }}>
                            <MapPinIcon /> {e.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 14 }}>
                      {lines(e.bullets).map((b, idx) => (
                        <li key={idx} style={{ position: 'relative', paddingLeft: 22, fontSize: 14.5, lineHeight: 1.65, marginBottom: 6, color: 'var(--fg-muted)' }}>
                          <span style={{ position: 'absolute', left: 0, top: 0, color: 'var(--accent2)', fontWeight: 700 }}>›</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    {e.stack && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {pl(e.stack).map((s) => (
                          <span key={s} className="campus-chip" style={{ fontSize: 11.5, padding: '3px 9px' }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section
          id="achievements"
          className="campus-section"
          style={{ padding: '90px 28px', borderTop: '1px dashed var(--line)' }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 36 }}>
              <span className="campus-tab"><AwardIcon /> Achievements</span>
              <h2 className="campus-section-title" style={{ marginTop: 10 }}>
                Awards & <span className="campus-highlight">honors</span>
              </h2>
            </div>

            <div
              className="campus-achievements-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 26,
              }}
            >
              {achievements.map((a, i) => (
                <div
                  key={i}
                  className="campus-sticky"
                  style={{
                    padding: '26px 22px 22px',
                    transform: `rotate(${stickyRotations[i % stickyRotations.length]})`,
                    background: i % 3 === 0 ? 'var(--accent-soft)' : i % 3 === 1 ? 'var(--accent2-soft)' : 'var(--card)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                    <h3 className="campus-serif" style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.3 }}>{a.title}</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--fg-muted)' }}>{a.year}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 10, fontStyle: 'italic' }}>{a.issuer}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg)' }}>{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACTIVITIES */}
        <section
          id="activities"
          className="campus-section"
          style={{ padding: '90px 28px', borderTop: '1px dashed var(--line)', background: dark ? 'rgba(255,255,255,0.015)' : 'rgba(31, 58, 95, 0.025)' }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <span className="campus-tab">Activities</span>
              <h2 className="campus-section-title" style={{ marginTop: 10 }}>
                Clubs & <span className="campus-highlight-coral">leadership</span>
              </h2>
            </div>

            <div
              className="campus-activities-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 22,
              }}
            >
              {activities.map((a, i) => (
                <div key={i} className="campus-card campus-margin-line" style={{ padding: '22px 22px 22px 36px' }}>
                  <div style={{ fontSize: 12, color: 'var(--accent2)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{a.period}</div>
                  <h3 className="campus-serif" style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{a.role}</h3>
                  <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginBottom: 12 }}>{a.org}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg-muted)' }}>{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        {certs.length > 0 && (
          <section
            id="certs"
            className="campus-section"
            style={{ padding: '90px 28px', borderTop: '1px dashed var(--line)' }}
          >
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ marginBottom: 32 }}>
                <span className="campus-tab">Certifications</span>
                <h2 className="campus-section-title" style={{ marginTop: 10 }}>
                  Extra <span className="campus-highlight">credentials</span>
                </h2>
              </div>

              <div
                className="campus-certs-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 16,
                }}
              >
                {certs.map((cert, i) => (
                  <a
                    key={i}
                    href={cert.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="campus-card"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          background: 'var(--accent-soft)',
                          color: '#1f3a5f',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <AwardIcon />
                      </span>
                      <div>
                        <div className="campus-serif" style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{cert.name}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>{cert.issuer} · {cert.year}</div>
                      </div>
                    </div>
                    {cert.url && (
                      <span style={{ color: 'var(--fg-faint)' }}><ExternalLinkIcon /></span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section
          id="contact"
          className="campus-section"
          style={{ padding: '92px 28px', borderTop: '1px dashed var(--line)', background: dark ? 'rgba(255,255,255,0.015)' : 'rgba(31, 58, 95, 0.025)' }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ marginBottom: 36, textAlign: 'center' }}>
              <div className="campus-hand" style={{ fontSize: 26, color: 'var(--accent2)', marginBottom: 6 }}>let&apos;s chat</div>
              <h2 className="campus-section-title">
                Get in <span className="campus-highlight">touch</span>
              </h2>
              <p className="campus-serif" style={{ fontSize: 17, color: 'var(--fg-muted)', marginTop: 12, maxWidth: 560, margin: '12px auto 0', fontStyle: 'italic' }}>
                Looking for an intern, collaborator, or just want to chat about a project? My inbox is open.
              </p>
            </div>

            <div
              className="campus-contact-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr',
                gap: 28,
                alignItems: 'stretch',
              }}
            >
              <div className="campus-card" style={{ padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 className="campus-serif" style={{ fontSize: 19, fontWeight: 700 }}>Reach me directly</h3>

                {contactEmail && (
                  <a href={`mailto:${contactEmail}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><MailIcon /></span>
                    <div>
                      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--fg-muted)', fontWeight: 600 }}>Email</div>
                      <div style={{ fontSize: 14, fontWeight: 500, wordBreak: 'break-all' }}>{contactEmail}</div>
                    </div>
                  </a>
                )}

                {contactPhone && (
                  <a href={`tel:${contactPhone}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent2-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><PhoneIcon /></span>
                    <div>
                      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--fg-muted)', fontWeight: 600 }}>Phone</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{contactPhone}</div>
                    </div>
                  </a>
                )}

                {location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><MapPinIcon /></span>
                    <div>
                      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--fg-muted)', fontWeight: 600 }}>Location</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{location}</div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                  {githubUrl && (
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="campus-social" aria-label="GitHub"><GithubIcon /></a>
                  )}
                  {linkedinUrl && (
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="campus-social" aria-label="LinkedIn"><LinkedinIcon /></a>
                  )}
                  {twitterUrl && (
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="campus-social" aria-label="Twitter"><TwitterIcon /></a>
                  )}
                  {resumeUrl && (
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="campus-social" aria-label="Resume"><DownloadIcon /></a>
                  )}
                </div>
              </div>

              <form
                className="campus-card"
                onSubmit={(e) => { e.preventDefault(); }}
                style={{ padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <h3 className="campus-serif" style={{ fontSize: 19, fontWeight: 700 }}>Or send a quick note</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 600, marginBottom: 4, display: 'block' }}>Your name</label>
                    <input className="campus-form-input" type="text" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 600, marginBottom: 4, display: 'block' }}>Email</label>
                    <input className="campus-form-input" type="email" placeholder="you@email.com" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 600, marginBottom: 4, display: 'block' }}>Subject</label>
                  <input className="campus-form-input" type="text" placeholder="Internship opportunity" />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 600, marginBottom: 4, display: 'block' }}>Message</label>
                  <textarea className="campus-form-input" rows={5} placeholder="Tell me what you have in mind..." />
                </div>
                <button type="submit" className="campus-btn campus-btn-primary" style={{ alignSelf: 'flex-start' }}>
                  Send message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          padding: '32px 28px',
          borderTop: '1px dashed var(--line-strong)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div className="campus-hand" style={{ fontSize: 22, color: 'var(--accent2)' }}>
            thanks for scrolling all the way down
          </div>
          {!hideBranding && (
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
              © {new Date().getFullYear()} {name} · Built with{' '}
              <a
                href="https://folioforge.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--fg)', fontWeight: 600, borderBottom: '1px dashed var(--line-strong)' }}
              >
                FolioForge
              </a>
            </div>
          )}
          {hideBranding && (
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
              © {new Date().getFullYear()} {name}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
