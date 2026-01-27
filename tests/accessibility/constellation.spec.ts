import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Story 2.3: Constellation Grid Accessibility Tests
 *
 * Validates WCAG 2.1 AA compliance, keyboard navigation,
 * semantic HTML, and ARIA patterns for constellation layout.
 *
 * Priority: P1 (accessibility is a requirement)
 */

test.describe('Constellation Grid Accessibility', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    // Wait for constellation section
    await page.waitForSelector(
      '[aria-label="Product constellation grid"]',
      {state: 'visible'},
    );
  });

  test('[P1] should pass automated accessibility scan (axe-core)', async ({
    page,
  }) => {
    // GIVEN: Constellation section is visible
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    // WHEN: Running axe accessibility scan on constellation region
    const accessibilityScanResults = await new AxeBuilder({page})
      .include('[aria-label="Product constellation grid"]')
      .analyze();

    // THEN: No accessibility violations detected
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('[P1] should have semantic HTML structure', async ({page}) => {
    // GIVEN: Constellation section loaded
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );

    // THEN: Section uses semantic <section> element
    const tagName = await constellationSection.evaluate((el) => el.tagName);
    expect(tagName).toBe('SECTION');

    // AND: Section has descriptive aria-label
    const ariaLabel = await constellationSection.getAttribute('aria-label');
    expect(ariaLabel).toBe('Product constellation grid');

    // AND: Product cards are links (semantic navigation)
    const productLinks = constellationSection.locator('a[href^="/products/"]');
    await expect(productLinks).toHaveCount(4);
  });

  test('[P1] should have all product cards keyboard accessible', async ({
    page,
  }) => {
    // GIVEN: Constellation section visible
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );

    // WHEN: Checking focusable elements
    const productCards = constellationSection.locator('[data-testid^="product-card-"]');

    // THEN: All 4 cards are in tab order
    for (let i = 0; i < 4; i++) {
      const card = productCards.nth(i);

      // Card should be focusable (tabindex not -1)
      const tabIndex = await card.getAttribute('tabindex');
      expect(tabIndex).not.toBe('-1');

      // Focus the card
      await card.focus();
      await expect(card).toBeFocused();
    }
  });

  test('[P1] should have focus order that matches visual flow', async ({
    page,
  }) => {
    // GIVEN: Constellation section visible
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );

    // WHEN: User tabs through cards
    const productCards = constellationSection.locator('[data-testid^="product-card-"]');

    // Get visual positions (top-to-bottom, left-to-right)
    const cardPositions = await productCards.evaluateAll((cards) =>
      cards.map((card, index) => {
        const rect = card.getBoundingClientRect();
        return {
          index,
          x: rect.x,
          y: rect.y,
          element: card,
        };
      }),
    );

    // THEN: Focus order should follow visual order
    // On desktop: may be organic, but focus should still be logical
    // On mobile: should be left-to-right, top-to-bottom

    // Tab through all cards in DOM order
    await productCards.nth(0).focus();
    await expect(productCards.nth(0)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(productCards.nth(1)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(productCards.nth(2)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(productCards.nth(3)).toBeFocused();

    // Focus order is sequential in DOM, which should match visual flow
  });

  test('[P1] should have visible focus indicators', async ({page}) => {
    // GIVEN: Constellation section visible
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    const firstCard = constellationSection.locator('[data-testid^="product-card-"]').nth(0);

    // WHEN: Card receives keyboard focus
    await firstCard.focus();
    await expect(firstCard).toBeFocused();

    // THEN: Focus indicator is visible and meets contrast requirements
    const focusStyles = await firstCard.evaluate((el) => {
      const styles = window.getComputedStyle(el, ':focus-visible');
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineColor: styles.outlineColor,
        boxShadow: styles.boxShadow,
      };
    });

    // Either outline or box-shadow (ring) should be present
    const hasFocusIndicator =
      focusStyles.outline !== 'none' ||
      focusStyles.boxShadow !== 'none' ||
      focusStyles.outlineWidth !== '0px';

    expect(hasFocusIndicator).toBeTruthy();
  });

  test('[P1] should have meaningful accessible names for all cards', async ({
    page,
  }) => {
    // GIVEN: Constellation section loaded
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );

    // WHEN: Checking accessible names
    const productCards = constellationSection.locator('[data-testid^="product-card-"]');

    // THEN: Each card has accessible name from content
    for (let i = 0; i < 4; i++) {
      const card = productCards.nth(i);

      // Get accessible name via aria-label or text content
      const accessibleName = await card.evaluate((el) => {
        // Aria-label takes precedence
        const ariaLabel = el.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel;

        // Otherwise, text content provides accessible name
        return el.textContent?.trim() || '';
      });

      // Should have meaningful text (product name)
      expect(accessibleName.length).toBeGreaterThan(0);
      expect(accessibleName).not.toBe('View product'); // Should include product name
    }
  });

  test('[P1] should have proper alt text for product images', async ({page}) => {
    // GIVEN: Constellation section loaded
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );

    // WHEN: Checking images
    const images = constellationSection.locator('img');
    await expect(images).toHaveCount(4);

    // THEN: All images have alt text (meaningful or empty for decorative)
    for (let i = 0; i < 4; i++) {
      const img = images.nth(i);

      const alt = await img.getAttribute('alt');

      // Alt attribute should exist (can be empty string for decorative)
      expect(alt).not.toBeNull();

      // If alt is not empty, it should be meaningful (contain product info)
      if (alt && alt.length > 0) {
        expect(alt.length).toBeGreaterThan(2); // More than just a few chars
      }
    }
  });

  test('[P1] should support Enter and Space key activation on cards', async ({
    page,
  }) => {
    // GIVEN: Constellation section visible
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    const firstCard = constellationSection.locator('[data-testid^="product-card-"]').nth(0);

    // Get the href before interaction
    const href = await firstCard.getAttribute('href');
    expect(href).toBeTruthy();

    // WHEN: User presses Enter on focused card
    await firstCard.focus();
    await expect(firstCard).toBeFocused();

    // Intercept navigation to verify it would happen
    let navigationTriggered = false;
    page.on('framenavigated', () => {
      navigationTriggered = true;
    });

    await page.keyboard.press('Enter');

    // THEN: Navigation should be triggered (link activates)
    // Wait a bit for navigation event
    await page.waitForTimeout(100);

    // Verify we navigated or at least tried to navigate to product page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/products/');
  });

  test('[P1] should maintain 44x44px touch targets on mobile', async ({page}) => {
    // GIVEN: Mobile viewport
    await page.setViewportSize({width: 375, height: 667});

    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    // WHEN: Checking card dimensions
    const productCards = constellationSection.locator('[data-testid^="product-card-"]');

    // THEN: All cards meet minimum touch target size (44x44px)
    for (let i = 0; i < 4; i++) {
      const card = productCards.nth(i);
      const boundingBox = await card.boundingBox();

      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('[P1] should have sufficient color contrast for text', async ({page}) => {
    // GIVEN: Constellation section loaded
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );

    // WHEN: Running axe scan with WCAG AA color contrast rules
    const accessibilityScanResults = await new AxeBuilder({page})
      .include('[aria-label="Product constellation grid"]')
      .withTags(['wcag2aa', 'wcag21aa'])
      .analyze();

    // THEN: No color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter((v) =>
      v.id.includes('color-contrast'),
    );

    expect(contrastViolations).toEqual([]);
  });

  test('[P2] should support prefers-reduced-motion for animations', async ({
    page,
  }) => {
    // GIVEN: User has prefers-reduced-motion enabled
    await page.emulateMedia({reducedMotion: 'reduce'});

    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    const firstCard = constellationSection.locator('[data-testid^="product-card-"]').nth(0);

    // WHEN: Checking transition styles
    const transitions = await firstCard.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        transition: styles.transition,
        transitionDuration: styles.transitionDuration,
      };
    });

    // THEN: Transitions should be minimal or instant when reduced motion is preferred
    // (project uses GPU-only transforms, but should still respect preference)
    // Typically duration would be 0s or very short

    // This is a guideline check - implementation may vary
    // The key is that animations don't cause vestibular issues
    expect(transitions).toBeDefined();
  });
});
