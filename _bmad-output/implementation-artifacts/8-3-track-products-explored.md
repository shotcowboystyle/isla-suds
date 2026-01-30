# Story 8.3: Track Products Explored

Status: ready-for-dev

## Story

As a **founder**,
I want **to know how many products visitors explore per session**,
so that **I can measure discovery depth and identify drop-off points**.

## Acceptance Criteria

**Given** the analytics infrastructure is in place
**When** a visitor explores a product (triggers reveal)
**Then** an event is tracked with:
- Event name: `product_explored`
- Product ID
- Exploration order (1st, 2nd, 3rd, 4th)
**And** session summary includes:
- Total products explored
- List of product IDs explored
- Whether collection prompt was shown
**And** Zustand `productsExplored` Set is updated

**FRs addressed:** FR35

## Tasks / Subtasks

- [ ] Track product exploration event (AC: 1-3)
  - [ ] Emit event when product is first explored
  - [ ] Include product ID and product title
  - [ ] Calculate exploration order (1st, 2nd, 3rd, 4th)
  - [ ] Only track first exploration per product
- [ ] Update Zustand exploration store (AC: 4)
  - [ ] Add product to `productsExplored` Set
  - [ ] Track exploration order
  - [ ] Persist for session duration
- [ ] Track collection prompt trigger (AC: 4)
  - [ ] Note when collection prompt is shown
  - [ ] Include in session summary
  - [ ] Correlate with products explored count
- [ ] Prevent duplicate tracking (AC: 5)
  - [ ] Only track first exploration per product
  - [ ] Subsequent reveals don't emit new events
  - [ ] Use Zustand Set for deduplication

## Dev Notes

### Critical Architecture Requirements

**Product Exploration Definition:**
- A product is "explored" when user first triggers its texture reveal
- Subsequent reveals of same product don't count as new exploration
- Exploration order matters (1st product explored vs 4th)
- Collection prompt triggers after 2+ products explored

**Event Data Schema:**
```typescript
interface ProductExploredEvent {
  name: 'product_explored';
  data: {
    productId: string;
    productTitle: string;
    explorationOrder: number; // 1 = first product explored in session
    totalExplored: number; // How many products explored so far
    collectionPromptShown: boolean; // Set to true when shown
  };
}
```

**Business Questions Answered:**
1. How many products do users explore before purchasing?
2. Does exploring more products lead to higher conversion?
3. Is the collection prompt effective (shown after 2+ products)?
4. Which products are explored most frequently?
5. What's the typical exploration journey? (which products first/second/etc)

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Event Tracking | `trackEvent()` from analytics.ts (Story 8.1) |
| State Management | Zustand exploration store (existing) |
| Deduplication | Set data structure |
| Component Integration | TextureReveal component |

### File Structure

```
app/
  hooks/
    use-product-exploration-analytics.ts   # Custom hook
    use-product-exploration-analytics.test.ts
  stores/
    exploration.ts                         # Update with tracking
  components/
    product/
      TextureReveal.tsx                    # Add exploration tracking
```

### Custom Hook Implementation

**New File: `app/hooks/use-product-exploration-analytics.ts`**

```typescript
import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useExplorationStore } from '@/stores/exploration';

interface UseProductExplorationAnalyticsOptions {
  productId: string;
  productTitle: string;
  isRevealed: boolean;
}

/**
 * Track product exploration (first reveal only)
 */
export function useProductExplorationAnalytics({
  productId,
  productTitle,
  isRevealed,
}: UseProductExplorationAnalyticsOptions) {
  const hasTrackedRef = useRef(false);
  const addProductExplored = useExplorationStore(
    (state) => state.addProductExplored
  );
  const productsExplored = useExplorationStore(
    (state) => state.productsExplored
  );
  const storyMomentShown = useExplorationStore(
    (state) => state.storyMomentShown
  );

  useEffect(() => {
    // Only track when revealed AND not already tracked
    if (isRevealed && !hasTrackedRef.current) {
      // Check if this is first exploration of this product
      const isFirstExploration = !productsExplored.has(productId);

      if (isFirstExploration) {
        // Update Zustand store first (synchronous)
        addProductExplored(productId);

        // Get exploration order (1-indexed)
        const explorationOrder = productsExplored.size + 1;

        // Track analytics event (asynchronous)
        trackEvent('product_explored', {
          productId,
          productTitle,
          explorationOrder,
          totalExplored: explorationOrder,
          collectionPromptShown: storyMomentShown,
        });

        // Mark as tracked
        hasTrackedRef.current = true;

        console.debug(
          `[Exploration] Product explored: ${productTitle} (${explorationOrder}${getOrdinalSuffix(explorationOrder)} product)`
        );
      }
    }
  }, [
    isRevealed,
    productId,
    productTitle,
    addProductExplored,
    productsExplored,
    storyMomentShown,
  ]);
}

/**
 * Get ordinal suffix for numbers (1st, 2nd, 3rd, 4th)
 */
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;

  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}
```

