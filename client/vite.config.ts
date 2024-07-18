import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { UserConfig } from "vite"; // Importa o tipo UserConfig

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
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
