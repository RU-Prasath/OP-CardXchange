import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Portfolio from '@/lib/models/Portfolio';
import SiteSettings from '@/lib/models/SiteSettings';
import '@/lib/models/Template'; // register schema for populate
import { ExternalLink, Edit3, Eye, Layers, Clock, AlertTriangle } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  await dbConnect();
  const [user, portfolio, settings] = await Promise.all([
    User.findById(session.userId).populate('allocatedTemplate', 'name category slug'),
    Portfolio.findOne({ user: session.userId }),
    SiteSettings.findOne(),
  ]);

  if (!user) redirect('/login');

  const template = user.allocatedTemplate as { name: string; category: string; slug: string } | null;

  // Plan expiry calculation
  function getRemainingDays(): number | null {
    if (!user || (user.plan || 'free') !== 'paid' || !user.planStartDate) return null;
    const durationDays = user.planBilling === 'yearly' ? 365 : 30;
    const expiry = new Date(user.planStartDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
    return Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  }
  const remaining = getRemainingDays();
  const contactPhone = settings?.contactPhone || '';

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
          {/* Plan expiry banner */}
          {remaining !== null && remaining <= 7 && (
            <div className={`card-panel p-4 flex items-center gap-3 border ${remaining <= 3 ? 'border-red-500/50 bg-red-500/5' : 'border-amber-500/40 bg-amber-500/5'}`}>
              {remaining <= 3 ? <AlertTriangle size={18} className="text-red-400 shrink-0"/> : <Clock size={18} className="text-amber-400 shrink-0"/>}
              <div className="flex-1">
                <p className={`text-sm font-semibold ${remaining <= 3 ? 'text-red-300' : 'text-amber-300'}`}>
                  {remaining === 0 ? 'Your plan has expired' : `Your plan expires in ${remaining} day${remaining === 1 ? '' : 's'}`}
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  Please renew your portfolio by contacting admin{contactPhone ? ` at ${contactPhone}` : ''}.
                </p>
              </div>
              <span className={`text-2xl font-bold font-mono shrink-0 ${remaining <= 3 ? 'text-red-400' : 'text-amber-400'}`}>{remaining}d</span>
            </div>
          )}
          {remaining !== null && remaining > 7 && (
            <div className="card-panel p-4 flex items-center gap-3">
              <Clock size={16} className="text-cyan-400 shrink-0"/>
              <div>
                <p className="text-sm text-white/70">Plan active · <span className="text-white font-semibold">{remaining} days</span> remaining</p>
                <p className="text-xs text-white/30 mt-0.5 capitalize">{user.planBilling || 'monthly'} · {user.plan} plan</p>
              </div>
            </div>
          )}
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
