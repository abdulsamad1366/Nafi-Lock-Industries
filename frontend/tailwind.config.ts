import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        divider: "var(--color-divider)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        secondary: "var(--color-secondary)",
        primary: "var(--color-primary)",
        muted: "var(--color-muted)",
      },
    },
  },
  plugins: [],
};

export default config;
