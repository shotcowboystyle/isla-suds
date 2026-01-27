import path from 'path';
import {reactRouter} from '@react-router/dev/vite';
import { setupPlugins } from "@responsive-image/vite-plugin";
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'
import { analyzer } from 'vite-bundle-analyzer'
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig(({mode}) => ({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    tsconfigPaths(),
    setupPlugins({
      format: ["original", "webp"],
      include: /^[^?]+\.(jpe?g|png|webp)\?.*responsive.*$/,
      lqip: { type: "color" },
    }),
    ...(process.env.ANALYZE ? [analyzer({ openAnalyzer: true, analyzerMode: 'static' })] : []),
    // Skip React Router plugin in test mode to avoid processing test files
    ...(mode !== 'test' ? [reactRouter()] : react()),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
    },
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
    rollupOptions: {
      treeshake: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      '**/tests/**', // Exclude Playwright e2e tests
    ],
    typecheck: {
      tsconfig: path.resolve(__dirname, './tsconfig.spec.json'),
    },
  },
  define: {
    global: {},
    "process.env": {}
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
}));
