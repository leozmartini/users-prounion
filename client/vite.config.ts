import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { UserConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:8000",
        rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },

  plugins: [react()],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
} as UserConfig);
