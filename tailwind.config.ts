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
          DEFAULT: "#1F2937",
          soft: "#4B5563",
          faint: "#7E808C",
        },
        canvas: {
          DEFAULT: "#F6F7F9",
          raised: "#FFFFFF",
          sunken: "#F9FAFB",
        },
        line: {
          DEFAULT: "#E5E7EB",
          soft: "#F3F4F6",
        },
        accent: {
          DEFAULT: "#FC8019",
          soft: "#FED7AA",
          deep: "#C2410C",
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
        card: "0 1px 2px rgba(15,23,42,0.05)",
        raised: "0 10px 24px rgba(15,23,42,0.08)",
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
