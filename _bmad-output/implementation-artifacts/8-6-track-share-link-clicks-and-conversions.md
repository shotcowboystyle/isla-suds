# Story 8.6: Track Share Link Clicks and Conversions

Status: ready-for-dev

## Story

As a **founder**,
I want **to track share link clicks and resulting conversions**,
so that **I can measure word-of-mouth effectiveness**.

## Acceptance Criteria

**Given** a visitor arrives via a share link (URL contains `ref=share_*`)
**When** the page loads
**Then** a tracking event is fired:
- Event name: `share_link_click`
- Referral ID from URL
**And** if this visitor makes a purchase, conversion is attributed to share
**And** founder can see in analytics:
- Total share link clicks
- Conversion rate from shares
- Which share links perform best
**And** attribution persists across session (stored in localStorage)

**FRs addressed:** FR33

## Tasks / Subtasks

- [ ] Detect share link referral parameter (AC: 1)
  - [ ] Parse URL for `ref=share_*` parameter
  - [ ] Extract referral ID
  - [ ] Handle invalid/malformed parameters
- [ ] Track share link click event (AC: 2)
  - [ ] Fire event on page load with referral
  - [ ] Include referral ID, timestamp, landing page
  - [ ] Only fire once per referral (prevent duplicates)
- [ ] Store attribution in localStorage (AC: 3)
  - [ ] Save referral ID for attribution
  - [ ] Persist until purchase or 30 days
  - [ ] Clear after conversion
- [ ] Track conversion attribution (AC: 4)
  - [ ] Include referral ID in checkout events
  - [ ] Track purchase completion with attribution
  - [ ] Link share to revenue
- [ ] Analytics reporting (AC: 5)
  - [ ] Aggregate share link performance
  - [ ] Calculate conversion rates
  - [ ] Identify top performing shares

## Dev Notes

### Critical Architecture Requirements

**Attribution Flow:**
1. User clicks share link: `islasuds.com/?ref=share_abc123`
2. Page loads → detect `ref` parameter
3. Track `share_link_click` event
4. Store referral ID in localStorage
5. User browses, explores, adds to cart
6. User completes checkout
7. Track `purchase` event with referral ID
8. Attribution: purchase linked to share link

**Event Data Schemas:**
```typescript
interface ShareLinkClickEvent {
  name: 'share_link_click';
  data: {
    referralId: string; // e.g., "share_1738276800_a9b3c7"
    landingPage: string; // URL path user landed on
    utmSource?: string; // If additional UTM params present
    timestamp: string;
  };
}

interface PurchaseWithAttributionEvent {
  name: 'purchase_completed';
  data: {
    orderId: string;
    orderTotal: number;
    referralId?: string; // Attribution from share link
    attributionSource: 'share_link' | 'direct' | 'organic' | 'paid';
    // ... other purchase details
  };
}
```

**Attribution Window:**
- 30 days from click to purchase
- Last-click attribution (most recent share link wins)
- Cleared after successful conversion

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| URL Parsing | URLSearchParams API |
| Attribution Storage | localStorage |
| Event Tracking | trackEvent from Story 8.1 |
| Deduplication | sessionStorage flag |
| Checkout Integration | Hydrogen checkout redirect |

### File Structure

```
app/
  hooks/
    use-share-attribution.ts          # Track share link referrals
    use-share-attribution.test.ts
  lib/
    attribution.ts                    # Attribution storage utilities
    attribution.test.ts
  routes/
    _index.tsx                        # Detect referral on landing
    orders.$id.tsx                    # Track conversion
```

### Attribution Utility

**New File: `app/lib/attribution.ts`**

