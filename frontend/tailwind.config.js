/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'macos-bg': '#1e1e1e',
        'macos-sidebar': 'rgba(28, 28, 30, 0.7)',
        'macos-card': 'rgba(44, 44, 46, 0.7)',
        'macos-control': 'rgba(99, 99, 102, 0.5)',
        'macos-control-hover': 'rgba(99, 99, 102, 0.7)',
        'macos-divider': 'rgba(84, 84, 88, 0.6)',
        'macos-text': '#ffffff',
        'macos-text-secondary': 'rgba(235, 235, 245, 0.6)',
        'macos-blue': '#0A84FF',
        'macos-green': '#30D158',
        'macos-orange': '#FF9F0A',
        'macos-red': '#FF453A',
        'macos-yellow': '#FFD60A',
        'macos-purple': '#BF5AF2',
        'macos-pink': '#FF375F',
      },
      borderRadius: {
        'macos': '10px',
      },
      boxShadow: {
        'macos': '0 2px 10px rgba(0, 0, 0, 0.2)',
        'macos-hover': '0 4px 20px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
      },
      backdropFilter: {
        'glass': 'blur(20px) saturate(180%)',
      },
      animation: {
        'bounce-sm': 'bounce-sm 1s ease-in-out infinite',
      },
      keyframes: {
        'bounce-sm': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.backdrop-blur-glass': {
          backdropFilter: 'blur(20px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(20px) saturate(180%)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} 