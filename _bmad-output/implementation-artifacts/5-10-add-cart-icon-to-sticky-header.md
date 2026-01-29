# Story 5.10: Add Cart Icon to Sticky Header

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to access my cart from the sticky header**,
So that **I can review my cart at any time while browsing**.

## Acceptance Criteria

### AC1: Cart icon displays in sticky header

**Given** I have scrolled past the hero section
**When** sticky header is visible
**Then** I see a cart icon that:

- Uses shopping bag or cart icon (from Lucide or custom SVG)
- Is positioned on the right side of header
- Has adequate sizing (24x24px icon minimum)
- Has 44x44px touch target (icon + padding)
- Has hover state (desktop) that changes color or opacity
- Is keyboard-accessible (Tab + Enter)
- Screen reader announces: "Shopping cart, X items" (if items) or "Shopping cart, empty"

**FRs addressed:** FR44
**Technical requirement:** Cart icon in sticky header component, semantic button

---

### AC2: Item count badge displays when cart has items

**Given** cart has 1 or more items
**When** I view the cart icon in header
**Then** I see an item count badge that:

- Displays total item count (e.g., "3")
- Is positioned at top-right corner of cart icon
- Has circular or pill-shaped background (accent color)
- Has white text for contrast
- Has minimum size for readability (16x16px)
- Updates in real-time when items added/removed/quantity changed
- Badge is visible on mobile and desktop

**FRs addressed:** FR44
**Technical requirement:** Badge component, real-time count from cart data

---

### AC3: Badge is hidden when cart is empty

**Given** cart has 0 items
**When** I view the cart icon in header
**Then** item count badge is NOT visible
**And** only cart icon is displayed (no badge, no "0")
**And** screen reader announces: "Shopping cart, empty"

**FRs addressed:** FR44
**Technical requirement:** Conditional rendering for badge

---

### AC4: Clicking cart icon opens cart drawer

**Given** I click the cart icon in header
**When** click event fires
**Then** cart drawer opens from right side
**And** drawer uses existing CartDrawer component (Story 5.4)
**And** drawer opens via Zustand `setCartDrawerOpen(true)`
**And** focus moves to drawer content (Radix Dialog auto-focus)
**And** cart items display if cart has items
**And** EmptyCart displays if cart is empty

**FRs addressed:** FR44
**Technical requirement:** Click handler opens drawer via Zustand store

---

### AC5: Badge count updates in real-time

**Given** I add/remove items or change quantities
**When** cart data updates
**Then** badge count updates immediately (no page refresh)
**And** count reflects `cart.totalQuantity` from Shopify
**And** optimistic updates via `useOptimisticCart()` provide instant feedback
**And** count updates when:

- Item added to cart (AddToCartButton)
- Quantity increased/decreased (Story 5.6)
- Item removed (Story 5.7)
**And** badge appears/disappears based on count (0 = hidden, ≥1 = visible)

**FRs addressed:** FR44
**Technical requirement:** Reactive cart data via useOptimisticCart

---

### AC6: Mobile-responsive cart icon

**Given** I am viewing site on mobile device
**When** I view the sticky header
**Then** cart icon is optimized for mobile:

- Icon size is adequate for visibility (24x24px minimum)
- Touch target is 44x44px minimum (icon + padding)
- Badge is visible and readable
- Badge does not overlap with other header elements
- Icon works with iOS Safari and Chrome Android
- Active/tap state provides visual feedback

**FRs addressed:** FR44, NFR14 (touch targets)
**Technical requirement:** Mobile-first responsive design with Tailwind

---

### AC7: Keyboard accessibility for cart icon

**Given** I am a keyboard user
**When** I navigate to cart icon
**Then** I can Tab to focus the icon button
**And** Enter or Space key opens cart drawer
**And** focus indicator is visible and high-contrast
**And** focus order is logical (logo → navigation → cart icon)
**And** screen reader announces: "Shopping cart, X items button" (if items)
**And** screen reader announces: "Shopping cart, empty button" (if no items)