```typescript
const ATTRIBUTION_KEY = 'isla_referral';
const ATTRIBUTION_EXPIRY_KEY = 'isla_referral_expiry';
const ATTRIBUTION_WINDOW_DAYS = 30;

/**
 * Store referral attribution in localStorage
 */
export function storeAttribution(referralId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + ATTRIBUTION_WINDOW_DAYS);

    localStorage.setItem(ATTRIBUTION_KEY, referralId);
    localStorage.setItem(ATTRIBUTION_EXPIRY_KEY, expiryDate.toISOString());

    console.debug(`[Attribution] Stored: ${referralId} (expires ${expiryDate.toISOString()})`);
  } catch (error) {
    console.error('[Attribution] Failed to store:', error);
  }
}

/**
 * Get current referral attribution (if not expired)
 */
export function getAttribution(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const referralId = localStorage.getItem(ATTRIBUTION_KEY);
    const expiryDate = localStorage.getItem(ATTRIBUTION_EXPIRY_KEY);

    if (!referralId || !expiryDate) {
      return null;
    }

    // Check if expired
    if (new Date() > new Date(expiryDate)) {
      clearAttribution();
      console.debug('[Attribution] Expired, cleared');
      return null;
    }

    return referralId;
  } catch (error) {
    console.error('[Attribution] Failed to get:', error);
    return null;
  }
}

/**
 * Clear attribution after conversion
 */
export function clearAttribution(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(ATTRIBUTION_KEY);
    localStorage.removeItem(ATTRIBUTION_EXPIRY_KEY);
    console.debug('[Attribution] Cleared');
  } catch (error) {
    console.error('[Attribution] Failed to clear:', error);
  }
}

/**
 * Check if referral ID has already been tracked this session
 */
export function hasTrackedReferral(referralId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const tracked = sessionStorage.getItem(`tracked_${referralId}`);
    return tracked === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark referral as tracked for this session
 */
export function markReferralTracked(referralId: string): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(`tracked_${referralId}`, 'true');
  } catch (error) {
    console.error('[Attribution] Failed to mark tracked:', error);
  }
}

/**
 * Extract referral ID from URL
 */
export function extractReferralFromUrl(url: string = window.location.href): string | null {
  try {
    const urlObj = new URL(url);
    const ref = urlObj.searchParams.get('ref');

    // Validate format: must start with "share_"
    if (ref && ref.startsWith('share_')) {
      return ref;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Determine attribution source
 */
export function getAttributionSource(): 'share_link' | 'direct' | 'organic' | 'paid' {
  const referralId = getAttribution();

  if (referralId) {
    return 'share_link';
  }

  // Check for UTM parameters (organic/paid)
  const url = new URL(window.location.href);
  const utmSource = url.searchParams.get('utm_source');
  const utmMedium = url.searchParams.get('utm_medium');

  if (utmSource === 'google' || utmMedium === 'cpc') {
    return 'paid';
  }

  if (utmSource || utmMedium) {
    return 'organic';
  }

  return 'direct';
}
```

### Share Attribution Hook

**New File: `app/hooks/use-share-attribution.ts`**

```typescript
import { useEffect } from 'react';
import { useLocation } from '@remix-run/react';
import { trackEvent } from '@/lib/analytics';
import {
  extractReferralFromUrl,
  storeAttribution,
  hasTrackedReferral,
  markReferralTracked,
} from '@/lib/attribution';

/**
 * Detect and track share link referrals
 */
export function useShareAttribution() {
  const location = useLocation();

  useEffect(() => {
    // Extract referral from URL
    const referralId = extractReferralFromUrl(window.location.href);

    if (referralId) {
      // Check if already tracked this session
      if (hasTrackedReferral(referralId)) {
        console.debug(`[Attribution] Already tracked: ${referralId}`);
        return;
      }

      // Store attribution
      storeAttribution(referralId);

      // Track click event
      trackEvent('share_link_click', {
        referralId,
        landingPage: location.pathname,
        utmSource: new URLSearchParams(window.location.search).get('utm_source'),
        timestamp: new Date().toISOString(),
      });

      // Mark as tracked
      markReferralTracked(referralId);

      console.debug(`[Attribution] Tracked share link click: ${referralId}`);

      // Clean up URL (optional - remove ref parameter)
      const url = new URL(window.location.href);
      url.searchParams.delete('ref');
      window.history.replaceState({}, '', url.toString());
    }
  }, [location.pathname]);
}
```

