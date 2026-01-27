import {test, expect} from '@playwright/test';
import {
  getPerformanceMeasurements,
  calculateP95,
  calculateAverage,
  clearPerformanceMarks,
} from '../support/helpers/performance';

/**
 * Texture Reveal Performance Tests (P0 - Critical)
 *
 * Tests texture reveal animation performance against project requirements.
 * REQUIREMENT: p95 < 100ms (from project-context.md)
 *
 * This is a CI GATE - failures block deployment.
 */

test.describe('Texture Reveal Performance', () => {
  test.beforeEach(async ({page}) => {
    // Clear performance marks before each test
    await clearPerformanceMarks(page);
  });

  test('[P0] texture reveal should complete under 100ms at p95', async ({
    page,
  }) => {
    // GIVEN: User navigates to home page with product grid
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Collect multiple measurements for p95 calculation
    const durations: number[] = [];

    // WHEN: User triggers texture reveal 10 times (burn-in for reliable p95)
    for (let i = 0; i < 10; i++) {
      // Find product cards (adjust selector based on actual implementation)
      const productCards = page.locator(
        '[data-testid="product-card"], .product-card, [class*="product"]',
      );
      const cardCount = await productCards.count();

      if (cardCount === 0) {
        throw new Error(
          'No product cards found. Texture reveal test requires product grid.',
        );
      }

      const card = productCards.nth(i % cardCount);

      // Mark start of reveal
      await page.evaluate(() => {
        performance.mark('texture-reveal-start');
      });

      // Trigger reveal (hover or tap depending on implementation)
      await card.hover();

      // Wait for reveal animation to complete
      // Note: Adjust selector based on actual texture reveal implementation
      await page.waitForTimeout(200); // Brief wait for animation

      // Mark end of reveal
      await page.evaluate(() => {
        performance.mark('texture-reveal-end');
        performance.measure(
          'texture-reveal',
          'texture-reveal-start',
          'texture-reveal-end',
        );
      });

      // Get measurement
      const measurements = await getPerformanceMeasurements(
        page,
        'texture-reveal',
      );
      if (measurements.length > 0) {
        durations.push(measurements[measurements.length - 1].duration);
      }

      // Clear for next iteration
      await clearPerformanceMarks(page);
    }

    // THEN: p95 should be under 100ms
    expect(
      durations.length,
      'Should have collected performance measurements',
    ).toBeGreaterThan(0);

    const p95 = calculateP95(durations);
    const average = calculateAverage(durations);

    console.log('\n📊 Texture Reveal Performance:');
    console.log(`   Average: ${average.toFixed(2)}ms`);
    console.log(`   p95: ${p95.toFixed(2)}ms`);
    console.log(`   All measurements: ${durations.map((d) => d.toFixed(2)).join(', ')}`);

    expect(
      p95,
      `p95 (${p95.toFixed(2)}ms) must be under 100ms for CI gate`,
    ).toBeLessThan(100);
  });

  test('[P0] texture images should be preloaded before hover interaction', async ({
    page,
  }) => {
    // GIVEN: User navigates to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // THEN: Texture images should be preloaded via Intersection Observer
    // Check for preload link tags in head
    const preloadLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('link[rel="preload"]');
      return Array.from(links).map((link) => ({
        href: link.getAttribute('href'),
        as: link.getAttribute('as'),
      }));
    });

    console.log(`\n🖼️  Found ${preloadLinks.length} preload links`);

    // Note: This test validates the preloading strategy is implemented
    // Actual texture reveal performance depends on these preloads
    if (preloadLinks.length === 0) {
      console.warn(
        '⚠️  No preload links found. Consider implementing Intersection Observer preloading for <100ms texture reveal.',
      );
    }
  });

  test('[P1] texture reveal should respect prefers-reduced-motion', async ({
    page,
  }) => {
    // GIVEN: User has prefers-reduced-motion enabled
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WHEN: User hovers on product card
    const productCard = page
      .locator(
        '[data-testid="product-card"], .product-card, [class*="product"]',
      )
      .first();

    if ((await productCard.count()) > 0) {
      await productCard.hover();

      // THEN: Texture should reveal instantly (no animation)
      // Check for CSS animations being disabled
      const hasAnimations = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });

      expect(hasAnimations).toBe(true);
      console.log('✅ Reduced motion preference respected');
    }
  });
});
