import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { adminApi } from "../../services/api";

function TeamForm({ member, onClose, onSave }) {
  const [form, setForm] = useState({ name: member?.name||"", designation: member?.designation||"", bio: member?.bio||"", linkedin: member?.linkedin||"", order: member?.order||0 });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.designation) return toast.error("Name and designation required");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v.toString()));
      if (imageFile) fd.append("image", imageFile);
      if (member?._id) { await adminApi.updateTeamMember(member._id, fd); toast.success("Updated"); }
      else { await adminApi.createTeamMember(fd); toast.success("Created"); }
      onSave();
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0a0e17] border border-white/10 overflow-y-auto max-h-[90vh]">
        <div className="h-0.5 bg-gold-gradient" />
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-display text-xl text-white">{member ? "Edit Member" : "Add Team Member"}</h3>
          <button onClick={onClose} className="text-silver/40 hover:text-white text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {[["Name *", "name", "text"], ["Designation *", "designation", "text"], ["LinkedIn URL", "linkedin", "text"]].map(([label, key, type]) => (
            <div key={key}>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm({...form, [key]: e.target.value})} className="input-dark" />
            </div>
          ))}
          <div>
            <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} rows={3} className="input-dark resize-none" />
          </div>
          <div>
            <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-silver/50 text-xs w-full" />
            {member?.image && <img src={member.image} className="h-12 w-12 mt-1 rounded-full object-cover" />}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary text-xs py-2.5 px-6 disabled:opacity-60">{loading ? "Saving..." : member ? "Update" : "Create"}</button>
            <button type="button" onClick={onClose} className="btn-outline text-xs py-2.5 px-6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [showForm, setShowForm] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["admin-team"], queryFn: () => adminApi.getTeam() });
  const { mutate: deleteMember } = useMutation({
    mutationFn: (id) => adminApi.deleteTeamMember(id),
    onSuccess: () => { queryClient.invalidateQueries(["admin-team"]); toast.success("Deleted"); },
  });

  const team = data?.data?.team || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Team</h1>
          <p className="text-silver/40 text-sm">{team.length} team members</p>
        </div>
        <button onClick={() => { setEditMember(null); setShowForm(true); }} className="btn-primary text-xs py-2.5 px-5">+ Add Member</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({length:4}).map((_,i) => <div key={i} className="h-48 bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((member) => (
            <div key={member._id} className="bg-[#0a0e17] border border-white/5 p-4 text-center">
              {member.image ? (
                <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
              ) : (
                <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 text-gold font-bold text-xl">{member.name[0]}</div>
              )}
              <p className="text-white text-sm font-medium mb-0.5">{member.name}</p>
              <p className="text-gold text-xs mb-4">{member.designation}</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => { setEditMember(member); setShowForm(true); }} className="text-gold/50 hover:text-gold text-xs transition-colors">Edit</button>
                <button onClick={() => { if(confirm("Delete?")) deleteMember(member._id); }} className="text-red-400/50 hover:text-red-400 text-xs transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
          <TeamForm
            member={editMember}
            onClose={() => { setShowForm(false); setEditMember(null); }}
            onSave={() => { setShowForm(false); setEditMember(null); queryClient.invalidateQueries(["admin-team"]); }}
          />
        )}
    </div>
  );
}
