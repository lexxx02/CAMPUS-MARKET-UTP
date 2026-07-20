import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/LOGO-CM-UTP.png'],
      manifest: {
        name: 'Campus Market UTP',
        short_name: 'Campus Market',
        description: 'El mejor marketplace para estudiantes de la UTP',
        theme_color: '#D92531',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icons/LOGO-CM-UTP.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Obliga al navegador a limpiar cachés viejas y usar la nueva versión
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
})
