import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          900: "#1B1D1F",
          800: "#272A2D",
          700: "#363A3E",
        },
        steel: {
          500: "#6B7076",
          400: "#8A9098",
          300: "#B0B5BC",
          100: "#E7E7E5",
          50: "#F0F0EE",
        },
        paper: {
          50: "#F7F6F3",
        },
        brass: {
          600: "#A9793F",
          700: "#8C6230",
          500: "#C49254",
          100: "#F5EFE6",
        },
        signal: {
          red: "#B3341C",
        },
      },
      fontFamily: {
        space: ["var(--font-space-grotesk)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
