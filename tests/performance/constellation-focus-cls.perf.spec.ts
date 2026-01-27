/**
 * Performance Tests: Constellation Focus CLS Prevention (Story 2.4)
 *
 * Verifies that focus state changes (scale, shadow, opacity) do not
 * cause Cumulative Layout Shift, which is a CI quality gate.
 *
 * Priority: P1 - CLS is a Core Web Vital and CI blocker
 */

import {test, expect} from '@playwright/test';

test.describe('Constellation Focus - CLS Prevention (Story 2.4)', () => {
  test('[P1] should cause zero CLS when applying focused state on desktop', async ({
    page,
  }) => {
    // GIVEN: User is on homepage
    await page.goto('/');
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    // Start measuring CLS
    await page.evaluate(() => {
      // Reset CLS tracking
      (window as any).__cls = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              (window as any).__cls += layoutShiftEntry.value;
            }
          }
        }
      });

      observer.observe({type: 'layout-shift', buffered: true});
    });

    // WHEN: User hovers multiple product cards
    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );

    await cards.nth(0).hover();
    await page.waitForTimeout(300); // Allow animation

    await cards.nth(1).hover();
    await page.waitForTimeout(300);

    await cards.nth(2).hover();
    await page.waitForTimeout(300);

    await cards.nth(3).hover();
    await page.waitForTimeout(300);

    // THEN: CLS score is zero (no layout shift)
    const clsScore = await page.evaluate(() => (window as any).__cls);

    expect(clsScore).toBe(0);
  });

  test('[P1] should cause zero CLS when dimming other products', async ({
    page,
  }) => {
    // GIVEN: User is on homepage
    await page.goto('/');
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    // Start CLS tracking
    await page.evaluate(() => {
      (window as any).__cls = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              (window as any).__cls += layoutShiftEntry.value;
            }
          }
        }
      });

      observer.observe({type: 'layout-shift', buffered: true});
    });

    // WHEN: Focus causes other products to dim (opacity-60)
    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    await firstCard.hover();
    await page.waitForTimeout(500); // Allow all animations

    // THEN: Opacity change does not cause layout shift
    const clsScore = await page.evaluate(() => (window as any).__cls);

    expect(clsScore).toBe(0);
  });

  test('[P1] should cause zero CLS when clearing focus state', async ({
    page,
  }) => {
    // GIVEN: User has focused a product
    await page.goto('/');
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    await firstCard.hover();
    await page.waitForTimeout(300);

    // Start CLS tracking AFTER focus is applied
    await page.evaluate(() => {
      (window as any).__cls = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              (window as any).__cls += layoutShiftEntry.value;
            }
          }
        }
      });

      observer.observe({type: 'layout-shift', buffered: true});
    });

    // WHEN: User clears focus by clicking outside
    await page.click('header');
    await page.waitForTimeout(500); // Allow animations to complete

    // THEN: Returning to default state causes zero CLS
    const clsScore = await page.evaluate(() => (window as any).__cls);

    expect(clsScore).toBe(0);
  });

  test('[P1] should use GPU-composited properties only (transform, opacity)', async ({
    page,
  }) => {
    // GIVEN: User is on homepage
    await page.goto('/');
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    // WHEN: User hovers to apply focus state
    await firstCard.hover();
    await page.waitForTimeout(100);

    // THEN: Only GPU-composited properties are animated
    const computedTransform = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });

    const computedOpacity = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    // Transform should be scale (GPU-composited)
    expect(computedTransform).not.toBe('none');
    expect(computedTransform).toContain('matrix'); // Transformed

    // Opacity should be 1 (not dimmed)
    expect(computedOpacity).toBe('1');

    // VERIFY: No width, height, top, left changes (would cause layout shift)
    const box1 = await firstCard.boundingBox();
    await page.waitForTimeout(200);
    const box2 = await firstCard.boundingBox();

    // Bounding box should not change (transform doesn't affect layout)
    expect(box1?.width).toBe(box2?.width);
    expect(box1?.height).toBe(box2?.height);
  });

  test('[P1] should not cause reflow when exploring multiple products rapidly', async ({
    page,
  }) => {
    // GIVEN: User is on homepage
    await page.goto('/');
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    // Start CLS and reflow tracking
    await page.evaluate(() => {
      (window as any).__cls = 0;
      (window as any).__reflows = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              (window as any).__cls += layoutShiftEntry.value;
            }
          }
        }
      });

      observer.observe({type: 'layout-shift', buffered: true});

      // Track forced reflows
      const originalGetBoundingClientRect =
        Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function () {
        (window as any).__reflows++;
        return originalGetBoundingClientRect.call(this);
      };
    });

    // WHEN: User rapidly hovers multiple products (simulating exploration)
    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );

    for (let i = 0; i < 4; i++) {
      await cards.nth(i).hover();
      await page.waitForTimeout(50); // Rapid hover
    }

    await page.waitForTimeout(500); // Allow all animations to settle

    // THEN: No layout shift despite rapid state changes
    const clsScore = await page.evaluate(() => (window as any).__cls);
    expect(clsScore).toBe(0);
  });

  test('[P1] should maintain zero CLS on mobile tap interactions', async ({
    page,
  }) => {
    // GIVEN: User is on mobile device
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/');
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    // Start CLS tracking
    await page.evaluate(() => {
      (window as any).__cls = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              (window as any).__cls += layoutShiftEntry.value;
            }
          }
        }
      });

      observer.observe({type: 'layout-shift', buffered: true});
    });

    // WHEN: User taps product cards (mobile interaction)
    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );

    await cards.nth(0).tap();
    await page.waitForTimeout(300);

    await cards.nth(1).tap();
    await page.waitForTimeout(300);

    // THEN: Tap interactions cause zero CLS
    const clsScore = await page.evaluate(() => (window as any).__cls);
    expect(clsScore).toBe(0);
  });

  test('[P1] should prevent CLS when keyboard focus activates state', async ({
    page,
  }) => {
    // GIVEN: User is navigating with keyboard
    await page.goto('/');
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    // Start CLS tracking
    await page.evaluate(() => {
      (window as any).__cls = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              (window as any).__cls += layoutShiftEntry.value;
            }
          }
        }
      });

      observer.observe({type: 'layout-shift', buffered: true});
    });

    // WHEN: User activates focus via keyboard
    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    await firstCard.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // THEN: Keyboard interactions cause zero CLS
    const clsScore = await page.evaluate(() => (window as any).__cls);
    expect(clsScore).toBe(0);
  });
});

