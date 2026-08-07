/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#14161A",
        charcoal2: "#1D2026",
        coral: "#FF4D6D",
        coral2: "#FF7A8A",
        mint: "#3DDC97",
        bone: "#F3F1EC",
      },
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
