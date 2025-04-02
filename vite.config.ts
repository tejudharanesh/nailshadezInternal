import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Expense Tracker",
        short_name: "ExpenseTracker",
        description: "Track your daily, weekly, and monthly expenses",
        theme_color: "#ffffff",
        icons: [
          {
            src: "./public/icons/icon.jpg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./public/icons/icon.jpg",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),

    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
