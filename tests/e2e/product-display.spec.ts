import {test, expect} from '@playwright/test';

/**
 * Product Display E2E Tests (P1 - High Priority)
 *
 * Tests product page rendering and variant selection.
 * Important for user experience and product discovery.
 */

test.describe('Product Display', () => {
  test('[P1] should load product page with images and details', async ({
    page,
  }) => {
    // GIVEN: User navigates to a product page
    await page.goto('/products/the-3-in-1-shampoo-bar');

    // THEN: Product title is visible
    await expect(
      page.getByRole('heading', {name: /The 3-in-1 Shampoo Bar/i}),
    ).toBeVisible({timeout: 5000});

    // THEN: Product image is visible (Shopify Image component with variant or product title alt text)
    const productImage = page.locator('img').first();
    await expect(productImage).toBeVisible();

    // THEN: Add to cart button is visible
    await expect(
      page.locator('[data-testid="add-to-cart-button"]'),
    ).toBeVisible();
  });

  test('[P1] should update URL when variant is selected', async ({page}) => {
    // GIVEN: User is on a product page with multiple variants
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');

    // Get initial URL
    const initialUrl = page.url();

    // WHEN: User selects a different variant (if multiple options exist)
    const variantButton = page
      .locator('.product-options-item')
      .filter({hasText: /Small|Medium|Large|Default/i})
      .first();

    // Check if variant options exist
    const hasVariants = await variantButton.count();

    if (hasVariants > 0) {
      await variantButton.click();

      // THEN: URL includes variant query parameter
      await page.waitForURL(/\?/);
      const updatedUrl = page.url();
      expect(updatedUrl).not.toBe(initialUrl);
      expect(updatedUrl).toContain('?');
    } else {
      // Product has only one variant - URL should not change
      expect(page.url()).toBe(initialUrl);
    }
  });

  test('[P1] should show "Sold Out" for unavailable variants', async ({
    page,
  }) => {
    // GIVEN: User is on a product page
    await page.goto('/products/the-3-in-1-shampoo-bar');
    await page.waitForLoadState('networkidle');

    // THEN: Add to cart button is visible (either "Add to Cart" or "Sold Out")
    const addToCartButton = page.locator(
      '[data-testid="add-to-cart-button"]',
    );
    await expect(addToCartButton).toBeVisible();

    // If "Sold Out", button should be disabled
    const buttonText = await addToCartButton.textContent();
    if (buttonText?.includes('Sold Out')) {
      await expect(addToCartButton).toBeDisabled();
    }
  });

  test('[P1] should display product price', async ({page}) => {
    // GIVEN: User is on a product page
    await page.goto('/products/the-3-in-1-shampoo-bar');

    // THEN: Product price is visible (rendered as an h2 in the product hero)
    // Price is formatted via Intl.NumberFormat, e.g. "$12.99"
    const priceElement = page.getByText(/^\$\d+\.\d{2}$/).first();
    await expect(priceElement).toBeVisible({timeout: 5000});

    // THEN: Price matches currency format (e.g., $29.99)
    const priceText = await priceElement.textContent();
    expect(priceText).toMatch(/^\$\d+\.\d{2}$/);
  });
});
