import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApi } from "../../services/api";
import { Info } from "lucide-react";

const CATEGORIES = ["projects", "interior", "elevation", "construction"];

export default function GalleryPage() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-gallery", categoryFilter],
    queryFn: () => adminApi.getGallery(categoryFilter ? { category: categoryFilter } : {}),
  });

  const { mutate: deleteItem } = useMutation({
    mutationFn: (id) => adminApi.deleteGalleryItem(id),
    onSuccess: () => { queryClient.invalidateQueries(["admin-gallery"]); toast.success("Deleted"); },
  });

  const handleUpload = async (e) => {
    const allFiles = [...e.target.files];
    if (!allFiles.length) return;
    const oversized = allFiles.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length) toast.error(`${oversized.length} file(s) exceed 5 MB and were skipped.`);
    const files = allFiles.filter(f => f.size <= 5 * 1024 * 1024);
    if (!files.length) { e.target.value = ""; return; }
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
        fd.append("category", "all");
        await adminApi.addGalleryItem(fd);
      }
      queryClient.invalidateQueries(["admin-gallery"]);
      toast.success(`${files.length} image(s) uploaded`);
    } catch { toast.error("Upload failed"); } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const gallery = data?.data?.gallery || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Gallery</h1>
          <p className="text-silver/40 text-sm">{gallery.length} images</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <label className={`btn-primary text-xs py-2.5 px-5 cursor-pointer ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}>
            {uploading ? "Uploading..." : "+ Upload Images"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
          <div className="flex items-center gap-1">
            <Info size={10} className="text-gold/50" />
            <p className="text-silver/30 text-[10px]">Recommended: 800×800px (1:1). Max 5 MB each.</p>
          </div>
        </div>
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
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({length:12}).map((_,i) => <div key={i} className="aspect-square bg-white/5 animate-pulse" />)}
        </div>
      ) : gallery.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10">
          <p className="text-silver/30 mb-3">No images in gallery</p>
          <label className="btn-outline text-xs py-2 px-4 cursor-pointer">
            Upload First Image
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {gallery.map((item) => (
            <div key={item._id} className="relative aspect-square group">
              <img src={item.image} alt={item.title || ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => { if(confirm("Delete this image?")) deleteItem(item._id); }}
                  className="bg-red-500/80 text-white text-xs px-3 py-1.5 hover:bg-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-silver/50 text-[9px] uppercase tracking-widest truncate">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
