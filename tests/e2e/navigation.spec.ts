import {test, expect} from '@playwright/test';

/**
 * Navigation E2E Tests (P1 - High Priority)
 *
 * Tests site navigation, header, footer, and mobile menu functionality.
 * Important for user experience and site usability.
 */

test.describe('Navigation', () => {
  test('[P1] should navigate using header links', async ({page}) => {
    // GIVEN: User is on the home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WHEN: User clicks "About" link in header
    const aboutLink = page
      .locator('header')
      .getByRole('link', {name: /about/i});

    if ((await aboutLink.count()) > 0) {
      await aboutLink.click();

      // THEN: About page loads
      await expect(page).toHaveURL(/\/about/);
      await expect(
        page.getByRole('heading', {name: /about/i}),
      ).toBeVisible();
    }
  });

  test('[P1] should navigate using footer links', async ({page}) => {
    // GIVEN: User is on the home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WHEN: User clicks "Contact" link in footer
    const contactLink = page
      .locator('footer')
      .getByRole('link', {name: /contact/i});

    if ((await contactLink.count()) > 0) {
      await contactLink.click();

      // THEN: Contact page loads
      await expect(page).toHaveURL(/\/contact/);
      await expect(
        page.getByRole('heading', {name: /contact/i}),
      ).toBeVisible();
    }
  });

  test('[P1] should open and close mobile menu', async ({page}) => {
    // GIVEN: User is on mobile viewport
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WHEN: User clicks mobile menu button
    const menuButton = page.locator('button[aria-label="Toggle menu"]').first();

    if ((await menuButton.count()) > 0) {
      await menuButton.click();

      // THEN: Mobile menu opens (HeaderMenu renders a nav inside a fixed overlay div)
      // Use the nav without aria-label to distinguish from the header CTAs nav (aria-label="Header CTAs")
      const mobileMenu = page.locator('nav[role="navigation"]:not([aria-label])');
      await expect(mobileMenu).toBeVisible({timeout: 2000});

      // WHEN: User closes menu via Escape key
      await page.keyboard.press('Escape');

      // THEN: Mobile menu closes (GSAP animates container to yPercent: -100)
      await expect(mobileMenu).not.toBeVisible({timeout: 2000});
    }
  });

  test('[P1] should open cart drawer via cart button', async ({page}) => {
    // GIVEN: User is on any page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WHEN: User clicks the cart button in header
    // The cart is a button (not a link) with aria-label "Shopping cart, empty" or "Shopping cart, N item(s)"
    const cartButton = page
      .locator('header')
      .locator('button[aria-label^="Shopping cart"]');
    await cartButton.click();

    // THEN: Cart drawer (Radix Dialog) opens with the cart title visible
    const cartDialog = page.locator('[aria-labelledby="cart-title"]');
    await expect(cartDialog).toBeVisible({timeout: 2000});

    const cartTitle = page.locator('#cart-title');
    await expect(cartTitle).toBeVisible();
    await expect(cartTitle).toContainText('Cart');
  });

  test('[P1] should display logo and link to home', async ({page}) => {
    // GIVEN: User is on a product page
    await page.goto('/products/the-3-in-1-shampoo-bar');

    // WHEN: User clicks logo in header
    const logo = page.locator('header').locator('a[href="/"]').first();
    await logo.click();

    // THEN: User returns to home page
    await expect(page).toHaveURL('/');
  });
});