### Zustand Store Update

**Modify: `app/stores/exploration.ts`**

```typescript
import { create } from 'zustand';

interface ExplorationState {
  productsExplored: Set<string>; // EXISTING - Set of product IDs
  textureRevealsTriggered: number;
  storyMomentShown: boolean;
  sessionStartTime: number;
  cartDrawerOpen: boolean;

  // Actions
  addProductExplored: (productId: string) => void; // EXISTING
  incrementTextureReveals: () => void;
  setStoryMomentShown: (shown: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  resetExploration: () => void;

  // Getters (computed values)
  getExplorationCount: () => number; // NEW - helper for exploration count
  hasExploredMinimum: (min: number) => boolean; // NEW - check if explored N+ products
}

export const useExplorationStore = create<ExplorationState>((set, get) => ({
  productsExplored: new Set(),
  textureRevealsTriggered: 0,
  storyMomentShown: false,
  sessionStartTime: Date.now(),
  cartDrawerOpen: false,

  addProductExplored: (productId) =>
    set((state) => {
      const newSet = new Set(state.productsExplored);
      newSet.add(productId);
      return { productsExplored: newSet };
    }),

  incrementTextureReveals: () =>
    set((state) => ({
      textureRevealsTriggered: state.textureRevealsTriggered + 1,
    })),

  setStoryMomentShown: (shown) => set({ storyMomentShown: shown }),

  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),

  resetExploration: () =>
    set({
      productsExplored: new Set(),
      textureRevealsTriggered: 0,
      storyMomentShown: false,
      sessionStartTime: Date.now(),
      cartDrawerOpen: false,
    }),

  // NEW: Computed values
  getExplorationCount: () => get().productsExplored.size,

  hasExploredMinimum: (min) => get().productsExplored.size >= min,
}));
```

### TextureReveal Component Integration

**Modify: `app/components/product/TextureReveal.tsx`**

```typescript
import { useState } from 'react';
import { useTextureRevealAnalytics } from '@/hooks/use-texture-reveal-analytics';
import { useProductExplorationAnalytics } from '@/hooks/use-product-exploration-analytics';
import type { Product } from '@/types';

interface TextureRevealProps {
  product: Product;
  onClose: () => void;
}

export function TextureReveal({ product, onClose }: TextureRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Analytics tracking (Story 8.2)
  useTextureRevealAnalytics({
    productId: product.id,
    productTitle: product.title,
    isRevealed,
  });

  // Exploration tracking (Story 8.3)
  useProductExplorationAnalytics({
    productId: product.id,
    productTitle: product.title,
    isRevealed,
  });

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleClose = () => {
    setIsRevealed(false);
    onClose();
  };

  // ... rest of component implementation
}
```

### Collection Prompt Integration

**Modify: `app/components/story/StoryMoment.tsx` (from Epic 4)**

```typescript
import { useEffect } from 'react';
import { useExplorationStore } from '@/stores/exploration';
import { trackEvent } from '@/lib/analytics';

export function StoryMoment() {
  const explorationCount = useExplorationStore((state) => state.getExplorationCount());
  const hasExploredMinimum = useExplorationStore((state) => state.hasExploredMinimum(2));
  const storyMomentShown = useExplorationStore((state) => state.storyMomentShown);
  const setStoryMomentShown = useExplorationStore((state) => state.setStoryMomentShown);

  useEffect(() => {
    // Show collection prompt after 2+ products explored
    if (hasExploredMinimum && !storyMomentShown) {
      setStoryMomentShown(true);

      // Track that collection prompt was shown
      trackEvent('collection_prompt_shown', {
        productsExplored: explorationCount,
        triggerReason: 'minimum_exploration_met',
      });
    }
  }, [hasExploredMinimum, storyMomentShown, explorationCount, setStoryMomentShown]);

  // ... rest of component
}
```

### Session Summary Integration

**When session ends (Story 8.4), include exploration summary:**

