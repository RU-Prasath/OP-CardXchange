import { useState, useEffect, useMemo } from "react";
import {
  History as HistoryIcon,
  RefreshCw,
  Filter,
  Inbox,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { historyService } from "../services/historyService.js";
import { getErrorMessage } from "../utils/errors.js";
import HistoryEntry from "../components/HistoryEntry.jsx";
import HistoryStats from "../components/HistoryStats.jsx";

const FILTERS = [
  { value: "all", label: "All operations" },
  { value: "HIDE", label: "Hide only" },
  { value: "REVEAL", label: "Reveal only" },
  { value: "success", label: "Successful" },
  { value: "failed", label: "Failed" },
];

const History = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchHistory = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const data = await historyService.getHistory(100);
      setItems(data.items || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load history"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredItems = useMemo(() => {
    switch (filter) {
      case "HIDE":
        return items.filter((e) => e.operation === "HIDE");
      case "REVEAL":
        return items.filter((e) => e.operation === "REVEAL");
      case "success":
        return items.filter((e) => e.success);
      case "failed":
        return items.filter((e) => !e.success);
      default:
        return items;
    }
  }, [items, filter]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <HistoryIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">History</h1>
            <p className="text-slate-400 text-sm mt-0.5">All your past hide and reveal operations, newest first.</p>
          </div>
        </div>

        <button
          onClick={() => fetchHistory(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300 rounded-xl font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p className="text-sm">Loading history...</p>
        </div>
      ) : (
        <>
          {items.length > 0 && (
            <div className="mb-6">
              <HistoryStats items={items} />
            </div>
          )}

          {/* Filter bar */}
          {items.length > 0 && (
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {FILTERS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="text-slate-300 font-semibold">{filteredItems.length}</span>{" "}
                of {items.length} operations
              </p>
            </div>
          )}

          {/* List or empty state */}
          {items.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl mb-4">
                <Inbox className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">No operations yet</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                When you hide or reveal images, your activity will appear here.
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl mb-3">
                <Filter className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">No matching operations</h3>
              <p className="text-xs text-slate-500">Try a different filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((entry) => (
                <HistoryEntry key={entry._id} entry={entry} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
