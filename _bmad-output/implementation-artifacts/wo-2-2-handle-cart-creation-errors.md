# Story WO-2-2: Handle Cart Creation Errors (Story 2.3: Cart Creation Error Recovery)

**Status:** Done
**Completed:** 2026-03-03
**Branch:** feat/wholesale-cart-error-recovery

## Dev Agent Record

### Implementation Summary

Implemented cart creation error recovery per AC in Epic WO-2, Story 2.3. Errors are displayed co-located with the checkout button in `OrderSummary` for testability and UX coherence.

### Files Changed

| File | Change |
|------|--------|
| `app/content/wholesale.ts` | Added `cartError: "Something went wrong. Your order is safe — let's try again."` to `order.summary` |
| `app/components/wholesale/OrderSummary.tsx` | Added optional `error?: string` prop; renders `<p role="alert">` above checkout button when truthy |
| `app/components/wholesale/OrderSummary.test.tsx` | Added 5 new tests for error state (display, accessibility, button re-enablement, retry) |
| `app/routes/wholesale.order.tsx` | Derived `checkoutError` from `fetcher.data`; passed to `OrderSummary` as `error` prop |

### Implementation Decisions

- **Error placement**: Error displayed in `OrderSummary` (above checkout button), not as a top-level route banner. Co-location with the retry button matches UX intent and is testable without route mocking.
- **Button re-enablement**: Handled automatically — `isLoading = fetcher.state === 'submitting'` returns false on action completion (success or failure). No additional state needed.
- **Quantity preservation**: State lives in `useState` in route component, unaffected by fetcher response. Preserved automatically (FR27).
- **Error derivation**: `fetcher.data?.success === false ? fetcher.data.error : undefined` — clears error on next submission attempt when fetcher resubmits (state transitions to 'submitting').
- **`role="alert"`**: Ensures screen readers announce the error without requiring `aria-live` on parent (NFR12 coverage).

### Tests Created

**`OrderSummary.test.tsx`** — 5 new tests (30 total, all passing):
- `shows error message when error prop is provided`
- `does not show error message when error prop is undefined`
- `error message is rendered as an alert role for accessibility`
- `checkout button remains enabled after error when quantities are valid`
- `partner can retry after error — onCheckout is callable`

### ACs Covered

- [x] Warm error message displayed on `{ success: false, error }` — "Something went wrong. Your order is safe — let's try again."
- [x] Checkout button returns to enabled state after failure
- [x] All quantity selections preserved (state in React, unaffected by fetcher response)
- [x] Partner can immediately retry without re-entering quantities
- [x] Server-side validation failures also trigger same warm messaging pattern
- [x] Error announced to assistive technology via `role="alert"` (NFR12)

### FRs: FR26, FR27