```typescript
// In session end tracking
const productsExplored = useExplorationStore.getState().productsExplored;
const storyMomentShown = useExplorationStore.getState().storyMomentShown;

trackEvent('session_end', {
  sessionDuration: /* ... */,
  productsExplored: Array.from(productsExplored), // Convert Set to Array
  productsExploredCount: productsExplored.size,
  collectionPromptShown: storyMomentShown,
  textureRevealsTriggered: /* ... */,
  // ...
});
```

### Testing Strategy

**Unit Tests: `app/hooks/use-product-exploration-analytics.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProductExplorationAnalytics } from './use-product-exploration-analytics';
import * as analytics from '@/lib/analytics';
import * as explorationStore from '@/stores/exploration';

vi.mock('@/lib/analytics');
vi.mock('@/stores/exploration');

describe('useProductExplorationAnalytics', () => {
  const mockTrackEvent = vi.spyOn(analytics, 'trackEvent');
  const mockAddProductExplored = vi.fn();
  const mockProductsExplored = new Set<string>();

  beforeEach(() => {
    vi.clearAllMocks();
    mockProductsExplored.clear();

    vi.spyOn(explorationStore, 'useExplorationStore').mockImplementation(
      (selector: any) => {
        if (selector.toString().includes('addProductExplored')) {
          return mockAddProductExplored;
        }
        if (selector.toString().includes('productsExplored')) {
          return mockProductsExplored;
        }
        if (selector.toString().includes('storyMomentShown')) {
          return false;
        }
      }
    );
  });

  it('tracks product exploration on first reveal', () => {
    const { rerender } = renderHook(
      ({ isRevealed }) =>
        useProductExplorationAnalytics({
          productId: 'product-1',
          productTitle: 'Lavender Soap',
          isRevealed,
        }),
      { initialProps: { isRevealed: false } }
    );

    // Open reveal
    rerender({ isRevealed: true });

    expect(mockAddProductExplored).toHaveBeenCalledWith('product-1');
    expect(mockTrackEvent).toHaveBeenCalledWith('product_explored', {
      productId: 'product-1',
      productTitle: 'Lavender Soap',
      explorationOrder: 1,
      totalExplored: 1,
      collectionPromptShown: false,
    });
  });

  it('does not track duplicate exploration', () => {
    // Product already explored
    mockProductsExplored.add('product-1');

    renderHook(() =>
      useProductExplorationAnalytics({
        productId: 'product-1',
        productTitle: 'Lavender Soap',
        isRevealed: true,
      })
    );

    expect(mockAddProductExplored).not.toHaveBeenCalled();
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it('tracks exploration order correctly', () => {
    // First product
    mockProductsExplored.clear();
    const { unmount: unmount1 } = renderHook(() =>
      useProductExplorationAnalytics({
        productId: 'product-1',
        productTitle: 'Lavender',
        isRevealed: true,
      })
    );

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'product_explored',
      expect.objectContaining({ explorationOrder: 1 })
    );

    unmount1();
    vi.clearAllMocks();

    // Second product
    mockProductsExplored.add('product-1');
    renderHook(() =>
      useProductExplorationAnalytics({
        productId: 'product-2',
        productTitle: 'Lemongrass',
        isRevealed: true,
      })
    );

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'product_explored',
      expect.objectContaining({ explorationOrder: 2 })
    );
  });

  it('includes collection prompt status', () => {
    vi.spyOn(explorationStore, 'useExplorationStore').mockImplementation(
      (selector: any) => {
        if (selector.toString().includes('storyMomentShown')) {
          return true; // Collection prompt shown
        }
        return mockAddProductExplored;
      }
    );

    renderHook(() =>
      useProductExplorationAnalytics({
        productId: 'product-1',
        productTitle: 'Lavender',
        isRevealed: true,
      })
    );

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'product_explored',
      expect.objectContaining({ collectionPromptShown: true })
    );
  });
});
```

### Business Insights

**What the founder learns:**

1. **Discovery Depth:**
   - Average products explored per session
   - Distribution: 1 product, 2 products, 3 products, 4 products (all)
   - Correlation with purchase conversion

2. **Exploration Journeys:**
   - Which product is explored first most often?
   - Common exploration sequences (e.g., Lavender → Lemongrass)
   - Do users explore all 4 or stop early?

3. **Collection Prompt Effectiveness:**
   - Conversion rate when prompt is shown
   - Does exploring 2+ products lead to bundle purchase?
   - Optimal trigger point (2 products? 3 products?)

4. **Drop-Off Analysis:**
   - % of users who explore only 1 product
   - % who explore 2+ (prompt eligibility)
   - % who explore all 4 (deep engagement)

