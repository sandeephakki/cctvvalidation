import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const disablePwa = process.env.DISABLE_PWA === 'true'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      disable: disablePwa,
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Worker URL must bypass service worker — network only
        navigateFallbackDenylist: [/^\/api/, /workers\.dev/],
        runtimeCaching: [
          {
            // Never cache worker requests — always network
            urlPattern: ({ url }) => url.hostname.includes('workers.dev'),
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /\.(js|css|html|png|svg|ico)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'hakkieye-assets', expiration: { maxEntries: 50, maxAgeSeconds: 86400 } }
          }
        ]
      },
      manifest: {
        name: 'HakkiEye',
        short_name: 'HakkiEye',
        description: 'Scan your CCTV system — free, neutral, private',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1877C8',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
