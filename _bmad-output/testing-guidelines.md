# Testing Guidelines - Isla Suds

**Version:** 1.0
**Last Updated:** 2026-01-28
**Established:** Epic 3 retrospective

This document captures testing patterns and strategies that emerged during Epic 3 (Texture Reveals & Product Discovery) and should be followed for future development.

---

## Testing Philosophy

**Core Principle:** Incremental test growth without regression.

Epic 3 demonstrated a successful pattern:
- Story 3-1: 162 tests (baseline)
- Story 3-2: 187 tests (+25, core interaction)
- Story 3-3: 212 tests (+25, content display)
- Story 3-4: 222 tests (+10, info display)
- Story 3-5: 237 tests (+15, close behavior)
- Story 3-6: All tests passing (no regression)

**Zero blocking issues** across all stories, with test coverage growing organically as features were added.

---

## Test Structure

### Unit Tests

**Location:** Co-located with components (`.test.tsx` suffix)

**Example:** `app/components/product/TextureReveal.test.tsx`

**Coverage Focus:**
- Component rendering with various prop combinations
- User interactions (click, keyboard, touch)
- State management integration
- Accessibility attributes (ARIA labels, roles, focus management)
- Reduced motion behavior
- Error boundaries and fallback states

**Pattern:**
```typescript
describe('ComponentName', () => {
  describe('Feature/Behavior', () => {
    it('should do specific thing when condition', () => {
      // Arrange
      render(<Component {...props} />);

      // Act
      userEvent.click(screen.getByRole('button'));

      // Assert
      expect(screen.getByText('Expected')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests

**Location:** `tests/integration/`

**Coverage Focus:**
- Multi-component workflows (e.g., constellation → texture reveal → close)
- Network request patterns (GraphQL queries, mutations)
- State synchronization across components
- Performance characteristics (e.g., <100ms texture reveal contract)

**Pattern:**
```typescript
describe('Feature Integration', () => {
  it('should complete full workflow', async () => {
    // Setup mock API responses
    mockGraphQL({ query: PRODUCT_QUERY, data: mockProduct });

    // Render app/route
    render(<Route />);

    // Simulate user journey
    await userEvent.click(screen.getByTestId('product-card'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible());

    // Verify state/UI
    expect(mockAddProductExplored).toHaveBeenCalledWith(product.id);
  });
});
```

### Performance Tests

**Location:** `tests/performance/`

**Coverage Focus:**
- Performance API timing measurements
- Bundle size constraints
- Animation frame rates
- Network request counts

**Pattern:**
```typescript
it('should meet performance contract', async () => {
  performance.mark('feature-start');

  // Execute feature
  await triggerFeature();

  performance.mark('feature-end');
  const measure = performance.measure('feature', 'feature-start', 'feature-end');

  expect(measure.duration).toBeLessThan(100); // e.g., <100ms contract
});
```

---

## Mocking Strategies

### Zustand Store Mocks

**Pattern:** Create manual mocks in test files

```typescript
// Mock store at top of test file
const mockAddProductExplored = vi.fn();
const mockIncrementTextureReveals = vi.fn();

vi.mock('~/stores/exploration', () => ({
  useExplorationStore: vi.fn(() => ({
    productsExplored: new Set<string>(),
    textureRevealsTriggered: 0,
    addProductExplored: mockAddProductExplored,
    incrementTextureReveals: mockIncrementTextureReveals,
  })),
}));

// Clear mocks in beforeEach
beforeEach(() => {
  mockAddProductExplored.mockClear();
  mockIncrementTextureReveals.mockClear();
});
```

### Framer Motion Mocks

**Pattern:** Mock dynamic imports for animation libraries

```typescript
// Mock framer-motion to avoid animation in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    // Add other motion elements as needed
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));
```

### GraphQL/API Mocks

**Pattern:** Mock at the fetch/handler level, not generated hooks

```typescript
// Mock server responses for integration tests
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/graphql', (req, res, ctx) => {
    const { query } = req.body;

    if (query.includes('ProductQuery')) {
      return res(ctx.json({ data: mockProductData }));
    }

    return res(ctx.json({ data: null }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Intersection Observer Mocks

**Pattern:** Mock browser APIs for preloading tests

```typescript
// Mock IntersectionObserver for preloading tests
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation((callback) => ({
  observe: vi.fn((element) => {
    // Immediately trigger intersection for testing
    callback([{ isIntersecting: true, target: element }]);
  }),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = mockIntersectionObserver;
```

### Radix UI Dialog Mocks

**Pattern:** Radix components generally don't need mocking; test the rendered output

```typescript
// Radix Dialog handles accessibility automatically
// Test the rendered dialog state, not the implementation
it('should render dialog when open', () => {
  render(<TextureReveal open={true} product={mockProduct} />);

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByLabelText(/close texture view/i)).toBeInTheDocument();
});
```

---

## Accessibility Testing

**WCAG 2.1 AA Compliance** is the target for all features.

### Required Checks

1. **Keyboard Navigation**
   - All interactive elements reachable via Tab
   - Enter/Space activate buttons/links
   - Escape key closes modals/dialogs
   - Focus visible and logical tab order

```typescript
it('should be keyboard accessible', async () => {
  render(<Component />);

  // Tab to element
  await userEvent.tab();
  expect(screen.getByRole('button')).toHaveFocus();

  // Activate with Enter
  await userEvent.keyboard('{Enter}');
  expect(mockOnClick).toHaveBeenCalled();
});
```

2. **Screen Reader Support**
   - ARIA labels on icon buttons
   - ARIA roles on custom elements
   - ARIA live regions for dynamic content
   - Alt text on images

```typescript
it('should have accessible labels', () => {
  render(<CloseButton productName="Lavender Dreams" />);

  expect(screen.getByLabelText('Close texture view for Lavender Dreams'))
    .toBeInTheDocument();
});
```

3. **Focus Management**
   - Focus restored after modal close
   - No focus traps in closed modals
   - Skip links for long content

```typescript
it('should restore focus after close', async () => {
  const triggerButton = screen.getByRole('button', { name: /view texture/i });

  await userEvent.click(triggerButton);
  await userEvent.keyboard('{Escape}');

  await waitFor(() => expect(triggerButton).toHaveFocus());
});
```

4. **Reduced Motion**
   - `prefers-reduced-motion: reduce` respected
   - Instant state changes when motion disabled
   - No animation jank or layout shift

```typescript
it('should respect reduced motion preference', () => {
  // Mock media query
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

  render(<AnimatedComponent />);

  // Verify no animation classes applied
  expect(screen.getByTestId('animated-element'))
    .not.toHaveClass('animate-fade-in');
});
```

5. **Touch Targets**
   - Minimum 44×44px touch targets on mobile
   - Adequate spacing between interactive elements

```typescript
it('should meet touch target minimum size', () => {
  render(<CloseButton />);

  const button = screen.getByRole('button');
  const styles = window.getComputedStyle(button);

  expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(44);
  expect(parseInt(styles.minWidth)).toBeGreaterThanOrEqual(44);
});
```

---

## Testing Zustand Stores

### Store Unit Tests

**Location:** Co-located with store file (e.g., `app/stores/exploration.test.ts`)

**Pattern:**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useExplorationStore } from './exploration';

describe('useExplorationStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useExplorationStore());
    act(() => {
      result.current.resetExploration();
    });
  });

  it('should add product to explored set', () => {
    const { result } = renderHook(() => useExplorationStore());

    act(() => {
      result.current.addProductExplored('product-1');
    });

    expect(result.current.productsExplored).toContain('product-1');
  });

  it('should not add duplicate products', () => {
    const { result } = renderHook(() => useExplorationStore());

    act(() => {
      result.current.addProductExplored('product-1');
      result.current.addProductExplored('product-1');
    });

    expect(result.current.productsExplored.size).toBe(1);
  });
});
```

---

## Test Organization Best Practices

### 1. Group Related Tests

Use nested `describe` blocks to organize tests by feature/behavior:

```typescript
describe('TextureReveal', () => {
  describe('Opening behavior (Story 3.2)', () => {
    it('should animate open when triggered', () => { /* ... */ });
    it('should record texture reveal in store', () => { /* ... */ });
  });

  describe('Closing behavior (Story 3.5)', () => {
    it('should close via button click', () => { /* ... */ });
    it('should close via Escape key', () => { /* ... */ });
    it('should close via outside click', () => { /* ... */ });
  });

  describe('Content display (Stories 3.3, 3.4)', () => {
    it('should display scent narrative', () => { /* ... */ });
    it('should display product info', () => { /* ... */ });
  });
});
```

### 2. Reference Story Numbers

Include story numbers in test descriptions to maintain traceability:

```typescript
it('should meet <100ms performance contract (AC2, Story 3.2)', () => {
  // Test implementation
});
```

### 3. Use `beforeEach` for Setup

Clear mocks and reset state before each test:

```typescript
beforeEach(() => {
  mockFunction.mockClear();
  vi.clearAllMocks();
});
```

### 4. Test Data Factories

Create reusable test data factories for complex objects:

```typescript
// tests/factories/product.ts
export function createMockProduct(overrides = {}) {
  return {
    id: 'gid://shopify/Product/123',
    handle: 'test-product',
    title: 'Test Product',
    description: 'Test description',
    images: { nodes: [{ url: 'https://example.com/image.jpg' }] },
    ...overrides,
  };
}

