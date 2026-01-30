# Story 8.4: Track Session Duration

Status: ready-for-dev

## Story

As a **founder**,
I want **to know how long visitors spend on the site**,
so that **I can measure if the "permission to slow down" philosophy is working**.

## Acceptance Criteria

**Given** the analytics infrastructure is in place
**When** a visitor's session ends (close tab, navigate away, or 30min idle)
**Then** a session summary event is tracked with:
- Event name: `session_end`
- Session duration in seconds
- Pages viewed
- Products explored count
- Texture reveals triggered count
- Whether add-to-cart occurred
- Whether checkout was reached
**And** session start time is captured in Zustand `sessionStartTime`
**And** event fires on `beforeunload` or idle timeout

**FRs addressed:** FR36

## Tasks / Subtasks

- [ ] Track session start time (AC: 1)
  - [ ] Record timestamp on app mount
  - [ ] Store in Zustand sessionStartTime
  - [ ] Persist for session duration (in-memory)
- [ ] Detect session end events (AC: 2)
  - [ ] Listen for `beforeunload` (tab close, navigation)
  - [ ] Listen for `visibilitychange` (tab switch)
  - [ ] Implement idle timeout (30 minutes)
  - [ ] Handle page navigation within site
- [ ] Calculate session duration (AC: 3)
  - [ ] Measure time from sessionStartTime to end
  - [ ] Convert to seconds
  - [ ] Include in session summary
- [ ] Aggregate session data (AC: 4-8)
  - [ ] Pages viewed count
  - [ ] Products explored from Zustand
  - [ ] Texture reveals from Zustand
  - [ ] Add-to-cart occurred (check cart state)
  - [ ] Checkout reached (track navigation)
- [ ] Send session summary event (AC: 9)
  - [ ] Use sendBeacon for reliability
  - [ ] Include all session metrics
  - [ ] Fire on all end conditions

## Dev Notes

### Critical Architecture Requirements

**Session End Definition:**
- **Tab close/refresh:** `beforeunload` event
- **Navigation away:** User clicks external link
- **Tab switch (mobile):** `visibilitychange` to hidden state
- **Idle timeout:** No interaction for 30 minutes
- **All cases:** Use sendBeacon to guarantee delivery (Story 8.1)

**Event Data Schema:**
```typescript
interface SessionEndEvent {
  name: 'session_end';
  data: {
    sessionDuration: number; // seconds
    sessionStartTime: string; // ISO timestamp
    sessionEndTime: string; // ISO timestamp
    pagesViewed: number;
    productsExplored: number;
    productsExploredList: string[]; // Product IDs
    textureRevealsTriggered: number;
    addedToCart: boolean;
    reachedCheckout: boolean;
    collectionPromptShown: boolean;
    deviceType: 'desktop' | 'mobile';
    exitReason: 'beforeunload' | 'visibility_hidden' | 'idle_timeout' | 'navigation';
  };
}
```

**Business Questions Answered:**
1. Do users spend time exploring or bounce quickly?
2. Does longer time on site correlate with purchases?
3. Is the "slow down" philosophy working? (vs industry avg ~45 seconds)
4. Do users who explore more products stay longer?
5. What's the engagement depth before conversion?

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Event Tracking | `trackEvent()` + `flushEvents()` from analytics.ts |
| Session Timing | Zustand sessionStartTime + Date.now() |
| End Detection | beforeunload, visibilitychange, idle timer |
| Page Tracking | React Router navigation events |
| Cart Detection | Hydrogen cart context |

### File Structure

```
app/
  hooks/
    use-session-tracking.ts              # Session lifecycle tracking
    use-session-tracking.test.ts
    use-idle-timeout.ts                  # Idle detection
    use-page-views.ts                    # Page view counting
  stores/
    exploration.ts                       # Update with session methods
```

### Session Tracking Hook

**New File: `app/hooks/use-session-tracking.ts`**

