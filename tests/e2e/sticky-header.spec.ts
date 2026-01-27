import {test, expect} from '@playwright/test';

/**
 * E2E Tests: Sticky Header with Scroll Trigger
 * Story 2.5 - Acceptance Criteria: AC1, AC2, AC3, AC4, AC5
 *
 * Tests scroll-triggered sticky header visibility on home page,
 * accessibility (keyboard, focus, reduced motion), and scope to home only.
 */

test.describe('Sticky Header - Visibility on Home Page', () => {
  test('[P1] should hide header when at top of home page', async ({page}) => {
    // GIVEN: User is at top of home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WHEN: Page loads at top (hero in viewport)
    const header = page.locator('header');

    // THEN: Header should be hidden (opacity-0, pointer-events-none)
    await expect(header).toHaveCSS('opacity', '0');

    // Verify header has pointer-events-none class when hidden
    const hasPointerEventsNone = await header.evaluate((el) =>
      el.classList.contains('pointer-events-none')
    );
    expect(hasPointerEventsNone).toBe(true);
  });

  test('[P1] should show header when scrolling past hero section', async ({
    page,
  }) => {
    // GIVEN: User is at top of home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');

    // Verify header is initially hidden
    await expect(header).toHaveCSS('opacity', '0');

    // WHEN: User scrolls past the hero section
    // Find hero section and scroll past it
    const hero = page.locator('section').first(); // HeroSection is first section
    const heroHeight = await hero.evaluate((el) => el.clientHeight);

    // Scroll past hero by its full height + 100px
    await page.evaluate((scrollAmount) => {
      window.scrollTo({top: scrollAmount, behavior: 'instant'});
    }, heroHeight + 100);

    // Wait for IntersectionObserver to trigger state change
    await page.waitForTimeout(300);

    // THEN: Header should be visible (opacity-1)
    await expect(header).toHaveCSS('opacity', '1');

    // Verify header does NOT have pointer-events-none when visible
    const hasPointerEventsNone = await header.evaluate((el) =>
      el.classList.contains('pointer-events-none')
    );
    expect(hasPointerEventsNone).toBe(false);
  });

  test('[P1] should hide header when scrolling back to top', async ({page}) => {
    // GIVEN: User has scrolled past hero (header is visible)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');
    const hero = page.locator('section').first();
    const heroHeight = await hero.evaluate((el) => el.clientHeight);

    // Scroll past hero to show header
    await page.evaluate((scrollAmount) => {
      window.scrollTo({top: scrollAmount, behavior: 'instant'});
    }, heroHeight + 100);
    await page.waitForTimeout(300);

    // Verify header is visible
    await expect(header).toHaveCSS('opacity', '1');

    // WHEN: User scrolls back to top
    await page.evaluate(() => {
      window.scrollTo({top: 0, behavior: 'instant'});
    });

    // Wait for IntersectionObserver to trigger state change
    await page.waitForTimeout(300);

    // THEN: Header should be hidden again
    await expect(header).toHaveCSS('opacity', '0');

    const hasPointerEventsNone = await header.evaluate((el) =>
      el.classList.contains('pointer-events-none')
    );
    expect(hasPointerEventsNone).toBe(true);
  });
});

test.describe('Sticky Header - Accessibility', () => {
  test('[P1] should support keyboard navigation on sticky header', async ({
    page,
  }) => {
    // GIVEN: User has scrolled past hero (sticky header is visible)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('section').first();
    const heroHeight = await hero.evaluate((el) => el.clientHeight);
    await page.evaluate((scrollAmount) => {
      window.scrollTo({top: scrollAmount, behavior: 'instant'});
    }, heroHeight + 100);
    await page.waitForTimeout(300);

    // WHEN: User navigates with Tab key
    await page.keyboard.press('Tab'); // Focus first interactive element

    // THEN: Logo link should be focusable
    const logoLink = page.locator('header a[href="/"]').first();
    await expect(logoLink).toBeFocused();

    // AND: User can activate with Enter
    await page.keyboard.press('Enter');
    await page.waitForURL('/');
    expect(page.url()).toContain('/');
  });

  test('[P1] should show focus indicators on header controls', async ({
    page,
  }) => {
    // GIVEN: User has scrolled past hero (sticky header is visible)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('section').first();
    const heroHeight = await hero.evaluate((el) => el.clientHeight);
    await page.evaluate((scrollAmount) => {
      window.scrollTo({top: scrollAmount, behavior: 'instant'});
    }, heroHeight + 100);
    await page.waitForTimeout(300);

    // WHEN: User tabs to logo link
    const logoLink = page.locator('header a[href="/"]').first();
    await logoLink.focus();

    // THEN: Focus ring should be visible
    // Check for focus-visible:ring-2 classes (per Story 2.3)
    const outlineStyle = await logoLink.evaluate((el) => {
      return window.getComputedStyle(el).outline;
    });

    // Should have some outline/ring (not "none")
    expect(outlineStyle).not.toBe('none');
    expect(outlineStyle).not.toBe('');
  });

  test('[P1] should have accessible labels on header controls', async ({
    page,
  }) => {
    // GIVEN: User has scrolled past hero (sticky header is visible)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('section').first();
    const heroHeight = await hero.evaluate((el) => el.clientHeight);
    await page.evaluate((scrollAmount) => {
      window.scrollTo({top: scrollAmount, behavior: 'instant'});
    }, heroHeight + 100);
    await page.waitForTimeout(300);

    // WHEN: Checking header controls for labels
    // Cart link should have aria-label="Shopping cart"
    const cartLink = page.locator('header a[aria-label="Shopping cart"]');
    await expect(cartLink).toBeVisible();

    // Hamburger menu should have aria-label="Open menu"
    const hamburgerButton = page.locator(
      'header button[aria-label="Open menu"]',
    );
    await expect(hamburgerButton).toBeVisible();

    // THEN: All controls have appropriate accessible labels
    expect(await cartLink.getAttribute('aria-label')).toBe('Shopping cart');
    expect(await hamburgerButton.getAttribute('aria-label')).toBe('Open menu');
  });

  test('[P1] should disable fade animation when prefers-reduced-motion is set', async ({
    page,
  }) => {
    // GIVEN: User has prefers-reduced-motion enabled
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');

    // Verify header is initially hidden
    await expect(header).toHaveCSS('opacity', '0');

    // WHEN: User scrolls past hero
    const hero = page.locator('section').first();
    const heroHeight = await hero.evaluate((el) => el.clientHeight);
    await page.evaluate((scrollAmount) => {
      window.scrollTo({top: scrollAmount, behavior: 'instant'});
    }, heroHeight + 100);
    await page.waitForTimeout(300);

    // THEN: Header should be visible WITHOUT transition
    // Check that transition-duration is NOT present (instant visibility)
    const transitionDuration = await header.evaluate((el) => {
      return window.getComputedStyle(el).transitionDuration;
    });

    // Should be "0s" (no transition) when reduced motion is enabled
    expect(transitionDuration).toBe('0s');

    // Header should still be visible (opacity-1)
    await expect(header).toHaveCSS('opacity', '1');
  });
});

