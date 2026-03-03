---
story: wo-3-1-add-place-new-order-cta-on-dashboard
status: review
completedAt: 2026-03-03
branch: feat/wholesale-dashboard-cta
---

# Story WO-3-1: Add "Place New Order" CTA on Dashboard

## Story

As a wholesale partner, I want to see a "Place New Order" button on my dashboard so that I can start a new order directly, whether or not I have past orders.

## Acceptance Criteria

- [x] AC1: "Place New Order" CTA is visible on dashboard when partner has no past orders
- [x] AC2: "Place New Order" CTA is visible on dashboard when partner has past orders
- [x] AC3: CTA navigates to `/wholesale/order`
- [x] AC4: CTA is keyboard accessible (focusable anchor element with accessible label)

## FRs: FR20, FR22

## Tasks

- [x] T1: Add `placeNewOrderButton` content string to `wholesaleContent.dashboard`
- [x] T2: Create `PlaceNewOrderCTA` component (`app/components/wholesale/PlaceNewOrderCTA.tsx`)
  - [x] T2a: Write failing tests first (`PlaceNewOrderCTA.test.tsx`)
  - [x] T2b: Implement component (Link styled with buttonVariants)
  - [x] T2c: Verify tests pass
- [x] T3: Integrate `PlaceNewOrderCTA` into `WholesaleDashboard` (`app/routes/wholesale._index.tsx`)

## Dev Agent Record

### Implementation Plan

1. Add `placeNewOrderButton: 'Place New Order'` to `wholesaleContent.dashboard`
2. Create `PlaceNewOrderCTA` — a presentational component using `Link` from `react-router` styled via `buttonVariants({variant: 'primary', size: 'lg'})` + `w-full` for full-width CTA
3. Integrate into `WholesaleDashboard` between `PartnerAcknowledgment` and `LastOrder` (unconditional — satisfies FR22)
4. Tests wrapped with `MemoryRouter` (established pattern from `Header.test.tsx`, `Footer.test.tsx`)

### Files Changed

| File | Change |
|------|--------|
| `app/content/wholesale.ts` | Added `placeNewOrderButton: 'Place New Order'` to `dashboard` section |
| `app/components/wholesale/PlaceNewOrderCTA.tsx` | New component — Link to `/wholesale/order` styled as primary button |
| `app/components/wholesale/PlaceNewOrderCTA.test.tsx` | New test file — 4 tests (all pass) |
| `app/routes/wholesale._index.tsx` | Imported and rendered `<PlaceNewOrderCTA />` between `PartnerAcknowledgment` and `LastOrder` |

### Key Decisions

- **Separate component for testability**: `PlaceNewOrderCTA` is a zero-prop presentational component. Avoids needing to mock `useLoaderData` in route-level tests.
- **Placement**: After `PartnerAcknowledgment`, before `LastOrder` — CTA is prominent and visible immediately regardless of order state (FR22).
- **`Link` not `Button`**: Navigation action → semantic anchor, not button. Uses `buttonVariants` to match visual design system.
- **No new content keys outside `wholesale.ts`**: All copy goes through the central content module per project conventions.

### Tests Created

**`PlaceNewOrderCTA.test.tsx`** — 4 tests (all passing):
- `renders "Place New Order" text`
- `links to the wholesale order page`
- `is an anchor element (keyboard focusable)`
- `renders without requiring order data (visible regardless of order history)`

### ACs Covered

- [x] AC1 + AC2: Component renders unconditionally (no order prop required) — satisfies FR22
- [x] AC3: `to={WHOLESALE_ROUTES.ORDER}` = `/wholesale/order` — satisfies FR20
- [x] AC4: `Link` renders as `<a>` — natively keyboard focusable; label from content string

### FRs: FR20, FR22

## File List

- `app/content/wholesale.ts`
- `app/components/wholesale/PlaceNewOrderCTA.tsx`
- `app/components/wholesale/PlaceNewOrderCTA.test.tsx`
- `app/routes/wholesale._index.tsx`

## Change Log

- 2026-03-03: WO-3-1 implemented — "Place New Order" CTA on wholesale dashboard (FR20, FR22)
