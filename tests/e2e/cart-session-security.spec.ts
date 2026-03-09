import {test, expect} from '@playwright/test';

/**
 * Cart Session Cookie Security Tests (AC5)
 *
 * Verifies that cart ID is stored securely in session cookies:
 * - httpOnly: true (prevents XSS access)
 * - sameSite: 'lax' (CSRF protection)
 * - secure: true in production (HTTPS only)
 * - Cart ID NOT accessible via JavaScript
 *
 * Story: 5-1-implement-cart-creation-and-persistence
 */

test.describe('Cart Session Cookie Security (AC5)', () => {
  test('[P0] should set httpOnly cookie that is NOT accessible via JavaScript', async ({
    page,
  }) => {
    // GIVEN: User adds a product to cart (triggers cart creation)
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-title"]')).toBeVisible();

    // WHEN: JavaScript tries to access session cookie
    const cookieAccessibleViaJS = await page.evaluate(() => {
      // Try to read session cookie from document.cookie
      const cookies = document.cookie;
      return cookies.includes('session=');
    });

    // THEN: Session cookie should NOT be accessible (httpOnly protection)
    expect(cookieAccessibleViaJS).toBe(false);
  });

  test('[P0] should set session cookie with sameSite=lax for CSRF protection', async ({
    page,
    context,
  }) => {
    // GIVEN: User adds a product to cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-title"]')).toBeVisible();

    // WHEN: We inspect cookies from the browser context
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'session');

    // THEN: Session cookie should exist with sameSite=Lax
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.sameSite).toBe('Lax');
  });

  test('[P0] should set httpOnly flag on session cookie', async ({
    page,
    context,
  }) => {
    // GIVEN: User adds a product to cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-title"]')).toBeVisible();

    // WHEN: We inspect cookies
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'session');

    // THEN: httpOnly flag should be true
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.httpOnly).toBe(true);
  });

  test('[P0] should NOT store cart ID in localStorage', async ({page}) => {
    // GIVEN: User adds a product to cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-title"]')).toBeVisible();

    // WHEN: JavaScript checks localStorage for cart ID
    const cartIdInLocalStorage = await page.evaluate(() => {
      // Check all localStorage keys for cart-related data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.toLowerCase().includes('cart')) {
          return localStorage.getItem(key);
        }
      }
      return null;
    });

    // THEN: Cart ID should NOT be in localStorage (security risk)
    expect(cartIdInLocalStorage).toBeNull();
  });

  test('[P0] should NOT store cart ID in sessionStorage', async ({page}) => {
    // GIVEN: User adds a product to cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-title"]')).toBeVisible();

    // WHEN: JavaScript checks sessionStorage for cart ID
    const cartIdInSessionStorage = await page.evaluate(() => {
      // Check all sessionStorage keys for cart-related data
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.toLowerCase().includes('cart')) {
          return sessionStorage.getItem(key);
        }
      }
      return null;
    });

    // THEN: Cart ID should NOT be in sessionStorage
    expect(cartIdInSessionStorage).toBeNull();
  });

  test('[P1] should set secure flag in production environment', async ({
    page,
    context,
  }) => {
    // NOTE: This test verifies the code path exists
    // Actual secure cookie testing requires HTTPS in production
    // In local dev (http://localhost), secure flag should be false

    // GIVEN: User adds a product to cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-title"]')).toBeVisible();

    // WHEN: We inspect cookies
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'session');

    // THEN: In local dev, secure flag should be false (http)
    // In production, it would be true (https)
    expect(sessionCookie).toBeDefined();
    const isLocalDev = page.url().startsWith('http://localhost');
    if (isLocalDev) {
      // Local dev uses HTTP, so secure flag should be false
      expect(sessionCookie?.secure).toBe(false);
    } else {
      // Production should have secure: true
      expect(sessionCookie?.secure).toBe(true);
    }
  });

  test('[P0] should persist cart ID across page navigation using cookies', async ({
    page,
    context,
  }) => {
    // GIVEN: User adds a product to cart
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-title"]')).toBeVisible();

    // Verify session cookie exists after add-to-cart
    const cookiesAfterAdd = await context.cookies();
    const sessionCookieAfterAdd = cookiesAfterAdd.find((c) => c.name === 'session');
    expect(sessionCookieAfterAdd).toBeDefined();

    // Close cart drawer
    await page.keyboard.press('Escape');

    // Read initial cart button aria-label to capture item count
    const cartButton = page.locator('button[aria-label^="Shopping cart"]');
    const initialAriaLabel = await cartButton.getAttribute('aria-label');

    // WHEN: User navigates to different page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // THEN: Session cookie should still be present
    const cookiesAfterNav = await context.cookies();
    const sessionCookieAfterNav = cookiesAfterNav.find((c) => c.name === 'session');
    expect(sessionCookieAfterNav).toBeDefined();

    // Cart button should show same item count (cart persisted via session cookie)
    const finalAriaLabel = await page
      .locator('button[aria-label^="Shopping cart"]')
      .getAttribute('aria-label');

    expect(finalAriaLabel).toBe(initialAriaLabel);
  });
});
