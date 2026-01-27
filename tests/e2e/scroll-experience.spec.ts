import {test, expect} from '@playwright/test';

/**
 * E2E Tests: Scroll Experience with Lenis/Native Hybrid
 * Story 2.2 - Acceptance Criteria: AC1, AC2, AC5
 *
 * Tests desktop Lenis smooth scroll, mobile native scroll with CSS snap,
 * and reduced motion fallback behavior.
 */

test.describe('Scroll Experience - Desktop Lenis', () => {
  test('[P1] should initialize Lenis on desktop viewport (≥1024px)', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport (1024px or larger)
    await page.setViewportSize({width: 1024, height: 768});

    // WHEN: User navigates to home page
    await page.goto('/');

    // THEN: Lenis should be initialized (check for data attribute or class)
    // Note: Lenis adds 'lenis' class to html element when active
    const html = page.locator('html');
    await expect(html).toHaveClass(/lenis/, {timeout: 2000});
  });

  test('[P1] should NOT initialize Lenis on wholesale routes', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport
    await page.setViewportSize({width: 1024, height: 768});

    // WHEN: User navigates to wholesale route
    await page.goto('/wholesale');

    // THEN: Lenis should NOT be initialized
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/lenis/);
  });

  test('[P1] should provide smooth scroll behavior on desktop', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport with Lenis initialized
    await page.setViewportSize({width: 1280, height: 1024});
    await page.goto('/');

    // Wait for Lenis to initialize
    const html = page.locator('html');
    await expect(html).toHaveClass(/lenis/);

    // WHEN: User scrolls down the page
    await page.evaluate(() => {
      window.scrollTo({top: 500, behavior: 'smooth'});
    });

    // THEN: Page should scroll smoothly (Lenis handles this)
    // Verify we can reach scroll position (Lenis doesn't block scrolling)
    await page.waitForTimeout(500); // Allow smooth scroll to complete
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(400);
  });

  test('[P1] should destroy Lenis when resizing to mobile', async ({page}) => {
    // GIVEN: Desktop viewport with Lenis initialized
    await page.setViewportSize({width: 1024, height: 768});
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveClass(/lenis/);

    // WHEN: Viewport is resized to mobile (<1024px)
    await page.setViewportSize({width: 768, height: 1024});

    // Wait for resize handler to execute
    await page.waitForTimeout(300);

    // THEN: Lenis should be destroyed (class removed)
    await expect(html).not.toHaveClass(/lenis/);
  });
});

test.describe('Scroll Experience - Mobile Native Scroll', () => {
  test('[P1] should use native scroll on mobile viewport (<1024px)', async ({
    page,
  }) => {
    // GIVEN: Mobile viewport (less than 1024px)
    await page.setViewportSize({width: 375, height: 667});

    // WHEN: User navigates to home page
    await page.goto('/');

    // THEN: Lenis should NOT be initialized
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/lenis/);
  });

  test('[P1] should apply CSS scroll-snap on mobile', async ({page}) => {
    // GIVEN: Mobile viewport with native scroll
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/');

    // WHEN: Checking scroll container styles
    const html = page.locator('html');

    // THEN: Scroll-snap should be applied to html element
    const scrollSnapType = await html.evaluate((el) => {
      return window.getComputedStyle(el).scrollSnapType;
    });

    // Should be "y proximity" or "y mandatory" (mobile only)
    expect(scrollSnapType).toContain('y');
  });

  test('[P1] should have snap-start on key sections (mobile)', async ({
    page,
  }) => {
    // GIVEN: Mobile viewport
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/');

    // WHEN: Checking section styles
    // Sections should have snap-start applied
    const heroSection = page.locator('section').first();

    const scrollSnapAlign = await heroSection.evaluate((el) => {
      return window.getComputedStyle(el).scrollSnapAlign;
    });

    // THEN: Should have snap-start or snap-center
    expect(['start', 'center']).toContain(scrollSnapAlign);
  });

  test('[P1] should NOT apply scroll-snap on desktop', async ({page}) => {
    // GIVEN: Desktop viewport (≥1024px)
    await page.setViewportSize({width: 1024, height: 768});
    await page.goto('/');

    // WHEN: Checking scroll container styles on desktop
    const html = page.locator('html');

    const scrollSnapType = await html.evaluate((el) => {
      return window.getComputedStyle(el).scrollSnapType;
    });

    // THEN: Scroll-snap should be disabled (none) on desktop
    expect(scrollSnapType).toBe('none');
  });
});

test.describe('Scroll Experience - Reduced Motion Fallback', () => {
  test('[P1] should disable Lenis when prefers-reduced-motion is set', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport with reduced motion preference
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.setViewportSize({width: 1280, height: 1024});

    // WHEN: User navigates to home page
    await page.goto('/');

    // THEN: Lenis should NOT be initialized (respects reduced motion)
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/lenis/);
  });

  test('[P1] should use native scroll when Lenis is disabled', async ({
    page,
  }) => {
    // GIVEN: Reduced motion preference set
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.setViewportSize({width: 1280, height: 1024});
    await page.goto('/');

    // WHEN: User scrolls the page
    await page.evaluate(() => {
      window.scrollTo({top: 500});
    });

    // THEN: Native scroll should work without errors
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(400);
  });

  test('[P2] should handle Lenis initialization failure gracefully', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport
    await page.setViewportSize({width: 1280, height: 1024});

    // Mock Lenis to throw an error during initialization
    await page.addInitScript(() => {
      // Override dynamic import to simulate failure
      const originalImport = window.eval('import');
      (window as any).import = (path: string) => {
        if (path.includes('lenis')) {
          return Promise.reject(new Error('Lenis load failed'));
        }
        return originalImport(path);
      };
    });

    // WHEN: User navigates to home page
    await page.goto('/');

    // THEN: Page should load without errors, native scroll works
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0); // Should be at top, no crash

    // Should be able to scroll normally
    await page.evaluate(() => window.scrollTo({top: 500}));
    const newScrollY = await page.evaluate(() => window.scrollY);
    expect(newScrollY).toBeGreaterThan(400);
  });
});
