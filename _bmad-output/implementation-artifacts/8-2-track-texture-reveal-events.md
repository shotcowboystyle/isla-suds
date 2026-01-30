# Story 8.2: Track Texture Reveal Events

Status: ready-for-dev

## Story

As a **founder**,
I want **to know how many texture reveals are triggered per session**,
so that **I can measure if the core UX is engaging users**.

## Acceptance Criteria

**Given** the analytics infrastructure is in place
**When** a visitor triggers a texture reveal
**Then** an event is tracked with:
- Event name: `texture_reveal`
- Product ID
- Reveal duration (how long it stayed open)
- Reveal timing (Performance API measurement)
**And** events aggregate per session (total reveals count)
**And** events fire via the analytics system
**And** Zustand `textureRevealsTriggered` counter updates

**FRs addressed:** FR34

## Tasks / Subtasks

- [ ] Track texture reveal trigger event (AC: 1-3)
  - [ ] Emit event when texture reveal opens
  - [ ] Include product ID and product title
  - [ ] Measure reveal timing with Performance API
  - [ ] Track reveal duration (time until close)
- [ ] Update Zustand exploration store (AC: 4)
  - [ ] Increment `textureRevealsTriggered` counter
  - [ ] Store count persists for session
  - [ ] Used in session summary analytics
- [ ] Integrate with analytics module (AC: 5)
  - [ ] Use `trackEvent()` from Story 8.1
  - [ ] Batch events automatically
  - [ ] No performance impact on reveal interaction
- [ ] Verify <100ms performance contract (AC: 6)
  - [ ] Analytics tracking doesn't slow reveal
  - [ ] Performance marks don't block animation
  - [ ] Event fires asynchronously

## Dev Notes

### Critical Architecture Requirements

**Performance Contract Protection:**
- The <100ms texture reveal is the core conversion mechanism (architecture.md)
- Analytics tracking MUST NOT slow down the reveal interaction
- Use Performance API marks asynchronously
- Event tracking happens after reveal animation completes
- No network calls during reveal (batching handles this)

**Event Data Schema:**
```typescript
interface TextureRevealEvent {
  name: 'texture_reveal';
  data: {
    productId: string;
    productTitle: string;
    revealDuration: number; // milliseconds reveal was open
    revealTiming: number; // Performance API measurement
    deviceType: 'desktop' | 'mobile';
    interactionType: 'hover' | 'tap';
  };
}
```

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Event Tracking | `trackEvent()` from analytics.ts (Story 8.1) |
| Performance Timing | Performance API (marks and measures) |
| State Management | Zustand exploration store |
| Component Integration | TextureReveal component hooks |

### File Structure

```
app/
  components/
    product/
      TextureReveal.tsx               # Add analytics tracking
      TextureReveal.test.tsx          # Update tests
  hooks/
    use-texture-reveal-analytics.ts   # Custom hook for tracking
    use-texture-reveal-analytics.test.ts
  stores/
    exploration.ts                    # Update with reveal counter
```

### Custom Hook Implementation

**New File: `app/hooks/use-texture-reveal-analytics.ts`**

```typescript
import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useExplorationStore } from '@/stores/exploration';

interface UseTextureRevealAnalyticsOptions {
  productId: string;
  productTitle: string;
  isRevealed: boolean;
}

/**
 * Track texture reveal analytics without impacting performance
 */
export function useTextureRevealAnalytics({
  productId,
  productTitle,
  isRevealed,
}: UseTextureRevealAnalyticsOptions) {
  const revealStartTime = useRef<number | null>(null);
  const performanceMarkStart = useRef<string | null>(null);
  const incrementTextureReveals = useExplorationStore(
    (state) => state.incrementTextureReveals
  );

  useEffect(() => {
    if (isRevealed) {
      // Reveal opened
      revealStartTime.current = Date.now();

      // Performance API mark (asynchronous, non-blocking)
      const markName = `texture-reveal-start-${productId}`;
      performanceMarkStart.current = markName;

      requestIdleCallback(
        () => {
          performance.mark(markName);
        },
        { timeout: 100 }
      );

      // Increment Zustand counter
      incrementTextureReveals();
    } else if (revealStartTime.current !== null) {
      // Reveal closed - calculate duration
      const revealDuration = Date.now() - revealStartTime.current;

      // Measure performance (asynchronous)
      requestIdleCallback(
        () => {
          if (performanceMarkStart.current) {
            const markEnd = `texture-reveal-end-${productId}`;
            const measureName = `texture-reveal-${productId}`;

            performance.mark(markEnd);
            performance.measure(
              measureName,
              performanceMarkStart.current,
              markEnd
            );

            // Get timing from Performance API
            const measure = performance.getEntriesByName(measureName)[0];
            const revealTiming = measure?.duration || 0;

            // Track analytics event
            trackEvent('texture_reveal', {
              productId,
              productTitle,
              revealDuration,
              revealTiming,
              deviceType: window.innerWidth >= 1024 ? 'desktop' : 'mobile',
              interactionType:
                'ontouchstart' in window ? 'tap' : 'hover',
            });

            // Clean up performance marks
            performance.clearMarks(performanceMarkStart.current);
            performance.clearMarks(markEnd);
            performance.clearMeasures(measureName);
          }
        },
        { timeout: 200 }
      );

      // Reset refs
      revealStartTime.current = null;
      performanceMarkStart.current = null;
    }
  }, [isRevealed, productId, productTitle, incrementTextureReveals]);
}
```

