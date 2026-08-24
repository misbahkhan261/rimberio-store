/// <reference types="node" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// - ES Modules mein __dirname ki jagah path resolve karne ke liye setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
    return {
        // - Plugins: React support aur Tailwind CSS v4 ka Vite plugin
        plugins: [react(), tailwindcss()],
        
        // - Path Aliases: '@' ko './src' folder ke sath map karta hai taake imports clean hon
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        
        // - Development Server Settings aur API Proxies
        server: {
            hmr: process.env.DISABLE_HMR !== 'true',
            watch: process.env.DISABLE_HMR === 'true' ? null : {},
            proxy: {
                // - Frontend se aane wali '/api' requests ko Flask backend (`http://127.0.0.1:5000`) par forward karta hai
                '/api': {
                    target: 'http://127.0.0.1:5000',
                    changeOrigin: true,
                },
                // - Static files ya public uploads ke liye proxy
                '/public': {
                    target: 'http://127.0.0.1:5000',
                    changeOrigin: true,
                },
            },
        },
    };
});