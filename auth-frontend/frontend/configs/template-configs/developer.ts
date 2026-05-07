import type { TemplateConfig } from '@/types';

const developerConfig: TemplateConfig = {
  slug: 'developer',
  name: 'Developer Template',
  sections: [
    {
      key: 'hero',
      label: 'Hero',
      fields: [
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Taylor Chen', section: 'hero' },
        { key: 'role', label: 'Role / Title', type: 'text', placeholder: 'Staff Engineer at Plane', section: 'hero' },
        { key: 'bio', label: 'Short Bio', type: 'textarea', placeholder: 'I build distributed systems at scale…', section: 'hero' },
        { key: 'avatar', label: 'Profile Photo URL', type: 'url', placeholder: 'https://…', section: 'hero' },
        { key: 'githubUrl', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/username', section: 'hero' },
        { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/username', section: 'hero' },
        { key: 'resumeUrl', label: 'Resume PDF URL', type: 'url', placeholder: 'https://…/resume.pdf', section: 'hero' },
      ],
    },
    {
      key: 'skills',
      label: 'Skills',
      fields: [
        { key: 'techStack', label: 'Tech Stack (comma-separated)', type: 'textarea', placeholder: 'Rust, Go, TypeScript, Kubernetes, PostgreSQL', section: 'skills' },
        { key: 'tools', label: 'Tools (comma-separated)', type: 'textarea', placeholder: 'Docker, Terraform, GitHub Actions', section: 'skills' },
      ],
    },
    {
      key: 'projects',
      label: 'Projects',
      fields: [
        { key: 'project1Title', label: 'Project 1 — Title', type: 'text', placeholder: 'Distributed Cache Engine', section: 'projects' },
        { key: 'project1Desc', label: 'Project 1 — Description', type: 'textarea', placeholder: 'A high-performance caching layer…', section: 'projects' },
        { key: 'project1Url', label: 'Project 1 — URL', type: 'url', placeholder: 'https://github.com/…', section: 'projects' },
        { key: 'project1Tech', label: 'Project 1 — Technologies', type: 'text', placeholder: 'Rust, Redis, gRPC', section: 'projects' },
        { key: 'project2Title', label: 'Project 2 — Title', type: 'text', placeholder: 'Observability Platform', section: 'projects' },
        { key: 'project2Desc', label: 'Project 2 — Description', type: 'textarea', placeholder: 'Real-time distributed tracing…', section: 'projects' },
        { key: 'project2Url', label: 'Project 2 — URL', type: 'url', placeholder: 'https://github.com/…', section: 'projects' },
        { key: 'project2Tech', label: 'Project 2 — Technologies', type: 'text', placeholder: 'Go, ClickHouse, OpenTelemetry', section: 'projects' },
        { key: 'project3Title', label: 'Project 3 — Title', type: 'text', section: 'projects' },
        { key: 'project3Desc', label: 'Project 3 — Description', type: 'textarea', section: 'projects' },
        { key: 'project3Url', label: 'Project 3 — URL', type: 'url', section: 'projects' },
        { key: 'project3Tech', label: 'Project 3 — Technologies', type: 'text', section: 'projects' },
      ],
    },
    {
      key: 'experience',
      label: 'Experience',
      fields: [
        { key: 'exp1Company', label: 'Company 1', type: 'text', placeholder: 'Plane', section: 'experience' },
        { key: 'exp1Role', label: 'Role 1', type: 'text', placeholder: 'Staff Engineer', section: 'experience' },
        { key: 'exp1Period', label: 'Period 1', type: 'text', placeholder: '2022 — Present', section: 'experience' },
        { key: 'exp1Desc', label: 'Description 1', type: 'textarea', section: 'experience' },
        { key: 'exp2Company', label: 'Company 2', type: 'text', placeholder: 'Stripe', section: 'experience' },
        { key: 'exp2Role', label: 'Role 2', type: 'text', placeholder: 'Senior Engineer', section: 'experience' },
        { key: 'exp2Period', label: 'Period 2', type: 'text', placeholder: '2019 — 2022', section: 'experience' },
        { key: 'exp2Desc', label: 'Description 2', type: 'textarea', section: 'experience' },
      ],
    },
    {
      key: 'contact',
      label: 'Contact',
      fields: [
        { key: 'contactEmail', label: 'Contact Email', type: 'text', placeholder: 'taylor@plane.so', section: 'contact' },
        { key: 'twitterUrl', label: 'Twitter / X URL', type: 'url', section: 'contact' },
        { key: 'websiteUrl', label: 'Personal Website', type: 'url', section: 'contact' },
      ],
    },
  ],
  defaultContent: {
    name: 'Your Name',
    role: 'Software Engineer',
    bio: 'Building great things with code.',
    techStack: 'TypeScript, React, Node.js, PostgreSQL',
    tools: 'Docker, Git, VS Code',
    contactEmail: '',
  },
};

export default developerConfig;
