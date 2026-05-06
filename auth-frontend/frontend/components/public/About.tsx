'use client';

import { useEffect, useRef } from 'react';

interface AboutData {
  bio: string[];
  location: string;
  timezone: string;
  education: string;
  languages: string;
  profileImage?: string;
  sectionTitle?: string;
  sectionNumber?: string;
  aside?: string;
}

interface AboutProps {
  data: AboutData;
  theme: 'dark' | 'light';
}

export default function About({ data }: AboutProps) {
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

  const metaItems = [
    { label: 'Based in', value: data.location },
    { label: 'Timezone', value: data.timezone },
    { label: 'Education', value: data.education },
    { label: 'Languages', value: data.languages },
  ];

  return (
    <section
      id="about"
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
              {data.sectionNumber || '01 / About'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
            {data.aside && (
              <span
                style={{
                  fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                  fontSize: '12px',
                  color: 'var(--fg-faint)',
                }}
              >
                {data.aside}
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
            {data.sectionTitle || 'A short version of a longer story.'}
          </h2>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '64px',
            alignItems: 'start',
          }}
          className="about-grid"
        >
          {/* Left: bio text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {data.bio.map((paragraph, i) => (
              <p
                key={i}
                className="reveal"
                style={{
                  fontSize: i === 0 ? '22px' : '19px',
                  lineHeight: 1.65,
                  color: i === 0 ? 'var(--fg)' : 'var(--fg-muted)',
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Right: card */}
          <div
            className="reveal"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '8px',
              boxShadow: 'var(--shadow-md)',
              transitionDelay: '160ms',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {data.profileImage ? (
                <img
                  src={data.profileImage}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    display: 'block',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(135deg, oklch(0.78 0.18 145 / 0.3), oklch(0.6 0.15 220 / 0.2)),
                      repeating-linear-gradient(45deg, var(--line) 0 1px, transparent 1px 12px),
                      var(--bg-elev)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      fontSize: '96px',
                      fontWeight: 300,
                      color: 'var(--fg-faint)',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >
                    PR
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                      fontSize: '10px',
                      color: 'var(--fg-faint)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--line)',
                      borderRadius: '4px',
                      padding: '3px 8px',
                    }}
                  >
                    portrait · 1:1 · drop here
                  </div>
                </div>
              )}
            </div>

            {/* Meta grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1px',
                background: 'var(--line)',
                marginTop: '8px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {metaItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px 16px',
                    background: 'var(--bg-card)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                      fontSize: '10px',
                      color: 'var(--fg-faint)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '4px',
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--fg-muted)', fontWeight: 500 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
