import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#161513",
          soft: "#3a3733",
          faint: "#726c63",
        },
        canvas: {
          DEFAULT: "#faf8f4",
          raised: "#ffffff",
          sunken: "#f2efe8",
        },
        line: {
          DEFAULT: "#e6e1d6",
          soft: "#efece3",
        },
        accent: {
          DEFAULT: "#8a6a3f",
          soft: "#c9b48f",
          deep: "#5b4326",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "'Times New Roman'", "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Inter",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,21,19,0.04), 0 1px 12px rgba(22,21,19,0.04)",
        raised: "0 2px 4px rgba(22,21,19,0.06), 0 8px 24px rgba(22,21,19,0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both",
        fadeIn: "fadeIn 0.4s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
