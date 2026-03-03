---
story: wo-3-2-add-new-order-link-in-wholesale-header
status: review
completedAt: 2026-03-03
branch: feat/wholesale-header-nav-link
---

# Story WO-3-2: Header Navigation "New Order" Link

## Story

As a wholesale partner, I want a "New Order" link in the wholesale header navigation so that I can reach the order page from anywhere in the portal.

## Acceptance Criteria

- [x] AC1: "New Order" link is present in the wholesale header navigation
- [x] AC2: Link navigates to `/wholesale/order`
- [x] AC3: Link shows as `aria-current="page"` (active state) when on the order page, with underline visual indicator
- [x] AC4: Link is a native anchor element — keyboard accessible in natural tab order

## FRs: FR21

## Tasks

- [x] T1: Add `newOrderLink: 'New Order'` to `wholesaleContent.header` in `app/content/wholesale.ts`
- [x] T2: Write failing tests (`WholesaleHeader.test.tsx`)
  - [x] T2a: Test "New Order" link renders in nav
  - [x] T2b: Test link href is `/wholesale/order`
  - [x] T2c: Test link is an anchor element
  - [x] T2d: Test `aria-current="page"` when on `/wholesale/order`
  - [x] T2e: Test no `aria-current` on other pages
- [x] T3: Update `WholesaleHeader.tsx` — add "New Order" nav link with `useLocation`-based active state
  - [x] T3a: Import `useLocation` from `react-router`
  - [x] T3b: Derive `isOrderPage` from `location.pathname === WHOLESALE_ROUTES.ORDER`
  - [x] T3c: Add Link with `aria-current` + underline when active
  - [x] T3d: Verify all 5 tests pass

## Dev Agent Record

### Implementation Plan

1. Add `newOrderLink: 'New Order'` to `wholesaleContent.header` — keeps all copy centralized per project conventions
2. Create `WholesaleHeader.test.tsx` — 5 tests covering all ACs; mock `useFetcher` (requires data router context not available in `MemoryRouter` in RR7)
3. Add "New Order" link to nav between "Dashboard" and "Order History" using `useLocation` for active state detection

### Files Changed

| File | Change |
|------|--------|
| `app/content/wholesale.ts` | Added `newOrderLink: 'New Order'` to `header` section |
| `app/components/wholesale/WholesaleHeader.tsx` | Added `useLocation` import, `isOrderPage` derived state, "New Order" nav link |
| `app/components/wholesale/WholesaleHeader.test.tsx` | New test file — 5 tests (all pass) |

### Key Decisions

- **`useLocation` not `NavLink`**: Existing nav links use `Link`. Used `useLocation` to compute active state, keeping the new link consistent with the pattern rather than introducing `NavLink` for one item.
- **`aria-current="page"` + underline**: Accessibility-first active state. `aria-current="page"` communicates active state to screen readers; underline provides the visual indicator (AC3).
- **Link placement**: Between Dashboard and Order History — logical order: Home → New Order → History.
- **Mock `useFetcher` in tests**: React Router v7 `useFetcher` requires a data router, not available in `MemoryRouter`. Mocked only `useFetcher`, preserving all other RR7 exports so `MemoryRouter`, `Link`, and `useLocation` work correctly.

### Tests Created

**`WholesaleHeader.test.tsx`** — 5 tests (all passing):
- `renders "New Order" link in the navigation`
- `"New Order" link navigates to /wholesale/order`
- `"New Order" link is an anchor element (keyboard accessible)`
- `marks "New Order" link as aria-current="page" when on /wholesale/order`
- `does not mark "New Order" link as aria-current when on other pages`

### ACs Covered

- [x] AC1: Link renders in `<nav>` — confirmed by test
- [x] AC2: `to={WHOLESALE_ROUTES.ORDER}` = `/wholesale/order` — confirmed by test
- [x] AC3: `aria-current="page"` + `underline` class when `isOrderPage` — confirmed by tests
- [x] AC4: `Link` renders as `<a>` — natively keyboard focusable; natural tab order in nav

### FRs: FR21

## File List

- `app/content/wholesale.ts`
- `app/components/wholesale/WholesaleHeader.tsx`
- `app/components/wholesale/WholesaleHeader.test.tsx`

## Change Log

- 2026-03-03: WO-3-2 implemented — "New Order" nav link in wholesale header (FR21)
