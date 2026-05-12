import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApi } from "../../services/api";
import { Building, AlertTriangle, Info } from "lucide-react";
import ImageUploadField from "../components/ImageUploadField";

const CATEGORIES = ["completed", "ongoing", "interior", "elevation"];

function ProjectForm({ project, onClose, onSave }) {
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    category: project?.category || "completed",
    location: project?.location || "",
    area: project?.area || "",
    year: project?.year || new Date().getFullYear().toString(),
    client: project?.client || "",
    featured: project?.featured || false,
    order: project?.order || 0,
  });
  const [coverFile, setCoverFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [coverPreview, setCoverPreview] = useState(project?.coverImage || null);
  const [galleryPreviews, setGalleryPreviews] = useState(project?.images || []);
  const [removedExistingImages, setRemovedExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) return toast.error("Title and category required");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v.toString()));
      if (coverFile) fd.append("coverImage", coverFile);
      imageFiles.forEach((f) => fd.append("images", f));

      if (project?._id) {
        await adminApi.updateProject(project._id, fd);
        toast.success("Project updated");
      } else {
        await adminApi.createProject(fd);
        toast.success("Project created");
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0a0e17] border border-white/10 overflow-y-auto max-h-[90vh]">
        <div className="h-0.5 bg-gold-gradient" />
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-display text-xl text-white">{project ? "Edit Project" : "Add Project"}</h3>
          <button onClick={onClose} className="text-silver/40 hover:text-white text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-dark" placeholder="Project title" />
            </div>
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-dark w-full">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-dark" placeholder="City, State" />
            </div>
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Area</label>
              <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input-dark" placeholder="e.g. 2400 sq.ft" />
            </div>
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Year</label>
              <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="input-dark" />
            </div>
            <div className="col-span-2">
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-dark resize-none" />
            </div>
            <div className="col-span-2">
              <ImageUploadField
                label="Cover Image"
                recommended="1920×1080px (16:9) or 1200×800px (3:2)"
                recWidth={1920} recHeight={1080}
                maxMB={5}
                preview={coverPreview}
                aspectClass="aspect-video"
                onChange={(file, url) => { setCoverFile(file); setCoverPreview(url); }}
                onClear={() => { setCoverFile(null); setCoverPreview(null); }}
              />
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-1.5 mb-2">
                <Info size={11} className="text-gold/60 shrink-0" />
                <p className="text-silver/40 text-[11px]">Gallery Images — Recommended: <span className="text-gold/70">1200×800px (3:2)</span>. Max 5 MB each.</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = [...e.target.files];
                  const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
                  if (oversized.length) { toast.error(`${oversized.length} file(s) exceed 5 MB and were skipped.`); }
                  setImageFiles(files.filter(f => f.size <= 5 * 1024 * 1024));
                }}
                className="text-silver/50 text-xs w-full file:mr-3 file:py-1.5 file:px-3 file:border file:border-gold/30 file:bg-gold/10 file:text-gold file:text-xs file:cursor-pointer hover:file:bg-gold/20 file:transition-colors"
              />
              {/* Existing gallery images */}
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {galleryPreviews.map((url, idx) => (
                    <div key={idx} className="relative aspect-square overflow-hidden border border-white/10">
                      <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setRemovedExistingImages(prev => [...prev, url]);
                          setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 text-white/70 hover:text-white flex items-center justify-center text-xs leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* New file previews */}
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className="relative aspect-square overflow-hidden border border-gold/20">
                      <img src={URL.createObjectURL(file)} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 text-white/70 hover:text-white flex items-center justify-center text-xs leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-gold" />
              <label htmlFor="featured" className="text-silver/60 text-sm">Featured on homepage</label>
            </div>
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="input-dark" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary text-xs py-2.5 px-6 disabled:opacity-60">
              {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
            </button>
            <button type="button" onClick={onClose} className="btn-outline text-xs py-2.5 px-6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-projects", categoryFilter],
    queryFn: () => adminApi.getProjects(categoryFilter ? { category: categoryFilter } : {}),
  });

  const { mutate: deleteProject } = useMutation({
    mutationFn: (id) => adminApi.deleteProject(id),
    onSuccess: () => { queryClient.invalidateQueries(["admin-projects"]); toast.success("Project deleted"); },
  });

  const projects = data?.data?.projects || [];

  const handleSave = () => {
    setShowForm(false);
    setEditProject(null);
    queryClient.invalidateQueries(["admin-projects"]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Projects</h1>
          <p className="text-silver/40 text-sm">{projects.length} projects in portfolio</p>
        </div>
        <button onClick={() => { setEditProject(null); setShowForm(true); }} className="btn-primary text-xs py-2.5 px-5">
          + Add Project
        </button>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        {["", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`text-xs tracking-widest uppercase px-4 py-1.5 border transition-all ${categoryFilter === c ? "border-gold bg-gold text-black" : "border-white/10 text-silver/50 hover:border-gold/40"}`}
          >
            {c || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-video bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-[#0a0e17] border border-white/5 overflow-hidden group">
              <div className="relative aspect-video bg-navy">
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Building size={32} className="opacity-10 text-silver" /></div>
                )}
                {project.featured && (
                  <div className="absolute top-2 right-2 bg-gold text-black text-[9px] tracking-widest uppercase px-2 py-0.5">Featured</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{project.title}</p>
                    <p className="text-gold text-[10px] tracking-widest uppercase mt-0.5">{project.category}</p>
                    {project.location && <p className="text-silver/30 text-xs mt-0.5">{project.location}</p>}
                  </div>
                  <div className="flex gap-2 ml-2 shrink-0">
                    <button onClick={() => { setEditProject(project); setShowForm(true); }} className="text-gold/50 hover:text-gold text-xs transition-colors">Edit</button>
                    <button onClick={() => { if (confirm("Delete project?")) deleteProject(project._id); }} className="text-red-400/50 hover:text-red-400 text-xs transition-colors">Del</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
          <ProjectForm
            project={editProject}
            onClose={() => { setShowForm(false); setEditProject(null); }}
            onSave={handleSave}
          />
        )}
    </div>
  );
}