// In tests
const product = createMockProduct({ handle: 'lavender-dreams' });
```

---

## AI Code Review Integration

### Story 3.5 Pattern

Story 3.5 included AI code review fixes that improved accessibility:

**HIGH Priority Fixes:**
1. Close button `aria-label` made product-specific
2. Touch target increased to 44×44px minimum

**MEDIUM Priority Fixes:**
1. Added overlay click test
2. Gated `onOpenChange` to only run on close

**Lesson:** AI review caught AC compliance issues that initial implementation missed. Consider running AI review on accessibility-critical features.

**Process:**
1. Implement story with tests
2. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`
3. Run AI code review (via `bmad:bmm:workflows:code-review`)
4. Address review findings
5. Re-run quality gates

---

## Quality Gates

**All stories MUST pass these checks before marking done:**

1. ✅ `pnpm lint` - no linting errors
2. ✅ `pnpm typecheck` - no TypeScript errors
3. ✅ `pnpm test` - all tests passing
4. ✅ Manual testing - feature works as expected in browser
5. ✅ Accessibility audit - keyboard navigation, screen reader, reduced motion

**Optional but recommended:**
- `pnpm build` - production build succeeds
- `pnpm preview` - preview build works locally

---

## Future Testing Needs

### Epic 4 Considerations

**Story Moments & Collection Prompt (4-1, 4-2, 4-3):**
- Test scroll-triggered story fragments
- Test exploration state triggers (after 2 products explored)
- Test collection prompt display and dismissal
- Test variety pack addition from prompt

**Recommended new test patterns:**
- Scroll event simulation for story fragments
- State-based trigger testing (exploration thresholds)
- Multi-step user journey tests (explore → prompt → add bundle)

### Epic 5 Considerations (Cart Experience)

**Cart Creation & Persistence (5-1):**
- Test cart creation on first add-to-cart
- Test cart persistence across sessions
- Test cart sync with Shopify

**Recommended new test patterns:**
- LocalStorage/SessionStorage mocking
- Cart API mutation testing
- Optimistic UI update testing

---

## References

- **Epic 3 Stories:** `_bmad-output/implementation-artifacts/3-{1-6}-*.md`
- **Epic 3 Retrospective:** `_bmad-output/implementation-artifacts/epic-3-retro-2026-01-28.md`
- **Testing Library Docs:** https://testing-library.com/docs/react-testing-library/intro/
- **Vitest Docs:** https://vitest.dev/
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

**Maintained by:** Tessa (Test Engineer)
**Next Review:** After Epic 4 completion
