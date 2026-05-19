import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Key,
  Lock,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../services/authService.js";
import ParticlesBackground from "../components/ParticlesBackground.jsx";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    recoveryKey: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(
        formData.email,
        formData.recoveryKey,
        formData.newPassword
      );
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Recovery failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950">
        <ParticlesBackground color="#10b981" particleCount={60} />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-600/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-xl shadow-green-500/30">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Password reset successfully
              </h2>
              <p className="text-slate-400 mb-6">
                Your password has been reset. All your files remain accessible
                with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30"
              >
                Continue to login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <ParticlesBackground color="#f59e0b" particleCount={70} />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-amber-500 to-amber-700 rounded-2xl mb-4 shadow-xl shadow-amber-500/30">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Recover account
            </h1>
            <p className="text-slate-400 mt-2">
              Use your recovery key to reset your password
            </p>
          </div>

          <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
            <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-amber-500/60 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Recovery key
                </label>
                <div className="relative group">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type="text"
                    name="recoveryKey"
                    value={formData.recoveryKey}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 font-mono tracking-wider transition-all"
                    placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  The 24-character key you saved during registration
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type={showPwd ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-11 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showPwd ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm new password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-600/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Recovering...
                  </>
                ) : (
                  "Reset password"
                )}
              </button>
            </form>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white mt-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
