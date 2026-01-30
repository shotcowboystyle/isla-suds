# Isla Suds Test Suite

Comprehensive test automation for the Isla Suds Shopify Hydrogen storefront.

## Test Structure

```
tests/
├── e2e/                    # End-to-end tests (critical user journeys)
│   ├── cart-flow.spec.ts
│   ├── cart-persistence.spec.ts
│   ├── product-display.spec.ts
│   ├── navigation.spec.ts
│   ├── image-preloading.spec.ts         # Story 3.1: Image preloading
│   └── wholesale-reorder.spec.ts        # Story 7.6: One-click reorder
├── integration/            # Integration tests (component + hook behavior)
│   ├── constellation-preload.spec.ts    # Story 3.1: ConstellationGrid integration
│   └── wholesale-reorder.spec.ts        # Story 7.6: Reorder action integration
├── performance/            # Performance tests (CI gates)
│   ├── texture-reveal.perf.spec.ts
│   ├── image-preload.perf.spec.ts       # Story 3.1: Preload timing (<100ms)
│   └── wholesale-reorder.perf.spec.ts   # Story 7.6: <2s cart, <60s total
├── component/              # Component unit tests
│   ├── AddToCartButton.test.tsx
│   └── ProductForm.test.tsx
├── accessibility/          # WCAG 2.1 AA compliance tests
│   └── core-pages.spec.ts
└── support/                # Test infrastructure
    ├── fixtures/           # Playwright fixtures
    │   ├── cart.fixture.ts
    │   ├── product.fixture.ts
    │   └── wholesale.fixture.ts     # ✨ NEW: B2B partner sessions (Story 7.6)
    ├── factories/          # Test data factories
    │   ├── product.factory.ts       # ✨ Enhanced with featuredImage support
    │   ├── cart.factory.ts
    │   ├── variant.factory.ts
    │   └── wholesale-order.factory.ts  # ✨ NEW: B2B order data (Story 7.6)
    └── helpers/            # Test utilities
        ├── wait-for.ts
        ├── performance.ts
        └── preload.ts               # ✨ NEW: Preload validation helpers
```

## Running Tests

### All Tests

```bash
# Run all Playwright tests
pnpm playwright test

# Run all Vitest tests
pnpm test
```

### By Test Type

```bash
# E2E tests only
pnpm playwright test tests/e2e

# Integration tests only
pnpm test:integration

# Performance tests only
pnpm playwright test tests/performance

# Accessibility tests only
pnpm playwright test tests/accessibility

# Component tests only
pnpm test tests/component

# Wholesale reorder tests (Story 7.6)
pnpm test:wholesale                    # All wholesale tests
pnpm test:e2e:wholesale                # E2E reorder tests
pnpm test:integration:wholesale        # Integration reorder tests
pnpm test:perf:wholesale               # Performance reorder tests
```

### By Priority

Tests are tagged with priority levels for selective execution:

```bash
# P0 (Critical) - Run before every commit
pnpm playwright test --grep "@P0"

# P0 + P1 (High) - Run before PR merge
pnpm playwright test --grep "@P0|@P1"

# P2 (Medium) - Run nightly
pnpm playwright test --grep "@P2"
```

### Specific Test Files

```bash
# Run single test file
pnpm playwright test tests/e2e/cart-flow.spec.ts

# Run in headed mode (see browser)
pnpm playwright test --headed

# Debug specific test
pnpm playwright test --debug tests/e2e/cart-flow.spec.ts
```

## Priority Tags

Every test is tagged with a priority level in its name:

- **[P0] Critical** - Revenue-impacting functionality, must always work
  - Cart flow, checkout redirect, cart persistence
  - Performance requirements (<100ms texture reveal)
  - Run in pre-commit hooks or CI

- **[P1] High** - Core user journeys and frequently used features
  - Product display, navigation, add to cart
  - Run before merging to main

- **[P2] Medium** - Secondary features and edge cases
  - Theme switcher, error boundaries
  - Run nightly or weekly

## Test Quality Standards

All tests follow these principles:

### Given-When-Then Format

```typescript
test('[P0] should add product to cart', async ({page}) => {
  // GIVEN: User is on product page
  await page.goto('/products/soap');

  // WHEN: User clicks "Add to cart"
  await page.click('button:has-text("Add to cart")');

  // THEN: Cart drawer opens
  await expect(page.locator('aside[aria-label="Cart"]')).toBeVisible();
});
```

### Deterministic Waits (No Flaky Tests)

✅ **Correct:**
```typescript
await page.waitForSelector('[data-testid="cart-item"]');
await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
```

❌ **Wrong:**
```typescript
await page.waitForTimeout(2000); // Hard wait - NEVER USE
```

### Selector Hierarchy

Use selectors in this order of preference:

1. **data-testid** - Most stable (recommended)
   ```typescript
   page.locator('[data-testid="add-to-cart"]')
   ```

2. **ARIA roles** - Semantic and accessible
   ```typescript
   page.getByRole('button', {name: 'Add to cart'})
   ```

3. **Text content** - Readable but language-dependent
   ```typescript
   page.locator('button:has-text("Add to cart")')
   ```

4. **CSS classes** - Avoid (brittle and change frequently)

### Self-Cleaning Tests

