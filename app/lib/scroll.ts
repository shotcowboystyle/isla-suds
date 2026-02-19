import type Lenis from 'lenis';

// Keep track of the Lenis instance and RAF ID globally
let lenisInstance: Lenis | null = null;
let rafId: number | null = null;

/**
 * SCROLL-LINKED ANIMATIONS POLICY (Story 2.2)
 *
 * ⚠️ IMPORTANT: All scroll-linked animations MUST use Intersection Observer, NOT scroll event listeners.
 *
 * WHY:
 * - Scroll listeners run on the main thread and cause jank during scroll
 * - Intersection Observer runs off-main-thread and is more efficient
 * - Better performance for animations, visibility detection, and scroll-triggered behavior
 *
 * IMPLEMENTATION:
 * - Use IntersectionObserver for "in view" detection
 * - Use IntersectionObserver for triggering animations when elements enter/exit viewport
 * - Story 2.5 (Sticky Header) will use IO for "past hero" detection
 * - Story 4.1 (Story Fragments) will use IO for scroll-triggered content
 *
 * DO NOT:
 * - window.addEventListener('scroll', ...) for animation/visibility logic
 * - Check scroll position in RAF loops for triggering UI changes
 *
 * EXCEPTIONS:
 * - Scroll position for Lenis itself (handled by Lenis library internally)
 * - Resize events (for responsive behavior, not animation)
 */

/**
 * Initializes Lenis smooth scroll for desktop devices (≥1024px)
 * SSR-safe, respects prefers-reduced-motion, graceful fallback to native scroll
 * Dynamically imports Lenis so mobile users don't pay the bundle cost.
 *
 * @returns Lenis instance if initialized successfully, null otherwise
 */
export async function initLenis(): Promise<Lenis | null> {
  // SSR safety check
  if (typeof window === 'undefined') {
    return null;
  }

  // Desktop-only check (≥1024px breakpoint)
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

      lenisInstance = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 0.8,
        gestureOrientation: 'vertical',
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: false,
      });

      // Start the requestAnimationFrame loop
      function raf(time: number) {
        lenisInstance?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }

    return lenisInstance;
  } catch (error) {
    // Graceful fallback - log warning but don't break user experience
    // Using console.warn per AC5: "no console.error that breaks flow"
    console.warn('Failed to initialize Lenis smooth scroll:', error);
    return null;
  }
}

/**
 * Destroys the Lenis instance and cancels the RAF loop
 * Safe to call multiple times
 */
export function destroyLenis(): void {
  // Cancel the RAF loop
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  // Destroy the Lenis instance
  if (lenisInstance) {
    try {
      lenisInstance.destroy();
      lenisInstance = null;
    } catch (error) {
      // Graceful error handling - ensure cleanup happens
      // Using console.warn per AC5: "no console.error that breaks flow"
      console.warn('Failed to destroy Lenis instance:', error);
      lenisInstance = null;
    }
  }
}

// Export Lenis type for external use
export type {Lenis};
