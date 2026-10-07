import {test, expect} from '@playwright/test';

/**
 * Collection page ("Four bars. Zero added fragrance.").
 *
 * Pick by mood is the page's signature; "Add all" is the close. Both are
 * real actions, so both are pinned here.
 *
 * Priority: P1
 */

test.describe('Collection page', () => {
  test.use({viewport: {width: 1440, height: 900}});

  test.beforeEach(async ({page}) => {
    await page.goto('/collections/frontpage');
    await page.waitForSelector('[class*="preloaderWrapper"]', {state: 'detached', timeout: 30000});
    await page.waitForTimeout(1000);
  });

  test('[P1] has exactly one h1', async ({page}) => {
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('[P1] picking a mood highlights its bar and dims the rest', async ({page}) => {
    await page.getByRole('button', {name: 'I need calm'}).click();

    await expect(page.getByRole('button', {name: 'I need calm'})).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-card="lavender"]')).toHaveAttribute('data-state', 'picked');
    await expect(page.locator('[data-card="eucalyptus"]')).toHaveAttribute('data-state', 'dimmed');
    await expect(page.getByText('Lavender it is.')).toBeVisible();

    await page.getByRole('button', {name: 'Show all'}).click();
    await expect(page.locator('[data-card="lavender"]')).not.toHaveAttribute('data-state', /.+/);
  });

  test('[P1] "Add all" puts one of each bar in the cart', async ({page}) => {
    const addAll = page.locator('section[aria-labelledby="close-title"] button');
    await addAll.scrollIntoViewIfNeeded();
    const [request] = await Promise.all([
      page.waitForRequest((r) => r.method() === 'POST' && r.url().includes('/cart')),
      addAll.click(),
    ]);
    const body = decodeURIComponent(request.postData() ?? '');
    expect(body.match(/merchandiseId/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  test('[P1] a card opens its product page', async ({page}) => {
    await page.locator('[data-card="lavender"] a').click();
    await expect(page).toHaveURL(/\/products\/lavender$/);
  });
});
