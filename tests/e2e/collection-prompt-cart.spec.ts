import {test, expect} from '@playwright/test';

/**
 * Collection Prompt Cart Integration E2E Tests (Story 4.3)
 *
 * Tests the full cart mutation flow from collection prompt:
 * - AC1: Add variety pack to cart from prompt
 * - AC2-AC4: Button states (loading → success → auto-close)
 * - AC6: Cart icon updates with new count
 * - AC7: Error recovery and retry
 * - AC8: Integration with existing cart flow
 */

test.describe('Collection Prompt - Cart Integration', () => {
  test.beforeEach(async ({page}) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('[P0] should add variety pack to cart and close prompt after success', async ({
    page,
  }) => {
    // GIVEN: User has explored 2+ products to trigger collection prompt
    // Simulate exploration by interacting with texture reveals
    const textureReveals = page.locator('[data-testid="texture-reveal"]');
    const firstReveal = textureReveals.first();
    const secondReveal = textureReveals.nth(1);

    // Explore first product
    await firstReveal.scrollIntoViewIfNeeded();
    await firstReveal.hover();
    await page.waitForTimeout(300); // Wait for reveal animation

    // Explore second product
    await secondReveal.scrollIntoViewIfNeeded();
    await secondReveal.hover();
    await page.waitForTimeout(300); // Wait for reveal animation

    // WHEN: Collection prompt appears (after 2+ products explored)
    const collectionPrompt = page.locator('[data-testid="collection-prompt"]');
    await expect(collectionPrompt).toBeVisible({timeout: 5000});

    // THEN: Prompt shows "Get the Collection" button
    const addButton = collectionPrompt.getByRole('button', {
      name: /get the collection/i,
    });
    await expect(addButton).toBeVisible();

    // WHEN: User clicks "Get the Collection" button
    await addButton.click();

    // THEN: Button shows loading state
    await expect(addButton).toHaveText('Adding...');
    await expect(addButton).toBeDisabled();

    // THEN: Button shows success state
    await expect(addButton).toHaveText(/added!.*✓/i, {timeout: 5000});

    // THEN: Prompt auto-closes after 1 second
    await expect(collectionPrompt).not.toBeVisible({timeout: 2000});

    // AND: Variety pack is in cart
    // Verify cart icon shows updated count
    const cartIcon = page.locator('[aria-label="Open cart"]');
    await expect(cartIcon).toContainText('1', {timeout: 3000});
  });

  test('[P0] should update cart icon count after adding variety pack', async ({
    page,
  }) => {
    // GIVEN: User triggers collection prompt
    const textureReveals = page.locator('[data-testid="texture-reveal"]');
    await textureReveals.first().hover();
    await page.waitForTimeout(300);
    await textureReveals.nth(1).hover();
    await page.waitForTimeout(300);

    const collectionPrompt = page.locator('[data-testid="collection-prompt"]');
    await expect(collectionPrompt).toBeVisible({timeout: 5000});

    // Get cart count before adding
    const cartIcon = page.locator('[aria-label="Open cart"]');
    const initialCountText = await cartIcon.textContent();
    const initialCount = initialCountText ? parseInt(initialCountText, 10) || 0 : 0;

    // WHEN: User adds variety pack from prompt
    const addButton = collectionPrompt.getByRole('button', {
      name: /get the collection/i,
    });
    await addButton.click();

    // Wait for success state
    await expect(addButton).toHaveText(/added!.*✓/i, {timeout: 5000});

    // THEN: Cart icon count increases by 1
    await expect(cartIcon).toContainText((initialCount + 1).toString(), {
      timeout: 3000,
    });
  });

  test('[P1] should display variety pack in cart drawer after adding from prompt', async ({
    page,
  }) => {
    // GIVEN: User triggers collection prompt and adds variety pack
    const textureReveals = page.locator('[data-testid="texture-reveal"]');
    await textureReveals.first().hover();
    await page.waitForTimeout(300);
    await textureReveals.nth(1).hover();
    await page.waitForTimeout(300);

    const collectionPrompt = page.locator('[data-testid="collection-prompt"]');
    await expect(collectionPrompt).toBeVisible({timeout: 5000});

    const addButton = collectionPrompt.getByRole('button', {
      name: /get the collection/i,
    });
    await addButton.click();

    // Wait for success and prompt to close
    await expect(collectionPrompt).not.toBeVisible({timeout: 2000});

    // WHEN: User opens cart drawer
    const cartIcon = page.locator('[aria-label="Open cart"]');
    await cartIcon.click();

    // THEN: Cart drawer opens and shows variety pack
    const cartDrawer = page.locator('aside[aria-label="Cart"]');
    await expect(cartDrawer).toBeVisible({timeout: 3000});

    // Verify variety pack product is in cart
    await expect(cartDrawer.getByRole('heading')).toContainText(/variety/i, {
      timeout: 3000,
    });
  });

  test('[P1] should handle cart mutation error gracefully with retry', async ({
    page,
  }) => {
    // Intercept cart mutation and force error on first attempt
    let attemptCount = 0;
    await page.route('**/cart', async (route) => {
      attemptCount++;
      if (attemptCount === 1) {
        // First attempt: return error
        await route.fulfill({
          status: 500,
          body: JSON.stringify({errors: [{message: 'Server error'}]}),
        });
      } else {
        // Second attempt: allow success
        await route.continue();
      }
    });

    // GIVEN: User triggers collection prompt
    const textureReveals = page.locator('[data-testid="texture-reveal"]');
    await textureReveals.first().hover();
    await page.waitForTimeout(300);
    await textureReveals.nth(1).hover();
    await page.waitForTimeout(300);

    const collectionPrompt = page.locator('[data-testid="collection-prompt"]');
    await expect(collectionPrompt).toBeVisible({timeout: 5000});

    // WHEN: User clicks "Get the Collection" and error occurs
    const addButton = collectionPrompt.getByRole('button', {
      name: /get the collection/i,
    });
    await addButton.click();

    // THEN: Error message is displayed
    const errorMessage = collectionPrompt.getByRole('status');
    await expect(errorMessage).toHaveText(/something went wrong/i, {
      timeout: 3000,
    });

    // AND: Button resets to "Get the Collection" (allows retry)
    await expect(addButton).toHaveText(/get the collection/i);
    await expect(addButton).not.toBeDisabled();

    // AND: Prompt does NOT auto-close on error
    await page.waitForTimeout(2000);
    await expect(collectionPrompt).toBeVisible();

    // WHEN: User retries by clicking button again
    await addButton.click();

    // THEN: Second attempt succeeds
    await expect(addButton).toHaveText(/added!.*✓/i, {timeout: 5000});

    // AND: Prompt auto-closes after success
    await expect(collectionPrompt).not.toBeVisible({timeout: 2000});
  });

  test('[P1] should prevent prompt from re-appearing after successful add', async ({
    page,
  }) => {
    // GIVEN: User successfully adds variety pack from prompt
    const textureReveals = page.locator('[data-testid="texture-reveal"]');
    await textureReveals.first().hover();
    await page.waitForTimeout(300);
    await textureReveals.nth(1).hover();
    await page.waitForTimeout(300);

    const collectionPrompt = page.locator('[data-testid="collection-prompt"]');
    await expect(collectionPrompt).toBeVisible({timeout: 5000});

    const addButton = collectionPrompt.getByRole('button', {
      name: /get the collection/i,
    });
    await addButton.click();
    await expect(collectionPrompt).not.toBeVisible({timeout: 2000});

    // WHEN: User continues exploring products
    await textureReveals.nth(2).scrollIntoViewIfNeeded();
    await textureReveals.nth(2).hover();
    await page.waitForTimeout(300);

    // THEN: Prompt does NOT re-appear (storyMomentShown = true)
    await page.waitForTimeout(2000);
    await expect(collectionPrompt).not.toBeVisible();
  });

  test('[P2] should maintain cart persistence after prompt add', async ({
    page,
    context,
  }) => {
    // GIVEN: User adds variety pack from prompt
    const textureReveals = page.locator('[data-testid="texture-reveal"]');
    await textureReveals.first().hover();
    await page.waitForTimeout(300);
    await textureReveals.nth(1).hover();
    await page.waitForTimeout(300);

    const collectionPrompt = page.locator('[data-testid="collection-prompt"]');
    await expect(collectionPrompt).toBeVisible({timeout: 5000});

    const addButton = collectionPrompt.getByRole('button', {
      name: /get the collection/i,
    });
    await addButton.click();
    await expect(collectionPrompt).not.toBeVisible({timeout: 2000});

    // Verify variety pack in cart
    const cartIcon = page.locator('[aria-label="Open cart"]');
    await expect(cartIcon).toContainText('1', {timeout: 3000});

    // WHEN: User closes and reopens browser (simulate with new page in same context)
    const newPage = await context.newPage();
    await newPage.goto('/');
    await newPage.waitForLoadState('networkidle');

    // THEN: Cart still contains variety pack (persisted)
    const newCartIcon = newPage.locator('[aria-label="Open cart"]');
    await expect(newCartIcon).toContainText('1', {timeout: 3000});

    await newPage.close();
  });

  test('[P2] should work with checkout flow after adding from prompt', async ({
    page,
  }) => {
    // GIVEN: User adds variety pack from prompt
    const textureReveals = page.locator('[data-testid="texture-reveal"]');
    await textureReveals.first().hover();
    await page.waitForTimeout(300);
    await textureReveals.nth(1).hover();
    await page.waitForTimeout(300);

    const collectionPrompt = page.locator('[data-testid="collection-prompt"]');
    await expect(collectionPrompt).toBeVisible({timeout: 5000});

    const addButton = collectionPrompt.getByRole('button', {
      name: /get the collection/i,
    });
    await addButton.click();
    await expect(collectionPrompt).not.toBeVisible({timeout: 2000});

    // WHEN: User opens cart and proceeds to checkout
    const cartIcon = page.locator('[aria-label="Open cart"]');
    await cartIcon.click();

    const cartDrawer = page.locator('aside[aria-label="Cart"]');
    await expect(cartDrawer).toBeVisible({timeout: 3000});

    const checkoutButton = cartDrawer.getByRole('link', {
      name: /check out/i,
    });
    await expect(checkoutButton).toBeVisible();

    // Click checkout (will redirect to Shopify)
    const [newPage] = await Promise.all([
      page.waitForEvent('popup', {timeout: 10000}),
      checkoutButton.click(),
    ]);

    // THEN: Checkout page opens with variety pack
    await newPage.waitForLoadState('networkidle', {timeout: 10000});
    expect(newPage.url()).toContain('shopify');
    expect(newPage.url()).toContain('checkouts');

    await newPage.close();
  });
});

/**
 * Accessibility tests for collection prompt cart mutation (Story 4.3)
 *
 * Verifies:
 * - Button state announcements
 * - Error message ARIA live region
 * - Keyboard accessibility
 * - Focus management
 */
test.describe('Collection Prompt - Cart Accessibility', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('[P1] should announce button states to screen readers', async ({
    page,
  }) => {
    // Trigger collection prompt
    const textureReveals = page.locator('[data-testid="texture-reveal"]');
    await textureReveals.first().hover();
    await page.waitForTimeout(300);
    await textureReveals.nth(1).hover();
    await page.waitForTimeout(300);

    const collectionPrompt = page.locator('[data-testid="collection-prompt"]');
    await expect(collectionPrompt).toBeVisible({timeout: 5000});

    const addButton = collectionPrompt.getByRole('button', {
      name: /get the collection/i,
    });

    // Verify button has accessible text at each state
    await expect(addButton).toHaveAccessibleName(/get the collection/i);

    await addButton.click();

    // Loading state
    await expect(addButton).toHaveAccessibleName(/adding/i);

    // Success state
    await expect(addButton).toHaveAccessibleName(/added/i, {timeout: 5000});
  });

  test('[P1] should announce error message via ARIA live region', async ({
    page,
  }) => {
    // Force error
    await page.route('**/cart', async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({errors: [{message: 'Error'}]}),
      });
    });

    // Trigger prompt and click button
    const textureReveals = page.locator('[data-testid="texture-reveal"]');
    await textureReveals.first().hover();
    await page.waitForTimeout(300);
    await textureReveals.nth(1).hover();
    await page.waitForTimeout(300);

    const collectionPrompt = page.locator('[data-testid="collection-prompt"]');
    await expect(collectionPrompt).toBeVisible({timeout: 5000});

    const addButton = collectionPrompt.getByRole('button', {
      name: /get the collection/i,
    });
    await addButton.click();

    // Error message should have ARIA live region
    const errorMessage = collectionPrompt.getByRole('status');
    await expect(errorMessage).toBeVisible({timeout: 3000});
    await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });

  test('[P1] should be fully keyboard-accessible', async ({page}) => {
    // Trigger prompt
    const textureReveals = page.locator('[data-testid="texture-reveal"]');
    await textureReveals.first().hover();
    await page.waitForTimeout(300);
    await textureReveals.nth(1).hover();
    await page.waitForTimeout(300);

    const collectionPrompt = page.locator('[data-testid="collection-prompt"]');
    await expect(collectionPrompt).toBeVisible({timeout: 5000});

    // Tab to "Get the Collection" button
    await page.keyboard.press('Tab');
    const addButton = collectionPrompt.getByRole('button', {
      name: /get the collection/i,
    });
    await expect(addButton).toBeFocused();

    // Press Enter to activate
    await page.keyboard.press('Enter');

    // Success state should still be keyboard-accessible (but disabled)
    await expect(addButton).toHaveText(/added!.*✓/i, {timeout: 5000});
  });
});
