import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#F55D16",
          light: "#FF7A3D",
          dark: "#D94A0A",
        },
        cream: {
          DEFAULT: "#F5F5DC",
          light: "#FAFAE8",
          dark: "#E8D9BB",
        },
        navy: {
          950: "#0A0F1C",
          900: "#111827",
          850: "#161F33",
          800: "#1F2937",
          700: "#2A3446",
          600: "#374151",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 20px rgba(0, 0, 0, 0.25)",
        lifted: "0 20px 60px rgba(0, 0, 0, 0.4)",
        glow: "0 0 40px rgba(245, 93, 22, 0.35)",
        "glow-sm": "0 0 20px rgba(245, 93, 22, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
