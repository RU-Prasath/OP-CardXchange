import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { adminApi } from "../../services/api";
import { formatDate } from "../../utils/helpers";

const STATUS_OPTIONS = ["new", "read", "replied", "closed"];
const STATUS_COLORS = { new: "text-gold bg-gold/10", read: "text-blue-400 bg-blue-400/10", replied: "text-green-400 bg-green-400/10", closed: "text-silver/50 bg-white/5" };

export default function EnquiriesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["contacts", search, statusFilter],
    queryFn: () => adminApi.getContacts({ search, status: statusFilter }),
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => adminApi.updateContact(id, { status }),
    onSuccess: () => { queryClient.invalidateQueries(["contacts"]); toast.success("Status updated"); },
  });

  const { mutate: deleteEnquiry } = useMutation({
    mutationFn: (id) => adminApi.deleteContact(id),
    onSuccess: () => { queryClient.invalidateQueries(["contacts"]); setSelected(null); toast.success("Deleted"); },
  });

  const contacts = data?.data?.contacts || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white mb-1">Enquiries</h1>
        <p className="text-silver/40 text-sm">Contact form submissions from the website</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search enquiries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-dark max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-dark w-auto"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#0a0e17] border border-white/5 p-4 animate-pulse">
                <div className="h-4 bg-white/5 rounded mb-2 w-32" />
                <div className="h-3 bg-white/5 rounded w-48" />
              </div>
            ))
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 text-silver/30">No enquiries found</div>
          ) : contacts.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelected(c)}
              className={`bg-[#0a0e17] border p-4 cursor-pointer transition-all ${selected?._id === c._id ? "border-gold/40" : "border-white/5 hover:border-white/10"}`}
            >
              <div className="flex items-start justify-between mb-1">
                <p className="text-white text-sm font-medium">{c.name}</p>
                <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${STATUS_COLORS[c.status]}`}>{c.status}</span>
              </div>
              <p className="text-silver/40 text-xs truncate">{c.message}</p>
              <p className="text-silver/20 text-[10px] mt-2">{formatDate(c.createdAt)}</p>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
              <div
                key={selected._id}
                className="bg-[#0a0e17] border border-white/5 p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-display text-xl text-white">{selected.name}</h3>
                    <p className="text-silver/40 text-xs mt-1">{formatDate(selected.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => { if (confirm("Delete?")) deleteEnquiry(selected._id); }}
                    className="text-red-400/50 hover:text-red-400 text-xs transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  {[["Email", selected.email], ["Phone", selected.phone]].map(([l, v]) => (
                    <div key={l} className="flex gap-4">
                      <span className="text-silver/30 text-xs w-16 uppercase tracking-widest shrink-0">{l}</span>
                      <span className="text-white text-sm">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-charcoal/30 border border-white/5 p-4 mb-6">
                  <p className="text-silver/30 text-xs uppercase tracking-widest mb-2">Message</p>
                  <p className="text-silver/70 text-sm leading-relaxed">{selected.message}</p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-silver/40 text-xs">Status:</label>
                  <select
                    value={selected.status}
                    onChange={(e) => { updateStatus({ id: selected._id, status: e.target.value }); setSelected({ ...selected, status: e.target.value }); }}
                    className="input-dark w-auto py-2"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <a
                    href={`mailto:${selected.email}?subject=Re: Your enquiry at Skyrise Build & Interiors`}
                    className="btn-outline text-xs py-2 px-4"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-[#0a0e17] border border-white/5 p-12 text-center text-silver/30 text-sm">
                Select an enquiry to view details
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
