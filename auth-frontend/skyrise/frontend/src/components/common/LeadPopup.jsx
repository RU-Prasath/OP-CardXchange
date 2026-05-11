import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { publicApi } from "../../services/api";

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const shown = sessionStorage.getItem("skyrise_lead_shown");
    if (!shown) {
      const timer = setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => publicApi.submitLead(data),
    onSuccess: () => {
      toast.success("Thank you! We'll get back to you soon.");
      sessionStorage.setItem("skyrise_lead_shown", "true");
      setOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Valid 10-digit phone required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) mutate(form);
  };

  const handleClose = () => {
    sessionStorage.setItem("skyrise_lead_shown", "true");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-navy border border-gold/20 shadow-[0_0_80px_rgba(212,175,55,0.15)]"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* Gold top accent */}
            <div className="h-1 bg-gold-gradient w-full" />

            <div className="p-8">
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-silver/40 hover:text-white transition-colors text-xl leading-none"
              >
                ×
              </button>

              {/* Header */}
              <div className="mb-6">
                <p className="section-tag">Exclusive Offer</p>
                <h3 className="font-display text-2xl text-white mb-2">
                  Get a <span className="text-gold">Free Consultation</span>
                </h3>
                <p className="text-silver/50 text-sm">
                  Share your details and our expert team will contact you within 24 hours.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`input-dark ${errors.name ? "border-red-500/50" : ""}`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`input-dark ${errors.email ? "border-red-500/50" : ""}`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`input-dark ${errors.phone ? "border-red-500/50" : ""}`}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary w-full justify-center text-xs py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-black/30 border-t-black rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Get Free Consultation"
                  )}
                </button>
              </form>

              <p className="text-silver/30 text-xs text-center mt-4">
                🔒 Your information is 100% secure and private
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
