import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import logo from "../../assets/logo.png";
import { publicApi } from "../../services/api";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const { data: settingsData } = useQuery({
    queryKey: ["settings"],
    queryFn: () => publicApi.getSettings(),
    staleTime: 10 * 60 * 1000,
  });
  const s = settingsData?.data?.settings || {};

  return (
    <footer className="bg-black border-t border-white/5">
      {/* Top CTA Bar */}
      <div className="border-b border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-silver/50 text-xs tracking-widest uppercase mb-2">Ready to Build?</p>
            <h3 className="font-display text-2xl md:text-3xl text-white">
              Let's Create Something <span className="text-gold">Extraordinary</span>
            </h3>
          </div>
          <div className="flex gap-4">
            <Link to="/contact" className="btn-primary text-xs">Get Free Quote</Link>
            <a
              href={`https://wa.me/${s.whatsapp || ""}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline text-xs"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="inline-flex items-center gap-3 mb-5">
            <img src={logo} alt="Skyrise" className="h-14 w-14 object-contain" />
            <div>
              <div className="font-display text-2xl font-semibold text-gold tracking-wider">
                SKY<span className="text-white">RISE</span>
              </div>
              <div className="text-silver/40 text-[9px] tracking-[0.4em] uppercase">Build & Interiors</div>
            </div>
          </Link>
          <p className="text-silver/50 text-sm leading-relaxed mb-6">
            Premium construction and luxury interior design company crafting dream spaces with uncompromising quality.
          </p>
          <div className="flex gap-3">
            {s.instagram && (
              <a href={s.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/10 flex items-center justify-center text-silver/50 hover:border-gold hover:text-gold transition-all">
                <InstagramIcon />
              </a>
            )}
            {s.facebook && (
              <a href={s.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/10 flex items-center justify-center text-silver/50 hover:border-gold hover:text-gold transition-all">
                <FacebookIcon />
              </a>
            )}
            {s.youtube && (
              <a href={s.youtube} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/10 flex items-center justify-center text-silver/50 hover:border-gold hover:text-gold transition-all">
                <YoutubeIcon />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
            <span className="w-5 h-px bg-gold" /> Quick Links
          </h4>
          <ul className="space-y-3">
            {[["Home", "/"], ["About Us", "/about"], ["Services", "/services"], ["Our Works", "/works"], ["Contact", "/contact"]].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-silver/50 text-sm hover:text-gold transition-colors flex items-center gap-2 group">
                  <span className="w-3 h-px bg-gold/30 group-hover:w-5 group-hover:bg-gold transition-all" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
            <span className="w-5 h-px bg-gold" /> Services
          </h4>
          <ul className="space-y-3">
            {["House Plan & Design", "Plan Approval", "Construction", "Interior Design", "Turnkey Projects", "2D & 3D Elevation"].map((s) => (
              <li key={s}>
                <Link to="/services" className="text-silver/50 text-sm hover:text-gold transition-colors flex items-center gap-2 group">
                  <span className="w-3 h-px bg-gold/30 group-hover:w-5 group-hover:bg-gold transition-all" />
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
            <span className="w-5 h-px bg-gold" /> Contact
          </h4>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-silver/50">
              <MapPin size={15} className="text-gold mt-0.5 shrink-0" />
              <span>{s.address || "Chennai, Tamil Nadu"}</span>
            </li>
            <li>
              <a href={`tel:${s.phone}`} className="flex gap-3 items-center text-sm text-silver/50 hover:text-gold transition-colors">
                <Phone size={15} className="text-gold shrink-0" /> {s.phone || "+91 98765 43210"}
              </a>
            </li>
            <li>
              <a href={`mailto:${s.email}`} className="flex gap-3 items-center text-sm text-silver/50 hover:text-gold transition-colors">
                <Mail size={15} className="text-gold shrink-0" /> {s.email || "info@skyrisebuild.com"}
              </a>
            </li>
            <li className="flex gap-3 items-center text-sm text-silver/50">
              <Clock size={15} className="text-gold shrink-0" /> {s.business_hours || "Mon–Sat: 9AM – 7PM"}
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-silver/30">
          <p>© {new Date().getFullYear()} Skyrise Build & Interiors. All rights reserved.</p>
          <p>Crafted with precision for excellence</p>
        </div>
      </div>
    </footer>
  );
}

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
  </svg>
);