### Zustand Store Update

**Modify: `app/stores/exploration.ts`**

```typescript
import { create } from 'zustand';

interface ExplorationState {
  productsExplored: Set<string>;
  textureRevealsTriggered: number; // NEW
  storyMomentShown: boolean;
  sessionStartTime: number;
  cartDrawerOpen: boolean;

  // Actions
  addProductExplored: (productId: string) => void;
  incrementTextureReveals: () => void; // NEW
  setStoryMomentShown: (shown: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  resetExploration: () => void;
}

export const useExplorationStore = create<ExplorationState>((set) => ({
  productsExplored: new Set(),
  textureRevealsTriggered: 0, // NEW
  storyMomentShown: false,
  sessionStartTime: Date.now(),
  cartDrawerOpen: false,

  addProductExplored: (productId) =>
    set((state) => ({
      productsExplored: new Set(state.productsExplored).add(productId),
    })),

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
}));
```

### TextureReveal Component Integration

**Modify: `app/components/product/TextureReveal.tsx`**

```typescript
import { useState } from 'react';
import { useTextureRevealAnalytics } from '@/hooks/use-texture-reveal-analytics';
import type { Product } from '@/types';

interface TextureRevealProps {
  product: Product;
  onClose: () => void;
}

export function TextureReveal({ product, onClose }: TextureRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Analytics tracking (non-blocking)
  useTextureRevealAnalytics({
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

### Performance Verification

**The <100ms Contract Must Be Protected:**

1. **Analytics runs asynchronously:**
   - `requestIdleCallback` ensures non-blocking execution
   - Performance marks happen in idle time
   - Event tracking batches in memory (no network)

2. **Animation is unaffected:**
   - Reveal animation uses GPU-composited properties
   - Analytics hook doesn't interfere with animation state
   - Event fires after animation completes

3. **Testing strategy:**
   - Measure reveal timing with and without analytics
   - Verify p95 timing remains <100ms
   - Use Playwright performance tests

**Test File: `app/hooks/use-texture-reveal-analytics.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTextureRevealAnalytics } from './use-texture-reveal-analytics';
import * as analytics from '@/lib/analytics';
import * as explorationStore from '@/stores/exploration';

vi.mock('@/lib/analytics');
vi.mock('@/stores/exploration');

describe('useTextureRevealAnalytics', () => {
  const mockTrackEvent = vi.spyOn(analytics, 'trackEvent');
  const mockIncrementTextureReveals = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(explorationStore, 'useExplorationStore').mockReturnValue(
      mockIncrementTextureReveals
    );
  });

  it('increments Zustand counter when reveal opens', () => {
    const { rerender } = renderHook(
      ({ isRevealed }) =>
        useTextureRevealAnalytics({
          productId: 'product-1',
          productTitle: 'Lavender Soap',
          isRevealed,
        }),
      { initialProps: { isRevealed: false } }
    );

    // Open reveal
    rerender({ isRevealed: true });

    expect(mockIncrementTextureReveals).toHaveBeenCalledTimes(1);
  });

  it('tracks analytics event when reveal closes', async () => {
    const { rerender } = renderHook(
      ({ isRevealed }) =>
        useTextureRevealAnalytics({
          productId: 'product-1',
          productTitle: 'Lavender Soap',
          isRevealed,
        }),
      { initialProps: { isRevealed: false } }
    );

    // Open reveal
    rerender({ isRevealed: true });

    // Wait for animation
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Close reveal
    rerender({ isRevealed: false });

    // Wait for idle callback
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('texture_reveal', {
      productId: 'product-1',
      productTitle: 'Lavender Soap',
      revealDuration: expect.any(Number),
      revealTiming: expect.any(Number),
      deviceType: expect.stringMatching(/desktop|mobile/),
      interactionType: expect.stringMatching(/hover|tap/),
    });
  });

  it('does not track event if reveal never opened', () => {
    renderHook(() =>
      useTextureRevealAnalytics({
        productId: 'product-1',
        productTitle: 'Lavender Soap',
        isRevealed: false,
      })
    );

    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it('cleans up Performance API marks after tracking', async () => {
    const clearMarksSpy = vi.spyOn(performance, 'clearMarks');
    const clearMeasuresSpy = vi.spyOn(performance, 'clearMeasures');

    const { rerender } = renderHook(
      ({ isRevealed }) =>
        useTextureRevealAnalytics({
          productId: 'product-1',
          productTitle: 'Lavender Soap',
          isRevealed,
        }),
      { initialProps: { isRevealed: false } }
    );

    rerender({ isRevealed: true });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    rerender({ isRevealed: false });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    expect(clearMarksSpy).toHaveBeenCalled();
    expect(clearMeasuresSpy).toHaveBeenCalled();
  });
});
```

### Integration with Session Summary

**When session ends, aggregate reveals:**

```typescript
// In session end tracking (Story 8.4)
const textureRevealsTriggered = useExplorationStore.getState().textureRevealsTriggered;

