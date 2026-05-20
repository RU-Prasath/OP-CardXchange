import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { EyeOff, Eye, History, ArrowRight, Shield, Lock } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const cards = [
    {
      title: "Hide Image",
      description:
        "Encrypt a secret image with AES-256 and embed it invisibly inside a cover image using LSB steganography.",
      icon: EyeOff,
      to: "/hide",
      gradient: "from-violet-600 to-indigo-600",
      glow: "group-hover:shadow-violet-500/20",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
      badge: "AES-256",
      badgeColor: "bg-violet-500/10 text-violet-300 border-violet-500/15",
    },
    {
      title: "Reveal Image",
      description:
        "Extract and decrypt a secret image from a stego image. You'll need the original passphrase.",
      icon: Eye,
      to: "/reveal",
      gradient: "from-cyan-600 to-teal-600",
      glow: "group-hover:shadow-cyan-500/20",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
      badge: "PBKDF2",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/15",
    },
    {
      title: "History",
      description: "Browse all your past hide and reveal operations with metadata and quality metrics.",
      icon: History,
      to: "/history",
      gradient: "from-blue-600 to-indigo-600",
      glow: "group-hover:shadow-blue-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      badge: "Audit log",
      badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/15",
    },
  ];

  return (
    <div>
      {/* Hero section */}
      <div className="relative mb-10 p-8 rounded-2xl bg-linear-to-br from-slate-900 to-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-600/8 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-start justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-400">
                <Shield className="w-3 h-3" />
                Secure Steganography Platform
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name}
            </h1>
            <p className="text-slate-400 mt-2 max-w-lg text-sm">
              Hide secret images inside other images using AES-256 encryption and LSB steganography — invisible to the naked eye.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-center min-w-[80px]">
              <p className="text-xl font-bold text-white">256</p>
              <p className="text-xs text-slate-500 mt-0.5">bit AES</p>
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-center min-w-[80px]">
              <Lock className="w-4 h-4 text-violet-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Encrypted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.to}
              className={`group relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 overflow-hidden shadow-lg hover:shadow-xl ${card.glow}`}
            >
              <div className={`absolute inset-0 bg-linear-to-br ${card.gradient} opacity-0 group-hover:opacity-[0.04] rounded-2xl`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                  {card.title}
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transform" />
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* How it works */}
      <div className="mt-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
        <h2 className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-widest">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Upload images", desc: "Choose a cover image and the secret image you want to hide." },
            { step: "02", title: "Set passphrase", desc: "A passphrase derives the AES-256 key via PBKDF2 key stretching." },
            { step: "03", title: "Download stego", desc: "The output PNG is visually identical to the cover image." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="text-xs font-mono font-bold text-violet-500 mt-0.5 shrink-0">{item.step}</span>
              <div>
                <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
