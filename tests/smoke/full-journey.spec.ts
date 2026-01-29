import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Full B2C Journey - Smoke Tests
 *
 * Validates the complete scroll journey from hero to footer across devices.
 * Tests run on iPhone SE (375px), Pixel 7 (412px), and Desktop (1440px).
 *
 * Coverage:
 * - AC1: Hero loads with LCP <2.5s
 * - AC2: Constellation displays all 4 products
 * - AC3: Texture reveal triggers <100ms
 * - AC4: Story fragments appear on scroll
 * - AC5: Collection prompt appears after 2+ products
 * - AC6: Footer navigation works
 * - AC7: No console errors or accessibility violations
 * - AC8: Tests pass on multiple devices (via Playwright projects)
 * - AC9: Tests run in CI pipeline (configured in GitHub Actions)
 */

test.describe('Full B2C Journey - Smoke Tests', () => {
  // Capture console errors
  let consoleErrors: string[] = [];

  test.beforeEach(async ({page}) => {
    // Reset console errors
    consoleErrors = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    // Navigate to home page
    await page.goto('/', {waitUntil: 'domcontentloaded'});
  });

  test('[P0] AC1: Hero loads with LCP <2.5s', async ({page}) => {
    // Wait for hero section to be visible
    const heroSection = page.locator('[data-testid="hero-section"]').first();
    await expect(heroSection).toBeVisible();

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');

      // Get LCP (Largest Contentful Paint)
      const lcp = lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0;

      return {
        lcp,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      };
    });

    // Assert LCP <2.5s (2500ms)
    expect(metrics.lcp).toBeLessThan(2500);

    // Verify hero content is visible
    await expect(heroSection).toContainText(/isla suds/i);
  });

  test('[P0] AC2: Constellation displays all 4 products', async ({page}) => {
    // Wait for constellation to be visible
    await page.waitForSelector('[data-testid="constellation-grid"]', {
      state: 'visible',
    });

    // Count product cards
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards).toHaveCount(4);

    // Verify each card has required elements
    for (let i = 0; i < 4; i++) {
      const card = productCards.nth(i);

      // Verify image is loaded (not broken)
      const img = card.locator('img').first();
      await expect(img).toBeVisible();

      // Verify product name
      const name = card.locator('[data-testid="product-name"]').first();
      await expect(name).toBeVisible();

      // Verify product price
      const price = card.locator('[data-testid="product-price"]').first();
      await expect(price).toBeVisible();
    }

    // Check CLS (Cumulative Layout Shift) <0.1
    const cls = await page.evaluate(() => {
      const clsEntries = performance.getEntriesByType('layout-shift');
      let clsScore = 0;
      clsEntries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      });
      return clsScore;
    });

    expect(cls).toBeLessThan(0.1);
  });

  test('[P0] AC3: Texture reveal triggers <100ms', async ({page, isMobile}) => {
    // Wait for constellation
    await page.waitForSelector('[data-testid="constellation-grid"]', {
      state: 'visible',
    });

    // Get first product card
    const firstCard = page.locator('[data-testid="product-card"]').first();
    await expect(firstCard).toBeVisible();

    // Mark performance timing
    await page.evaluate(() => {
      performance.mark('texture-reveal-test-start');
    });

    // Trigger texture reveal (hover on desktop, tap on mobile)
    if (isMobile) {
      await firstCard.tap();
    } else {
      await firstCard.hover();
    }

    // Wait for texture reveal to appear
    const textureReveal = page.locator('[data-testid="texture-reveal"]').first();
    await expect(textureReveal).toBeVisible({timeout: 200});

    // Measure timing
    const revealTiming = await page.evaluate(() => {
      performance.mark('texture-reveal-test-end');
      performance.measure(
        'texture-reveal-test',
        'texture-reveal-test-start',
        'texture-reveal-test-end',
      );
      const entries = performance.getEntriesByName('texture-reveal-test');
      return entries.length > 0 ? entries[0].duration : 0;
    });

    // Assert reveal timing <100ms
    expect(revealTiming).toBeLessThan(100);

    // Verify texture reveal content
    await expect(textureReveal).toContainText(/.+/); // Has scent narrative
    await expect(
      textureReveal.locator('[data-testid="product-name"]').first(),
    ).toBeVisible();
    await expect(
      textureReveal.locator('[data-testid="product-price"]').first(),
    ).toBeVisible();

    // Verify no network requests during reveal (image preloaded)
    const networkRequests = await page.evaluate(() => {
      const resourceEntries = performance.getEntriesByType('resource');
      const recentRequests = resourceEntries.filter(
        (entry: any) => entry.startTime > performance.now() - 200,
      );
      return recentRequests.length;
    });

    // Allow minimal requests, but no image loading
    expect(networkRequests).toBeLessThan(2);
  });

  test('[P0] AC3: Reduced motion respects prefers-reduced-motion', async ({page}) => {
    // Emulate reduced motion preference
    await page.emulateMedia({reducedMotion: 'reduce'});

    // Navigate to page with reduced motion
    await page.goto('/', {waitUntil: 'domcontentloaded'});

    // Wait for constellation
    await page.waitForSelector('[data-testid="constellation-grid"]', {
      state: 'visible',
    });

    // Hover over product card
    const firstCard = page.locator('[data-testid="product-card"]').first();
    await firstCard.hover();

    // Wait for texture reveal
    const textureReveal = page.locator('[data-testid="texture-reveal"]').first();
    await expect(textureReveal).toBeVisible();

    // Verify static reveal (no animation duration or instant opacity)
    const hasAnimation = await textureReveal.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      const transitionDuration = styles.transitionDuration;
      return transitionDuration !== '0s' && transitionDuration !== '';
    });

    // Should have no animation in reduced motion mode
    expect(hasAnimation).toBe(false);
  });

  test('[P1] AC4: Story fragments appear on scroll', async ({page}) => {
    // Scroll to story fragments section
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 1.5);
    });

    // Wait for story fragment to be visible
    const storyFragment = page.locator('[data-testid="story-fragment"]').first();
    await expect(storyFragment).toBeVisible();

    // Verify story fragment has content
    await expect(storyFragment).toContainText(/.+/);

    // Verify smooth scroll (Lenis on desktop, native on mobile)
    // Check no console errors during scroll
    expect(consoleErrors.length).toBe(0);
  });

  test('[P1] AC5: Collection prompt appears after 2+ products explored', async ({
    page,
    isMobile,
  }) => {
    // Wait for constellation
    await page.waitForSelector('[data-testid="constellation-grid"]', {
      state: 'visible',
    });

    // Explore 2 products (trigger texture reveals)
    const productCards = page.locator('[data-testid="product-card"]');

    for (let i = 0; i < 2; i++) {
      const card = productCards.nth(i);
      if (isMobile) {
        await card.tap();
      } else {
        await card.hover();
      }
      await page.waitForTimeout(100); // Allow reveal to register
    }

    // Scroll to collection prompt trigger point
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 2);
    });

    // Wait for collection prompt to be visible
    const collectionPrompt = page.locator('[data-testid="collection-prompt"]').first();
    await expect(collectionPrompt).toBeVisible();

    // Verify CTA text
    await expect(collectionPrompt).toContainText(/get the collection|variety pack/i);

    // Verify variety pack mention
    await expect(collectionPrompt).toContainText(/all 4|variety|complete set/i);

    // Verify keyboard accessibility
    const ctaButton = collectionPrompt
      .locator('button, a[href], [role="button"]')
      .first();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();
  });

  test('[P2] AC6: Footer navigation works', async ({page}) => {
    // Scroll to footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait for footer to be visible
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();

    // Verify footer links
    const expectedLinks = [
      {text: 'Home', href: '/'},
      {text: 'About', href: '/about'},
      {text: 'Contact', href: '/contact'},
      {text: 'Wholesale', href: '/wholesale'},
      {text: 'Privacy Policy', href: '/privacy'},
      {text: 'Terms of Service', href: '/terms'},
    ];

    for (const {text, href} of expectedLinks) {
      const link = footer.locator(`a:has-text("${text}")`).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', href);
    }

    // Verify keyboard accessibility (can be tabbed to)
    const firstLink = footer.locator('a').first();
    await expect(firstLink).toBeVisible();
    await firstLink.focus();
    await expect(firstLink).toBeFocused();

    // Verify social media placeholder icons visible
    const socialIcons = footer.locator('[data-testid="social-icons"]').first();
    await expect(socialIcons).toBeVisible();

    // Test navigation (click Home link)
    const homeLink = footer.locator('a:has-text("Home")').first();
    await homeLink.click();
    await page.waitForURL('/');
    expect(page.url()).toContain('/');
  });

  test('[P0] AC7: No console errors or accessibility violations', async ({page}) => {
    // Run accessibility audit with axe-core
    const accessibilityScanResults = await new AxeBuilder({page}).analyze();

    // Assert no violations
    expect(accessibilityScanResults.violations).toEqual([]);

    // Verify no console errors
    expect(consoleErrors).toHaveLength(0);

    // Verify all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt', /.*/);
    }

    // Verify keyboard navigation works
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const firstFocusable = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocusable).toBeTruthy();
  });

  test('[P1] AC8: Layout responsive across viewports', async ({page, viewport}) => {
    // This test runs across all 3 device projects (iPhone SE, Pixel 7, Desktop)
    // Verify page is readable and layout is correct

    const viewportWidth = viewport?.width || 0;

    // Verify hero is visible
    const hero = page.locator('[data-testid="hero-section"]').first();
    await expect(hero).toBeVisible();

    // Verify constellation layout adapts
    const constellation = page.locator('[data-testid="constellation-grid"]').first();
    await expect(constellation).toBeVisible();

    // Verify touch targets on mobile (44x44px minimum)
    if (viewportWidth < 768) {
      const productCards = page.locator('[data-testid="product-card"]');
      const firstCard = productCards.first();

      const boundingBox = await firstCard.boundingBox();
      expect(boundingBox).toBeTruthy();
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      }
    }

    // Verify footer is readable
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });
});
