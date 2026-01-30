# Story 8.1: Implement Analytics Event Infrastructure

Status: ready-for-dev

## Story

As a **developer**,
I want **a reliable analytics event system using sendBeacon**,
so that **events are captured even when users navigate away or close the tab**.

## Acceptance Criteria

**Given** the analytics infrastructure is needed
**When** I implement the event system
**Then** `app/lib/analytics.ts` exports:
- `trackEvent(name: string, data: object)` function
- `flushEvents()` for manual batch send
- Automatic flush on `beforeunload`
**And** events use `navigator.sendBeacon` for reliability
**And** events batch in memory and send periodically (every 30s) or on unload
**And** events include session ID and timestamp
**And** analytics endpoint is configurable (placeholder for MVP)
**And** no third-party trackers (privacy-first approach)

## Tasks / Subtasks

- [ ] Create analytics module with event batching (AC: 1, 2, 3)
  - [ ] Create `app/lib/analytics.ts`
  - [ ] Implement `trackEvent()` function
  - [ ] Implement `flushEvents()` function
  - [ ] Add automatic flush on `beforeunload`
- [ ] Implement sendBeacon for reliability (AC: 4)
  - [ ] Use `navigator.sendBeacon` for event transmission
  - [ ] Fallback to fetch if sendBeacon unavailable
  - [ ] Handle sendBeacon payload size limits
- [ ] Implement event batching strategy (AC: 5)
  - [ ] Batch events in memory array
  - [ ] Send batch every 30 seconds
  - [ ] Send batch on page unload
  - [ ] Clear batch after successful send
- [ ] Add session tracking metadata (AC: 6)
  - [ ] Generate unique session ID on first load
  - [ ] Store session ID in memory (not localStorage)
  - [ ] Include timestamp in ISO format
  - [ ] Include session ID in every event
- [ ] Configure analytics endpoint (AC: 7)
  - [ ] Create placeholder endpoint URL in env
  - [ ] Document endpoint requirements
  - [ ] Prepare for future integration (Google Analytics 4, Plausible, or custom)
- [ ] Implement privacy-first approach (AC: 8)
  - [ ] No third-party scripts loaded
  - [ ] No cookies for tracking
  - [ ] Session ID only in memory
  - [ ] Respect Do Not Track header
  - [ ] Document privacy stance

## Dev Notes

### Critical Architecture Requirements

