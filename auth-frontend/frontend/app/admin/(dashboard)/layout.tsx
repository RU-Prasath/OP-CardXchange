import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJWT } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';
import { connectDB } from '@/lib/db';
import Content from '@/lib/models/Content';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const token = cookies().get('portfolio_session')?.value;
    if (!token) return { title: 'Portfolio Admin' };
    const session = verifyJWT(token);
    if (!session) return { title: 'Portfolio Admin' };
    await connectDB();
    const userEmail = session.isSuperAdmin ? '' : session.email;
    const hero = await Content.findOne({ section: 'hero', userEmail });
    const name = (hero?.data as { name?: string } | undefined)?.name;
    return { title: name ? `${name} — Admin` : 'Portfolio Admin' };
  } catch {
    return { title: 'Portfolio Admin' };
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('portfolio_session')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const session = verifyJWT(token);
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div data-theme="light" style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', color: '#0f172a' }}>
      <Sidebar
        visibleScreens={session.permissions.visibleScreens}
        isSuperAdmin={session.isSuperAdmin}
        email={session.email}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top header bar */}
        <header style={{
          height: '56px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
            }} />
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              Portfolio Admin
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </header>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
