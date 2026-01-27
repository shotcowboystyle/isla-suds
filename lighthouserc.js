export default {
  ci: {
    collect: {
      // Run Lighthouse against local preview server
      url: ['http://localhost:3000'],
      startServerCommand: 'pnpm preview',
      numberOfRuns: 3, // Run 3 times and take median
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance category
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['warn', {minScore: 0.9}],
        'categories:seo': ['warn', {minScore: 0.9}],

        // Core Web Vitals (AC4)
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}], // LCP <2.5s
        'first-input-delay': ['error', {maxNumericValue: 100}], // FID <100ms
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}], // CLS <0.1

        // Additional performance metrics
        'first-contentful-paint': ['warn', {maxNumericValue: 2000}],
        'speed-index': ['warn', {maxNumericValue: 3500}],
        'total-blocking-time': ['warn', {maxNumericValue: 300}],
        'interactive': ['warn', {maxNumericValue: 3800}],

        // Avoid aggressive resource hints that aren't used
        'uses-rel-preconnect': 'off',
        'uses-rel-preload': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
