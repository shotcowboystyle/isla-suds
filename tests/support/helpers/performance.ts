/**
 * Performance Measurement Helpers
 *
 * Utilities for measuring and asserting on performance metrics.
 * Supports texture reveal <100ms requirement from project-context.md.
 */

import type {Page} from '@playwright/test';

/**
 * Performance measurement result
 */
export type PerformanceMeasurement = {
  name: string;
  duration: number;
  startTime: number;
  entryType: string;
};

/**
 * Measure performance using browser Performance API
 *
 * @example
 * // In test code:
 * await page.evaluate(() => {
 *   performance.mark('texture-reveal-start');
 * });
 * // ... trigger reveal animation ...
 * await page.evaluate(() => {
 *   performance.mark('texture-reveal-end');
 *   performance.measure('texture-reveal', 'texture-reveal-start', 'texture-reveal-end');
 * });
 *
 * const measurements = await getPerformanceMeasurements(page, 'texture-reveal');
 * expect(measurements[0].duration).toBeLessThan(100);
 */
export async function getPerformanceMeasurements(
  page: Page,
  measurementName: string,
): Promise<PerformanceMeasurement[]> {
  return page.evaluate((name) => {
    const entries = performance.getEntriesByName(
      name,
      'measure',
    ) as PerformanceMeasure[];
    return entries.map((entry) => ({
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime,
      entryType: entry.entryType,
    }));
  }, measurementName);
}

/**
 * Calculate p95 (95th percentile) from duration measurements
 *
 * @example
 * const durations = measurements.map(m => m.duration);
 * const p95 = calculateP95(durations);
 * expect(p95).toBeLessThan(100); // p95 < 100ms
 */
export function calculateP95(durations: number[]): number {
  if (durations.length === 0) {
    throw new Error('Cannot calculate p95 from empty array');
  }

  const sorted = [...durations].sort((a, b) => a - b);
  const index = Math.ceil(sorted.length * 0.95) - 1;
  return sorted[Math.max(0, index)];
}

/**
 * Calculate average duration
 */
export function calculateAverage(durations: number[]): number {
  if (durations.length === 0) {
    throw new Error('Cannot calculate average from empty array');
  }

  return durations.reduce((sum, d) => sum + d, 0) / durations.length;
}

/**
 * Calculate median duration
 */
export function calculateMedian(durations: number[]): number {
  if (durations.length === 0) {
    throw new Error('Cannot calculate median from empty array');
  }

  const sorted = [...durations].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}

/**
 * Clear all performance marks and measures
 *
 * @example
 * await clearPerformanceMarks(page);
 */
export async function clearPerformanceMarks(page: Page): Promise<void> {
  await page.evaluate(() => {
    performance.clearMarks();
    performance.clearMeasures();
  });
}

/**
 * Get Core Web Vitals from page
 *
 * @example
 * const vitals = await getCoreWebVitals(page);
 * expect(vitals.LCP).toBeLessThan(2500); // LCP < 2.5s
 */
export async function getCoreWebVitals(page: Page): Promise<{
  LCP?: number;
  FID?: number;
  CLS?: number;
  FCP?: number;
  TTFB?: number;
}> {
  return page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals: Record<string, number> = {};

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        vitals.LCP = lastEntry.renderTime || lastEntry.loadTime;
      }).observe({type: 'largest-contentful-paint', buffered: true});

      // First Input Delay (requires user interaction)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          vitals.FID = entry.processingStart - entry.startTime;
        });
      }).observe({type: 'first-input', buffered: true});

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            vitals.CLS = clsValue;
          }
        }
      }).observe({type: 'layout-shift', buffered: true});

      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          vitals.FCP = entry.startTime;
        });
      }).observe({type: 'paint', buffered: true});

      // Time to First Byte
      const navEntry = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      if (navEntry) {
        vitals.TTFB = navEntry.responseStart;
      }

      // Give observers time to collect metrics
      setTimeout(() => resolve(vitals), 500);
    });
  });
}
