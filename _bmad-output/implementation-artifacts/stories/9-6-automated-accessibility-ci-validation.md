# Story 9.6: Automated Accessibility CI Validation

Status: ready-for-dev

## Story

As a **developer**,
I want **automated accessibility checks in CI**,
so that **future changes don't introduce accessibility regressions**.

## Acceptance Criteria

1. **Given** the accessibility audits are complete
   **When** the CI pipeline runs
   **Then** axe-core runs on key pages:
   - Home page (landing, constellation, reveals)
   - About page
   - Contact page
   - Wholesale login and dashboard
   - Cart drawer (when open)
   - CI fails if any critical/serious axe violations are found
   - Results are reported in PR comments
   - Baseline is established for acceptable issues (if any)
   - Playwright accessibility tests exist for key flows

## Tasks / Subtasks

- [ ] Task 1: Install and configure axe-core for Playwright (AC: 1)
  - [ ] Install `@axe-core/playwright` package
  - [ ] Create axe helper utilities for tests
  - [ ] Configure axe rules and severity levels
  - [ ] Set up baseline configuration

- [ ] Task 2: Create accessibility tests for B2C pages (AC: 1)
  - [ ] Test home page accessibility
  - [ ] Test product texture reveal accessibility
  - [ ] Test cart drawer accessibility
  - [ ] Test about page accessibility
  - [ ] Test contact page accessibility

- [ ] Task 3: Create accessibility tests for B2B pages (AC: 1)
  - [ ] Test wholesale login page accessibility
  - [ ] Test wholesale dashboard accessibility
  - [ ] Test order history accessibility
  - [ ] Test authenticated B2B flows

- [ ] Task 4: Integrate accessibility tests into CI pipeline (AC: 1)
  - [ ] Add accessibility test job to GitHub Actions
  - [ ] Configure test to run on all PRs
  - [ ] Set up failure thresholds (critical/serious violations)
  - [ ] Configure test artifacts for reports

- [ ] Task 5: Set up PR comment reporting (AC: 1)
  - [ ] Install GitHub Actions for PR comments
  - [ ] Generate accessibility test report
  - [ ] Post summary to PR comments
  - [ ] Include violation details and recommendations

- [ ] Task 6: Establish accessibility baseline (AC: 1)
  - [ ] Run full accessibility audit across all pages
  - [ ] Document known acceptable violations (if any)
  - [ ] Create baseline configuration file
  - [ ] Define severity thresholds (critical, serious, moderate, minor)

- [ ] Task 7: Create accessibility testing documentation (AC: 1)
  - [ ] Document how to run accessibility tests locally
  - [ ] Create guide for fixing common violations
  - [ ] Add accessibility testing to developer onboarding
  - [ ] Document CI integration and workflow

## Dev Notes

### Architecture Compliance

**Testing Framework:**
- Project uses Playwright for E2E testing
- axe-core integration via `@axe-core/playwright`
- Tests co-located in `/tests/e2e/` directory
- CI pipeline uses GitHub Actions

**Installation:**
```bash
pnpm add -D @axe-core/playwright axe-core
```

**axe-core Configuration:**
```typescript
// tests/helpers/axe-config.ts
import type { RunOptions } from 'axe-core';

export const axeConfig: RunOptions = {
  rules: {
    // Disable rules that don't apply
    'color-contrast': { enabled: true },
    'image-alt': { enabled: true },
    'label': { enabled: true },
    'button-name': { enabled: true },
    'link-name': { enabled: true },
    'aria-allowed-attr': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    'heading-order': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'landmark-one-main': { enabled: true },
  },
};

export const axeTags = [
  'wcag2a',      // WCAG 2.0 Level A
  'wcag2aa',     // WCAG 2.0 Level AA
  'wcag21aa',    // WCAG 2.1 Level AA (our target)
  'best-practice', // Industry best practices
];
```

