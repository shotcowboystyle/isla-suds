/**
 * Performance API utilities for texture reveal timing instrumentation
 *
 * Implements Performance API marks and measures for <100ms texture reveal
 * performance contract (AC2, AC3).
 *
 * Usage:
 * ```typescript
 * await measureTextureReveal(async () => {
 *   // Trigger texture reveal animation
 * });
 *
 * const timing = getTextureRevealTiming();
 * console.log(`Reveal took ${timing}ms`);
 * ```
 *
 * CRITICAL: This is used in CI to verify p95 < 100ms (performance contract)
 */

/**
 * Measures texture reveal timing using Performance API
 *
 * Creates performance marks at start and end, then creates a measure
 * for the total duration. This allows:
 * - Real-time performance monitoring
 * - Analytics tracking of reveal performance
 * - CI verification that p95 < 100ms
 *
 * @param callback - Async function to execute between marks
 * @returns Promise that resolves when callback completes
 * @throws Re-throws any error from callback after creating marks
 *
 * @example
 * await measureTextureReveal(async () => {
 *   setIsRevealing(true);
 *   await animateReveal();
 * });
 */
export async function measureTextureReveal(
  callback: () => Promise<void>,
): Promise<void> {
  // SSR-safe check
  if (typeof performance === 'undefined') {
    // No-op on server, just execute callback
    await callback();
    return;
  }

  try {
    // Mark start of texture reveal
    performance.mark('texture-reveal-start');

    // Execute the reveal callback
    await callback();

    // Mark end of texture reveal
    performance.mark('texture-reveal-end');

    // Create measure from start to end
    performance.measure(
      'texture-reveal',
      'texture-reveal-start',
      'texture-reveal-end',
    );
  } catch (error) {
    // Even if callback fails, try to mark the end for timing data
    try {
      performance.mark('texture-reveal-end');
    } catch {
      // Safe to ignore: mark creation may fail if start mark missing
    }

    // Re-throw the original error
    throw error;
  }
}

/**
 * Gets the most recent texture reveal timing in milliseconds
 *
 * Returns the duration of the most recent texture reveal measurement.
 * Used for:
 * - Analytics reporting
 * - Performance debugging
 * - Test assertions
 *
 * @returns Duration in milliseconds, or null if no measurements exist
 *
 * @example
 * const timing = getTextureRevealTiming();
 * if (timing && timing > 100) {
 *   console.warn('Texture reveal exceeded 100ms threshold');
 * }
 */
export function getTextureRevealTiming(): number | null {
  // SSR-safe check
  if (typeof performance === 'undefined') {
    return null;
  }

  try {
    // Get all texture-reveal measurements
    const measures = performance.getEntriesByName('texture-reveal', 'measure');

    if (measures.length === 0) {
      return null;
    }

    // Return the most recent measurement
    const latestMeasure = measures[measures.length - 1];
    return latestMeasure.duration;
  } catch {
    // Safe fallback if Performance API access fails
    return null;
  }
}

/**
 * Clears all texture reveal performance marks and measures
 *
 * Useful for:
 * - Test cleanup
 * - Resetting metrics between sessions
 * - Memory management for long-running sessions
 *
 * @example
 * // Clean up after tests
 * clearTextureRevealTiming();
 */
export function clearTextureRevealTiming(): void {
  // SSR-safe check
  if (typeof performance === 'undefined') {
    return;
  }

  try {
    performance.clearMarks('texture-reveal-start');
    performance.clearMarks('texture-reveal-end');
    performance.clearMeasures('texture-reveal');
  } catch {
    // Safe to ignore: cleanup is best-effort
  }
}
