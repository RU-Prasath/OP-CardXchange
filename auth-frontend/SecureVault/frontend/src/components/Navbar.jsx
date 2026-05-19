import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, User, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      setShowLogoutModal(false);
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                SecureVault
              </span>
            </Link>

            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-semibold text-white shadow-md">
                    {user.name?.charAt(0).toUpperCase() || (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium bg-slate-800 hover:bg-red-500/15 border border-slate-700 hover:border-red-500/40 text-white hover:text-red-300 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => !loggingOut && setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sign out?"
        description="You'll need to enter your password again next time to decrypt your files."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        variant="warning"
        icon={LogOut}
        loading={loggingOut}
      />
    </>
  );
};

export default Navbar;