### Root Component Integration

**Modify: `app/root.tsx`**

```typescript
import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';
import { useSessionTracking } from '@/hooks/use-session-tracking';
import { useShareAttribution } from '@/hooks/use-share-attribution';

export function Root() {
  useEffect(() => {
    // Initialize analytics once on app mount
    initAnalytics();
  }, []);

  // Track session lifecycle
  useSessionTracking();

  // Track share link referrals
  useShareAttribution();

  // ... rest of root component
}
```

### Order Confirmation Attribution

**Modify: `app/routes/orders.$id.tsx`**

```typescript
import { useEffect } from 'react';
import { useLoaderData } from '@remix-run/react';
import { trackEvent } from '@/lib/analytics';
import { getAttribution, getAttributionSource, clearAttribution } from '@/lib/attribution';

export async function loader({ params }: LoaderFunctionArgs) {
  const orderId = params.id;
  // Fetch order details from Shopify
  // ...
  return { order };
}

export default function OrderConfirmation() {
  const { order } = useLoaderData<typeof loader>();

  useEffect(() => {
    // Track purchase with attribution
    const referralId = getAttribution();
    const attributionSource = getAttributionSource();

    trackEvent('purchase_completed', {
      orderId: order.id,
      orderTotal: order.totalPrice.amount,
      orderCurrency: order.totalPrice.currencyCode,
      referralId: referralId || undefined,
      attributionSource,
      timestamp: new Date().toISOString(),
    });

    // Clear attribution after successful conversion
    if (referralId) {
      clearAttribution();
      console.debug('[Attribution] Conversion tracked, attribution cleared');
    }
  }, [order]);

  // ... rest of component
}
```

### Testing Strategy

**Unit Tests: `app/lib/attribution.test.ts`**

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  storeAttribution,
  getAttribution,
  clearAttribution,
  extractReferralFromUrl,
  getAttributionSource,
} from './attribution';

describe('Attribution Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stores referral attribution', () => {
    storeAttribution('share_test123');

    expect(localStorage.getItem('isla_referral')).toBe('share_test123');
    expect(localStorage.getItem('isla_referral_expiry')).toBeTruthy();
  });

  it('retrieves valid attribution', () => {
    storeAttribution('share_test123');

    const referralId = getAttribution();
    expect(referralId).toBe('share_test123');
  });

  it('returns null for expired attribution', () => {
    storeAttribution('share_test123');

    // Fast-forward 31 days
    vi.setSystemTime(new Date(Date.now() + 31 * 24 * 60 * 60 * 1000));

    const referralId = getAttribution();
    expect(referralId).toBeNull();
  });

  it('clears attribution', () => {
    storeAttribution('share_test123');
    clearAttribution();

    expect(localStorage.getItem('isla_referral')).toBeNull();
    expect(localStorage.getItem('isla_referral_expiry')).toBeNull();
  });

  it('extracts referral from URL', () => {
    const url = 'https://islasuds.com/?ref=share_abc123';
    const referralId = extractReferralFromUrl(url);

    expect(referralId).toBe('share_abc123');
  });

  it('returns null for invalid referral format', () => {
    const url = 'https://islasuds.com/?ref=invalid';
    const referralId = extractReferralFromUrl(url);

    expect(referralId).toBeNull(); // Must start with "share_"
  });

  it('determines attribution source correctly', () => {
    // Direct (no params)
    expect(getAttributionSource()).toBe('direct');

    // Share link
    storeAttribution('share_test123');
    expect(getAttributionSource()).toBe('share_link');

    clearAttribution();

    // Paid (UTM)
    Object.defineProperty(window, 'location', {
      value: { href: 'https://islasuds.com/?utm_source=google&utm_medium=cpc' },
      writable: true,
    });
    expect(getAttributionSource()).toBe('paid');
  });
});
```

**Hook Tests: `app/hooks/use-share-attribution.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useShareAttribution } from './use-share-attribution';
import * as analytics from '@/lib/analytics';
import * as attribution from '@/lib/attribution';

