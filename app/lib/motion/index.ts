/**
 * Helper function to check if user prefers reduced motion
 * Returns true if animations should be disabled
 * SSR-safe with error handling
 */
export function prefersReducedMotion(): boolean {
  // SSR-safe check
  if (typeof window === 'undefined') return false;

  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    // Safe fallback if matchMedia fails (rare edge cases)
    return false;
  }
}
