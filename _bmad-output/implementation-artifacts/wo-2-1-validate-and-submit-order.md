# Story WO-2-1: Validate and Submit Order (Story 2.2: Submit Order & Checkout)

**Status:** Done
**Completed:** 2026-03-03
**Branch:** feat/wholesale-checkout

## Dev Agent Record

### Implementation Summary

Implemented the wholesale order checkout submission flow per AC in Epic WO-2, Story 2.2.

### Files Changed

| File | Change |
|------|--------|
| `app/content/wholesale.ts` | Added `checkoutButtonLoading: 'Processing...'` content string |
| `app/components/wholesale/OrderSummary.tsx` | Added `onCheckout: () => void` and `isLoading?: boolean` props; wired button onClick; loading state (text change, not spinner) |
| `app/components/wholesale/OrderSummary.test.tsx` | Added 5 new tests: onCheckout callback, isLoading state (3 tests), updated all renders to pass onCheckout prop |
| `app/routes/wholesale.order.tsx` | Added `action` (server-side validation, cart.create, checkoutUrl return); updated component with `useFetcher`, `useEffect` redirect, `handleCheckout` submission |

### Implementation Decisions

- **Cart creation pattern**: Matches reorder flow exactly (`context.cart.create()` with `buyerIdentity: { customerAccessToken }`)
- **Form submission**: `fetcher.submit({ quantities: JSON.stringify(quantities) }, { method: 'POST' })` — clean JSON serialization matching arch doc
- **Redirect**: `window.location.href` in `useEffect` on `fetcher.data?.success && fetcher.data.checkoutUrl` — per AC
- **Loading state**: `fetcher.state === 'submitting'` drives `isLoading` prop — text change only, no spinner (NFR18)
- **Server validation**: All quantities must be 0 or ≥ 6 before cart creation (NFR6)
- **Error returns**: Action returns `{ success: false, error }` on all failure paths (Story 2.3 will handle error display)

### Tests Created

**`OrderSummary.test.tsx`** — 5 new tests (25 total, all passing):
- `calls onCheckout when button is clicked and enabled`
- `does not call onCheckout when button is disabled`
- `shows loading text when isLoading is true`
- `disables button when isLoading is true`
- `does not call onCheckout when isLoading is true`

### ACs Covered

- [x] Button shows loading state (text change) on click — `Processing...` text
- [x] Quantities submitted via `useFetcher()`
- [x] Server action validates quantities (0 or ≥ 6)
- [x] Server builds lines array (skipping 0s)
- [x] Server calls `context.cart.create()` with `buyerIdentity`
- [x] Returns `{ success: true, checkoutUrl }` on success
- [x] `useEffect` redirects via `window.location.href` on success
- [x] Wholesale B2B pricing applied via buyer identity (not client-side)

### FRs: FR14, FR16, FR17, FR18, FR19