```typescript
import { useEffect, useRef } from 'react';
import { useLocation } from '@remix-run/react';
import { trackEvent, flushEvents } from '@/lib/analytics';
import { useExplorationStore } from '@/stores/exploration';
import { useCart } from '@shopify/hydrogen';

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Track session lifecycle and send summary on end
 */
export function useSessionTracking() {
  const location = useLocation();
  const pageViewsRef = useRef(new Set<string>());
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTrackedSessionEndRef = useRef(false);

  const sessionStartTime = useExplorationStore((state) => state.sessionStartTime);
  const productsExplored = useExplorationStore((state) => state.productsExplored);
  const textureRevealsTriggered = useExplorationStore(
    (state) => state.textureRevealsTriggered
  );
  const storyMomentShown = useExplorationStore((state) => state.storyMomentShown);

  const cart = useCart();

  /**
   * Track page view
   */
  useEffect(() => {
    pageViewsRef.current.add(location.pathname);
  }, [location.pathname]);

  /**
   * Send session summary
   */
  const sendSessionSummary = (exitReason: string) => {
    // Prevent duplicate session end events
    if (hasTrackedSessionEndRef.current) return;
    hasTrackedSessionEndRef.current = true;

    const sessionEndTime = Date.now();
    const sessionDuration = Math.floor((sessionEndTime - sessionStartTime) / 1000);

    // Check if user added to cart
    const addedToCart = cart && cart.lines && cart.lines.length > 0;

    // Check if user reached checkout
    const reachedCheckout = pageViewsRef.current.has('/cart') ||
      Array.from(pageViewsRef.current).some(path => path.includes('checkout'));

    const sessionSummary = {
      sessionDuration,
      sessionStartTime: new Date(sessionStartTime).toISOString(),
      sessionEndTime: new Date(sessionEndTime).toISOString(),
      pagesViewed: pageViewsRef.current.size,
      productsExplored: productsExplored.size,
      productsExploredList: Array.from(productsExplored),
      textureRevealsTriggered,
      addedToCart: Boolean(addedToCart),
      reachedCheckout: Boolean(reachedCheckout),
      collectionPromptShown: storyMomentShown,
      deviceType: window.innerWidth >= 1024 ? 'desktop' : 'mobile',
      exitReason,
    };

    // Track session end event
    trackEvent('session_end', sessionSummary);

    // Flush immediately (critical for unload events)
    flushEvents();

    console.debug('[Session] Session ended:', sessionSummary);
  };

  /**
   * Reset idle timer on user interaction
   */
  const resetIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      console.debug('[Session] Idle timeout reached');
      sendSessionSummary('idle_timeout');
    }, IDLE_TIMEOUT);
  };

  /**
   * Handle beforeunload (tab close, refresh)
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      sendSessionSummary('beforeunload');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionStartTime, productsExplored, textureRevealsTriggered, storyMomentShown, cart]);

  /**
   * Handle visibilitychange (tab switch, minimize)
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // User switched tabs or minimized
        sendSessionSummary('visibility_hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionStartTime, productsExplored, textureRevealsTriggered, storyMomentShown, cart]);

  /**
   * Initialize idle timer and reset on interactions
   */
  useEffect(() => {
    resetIdleTimer();

    // Reset on any user interaction
    const interactionEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    interactionEvents.forEach((event) => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      interactionEvents.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, []);

  /**
   * Track navigation events (SPA routing)
   */
  useEffect(() => {
    // If navigating to external site
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;

      if (target.tagName === 'A' && target.href) {
        const url = new URL(target.href);

        // Check if external link
        if (url.origin !== window.location.origin) {
          sendSessionSummary('navigation');
        }
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [sessionStartTime, productsExplored, textureRevealsTriggered, storyMomentShown, cart]);
}
```

### Root Component Integration

**Modify: `app/root.tsx`**

```typescript
import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';
import { useSessionTracking } from '@/hooks/use-session-tracking';

export function Root() {
  useEffect(() => {
    // Initialize analytics once on app mount
    initAnalytics();
  }, []);

  // Track session lifecycle
  useSessionTracking();

  // ... rest of root component
}
```

### Testing Strategy