vi.mock('@/lib/analytics');
vi.mock('@/lib/attribution');
vi.mock('@remix-run/react', () => ({
  useLocation: () => ({ pathname: '/' }),
}));

describe('useShareAttribution', () => {
  const mockTrackEvent = vi.spyOn(analytics, 'trackEvent');
  const mockStoreAttribution = vi.spyOn(attribution, 'storeAttribution');

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: 'https://islasuds.com/?ref=share_test123' },
      writable: true,
    });
  });

  it('tracks share link click on mount', () => {
    vi.spyOn(attribution, 'extractReferralFromUrl').mockReturnValue('share_test123');
    vi.spyOn(attribution, 'hasTrackedReferral').mockReturnValue(false);

    renderHook(() => useShareAttribution());

    expect(mockStoreAttribution).toHaveBeenCalledWith('share_test123');
    expect(mockTrackEvent).toHaveBeenCalledWith('share_link_click', {
      referralId: 'share_test123',
      landingPage: '/',
      utmSource: null,
      timestamp: expect.any(String),
    });
  });

  it('does not track duplicate referral in same session', () => {
    vi.spyOn(attribution, 'extractReferralFromUrl').mockReturnValue('share_test123');
    vi.spyOn(attribution, 'hasTrackedReferral').mockReturnValue(true); // Already tracked

    renderHook(() => useShareAttribution());

    expect(mockStoreAttribution).not.toHaveBeenCalled();
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it('does nothing when no referral in URL', () => {
    vi.spyOn(attribution, 'extractReferralFromUrl').mockReturnValue(null);

    renderHook(() => useShareAttribution());

    expect(mockStoreAttribution).not.toHaveBeenCalled();
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });
});
```

### Business Insights & Analytics

**Share Link Performance Dashboard:**

```sql
-- Total share link clicks
SELECT COUNT(*) as total_clicks
FROM share_link_click_events;

-- Conversion rate from share links
SELECT
  COUNT(DISTINCT slc.referral_id) as share_links_clicked,
  COUNT(DISTINCT pc.referral_id) as share_links_converted,
  ROUND(COUNT(DISTINCT pc.referral_id) * 100.0 / COUNT(DISTINCT slc.referral_id), 2) as conversion_rate
FROM share_link_click_events slc
LEFT JOIN purchase_completed_events pc ON slc.referral_id = pc.referral_id;

-- Top performing share links
SELECT
  slc.referral_id,
  COUNT(slc.event_id) as clicks,
  COUNT(pc.order_id) as conversions,
  SUM(pc.order_total) as revenue,
  ROUND(COUNT(pc.order_id) * 100.0 / COUNT(slc.event_id), 2) as conversion_rate
FROM share_link_click_events slc
LEFT JOIN purchase_completed_events pc ON slc.referral_id = pc.referral_id
GROUP BY slc.referral_id
ORDER BY revenue DESC
LIMIT 20;

-- Attribution source breakdown
SELECT
  attribution_source,
  COUNT(*) as purchases,
  SUM(order_total) as revenue,
  AVG(order_total) as avg_order_value
FROM purchase_completed_events
GROUP BY attribution_source;

-- Share link performance over time
SELECT
  DATE(timestamp) as date,
  COUNT(*) as clicks
FROM share_link_click_events
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

**Key Metrics:**
1. **Click-through rate:** Share links generated vs clicked
2. **Conversion rate:** Share link clicks → purchases
3. **Revenue per share:** Average revenue from share-attributed purchases
4. **Time to conversion:** Days from click to purchase
5. **Referral quality:** Which shares drive highest AOV?

### Edge Cases

**Multiple Share Links:**
- User clicks share link A, then share link B
- Last-click attribution: link B wins
- Fair for single-user journeys

