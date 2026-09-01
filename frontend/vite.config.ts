import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_PORT ?? 5173);
  const nestUrl = env.NEST_URL ?? 'http://localhost:3000';

  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port,
      strictPort: true,
      proxy: {
        // Proxy everything except Vite's own module/HMR paths to the Nest backend.
        '^/(?!(@vite|@fs|@id|src|node_modules)/|favicon.ico)': {
          target: nestUrl,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: '../public',
      emptyOutDir: true,
    },
  };
});