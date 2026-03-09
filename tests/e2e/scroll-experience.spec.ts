import {test, expect} from '@playwright/test';

/**
 * E2E Tests: Scroll Experience with Lenis/Native Hybrid
 * Story 2.2 - Acceptance Criteria: AC1, AC2, AC5
 *
 * Current behavior (per app/lib/scroll.ts and app/root.tsx):
 * - Lenis initializes on ALL viewport sizes (desktop-only check is commented out)
 * - Lenis does NOT initialize on wholesale routes (B2B)
 * - Lenis respects prefers-reduced-motion: reduce
 * - Lenis uses smoothWheel: false, but still adds 'lenis' class to <html>
 * - CSS scroll-snap (y proximity) applies on viewports < 1024px
 * - CSS scroll-snap is explicitly 'none' on viewports >= 1024px
 * - HeroSection has 'snap-start' class
 */

test.describe('Scroll Experience - Lenis Initialization', () => {
  test('[P1] should initialize Lenis on desktop viewport', async ({page}) => {
    // GIVEN: Desktop viewport (1024px or larger)
    await page.setViewportSize({width: 1280, height: 1024});

    // WHEN: User navigates to home page
    await page.goto('/');

    // THEN: Lenis should be initialized (adds 'lenis' class to html)
    const html = page.locator('html');
    await expect(html).toHaveClass(/lenis/, {timeout: 5000});
  });

  test('[P1] should initialize Lenis on mobile viewport', async ({page}) => {
    // GIVEN: Mobile viewport (less than 1024px)
    // NOTE: The desktop-only check in scroll.ts is commented out,
    // so Lenis initializes on all viewport sizes
    await page.setViewportSize({width: 375, height: 667});

    // WHEN: User navigates to home page
    await page.goto('/');

    // THEN: Lenis should still be initialized (no viewport restriction)
    const html = page.locator('html');
    await expect(html).toHaveClass(/lenis/, {timeout: 5000});
  });

  test('[P1] should NOT initialize Lenis on wholesale routes', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport
    await page.setViewportSize({width: 1280, height: 1024});

    // WHEN: User navigates to wholesale route
    await page.goto('/wholesale');

    // THEN: Lenis should NOT be initialized
    // root.tsx explicitly calls destroyLenis() for /wholesale routes
    const html = page.locator('html');

    // Wait a moment for any async initialization to settle
    await page.waitForTimeout(1000);
    await expect(html).not.toHaveClass(/lenis/);
  });

  test('[P1] should provide smooth scroll behavior when Lenis is active', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport with Lenis initialized
    await page.setViewportSize({width: 1280, height: 1024});
    await page.goto('/');

    // Wait for Lenis to initialize
    const html = page.locator('html');
    await expect(html).toHaveClass(/lenis/, {timeout: 5000});

    // WHEN: User scrolls down the page
    await page.evaluate(() => {
      window.scrollTo({top: 500, behavior: 'smooth'});
    });

    // THEN: Page should scroll (Lenis does not block native scrollTo)
    await page.waitForTimeout(500);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('[P1] should keep Lenis active when resizing from desktop to mobile', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport with Lenis initialized
    await page.setViewportSize({width: 1280, height: 1024});
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveClass(/lenis/, {timeout: 5000});

    // WHEN: Viewport is resized to mobile (<1024px)
    await page.setViewportSize({width: 768, height: 1024});

    // Wait for debounced resize handler (150ms debounce + buffer)
    await page.waitForTimeout(500);

    // THEN: Lenis should still be active (resize handler calls initLenis()
    // regardless of viewport, the desktop-only check is commented out)
    await expect(html).toHaveClass(/lenis/, {timeout: 2000});
  });
});

