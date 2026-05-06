'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';

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

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: '#0f172a',
  margin: '0 0 16px 0',
  paddingBottom: '12px',
  borderBottom: '1px solid #f1f5f9',
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

export default function ContactAdminPage() {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [contentRes, meRes] = await Promise.all([
        fetch('/api/admin/content/contact'),
        fetch('/api/admin/me'),
      ]);
      if (contentRes.ok) {
        const { data } = await contentRes.json();
        setData(data);
      }
      if (meRes.ok) {
        const { user } = await meRes.json();
        setCanEdit(user.isSuperAdmin || user.permissions.editableSections.includes('contact'));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/admin/content/contact', {
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

  if (loading) return (
    <div style={{ color: '#64748b', padding: '40px 0', textAlign: 'center', fontSize: '14px' }}>Loading...</div>
  );
  if (!data) return (
    <div style={{ color: '#ef4444', padding: '40px 0', fontSize: '14px' }}>Failed to load content</div>
  );

  const update = (key: keyof ContactData, value: string) => setData({ ...data, [key]: value });

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
      <AdminHeader title="Contact Section" subtitle="Edit contact info and social links." />

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

      {/* Display Text */}
      <div style={cardStyle}>
        <p style={sectionTitleStyle}>Display Text</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Headline</label>
            <input type="text" value={data.headline} onChange={(e) => update('headline', e.target.value)} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
          </div>
          <div>
            <label style={labelStyle}>Subtext</label>
            <textarea rows={2} value={data.subtext} onChange={(e) => update('subtext', e.target.value)} disabled={!canEdit} style={getInputStyle({ resize: 'none' })} {...focusHandlers} />
          </div>
          <div>
            <label style={labelStyle}>Success Message</label>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 6px 0' }}>Shown to visitors after they submit the contact form</p>
            <input type="text" value={data.successMessage} onChange={(e) => update('successMessage', e.target.value)} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div style={cardStyle}>
        <p style={sectionTitleStyle}>Contact Info</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input type="text" value={data.phone} onChange={(e) => update('phone', e.target.value)} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
          </div>
          <div>
            <label style={labelStyle}>GitHub URL</label>
            <input type="url" value={data.github} onChange={(e) => update('github', e.target.value)} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
          </div>
          <div>
            <label style={labelStyle}>LinkedIn URL</label>
            <input type="url" value={data.linkedin} onChange={(e) => update('linkedin', e.target.value)} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Contact Form Recipient Email</label>
            <input type="email" value={data.recipientEmail} onChange={(e) => update('recipientEmail', e.target.value)} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
          </div>
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