Tests use fixtures for automatic cleanup:

```typescript
import {test} from '../support/fixtures/cart.fixture';

test('cart test', async ({testCart}) => {
  // testCart is automatically created
  // and cleaned up after test
});
```

## Test Factories

Use factories to create test data with sensible defaults and explicit overrides:

```typescript
import {createProduct} from '../support/factories/product.factory';

// Default product
const product = createProduct();

// Custom product
const unavailableProduct = createProduct({
  availableForSale: false,
  title: 'Sold Out Soap',
});
```

### Available Factories

- **product.factory.ts** - Product data generation (includes `featuredImage` URL)
- **cart.factory.ts** - Cart data generation
- **variant.factory.ts** - Product variant generation
- **wholesale-order.factory.ts** - B2B wholesale order data (Story 7.6)
  ```typescript
  import {createWholesaleOrder, createLargeWholesaleOrder} from '../support/factories/wholesale-order.factory';

  // Standard wholesale order
  const order = createWholesaleOrder();

  // Large order (50+ items) for performance testing
  const largeOrder = createLargeWholesaleOrder();
  ```

## Test Helpers

### Preload Validation Helpers (Story 3.1)

The `preload.ts` helper provides utilities for validating image preload behavior:

```typescript
import {
  getPreloadLinks,
  waitForPreloadLinks,
  getPreloadLinkAttributes,
  hasOptimizationParams,
} from '../support/helpers/preload';

// Get all preload links from page head
const links = await getPreloadLinks(page);
expect(links.length).toBeGreaterThan(0);

// Wait for specific number of preload links
await waitForPreloadLinks(page, 4, {timeout: 3000});

// Validate link attributes (AC2: fetchpriority, URL optimization)
const attrs = await getPreloadLinkAttributes(page, imageUrl);
expect(attrs.fetchpriority).toBe('high');

// Check for Shopify CDN optimization (width, format)
const isOptimized = await hasOptimizationParams(page, imageUrl);
expect(isOptimized).toBe(true);
```

### Available Helpers

- **wait-for.ts** - Deterministic async polling utilities
- **performance.ts** - Performance measurement helpers
- **preload.ts** - Image preload validation (Story 3.1)

## Performance Testing

Texture reveal performance is a **CI gate** - failures block deployment:

```bash
# Run performance tests
pnpm playwright test tests/performance

# Performance requirement: p95 < 100ms
```

The texture reveal test measures 10 iterations and calculates p95 to ensure consistent performance.

## Accessibility Testing

WCAG 2.1 AA compliance is verified using axe-core:

```bash
# Run accessibility tests
pnpm playwright test tests/accessibility
```

Critical and serious violations will fail the build.

## Continuous Integration

Tests run automatically in CI with these gates:

- **P0 tests** - Must pass for deployment
- **Performance tests** - Texture reveal p95 < 100ms
- **Accessibility tests** - No critical/serious violations
- **Type checking** - No TypeScript errors

## Adding New Tests

1. **Determine test level:**
   - E2E for critical user journeys
   - Component for UI behavior
   - Unit for pure business logic

2. **Assign priority:**
   - P0 for revenue-critical
   - P1 for core features
   - P2 for secondary features

3. **Follow patterns:**
   - Use Given-When-Then format
   - Use data-testid selectors
   - Use deterministic waits
   - Add priority tag in test name

4. **Create test file:**
   ```typescript
   test('[P1] should do something', async ({page}) => {
     // GIVEN: Setup

     // WHEN: Action

     // THEN: Assertion
   });
   ```

## Common Patterns

### Network-First Pattern

Intercept routes BEFORE navigation to prevent race conditions:

```typescript
await page.route('**/api/cart', (route) => route.fulfill({
  status: 200,
  body: JSON.stringify(mockCart),
}));

await page.goto('/cart'); // Navigate after interception
```

### Waiting for Async Operations

Use explicit waits for async conditions:

```typescript
import {waitFor} from '../support/helpers/wait-for';

await waitFor(
  async () => {
    const text = await element.textContent();
    return text === 'Complete';
  },
  {timeout: 5000}
);
```

## Debugging Tests

### View Test Report

```bash
# Open HTML report
pnpm playwright show-report
```

### Debug Failing Tests

```bash
# Run in debug mode (pause execution)
pnpm playwright test --debug

# Run in headed mode (see browser)
pnpm playwright test --headed

# Take screenshots on failure (already configured)
# Screenshots saved to test-results/
```

### Performance Debugging

```bash
# Run single performance test with console output
pnpm playwright test tests/performance/texture-reveal.perf.spec.ts
```

## Known Issues

- **Playwright browsers required:** Run `pnpm exec playwright install` before first test run
- **@faker-js/faker optional:** Factories use simple defaults until faker is installed

## Contributing

When adding new tests:

1. Follow existing patterns and conventions
2. Keep tests atomic (one assertion per test)
3. Use meaningful test names with priority tags
4. Ensure tests are deterministic (no flaky patterns)
5. Add documentation for complex test scenarios

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Vitest Documentation](https://vitest.dev)
- [Axe-core Accessibility Rules](https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md)
- [Project Context](/Users/shotcowboystyle/www/sites/isla-suds/_bmad-output/project-context.md)
