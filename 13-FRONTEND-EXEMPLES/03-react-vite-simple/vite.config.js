import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7033',
        changeOrigin: true,
        secure: false  // Accepter les certificats auto-signés en dev
      }
    }
  }
})

