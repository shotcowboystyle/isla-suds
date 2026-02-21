import path from 'path';
import {reactRouter} from '@react-router/dev/vite';
import {setupPlugins} from '@responsive-image/vite-plugin';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {analyzer} from 'vite-bundle-analyzer';
import {ViteImageOptimizer} from 'vite-plugin-image-optimizer';
import tsconfigPaths from 'vite-tsconfig-paths';
import {defineConfig} from 'vitest/config';

export default defineConfig(({mode, isSsrBuild}) => ({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    tsconfigPaths(),
    setupPlugins({
      cache: true,
      lqip: {type: 'thumbhash'},
      include: /^[^?]+\.(jpg|jpeg|png|webp)\?.*responsive.*$/,
      w: [320, 640, 768, 1024, 1280, 1920],
      format: ['original', 'avif', 'webp'],
    }),
    ViteImageOptimizer({
      cache: true,
      cacheLocation: '.build/image-cache',
      png: {quality: 80},
      jpeg: {quality: 75},
      jpg: {quality: 75},
      webp: {quality: 80, lossless: false},
      avif: {quality: 70, lossless: false},
      svg: {
        plugins: [{name: 'removeViewBox'}, {name: 'sortAttrs'}],
      },
    }),
    ...(process.env.ANALYZE ? [analyzer({openAnalyzer: true, analyzerMode: 'static'})] : []),
    // Skip React Router plugin in test mode to avoid processing test files
    ...(mode !== 'test' ? [reactRouter()] : react()),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
    },
  },
  build: {
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps for smaller bundles
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild
          ? undefined
          : (id) => {
              if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) {
                return 'gsap';
              }
              if (id.includes('node_modules/@responsive-image')) {
                return 'responsive-image';
              }
              if (id.includes('node_modules/tailwind-merge') || id.includes('node_modules/clsx')) {
                return 'tw-utils';
              }
            },
      },
    },
    commonjsOptions: {transformMixedEsModules: true},
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.build/**',
      '**/guides/**',
      '**/.claude/**',
      '**/.cursor/**',
      '**/.gemini/**',
      '**/.github/**',
      '**/.serena/**',
      '**/.vscode/**',
      '**/docs/**',
      '**/scripts/**',
      '**/_bmad-output/**',
      '**/_bmad/**',
      '**/.react-router/**', // Generated route types (e.g. +types/_index.test.ts)
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
    'process.env': {},
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
      noExternals: ['@responsive-image/react'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
}));
