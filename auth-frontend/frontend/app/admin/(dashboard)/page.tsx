import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJWT } from '@/lib/auth';

function emailToSlug(email: string): string {
  return email.toLowerCase().replace('@', '-at-').replace(/\./g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function AdminDashboard() {
  const cookieStore = cookies();
  const token = cookieStore.get('portfolio_session')?.value;
  const session = token ? verifyJWT(token) : null;

  if (!session) redirect('/admin/login');

  const firstScreen = session.isSuperAdmin
    ? 'hero'
    : session.permissions.visibleScreens[0];

  if (firstScreen) {
    redirect(`/admin/${firstScreen}`);
  }

  const portfolioUrl = session.isSuperAdmin
    ? 'http://localhost:3000/'
    : `http://localhost:3000/p/${emailToSlug(session.email)}`;

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        maxWidth: '520px',
      }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>
          Your Portfolio URL
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <code style={{
            flex: 1,
            padding: '10px 14px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#0f172a',
            wordBreak: 'break-all',
          }}>
            {portfolioUrl}
          </code>
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
              flexShrink: 0,
            }}
          >
            Preview Portfolio
          </a>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>No Access</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          You don&apos;t have permission to view any sections. Contact the super admin.
        </p>
      </div>
    </div>
  );
}
