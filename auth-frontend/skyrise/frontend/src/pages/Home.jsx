import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { publicApi } from "../services/api";
import {
  Home as HomeIcon, ClipboardList, HardHat, Sofa, KeyRound,
  PencilRuler, ChefHat, Sparkles, Star, Trophy, Gem, Clock,
  Wrench, Ruler, Handshake, Building, MapPin
} from "lucide-react";

// ── Hero ──────────────────────────────────────────────────────
function Hero({ settings }) {
  const { data: slidesData } = useQuery({
    queryKey: ["hero-slides-public"],
    queryFn: () => publicApi.getHeroSlides(),
    staleTime: 300000,
  });
  const slides = slidesData?.data?.slides || [];

  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = (idx) => {
    setFading(true);
    setTimeout(() => { setCurrent(idx); setFading(false); }, 400);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % slides.length;
        setFading(true);
        setTimeout(() => setFading(false), 400);
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[current] || null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image layer */}
      {slide?.image ? (
        <div
          key={current}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${fading ? "opacity-0" : "opacity-100"}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-black via-navy to-navy" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.15) 0%, transparent 60%)" }}
      />

      {/* Decorative gold lines */}
      <div className="absolute left-8 top-1/3 w-px h-32 bg-gradient-to-b from-transparent via-gold to-transparent opacity-30" />
      <div className="absolute right-8 bottom-1/3 w-px h-24 bg-gradient-to-b from-transparent via-gold to-transparent opacity-20" />

      <div className={`relative z-10 max-w-6xl mx-auto px-6 text-center transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
          <span className="inline-flex items-center gap-3 text-gold text-xs tracking-[0.5em] uppercase">
            <span className="w-12 h-px bg-gold/60" />
            Premium Construction & Interiors
            <span className="w-12 h-px bg-gold/60" />
          </span>
        </motion.div>

        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {slide?.heading ? (
            <span dangerouslySetInnerHTML={{ __html: slide.heading.replace(/\n/g, "<br/>") }} />
          ) : settings?.hero_heading ? (
            <span dangerouslySetInnerHTML={{ __html: settings.hero_heading.replace(/\n/g, "<br/>") }} />
          ) : (
            <>Building Spaces<br />That Inspire{" "}<span className="text-transparent bg-clip-text bg-gold-gradient text-shadow-gold">Excellence</span></>
          )}
        </motion.h1>

        <motion.p
          className="text-silver/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {slide?.subheading || settings?.hero_subheading || "Skyrise Build & Interiors — where architectural brilliance meets luxury craftsmanship"}
        </motion.p>

        <motion.div className="flex flex-wrap gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Link to={slide?.ctaLink || "/works"} className="btn-primary">
            {slide?.ctaText || "Explore Our Works"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
          <Link to="/contact" className="btn-outline">Get Free Quote</Link>
        </motion.div>
      </div>

      {/* Slide dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1 transition-all duration-300 ${i === current ? "w-8 bg-gold" : "w-3 bg-white/30 hover:bg-white/60"}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-9 border border-gold/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-gold rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

// ── Stats ──────────────────────────────────────────────────────
function Stats({ settings }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  const allStats = [
    { key: "stat_projects", label: "Projects Completed" },
    { key: "stat_years",    label: "Years Experience" },
    { key: "stat_clients",  label: "Happy Clients" },
    { key: "stat_awards",   label: "Awards Won" },
  ];
  const stats = allStats.filter(s => settings?.[s.key]).map(s => ({ value: settings[s.key], label: s.label }));

  if (!stats.length) return null;

  const cols = stats.length === 1 ? "grid-cols-1" : stats.length === 2 ? "grid-cols-2" : stats.length === 3 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4";

  return (
    <section ref={ref} className="py-20 border-y border-white/5 bg-navy">
      <div className={`max-w-7xl mx-auto px-6 grid gap-8 ${cols}`}>
        {stats.map((s, i) => {
          const num = parseInt(s.value);
          const suffix = s.value.replace(/[0-9]/g, "");
          return (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <div className="font-display text-5xl md:text-6xl font-semibold text-gold mb-2">
                {inView ? <CountUp end={num} duration={2.5} suffix={suffix} /> : "0"}
              </div>
              <div className="text-silver/50 text-sm tracking-widest uppercase">{s.label}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ── Services Overview ──────────────────────────────────────────
const serviceIconMap = [
  { key: "house plan", Icon: HomeIcon },
  { key: "plan approval", Icon: ClipboardList },
  { key: "construction", Icon: HardHat },
  { key: "interior", Icon: Sofa },
  { key: "turnkey", Icon: KeyRound },
  { key: "2d", Icon: PencilRuler },
  { key: "modular", Icon: ChefHat },
  { key: "false", Icon: Sparkles },
];
function getServiceIcon(title) {
  const t = title.toLowerCase();
  return serviceIconMap.find(({ key }) => t.includes(key))?.Icon || Star;
}

function ServicesOverview({ services }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-tag mx-auto justify-center">What We Offer</p>
          <h2 className="heading-section text-white">
            Our <span className="text-gold">Premium</span> Services
          </h2>
          <div className="gold-divider mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(services || defaultServices).slice(0, 8).map((service, i) => {
            const ServiceIcon = getServiceIcon(service.title);
            return (
            <motion.div
              key={service._id || i}
              className="card-dark p-6 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07 }}
            >
              <div className="text-gold mb-4"><ServiceIcon size={28} /></div>
              <h3 className="font-display text-lg text-white group-hover:text-gold transition-colors mb-2">
                {service.title}
              </h3>
              <p className="text-silver/40 text-sm leading-relaxed">
                {service.shortDescription}
              </p>
              <div className="w-8 h-px bg-gold mt-4 group-hover:w-16 transition-all duration-300" />
            </motion.div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <Link to="/services" className="btn-outline">View All Services</Link>
        </div>
      </div>
    </section>
  );
}

// ── Featured Works ──────────────────────────────────────────────
function FeaturedWorks({ projects }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [selectedProject, setSelectedProject] = useState(null);
  const featured = projects?.filter((p) => p.featured).slice(0, 3) || [];

  return (
    <section ref={ref} className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-tag mx-auto justify-center">Portfolio</p>
          <h2 className="heading-section text-white">
            Featured <span className="text-gold">Works</span>
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((project, i) => (
              <motion.div
                key={project._id}
                className="relative overflow-hidden aspect-[4/5] group cursor-pointer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedProject(project)}
              >
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-navy flex items-center justify-center">
                    <Building size={48} className="opacity-20 text-silver" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="text-gold text-xs tracking-widest uppercase">{project.category}</span>
                  <h3 className="font-display text-xl text-white mt-1">{project.title}</h3>
                  {project.location && <p className="text-silver/50 text-xs mt-1">{project.location}</p>}
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 border border-gold/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M7 17 17 7M7 7h10v10"/></svg>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] bg-navy/50 border border-white/5 flex items-center justify-center">
                <div className="text-center text-silver/20">
                  <Building size={40} className="mx-auto mb-2" />
                  <p className="text-xs tracking-widest uppercase">Project {i}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <Link to="/works" className="btn-primary">View All Projects</Link>
        </div>
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-navy border border-white/10 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 bg-gold-gradient" />
            <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 z-10 text-silver/60 hover:text-white text-2xl leading-none">×</button>
            {selectedProject.coverImage && (
              <img src={selectedProject.coverImage} alt={selectedProject.title} className="w-full aspect-video object-cover" />
            )}
            <div className="p-8">
              <span className="text-gold text-xs tracking-widest uppercase">{selectedProject.category}</span>
              <h2 className="font-display text-3xl text-white mt-2 mb-1">{selectedProject.title}</h2>
              {selectedProject.location && <p className="text-silver/50 text-sm mb-4 flex items-center gap-1.5"><MapPin size={13} className="text-gold shrink-0" />{selectedProject.location}</p>}
              {selectedProject.description && <p className="text-silver/60 leading-relaxed mb-6">{selectedProject.description}</p>}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {selectedProject.area && <div className="border border-white/5 p-3 text-center"><p className="text-gold text-sm font-semibold">{selectedProject.area}</p><p className="text-silver/40 text-xs">Area</p></div>}
                {selectedProject.year && <div className="border border-white/5 p-3 text-center"><p className="text-gold text-sm font-semibold">{selectedProject.year}</p><p className="text-silver/40 text-xs">Year</p></div>}
                {selectedProject.client && <div className="border border-white/5 p-3 text-center"><p className="text-gold text-sm font-semibold">{selectedProject.client}</p><p className="text-silver/40 text-xs">Client</p></div>}
              </div>
              {selectedProject.images?.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {[selectedProject.coverImage, ...selectedProject.images].filter(Boolean).slice(1, 7).map((img, i) => (
                    <img key={i} src={img} alt="" className="aspect-square object-cover" loading="lazy" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Why Choose Us ──────────────────────────────────────────────
function WhyChooseUs() {
  const { ref, inView } = useInView({ triggerOnce: true });
  const reasons = [
    { Icon: Trophy, title: "15+ Years Experience", desc: "Over a decade of delivering premium construction projects with unmatched quality" },
    { Icon: Gem, title: "Luxury Craftsmanship", desc: "Every detail is crafted with precision and premium materials that last generations" },
    { Icon: Clock, title: "On-Time Delivery", desc: "We respect your timeline and ensure projects are delivered on schedule" },
    { Icon: Wrench, title: "End-to-End Solutions", desc: "From design to handover, we handle every aspect of your construction journey" },
    { Icon: Ruler, title: "Expert Team", desc: "A dedicated team of architects, engineers and interior designers at your service" },
    { Icon: Handshake, title: "Transparent Process", desc: "Complete transparency in pricing, materials and project progress at all times" },
  ];

  return (
    <section ref={ref} className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-tag">Why Skyrise</p>
            <h2 className="heading-section text-white mb-6">
              The Standard of{" "}
              <span className="text-gold">Luxury</span> Construction
            </h2>
            <p className="text-silver/50 leading-relaxed mb-8">
              We don't just build structures — we create legacies. With a relentless commitment to quality and an eye for detail, Skyrise Build & Interiors has redefined what premium construction means in Tamil Nadu.
            </p>
            <Link to="/about" className="btn-outline">Our Story</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((r, i) => (
              <motion.div
                key={i}
                className="p-5 border border-white/5 hover:border-gold/20 transition-all group"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.08 }}
              >
                <div className="text-gold mb-3"><r.Icon size={22} /></div>
                <h4 className="text-white text-sm font-semibold mb-2 group-hover:text-gold transition-colors">{r.title}</h4>
                <p className="text-silver/40 text-xs leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────
function TestimonialCard({ t }) {
  return (
    <div className="card-dark p-8 h-full flex flex-col">
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: t.rating || 5 }).map((_, j) => (
          <span key={j} className="text-gold text-sm">★</span>
        ))}
      </div>
      <p className="text-silver/60 text-sm leading-relaxed mb-6 italic flex-1">"{t.message}"</p>
      <div className="flex items-center gap-3">
        {t.image ? (
          <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center text-gold font-semibold text-sm shrink-0">
            {t.name[0]}
          </div>
        )}
        <div>
          <p className="text-white text-sm font-semibold">{t.name}</p>
          <p className="text-silver/40 text-xs">{t.designation}{t.location && t.designation ? ` · ${t.location}` : t.location}</p>
        </div>
      </div>
    </div>
  );
}

function Testimonials({ testimonials }) {
  const items = testimonials || [];
  const [current, setCurrent] = useState(0);
  const perPage = 3;
  const total = items.length;
  const maxIndex = Math.max(0, total - perPage);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  // Auto-advance
  useEffect(() => {
    if (total <= perPage) return;
    const id = setInterval(() => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)), 4000);
    return () => clearInterval(id);
  }, [total, maxIndex]);

  const isLoading = !testimonials;

  return (
    <section className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-tag mx-auto justify-center">Testimonials</p>
          <h2 className="heading-section text-white">
            What Our <span className="text-gold">Clients</span> Say
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-dark p-8 animate-pulse">
                <div className="h-4 bg-white/5 rounded mb-4 w-24" />
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-white/5 rounded" />
                  <div className="h-3 bg-white/5 rounded w-5/6" />
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 bg-white/5 rounded w-20" />
                    <div className="h-2 bg-white/5 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? null : (
          <>
            {/* Cards — sliding window */}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{ x: `calc(-${current} * (100% / ${perPage} + 8px))` }}
                transition={{ type: "spring", stiffness: 300, damping: 35 }}
              >
                {items.map((t) => (
                  <div key={t._id} className="shrink-0 w-full md:w-[calc(33.333%-16px)]">
                    <TestimonialCard t={t} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Controls */}
            {total > perPage && (
              <div className="flex items-center justify-center gap-6 mt-10">
                <button
                  onClick={prev}
                  disabled={current === 0}
                  className="w-10 h-10 border border-white/10 hover:border-gold/50 flex items-center justify-center text-silver/50 hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-1 transition-all duration-300 ${i === current ? "w-8 bg-gold" : "w-3 bg-white/20 hover:bg-white/40"}`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  disabled={current === maxIndex}
                  className="w-10 h-10 border border-white/10 hover:border-gold/50 flex items-center justify-center text-silver/50 hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ── Process ────────────────────────────────────────────────────
function WorkProcess() {
  const steps = [
    { num: "01", title: "Consultation", desc: "We begin with a detailed discussion to understand your vision, requirements and budget" },
    { num: "02", title: "Design & Planning", desc: "Our architects create detailed plans and 3D visualizations for your approval" },
    { num: "03", title: "Approvals", desc: "We handle all government approvals and documentation seamlessly" },
    { num: "04", title: "Construction", desc: "Our skilled team executes the project with precision and quality materials" },
    { num: "05", title: "Interiors", desc: "Luxury interior finishing that transforms spaces into works of art" },
    { num: "06", title: "Handover", desc: "Final walkthrough and handover of your dream space, ready to live in" },
  ];
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-tag mx-auto justify-center">Process</p>
          <h2 className="heading-section text-white">
            How We <span className="text-gold">Work</span>
          </h2>
          <div className="gold-divider mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative p-6 border border-white/5 group hover:border-gold/20 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
            >
              <div className="text-6xl font-display font-bold text-white/5 absolute top-4 right-4 group-hover:text-gold/10 transition-colors">
                {step.num}
              </div>
              <div className="text-gold text-xs tracking-widest uppercase mb-3">{step.num}</div>
              <h3 className="font-display text-xl text-white mb-3 group-hover:text-gold transition-colors">{step.title}</h3>
              <p className="text-silver/40 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ─────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy to-navy" />
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 70%)"
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="section-tag mx-auto justify-center">Ready to Begin?</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Let's Build Your <span className="text-gold">Dream Space</span> Together
          </h2>
          <p className="text-silver/50 mb-10 max-w-xl mx-auto">
            Contact us today for a free consultation. Our team of experts is ready to turn your vision into reality.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary">Start Your Project</Link>
            <Link to="/works" className="btn-outline">View Our Portfolio</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const defaultServices = [
  { title: "House Plan & Design", shortDescription: "Custom architectural plans tailored to your vision" },
  { title: "Plan Approval", shortDescription: "Seamless government plan approval processing" },
  { title: "Construction", shortDescription: "Premium quality construction with superior materials" },
  { title: "Interior Design", shortDescription: "Luxury interiors reflecting your personality" },
  { title: "Turnkey Projects", shortDescription: "End-to-end project delivery" },
  { title: "2D & 3D Elevation", shortDescription: "Stunning facade visualizations" },
  { title: "Modular Kitchen", shortDescription: "Premium modular kitchens for modern living" },
  { title: "False Ceiling", shortDescription: "Elegant ceiling designs enhancing beauty" },
];

export default function Home() {
  const { data: settingsData } = useQuery({ queryKey: ["settings"], queryFn: () => publicApi.getSettings() });
  const { data: servicesData } = useQuery({ queryKey: ["services"], queryFn: () => publicApi.getServices() });
  const { data: projectsData } = useQuery({ queryKey: ["projects", "featured"], queryFn: () => publicApi.getProjects({ featured: true, limit: 6 }) });
  const { data: testimonialsData } = useQuery({ queryKey: ["testimonials"], queryFn: () => publicApi.getTestimonials() });

  const settings = settingsData?.data?.settings;
  const services = servicesData?.data?.services;
  const projects = projectsData?.data?.projects;
  const testimonials = testimonialsData?.data?.testimonials;

  return (
    <div>
      <Hero settings={settings} />
      <Stats settings={settings} />
      <ServicesOverview services={services} />
      <FeaturedWorks projects={projects} />
      <WhyChooseUs />
      <Testimonials testimonials={testimonials} />
      <WorkProcess />
      <CTABanner />
    </div>
  );
}
