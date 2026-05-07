import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');
  if (session.role === 'superadmin') redirect('/super-admin');

  return (
    <AdminShell role="user" userEmail={session.email} username={session.username}>
      {children}
    </AdminShell>
  );
}