**Unit Tests: `app/hooks/use-session-tracking.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionTracking } from './use-session-tracking';
import * as analytics from '@/lib/analytics';
import * as explorationStore from '@/stores/exploration';
import * as hydrogen from '@shopify/hydrogen';

vi.mock('@/lib/analytics');
vi.mock('@/stores/exploration');
vi.mock('@shopify/hydrogen');
vi.mock('@remix-run/react', () => ({
  useLocation: () => ({ pathname: '/' }),
}));

describe('useSessionTracking', () => {
  const mockTrackEvent = vi.spyOn(analytics, 'trackEvent');
  const mockFlushEvents = vi.spyOn(analytics, 'flushEvents');

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock Zustand store
    vi.spyOn(explorationStore, 'useExplorationStore').mockImplementation(
      (selector: any) => {
        const state = {
          sessionStartTime: Date.now() - 60000, // 1 minute ago
          productsExplored: new Set(['product-1', 'product-2']),
          textureRevealsTriggered: 3,
          storyMomentShown: true,
        };
        return selector(state);
      }
    );

    // Mock Hydrogen cart
    vi.spyOn(hydrogen, 'useCart').mockReturnValue({
      lines: [{ id: 'line-1' }],
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sends session summary on beforeunload', () => {
    renderHook(() => useSessionTracking());

    // Trigger beforeunload
    window.dispatchEvent(new Event('beforeunload'));

    expect(mockTrackEvent).toHaveBeenCalledWith('session_end', {
      sessionDuration: expect.any(Number),
      sessionStartTime: expect.any(String),
      sessionEndTime: expect.any(String),
      pagesViewed: expect.any(Number),
      productsExplored: 2,
      productsExploredList: ['product-1', 'product-2'],
      textureRevealsTriggered: 3,
      addedToCart: true,
      reachedCheckout: false,
      collectionPromptShown: true,
      deviceType: expect.stringMatching(/desktop|mobile/),
      exitReason: 'beforeunload',
    });

    expect(mockFlushEvents).toHaveBeenCalled();
  });

  it('sends session summary on visibility hidden', () => {
    renderHook(() => useSessionTracking());

    // Mock visibility change
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });

    document.dispatchEvent(new Event('visibilitychange'));

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'session_end',
      expect.objectContaining({
        exitReason: 'visibility_hidden',
      })
    );
  });

  it('sends session summary after 30 minutes of idle', async () => {
    renderHook(() => useSessionTracking());

    // Fast-forward 30 minutes
    await act(async () => {
      vi.advanceTimersByTime(30 * 60 * 1000);
    });

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'session_end',
      expect.objectContaining({
        exitReason: 'idle_timeout',
      })
    );
  });

  it('resets idle timer on user interaction', async () => {
    renderHook(() => useSessionTracking());

    // User interacts at 25 minutes
    await act(async () => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });

    window.dispatchEvent(new MouseEvent('mousedown'));

    // Fast-forward another 25 minutes (total 50 min, but timer reset at 25)
    await act(async () => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });

    // Should not have sent yet (timer was reset)
    expect(mockTrackEvent).not.toHaveBeenCalled();

    // Fast-forward final 5 minutes to reach 30 after reset
    await act(async () => {
      vi.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(mockTrackEvent).toHaveBeenCalled();
  });

  it('tracks page views correctly', () => {
    const { rerender } = renderHook(
      ({ pathname }) => {
        vi.spyOn(require('@remix-run/react'), 'useLocation').mockReturnValue({
          pathname,
        });
        useSessionTracking();
      },
      { initialProps: { pathname: '/' } }
    );

    rerender({ pathname: '/about' });
    rerender({ pathname: '/cart' });

    window.dispatchEvent(new Event('beforeunload'));

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'session_end',
      expect.objectContaining({
        pagesViewed: 3, // /, /about, /cart
        reachedCheckout: true, // /cart visited
      })
    );
  });

  it('prevents duplicate session end events', () => {
    renderHook(() => useSessionTracking());

    window.dispatchEvent(new Event('beforeunload'));
    window.dispatchEvent(new Event('beforeunload')); // Duplicate

    expect(mockTrackEvent).toHaveBeenCalledTimes(1); // Only once
  });
});
```

### Business Insights

**What the founder learns:**

1. **Time on Site Metrics:**
   - Average session duration
   - Distribution: <30s, 30s-1min, 1-3min, 3-5min, 5min+
   - Compare to industry average (~45 seconds for e-commerce)

2. **"Slow Down" Philosophy Validation:**
   - Are users taking time to explore?
   - Longer sessions = better brand connection
   - Correlation between session duration and purchase

3. **Engagement Patterns:**
   - Do longer sessions explore more products?
   - Do users who reach checkout spend more time?
   - Drop-off points (where do short sessions exit?)

4. **Device Differences:**
   - Desktop vs mobile session duration
   - Mobile users may have shorter sessions (distractions)
   - Optimize for each device type

### Session Duration Benchmarks

**Industry Averages (E-commerce):**
- Overall average: ~45 seconds
- Purchase intent users: 2-5 minutes
- Window shoppers: <30 seconds

**Isla Suds Target:**
- Aim for 2-3 minutes average (intentional exploration)
- Deep engagement: 5+ minutes
- Bounce rate: <30% sessions <30s

