'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import ImageUpload from '@/components/admin/ImageUpload';

interface Project {
  id: string;
  title: string;
  tag: string;
  description: string;
  stack: string[];
  liveLink: string;
  githubLink: string;
  image: string;
}

interface ProjectsData {
  items: Project[];
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

export default function ProjectsAdminPage() {
  const [data, setData] = useState<ProjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [message, setMessage] = useState('');
  const [openProject, setOpenProject] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const [contentRes, meRes] = await Promise.all([
        fetch('/api/admin/content/projects'),
        fetch('/api/admin/me'),
      ]);
      if (contentRes.ok) {
        const { data } = await contentRes.json();
        setData(data);
      }
      if (meRes.ok) {
        const { user } = await meRes.json();
        setCanEdit(user.isSuperAdmin || user.permissions.editableSections.includes('projects'));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/admin/content/projects', {
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

  const updateProject = (index: number, updates: Partial<Project>) => {
    if (!data) return;
    const items = [...data.items];
    items[index] = { ...items[index], ...updates };
    setData({ ...data, items });
  };

  const addProject = () => {
    if (!data) return;
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      tag: 'Stack',
      description: '',
      stack: [],
      liveLink: '#',
      githubLink: '#',
      image: '',
    };
    setData({ ...data, items: [...data.items, newProject] });
    setOpenProject(data.items.length);
  };

  const removeProject = (index: number) => {
    if (!data) return;
    setData({ ...data, items: data.items.filter((_, i) => i !== index) });
    setOpenProject(Math.max(0, openProject - 1));
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
      <AdminHeader title="Projects Section" subtitle="Manage your portfolio projects." />

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
              placeholder="04 / Selected Work"
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
              placeholder="Selected work I'm proud of."
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
            placeholder="Personal + professional"
            onChange={(e) => setData({ ...data, aside: e.target.value })}
            disabled={!canEdit}
            style={getInputStyle()}
            {...focusHandlers}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.items.map((project, i) => (
          <div
            key={project.id}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
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
              onClick={() => setOpenProject(openProject === i ? -1 : i)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {project.image && (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a', margin: 0 }}>{project.title}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, marginTop: '2px' }}>{project.tag}</p>
                </div>
              </div>
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                style={{ transform: openProject === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openProject === i && (
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px', marginBottom: '14px' }}>
                  <div>
                    <label style={labelStyle}>Title</label>
                    <input type="text" value={project.title} onChange={(e) => updateProject(i, { title: e.target.value })} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
                  </div>
                  <div>
                    <label style={labelStyle}>Tag / Category</label>
                    <input type="text" value={project.tag} onChange={(e) => updateProject(i, { tag: e.target.value })} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
                  </div>
                  <div>
                    <label style={labelStyle}>Live Link</label>
                    <input type="text" value={project.liveLink} onChange={(e) => updateProject(i, { liveLink: e.target.value })} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
                  </div>
                  <div>
                    <label style={labelStyle}>GitHub Link</label>
                    <input type="text" value={project.githubLink} onChange={(e) => updateProject(i, { githubLink: e.target.value })} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea rows={3} value={project.description} onChange={(e) => updateProject(i, { description: e.target.value })} disabled={!canEdit} style={getInputStyle({ resize: 'none' })} {...focusHandlers} />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Tech Stack (comma-separated)</label>
                  <input type="text" value={project.stack.join(', ')} onChange={(e) => updateProject(i, { stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} disabled={!canEdit} style={getInputStyle()} {...focusHandlers} />
                  {project.stack.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {project.stack.map((tech, ti) => (
                        <span key={ti} style={{
                          padding: '2px 9px',
                          background: '#f1f5f9',
                          borderRadius: '20px',
                          fontSize: '12px',
                          color: '#475569',
                          fontWeight: 500,
                        }}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>

                {canEdit && (
                  <div style={{ marginBottom: '14px' }}>
                    <ImageUpload
                      value={project.image}
                      onChange={(url) => updateProject(i, { image: url })}
                      label="Project Image"
                    />
                  </div>
                )}

                {canEdit && (
                  <button
                    onClick={() => removeProject(i)}
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
                    Remove this project
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {canEdit && (
          <button
            onClick={addProject}
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
            + Add Project
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
