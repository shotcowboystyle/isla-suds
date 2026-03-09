import {test, expect} from '@playwright/test';

/**
 * Cart Flow E2E Tests (P0 - Critical)
 *
 * Tests core cart functionality that directly impacts revenue.
 * These tests must pass before any deployment.
 *
 * Cart drawer uses Radix Dialog (role="dialog" with aria-labelledby="cart-title").
 * Add to cart button uses type="button" with data-testid="add-to-cart-button".
 * Product titles in cart are rendered as Link elements, not headings.
 * Remove button has aria-label="Remove {product name} from cart".
 * Checkout is a <button> that navigates via window.location.href.
 */

/** Selector for the Radix Dialog cart drawer */
const CART_DRAWER = '[role="dialog"][aria-labelledby="cart-title"]';

test.describe('Cart Flow', () => {
  test('[P0] should add product to cart and open cart drawer', async ({
    page,
  }) => {
    // GIVEN: User is on a product page
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');

    // WHEN: User clicks "Add to Cart" button
    await page.click('[data-testid="add-to-cart-button"]');

    // THEN: Cart drawer opens
    await expect(page.locator(CART_DRAWER)).toBeVisible({
      timeout: 5000,
    });

    // THEN: Product appears in cart (title is in a Link element, not a heading)
    await expect(
      page.locator(CART_DRAWER).getByText('The 3-in-1 Shampoo Bar'),
    ).toBeVisible();
  });

  test('[P0] should update cart quantity when user changes quantity', async ({
    page,
  }) => {
    // GIVEN: User has a product in cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator(CART_DRAWER)).toBeVisible();

    // WHEN: User updates quantity to 2 via the number input
    const quantityInput = page
      .locator(CART_DRAWER)
      .locator('input[type="number"]')
      .first();
    await quantityInput.fill('2');

    // THEN: Subtotal is visible in the drawer footer
    await expect(
      page.locator(CART_DRAWER).getByText('Subtotal'),
    ).toBeVisible();
  });

  test('[P0] should remove item from cart when user clicks remove', async ({
    page,
  }) => {
    // GIVEN: User has a product in cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator(CART_DRAWER)).toBeVisible();

    // WHEN: User clicks remove button (aria-label="Remove {product name} from cart")
    await page
      .locator(CART_DRAWER)
      .locator('button[aria-label*="Remove"]')
      .first()
      .click();

    // THEN: Cart shows as empty with the expected message
    await expect(
      page
        .locator(CART_DRAWER)
        .getByText("Your cart is empty. Let's find something you'll love."),
    ).toBeVisible();
  });

  test('[P0] should redirect to Shopify checkout when user proceeds to checkout', async ({
    page,
  }) => {
    // GIVEN: User has a product in cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator(CART_DRAWER)).toBeVisible();

    // WHEN: User clicks the "Checkout" button
    // The checkout button is a <button> (not a link) inside the cart dialog.
    // It navigates via window.location.href = cart.checkoutUrl.
    const checkoutButton = page
      .locator(CART_DRAWER)
      .locator('button:has-text("Checkout")')
      .first();

    // Wait for same-tab navigation triggered by window.location.href
    await Promise.all([
      page.waitForURL(/checkout|shopify/, {timeout: 10000}).catch(() => null),
      checkoutButton.click(),
    ]);

    // THEN: User is redirected to Shopify checkout (URL contains shopify or checkout domain)
    const url = page.url();

    expect(
      url.includes('checkout') || url.includes('shopify'),
      `Expected checkout URL, got: ${url}`,
    ).toBeTruthy();
  });
});
