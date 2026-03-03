# Story WO-1.2: Set Product Quantities — Dev Agent Record

## Story
As a wholesale partner, I want to set a quantity for each product using +/- buttons or by typing directly, so that I can build my order with the exact amounts I need.

## Status: done

## Implementation

### Files Created
- `app/components/wholesale/QuantitySelector.tsx` — New component
- `app/components/wholesale/QuantitySelector.test.tsx` — 14 unit tests

### Files Modified
- `app/components/wholesale/OrderProductCard.tsx` — Added `quantity`, `onQuantityChange` props; integrated QuantitySelector
- `app/components/wholesale/OrderProductCard.test.tsx` — Updated existing tests + 4 integration tests
- `app/routes/wholesale.order.tsx` — Added `useState<Record<string, number>>({})` for quantity state management

### Acceptance Criteria Coverage

| AC | Implementation |
|---|---|
| "+" increments by 1, starts at 0 | `handleIncrement` → `onChange(value + 1)` |
| "-" decrements by 1 (min 0) | `handleDecrement` → guarded `onChange(value - 1)` |
| Direct number input updates quantity | `handleInputChange` → parses and calls `onChange` |
| Skip at 0 (not included in order) | Quantity state defaults to 0; routes can filter `qty > 0` |
| 44x44px touch targets (NFR11) | Buttons use `h-11 w-11` (44px) |
| Fully keyboard-operable (NFR9) | Native `<button>` and `<input>` elements |
| Screen reader announcements (NFR10) | `aria-label` on buttons and input includes product name; `role="group"` on container |

### Architecture Decisions
- `QuantitySelector` uses local `displayValue` state for smooth typing UX. `useEffect([value])` syncs when parent changes value externally.
- `OrderProductCard` receives `quantity` and `onQuantityChange(variantId, qty)` — keeps card stateless.
- Route holds `Record<string, number>` keyed by variant ID; defaults to 0 via `?? 0`.
- `disabled` prop on `QuantitySelector` forwards to all controls — ready for Story 1.4 availability states.

### Tests
- 14 QuantitySelector unit tests: increment, decrement, min-0 guard, typing, aria-labels, disabled state
- 12 OrderProductCard tests: 8 original + 4 integration tests for QuantitySelector wiring

### FRs covered: FR5, FR6, FR7, FR8
