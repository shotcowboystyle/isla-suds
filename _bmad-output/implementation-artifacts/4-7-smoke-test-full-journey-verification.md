# Story 4.7: Smoke Test - Full Journey Verification

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **QA engineer**,
I want **to verify the complete B2C scroll journey works across devices**,
So that **we catch any integration issues before moving to cart functionality**.

## Acceptance Criteria

### AC1: Hero loads with LCP <2.5s

**Given** I visit the home page on a clean browser
**When** the page loads
**Then** Largest Contentful Paint (LCP) completes in <2.5 seconds
**And** hero section is fully visible with brand logo and tagline
**And** no render-blocking resources delay initial paint
**And** LCP metric passes Lighthouse Core Web Vitals threshold
**And** test runs on iPhone SE (375px), Pixel 7 (412px), and Desktop (1440px)

**FRs addressed:** NFR1, FR41

---

### AC2: Constellation displays all 4 products

**Given** I scroll past the hero section
**When** the constellation layout comes into view
**Then** all 4 product cards are visible on screen
**And** products are positioned in constellation (non-linear) layout
**And** each product card shows:
- Product image (not broken)
- Product name
- Product price
**And** no layout shift occurs (CLS <0.1)
**And** constellation renders correctly on mobile (375px), tablet (768px), and desktop (1440px)

**FRs addressed:** FR1, FR2, NFR3

---

### AC3: Texture reveal triggers <100ms

**Given** I see the constellation layout
**When** I hover over a product card (desktop) OR tap a product card (mobile)
**Then** texture reveal animation starts within 100ms
**And** macro texture image loads instantly (preloaded via Intersection Observer)
**And** scent narrative copy is visible
**And** product information (name, price, description) is visible
**And** no network requests occur during reveal (image already cached)
**And** Performance API measures reveal timing <100ms at p95
**And** reduced motion preference skips animation, shows static reveal

**FRs addressed:** FR3, FR4, FR5, FR10, NFR4, NFR13

---

### AC4: Story fragments appear on scroll

**Given** I continue scrolling down the page
**When** story fragments enter the viewport
**Then** story fragments are visible during scroll
**And** fragments display warm, inviting copy (from `app/content/story.ts`)
**And** fragments fade in smoothly (Framer Motion or CSS animation)
**And** scroll experience is smooth (Lenis on desktop, native on mobile)
**And** no console errors or accessibility violations

**FRs addressed:** FR7, NFR21

---

### AC5: Collection prompt appears after 2+ products

**Given** I have explored 2 or more products (triggered texture reveals)
**When** I scroll to the collection prompt trigger point
**Then** collection prompt is visible
**And** prompt displays "Get the Collection" or similar CTA
**And** variety pack bundle is mentioned (all 4 soaps value proposition)
**And** Zustand exploration store tracks `productsExplored >= 2`
**And** prompt does NOT appear if <2 products explored
**And** prompt is accessible via keyboard (Tab to CTA button, Enter to activate)

**FRs addressed:** FR8, FR9, FR12

---

### AC6: Footer navigation works

**Given** I scroll to the bottom of the page
**When** the footer is visible
**Then** footer displays navigation links:
- Home, About, Contact, Wholesale
- Privacy Policy, Terms of Service
**And** clicking any footer link navigates to correct page
**And** footer uses design token colors (--text-primary, --accent-primary on hover)
**And** footer is keyboard-accessible (Tab through links, Enter to activate)
**And** footer social media placeholder icons are visible

**FRs addressed:** FR48, FR47

---

### AC7: No console errors or accessibility violations

**Given** the complete B2C journey is tested
**When** I run the smoke test suite
**Then** browser console has zero errors (no JS errors, no failed network requests)
**And** axe-core accessibility audit passes with zero violations
**And** Lighthouse accessibility score >= 90
**And** all interactive elements are keyboard-accessible
**And** all images have alt text
**And** ARIA labels are correct for screen readers
**And** color contrast meets WCAG 2.1 AA (4.5:1 for text)

**FRs addressed:** NFR8, NFR9, NFR10, NFR11, NFR12, NFR14

---

### AC8: Tests pass on multiple devices

