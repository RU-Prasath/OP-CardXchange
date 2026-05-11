import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminApi } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("All fields required");
    setLoading(true);
    try {
      const { data } = await adminApi.login(form);
      login(data.token, data.admin);
      toast.success(`Welcome back, ${data.admin.name}!`);
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030506] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-display text-3xl font-semibold text-white tracking-wider mb-1">
            SKY<span className="text-gold">RISE</span>
          </div>
          <div className="text-silver/30 text-[10px] tracking-[0.4em] uppercase">Admin Panel</div>
        </div>

        {/* Form Card */}
        <div className="bg-[#0a0e17] border border-white/8 p-8">
          <div className="h-0.5 bg-gold-gradient w-full -mt-8 mb-8" />
          <h2 className="font-display text-xl text-white mb-1">Sign In</h2>
          <p className="text-silver/40 text-xs mb-8">Enter your admin credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-silver/40 text-xs tracking-widest uppercase block mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@skyrisebuild.com"
                className="input-dark"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-silver/40 text-xs tracking-widest uppercase block mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input-dark"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border border-black/30 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-silver/20 text-xs mt-6">
          © {new Date().getFullYear()} Skyrise Build & Interiors
        </p>
      </div>
    </div>
  );
}