**Success Metrics:**
```sql
-- Average session duration
SELECT AVG(session_duration) FROM session_end_events;

-- Session duration by conversion
SELECT
  CASE
    WHEN added_to_cart THEN 'Converted'
    ELSE 'Did Not Convert'
  END as conversion_status,
  AVG(session_duration) as avg_duration,
  COUNT(*) as sessions
FROM session_end_events
GROUP BY conversion_status;

-- Session duration distribution
SELECT
  CASE
    WHEN session_duration < 30 THEN '< 30s'
    WHEN session_duration < 60 THEN '30s - 1min'
    WHEN session_duration < 180 THEN '1min - 3min'
    WHEN session_duration < 300 THEN '3min - 5min'
    ELSE '5min+'
  END as duration_bucket,
  COUNT(*) as sessions,
  AVG(CASE WHEN added_to_cart THEN 1 ELSE 0 END) as conversion_rate
FROM session_end_events
GROUP BY duration_bucket;
```

### Edge Cases

**Very Short Sessions (<5s):**
- Likely bounces (wrong site, accidental click)
- Still track (useful for bounce rate calculation)
- Exclude from engagement analysis

**Very Long Sessions (>1 hour):**
- User may have left tab open
- Idle timeout (30min) should catch this
- Cap at reasonable maximum for analysis

**Multiple Tabs:**
- Each tab = separate session (in-memory state)
- No cross-tab coordination
- Accurate for total site engagement

**Browser Crash:**
- Session end event may not fire
- Data loss is acceptable (rare occurrence)
- sendBeacon improves reliability

### Privacy & Performance

**Privacy:**
- No user identity tracked
- Aggregated session metrics only
- No cross-session linking
- Respects DNT (Story 8.1)

**Performance:**
- Idle timer has negligible overhead
- Event listeners are passive
- sendBeacon ensures no blocking
- Session summary sent once per session

### Anti-Patterns to Avoid

- ❌ Don't track sessions across browser close (privacy)
- ❌ Don't send session updates continuously (use summary)
- ❌ Don't block page unload (use sendBeacon)
- ❌ Don't forget idle timeout (long sessions skew data)
- ❌ Don't track PII (IP, user agent, etc)

### Future Enhancements (Document as TODOs)

1. **Engagement Score:**
   - Combine duration + exploration + reveals
   - Single metric for engagement quality
   - Predict conversion likelihood

2. **Time on Page:**
   - Track time per route
   - Identify most engaging pages
   - Optimize content placement

3. **Session Recording:**
   - Optional: privacy-respecting session replay
   - Understand user journeys visually
   - Debug UX issues

4. **Real-Time Analytics:**
   - Track active users on site
   - Monitor engagement in real-time
   - Founder dashboard

### References

- [Source: epics.md#Story 8.4] - Session duration tracking requirements
- [Source: architecture.md#Analytics Implementation] - sendBeacon pattern
- [Source: prd.md#Brand Philosophy] - "Permission to slow down"
- [Source: Story 8.1] - Analytics infrastructure (trackEvent, flushEvents, sendBeacon)
- [Source: Story 8.2] - Texture reveals tracking
- [Source: Story 8.3] - Products explored tracking

### Dependencies

**Story 8.1 Complete:** Analytics infrastructure (trackEvent, flushEvents, sendBeacon)
**Story 8.2 Complete:** Texture reveals tracking (included in summary)
**Story 8.3 Complete:** Products explored tracking (included in summary)
**Story 1.8 Complete:** Zustand exploration store with sessionStartTime

**Enables:**
- Business insights on "slow down" philosophy effectiveness
- Engagement depth analysis
- Conversion correlation with time on site

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- Session lifecycle tracking hook
- Multiple end detection mechanisms (beforeunload, visibilitychange, idle timeout)
- Idle timeout with reset on user interaction (30 minutes)
- Page view counting with React Router integration
- Cart state detection via Hydrogen cart context
- Checkout detection via route tracking
- Comprehensive session summary event
- sendBeacon for reliable delivery on unload
- Duplicate prevention (session ends only once)
- Complete test coverage (unit tests)
- Business insights and benchmarks
- "Slow down" philosophy validation metrics
- Edge case handling (very short/long sessions, multiple tabs)
- Privacy safeguards (no user identity, no cross-session tracking)

**Key insight:** Session duration validates brand philosophy of intentional, unhurried exploration.

### File List

Files to create:
- app/hooks/use-session-tracking.ts (session lifecycle tracking)
- app/hooks/use-session-tracking.test.ts (unit tests)

Files to modify:
- app/root.tsx (integrate useSessionTracking hook)

Files to verify:
- app/lib/analytics.ts (from Story 8.1 - trackEvent, flushEvents available)
- app/stores/exploration.ts (sessionStartTime exists)
- Hydrogen cart context accessible