**Test Helper Utility:**
```typescript
// tests/helpers/accessibility.ts
import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { axeConfig, axeTags } from './axe-config';

export async function checkA11y(
  page: Page,
  selector?: string,
  options?: {
    includedImpacts?: ('critical' | 'serious' | 'moderate' | 'minor')[];
    excludedRules?: string[];
  }
) {
  const { includedImpacts = ['critical', 'serious'], excludedRules = [] } = options || {};

  const builder = new AxeBuilder({ page })
    .withTags(axeTags)
    .options(axeConfig);

  if (selector) {
    builder.include(selector);
  }

  if (excludedRules.length > 0) {
    builder.disableRules(excludedRules);
  }

  const results = await builder.analyze();

  // Filter by impact level
  const violations = results.violations.filter(violation =>
    includedImpacts.includes(violation.impact as any)
  );

  if (violations.length > 0) {
    console.error('Accessibility violations:', JSON.stringify(violations, null, 2));
  }

  return { violations, results };
}

export function formatViolations(violations: any[]) {
  return violations.map(violation => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.length,
  }));
}
```

**Test Implementation Pattern:**
```typescript
// tests/e2e/accessibility/home.spec.ts
import { test, expect } from '@playwright/test';
import { checkA11y, formatViolations } from '../helpers/accessibility';

test.describe('Accessibility - Home Page', () => {
  test('should have no critical or serious violations', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    const { violations } = await checkA11y(page);

    if (violations.length > 0) {
      console.error('Violations found:', formatViolations(violations));
    }

    expect(violations).toHaveLength(0);
  });

  test('texture reveal modal accessibility', async ({ page }) => {
    await page.goto('/');

    // Open texture reveal
    await page.click('[data-testid="product-card"]');
    await page.waitForSelector('[data-testid="texture-reveal"]', { state: 'visible' });

    // Check accessibility of modal
    const { violations } = await checkA11y(page, '[data-testid="texture-reveal"]');

    expect(violations).toHaveLength(0);
  });

  test('cart drawer accessibility', async ({ page }) => {
    await page.goto('/');

    // Open cart drawer
    await page.click('[data-testid="cart-icon"]');
    await page.waitForSelector('[data-testid="cart-drawer"]', { state: 'visible' });

    // Check accessibility of drawer
    const { violations } = await checkA11y(page, '[data-testid="cart-drawer"]');

    expect(violations).toHaveLength(0);
  });
});
```

**Test Coverage for All Pages:**
```typescript
// tests/e2e/accessibility/site-wide.spec.ts
import { test, expect } from '@playwright/test';
import { checkA11y } from '../helpers/accessibility';

const pages = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/wholesale', name: 'Wholesale Login' },
];

for (const { path, name } of pages) {
  test(`${name} page accessibility`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    const { violations } = await checkA11y(page);

    if (violations.length > 0) {
      console.error(`${name} violations:`, formatViolations(violations));
    }

    expect(violations).toHaveLength(0);
  });
}
```

**Authenticated B2B Tests:**
```typescript
// tests/e2e/accessibility/wholesale.spec.ts
import { test, expect } from '@playwright/test';
import { checkA11y } from '../helpers/accessibility';

test.describe('Accessibility - Wholesale Portal', () => {
  test.use({ storageState: 'tests/fixtures/b2b-auth.json' }); // Pre-authenticated

  test('wholesale dashboard accessibility', async ({ page }) => {
    await page.goto('/wholesale');
    await page.waitForLoadState('networkidle');

    const { violations } = await checkA11y(page);

    expect(violations).toHaveLength(0);
  });

  test('order history accessibility', async ({ page }) => {
    await page.goto('/wholesale/orders');
    await page.waitForLoadState('networkidle');

    const { violations } = await checkA11y(page);

    expect(violations).toHaveLength(0);
  });
});
```

### CI Pipeline Integration

