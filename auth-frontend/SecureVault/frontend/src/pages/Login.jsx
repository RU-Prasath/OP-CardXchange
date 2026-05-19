import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import ParticlesBackground from "../components/ParticlesBackground.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Particles background */}
      <ParticlesBackground color="#3b82f6" particleCount={70} />

      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl mb-4 shadow-xl shadow-blue-500/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              SecureVault
            </h1>
            <p className="text-slate-400 mt-2 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              End-to-end encrypted file storage
            </p>
          </div>

          {/* Login form */}
          <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
            <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-blue-500/60 to-transparent" />

            <h2 className="text-2xl font-semibold text-white mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Sign in to access your encrypted vault.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-11 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                    placeholder="Enter your password"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative flex items-center justify-center gap-2 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                New here?
              </span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <Link
              to="/register"
              className="block w-full text-center py-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium rounded-xl transition-all"
            >
              Create an account
            </Link>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Protected with AES-256-GCM + RSA-2048 hybrid encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
