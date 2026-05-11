import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { publicApi } from "../services/api";
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data) => publicApi.submitContact(data),
    onSuccess: () => {
      toast.success("Enquiry submitted! We'll contact you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Submission failed"),
  });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Valid 10-digit Indian phone required";
    if (!form.message.trim() || form.message.length < 10) e.message = "Message must be at least 10 characters";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) mutate(form);
  };

  return (
    <div className="border border-white/5 p-8 md:p-10 bg-navy">
      <div className="h-0.5 bg-gold-gradient w-16 mb-8" />
      <h3 className="font-display text-2xl text-white mb-2">Send an Enquiry</h3>
      <p className="text-silver/40 text-sm mb-8">Fill in the details below and we'll get back to you within 24 hours.</p>

      {isSuccess ? (
        <motion.div
          className="text-center py-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle size={52} className="mx-auto mb-4 text-gold" />
          <h4 className="font-display text-xl text-gold mb-2">Enquiry Received!</h4>
          <p className="text-silver/50 text-sm">Our team will contact you shortly.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-silver/40 text-xs tracking-widest uppercase block mb-2">Full Name *</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`input-dark ${errors.name ? "border-red-500/40" : ""}`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-silver/40 text-xs tracking-widest uppercase block mb-2">Phone *</label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`input-dark ${errors.phone ? "border-red-500/40" : ""}`}
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="text-silver/40 text-xs tracking-widest uppercase block mb-2">Email *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`input-dark ${errors.email ? "border-red-500/40" : ""}`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-silver/40 text-xs tracking-widest uppercase block mb-2">Message *</label>
            <textarea
              placeholder="Tell us about your project requirements..."
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`input-dark resize-none ${errors.message ? "border-red-500/40" : ""}`}
            />
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border border-black/30 border-t-black rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              "Submit Enquiry"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function Contact() {
  const { data: settingsData } = useQuery({
    queryKey: ["settings"],
    queryFn: () => publicApi.getSettings(),
    staleTime: 600000,
  });
  const s = settingsData?.data?.settings || {};

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 60% 40%, #D4AF37 0%, transparent 60%)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-tag">Reach Out</p>
            <h1 className="heading-display text-white mb-4">
              Contact <span className="text-gold">Us</span>
            </h1>
            <div className="gold-divider" />
            <p className="text-silver/50 max-w-xl leading-relaxed">
              Let's discuss your dream project. We're here to help turn your vision into reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="section-tag">Contact Details</p>
              <h2 className="font-display text-2xl text-white">Get in Touch</h2>
            </div>

            {[
              { Icon: MapPin, label: "Address", value: s.address || "Chennai, Tamil Nadu", href: null },
              { Icon: Phone, label: "Phone", value: s.phone || "+91 98765 43210", href: `tel:${s.phone}` },
              { Icon: Mail, label: "Email", value: s.email || "info@skyrisebuild.com", href: `mailto:${s.email}` },
              { Icon: Clock, label: "Business Hours", value: s.business_hours || "Mon–Sat: 9AM – 7PM", href: null },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex gap-4 p-5 border border-white/5 hover:border-gold/20 transition-all group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-10 h-10 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                  <item.Icon size={18} />
                </div>
                <div>
                  <p className="text-silver/40 text-xs tracking-widest uppercase mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-white text-sm group-hover:text-gold transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-white text-sm">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${s.whatsapp || "919876543210"}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-5 bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366]/50 transition-all group"
            >
              <div className="w-10 h-10 bg-[#25D366] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium group-hover:text-[#25D366] transition-colors">Chat on WhatsApp</p>
                <p className="text-silver/40 text-xs">Quick response guaranteed</p>
              </div>
            </a>
          </motion.div>

          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* Map */}
      {s.map_embed && (
        <section className="h-80 border-t border-white/5">
          <iframe
            src={s.map_embed}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Skyrise Location"
          />
        </section>
      )}
    </div>
  );
}
