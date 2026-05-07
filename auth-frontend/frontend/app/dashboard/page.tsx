import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Portfolio from '@/lib/models/Portfolio';
import '@/lib/models/Template'; // register schema for populate
import { ExternalLink, Edit3, Eye, Layers } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  await dbConnect();
  const user = await User.findById(session.userId).populate('allocatedTemplate', 'name category slug');
  const portfolio = await Portfolio.findOne({ user: session.userId });

  if (!user) redirect('/login');

  const template = user.allocatedTemplate as { name: string; category: string; slug: string } | null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Overview</h1>
        <p className="text-sm text-white/40">Manage and publish your portfolio.</p>
      </div>

      {!template ? (
        <div className="card-panel p-12 text-center">
          <Layers size={32} className="text-white/20 mx-auto mb-4"/>
          <h2 className="font-semibold mb-2">No template allocated</h2>
          <p className="text-sm text-white/40 max-w-sm mx-auto">Contact your administrator to allocate a portfolio template to your account.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Portfolio card */}
          <div className="card-panel p-6 flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{background:'linear-gradient(135deg,rgba(34,211,238,0.2),rgba(168,85,247,0.2))'}}>🎨</div>
              <div>
                <div className="font-semibold mb-0.5">{template.name} Template</div>
                <div className="text-sm text-white/40 font-mono capitalize">{template.category} · /{session.username}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/editor" className="btn-secondary-ff text-sm px-4 py-2 flex items-center gap-2"><Edit3 size={13}/> Edit content</Link>
              <Link href={`/portfolio/${session.username}`} target="_blank" className="btn-grad text-sm px-4 py-2 flex items-center gap-2"><ExternalLink size={13}/> View live</Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Status', value: portfolio?.isPublished ? 'Live' : 'Draft', color: portfolio?.isPublished ? 'text-emerald-400' : 'text-amber-400' },
              { label: 'Template', value: template.name, color: 'text-white' },
              { label: 'URL', value: `/${session.username}`, color: 'text-cyan-400' },
              { label: 'Category', value: template.category, color: 'text-violet-400' },
            ].map(s => (
              <div key={s.label} className="card-panel p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/30 mb-2">{s.label}</div>
                <div className={`text-sm font-semibold font-mono capitalize ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className="card-panel p-6">
            <h2 className="font-semibold mb-4">Quick actions</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { label: 'Edit portfolio content', desc: 'Update your bio, projects, and skills', href: '/dashboard/editor', icon: <Edit3 size={16}/> },
                { label: 'View live portfolio', desc: 'See how visitors see your portfolio', href: `//portfolio/${session.username}`, icon: <Eye size={16}/>, target: '_blank' },
                { label: 'Analytics', desc: 'Traffic, referrers and page views', href: '/dashboard/analytics', icon: <Layers size={16}/> },
              ].map(a => (
                <Link key={a.label} href={a.href} className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all group">
                  <div className="w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.04] flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400/10 transition-colors shrink-0">{a.icon}</div>
                  <div>
                    <div className="text-sm font-medium mb-0.5">{a.label}</div>
                    <div className="text-xs text-white/30">{a.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
