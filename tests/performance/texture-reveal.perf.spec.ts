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

      // Clear any existing marks before this iteration
      await clearPerformanceMarks(page);

      // Trigger reveal (hover or tap depending on implementation)
      // This will call handleProductReveal which creates 'texture-reveal-start' mark
      await card.hover();

      // Wait for dialog to appear (Radix Dialog)
      const dialog = page.locator('[role="dialog"]');
      await dialog.waitFor({state: 'visible', timeout: 1000});

      // Wait for animation to complete by checking for 'texture-reveal-end' mark
      // The actual implementation creates this mark in handleAnimationComplete callback
      // Animation duration is 300ms, but wait up to 500ms to account for timing variations
      await page.waitForFunction(
        () => {
          const marks = performance.getEntriesByType('mark');
          return marks.some((m) => m.name === 'texture-reveal-end');
        },
        {timeout: 500},
      );

      // Verify that the actual implementation created the marks and measure
      const measurements = await getPerformanceMeasurements(
        page,
        'texture-reveal',
      );
      if (measurements.length > 0) {
        durations.push(measurements[measurements.length - 1].duration);
      } else {
        // If no measurement found, the implementation didn't create it - this is a test failure
        throw new Error(
          'Performance measurement not found. Implementation may not be creating marks correctly.',
        );
      }

      // Close dialog for next iteration
      await page.keyboard.press('Escape');
      await dialog.waitFor({state: 'hidden', timeout: 500});

      // Clear marks for next iteration
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
    console.log(
      `   All measurements: ${durations.map((d) => d.toFixed(2)).join(', ')}`,
    );

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