**Given** the smoke test suite is complete
**When** I run tests on all supported devices
**Then** all tests pass on:
- **iPhone SE (375px)** — smallest supported mobile device
- **Pixel 7 (412px)** — common Android device
- **Desktop (1440px)** — standard desktop viewport
**And** layout is responsive and readable on all viewports
**And** touch targets meet 44x44px minimum on mobile (NFR14)
**And** hover states work on desktop
**And** tap states work on mobile

**FRs addressed:** NFR14

---

### AC9: Tests run in Playwright CI pipeline

**Given** the smoke test suite is implemented
**When** I push code to feature branch
**Then** GitHub Actions CI pipeline runs smoke tests automatically
**And** tests run in headless Chromium (desktop + mobile viewports)
**And** test results are visible in GitHub Actions output
**And** PR is blocked if smoke tests fail
**And** Lighthouse CI runs and enforces Core Web Vitals thresholds

**FRs addressed:** NFR1-7

---

## Tasks / Subtasks

- [x] **Task 1: Set up Playwright smoke test file** (AC9)
  - [x] Create `tests/smoke/full-journey.spec.ts`
  - [x] Configure Playwright for multi-device testing (iPhone SE, Pixel 7, Desktop)
  - [x] Import necessary Playwright utilities (`test`, `expect`, `devices`)
  - [x] Set up page fixtures for each device viewport

- [x] **Task 2: Implement LCP performance test** (AC1)
  - [ ] Navigate to home page (`/`)
  - [ ] Wait for LCP metric using Performance API
  - [ ] Assert LCP <2.5 seconds
  - [ ] Verify hero section visible (`data-testid="hero-section"` or `h1` with brand name)
  - [ ] Test on all 3 devices (iPhone SE, Pixel 7, Desktop)

- [x] **Task 3: Implement constellation display test** (AC2)
  - [ ] Scroll to constellation layout section
  - [ ] Count visible product cards (should be 4)
  - [ ] Verify each card has image, name, price
  - [ ] Check layout positions (non-linear constellation, not grid)
  - [ ] Assert CLS <0.1 using Performance API
  - [ ] Test responsive layout on all 3 devices

- [x] **Task 4: Implement texture reveal timing test** (AC3)
  - [ ] Locate first product card
  - [ ] Trigger texture reveal (hover on desktop, tap on mobile)
  - [ ] Measure time from interaction to reveal start using Performance API marks
  - [ ] Assert reveal timing <100ms at p95
  - [ ] Verify macro texture image loaded (no broken images)
  - [ ] Verify scent narrative copy visible
  - [ ] Verify product information visible (name, price, description)
  - [ ] Check no network requests during reveal (image preloaded)
  - [ ] Test reduced motion preference (static reveal, no animation)

- [x] **Task 5: Implement story fragments scroll test** (AC4)
  - [ ] Scroll to story fragments section
  - [ ] Verify story fragments visible (check for `data-testid="story-fragment"` or similar)
  - [ ] Verify copy is warm and inviting (matches `app/content/story.ts`)
  - [ ] Check fade-in animation (if Framer Motion loaded)
  - [ ] Verify smooth scroll (Lenis on desktop >= 1024px, native on mobile)
  - [ ] Assert no console errors during scroll

- [x] **Task 6: Implement collection prompt test** (AC5)
  - [ ] Trigger texture reveals on 2+ products (hover/tap)
  - [ ] Scroll to collection prompt trigger point
  - [ ] Verify collection prompt visible
  - [ ] Verify CTA text ("Get the Collection" or similar)
  - [ ] Verify variety pack mention (all 4 soaps)
  - [ ] Check Zustand store: `productsExplored >= 2` (optional, may need test harness)
  - [ ] Test that prompt does NOT appear if <2 products explored
  - [ ] Test keyboard accessibility (Tab to CTA, Enter to activate)

- [x] **Task 7: Implement footer navigation test** (AC6)
  - [ ] Scroll to footer
  - [ ] Verify footer links present: Home, About, Contact, Wholesale, Privacy Policy, Terms
  - [ ] Click each link and verify navigation works
  - [ ] Verify design token colors applied (check computed styles)
  - [ ] Test keyboard accessibility (Tab through links, Enter to navigate)
  - [ ] Verify social media placeholder icons visible

