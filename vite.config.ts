import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      build: {
        sourcemap: false, // Prevent source maps from leaking code structure in production
      },
      server: {
        port: 3000,
        host: 'localhost', // Prevent exposing the dev server to the whole network
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