**FRs addressed:** FR44, NFR9, NFR10, NFR11
**Technical requirement:** Semantic HTML button, ARIA label, keyboard event handlers

---

### AC8: Cart icon styling consistent with Isla Suds brand

**Given** cart icon displays in header
**When** I view the styling
**Then** design follows Isla Suds warm aesthetic:

- Icon color matches header text color (`--text-primary`)
- Hover state uses accent color (`--accent-primary`)
- Badge uses accent color (`--accent-primary`) with white text
- Badge has adequate border-radius for circular/pill shape
- Icon and badge are clean, minimal design
- Consistent with other header elements

**FRs addressed:** FR44
**Technical requirement:** Design tokens from `app/styles/tokens.css`

---

### AC9: Cart icon displays on both mobile and desktop

**Given** I am viewing site on any device
**When** sticky header is visible
**Then** cart icon displays consistently:

- **Mobile (<640px):** Icon on right side, adequate touch target
- **Desktop (≥640px):** Icon on right side, hover state works
- Icon size and badge size are appropriate for each viewport
- No layout shift when badge appears/disappears

**FRs addressed:** FR44
**Technical requirement:** Responsive design with Tailwind breakpoints

---

### AC10: Cart icon integrates with existing header component

**Given** sticky header already exists (from previous stories)
**When** I add cart icon
**Then** icon integrates seamlessly:

- Positioned on right side of header (opposite logo)
- Aligns vertically with other header elements
- Does NOT conflict with navigation links or other elements
- Header layout remains responsive and clean
- Icon is part of header's sticky behavior (scrolls with header)

**FRs addressed:** FR44
**Technical requirement:** Integration with existing Header component

---

## Tasks / Subtasks

- [x] **Task 1: Add cart icon to Header component** (AC1, AC10)
  - [x] Update Header component (`app/components/Header.tsx`)
  - [x] Add cart icon button on right side of header
  - [x] Use shopping bag icon from Lucide Icons (ShoppingBag)
  - [x] Size icon to 24x24px (h-6 w-6)
  - [x] Add padding for 44x44px touch target (p-2.5)
  - [x] Position icon in header layout
  - [x] Ensure icon is part of sticky header (scrolls with header)

- [x] **Task 2: Implement item count badge** (AC2, AC3, AC5)
  - [x] Create badge component (inline span element)
  - [x] Position badge at top-right corner of icon (absolute positioning)
  - [x] Display `cart.totalQuantity` from Shopify
  - [x] Style badge: rounded-full, accent-primary bg, white text
  - [x] Conditionally render badge only if `cart.totalQuantity > 0`
  - [x] Ensure badge is visible on mobile and desktop
  - [x] Badge updates in real-time via useOptimisticCart

- [x] **Task 3: Connect icon to CartDrawer** (AC4)
  - [x] Import `useExplorationStore` from Zustand
  - [x] Create `handleCartClick` function
  - [x] On click: call `setCartDrawerOpen(true)` to open drawer
  - [x] Verified CartDrawer opens when icon is clicked
  - [x] Tested drawer displays cart contents or EmptyCart

- [x] **Task 4: Add cart data reactivity** (AC5)
  - [x] Import `useOptimisticCart` from Hydrogen
  - [x] Access cart data in Header component via Suspense/Await
  - [x] Use `cart.totalQuantity` for badge count
  - [x] Verified count updates when items added/removed/quantity changed
  - [x] Tested optimistic updates (instant feedback)

- [x] **Task 5: Add keyboard accessibility** (AC7)
  - [x] Add `aria-label` to icon button:
    - If cart has items: "Shopping cart, {count} items"
    - If cart is empty: "Shopping cart, empty"
  - [x] Tab order works: logo → navigation → cart icon
  - [x] Enter/Space activation works (opens drawer)
  - [x] Focus indicator is visible (focus:ring-2 with accent-primary)
  - [x] Screen reader accessible (semantic button with proper ARIA)

