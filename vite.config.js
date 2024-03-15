import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],

    watch: {
        usePolling: true,
        origin: 'http://192.168.0.72'
    },
    server: {
        hmr: {
            host: '192.168.0.72'
        }
    }

});
