/**
 * Preload Test Helpers
 *
 * Utilities for validating image preload behavior in E2E tests.
 */

import type {Page} from '@playwright/test';

/**
 * Get all preload link elements from the page head
 *
 * @example
 * const links = await getPreloadLinks(page);
 * expect(links).toHaveLength(4);
 */
export async function getPreloadLinks(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const links = document.head.querySelectorAll('link[rel="preload"][as="image"]');
    return Array.from(links).map((link) => link.getAttribute('href') || '');
  });
}

/**
 * Check if a specific URL has a preload link
 *
 * @example
 * const hasPreload = await hasPreloadLink(page, 'https://cdn.shopify.com/image.jpg');
 * expect(hasPreload).toBe(true);
 */
export async function hasPreloadLink(page: Page, url: string): Promise<boolean> {
  const links = await getPreloadLinks(page);
  return links.some((href) => href === url || href.includes(url));
}

/**
 * Get preload link attributes for validation
 *
 * @example
 * const attrs = await getPreloadLinkAttributes(page, 'https://cdn.shopify.com/image.jpg');
 * expect(attrs.fetchpriority).toBe('high');
 */
export async function getPreloadLinkAttributes(
  page: Page,
  url: string,
): Promise<Record<string, string | null>> {
  return page.evaluate((targetUrl) => {
    const link = document.head.querySelector(
      `link[rel="preload"][as="image"][href="${targetUrl}"], link[rel="preload"][as="image"][href*="${targetUrl}"]`,
    );

    if (!link) {
      return {
        rel: null,
        as: null,
        href: null,
        fetchpriority: null,
        crossorigin: null,
        type: null,
      };
    }

    return {
      rel: link.getAttribute('rel'),
      as: link.getAttribute('as'),
      href: link.getAttribute('href'),
      fetchpriority: link.getAttribute('fetchpriority'),
      crossorigin: link.getAttribute('crossorigin'),
      type: link.getAttribute('type'),
    };
  }, url);
}

/**
 * Wait for preload links to appear in head
 *
 * @example
 * await waitForPreloadLinks(page, 4, { timeout: 3000 });
 */
export async function waitForPreloadLinks(
  page: Page,
  expectedCount: number,
  options: {timeout?: number} = {},
): Promise<void> {
  const {timeout = 5000} = options;

  await page.waitForFunction(
    (count) => {
      const links = document.head.querySelectorAll('link[rel="preload"][as="image"]');
      return links.length >= count;
    },
    expectedCount,
    {timeout},
  );
}

/**
 * Check if URLs have optimization parameters (width, format)
 *
 * @example
 * const isOptimized = await hasOptimizationParams(page, url);
 * expect(isOptimized).toBe(true);
 */
export async function hasOptimizationParams(
  page: Page,
  url: string,
): Promise<boolean> {
  const links = await getPreloadLinks(page);
  const matchingLink = links.find((href) => href.includes(url));

  if (!matchingLink) {
    return false;
  }

  // Check for Shopify CDN optimization parameters (AC2)
  return matchingLink.includes('width=') && matchingLink.includes('format=');
}
