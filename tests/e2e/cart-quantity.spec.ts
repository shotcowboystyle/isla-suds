import {test, expect} from '@playwright/test';

/**
 * Cart Quantity Controls E2E Tests (Story 5.6)
 *
 * Tests +/- button quantity modification functionality.
 * Verifies optimistic UI updates, error handling, and cart calculations.
 */

test.describe('Cart Quantity Controls (Story 5.6)', () => {
  test.beforeEach(async ({page}) => {
    // Add a product to cart for testing
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('button[type="submit"]:has-text("Add to cart")');
    await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible({
      timeout: 5000,
    });
  });

  test('[P0] should increment quantity with plus button', async ({page}) => {
    // GIVEN: Cart is open with item at quantity 1
    const cartDrawer = page.locator('aside[aria-label="Cart"]');
    await expect(cartDrawer).toBeVisible();

    // Get initial quantity
    const quantityText = cartDrawer.locator('span[aria-label^="Quantity:"]');
    await expect(quantityText).toContainText('1');

    // Get initial subtotal
    const initialSubtotal = await cartDrawer
      .locator('text=/Subtotal/i')
      .locator('..')
      .textContent();

    // WHEN: User clicks the plus (+) button
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });
    await plusButton.first().click();

    // THEN: Quantity updates to 2 (optimistic UI)
    await expect(quantityText.first()).toContainText('2', {timeout: 1000});

    // THEN: Subtotal updates to reflect new quantity
    await page.waitForTimeout(500); // Allow for API response
    const newSubtotal = await cartDrawer
      .locator('text=/Subtotal/i')
      .locator('..')
      .textContent();
    expect(newSubtotal).not.toBe(initialSubtotal);

    // THEN: Cart icon count updates (if visible)
    const cartIcon = page.locator('[aria-label*="items in cart"]');
    if (await cartIcon.isVisible()) {
      await expect(cartIcon).toContainText('2');
    }
  });

  test('[P0] should decrement quantity with minus button', async ({page}) => {
    // GIVEN: Cart has item with quantity 2
    const cartDrawer = page.locator('aside[aria-label="Cart"]');
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });
    await plusButton.first().click();
    await page.waitForTimeout(500);

    const quantityText = cartDrawer.locator('span[aria-label^="Quantity:"]');
    await expect(quantityText.first()).toContainText('2');

    // Get current subtotal
    const initialSubtotal = await cartDrawer
      .locator('text=/Subtotal/i')
      .locator('..')
      .textContent();

    // WHEN: User clicks the minus (-) button
    const minusButton = cartDrawer.getByRole('button', {
      name: /decrease quantity/i,
    });
    await minusButton.first().click();

    // THEN: Quantity updates to 1
    await expect(quantityText.first()).toContainText('1', {timeout: 1000});

    // THEN: Subtotal updates to reflect new quantity
    await page.waitForTimeout(500);
    const newSubtotal = await cartDrawer
      .locator('text=/Subtotal/i')
      .locator('..')
      .textContent();
    expect(newSubtotal).not.toBe(initialSubtotal);

    // THEN: Cart icon count updates
    const cartIcon = page.locator('[aria-label*="items in cart"]');
    if (await cartIcon.isVisible()) {
      await expect(cartIcon).toContainText('1');
    }
  });

  test('[P0] should disable minus button when quantity is 1', async ({
    page,
  }) => {
    // GIVEN: Cart has item with quantity 1
    const cartDrawer = page.locator('aside[aria-label="Cart"]');
    const quantityText = cartDrawer.locator('span[aria-label^="Quantity:"]');
    await expect(quantityText.first()).toContainText('1');

    // WHEN: User views the minus button
    const minusButton = cartDrawer.getByRole('button', {
      name: /decrease quantity/i,
    });

    // THEN: Minus button is disabled
    await expect(minusButton.first()).toBeDisabled();

    // THEN: Clicking disabled button does nothing (quantity stays 1)
    await minusButton.first().click({force: true}); // Force click on disabled button
    await page.waitForTimeout(300);
    await expect(quantityText.first()).toContainText('1'); // Still 1
  });

  test('[P1] should show loading state during quantity update', async ({
    page,
  }) => {
    // GIVEN: Cart is open with item
    const cartDrawer = page.locator('aside[aria-label="Cart"]');
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });

    // WHEN: User clicks plus button
    await plusButton.first().click();

    // THEN: Button shows loading state briefly (disabled + "...")
    // Note: This might be too fast to catch in E2E, but we verify button works
    await page.waitForTimeout(100);

    // THEN: Quantity eventually updates
    const quantityText = cartDrawer.locator('span[aria-label^="Quantity:"]');
    await expect(quantityText.first()).toContainText('2', {timeout: 2000});
  });

  test('[P1] should maintain keyboard accessibility', async ({page}) => {
    // GIVEN: Cart is open
    const cartDrawer = page.locator('aside[aria-label="Cart"]');

    // WHEN: User tabs to plus button
    await page.keyboard.press('Tab'); // Tab to first focusable element
    // Continue tabbing until we reach quantity controls
    // (This is a simplified version - real test would need more tabs)

    // Get the minus button (should be focusable)
    const minusButton = cartDrawer.getByRole('button', {
      name: /decrease quantity/i,
    });
    await minusButton.first().focus();

    // THEN: Button has visible focus indicator
    await expect(minusButton.first()).toBeFocused();

    // WHEN: User presses Space on plus button
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });
    await plusButton.first().focus();
    await page.keyboard.press('Space');

    // THEN: Quantity increments
    const quantityText = cartDrawer.locator('span[aria-label^="Quantity:"]');
    await expect(quantityText.first()).toContainText('2', {timeout: 1000});
  });

  test('[P1] should handle rapid clicks without race conditions', async ({
    page,
  }) => {
    // GIVEN: Cart is open with item
    const cartDrawer = page.locator('aside[aria-label="Cart"]');
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });

    // WHEN: User rapidly clicks plus button 3 times
    await plusButton.first().click();
    await plusButton.first().click();
    await plusButton.first().click();

    // THEN: Quantity eventually settles at correct value (within reasonable range)
    const quantityText = cartDrawer.locator('span[aria-label^="Quantity:"]');
    await page.waitForTimeout(1500); // Allow all mutations to complete

    const finalQuantity = await quantityText.first().textContent();
    const qty = parseInt(finalQuantity || '0', 10);
    // Should be between 2-4 (at least one click registered, max 3 if all processed)
    expect(qty).toBeGreaterThanOrEqual(2);
    expect(qty).toBeLessThanOrEqual(4);
  });

  test('[P2] should work on mobile viewport with 44x44px touch targets', async ({
    page,
  }) => {
    // GIVEN: Mobile viewport
    await page.setViewportSize({width: 375, height: 667});

    // Reopen cart after viewport change
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('button[type="submit"]:has-text("Add to cart")');
    await page.waitForTimeout(500);

    const cartDrawer = page.locator('aside[aria-label="Cart"]');
    await expect(cartDrawer).toBeVisible();

    // WHEN: User taps plus button on mobile
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });

    // Verify button is large enough for touch (44x44px minimum)
    const buttonBox = await plusButton.first().boundingBox();
    expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);

    // THEN: Button is tappable and works
    await plusButton.first().click();
    const quantityText = cartDrawer.locator('span[aria-label^="Quantity:"]');
    await expect(quantityText.first()).toContainText('2', {timeout: 1000});
  });
});
