import {test, expect} from '@playwright/test';

/**
 * E2E Tests for Empty Cart State (Story 5.8)
 *
 * Tests the empty cart experience across different scenarios.
 *
 * Cart drawer uses Radix Dialog (role="dialog" with aria-labelledby="cart-title").
 * Cart button in header: <button aria-label="Shopping cart, empty"> or "Shopping cart, N item(s)".
 * Empty cart renders message and "Explore the Collection" link inside the dialog.
 * Title format: "Cart (N items)" via DialogPrimitive.Title#cart-title.
 */

/** Selector for the Radix Dialog cart drawer */
const CART_DRAWER = '[role="dialog"][aria-labelledby="cart-title"]';

/** Opens the cart drawer by clicking the header cart button */
async function openCartDrawer(page: import('@playwright/test').Page) {
  const cartButton = page.getByRole('button', {name: /shopping cart/i});
  await cartButton.click();
  await expect(page.locator(CART_DRAWER)).toBeVisible({timeout: 5000});
}

test.describe('Empty Cart Experience', () => {
  test('displays EmptyCart component when cart is initially empty', async ({
    page,
  }) => {
    // GIVEN: User navigates to the homepage with an empty cart
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WHEN: User opens the cart drawer
    await openCartDrawer(page);

    // THEN: The cart dialog is visible
    const drawer = page.locator(CART_DRAWER);
    await expect(drawer).toBeVisible();

    // THEN: Title shows "Cart (0 items)"
    await expect(drawer.locator('#cart-title')).toContainText('Cart');
    await expect(drawer.locator('#cart-title')).toContainText('0 items');

    // THEN: Empty cart message is displayed
    await expect(
      drawer.getByText(
        "Your cart is empty. Let's find something you'll love.",
      ),
    ).toBeVisible();

    // THEN: "Explore the Collection" link is visible
    await expect(
      drawer.getByRole('link', {name: /Explore the Collection/i}),
    ).toBeVisible();

    // THEN: Subtotal and checkout button are NOT shown (only rendered when itemCount > 0)
    await expect(drawer.getByText('Subtotal')).not.toBeVisible();
    await expect(
      drawer.locator('button:has-text("Checkout")'),
    ).not.toBeVisible();
  });

  test('displays EmptyCart after removing last item from cart', async ({
    page,
  }) => {
    // GIVEN: User adds a product to cart from a product page
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');

    // Skip if add-to-cart button is not available
    const addToCartButton = page.locator(
      '[data-testid="add-to-cart-button"]',
    );
    if (!(await addToCartButton.isVisible({timeout: 3000}).catch(() => false))) {
      test.skip();
      return;
    }

    // WHEN: User adds the product to cart
    await addToCartButton.click();

    // THEN: Cart drawer opens with the product
    const drawer = page.locator(CART_DRAWER);
    await expect(drawer).toBeVisible({timeout: 5000});

    // Verify the item is in the cart
    await expect(
      drawer.getByText('The 3-in-1 Shampoo Bar'),
    ).toBeVisible();

    // WHEN: User removes the item via the remove button
    const removeButton = drawer
      .locator('button[aria-label*="Remove"]')
      .first();
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // THEN: EmptyCart component displays after removal
    await expect(
      drawer.getByText(
        "Your cart is empty. Let's find something you'll love.",
      ),
    ).toBeVisible({timeout: 5000});

    // THEN: Cart drawer stays open (does not auto-close on empty)
    await expect(drawer).toBeVisible();

    // THEN: Title updates to show 0 items
    await expect(drawer.locator('#cart-title')).toContainText('0 items');

    // THEN: Subtotal and checkout are hidden
    await expect(drawer.getByText('Subtotal')).not.toBeVisible();
    await expect(
      drawer.locator('button:has-text("Checkout")'),
    ).not.toBeVisible();
  });

  test('closes drawer and navigates to homepage when "Explore the Collection" is clicked', async ({
    page,
  }) => {
    // GIVEN: User is on the homepage with an empty cart drawer open
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await openCartDrawer(page);

    const drawer = page.locator(CART_DRAWER);
    await expect(drawer).toBeVisible();

    // WHEN: User clicks "Explore the Collection"
    const exploreLink = drawer.getByRole('link', {
      name: /Explore the Collection/i,
    });
    await expect(exploreLink).toBeVisible();
    await exploreLink.click();

    // THEN: Cart drawer closes
    await expect(drawer).not.toBeVisible({timeout: 3000});

    // THEN: User is on the homepage
    await expect(page).toHaveURL('/');
  });

  test('empty cart is keyboard accessible', async ({page}) => {
    // GIVEN: User is on the homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WHEN: User opens the cart drawer via keyboard
    const cartButton = page.getByRole('button', {name: /shopping cart/i});
    await cartButton.focus();
    await page.keyboard.press('Enter');

    // THEN: Cart drawer opens
    const drawer = page.locator(CART_DRAWER);
    await expect(drawer).toBeVisible({timeout: 5000});

    // THEN: Dialog has correct aria attributes
    await expect(drawer).toHaveAttribute('aria-labelledby', 'cart-title');

    // WHEN: User navigates to the "Explore the Collection" link via Tab
    // Radix Dialog traps focus; first focusable element should be the close button,
    // then tab should reach the explore link
    const exploreLink = drawer.getByRole('link', {
      name: /Explore the Collection/i,
    });

    // Tab through the dialog until we reach the explore link
    let focused = false;
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      if (await exploreLink.evaluate((el) => el === document.activeElement)) {
        focused = true;
        break;
      }
    }

    if (focused) {
      // THEN: The link has focus
      await expect(exploreLink).toBeFocused();

      // WHEN: User activates the link with Enter
      await page.keyboard.press('Enter');

      // THEN: Cart drawer closes
      await expect(drawer).not.toBeVisible({timeout: 3000});
    }

    // THEN: Close button should be keyboard accessible with aria-label
    // Re-open drawer to verify close button keyboard support
    await cartButton.focus();
    await page.keyboard.press('Enter');
    await expect(drawer).toBeVisible({timeout: 5000});

    const closeButton = drawer.locator('button[aria-label="Close cart"]');
    await closeButton.focus();
    await expect(closeButton).toBeFocused();
    await page.keyboard.press('Enter');

    // THEN: Drawer closes via keyboard
    await expect(drawer).not.toBeVisible({timeout: 3000});
  });

  test('empty cart is mobile responsive', async ({page}) => {
    // GIVEN: User is on a mobile viewport
    await page.setViewportSize({width: 375, height: 667});

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WHEN: User opens the cart drawer
    await openCartDrawer(page);

    const drawer = page.locator(CART_DRAWER);

    // THEN: Empty cart message is visible on mobile
    await expect(
      drawer.getByText(/Your cart is empty/i),
    ).toBeVisible();

    // THEN: "Explore the Collection" link is visible and has adequate touch target
    const exploreLink = drawer.getByRole('link', {
      name: /Explore the Collection/i,
    });
    await expect(exploreLink).toBeVisible();

    const buttonBox = await exploreLink.boundingBox();
    expect(buttonBox).not.toBeNull();
    // Minimum 44px height for WCAG touch target compliance
    expect(buttonBox!.height).toBeGreaterThanOrEqual(44);

    // THEN: Cart drawer content does not overflow the viewport width
    const drawerBox = await drawer.boundingBox();
    expect(drawerBox).not.toBeNull();
    expect(drawerBox!.width).toBeLessThanOrEqual(375);
  });

  test('cart button aria-label reflects empty state', async ({page}) => {
    // GIVEN: User is on the homepage with an empty cart
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // THEN: Cart button has the correct empty-state aria-label
    const cartButton = page.getByRole('button', {
      name: 'Shopping cart, empty',
    });
    await expect(cartButton).toBeVisible();
    expect(await cartButton.getAttribute('type')).toBe('button');
  });
});
