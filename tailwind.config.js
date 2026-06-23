/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── ParcelBuddy brand colors (from the logo) ──
        navy:    "#1A2B5F",   // deep navy blue (primary)
        navylt:  "#243474",   // slightly lighter navy
        orange:  "#F97316",   // vibrant orange (accent)
        orangelt:"#FB923C",   // lighter orange for hovers
        // ── UI tokens ──
        bgsoft:  "#F8FAFC",
        border:  "#E2E8F0",
        muted:   "#64748B",
        success: "#16A34A",
        danger:  "#DC2626",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      animation: {
        "blob-1":         "blob1 8s ease-in-out infinite",
        "blob-2":         "blob2 10s ease-in-out infinite",
        "blob-3":         "blob3 12s ease-in-out infinite",
        "fade-up":        "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":        "fadeIn 0.6s ease both",
        "float":          "float 6s ease-in-out infinite",
        "bounce-gentle":  "bounceGentle 3s ease-in-out infinite",
        "slide-in-left":  "slideInLeft 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "slide-in-right": "slideInRight 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
      keyframes: {
        blob1: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(30px,-20px) scale(1.1)" },
          "66%":     { transform: "translate(-20px,10px) scale(0.9)" },
        },
        blob2: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(-25px,20px) scale(1.05)" },
          "66%":     { transform: "translate(20px,-15px) scale(0.95)" },
        },
        blob3: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%":     { transform: "translate(15px,-25px) scale(1.08)" },
        },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(24px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-14px)" },
        },
        bounceGentle: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-8px)" },
        },
        slideInLeft: {
          from: { opacity: 0, transform: "translateX(-30px)" },
          to:   { opacity: 1, transform: "translateX(0)" },
        },
        slideInRight: {
          from: { opacity: 0, transform: "translateX(30px)" },
          to:   { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
