'use client';

import { useEffect, useRef } from 'react';

interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  resumeLink: string;
  stats: { number: string; unit: string; label: string }[];
}

interface HeroProps {
  data: HeroData;
  theme: 'dark' | 'light';
}

export default function Hero({ data }: HeroProps) {
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

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={ref}
      style={{
        padding: '144px 0 96px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 20%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 20%, black 30%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 32px', position: 'relative' }}>
        {/* Heading */}
        <h1
          className="reveal"
          style={{
            fontSize: 'clamp(48px, 8vw, 104px)',
            fontWeight: 500,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            marginBottom: '32px',
            transitionDelay: '80ms',
          }}
        >
          <span style={{ display: 'block' }}>{data.name}</span>
          <span
            style={{
              display: 'block',
              fontStyle: 'italic',
              color: 'var(--fg-muted)',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>— </span>
            {data.title}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="reveal"
          style={{
            fontSize: 'clamp(17px, 1.6vw, 20px)',
            color: 'var(--fg-muted)',
            maxWidth: '600px',
            lineHeight: 1.6,
            marginBottom: '40px',
            transitionDelay: '160ms',
          }}
        >
          {data.subtitle}
        </p>

        {/* Actions */}
        <div
          className="reveal"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '64px',
            transitionDelay: '240ms',
          }}
        >
          <button
            onClick={() => scrollTo(data.ctaLink)}
            style={{
              padding: '12px 28px',
              borderRadius: '10px',
              background: 'var(--fg)',
              color: 'var(--bg)',
              fontWeight: 500,
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            {data.ctaText || 'View Work'}
          </button>
          {data.resumeLink && data.resumeLink !== '#' ? (
            <a
              href={data.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px 28px',
                borderRadius: '10px',
                background: 'var(--bg-elev)',
                color: 'var(--fg)',
                fontWeight: 500,
                fontSize: '15px',
                border: '1px solid var(--line)',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'border-color 0.2s ease',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-strong)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}
            >
              Resume PDF
            </a>
          ) : (
            <button
              style={{
                padding: '12px 28px',
                borderRadius: '10px',
                background: 'var(--bg-elev)',
                color: 'var(--fg)',
                fontWeight: 500,
                fontSize: '15px',
                border: '1px solid var(--line)',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-strong)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}
            >
              Resume PDF
            </button>
          )}
        </div>

        {/* Stats */}
        <div
          className="reveal hero-stats"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            transitionDelay: '320ms',
          }}
        >
          {data.stats.map((stat, i) => (
            <div
              key={i}
              style={{
                padding: '24px 0',
                borderRight: i < data.stats.length - 1 ? '1px solid var(--line)' : 'none',
                paddingLeft: i === 0 ? 0 : '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '4px' }}>
                <span style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 600, lineHeight: 1 }}>
                  {stat.number}
                </span>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: 'var(--accent)',
                    fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                  }}
                >
                  {stat.unit}
                </span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                  color: 'var(--fg-faint)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
