import { useState, useEffect } from "react";
import {
  Files,
  HardDrive,
  Share2,
  Activity,
  TrendingUp,
  Shield,
} from "lucide-react";
import { fileService } from "../services/fileService.js";
import { auditService } from "../services/auditService.js";
import { formatFileSize } from "../utils/formatters.js";

const StatCard = ({ icon: Icon, label, value, subtext, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400",
    purple: "bg-purple-500/10 text-purple-400",
    amber: "bg-amber-500/10 text-amber-400",
    pink: "bg-pink-500/10 text-pink-400",
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 shadow-lg shadow-black/10">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ring-inset ring-white/5 ${colorClasses[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-sm text-slate-300 mt-0.5 font-medium">{label}</p>
        {subtext && (
          <p className="text-xs text-slate-500 mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );
};

const TypeBreakdownBar = ({ typeBreakdown, total }) => {
  if (total === 0) return null;

  const colors = {
    Images: "bg-blue-500",
    Videos: "bg-purple-500",
    Audio: "bg-pink-500",
    PDFs: "bg-red-500",
    Documents: "bg-indigo-500",
    Spreadsheets: "bg-green-500",
    Text: "bg-amber-500",
    Archives: "bg-orange-500",
    Other: "bg-slate-500",
  };

  const entries = Object.entries(typeBreakdown).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-5 shadow-lg shadow-black/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <Files className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">
            File type breakdown
          </h3>
          <p className="text-xs text-slate-400">By category</p>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="flex w-full h-2.5 rounded-full overflow-hidden bg-slate-800 mb-4">
        {entries.map(([type, count]) => (
          <div
            key={type}
            className={`${colors[type] || "bg-slate-500"}`}
            style={{ width: `${(count / total) * 100}%` }}
            title={`${type}: ${count}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {entries.map(([type, count]) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-sm ${
                colors[type] || "bg-slate-500"
              }`}
            />
            <span className="text-slate-300 flex-1">{type}</span>
            <span className="text-slate-500 font-medium">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsDashboard = ({ refreshTrigger }) => {
  const [stats, setStats] = useState(null);
  const [auditStats, setAuditStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [fileData, auditData] = await Promise.all([
        fileService.getStats(),
        auditService.getStats(),
      ]);
      setStats(fileData.stats);
      setAuditStats(auditData.stats);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-32 animate-pulse"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 mb-3" />
            <div className="h-6 bg-slate-800 rounded w-1/2 mb-2" />
            <div className="h-3 bg-slate-800 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  const totalTypes = Object.values(stats.typeBreakdown).reduce(
    (a, b) => a + b,
    0
  );
  const hasFiles = stats.totalFiles > 0;

  return (
    <div className="mb-6 space-y-4">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Files}
          label="Total files"
          value={stats.totalFiles}
          subtext={
            stats.recentUploads > 0
              ? `+${stats.recentUploads} this week`
              : "No recent uploads"
          }
          color="blue"
        />
        <StatCard
          icon={HardDrive}
          label="Encrypted storage"
          value={formatFileSize(stats.totalEncryptedSize)}
          subtext={
            hasFiles ? `Avg ${formatFileSize(stats.avgFileSize)}/file` : "—"
          }
          color="purple"
        />
        <StatCard
          icon={Share2}
          label="Sharing"
          value={stats.activeShares + stats.sharedWithMe}
          subtext={`${stats.activeShares} shared by you · ${stats.sharedWithMe} with you`}
          color="green"
        />
        <StatCard
          icon={Activity}
          label="Activity"
          value={auditStats?.last30Days || 0}
          subtext={`Last 30 days · ${auditStats?.total || 0} all-time`}
          color="amber"
        />
      </div>

      {/* Detail row — type breakdown + security badge */}
      {hasFiles && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <TypeBreakdownBar
              typeBreakdown={stats.typeBreakdown}
              total={totalTypes}
            />
          </div>

          <div className="bg-linear-to-br from-slate-900 to-slate-900 border border-blue-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Security status
                </h3>
                <p className="text-xs text-green-400">All files encrypted</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Encryption</span>
                <span className="text-slate-200 font-medium">AES-256-GCM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Key wrapping</span>
                <span className="text-slate-200 font-medium">RSA-2048</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Key derivation</span>
                <span className="text-slate-200 font-medium">PBKDF2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Integrity</span>
                <span className="text-slate-200 font-medium">SHA-256</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDashboard;