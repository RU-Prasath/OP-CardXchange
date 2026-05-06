// Default portfolio content seeded for every newly-created user.
// Mirrors the Maren Holloway template (Portfolio.html) so the new user
// starts with a fully populated portfolio they can edit.

export const DEFAULT_USER_CONTENT = [
  {
    section: 'hero',
    data: {
      name: 'Maren Holloway',
      title: 'Software Engineer',
      subtitle:
        "I'm Maren — a frontend-leaning engineer two years deep into shipping production web apps. I work where typography, motion, and gnarly state meet, mostly with TypeScript, React, and a healthy respect for the platform.",
      ctaText: 'View selected work',
      ctaLink: '#projects',
      resumeLink: '#',
      stats: [
        { number: '2', unit: 'yrs', label: 'Shipping in production' },
        { number: '14', unit: '+', label: 'Features delivered' },
        { number: '38', unit: '%', label: 'Avg. perf gains landed' },
        { number: '6', unit: '', label: 'OSS contributions' },
      ],
    },
  },
  {
    section: 'about',
    data: {
      bio: [
        "I started writing code because I wanted my zines to have hover states. Two years in, that instinct hasn't really left — I still care about the small, felt details as much as I care about correctness, accessibility, and load times.",
        "Today I work on a B2B analytics product where I own most of the visualization layer. Before that I cut my teeth at a design-systems agency, rebuilding component libraries for two healthtech clients. I'm comfortable owning a feature end-to-end — shaping the spec with PMs, pairing on the data model, and pushing the last 16 milliseconds out of an interaction.",
        "When I'm not at a keyboard I'm probably reading printed serif journals, riding the U7, or quietly judging restaurant menu typography.",
      ],
      location: 'Berlin, DE',
      timezone: 'CET (UTC+1)',
      education: 'she / her',
      languages: 'EN · DE',
    },
  },
  {
    section: 'skills',
    data: {
      categories: [
        { title: 'Languages', skills: ['TypeScript', 'JavaScript', 'HTML', 'CSS / Sass', 'SQL', 'Python'] },
        { title: 'Frameworks & UI', skills: ['React', 'Next.js', 'Remix', 'Svelte', 'Tailwind', 'Framer Motion', 'Radix UI'] },
        { title: 'Backend & Data', skills: ['Node.js', 'tRPC', 'PostgreSQL', 'Prisma', 'Redis', 'REST & GraphQL'] },
        { title: 'Tooling', skills: ['Vite', 'Turborepo', 'pnpm', 'Vitest', 'Playwright', 'Storybook'] },
        { title: 'Platform & Ops', skills: ['Vercel', 'AWS (basics)', 'Docker', 'GitHub Actions', 'Sentry'] },
        { title: 'Craft', skills: ['A11y (WCAG 2.2)', 'Perf budgeting', 'Design systems', 'Animation', 'Figma'] },
      ],
    },
  },
  {
    section: 'experience',
    data: {
      jobs: [
        {
          role: 'Frontend Engineer',
          company: 'Lattice & Loom',
          period: 'Jul 2025 – Present',
          isCurrent: true,
          summary:
            'Owning the chart and dashboard surface for a product used by 1,400+ ops teams. Working closely with a designer and a backend engineer to ship a new visualization primitive every ~6 weeks.',
          bullets: [
            'Rebuilt the dashboard renderer on a virtualized canvas — first paint −42%',
            'Shipped 8 production features incl. cohort builder & saved views',
            'Cut bundle size by −31% via route-level code splitting',
            'Drove the Radix-based design-system migration across 120+ components',
            "Wrote the team's a11y checklist; product hit WCAG 2.2 AA",
            'Reduced p95 interaction latency from 220ms to 95ms',
          ],
          stack: ['TypeScript', 'React', 'Next.js', 'tRPC', 'Postgres', 'Tailwind', 'Playwright'],
        },
        {
          role: 'Junior Developer',
          company: 'Studio Werkraum',
          period: 'May 2024 – Jun 2025',
          isCurrent: false,
          summary:
            'Embedded with two healthtech clients to build, document, and maintain their internal component libraries. Learned how to write components that survive other engineers.',
          bullets: [
            'Built 46 reusable React components from Figma specs',
            'Authored Storybook docs adopted by 3 internal teams',
            'Migrated 18-page patient-portal flow to React Server Components',
            'Improved Lighthouse score from 64 → 96 on the marketing site',
            'Set up visual-regression suite catching ~2 regressions/sprint',
            'Mentored an intern through their first PR-to-prod cycle',
          ],
          stack: ['React', 'TypeScript', 'Storybook', 'Sass', 'Vite', 'Chromatic'],
        },
      ],
    },
  },
  {
    section: 'projects',
    data: {
      items: [
        {
          id: '1',
          title: 'Plotwise',
          tag: '2026 · Solo',
          description:
            'A tiny, dependency-free charting library for product teams who keep outgrowing their dashboard tool. Renders 200k points at 60fps via a canvas+worker split.',
          stack: ['TypeScript', 'Canvas', 'Web Workers', 'Vitest'],
          liveLink: '#',
          githubLink: '#',
          image: '',
        },
        {
          id: '2',
          title: 'Marginalia',
          tag: '2025 · 2 contributors',
          description:
            'A keyboard-driven reading log for engineers. Pulls highlights from Kindle & Readwise, ranks them by re-read frequency, and gently re-surfaces them in your morning email.',
          stack: ['Next.js', 'Postgres', 'tRPC', 'Resend'],
          liveLink: '#',
          githubLink: '#',
          image: '',
        },
        {
          id: '3',
          title: 'Relay Notes',
          tag: '2025 · OSS',
          description:
            'Async stand-up tool I built for our distributed team. CRDT-backed multiplayer notes, deep links into Linear, no sign-up. Used by ~80 internal users daily.',
          stack: ['Svelte', 'Yjs', 'WebSockets', 'Fly.io'],
          liveLink: '#',
          githubLink: '#',
          image: '',
        },
        {
          id: '4',
          title: 'Kerning Club',
          tag: '2024 · For fun',
          description:
            'A daily kerning game for type nerds. Drag the letters until they sit right, get scored against a reference grid. Gentle, satisfying, weirdly addictive.',
          stack: ['React', 'Framer Motion', 'Vercel'],
          liveLink: '#',
          githubLink: '#',
          image: '',
        },
      ],
    },
  },
  {
    section: 'contact',
    data: {
      headline: "Got an interesting problem? Let's talk.",
      subtext:
        "I'm picking up freelance work for Q3 2026 and quietly looking at staff-leaning frontend roles. The form is fine — email is faster.",
      email: '',
      phone: '',
      github: 'https://github.com/marenholloway',
      linkedin: 'https://linkedin.com/in/maren-holloway',
      recipientEmail: '',
      successMessage: "Message queued. I'll get back to you within 2 business days.",
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPass: '',
      smtpName: '',
    },
  },
  {
    section: 'colors',
    data: {
      primary: '#6ee7b7',
      secondary: '#1e293b',
      accent: '#10b981',
      background: '#0f172a',
      foreground: '#f1f5f9',
      cardBg: '#1e293b',
    },
  },
];
