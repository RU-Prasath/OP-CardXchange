import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin({ onClose }) {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.username, form.password);
      onClose();
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: 32, width: 360,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ marginBottom: 4, color: '#1a1a2e' }}>Admin Login</h2>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>PrintHub Management System</p>
        {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Username</label>
            <input value={form.username} onChange={e => setForm({...form, username: e.target.value})}
              style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
              placeholder="Enter username" required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#374151' }}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
              placeholder="Enter password" required />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '11px', borderRadius: 8, background: '#f3f4f6',
              color: '#374151', fontSize: 14, fontWeight: 500
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              flex: 2, padding: '11px', borderRadius: 8, background: '#1B8B5E',
              color: '#fff', fontSize: 14, fontWeight: 600
            }}>{loading ? 'Logging in...' : 'Login'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
