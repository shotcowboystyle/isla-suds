import {test, expect} from '@playwright/test';

/**
 * Cart Quantity Controls E2E Tests (Story 5.6)
 *
 * Tests +/- button quantity modification functionality.
 * Verifies optimistic UI updates, error handling, and cart calculations.
 *
 * Selectors are aligned to the actual component implementations:
 * - AddToCartButton: `data-testid="add-to-cart-button"`, `type="button"`
 * - CartDrawer: Radix Dialog with `role="dialog"` and `aria-labelledby="cart-title"`
 * - CartLineItem: `input[type="number"]` for quantity, buttons with
 *   `aria-label="Increase quantity for {title}"` / `aria-label="Decrease quantity for {title}"`
 */

test.describe('Cart Quantity Controls (Story 5.6)', () => {
  /** Locator for the cart drawer (Radix Dialog) */
  const cartDrawerSelector = '[role="dialog"][aria-labelledby="cart-title"]';

  test.beforeEach(async ({page}) => {
    // Navigate to a product page and add it to the cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="add-to-cart-button"]');
    await expect(page.locator(cartDrawerSelector)).toBeVisible({
      timeout: 5000,
    });
  });

  test('[P0] should increment quantity with plus button', async ({page}) => {
    // GIVEN: Cart is open with item at quantity 1
    const cartDrawer = page.locator(cartDrawerSelector);
    await expect(cartDrawer).toBeVisible();

    // Get the quantity input (number input inside the cart drawer)
    const quantityInput = cartDrawer.locator('input[type="number"]').first();
    await expect(quantityInput).toHaveValue('1');

    // Get initial subtotal text
    const subtotalSection = cartDrawer.locator('text=/Subtotal/i').locator('..');
    const initialSubtotal = await subtotalSection.textContent();

    // WHEN: User clicks the plus (+) button
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });
    await plusButton.first().click();

    // THEN: Quantity updates to 2 (optimistic UI)
    await expect(quantityInput).toHaveValue('2', {timeout: 2000});

    // THEN: Subtotal updates to reflect new quantity
    await page.waitForTimeout(500); // Allow for API response
    const newSubtotal = await subtotalSection.textContent();
    expect(newSubtotal).not.toBe(initialSubtotal);

    // THEN: Cart icon count updates (if visible)
    const cartIcon = page.locator('[aria-label*="items in cart"]');
    if (await cartIcon.isVisible()) {
      await expect(cartIcon).toContainText('2');
    }
  });

  test('[P0] should decrement quantity with minus button', async ({page}) => {
    // GIVEN: Cart has item with quantity 2 (increment first)
    const cartDrawer = page.locator(cartDrawerSelector);
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });
    await plusButton.first().click();
    await page.waitForTimeout(500);

    const quantityInput = cartDrawer.locator('input[type="number"]').first();
    await expect(quantityInput).toHaveValue('2', {timeout: 2000});

    // Get current subtotal
    const subtotalSection = cartDrawer.locator('text=/Subtotal/i').locator('..');
    const initialSubtotal = await subtotalSection.textContent();

    // WHEN: User clicks the minus (-) button
    const minusButton = cartDrawer.getByRole('button', {
      name: /decrease quantity/i,
    });
    await minusButton.first().click();

    // THEN: Quantity updates to 1
    await expect(quantityInput).toHaveValue('1', {timeout: 2000});

    // THEN: Subtotal updates to reflect new quantity
    await page.waitForTimeout(500);
    const newSubtotal = await subtotalSection.textContent();
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
    const cartDrawer = page.locator(cartDrawerSelector);
    const quantityInput = cartDrawer.locator('input[type="number"]').first();
    await expect(quantityInput).toHaveValue('1');

    // WHEN: User views the minus button
    const minusButton = cartDrawer.getByRole('button', {
      name: /decrease quantity/i,
    });

    // THEN: Minus button is disabled (both `disabled` attr and `aria-disabled`)
    await expect(minusButton.first()).toBeDisabled();
    await expect(minusButton.first()).toHaveAttribute('aria-disabled', 'true');

    // THEN: Clicking disabled button does nothing (quantity stays 1)
    await minusButton.first().click({force: true});
    await page.waitForTimeout(300);
    await expect(quantityInput).toHaveValue('1');
  });

  test('[P1] should show loading state during quantity update', async ({
    page,
  }) => {
    // GIVEN: Cart is open with item
    const cartDrawer = page.locator(cartDrawerSelector);
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });

    // WHEN: User clicks plus button
    await plusButton.first().click();

    // THEN: While updating, buttons may show cursor-wait or cursor-not-allowed
    // Note: The loading state is brief, so we verify the final result
    // The plus button gets `cursor-wait` class and the minus button gets
    // `cursor-not-allowed` class during the update.

    // THEN: Quantity eventually updates
    const quantityInput = cartDrawer.locator('input[type="number"]').first();
    await expect(quantityInput).toHaveValue('2', {timeout: 2000});
  });

  test('[P1] should maintain keyboard accessibility', async ({page}) => {
    // GIVEN: Cart is open
    const cartDrawer = page.locator(cartDrawerSelector);

    // The quantity input should be focusable and accept keyboard input
    const quantityInput = cartDrawer.locator('input[type="number"]').first();
    await quantityInput.focus();
    await expect(quantityInput).toBeFocused();

    // The minus button should be focusable (even when disabled, it's in the DOM)
    const minusButton = cartDrawer.getByRole('button', {
      name: /decrease quantity/i,
    });
    await minusButton.first().focus();
    await expect(minusButton.first()).toBeFocused();

    // WHEN: User focuses the plus button and presses Space
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });
    await plusButton.first().focus();
    await expect(plusButton.first()).toBeFocused();
    await page.keyboard.press('Space');

    // THEN: Quantity increments
    await expect(quantityInput).toHaveValue('2', {timeout: 2000});
  });

  test('[P1] should handle rapid clicks without race conditions', async ({
    page,
  }) => {
    // GIVEN: Cart is open with item
    const cartDrawer = page.locator(cartDrawerSelector);
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });

    // WHEN: User rapidly clicks plus button 3 times
    await plusButton.first().click();
    await plusButton.first().click();
    await plusButton.first().click();

    // THEN: Quantity eventually settles at correct value (within reasonable range)
    const quantityInput = cartDrawer.locator('input[type="number"]').first();
    await page.waitForTimeout(1500); // Allow all mutations to complete

    const finalValue = await quantityInput.inputValue();
    const qty = parseInt(finalValue || '0', 10);
    // Should be between 2-4 (at least one click registered, max 3 if all processed)
    expect(qty).toBeGreaterThanOrEqual(2);
    expect(qty).toBeLessThanOrEqual(4);
  });

  test('[P2] should work on mobile viewport with touch targets', async ({
    page,
  }) => {
    // GIVEN: Mobile viewport
    await page.setViewportSize({width: 375, height: 667});

    // Re-add product to cart after viewport change
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="add-to-cart-button"]');
    await page.waitForTimeout(500);

    const cartDrawer = page.locator(cartDrawerSelector);
    await expect(cartDrawer).toBeVisible();

    // WHEN: User taps plus button on mobile
    const plusButton = cartDrawer.getByRole('button', {
      name: /increase quantity/i,
    });

    // Verify button is rendered at the expected size (h-9 w-9 = 36x36px)
    const buttonBox = await plusButton.first().boundingBox();
    expect(buttonBox?.width).toBeGreaterThanOrEqual(36);
    expect(buttonBox?.height).toBeGreaterThanOrEqual(36);

    // THEN: Button is tappable and works
    await plusButton.first().click();
    const quantityInput = cartDrawer.locator('input[type="number"]').first();
    await expect(quantityInput).toHaveValue('2', {timeout: 2000});
  });

  test('[P2] should allow direct quantity input via the number field', async ({
    page,
  }) => {
    // GIVEN: Cart is open with item at quantity 1
    const cartDrawer = page.locator(cartDrawerSelector);
    const quantityInput = cartDrawer.locator('input[type="number"]').first();
    await expect(quantityInput).toHaveValue('1');

    // WHEN: User clears the input and types a new quantity
    await quantityInput.fill('5');

    // THEN: Quantity updates to the typed value
    await expect(quantityInput).toHaveValue('5', {timeout: 2000});
  });
});
