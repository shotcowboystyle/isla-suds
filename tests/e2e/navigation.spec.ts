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
    const menuButton = page.locator('button[aria-label*="menu" i]').first();

    if ((await menuButton.count()) > 0) {
      await menuButton.click();

      // THEN: Mobile menu opens
      const mobileMenu = page.locator(
        'aside[aria-label*="menu" i], nav[aria-label*="menu" i]',
      );
      await expect(mobileMenu.first()).toBeVisible({timeout: 2000});

      // WHEN: User closes menu (Escape key or close button)
      await page.keyboard.press('Escape');

      // THEN: Mobile menu closes
      await expect(mobileMenu.first()).not.toBeVisible();
    }
  });

  test('[P1] should navigate to cart page via cart icon', async ({page}) => {
    // GIVEN: User is on any page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // WHEN: User clicks cart icon in header
    const cartLink = page.locator('header').locator('a[href="/cart"]');
    await cartLink.click();

    // THEN: Cart page loads
    await expect(page).toHaveURL('/cart');
    await expect(
      page.getByRole('heading', {name: /cart/i}),
    ).toBeVisible();
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
