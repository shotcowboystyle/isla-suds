import {test, expect} from '@playwright/test';

/**
 * About page ("the family scrapbook").
 *
 * The recipe card is the signature and the duck's inspection is the peak.
 * Both carry real text (the card's notes, the checklist, the promise), so the
 * story has to be readable without any of the motion.
 *
 * Priority: P1
 */

test.describe('About page', () => {
  test.use({viewport: {width: 1440, height: 900}});

  test.beforeEach(async ({page}) => {
    await page.goto('/about');
    await page.waitForSelector('[class*="preloaderWrapper"]', {state: 'detached', timeout: 30000});
  });

  test('[P1] tells the story as one h1 and five chapters', async ({page}) => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(/made in our kitchen\.\s*named for our daughter\./i);

    for (const name of [/family recipe/i, /made by hand/i, /one table/i, /why isla suds/i, /made for her/i]) {
      await expect(page.getByRole('heading', {level: 2, name})).toHaveCount(1);
    }
  });

  test('[P1] the recipe card is written in real text', async ({page}) => {
    const card = page.locator('section[aria-labelledby="recipe-title"] [data-card]');
    await expect(card.getByText('+ goat milk')).toHaveCount(1);
    await expect(card.getByText(/no added fragrance/i)).toHaveCount(1);
  });

  test('[P1] the close links to the shop and the store locator', async ({page}) => {
    const close = page.locator('section[aria-labelledby="close-title"]');
    await expect(close.getByRole('link', {name: 'Shop the bars'})).toHaveAttribute('href', '/collections/frontpage');
    await expect(close.getByRole('link', {name: 'Find a store'})).toHaveAttribute('href', '/locations');
  });
});

test.describe('About page, reduced motion', () => {
  test.use({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});

  test('[P1] lands the inspection on its final state', async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(String(error)));

    await page.goto('/about');
    const scene = page.locator('section[aria-labelledby="isla-title"]');
    await scene.locator('blockquote').scrollIntoViewIfNeeded();

    await expect(scene.getByText('Approved', {exact: true})).toBeVisible();
    await expect(scene.locator('ul li')).toHaveCount(4);
    await expect(scene.locator('blockquote')).toHaveText("If we wouldn't use it on Isla's skin, we don't sell it.");
    expect(errors).toEqual([]);
  });
});
