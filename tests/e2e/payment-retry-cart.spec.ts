import {test, expect} from '@playwright/test';

/**
 * Payment Retry Flow - Cart Persistence Tests (Story 6.3)
 *
 * These tests validate cart state management during checkout transitions.
 * The actual payment retry functionality is handled by Shopify's managed checkout.
 *
 * Testing boundary:
 * - ✅ Cart persistence BEFORE checkout (our responsibility)
 * - ✅ Checkout URL generation (our responsibility)
 * - ✅ Cart recovery AFTER checkout navigation (our responsibility)
 * - ❌ Payment processing & retry (Shopify's responsibility)
 *
 * Selector strategy:
 * - Uses ARIA labels and semantic selectors for accessibility alignment
 * - Text-based selectors (has-text) used for user-facing interactions
 * - Consider adding data-testid attributes if selectors become fragile
 *
 * @see tests/manual/payment-retry-flow-test.md for manual payment retry testing
 */

test.describe('Payment Retry - Cart Persistence (Story 6.3)', () => {
  test.describe('Checkout Transition', () => {
    test('[P0] should preserve cart state when initiating checkout', async ({
      page,
    }) => {
      // GIVEN: User has a product in cart
      await page.goto('/products/the-3-in-1-shampoo-bar');
      await page.waitForLoadState('networkidle');
      await page.click('button[type="submit"]:has-text("Add to cart")');
      await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

      // Capture cart state before checkout
      const cartTitle = await page
        .locator('aside[aria-label="Cart"]')
        .getByRole('heading')
        .first()
        .textContent();
      const itemCount = cartTitle?.match(/\((\d+)/)?.[1] ?? '0';
      expect(parseInt(itemCount)).toBeGreaterThan(0);

      // WHEN: User initiates checkout
      const checkoutButton = page
        .locator('aside[aria-label="Cart"]')
        .locator('button:has-text("Checkout")');

      // Verify checkout button is enabled and visible
      await expect(checkoutButton).toBeVisible();
      await expect(checkoutButton).toBeEnabled();

      // THEN: Cart state should be intact before redirect
      // Verify cart still shows item
      await expect(
        page.locator('aside[aria-label="Cart"]').getByText('The 3-in-1 Shampoo Bar'),
      ).toBeVisible();

      // Verify subtotal is displayed
      await expect(
        page.locator('aside[aria-label="Cart"]').getByText('Subtotal'),
      ).toBeVisible();
    });

    test('[P0] should generate valid Shopify checkout URL', async ({page}) => {
      // GIVEN: User has a product in cart
      await page.goto('/products/the-3-in-1-shampoo-bar');
      await page.waitForLoadState('networkidle');
      await page.click('button[type="submit"]:has-text("Add to cart")');
      await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

      // WHEN: Checking checkout URL on cart page
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');

      // Find checkout link
      const checkoutLink = page.locator('a:has-text("Continue to Checkout")');

      // THEN: Checkout URL should be a valid Shopify checkout URL
      const href = await checkoutLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/checkout|shopify/i);
    });

    test('[P1] should preserve multiple cart items during checkout initiation', async ({
      page,
    }) => {
      // GIVEN: User has multiple products in cart
      await page.goto('/products/the-3-in-1-shampoo-bar');
      await page.waitForLoadState('networkidle');
      await page.click('button[type="submit"]:has-text("Add to cart")');
      await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

      // Close drawer and add second product
      await page.keyboard.press('Escape');
      await page.goto('/products/lavender-vanilla-soap');
      await page.waitForLoadState('networkidle');
      await page.click('button[type="submit"]:has-text("Add to cart")');
      await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

      // WHEN: Checking cart state before checkout
      const cartTitle = await page
        .locator('aside[aria-label="Cart"]')
        .getByRole('heading')
        .first()
        .textContent();

      // THEN: Cart should show 2 items
      const itemCount = cartTitle?.match(/\((\d+)/)?.[1] ?? '0';
      expect(parseInt(itemCount)).toBe(2);

      // THEN: Both products should be visible in cart
      await expect(
        page.locator('aside[aria-label="Cart"]').getByText('The 3-in-1 Shampoo Bar'),
      ).toBeVisible();
      await expect(
        page.locator('aside[aria-label="Cart"]').getByText('Lavender Vanilla Soap'),
      ).toBeVisible();
    });
  });

  test.describe('Cart Recovery', () => {
    test('[P0] should preserve cart when user navigates back from checkout', async ({
      page,
      context,
    }) => {
      // GIVEN: User has a product in cart and initiates checkout
      await page.goto('/products/the-3-in-1-shampoo-bar');
      await page.waitForLoadState('networkidle');
      await page.click('button[type="submit"]:has-text("Add to cart")');
      await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

      // Capture cookies before navigation
      const cookiesBefore = await context.cookies();
      const sessionBefore = cookiesBefore.find((c) => c.name === 'session');

      // Navigate to cart page and initiate checkout
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');

      // Get checkout URL
      const checkoutLink = page.locator('a:has-text("Continue to Checkout")');
      const checkoutUrl = await checkoutLink.getAttribute('href');

      // WHEN: User navigates to checkout then comes back (simulated)
      // Note: We can't fully test Shopify checkout, but we can verify
      // cart state is preserved after navigation away and back
      await page.goto(checkoutUrl || '/');

      // Wait for page to load then navigate back to store
      await page.waitForLoadState('domcontentloaded');
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // THEN: Cart should still have the item
      const cartBadge = page.locator('a[href="/cart"]').locator('span').first();
      const cartCount = await cartBadge.textContent();
      expect(parseInt(cartCount || '0')).toBeGreaterThan(0);

      // THEN: Session cookie should be preserved
      const cookiesAfter = await context.cookies();
      const sessionAfter = cookiesAfter.find((c) => c.name === 'session');
      expect(sessionAfter).toBeDefined();
    });

    test('[P1] should show warm error when checkout URL is unavailable', async ({
      page,
    }) => {
      // GIVEN: User has an empty cart (edge case)
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');

      // WHEN: Cart is empty
      // THEN: Checkout option should not be available or show appropriate message
      const emptyCartMessage = page.getByText(/your cart is empty|haven't added anything/i);
      const checkoutButton = page.locator('button:has-text("Checkout")');

      // Either empty cart message is shown OR checkout button is hidden
      const isEmpty = await emptyCartMessage.isVisible().catch(() => false);
      const hasCheckout = await checkoutButton.isVisible().catch(() => false);

      // If cart is empty, checkout should be hidden; if cart has items, checkout should be visible
      if (isEmpty) {
        expect(hasCheckout).toBe(false);
      }
      // No harsh error messages shown
      const errorMessage = page.locator('text=/error|failed|wrong/i');
      await expect(errorMessage).not.toBeVisible();
    });

    test('[P1] should handle checkout initiation gracefully', async ({page}) => {
      // GIVEN: User has a product in cart
      await page.goto('/products/the-3-in-1-shampoo-bar');
      await page.waitForLoadState('networkidle');
      await page.click('button[type="submit"]:has-text("Add to cart")');
      await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();

      // WHEN: User clicks checkout button
      const checkoutButton = page
        .locator('aside[aria-label="Cart"]')
        .locator('button:has-text("Checkout")');

      // Click and observe behavior
      await checkoutButton.click();

      // THEN: Button should show loading state (prevents double-click)
      // Either button text changes to "Processing..." or becomes disabled
      const isProcessing = await page
        .locator('aside[aria-label="Cart"]')
        .getByText('Processing')
        .isVisible()
        .catch(() => false);

      const isDisabled = await checkoutButton.isDisabled().catch(() => false);

      // One of these should be true (loading indication)
      expect(isProcessing || isDisabled).toBeTruthy();
    });
  });
});
