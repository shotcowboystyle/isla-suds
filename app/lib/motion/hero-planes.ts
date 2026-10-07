import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {MOTION_QUERY, SCRUB_SCENE} from './tokens';
import type {RefObject} from 'react';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Scroll: the whole hero recedes, and inside it every `[data-travel]` plane
 * moves at its own rate (viewport heights across the hero's exit), so layers
 * separate from each other instead of sliding as one picture.
 */
export function useHeroTravel(
  sectionRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>,
  travel: Record<string, number>,
) {
  useGSAP(
    () => {
      const section = sectionRef.current;
      const container = containerRef.current;
      if (!section || !container) return;

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        const tl = GSAP.timeline({
          defaults: {ease: 'none'},
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: SCRUB_SCENE,
            invalidateOnRefresh: true,
          },
        });

        tl.to(container, {rotate: 4, scale: 0.94, yPercent: 18}, 0);

        section.querySelectorAll<HTMLElement>('[data-travel]').forEach((plane) => {
          const vh = travel[plane.dataset.travel ?? ''] ?? 0;
          tl.to(plane, {y: () => (vh / 100) * window.innerHeight}, 0);
        });
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );
}

/**
 * Pointer: every `[data-lean]` element leans toward the cursor by its depth's
 * strength (px at the viewport edge). Desktop pointers only.
 */
export function useHeroLean(sectionRef: RefObject<HTMLElement | null>, strength: Record<string, number>) {
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = GSAP.matchMedia();

      mm.add(`(hover: hover) and (pointer: fine) and ${MOTION_QUERY}`, () => {
        const leans = Array.from(section.querySelectorAll<HTMLElement>('[data-lean]')).map((el) => ({
          strength: strength[el.dataset.lean ?? ''] ?? 0,
          x: GSAP.quickTo(el, 'x', {duration: 0.9, ease: 'power3'}),
          y: GSAP.quickTo(el, 'y', {duration: 0.9, ease: 'power3'}),
        }));

        const onMove = (e: PointerEvent) => {
          const mx = (e.clientX / window.innerWidth) * 2 - 1;
          const my = (e.clientY / window.innerHeight) * 2 - 1;
          leans.forEach((lean) => {
            lean.x(mx * lean.strength);
            lean.y(my * lean.strength);
          });
        };

        section.addEventListener('pointermove', onMove);
        return () => section.removeEventListener('pointermove', onMove);
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );
}
