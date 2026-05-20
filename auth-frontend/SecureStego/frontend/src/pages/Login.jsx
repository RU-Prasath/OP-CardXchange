import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/errors.js";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      toast.error(getErrorMessage(error, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-slate-900 to-slate-950 items-center justify-center p-12">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-violet-600 to-indigo-600 rounded-3xl mb-8 shadow-2xl shadow-violet-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            Hide secrets in plain sight
          </h2>
          <p className="text-slate-400 leading-relaxed">
            AES-256 encryption combined with LSB steganography to embed secret images invisibly inside cover images.
          </p>

          <div className="mt-10 space-y-3 text-left">
            {[
              { label: "AES-256 Encryption", desc: "Military-grade key derivation via PBKDF2" },
              { label: "LSB Steganography", desc: "Pixel-level embedding, invisible to the eye" },
              { label: "Full Operation History", desc: "Track every hide and reveal operation" },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
                <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">{f.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-violet-600 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-violet-500/25">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">SecureStego</h1>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1.5">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