### Exploration Funnel Metrics

**Example Analytics Dashboard Queries:**

```sql
-- Average products explored per session
SELECT AVG(products_explored_count) FROM sessions;

-- Distribution of exploration depth
SELECT
  products_explored_count,
  COUNT(*) as session_count
FROM sessions
GROUP BY products_explored_count;

-- Most explored products (by order)
SELECT
  product_id,
  product_title,
  COUNT(*) as times_explored_first
FROM product_explored_events
WHERE exploration_order = 1
GROUP BY product_id, product_title
ORDER BY times_explored_first DESC;

-- Collection prompt conversion
SELECT
  collection_prompt_shown,
  COUNT(*) as sessions,
  SUM(CASE WHEN purchased THEN 1 ELSE 0 END) as purchases,
  AVG(CASE WHEN purchased THEN 1 ELSE 0 END) as conversion_rate
FROM sessions
GROUP BY collection_prompt_shown;
```

### Edge Cases

**All 4 Products Explored:**
- User is a power explorer
- High engagement signal
- Track as `all_products_explored` event

**Repeat Product Exploration:**
- User re-reveals same product multiple times
- Tracked as texture reveals (Story 8.2)
- NOT tracked as new exploration

**Bundle Exploration:**
- Variety pack counts as separate product
- Can be explored alongside individual products
- Total products = 5 (4 individuals + 1 bundle)

**Page Refresh:**
- Session state resets (in-memory Zustand)
- New session, fresh exploration tracking
- Previous session already sent via sendBeacon

### Privacy & Performance

**Privacy:**
- Only product IDs tracked (not user identity)
- Aggregated session data
- No cross-session tracking
- Respects DNT (Story 8.1)

**Performance:**
- Event tracking is asynchronous
- No blocking of reveal animation
- Minimal memory (Set stores IDs only)
- Events batched efficiently

### Anti-Patterns to Avoid

- ❌ Don't track same product exploration twice
- ❌ Don't block UI with analytics logic
- ❌ Don't track PII (user identity)
- ❌ Don't send events immediately (use batching)
- ❌ Don't forget to update Zustand store

### Future Enhancements (Document as TODOs)

1. **Exploration Sequences:**
   - Track exact order of products explored
   - Identify common paths (e.g., Lavender → Lemongrass → Bundle)
   - A/B test different product layouts

2. **Time to Explore:**
   - How long until first product explored?
   - Time between first and second exploration
   - Engagement velocity metrics

3. **Heatmap Analysis:**
   - Which constellation positions get most attention?
   - Do users explore top-to-bottom? Left-to-right?
   - Optimize layout based on exploration patterns

### References

- [Source: epics.md#Story 8.3] - Products explored tracking requirements
- [Source: architecture.md#State Management] - Zustand pattern for exploration
- [Source: stores/exploration.ts] - productsExplored Set
- [Source: Story 8.1] - Analytics infrastructure
- [Source: Story 4.2] - Collection prompt trigger logic

### Dependencies

**Story 8.1 Complete:** Analytics infrastructure (trackEvent)
**Story 1.8 Complete:** Zustand exploration store with productsExplored Set
**Epic 3 Complete:** TextureReveal component exists
**Story 4.2 Complete:** Collection prompt exists

**Enables:**
- Story 8.4: Session Duration (includes exploration count in summary)
- Business insights on discovery patterns
- Collection prompt optimization

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- Custom hook for exploration tracking (first reveal only)
- Zustand store integration with Set deduplication
- Exploration order calculation (1st, 2nd, 3rd, 4th)
- Collection prompt correlation tracking
- TextureReveal component integration
- Complete test coverage (unit tests)
- Business insights documentation
- Exploration funnel metrics
- Edge case handling (duplicates, all products explored)
- Privacy safeguards (no PII)
- Performance optimization (asynchronous tracking)

**Key insight:** Exploration depth is a leading indicator of purchase intent.

### File List

Files to create:
- app/hooks/use-product-exploration-analytics.ts (custom hook)
- app/hooks/use-product-exploration-analytics.test.ts (unit tests)

Files to modify:
- app/stores/exploration.ts (add getters: getExplorationCount, hasExploredMinimum)
- app/components/product/TextureReveal.tsx (integrate exploration hook)
- app/components/story/StoryMoment.tsx (track collection prompt shown event)

Files to verify:
- app/lib/analytics.ts (from Story 8.1 - trackEvent available)
- Zustand exploration store has productsExplored Set
