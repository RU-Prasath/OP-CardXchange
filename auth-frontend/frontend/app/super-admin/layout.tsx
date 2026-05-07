import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') redirect('/login');

  return (
    <AdminShell role="superadmin" userEmail={session.email} username={session.username}>
      {children}
    </AdminShell>
  );
}
