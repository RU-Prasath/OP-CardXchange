import type { TemplateConfig } from '@/types';

const campusConfig: TemplateConfig = {
  slug: 'campus',
  name: 'Campus Template',
  sections: [
    {
      key: 'hero',
      label: 'Hero',
      fields: [
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Campus Reyes', section: 'hero' },
        { key: 'title', label: 'Title / Role', type: 'text', placeholder: 'Computer Science Student & Aspiring Engineer', section: 'hero' },
        { key: 'degree', label: 'Degree', type: 'text', placeholder: 'B.S. in Computer Science', section: 'hero' },
        { key: 'university', label: 'University', type: 'text', placeholder: 'UMass Amherst', section: 'hero' },
        { key: 'graduation', label: 'Expected Graduation', type: 'text', placeholder: 'Expected May 2026', section: 'hero' },
        { key: 'gpa', label: 'GPA', type: 'text', placeholder: '3.87 / 4.0', section: 'hero' },
        { key: 'tagline', label: 'Tagline', type: 'textarea', placeholder: 'Curious learner building things at the intersection of code, research, and creativity.', section: 'hero' },
        { key: 'resumeUrl', label: 'Resume (PDF upload)', type: 'image', placeholder: '', section: 'hero' },
      ],
    },
    {
      key: 'about',
      label: 'About',
      fields: [
        { key: 'aboutP1', label: 'About — Paragraph 1', type: 'textarea', placeholder: "I'm a third-year computer science student passionate about turning ideas into useful software.", section: 'about' },
        { key: 'aboutP2', label: 'About — Paragraph 2', type: 'textarea', placeholder: "Outside of class, I work on side projects and contribute to open-source. Currently looking for a Summer 2026 internship.", section: 'about' },
        { key: 'location', label: 'Based In', type: 'text', placeholder: 'Amherst, MA', section: 'about' },
        { key: 'languages', label: 'Languages', type: 'text', placeholder: 'English (Native), Spanish (Fluent)', section: 'about' },
        { key: 'interests', label: 'Interests', type: 'text', placeholder: 'Hiking, Chess, Pixel Art, Open Source', section: 'about' },
      ],
    },
    {
      key: 'education',
      label: 'Education',
      fields: [
        { key: 'educationJson', label: 'Education Entries (JSON)', type: 'array', placeholder: '', section: 'education' },
      ],
    },
    {
      key: 'skills',
      label: 'Skills',
      fields: [
        { key: 'skillsJson', label: 'Skill Categories (JSON)', type: 'array', placeholder: '', section: 'skills' },
      ],
    },
    {
      key: 'projects',
      label: 'Projects',
      fields: [
        { key: 'projectsJson', label: 'Projects (JSON)', type: 'array', placeholder: '', section: 'projects' },
      ],
    },
    {
      key: 'research',
      label: 'Research',
      fields: [
        { key: 'researchJson', label: 'Research Entries (JSON)', type: 'array', placeholder: '', section: 'research' },
      ],
    },
    {
      key: 'experience',
      label: 'Experience',
      fields: [
        { key: 'experienceJson', label: 'Experience Entries (JSON)', type: 'array', placeholder: '', section: 'experience' },
      ],
    },
    {
      key: 'achievements',
      label: 'Achievements',
      fields: [
        { key: 'achievementsJson', label: 'Achievements (JSON)', type: 'array', placeholder: '', section: 'achievements' },
      ],
    },
    {
      key: 'activities',
      label: 'Activities & Leadership',
      fields: [
        { key: 'activitiesJson', label: 'Activities (JSON)', type: 'array', placeholder: '', section: 'activities' },
      ],
    },
    {
      key: 'certifications',
      label: 'Certifications',
      fields: [
        { key: 'certsJson', label: 'Certifications (JSON)', type: 'array', placeholder: '', section: 'certifications' },
      ],
    },
    {
      key: 'contact',
      label: 'Contact',
      fields: [
        { key: 'contactEmail', label: 'Email Address', type: 'text', placeholder: 'campus@umass.edu', section: 'contact' },
        { key: 'contactPhone', label: 'Phone', type: 'text', placeholder: '+1 (555) 123-4567', section: 'contact' },
        { key: 'githubUrl', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/username', section: 'contact' },
        { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/username', section: 'contact' },
        { key: 'twitterUrl', label: 'Twitter / X URL', type: 'url', placeholder: 'https://twitter.com/username', section: 'contact' },
      ],
    },
    {
      key: 'theme',
      label: 'Theme & Colors',
      fields: [
        { key: 'colorBg', label: 'Background (cream)', type: 'color', placeholder: '#fcfaf5', section: 'theme' },
        { key: 'colorFg', label: 'Foreground (navy)', type: 'color', placeholder: '#1f3a5f', section: 'theme' },
        { key: 'colorAccent', label: 'Accent (highlighter yellow)', type: 'color', placeholder: '#ffd75a', section: 'theme' },
        { key: 'colorAccent2', label: 'Accent 2 (coral)', type: 'color', placeholder: '#ff7b6e', section: 'theme' },
        { key: 'colorLine', label: 'Border / Line', type: 'color', placeholder: '#d9d2c1', section: 'theme' },
        { key: 'colorCard', label: 'Card Background', type: 'color', placeholder: '#ffffff', section: 'theme' },
      ],
    },
  ],
  defaultContent: {
    // Hero
    name: 'Campus Reyes',
    title: 'Computer Science Student & Aspiring Software Engineer',
    degree: 'B.S. in Computer Science, Minor in Mathematics',
    university: 'UMass Amherst',
    graduation: 'Expected May 2026',
    gpa: '3.87 / 4.0',
    tagline: 'Curious learner building things at the intersection of code, research, and creativity.',
    resumeUrl: '',

    // About
    aboutP1: "I'm a third-year computer science student at UMass Amherst, passionate about turning ideas into useful software. My favorite problems live somewhere between systems thinking and user experience — making technology that's both technically solid and genuinely helpful to the people who use it.",
    aboutP2: "Outside of class, I work on side projects, contribute to small open-source libraries, and TA an introductory programming course. I'm currently looking for a Summer 2026 software engineering internship where I can learn from senior engineers and ship features that real users feel.",
    location: 'Amherst, MA',
    languages: 'English (Native), Spanish (Fluent), Mandarin (Basic)',
    interests: 'Hiking, Chess, Pixel Art, Open Source',

    // Contact
    contactEmail: 'campus.reyes@umass.edu',
    contactPhone: '+1 (413) 555-0142',
    githubUrl: 'https://github.com/campusreyes',
    linkedinUrl: 'https://linkedin.com/in/campus-reyes',
    twitterUrl: 'https://twitter.com/campusreyes',

    // Education
    educationJson: JSON.stringify([
      {
        school: 'University of Massachusetts Amherst',
        degree: 'B.S. in Computer Science, Minor in Mathematics',
        period: '2022 — 2026 (Expected)',
        gpa: '3.87 / 4.0',
        location: 'Amherst, MA',
        coursework: 'Data Structures, Algorithms, Operating Systems, Machine Learning, Databases, Computer Networks, Compilers, Linear Algebra',
        achievements: "Dean's List (5 semesters), Commonwealth Honors College, ACM Programming Team",
      },
      {
        school: 'Lincoln-Sudbury Regional High School',
        degree: 'High School Diploma, Valedictorian',
        period: '2018 — 2022',
        gpa: '4.0 / 4.0',
        location: 'Sudbury, MA',
        coursework: 'AP Computer Science A, AP Calculus BC, AP Physics C, AP Statistics',
        achievements: 'National Merit Scholar, Robotics Club President, Math Team Captain',
      },
    ]),

    // Skills
    skillsJson: JSON.stringify([
      { category: 'Languages', items: 'Python, Java, JavaScript, TypeScript, C++, Go, SQL' },
      { category: 'Frameworks', items: 'React, Next.js, Node.js, Express, FastAPI, PyTorch, TensorFlow' },
      { category: 'Tools & Platforms', items: 'Git, Docker, Linux, AWS, PostgreSQL, MongoDB, Figma' },
      { category: 'Coursework Highlights', items: 'Algorithms, Distributed Systems, Machine Learning, Compilers, Databases' },
      { category: 'Soft Skills', items: 'Collaboration, Technical Writing, Mentoring, Public Speaking' },
    ]),

    // Projects
    projectsJson: JSON.stringify([
      {
        title: 'StudyBuddy AI',
        context: 'Personal Project',
        description: 'A flashcard app that auto-generates study questions from lecture PDFs using a fine-tuned language model. Used by 200+ students across my CS program.',
        tags: 'Next.js, OpenAI API, PostgreSQL, Tailwind',
        githubUrl: 'https://github.com/campusreyes/studybuddy-ai',
        liveUrl: 'https://studybuddy.campusreyes.dev',
        year: '2025',
      },
      {
        title: 'Campus Bike Routing',
        context: 'CS 360 — Algorithms',
        description: 'Implemented a modified A* algorithm that optimizes bike routes across the UMass campus, factoring in elevation and pedestrian traffic. Won "Best Project" in the course.',
        tags: 'Python, NetworkX, Flask, Leaflet',
        githubUrl: 'https://github.com/campusreyes/bike-routing',
        liveUrl: '',
        year: '2024',
      },
      {
        title: 'Distributed Key-Value Store',
        context: 'CS 425 — Distributed Systems',
        description: 'Built a Raft-based distributed key-value store from scratch in Go. Handles node failures, leader elections, and log replication across a 5-node cluster.',
        tags: 'Go, gRPC, Raft, Docker',
        githubUrl: 'https://github.com/campusreyes/raft-kv',
        liveUrl: '',
        year: '2024',
      },
      {
        title: 'Pixel Garden',
        context: 'Ludum Dare Game Jam',
        description: 'A cozy pixel-art gardening game built in 48 hours for Ludum Dare. Placed in the top 10% of entries for the "Mood" category.',
        tags: 'Godot, GDScript, Aseprite',
        githubUrl: 'https://github.com/campusreyes/pixel-garden',
        liveUrl: 'https://campusreyes.itch.io/pixel-garden',
        year: '2023',
      },
      {
        title: 'Office Hours Queue',
        context: 'CS 326 — Web Programming',
        description: 'A real-time queue manager for TA office hours, used by three CS courses on campus. Cut average wait times by ~30% during midterms.',
        tags: 'React, Socket.IO, Node.js, MongoDB',
        githubUrl: 'https://github.com/campusreyes/oh-queue',
        liveUrl: '',
        year: '2024',
      },
    ]),

    // Research
    researchJson: JSON.stringify([
      {
        title: 'Lightweight Transformer Models for On-Device Translation',
        authors: 'C. Reyes, J. Patel, Dr. R. Chen',
        venue: 'UMass Undergraduate Research Symposium',
        year: '2025',
        url: 'https://example.com/papers/lightweight-transformers',
        abstract: 'Explored quantization and distillation techniques to fit transformer translation models on mobile devices with minimal quality loss, achieving 4x size reduction at <2% BLEU drop.',
      },
      {
        title: 'Visualizing Algorithmic Bias in Recommendation Systems',
        authors: 'C. Reyes, Dr. K. Lin',
        venue: 'Campus Data Science Poster Session',
        year: '2024',
        url: 'https://example.com/papers/algorithmic-bias-viz',
        abstract: 'Built an interactive dashboard that exposes how collaborative filtering can amplify popularity bias over time, with case studies on synthetic and MovieLens datasets.',
      },
    ]),

    // Experience
    experienceJson: JSON.stringify([
      {
        role: 'Software Engineering Intern',
        company: 'Northwind Labs',
        period: 'Summer 2025',
        location: 'Remote',
        bullets: 'Built a usage analytics pipeline processing 5M events/day in Kafka and ClickHouse\nShipped a customer-facing dashboard in React; cut support tickets by 18%\nWrote unit and integration tests, raising coverage from 64% to 89%\nPresented final demo to the engineering org at end-of-summer review',
        stack: 'TypeScript, React, Node.js, Kafka, ClickHouse',
      },
      {
        role: 'Undergraduate Teaching Assistant',
        company: 'UMass Amherst — Dept. of Computer Science',
        period: 'Sep 2024 — Present',
        location: 'Amherst, MA',
        bullets: 'Lead 2 weekly lab sections for CS 121 (Intro to Programming), ~50 students total\nHold office hours and grade assignments; consistently rated 4.8/5 by students\nAuthored 3 new lab handouts adopted by the department for future semesters',
        stack: 'Python, pedagogy, mentorship',
      },
      {
        role: 'Research Assistant',
        company: 'UMass NLP Lab',
        period: 'Jan 2024 — Aug 2024',
        location: 'Amherst, MA',
        bullets: "Co-authored a paper on lightweight translation models (poster at URS 2025)\nFine-tuned and benchmarked 6 transformer variants on a 4-GPU cluster\nMaintained the lab's shared experiment-tracking infrastructure for 8 researchers",
        stack: 'PyTorch, HuggingFace, SLURM, Weights & Biases',
      },
    ]),

    // Achievements
    achievementsJson: JSON.stringify([
      { title: "Dean's List", issuer: 'UMass Amherst', year: '2022 – 2025', description: 'Awarded for maintaining a GPA above 3.85 across five consecutive semesters.' },
      { title: '1st Place — Campus Hackathon', issuer: 'HackUMass X', year: '2024', description: 'Built an accessibility-focused note-taking tool in 36 hours with a team of four.' },
      { title: 'Goldwater Scholar Nominee', issuer: 'UMass Amherst', year: '2025', description: 'Selected as one of four campus nominees for the national STEM scholarship.' },
      { title: 'Outstanding TA Award', issuer: 'Dept. of Computer Science', year: '2025', description: 'Recognized for top teaching evaluations and lab material contributions.' },
      { title: 'Best Project — CS 360', issuer: 'UMass Amherst', year: '2024', description: 'Awarded for the Campus Bike Routing final project, out of 38 team submissions.' },
    ]),

    // Activities
    activitiesJson: JSON.stringify([
      { role: 'President', org: 'ACM Student Chapter', period: '2024 — Present', description: 'Lead a 12-person board organizing weekly tech talks, a yearly hackathon, and an industry mentorship program.' },
      { role: 'Volunteer Tutor', org: 'CodePath After-School', period: '2023 — Present', description: 'Teach Python fundamentals to local high-school students every Saturday morning during the school year.' },
      { role: 'Member', org: 'Women in Computing', period: '2022 — Present', description: 'Participate in workshops, mentorship pairs, and outreach events with local middle schools.' },
      { role: 'Bass Player', org: 'Campus Jazz Ensemble', period: '2022 — Present', description: 'Perform with a 9-piece jazz ensemble at on-campus events and the annual spring showcase.' },
    ]),

    // Certifications
    certsJson: JSON.stringify([
      { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2025', url: 'https://www.credly.com/users/campusreyes' },
      { name: 'Deep Learning Specialization', issuer: 'Coursera / DeepLearning.AI', year: '2024', url: 'https://coursera.org/verify/specialization/example' },
      { name: 'Google Data Analytics Certificate', issuer: 'Coursera / Google', year: '2024', url: 'https://coursera.org/verify/professional-cert/example' },
      { name: 'Meta Front-End Developer', issuer: 'Meta · Coursera', year: '2023', url: 'https://coursera.org/verify/professional-cert/meta-fe' },
    ]),

    // Theme — navy primary, highlighter yellow, coral, cream bg
    colorBg: '#fcfaf5',
    colorFg: '#1f3a5f',
    colorAccent: '#ffd75a',
    colorAccent2: '#ff7b6e',
    colorLine: '#d9d2c1',
    colorCard: '#ffffff',
  },
};

export default campusConfig;
