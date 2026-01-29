import {Suspense} from 'react';
import {MotionDiv, prefersReducedMotion} from '~/lib/motion';
import {cn} from '~/utils/cn';

export interface ScentNarrativeProps {
  narrative: string;
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

/**
 * Animation variants for scent narrative fade-in
 * GPU-composited properties ONLY (opacity)
 * Duration: 400ms, Delay: 100ms after reveal
 * Easing: --ease-out-expo cubic-bezier(0.16, 1, 0.3, 1)
 */
const narrativeVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4, // 400ms fade
      delay: 0.1, // 100ms after reveal
      ease: [0.16, 1, 0.3, 1] as const, // --ease-out-expo
    },
  },
};

/**
 * ScentNarrative - Display evocative scent narrative copy in texture reveal
 *
 * Features:
 * - GPU-composited opacity animation (400ms fade, 100ms delay)
 * - Dynamically imported Framer Motion (bundle budget protection)
 * - Reduced motion support (instant appearance)
 * - WCAG AA contrast via gradient backdrop
 * - Positioned at bottom of reveal container
 *
 * @param narrative - Evocative scent narrative copy to display
 * @param isVisible - Controls animation state (hidden/visible)
 * @param onAnimationComplete - Optional callback when animation completes
 */
export function ScentNarrative({
  narrative,
  isVisible,
  onAnimationComplete,
}: ScentNarrativeProps) {
  const shouldReduceMotion = prefersReducedMotion();

  return (
    <Suspense fallback={<StaticNarrative narrative={narrative} />}>
      <MotionDiv
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={shouldReduceMotion ? undefined : narrativeVariants}
        onAnimationComplete={onAnimationComplete}
        className={cn(
          // Positioning - absolute at bottom
          'absolute bottom-0 left-0 right-0',
          // Spacing
          'p-4',
          // Contrast enhancement - gradient backdrop
          'bg-gradient-to-t from-black/60 to-transparent',
          // Typography
          'text-fluid-body text-white',
          // Additional contrast - text shadow
          'text-shadow-lg',
          // Reduced motion fallback
          'motion-reduce:transition-none',
        )}
      >
        <p className="italic">{narrative}</p>
      </MotionDiv>
    </Suspense>
  );
}

/**
 * Static fallback when Framer Motion is still loading
 * Renders narrative without animation
 */
function StaticNarrative({narrative}: {narrative: string}) {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 right-0 p-4',
        'bg-gradient-to-t from-black/60 to-transparent',
      )}
    >
      <p className="text-fluid-body text-white italic">{narrative}</p>
    </div>
  );
}
