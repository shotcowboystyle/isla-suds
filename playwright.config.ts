import {defineConfig, devices} from '@playwright/test';

/**
 * Playwright Configuration
 *
 * - E2E tests: tests/e2e/
 * - Accessibility tests: tests/accessibility/
 * - Performance tests: tests/performance/
 *
 * See https://playwright.dev/docs/test-configuration
 */

// Stable URL from `pnpm preview` (portless), so parallel sessions never fight over ports.
const previewUrl = 'http://isla-suds-preview.localhost:1355';

export default defineConfig({
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI for stability
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: process.env.CI
    ? [['html'], ['github'], ['list']]
    : [['html'], ['list']],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || previewUrl,

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    // Accessibility tests - critical for WCAG 2.1 AA compliance (AC5)
    {
      name: 'accessibility',
      testDir: './tests/accessibility',
      use: {
        ...devices['Desktop Chrome'],
        // Accessibility tests should be thorough
        trace: 'on',
      },
    },

    // E2E tests - full user journeys
    {
      name: 'chromium',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Safari'],
      },
    },

    // Mobile testing
    {
      name: 'mobile-chrome',
      testDir: './tests/e2e',
      use: {
        ...devices['Pixel 5'],
      },
    },

    {
      name: 'mobile-safari',
      testDir: './tests/e2e',
      use: {
        ...devices['iPhone 12'],
      },
    },

    // Performance tests
    {
      name: 'performance',
      testDir: './tests/performance',
      use: {
        ...devices['Desktop Chrome'],
        // Performance tests need clean state
        trace: 'off',
      },
    },
  ],

  // Start the preview server unless BASE_URL points at one already running.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'pnpm preview',
        // Not `url`: Node can't resolve *.localhost on macOS, only browsers can.
        wait: {stderr: /server running/},
        // portless only tears down its child tree on SIGINT; the default SIGKILL orphans it.
        gracefulShutdown: {signal: 'SIGINT', timeout: 10_000},
        timeout: 300 * 1000,
      },
});
