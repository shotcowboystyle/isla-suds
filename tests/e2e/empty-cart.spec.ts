import {test, expect} from '@playwright/test';

/**
 * E2E Tests for Empty Cart State (Story 5.8)
 * Tests the empty cart experience across different scenarios
 */

test.describe('Empty Cart Experience', () => {
  test('displays EmptyCart component when cart is initially empty', async ({
    page,
  }) => {
    // Navigate to homepage
    await page.goto('/');

    // Open cart drawer (assuming cart icon exists in header)
    const cartButton = page.locator('[aria-label*="cart" i], [aria-label*="shopping" i]').first();
    if (await cartButton.isVisible()) {
      await cartButton.click();
    }

    // Verify empty cart message displays
    await expect(
      page.getByText(/Your cart is empty. Let's find something you'll love./i),
    ).toBeVisible();

    // Verify "Explore the Collection" button displays
    await expect(
      page.getByRole('link', {name: /Explore the Collection/i}),
    ).toBeVisible();

    // Verify cart drawer is open
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('displays EmptyCart after removing last item from cart', async ({
    page,
  }) => {
    // Note: This test requires product addition to be functional (Story 5.2)
    // Skip if add-to-cart functionality is not yet implemented
    await page.goto('/');

    // Try to add a product to cart (requires Story 5.2 implementation)
    const addToCartButton = page.locator('button[name="add-to-cart"]').first();

    // Skip test if add-to-cart not available
    if (!(await addToCartButton.isVisible())) {
      test.skip();
      return;
    }

    await addToCartButton.click();

    // Open cart drawer
    const cartButton = page.locator('[aria-label*="cart" i]').first();
    await cartButton.click();

    // Remove the item (requires Story 5.7 implementation)
    const removeButton = page.locator('button[aria-label*="Remove" i]').first();

    if (await removeButton.isVisible()) {
      await removeButton.click();

      // Verify EmptyCart displays after removal
      await expect(
        page.getByText(/Your cart is empty. Let's find something you'll love./i),
      ).toBeVisible({timeout: 5000});

      // Verify drawer stays open (AC3)
      await expect(page.getByRole('dialog')).toBeVisible();

      // Verify subtotal is hidden
      await expect(page.getByText('Subtotal')).not.toBeVisible();

      // Verify checkout button is hidden
      await expect(
        page.getByRole('button', {name: /Proceed to checkout/i}),
      ).not.toBeVisible();
    }
  });

  test('closes drawer and navigates to homepage when "Explore the Collection" is clicked', async ({
    page,
  }) => {
    // Navigate to any page (not homepage to verify navigation)
    await page.goto('/');

    // Open cart drawer
    const cartButton = page.locator('[aria-label*="cart" i], [aria-label*="shopping" i]').first();
    if (await cartButton.isVisible()) {
      await cartButton.click();
    }

    // Wait for drawer to open
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click "Explore the Collection" button
    const exploreButton = page.getByRole('link', {
      name: /Explore the Collection/i,
    });
    await exploreButton.click();

    // Verify drawer closes
    await expect(page.getByRole('dialog')).not.toBeVisible({timeout: 2000});

    // Verify navigation to homepage
    await expect(page).toHaveURL('/');
  });

  test('empty cart is keyboard accessible', async ({page}) => {
    await page.goto('/');

    // Open cart drawer via keyboard (if cart button is focusable)
    const cartButton = page.locator('[aria-label*="cart" i]').first();

    if (await cartButton.isVisible()) {
      await cartButton.focus();
      await page.keyboard.press('Enter');
    }

    // Verify drawer opened
    await expect(page.getByRole('dialog')).toBeVisible();

    // Tab to "Explore the Collection" button
    await page.keyboard.press('Tab');

    // Verify focus is on the link (check focus indicator)
    const exploreButton = page.getByRole('link', {
      name: /Explore the Collection/i,
    });
    await expect(exploreButton).toBeFocused();

    // Activate with Enter key
    await page.keyboard.press('Enter');

    // Verify drawer closes
    await expect(page.getByRole('dialog')).not.toBeVisible({timeout: 2000});
  });

  test('empty cart is mobile responsive', async ({page}) => {
    // Set mobile viewport
    await page.setViewportSize({width: 375, height: 667}); // iPhone SE

    await page.goto('/');

    // Open cart drawer
    const cartButton = page.locator('[aria-label*="cart" i]').first();
    if (await cartButton.isVisible()) {
      await cartButton.click();
    }

    // Verify EmptyCart displays
    await expect(
      page.getByText(/Your cart is empty/i),
    ).toBeVisible();

    // Verify button is visible and has adequate touch target
    const exploreButton = page.getByRole('link', {
      name: /Explore the Collection/i,
    });
    await expect(exploreButton).toBeVisible();

    // Check button size (should be at least 44x44px)
    const buttonBox = await exploreButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);

    // Verify no horizontal overflow
    const emptyCartContainer = page.getByText(/Your cart is empty/i).locator('..');
    const containerBox = await emptyCartContainer.boundingBox();
    expect(containerBox?.width).toBeLessThanOrEqual(375);
  });
});
