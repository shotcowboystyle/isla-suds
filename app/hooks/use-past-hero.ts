import {useEffect, useState, type RefObject} from 'react';

/**
 * Custom hook to detect when a hero section has scrolled past the viewport
 * using Intersection Observer (no scroll event listeners).
 *
 * Per Story 2.5 and app/lib/scroll.ts policy:
 * - Uses IntersectionObserver only
 * - No scroll event listeners
 * - Returns boolean: true when hero is past viewport (not intersecting)
 *
 * @param heroRef - React ref to the hero section element
 * @returns boolean - true when hero has exited viewport, false when in viewport
 */
export function usePastHero(heroRef: RefObject<HTMLElement>): boolean {
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;

    // Create IntersectionObserver to detect when hero exits viewport
    // threshold: 0 means trigger when ANY part enters/exits viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When hero is NOT intersecting, we're past it
          // When hero IS intersecting, we're at/near it
          setIsPastHero(!entry.isIntersecting);
        });
      },
      {
        threshold: 0,
      },
    );

    observer.observe(heroElement);

    // Cleanup on unmount
    return () => {
      observer.disconnect();
    };
  }, [heroRef]);

  return isPastHero;
}
