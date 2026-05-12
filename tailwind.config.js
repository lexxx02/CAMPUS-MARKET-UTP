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
          // Rojos UTP
          red: '#C1272D',
          'red-light': '#E8363D',
          'red-bright': '#FF4D54',
          'red-dark': '#8B1A1F',
          'red-deep': '#5C1015',
          // Negros y grises
          black: '#0A0A0A',
          dark: '#111111',
          card: '#1A1A1A',
          surface: '#222222',
          border: '#2A2A2A',
          'border-light': '#333333',
          // Grises
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
          // Semáforo (inventario)
          success: '#00D68F',
          warning: '#FFAA00',
          danger: '#FF3D71',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(193, 39, 45, 0.2)',
        'glow-lg': '0 0 40px rgba(193, 39, 45, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
        'red': '0 4px 20px rgba(193, 39, 45, 0.25)',
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
