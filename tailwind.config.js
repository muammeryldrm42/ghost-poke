/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ghost: {
          bg: "#0a0a0f",
          surface: "#12121a",
          card: "#1a1a27",
          border: "#2a2a3d",
          muted: "#6b6b8a",
          text: "#e0e0f0",
          neon: "#b366ff",
          "neon-dim": "#8b3fd9",
          "neon-glow": "#d4a0ff",
          accent: "#00f5d4",
          danger: "#ff4d6a",
          streak: "#ff9500",
        },
      },
      fontFamily: {
        display: ['"Outfit"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "ghost-float": "ghostFloat 3s ease-in-out infinite",
        "neon-pulse": "neonPulse 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "poke-blast": "pokeBlast 0.6s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        ghostFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        neonPulse: {
          "0%, 100%": { boxShadow: "0 0 20px #b366ff40, 0 0 40px #b366ff20" },
          "50%": { boxShadow: "0 0 30px #b366ff70, 0 0 60px #b366ff40, 0 0 90px #b366ff20" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pokeBlast: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.15)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
