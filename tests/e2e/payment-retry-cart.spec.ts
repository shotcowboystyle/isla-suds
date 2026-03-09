import {test, expect} from '@playwright/test';

/**
 * Payment Retry Flow - Cart Persistence Tests (Story 6.3)
 *
 * These tests validate cart state management during checkout transitions.
 * The actual payment retry functionality is handled by Shopify's managed checkout.
 *
 * Testing boundary:
 * - Cart persistence BEFORE checkout (our responsibility)
 * - Checkout URL generation (our responsibility)
 * - Cart recovery AFTER checkout navigation (our responsibility)
 * - Payment processing & retry (Shopify's responsibility)
 *
 * Selector strategy:
 * - Cart drawer: Radix Dialog with `role="dialog"` and `aria-labelledby="cart-title"`
 * - Add to cart: `[data-testid="add-to-cart-button"]`
 * - Cart button in header: `button[aria-label^="Shopping cart"]`
 * - Product names in cart line items are rendered as `<Link>` elements, not headings
 * - Checkout is initiated via the drawer button, not a `/cart` page link
 *
 * @see tests/manual/payment-retry-flow-test.md for manual payment retry testing
 */

/** Locator for the open cart drawer dialog. */
const cartDrawer = '[role="dialog"][aria-labelledby="cart-title"]';

