/**
 * Image preloading utilities for Shopify CDN images
 * Uses <link rel="preload"> injection for optimal cache performance
 */

/** Default width for texture reveal preload (viewport-appropriate) */
const DEFAULT_PRELOAD_WIDTH = 1024;

export interface PreloadOptions {
  /** Resource type (default: 'image') */
  as?: string;
  /** MIME type hint for the resource */
  type?: string;
  /** CORS mode for cross-origin resources */
  crossorigin?: 'anonymous' | 'use-credentials';
  /** Fetch priority hint for browser scheduling */
  fetchpriority?: 'high' | 'low' | 'auto';
}

/**
 * Internal set to track already-preloaded URLs
 * Prevents duplicate preload links in the document head
 */
const preloadedUrls = new Set<string>();

/**
 * Clear the internal preloaded URLs cache
 * @internal For testing purposes only
 */
export function __clearPreloadCache(): void {
  preloadedUrls.clear();
}

/**
 * Optimize a Shopify CDN image URL for preloading with format and dimensions.
 * AC2: WebP/AVIF format hints, dimensions appropriate for reveal viewport.
 *
 * @param url - Raw Shopify CDN image URL
 * @param width - Target width for reveal viewport (default: 1024)
 * @param format - Format hint: 'webp' | 'avif' (default: 'webp' for broad support)
 * @returns Optimized URL with query parameters
 */
export function getOptimizedImageUrl(
  url: string,
  width: number = DEFAULT_PRELOAD_WIDTH,
  format: 'webp' | 'avif' = 'webp',
): string {
  const base = url.split('?')[0];
  const params = new URLSearchParams();
  params.set('width', String(width));
  params.set('format', format);
  return `${base}?${params.toString()}`;
}

/**
 * Preload a single image by injecting <link rel="preload"> into document head
 * SSR-safe - checks for document availability before DOM manipulation
 *
 * @param url - Image URL to preload (typically Shopify CDN URL)
 * @param options - Optional preload configuration
 *
 * @example
 * ```typescript
 * preloadImage('https://cdn.shopify.com/image.jpg', {
 *   fetchpriority: 'high',
 *   type: 'image/webp'
 * });
 * ```
 */
export function preloadImage(url: string, options?: PreloadOptions): void {
  // SSR safety: Check for document before DOM manipulation
  if (typeof document === 'undefined') {
    return;
  }

  try {
    // Prevent duplicate preloads
    if (preloadedUrls.has(url)) {
      return;
    }

    // Create link element
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = options?.as || 'image';

    // Apply optional attributes
    if (options?.type) {
      link.type = options.type;
    }

    if (options?.crossorigin) {
      link.setAttribute('crossorigin', options.crossorigin);
    }

    if (options?.fetchpriority) {
      link.setAttribute('fetchpriority', options.fetchpriority);
    }

    // Inject into head
    document.head.appendChild(link);

    // Track as preloaded
    preloadedUrls.add(url);
  } catch (error) {
    // Silent failure - preload is an optimization, not critical
    // Texture reveal will still work, just potentially slower
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      console.warn('[preload] Image preload failed:', url, error);
    }
  }
}

/**
 * Preload multiple images in batch with automatic deduplication
 * SSR-safe and handles duplicates both within batch and across calls
 *
 * @param urls - Array of image URLs to preload
 * @param options - Optional preload configuration applied to all images
 *
 * @example
 * ```typescript
 * const textureImages = products.map(p => p.textureImage.url);
 * preloadImages(textureImages, {fetchpriority: 'high'});
 * ```
 */
export function preloadImages(urls: string[], options?: PreloadOptions): void {
  // SSR safety
  if (typeof document === 'undefined') {
    return;
  }

  // Preload each unique URL
  urls.forEach((url) => {
    preloadImage(url, options);
  });
}
