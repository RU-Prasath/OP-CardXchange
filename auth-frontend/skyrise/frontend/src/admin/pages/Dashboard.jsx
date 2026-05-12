import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminApi } from "../../services/api";
import { formatDate } from "../../utils/helpers";
import { Target, Sparkles, Mail, Building2 } from "lucide-react";
import DbStorageWidget from "../components/DbStorageWidget";

function StatCard({ label, value, Icon, link, color = "gold" }) {
  return (
    <div className="bg-[#0a0e17] border border-white/5 p-6 hover:border-gold/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="text-gold"><Icon size={22} /></div>
        {link && <Link to={link} className="text-gold text-xs tracking-widest uppercase hover:underline">View →</Link>}
      </div>
      <div className="text-3xl font-display font-semibold text-gold mb-1">{value ?? "—"}</div>
      <div className="text-silver/40 text-xs tracking-widest uppercase">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => adminApi.getDashboard(),
    refetchInterval: 60000,
  });

  const stats = data?.data?.stats || {};
  const recentLeads = data?.data?.recentLeads || [];
  const recentEnquiries = data?.data?.recentEnquiries || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white mb-1">Dashboard</h1>
        <p className="text-silver/40 text-sm">Overview of Skyrise Build & Interiors</p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#0a0e17] border border-white/5 p-6 animate-pulse">
              <div className="h-8 bg-white/5 rounded mb-2 w-16" />
              <div className="h-3 bg-white/5 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Leads" value={stats.totalLeads} Icon={Target} link="/admin/leads" />
          <StatCard label="New Leads" value={stats.newLeads} Icon={Sparkles} link="/admin/leads" />
          <StatCard label="Enquiries" value={stats.totalEnquiries} Icon={Mail} link="/admin/enquiries" />
          <StatCard label="Projects" value={stats.totalProjects} Icon={Building2} link="/admin/projects" />
        </div>
      )}

      {/* DB Storage */}
      <div className="mb-6">
        <DbStorageWidget />
      </div>

      {/* Recent Data */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-[#0a0e17] border border-white/5">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Recent Leads</h3>
            <Link to="/admin/leads" className="text-gold text-xs hover:underline">View All →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentLeads.length === 0 ? (
              <p className="p-6 text-silver/30 text-sm text-center">No leads yet</p>
            ) : recentLeads.map((lead) => (
              <div key={lead._id} className="p-4 hover:bg-white/2 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{lead.name}</p>
                    <p className="text-silver/40 text-xs">{lead.phone} · {lead.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${lead.status === "new" ? "bg-gold/10 text-gold" : "bg-white/5 text-silver/40"}`}>
                      {lead.status}
                    </span>
                    <p className="text-silver/30 text-[10px] mt-1">{formatDate(lead.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-[#0a0e17] border border-white/5">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Recent Enquiries</h3>
            <Link to="/admin/enquiries" className="text-gold text-xs hover:underline">View All →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentEnquiries.length === 0 ? (
              <p className="p-6 text-silver/30 text-sm text-center">No enquiries yet</p>
            ) : recentEnquiries.map((enq) => (
              <div key={enq._id} className="p-4 hover:bg-white/2 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{enq.name}</p>
                    <p className="text-silver/40 text-xs truncate max-w-[180px]">{enq.message}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${enq.status === "new" ? "bg-gold/10 text-gold" : "bg-white/5 text-silver/40"}`}>
                      {enq.status}
                    </span>
                    <p className="text-silver/30 text-[10px] mt-1">{formatDate(enq.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
