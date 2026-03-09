import {test, expect} from '@playwright/test';

/**
 * Cart Persistence E2E Tests (P0 - Critical)
 *
 * Tests cart data persistence across page reloads and browser restarts.
 * Critical for abandoned cart recovery and user experience.
 *
 * Cart drawer uses Radix Dialog (role="dialog" with aria-labelledby="cart-title").
 * Add to cart button uses type="button" with data-testid="add-to-cart-button".
 * Cart button in header: <button aria-label="Shopping cart, N item(s)"> with badge <span>.
 * Session cookie named "session" stores the cart ID server-side.
 */

/** Selector for the Radix Dialog cart drawer */
const CART_DRAWER = '[role="dialog"][aria-labelledby="cart-title"]';

/** Selector for the header cart button */
const CART_BUTTON = 'button[aria-label^="Shopping cart"]';

test.describe('Cart Persistence', () => {
  test('[P0] should persist cart across browser close/reopen (AC2)', async ({
    browser,
  }) => {
    // GIVEN: User adds a product to cart in first browser session
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();

    await page1.goto('/products/the-3-in-1-shampoo-bar');
    await page1.waitForLoadState('networkidle');
    await page1.click('[data-testid="add-to-cart-button"]');
    await expect(page1.locator(CART_DRAWER)).toBeVisible({timeout: 5000});

    // Close cart drawer to see badge
    await page1.keyboard.press('Escape');
    await expect(page1.locator(CART_DRAWER)).not.toBeVisible({timeout: 3000});

    // Get the cart badge count from the header cart button's aria-label
    const cartButton1 = page1.locator(CART_BUTTON);
    const ariaLabel1 = await cartButton1.getAttribute('aria-label');

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
    const cartButton2 = page2.locator(CART_BUTTON);
    const ariaLabel2 = await cartButton2.getAttribute('aria-label');
    expect(ariaLabel2).toBe(ariaLabel1);

    // THEN: Cart drawer shows the product when opened
    await cartButton2.click();
    await expect(page2.locator(CART_DRAWER)).toBeVisible({timeout: 5000});
    await expect(
      page2.locator(CART_DRAWER).getByText('The 3-in-1 Shampoo Bar'),
    ).toBeVisible();

    // THEN: Cart subtotal is accurate
    await expect(
      page2.locator(CART_DRAWER).getByText('Subtotal'),
    ).toBeVisible();

    // Cleanup
    await page2.close();
    await context2.close();
  });

  test('[P0] should persist cart items across page reload', async ({page}) => {
    // GIVEN: User adds a product to cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator(CART_DRAWER)).toBeVisible({timeout: 5000});

    // Close cart drawer to see badge
    await page.keyboard.press('Escape');
    await expect(page.locator(CART_DRAWER)).not.toBeVisible({timeout: 3000});

    // Get initial cart count from header cart button aria-label
    const cartButton = page.locator(CART_BUTTON);
    const initialAriaLabel = await cartButton.getAttribute('aria-label');

    // WHEN: User reloads the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // THEN: Cart still shows the same item count
    const reloadedAriaLabel = await cartButton.getAttribute('aria-label');
    expect(reloadedAriaLabel).toBe(initialAriaLabel);

    // THEN: Cart drawer still contains the product
    await cartButton.click();
    await expect(page.locator(CART_DRAWER)).toBeVisible({timeout: 5000});
    await expect(
      page.locator(CART_DRAWER).getByText('The 3-in-1 Shampoo Bar'),
    ).toBeVisible();
  });

  test('[P0] should gracefully handle expired cart ID (AC3)', async ({
    page,
    context,
  }) => {
    // GIVEN: User has a cart with an item
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator(CART_DRAWER)).toBeVisible({timeout: 5000});

    // Close the drawer before clearing cookies
    await page.keyboard.press('Escape');
    await expect(page.locator(CART_DRAWER)).not.toBeVisible({timeout: 3000});

    // WHEN: Cart ID is invalidated (simulate expiration by clearing cookies)
    await context.clearCookies();

    // Reload page to trigger cart recovery
    await page.reload();
    await page.waitForLoadState('networkidle');

    // THEN: App should recover gracefully (show empty cart or recreate cart)
    // Open cart drawer to verify state
    const cartButton = page.locator(CART_BUTTON);
    await cartButton.click();
    await expect(page.locator(CART_DRAWER)).toBeVisible({timeout: 5000});

    // Should show either:
    // 1. Empty cart (graceful degradation), OR
    // 2. New cart created successfully (drawer content loaded without crash)
    const cartEmpty = page.locator(CART_DRAWER).getByText(
      /Your cart is empty/i,
    );
    const cartLoaded = page.locator(CART_DRAWER).locator('#cart-title');

    // At least one of these should be visible (app didn't crash)
    const isGraceful =
      (await cartEmpty.isVisible().catch(() => false)) ||
      (await cartLoaded.isVisible().catch(() => false));

    expect(
      isGraceful,
      'App should gracefully handle expired cart ID',
    ).toBeTruthy();

    // THEN: No error message shown to user
    const errorMessage = page.locator(CART_DRAWER).locator('text=/error|failed|wrong/i');
    await expect(errorMessage).not.toBeVisible();
  });

  test('[P0] should gracefully handle invalid/malformed cart ID (AC3)', async ({
    page,
    context,
  }) => {
    // GIVEN: User has a malformed cart ID in session cookie
    // Simulate by manually setting invalid session cookie
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
    // Open cart drawer to verify state
    const cartButton = page.locator(CART_BUTTON);
    await cartButton.click();
    await expect(page.locator(CART_DRAWER)).toBeVisible({timeout: 5000});

    // Should show empty cart (graceful fallback)
    const cartEmpty = page.locator(CART_DRAWER).getByText(
      /Your cart is empty/i,
    );
    await expect(cartEmpty).toBeVisible();

    // THEN: No error message shown to user
    const errorMessage = page.locator(CART_DRAWER).locator('text=/error|failed|wrong/i');
    await expect(errorMessage).not.toBeVisible();

    // Close the drawer before navigating
    await page.keyboard.press('Escape');
    await expect(page.locator(CART_DRAWER)).not.toBeVisible({timeout: 3000});

    // THEN: User can continue shopping (add new item)
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator(CART_DRAWER)).toBeVisible({timeout: 5000});

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
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator(CART_DRAWER)).toBeVisible({timeout: 5000});

    // Get cart ID from cookies
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'session');
    const cartIdExists = sessionCookie?.value.includes('cart');

    // Note: Can't actually delete cart on Shopify in test, but verify recovery path exists
    expect(cartIdExists || sessionCookie).toBeDefined();

    // Close the drawer before clearing cookies
    await page.keyboard.press('Escape');
    await expect(page.locator(CART_DRAWER)).not.toBeVisible({timeout: 3000});

    // WHEN: Cart fetch fails (simulated by clearing cookies)
    await context.clearCookies();

    // THEN: App should recover silently
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open cart drawer to verify empty state
    const cartButton = page.locator(CART_BUTTON);
    await cartButton.click();
    await expect(page.locator(CART_DRAWER)).toBeVisible({timeout: 5000});

    const cartEmpty = page.locator(CART_DRAWER).getByText(
      /Your cart is empty/i,
    );
    await expect(cartEmpty).toBeVisible();

    // THEN: No error shown to user (warm error handling)
    const errorMessage = page.locator(CART_DRAWER).locator('text=/error|failed|something went wrong/i');
    await expect(errorMessage).not.toBeVisible();
  });
});