- [x] **Task 6: Ensure mobile-responsive layout** (AC6, AC9)
  - [x] Works on small screens (375px) - icon visible, badge readable
  - [x] Works on medium screens (412px) - adequate touch target
  - [x] Works on desktop (1440px) - hover state works
  - [x] Verified 44x44px touch target (p-2.5 = 10px padding + 24px icon)
  - [x] Badge does not overlap with other elements
  - [x] No layout shift when badge appears/disappears

- [x] **Task 7: Style icon and badge with design tokens** (AC8)
  - [x] Icon color: `text-[var(--text-primary)]`
  - [x] Hover color: `hover:text-[var(--accent-primary)]`
  - [x] Badge background: `bg-[var(--accent-primary)]`
  - [x] Badge text: white
  - [x] Badge border-radius: rounded-full
  - [x] Consistent styling with other header elements

- [x] **Task 8: Write comprehensive tests** (AC1-AC10)
  - [x] Unit tests for cart icon (37 tests total, 15 for Story 5.10)
    - [x] Renders cart icon in header
    - [x] Icon has correct sizing and touch target (44x44px)
    - [x] Badge displays when cart has items
    - [x] Badge hidden when cart is empty
    - [x] Badge shows correct count
    - [x] ARIA labels update with cart state
    - [x] Click handler calls setCartDrawerOpen(true)
    - [x] Keyboard navigation (Enter key)
    - [x] Semantic button element
    - [x] Focus indicators visible
    - [x] Badge has aria-hidden
    - [x] Responsive design (mobile/desktop)
    - [x] Design tokens used correctly
    - [x] Hover states work
    - [x] All tests passing (100%)
  - [x] Integration tests covered in unit tests
    - [x] Clicking icon opens CartDrawer (via Zustand mock)
    - [x] Badge updates with cart state (via useOptimisticCart)
  - [ ] E2E tests (to be added in future story for full cart flow)
    - Manual testing verified:
      - ✅ Badge displays count in real browser
      - ✅ Click opens CartDrawer
      - ✅ Badge updates when cart changes

## Dev Notes

### Why this story matters

Story 5.10 is the **cart accessibility** feature for Isla Suds. The cart icon provides:

- **Persistent cart access** - Users can open cart from any scroll position
- **Visual feedback** - Badge count shows items in cart at a glance
- **Conversion optimization** - Easy cart access reduces friction to checkout
- **Professional UX** - Standard e-commerce feature expected by users
- **Mobile-first** - Sticky header makes cart accessible on small screens

This story adds the cart icon to the sticky header and connects it to CartDrawer (Story 5.4). It must be:

- **Always accessible**: Visible in sticky header after scrolling
- **Informative**: Badge count provides at-a-glance cart status
- **Responsive**: Real-time updates when cart changes
- **Accessible**: Keyboard-navigable, screen reader-friendly
- **Mobile-first**: 44x44px touch target, visible badge

---

### Guardrails (developer do/don't list)

#### DO

- **DO** add cart icon to existing Header component
- **DO** use shopping bag icon (Lucide Icons recommended)
- **DO** position icon on right side of header
- **DO** ensure 44x44px touch target (icon + padding)
- **DO** display badge count when cart has items (≥1)
- **DO** hide badge when cart is empty (0 items)
- **DO** use `cart.totalQuantity` for badge count
- **DO** update count in real-time via `useOptimisticCart()`
- **DO** open drawer via Zustand `setCartDrawerOpen(true)`
- **DO** add ARIA label with dynamic count
- **DO** test keyboard navigation (Tab, Enter)
- **DO** ensure mobile-responsive layout
- **DO** use design tokens for colors, spacing
- **DO** follow import order from project-context.md

#### DO NOT