**GitHub Actions Workflow:**
```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Run accessibility tests
        run: pnpm test:a11y
        continue-on-error: true
        id: a11y-tests

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: accessibility-report
          path: playwright-report/

      - name: Comment PR with results
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const path = 'playwright-report/index.html';

            if (fs.existsSync(path)) {
              const report = fs.readFileSync(path, 'utf8');
              // Parse report and extract summary
              // Post to PR comment
            }

      - name: Fail if critical violations found
        if: steps.a11y-tests.outcome == 'failure'
        run: exit 1
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "test:a11y": "playwright test tests/e2e/accessibility/",
    "test:a11y:ui": "playwright test tests/e2e/accessibility/ --ui",
    "test:a11y:report": "playwright show-report"
  }
}
```

### Baseline Configuration

**Baseline File:**
```typescript
// tests/accessibility-baseline.ts
export const accessibilityBaseline = {
  // Known violations that are accepted (should be empty for new projects)
  knownViolations: [],

  // Severity thresholds
  thresholds: {
    critical: 0,  // Block on any critical violations
    serious: 0,   // Block on any serious violations
    moderate: 5,  // Allow up to 5 moderate violations (warning only)
    minor: 10,    // Allow up to 10 minor violations (warning only)
  },

  // Rules to disable globally (with justification)
  disabledRules: [
    // Example: 'color-contrast' if using images with variable backgrounds
    // Justification: Product images have variable colors, text overlay tested manually
  ],

  // Pages exempt from certain rules
  exemptions: {
    // Example:
    // '/wholesale/legacy-page': ['heading-order'],
  },
};
```

**Using Baseline in Tests:**
```typescript
// tests/e2e/accessibility/with-baseline.spec.ts
import { test, expect } from '@playwright/test';
import { checkA11y } from '../helpers/accessibility';
import { accessibilityBaseline } from '../../accessibility-baseline';

test('home page with baseline', async ({ page }) => {
  await page.goto('/');

  const { violations } = await checkA11y(page, undefined, {
    excludedRules: accessibilityBaseline.disabledRules,
  });

  const critical = violations.filter(v => v.impact === 'critical');
  const serious = violations.filter(v => v.impact === 'serious');
  const moderate = violations.filter(v => v.impact === 'moderate');
  const minor = violations.filter(v => v.impact === 'minor');

  expect(critical.length).toBeLessThanOrEqual(accessibilityBaseline.thresholds.critical);
  expect(serious.length).toBeLessThanOrEqual(accessibilityBaseline.thresholds.serious);

  // Warnings for moderate/minor
  if (moderate.length > accessibilityBaseline.thresholds.moderate) {
    console.warn('Moderate violations exceed threshold:', moderate.length);
  }
});
```

### PR Comment Reporting

**GitHub Action for PR Comments:**
```yaml
# In .github/workflows/accessibility.yml

- name: Generate accessibility report
  if: always()
  run: |
    node scripts/generate-a11y-report.js > a11y-summary.md

- name: Comment PR with accessibility results
  if: github.event_name == 'pull_request' && always()
  uses: marocchino/sticky-pull-request-comment@v2
  with:
    header: accessibility-report
    path: a11y-summary.md
```

**Report Generator Script:**
```typescript
// scripts/generate-a11y-report.js
const fs = require('fs');
const path = require('path');

const reportPath = 'playwright-report/results.json';

if (!fs.existsSync(reportPath)) {
  console.log('No accessibility test results found.');
  process.exit(0);
}

const results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

const violations = results.violations || [];
const passed = results.passed || 0;
const failed = results.failed || 0;

const critical = violations.filter(v => v.impact === 'critical');
const serious = violations.filter(v => v.impact === 'serious');

let summary = '## Accessibility Test Results\n\n';
summary += `- ✅ Passed: ${passed}\n`;
summary += `- ❌ Failed: ${failed}\n\n`;

if (critical.length > 0) {
  summary += `### 🚨 Critical Violations (${critical.length})\n\n`;
  critical.forEach(v => {
    summary += `- **${v.id}**: ${v.description}\n`;
    summary += `  - Impact: ${v.impact}\n`;
    summary += `  - [Learn more](${v.helpUrl})\n\n`;
  });
}

