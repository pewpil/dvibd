import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [devtools(), solidPlugin()],
  resolve: {
    alias: {
      '@components': join(__dirname, 'src', 'components'),
      '@pages': join(__dirname, 'src', 'pages'),
      '@public': join(__dirname, 'public'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