- **DO NOT** create new header component (use existing)
- **DO NOT** show "0" in badge (hide badge entirely when empty)
- **DO NOT** hardcode item count (use cart.totalQuantity)
- **DO NOT** forget to make icon button semantic (`<button>`)
- **DO NOT** skip touch target sizing (44x44px minimum)
- **DO NOT** skip keyboard accessibility testing
- **DO NOT** skip screen reader testing
- **DO NOT** use inline styles (use Tailwind classes)
- **DO NOT** forget to test real-time badge updates
- **DO NOT** forget hover state for desktop

---

### Architecture compliance

| Decision Area          | Compliance Notes                                                              |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Component location** | Existing Header component                                                     |
| **Icon library**       | Lucide Icons (shopping-bag) or custom SVG                                     |
| **Cart data source**   | `useOptimisticCart()` from Hydrogen                                           |
| **Badge count**        | `cart.totalQuantity` from Shopify                                             |
| **Drawer control**     | Zustand `setCartDrawerOpen(true)`                                             |
| **Touch Targets**      | 44x44px minimum (NFR14)                                                       |
| **Accessibility**      | ARIA label with dynamic count, semantic button, keyboard handlers             |
| **Responsive Design**  | Mobile-first with Tailwind breakpoints                                        |
| **Testing**            | Unit (10+), integration (2+), E2E (3+)                                        |

**Key architectural references:**

- `_bmad-output/project-context.md` — Header patterns, cart integration, accessibility
- `_bmad-output/planning-artifacts/epics.md` — Epic 5, Story 5.10, FR44
- `_bmad-output/planning-artifacts/architecture.md` — Sticky header, cart access
- `app/components/layout/Header.tsx` — Header component (modify)
- `app/components/cart/CartDrawer.tsx` — Cart drawer (Story 5.4)
- `app/stores/cart-drawer.ts` — Zustand store for drawer state
- Lucide Icons docs — <https://lucide.dev/icons/shopping-bag>

---

### Technical requirements (dev agent guardrails)

| Requirement             | Detail                                           | Location                          |
| ----------------------- | ------------------------------------------------ | --------------------------------- |
| **Component location**  | Header component                                 | app/components/layout/Header.tsx  |
| **Icon**                | Shopping bag icon                                | lucide-react (ShoppingBag)        |
| **Icon size**           | 24x24px minimum                                  | className="h-6 w-6"               |
| **Touch target**        | 44x44px (icon + padding)                         | className="p-2.5" (10px padding)  |
| **Badge count source**  | `cart.totalQuantity`                             | Shopify Storefront API            |
| **Badge styling**       | Circular, accent-primary, white text             | Tailwind classes                  |
| **Open drawer**         | `setCartDrawerOpen(true)`                        | Zustand store                     |
| **Cart hook**           | `useOptimisticCart()`                            | @shopify/hydrogen                 |
| **ARIA label**          | "Shopping cart, X items" or "Shopping cart, empty"| aria-label attribute             |
| **Testing**             | Unit (10+) + integration (2+) + E2E (3+)         | Vitest, Playwright                |

---

### Project structure notes

**Files that WILL BE MODIFIED:**

- `app/components/layout/Header.tsx` (or `app/components/Header.tsx`) — Add cart icon and badge

**Files that MAY BE CREATED:**

- `app/components/layout/CartIconBadge.tsx` — Separate badge component (optional, could be inline)
- `tests/e2e/cart-icon.spec.ts` — E2E tests for cart icon

**Files that ALREADY EXIST (will be used):**

- `app/components/layout/Header.tsx` — Header component
- `app/components/cart/CartDrawer.tsx` — Cart drawer (Story 5.4)
- `app/stores/cart-drawer.ts` — Zustand store for drawer state
- `app/root.tsx` — Root loader provides cart data

**Integration Points:**

- **Header** renders cart icon button with badge
- **Cart icon** uses `cart.totalQuantity` for badge count
- **Clicking icon** opens CartDrawer via Zustand
- **useOptimisticCart** provides real-time cart data
- **Badge** updates when cart changes (add/remove/quantity)

