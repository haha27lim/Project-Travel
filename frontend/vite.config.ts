import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'TravelBloom',
          short_name: 'TravelBloom',
          description: 'Your travel planning companion',
          theme_color: '#ffffff',
          icons: [
            {
              "src": "/icon-48x48.png",
              "sizes": "48x48",
              "type": "image/png"
            },
            {
              "src": "/icon-72x72.png",
              "sizes": "72x72",
              "type": "image/png"
            },
            {
              "src": "/icon-96x96.png",
              "sizes": "96x96",
              "type": "image/png"
            },
            {
              "src": "/icon-144x144.png",
              "sizes": "144x144",
              "type": "image/png"
            },
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'maskable'
            }
          ],
          screenshots: [
            {
              src: '/screenshot-desktop.png',
              sizes: '1920x1080',
              type: 'image/png',
              form_factor: 'wide'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      include: ["antd", "@ant-design/icons", "moment"],
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          ws: true
        },
      },
    },
  };
});