test.describe('Scroll Experience - CSS Scroll Snap', () => {
  test('[P1] should apply CSS scroll-snap on mobile viewport (<1024px)', async ({
    page,
  }) => {
    // GIVEN: Mobile viewport with native scroll
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/');

    // WHEN: Checking scroll container styles
    const html = page.locator('html');

    // THEN: Scroll-snap should be applied (y proximity per tailwind.css)
    const scrollSnapType = await html.evaluate((el) => {
      return window.getComputedStyle(el).scrollSnapType;
    });

    // CSS rule: @media (max-width: 1023px) { html { scroll-snap-type: y proximity; } }
    expect(scrollSnapType).toContain('y');
  });

  test('[P1] should have snap-start on HeroSection', async ({page}) => {
    // GIVEN: Mobile viewport
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/');

    // WHEN: Checking the hero section
    const heroSection = page.locator('[data-testid="hero-section"]');

    // THEN: HeroSection has 'snap-start' class applied directly in the component
    await expect(heroSection).toHaveClass(/snap-start/);
  });

  test('[P1] should NOT apply scroll-snap on desktop (>=1024px)', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport
    await page.setViewportSize({width: 1280, height: 1024});
    await page.goto('/');

    // WHEN: Checking scroll container styles on desktop
    const html = page.locator('html');

    const scrollSnapType = await html.evaluate((el) => {
      return window.getComputedStyle(el).scrollSnapType;
    });

    // CSS rule: @media (min-width: 1024px) { html { scroll-snap-type: none; } }
    expect(scrollSnapType).toBe('none');
  });
});

test.describe('Scroll Experience - Reduced Motion', () => {
  test('[P1] should disable Lenis when prefers-reduced-motion is set', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport with reduced motion preference
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.setViewportSize({width: 1280, height: 1024});

    // WHEN: User navigates to home page
    await page.goto('/');

    // THEN: Lenis should NOT be initialized (scroll.ts checks
    // prefers-reduced-motion and returns null)
    const html = page.locator('html');

    // Wait for any async initialization to settle
    await page.waitForTimeout(1000);
    await expect(html).not.toHaveClass(/lenis/);
  });

  test('[P1] should use native scroll when Lenis is disabled', async ({
    page,
  }) => {
    // GIVEN: Reduced motion preference set (Lenis will not initialize)
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.setViewportSize({width: 1280, height: 1024});
    await page.goto('/');

    // WHEN: User scrolls the page
    await page.evaluate(() => {
      window.scrollTo({top: 500});
    });

    // THEN: Native scroll should work without errors
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});

test.describe('Scroll Experience - Graceful Degradation', () => {
  test('[P2] should not crash when page loads', async ({page}) => {
    // GIVEN: Desktop viewport
    await page.setViewportSize({width: 1280, height: 1024});

    // Collect any uncaught page errors
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    // WHEN: User navigates to home page
    await page.goto('/');

    // Wait for page to fully settle
    await page.waitForTimeout(2000);

    // THEN: No uncaught errors related to scroll/Lenis initialization
    const scrollErrors = pageErrors.filter(
      (e) =>
        e.message.toLowerCase().includes('lenis') ||
        e.message.toLowerCase().includes('scroll'),
    );
    expect(scrollErrors).toHaveLength(0);
  });

  test('[P2] should allow scrolling even if Lenis fails to load', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport
    await page.setViewportSize({width: 1280, height: 1024});

    // Block the Lenis module from loading to simulate failure
    await page.route('**/lenis**', (route) => route.abort());

    // WHEN: User navigates to home page
    await page.goto('/');

    // Wait for initialization attempts to settle
    await page.waitForTimeout(2000);

    // THEN: Native scroll should still work (graceful fallback via try/catch in scroll.ts)
    await page.evaluate(() => window.scrollTo({top: 500}));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('[P2] should set scrollRestoration to manual', async ({page}) => {
    // GIVEN: Any viewport
    await page.setViewportSize({width: 1280, height: 1024});

    // WHEN: Page loads
    await page.goto('/');

    // THEN: root.tsx sets history.scrollRestoration = 'manual'
    const scrollRestoration = await page.evaluate(
      () => history.scrollRestoration,
    );
    expect(scrollRestoration).toBe('manual');
  });
});
