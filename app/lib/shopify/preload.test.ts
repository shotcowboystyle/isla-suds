import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {
  preloadImage,
  preloadImages,
  getOptimizedImageUrl,
  __clearPreloadCache,
} from './preload';

describe('preloadImage', () => {
  beforeEach(() => {
    // Clear document head and preload cache before each test
    document.head.innerHTML = '';
    __clearPreloadCache();
  });

  afterEach(() => {
    // Cleanup head after each test
    document.head.innerHTML = '';
  });

  it('injects link element with correct attributes for image preload', () => {
    const url = 'https://cdn.shopify.com/image.jpg';

    preloadImage(url);

    const links = document.head.querySelectorAll('link[rel="preload"]');
    expect(links).toHaveLength(1);

    const link = links[0] as HTMLLinkElement;
    expect(link.rel).toBe('preload');
    expect(link.as).toBe('image');
    expect(link.href).toBe(url);
  });

  it('sets fetchpriority attribute when provided in options', () => {
    const url = 'https://cdn.shopify.com/image.jpg';

    preloadImage(url, {fetchpriority: 'high'});

    const link = document.head.querySelector(
      'link[rel="preload"]',
    ) as HTMLLinkElement;
    expect(link.getAttribute('fetchpriority')).toBe('high');
  });

  it('sets crossorigin attribute when provided in options', () => {
    const url = 'https://cdn.shopify.com/image.jpg';

    preloadImage(url, {crossorigin: 'anonymous'});

    const link = document.head.querySelector(
      'link[rel="preload"]',
    ) as HTMLLinkElement;
    expect(link.getAttribute('crossorigin')).toBe('anonymous');
  });

  it('sets type attribute when provided in options', () => {
    const url = 'https://cdn.shopify.com/image.webp';

    preloadImage(url, {type: 'image/webp'});

    const link = document.head.querySelector(
      'link[rel="preload"]',
    ) as HTMLLinkElement;
    expect(link.type).toBe('image/webp');
  });

  it('prevents duplicate preloads for the same URL', () => {
    const url = 'https://cdn.shopify.com/image.jpg';

    preloadImage(url);
    preloadImage(url);
    preloadImage(url);

    const links = document.head.querySelectorAll('link[rel="preload"]');
    expect(links).toHaveLength(1);
  });

  it('optimizes Shopify CDN URLs with format and width (AC2)', () => {
    const url = 'https://cdn.shopify.com/s/files/1/0123/4567/products/soap.jpg';
    const optimized = getOptimizedImageUrl(url, 800, 'webp');

    expect(optimized).toContain('width=800');
    expect(optimized).toContain('format=webp');
    expect(optimized).toMatch(/^https:\/\/cdn\.shopify\.com\/.*\?/);
  });

  it('uses default width and format when not specified', () => {
    const url = 'https://cdn.shopify.com/image.jpg';
    const optimized = getOptimizedImageUrl(url);

    expect(optimized).toContain('width=1024');
    expect(optimized).toContain('format=webp');
  });

  it('preserves base URL when original has query params', () => {
    const url = 'https://cdn.shopify.com/image.jpg?foo=bar';
    const optimized = getOptimizedImageUrl(url, 400);

    expect(optimized).toContain('width=400');
    expect(optimized).not.toContain('foo=bar');
  });

  it('is safe to call during SSR (no document)', () => {
    const originalDocument = global.document;
    // @ts-expect-error - Simulating SSR environment
    global.document = undefined;

    expect(() => {
      preloadImage('https://cdn.shopify.com/image.jpg');
    }).not.toThrow();

    global.document = originalDocument;
  });

  it('handles errors gracefully without throwing', () => {
    const originalAppendChild = document.head.appendChild;
    document.head.appendChild = vi.fn().mockImplementation(() => {
      throw new Error('DOM error');
    });

    expect(() => {
      preloadImage('https://cdn.shopify.com/image.jpg');
    }).not.toThrow();

    document.head.appendChild = originalAppendChild;
  });
});

describe('preloadImages', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    __clearPreloadCache();
  });

  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('preloads multiple images in batch', () => {
    const urls = [
      'https://cdn.shopify.com/image1.jpg',
      'https://cdn.shopify.com/image2.jpg',
      'https://cdn.shopify.com/image3.jpg',
    ];

    preloadImages(urls);

    const links = document.head.querySelectorAll('link[rel="preload"]');
    expect(links).toHaveLength(3);

    links.forEach((link, index) => {
      expect(link.getAttribute('href')).toBe(urls[index]);
    });
  });

  it('deduplicates URLs across batch calls', () => {
    const batch1 = [
      'https://cdn.shopify.com/image1.jpg',
      'https://cdn.shopify.com/image2.jpg',
    ];
    const batch2 = [
      'https://cdn.shopify.com/image2.jpg', // Duplicate
      'https://cdn.shopify.com/image3.jpg',
    ];

    preloadImages(batch1);
    preloadImages(batch2);

    const links = document.head.querySelectorAll('link[rel="preload"]');
    // Should only have 3 unique images preloaded
    expect(links).toHaveLength(3);
  });

  it('deduplicates URLs within same batch', () => {
    const urls = [
      'https://cdn.shopify.com/image1.jpg',
      'https://cdn.shopify.com/image1.jpg', // Duplicate
      'https://cdn.shopify.com/image2.jpg',
    ];

    preloadImages(urls);

    const links = document.head.querySelectorAll('link[rel="preload"]');
    expect(links).toHaveLength(2);
  });

  it('applies options to all images in batch', () => {
    const urls = [
      'https://cdn.shopify.com/image1.jpg',
      'https://cdn.shopify.com/image2.jpg',
    ];

    preloadImages(urls, {fetchpriority: 'high'});

    const links = document.head.querySelectorAll('link[rel="preload"]');
    links.forEach((link) => {
      expect(link.getAttribute('fetchpriority')).toBe('high');
    });
  });

  it('handles empty array gracefully', () => {
    expect(() => {
      preloadImages([]);
    }).not.toThrow();

    const links = document.head.querySelectorAll('link[rel="preload"]');
    expect(links).toHaveLength(0);
  });

  it('is safe to call during SSR (no document)', () => {
    const originalDocument = global.document;
    // @ts-expect-error - Simulating SSR environment
    global.document = undefined;

    expect(() => {
      preloadImages([
        'https://cdn.shopify.com/image1.jpg',
        'https://cdn.shopify.com/image2.jpg',
      ]);
    }).not.toThrow();

    global.document = originalDocument;
  });
});
