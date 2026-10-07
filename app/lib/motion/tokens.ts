/**
 * The landing page's motion vocabulary.
 *
 * Every scroll-triggered section imports from here so reveals share one rhythm
 * and one trigger line. Changing a value here retunes the whole page.
 */

/** Viewport line where a section's reveal starts. One value for the whole page. */
export const REVEAL_START = 'top 82%';

/**
 * Viewport line where a section's reveal completes. The span between START and
 * END is the scroll distance the copy is paced against — reveals are scrubbed,
 * so widening this gap slows the text down without touching a single duration.
 *
 * Top-relative, so the span is a fixed ~0.57 viewports regardless of how tall
 * the section is. That only holds up when the animated copy sits in the section's
 * top third — true for Ingredients and LocalStores, whose closing paragraph is
 * still on screen when the timeline completes. A section whose copy fills its
 * whole height (MessageSection) finishes with its last line below the fold and
 * must set a bottom-relative `end` locally instead.
 */
export const REVEAL_END = 'top 25%';

/** Entrance easing — deceleration only, no bounce or overshoot. */
export const ENTER_EASE = 'power4.out';

export const ENTER_DURATION = 1;

export const WORD_STAGGER = 0.05;
export const LINE_STAGGER = 0.1;
export const CHAR_STAGGER = 0.02;

export const REVEAL_Y = 36;
export const REVEAL_BLUR = 8;

/**
 * Scrub weights.
 *
 * Lenis already interpolates the scroll position (`~/lib/scroll`), so scrub is a
 * *second* smoothing pass stacked on the first. Keep these low — a heavy scrub
 * on top of a heavy lerp is what makes a scene trail the wheel instead of
 * tracking it.
 */

/** Text reveals. Lightest — the copy should feel welded to the wheel. */
export const SCRUB_REVEAL = 0.4;

/** Unpinned progressions (parallax, colour fills). */
export const SCRUB_SCENE = 0.5;

/** Pinned scenes — slightly heavier so the pin feels anchored. */
export const SCRUB_PIN = 0.8;

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
