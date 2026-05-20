import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, LogOut, User, EyeOff, History as HistoryIcon, LayoutDashboard, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/hide", label: "Hide", icon: EyeOff },
    { to: "/reveal", label: "Reveal", icon: Eye },
    { to: "/history", label: "History", icon: HistoryIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40">
                <Shield className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-white tracking-tight">SecureStego</span>
                <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Steganography</span>
              </div>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-slate-800 text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* User section */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-slate-300 font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
