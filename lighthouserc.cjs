/**
 * Lighthouse CI, desktop: the blocking gate.
 *
 * Expects an existing production build (`pnpm build`); `serve:lhci` starts
 * the preview without `--build` so CI does not build twice. Mobile is reported, not
 * enforced, from lighthouserc.mobile.cjs.
 *
 * No `lighthouse:recommended` preset: it errors on every insight audit, so the
 * gate would be red for reasons that are not regressions.
 */
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      // The server comes from the `serve:lhci` package script: lhci autorun
      // passes it as a flag, which overrides any startServerCommand here.
      startServerReadyPattern: 'server running',
      numberOfRuns: 3, // median of 3
      settings: {preset: 'desktop'},
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['warn', {minScore: 0.9}],
        'categories:seo': ['warn', {minScore: 0.9}],

        // Core Web Vitals. FID was removed from Lighthouse; TBT stands in for
        // input responsiveness in a lab run.
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        'total-blocking-time': ['warn', {maxNumericValue: 300}],
        'first-contentful-paint': ['warn', {maxNumericValue: 2000}],
        'speed-index': ['warn', {maxNumericValue: 3500}],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
