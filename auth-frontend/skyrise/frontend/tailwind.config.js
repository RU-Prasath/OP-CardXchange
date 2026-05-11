/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: { DEFAULT: "#050505", deep: "#000000" },
        navy: { DEFAULT: "#0F172A", light: "#1A2744" },
        gold: { DEFAULT: "#D4AF37", light: "#E8C65B", dark: "#B8960C", muted: "#9d8429" },
        silver: { DEFAULT: "#C0C0C0", dark: "#a0a0a0" },
        charcoal: { DEFAULT: "#1C1C1E", light: "#2C2C2E" },
      },
      fontFamily: {
        display: ["Playfair Display", "Cinzel", "serif"],
        body: ["Inter", "Manrope", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #E8C65B 50%, #D4AF37 100%)",
        "dark-gradient": "linear-gradient(180deg, #050505 0%, #0F172A 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "shimmer": "shimmer 2s infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(30px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        pulseGold: { "0%,100%": { boxShadow: "0 0 0 0 rgba(212,175,55,0.4)" }, "50%": { boxShadow: "0 0 0 12px rgba(212,175,55,0)" } },
      },
      spacing: { 18: "4.5rem", 88: "22rem", 112: "28rem", 128: "32rem" },
    },
  },
  plugins: [],
};
