'use client';

import { useState, useEffect, useRef } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';

interface Stat {
  number: string;
  unit: string;
  label: string;
}

interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  resumeLink: string;
  stats: Stat[];
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

const inputStyle: React.CSSProperties = {
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

const inputDisabledStyle: React.CSSProperties = {
  ...inputStyle,
  background: '#f8fafc',
  color: '#94a3b8',
  cursor: 'not-allowed',
};

export default function HeroAdminPage() {
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [message, setMessage] = useState('');
  const [pdfUploading, setPdfUploading] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [contentRes, meRes] = await Promise.all([
        fetch('/api/admin/content/hero'),
        fetch('/api/admin/me'),
      ]);

      if (contentRes.ok) {
        const { data } = await contentRes.json();
        setData(data);
      }

      if (meRes.ok) {
        const { user } = await meRes.json();
        setCanEdit(user.isSuperAdmin || user.permissions.editableSections.includes('hero'));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    const res = await fetch('/api/admin/content/hero', {
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

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    if (!data) return;
    const stats = [...data.stats];
    stats[index] = { ...stats[index], [field]: value };
    setData({ ...data, stats });
  };

  const addStat = () => {
    if (!data) return;
    setData({ ...data, stats: [...data.stats, { number: '', unit: '', label: '' }] });
  };

  const removeStat = (index: number) => {
    if (!data) return;
    setData({ ...data, stats: data.stats.filter((_, i) => i !== index) });
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    setPdfUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'pdf');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const { url } = await res.json();
      setData({ ...data, resumeLink: url });
    }
    setPdfUploading(false);
    // Reset input so same file can be re-selected
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };

  const isUploadedPdf = data?.resumeLink?.startsWith('/uploads/');

  if (loading) return (
    <div style={{ color: '#64748b', padding: '40px 0', textAlign: 'center', fontSize: '14px' }}>Loading...</div>
  );
  if (!data) return (
    <div style={{ color: '#ef4444', padding: '40px 0', fontSize: '14px' }}>Failed to load hero content</div>
  );

  const getInput = (style?: React.CSSProperties) =>
    canEdit ? { ...inputStyle, ...style } : { ...inputDisabledStyle, ...style };

  return (
    <div>
      <AdminHeader
        title="Hero Section"
        subtitle="Edit the main hero section displayed at the top of your portfolio."
      />

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

      {/* Basic info card */}
      <div style={cardStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              disabled={!canEdit}
              style={getInput()}
              onFocus={(e) => { if (canEdit) { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              disabled={!canEdit}
              style={getInput()}
              onFocus={(e) => { if (canEdit) { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Subtitle / Summary</label>
          <textarea
            rows={3}
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            disabled={!canEdit}
            style={{ ...getInput(), resize: 'none' }}
            onFocus={(e) => { if (canEdit) { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}}
            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>CTA Button Text</label>
            <input
              type="text"
              value={data.ctaText}
              onChange={(e) => setData({ ...data, ctaText: e.target.value })}
              disabled={!canEdit}
              style={getInput()}
              onFocus={(e) => { if (canEdit) { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={labelStyle}>CTA Link</label>
            <input
              type="text"
              value={data.ctaLink}
              onChange={(e) => setData({ ...data, ctaLink: e.target.value })}
              disabled={!canEdit}
              style={getInput()}
              onFocus={(e) => { if (canEdit) { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Resume PDF</label>
          {canEdit && (
            <>
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={handlePdfUpload}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={pdfUploading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '9px 18px',
                    background: pdfUploading ? '#f1f5f9' : 'rgba(16,185,129,0.07)',
                    border: '1.5px solid rgba(16,185,129,0.25)',
                    borderRadius: '8px',
                    color: pdfUploading ? '#94a3b8' : '#059669',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: pdfUploading ? 'not-allowed' : 'pointer',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📄</span>
                  {pdfUploading ? 'Uploading...' : 'Upload PDF Resume'}
                </button>
                {isUploadedPdf && data.resumeLink && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '6px 12px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#166534',
                      fontWeight: 500,
                      maxWidth: '220px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {data.resumeLink.split('/').pop()}
                    </span>
                    <a
                      href={data.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '5px 11px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#475569',
                        fontWeight: 500,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Open
                    </a>
                    <button
                      type="button"
                      onClick={() => setData({ ...data, resumeLink: '' })}
                      style={{
                        padding: '5px 11px',
                        background: 'transparent',
                        border: '1px solid #fca5a5',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#dc2626',
                        fontWeight: 500,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
                {!isUploadedPdf && (
                  <input
                    type="text"
                    value={data.resumeLink}
                    onChange={(e) => setData({ ...data, resumeLink: e.target.value })}
                    placeholder="Or paste external URL"
                    style={{ ...getInput(), maxWidth: '260px' }}
                    onFocus={(e) => { if (canEdit) { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                )}
              </div>
            </>
          )}
          {!canEdit && (
            <input
              type="text"
              value={data.resumeLink}
              disabled
              style={getInput()}
            />
          )}
        </div>
      </div>

      {/* Stats card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <label style={{ ...labelStyle, marginBottom: '2px' }}>Stats</label>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Number, unit, and label for each highlight stat</p>
          </div>
          {canEdit && (
            <button
              onClick={addStat}
              style={{
                padding: '7px 14px',
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '7px',
                color: '#059669',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              + Add Stat
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {data.stats.map((stat, i) => (
            <div
              key={i}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minWidth: 0 }}>
                <input
                  type="text"
                  value={stat.number}
                  onChange={(e) => updateStat(i, 'number', e.target.value)}
                  disabled={!canEdit}
                  placeholder="Num"
                  style={{
                    width: '72px',
                    flexShrink: 0,
                    padding: '8px 10px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#0f172a',
                    background: canEdit ? '#fff' : '#f1f5f9',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { if (canEdit) { e.target.style.borderColor = '#10b981'; }}}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; }}
                />
                <input
                  type="text"
                  value={stat.unit}
                  onChange={(e) => updateStat(i, 'unit', e.target.value)}
                  disabled={!canEdit}
                  placeholder="Unit"
                  style={{
                    width: '60px',
                    flexShrink: 0,
                    padding: '8px 10px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#0f172a',
                    background: canEdit ? '#fff' : '#f1f5f9',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { if (canEdit) { e.target.style.borderColor = '#10b981'; }}}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; }}
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(i, 'label', e.target.value)}
                  disabled={!canEdit}
                  placeholder="Label"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '8px 10px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#0f172a',
                    background: canEdit ? '#fff' : '#f1f5f9',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { if (canEdit) { e.target.style.borderColor = '#10b981'; }}}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; }}
                />
                {canEdit && (
                  <button
                    onClick={() => removeStat(i)}
                    style={{
                      flexShrink: 0,
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'transparent',
                      border: 'none',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {data.stats.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>
            No stats yet. Click &ldquo;+ Add Stat&rdquo; to add one.
          </div>
        )}
      </div>

      {canEdit && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
  );
}
