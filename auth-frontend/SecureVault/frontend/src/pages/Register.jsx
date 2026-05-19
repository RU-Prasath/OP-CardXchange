import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  User,
  Mail,
  Lock,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { authService } from "../services/authService.js";
import RecoveryKeyModal from "../components/RecoveryKeyModal.jsx";
import ParticlesBackground from "../components/ParticlesBackground.jsx";

const Register = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register(
        formData.name,
        formData.email,
        formData.password
      );

      localStorage.setItem("securevault_token", data.token);
      setRegisteredEmail(data.user.email);
      setRecoveryKey(data.recoveryKey);

      sessionStorage.setItem("pending_user", JSON.stringify(data.user));

      toast.success("Account created! Save your recovery key.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryAcknowledged = () => {
    const pendingUser = JSON.parse(sessionStorage.getItem("pending_user"));
    setUser(pendingUser);
    sessionStorage.removeItem("pending_user");
    navigate("/dashboard");
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-slate-950">
        <ParticlesBackground color="#6366f1" particleCount={70} />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-500 to-blue-700 rounded-2xl mb-4 shadow-xl shadow-indigo-500/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                SecureVault
              </h1>
              <p className="text-slate-400 mt-2 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Create your encrypted vault
              </p>
            </div>

            <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
              <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-indigo-500/60 to-transparent" />

              <h2 className="text-2xl font-semibold text-white mb-1">
                Create account
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Files are encrypted on your device before upload.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-11 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-11 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <KeyRound className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-200/90 leading-relaxed">
                    After registration, you'll receive a recovery key. Save it
                    safely — it's the only way to recover your account if you
                    forget your password.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative flex items-center justify-center gap-2 py-3 bg-linear-to-r from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-400 mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <p className="text-center text-xs text-slate-500 mt-6">
              Protected with AES-256-GCM + RSA-2048 hybrid encryption
            </p>
          </div>
        </div>
      </div>

      {recoveryKey && (
        <RecoveryKeyModal
          recoveryKey={recoveryKey}
          userEmail={registeredEmail}
          onContinue={handleRecoveryAcknowledged}
        />
      )}
    </>
  );
};

export default Register;
