import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }) as any,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core (le plus important)
          'react-vendor': ['react', 'react-dom'],

          // Radix UI (gros composants)
          'radix-ui': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],

          // Animations et effets (chargement différé possible)
          'animations': ['framer-motion', 'canvas-confetti'],

          // Icônes
          'icons': ['lucide-react'],

          // Utilitaires
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
    // Augmenter la limite temporairement (on va réduire le bundle après)
    chunkSizeWarningLimit: 600,
  },
})
