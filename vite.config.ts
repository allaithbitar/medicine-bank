import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      srcDir: "./src/",
      filename: "sw.ts",
      manifest: {
        name: "mid-lab",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
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
  ],
  server: {
    port: 5000,
  },
});