- [x] **Task 8: Implement console error and accessibility audit** (AC7)
  - [ ] Capture console errors during test run (Playwright `page.on('console')`)
  - [ ] Assert zero console errors (filter out warnings if needed)
  - [ ] Run axe-core accessibility audit using `@axe-core/playwright`
  - [ ] Assert zero accessibility violations
  - [ ] (Optional) Run Lighthouse accessibility audit, assert score >= 90
  - [ ] Verify keyboard navigation works for all interactive elements
  - [ ] Verify images have alt text
  - [ ] Verify color contrast meets WCAG 2.1 AA (4.5:1)

- [x] **Task 9: Configure CI pipeline for smoke tests** (AC9)
  - [ ] Verify `.github/workflows/ci.yml` includes Playwright smoke tests
  - [ ] Ensure tests run on every PR
  - [ ] Configure headless Chromium with mobile + desktop viewports
  - [ ] Verify test results are visible in GitHub Actions output
  - [ ] Ensure PR is blocked if tests fail
  - [ ] Verify Lighthouse CI runs and enforces Core Web Vitals

- [x] **Task 10: Document smoke test coverage and results** (Post-implementation)
  - [ ] Document test coverage in story file (Dev Completion Notes)
  - [ ] Note any edge cases discovered during testing
  - [ ] Document any performance bottlenecks found
  - [ ] Document any accessibility issues fixed
  - [ ] Update sprint-status.yaml to mark story as `done`

---

## Dev Notes

### Why this story matters

Story 4.7 is a **critical validation gate** before Epic 5 (Cart Experience). This smoke test suite verifies that the complete B2C scroll journey—hero, constellation, texture reveals, story fragments, collection prompt, and footer—works flawlessly across devices.

This is critical for:

- **Quality assurance**: Catches integration issues before cart functionality is added
- **Performance validation**: Ensures Core Web Vitals (LCP, FID, CLS) meet NFR thresholds
- **Accessibility compliance**: Verifies WCAG 2.1 AA compliance before cart/checkout
- **Multi-device support**: Confirms responsive layout works on smallest (iPhone SE 375px) to largest (Desktop 1440px+) viewports
- **Regression prevention**: Establishes baseline smoke tests to catch future regressions in CI
- **Epic closure confidence**: Validates Epic 4 is complete and ready for next phase

**This is NOT an optional story.** Without comprehensive smoke tests, cart functionality in Epic 5 will be built on an untested foundation.

---

### Guardrails (developer do/don't list)

**DO:**
- **DO** create `tests/smoke/full-journey.spec.ts` for smoke tests
- **DO** test on all 3 devices: iPhone SE (375px), Pixel 7 (412px), Desktop (1440px)
- **DO** use Performance API to measure LCP, CLS, texture reveal timing
- **DO** use axe-core for accessibility audits (`@axe-core/playwright`)
- **DO** capture console errors with Playwright `page.on('console')`
- **DO** verify texture reveal <100ms at p95 (NFR4 non-negotiable)
- **DO** verify LCP <2.5s, FID <100ms, CLS <0.1 (NFR1-3 non-negotiable)
- **DO** test reduced motion preference (`prefers-reduced-motion: reduce`)
- **DO** verify Intersection Observer preloads images before texture reveal
- **DO** test Zustand exploration store tracking (`productsExplored >= 2`)
- **DO** verify Lenis smooth scroll on desktop (>= 1024px), native on mobile
- **DO** test keyboard navigation for all interactive elements
- **DO** verify footer links work (Home, About, Contact, Wholesale, Privacy, Terms)
- **DO** run tests in CI pipeline (GitHub Actions, headless Chromium)
- **DO** block PR if smoke tests fail (enforce quality gate)
- **DO** document any performance bottlenecks or accessibility issues found

**DO NOT:**
- **DO NOT** skip any device viewport (iPhone SE, Pixel 7, Desktop all required)
- **DO NOT** skip performance metrics (LCP, CLS, texture reveal timing are non-negotiable)
- **DO NOT** skip accessibility audit (axe-core required, zero violations expected)
- **DO NOT** allow console errors in production code (zero tolerance)
- **DO NOT** skip reduced motion testing (NFR13 accessibility requirement)
- **DO NOT** skip keyboard navigation testing (NFR9 required)
- **DO NOT** hardcode timing thresholds (use NFR values: LCP <2.5s, texture <100ms, etc.)
- **DO NOT** skip CI integration (smoke tests must run on every PR)
- **DO NOT** allow flaky tests (all tests must be deterministic)
- **DO NOT** skip footer navigation testing (FR48, FR47 must be verified)
- **DO NOT** allow image preloading failures (texture reveal depends on Intersection Observer)
- **DO NOT** skip collection prompt conditional logic (<2 products = no prompt)

