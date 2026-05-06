'use client';

import { useEffect, useRef, useState } from 'react';

interface ContactData {
  headline: string;
  subtext: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  recipientEmail: string;
  successMessage: string;
}

interface ContactProps {
  data: ContactData;
  theme: 'dark' | 'light';
}

export default function Contact({ data }: ContactProps) {
  const ref = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: 'Portfolio Contact' }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Failed to send message');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  const channels = [
    {
      label: 'Email',
      value: data.email,
      href: `mailto:${data.email}`,
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'GitHub',
      value: data.github ? data.github.replace('https://', '') : '',
      href: data.github,
      icon: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      value: data.linkedin ? data.linkedin.replace('https://', '') : '',
      href: data.linkedin,
      icon: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: 'Phone',
      value: data.phone,
      href: `tel:${data.phone}`,
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid var(--line)',
    background: 'var(--bg-elev)',
    color: 'var(--fg)',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
  };

  return (
    <section
      id="contact"
      ref={ref}
      style={{ padding: '120px 0' }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 32px' }}>
        <div
          className="reveal contact-wrap"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--line)',
            borderRadius: '24px',
            padding: '64px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Blob decoration */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, oklch(0.78 0.18 145 / 0.12), transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '64px',
              position: 'relative',
            }}
            className="contact-grid"
          >
            {/* Left: info */}
            <div>
              <div
                style={{
                  fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                  fontSize: '12px',
                  color: 'var(--fg-faint)',
                  marginBottom: '12px',
                }}
              >
                05 / Contact
              </div>
              <h2
                style={{
                  fontSize: 'clamp(24px, 3.5vw, 40px)',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  marginBottom: '16px',
                }}
              >
                {data.headline}
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'var(--fg-muted)',
                  lineHeight: 1.6,
                  marginBottom: '40px',
                }}
              >
                {data.subtext}
              </p>

              {/* Channels */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {channels.filter(c => c.value).map((ch, i) => (
                  <a
                    key={i}
                    href={ch.href}
                    target={ch.href.startsWith('http') ? '_blank' : undefined}
                    rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elev)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span style={{ color: 'var(--fg-faint)', flexShrink: 0 }}>{ch.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                          fontSize: '10px',
                          color: 'var(--fg-faint)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: '2px',
                        }}
                      >
                        {ch.label}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'var(--fg-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {ch.value}
                      </div>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--fg-faint)', flexShrink: 0 }}
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div>
              {status === 'success' ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '16px',
                    textAlign: 'center',
                    padding: '40px 0',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'var(--accent-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 500 }}>Message sent!</h3>
                  <p style={{ fontSize: '15px', color: 'var(--fg-muted)' }}>{data.successMessage}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    style={{
                      marginTop: '8px',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      background: 'var(--fg)',
                      color: 'var(--bg)',
                      fontSize: '14px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                        fontSize: '11px',
                        color: 'var(--fg-faint)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: '6px',
                      }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      style={inputStyle}
                      onFocus={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--accent)'; }}
                      onBlur={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--line)'; }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                        fontSize: '11px',
                        color: 'var(--fg-faint)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: '6px',
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      style={inputStyle}
                      onFocus={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--accent)'; }}
                      onBlur={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--line)'; }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: '\'Geist Mono\', ui-monospace, monospace',
                        fontSize: '11px',
                        color: 'var(--fg-faint)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: '6px',
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell me about your project..."
                      style={{ ...inputStyle, resize: 'none' }}
                      onFocus={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--accent)'; }}
                      onBlur={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--line)'; }}
                    />
                  </div>

                  {status === 'error' && (
                    <p style={{ fontSize: '13px', color: 'oklch(0.65 0.18 25)' }}>{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    style={{
                      padding: '13px',
                      borderRadius: '10px',
                      background: status === 'sending' ? 'var(--fg-faint)' : 'var(--fg)',
                      color: 'var(--bg)',
                      fontSize: '15px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => { if (status !== 'sending') (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  >
                    {status === 'sending' ? (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{ animation: 'spin 1s linear infinite' }}
                        >
                          <path d="M21 12a9 9 0 11-6.219-8.56" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      'Send message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-wrap { padding: 32px !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
