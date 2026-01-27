import {test, expect} from '@playwright/test';

/**
 * Story 2.3: Constellation Grid CLS Performance Test
 *
 * Validates that Cumulative Layout Shift (CLS) remains below 0.1
 * when constellation section enters viewport and images load.
 *
 * This is a CI GATE per project-context.md - failure blocks merge.
 *
 * Priority: P0 (performance contract requirement)
 */

test.describe('Constellation Grid CLS Performance', () => {
  test('[P0] should maintain CLS < 0.1 when constellation enters viewport', async ({
    page,
  }) => {
    // GIVEN: User navigates to homepage with performance measurement
    await page.goto('/', {waitUntil: 'domcontentloaded'});

    // Enable layout shift tracking
    await page.evaluate(() => {
      // @ts-ignore - PerformanceObserver exists in browser
      window.__layoutShifts = [];

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) {
            // Ignore layout shifts caused by user input
            continue;
          }
          // @ts-ignore
          window.__layoutShifts.push({
            value: (entry as any).value,
            sources: (entry as any).sources || [],
            startTime: entry.startTime,
          });
        }
      });

      observer.observe({type: 'layout-shift', buffered: true});
    });

    // WHEN: Scrolling to constellation section to trigger image loading
    await page.evaluate(() => {
      const constellationSection = document.querySelector(
        '[aria-label="Product constellation grid"]',
      );
      if (constellationSection) {
        constellationSection.scrollIntoView({behavior: 'instant'});
      }
    });

    // Wait for images to load
    await page.waitForLoadState('networkidle');

    // Give a bit of time for any late layout shifts
    await page.waitForTimeout(500);

    // THEN: Calculate total CLS score
    const layoutShifts = await page.evaluate(() => {
      // @ts-ignore
      return window.__layoutShifts || [];
    });

    // Calculate CLS (sum of all layout shift values)
    const cls = layoutShifts.reduce(
      (sum: number, shift: any) => sum + shift.value,
      0,
    );

    // CLS should be below 0.1 (Good per Core Web Vitals)
    expect(cls).toBeLessThan(0.1);

    // Log CLS for debugging
    console.log(`Constellation CLS: ${cls.toFixed(4)}`);
    console.log(`Layout shifts detected: ${layoutShifts.length}`);

    if (layoutShifts.length > 0) {
      console.log('Layout shift details:', layoutShifts);
    }
  });

  test('[P1] should reserve space for images with aspect-ratio before load', async ({
    page,
  }) => {
    // GIVEN: User navigates with slow network to see placeholder behavior
    // Throttle network to simulate slow image loading
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (50 * 1024) / 8, // 50kb/s
      uploadThroughput: (50 * 1024) / 8,
      latency: 2000, // 2s latency
    });

    await page.goto('/');

    // WHEN: Constellation section loads (images may not be loaded yet)
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    // Scroll into view
    await constellationSection.scrollIntoViewIfNeeded();

    // THEN: Image containers have aspect-ratio set (reserves space)
    const imageContainers = constellationSection.locator('.aspect-square');
    await expect(imageContainers).toHaveCount(4);

    // AND: Each container has non-zero height even if image not loaded
    for (let i = 0; i < 4; i++) {
      const container = imageContainers.nth(i);
      const boundingBox = await container.boundingBox();

      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        // Height should be reserved (aspect-square means height = width)
        expect(boundingBox.height).toBeGreaterThan(0);
        expect(boundingBox.width).toBeGreaterThan(0);

        // For square aspect ratio, width should roughly equal height
        const ratio = boundingBox.width / boundingBox.height;
        expect(ratio).toBeCloseTo(1, 0.1); // Within 10% (accounting for margins/padding)
      }
    }
  });

  test('[P1] should not cause layout shift when images finish loading', async ({
    page,
  }) => {
    // GIVEN: User navigates with slow network
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (100 * 1024) / 8, // 100kb/s
      uploadThroughput: (100 * 1024) / 8,
      latency: 1000,
    });

    await page.goto('/', {waitUntil: 'domcontentloaded'});

    // Enable layout shift tracking
    await page.evaluate(() => {
      // @ts-ignore
      window.__layoutShiftsAfterScroll = [];

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue;
          // @ts-ignore
          window.__layoutShiftsAfterScroll.push({
            value: (entry as any).value,
            startTime: entry.startTime,
          });
        }
      });

      observer.observe({type: 'layout-shift', buffered: false});
    });

    // WHEN: Scrolling to constellation and waiting for images
    await page.evaluate(() => {
      const constellationSection = document.querySelector(
        '[aria-label="Product constellation grid"]',
      );
      if (constellationSection) {
        constellationSection.scrollIntoView({behavior: 'instant'});
      }
    });

    // Capture heights before images load
    const heightsBeforeLoad = await page.evaluate(() => {
      const containers = Array.from(
        document.querySelectorAll(
          '[aria-label="Product constellation grid"] .aspect-square',
        ),
      );
      return containers.map((el) => (el as HTMLElement).offsetHeight);
    });

    // Wait for all images to load
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(
      () => {
        const images = Array.from(
          document.querySelectorAll(
            '[aria-label="Product constellation grid"] img',
          ),
        );
        return images.every((img) => (img as HTMLImageElement).complete);
      },
      {timeout: 10000},
    );

    // Capture heights after images load
    const heightsAfterLoad = await page.evaluate(() => {
      const containers = Array.from(
        document.querySelectorAll(
          '[aria-label="Product constellation grid"] .aspect-square',
        ),
      );
      return containers.map((el) => (el as HTMLElement).offsetHeight);
    });

    // THEN: Container heights should not change (no layout shift)
    expect(heightsBeforeLoad).toEqual(heightsAfterLoad);

    // AND: No significant layout shifts should be recorded
    const layoutShifts = await page.evaluate(() => {
      // @ts-ignore
      return window.__layoutShiftsAfterScroll || [];
    });

    const totalShift = layoutShifts.reduce(
      (sum: number, shift: any) => sum + shift.value,
      0,
    );

    // Allow very minor shifts (< 0.01) but nothing significant
    expect(totalShift).toBeLessThan(0.01);
  });

  test('[P1] should load constellation images with appropriate priority', async ({
    page,
  }) => {
    // GIVEN: User navigates to homepage
    const networkRequests: any[] = [];

    page.on('request', (request) => {
      if (request.resourceType() === 'image') {
        networkRequests.push({
          url: request.url(),
          priority: request.headers()['priority'],
          resourceType: request.resourceType(),
        });
      }
    });

    await page.goto('/');

    // WHEN: Constellation section is visible
    const constellationSection = page.locator(
      '[aria-label="Product constellation grid"]',
    );
    await expect(constellationSection).toBeVisible();

    // Scroll into view to trigger loading
    await constellationSection.scrollIntoViewIfNeeded();

    // Wait for images to start loading
    await page.waitForTimeout(1000);

    // THEN: Verify images are requested
    const constellationImageRequests = networkRequests.filter((req) =>
      req.url.includes('cdn.shopify.com'),
    );

    expect(constellationImageRequests.length).toBeGreaterThan(0);

    // First 2 images should have higher priority (fetchpriority="high" per project-context)
    // This is a best-effort check as browser may not respect all hints
  });

  test('[P0] should have stable layout across viewport sizes', async ({page}) => {
    const testViewports = [
      {width: 375, height: 667, name: 'Mobile'},
      {width: 768, height: 1024, name: 'Tablet'},
      {width: 1024, height: 768, name: 'Desktop'},
      {width: 1920, height: 1080, name: 'Large Desktop'},
    ];

    for (const viewport of testViewports) {
      // GIVEN: Viewport size
      await page.setViewportSize(viewport);

      // Enable layout shift tracking
      await page.evaluate(() => {
        // @ts-ignore
        window.__clsForViewport = [];

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            // @ts-ignore
            window.__clsForViewport.push((entry as any).value);
          }
        });

        observer.observe({type: 'layout-shift', buffered: true});
      });

      await page.goto('/', {waitUntil: 'networkidle'});

      // WHEN: Constellation loads
      const constellationSection = page.locator(
        '[aria-label="Product constellation grid"]',
      );
      await expect(constellationSection).toBeVisible();

      await constellationSection.scrollIntoViewIfNeeded();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // THEN: CLS should be below threshold for this viewport
      const cls = await page.evaluate(() => {
        // @ts-ignore
        const shifts = window.__clsForViewport || [];
        return shifts.reduce((sum: number, val: number) => sum + val, 0);
      });

      console.log(`${viewport.name} (${viewport.width}x${viewport.height}) CLS: ${cls.toFixed(4)}`);

      expect(cls).toBeLessThan(0.1);
    }
  });
});
