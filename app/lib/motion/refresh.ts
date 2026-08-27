import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

GSAP.registerPlugin(ScrollTrigger);

/**
 * Single refresh authority for ScrollTrigger.
 *
 * ScrollTrigger only re-measures on window resize and window load. Neither
 * fires when React mounts a section, when a webfont swaps, or when an image
 * decodes and pushes the page taller — all of which move every trigger below
 * the change. Without this, the page is measured once against a layout that
 * does not exist yet and every start/end below the fold is wrong.
 *
 * Refreshes are coalesced into one rAF so a burst of mounts costs one pass.
 */

let frame: number | null = null;

/**
 * Queue a refresh. Repeated calls collapse into one — a later call supersedes
 * the frame an earlier one queued.
 *
 * State lives entirely in `frame`, which is set and cleared in the same places
 * that create and consume the callback. An extra "is one pending?" boolean can
 * desync from the real frame handle (a cancel that misses it, an effect
 * re-running mid-flight) and latch on, silently swallowing every refresh for
 * the rest of the session.
 */
export function requestScrollRefresh(): void {
  if (typeof window === 'undefined') return;

  if (frame !== null) {
    cancelAnimationFrame(frame);
  }

  frame = requestAnimationFrame(() => {
    frame = null;
    ScrollTrigger.refresh();
  });
}

/**
 * Watches everything that can invalidate a measurement and refreshes when it
 * does. Returns a teardown function.
 */
export function observeLayoutShifts(): () => void {
  if (typeof window === 'undefined') return () => {};

  const teardown: Array<() => void> = [];

  // Baseline pass once the current layout has settled.
  requestScrollRefresh();

  // Webfont swap. `Antonio` is font-display: swap and headings are sized in vw,
  // so the swap reflows the tallest elements on the page.
  if ('fonts' in document) {
    void document.fonts.ready.then(() => requestScrollRefresh());
  }

  // Content height changes: sections mounting, images decoding, media loading.
  const main = document.getElementById('main-content');
  if (main && 'ResizeObserver' in window) {
    let lastHeight = main.offsetHeight;
    const observer = new ResizeObserver(() => {
      // Ignore width-only changes; ScrollTrigger already handles window resize.
      if (main.offsetHeight === lastHeight) return;
      lastHeight = main.offsetHeight;
      requestScrollRefresh();
    });
    observer.observe(main);
    teardown.push(() => observer.disconnect());
  }

  if (document.readyState === 'complete') {
    requestScrollRefresh();
  } else {
    const onLoad = () => requestScrollRefresh();
    window.addEventListener('load', onLoad, {once: true});
    teardown.push(() => window.removeEventListener('load', onLoad));
  }

  return () => {
    teardown.forEach((fn) => fn());
  };
}
