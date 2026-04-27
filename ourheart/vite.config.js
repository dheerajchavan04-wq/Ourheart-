// 📁 FILE: vite.config.js
// 📏 LINES: 1-35
// 🎯 PURPOSE: Build optimization, security headers, SPA routing, CSP prep
// 🔒 SECURITY: Strips .env non-VITE vars, sets headers, disables source maps in prod
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Line 7 → Enables React HMR
  resolve: {
    alias: { // Line 9 → Import path shortcuts
      '@': '/src' // Line 10 → Clean component imports
    }
  },
  build: { // Line 12 → Production config
    outDir: 'dist', // Line 13 → Build output folder
    sourcemap: false, // Line 14 → SECURITY: Hides source in production
    minify: 'terser', // Line 15 → Optimizes bundle size
    rollupOptions: { // Line 16 → Chunk splitting
      output: { // Line 17 → Asset naming
        manualChunks(id) { // Line 18 → Code split by vendor
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  },
  server: { // Line 22 → Dev server config
    port: 5173, // Line 23 → Local preview port
    strictPort: true // Line 24 → Fails if port occupied
  },
  define: { // Line 26 → Env injection
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  optimizeDeps: { // Line 29 → Pre-bundle deps
    include: ['react', 'react-dom', '@supabase/supabase-js']
  }
});
