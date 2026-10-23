import { createServer, type ViteDevServer } from "vite";

const server: ViteDevServer = await createServer({
  configFile: false,
  appType: "custom",
  logLevel: "error",
  cacheDir: "node_modules/.vite-seed",
  optimizeDeps: { noDiscovery: true },
  ssr: { optimizeDeps: { noDiscovery: true } },
  server: { middlewareMode: true },
});

try {
  await server.ssrLoadModule("/scripts/seedData.mts");
} finally {
  await server.close();
}
