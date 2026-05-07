import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import '@/lib/models/Template';
import { User as UserIcon, Mail, Calendar, Layers } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  await dbConnect();
  const user = await User.findById(session.userId).populate('allocatedTemplate', 'name category slug');
  if (!user) redirect('/login');

  const template = user.allocatedTemplate as { name: string; category: string; slug: string } | null;

  const fields = [
    { label: 'Email address', value: user.email, icon: <Mail size={15}/> },
    { label: 'Username', value: user.username, icon: <UserIcon size={15}/> },
    { label: 'Portfolio URL', value: `/portfolio/${user.username}`, icon: <Layers size={15}/> },
    { label: 'Member since', value: new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: <Calendar size={15}/> },
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Profile</h1>
        <p className="text-sm text-white/40">Your account details.</p>
      </div>

      {/* Avatar card */}
      <div className="card-panel p-6 flex items-center gap-5 mb-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-[#0A0D14] shrink-0"
          style={{ background: 'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)' }}>
          {user.email[0].toUpperCase()}
        </div>
        <div>
          <div className="font-bold text-lg">{user.username}</div>
          <div className="text-sm text-white/40 font-mono">{user.email}</div>
          {template && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-mono capitalize">
              {template.name} · {template.category}
            </div>
          )}
        </div>
      </div>

      {/* Info fields */}
      <div className="card-panel divide-y divide-white/[0.05]">
        {fields.map(f => (
          <div key={f.label} className="flex items-center gap-4 px-6 py-4">
            <div className="w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.03] flex items-center justify-center text-white/30 shrink-0">
              {f.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-white/30 font-mono uppercase tracking-wider mb-0.5">{f.label}</div>
              <div className="text-sm text-white/80 font-mono truncate">{f.value}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-white/20 mt-5 text-center">To change your email or username, contact your administrator.</p>
    </div>
  );
}
