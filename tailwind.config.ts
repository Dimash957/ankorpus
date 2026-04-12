import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0A0A0F",
          secondary: "#111118",
          card: "#16161F",
        },
        accent: {
          primary: "#7C6FFF",
          secondary: "#3EC9A7",
          warm: "#F5A623",
        },
        text: {
          primary: "#F0F0F5",
          secondary: "#8888A0",
        },
      },
      borderColor: {
        subtle: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        soft: "0 10px 40px rgba(0, 0, 0, 0.35)",
        glow: "0 0 0 1px rgba(124, 111, 255, 0.22), 0 16px 48px rgba(20, 17, 40, 0.5)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #1a1040 0%, #0A0A0F 60%, #0d1a14 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
