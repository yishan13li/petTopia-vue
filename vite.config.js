import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  // 讀取 .env 檔案的變數
  const env = loadEnv(mode, process.cwd())

  return {
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: ['b86f-2401-e180-8842-f631-a1c4-d66d-f5fa-ba1a.ngrok-free.app'],
      proxy: {
        '/oauth2': {
          target: env.VITE_API_URL,
          changeOrigin: true
        },
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true
        }
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
      'global': 'window'
    }
  }
})
