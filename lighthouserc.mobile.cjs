/**
 * Lighthouse CI, mobile (throttled): reported, never blocking.
 *
 * Mobile performance sits well below the desktop gate (about 0.5 when this was
 * added), so every threshold here is a warning. Promote to `error` once mobile
 * catches up. Same server and build expectations as lighthouserc.cjs.
 */
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      // The server comes from the `serve:lhci` package script: lhci autorun
      // passes it as a flag, which overrides any startServerCommand here.
      startServerReadyPattern: 'server running',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.9}],
        'categories:accessibility': ['warn', {minScore: 0.9}],
        'largest-contentful-paint': ['warn', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['warn', {maxNumericValue: 0.1}],
        'total-blocking-time': ['warn', {maxNumericValue: 300}],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
