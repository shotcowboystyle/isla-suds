import {useEffect, useState, useRef, type RefObject} from 'react';

/**
 * Custom hook to detect when a story fragment element is visible in the viewport
 * using Intersection Observer (per app/lib/scroll.ts IO-only policy).
 *
 * Triggers when element is at least 50% visible, and remains true once triggered
 * (animation should only happen once, per AC1).
 *
 * @param elementRef - React ref to the element to observe
 * @returns boolean indicating if element is/was visible (50%+ in viewport)
 *
 * @example
 * ```typescript
 * function StoryFragmentContainer({ fragment }) {
 *   const fragmentRef = useRef<HTMLElement>(null);
 *   const isVisible = useStoryFragmentVisibility(fragmentRef);
 *
 *   return (
 *     <article ref={fragmentRef} style={{ opacity: isVisible ? 1 : 0 }}>
 *       {fragment.content}
 *     </article>
 *   );
 * }
 * ```
 */
export function useStoryFragmentVisibility(
  elementRef: RefObject<HTMLElement>,
): boolean {
  const [isVisible, setIsVisible] = useState(false);
  // Track whether fragment has been shown to trigger animation only once (AC1)
  const hasShownRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;

    // Early return if:
    // - IntersectionObserver not available (SSR safety - AC5)
    // - Element ref not available
    // - Already shown (trigger only once)
    if (
      typeof IntersectionObserver === 'undefined' ||
      !element ||
      hasShownRef.current
    ) {
      return;
    }

    // Create IntersectionObserver with threshold: 0.5 (50% visible - AC1)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger when element is 50%+ visible and hasn't been shown yet
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.5 &&
            !hasShownRef.current
          ) {
            setIsVisible(true);
            hasShownRef.current = true;
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of element is visible
      },
    );

    observer.observe(element);

    // Cleanup on unmount (AC5)
    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return isVisible;
}
