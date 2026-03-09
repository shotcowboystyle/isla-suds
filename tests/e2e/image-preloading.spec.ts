import {test, expect} from '@playwright/test';

/**
 * Product Card Image Loading
 *
 * Tests verify that product card images are present in the DOM, use lazy loading
 * for below-fold content, load successfully when scrolled into view, and avoid
 * duplicate images within each card.
 */

test.describe('Product Card Image Loading', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('[P0] should render image elements inside each product card', async ({
    page,
  }) => {
    // GIVEN: The home page has loaded with the product list
    const productCards = page.locator('[role="listitem"]');
    const cardCount = await productCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // THEN: Each product card contains at least one img element
    // ProductCard renders a soap bar image (Picture or Shopify Image) and a particles image (Picture)
    for (let i = 0; i < cardCount; i++) {
      const card = productCards.nth(i);
      const images = card.locator('img');
      const imageCount = await images.count();
      expect(imageCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('[P0] should use lazy loading attribute on product card images', async ({
    page,
  }) => {
    // GIVEN: The product cards are rendered on the home page
    // ProductCard defaults to loading="lazy" for its images
    const productCards = page.locator('[role="listitem"]');
    const cardCount = await productCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // THEN: Images within product cards have loading="lazy"
    for (let i = 0; i < cardCount; i++) {
      const card = productCards.nth(i);
      const images = card.locator('img');
      const imageCount = await images.count();

      for (let j = 0; j < imageCount; j++) {
        const loadingAttr = await images.nth(j).getAttribute('loading');
        expect(loadingAttr).toBe('lazy');
      }
    }
  });

  test('[P1] should load images successfully when scrolled into view', async ({
    page,
  }) => {
    // GIVEN: Product cards exist on the page
    const productCards = page.locator('[role="listitem"]');
    const cardCount = await productCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // WHEN: The first product card is scrolled into view
    const firstCard = productCards.first();
    await firstCard.scrollIntoViewIfNeeded();

    // THEN: At least the first card's images load successfully
    // Wait for images to finish loading after scroll
    const firstCardImages = firstCard.locator('img');
    const firstCardImageCount = await firstCardImages.count();
    expect(firstCardImageCount).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < firstCardImageCount; i++) {
      const img = firstCardImages.nth(i);
      await expect(img).toBeVisible({timeout: 10000});

      // Verify the image loaded (naturalWidth > 0 means the resource was fetched)
      const isLoaded = await img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      );
      expect(isLoaded).toBe(true);
    }
  });

  test('[P1] should have exactly two images per product card (soap bar and particles)', async ({
    page,
  }) => {
    // GIVEN: Product cards are rendered
    // Each ProductCard renders:
    //   1. A soap bar image (via Picture or Shopify Image)
    //   2. A particles/elements image (via Picture)
    const productCards = page.locator('[role="listitem"]');
    const cardCount = await productCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // THEN: Each card contains exactly 2 img elements (no duplicates, no missing)
    for (let i = 0; i < cardCount; i++) {
      const card = productCards.nth(i);
      const images = card.locator('img');
      const imageCount = await images.count();
      expect(imageCount).toBe(2);
    }
  });

  test('[P1] should render responsive picture elements for local product images', async ({
    page,
  }) => {
    // GIVEN: Product cards use the Picture component which renders <picture><source> elements
    // The Picture component wraps ResponsiveImage, generating srcset for multiple sizes
    const productCards = page.locator('[role="listitem"]');
    const cardCount = await productCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // THEN: Cards contain <picture> elements with <source> children providing responsive formats
    const firstCard = productCards.first();
    const pictureElements = firstCard.locator('picture');
    const pictureCount = await pictureElements.count();

    // At least one picture element should exist (the particles image always uses Picture)
    expect(pictureCount).toBeGreaterThanOrEqual(1);

    // Verify source elements have srcset attributes for responsive loading
    for (let i = 0; i < pictureCount; i++) {
      const sources = pictureElements.nth(i).locator('source');
      const sourceCount = await sources.count();

      if (sourceCount > 0) {
        const srcset = await sources.first().getAttribute('srcset');
        expect(srcset).toBeTruthy();
      }
    }
  });

  test('[P1] should have alt text on all product card images', async ({
    page,
  }) => {
    // GIVEN: Product cards are rendered with images
    const productCards = page.locator('[role="listitem"]');
    const cardCount = await productCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // THEN: Every image has a non-empty alt attribute for accessibility
    for (let i = 0; i < cardCount; i++) {
      const card = productCards.nth(i);
      const images = card.locator('img');
      const imageCount = await images.count();

      for (let j = 0; j < imageCount; j++) {
        const alt = await images.nth(j).getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    }
  });
});