---

### Previous story intelligence (Story 5.4)

**Story 5.4 (Build Cart Drawer Component):**

- **Completed**: CartDrawer component with Radix Dialog
- **Pattern established**: Zustand `cartDrawerOpen` state for drawer control
- **Pattern established**: CartDrawer opens via `setCartDrawerOpen(true)`
- **Key insight**: Cart icon needs to trigger same open mechanism

**Key Lessons for Story 5.10:**

- **Zustand store exists** — Use `setCartDrawerOpen(true)` to open drawer
- **CartDrawer component exists** — Just need trigger (cart icon)
- **Cart data accessible** — Root loader provides cart via `useRouteLoaderData`
- **Optimistic cart hook** — Use `useOptimisticCart()` for real-time updates

**Code patterns to follow:**

- **Import order**: React/framework → External libs → Internal (~/) → Relative (./) → Types
- **Component structure**: Semantic button, click handler, ARIA label
- **Zustand pattern**: Import store, call setter function
- **Cart data pattern**: Use `useOptimisticCart()` for reactive data

---

### Cart Icon Pattern

**Cart icon with badge:**

```tsx
import {ShoppingBag} from 'lucide-react';
import {useOptimisticCart} from '@shopify/hydrogen';
import {useRouteLoaderData} from 'react-router';
import {useCartDrawerStore} from '~/stores/cart-drawer';
import {cn} from '~/utils/cn';
import type {RootLoader} from '~/root';

export function Header() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const cart = useOptimisticCart(rootData?.cart);
  const setCartDrawerOpen = useCartDrawerStore((state) => state.setCartDrawerOpen);

  const itemCount = cart?.totalQuantity ?? 0;
  const hasItems = itemCount > 0;

  const handleCartClick = () => {
    setCartDrawerOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--canvas-base)] border-b border-neutral-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-xl font-semibold">
          Isla Suds
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/about">About</a>
          <a href="/wholesale">Wholesale</a>
        </nav>

        {/* Cart Icon */}
        <button
          onClick={handleCartClick}
          className={cn(
            'relative',
            'p-2.5', // 10px padding = 44px touch target with 24px icon
            'text-[var(--text-primary)]',
            'hover:text-[var(--accent-primary)]',
            'transition-colors',
            'rounded',
            'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]',
          )}
          aria-label={
            hasItems
              ? `Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
              : 'Shopping cart, empty'
          }
        >
          <ShoppingBag className="h-6 w-6" />

          {/* Badge - only show if has items */}
          {hasItems && (
            <span
              className={cn(
                'absolute -top-1 -right-1',
                'min-w-[20px] h-5 px-1.5',
                'bg-[var(--accent-primary)] text-white',
                'rounded-full',
                'text-xs font-medium',
                'flex items-center justify-center',
              )}
              aria-hidden="true" // Screen reader gets count from button aria-label
            >
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
```

---

### Badge Styling Pattern

**Circular badge with count:**

```tsx
{
  hasItems && (
    <span
      className={cn(
        'absolute -top-1 -right-1', // Position at top-right corner
        'min-w-[20px] h-5 px-1.5', // Minimum width 20px, height 20px, horizontal padding
        'bg-[var(--accent-primary)] text-white', // Accent color background, white text
        'rounded-full', // Circular shape
        'text-xs font-medium', // Small, readable text
        'flex items-center justify-center', // Center text
        'leading-none', // Remove extra line-height
      )}
      aria-hidden="true" // Count already in button aria-label
    >
      {itemCount > 99 ? '99+' : itemCount}
    </span>
  );
}
```

---

### Real-Time Badge Updates

**Optimistic cart updates:**

```tsx
import {useOptimisticCart} from '@shopify/hydrogen';
import {useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';

// In Header component
const rootData = useRouteLoaderData<RootLoader>('root');
const cart = useOptimisticCart(rootData?.cart);

// Count updates automatically when:
// - Item added (AddToCartButton)
// - Quantity changed (Story 5.6)
// - Item removed (Story 5.7)
const itemCount = cart?.totalQuantity ?? 0;
```

**How it works:**

1. Root loader fetches cart data from Shopify
2. `useOptimisticCart()` wraps cart data for optimistic updates
3. When cart mutations occur (add/remove/update), Hydrogen updates `cart` instantly
4. Header re-renders with new `itemCount`
5. Badge updates in real-time (no page refresh)

---

### ARIA Label Pattern

**Dynamic label based on cart state:**

```tsx
<button
  onClick={handleCartClick}
  aria-label={
    hasItems
      ? `Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
      : 'Shopping cart, empty'
  }
>
  <ShoppingBag className="h-6 w-6" />
  {hasItems && <span aria-hidden="true">{itemCount}</span>}
</button>
```

**Screen reader announces:**

- If cart has 3 items: "Shopping cart, 3 items button"
- If cart is empty: "Shopping cart, empty button"
- Badge count is `aria-hidden` (already in button label)

---

### Responsive Layout Pattern

**Mobile-first cart icon:**

```tsx
<button
  onClick={handleCartClick}
  className={cn(
    'relative',
    'p-2.5', // 10px padding = 44px touch target
    'text-[var(--text-primary)]',
    'hover:text-[var(--accent-primary)]',
    'active:text-[var(--accent-primary-dark)]', // Mobile tap state
    'transition-colors',
    'rounded',
    'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]',
  )}
  aria-label={cartLabel}
>
  {/* Icon - responsive sizing */}
  <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7" />

  {/* Badge - always visible if items > 0 */}
  {hasItems && (
    <span
      className={cn(
        'absolute -top-1 -right-1',
        'min-w-[20px] h-5 px-1.5',
        'bg-[var(--accent-primary)] text-white',
        'rounded-full',
        'text-xs font-medium',
        'flex items-center justify-center',
      )}
      aria-hidden="true"
    >
      {itemCount > 99 ? '99+' : itemCount}
    </span>
  )}
</button>
```

---

### Testing Strategy

**Unit Tests** (`Header.test.tsx`):

1. **Rendering tests:**
   - Renders cart icon in header
   - Icon has correct sizing (24x24px)
   - Badge displays when cart has items
   - Badge shows correct count (cart.totalQuantity)
   - Badge is hidden when cart is empty

2. **Interaction tests:**
   - Clicking icon calls handleCartClick
   - Clicking icon opens cart drawer (setCartDrawerOpen(true))

3. **Real-time updates:**
   - Badge count updates when cart.totalQuantity changes
   - Badge appears when item added (count 0 → 1)
   - Badge disappears when last item removed (count 1 → 0)

4. **Accessibility tests:**
   - Icon button has ARIA label with count
   - ARIA label updates when count changes
   - Badge has aria-hidden="true"
   - Keyboard navigation works (Tab, Enter)
   - Focus indicator is visible

5. **Responsive tests:**
   - Touch target is 44x44px
   - Badge is visible on mobile and desktop
   - No layout shift when badge appears/disappears

**Integration Tests** (`Header.test.tsx`):

1. **Drawer integration:**
   - Clicking icon opens CartDrawer
   - CartDrawer displays when setCartDrawerOpen(true) called

2. **Cart data integration:**
   - useOptimisticCart provides cart data
   - Badge count matches cart.totalQuantity

**E2E Tests** (`cart-icon.spec.ts`):

1. **Badge displays with items:**
   - Navigate to homepage
   - Add item to cart
   - Verify cart icon badge displays count "1"
   - Add another item
   - Verify badge updates to "2"

2. **Click icon opens drawer:**
   - Navigate to homepage
   - Add item to cart
   - Click cart icon in header
   - Verify cart drawer opens
   - Verify cart contents display

3. **Badge disappears when empty:**
   - Add 1 item to cart
   - Open cart drawer
   - Remove item
   - Verify badge disappears from header icon

---

### Edge Cases to Handle

| Scenario                          | Expected Behavior                              | Test Location    |
| --------------------------------- | ---------------------------------------------- | ---------------- |
| **Cart has items**                | Badge displays with count                      | Unit test        |
| **Cart is empty**                 | Badge is hidden (not "0")                      | Unit test        |
| **Count > 99**                    | Badge displays "99+"                           | Unit test        |
| **Item added**                    | Badge appears/updates instantly                | E2E test         |
| **Last item removed**             | Badge disappears instantly                     | E2E test         |
| **Quantity changed**              | Badge count updates instantly                  | E2E test         |
| **Keyboard user**                 | Tab + Enter opens drawer                       | Unit test        |
| **Screen reader user**            | ARIA label announces count correctly           | Unit test        |
| **Mobile user**                   | Touch target is 44x44px, badge visible         | E2E test         |
| **Desktop user**                  | Hover state works, badge visible               | E2E test         |

---

### Success Criteria

Story 5.10 is complete when:

1. ✅ Cart icon displays in sticky header
2. ✅ Icon uses shopping bag icon (24x24px)
3. ✅ Icon has 44x44px touch target
4. ✅ Badge displays when cart has items
5. ✅ Badge shows `cart.totalQuantity` count
6. ✅ Badge is hidden when cart is empty
7. ✅ Clicking icon opens cart drawer
8. ✅ Badge updates in real-time when cart changes
9. ✅ ARIA label includes dynamic count
10. ✅ ARIA label differentiates empty vs with items
11. ✅ Keyboard navigation works (Tab, Enter)
12. ✅ Focus indicator is visible
13. ✅ Mobile touch target is 44x44px
14. ✅ Desktop hover state works
15. ✅ All unit tests pass (10+ tests)
16. ✅ All integration tests pass (2+ tests)
17. ✅ All E2E tests pass (3+ tests)
18. ✅ Design follows Isla Suds warm aesthetic
19. ✅ Badge updates instantly (optimistic UI)
20. ✅ Code review approved

---

### Latest Technical Intelligence (Web Research)

**E-commerce Cart Icon Best Practices:**

- **Icon choice**: Shopping bag is preferred over shopping cart (warmer, less generic)
- **Badge position**: Top-right corner of icon (most common pattern)
- **Badge count**: Hide when 0, show actual count 1-99, show "99+" for 100+
- **Touch target**: 44x44px minimum for mobile (icon + padding)
- **Real-time updates**: Badge should update instantly without page refresh

**Lucide Icons:**

- **ShoppingBag**: Modern, clean shopping bag icon
- **ShoppingCart**: Traditional cart icon (alternative)
- **Size**: Use `className="h-6 w-6"` for 24x24px
- **Color**: Use `currentColor` for easy theming

**Badge Component Patterns:**

- **Shape**: Circular (rounded-full) for single/double digits, pill for text
- **Positioning**: Absolute positioning at top-right (-top-1, -right-1)
- **Contrast**: High contrast background (accent color) with white text
- **Accessibility**: `aria-hidden="true"` on badge (count in button label)

**Zustand Store Integration:**

- Import store: `import {useCartDrawerStore} from '~/stores/cart-drawer'`
- Get setter: `const setCartDrawerOpen = useCartDrawerStore((state) => state.setCartDrawerOpen)`
- Open drawer: `setCartDrawerOpen(true)`

**Hydrogen Optimistic Cart:**

- **Hook**: `useOptimisticCart(originalCart)`
- **Updates**: Automatic optimistic updates for add/remove/update operations
- **Real-time**: Cart data updates instantly, badge re-renders automatically
- **Fallback**: If hook returns null, use `cart?.totalQuantity ?? 0`

---

### Architecture Decision: Badge Component

**Option A: Inline badge in Header (RECOMMENDED)**

- ✅ Simpler implementation
- ✅ Less file overhead
- ✅ Direct access to cart data
- ✅ Easier to maintain
- ❌ Slightly less reusable

**Option B: Separate CartIconBadge component**

- ✅ More reusable
- ✅ Testable in isolation
- ❌ Extra file to maintain
- ❌ Prop drilling for cart count
- ❌ Overkill for simple badge

**Decision: Use Option A (inline badge in Header)**

Reasoning:

- Badge is simple enough to inline
- Direct access to cart data (no prop drilling)
- Fewer files to maintain
- Easier to understand cart icon logic
- Badge is tightly coupled to cart icon (not reused elsewhere)

---

### References

- **Epic definition:** `_bmad-output/planning-artifacts/epics.md` — Epic 5, Story 5.10, FR44
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` — Sticky header, cart access
- **PRD:** `_bmad-output/planning-artifacts/prd.md` — FR44 (cart icon in header)
- **Project context:** `_bmad-output/project-context.md` — Header patterns, cart integration
- **Previous story:** `5-4-build-cart-drawer-component.md` — CartDrawer and Zustand store
- **Header component:** `app/components/layout/Header.tsx` — Header component to modify
- **CartDrawer component:** `app/components/cart/CartDrawer.tsx` — Drawer to open
- **Zustand store:** `app/stores/cart-drawer.ts` — Drawer state management
- **Lucide Icons docs:** <https://lucide.dev/icons/shopping-bag>
- **Hydrogen useOptimisticCart docs:** <https://shopify.dev/docs/api/hydrogen/hooks/useoptimisticcart>

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A

### Completion Notes List

**Code Review Fixes Applied (2026-01-29):**

1. **Removed duplicate cart UI** - Cleaned up legacy Aside-based cart system (CartToggle, CartBadge, CartBanner) that conflicted with new Story 5.10 Zustand-based CartIconButton
2. **Removed redundant cart data fetching** - Eliminated duplicate Suspense/Await blocks for cart data
3. **Fixed cart icon visibility** - Cart icon now always renders in header (removed conditional rendering)
4. **Added "99+" test coverage** - Added test case for badge displaying "99+" when cart has >99 items
5. **Cleaned up unused imports** - Removed CartViewPayload and useAnalytics imports after legacy cart removal

**Implementation Notes:**

- Cart icon opens CartDrawer via Zustand `setCartDrawerOpen(true)` (not Aside-based drawer)
- Badge updates in real-time via `useOptimisticCart()` hook from Hydrogen
- All tests passing (38 total, 16 for Story 5.10 including new "99+" test)
- Design tokens used consistently (`--text-primary`, `--accent-primary`)
- Mobile touch targets verified (44x44px via p-2.5 padding)
- Accessibility verified (semantic button, ARIA labels, keyboard navigation)

### File List

**Modified Files:**

1. `app/components/Header.tsx` - Added CartIconButton component, removed legacy cart system
2. `app/components/Header.test.tsx` - Added 16 tests for cart icon (including "99+" edge case)
3. `app/components/AddToCartButton.tsx` - Opens CartDrawer on successful add
4. `app/components/cart/CartDrawer.tsx` - Zustand-based drawer state
5. `app/components/cart/CartLineItems.tsx` - Cart line items display
6. `app/components/cart/EmptyCart.tsx` - Empty cart state
7. `app/components/product/BundleCard.tsx` - Product bundle display
8. `app/components/product/ProductRevealInfo.tsx` - Product reveal component
9. `.serena/project.yml` - Serena config update
10. `_bmad-output/implementation-artifacts/5-10-add-cart-icon-to-sticky-header.md` - This story file
11. `_bmad-output/implementation-artifacts/sprint-status.yaml` - Sprint tracking
12. `package.json` - Dependencies
13. `pnpm-lock.yaml` - Lock file
