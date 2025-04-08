import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({

  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['5ee4-59-125-142-166.ngrok-free.app'],
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
