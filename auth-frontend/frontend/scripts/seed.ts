import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try multiple .env.local paths
const envPaths = [
  path.join(__dirname, '..', '.env.local'),
  path.join(process.cwd(), '.env.local'),
  path.join(__dirname, '.env.local'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'prasathru14@gmail.com';

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

// ========== Schemas ==========

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isSuperAdmin: { type: Boolean, default: false },
  permissions: {
    visibleScreens: { type: [String], default: [] },
    editableSections: { type: [String], default: [] },
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

const ContentSchema = new mongoose.Schema({
  section: { type: String, required: true },
  userEmail: { type: String, required: true, default: '' },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});
ContentSchema.index({ section: 1, userEmail: 1 }, { unique: true });

const User = mongoose.model('User', UserSchema);
const Content = mongoose.model('Content', ContentSchema);

// ========== Seed Data ==========

const ALL_SECTIONS = ['hero', 'about', 'projects', 'experience', 'skills', 'colors', 'contact'];

const contentSeed = [
  {
    section: 'hero',
    data: {
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
    },
  },
  {
    section: 'about',
    data: {
      bio: [
        "I started as a frontend developer with a love for clean, responsive UI. Two years in, I've grown into a full-stack MERN developer who cares about performance, clean code, and real-world impact.",
        "Currently at Redisolve Software, I build HRMS systems, real-time dashboards, and news aggregation platforms. I'm pursuing my MCA while working full-time because I believe learning never stops.",
        'Outside of code, I enjoy hackathons, exploring new tech stacks, and contributing to projects that make a difference.',
      ],
      location: 'Chennai, India',
      timezone: 'IST (UTC+5:30)',
      education: 'MCA — University of Madras',
      languages: 'Tamil · English',
    },
  },
  {
    section: 'skills',
    data: {
      categories: [
        { title: 'Languages', skills: ['JavaScript', 'HTML', 'CSS / SCSS', 'SQL'] },
        { title: 'Frontend', skills: ['React.js', 'Next.js', 'TanStack Query', 'Tailwind CSS', 'Bootstrap'] },
        { title: 'Backend', skills: ['Node.js', 'Express.js', 'REST APIs'] },
        { title: 'Database', skills: ['MongoDB', 'MySQL', 'MSSQL'] },
        { title: 'Tools', skills: ['GitHub', 'GitLab', 'Postman', 'VS Code', 'Figma', 'Canva'] },
        { title: 'Soft Skills', skills: ['Problem Solving', 'Clean Code', 'Responsive Design', 'Performance Optimization'] },
      ],
    },
  },
  {
    section: 'experience',
    data: {
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
    },
  },
  {
    section: 'projects',
    data: {
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
    },
  },
  {
    section: 'contact',
    data: {
      headline: "Got an interesting project? Let's talk.",
      subtext:
        "I'm open to freelance work and full-time opportunities. Email is the fastest way to reach me.",
      email: 'prasathru14@gmail.com',
      phone: '+91 9345548421',
      github: 'https://github.com/prasath',
      linkedin: 'https://linkedin.com/in/prasath',
      recipientEmail: 'prasathru14@gmail.com',
      successMessage: "Message sent! I'll get back to you within 2 business days.",
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'prasathru14@gmail.com',
      smtpPass: 'gqyk ljgf adsf asdf',
      smtpName: 'OP CardXChange',
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

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI as string);
  console.log('Connected!');

  // Create super admin
  const existingAdmin = await User.findOne({ email: SUPER_ADMIN_EMAIL });
  if (!existingAdmin) {
    await User.create({
      email: SUPER_ADMIN_EMAIL,
      isSuperAdmin: true,
      permissions: {
        visibleScreens: ALL_SECTIONS,
        editableSections: ALL_SECTIONS,
      },
      createdAt: new Date(),
    });
    console.log(`Super admin created: ${SUPER_ADMIN_EMAIL}`);
  } else {
    // Ensure super admin has full permissions
    await User.updateOne(
      { email: SUPER_ADMIN_EMAIL },
      {
        $set: {
          isSuperAdmin: true,
          'permissions.visibleScreens': ALL_SECTIONS,
          'permissions.editableSections': ALL_SECTIONS,
        },
      }
    );
    console.log(`Super admin already exists (updated): ${SUPER_ADMIN_EMAIL}`);
  }

  // Migration: set userEmail='' on any existing content docs that lack it
  await Content.updateMany({ userEmail: { $exists: false } }, { $set: { userEmail: '' } });

  // Seed content
  for (const item of contentSeed) {
    const existing = await Content.findOne({ section: item.section, userEmail: '' });
    if (!existing) {
      await Content.create({ ...item, userEmail: '', updatedAt: new Date() });
      console.log(`Content seeded: ${item.section}`);
    } else {
      console.log(`Content already exists (skipped): ${item.section}`);
    }
  }

  console.log('\nSeed completed successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
