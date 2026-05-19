import { useState, useEffect } from "react";
import {
  Activity,
  Upload,
  Download,
  Share2,
  Trash2,
  UserPlus,
  LogIn,
  Key,
  AlertCircle,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { auditService } from "../services/auditService.js";
import { formatDate } from "../utils/formatters.js";

const ACTION_CONFIG = {
  REGISTER: { icon: UserPlus, color: "text-blue-400", bg: "bg-blue-500/10" },
  LOGIN: { icon: LogIn, color: "text-green-400", bg: "bg-green-500/10" },
  PASSWORD_RECOVERY: { icon: Key, color: "text-amber-400", bg: "bg-amber-500/10" },
  FILE_UPLOAD: { icon: Upload, color: "text-blue-400", bg: "bg-blue-500/10" },
  FILE_DOWNLOAD: { icon: Download, color: "text-purple-400", bg: "bg-purple-500/10" },
  FILE_DELETE: { icon: Trash2, color: "text-red-400", bg: "bg-red-500/10" },
  FILE_SHARE: { icon: Share2, color: "text-green-400", bg: "bg-green-500/10" },
  SHARE_REVOKE: { icon: X, color: "text-orange-400", bg: "bg-orange-500/10" },
  FAILED_DOWNLOAD: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
  FAILED_LOGIN: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
  FAILED_SHARE: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
};

const FILTERS = [
  { value: "", label: "All activity" },
  { value: "FILE_UPLOAD", label: "Uploads" },
  { value: "FILE_DOWNLOAD", label: "Downloads" },
  { value: "FILE_SHARE", label: "Shares" },
  { value: "FILE_DELETE", label: "Deletions" },
  { value: "LOGIN", label: "Logins" },
];

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [total, setTotal] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = filter ? { action: filter, limit: 100 } : { limit: 100 };
      const { logs, total } = await auditService.getMyLogs(params);
      setLogs(logs);
      setTotal(total);
    } catch (error) {
      toast.error("Failed to load activity log");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Activity log</h2>
            <p className="text-xs text-slate-400">
              {total} {total === 1 ? "event" : "events"} recorded
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs */}
      <div className="p-5">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading activity...
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {logs.map((log) => {
              const config = ACTION_CONFIG[log.action] || {
                icon: Activity,
                color: "text-slate-400",
                bg: "bg-slate-700/30",
              };
              const Icon = config.icon;
              const isFailure = log.status === "FAILURE";

              return (
                <div
                  key={log._id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition ${
                    isFailure
                      ? "bg-red-500/5 border border-red-500/10"
                      : "bg-slate-800/50 hover:bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}
                  >
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{log.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>{formatDate(log.createdAt)}</span>
                      {log.ipAddress && log.ipAddress !== "unknown" && (
                        <>
                          <span>•</span>
                          <span className="font-mono">{log.ipAddress}</span>
                        </>
                      )}
                      {isFailure && (
                        <>
                          <span>•</span>
                          <span className="text-red-400">Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;