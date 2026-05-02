import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdminLogin from './admin/AdminLogin';

export default function Navbar() {
  const { adminToken, adminUser, logout } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <nav style={{
        background: '#1a1a2e', color: '#fff', padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 52, position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <div style={{
            background: '#1B8B5E', borderRadius: 8, width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
          }}>🖨️</div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: 0.5 }}>PrintHub POS</span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Clock />
          {adminToken ? (
            <>
              <button onClick={() => navigate('/admin')} style={{
                background: location.pathname === '/admin' ? '#1B8B5E' : 'transparent',
                color: '#fff', border: '1px solid #1B8B5E', borderRadius: 6,
                padding: '5px 14px', fontSize: 13, fontWeight: 500
              }}>Admin Panel</button>
              <button onClick={() => { logout(); navigate('/'); }} style={{
                background: '#ef4444', color: '#fff', borderRadius: 6,
                padding: '5px 14px', fontSize: 13, fontWeight: 500
              }}>Logout ({adminUser})</button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{
              background: '#1B8B5E', color: '#fff', borderRadius: 6,
              padding: '5px 14px', fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6
            }}>🔐 Admin Login</button>
          )}
        </div>
      </nav>
      {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}
    </>
  );
}

function Clock() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontSize: 14, color: '#ccc', fontVariantNumeric: 'tabular-nums' }}>
      {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}