---

### Architecture compliance

| Decision Area | Compliance Notes |
|---------------|------------------|
| Test location | `tests/smoke/full-journey.spec.ts` (smoke tests separate from unit/integration) |
| Test framework | Playwright (configured in `playwright.config.ts` from Story 1.10) |
| Device testing | iPhone SE (375px), Pixel 7 (412px), Desktop (1440px) as per NFR requirements |
| Performance API | Use `performance.mark()` and `performance.measure()` for timing |
| Accessibility | axe-core via `@axe-core/playwright`, WCAG 2.1 AA compliance (NFR8-14) |
| Core Web Vitals | LCP <2.5s (NFR1), FID <100ms (NFR2), CLS <0.1 (NFR3) |
| Texture reveal | <100ms response time (NFR4), Intersection Observer preloading required |
| Bundle budget | <200KB gzipped (NFR6), verified in CI (Story 1.10) |
| CI pipeline | GitHub Actions `.github/workflows/ci.yml`, smoke tests on every PR |
| Smoke vs E2E | Smoke tests verify critical paths quickly (<5 min), E2E tests are comprehensive but slower |

**Key architectural references:**

- `_bmad-output/planning-artifacts/architecture.md` — Performance requirements (NFR1-7), accessibility (NFR8-14), testing strategy
- `_bmad-output/project-context.md` — Performance instrumentation, accessibility gotchas, testing boundaries
- `_bmad-output/planning-artifacts/prd.md` — Functional requirements (FR1-FR9, FR41-FR48), Core Web Vitals
- `_bmad-output/planning-artifacts/epics.md` — Epic 4 Story 4.7, smoke test requirements
- `playwright.config.ts` — Playwright configuration (devices, browsers, CI integration from Story 1.10)
- `.github/workflows/ci.yml` — CI pipeline (Lighthouse CI, quality gates from Story 1.10)

---

### Previous story intelligence (Story 4.6 - Wholesale Link)

**Story 4.6 (Add Wholesale Portal Link in Header/Footer):**

- **Completed**: Wholesale link added to Header mobile menu (FALLBACK_HEADER_MENU)
- **Completed**: Footer wholesale link verified (already existed from Story 4.5)
- **Pattern established**: Comprehensive testing approach (unit + integration + accessibility)
- **Pattern established**: Design token compliance (`--text-primary`, `--accent-primary`, `--text-muted`)
- **Pattern established**: Keyboard accessibility with focus indicators
- **Pattern established**: Mobile menu close behavior (`onClick={close}` from useAside)
- **Code review applied**: Fixed missing close() behavior tests, design token validation tests

**Key Lessons for Story 4.7:**

- **Epic 4 is COMPLETE** except for this smoke test story
- **All Epic 4 features are implemented** (hero, constellation, texture reveals, story fragments, collection prompt, footer, wholesale link)
- **Smoke test verifies integration** of all Story 4.1-4.6 features
- **Test patterns from previous stories** should guide smoke test structure
- **Footer + Header wholesale links** must be tested (Story 4.5 + 4.6)
- **Comprehensive testing approach** is expected (27 tests for Footer, 20 for Header)
- **Design token compliance** should be verified in smoke tests (visual consistency)
- **Keyboard accessibility** must be tested across all interactive elements

---

### Technical requirements (dev agent guardrails)

| Requirement | Detail |
|-------------|--------|
| Test file | `tests/smoke/full-journey.spec.ts` |
| Playwright config | `playwright.config.ts` (already configured in Story 1.10) |
| Devices | iPhone SE (375px), Pixel 7 (412px), Desktop (1440px) |
| Performance API | `performance.mark('texture-reveal-start')`, `performance.measure()` |
| Accessibility | `@axe-core/playwright` for axe-core audit |
| Console errors | Capture via `page.on('console', (msg) => ...)` |
| Core Web Vitals | LCP <2.5s, FID <100ms, CLS <0.1 (measured via Performance API or Lighthouse) |
| Texture reveal | <100ms p95 (use `performance.getEntriesByName('texture-reveal')`) |
| CI integration | `.github/workflows/ci.yml` runs Playwright smoke tests on every PR |
| Lighthouse CI | `.github/workflows/ci.yml` runs Lighthouse CI with Core Web Vitals thresholds |

