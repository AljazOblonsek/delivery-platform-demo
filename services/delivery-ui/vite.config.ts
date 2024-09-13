/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig, PluginOption, ServerOptions } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import basicSsl from '@vitejs/plugin-basic-ssl';

// @ts-expect-error We can access environment in development
const enableMobileDev = process.env.ENABLE_MOBILE_DEV === 'true';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const plugins: PluginOption[] = [react(), tsConfigPaths()];

  if (enableMobileDev) {
    plugins.push(
      basicSsl({
        name: 'dp-demo-local-development',
      })
    );
  }

  const server: ServerOptions = {
    port: 3001,
    https: enableMobileDev,
    host: enableMobileDev,
  };

  if (enableMobileDev) {
    server.proxy = {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    };
  }

  return {
    plugins,
    server,
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
    },
  };
});
