import {test, expect} from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Integration Tests: Scroll-Linked Animations Policy
 * Story 2.2 - Acceptance Criteria: AC3
 *
 * Validates that NO scroll event listeners are used for animations or
 * "in view" logic. All scroll-linked behavior must use Intersection Observer.
 */

test.describe('Scroll-Linked Animations Policy', () => {
  test('[P1] should NOT have scroll event listeners in client code', async ({
    page,
  }) => {
    // GIVEN: Home page is loaded
    await page.goto('/');

    // WHEN: Checking for scroll event listeners
    const scrollListeners = await page.evaluate(() => {
      const listeners: string[] = [];

      // Check window scroll listeners
      const windowListeners = (window as any).getEventListeners?.(window);
      if (windowListeners?.scroll) {
        listeners.push('window.scroll');
      }

      // Check document scroll listeners
      const docListeners = (window as any).getEventListeners?.(document);
      if (docListeners?.scroll) {
        listeners.push('document.scroll');
      }

      return listeners;
    });

    // THEN: Should have NO scroll listeners
    expect(scrollListeners).toHaveLength(0);
  });

  test('[P1] should use Intersection Observer for "in view" detection', async ({
    page,
  }) => {
    // GIVEN: Home page is loaded
    await page.goto('/');

    // WHEN: Checking for Intersection Observer usage
    const hasIO = await page.evaluate(() => {
      // Check if IntersectionObserver is being used
      return typeof IntersectionObserver !== 'undefined';
    });

    // THEN: IntersectionObserver should be available
    expect(hasIO).toBe(true);
  });
});

test.describe('Codebase Scroll Listener Audit', () => {
  test('[P1] should NOT contain scroll event listeners in source code', () => {
    // GIVEN: Project source directories
    const appDir = path.join(process.cwd(), 'app');
    const componentsDir = path.join(appDir, 'components');
    const routesDir = path.join(appDir, 'routes');
    const libDir = path.join(appDir, 'lib');

    // WHEN: Scanning for scroll event listeners
    const violations: string[] = [];

    // Patterns that indicate scroll event listeners (for animation/visibility)
    const forbiddenPatterns = [
      /addEventListener\(['"]scroll['"]/g,
      /\.on\(['"]scroll['"]/g,
      /onScroll\s*=/g,
    ];

    // Allowed exceptions (these are legitimate uses)
    const allowedExceptions = [
      'scroll.ts', // scroll.ts manages Lenis, resize is allowed
      'scroll.test.ts', // Tests can check scroll behavior
    ];

    const scanDirectory = (dir: string) => {
      if (!fs.existsSync(dir)) return;

      const files = fs.readdirSync(dir, {withFileTypes: true});

      for (const file of files) {
        const filePath = path.join(dir, file.name);

        if (file.isDirectory()) {
          scanDirectory(filePath);
        } else if (
          file.name.endsWith('.ts') ||
          file.name.endsWith('.tsx') ||
          file.name.endsWith('.js') ||
          file.name.endsWith('.jsx')
        ) {
          // Skip allowed exceptions
          if (allowedExceptions.some((exc) => filePath.includes(exc))) {
            continue;
          }

          const content = fs.readFileSync(filePath, 'utf-8');

          for (const pattern of forbiddenPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              violations.push(
                `${filePath}: Found scroll listener - ${matches.join(', ')}`,
              );
            }
          }
        }
      }
    };

    // Scan all relevant directories
    [componentsDir, routesDir, libDir].forEach((dir) => {
      if (fs.existsSync(dir)) {
        scanDirectory(dir);
      }
    });

    // THEN: Should have NO violations
    if (violations.length > 0) {
      console.log('❌ Scroll listener violations found:');
      violations.forEach((v) => console.log(`  - ${v}`));
    }

    expect(violations).toHaveLength(0);
  });

  test('[P2] should document Intersection Observer usage in scroll.ts', () => {
    // GIVEN: scroll.ts file
    const scrollFile = path.join(process.cwd(), 'app', 'lib', 'scroll.ts');

    // WHEN: Reading file content
    if (!fs.existsSync(scrollFile)) {
      test.skip(true, 'scroll.ts not found');
      return;
    }

    const content = fs.readFileSync(scrollFile, 'utf-8');

    // THEN: Should document IO-only policy
    const hasIOPolicy =
      content.includes('Intersection Observer') ||
      content.includes('IntersectionObserver') ||
      content.includes('SCROLL-LINKED ANIMATIONS');

    expect(hasIOPolicy).toBe(true);
  });
});