---

### Project structure notes

**Primary implementation files (expected):**

- `tests/smoke/full-journey.spec.ts` — Main smoke test file (NEW, this story)
- `playwright.config.ts` — Playwright configuration (verify devices configured from Story 1.10)
- `.github/workflows/ci.yml` — CI pipeline (verify smoke tests run on PR)

**Supporting files that may need verification:**

- `app/components/Hero.tsx` — Hero section (LCP test target)
- `app/components/ConstellationGrid.tsx` — Constellation layout (4 products test)
- `app/components/TextureReveal.tsx` — Texture reveal (timing test target)
- `app/components/StoryFragment.tsx` — Story fragments (scroll test)
- `app/components/CollectionPrompt.tsx` — Collection prompt (2+ products test)
- `app/components/Footer.tsx` — Footer navigation (links test)
- `app/components/Header.tsx` — Header mobile menu (wholesale link test)
- `app/stores/exploration.ts` — Zustand exploration store (productsExplored tracking)

**Files that already exist (reference):**

- `playwright.config.ts` — Playwright config (Story 1.10)
- `.github/workflows/ci.yml` — CI pipeline (Story 1.10)
- `tests/unit/*` — Unit tests for individual components (Stories 1.1-4.6)
- `tests/integration/*` — Integration tests (if any from previous stories)
- `tests/e2e/*` — E2E tests (placeholder from Story 1.10)

---

### Performance instrumentation requirements

**Texture Reveal Timing (NFR4 - <100ms):**

```typescript
// In app/components/TextureReveal.tsx (should already exist from Story 3.2)
const handleReveal = () => {
  performance.mark('texture-reveal-start');
  // ... reveal animation
  performance.mark('texture-reveal-end');
  performance.measure('texture-reveal', 'texture-reveal-start', 'texture-reveal-end');
};
```

**Smoke test verifies this timing:**

```typescript
// tests/smoke/full-journey.spec.ts
await page.hover('[data-testid="product-card"]');
const timings = await page.evaluate(() => {
  const entries = performance.getEntriesByName('texture-reveal');
  return entries.map(e => e.duration);
});
const p95 = calculateP95(timings);
expect(p95).toBeLessThan(100);
```

**Core Web Vitals (NFR1-3):**

```typescript
// Use Playwright Performance API or Lighthouse CI
const metrics = await page.evaluate(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  const lcp = paint.find(e => e.name === 'largest-contentful-paint');
  return {
    lcp: lcp?.startTime || 0,
    cls: /* CLS calculation */,
  };
});
expect(metrics.lcp).toBeLessThan(2500); // <2.5s
expect(metrics.cls).toBeLessThan(0.1);
```

---

### Accessibility testing requirements

**axe-core Integration:**

```bash
npm install --save-dev @axe-core/playwright
```

```typescript
// tests/smoke/full-journey.spec.ts
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('no accessibility violations', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
});
```

**Keyboard Navigation Test:**

```typescript
test('keyboard navigation works for all interactive elements', async ({ page }) => {
  await page.goto('/');

  // Tab through hero section
  await page.keyboard.press('Tab');
  // Verify focus on first interactive element

  // Tab to product cards
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.textContent);
    expect(focused).toBeTruthy();
  }

  // Tab to footer links
  // ...
});
```

**Reduced Motion Test:**

```typescript
test('respects prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  // Hover over product card
  await page.hover('[data-testid="product-card"]');

  // Verify static reveal (no animation)
  // Check for instant opacity change, no transition duration
});
```

---

### Multi-device testing strategy

**Device Configuration (playwright.config.ts):**

```typescript
export default defineConfig({
  projects: [
    {
      name: 'Mobile - iPhone SE',
      use: { ...devices['iPhone SE'] }, // 375px viewport
    },
    {
      name: 'Mobile - Pixel 7',
      use: { ...devices['Pixel 7'] }, // 412px viewport
    },
    {
      name: 'Desktop',
      use: { viewport: { width: 1440, height: 900 } },
    },
  ],
});
```

**Smoke Test Device Loop:**

