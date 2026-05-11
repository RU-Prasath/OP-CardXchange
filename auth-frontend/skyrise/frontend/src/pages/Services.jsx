import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../services/api";
import {
  Home as HomeIcon, ClipboardList, HardHat, Sofa, KeyRound,
  PencilRuler, ChefHat, Sparkles, Star
} from "lucide-react";

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
  const t = title?.toLowerCase() || "";
  return serviceIconMap.find(({ key }) => t.includes(key))?.Icon || Star;
}

const defaultServices = [
  { _id: "1", title: "House Plan & Design", shortDescription: "Innovative architectural designs tailored to your lifestyle and vision", features: ["2D & 3D Floor Plans", "Architectural Drawings", "Structural Design", "Interior Layout Planning", "Vastu Compliance"] },
  { _id: "2", title: "Plan Approval", shortDescription: "Seamless government plan approval with complete documentation support", features: ["DTCP Approval", "Panchayat Approval", "CMDA Approval", "Documentation Support", "Legal Compliance"] },
  { _id: "3", title: "Construction", shortDescription: "Premium quality construction with superior materials and skilled craftsmen", features: ["RCC Frame Structure", "Premium Materials", "Skilled Workforce", "Quality Assurance", "Project Management"] },
  { _id: "4", title: "Interior Design", shortDescription: "Luxury interiors that reflect your personality and elevate your lifestyle", features: ["Space Planning", "Material Selection", "Furniture Design", "Lighting Design", "Custom Millwork"] },
  { _id: "5", title: "Turnkey Projects", shortDescription: "End-to-end project delivery from concept to completion under one roof", features: ["Design to Delivery", "Single Point Contact", "Quality Assurance", "Timely Completion", "Cost Transparency"] },
  { _id: "6", title: "2D & 3D Elevation", shortDescription: "Stunning facade designs that create lasting first impressions", features: ["2D Elevation Drawing", "3D Visualization", "Facade Design", "Material Specification", "Rendering"] },
  { _id: "7", title: "Modular Kitchen", shortDescription: "Premium modular kitchens designed for modern living and convenience", features: ["Custom Cabinetry", "Premium Hardware", "Space Optimization", "Modern Finishes", "Appliance Integration"] },
  { _id: "8", title: "False Ceiling", shortDescription: "Elegant ceiling designs enhancing the architectural beauty of spaces", features: ["Gypsum Ceiling", "POP Ceiling", "Wooden Ceiling", "LED Integrated Design", "Acoustic Panels"] },
];

function ServiceModal({ service, onClose }) {
  const ServiceIcon = getServiceIcon(service.title);
  const heroImg = service.heroImage || service.image;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-navy border border-white/10 overflow-y-auto max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gold-gradient" />
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-silver/50 hover:text-white text-2xl z-10 leading-none"
          aria-label="Close"
        >
          ×
        </button>
        {heroImg && (
          <div className="w-full aspect-video overflow-hidden">
            <img src={heroImg} alt={service.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-8">
          <div className="text-gold mb-4"><ServiceIcon size={36} /></div>
          <h2 className="font-display text-2xl text-white mb-4">{service.title}</h2>
          <div className="gold-divider" />
          <p className="text-silver/60 leading-relaxed mb-6">
            {service.description || service.shortDescription}
          </p>
          {service.features?.length > 0 && (
            <ul className="space-y-2 mb-8">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-silver/50 text-sm">
                  <span className="w-2 h-2 bg-gold rounded-full shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          <Link to="/contact" className="btn-primary text-xs" onClick={onClose}>
            Book Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, index, onClick }) {
  const ServiceIcon = getServiceIcon(service.title);
  return (
    <motion.div
      className="group border border-white/5 hover:border-gold/25 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4 }}
    >
      {/* Image area */}
      <div className="relative h-48 bg-gradient-to-br from-navy to-charcoal overflow-hidden">
        {service.image ? (
          <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ServiceIcon size={56} className="opacity-20 text-silver" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            <ServiceIcon size={18} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-navy">
        <h3 className="font-display text-xl text-white group-hover:text-gold transition-colors mb-2">
          {service.title}
        </h3>
        <p className="text-silver/50 text-sm leading-relaxed mb-5">{service.shortDescription}</p>

        {service.features?.length > 0 && (
          <ul className="space-y-2 mb-6">
            {service.features.slice(0, 4).map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-silver/40 text-xs">
                <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}

        <Link
          to="/contact"
          className="inline-flex items-center gap-2 text-gold text-xs tracking-widest uppercase font-medium group-hover:gap-4 transition-all"
        >
          Enquire Now
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { data, isLoading } = useQuery({ queryKey: ["services"], queryFn: () => publicApi.getServices() });
  const services = data?.data?.services?.length ? data.data.services : defaultServices;
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #D4AF37 0%, transparent 60%)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-tag">What We Do</p>
            <h1 className="heading-display text-white mb-4">
              Our <span className="text-gold">Services</span>
            </h1>
            <div className="gold-divider" />
            <p className="text-silver/50 max-w-xl leading-relaxed">
              Comprehensive construction and interior design solutions crafted with precision and luxury.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-white/5 animate-pulse">
                  <div className="h-48 bg-white/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded" />
                    <div className="h-3 bg-white/5 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, i) => (
                <ServiceCard key={service._id} service={service} index={i} onClick={() => setSelectedService(service)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedService && (
        <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}

      {/* CTA */}
      <section className="py-20 bg-navy border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="section-tag mx-auto justify-center">Get Started</p>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
              Interested in Our <span className="text-gold">Services?</span>
            </h2>
            <p className="text-silver/50 mb-8">Schedule a free consultation with our experts today.</p>
            <Link to="/contact" className="btn-primary">Book Free Consultation</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
