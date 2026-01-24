import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import fs from 'fs';
import path from 'path';
// import basicSsl from "@vitejs/plugin-basic-ssl";
// https://vite.dev/config/

// HTTPS configuration
const useHttps = process.env.USE_HTTPS === 'true';
let httpsConfig = undefined;

if (useHttps) {
  const certPath = process.env.SSL_CERT_PATH || path.resolve(__dirname, '../certs/localhost-cert.pem');
  const keyPath = process.env.SSL_KEY_PATH || path.resolve(__dirname, '../certs/localhost-key.pem');

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    httpsConfig = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    console.log('🔒 HTTPS enabled for Vite dev server');
  } else {
    console.warn('⚠️  SSL certificates not found at:', { certPath, keyPath });
  }
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      srcDir: "./src/",
      filename: "sw.ts",
      manifest: {
        name: 'medicine bank',
        short_name: 'mid-bank',
        description: 'My Awesome App description',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },

          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
      },
      strategies: "injectManifest",
      injectRegister: "auto",
      registerType: "autoUpdate",
      pwaAssets: {
        disabled: false,
        config: true,
      },
      includeAssets: ["**/*"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
      },
      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        type: "module",
      },
    }),
    tsconfigPaths(),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
    // basicSsl(),
  ],
  server: {
    watch: { usePolling: true },
    port: parseInt(process.env.UI_PORT || '5001'),
    host: '0.0.0.0',
    https: httpsConfig,
    // hmr: { overlay: false },
    // hmr: {
    //   // protocol: useHttps ? 'wss' : 'ws',
    //   // host: 'localhost',
    //   // port: parseInt(process.env.UI_PORT || '5001'),
    //   clientPort: parseInt(process.env.UI_PORT || '5001'),
    // },
  },
  optimizeDeps: {
    exclude: ["sqlocal"],
  },
  worker: {
    format: 'es',
  },
});
