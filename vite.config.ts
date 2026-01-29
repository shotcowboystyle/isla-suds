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

export default defineConfig(({mode}) => ({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    tsconfigPaths(),
    setupPlugins({
      cache: true,
      lqip: {type: 'thumbhash'},
      include: /^[^?]+\.(jpg|jpeg|png)\?.*responsive.*$/,
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
    ...(process.env.ANALYZE
      ? [analyzer({openAnalyzer: true, analyzerMode: 'static'})]
      : []),
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
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        onwarn(warning: any, warn: any) {
          //console.log(inspect(warning, { depth: 5, colors: true }))
          // Suppress ResponsiveImage sourcemap warnings
          if (
            warning.code === 'SOURCEMAP_BROKEN' &&
            warning.plugin !== undefined &&
            warning.plugin.startsWith('responsive-image/')
          ) {
            return;
          }
          warn(warning);
        },
        output: {
          hashCharacters: 'base36',
          chunkFileNames: 'lib/[hash].js',
          entryFileNames: 'lib/[hash].js',
          assetFileNames(chunkInfo: any) {
            if (chunkInfo.names.some((x: any) => x.endsWith('.css'))) {
              return 'lib/[hash].[ext]';
            }
            if (
              chunkInfo.names.some(
                (x: any) => x.endsWith('.jpg') || x.endsWith('.jpeg'),
              )
            ) {
              // rename jpeg files
              return 'lib/[hash].jpeg';
            }
            return 'lib/[hash].[ext]';
          },

          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'router-vendor': ['react-router'],
            'ui-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-navigation-menu',
            ],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            // 'chart-vendor': ['recharts'],
            'utils-vendor': [
              // 'date-fns',
              'clsx',
              'tailwind-merge',
              'class-variance-authority',
            ],
          },
        },
      },
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
      include: ['expect-type', 'set-cookie-parser', 'cookie', 'react-router'],
      noExternals: ['@responsive-image/react'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
}));
