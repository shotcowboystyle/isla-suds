import {test, expect} from '@playwright/test';

/**
 * Partners landing page ("Pick your shop").
 *
 * The venue switcher is the page's signature: one choice restyles the hero,
 * keeps the URL shareable without a navigation, and travels with the
 * application. The application itself posts to /partners and must not leave
 * the page.
 *
 * Priority: P1 (conversion path)
 */

test.describe('Partners landing page', () => {
  test.use({viewport: {width: 1440, height: 900}});

  test.beforeEach(async ({page}) => {
    await page.goto('/partners');
    // The preloader overlay covers the page and would win every hit test.
    await page.waitForSelector('[class*="preloaderWrapper"]', {state: 'detached', timeout: 30000});
    await page.waitForTimeout(1500);
  });

  test('[P1] choosing a venue updates the hero, the URL and the application', async ({page}) => {
    await page.locator('[data-chip="gym"]').click();

    await expect(page).toHaveURL(/\?shop=gym$/);
    await expect(page.getByText("The only thing in the locker room that's gentle.")).toBeVisible();
    await expect(page.locator('input[name="shopType"]')).toHaveValue('Gym');
  });

  test('[P1] a deep link renders the chosen venue on first paint', async ({page}) => {
    await page.goto('/partners?shop=hotel');
    await expect(page.locator('input[value="hotel"]')).toBeChecked();
    await expect(page.locator('input[name="shopType"]')).toHaveValue('Hotel');
  });

  test('[P1] an incomplete application shows errors without leaving the page', async ({page}) => {
    await page.getByRole('button', {name: 'Send application'}).click();

    await expect(page.getByText('Please fix the errors above.')).toBeVisible();
    await expect(page.getByText('Business Name is required')).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/partners');
  });

  test('[P1] the old register URL lands on the form', async ({page}) => {
    await page.goto('/partners/register');
    await expect(page).toHaveURL(/\/partners#apply$/);
  });
});

test.describe('Partners landing page, reduced motion', () => {
  test.use({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});

  test('[P1] the goat delivery shows its finished frame', async ({page}) => {
    await page.goto('/partners');
    await page.waitForSelector('[class*="preloaderWrapper"]', {state: 'detached', timeout: 30000});

    await expect(page.getByText('Delivery by goat not guaranteed.')).toBeVisible();
    await expect(page.locator('[data-door="left"]')).toBeHidden();
  });
});
