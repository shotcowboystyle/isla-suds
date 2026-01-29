import {test, expect} from '@playwright/test';
import {
  getPreloadLinks,
  waitForPreloadLinks,
  getPreloadLinkAttributes,
  hasOptimizationParams,
} from '../support/helpers/preload';

/**
 * Story 3.1: Image Preloading with Intersection Observer
 *
 * Tests verify that texture images are preloaded when the constellation
 * approaches viewport, ensuring <100ms reveal performance (NFR4).
 */

test.describe('Image Preloading (Story 3.1)', () => {
  test.beforeEach(async ({page}) => {
    // Navigate to home page with constellation
    await page.goto('/');
  });

  test('[P0] should preload images when constellation enters viewport', async ({
    page,
  }) => {
    // GIVEN: User is on the home page
    // Constellation is below viewport (scroll position at top)
    const initialLinks = await getPreloadLinks(page);
    expect(initialLinks.length).toBe(0); // No preload links initially

    // WHEN: User scrolls toward constellation (trigger at 200px before viewport)
    await page.evaluate(() => {
      const constellation = document.querySelector('.constellation-grid');
      if (constellation) {
        // Scroll to position that triggers rootMargin: 200px
        const rect = constellation.getBoundingClientRect();
        const targetScroll = window.scrollY + rect.top - window.innerHeight - 200;
        window.scrollTo(0, targetScroll);
      }
    });

    // Wait for IntersectionObserver to trigger preload
    await waitForPreloadLinks(page, 1, {timeout: 3000});

    // THEN: Preload links exist in document head
    const preloadLinks = await getPreloadLinks(page);
    expect(preloadLinks.length).toBeGreaterThan(0);

    // AND: All preload links have correct attributes (AC1)
    for (const href of preloadLinks) {
      const attrs = await getPreloadLinkAttributes(page, href);
      expect(attrs.rel).toBe('preload');
      expect(attrs.as).toBe('image');
      expect(attrs.href).toBeTruthy();
    }
  });

  test('[P1] should prevent duplicate preload links on re-scroll', async ({
    page,
  }) => {
    // GIVEN: User scrolls to trigger constellation preload
    await page.evaluate(() => {
      const constellation = document.querySelector('.constellation-grid');
      if (constellation) {
        const rect = constellation.getBoundingClientRect();
        const targetScroll = window.scrollY + rect.top - window.innerHeight - 200;
        window.scrollTo(0, targetScroll);
      }
    });

    await waitForPreloadLinks(page, 1, {timeout: 3000});
    const firstLoadCount = await getPreloadLinks(page).then((l) => l.length);

    // WHEN: User scrolls up and back down again (re-trigger intersection)
    await page.evaluate(() => window.scrollTo(0, 0)); // Scroll to top
    await page.waitForTimeout(500); // Wait for scroll to settle

    await page.evaluate(() => {
      const constellation = document.querySelector('.constellation-grid');
      if (constellation) {
        const rect = constellation.getBoundingClientRect();
        const targetScroll = window.scrollY + rect.top - window.innerHeight - 200;
        window.scrollTo(0, targetScroll);
      }
    });

    await page.waitForTimeout(500); // Wait for potential duplicate injection

    // THEN: Preload link count remains the same (no duplicates, AC3)
    const secondLoadCount = await getPreloadLinks(page).then((l) => l.length);
    expect(secondLoadCount).toBe(firstLoadCount);

    // Verify URLs are unique
    const links = await getPreloadLinks(page);
    const uniqueLinks = new Set(links);
    expect(uniqueLinks.size).toBe(links.length);
  });

  test('[P1] should use optimized Shopify CDN URLs with format and width parameters', async ({
    page,
  }) => {
    // GIVEN: User scrolls to trigger constellation preload
    await page.evaluate(() => {
      const constellation = document.querySelector('.constellation-grid');
      if (constellation) {
        const rect = constellation.getBoundingClientRect();
        const targetScroll = window.scrollY + rect.top - window.innerHeight - 200;
        window.scrollTo(0, targetScroll);
      }
    });

    await waitForPreloadLinks(page, 1, {timeout: 3000});

    // WHEN: Preload links are created
    const preloadLinks = await getPreloadLinks(page);

    // THEN: All URLs include Shopify CDN optimization parameters (AC2)
    for (const href of preloadLinks) {
      // Check for width and format parameters
      expect(href).toMatch(/width=\d+/);
      expect(href).toMatch(/format=(webp|avif)/);

      // Verify via helper
      const isOptimized = await hasOptimizationParams(page, href);
      expect(isOptimized).toBe(true);
    }

    // AND: fetchpriority is set to high (AC2)
    for (const href of preloadLinks) {
      const attrs = await getPreloadLinkAttributes(page, href);
      expect(attrs.fetchpriority).toBe('high');
    }
  });
});
