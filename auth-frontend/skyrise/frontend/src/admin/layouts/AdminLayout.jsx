import { useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard, Target, Mail, Building2, Settings, Star,
  Users, Image, Wrench, LogOut, Menu, ExternalLink
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/admin/leads", label: "Leads", Icon: Target },
  { to: "/admin/enquiries", label: "Enquiries", Icon: Mail },
  { to: "/admin/projects", label: "Projects", Icon: Building2 },
  { to: "/admin/services", label: "Services", Icon: Settings },
  { to: "/admin/testimonials", label: "Testimonials", Icon: Star },
  { to: "/admin/team", label: "Team", Icon: Users },
  { to: "/admin/gallery", label: "Gallery", Icon: Image },
  { to: "/admin/settings", label: "Settings", Icon: Wrench },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-[#030506] overflow-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-40 h-full w-64 bg-[#070a10] border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="inline-block" target="_blank">
            <div className="font-display text-xl font-semibold text-white tracking-wider">
              SKY<span className="text-gold">RISE</span>
            </div>
            <div className="text-silver/30 text-[9px] tracking-[0.35em] uppercase">Admin Panel</div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold">
              {admin?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{admin?.name}</p>
              <p className="text-silver/30 text-[10px] truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-silver/50 hover:text-red-400 text-xs tracking-widest uppercase transition-colors flex items-center gap-2"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-[#070a10] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-silver/50 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <Link to="/" target="_blank" className="text-gold text-xs tracking-widest uppercase hover:text-gold-light transition-colors">
            View Site ↗
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
