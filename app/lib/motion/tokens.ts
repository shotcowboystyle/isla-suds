/**
 * The landing page's motion vocabulary.
 *
 * Every scroll-triggered section imports from here so reveals share one rhythm
 * and one trigger line. Changing a value here retunes the whole page.
 */

/** Viewport line where a section's reveal fires. One value for the whole page. */
export const REVEAL_START = 'top 82%';

/** Entrance easing — deceleration only, no bounce or overshoot. */
export const ENTER_EASE = 'power4.out';

export const ENTER_DURATION = 1;

export const WORD_STAGGER = 0.05;
export const LINE_STAGGER = 0.1;
export const CHAR_STAGGER = 0.02;

export const REVEAL_Y = 36;
export const REVEAL_BLUR = 8;

/** Scrub weight for unpinned progressions (parallax, colour fills). */
export const SCRUB_SCENE = 1.1;

/** Scrub weight for pinned scenes — heavier so the pin feels anchored. */
export const SCRUB_PIN = 1.4;

/** Desktop breakpoint. Matches the Lenis gate in `~/lib/scroll`. */
export const DESKTOP_QUERY = '(min-width: 1024px)';
export const MOBILE_QUERY = '(max-width: 1023px)';
export const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * ScrollTrigger measures higher priorities first. The three pinned scenes are
 * created out of DOM order (lazily, by React), so without this a lower pin can
 * be measured before an earlier one has inserted its pin-spacer and every
 * trigger beneath it lands in the wrong place.
 *
 * Descending by page position = top-down measurement.
 */
export const PIN_PRIORITY = {
  productsList: 3,
  videoSection: 2,
  testimonials: 1,
} as const;
