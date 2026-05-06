'use client';

import { useEffect, useRef } from 'react';

interface Project {
  id: string;
  title: string;
  tag: string;
  description: string;
  stack: string[];
  liveLink: string;
  githubLink: string;
  image: string;
}

interface ProjectsData {
  items: Project[];
  sectionTitle?: string;
  sectionNumber?: string;
  aside?: string;
}

interface ProjectsProps {
  data: ProjectsData;
  theme: 'dark' | 'light';
}

const PROJECT_VISUALS = [
  `linear-gradient(135deg, oklch(0.78 0.18 145 / 0.4) 0%, transparent 60%), repeating-linear-gradient(135deg, var(--line) 0 1px, transparent 1px 16px), var(--bg-elev)`,
  `radial-gradient(circle at 30% 30%, oklch(0.7 0.18 30 / 0.35), transparent 50%), radial-gradient(circle at 70% 70%, oklch(0.7 0.15 270 / 0.3), transparent 50%), var(--bg-elev)`,
  `conic-gradient(from 180deg at 50% 50%, oklch(0.7 0.15 220 / 0.3), oklch(0.78 0.18 145 / 0.25), oklch(0.7 0.15 220 / 0.3)), repeating-linear-gradient(0deg, var(--line) 0 1px, transparent 1px 24px), var(--bg-elev)`,
  `linear-gradient(45deg, oklch(0.7 0.18 30 / 0.25) 0%, transparent 50%), repeating-linear-gradient(45deg, var(--line) 0 1px, transparent 1px 10px), repeating-linear-gradient(-45deg, var(--line) 0 1px, transparent 1px 10px), var(--bg-elev)`,
];

export default function Projects({ data }: ProjectsProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in');
        });
      },
      { threshold: 0.1 }
    );
    const els = ref.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={ref}
      style={{ padding: '120px 0', background: 'var(--bg-elev)' }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 32px' }}>
        {/* Section header */}
        <div className="reveal" style={{ marginBottom: '64px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                fontSize: '12px',
                color: 'var(--fg-faint)',
              }}
            >
              {data.sectionNumber || '04 / Selected Work'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
            {(data.aside ?? 'Personal + professional') && (
              <span
                style={{
                  fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                  fontSize: '12px',
                  color: 'var(--fg-faint)',
                }}
              >
                {data.aside ?? 'Personal + professional'}
              </span>
            )}
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {data.sectionTitle || "Selected work I'm proud of."}
          </h2>
        </div>

        {/* 2-col grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
          className="projects-grid"
        >
          {data.items.map((project, i) => (
            <div
              key={project.id}
              className="reveal"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                transitionDelay: `${i * 80}ms`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-3px)';
                el.style.boxShadow = 'var(--shadow-lg)';
                el.style.borderColor = 'var(--line-strong)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
                el.style.borderColor = 'var(--line)';
              }}
            >
              {/* Visual */}
              <div
                style={{
                  aspectRatio: '16 / 10',
                  position: 'relative',
                  background: project.image ? undefined : PROJECT_VISUALS[i % PROJECT_VISUALS.length],
                  overflow: 'hidden',
                }}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                      fontSize: '14px',
                      color: 'var(--fg-faint)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    ◇ {project.title}
                  </div>
                )}
              </div>

              {/* Body */}
              <div
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                {/* Head */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '10px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '22px',
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {project.title}
                  </h3>
                  {project.tag && (
                    <span
                      style={{
                        fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        border: '1px solid var(--line)',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        color: 'var(--fg-faint)',
                        flexShrink: 0,
                        marginTop: '4px',
                      }}
                    >
                      {project.tag}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: '14.5px',
                    color: 'var(--fg-muted)',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                    flex: 1,
                  }}
                >
                  {project.description}
                </p>

                {/* Stack */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {project.stack.map((tech, j) => (
                    <span
                      key={j}
                      style={{
                        fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '5px',
                        background: 'var(--bg-elev)',
                        color: 'var(--fg-faint)',
                        border: '1px solid var(--line)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    borderTop: '1px dashed var(--line)',
                    paddingTop: '20px',
                  }}
                >
                  {project.liveLink && project.liveLink !== '#' && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'var(--fg)',
                        color: 'var(--bg)',
                        fontSize: '13px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                    >
                      Live demo ↗
                    </a>
                  )}
                  {project.githubLink && project.githubLink !== '#' && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'var(--bg-elev)',
                        color: 'var(--fg-muted)',
                        border: '1px solid var(--line)',
                        fontSize: '13px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'border-color 0.2s, color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = 'var(--line-strong)';
                        el.style.color = 'var(--fg)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = 'var(--line)';
                        el.style.color = 'var(--fg-muted)';
                      }}
                    >
                      Source
                    </a>
                  )}
                  {(!project.liveLink || project.liveLink === '#') && (!project.githubLink || project.githubLink === '#') && (
                    <span
                      style={{
                        fontSize: '12px',
                        fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                        color: 'var(--fg-faint)',
                      }}
                    >
                      Links coming soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .projects-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
