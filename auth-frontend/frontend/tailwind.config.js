/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './templates/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0D14',
        'bg-2': '#0E121C',
        panel: '#11151F',
        'panel-2': '#161B27',
        cyan: { DEFAULT: '#22D3EE' },
        indigo: { DEFAULT: '#6366F1' },
        violet: { DEFAULT: '#A855F7' },
        'grad-from': '#22D3EE',
        'grad-to': '#A855F7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        grad: 'linear-gradient(135deg, #22D3EE 0%, #6366F1 50%, #A855F7 100%)',
        'grad-soft': 'linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(99,102,241,0.18) 50%, rgba(168,85,247,0.18) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        blink: 'blink 1s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        blink: { '50%': { opacity: '0' } },
      },
    },
  },
  plugins: [],
};
