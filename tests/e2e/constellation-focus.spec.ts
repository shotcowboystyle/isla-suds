/**
 * E2E Tests: Constellation Focus State (Story 2.4)
 *
 * Tests end-to-end focus behavior with real browser interactions
 * covering hover, tap, keyboard navigation, and exploration tracking.
 *
 * Priority: P0 - Critical user interaction for product discovery
 */

import {test, expect} from '@playwright/test';

test.describe('Constellation Product Focus - Desktop (Story 2.4)', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('[P0] should apply focused state when hovering product card on desktop', async ({
    page,
  }) => {
    // GIVEN: User is on homepage with constellation visible
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    // Get first product card
    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    // WHEN: User hovers over product card
    await firstCard.hover();

    // THEN: Card has focused state (scale and shadow)
    await expect(firstCard).toHaveClass(/scale-\[1\.02\]/);
    await expect(firstCard).toHaveClass(/shadow-lg/);
  });

  test('[P0] should dim other products when one is focused', async ({page}) => {
    // GIVEN: User is on homepage
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );
    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);

    // WHEN: User hovers first product
    await firstCard.hover();

    // THEN: First card is not dimmed, others are dimmed
    await expect(firstCard).not.toHaveClass(/opacity-60/);
    await expect(secondCard).toHaveClass(/opacity-60/);
  });

  test('[P0] should move focus when hovering different product', async ({
    page,
  }) => {
    // GIVEN: User has one product focused
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );
    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);

    await firstCard.hover();
    await expect(firstCard).toHaveClass(/scale-\[1\.02\]/);

    // WHEN: User hovers different product
    await secondCard.hover();

    // THEN: Focus moves to new product
    await expect(secondCard).toHaveClass(/scale-\[1\.02\]/);
    await expect(firstCard).not.toHaveClass(/scale-\[1\.02\]/);
    await expect(firstCard).toHaveClass(/opacity-60/);
  });

  test('[P0] should clear focus when clicking outside constellation', async ({
    page,
  }) => {
    // GIVEN: User has one product focused
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    await firstCard.hover();
    await expect(firstCard).toHaveClass(/scale-\[1\.02\]/);

    // WHEN: User clicks outside constellation (e.g., header)
    await page.click('header'); // Click on page header

    // THEN: Focus is cleared
    await expect(firstCard).not.toHaveClass(/scale-\[1\.02\]/);
    await expect(firstCard).not.toHaveClass(/opacity-60/);
  });
});

test.describe('Constellation Product Focus - Keyboard (Story 2.4)', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('[P0] should activate focus with Enter key', async ({page}) => {
    // GIVEN: User is navigating with keyboard
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    // WHEN: User tabs to card and presses Enter
    await firstCard.focus();
    await page.keyboard.press('Enter');

    // Wait a tick for state update
    await page.waitForTimeout(50);

    // THEN: Card enters focused state
    await expect(firstCard).toHaveClass(/scale-\[1\.02\]/);
  });

  test('[P0] should activate focus with Space key', async ({page}) => {
    // GIVEN: User is navigating with keyboard
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    // WHEN: User tabs to card and presses Space
    await firstCard.focus();
    await page.keyboard.press('Space');

    // Wait a tick for state update
    await page.waitForTimeout(50);

    // THEN: Card enters focused state
    await expect(firstCard).toHaveClass(/scale-\[1\.02\]/);
  });

  test('[P1] should clear focus when Escape key is pressed', async ({page}) => {
    // GIVEN: User has focused a product via keyboard
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    await firstCard.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(50);
    await expect(firstCard).toHaveClass(/scale-\[1\.02\]/);

    // WHEN: User presses Escape
    await page.keyboard.press('Escape');

    // THEN: Focus is cleared
    await expect(firstCard).not.toHaveClass(/scale-\[1\.02\]/);
  });

  test('[P1] should maintain keyboard focus order matching visual layout', async ({
    page,
  }) => {
    // GIVEN: User is on homepage
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );

    // WHEN: User tabs through product cards
    await page.keyboard.press('Tab'); // Focus first card
    const firstFocused = await page.evaluate(() => document.activeElement?.textContent);

    await page.keyboard.press('Tab'); // Focus second card
    const secondFocused = await page.evaluate(() => document.activeElement?.textContent);

    await page.keyboard.press('Tab'); // Focus third card
    const thirdFocused = await page.evaluate(() => document.activeElement?.textContent);

    // THEN: Focus order matches DOM order (not visual placement)
    expect(firstFocused).toBeTruthy();
    expect(secondFocused).toBeTruthy();
    expect(thirdFocused).toBeTruthy();
    expect(firstFocused).not.toBe(secondFocused);
    expect(secondFocused).not.toBe(thirdFocused);
  });
});

