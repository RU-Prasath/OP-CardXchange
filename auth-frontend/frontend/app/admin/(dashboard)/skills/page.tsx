'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';

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

export default function SkillsAdminPage() {
  const [data, setData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [contentRes, meRes] = await Promise.all([
        fetch('/api/admin/content/skills'),
        fetch('/api/admin/me'),
      ]);
      if (contentRes.ok) {
        const { data } = await contentRes.json();
        setData(data);
      }
      if (meRes.ok) {
        const { user } = await meRes.json();
        setCanEdit(user.isSuperAdmin || user.permissions.editableSections.includes('skills'));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/admin/content/skills', {
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

  const updateCategory = (index: number, field: 'title' | 'skills', value: string | string[]) => {
    if (!data) return;
    const categories = [...data.categories];
    categories[index] = { ...categories[index], [field]: value };
    setData({ ...data, categories });
  };

  const addCategory = () => {
    if (!data) return;
    setData({ ...data, categories: [...data.categories, { title: 'New Category', skills: [] }] });
  };

  const removeCategory = (index: number) => {
    if (!data) return;
    setData({ ...data, categories: data.categories.filter((_, i) => i !== index) });
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
      <AdminHeader title="Skills Section" subtitle="Manage your skill categories and tech stack." />

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
              placeholder="02 / Skills"
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
              placeholder="The toolkit I reach for first."
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
            placeholder="Calibrated by what I've actually shipped"
            onChange={(e) => setData({ ...data, aside: e.target.value })}
            disabled={!canEdit}
            style={getInputStyle()}
            {...focusHandlers}
          />
        </div>
      </div>

      {data.categories.map((cat, i) => (
        <div key={i} style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Category Title</label>
              <input
                type="text"
                value={cat.title}
                onChange={(e) => updateCategory(i, 'title', e.target.value)}
                disabled={!canEdit}
                style={getInputStyle({ fontWeight: 600 })}
                placeholder="Category title"
                {...focusHandlers}
              />
            </div>
            {canEdit && (
              <button
                onClick={() => removeCategory(i)}
                style={{
                  marginTop: '22px',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '1.5px solid #e2e8f0',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  fontSize: '14px',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.background = '#fef2f2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}
              >
                ✕
              </button>
            )}
          </div>
          <div>
            <label style={labelStyle}>Skills (comma-separated)</label>
            <textarea
              rows={2}
              value={cat.skills.join(', ')}
              onChange={(e) =>
                updateCategory(
                  i,
                  'skills',
                  e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                )
              }
              disabled={!canEdit}
              style={getInputStyle({ resize: 'none' })}
              placeholder="React.js, Node.js, MongoDB"
              {...focusHandlers}
            />
            {cat.skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                {cat.skills.map((skill, si) => (
                  <span
                    key={si}
                    style={{
                      padding: '3px 10px',
                      background: 'rgba(16,185,129,0.08)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      borderRadius: '20px',
                      fontSize: '12px',
                      color: '#059669',
                      fontWeight: 500,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {canEdit && (
        <button
          onClick={addCategory}
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
            marginBottom: '20px',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#059669'; e.currentTarget.style.background = 'rgba(16,185,129,0.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
        >
          + Add Category
        </button>
      )}

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
