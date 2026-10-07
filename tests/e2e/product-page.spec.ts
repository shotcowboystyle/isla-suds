import {test, expect} from '@playwright/test';

/**
 * Product page ("the bar that goes everywhere").
 *
 * The old hero disabled Add to Cart when the bar was IN stock and built its
 * cart line from `product.variants`, which the query never fetched, so nothing
 * was ever added. These tests pin the buying path and the page's thread.
 *
 * Priority: P0 (purchase path)
 */

test.describe('Product page', () => {
  test.use({viewport: {width: 1440, height: 900}});

  test.beforeEach(async ({page}) => {
    await page.goto('/products/eucalyptus');
    await page.waitForSelector('[class*="preloaderWrapper"]', {state: 'detached', timeout: 30000});
    await page.waitForTimeout(1000);
  });

  test('[P0] the hero add to cart is enabled and posts to the cart', async ({page}) => {
    const add = page.locator('[aria-labelledby="product-title"] button', {hasText: /add to cart/i});
    await expect(add).toBeEnabled();

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.request().method() === 'POST' && r.url().includes('/cart')),
      add.click(),
    ]);
    expect(response.status()).toBe(200);
  });

  test('[P0] the buy box adds the chosen quantity', async ({page}) => {
    await page.locator('#buy').scrollIntoViewIfNeeded();
    await page.getByRole('button', {name: 'One more bar'}).click();
    await expect(page.locator('#buy output')).toHaveText('2');

    const [request] = await Promise.all([
      page.waitForRequest((r) => r.method() === 'POST' && r.url().includes('/cart')),
      page.locator('#buy button', {hasText: /add to cart/i}).click(),
    ]);
    // Hydrogen's CartForm posts URL-encoded JSON.
    expect(decodeURIComponent(request.postData() ?? '')).toContain('"quantity":2');
  });

  test('[P1] every act has a dock for the traveling bar', async ({page}) => {
    const docks = await page.locator('[data-dock]').evaluateAll((els) => els.map((el) => el.getAttribute('data-dock')));
    expect(docks).toEqual(['hero', 'cut', 'inside', 'tap', 'shelf', 'buy']);
  });

  test('[P1] the siblings link to the other bars', async ({page}) => {
    await page.getByRole('link', {name: /Lavender.*Meet this one/i}).click();
    await expect(page).toHaveURL(/\/products\/lavender$/);
    await expect(page.locator('h1')).toContainText('Lavender');
  });
});
