/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#050810",
          900: "#0A0E1A",
          800: "#111827",
          700: "#1A2235",
        },
        neon: {
          cyan: "#00F5D4",
          cyanSoft: "#38F5E1",
          green: "#00FF94",
          orange: "#FF6B35",
          red: "#FF4757",
          purple: "#B794F4",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "system-ui", "sans-serif"],
        sans: ["'Noto Sans SC'", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 245, 212, 0.35), 0 0 40px rgba(0, 245, 212, 0.15)",
        "neon-orange": "0 0 20px rgba(255, 107, 53, 0.4)",
        "glow-soft": "0 8px 32px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "glass-dark":
          "linear-gradient(135deg, rgba(20,28,48,0.75) 0%, rgba(10,14,26,0.85) 100%)",
        "grid-overlay":
          "linear-gradient(rgba(0,245,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.05) 1px, transparent 1px)",
      },
      animation: {
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scan-line 3.5s linear infinite",
        "fade-up": "fade-up 0.4s ease-out both",
        "grow-line": "grow-line 0.5s ease-out both",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.85" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grow-line": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};
