/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Rojo institucional UTP
          red: '#D72638',
          'red-light': '#E8363D',
          'red-bright': '#FF4D54',
          'red-dark': '#8B1A1F',
          'red-deep': '#5C1015',
          // Header / Footer
          black: '#121212',
          dark: '#1A1A1A',
          // Light surfaces
          card: '#1E1E1E',
          surface: '#252538',
          border: '#2A2A35',
          'border-light': '#3A3A4A',
          'light-bg': '#FFFFFF',
          'light-surface': '#F5F5F7',
          'light-border': '#ECECEC',
          // Grises (admin)
          'gray-900': '#1A1A1A',
          'gray-800': '#2A2A2A',
          'gray-700': '#3A3A3A',
          'gray-600': '#555555',
          'gray-500': '#777777',
          'gray-400': '#999999',
          'gray-300': '#BBBBBB',
          'gray-200': '#DDDDDD',
          // Blancos
          white: '#FAFAFA',
          'white-dim': '#E8E8E8',
          // Light text
          'text-primary': '#111111',
          'text-secondary': '#666666',
          'text-tertiary': '#999999',
          // Semáforo (inventario) — admin
          success: '#10B981', // Verde esmeralda suave
          warning: '#F59E0B', // Ámbar suave
          danger: '#EF4444',  // Rojo vibrante
          // Semáforo light (catálogo)
          'avail-bg': '#E8F5E9',
          'avail-text': '#2E7D32',
          'low-bg': '#FFF8E1',
          'low-text': '#E65100',
          'out-bg': '#FFEBEE',
          'out-text': '#C62828',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(193, 39, 45, 0.2)',
        'glow-lg': '0 0 40px rgba(193, 39, 45, 0.3)',
        'card': '0 10px 40px -10px rgba(0,0,0,0.5)',
        'card-hover': '0 20px 40px -10px rgba(0,0,0,0.7)',
        'red': '0 4px 20px rgba(215, 38, 56, 0.25)',
        'card-light': '0 8px 25px rgba(0, 0, 0, 0.08)',
        'card-hover-light': '0 12px 35px rgba(0, 0, 0, 0.12)',
        'hero': '0 4px 20px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
