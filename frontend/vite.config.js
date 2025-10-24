import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        /**
         * By default, Vite only listens for connections from 'localhost'.
         * Setting host to '0.0.0.0' tells Vite to listen on all available
         * network interfaces on the machine. This makes the dev server
         * accessible from other devices on the same network, like your
         * Windows machine accessing the Linux server.
         */
        host: '0.0.0.0',
        /**
         * We can keep the port the same. You will access the app via:
         * http://<your-linux-server-ip>:5173
         */
        port: 5173,
        /**
         * The proxy configuration remains the same. When your React app
         * (running on the Linux server) makes a request to '/api',
         * the Vite server will forward it to the Django backend, which is
         * also running on the same Linux server at port 8000.
         */
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
            }
        }
    }
});
