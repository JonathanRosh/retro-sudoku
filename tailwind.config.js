/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cartoon': ['Comic Neue', 'cursive', 'sans-serif'],
      },
      colors: {
        retro: {
          bg: '#fcd34d',
          gridBg: '#fef3c7',
          cellBg: '#ffffff',
          cellHighlight: '#fde047',
          border: '#1e40af',
          text: '#1e3a8a',
          accent: '#ef4444',
          success: '#10b981',
          selected: '#a7f3d0'
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'colorFlicker': 'colorFlicker 1.5s infinite alternate',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        colorFlicker: {
          '0%': { backgroundColor: '#ef4444', color: '#ffffff' }, // retro-accent
          '33%': { backgroundColor: '#f97316', color: '#ffffff' }, // orange
          '66%': { backgroundColor: '#eab308', color: '#000000' }, // yellow
          '100%': { backgroundColor: '#06b6d4', color: '#ffffff' }, // cyan
        }
      }
    },
  },
  plugins: [],
}
