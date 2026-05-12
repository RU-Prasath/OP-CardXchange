import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { adminApi } from "../../services/api";
import ImageUploadField from "../components/ImageUploadField";

function TestimonialForm({ item, onClose, onSave }) {
  const [form, setForm] = useState({ name: item?.name||"", designation: item?.designation||"", location: item?.location||"", message: item?.message||"", rating: item?.rating||5, order: item?.order||0 });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(item?.image || null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return toast.error("Name and message required");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v.toString()));
      if (imageFile) fd.append("image", imageFile);
      if (item?._id) { await adminApi.updateTestimonial(item._id, fd); toast.success("Updated"); }
      else { await adminApi.createTestimonial(fd); toast.success("Created"); }
      onSave();
    } catch { toast.error("Failed"); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0a0e17] border border-white/10 overflow-y-auto max-h-[90vh]">
        <div className="h-0.5 bg-gold-gradient" />
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-display text-xl text-white">{item ? "Edit Testimonial" : "Add Testimonial"}</h3>
          <button onClick={onClose} className="text-silver/40 hover:text-white text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Name *</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-dark" />
            </div>
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Designation</label>
              <input value={form.designation} onChange={(e) => setForm({...form, designation: e.target.value})} className="input-dark" />
            </div>
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Location</label>
              <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} className="input-dark" />
            </div>
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Rating (1-5)</label>
              <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({...form, rating: e.target.value})} className="input-dark" />
            </div>
          </div>
          <div>
            <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Message *</label>
            <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={4} className="input-dark resize-none" />
          </div>
          <div>
            <ImageUploadField
              label="Photo"
              recommended="200×200px (1:1 square)"
              recWidth={200} recHeight={200}
              maxMB={2}
              preview={imagePreview}
              aspectClass="aspect-square w-20"
              onChange={(file, url) => { setImageFile(file); setImagePreview(url); }}
              onClear={() => { setImageFile(null); setImagePreview(null); }}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary text-xs py-2.5 px-6 disabled:opacity-60">{loading ? "Saving..." : item ? "Update" : "Create"}</button>
            <button type="button" onClick={onClose} className="btn-outline text-xs py-2.5 px-6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["admin-testimonials"], queryFn: () => adminApi.getTestimonials() });
  const { mutate: deleteT } = useMutation({
    mutationFn: (id) => adminApi.deleteTestimonial(id),
    onSuccess: () => { queryClient.invalidateQueries(["admin-testimonials"]); toast.success("Deleted"); },
  });

  const testimonials = data?.data?.testimonials || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Testimonials</h1>
          <p className="text-silver/40 text-sm">{testimonials.length} testimonials</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="btn-primary text-xs py-2.5 px-5">+ Add</button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({length:3}).map((_,i) => <div key={i} className="h-24 bg-white/5 animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-[#0a0e17] border border-white/5 p-5 flex items-start gap-4">
              {t.image ? (
                <img src={t.image} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center text-gold text-sm font-bold shrink-0">{t.name[0]}</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-gold text-xs">{t.designation} {t.location && `· ${t.location}`}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gold text-xs">{Array.from({length: t.rating||5}).map((_,i)=><span key={i}>★</span>)}</div>
                </div>
                <p className="text-silver/50 text-xs mt-2 leading-relaxed line-clamp-2">"{t.message}"</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setEditItem(t); setShowForm(true); }} className="text-gold/50 hover:text-gold text-xs transition-colors">Edit</button>
                <button onClick={() => { if(confirm("Delete?")) deleteT(t._id); }} className="text-red-400/50 hover:text-red-400 text-xs transition-colors">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
          <TestimonialForm
            item={editItem}
            onClose={() => { setShowForm(false); setEditItem(null); }}
            onSave={() => { setShowForm(false); setEditItem(null); queryClient.invalidateQueries(["admin-testimonials"]); }}
          />
        )}
    </div>
  );
}
