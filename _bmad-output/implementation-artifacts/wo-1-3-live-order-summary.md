---
story: wo-1-3-live-order-summary
status: done
completedAt: 2026-03-03
branch: feat/wholesale-live-order-summary
---

# Dev Agent Record — WO-1-3: Live Order Summary

## Story

As a wholesale partner, I want to see a running order summary that updates instantly as I change quantities, so that I can review my selections and totals before proceeding.

## Acceptance Criteria Coverage

| AC | Status |
|----|--------|
| Shows selected products with name, qty, line total when qty > 0 | ✅ |
| Shows order subtotal | ✅ |
| Updates in <50ms (pure React state — no async, no debounce) | ✅ |
| Empty state when all quantities are 0 | ✅ |
| Mobile (<640px): summary below product grid | ✅ |
| Desktop (1024px+): summary as sidebar | ✅ |
| Checkout button present but non-functional (Epic 2 scope) | ✅ |

## Implementation

### Files Changed

| File | Change |
|------|--------|
| `app/components/wholesale/OrderSummary.tsx` | NEW — `OrderSummary` component |
| `app/components/wholesale/OrderSummary.test.tsx` | NEW — 16 unit tests |
| `app/content/wholesale.ts` | MODIFIED — added `order.summary` content strings |
| `app/routes/wholesale.order.tsx` | MODIFIED — responsive layout + `OrderSummary` integration |

### Key Decisions

**Line total calculation:** `parseFloat(price.amount) * quantity` with `.toFixed(2)` — used for display only. Actual pricing at checkout is handled exclusively by Shopify B2B buyer identity (NFR7 preserved).

**Responsive layout:** `sm:flex-row` at 640px — sidebar appears at tablet+ breakpoint. Product grid uses `flex-1` to fill remaining space; summary uses `sm:w-72 lg:w-80` fixed width.

**Checkout button:** Always `disabled` in this story. Epic 2 (wo-2-1) will add MOQ validation and enable/disable logic.

**Money component:** Constructed synthetic `{amount, currencyCode}` objects for line totals and subtotal, passed to Hydrogen's `<Money>` for consistent currency formatting.

## Tests

All 16 tests pass. Coverage includes:
- Empty state (no quantities, all-zero quantities)
- No subtotal shown in empty state
- Line items render for qty > 0 products
- Correct line total calculation (qty × unit price)
- Products with qty=0 excluded from line items
- Multiple selected items rendered
- Subtotal = sum of all line totals
- Single product: line total and subtotal both display same value
- Order Summary heading rendered
- `<aside>` with `aria-label` (complementary landmark)
- Checkout button present
- Checkout button disabled (empty and with items)
