import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  root: 'src',
  publicDir: '../public',
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) return 'three'
        },
      },
    },
  },
})
