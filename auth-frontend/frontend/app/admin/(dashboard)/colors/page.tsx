'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import type { ColorsData } from '@/lib/buildColorVars';

const COLOR_FIELDS: { key: keyof ColorsData; label: string; description: string; group: string }[] = [
  // Backgrounds
  { key: 'bg',         label: 'Page Background',    description: 'Main page background (--bg)',           group: 'Backgrounds' },
  { key: 'bgElev',     label: 'Elevated Surface',   description: 'Nav, elevated panels (--bg-elev)',      group: 'Backgrounds' },
  { key: 'bgCard',     label: 'Card Background',    description: 'Cards, modals (--bg-card)',              group: 'Backgrounds' },
  // Text
  { key: 'fg',         label: 'Primary Text',       description: 'Headings, strong text (--fg)',           group: 'Text' },
  { key: 'fgMuted',    label: 'Muted Text',         description: 'Body, secondary text (--fg-muted)',      group: 'Text' },
  { key: 'fgFaint',    label: 'Faint Text',         description: 'Labels, placeholders (--fg-faint)',      group: 'Text' },
  // Borders
  { key: 'line',       label: 'Border',             description: 'Default borders & dividers (--line)',    group: 'Borders' },
  { key: 'lineStrong', label: 'Strong Border',      description: 'Hover borders (--line-strong)',          group: 'Borders' },
  // Accent
  { key: 'accent',     label: 'Accent',             description: 'Green dots, active states (--accent)',   group: 'Accent' },
  { key: 'accentSoft', label: 'Accent Soft',        description: 'Badge backgrounds (--accent-soft)',      group: 'Accent' },
  { key: 'accentFg',   label: 'Accent Text',        description: 'Text on accent backgrounds (--accent-fg)', group: 'Accent' },
];

const GROUPS = ['Backgrounds', 'Text', 'Borders', 'Accent'];

const ORIGINAL_DEFAULTS: ColorsData = {
  bg:          'oklch(0.16 0.008 260)',
  bgElev:      'oklch(0.2 0.01 260)',
  bgCard:      'oklch(0.22 0.012 260)',
  fg:          'oklch(0.96 0.004 90)',
  fgMuted:     'oklch(0.7 0.01 260)',
  fgFaint:     'oklch(0.52 0.012 260)',
  line:        'oklch(0.28 0.012 260)',
  lineStrong:  'oklch(0.36 0.014 260)',
  accent:      'oklch(0.78 0.18 145)',
  accentSoft:  'oklch(0.28 0.06 145)',
  accentFg:    'oklch(0.92 0.14 145)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '2px',
};

