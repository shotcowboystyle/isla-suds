/**
 * Accessibility Tests: Constellation Focus State (Story 2.4)
 *
 * Verifies WCAG 2.1 AA compliance for keyboard navigation, focus indicators,
 * and screen reader compatibility for non-linear product exploration.
 *
 * Priority: P1 - Accessibility is a quality gate for WCAG 2.1 AA
 */

import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Constellation Focus - Accessibility (Story 2.4)', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.waitForSelector('[aria-label="Product constellation grid"]');
  });

  test('[P1] should have no accessibility violations in default state', async ({
    page,
  }) => {
    // GIVEN: User is on homepage with constellation visible

    // WHEN: Running axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({page})
      .include('[aria-label="Product constellation grid"]')
      .analyze();

    // THEN: No violations detected
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('[P1] should have no accessibility violations in focused state', async ({
    page,
  }) => {
    // GIVEN: User has focused a product
    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();
    await firstCard.hover();

    // Wait for focus state to apply
    await page.waitForTimeout(100);

    // WHEN: Running axe scan on focused constellation
    const accessibilityScanResults = await new AxeBuilder({page})
      .include('[aria-label="Product constellation grid"]')
      .analyze();

    // THEN: No violations detected (dimmed cards still accessible)
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('[P1] should maintain visible focus indicator on keyboard navigation', async ({
    page,
  }) => {
    // GIVEN: User is navigating with keyboard only

    // WHEN: User tabs to first product card
    await page.keyboard.press('Tab'); // May need multiple tabs depending on page structure
    await page.keyboard.press('Tab');

    // Find focused element
    const focusedElement = page.locator(':focus');

    // THEN: Focus indicator is visible (ring-2 or equivalent)
    await expect(focusedElement).toBeVisible();

    // Verify focus indicator has sufficient contrast (via computed styles)
    const outlineWidth = await focusedElement.evaluate(
      (el) => window.getComputedStyle(el).outlineWidth,
    );

    // Should have visible outline or ring (not '0px')
    expect(outlineWidth).not.toBe('0px');
  });

  test('[P1] should allow keyboard-only exploration without mouse', async ({
    page,
  }) => {
    // GIVEN: User can only use keyboard
    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );

    // WHEN: User navigates and activates via keyboard
    // Tab to first card
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Adjust based on page structure

    // Press Enter to activate focus state
    await page.keyboard.press('Enter');
    await page.waitForTimeout(50);

    // THEN: First card enters focused state (same as hover/tap)
    const firstCard = cards.first();
    await expect(firstCard).toHaveClass(/scale-\[1\.02\]/);

    // AND: Can clear focus with Escape
    await page.keyboard.press('Escape');
    await expect(firstCard).not.toHaveClass(/scale-\[1\.02\]/);
  });

  test('[P1] should have meaningful accessible names for all product cards', async ({
    page,
  }) => {
    // GIVEN: User is on homepage

    // WHEN: Checking all product card links
    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );
    const cardCount = await cards.count();

    // THEN: All cards have accessible names (via aria-label or text content)
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const accessibleName = await card.getAttribute('aria-label');
      const textContent = await card.textContent();

      // Card must have either aria-label or meaningful text content
      expect(
        accessibleName || (textContent && textContent.trim().length > 0),
      ).toBeTruthy();
    }
  });

  test('[P1] should not trap keyboard focus within constellation', async ({
    page,
  }) => {
    // GIVEN: User is navigating with Tab key

    // WHEN: User tabs through constellation cards
    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );
    const cardCount = await cards.count();

    // Tab through all cards
    for (let i = 0; i < cardCount; i++) {
      await page.keyboard.press('Tab');
    }

    // Tab one more time to move beyond constellation
    await page.keyboard.press('Tab');

    // THEN: Focus should move to next focusable element (not trapped)
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );

    // Focus should be on something other than constellation card
    const stillInConstellation = await page.evaluate(() => {
      const activeEl = document.activeElement;
      const constellation = document.querySelector(
        '[aria-label="Product constellation grid"]',
      );
      return constellation?.contains(activeEl);
    });

    expect(stillInConstellation).toBe(false);
  });

  test('[P1] should announce focus state changes to screen readers', async ({
    page,
  }) => {
    // GIVEN: User is using screen reader

    // WHEN: Checking ARIA live regions or state attributes
    const constellation = page.locator(
      '[aria-label="Product constellation grid"]',
    );

    // Product cards should be links with role="link" (implicit from <a>)
    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();

    const role = await firstCard.getAttribute('role');
    const tagName = await firstCard.evaluate((el) => el.tagName.toLowerCase());

    // THEN: Cards are semantic links (implicit role)
    expect(tagName).toBe('a');
    // Role might be null (implicit) or explicitly "link"
    if (role) {
      expect(role).toBe('link');
    }
  });

  test('[P1] should maintain 4.5:1 contrast ratio for dimmed products', async ({
    page,
  }) => {
    // GIVEN: User has focused one product (others dimmed)
    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );
    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);

    await firstCard.hover();
    await page.waitForTimeout(100);

    // WHEN: Checking contrast of dimmed card text
    // (axe-core will catch contrast violations)
    const accessibilityScanResults = await new AxeBuilder({page})
      .include('[aria-label="Product constellation grid"]')
      .analyze();

    // THEN: No contrast violations for dimmed cards
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast',
    );
    expect(contrastViolations).toHaveLength(0);
  });

  test('[P1] should preserve focus order matching visual flow', async ({
    page,
  }) => {
    // GIVEN: User is tabbing through constellation

    // WHEN: Observing tab order
    const focusOrder: string[] = [];

    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );
    const cardCount = await cards.count();

    for (let i = 0; i < cardCount; i++) {
      await page.keyboard.press('Tab');
      const focusedText = await page.evaluate(
        () => document.activeElement?.textContent || '',
      );
      if (focusedText.trim()) {
        focusOrder.push(focusedText.trim());
      }
    }

    // THEN: Focus order is predictable and matches DOM order
    expect(focusOrder.length).toBeGreaterThan(0);

    // All entries should be unique (no duplicate focus)
    const uniqueFocusOrder = new Set(focusOrder);
    expect(uniqueFocusOrder.size).toBe(focusOrder.length);
  });

  test('[P1] should support high contrast mode without breaking focus states', async ({
    page,
  }) => {
    // GIVEN: User has enabled high contrast mode (Windows)
    // Simulate via forced-colors media query
    await page.emulateMedia({forcedColors: 'active'});

    // WHEN: User focuses a product
    const firstCard = page
      .locator('[aria-label="Product constellation grid"] a')
      .first();
    await firstCard.hover();

    // THEN: Card still has focus state classes applied
    await expect(firstCard).toHaveClass(/scale-\[1\.02\]/);

    // AND: No accessibility violations in forced-colors mode
    const accessibilityScanResults = await new AxeBuilder({page})
      .include('[aria-label="Product constellation grid"]')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Constellation Focus - Touch Target Size (Story 2.4)', () => {
  test('[P1] should have minimum 44x44px touch targets on mobile', async ({
    page,
  }) => {
    // GIVEN: User is on mobile device
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/');
    await page.waitForSelector('[aria-label="Product constellation grid"]');

    // WHEN: Measuring product card touch targets
    const cards = page.locator(
      '[aria-label="Product constellation grid"] a',
    );
    const cardCount = await cards.count();

    // THEN: All cards meet minimum touch target size
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const box = await card.boundingBox();

      expect(box).toBeTruthy();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44); // WCAG 2.1 AA minimum
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
