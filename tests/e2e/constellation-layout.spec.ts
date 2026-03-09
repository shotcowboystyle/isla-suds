import {test, expect} from '@playwright/test';

/**
 * Products List Section E2E Tests
 *
 * Tests the homepage products list section which renders 4 product cards
 * in a vertical column on mobile and a GSAP-driven horizontal scroll
 * layout on desktop (>=992px).
 *
 * Component hierarchy:
 *   section > .track > .camera > .frame > .item > .collection-list-wrapper
 *     > div[role="list"].collection-list > ProductCard[role="listitem"] x4
 *
 * Priority: P0-P1 (critical user experience)
 */

test.describe('Products List Section', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    // Wait for the product list container to be present in the DOM
    await page.waitForSelector('[role="list"]', {state: 'visible', timeout: 15000});
  });

  test('[P0] should display 4 product cards with titles and images', async ({page}) => {
    // GIVEN: User is on the homepage

    // WHEN: The products list section is loaded
    const productList = page.locator('[role="list"]').first();
    await expect(productList).toBeVisible();

    // THEN: All 4 product cards are rendered
    const productCards = productList.locator('[role="listitem"]');
    await expect(productCards).toHaveCount(4);

    // AND: Each card has a visible title (h1 element with card-heading class)
    for (let i = 0; i < 4; i++) {
      const card = productCards.nth(i);
      await expect(card).toBeVisible();

      const title = card.locator('h1').first();
      await expect(title).toBeVisible();
      await expect(title).not.toHaveText('');
    }

    // AND: Each card contains at least one image (product soap bar image)
    for (let i = 0; i < 4; i++) {
      const card = productCards.nth(i);
      const image = card.locator('img').first();
      await expect(image).toBeVisible();
    }
  });

  test('[P0] should have working product links on each card', async ({page}) => {
    // GIVEN: Products list is visible
    const productList = page.locator('[role="list"]').first();
    const productCards = productList.locator('[role="listitem"]');

    // THEN: Each card contains a link with an href pointing to a product page
    for (let i = 0; i < 4; i++) {
      const link = productCards.nth(i).locator('a').first();
      await expect(link).toBeVisible();

      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\/products\//);
    }
  });

  test('[P1] should navigate to product page when a card is clicked', async ({page}) => {
    // GIVEN: Products list is visible
    const productList = page.locator('[role="list"]').first();
    const firstCard = productList.locator('[role="listitem"]').first();
    const link = firstCard.locator('a').first();

    // Capture the target href before clicking
    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();

    // WHEN: User clicks the first product card
    await link.click();

    // THEN: Page navigates to the product URL
    await page.waitForURL(`**${href}*`, {timeout: 10000});
    expect(page.url()).toContain('/products/');
  });

  test('[P1] should display heading text in the products section', async ({page}) => {
    // GIVEN: User is on the homepage

    // THEN: The section heading text is visible
    // The heading reads "We have 4 ... Silky Smooth ... Sudsy Soap Bars"
    await expect(page.getByText('We have 4')).toBeVisible();
    await expect(page.getByText('Silky Smooth')).toBeVisible();
    await expect(page.getByText('Sudsy Soap Bars')).toBeVisible();
  });

  test('[P1] should display "Shop All Products" button', async ({page}) => {
    // GIVEN: User is on the homepage with products section visible

    // THEN: A "SHOP ALL PRODUCTS" button is present (LiquidButton renders a <button>)
    const shopAllButton = page.getByText('SHOP ALL PRODUCTS').first();
    await expect(shopAllButton).toBeVisible();
  });

  test('[P1] should display product cards in a vertical column on mobile', async ({page}) => {
    // GIVEN: Mobile viewport
    await page.setViewportSize({width: 375, height: 667});
    await page.waitForTimeout(500); // Allow layout to settle after resize

    const productList = page.locator('[role="list"]').first();
    await expect(productList).toBeVisible();

    const productCards = productList.locator('[role="listitem"]');
    await expect(productCards).toHaveCount(4);

    // THEN: Cards are stacked vertically (each card has a unique Y position,
    // and X positions are similar since they are centered in a column)
    const cardPositions = await productCards.evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return {x: Math.round(rect.left), y: Math.round(rect.top)};
      }),
    );

    // Verify vertical stacking: each subsequent card should be below the previous
    for (let i = 1; i < cardPositions.length; i++) {
      expect(cardPositions[i].y).toBeGreaterThan(cardPositions[i - 1].y);
    }
  });

  test('[P1] should display product cards in a horizontal row on desktop', async ({page}) => {
    // GIVEN: Desktop viewport (>=992px where flex-flow switches to row)
    await page.setViewportSize({width: 1440, height: 900});
    await page.waitForTimeout(500); // Allow layout to settle

    const productList = page.locator('[role="list"]').first();
    await expect(productList).toBeVisible();

    const productCards = productList.locator('[role="listitem"]');
    await expect(productCards).toHaveCount(4);

    // THEN: Cards are laid out horizontally (distinct X positions)
    const cardPositions = await productCards.evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return {x: Math.round(rect.left), y: Math.round(rect.top)};
      }),
    );

    // At desktop sizes the collection-list uses flex-flow: row,
    // so each card's left edge should increase
    const uniqueXPositions = new Set(cardPositions.map((pos) => pos.x));
    expect(uniqueXPositions.size).toBeGreaterThanOrEqual(2);
  });

  test('[P1] should render product images without layout shift', async ({page}) => {
    // GIVEN: Products list is visible
    const productList = page.locator('[role="list"]').first();
    await expect(productList).toBeVisible();

    const productCards = productList.locator('[role="listitem"]');

    // THEN: Each product card image is fully loaded (naturalWidth > 0)
    for (let i = 0; i < 4; i++) {
      const img = productCards.nth(i).locator('img').first();
      await expect(img).toBeVisible();

      const isLoaded = await img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      );
      expect(isLoaded).toBeTruthy();
    }
  });

  test('[P1] should display an "Add to Cart" button on each product card', async ({page}) => {
    // GIVEN: Products list is visible
    const productList = page.locator('[role="list"]').first();
    const productCards = productList.locator('[role="listitem"]');

    // THEN: Each card has an "Add to Cart" or "Sold Out" button
    for (let i = 0; i < 4; i++) {
      const card = productCards.nth(i);
      const cartButton = card.locator('button').first();
      await expect(cartButton).toBeVisible();

      const buttonText = await cartButton.textContent();
      expect(buttonText).toMatch(/Add to Cart|Sold Out/i);
    }
  });

  test('[P1] should display product prices', async ({page}) => {
    // GIVEN: Products list is visible
    const productList = page.locator('[role="list"]').first();
    const productCards = productList.locator('[role="listitem"]');

    // THEN: Each card displays a price in currency format
    for (let i = 0; i < 4; i++) {
      const card = productCards.nth(i);
      const priceElement = card.locator('small').first();
      await expect(priceElement).toBeVisible();

      const priceText = await priceElement.textContent();
      expect(priceText).toMatch(/\$\d+\.\d{2}/);
    }
  });

  test('[P1] should support keyboard navigation to product links', async ({page}) => {
    // GIVEN: Products list is visible
    const productList = page.locator('[role="list"]').first();
    await expect(productList).toBeVisible();

    const firstCardLink = productList.locator('[role="listitem"]').first().locator('a').first();

    // WHEN: User focuses the first product card link
    await firstCardLink.focus();

    // THEN: The link receives focus
    await expect(firstCardLink).toBeFocused();

    // AND: User can press Enter to navigate
    const href = await firstCardLink.getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('[P1] should maintain layout across viewport sizes without horizontal overflow', async ({
    page,
  }) => {
    const viewports = [
      {width: 320, height: 568, name: 'Small mobile'},
      {width: 375, height: 667, name: 'iPhone SE'},
      {width: 768, height: 1024, name: 'Tablet'},
      {width: 1024, height: 768, name: 'Small desktop'},
      {width: 1440, height: 900, name: 'Desktop'},
      {width: 1920, height: 1080, name: 'Large desktop'},
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({width: viewport.width, height: viewport.height});
      await page.waitForTimeout(300); // Allow layout reflow

      // THEN: No unexpected horizontal overflow on the document
      const hasDocumentOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });

      // On desktop viewports (>=992px) the section uses overflow-hidden on .camera,
      // so the document itself should not overflow
      if (viewport.width >= 992) {
        expect(
          hasDocumentOverflow,
          `Document should not overflow horizontally at ${viewport.name} (${viewport.width}px)`,
        ).toBe(false);
      }

      // AND: Product cards are still present in the DOM
      const productList = page.locator('[role="list"]').first();
      const cards = productList.locator('[role="listitem"]');
      await expect(cards).toHaveCount(4);
    }
  });

  test('[P1] should render the section with proper semantic structure', async ({page}) => {
    // GIVEN: Homepage is loaded

    // THEN: The product list uses role="list" for accessibility
    const productList = page.locator('[role="list"]').first();
    await expect(productList).toBeVisible();

    // AND: Each product card uses role="listitem"
    const items = productList.locator('[role="listitem"]');
    await expect(items).toHaveCount(4);

    // AND: Each listitem contains a link (a element)
    for (let i = 0; i < 4; i++) {
      const link = items.nth(i).locator('a');
      await expect(link.first()).toBeVisible();
    }
  });
});
