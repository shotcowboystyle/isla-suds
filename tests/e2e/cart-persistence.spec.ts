import {test, expect} from '@playwright/test';

/**
 * Cart Persistence E2E Tests (P0 - Critical)
 *
 * Tests cart data persistence across page reloads and browser restarts.
 * Critical for abandoned cart recovery and user experience.
 */

test.describe('Cart Persistence', () => {
  test('[P0] should persist cart items across page reload', async ({page}) => {
    // GIVEN: User adds a product to cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('button[type="submit"]:has-text("Add to cart")');
    await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

    // Close cart drawer to see badge
    await page.keyboard.press('Escape');

    // Get initial cart count from badge
    const cartBadge = page.locator('a[href="/cart"]').locator('span').first();
    const initialCount = await cartBadge.textContent();

    // WHEN: User reloads the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // THEN: Cart still shows the same item count
    const reloadedCount = await cartBadge.textContent();
    expect(reloadedCount).toBe(initialCount);

    // THEN: Cart drawer still contains the product
    await page.click('a[href="/cart"]');
    await expect(
      page.getByRole('heading', {name: 'The 3-in-1 Shampoo Bar'}),
    ).toBeVisible();
  });

  test('[P0] should gracefully handle expired cart ID', async ({
    page,
    context,
  }) => {
    // GIVEN: User has a cart with an item
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('button[type="submit"]:has-text("Add to cart")');
    await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

    // WHEN: Cart ID is invalidated (simulate expiration)
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Reload page to trigger cart recovery
    await page.reload();
    await page.waitForLoadState('networkidle');

    // THEN: App should recover gracefully (either show empty cart or recreate cart)
    // Navigate to cart page
    await page.goto('/cart');

    // Should show either:
    // 1. Empty cart (graceful degradation), OR
    // 2. New cart created successfully
    const cartEmpty = page.getByText('Your cart is empty');
    const cartLoaded = page.locator('form[action="/cart"]');

    // At least one of these should be visible (app didn't crash)
    const isGraceful =
      (await cartEmpty.isVisible().catch(() => false)) ||
      (await cartLoaded.isVisible().catch(() => false));

    expect(
      isGraceful,
      'App should gracefully handle expired cart ID',
    ).toBeTruthy();
  });
});