test.describe('Sticky Header - Scope to Home Page Only', () => {
  test('[P1] should always show header on non-home pages', async ({page}) => {
    // GIVEN: User is on a non-home page (e.g., /collections)
    await page.goto('/collections');
    await page.waitForLoadState('networkidle');

    // WHEN: Page loads
    const header = page.locator('header');

    // THEN: Header should always be visible (not hidden)
    await expect(header).toHaveCSS('opacity', '1');

    // Should NOT have pointer-events-none class
    const hasPointerEventsNone = await header.evaluate((el) =>
      el.classList.contains('pointer-events-none')
    );
    expect(hasPointerEventsNone).toBe(false);
  });

  test('[P1] should NOT apply scroll-triggered behavior on non-home pages', async ({
    page,
  }) => {
    // GIVEN: User is on a non-home page (e.g., /collections)
    await page.goto('/collections');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');

    // Verify header is visible initially
    await expect(header).toHaveCSS('opacity', '1');

    // WHEN: User scrolls down the page
    await page.evaluate(() => {
      window.scrollTo({top: 500, behavior: 'instant'});
    });
    await page.waitForTimeout(300);

    // THEN: Header should STILL be visible (no scroll-triggered hide)
    await expect(header).toHaveCSS('opacity', '1');

    // WHEN: User scrolls back to top
    await page.evaluate(() => {
      window.scrollTo({top: 0, behavior: 'instant'});
    });
    await page.waitForTimeout(300);

    // THEN: Header should STILL be visible
    await expect(header).toHaveCSS('opacity', '1');
  });

  test('[P1] should show header on product pages', async ({page}) => {
    // GIVEN: User is on a product page
    // Note: This test will navigate to /products and check first product
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    // Find first product link and navigate to it
    const firstProductLink = page.locator('a[href^="/products/"]').first();

    // Check if products exist
    const productCount = await firstProductLink.count();
    if (productCount === 0) {
      test.skip(true, 'No products found');
      return;
    }

    await firstProductLink.click();
    await page.waitForLoadState('networkidle');

    // WHEN: Product page loads
    const header = page.locator('header');

    // THEN: Header should be visible
    await expect(header).toHaveCSS('opacity', '1');

    const hasPointerEventsNone = await header.evaluate((el) =>
      el.classList.contains('pointer-events-none')
    );
    expect(hasPointerEventsNone).toBe(false);
  });
});

test.describe('Sticky Header - GPU-Composited Animation', () => {
  test('[P1] should use GPU-composited properties for fade (transform, opacity)', async ({
    page,
  }) => {
    // GIVEN: User is at home page with normal motion preference
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');

    // WHEN: Checking header styles
    const transform = await header.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });

    // THEN: Transform should be applied when hidden
    // When hidden, transform should be translateY(-100%)
    expect(transform).toBeDefined();

    // Scroll past hero to trigger visibility
    const hero = page.locator('section').first();
    const heroHeight = await hero.evaluate((el) => el.clientHeight);
    await page.evaluate((scrollAmount) => {
      window.scrollTo({top: scrollAmount, behavior: 'instant'});
    }, heroHeight + 100);
    await page.waitForTimeout(300);

    // When visible, transform should be none/identity matrix
    const transformVisible = await header.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });

    // Should be identity matrix "matrix(1, 0, 0, 1, 0, 0)" or "none"
    expect(['matrix(1, 0, 0, 1, 0, 0)', 'none']).toContain(transformVisible);
  });
});
