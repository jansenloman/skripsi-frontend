/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      colors: {
        "custom-blue": "#789DBC",
        "custom-light-blue": "#2FA0DD",
        "custom-yellow": "#FEC976",
        "custom-light-yellow": "#FEE3B3",
        "custom-red": "#ff8686",
        "custom-green": "#c9e9d2",
      },
    },
  },
  plugins: [],
};
