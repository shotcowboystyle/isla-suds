import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Tests (AC5)
 *
 * Verifies WCAG 2.1 AA compliance using axe-core on key pages.
 * CI fails if critical/serious violations are found.
 */

const PAGES_TO_TEST = [
  {name: 'Home', path: '/'},
  {name: 'About', path: '/about'},
  {name: 'Contact', path: '/contact'},
  // Wholesale login not yet implemented (Epic 7, Story 7.3)
  // Will be added when /wholesale/login route is created
];

for (const page of PAGES_TO_TEST) {
  test(`${page.name} page should not have accessibility violations`, async ({
    page: playwrightPage,
  }) => {
    await playwrightPage.goto(page.path);

    // Wait for page to be fully loaded
    await playwrightPage.waitForLoadState('networkidle');

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({
      page: playwrightPage,
    })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Filter for critical and serious violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical',
    );
    const seriousViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'serious',
    );

    // Log violations for debugging
    if (criticalViolations.length > 0) {
      console.error(
        `\n❌ Critical accessibility violations on ${page.name}:`,
      );
      criticalViolations.forEach((violation) => {
        console.error(`  - ${violation.id}: ${violation.description}`);
        console.error(`    Impact: ${violation.impact}`);
        console.error(`    Help: ${violation.helpUrl}`);
        violation.nodes.forEach((node) => {
          console.error(`    Element: ${node.html}`);
        });
      });
    }

    if (seriousViolations.length > 0) {
      console.error(
        `\n⚠️  Serious accessibility violations on ${page.name}:`,
      );
      seriousViolations.forEach((violation) => {
        console.error(`  - ${violation.id}: ${violation.description}`);
        console.error(`    Impact: ${violation.impact}`);
        console.error(`    Help: ${violation.helpUrl}`);
        violation.nodes.forEach((node) => {
          console.error(`    Element: ${node.html}`);
        });
      });
    }

    // Fail if critical or serious violations found (AC5)
    expect(
      criticalViolations.length,
      `Found ${criticalViolations.length} critical accessibility violations on ${page.name}`,
    ).toBe(0);

    expect(
      seriousViolations.length,
      `Found ${seriousViolations.length} serious accessibility violations on ${page.name}`,
    ).toBe(0);

    // Log summary
    console.log(
      `\n✅ ${page.name} page passed accessibility checks`,
    );
    console.log(
      `   Violations: ${accessibilityScanResults.violations.length} (0 critical, 0 serious)`,
    );
  });
}

test('Accessibility scan should detect common issues', async ({page}) => {
  // This test verifies that our axe setup actually works
  // by creating intentional violations
  const htmlWithViolations = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Test Page</title>
    </head>
    <body>
      <!-- Missing alt text -->
      <img src="test.jpg">
      <!-- Low contrast text -->
      <div style="color: #aaa; background: #fff;">Low contrast text</div>
      <!-- Missing label -->
      <input type="text">
    </body>
    </html>
  `;

  await page.setContent(htmlWithViolations);

  const results = await new AxeBuilder({page}).analyze();

  // Should detect the violations we intentionally created
  expect(results.violations.length).toBeGreaterThan(0);
  console.log(
    '\n✅ Axe-core is properly configured and detecting violations',
  );
});
