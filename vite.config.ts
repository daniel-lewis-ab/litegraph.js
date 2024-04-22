import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { fileURLToPath } from 'url';
import { VitePluginRadar } from 'vite-plugin-radar';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      checker({
        overlay: false,
        typescript: true,
      }),
      VitePluginRadar({
        // Google Analytics tag injection
        analytics: {
          id: env.VITE_GOOGLE_ANALYTICS_ID,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // '@': path.resolve(__dirname, './src'),
      },
      // [
      // {
      //   find: '@',
      //   replacement: fileURLToPath(new URL('./src', import.meta.url))
      // },
      // ]
    },
    ssgOptions: {
      mock: true,
    },
  };
});