if (serious.length > 0) {
  summary += `### ⚠️ Serious Violations (${serious.length})\n\n`;
  serious.forEach(v => {
    summary += `- **${v.id}**: ${v.description}\n`;
    summary += `  - Impact: ${v.impact}\n`;
    summary += `  - [Learn more](${v.helpUrl})\n\n`;
  });
}

if (critical.length === 0 && serious.length === 0) {
  summary += '### ✅ No critical or serious accessibility violations found!\n';
}

console.log(summary);
```

### Testing Requirements

**Local Testing:**
```bash
# Run all accessibility tests
pnpm test:a11y

# Run with UI mode
pnpm test:a11y:ui

# Run specific test file
pnpm playwright test tests/e2e/accessibility/home.spec.ts

# View test report
pnpm test:a11y:report
```

**Test Data Requirements:**
- Pre-authenticated B2B user state for wholesale tests
- Sample products with texture images
- Test cart with items for cart drawer tests

**Coverage Requirements:**
- All public pages (home, about, contact)
- All authenticated pages (wholesale dashboard, orders)
- All interactive components (modals, drawers)
- All form pages (login, contact)

### Project Structure Notes

**Files to Create:**
- `tests/e2e/accessibility/home.spec.ts` - Home page tests
- `tests/e2e/accessibility/about.spec.ts` - About page tests
- `tests/e2e/accessibility/contact.spec.ts` - Contact page tests
- `tests/e2e/accessibility/wholesale.spec.ts` - B2B portal tests
- `tests/e2e/accessibility/site-wide.spec.ts` - All pages tests
- `tests/helpers/accessibility.ts` - Test helper utilities
- `tests/helpers/axe-config.ts` - axe-core configuration
- `tests/accessibility-baseline.ts` - Baseline configuration
- `.github/workflows/accessibility.yml` - CI workflow
- `scripts/generate-a11y-report.js` - Report generator

**Files to Modify:**
- `package.json` - Add test scripts
- `playwright.config.ts` - Configure accessibility test project (if needed)

### References

- [Source: prd.md#Accessibility] NFR8: WCAG compliance - 2.1 AA
- [Source: prd.md#Quality Standards] Verification - axe-core in CI + manual screen reader testing
- [Source: architecture.md#Post-Init Setup Required] Add Playwright for visual regression testing
- [Source: epics.md#Epic 9 Story 9.6] Playwright accessibility tests exist for key flows

### Common axe-core Violations

**Violation: image-alt**
- **Issue:** Images missing alt text
- **Fix:** Add `alt` attribute to all `<img>` tags
- **Example:** `<img src="..." alt="Product name" />`

**Violation: label**
- **Issue:** Form inputs without labels
- **Fix:** Add `<label>` or `aria-label`
- **Example:** `<label htmlFor="email">Email</label><input id="email" />`

**Violation: color-contrast**
- **Issue:** Insufficient color contrast
- **Fix:** Adjust colors to meet 4.5:1 ratio
- **Tool:** Use Chrome DevTools color picker

**Violation: button-name**
- **Issue:** Buttons without accessible names
- **Fix:** Add text or `aria-label`
- **Example:** `<button aria-label="Close">×</button>`

**Violation: heading-order**
- **Issue:** Skipped heading levels (h1 → h3)
- **Fix:** Follow proper hierarchy (h1 → h2 → h3)

### Best Practices

**Run Tests Frequently:**
- Run accessibility tests on every PR
- Include in pre-commit hook (optional)
- Run full suite before releases

**Fix Violations Immediately:**
- Don't accumulate accessibility debt
- Fix critical/serious violations before merge
- Document any accepted violations

**Keep Baseline Updated:**
- Review baseline configuration quarterly
- Remove accepted violations as they're fixed
- Don't abuse exemptions

**Combine Automated + Manual Testing:**
- Automated tests catch ~30-40% of issues
- Manual testing (keyboard, screen reader) required
- Automated tests prevent regressions

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent_
