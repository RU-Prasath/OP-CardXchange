import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Building, MapPin } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { publicApi } from "../services/api";

const FILTERS = [
  { label: "All Works", value: "" },
  { label: "Completed", value: "completed" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Interior", value: "interior" },
  { label: "Elevation", value: "elevation" },
];

function ProjectCard({ project, onClick, index }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="relative overflow-hidden group cursor-pointer"
      onClick={() => onClick(project)}
    >
      <div className="aspect-[4/3] bg-navy">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building size={48} className="opacity-10 text-silver" />
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
        <span className="text-gold text-xs tracking-widest uppercase mb-1">{project.category}</span>
        <h3 className="font-display text-lg text-white">{project.title}</h3>
        {project.location && <p className="text-silver/60 text-xs mt-1 flex items-center gap-1"><MapPin size={11} className="text-gold shrink-0" />{project.location}</p>}
        <div className="mt-3 inline-flex items-center gap-2 text-gold text-xs">
          View Details
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>

      {/* Category badge */}
      <div className="absolute top-3 left-3">
        <span className="bg-black/60 backdrop-blur-sm text-gold text-[10px] tracking-widest uppercase px-2 py-1">
          {project.category}
        </span>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }) {
  if (!project) return null;
  const images = [project.coverImage, ...(project.images || [])].filter(Boolean);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl bg-navy border border-white/10 overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gold-gradient" />
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-silver/60 hover:text-white text-2xl leading-none">×</button>

        {project.coverImage && (
          <img src={project.coverImage} alt={project.title} className="w-full aspect-video object-cover" />
        )}

        <div className="p-8">
          <span className="text-gold text-xs tracking-widest uppercase">{project.category}</span>
          <h2 className="font-display text-3xl text-white mt-2 mb-1">{project.title}</h2>
          {project.location && <p className="text-silver/50 text-sm mb-4 flex items-center gap-1.5"><MapPin size={13} className="text-gold shrink-0" />{project.location}</p>}
          {project.description && <p className="text-silver/60 leading-relaxed mb-6">{project.description}</p>}

          <div className="grid grid-cols-3 gap-4 mb-6">
            {project.area && <div className="border border-white/5 p-3 text-center"><p className="text-gold text-sm font-semibold">{project.area}</p><p className="text-silver/40 text-xs">Area</p></div>}
            {project.year && <div className="border border-white/5 p-3 text-center"><p className="text-gold text-sm font-semibold">{project.year}</p><p className="text-silver/40 text-xs">Year</p></div>}
            {project.client && <div className="border border-white/5 p-3 text-center"><p className="text-gold text-sm font-semibold">{project.client}</p><p className="text-silver/40 text-xs">Client</p></div>}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {images.slice(1, 7).map((img, i) => (
                <img key={i} src={img} alt="" className="aspect-square object-cover" loading="lazy" />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Works() {
  const [activeFilter, setActiveFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [visibleProjects, setVisibleProjects] = useState(8);
  const [visibleGallery, setVisibleGallery] = useState(8);

  const { data, isLoading } = useQuery({
    queryKey: ["projects", activeFilter],
    queryFn: () => publicApi.getProjects(activeFilter ? { category: activeFilter } : {}),
    onSuccess: () => setVisibleProjects(8),
  });

  const { data: galleryData } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => publicApi.getGallery(),
  });

  const projects = data?.data?.projects || [];
  const gallery = galleryData?.data?.gallery || [];
  const lightboxSlides = gallery.map((g) => ({ src: g.image }));

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 50% 30%, #D4AF37 0%, transparent 60%)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-tag">Portfolio</p>
            <h1 className="heading-display text-white mb-4">
              Our <span className="text-gold">Works</span>
            </h1>
            <div className="gold-divider" />
            <p className="text-silver/50 max-w-xl leading-relaxed">
              A curated showcase of our premium construction and interior design projects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-black border-b border-white/5 sticky top-[57px] z-30 backdrop-blur-xl bg-black/95">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`text-xs tracking-widest uppercase px-5 py-2 border transition-all duration-200 ${
                  activeFilter === f.value
                    ? "border-gold bg-gold text-black"
                    : "border-white/10 text-silver/60 hover:border-gold/40 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <Building size={48} className="mx-auto mb-4 opacity-20 text-silver" />
              <p className="text-silver/40">No projects found in this category</p>
            </div>
          ) : (
            <>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {projects.slice(0, visibleProjects).map((project, i) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      index={i}
                      onClick={setSelectedProject}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
              {visibleProjects < projects.length && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setVisibleProjects((v) => v + 10)}
                    className="btn-outline text-xs py-3 px-8"
                  >
                    Show More ({projects.length - visibleProjects} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-16 bg-navy border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="section-tag mx-auto justify-center">Gallery</p>
              <h2 className="heading-section text-white">
                Project <span className="text-gold">Gallery</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.slice(0, visibleGallery).map((item, i) => (
                <motion.div
                  key={item._id}
                  className="aspect-square overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                >
                  <img
                    src={item.image}
                    alt={item.title || "Gallery"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
            {visibleGallery < gallery.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleGallery((v) => v + 10)}
                  className="btn-outline text-xs py-3 px-8"
                >
                  Show More ({gallery.length - visibleGallery} remaining)
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
      />
    </div>
  );
}
