import {type MutableRefObject} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

// Register ScrollTrigger to ensure it's available
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook to control GSAP animations based on scroll position.
 * Recreates the specific ScrollTrigger behavior:
 * - Resets/pauses the animation when scrolling back up past the bottom of the viewport.
 * - Plays the animation when scrolling down into view (top of element hits 60% of viewport height).
 *
 * @param triggerRef Mutable reference to the element acting as the trigger
 * @param animation The GSAP Timeline or Tween to control. Ensure this is memoized or stable to avoid unnecessary re-creations.
 */
export function useScrollTrigger(
  triggerRef: MutableRefObject<HTMLElement | null>,
  animation: gsap.core.Timeline | gsap.core.Tween | null | undefined,
) {
  useGSAP(
    () => {
      const triggerElement = triggerRef.current;

      // Return if required elements are missing
      if (!triggerElement || !animation) return;

      // Reset tl when scroll out of view past bottom of screen
      const leaveBackTrigger = ScrollTrigger.create({
        trigger: triggerElement,
        start: 'top bottom',
        onLeaveBack: () => {
          animation.progress(0);
          animation.pause();
        },
      });

      // Play tl when scrolled into view (60% from top of screen)
      const enterTrigger = ScrollTrigger.create({
        trigger: triggerElement,
        start: 'top 60%',
        onEnter: () => animation.play(),
      });

      // Cleanup triggers on unmount or deps change
      return () => {
        leaveBackTrigger.kill();
        enterTrigger.kill();
      };
    },
    {dependencies: [triggerRef, animation]},
  );
}
