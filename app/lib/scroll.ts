import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

GSAP.registerPlugin(ScrollTrigger);

// Keep track of the Lenis instance and its ticker callback globally
let lenisInstance: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

/**
 * SCROLL-LINKED ANIMATIONS POLICY (Story 2.2)
 *
 * ⚠️ IMPORTANT: All scroll-linked animations MUST use Intersection Observer or
 * GSAP ScrollTrigger, NOT raw scroll event listeners.
 *
 * WHY:
 * - Scroll listeners run on the main thread and cause jank during scroll
 * - Intersection Observer runs off-main-thread and is more efficient
 * - ScrollTrigger batches its reads/writes against a single ticker
 *
 * DO NOT:
 * - window.addEventListener('scroll', ...) for animation/visibility logic
 * - Run a second requestAnimationFrame loop alongside gsap.ticker
 *
 * EXCEPTIONS:
 * - Resize events (for responsive behavior, not animation)
 */

/**
 * Initializes Lenis smooth scroll for desktop devices (≥1024px) and drives it
 * from `gsap.ticker`.
 *
 * Lenis interpolates away from the native scroll position, so ScrollTrigger
 * must be told about the smoothed value (`lenis.on('scroll', ...)`) and both
 * must advance on the same clock. Running Lenis on its own requestAnimationFrame
 * leaves every scrubbed tween a frame behind the position the user sees.
 *
 * SSR-safe, respects prefers-reduced-motion, graceful fallback to native scroll.
 * Dynamically imports Lenis so mobile users don't pay the bundle cost.
 *
 * @returns Lenis instance if initialized successfully, null otherwise
 */
export async function initLenis(): Promise<Lenis | null> {
  // SSR safety check
  if (typeof window === 'undefined') {
    return null;
  }

  // Desktop-only check (≥1024px breakpoint). Touch devices keep native
  // momentum scrolling, which feels better than a wheel-tuned lerp.
  if (!window.matchMedia('(min-width: 1024px)').matches) {
    return null;
  }

  // Accessibility: respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  try {
    // Initialize Lenis if not already initialized
    if (!lenisInstance) {
      const {default: Lenis} = await import('lenis');

      // `lerp` and `duration` are mutually exclusive — passing both silently
      // discards `duration`. Only `lerp` is set here.
      lenisInstance = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 0.9,
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });

      // Feed the smoothed scroll position to ScrollTrigger.
      lenisInstance.on('scroll', ScrollTrigger.update);

      // One clock for both. gsap.ticker takes seconds, Lenis takes milliseconds.
      tick = (time: number) => lenisInstance?.raf(time * 1000);
      GSAP.ticker.add(tick);

      // Lag smoothing pauses the ticker after a long frame, which desyncs Lenis
      // from ScrollTrigger for the frames that follow.
      GSAP.ticker.lagSmoothing(0);
    }

    return lenisInstance;
  } catch (error) {
    // Safe to continue: Lenis is a progressive enhancement, native scroll works as fallback
    return null;
  }
}

/**
 * Returns the live Lenis instance, or null when smooth scroll is not active
 * (mobile, reduced motion, or before initialization).
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Destroys the Lenis instance and detaches it from the GSAP ticker
 * Safe to call multiple times
 */
export function destroyLenis(): void {
  if (tick) {
    GSAP.ticker.remove(tick);
    tick = null;
    // Restore GSAP's defaults now that nothing depends on a steady ticker.
    GSAP.ticker.lagSmoothing(500, 33);
  }

  // Destroy the Lenis instance
  if (lenisInstance) {
    try {
      lenisInstance.destroy();
      lenisInstance = null;
    } catch (_error) {
      // Safe to continue: ensure cleanup finishes regardless
      lenisInstance = null;
    }
  }
}

// Export Lenis type for external use
export type {Lenis};
