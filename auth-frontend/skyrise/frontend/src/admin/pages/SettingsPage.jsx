import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApi } from "../../services/api";
import ImageUploadField from "../components/ImageUploadField";

const SECTIONS = [
  { key: "general", label: "General", fields: [
    { key: "site_name", label: "Site Name" },
    { key: "site_tagline", label: "Tagline" },
    { key: "hero_heading", label: "Hero Heading", multiline: true },
    { key: "hero_subheading", label: "Hero Subheading" },
  ]},
  { key: "stats", label: "Statistics", fields: [
    { key: "stat_projects", label: "Projects Count (e.g. 500+)" },
    { key: "stat_years", label: "Years Experience (e.g. 15+)" },
    { key: "stat_clients", label: "Happy Clients (e.g. 450+)" },
    { key: "stat_awards", label: "Awards Won (e.g. 20+)" },
  ]},
  { key: "contact", label: "Contact Info", fields: [
    { key: "phone", label: "Phone Number" },
    { key: "whatsapp", label: "WhatsApp Number (with country code, no +)" },
    { key: "email", label: "Email Address" },
    { key: "address", label: "Address", multiline: true },
    { key: "business_hours", label: "Business Hours" },
    { key: "map_embed", label: "Google Maps Embed URL", multiline: true },
  ]},
  { key: "social", label: "Social Media", fields: [
    { key: "instagram", label: "Instagram URL" },
    { key: "facebook", label: "Facebook URL" },
    { key: "youtube", label: "YouTube URL" },
  ]},
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [formData, setFormData] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [aboutImagePreview, setAboutImagePreview] = useState(null);
  const [aboutImageUploading, setAboutImageUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery({ queryKey: ["admin-settings"], queryFn: () => adminApi.getSettings() });

  useEffect(() => {
    if (data?.data?.settings) {
      setFormData(data.data.settings);
    }
  }, [data]);

  const { mutate: saveSettings, isPending } = useMutation({
    mutationFn: (settings) => adminApi.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries(["settings"]);
      toast.success("Settings saved successfully");
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const currentSection = SECTIONS.find((s) => s.key === activeSection);

  const handleSave = () => {
    const settingsArray = Object.entries(formData).map(([key, value]) => ({
      key,
      value,
      group: SECTIONS.find((s) => s.fields.some((f) => f.key === key))?.key || "general",
    }));
    saveSettings(settingsArray);
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setLogoUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", logoFile);
      await adminApi.uploadLogo(fd);
      toast.success("Logo uploaded successfully");
      setLogoFile(null);
    } catch { toast.error("Logo upload failed"); } finally { setLogoUploading(false); }
  };

  const handleAboutImageUpload = async () => {
    if (!aboutImageFile) return;
    setAboutImageUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", aboutImageFile);
      await adminApi.uploadAboutImage(fd);
      queryClient.invalidateQueries(["settings"]);
      toast.success("About image uploaded");
      setAboutImageFile(null);
    } catch { toast.error("Upload failed"); } finally { setAboutImageUploading(false); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white mb-1">Settings</h1>
        <p className="text-silver/40 text-sm">Manage website content and configuration</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Section Nav */}
        <div className="lg:col-span-1">
          <div className="bg-[#0a0e17] border border-white/5 p-2">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`w-full text-left px-3 py-2.5 text-sm rounded transition-all ${
                  activeSection === s.key ? "bg-gold/10 text-gold" : "text-silver/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
            <button
              onClick={() => setActiveSection("logo")}
              className={`w-full text-left px-3 py-2.5 text-sm rounded transition-all ${
                activeSection === "logo" ? "bg-gold/10 text-gold" : "text-silver/50 hover:text-white hover:bg-white/5"
              }`}
            >
              Logo
            </button>
            <button
              onClick={() => setActiveSection("about")}
              className={`w-full text-left px-3 py-2.5 text-sm rounded transition-all ${
                activeSection === "about" ? "bg-gold/10 text-gold" : "text-silver/50 hover:text-white hover:bg-white/5"
              }`}
            >
              About Image
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-4 bg-[#0a0e17] border border-white/5 p-6">
          {activeSection === "about" ? (
            <div>
              <h3 className="font-display text-xl text-white mb-2">About Page Image</h3>
              <p className="text-silver/40 text-sm mb-6">This image appears in the "Who We Are" section on the About page.</p>
              {formData.about_image && !aboutImagePreview && (
                <div className="mb-4">
                  <p className="text-silver/40 text-xs mb-2 uppercase tracking-widest">Current Image</p>
                  <img src={formData.about_image} className="w-64 h-80 object-cover border border-white/10" alt="About" />
                </div>
              )}
              <div className="space-y-4 max-w-sm">
                <ImageUploadField
                  label="Upload New Image"
                  recommended="800×1000px (portrait 4:5)"
                  recWidth={800} recHeight={1000}
                  tolerance={0.3}
                  maxMB={10}
                  preview={aboutImagePreview}
                  aspectClass="aspect-[4/5] w-48"
                  onChange={(file, url) => { setAboutImageFile(file); setAboutImagePreview(url); }}
                  onClear={() => { setAboutImageFile(null); setAboutImagePreview(null); }}
                />
                <button
                  onClick={handleAboutImageUpload}
                  disabled={!aboutImageFile || aboutImageUploading}
                  className="btn-primary text-xs py-2.5 px-6 disabled:opacity-60"
                >
                  {aboutImageUploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>
            </div>
          ) : activeSection === "logo" ? (
            <div>
              <h3 className="font-display text-xl text-white mb-6">Logo Upload</h3>
              <div className="space-y-4 max-w-sm">
                <ImageUploadField
                  label="Upload New Logo"
                  recommended="200×200px (1:1 square, transparent PNG preferred)"
                  recWidth={200} recHeight={200}
                  tolerance={0.4}
                  maxMB={5}
                  preview={logoPreview}
                  aspectClass="aspect-square w-24"
                  onChange={(file, url) => { setLogoFile(file); setLogoPreview(url); }}
                  onClear={() => { setLogoFile(null); setLogoPreview(null); }}
                />
                <button
                  onClick={handleLogoUpload}
                  disabled={!logoFile || logoUploading}
                  className="btn-primary text-xs py-2.5 px-6 disabled:opacity-60"
                >
                  {logoUploading ? "Uploading..." : "Upload Logo"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-display text-xl text-white mb-6">{currentSection?.label}</h3>
              <div className="space-y-5">
                {currentSection?.fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-silver/40 text-xs uppercase tracking-widest block mb-1.5">{field.label}</label>
                    {field.multiline ? (
                      <textarea
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        rows={3}
                        className="input-dark resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field.key] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="input-dark"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <button onClick={handleSave} disabled={isPending} className="btn-primary text-xs py-2.5 px-8 disabled:opacity-60">
                  {isPending ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
