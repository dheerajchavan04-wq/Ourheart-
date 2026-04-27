// 📁 FILE: tailwind.config.js
// 📏 LINES: 1-42
// 🎯 PURPOSE: Theme variables, glass utilities, font mapping, dark mode base
// 🔒 SECURITY: No external theme pulls, scoped to project files only
/** @type {import('tailwindcss').Config} */
export default {
  content: [ // Line 6 → Scans for class usage
    "./index.html", // Line 7 → Root HTML
    "./src/**/*.{js,ts,jsx,tsx}" // Line 8 → All components
  ],
  theme: { // Line 10 → Design tokens
    extend: { // Line 11 → Custom overrides
      colors: { // Line 12 → OURHEART palette
        obsidian: '#0F0F0F', // Line 13 → Primary background
        charcoal: '#111111', // Line 14 → Card surface
        primaryPink: '#FF4FA3', // Line 15 → Accent button
        secondaryPink: '#FF6FAF', // Line 16 → Hover states
        midnightTeal: '#1A2B3C', // Line 17 → Mesh gradient base
      },
      fontFamily: { // Line 19 → Typography mapping
        serif: ['Playfair Display', 'serif'], // Line 20 → Character names
        sans: ['Inter', 'Montserrat', 'sans-serif'] // Line 21 → UI text
      },
      animation: { // Line 23 → Custom keyframe bindings
        'fade-in': 'fadeIn 0.2s linear forwards', // Line 24
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1) forwards', // Line 25
        'mesh-drift': 'meshShift 30s ease-in-out infinite', // Line 26
      },
      keyframes: { // Line 28 → Animation definitions
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } }, // Line 29
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } }, // Line 30
        meshShift: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } } // Line 31
      }
    }
  },
  plugins: [] // Line 33 → No external Tailwind plugins (keeps bundle lean)
};
