
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Add mainFields to help resolve directory imports properly
    mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
  },
  // Base path configuration for production
  base: "/",
  build: {
    // Generate source maps for production build
    sourcemap: false,
    // Output directory - this is the default
    outDir: "dist",
    // Configure rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@/components/ui/button', '@/components/ui/input', '@/components/ui/card'], // Specify exact component files instead of the directory
        },
      },
    },
  },
}));