export default function ColorsAdminPage() {
  const [data, setData] = useState<ColorsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const [contentRes, meRes] = await Promise.all([
        fetch('/api/admin/content/colors'),
        fetch('/api/admin/me'),
      ]);
      if (contentRes.ok) {
        const { data } = await contentRes.json();
        setData(data);
      }
      if (meRes.ok) {
        const { user } = await meRes.json();
        setCanEdit(user.isSuperAdmin || user.permissions.editableSections.includes('colors'));
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/admin/content/colors', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    setMessage(res.ok ? 'success' : `error:${(await res.json()).error}`);
    setSaving(false);
  };

  const resetToDefaults = () => setData({ ...ORIGINAL_DEFAULTS });

  if (loading) return <div style={{ color: '#64748b', padding: '40px 0', textAlign: 'center' }}>Loading...</div>;
  if (!data)   return <div style={{ color: '#ef4444', padding: '40px 0' }}>Failed to load content</div>;

  return (
    <div>
      <AdminHeader title="Color Settings" subtitle="Customize every color token used in your portfolio. Supports hex (#10b981), oklch(), hsl(), rgb()." />

      {!canEdit && (
        <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', color: '#92400e', fontSize: '13px' }}>
          You have view-only access to this section.
        </div>
      )}

      {/* Live preview strip */}
      <div style={{
        marginBottom: '24px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{ padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview</span>
        </div>
        <div style={{ padding: '20px 24px', background: data.bg ?? '#0f172a', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ background: data.bgCard ?? '#1e293b', borderRadius: '10px', padding: '14px 18px', border: `1px solid ${data.line ?? '#334155'}`, minWidth: '180px' }}>
            <p style={{ margin: '0 0 6px 0', color: data.fg ?? '#f1f5f9', fontSize: '15px', fontWeight: 600 }}>Portfolio Card</p>
            <p style={{ margin: '0 0 10px 0', color: data.fgMuted ?? '#94a3b8', fontSize: '13px' }}>Muted description text</p>
            <span style={{ fontSize: '11px', color: data.fgFaint ?? '#64748b', fontFamily: 'monospace' }}>faint label</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button style={{ padding: '8px 16px', background: data.accent ?? '#10b981', color: data.bg ?? '#0f172a', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 600, cursor: 'default' }}>
              Accent Button
            </button>
            <div style={{ padding: '6px 12px', background: data.accentSoft ?? '#064e3b', borderRadius: '7px', border: `1px solid ${data.accent ?? '#10b981'}33` }}>
              <span style={{ color: data.accentFg ?? '#6ee7b7', fontSize: '12px', fontWeight: 500 }}>Accent badge</span>
            </div>
            <div style={{ height: '1px', width: '120px', background: data.line ?? '#334155' }} />
            <div style={{ height: '1px', width: '120px', background: data.lineStrong ?? '#475569' }} />
          </div>
        </div>
      </div>

      {/* Color groups */}
      {GROUPS.map((group) => {
        const fields = COLOR_FIELDS.filter((f) => f.group === group);
        return (
          <div key={group} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
              {group}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {fields.map(({ key, label, description }) => {
                const val = (data[key] as string) ?? '';
                return (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 8px 0' }}>{description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Color swatch — only works for hex, but shows approximate preview */}
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                        border: '1.5px solid #e2e8f0', overflow: 'hidden', position: 'relative',
                        background: val, boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      }}>
                        <input
                          type="color"
                          value={val.startsWith('#') ? val : '#000000'}
                          onChange={(e) => canEdit && setData({ ...data, [key]: e.target.value })}
                          disabled={!canEdit}
                          title="Pick a hex color (or type any CSS value in the text box)"
                          style={{ position: 'absolute', inset: '-4px', width: 'calc(100% + 8px)', height: 'calc(100% + 8px)', opacity: 0, cursor: canEdit ? 'pointer' : 'not-allowed' }}
                        />
                      </div>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => canEdit && setData({ ...data, [key]: e.target.value })}
                        disabled={!canEdit}
                        placeholder="e.g. oklch(0.16 0.008 260) or #0f172a"
                        style={{
                          flex: 1, padding: '9px 12px', border: '1.5px solid #e2e8f0',
                          borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace',
                          color: '#0f172a', background: canEdit ? '#fff' : '#f8fafc',
                          outline: 'none', boxSizing: 'border-box',
                          cursor: canEdit ? 'auto' : 'not-allowed',
                        }}
                        onFocus={(e) => { if (canEdit) { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}}
                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {canEdit && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 24px',
              background: saving ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px',
              fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : '0 2px 8px rgba(16,185,129,0.3)',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={resetToDefaults}
            style={{
              padding: '10px 20px', background: '#f8fafc', color: '#475569',
              border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px',
              fontWeight: 500, cursor: 'pointer',
            }}
          >
            Reset to Original
          </button>
          {message === 'success' && <span style={{ color: '#059669', fontSize: '13px', fontWeight: 500 }}>&#10003; Saved — refresh your portfolio to see changes</span>}
          {message.startsWith('error:') && <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: 500 }}>&#10007; {message.slice(6)}</span>}
        </div>
      )}
    </div>
  );
}