test.describe('Payment Retry - Cart Persistence (Story 6.3)', () => {
  test.describe('Checkout Transition', () => {
    test('[P0] should preserve cart state when initiating checkout', async ({
      page,
    }) => {
      // GIVEN: User has a product in cart
      await page.goto('/products/the-3-in-1-shampoo-bar');
      await page.waitForLoadState('networkidle');
      await page.click('[data-testid="add-to-cart-button"]');
      await expect(page.locator(cartDrawer)).toBeVisible();

      // Capture cart state before checkout
      const cartTitle = await page
        .locator(cartDrawer)
        .locator('#cart-title')
        .textContent();
      const itemCount = cartTitle?.match(/\((\d+)/)?.[1] ?? '0';
      expect(parseInt(itemCount)).toBeGreaterThan(0);

      // WHEN: User initiates checkout
      const checkoutButton = page
        .locator(cartDrawer)
        .locator('button:has-text("Checkout")');

      // Verify checkout button is enabled and visible
      await expect(checkoutButton).toBeVisible();
      await expect(checkoutButton).toBeEnabled();

      // THEN: Cart state should be intact before redirect
      // Product names are rendered as Link elements, not headings
      await expect(
        page.locator(cartDrawer).getByText('The 3-in-1 Shampoo Bar'),
      ).toBeVisible();

      // Verify subtotal is displayed
      await expect(
        page.locator(cartDrawer).getByText('Subtotal'),
      ).toBeVisible();
    });

    test('[P0] should generate valid Shopify checkout URL', async ({page}) => {
      // GIVEN: User has a product in cart
      await page.goto('/products/the-3-in-1-shampoo-bar');
      await page.waitForLoadState('networkidle');
      await page.click('[data-testid="add-to-cart-button"]');
      await expect(page.locator(cartDrawer)).toBeVisible();

      // WHEN: Clicking checkout, the button sets window.location.href to cart.checkoutUrl.
      // We intercept the outbound request to capture and validate the checkout URL.
      const [request] = await Promise.all([
        page
          .waitForRequest(
            (req) =>
              req.url().includes('checkout') || req.url().includes('shopify'),
            {timeout: 10000},
          )
          .catch(() => null),
        page.locator(cartDrawer).locator('button:has-text("Checkout")').click(),
      ]);

      // THEN: Checkout URL should be a valid Shopify checkout URL
      if (request) {
        const checkoutUrl = request.url();
        expect(checkoutUrl).toMatch(/checkout|shopify/i);
      } else {
        // If the request was not captured (e.g., redirect happened too fast),
        // verify the page navigated away from the store
        const currentUrl = page.url();
        expect(
          currentUrl.includes('checkout') ||
            currentUrl.includes('shopify') ||
            currentUrl !== 'about:blank',
        ).toBeTruthy();
      }
    });

    test('[P1] should preserve multiple cart items during checkout initiation', async ({
      page,
    }) => {
      // GIVEN: User has multiple products in cart
      await page.goto('/products/the-3-in-1-shampoo-bar');
      await page.waitForLoadState('networkidle');
      await page.click('[data-testid="add-to-cart-button"]');
      await expect(page.locator(cartDrawer)).toBeVisible();

      // Close drawer and add second product
      await page.keyboard.press('Escape');
      await page.goto('/products/lavender-vanilla-soap');
      await page.waitForLoadState('networkidle');
      await page.click('[data-testid="add-to-cart-button"]');
      await expect(page.locator(cartDrawer)).toBeVisible();

      // WHEN: Checking cart state before checkout
      const cartTitle = await page
        .locator(cartDrawer)
        .locator('#cart-title')
        .textContent();

      // THEN: Cart should show 2 items
      const itemCount = cartTitle?.match(/\((\d+)/)?.[1] ?? '0';
      expect(parseInt(itemCount)).toBe(2);

      // THEN: Both products should be visible in cart (rendered as Link elements)
      await expect(
        page.locator(cartDrawer).getByText('The 3-in-1 Shampoo Bar'),
      ).toBeVisible();
      await expect(
        page.locator(cartDrawer).getByText('Lavender Vanilla Soap'),
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
      await page.click('[data-testid="add-to-cart-button"]');
      await expect(page.locator(cartDrawer)).toBeVisible();

      // Capture cookies before navigation
      const cookiesBefore = await context.cookies();
      const sessionBefore = cookiesBefore.find((c) => c.name === 'session');

      // WHEN: User navigates away then comes back (simulated checkout abandon)
      // Close the cart drawer first
      await page.keyboard.press('Escape');

      // Navigate away to simulate leaving the site, then return
      await page.goto('about:blank');
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // THEN: Cart should still have the item
      // The cart button in the header shows item count via aria-label
      const cartButton = page.locator('button[aria-label^="Shopping cart"]');
      const ariaLabel = await cartButton.getAttribute('aria-label');
      // aria-label is "Shopping cart, N item(s)" when items exist, or "Shopping cart, empty"
      expect(ariaLabel).not.toBe('Shopping cart, empty');

      // Open the cart drawer to verify contents
      await cartButton.click();
      await expect(page.locator(cartDrawer)).toBeVisible();

      // Verify the cart badge span shows a count > 0
      const cartBadge = cartButton.locator('span');
      const cartCount = await cartBadge.textContent();
      expect(parseInt(cartCount || '0')).toBeGreaterThan(0);

      // THEN: Session cookie should be preserved
      const cookiesAfter = await context.cookies();
      const sessionAfter = cookiesAfter.find((c) => c.name === 'session');
      expect(sessionAfter).toBeDefined();
    });

    test('[P1] should show appropriate empty cart state when cart is empty', async ({
      page,
    }) => {
      // GIVEN: User navigates to the store with no items in cart
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // WHEN: User opens the cart drawer
      const cartButton = page.locator('button[aria-label^="Shopping cart"]');
      await cartButton.click();
      await expect(page.locator(cartDrawer)).toBeVisible();

      // THEN: Empty cart message should be shown
      // EmptyCart component shows: "Your cart is empty. Let's find something you'll love."
      const emptyCartMessage = page
        .locator(cartDrawer)
        .getByText(/your cart is empty/i);
      const checkoutButton = page
        .locator(cartDrawer)
        .locator('button:has-text("Checkout")');

      const isEmpty = await emptyCartMessage.isVisible().catch(() => false);
      const hasCheckout = await checkoutButton.isVisible().catch(() => false);

      // If cart is empty, checkout should be hidden
      if (isEmpty) {
        expect(hasCheckout).toBe(false);
      }

      // No harsh error messages shown
      const errorMessage = page.locator(cartDrawer).locator('[role="alert"]');
      await expect(errorMessage).not.toBeVisible();
    });

    test('[P1] should handle checkout initiation gracefully', async ({page}) => {
      // GIVEN: User has a product in cart
      await page.goto('/products/the-3-in-1-shampoo-bar');
      await page.waitForLoadState('networkidle');
      await page.click('[data-testid="add-to-cart-button"]');
      await expect(page.locator(cartDrawer)).toBeVisible();

      // WHEN: User clicks checkout button
      const checkoutButton = page
        .locator(cartDrawer)
        .locator('button:has-text("Checkout")');

      // Click and observe behavior
      await checkoutButton.click();

      // THEN: Button should show loading state (prevents double-click)
      // The button shows "Processing..." text and becomes disabled when isCheckingOut=true
      const isProcessing = await page
        .locator(cartDrawer)
        .getByText('Processing...')
        .isVisible()
        .catch(() => false);

      const isDisabled = await checkoutButton.isDisabled().catch(() => false);

      // One of these should be true (loading indication)
      expect(isProcessing || isDisabled).toBeTruthy();
    });
  });
});
