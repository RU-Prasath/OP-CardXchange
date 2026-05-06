'use client';

import { useState, useEffect, useRef } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';

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

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '6px',
};

const baseInputStyle: React.CSSProperties = {
  padding: '10px 14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#0f172a',
  background: '#fff',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function ExperienceAdminPage() {
  const [data, setData] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [message, setMessage] = useState('');
  const [openJob, setOpenJob] = useState<number>(0);
  // Per-job raw input value for the tag field (not yet committed as a pill)
  const [stackInputs, setStackInputs] = useState<Record<number, string>>({});
  const stackInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [contentRes, meRes] = await Promise.all([
        fetch('/api/admin/content/experience'),
        fetch('/api/admin/me'),
      ]);
      if (contentRes.ok) {
        const { data } = await contentRes.json();
        setData(data);
      }
      if (meRes.ok) {
        const { user } = await meRes.json();
        setCanEdit(user.isSuperAdmin || user.permissions.editableSections.includes('experience'));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/admin/content/experience', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    if (res.ok) {
      setMessage('success');
    } else {
      const err = await res.json();
      setMessage(`error:${err.error}`);
    }
    setSaving(false);
  };

  const updateJob = (index: number, updates: Partial<Job>) => {
    if (!data) return;
    const jobs = [...data.jobs];
    jobs[index] = { ...jobs[index], ...updates };
    setData({ ...data, jobs });
  };

  const addJob = () => {
    if (!data) return;
    const newJob: Job = {
      role: 'New Role',
      company: 'Company Name',
      period: 'Month Year – Month Year',
      isCurrent: false,
      summary: '',
      bullets: [''],
      stack: [],
    };
    setData({ ...data, jobs: [...data.jobs, newJob] });
    setOpenJob(data.jobs.length);
  };

  const removeJob = (index: number) => {
    if (!data) return;
    setData({ ...data, jobs: data.jobs.filter((_, i) => i !== index) });
    setOpenJob(Math.max(0, openJob - 1));
  };

  if (loading) return (
    <div style={{ color: '#64748b', padding: '40px 0', textAlign: 'center', fontSize: '14px' }}>Loading...</div>
  );
  if (!data) return (
    <div style={{ color: '#ef4444', padding: '40px 0', fontSize: '14px' }}>Failed to load content</div>
  );

  const getInputStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    ...baseInputStyle,
    background: canEdit ? '#fff' : '#f8fafc',
    color: canEdit ? '#0f172a' : '#94a3b8',
    cursor: canEdit ? 'auto' : 'not-allowed',
    ...extra,
  });

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (canEdit) { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none';
    },
  };

  return (
    <div>
      <AdminHeader title="Experience Section" subtitle="Manage your work experience timeline." />

      {!canEdit && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 16px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          color: '#92400e',
          fontSize: '13px',
        }}>
          You have view-only access to this section.
        </div>
      )}

      {/* Section Heading card */}
      <div style={cardStyle}>
        <label style={{ ...labelStyle, marginBottom: '4px' }}>Section Heading</label>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>Controls the public section header (number, title, aside text).</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Section Number</label>
            <input
              type="text"
              value={data.sectionNumber || ''}
              placeholder="03 / Experience"
              onChange={(e) => setData({ ...data, sectionNumber: e.target.value })}
              disabled={!canEdit}
              style={getInputStyle()}
              {...focusHandlers}
            />
          </div>
          <div>
            <label style={labelStyle}>Section Title</label>
            <input
              type="text"
              value={data.sectionTitle || ''}
              placeholder="Three roles, focused."
              onChange={(e) => setData({ ...data, sectionTitle: e.target.value })}
              disabled={!canEdit}
              style={getInputStyle()}
              {...focusHandlers}
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Aside Text (optional · shown to the right)</label>
          <input
            type="text"
            value={data.aside || ''}
            placeholder="Three roles · two domains"
            onChange={(e) => setData({ ...data, aside: e.target.value })}
            disabled={!canEdit}
            style={getInputStyle()}
            {...focusHandlers}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.jobs.map((job, i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            {/* Accordion header */}
            <button
              style={{
                width: '100%',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onClick={() => setOpenJob(openJob === i ? -1 : i)}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a', margin: 0 }}>{job.role}</p>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, marginTop: '2px' }}>
                  {job.company} &middot; {job.period}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {job.isCurrent && (
                  <span style={{
                    padding: '2px 10px',
                    background: 'rgba(16,185,129,0.1)',
                    color: '#059669',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    border: '1px solid rgba(16,185,129,0.2)',
                  }}>
                    Current
                  </span>
                )}
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  style={{ transform: openJob === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {openJob === i && (
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px', marginBottom: '14px' }}>
                  <div>
                    <label style={labelStyle}>Role / Title</label>
                    <input type="text" value={job.role} onChange={(e) => updateJob(i, { role: e.target.value })} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
                  </div>
                  <div>
                    <label style={labelStyle}>Company</label>
                    <input type="text" value={job.company} onChange={(e) => updateJob(i, { company: e.target.value })} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
                  </div>
                  <div>
                    <label style={labelStyle}>Period</label>
                    <input type="text" value={job.period} onChange={(e) => updateJob(i, { period: e.target.value })} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '22px' }}>
                    <input
                      type="checkbox"
                      id={`current-${i}`}
                      checked={job.isCurrent}
                      onChange={(e) => updateJob(i, { isCurrent: e.target.checked })}
                      disabled={!canEdit}
                      style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: canEdit ? 'pointer' : 'not-allowed' }}
                    />
                    <label htmlFor={`current-${i}`} style={{ fontSize: '13px', color: '#475569', fontWeight: 500, cursor: canEdit ? 'pointer' : 'default' }}>
                      Current Job
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Summary</label>
                  <textarea rows={2} value={job.summary} onChange={(e) => updateJob(i, { summary: e.target.value })} disabled={!canEdit} style={getInputStyle({ resize: 'none' })} {...focusHandlers} />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Bullet Points (one per line)</label>
                  <textarea
                    rows={5}
                    value={job.bullets.join('\n')}
                    onChange={(e) => updateJob(i, { bullets: e.target.value.split('\n') })}
                    disabled={!canEdit}
                    style={getInputStyle({ resize: 'none', fontFamily: 'inherit' })}
                    {...focusHandlers}
                  />
                </div>

                <div style={{ marginBottom: canEdit ? '14px' : '0' }}>
                  <label style={labelStyle}>Tech Stack</label>
                  <div
                    onClick={() => canEdit && stackInputRefs.current[i]?.focus()}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 10px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '8px',
                      background: canEdit ? '#fff' : '#f8fafc',
                      cursor: canEdit ? 'text' : 'not-allowed',
                      minHeight: '42px',
                    }}
                    onFocus={() => {
                      const el = stackInputRefs.current[i]?.closest('div') as HTMLElement | null;
                      if (el && canEdit) { el.style.borderColor = '#10b981'; el.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }
                    }}
                    onBlur={() => {
                      const el = stackInputRefs.current[i]?.closest('div') as HTMLElement | null;
                      if (el) { el.style.borderColor = '#e2e8f0'; el.style.boxShadow = 'none'; }
                    }}
                  >
                    {job.stack.map((tech, ti) => (
                      <span key={ti} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 10px',
                        background: 'rgba(16,185,129,0.1)',
                        border: '1px solid rgba(16,185,129,0.25)',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#059669',
                        whiteSpace: 'nowrap',
                      }}>
                        {tech}
                        {canEdit && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateJob(i, { stack: job.stack.filter((_, idx) => idx !== ti) });
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#059669',
                              fontSize: '13px',
                              lineHeight: 1,
                              padding: '0 0 0 2px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {canEdit && (
                      <input
                        ref={(el) => { stackInputRefs.current[i] = el; }}
                        type="text"
                        value={stackInputs[i] ?? ''}
                        placeholder={job.stack.length === 0 ? 'Type and press , or Enter to add…' : ''}
                        disabled={!canEdit}
                        onChange={(e) => setStackInputs((prev) => ({ ...prev, [i]: e.target.value }))}
                        onKeyDown={(e) => {
                          const raw = (stackInputs[i] ?? '').trim();
                          if ((e.key === ',' || e.key === 'Enter') && raw) {
                            e.preventDefault();
                            updateJob(i, { stack: [...job.stack, raw] });
                            setStackInputs((prev) => ({ ...prev, [i]: '' }));
                          } else if (e.key === 'Backspace' && !stackInputs[i] && job.stack.length > 0) {
                            updateJob(i, { stack: job.stack.slice(0, -1) });
                          }
                        }}
                        onBlur={() => {
                          const raw = (stackInputs[i] ?? '').trim();
                          if (raw) {
                            updateJob(i, { stack: [...job.stack, raw] });
                            setStackInputs((prev) => ({ ...prev, [i]: '' }));
                          }
                        }}
                        style={{
                          border: 'none',
                          outline: 'none',
                          fontSize: '13px',
                          color: '#0f172a',
                          background: 'transparent',
                          flex: '1',
                          minWidth: '140px',
                          padding: '2px 4px',
                        }}
                      />
                    )}
                  </div>
                  {canEdit && (
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      Press <kbd style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0 4px', fontSize: '11px' }}>,</kbd> or <kbd style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0 4px', fontSize: '11px' }}>Enter</kbd> to add · Backspace to remove last
                    </p>
                  )}
                </div>

                {canEdit && (
                  <button
                    onClick={() => removeJob(i)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      padding: '0',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    Remove this job
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {canEdit && (
          <button
            onClick={addJob}
            style={{
              width: '100%',
              padding: '14px',
              border: '2px dashed #e2e8f0',
              borderRadius: '12px',
              color: '#94a3b8',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#059669'; e.currentTarget.style.background = 'rgba(16,185,129,0.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
          >
            + Add Job
          </button>
        )}

        {canEdit && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 24px',
                background: saving ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: saving ? 'none' : '0 2px 8px rgba(16,185,129,0.3)',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {message === 'success' && (
              <span style={{ color: '#059669', fontSize: '13px', fontWeight: 500 }}>&#10003; Saved successfully!</span>
            )}
            {message.startsWith('error:') && (
              <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: 500 }}>&#10007; {message.slice(6)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
