import {useEffect, useRef, type RefObject} from 'react';
import {preloadImages, type PreloadOptions} from '~/lib/shopify/preload';

/**
 * Custom hook to preload images when a container element approaches the viewport
 * using Intersection Observer (per app/lib/scroll.ts IO-only policy).
 *
 * Preloads images 200px before they enter viewport for optimal perceived performance.
 * Preloading only happens once to avoid redundant network requests.
 *
 * @param containerRef - React ref to the container element to observe
 * @param imageUrls - Array of image URLs to preload when container approaches viewport
 * @param options - Optional preload configuration (e.g. fetchpriority: 'high')
 *
 * @example
 * ```typescript
 * function ConstellationGrid({ products }) {
 *   const gridRef = useRef<HTMLDivElement>(null);
 *   const textureUrls = products.map(p => p.textureImage.url);
 *
 *   usePreloadImages(gridRef, textureUrls, { fetchpriority: 'high' });
 *
 *   return <div ref={gridRef}>...</div>;
 * }
 * ```
 */
export function usePreloadImages(
  containerRef: RefObject<HTMLElement>,
  imageUrls: string[],
  options?: PreloadOptions,
): void {
  // Track whether we've already preloaded to prevent duplicate calls
  const hasPreloadedRef = useRef(false);
  // Memoize URLs to prevent unnecessary effect re-runs from array reference changes
  const urlsKey = imageUrls.join('\0');

  useEffect(() => {
    const element = containerRef.current;

    // Early return if:
    // - IntersectionObserver not available (SSR or old browsers)
    // - Element ref not available
    // - No images to preload
    // - Already preloaded
    if (
      typeof IntersectionObserver === 'undefined' ||
      !element ||
      imageUrls.length === 0 ||
      hasPreloadedRef.current
    ) {
      return;
    }

    // Create IntersectionObserver with 200px rootMargin
    // This triggers when element is 200px away from viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only preload when:
          // 1. Element is intersecting (within rootMargin threshold)
          // 2. Element is below viewport (positive top = scrolling down toward it)
          // 3. Haven't preloaded yet
          const isScrollingDown = entry.boundingClientRect.top > 0;

          if (
            entry.isIntersecting &&
            isScrollingDown &&
            !hasPreloadedRef.current
          ) {
            // Preload all images with options (e.g. fetchpriority: 'high')
            preloadImages(imageUrls, options);

            // Mark as preloaded
            hasPreloadedRef.current = true;
          }
        });
      },
      {
        rootMargin: '200px',
      },
    );

    observer.observe(element);

    // Cleanup on unmount
    return () => {
      observer.disconnect();
    };
  }, [containerRef, urlsKey, imageUrls, options]);
}
