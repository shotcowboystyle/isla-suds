import {lazy} from 'react';

import type {HTMLMotionProps} from 'framer-motion';

/**
 * Dynamically imported Framer Motion components
 * NEVER use static imports - protects <200KB bundle budget
 *
 * Pattern from project-context.md:
 * - Dynamic import via React.lazy()
 * - SSR-safe (no window access during SSR)
 * - Graceful fallback if import fails
 */

// Core motion components (lazy-loaded)
// Error handling via Suspense + Error Boundary at usage site (AC4)
export const MotionDiv = lazy(() =>
  import('framer-motion').then((m) => ({default: m.motion.div})),
);

export const MotionSection = lazy(() =>
  import('framer-motion').then((m) => ({default: m.motion.section})),
);

export const MotionArticle = lazy(() =>
  import('framer-motion').then((m) => ({default: m.motion.article})),
);

export const MotionSpan = lazy(() =>
  import('framer-motion').then((m) => ({default: m.motion.span})),
);

/**
 * Type exports for motion component props
 * Use these when building components that accept motion props
 */
export type MotionDivProps = HTMLMotionProps<'div'>;
export type MotionSectionProps = HTMLMotionProps<'section'>;
export type MotionArticleProps = HTMLMotionProps<'article'>;
export type MotionSpanProps = HTMLMotionProps<'span'>;

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

/**
 * Animation variants for common patterns
 * Use with motion components via `variants` prop
 */
export const fadeInVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1},
};

export const scaleInVariants = {
  hidden: {opacity: 0, scale: 0.95},
  visible: {opacity: 1, scale: 1},
};

export const slideUpVariants = {
  hidden: {opacity: 0, y: 20},
  visible: {opacity: 1, y: 0},
};
