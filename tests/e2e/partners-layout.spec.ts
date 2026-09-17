import {test, expect} from '@playwright/test';

/**
 * Partners Landing Page Layout E2E Tests
 *
 * Regression coverage for two layout defects:
 *
 * 1. The hero is `position: sticky` so following sections scroll over it. It
 *    used to carry `z-index: 1`, which beat IntroSection (no z-index) and
 *    PerksSection (static), so the hero painted on top of both while scrolling.
 *
 * 2. The three perk cards used a raw `card-${n}` string while CSS Modules had
 *    hashed the matching `.card-N` rules, so none of the per-card rules
 *    applied. Each card shrank to fit its own copy and the widths diverged.
 *
 * Priority: P1 (visual correctness)
 */

test.describe('Partners landing page layout', () => {
  test.use({viewport: {width: 1440, height: 900}});

  test.beforeEach(async ({page}) => {
    await page.goto('/partners');
    // The preloader overlay covers the page and would win every hit test.
    await page.waitForSelector('[class*="preloaderWrapper"]', {state: 'detached', timeout: 30000});
    await page.waitForTimeout(1500);
  });

  test('[P1] perk cards are equal width', async ({page}) => {
    // GIVEN: The perks section with its three cards
    const cards = page.locator('[class*="brand-core-cards"] > div');
    await expect(cards).toHaveCount(3);

    // WHEN: Their rendered widths are measured. getBoundingClientRect() would
    // reflect each card's rotation, so read the untransformed layout width.
    const widths = await cards.evaluateAll((els) => els.map((el) => (el as HTMLElement).offsetWidth));

    // THEN: All three match (1px tolerance for sub-pixel grid rounding)
    expect(Math.min(...widths)).toBeGreaterThan(0);
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
  });

  test('[P1] sections scroll over the sticky hero, not under it', async ({page}) => {
    // GIVEN: The sticky hero sits at the bottom of the stacking order
    const hero = page.locator('main > section').first();
    expect(['0', 'auto']).toContain(await hero.evaluate((el) => getComputedStyle(el).zIndex));

    // WHEN: The page is scrolled far enough that a later section overlaps the
    // still-pinned hero. Lenis drives smooth scroll, so step the wheel and let
    // it settle rather than jumping.
    for (let i = 0; i < 14; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(1500);

    const result = await page.evaluate(() => {
      const sections = [...document.querySelectorAll('main > section')];
      const heroRect = sections[0].getBoundingClientRect();
      const hit = document.elementFromPoint(window.innerWidth / 2, 300);
      return {
        heroPinned: heroRect.top <= 0 && heroRect.bottom > 300,
        owner: sections.findIndex((s) => hit && s.contains(hit)),
      };
    });

    // THEN: The hero is still pinned across that point...
    expect(result.heroPinned).toBe(true);
    // ...but a later section owns the pixel, i.e. it paints over the hero.
    expect(result.owner).toBeGreaterThan(0);
  });
});