trackEvent('session_end', {
  sessionDuration: /* ... */,
  textureRevealsTriggered, // Include in session summary
  productsExplored: /* ... */,
  // ...
});
```

### Business Insights

**What the founder learns:**

1. **Engagement Depth:**
   - Average reveals per session
   - Do users explore multiple products?
   - Correlation between reveals and purchases

2. **Interaction Patterns:**
   - Desktop vs mobile engagement
   - Hover vs tap interaction success
   - Reveal duration (how long users engage)

3. **Product Interest:**
   - Which products get most reveals?
   - Do bundle reveals convert better?
   - Correlation with add-to-cart

4. **Performance Validation:**
   - Are reveals actually <100ms?
   - Any performance regressions?
   - Device-specific performance issues

### Privacy & Performance

**Privacy:**
- No PII tracked (only product IDs)
- Aggregated session data only
- Respects Do Not Track (Story 8.1)

**Performance:**
- Analytics runs in idle time
- No blocking of reveal animation
- Minimal memory overhead (<1KB per reveal)
- Events batched and sent efficiently

### Edge Cases

**Rapid Open/Close:**
- User opens and closes reveal quickly (<100ms)
- Still tracks event (captures micro-engagement)
- Duration will be small but valid

**Multiple Opens:**
- User reopens same product multiple times
- Each reveal tracked separately
- Aggregated in session summary

**Performance API Unavailable:**
- Fallback: use Date.now() for timing
- Less accurate but still useful
- No crash or error

**Page Unload During Reveal:**
- sendBeacon ensures event is sent (Story 8.1)
- Duration calculated up to unload time
- No data loss

### Testing Requirements

**Unit Tests:**
- Hook increments Zustand counter
- Hook tracks event on reveal close
- Hook cleans up Performance API marks
- Hook handles rapid open/close

**Integration Tests:**
- TextureReveal component tracks correctly
- Multiple reveals aggregate in store
- Events batched and sent via analytics module

**Performance Tests:**
- Reveal timing remains <100ms with analytics
- No frame drops during reveal animation
- requestIdleCallback executes after reveal completes

### Anti-Patterns to Avoid

- ❌ Don't block reveal animation with analytics
- ❌ Don't send individual events (use batching)
- ❌ Don't track PII (names, emails, addresses)
- ❌ Don't use synchronous Performance API calls
- ❌ Don't forget to clean up Performance marks

### Future Enhancements (Document as TODOs)

1. **Heatmap Tracking:**
   - Track mouse position during hover
   - Identify user attention patterns
   - A/B test different layouts

2. **Reveal Quality Metrics:**
   - Did user click "Add to Cart" after reveal?
   - Did user scroll through scent narrative?
   - Engagement depth beyond open/close

3. **Funnel Analysis:**
   - Reveal → Add to Cart → Checkout
   - Drop-off points in conversion funnel
   - Product-specific conversion rates

### References

- [Source: architecture.md#Architectural Soul: The Texture Reveal] - <100ms performance contract
- [Source: epics.md#Story 8.2] - Texture reveal event requirements
- [Source: architecture.md#Analytics Implementation] - Custom event tracking pattern
- [Source: stores/exploration.ts] - Zustand state management
- [Source: Story 8.1] - Analytics infrastructure and trackEvent API

### Dependencies

**Story 8.1 Complete:** Analytics infrastructure (trackEvent, batching, sendBeacon)
**Epic 3 Complete:** TextureReveal component exists
**Story 1.8 Complete:** Zustand exploration store exists

**Enables:**
- Story 8.4: Session Duration (uses textureRevealsTriggered in summary)
- Business insights on engagement patterns

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- Custom hook for non-blocking analytics tracking
- Performance API integration with asynchronous marks
- Zustand store update with textureRevealsTriggered counter
- TextureReveal component integration pattern
- Protection of <100ms performance contract
- requestIdleCallback ensures no animation blocking
- Event batching via analytics module (Story 8.1)
- Complete test coverage (unit + integration)
- Device type and interaction type detection
- Performance verification strategy
- Business insights documentation
- Privacy safeguards (no PII)

**Critical insight:** Texture reveal is core conversion mechanism - analytics MUST NOT slow it down.

### File List

Files to create:
- app/hooks/use-texture-reveal-analytics.ts (custom analytics hook)
- app/hooks/use-texture-reveal-analytics.test.ts (unit tests)

Files to modify:
- app/stores/exploration.ts (add textureRevealsTriggered counter)
- app/components/product/TextureReveal.tsx (integrate analytics hook)
- app/components/product/TextureReveal.test.tsx (update tests for analytics)

Files to verify:
- app/lib/analytics.ts (from Story 8.1 - trackEvent available)
- Performance tests verify <100ms timing remains
