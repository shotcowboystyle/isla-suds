import {test, expect} from '@playwright/test';

/**
 * Performance Tests: Cumulative Layout Shift During Scroll
 * Story 2.2 - Acceptance Criteria: AC4
 *
 * Measures CLS while scrolling through the home page to ensure layout
 * stability during scroll interactions. Threshold: CLS < 0.1
 */

test.describe('Scroll CLS Performance', () => {
  test('[P0] should maintain CLS < 0.1 during desktop scroll', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport
    await page.setViewportSize({width: 1280, height: 1024});

    // Navigate and wait for page to be fully loaded
    await page.goto('/', {waitUntil: 'networkidle'});

    // WHEN: Scrolling through the page
    // Start performance measurement
    await page.evaluate(() => {
      // Reset any existing performance marks
      performance.clearMarks();
      performance.clearMeasures();
      performance.mark('scroll-start');
    });

    // Scroll down in increments to simulate user scrolling
    await page.evaluate(async () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollSteps = 5;
      const scrollIncrement = (scrollHeight - viewportHeight) / scrollSteps;

      for (let i = 0; i < scrollSteps; i++) {
        window.scrollTo({
          top: scrollIncrement * (i + 1),
          behavior: 'smooth',
        });
        // Wait for scroll to settle
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    });

    // End performance measurement
    await page.evaluate(() => {
      performance.mark('scroll-end');
      performance.measure('scroll-duration', 'scroll-start', 'scroll-end');
    });

    // THEN: Measure CLS during scroll
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });

        observer.observe({type: 'layout-shift', buffered: true});

        // Collect for a short period
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 100);
      });
    });

    console.log(`Desktop Scroll CLS: ${cls.toFixed(4)}`);

    // CLS should be less than 0.1 (Core Web Vital threshold)
    expect(cls).toBeLessThan(0.1);
  });

  test('[P0] should maintain CLS < 0.1 during mobile scroll', async ({
    page,
  }) => {
    // GIVEN: Mobile viewport
    await page.setViewportSize({width: 375, height: 667});

    // Navigate and wait for page to be fully loaded
    await page.goto('/', {waitUntil: 'networkidle'});

    // WHEN: Scrolling through the page (mobile)
    await page.evaluate(() => {
      performance.clearMarks();
      performance.clearMeasures();
      performance.mark('scroll-start');
    });

    // Scroll down (mobile native scroll with snap)
    await page.evaluate(async () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollSteps = 4;
      const scrollIncrement = (scrollHeight - viewportHeight) / scrollSteps;

      for (let i = 0; i < scrollSteps; i++) {
        window.scrollTo({
          top: scrollIncrement * (i + 1),
        });
        // Wait for snap to settle
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    });

    await page.evaluate(() => {
      performance.mark('scroll-end');
      performance.measure('scroll-duration', 'scroll-start', 'scroll-end');
    });

    // THEN: Measure CLS during mobile scroll
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });

        observer.observe({type: 'layout-shift', buffered: true});

        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 100);
      });
    });

    console.log(`Mobile Scroll CLS: ${cls.toFixed(4)}`);

    // CLS should be less than 0.1
    expect(cls).toBeLessThan(0.1);
  });

  test('[P1] should maintain CLS < 0.1 with async content loading', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport
    await page.setViewportSize({width: 1280, height: 1024});

    // Navigate but don't wait for full network idle (simulate async loading)
    await page.goto('/', {waitUntil: 'domcontentloaded'});

    // WHEN: Scrolling while content is still loading
    await page.evaluate(() => {
      performance.clearMarks();
      performance.clearMeasures();
      performance.mark('scroll-start');
    });

    // Start scrolling immediately (while async content may still be loading)
    await page.evaluate(async () => {
      window.scrollTo({top: 500, behavior: 'smooth'});
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    await page.evaluate(() => {
      performance.mark('scroll-end');
      performance.measure('scroll-duration', 'scroll-start', 'scroll-end');
    });

    // THEN: CLS should still be < 0.1 even with async loading
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });

        observer.observe({type: 'layout-shift', buffered: true});

        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 100);
      });
    });

    console.log(`Async Load Scroll CLS: ${cls.toFixed(4)}`);

    // Should maintain CLS < 0.1 even during async loading
    expect(cls).toBeLessThan(0.1);
  });

  test('[P2] should not introduce layout shift from Lenis initialization', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport
    await page.setViewportSize({width: 1280, height: 1024});

    // Start observing layout shifts BEFORE navigation
    const clsPromise = page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });

        observer.observe({type: 'layout-shift', buffered: true});

        // Observe during page load and Lenis init
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000); // Observe for 3 seconds after load
      });
    });

    // WHEN: Page loads with Lenis initialization
    await page.goto('/', {waitUntil: 'networkidle'});

    // Wait for Lenis to initialize
    const html = page.locator('html');
    await expect(html).toHaveClass(/lenis/, {timeout: 2000});

    // THEN: CLS from initial load + Lenis init should be < 0.1
    const cls = await clsPromise;

    console.log(`Lenis Init CLS: ${cls.toFixed(4)}`);

    expect(cls).toBeLessThan(0.1);
  });
});

test.describe('Scroll Performance Metrics', () => {
  test('[P2] should complete smooth scroll within reasonable time', async ({
    page,
  }) => {
    // GIVEN: Desktop viewport with Lenis
    await page.setViewportSize({width: 1280, height: 1024});
    await page.goto('/', {waitUntil: 'networkidle'});

    // Wait for Lenis
    const html = page.locator('html');
    await expect(html).toHaveClass(/lenis/);

    // WHEN: Measuring smooth scroll duration
    const scrollDuration = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const start = performance.now();

        window.scrollTo({top: 1000, behavior: 'smooth'});

        // Wait for scroll to complete
        const checkScroll = setInterval(() => {
          if (window.scrollY >= 950) {
            // Close enough to target
            clearInterval(checkScroll);
            const duration = performance.now() - start;
            resolve(duration);
          }
        }, 100);

        // Timeout after 3 seconds
        setTimeout(() => {
          clearInterval(checkScroll);
          resolve(3000);
        }, 3000);
      });
    });

    console.log(`Smooth scroll duration: ${scrollDuration.toFixed(0)}ms`);

    // THEN: Scroll should complete within 2 seconds
    expect(scrollDuration).toBeLessThan(2000);
  });
});
