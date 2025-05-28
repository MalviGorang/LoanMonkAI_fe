import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    port: 5174,
    strictPort: true,
    host: true, // Add this to handle connections better
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
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
