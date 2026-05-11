import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { adminApi } from "../../services/api";

function ServiceForm({ service, onClose, onSave }) {
  const [form, setForm] = useState({
    title: service?.title || "",
    shortDescription: service?.shortDescription || "",
    description: service?.description || "",
    features: service?.features?.join("\n") || "",
    icon: service?.icon || "",
    order: service?.order || 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error("Title required");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("shortDescription", form.shortDescription);
      fd.append("description", form.description);
      fd.append("features", JSON.stringify(form.features.split("\n").filter(Boolean)));
      fd.append("icon", form.icon);
      fd.append("order", form.order.toString());
      if (imageFile) fd.append("image", imageFile);
      if (heroFile) fd.append("heroImage", heroFile);

      if (service?._id) {
        await adminApi.updateService(service._id, fd);
        toast.success("Service updated");
      } else {
        await adminApi.createService(fd);
        toast.success("Service created");
      }
      onSave();
    } catch { toast.error("Failed to save"); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#0a0e17] border border-white/10 overflow-y-auto max-h-[90vh]">
        <div className="h-0.5 bg-gold-gradient" />
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-display text-xl text-white">{service ? "Edit Service" : "Add Service"}</h3>
          <button onClick={onClose} className="text-silver/40 hover:text-white text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-dark" />
          </div>
          <div>
            <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Short Description</label>
            <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="input-dark" />
          </div>
          <div>
            <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Full Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input-dark resize-none" />
          </div>
          <div>
            <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Features (one per line)</label>
            <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={4} className="input-dark resize-none font-mono text-xs" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Card Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-silver/50 text-xs w-full" />
              {service?.image && <img src={service.image} className="h-10 mt-1 object-cover" />}
            </div>
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Hero Image</label>
              <input type="file" accept="image/*" onChange={(e) => setHeroFile(e.target.files[0])} className="text-silver/50 text-xs w-full" />
            </div>
          </div>
          <div>
            <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Display Order</label>
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="input-dark" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary text-xs py-2.5 px-6 disabled:opacity-60">
              {loading ? "Saving..." : service ? "Update" : "Create"}
            </button>
            <button type="button" onClick={onClose} className="btn-outline text-xs py-2.5 px-6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["admin-services"], queryFn: () => adminApi.getServices() });
  const { mutate: deleteService } = useMutation({
    mutationFn: (id) => adminApi.deleteService(id),
    onSuccess: () => { queryClient.invalidateQueries(["admin-services"]); toast.success("Deleted"); },
  });

  const services = data?.data?.services || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Services</h1>
          <p className="text-silver/40 text-sm">{services.length} services</p>
        </div>
        <button onClick={() => { setEditService(null); setShowForm(true); }} className="btn-primary text-xs py-2.5 px-5">+ Add Service</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service._id} className="bg-[#0a0e17] border border-white/5 p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-medium text-sm">{service.title}</h3>
                <span className="text-silver/20 text-xs">#{service.order}</span>
              </div>
              <p className="text-silver/40 text-xs mb-4">{service.shortDescription}</p>
              {service.features?.length > 0 && (
                <p className="text-silver/20 text-xs mb-3">{service.features.length} features</p>
              )}
              <div className="flex gap-3">
                <button onClick={() => { setEditService(service); setShowForm(true); }} className="text-gold/50 hover:text-gold text-xs transition-colors">Edit</button>
                <button onClick={() => { if (confirm("Delete?")) deleteService(service._id); }} className="text-red-400/50 hover:text-red-400 text-xs transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
          <ServiceForm
            service={editService}
            onClose={() => { setShowForm(false); setEditService(null); }}
            onSave={() => { setShowForm(false); setEditService(null); queryClient.invalidateQueries(["admin-services"]); }}
          />
        )}
    </div>
  );
}
