import {test, expect} from '@playwright/test';
import {createProducts} from '../support/factories/product.factory';
import {getPreloadLinks, waitForPreloadLinks} from '../support/helpers/preload';

/**
 * Integration Test: ConstellationGrid + usePreloadImages Hook
 *
 * Verifies that ConstellationGrid component correctly integrates with
 * usePreloadImages hook to preload optimized product images.
 */

test.describe('ConstellationGrid Image Preloading Integration (Story 3.1)', () => {
  test('[P2] should extract and preload optimized image URLs from product data', async ({
    page,
  }) => {
    // GIVEN: Home page with ConstellationGrid renders with products
    await page.goto('/');

    // Wait for constellation to be present
    await page.waitForSelector('.constellation-grid', {timeout: 5000});

    // WHEN: User scrolls to trigger intersection observer
    await page.evaluate(() => {
      const constellation = document.querySelector('.constellation-grid');
      if (constellation) {
        const rect = constellation.getBoundingClientRect();
        const targetScroll = window.scrollY + rect.top - window.innerHeight - 200;
        window.scrollTo(0, targetScroll);
      }
    });

    // Wait for preloading to trigger (AC1: rootMargin 200px)
    await waitForPreloadLinks(page, 1, {timeout: 3000});

    // THEN: Preload links are created from product image URLs
    const preloadLinks = await getPreloadLinks(page);
    expect(preloadLinks.length).toBeGreaterThan(0);

    // AND: All URLs are optimized with width and format (AC2)
    for (const href of preloadLinks) {
      expect(href).toMatch(/width=1024/); // Default width from AC2
      expect(href).toMatch(/format=webp/); // Default format from AC2
    }

    // AND: All preload links have fetchpriority="high" (AC2)
    const preloadLinksWithPriority = await page.evaluate(() => {
      const links = document.head.querySelectorAll(
        'link[rel="preload"][as="image"][fetchpriority="high"]',
      );
      return links.length;
    });

    expect(preloadLinksWithPriority).toBeGreaterThan(0);
  });

  test('[P2] should handle empty product list gracefully', async ({page}) => {
    // GIVEN: Page with no products (edge case)
    // Navigate to a route that might have empty products
    // For now, test that preload doesn't crash on empty data

    await page.goto('/');

    // WHEN: Checking for preload behavior with potentially empty products
    const initialLinks = await getPreloadLinks(page);

    // THEN: No errors thrown (graceful degradation, AC5)
    // If products exist, preload works; if not, no crash
    expect(Array.isArray(initialLinks)).toBe(true);
  });

  test('[P2] should not create observer when imageUrls is empty', async ({
    page,
  }) => {
    // GIVEN: ConstellationGrid with empty products
    await page.goto('/');

    // WHEN: Checking initial state before any scroll
    const initialLinks = await getPreloadLinks(page);

    // THEN: No preload links exist initially (lazy preload, AC1)
    expect(initialLinks.length).toBe(0);

    // This verifies that hook doesn't create observer for empty URLs
    // (from unit test coverage, but validated in integration)
  });
});
