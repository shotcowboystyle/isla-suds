import Lenis from '@studio-freight/lenis';

// Keep track of the Lenis instance and RAF ID globally
let lenisInstance: Lenis | null = null;
let rafId: number | null = null;

/**
 * Initializes Lenis smooth scroll for desktop devices (≥1024px)
 * SSR-safe, respects prefers-reduced-motion, graceful fallback to native scroll
 *
 * @returns Lenis instance if initialized successfully, null otherwise
 */
export function initLenis(): Lenis | null {
  // SSR safety check
  if (typeof window === 'undefined') {
    return null;
  }

  // Desktop-only check (≥1024px breakpoint)
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  if (!isDesktop) {
    return null;
  }

  // Accessibility: respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  if (prefersReducedMotion) {
    return null;
  }

  try {
    // Initialize Lenis if not already initialized
    if (!lenisInstance) {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
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
    // Using console.warn per AC4: "no console errors are thrown"
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
      // Using console.warn per AC4: "no console errors are thrown"
      console.warn('Failed to destroy Lenis instance:', error);
      lenisInstance = null;
    }
  }
}

// Export Lenis type for external use
export type {Lenis};
