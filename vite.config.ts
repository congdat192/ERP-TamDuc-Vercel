
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy KiotViet API calls to avoid CORS issues
      '/api/kiotviet': {
        target: 'https://public.kiotapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kiotviet/, ''),
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔴 [proxy] Error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🚀 [proxy] Request:', req.method, req.url, '→', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('📨 [proxy] Response:', proxyRes.statusCode, 'for', req.url);
            console.log('📨 [proxy] Headers:', proxyRes.headers);
          });
        },
        headers: {
          'User-Agent': 'ERP-System/1.0',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    }
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
  },
}));
