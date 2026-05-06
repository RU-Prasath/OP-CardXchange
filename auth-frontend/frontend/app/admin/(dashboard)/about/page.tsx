'use client';

import { useState, useEffect, useRef } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';

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

export default function AboutAdminPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [message, setMessage] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [contentRes, meRes] = await Promise.all([
        fetch('/api/admin/content/about'),
        fetch('/api/admin/me'),
      ]);
      if (contentRes.ok) {
        const { data } = await contentRes.json();
        setData(data);
      }
      if (meRes.ok) {
        const { user } = await meRes.json();
        setCanEdit(user.isSuperAdmin || user.permissions.editableSections.includes('about'));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/admin/content/about', {
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

  const updateBio = (index: number, value: string) => {
    if (!data) return;
    const bio = [...data.bio];
    bio[index] = value;
    setData({ ...data, bio });
  };

  const addBioParagraph = () => {
    if (!data) return;
    setData({ ...data, bio: [...data.bio, ''] });
  };

  const removeBioParagraph = (index: number) => {
    if (!data) return;
    setData({ ...data, bio: data.bio.filter((_, i) => i !== index) });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    setPhotoUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const { url } = await res.json();
      setData({ ...data, profileImage: url });
    }
    setPhotoUploading(false);
    if (photoInputRef.current) photoInputRef.current.value = '';
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

  const infoFields: { key: keyof AboutData; label: string }[] = [
    { key: 'location', label: 'Location' },
    { key: 'timezone', label: 'Timezone' },
    { key: 'education', label: 'Education' },
    { key: 'languages', label: 'Languages' },
  ];

  return (
    <div>
      <AdminHeader title="About Section" subtitle="Edit your personal bio and info cards." />

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
              placeholder="01 / About"
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
              placeholder="A short version of a longer story."
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
            placeholder="Optional small text on the right"
            onChange={(e) => setData({ ...data, aside: e.target.value })}
            disabled={!canEdit}
            style={getInputStyle()}
            {...focusHandlers}
          />
        </div>
      </div>

      {/* Profile Photo card */}
      <div style={cardStyle}>
        <label style={{ ...labelStyle, marginBottom: '16px' }}>Profile Photo</label>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handlePhotoUpload}
        />
        {data.profileImage ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.profileImage}
              alt="Profile"
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0', flexShrink: 0 }}
            />
            {canEdit && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoUploading}
                  style={{
                    padding: '8px 18px',
                    background: 'rgba(16,185,129,0.07)',
                    border: '1.5px solid rgba(16,185,129,0.25)',
                    borderRadius: '8px',
                    color: '#059669',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: photoUploading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {photoUploading ? 'Uploading...' : 'Change Photo'}
                </button>
                <button
                  type="button"
                  onClick={() => setData({ ...data, profileImage: '' })}
                  style={{
                    padding: '8px 18px',
                    background: 'transparent',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    color: '#dc2626',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => canEdit && !photoUploading && photoInputRef.current?.click()}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '2px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: canEdit ? 'pointer' : 'default',
              background: '#f8fafc',
              color: '#94a3b8',
            }}
          >
            <span style={{ fontSize: '28px' }}>📷</span>
            <span style={{ fontSize: '11px', fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
              {photoUploading ? 'Uploading...' : canEdit ? 'Upload Photo' : 'No Photo'}
            </span>
          </div>
        )}
      </div>

      {/* Bio paragraphs card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <label style={{ ...labelStyle, marginBottom: '2px' }}>Bio Paragraphs</label>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Each paragraph is displayed separately</p>
          </div>
          {canEdit && (
            <button
              onClick={addBioParagraph}
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
              + Add Paragraph
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.bio.map((para, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <label style={{ ...labelStyle, marginBottom: '4px' }}>Paragraph {i + 1}</label>
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => updateBio(i, e.target.value)}
                  disabled={!canEdit}
                  style={getInputStyle({ resize: 'none' })}
                  {...focusHandlers}
                />
              </div>
              {canEdit && data.bio.length > 1 && (
                <button
                  onClick={() => removeBioParagraph(i)}
                  style={{
                    marginTop: '24px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    border: 'none',
                    color: '#cbd5e1',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info fields card */}
      <div style={cardStyle}>
        <label style={{ ...labelStyle, marginBottom: '16px' }}>Personal Info</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {infoFields.map(({ key, label }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                type="text"
                value={data[key] as string}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
                disabled={!canEdit}
                style={getInputStyle()}
                {...focusHandlers}
              />
            </div>
          ))}
        </div>
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
