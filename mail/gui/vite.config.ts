import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3006,
    proxy: {
      "/api": {
        target: "http://localhost:3007",
        rewrite: (path: string): string => path.replace(/^\/api/, ""),
      },
    },
  },
});