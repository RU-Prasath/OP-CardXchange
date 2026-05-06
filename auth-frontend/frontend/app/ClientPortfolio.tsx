'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Skills from '@/components/public/Skills';
import Experience from '@/components/public/Experience';
import Projects from '@/components/public/Projects';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';

// Default fallback data
const defaultHero = {
  name: 'Prasath R U',
  title: 'Junior Software Developer',
  subtitle:
    'Building scalable web applications using React.js, Next.js, Node.js, and MongoDB. Experienced in real-time dashboards, REST APIs, and performance-optimized frontends.',
  ctaText: 'View My Work',
  ctaLink: '#projects',
  resumeLink: '#',
  stats: [
    { number: '2', unit: 'yrs', label: 'Experience' },
    { number: '10', unit: '+', label: 'Projects Delivered' },
    { number: '30', unit: '%', label: 'Avg. Performance Gains' },
    { number: '3', unit: '', label: 'Companies Worked' },
  ],
};

const defaultAbout = {
  bio: [
    'I started as a frontend developer with a love for clean, responsive UI. Two years in, I\'ve grown into a full-stack MERN developer who cares about performance, clean code, and real-world impact.',
    'Currently at Redisolve Software, I build HRMS systems, real-time dashboards, and news aggregation platforms. I\'m pursuing my MCA while working full-time because I believe learning never stops.',
    'Outside of code, I enjoy hackathons, exploring new tech stacks, and contributing to projects that make a difference.',
  ],
  location: 'Chennai, India',
  timezone: 'IST (UTC+5:30)',
  education: 'MCA — University of Madras',
  languages: 'Tamil · English',
  profileImage: '',
};

const defaultSkills = {
  categories: [
    { title: 'Languages', skills: ['JavaScript', 'HTML', 'CSS / SCSS', 'SQL'] },
    { title: 'Frontend', skills: ['React.js', 'Next.js', 'TanStack Query', 'Tailwind CSS', 'Bootstrap'] },
    { title: 'Backend', skills: ['Node.js', 'Express.js', 'REST APIs'] },
    { title: 'Database', skills: ['MongoDB', 'MySQL', 'MSSQL'] },
    { title: 'Tools', skills: ['GitHub', 'GitLab', 'Postman', 'VS Code', 'Figma', 'Canva'] },
    { title: 'Soft Skills', skills: ['Problem Solving', 'Clean Code', 'Responsive Design', 'Performance Optimization'] },
  ],
};

const defaultExperience = {
  jobs: [
    {
      role: 'Junior Software Developer',
      company: 'Redisolve Software Pvt Ltd',
      period: 'July 2025 – Present',
      isCurrent: true,
      summary: 'Building full-scale HRMS, real-time dashboards, and news aggregation platforms.',
      bullets: [
        'Engineered full-scale HRMS managing employee lifecycle from onboarding to offboarding',
        'Built real-time Attendance Dashboard with biometric data integration, reducing manual tracking by ~40%',
        'Built NewsHarvest news aggregation platform with automated scraping pipelines',
        'Optimized frontend with TanStack Query, reducing redundant API calls by ~30%',
        'Developing Redisolve website with Next.js',
      ],
      stack: ['React.js', 'Next.js', 'Node.js', 'MongoDB', 'MSSQL', 'TanStack Query'],
    },
    {
      role: 'Trainee Developer',
      company: "Hema's Enterprises Pvt Ltd",
      period: 'Jun 2024 – Feb 2025',
      isCurrent: false,
      summary: 'Developed frontend for multiple applications with reusable React components.',
      bullets: [
        'Developed frontend for multiple applications using React.js with reusable component architecture',
        'Built e-commerce and real estate platforms with responsive UI',
        'Integrated REST APIs using Axios, improving data loading efficiency',
        'Improved frontend development efficiency by 30%',
      ],
      stack: ['React.js', 'Axios', 'Bootstrap', 'Tailwind CSS'],
    },
    {
      role: 'Front-End Developer',
      company: 'Indiaproduced.com',
      period: 'Sep 2023 – Feb 2024',
      isCurrent: false,
      summary: 'Maintained Shopify stores and built real estate web platform.',
      bullets: [
        'Maintained and optimized Shopify e-commerce websites',
        'Developed AG Property & Facility real estate platform using React.js',
        'Reduced page load time by ~20%',
      ],
      stack: ['React.js', 'Shopify', 'JavaScript', 'CSS'],
    },
  ],
};

const defaultProjects = {
  items: [
    {
      id: '1',
      title: 'Personal Portfolio',
      tag: 'MERN Stack',
      description:
        'A dynamic personal portfolio website using the MERN stack to showcase skills, experience, and projects. Clean, fully responsive UI with smooth navigation.',
      stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
      liveLink: '#',
      githubLink: '#',
      image: '',
    },
    {
      id: '2',
      title: 'CRM Dashboard',
      tag: 'Insurance & Loan Management',
      description:
        'Dashboard for insurance and loan management with lead tracking system. Implemented analytics and data visualization for performance tracking.',
      stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
      liveLink: '#',
      githubLink: '#',
      image: '',
    },
    {
      id: '3',
      title: 'Website Development Service Platform',
      tag: 'MERN Stack',
      description:
        'Full-stack web development service-based platform showcasing web development packages. Integrated client inquiry form with backend handling.',
      stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
      liveLink: '#',
      githubLink: '#',
      image: '',
    },
  ],
};

const defaultContact = {
  headline: "Got an interesting project? Let's talk.",
  subtext:
    "I'm open to freelance work and full-time opportunities. Email is the fastest way to reach me.",
  email: 'prasathru14@gmail.com',
  phone: '+91 9345548421',
  github: 'https://github.com/prasath',
  linkedin: 'https://linkedin.com/in/prasath',
  recipientEmail: 'prasathru14@gmail.com',
  successMessage: "Message sent! I'll get back to you within 2 business days.",
};

interface ClientPortfolioProps {
  content: Record<string, Record<string, unknown>>;
  createdYear?: number;
}

export default function ClientPortfolio({ content, createdYear }: ClientPortfolioProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') as 'dark' | 'light' | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('portfolio-theme', next);
  };

  // Apply theme to html element via data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = '';
  }, [theme]);

  const heroData = (content.hero as typeof defaultHero) || defaultHero;
  const aboutData = (content.about as typeof defaultAbout) || defaultAbout;
  const skillsData = (content.skills as typeof defaultSkills) || defaultSkills;
  const experienceData = (content.experience as typeof defaultExperience) || defaultExperience;
  const projectsData = (content.projects as typeof defaultProjects) || defaultProjects;
  const contactData = (content.contact as typeof defaultContact) || defaultContact;

  return (
    <main>
      <Navbar theme={theme} onToggleTheme={toggleTheme} name={heroData.name} />
      <Hero data={heroData} theme={theme} />
      <About data={aboutData} theme={theme} />
      <Skills data={skillsData} theme={theme} />
      <Experience data={experienceData} theme={theme} />
      <Projects data={projectsData} theme={theme} />
      <Contact data={contactData} theme={theme} />
      <Footer
        theme={theme}
        name={heroData.name}
        createdYear={createdYear}
        github={contactData.github}
        linkedin={contactData.linkedin}
        email={contactData.email}
      />
    </main>
  );
}
