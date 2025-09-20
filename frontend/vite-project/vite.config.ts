import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This will proxy any request starting with /api
      '/api': {
        target: 'http://127.0.0.1:8000', // Your Django server
        changeOrigin: true,
      }
    }
  }
})