```typescript
const devices = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Pixel 7', width: 412, height: 915 },
  { name: 'Desktop', width: 1440, height: 900 },
];

for (const device of devices) {
  test(`full journey on ${device.name}`, async ({ page }) => {
    await page.setViewportSize({ width: device.width, height: device.height });
    // Run full journey tests
  });
}
```

---

### Smoke test structure

**Recommended test organization:**

```typescript
// tests/smoke/full-journey.spec.ts
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Full B2C Journey - Smoke Tests', () => {
  test.describe.configure({ mode: 'parallel' }); // Run in parallel for speed

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AC1: Hero loads with LCP <2.5s', async ({ page }) => {
    // Test implementation
  });

  test('AC2: Constellation displays all 4 products', async ({ page }) => {
    // Test implementation
  });

  test('AC3: Texture reveal triggers <100ms', async ({ page }) => {
    // Test implementation
  });

  test('AC4: Story fragments appear on scroll', async ({ page }) => {
    // Test implementation
  });

  test('AC5: Collection prompt appears after 2+ products', async ({ page }) => {
    // Test implementation
  });

  test('AC6: Footer navigation works', async ({ page }) => {
    // Test implementation
  });

  test('AC7: No console errors or accessibility violations', async ({ page }) => {
    // Test implementation
  });

  test('AC8: Tests pass on multiple devices', async ({ page }) => {
    // Test implementation (device loop)
  });
});
```

---

### CI pipeline integration

**Verify `.github/workflows/ci.yml` includes:**

```yaml
- name: Run Playwright Smoke Tests
  run: npm run test:smoke

- name: Run Lighthouse CI
  run: npm run lighthouse:ci

- name: Upload Playwright Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

**Add npm script to `package.json` (if not exists):**

```json
{
  "scripts": {
    "test:smoke": "playwright test tests/smoke/"
  }
}
```

---

### Expected test coverage

**Smoke test suite should cover:**

1. ✅ Hero LCP <2.5s (AC1) — 3 device tests = 3 tests
2. ✅ Constellation 4 products (AC2) — 3 device tests = 3 tests
3. ✅ Texture reveal <100ms (AC3) — 3 device tests, reduced motion = 4 tests
4. ✅ Story fragments scroll (AC4) — 3 device tests = 3 tests
5. ✅ Collection prompt 2+ products (AC5) — 3 device tests = 3 tests
6. ✅ Footer navigation (AC6) — 3 device tests = 3 tests
7. ✅ Console errors + accessibility (AC7) — 1 shared test = 1 test
8. ✅ Multi-device (AC8) — covered by all above = 0 additional tests
9. ✅ CI pipeline (AC9) — verified in GitHub Actions = 0 tests

**Total smoke tests: ~20 tests** (3 devices × 6 ACs + 4 additional tests)

---

### References

- **Epic definition:** `_bmad-output/planning-artifacts/epics.md` — Epic 4, Story 4.7
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` — Performance (NFR1-7), Accessibility (NFR8-14), Testing strategy
- **UX design:** `_bmad-output/planning-artifacts/ux-design-specification.md` — Responsive design, reduced motion
- **PRD:** `_bmad-output/planning-artifacts/prd.md` — Functional requirements (FR1-FR9, FR41-FR48), Core Web Vitals
- **Project context:** `_bmad-output/project-context.md` — Performance instrumentation, accessibility testing, testing boundaries
- **Playwright config:** `playwright.config.ts` — Device configuration, test setup
- **CI pipeline:** `.github/workflows/ci.yml` — GitHub Actions workflow
- **Previous stories:**
  - `_bmad-output/implementation-artifacts/4-6-add-wholesale-portal-link-in-header-footer.md` — Header/Footer wholesale link
  - `_bmad-output/implementation-artifacts/4-5-implement-footer-with-navigation-links.md` — Footer navigation
  - `_bmad-output/implementation-artifacts/4-4-create-about-page-fallback-for-direct-traffic.md` — About page
  - `_bmad-output/implementation-artifacts/4-3-add-variety-pack-from-collection-prompt.md` — Collection prompt
  - `_bmad-output/implementation-artifacts/4-2-display-collection-prompt-after-2-products-explored.md` — Collection prompt logic
  - `_bmad-output/implementation-artifacts/4-1-implement-story-fragments-during-scroll.md` — Story fragments

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

(To be populated by dev agent during implementation)

### Completion Notes List

**Implementation Summary (2026-01-29)**

✅ **All acceptance criteria met**

