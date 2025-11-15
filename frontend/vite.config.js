import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // This makes the dev server accessible on your local network
        host: '0.0.0.0',
        port: 5173,

        // The proxy is used ONLY for local development to avoid CORS issues.
        // It forwards requests from the Vite dev server (e.g., /api/auth/login)
        // to your local Django backend running on port 8000.
        // This section has NO EFFECT on the production build.
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
            }
        }
    }
});