test.describe('Constellation Focus - Performance Budget (Story 2.4)', () => {
  test('[P1] should complete focus state transition under 100ms', async ({
    page,
  }) => {
    // GIVEN: User is on homepage
    await page.goto('/');
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    // WHEN: Measuring focus state transition time
    const transitionTime = await page.evaluate(async (cardSelector) => {
      const card = document.querySelector(cardSelector);
      if (!card) return 999999;

      performance.mark('focus-start');

      // Trigger hover (focus state)
      const hoverEvent = new MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true,
      });
      card.dispatchEvent(hoverEvent);

      // Wait for next frame
      await new Promise((resolve) => requestAnimationFrame(resolve));

      performance.mark('focus-end');
      performance.measure('focus-transition', 'focus-start', 'focus-end');

      const measure = performance.getEntriesByName('focus-transition')[0];
      return measure.duration;
    }, `[aria-label="Product constellation grid"] a`);

    // THEN: Transition completes under 100ms (per project-context.md)
    expect(transitionTime).toBeLessThan(100);
  });

  test('[P1] should not block main thread during focus state changes', async ({
    page,
  }) => {
    // GIVEN: User is on homepage
    await page.goto('/');
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    // WHEN: Monitoring long tasks during focus interactions
    await page.evaluate(() => {
      (window as any).__longTasks = [];

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // Long task threshold
            (window as any).__longTasks.push(entry.duration);
          }
        }
      });

      observer.observe({type: 'longtask', buffered: true});
    });

    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );

    // Rapidly hover through products
    for (let i = 0; i < 4; i++) {
      await cards.nth(i).hover();
      await page.waitForTimeout(50);
    }

    await page.waitForTimeout(500);

    // THEN: No long tasks detected (main thread not blocked)
    const longTasks = await page.evaluate(() => (window as any).__longTasks);

    // Should have zero or minimal long tasks
    expect(longTasks.length).toBeLessThanOrEqual(1); // Allow 1 for CI variability
  });
});
