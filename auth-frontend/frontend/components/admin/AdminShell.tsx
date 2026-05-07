'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Layers, Globe, Settings, LogOut, ChevronLeft, ChevronRight, User, DollarSign, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem { label: string; href: string; icon: React.ReactNode; }

interface Props {
  children: React.ReactNode;
  role: 'superadmin' | 'user';
  userEmail: string;
  username: string;
}

const superAdminNav: NavItem[] = [
  { label: 'Overview', href: '/super-admin', icon: <LayoutDashboard size={15}/> },
  { label: 'Users', href: '/super-admin/users', icon: <Users size={15}/> },
  { label: 'Templates', href: '/super-admin/templates', icon: <Layers size={15}/> },
  { label: 'Pricing', href: '/super-admin/pricing', icon: <DollarSign size={15}/> },
  { label: 'Testimonials', href: '/super-admin/testimonials', icon: <Star size={15}/> },
  { label: 'Settings', href: '/super-admin/settings', icon: <Settings size={15}/> },
];

const userNav: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard size={15}/> },
  { label: 'Editor', href: '/dashboard/editor', icon: <Layers size={15}/> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User size={15}/> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={15}/> },
];

export default function AdminShell({ children, role, userEmail, username }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const nav = role === 'superadmin' ? superAdminNav : userNav;

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div className="flex min-h-screen bg-[#0A0D14]">
      {/* Sidebar */}
      <aside className={cn('flex flex-col border-r border-white/[0.07] bg-black/20 transition-all duration-200', collapsed ? 'w-16' : 'w-[220px]')}>
        {/* Brand */}
        <div className={cn('flex items-center gap-2.5 p-4 border-b border-white/[0.07]', collapsed && 'justify-center')}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-[12px] text-[#0A0D14] shrink-0" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>F</div>
          {!collapsed && (
            <div>
              <div className="font-bold text-sm">Folioforge</div>
              <div className="font-mono text-[10px] text-white/30">{role === 'superadmin' ? 'Super Admin' : 'Dashboard'}</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 mt-2">
          {nav.map(item => {
            const active = pathname === item.href || (item.href !== '/super-admin' && item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={cn('flex items-center gap-2.5 px-2.5 py-1.5 rounded-[7px] text-sm font-medium transition-all',
                  collapsed ? 'justify-center' : '',
                  active ? 'bg-white/[0.05] text-white border border-white/[0.07]' : 'text-white/40 hover:text-white hover:bg-white/[0.04]'
                )}>
                <span className={active ? 'text-cyan-400' : ''}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-2 border-t border-white/[0.07] space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] mb-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs text-[#0A0D14] shrink-0" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>
                {userEmail[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate">{username}</div>
                <div className="font-mono text-[10px] text-white/30 truncate">{role === 'superadmin' ? 'PRO · Admin' : 'PRO · user'}</div>
              </div>
            </div>
          )}
          <button onClick={logout} className={cn('flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-[7px] text-sm text-white/30 hover:text-red-400 transition-all', collapsed && 'justify-center')}>
            <LogOut size={14}/>{!collapsed && 'Sign out'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)} className="absolute top-20 -right-3 w-6 h-6 rounded-full bg-[#11151F] border border-white/[0.12] flex items-center justify-center text-white/40 hover:text-white transition-all z-10">
          {collapsed ? <ChevronRight size={12}/> : <ChevronLeft size={12}/>}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-white/[0.07] flex items-center justify-between px-6 bg-black/10 shrink-0">
          <div className="font-mono text-xs text-white/30 flex items-center gap-2">
            <Globe size={12}/>
            <Link href="/" className="hover:text-white/60 transition-colors">folioforge.com</Link>
          </div>
          <div className="text-xs text-white/20 font-mono">v2.4 · {role === 'superadmin' ? 'Super Admin' : 'User'}</div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
