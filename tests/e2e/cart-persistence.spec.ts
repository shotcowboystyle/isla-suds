import {test, expect} from '@playwright/test';

/**
 * Cart Persistence E2E Tests (P0 - Critical)
 *
 * Tests cart data persistence across page reloads and browser restarts.
 * Critical for abandoned cart recovery and user experience.
 */

test.describe('Cart Persistence', () => {
  test('[P0] should persist cart across browser close/reopen (AC2)', async ({
    browser,
  }) => {
    // GIVEN: User adds a product to cart in first browser session
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();

    await page1.goto('/products/the-3-in-1-shampoo-bar');
    await page1.waitForLoadState('networkidle');
    await page1.click('button[type="submit"]:has-text("Add to cart")');
    await expect(page1.locator('aside[aria-label="Cart"]')).toBeVisible();

    // Close cart drawer to see badge
    await page1.keyboard.press('Escape');
    const cartBadge = page1.locator('a[href="/cart"]').locator('span').first();
    const initialCount = await cartBadge.textContent();

    // Get cookies to persist across browser restart
    const cookies = await context1.cookies();

    // WHEN: User closes browser (close context)
    await page1.close();
    await context1.close();

    // AND: User reopens browser (new context with saved cookies)
    const context2 = await browser.newContext();
    await context2.addCookies(cookies);
    const page2 = await context2.newPage();

    await page2.goto('/');
    await page2.waitForLoadState('networkidle');

    // THEN: Cart still has the item (persisted via session cookie)
    const reloadedCount = await page2
      .locator('a[href="/cart"]')
      .locator('span')
      .first()
      .textContent();
    expect(reloadedCount).toBe(initialCount);

    // THEN: Cart page shows the product
    await page2.goto('/cart');
    await expect(
      page2.getByRole('heading', {name: 'The 3-in-1 Shampoo Bar'}),
    ).toBeVisible();

    // THEN: Cart subtotal is accurate
    await expect(page2.locator('text=/Total/')).toBeVisible();

    // Cleanup
    await page2.close();
    await context2.close();
  });

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

  test('[P0] should gracefully handle expired cart ID (AC3)', async ({
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

    // THEN: No error message shown to user
    const errorMessage = page.locator('text=/error|failed|wrong/i');
    await expect(errorMessage).not.toBeVisible();
  });

  test('[P0] should gracefully handle invalid/malformed cart ID (AC3)', async ({
    page,
    context,
  }) => {
    // GIVEN: User has a malformed cart ID in session cookie
    // Simulate by manually setting invalid cart ID in cookie
    await page.goto('/');
    await context.addCookies([
      {
        name: 'session',
        value: 'invalid_cart_id_malformed_data',
        domain: new URL(page.url()).hostname,
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);

    // WHEN: User visits site with invalid cart ID
    await page.reload();
    await page.waitForLoadState('networkidle');

    // THEN: App should recover gracefully without error
    await page.goto('/cart');

    // Should show empty cart (graceful fallback)
    const cartEmpty = page.getByText(/Your cart is empty|Looks like you haven't added anything yet/i);
    await expect(cartEmpty).toBeVisible();

    // THEN: No error message shown to user
    const errorMessage = page.locator('text=/error|failed|wrong/i');
    await expect(errorMessage).not.toBeVisible();

    // THEN: User can continue shopping (add new item)
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.click('button[type="submit"]:has-text("Add to cart")');
    await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

    // THEN: New cart ID replaces invalid one
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'session');
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.value).not.toBe('invalid_cart_id_malformed_data');
  });

  test('[P1] should handle cart deleted on Shopify (AC3)', async ({
    page,
    context,
  }) => {
    // GIVEN: User has a valid cart ID that was deleted on Shopify side
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('button[type="submit"]:has-text("Add to cart")');
    await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

    // Get cart ID from cookies
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'session');
    const cartIdExists = sessionCookie?.value.includes('cart');

    // Note: Can't actually delete cart on Shopify in test, but verify recovery path exists
    expect(cartIdExists || sessionCookie).toBeDefined();

    // WHEN: Cart fetch fails (simulated by clearing cookies)
    await context.clearCookies();

    // THEN: App should recover silently
    await page.goto('/cart');
    const cartEmpty = page.getByText(/Your cart is empty|Looks like you haven't added anything yet/i);
    await expect(cartEmpty).toBeVisible();

    // THEN: No error shown to user (warm error handling)
    const errorMessage = page.locator('text=/error|failed|something went wrong/i');
    await expect(errorMessage).not.toBeVisible();
  });
});
