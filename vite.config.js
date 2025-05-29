import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    port: 5174,
    strictPort: false,
    host: true, // Add this to handle connections better
    proxy: {
      "/api": {
        target: "https://loanmonkl-render-be.onrender.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // keep /api intact
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    },
    watch: {
      usePolling: true // Add this for better file watching
    },
    hmr: {
      overlay: true,
      timeout: 30000 // Increase timeout
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.VITE_APP_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.VITE_APP_ENV === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@chakra-ui/react', 'framer-motion'],
          utils: ['axios', 'zustand'],
        },
      },
    },
  },
});
