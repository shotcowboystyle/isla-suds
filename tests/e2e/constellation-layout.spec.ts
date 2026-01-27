import {test, expect} from '@playwright/test';

/**
 * Story 2.3: Constellation Grid Layout E2E Tests
 *
 * Tests organic desktop layout, mobile 2-col grid, keyboard navigation,
 * hover treatment, and image rendering for the constellation product grid.
 *
 * Priority: P0-P1 (critical user experience)
 */

test.describe('Constellation Grid Layout', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    // Wait for constellation section to be visible
    await page.waitForSelector(
      '[aria-label="Product constellation grid"]',
      {state: 'visible'},
    );
  });

  test('[P0] should display constellation section after hero with 4 products', async ({
    page,
  }) => {
    // GIVEN: User is on homepage
    // (already navigated in beforeEach)

    // WHEN: Page is fully loaded
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );

    // THEN: Constellation section is visible
    await expect(constellationSection).toBeVisible();

    // AND: All 4 product cards are visible
    const productCards = constellationSection.locator('[data-testid^="product-card-"]');
    await expect(productCards).toHaveCount(4);

    // AND: Each card has an image
    const images = productCards.locator('img');
    await expect(images).toHaveCount(4);

    // AND: Each card has a title
    const titles = productCards.locator('h3');
    await expect(titles).toHaveCount(4);
  });

  test('[P1] should display organic layout with rotations on desktop (≥1024px)', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport (1024px or wider)
    await page.setViewportSize({width: 1024, height: 768});

    // WHEN: Constellation section is visible
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    // THEN: Grid container uses desktop layout
    const gridContainer = constellationSection.locator('.grid').first();
    await expect(gridContainer).toBeVisible();

    // AND: Product cards have rotation classes applied
    const productCards = constellationSection.locator('[data-testid^="product-card-"]');
    const firstCard = productCards.nth(0);

    // Check that rotation is present (lg: prefix for desktop only)
    const className = await firstCard.getAttribute('class');
    expect(className).toMatch(/lg:rotate-\[[-\d]+deg\]/);

    // AND: Cards are positioned organically (non-linear grid positions)
    const cardBoundingBoxes = await productCards.evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return {x: rect.x, y: rect.y};
      }),
    );

    // Verify cards are not in a perfect 2x2 grid (organic placement)
    const uniqueYPositions = new Set(cardBoundingBoxes.map((box) => Math.round(box.y)));
    expect(uniqueYPositions.size).toBeGreaterThan(2); // More than 2 rows = organic
  });

  test('[P1] should display 2-column grid layout on mobile (<1024px)', async ({
    page,
  }) => {
    // GIVEN: Mobile viewport (below 1024px)
    await page.setViewportSize({width: 375, height: 667});

    // WHEN: Constellation section is visible
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    // THEN: Grid displays 2 columns
    const gridContainer = constellationSection.locator('.grid').first();
    await expect(gridContainer).toBeVisible();

    // AND: No rotation classes should be active (lg: prefix means desktop only)
    const productCards = constellationSection.locator('[data-testid^="product-card-"]');

    // Calculate column positions to verify 2-column layout
    const cardBoundingBoxes = await productCards.evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return {x: Math.round(rect.x), y: Math.round(rect.y), width: rect.width};
      }),
    );

    // Group cards by X position (should have 2 distinct columns)
    const xPositions = cardBoundingBoxes.map((box) => box.x);
    const uniqueXPositions = [...new Set(xPositions)];

    // Should have exactly 2 columns on mobile
    expect(uniqueXPositions.length).toBe(2);
  });

  test('[P1] should support keyboard navigation through all 4 product cards', async ({
    page,
  }) => {
    // GIVEN: User is on homepage with constellation visible
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    // WHEN: User tabs through product cards
    const productCards = constellationSection.locator('[data-testid^="product-card-"]');

    // Focus first card
    await productCards.nth(0).focus();
    await expect(productCards.nth(0)).toBeFocused();

    // Tab to second card
    await page.keyboard.press('Tab');
    await expect(productCards.nth(1)).toBeFocused();

    // Tab to third card
    await page.keyboard.press('Tab');
    await expect(productCards.nth(2)).toBeFocused();

    // Tab to fourth card
    await page.keyboard.press('Tab');
    await expect(productCards.nth(3)).toBeFocused();

    // THEN: All 4 cards are focusable in sequential order
    // (assertions above confirm focus order)
  });

  test('[P1] should display visible focus indicator when navigating with keyboard', async ({
    page,
  }) => {
    // GIVEN: User navigates with keyboard
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    const firstCard = constellationSection.locator('[data-testid^="product-card-"]').nth(0);

    // WHEN: User focuses card via keyboard
    await firstCard.focus();
    await expect(firstCard).toBeFocused();

    // THEN: Focus ring is visible
    // Check for focus-visible ring class
    const className = await firstCard.getAttribute('class');
    expect(className).toContain('focus-visible:ring');

    // Verify visual focus indicator by checking computed styles
    const focusRingVisible = await firstCard.evaluate((el) => {
      const styles = window.getComputedStyle(el, ':focus-visible');
      // Check if outline or box-shadow (ring) is applied
      return (
        styles.outline !== 'none' ||
        styles.boxShadow !== 'none' ||
        el.classList.contains('ring-2')
      );
    });

    expect(focusRingVisible).toBeTruthy();
  });

  test('[P1] should apply hover treatment on desktop with subtle scale', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport
    await page.setViewportSize({width: 1024, height: 768});

    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    const firstCard = constellationSection.locator('[data-testid^="product-card-"]').nth(0);

    // WHEN: User hovers over a product card
    // Get initial transform
    const initialTransform = await firstCard.evaluate((el) =>
      window.getComputedStyle(el).transform,
    );

    // Hover the card
    await firstCard.hover();

    // Wait for hover transition (CSS transition may take time)
    await page.waitForTimeout(100);

    // Get transform after hover
    const hoverTransform = await firstCard.evaluate((el) =>
      window.getComputedStyle(el).transform,
    );

    // THEN: Transform changes (scale applied)
    expect(hoverTransform).not.toBe(initialTransform);

    // Verify hover class is present
    const className = await firstCard.getAttribute('class');
    expect(className).toContain('lg:hover:scale');
  });

  test('[P1] should render images with proper aspect ratio to prevent CLS', async ({
    page,
  }) => {
    // GIVEN: User loads homepage
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    // WHEN: Images are loaded
    const images = constellationSection.locator('img');

    // THEN: All images have aspect-ratio container
    const imageContainers = constellationSection.locator('.aspect-square');
    await expect(imageContainers).toHaveCount(4);

    // AND: Images are loaded
    for (let i = 0; i < 4; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();

      // Verify image has loaded (naturalWidth > 0)
      const isLoaded = await img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      );
      expect(isLoaded).toBeTruthy();
    }
  });

  test('[P1] should maintain layout fluid from 320px to 2560px', async ({page}) => {
    const testViewports = [
      {width: 320, height: 568}, // Small mobile
      {width: 768, height: 1024}, // Tablet
      {width: 1024, height: 768}, // Desktop
      {width: 1920, height: 1080}, // Large desktop
      {width: 2560, height: 1440}, // Ultra-wide
    ];

    for (const viewport of testViewports) {
      // GIVEN: Viewport size
      await page.setViewportSize(viewport);

      // WHEN: Constellation section is visible
      const constellationSection = page.locator(
        '[aria-label="Product constellation grid"]',
      );
      await expect(constellationSection).toBeVisible();

      // THEN: No horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow).toBe(false);

      // AND: All 4 cards remain visible
      const productCards = constellationSection.locator('[data-testid^="product-card-"]');
      await expect(productCards).toHaveCount(4);
    }
  });

  test('[P2] should integrate with scroll-snap on mobile', async ({page}) => {
    // GIVEN: Mobile viewport with scroll-snap enabled
    await page.setViewportSize({width: 375, height: 667});

    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    // WHEN: Constellation section has snap-start class
    const className = await constellationSection.getAttribute('class');

    // THEN: Section participates in scroll-snap
    expect(className).toContain('snap-start');
  });
});
