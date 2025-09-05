/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          900: "#0B0F14",
          800: "#0F172A",
          50: "#F8FAFC"
        },
        sport: {
          primary: "#22D3EE",
          accent: "#A3E635",
          amber: "#FFB703"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      }
    },
  },
  plugins: [],
};
