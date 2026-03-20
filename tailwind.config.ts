import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Orbitron'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        cosmos: {
          black: "#03020a",
          deep: "#080618",
          void: "#0d0b24",
          purple: "#1a0f3d",
          nebula: "#2d1b69",
          violet: "#6c3fc5",
          glow: "#8b5cf6",
          star: "#c4b5fd",
          dust: "#ede9fe",
          accent: "#06b6d4",
          gold: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};

export default config;