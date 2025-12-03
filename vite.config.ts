import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png', 'pwa-*.png'],
      manifest: {
        name: "CHIN'IT",
        short_name: "CHIN'IT",
        description: 'Aim to be a Chinitsu Master!',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: 'pwa-180.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-1024.png',
            sizes: '1024x1024',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/menchin/', // リポジトリ名に合わせて変更
})