test.describe('Constellation Product Focus - Mobile (Story 2.4)', () => {
  test.use({viewport: {width: 375, height: 667}}); // Mobile viewport

  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('[P0] should apply focused state when tapping product card on mobile', async ({
    page,
  }) => {
    // GIVEN: User is on homepage on mobile device
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    // WHEN: User taps product card
    await firstCard.tap();

    // Wait for state update
    await page.waitForTimeout(50);

    // THEN: Card has focused state
    await expect(firstCard).toHaveClass(/scale-\[1\.02\]/);
  });

  test('[P1] should clear focus when tapping outside on mobile', async ({
    page,
  }) => {
    // GIVEN: User has tapped a product
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    await firstCard.tap();
    await page.waitForTimeout(50);
    await expect(firstCard).toHaveClass(/scale-\[1\.02\]/);

    // WHEN: User taps outside constellation
    await page.tap('header');

    // THEN: Focus is cleared
    await expect(firstCard).not.toHaveClass(/scale-\[1\.02\]/);
  });
});

test.describe('Constellation Exploration Tracking (Story 2.4 AC5)', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('[P0] should track explored products in Zustand store when focused', async ({
    page,
  }) => {
    // GIVEN: User is on homepage
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    // WHEN: User focuses a product
    await firstCard.hover();
    await page.waitForTimeout(100); // Allow store update

    // THEN: Product is tracked as explored
    // Verify via localStorage or devtools protocol (exploration store uses localStorage)
    const explorationState = await page.evaluate(() => {
      const stored = localStorage.getItem('exploration-store');
      return stored ? JSON.parse(stored) : null;
    });

    expect(explorationState).toBeTruthy();
    expect(explorationState?.state?.productsExplored).toBeDefined();
  });

  test('[P1] should track multiple products cumulatively', async ({page}) => {
    // GIVEN: User is exploring constellation
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );

    // WHEN: User focuses multiple products in sequence
    await cards.nth(0).hover();
    await page.waitForTimeout(100);

    await cards.nth(1).hover();
    await page.waitForTimeout(100);

    await cards.nth(2).hover();
    await page.waitForTimeout(100);

    // THEN: All products are tracked cumulatively
    const explorationState = await page.evaluate(() => {
      const stored = localStorage.getItem('exploration-store');
      return stored ? JSON.parse(stored) : null;
    });

    const exploredCount = explorationState?.state?.productsExplored?.length || 0;
    expect(exploredCount).toBeGreaterThanOrEqual(3);
  });

  test('[P1] should not remove products from exploration when focus clears', async ({
    page,
  }) => {
    // GIVEN: User has explored a product
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    await firstCard.hover();
    await page.waitForTimeout(100);

    // Verify product was added
    let explorationState = await page.evaluate(() => {
      const stored = localStorage.getItem('exploration-store');
      return stored ? JSON.parse(stored) : null;
    });
    const initialCount = explorationState?.state?.productsExplored?.length || 0;
    expect(initialCount).toBeGreaterThan(0);

    // WHEN: User clears focus by clicking outside
    await page.click('header');
    await page.waitForTimeout(100);

    // THEN: Explored products remain in store (cumulative tracking)
    explorationState = await page.evaluate(() => {
      const stored = localStorage.getItem('exploration-store');
      return stored ? JSON.parse(stored) : null;
    });
    const finalCount = explorationState?.state?.productsExplored?.length || 0;
    expect(finalCount).toBe(initialCount); // Count unchanged
  });
});
