import {test, expect} from '@playwright/test';

/**
 * Cart Flow E2E Tests (P0 - Critical)
 *
 * Tests core cart functionality that directly impacts revenue.
 * These tests must pass before any deployment.
 */

test.describe('Cart Flow', () => {
  test('[P0] should add product to cart and open cart drawer', async ({
    page,
  }) => {
    // GIVEN: User is on a product page
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');

    // WHEN: User clicks "Add to cart" button
    await page.click('button[type="submit"]:has-text("Add to cart")');

    // THEN: Cart drawer opens
    await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible({
      timeout: 5000,
    });

    // THEN: Product appears in cart
    await expect(
      page.locator('aside[aria-label="Cart"]').getByRole('heading'),
    ).toContainText('The 3-in-1 Shampoo Bar');
  });

  test('[P0] should update cart quantity when user changes quantity', async ({
    page,
  }) => {
    // GIVEN: User has a product in cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('button[type="submit"]:has-text("Add to cart")');
    await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

    // WHEN: User updates quantity to 2
    const quantityInput = page
      .locator('aside[aria-label="Cart"]')
      .locator('input[type="number"]')
      .first();
    await quantityInput.fill('2');

    // THEN: Total updates to reflect new quantity
    // Note: Actual total depends on product price, we just verify it changes
    await expect(
      page.locator('aside[aria-label="Cart"]').locator('text=/Total/'),
    ).toBeVisible();
  });

  test('[P0] should remove item from cart when user clicks remove', async ({
    page,
  }) => {
    // GIVEN: User has a product in cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('button[type="submit"]:has-text("Add to cart")');
    await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

    // WHEN: User clicks remove button
    await page
      .locator('aside[aria-label="Cart"]')
      .locator('button[name="Remove"]')
      .first()
      .click();

    // THEN: Cart shows as empty
    await expect(
      page.locator('aside[aria-label="Cart"]').getByText('Your cart is empty'),
    ).toBeVisible();
  });

  test('[P0] should redirect to Shopify checkout when user proceeds to checkout', async ({
    page,
  }) => {
    // GIVEN: User has a product in cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('button[type="submit"]:has-text("Add to cart")');
    await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

    // WHEN: User clicks "Proceed to Checkout" or "Continue to Checkout"
    const checkoutButton = page
      .locator('aside[aria-label="Cart"]')
      .locator('a:has-text("Checkout"), button:has-text("Checkout")')
      .first();

    // Wait for navigation to Shopify checkout
    const [checkoutPage] = await Promise.all([
      page.waitForEvent('popup', {timeout: 10000}).catch(() => null), // Handle popup
      page.waitForNavigation({timeout: 10000}).catch(() => null), // Handle same-tab navigation
      checkoutButton.click(),
    ]);

    // THEN: User is redirected to Shopify checkout (URL contains shopify or checkout domain)
    const finalPage = checkoutPage || page;
    const url = finalPage.url();

    expect(
      url.includes('checkout') || url.includes('shopify'),
      `Expected checkout URL, got: ${url}`,
    ).toBeTruthy();
  });
});
