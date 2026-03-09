import {test, expect} from '@playwright/test';

/**
 * E2E Tests: Header Component
 *
 * The header uses `position: sticky` and is always visible on all pages.
 * There is no scroll-triggered hide/show behavior (that code is commented out).
 *
 * Tests verify:
 * - Header is always visible on the home page and other pages
 * - Header contains the expected controls (logo, menu button, cart button)
 * - ARIA attributes are correct
 * - Keyboard navigation works
 * - Reduced motion preference has no effect (no animations to disable)
 */

test.describe('Header - Always Visible', () => {
  test('should be visible on the home page without scrolling', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should remain visible after scrolling on the home page', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Scroll down significantly
    await page.evaluate(() => {
      window.scrollTo({top: 1000, behavior: 'instant'});
    });

    // Header should still be visible (sticky positioning)
    await expect(header).toBeVisible();
  });

  test('should be visible on non-home pages', async ({page}) => {
    await page.goto('/collections');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should remain visible after scrolling on non-home pages', async ({
    page,
  }) => {
    await page.goto('/collections');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    await page.evaluate(() => {
      window.scrollTo({top: 500, behavior: 'instant'});
    });

    await expect(header).toBeVisible();

    await page.evaluate(() => {
      window.scrollTo({top: 0, behavior: 'instant'});
    });

    await expect(header).toBeVisible();
  });

  test('should use sticky positioning', async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');
    const position = await header.evaluate((el) => {
      return window.getComputedStyle(el).position;
    });

    expect(position).toBe('sticky');
  });
});

test.describe('Header - Structure and Controls', () => {
  test('should contain a logo link to the home page', async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const logoLink = page.locator('header a[href="/"]').first();
    await expect(logoLink).toBeVisible();
  });

  test('should contain a cart button with correct aria-label', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Cart button uses aria-label "Shopping cart, empty" when no items
    const cartButton = page.locator(
      'header button[aria-label="Shopping cart, empty"]',
    );
    await expect(cartButton).toBeVisible();

    const ariaLabel = await cartButton.getAttribute('aria-label');
    expect(ariaLabel).toBe('Shopping cart, empty');
  });

  test('should contain a menu toggle button with correct aria-label', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const menuButton = page.locator(
      'header button[aria-label="Toggle menu"]',
    );
    await expect(menuButton.first()).toBeVisible();

    const ariaLabel = await menuButton.first().getAttribute('aria-label');
    expect(ariaLabel).toBe('Toggle menu');
  });

  test('should contain an account link', async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accountLink = page.locator('header a[aria-label="Account"]');
    await expect(accountLink).toBeVisible();
  });

  test('menu toggle button should have aria-expanded attribute', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const menuButton = page
      .locator('header button[aria-label="Toggle menu"]')
      .first();
    await expect(menuButton).toBeVisible();

    // Initially the menu should be closed
    const ariaExpanded = await menuButton.getAttribute('aria-expanded');
    expect(ariaExpanded).toBe('false');
  });
});

test.describe('Header - Keyboard Navigation', () => {
  test('should allow tabbing through header controls', async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab into the header -- first focusable element should be the logo link
    await page.keyboard.press('Tab');
    const logoLink = page.locator('header a[href="/"]').first();
    await expect(logoLink).toBeFocused();
  });

  test('should activate logo link with Enter key', async ({page}) => {
    await page.goto('/collections');
    await page.waitForLoadState('networkidle');

    const logoLink = page.locator('header a[href="/"]').first();
    await logoLink.focus();
    await expect(logoLink).toBeFocused();

    await page.keyboard.press('Enter');
    await page.waitForURL('/');
    expect(page.url()).toContain('/');
  });

  test('should show focus indicators on header controls', async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const logoLink = page.locator('header a[href="/"]').first();
    await logoLink.focus();

    // Should have some visible outline/ring when focused
    const outlineStyle = await logoLink.evaluate((el) => {
      return window.getComputedStyle(el).outline;
    });

    expect(outlineStyle).not.toBe('none');
    expect(outlineStyle).not.toBe('');
  });

  test('should close menu on Escape key press', async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const menuButton = page
      .locator('header button[aria-label="Toggle menu"]')
      .first();

    // Open the menu
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('Header - Accessibility', () => {
  test('should have a screen-reader-only shop name in the logo link', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const srOnly = page.locator('header a[href="/"] strong.sr-only');
    await expect(srOnly).toBeAttached();

    // The text should not be empty
    const text = await srOnly.textContent();
    expect(text).toBeTruthy();
  });

  test('should have a navigation landmark for header CTAs', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ctaNav = page.locator('header nav[aria-label="Header CTAs"]');
    await expect(ctaNav).toBeAttached();
  });

  test('should not be affected by reduced motion preference', async ({
    page,
  }) => {
    // Enable reduced motion
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header');

    // Header should still be visible -- no animations to disable
    await expect(header).toBeVisible();

    // Scroll and verify it remains visible
    await page.evaluate(() => {
      window.scrollTo({top: 1000, behavior: 'instant'});
    });

    await expect(header).toBeVisible();
  });
});
