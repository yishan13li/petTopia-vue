import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({

  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['1254-2401-e180-8810-c13e-e458-335c-1d0d-71f1.ngrok-free.app'],
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
