---
story: wo-1-4-product-availability-states
status: done
completedAt: 2026-03-03
branch: feat/wholesale-product-availability-states
---

# Dev Agent Record — WO-1-4: Product Availability States

## Story

As a wholesale partner, I want to see when a product is temporarily unavailable with its ordering disabled, so that I know what I can and cannot order right now.

## Acceptance Criteria Coverage

| AC | Status |
|----|--------|
| Product card shows with reduced opacity when `availableForSale: false` | ✅ |
| "Currently unavailable" message displayed on card | ✅ |
| Quantity selector disabled (no +/-, no typing) | ✅ (was pre-existing; `disabled` prop already wired) |
| Disabled state communicated to screen readers via `aria-disabled` on group | ✅ |

## Implementation

### Files Changed

| File | Change |
|------|--------|
| `app/components/wholesale/OrderProductCard.tsx` | MODIFIED — `opacity-60` on article when unavailable; "Currently unavailable" `<p>` rendered when unavailable |
| `app/components/wholesale/QuantitySelector.tsx` | MODIFIED — `aria-disabled={disabled}` on `role="group"` wrapper |
| `app/components/wholesale/OrderProductCard.test.tsx` | MODIFIED — 4 new tests for unavailability message and opacity |
| `app/components/wholesale/QuantitySelector.test.tsx` | MODIFIED — 2 new tests for `aria-disabled` on group |

### Key Decisions

**Pre-existing work reused:** `isDisabled = !variant.availableForSale`, `disabled` prop on `QuantitySelector`, and `wholesaleContent.order.productUnavailable = 'Currently unavailable'` were already in place from earlier stories. Story 1.4 only added the visual card treatment and screen reader group announcement.

**`opacity-60` on article:** Chosen to visually communicate unavailability at card level while remaining legible. Consistent with Tailwind's disabled opacity patterns in the project.

**`aria-disabled` on group wrapper:** HTML `disabled` on individual form controls handles functional disabling. `aria-disabled="true"` on the `role="group"` wrapper makes the group's disabled state explicit and announced to assistive technology when navigating to the group.

**No `aria-live` region:** The "Currently unavailable" message is statically rendered when the page loads (availability is a server-fetched state). Static text in the natural reading order is sufficient — `aria-live` is for dynamic content changes.

## Tests

All 6 new tests pass. Coverage:
- "Currently unavailable" text shown for `availableForSale: false`
- "Currently unavailable" text absent when product is available
- `opacity-60` class applied to article when unavailable
- `opacity-60` class absent when available
- Group has `aria-disabled="true"` when disabled
- Group does not have `aria-disabled="true"` when not disabled

Full wholesale component suite: 32/32 tests pass (pre-existing failures in `LastOrder` and `OrderStatusBadge` are unrelated).
