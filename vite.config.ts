import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { fileURLToPath } from 'url';
import { VitePluginRadar } from 'vite-plugin-radar';
import child_process from 'child_process';

const commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      __COMMIT_HASH__: JSON.stringify(commitHash),
    },
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
      },
    },
    ssgOptions: {
      mock: true,
    },
    build: {
      sourcemap: true,
    },
  };
});
