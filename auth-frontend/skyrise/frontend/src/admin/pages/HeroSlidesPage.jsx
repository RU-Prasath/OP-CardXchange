import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApi } from "../../services/api";
import { Plus, Trash2, Edit2, Image } from "lucide-react";
import ImageUploadField from "../components/ImageUploadField";

const EMPTY_FORM = { heading: "", subheading: "", ctaText: "Explore Our Works", ctaLink: "/works", order: 0, active: true };

export default function HeroSlidesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: () => adminApi.getHeroSlides(),
  });

  const { mutate: saveSlide, isPending: saving } = useMutation({
    mutationFn: (fd) => editingSlide ? adminApi.updateHeroSlide(editingSlide._id, fd) : adminApi.createHeroSlide(fd),
    onSuccess: () => {
      queryClient.invalidateQueries(["hero-slides"]);
      toast.success(editingSlide ? "Slide updated" : "Slide created");
      resetForm();
    },
    onError: () => toast.error("Save failed"),
  });

  const { mutate: deleteSlide } = useMutation({
    mutationFn: (id) => adminApi.deleteHeroSlide(id),
    onSuccess: () => { queryClient.invalidateQueries(["hero-slides"]); toast.success("Slide deleted"); },
  });

  const { mutate: toggleActive } = useMutation({
    mutationFn: ({ id, active }) => {
      const fd = new FormData();
      fd.append("active", String(active));
      return adminApi.updateHeroSlide(id, fd);
    },
    onSuccess: () => queryClient.invalidateQueries(["hero-slides"]),
  });

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingSlide(null);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(false);
  };

  const openEdit = (slide) => {
    setEditingSlide(slide);
    setForm({
      heading: slide.heading || "",
      subheading: slide.subheading || "",
      ctaText: slide.ctaText || "Explore Our Works",
      ctaLink: slide.ctaLink || "/works",
      order: slide.order || 0,
      active: slide.active,
    });
    setImagePreview(slide.image || null);
    setImageFile(null);
    setShowForm(true);
  };

const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.heading.trim()) return toast.error("Heading is required");
    if (!editingSlide && !imageFile) return toast.error("Please upload a background image");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (imageFile) fd.append("image", imageFile);
    saveSlide(fd);
  };

  const slides = data?.data?.slides || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Hero Slides</h1>
          <p className="text-silver/40 text-sm">Manage homepage hero section background images and content</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2">
          <Plus size={14} /> Add Slide
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#0a0e17] border border-white/10 p-6 mb-8">
          <div className="h-0.5 bg-gold-gradient w-12 mb-5" />
          <h3 className="font-display text-xl text-white mb-6">{editingSlide ? "Edit Slide" : "New Slide"}</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image */}
            <div>
              <label className="text-silver/40 text-xs uppercase tracking-widest block mb-2">Background Image {!editingSlide && "*"}</label>
              <ImageUploadField
                label=""
                recommended="1920×1080px (16:9)"
                recWidth={1920} recHeight={1080}
                maxMB={10}
                preview={imagePreview}
                aspectClass="aspect-video"
                onChange={(file, url) => { setImageFile(file); setImagePreview(url); }}
                onClear={() => { setImageFile(null); setImagePreview(null); }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-silver/40 text-xs uppercase tracking-widest block mb-2">Heading *</label>
                <input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} className="input-dark" placeholder="Building Spaces That Inspire..." />
              </div>
              <div>
                <label className="text-silver/40 text-xs uppercase tracking-widest block mb-2">Subheading</label>
                <input value={form.subheading} onChange={(e) => setForm({ ...form, subheading: e.target.value })} className="input-dark" placeholder="Tagline or description" />
              </div>
              <div>
                <label className="text-silver/40 text-xs uppercase tracking-widest block mb-2">CTA Button Text</label>
                <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className="input-dark" />
              </div>
              <div>
                <label className="text-silver/40 text-xs uppercase tracking-widest block mb-2">CTA Link</label>
                <input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} className="input-dark" placeholder="/works" />
              </div>
              <div>
                <label className="text-silver/40 text-xs uppercase tracking-widest block mb-2">Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="input-dark" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-gold" />
                <label htmlFor="active" className="text-silver/60 text-sm">Active (visible on site)</label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary text-xs py-2.5 px-6 disabled:opacity-60">
                {saving ? "Saving..." : editingSlide ? "Update Slide" : "Create Slide"}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline text-xs py-2.5 px-6">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Slides List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#0a0e17] border border-white/5 h-24 animate-pulse" />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10">
          <Image size={40} className="mx-auto mb-3 opacity-20 text-silver" />
          <p className="text-silver/30 mb-4">No slides yet. Add your first hero slide.</p>
          <button onClick={() => setShowForm(true)} className="btn-outline text-xs py-2 px-5">Add Slide</button>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, i) => (
            <div key={slide._id} className={`bg-[#0a0e17] border flex gap-4 overflow-hidden transition-all ${slide.active ? "border-white/5" : "border-white/5 opacity-50"}`}>
              <div className="w-40 shrink-0 aspect-video bg-navy">
                {slide.image ? (
                  <img src={slide.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={24} className="opacity-20 text-silver" />
                  </div>
                )}
              </div>
              <div className="flex-1 py-4 pr-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-silver/30 text-xs">#{i + 1}</span>
                      {!slide.active && <span className="text-[10px] border border-white/10 text-silver/30 px-2 py-0.5 uppercase tracking-widest">Hidden</span>}
                    </div>
                    <h4 className="text-white font-medium text-sm mb-1">{slide.heading}</h4>
                    {slide.subheading && <p className="text-silver/40 text-xs mb-2 line-clamp-1">{slide.subheading}</p>}
                    <p className="text-gold text-xs">{slide.ctaText} → {slide.ctaLink}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive({ id: slide._id, active: !slide.active })}
                      className={`text-xs px-3 py-1.5 border transition-all ${slide.active ? "border-green-500/30 text-green-400 hover:bg-green-500/10" : "border-white/10 text-silver/40 hover:border-white/20"}`}
                    >
                      {slide.active ? "Active" : "Inactive"}
                    </button>
                    <button onClick={() => openEdit(slide)} className="p-2 text-silver/40 hover:text-gold transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => { if (confirm("Delete slide?")) deleteSlide(slide._id); }} className="p-2 text-silver/40 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
