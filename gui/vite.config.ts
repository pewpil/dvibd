import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3002",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});