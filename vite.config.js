import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({

  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['b86f-2401-e180-8842-f631-a1c4-d66d-f5fa-ba1a.ngrok-free.app'],
    proxy: {
      '/oauth2': 'http://localhost:8080',
      '/api': 'http://localhost:8080'
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    'global': 'window' // 讓 `global` 指向 `window`
  }

})