**Attribution Expiry:**
- Click share link, purchase 31 days later
- No attribution (30-day window)
- Conservative attribution (prevents stale data)

**Direct Navigation After Click:**
- Click share link, bookmark site, return via bookmark
- Attribution persists (localStorage)
- Correct: share link deserves credit

**Browser Privacy Mode:**
- localStorage may not work
- Attribution fails gracefully
- Track click event, but can't attribute purchase

**Ad Blockers:**
- May block analytics tracking
- Events not sent
- Acceptable data loss (privacy-focused users)

### Privacy & Performance

**Privacy:**
- Attribution stored in localStorage (user's device)
- No cross-device tracking
- No user identity in referral IDs
- Cleared after conversion (minimal data retention)
- Respects DNT (Story 8.1)

**Performance:**
- URL parsing is instant (<1ms)
- localStorage reads/writes are synchronous but fast
- No network calls on page load (analytics batched)
- URL cleanup prevents ugly URLs

### Anti-Patterns to Avoid

- ❌ Don't track user identity (privacy violation)
- ❌ Don't attribute indefinitely (use expiry)
- ❌ Don't block page load (async tracking)
- ❌ Don't ignore duplicate tracking (sessionStorage flag)
- ❌ Don't forget to clear after conversion (data hygiene)

### Future Enhancements (Document as TODOs)

1. **Multi-Touch Attribution:**
   - Track all share links in journey (not just last)
   - Weighted attribution model
   - First-click, last-click, linear models

2. **Referral Rewards:**
   - Discount for sharer when friend purchases
   - Track successful referrals per user
   - Incentivize sharing

3. **A/B Testing:**
   - Test different share copy
   - Test share sources (footer vs confirmation)
   - Optimize conversion rates

4. **Advanced Analytics:**
   - Time-to-conversion distribution
   - Share link lifecycle (generated → clicked → converted)
   - Cohort analysis (share performance over time)

### References

- [Source: epics.md#Story 8.6] - Share link click and conversion tracking
- [Source: architecture.md#Analytics Implementation] - Attribution pattern
- [Source: Story 8.1] - Analytics infrastructure (trackEvent)
- [Source: Story 8.5] - Share link generation (referral IDs)

### Dependencies

**Story 8.1 Complete:** Analytics infrastructure (trackEvent)
**Story 8.5 Complete:** Share link generation (creates referral IDs)
**Epic 6 Complete:** Order confirmation page exists

**Enables:**
- Complete word-of-mouth attribution
- ROI measurement for organic sharing
- Share link optimization
- Business insights on viral growth

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- Attribution utilities for localStorage storage
- 30-day attribution window with expiry
- URL parsing to extract referral IDs
- Deduplication via sessionStorage (prevent double-tracking)
- useShareAttribution hook for automatic detection
- Root component integration (tracks on all pages)
- Order confirmation conversion tracking
- Attribution clearing after purchase
- Attribution source detection (share_link, direct, organic, paid)
- Last-click attribution model
- Complete test coverage (unit + hook tests)
- Business insights SQL queries
- Analytics dashboard metrics
- Edge case handling (expiry, multiple shares, privacy mode)
- Privacy safeguards (device-only storage, no user identity)
- Performance optimization (instant parsing, no blocking)

**Completes Epic 8 analytics stack** - Full attribution from share link generation to conversion tracking.

### File List

Files to create:
- app/lib/attribution.ts (attribution storage and utilities)
- app/lib/attribution.test.ts (unit tests)
- app/hooks/use-share-attribution.ts (referral detection hook)
- app/hooks/use-share-attribution.test.ts (hook tests)

Files to modify:
- app/root.tsx (integrate useShareAttribution hook)
- app/routes/orders.$id.tsx (track purchase with attribution, clear after conversion)

Files to verify:
- app/lib/analytics.ts (from Story 8.1 - trackEvent available)
- app/lib/share.ts (from Story 8.5 - referral ID format matches)