**Privacy-First Analytics:**
- No third-party tracking scripts (no Google Analytics, no Facebook Pixel)
- No cookies for tracking (session ID in memory only)
- Respect user privacy preferences (DNT header)
- Minimal data collection (only what's needed for business insights)
- Transparent about what's tracked

**Reliability Pattern:**
- `navigator.sendBeacon` guarantees delivery even on page unload
- Fallback to `fetch` for browsers without sendBeacon support
- Event batching reduces network overhead
- Automatic retry on failure (optional enhancement)

**Developer Responsibility:**
- Create lightweight, reliable event tracking system
- Batch events efficiently to minimize performance impact
- Handle edge cases (page close, network failure, privacy settings)
- Document event schema and usage patterns
- Prepare infrastructure for future analytics integrations

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Event Transport | `navigator.sendBeacon` (fallback to `fetch`) |
| Event Batching | In-memory array with 30s interval |
| Session ID | Crypto.randomUUID() or fallback |
| Endpoint | Configurable ENV variable (placeholder) |
| Privacy | DNT header check, no cookies |

### File Structure

```
app/
  lib/
    analytics.ts                    # Core analytics module
    analytics.test.ts               # Unit tests
  types/
    analytics.ts                    # Event type definitions
tests/
  integration/
    analytics-batching.test.ts      # Batching behavior tests
```

### Analytics Module Implementation

**Core Module: `app/lib/analytics.ts`**

```typescript
// Event type definitions
export interface AnalyticsEvent {
  name: string;
  timestamp: string;
  sessionId: string;
  data: Record<string, any>;
}

// Configuration
const BATCH_INTERVAL = 30000; // 30 seconds
const MAX_BATCH_SIZE = 20; // Max events per batch
const ANALYTICS_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT || '/api/analytics';

// State
let sessionId: string | null = null;
let eventBatch: AnalyticsEvent[] = [];
let batchTimer: NodeJS.Timeout | null = null;
let isFlushScheduled = false;

/**
 * Generate or retrieve session ID
 */
function getSessionId(): string {
  if (sessionId) return sessionId;

  // Use Crypto API if available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    sessionId = crypto.randomUUID();
  } else {
    // Fallback for older browsers
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  return sessionId;
}

/**
 * Check if user has Do Not Track enabled
 */
function isDNTEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Check DNT header
  const dnt = navigator.doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack;
  return dnt === '1' || dnt === 'yes';
}

/**
 * Send batch of events to analytics endpoint
 */
async function sendBatch(events: AnalyticsEvent[]): Promise<boolean> {
  if (events.length === 0) return true;

  const payload = JSON.stringify({ events });

  try {
    // Use sendBeacon for reliability (especially on unload)
    if (typeof navigator.sendBeacon !== 'undefined') {
      const blob = new Blob([payload], { type: 'application/json' });
      const sent = navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);

      if (sent) {
        console.debug(`[Analytics] Sent ${events.length} events via sendBeacon`);
        return true;
      }
    }

    // Fallback to fetch
    const response = await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true, // Keep connection alive during unload
    });

    if (response.ok) {
      console.debug(`[Analytics] Sent ${events.length} events via fetch`);
      return true;
    }

    console.error('[Analytics] Failed to send batch:', response.status);
    return false;
  } catch (error) {
    console.error('[Analytics] Error sending batch:', error);
    return false;
  }
}

/**
 * Flush current batch immediately
 */
export async function flushEvents(): Promise<void> {
  if (eventBatch.length === 0) return;

  const eventsToSend = [...eventBatch];
  eventBatch = []; // Clear batch immediately

  await sendBatch(eventsToSend);

  // Clear scheduled flush
  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }
  isFlushScheduled = false;
}

/**
 * Schedule automatic batch flush
 */
function scheduleFlush(): void {
  if (isFlushScheduled) return;

  isFlushScheduled = true;
  batchTimer = setTimeout(() => {
    flushEvents();
  }, BATCH_INTERVAL);
}

/**
 * Track analytics event
 */
export function trackEvent(name: string, data: Record<string, any> = {}): void {
  // Respect DNT
  if (isDNTEnabled()) {
    console.debug('[Analytics] Event blocked by Do Not Track');
    return;
  }

  const event: AnalyticsEvent = {
    name,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    data,
  };

  eventBatch.push(event);
  console.debug(`[Analytics] Event tracked: ${name}`, data);

  // Flush if batch is full
  if (eventBatch.length >= MAX_BATCH_SIZE) {
    flushEvents();
  } else {
    scheduleFlush();
  }
}

/**
 * Initialize analytics (call from root component)
 */
export function initAnalytics(): void {
  // Generate session ID
  getSessionId();

  // Flush events on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      flushEvents();
    });

    // Also flush on visibility change (mobile tab switch)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flushEvents();
      }
    });
  }

  console.debug('[Analytics] Analytics initialized');
}

/**
 * Get current session ID (for debugging/testing)
 */
export function getAnalyticsSessionId(): string | null {
  return sessionId;
}
```

### Event Type Definitions

**File: `app/types/analytics.ts`**

```typescript
// Core event structure
export interface AnalyticsEvent {
  name: string;
  timestamp: string;
  sessionId: string;
  data: Record<string, any>;
}

// Event batch payload
export interface AnalyticsBatch {
  events: AnalyticsEvent[];
}

// Specific event types (for type safety)
export interface TextureRevealEvent {
  name: 'texture_reveal';
  data: {
    productId: string;
    productTitle: string;
    revealDuration: number; // milliseconds
    revealTiming: number; // Performance API measurement
  };
}

export interface ProductExploredEvent {
  name: 'product_explored';
  data: {
    productId: string;
    productTitle: string;
    explorationOrder: number; // 1st, 2nd, 3rd, 4th
  };
}

export interface SessionEndEvent {
  name: 'session_end';
  data: {
    sessionDuration: number; // seconds
    pagesViewed: number;
    productsExplored: number;
    textureRevealsTriggered: number;
    addedToCart: boolean;
    reachedCheckout: boolean;
  };
}

export interface ShareLinkClickEvent {
  name: 'share_link_click';
  data: {
    referralId: string;
    source: string; // URL param or referrer
  };
}

// Union type for all events
export type TrackedEvent =
  | TextureRevealEvent
  | ProductExploredEvent
  | SessionEndEvent
  | ShareLinkClickEvent;
```

### Root Component Integration

**Modify: `app/root.tsx`**

```typescript
import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';

export function Root() {
  useEffect(() => {
    // Initialize analytics once on app mount
    initAnalytics();
  }, []);

  // ... rest of root component
}
```

### Environment Configuration

**Add to `.env.example`:**

```bash
# Analytics endpoint (optional for MVP)
# Leave empty to log events only (no network calls)
VITE_ANALYTICS_ENDPOINT=/api/analytics

# Set to empty string to disable analytics
# VITE_ANALYTICS_ENDPOINT=
```

**Documentation for Founder:**

```markdown
# Analytics Configuration

## MVP Setup (No Backend Yet)

1. Leave `VITE_ANALYTICS_ENDPOINT` empty or unset
2. Events will be logged to console
3. Batching behavior still works (useful for testing)

## Future Integration Options

### Option 1: Google Analytics 4
- Set endpoint to GA4 Measurement Protocol
- Events batch and send to GA4
- No client-side GA script needed

### Option 2: Plausible Analytics
- Self-hosted or cloud
- Privacy-friendly, GDPR-compliant
- Simple event API endpoint

### Option 3: Custom Backend
- Create `/api/analytics` endpoint in Shopify Functions
- Store events in database
- Build custom reporting dashboard

## Privacy Commitment

- No cookies
- No third-party scripts
- Respects Do Not Track
- Session ID in memory only
- Transparent data collection
```

### Testing Strategy

**Unit Tests: `app/lib/analytics.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackEvent, flushEvents, getAnalyticsSessionId, initAnalytics } from './analytics';

describe('Analytics Module', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    initAnalytics();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('generates unique session ID on init', () => {
    const sessionId = getAnalyticsSessionId();
    expect(sessionId).toBeTruthy();
    expect(typeof sessionId).toBe('string');
  });

  it('tracks event with session ID and timestamp', () => {
    const consoleSpy = vi.spyOn(console, 'debug');

    trackEvent('test_event', { foo: 'bar' });

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Analytics] Event tracked: test_event',
      { foo: 'bar' }
    );
  });

  it('batches events and flushes after 30 seconds', async () => {
    const sendBeaconSpy = vi.spyOn(navigator, 'sendBeacon').mockReturnValue(true);

    trackEvent('event_1', { data: 1 });
    trackEvent('event_2', { data: 2 });

    // Not sent yet
    expect(sendBeaconSpy).not.toHaveBeenCalled();

    // Advance timer to trigger flush
    vi.advanceTimersByTime(30000);
    await vi.runAllTimersAsync();

    // Events sent
    expect(sendBeaconSpy).toHaveBeenCalled();
  });

  it('flushes immediately when batch is full (20 events)', async () => {
    const sendBeaconSpy = vi.spyOn(navigator, 'sendBeacon').mockReturnValue(true);

    // Add 20 events
    for (let i = 0; i < 20; i++) {
      trackEvent(`event_${i}`, { index: i });
    }

    // Should flush immediately
    await vi.runAllTimersAsync();
    expect(sendBeaconSpy).toHaveBeenCalled();
  });

  it('respects Do Not Track setting', () => {
    vi.spyOn(navigator, 'doNotTrack', 'get').mockReturnValue('1');
    const consoleSpy = vi.spyOn(console, 'debug');

    trackEvent('test_event');

    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] Event blocked by Do Not Track');
  });

  it('flushes on beforeunload', async () => {
    const sendBeaconSpy = vi.spyOn(navigator, 'sendBeacon').mockReturnValue(true);

    trackEvent('test_event');

    // Trigger beforeunload
    window.dispatchEvent(new Event('beforeunload'));
    await vi.runAllTimersAsync();

    expect(sendBeaconSpy).toHaveBeenCalled();
  });
});
```

**Integration Tests: `tests/integration/analytics-batching.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackEvent, flushEvents, initAnalytics } from '@/lib/analytics';

describe('Analytics Batching Integration', () => {
  beforeEach(() => {
    initAnalytics();
  });

  it('batches multiple events and sends as single request', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(null, { status: 200 })
    );

    trackEvent('event_1', { value: 1 });
    trackEvent('event_2', { value: 2 });
    trackEvent('event_3', { value: 3 });

    await flushEvents();

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const payload = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    expect(payload.events).toHaveLength(3);
    expect(payload.events[0].name).toBe('event_1');
    expect(payload.events[1].name).toBe('event_2');
    expect(payload.events[2].name).toBe('event_3');
  });

  it('includes session ID in all events from same session', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(null, { status: 200 })
    );

    trackEvent('event_1');
    trackEvent('event_2');

    await flushEvents();

    const payload = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    const sessionId1 = payload.events[0].sessionId;
    const sessionId2 = payload.events[1].sessionId;

    expect(sessionId1).toBeTruthy();
    expect(sessionId1).toBe(sessionId2); // Same session
  });

  it('falls back to fetch when sendBeacon unavailable', async () => {
    // Remove sendBeacon
    const originalSendBeacon = navigator.sendBeacon;
    delete (navigator as any).sendBeacon;

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(null, { status: 200 })
    );

    trackEvent('test_event');
    await flushEvents();

    expect(fetchSpy).toHaveBeenCalled();

    // Restore
    (navigator as any).sendBeacon = originalSendBeacon;
  });
});
```

### Performance Considerations

**Bundle Impact:**
- Analytics module: ~2-3KB gzipped
- No external dependencies
- Minimal runtime overhead

**Network Optimization:**
- Batching reduces HTTP requests (1 request per 30s vs 1 per event)
- sendBeacon uses browser's optimized queue
- No impact on Critical Rendering Path

**Privacy Safeguards:**
- No cookies = no GDPR cookie banner needed
- DNT respected = user control
- Session ID in memory = cleared on browser close
- No third-party scripts = no tracking network

### Edge Cases

**Network Failure:**
- Events lost if send fails
- Optional enhancement: localStorage retry queue
- MVP: Accept data loss for reliability simplicity

**Page Unload Mid-Batch:**
- sendBeacon guarantees delivery
- Events in batch will be sent even after navigation
- No data loss on page transitions

**Long-Running Session:**
- Session ID persists for entire browser session
- No expiration logic needed
- Cleared on browser close (memory only)

**Multiple Tabs:**
- Each tab has own session ID
- Events tracked independently
- No cross-tab coordination needed

### Future Enhancements (Document as TODOs)

1. **Retry Queue:**
   - Store failed batches in localStorage
   - Retry on next page load
   - Expire old events (24 hours)

2. **Event Sampling:**
   - Sample high-frequency events (e.g., scroll)
   - Reduce data volume at scale
   - Configurable sampling rate

3. **User Consent Management:**
   - GDPR-compliant consent banner
   - Only track after explicit opt-in
   - Opt-out mechanism

4. **Analytics Dashboard:**
   - Custom backend endpoint
   - Real-time event stream
   - Aggregated metrics view

### Anti-Patterns to Avoid

- ❌ Don't use localStorage for session ID (privacy concern)
- ❌ Don't load third-party analytics scripts (bundle bloat)
- ❌ Don't ignore Do Not Track (respect user privacy)
- ❌ Don't send individual events (network overhead)
- ❌ Don't track PII (email, name, address)

### References

- [Source: architecture.md#Analytics Implementation] - sendBeacon pattern, privacy-first approach
- [Source: epics.md#Epic 8] - Analytics requirements and event types
- [Source: project-context.md#Performance Budget] - Bundle size constraints
- [Source: CLAUDE.md#Code Quality Standards] - No console.log in production

### Dependencies

**Epic 1 Complete:** Foundation with build tooling for testing
**No Story Blockers:** Infrastructure story, no dependencies

**Enables:**
- Story 8.2: Track Texture Reveal Events
- Story 8.3: Track Products Explored
- Story 8.4: Track Session Duration
- Story 8.6: Track Share Link Clicks

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- Privacy-first analytics architecture (no cookies, no third-party scripts)
- sendBeacon for reliable event delivery during page unload
- Event batching strategy (30s intervals, max 20 events per batch)
- Session ID generation with Crypto.randomUUID fallback
- Do Not Track header respect for user privacy
- Placeholder endpoint configuration for future integrations
- Complete implementation with TypeScript types
- Unit and integration test coverage
- Performance optimization (batching reduces network overhead)
- Edge case handling (network failure, page unload, DNT)
- Future enhancement TODOs (retry queue, sampling, consent)

**Foundation for all analytics tracking** - Enables business insights while respecting user privacy.

### File List

Files to create:
- app/lib/analytics.ts (core analytics module)
- app/lib/analytics.test.ts (unit tests)
- app/types/analytics.ts (event type definitions)
- tests/integration/analytics-batching.test.ts (integration tests)
- docs/analytics-configuration.md (founder documentation)

Files to modify:
- app/root.tsx (initialize analytics on mount)
- .env.example (add VITE_ANALYTICS_ENDPOINT)
