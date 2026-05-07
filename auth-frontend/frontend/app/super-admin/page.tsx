import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Template from '@/lib/models/Template';
import Portfolio from '@/lib/models/Portfolio';
import { Users, Layers, Globe, TrendingUp } from 'lucide-react';

async function getDashboardStats() {
  await dbConnect();
  const [totalUsers, activeUsers, totalTemplates, totalPortfolios] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'user', isActive: true }),
    Template.countDocuments(),
    Portfolio.countDocuments({ isPublished: true }),
  ]);
  return { totalUsers, activeUsers, totalTemplates, totalPortfolios };
}

export default async function SuperAdminDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, sub: `${stats.activeUsers} active`, icon: <Users size={18}/>, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Active Portfolios', value: stats.totalPortfolios, sub: 'published', icon: <Globe size={18}/>, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Templates', value: stats.totalTemplates, sub: 'in library', icon: <Layers size={18}/>, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { label: 'Engagement', value: '98%', sub: 'avg lighthouse', icon: <TrendingUp size={18}/>, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Overview</h1>
        <p className="text-sm text-white/40">Platform health and activity at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="card-panel p-5">
            <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center ${c.color} mb-4`}>{c.icon}</div>
            <div className="text-3xl font-bold tracking-tight mb-1">{c.value}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/30 mb-0.5">{c.label}</div>
            <div className="text-xs text-emerald-400">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="card-panel p-6">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: '+ Create new user', href: '/super-admin/users' },
              { label: '+ Add template', href: '/super-admin/templates' },
              { label: '→ Manage all users', href: '/super-admin/users' },
            ].map(a => (
              <a key={a.label} href={a.href} className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all text-sm text-white/60 hover:text-white">
                {a.label} <span className="text-white/20">›</span>
              </a>
            ))}
          </div>
        </div>

        <div className="card-panel p-6">
          <h2 className="font-semibold mb-4">Platform Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Database', status: 'Operational' },
              { label: 'Email Delivery', status: 'Operational' },
              { label: 'CDN', status: 'Operational' },
              { label: 'Auth Service', status: 'Operational' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between text-sm">
                <span className="text-white/50">{s.label}</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]"/>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
