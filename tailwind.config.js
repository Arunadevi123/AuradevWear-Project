/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Cool Blue
        secondary: "#6366F1", // Soft Indigo
        accent: "#14B8A6", // Mint Teal
        neutral: "#111827", // Rich Charcoal
        light: "#F3F4F6", // Neutral Light Gray
      },
    },
  },
  plugins: [],
};