**Test Infrastructure:**
- Created comprehensive smoke test suite in `tests/smoke/full-journey.spec.ts` (396 lines)
- Configured Playwright projects for 3 devices: iPhone SE (375px), Pixel 7 (412px), Desktop (1440px)
- Added smoke test job to CI pipeline (.github/workflows/ci.yml)
- Updated package.json with `test:smoke` and `test:smoke:journey` scripts

**Test Coverage Implemented:**
- AC1: Hero LCP <2.5s test using Performance API
- AC2: Constellation 4-product display test with CLS <0.1 validation
- AC3: Texture reveal <100ms timing test with Performance API marks/measures
- AC3: Reduced motion preference test (static reveal, no animation)
- AC4: Story fragments scroll visibility test
- AC5: Collection prompt after 2+ products explored (Zustand store validation)
- AC6: Footer navigation links test (6 links verified)
- AC7: Console error capture + axe-core accessibility audit (zero violations required)
- AC8: Responsive layout test across all 3 viewports (touch targets 44x44px on mobile)

**Component Enhancements:**
- Added `data-testid="hero-section"` to app/components/story/HeroSection.tsx
- Added `data-testid="constellation-grid"` to app/components/product/ConstellationGrid.tsx
- Added `data-testid="product-card"` to app/components/product/ProductCard.tsx
- Added `data-testid="product-name"` and `data-testid="product-price"` to ProductCard
- Added price display to ProductCard (was missing)
- Added `data-testid="texture-reveal"` to app/components/product/TextureReveal.tsx
- Added `data-testid="social-icons"` to app/components/ui/SocialLinks.tsx
- StoryFragment and CollectionPrompt already had test IDs

**CI Integration:**
- Smoke tests run on every PR after bundle-size check
- Tests run in headless Chromium with mobile + desktop viewports
- Test results uploaded as artifacts on failure
- PR blocked if smoke tests fail (quality gate enforced)

**Performance Validation:**
- Tests measure LCP, CLS, texture reveal timing via Performance API
- Validates <100ms texture reveal at p95 (NFR4 non-negotiable)
- Validates LCP <2.5s, CLS <0.1 (NFR1-3 non-negotiable)
- Verifies no network requests during reveal (image preloaded)

**Accessibility Validation:**
- axe-core integration via @axe-core/playwright (AxeBuilder API)
- Zero accessibility violations required (WCAG 2.1 AA compliance)
- Keyboard navigation tests for all interactive elements
- Focus management verification (focus trap, return focus)
- Touch target size validation (44x44px minimum on mobile)

**Technical Decisions:**
- Used AxeBuilder API (not injectAxe/checkA11y which are deprecated)
- Console error tracking via page.on('console') and page.on('pageerror')
- Performance timing via performance.mark() and performance.measure()
- Device-specific test projects in playwright.config.ts (smoke-iphone-se, smoke-pixel-7, smoke-desktop)

**Test Execution:**
- Tests run via `pnpm test:smoke` (all smoke tests)
- Individual test via `pnpm test:smoke:journey` (full-journey.spec.ts only)
- CI runs tests on every PR with --project flags for multi-device coverage

**Epic 4 Closure:**
- This story completes Epic 4 (Story Moments & Site Navigation)
- All features from Stories 4.1-4.6 are now validated via smoke tests
- Smoke test suite establishes baseline for regression prevention in Epic 5+

### File List

**New Files:**
- `tests/smoke/full-journey.spec.ts` — Comprehensive smoke test suite (396 lines, 9 test scenarios)

**Modified Files:**
- `playwright.config.ts` — Added 3 smoke test projects (smoke-iphone-se, smoke-pixel-7, smoke-desktop)
- `package.json` — Updated test:smoke script to run Playwright smoke tests, added test:smoke:journey
- `.github/workflows/ci.yml` — Added smoke-tests job (runs after bundle-size, blocks PR on failure)
- `app/components/story/HeroSection.tsx` — Added data-testid="hero-section"
- `app/components/product/ConstellationGrid.tsx` — Added data-testid="constellation-grid"
- `app/components/product/ProductCard.tsx` — Added data-testid, product-name, product-price test IDs + price display
- `app/components/product/TextureReveal.tsx` — Added data-testid="texture-reveal"
- `app/components/ui/SocialLinks.tsx` — Added data-testid="social-icons"
