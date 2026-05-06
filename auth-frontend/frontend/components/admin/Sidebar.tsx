'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  visibleScreens: string[];
  isSuperAdmin: boolean;
  email: string;
}

const sectionLabels: Record<string, string> = {
  hero: 'Hero',
  about: 'About',
  projects: 'Projects',
  experience: 'Experience',
  skills: 'Skills',
  colors: 'Colors',
  contact: 'Contact',
  permissions: 'Permissions',
};

function SectionIcon({ section }: { section: string }) {
  const iconProps = {
    width: 16,
    height: 16,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
  };

  switch (section) {
    case 'hero':
      return (
        <svg {...iconProps}>
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      );
    case 'about':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      );
    case 'projects':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'experience':
      return (
        <svg {...iconProps}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="10" y1="14" x2="14" y2="14" />
        </svg>
      );
    case 'skills':
      return (
        <svg {...iconProps}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case 'colors':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 010 20" fill="currentColor" fillOpacity="0.15" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'contact':
      return (
        <svg {...iconProps}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 7 10-7" />
        </svg>
      );
    case 'permissions':
      return (
        <svg {...iconProps}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 018 0v4" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      );
  }
}

export default function Sidebar({ visibleScreens, isSuperAdmin, email }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const screens = isSuperAdmin
    ? [...visibleScreens, 'permissions'].filter((v, i, a) => a.indexOf(v) === i)
    : visibleScreens;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside style={{
      width: '240px',
      minWidth: '240px',
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      borderRight: '1px solid #1e293b',
    }}>
      {/* Logo */}
      <div style={{ flex: '0 0 auto', padding: '14px 16px 12px', borderBottom: '1px solid #1e293b' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(16,185,129,0.4)',
          }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '15px', fontFamily: 'monospace' }}>P</span>
          </div>
          <div>
            <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '13.5px', margin: 0, letterSpacing: '-0.01em' }}>Portfolio CMS</p>
            <p style={{ color: '#475569', fontSize: '10.5px', margin: 0, marginTop: '1px' }}>Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: '1 1 auto', padding: '8px 10px', overflowY: 'auto', minHeight: 0 }}>
        <p style={{ color: '#334155', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 10px', marginBottom: '4px', marginTop: '2px' }}>
          Sections
        </p>
        {screens.map((section) => {
          const href = `/admin/${section}`;
          const isActive = pathname === href;

          return (
            <Link
              key={section}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 10px',
                borderRadius: '7px',
                marginBottom: '1px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#f1f5f9' : '#64748b',
                background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
                transition: 'all 0.15s',
                position: 'relative',
              }}
            >
              <span style={{ color: isActive ? '#10b981' : '#475569', flexShrink: 0 }}>
                <SectionIcon section={section} />
              </span>
              <span>{sectionLabels[section] || section}</span>
              {isActive && (
                <span style={{
                  marginLeft: 'auto',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  flexShrink: 0,
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div style={{ flex: '0 0 auto', marginTop: 'auto', padding: '10px', borderTop: '1px solid #1e293b' }}>
        <div style={{
          background: '#1e293b',
          borderRadius: '9px',
          padding: '9px 10px',
          marginBottom: '6px',
        }}>
          <p style={{ color: '#94a3b8', fontSize: '11.5px', fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {email}
          </p>
          {isSuperAdmin && (
            <span style={{
              display: 'inline-block',
              marginTop: '4px',
              padding: '1px 7px',
              borderRadius: '20px',
              background: 'rgba(16,185,129,0.15)',
              color: '#10b981',
              fontSize: '9.5px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: '1px solid rgba(16,185,129,0.25)',
            }}>
              Super Admin
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 10px',
            borderRadius: '7px',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: '12.5px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#64748b';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
