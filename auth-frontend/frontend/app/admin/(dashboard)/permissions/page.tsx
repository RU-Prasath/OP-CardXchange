'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';

interface User {
  _id: string;
  email: string;
  isSuperAdmin: boolean;
  permissions: {
    visibleScreens: string[];
    editableSections: string[];
  };
  lastLogin?: string;
  createdAt?: string;
}

const ALL_SECTIONS = ['hero', 'about', 'projects', 'experience', 'skills', 'colors', 'contact'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#0f172a',
  background: '#fff',
  outline: 'none',
};

export default function PermissionsAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [newEmail, setNewEmail] = useState('');
  const [addingUser, setAddingUser] = useState(false);
  const [addMessage, setAddMessage] = useState('');

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const { users } = await res.json();
      setUsers(users);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setAddingUser(true);
    setAddMessage('');

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail.trim() }),
    });

    const data = await res.json();
    if (res.ok) {
      setAddMessage('User added successfully!');
      setNewEmail('');
      fetchUsers();
    } else {
      setAddMessage(`Error: ${data.error}`);
    }
    setAddingUser(false);
  };

  const togglePermission = (userId: string, type: 'visibleScreens' | 'editableSections', section: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u._id !== userId) return u;
        const current = u.permissions[type];
        const updated = current.includes(section)
          ? current.filter((s) => s !== section)
          : [...current, section];
        return { ...u, permissions: { ...u.permissions, [type]: updated } };
      })
    );
  };

  const savePermissions = async (user: User) => {
    setSaving(user._id);
    setMessages((prev) => ({ ...prev, [user._id]: '' }));
    const res = await fetch(`/api/admin/users/${user._id}/permissions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visibleScreens: user.permissions.visibleScreens,
        editableSections: user.permissions.editableSections,
      }),
    });
    const json = res.ok ? null : await res.json();
    setMessages((prev) => ({
      ...prev,
      [user._id]: res.ok ? 'Saved!' : `Error: ${json?.error}`,
    }));
    setSaving(null);
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Remove ${email} from admin users?`)) return;
    const res = await fetch(`/api/admin/users/${userId}/permissions`, { method: 'DELETE' });
    if (res.ok) fetchUsers();
  };

  if (loading) return <div style={{ color: '#64748b', padding: '32px 0' }}>Loading users...</div>;

  return (
    <div>
      <AdminHeader
        title="Permissions"
        subtitle="Manage which admin users can view and edit each portfolio section."
      />

      {/* Add New User */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Add Admin User</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          Enter an email address to grant admin access. The user will be able to log in via OTP.
        </p>
        <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={addingUser || !newEmail.trim()}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: addingUser ? 'not-allowed' : 'pointer',
              opacity: addingUser ? 0.6 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {addingUser ? 'Adding...' : 'Add User'}
          </button>
        </form>
        {addMessage && (
          <p style={{ marginTop: '10px', fontSize: '13px', color: addMessage.startsWith('Error') ? '#ef4444' : '#10b981' }}>
            {addMessage}
          </p>
        )}
      </div>

      {/* Users list */}
      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
          <p>No admin users yet. Add one above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {users.map((user) => (
            <div key={user._id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
              {/* User header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>{user.email}</span>
                    {user.isSuperAdmin && (
                      <span style={{ padding: '2px 8px', background: '#d1fae5', color: '#065f46', fontSize: '11px', borderRadius: '999px', fontFamily: 'monospace' }}>
                        Super Admin
                      </span>
                    )}
                  </div>
                  {user.createdAt && (
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Added {new Date(user.createdAt).toLocaleDateString()}
                      {user.lastLogin ? ` · Last login ${new Date(user.lastLogin).toLocaleDateString()}` : ' · Never logged in'}
                    </p>
                  )}
                </div>

                {!user.isSuperAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {messages[user._id] && (
                      <span style={{ fontSize: '13px', color: messages[user._id].startsWith('Error') ? '#ef4444' : '#10b981' }}>
                        {messages[user._id]}
                      </span>
                    )}
                    <button
                      onClick={() => savePermissions(user)}
                      disabled={saving === user._id}
                      style={{
                        padding: '8px 16px',
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: saving === user._id ? 'not-allowed' : 'pointer',
                        opacity: saving === user._id ? 0.6 : 1,
                      }}
                    >
                      {saving === user._id ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => deleteUser(user._id, user.email)}
                      style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {user.isSuperAdmin ? (
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Super admins have full access to all sections.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <th style={{ textAlign: 'left', padding: '8px 12px 8px 0', color: '#64748b', fontWeight: 500, width: '140px' }}>Section</th>
                        <th style={{ textAlign: 'center', padding: '8px 24px', color: '#64748b', fontWeight: 500 }}>Can View</th>
                        <th style={{ textAlign: 'center', padding: '8px 24px', color: '#64748b', fontWeight: 500 }}>Can Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ALL_SECTIONS.map((section) => (
                        <tr key={section} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '10px 12px 10px 0', color: '#334155', fontWeight: 500, textTransform: 'capitalize' }}>{section}</td>
                          <td style={{ textAlign: 'center', padding: '10px 24px' }}>
                            <input
                              type="checkbox"
                              checked={user.permissions.visibleScreens.includes(section)}
                              onChange={() => togglePermission(user._id, 'visibleScreens', section)}
                              style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center', padding: '10px 24px' }}>
                            <input
                              type="checkbox"
                              checked={user.permissions.editableSections.includes(section)}
                              onChange={() => togglePermission(user._id, 'editableSections', section)}
                              style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
