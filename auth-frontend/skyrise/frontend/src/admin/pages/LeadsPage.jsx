import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApi } from "../../services/api";
import { formatDate, downloadCSV } from "../../utils/helpers";

const STATUS_OPTIONS = ["new", "contacted", "converted", "lost"];
const STATUS_COLORS = { new: "text-gold bg-gold/10", contacted: "text-blue-400 bg-blue-400/10", converted: "text-green-400 bg-green-400/10", lost: "text-red-400 bg-red-400/10" };

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["leads", page, search, statusFilter],
    queryFn: () => adminApi.getLeads({ page, limit: 20, search, status: statusFilter }),
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => adminApi.updateLead(id, { status }),
    onSuccess: () => { queryClient.invalidateQueries(["leads"]); toast.success("Status updated"); },
  });

  const { mutate: deleteLead } = useMutation({
    mutationFn: (id) => adminApi.deleteLead(id),
    onSuccess: () => { queryClient.invalidateQueries(["leads"]); toast.success("Lead deleted"); },
  });

  const handleExport = async () => {
    try {
      const { data: blob } = await adminApi.exportLeads();
      downloadCSV(blob, "skyrise-leads.csv");
    } catch { toast.error("Export failed"); }
  };

  const leads = data?.data?.leads || [];
  const total = data?.data?.total || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Leads</h1>
          <p className="text-silver/40 text-sm">{total} total leads from website popup</p>
        </div>
        <button onClick={handleExport} className="btn-outline text-xs py-2.5 px-5">Export CSV</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-dark max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-dark w-auto pr-8"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0a0e17] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Name", "Email", "Phone", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left text-silver/30 text-[10px] tracking-widest uppercase px-4 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-3 bg-white/5 rounded w-24" /></td>
                    ))}
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-silver/30">No leads found</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-white text-sm font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-silver/50 text-xs">{lead.email}</td>
                  <td className="px-4 py-3 text-silver/50 text-xs">{lead.phone}</td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus({ id: lead._id, status: e.target.value })}
                      className={`text-[10px] tracking-widest uppercase px-2 py-1 border-0 bg-transparent cursor-pointer ${STATUS_COLORS[lead.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-[#0a0e17] text-white">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-silver/30 text-xs">{formatDate(lead.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { if (confirm("Delete this lead?")) deleteLead(lead._id); }}
                      className="text-red-400/50 hover:text-red-400 text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(total / 20) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 text-xs border transition-all ${page === i + 1 ? "border-gold bg-gold text-black" : "border-white/10 text-silver/50 hover:border-gold/40"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
