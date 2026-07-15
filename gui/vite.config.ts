import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import { join } from "path";

export default defineConfig({
  plugins: [devtools(), solidPlugin()],
  resolve: {
    alias: {
      "~": join(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
