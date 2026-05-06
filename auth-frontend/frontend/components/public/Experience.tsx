'use client';

import { useEffect, useRef } from 'react';

interface Job {
  role: string;
  company: string;
  period: string;
  isCurrent: boolean;
  summary: string;
  bullets: string[];
  stack: string[];
}

interface ExperienceData {
  jobs: Job[];
  sectionTitle?: string;
  sectionNumber?: string;
  aside?: string;
}

interface ExperienceProps {
  data: ExperienceData;
  theme: 'dark' | 'light';
}

export default function Experience({ data }: ExperienceProps) {
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
      id="experience"
      ref={ref}
      style={{ padding: '120px 0' }}
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
              {data.sectionNumber || '03 / Experience'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
            {(data.aside ?? 'Three roles · two domains') && (
              <span
                style={{
                  fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                  fontSize: '12px',
                  color: 'var(--fg-faint)',
                }}
              >
                {data.aside ?? 'Three roles · two domains'}
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
            {data.sectionTitle || 'Three roles, focused.'}
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {data.jobs.map((job, i) => (
            <div
              key={i}
              className="reveal exp-item"
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: '48px',
                borderTop: '1px solid var(--line)',
                padding: '32px 0',
                transition: 'background 0.2s ease',
                transitionDelay: `${i * 80}ms`,
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'color-mix(in oklch, var(--bg-elev) 60%, transparent)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {/* Left: period */}
              <div style={{ paddingTop: '4px' }}>
                {job.isCurrent ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        flexShrink: 0,
                        animation: 'pulse 2s ease infinite',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                        fontSize: '12px',
                        color: 'var(--accent)',
                      }}
                    >
                      Present
                    </span>
                  </div>
                ) : null}
                <div
                  style={{
                    fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                    fontSize: '12px',
                    color: 'var(--fg-faint)',
                    marginTop: job.isCurrent ? '4px' : '0',
                    lineHeight: 1.5,
                  }}
                >
                  {job.period}
                </div>
              </div>

              {/* Right: content */}
              <div>
                {/* Head */}
                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '12px',
                      flexWrap: 'wrap',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.01em' }}>
                      {job.role}
                    </span>
                    <span
                      style={{
                        fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                        fontSize: '13px',
                        color: 'var(--fg-faint)',
                      }}
                    >
                      {job.company} · Full-time
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p
                  style={{
                    fontSize: '15px',
                    color: 'var(--fg-muted)',
                    marginBottom: '16px',
                    lineHeight: 1.6,
                  }}
                >
                  {job.summary}
                </p>

                {/* Bullets */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px 24px',
                    marginBottom: '20px',
                  }}
                  className="exp-bullets"
                >
                  {job.bullets.map((bullet, j) => {
                    // Detect metric (numbers with % or ~)
                    const metricMatch = bullet.match(/(~?\d+%?)/);
                    return (
                      <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }}>—</span>
                        <span style={{ fontSize: '14px', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
                          {metricMatch ? (
                            <>
                              {bullet.replace(metricMatch[0], '').trim()}{' '}
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: 'var(--accent-soft)',
                                  color: 'var(--accent-fg)',
                                  fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                }}
                              >
                                {metricMatch[0]}
                              </span>
                            </>
                          ) : (
                            bullet
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Stack */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {job.stack.map((tech, j) => (
                    <span
                      key={j}
                      style={{
                        padding: '3px 10px',
                        border: '1px solid var(--line)',
                        borderRadius: '6px',
                        fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                        fontSize: '11px',
                        color: 'var(--fg-faint)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--line)' }} />
        </div>
      </div>

    </section>
  );
}
