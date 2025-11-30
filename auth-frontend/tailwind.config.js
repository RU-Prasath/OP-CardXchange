/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        luffyYellow: "#fdd18e",
        strawRed: "#c0392b",
        animeBlack: "#1c1c1c",
        seaBlue: "#0097a7",
        parchment: "#f6f2ee",
      },
    },
  },
  plugins: [],
};
