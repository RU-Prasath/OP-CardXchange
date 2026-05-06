'use client';

import { useEffect, useRef } from 'react';

interface SkillCategory {
  title: string;
  skills: string[];
}

interface SkillsData {
  categories: SkillCategory[];
  sectionTitle?: string;
  sectionNumber?: string;
  aside?: string;
}

interface SkillsProps {
  data: SkillsData;
  theme: 'dark' | 'light';
}

export default function Skills({ data }: SkillsProps) {
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
      id="skills"
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
              {data.sectionNumber || '02 / Skills'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
            {(data.aside ?? "Calibrated by what I've actually shipped") && (
              <span
                style={{
                  fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                  fontSize: '12px',
                  color: 'var(--fg-faint)',
                }}
              >
                {data.aside ?? "Calibrated by what I've actually shipped"}
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
            {data.sectionTitle || 'The toolkit I reach for first.'}
          </h2>
        </div>

        {/* 12-col CSS grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '16px',
          }}
          className="skills-grid"
        >
          {data.categories.map((cat, i) => (
            <div
              key={i}
              className="reveal skill-card"
              style={{
                gridColumn: 'span 4',
                background: 'var(--bg-card)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '24px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                transitionDelay: `${i * 60}ms`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = 'var(--shadow-md)';
                el.style.borderColor = 'var(--line-strong)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
                el.style.borderColor = 'var(--line)';
              }}
            >
              {/* Card head */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontWeight: 500, fontSize: '15px' }}>{cat.title}</span>
                <span
                  style={{
                    fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                    fontSize: '11px',
                    color: 'var(--fg-faint)',
                  }}
                >
                  /{String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Skill pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {cat.skills.map((skill, j) => (
                  <span
                    key={j}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--line)',
                      fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                      fontSize: '12px',
                      color: 'var(--fg-muted)',
                      background: 'var(--bg-elev)',
                      cursor: 'default',
                      transition: 'border-color 0.15s, background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'var(--accent)';
                      el.style.background = 'var(--accent-soft)';
                      el.style.color = 'var(--accent-fg)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'var(--line)';
                      el.style.background = 'var(--bg-elev)';
                      el.style.color = 'var(--fg-muted)';
                    }}
                  >
                    <span
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        flexShrink: 0,
                      }}
                    />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
