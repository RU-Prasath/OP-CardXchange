import { EyeOff, Eye, Activity, AlertCircle } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color = "violet" }) => {
  const colorClasses = {
    violet: { bg: "bg-violet-500/10", text: "text-violet-400" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
    red: { bg: "bg-red-500/10", text: "text-red-400" },
  }[color];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-colors">
      <div className={`w-9 h-9 rounded-xl ${colorClasses.bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-4 h-4 ${colorClasses.text}`} />
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
    </div>
  );
};

const HistoryStats = ({ items }) => {
  const total = items.length;
  const hideCount = items.filter((e) => e.operation === "HIDE").length;
  const revealCount = items.filter((e) => e.operation === "REVEAL").length;
  const failCount = items.filter((e) => !e.success).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard icon={Activity} label="Total operations" value={total} color="blue" />
      <StatCard icon={EyeOff} label="Hide operations" value={hideCount} color="violet" />
      <StatCard icon={Eye} label="Reveal operations" value={revealCount} color="cyan" />
      <StatCard icon={AlertCircle} label="Failed attempts" value={failCount} color="red" />
    </div>
  );
};

export default HistoryStats;
