# Story 5.9: Implement Proceed to Checkout

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to proceed to Shopify checkout from the cart drawer**,
So that **I can complete my purchase**.

## Acceptance Criteria

### AC1: Checkout button displays in cart drawer footer

**Given** the cart drawer is open with items
**When** I view the drawer
**Then** I see "Checkout" button at bottom of drawer that:

- Is prominently displayed (full-width, accent color)
- Uses `--accent-primary` background color
- Has white text for contrast
- Is positioned in drawer footer (below cart subtotal)
- Has adequate height for touch targets (48px minimum, 56px recommended)
- Has hover state (desktop) and active state (mobile)
- Is keyboard-accessible (Tab + Enter)
- Screen reader announces: "Checkout button, proceed to payment"

**FRs addressed:** FR18
**Technical requirement:** Button in CartDrawer footer, styled prominently

---

### AC2: Checkout button redirects to Shopify checkout

**Given** the cart drawer is open with items
**When** I click "Checkout" button
**Then** I am redirected to Shopify-managed checkout
**And** checkout URL comes from `cart.checkoutUrl` field
**And** redirect happens in same tab (NOT new tab)
**And** redirect uses standard `window.location.href` or React Router navigation
**And** cart data is passed to Shopify (automatic via checkoutUrl)
**And** Shopify checkout displays with cart items pre-filled

**FRs addressed:** FR18
**Technical requirement:** Redirect to `cart.checkoutUrl` in same tab

---

### AC3: Button shows loading state during redirect

**Given** I click "Checkout" button
**When** redirect is in progress
**Then** button shows loading state:

- Loading spinner or "Processing..." text
- Button is disabled (prevent double-click)
- Button opacity reduced (50-70%)
- Loading indicator is centered in button
- Loading state lasts until redirect completes (~100-500ms)
- If redirect fails: button returns to normal state with error

**FRs addressed:** FR18
**Technical requirement:** Loading state management, prevent double-click

---

### AC4: Button is disabled when cart is empty

**Given** cart has 0 items (EmptyCart component displays)
**When** I view the cart drawer
**Then** "Checkout" button is hidden (NOT disabled)
**And** button does NOT display in footer
**And** only EmptyCart message and "Explore the Collection" button are visible
**And** cart drawer footer is hidden entirely

**FRs addressed:** FR18
**Technical requirement:** Conditional rendering in CartDrawer footer

---

### AC5: Cart subtotal displays above checkout button

**Given** the cart drawer is open with items
**When** I view the drawer footer
**Then** I see cart subtotal above "Checkout" button:

- Label: "Subtotal" or "Total"
- Amount: formatted with currency (e.g., "$36.00")
- Clear visual separation between subtotal and button (border or spacing)
- Subtotal uses consistent formatting with line item prices
- Subtotal updates automatically when items added/removed/quantity changed

**FRs addressed:** FR18, FR15
**Technical requirement:** Subtotal from `cart.cost.subtotalAmount`, displayed in footer

---

### AC6: Error handling for checkout redirect failure

**Given** I click "Checkout" button and redirect fails
**When** the error occurs (e.g., network error, invalid checkout URL)
**Then** I see warm error message:

- "Couldn't start checkout. Let's try again."
- Error displays near button (not global alert)
- Button returns to normal state (no loading indicator)
- User can retry by clicking button again
- Error auto-dismisses after 3 seconds
- Technical error logged to console for debugging

**FRs addressed:** FR18, NFR24 (warm error messaging)
**Technical requirement:** Error handling, error messages from `app/content/errors.ts`

---

### AC7: Mobile-responsive checkout button

**Given** I am viewing cart on mobile device
**When** I view the checkout button
**Then** button is optimized for mobile:

- Full-width button (spans drawer width)
- Adequate height for touch (48px minimum, 56px recommended)
- Large, readable text (16px minimum)
- Button is easily tap-able (no mis-taps)
- Active state provides visual feedback on tap
- Button works with iOS Safari and Chrome Android

**FRs addressed:** FR18, NFR14 (touch targets)
**Technical requirement:** Mobile-first responsive design with Tailwind

---

### AC8: Keyboard accessibility for checkout button

**Given** I am a keyboard user
**When** I navigate to checkout button
**Then** I can Tab to focus the button
**And** Enter or Space key activates the button (redirects to checkout)
**And** focus indicator is visible and high-contrast
**And** focus order is logical: cart items → subtotal → checkout button → close
**And** screen reader announces: "Checkout button, proceed to payment"
**And** button disabled state is announced if empty cart

**FRs addressed:** FR18, NFR9, NFR10, NFR11
**Technical requirement:** Semantic HTML button, ARIA label, keyboard event handlers

---

### AC9: Checkout button styling consistent with Isla Suds brand

**Given** checkout button displays
**When** I view the styling
**Then** design follows Isla Suds warm aesthetic:

- Uses `--accent-primary` color (teal)
- Hover state darkens slightly (`--accent-primary-dark`)
- Active state is visually distinct
- Typography uses design system font (medium weight)
- Consistent with other primary CTAs (AddToCartButton)
- Professional, polished appearance

**FRs addressed:** FR18
**Technical requirement:** Design tokens from `app/styles/tokens.css`

---

### AC10: Checkout button prevents double-click

**Given** I click "Checkout" button
**When** redirect is in progress
**Then** button is disabled to prevent double-click
**And** second click does nothing (no additional redirect)
**And** button shows loading state until redirect completes
**And** button state resets if redirect fails

**FRs addressed:** FR18
**Technical requirement:** Button disabled during loading, state management

---

## Tasks / Subtasks

- [ ] **Task 1: Add checkout button to CartDrawer footer** (AC1, AC7, AC9)
  - [ ] Update CartDrawer component (`app/components/cart/CartDrawer.tsx`)
  - [ ] Add footer section at bottom of drawer (if doesn't exist)
  - [ ] Add "Checkout" button in footer
  - [ ] Style button: full-width, accent-primary color, 48-56px height
  - [ ] Add hover and active states
  - [ ] Use design tokens for colors
  - [ ] Ensure responsive layout (full-width on all screen sizes)

- [ ] **Task 2: Display cart subtotal above button** (AC5)
  - [ ] Add subtotal section in footer above button
  - [ ] Display label: "Subtotal"
  - [ ] Display amount from `cart.cost.subtotalAmount.amount`
  - [ ] Format amount with currency from `cart.cost.subtotalAmount.currencyCode`
  - [ ] Use `formatMoney()` utility for formatting
  - [ ] Add visual separation (border or spacing)
  - [ ] Ensure subtotal updates automatically via useOptimisticCart

- [ ] **Task 3: Implement checkout redirect** (AC2, AC3, AC10)
  - [ ] Create `handleCheckout` function in CartDrawer
  - [ ] Add loading state management (`isCheckingOut`)
  - [ ] On click: set loading to true, disable button
  - [ ] Redirect to `cart.checkoutUrl` using `window.location.href`
  - [ ] Alternative: Use React Router `navigate()` if needed
  - [ ] Show loading spinner during redirect
  - [ ] Prevent double-click (disable button during loading)

- [ ] **Task 4: Conditional rendering for empty cart** (AC4)
  - [ ] Hide checkout button when cart is empty
  - [ ] Hide footer section entirely when EmptyCart displays
  - [ ] Only show footer when `cart?.lines?.nodes?.length > 0`
  - [ ] Verify EmptyCart component displays without footer

- [ ] **Task 5: Add error handling** (AC6)
  - [ ] Wrap checkout redirect in try-catch
  - [ ] On error: show warm error message
  - [ ] Error message: "Couldn't start checkout. Let's try again."
  - [ ] Display error near button (inline in footer)
  - [ ] Auto-dismiss error after 3 seconds
  - [ ] Reset button to normal state (remove loading)
  - [ ] Log error to console for debugging

- [ ] **Task 6: Add keyboard accessibility** (AC8)
  - [ ] Add `aria-label` to button: "Checkout, proceed to payment"
  - [ ] Test Tab order: cart items → subtotal → checkout → close
  - [ ] Test Enter/Space activation
  - [ ] Verify focus indicator is visible (teal outline)
  - [ ] Test with VoiceOver (macOS/iOS)
  - [ ] Test with NVDA (Windows)

- [ ] **Task 7: Write comprehensive tests** (AC1-AC10)
  - [ ] Unit tests for checkout button (10+ tests)
    - Renders "Checkout" button in footer
    - Button is full-width with accent-primary color
    - Clicking button redirects to `cart.checkoutUrl`
    - Button shows loading state during redirect
    - Button is disabled during loading (prevents double-click)
    - Button is hidden when cart is empty
    - Error message displays if redirect fails
    - Error auto-dismisses after 3 seconds
    - Subtotal displays above button
    - ARIA label is correct
    - Keyboard navigation works (Tab, Enter)
  - [ ] Integration tests with CartDrawer (2+ tests)
    - Footer displays when cart has items
    - Footer is hidden when cart is empty
  - [ ] E2E tests for checkout flow (3+ tests)
    - Add item → open cart → click checkout → redirect to Shopify
    - Checkout button disabled during redirect
    - Empty cart → checkout button hidden

## Dev Notes

### Why this story matters

Story 5.9 is the **cart-to-checkout transition** for Isla Suds. The checkout button provides:

- **Purchase completion** - Users can proceed from cart review to payment
- **Conversion critical** - This button is the gateway to revenue
- **Professional UX** - Prominent, clear CTA expected in e-commerce
- **Trust building** - Smooth redirect to Shopify checkout builds confidence
- **Accessibility** - Keyboard users can complete purchase flow

This story adds the checkout button to CartDrawer (Story 5.4) and integrates with Shopify's managed checkout. It must be:

- **Prominent**: Full-width, accent-primary color, impossible to miss
- **Fast**: Loading state provides feedback, redirect happens quickly
- **Accessible**: Keyboard-navigable, screen reader-friendly
- **Mobile-first**: 48-56px touch target, full-width button
- **Error-resilient**: Warm error messages, graceful failure recovery

---

### Guardrails (developer do/don't list)

#### DO

- **DO** use prominent styling (full-width, accent-primary, 48-56px height)
- **DO** redirect to `cart.checkoutUrl` from Shopify Storefront API
- **DO** redirect in same tab (use `window.location.href`)
- **DO** show loading state during redirect (spinner or text)
- **DO** disable button during loading (prevent double-click)
- **DO** hide button when cart is empty (hide footer entirely)
- **DO** display cart subtotal above button
- **DO** use warm error messages from `app/content/errors.ts`
- **DO** add ARIA label: "Checkout, proceed to payment"
- **DO** test keyboard navigation (Tab, Enter)
- **DO** ensure 48-56px touch target for mobile
- **DO** use design tokens for colors, spacing, typography
- **DO** follow import order from project-context.md
- **DO** test redirect on staging/development environment

#### DO NOT

- **DO NOT** open checkout in new tab (same tab only)
- **DO NOT** implement custom checkout (use Shopify-managed only)
- **DO NOT** modify checkout URL (use exactly as provided by API)
- **DO NOT** show disabled button when empty (hide footer entirely)
- **DO NOT** skip loading state (provides critical feedback)
- **DO NOT** allow double-click (disable during loading)
- **DO NOT** show technical error messages to users
- **DO NOT** use inline styles (use Tailwind classes)
- **DO NOT** skip mobile responsive testing
- **DO NOT** skip keyboard accessibility testing
- **DO NOT** hardcode error messages (use `app/content/errors.ts`)
- **DO NOT** forget to display cart subtotal above button

---

### Architecture compliance

| Decision Area          | Compliance Notes                                                              |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Component location** | CartDrawer footer section                                                     |
| **Checkout URL**       | From `cart.checkoutUrl` field (Shopify Storefront API)                        |
| **Redirect method**    | `window.location.href = cart.checkoutUrl` (same tab)                          |
| **Loading state**      | React state management, button disabled during redirect                       |
| **Error messages**     | Centralized in `app/content/errors.ts`                                        |
| **Touch Targets**      | 48-56px height (NFR14)                                                        |
| **Accessibility**      | ARIA label, semantic button, keyboard handlers                                |
| **Responsive Design**  | Full-width button on all screen sizes                                         |
| **Conditional Render** | Footer hidden when cart is empty                                              |
| **Testing**            | Unit (10+), integration (2+), E2E (3+)                                        |

**Key architectural references:**

- `_bmad-output/project-context.md` — Checkout patterns, Shopify integration
- `_bmad-output/planning-artifacts/epics.md` — Epic 5, Story 5.9, FR18
- `_bmad-output/planning-artifacts/architecture.md` — Checkout redirect, error handling
- `app/components/cart/CartDrawer.tsx` — Parent component (Story 5.4)
- `app/content/errors.ts` — Warm error messaging
- `app/utils/format-money.ts` — Currency formatting
- Shopify Storefront API docs — https://shopify.dev/docs/api/storefront/latest/objects/Cart#field-cart-checkouturl

---

### Technical requirements (dev agent guardrails)

| Requirement             | Detail                                           | Location                          |
| ----------------------- | ------------------------------------------------ | --------------------------------- |
| **Component location**  | CartDrawer footer section                        | app/components/cart/CartDrawer.tsx|
| **Checkout URL source** | `cart.checkoutUrl`                               | Shopify Storefront API            |
| **Redirect method**     | `window.location.href`                           | Browser API                       |
| **Button height**       | 48-56px (h-12 or h-14 in Tailwind)               | Tailwind classes                  |
| **Button width**        | Full-width (w-full)                              | Tailwind classes                  |
| **Button color**        | `--accent-primary` background                    | Design token                      |
| **Loading state**       | React state (`isCheckingOut`)                    | Component state                   |
| **Error message**       | "Couldn't start checkout. Let's try again."      | app/content/errors.ts             |
| **ARIA label**          | "Checkout, proceed to payment"                   | aria-label attribute              |
| **Subtotal formatting** | `formatMoney()` utility                          | app/utils/format-money.ts         |
| **Testing**             | Unit (10+) + integration (2+) + E2E (3+)         | Vitest, Playwright                |

---

### Project structure notes

**Files that WILL BE MODIFIED:**

- `app/components/cart/CartDrawer.tsx` — Add checkout button and footer section
- `app/content/errors.ts` — Add checkout error messages if missing

**Files that MAY BE CREATED:**

- `tests/e2e/checkout-flow.spec.ts` — E2E tests for checkout redirect

**Files that ALREADY EXIST (will be used):**

- `app/components/cart/CartDrawer.tsx` — Parent component (Story 5.4)
- `app/components/cart/CartLineItems.tsx` — Line items display (Story 5.5-5.6)
- `app/components/cart/EmptyCart.tsx` — Empty cart component (Story 5.8)
- `app/utils/format-money.ts` — Currency formatting utility
- `app/utils/cn.ts` — Tailwind class merger
- `app/content/errors.ts` — Error messages

**Integration Points:**

- **CartDrawer footer** renders subtotal and checkout button
- **Checkout button** redirects to `cart.checkoutUrl`
- **Loading state** disables button, shows spinner
- **Error handling** displays warm message, allows retry
- **Conditional rendering** hides footer when cart is empty

---

### Previous story intelligence (Story 5.4, 5.8)

**Story 5.4 (Build Cart Drawer Component):**

- **Completed**: CartDrawer component with Radix Dialog
- **Pattern established**: Drawer structure with header, content, footer sections
- **Key insight**: Footer section exists for checkout button and subtotal

**Story 5.8 (Display Empty Cart State):**

- **Completed**: EmptyCart component with warm message
- **Pattern established**: Hide footer when cart is empty
- **Key insight**: Checkout button should NOT display when EmptyCart shows

**Key Lessons for Story 5.9:**

- **Footer section exists** — Need to populate with subtotal and checkout button
- **Conditional rendering established** — Hide footer when cart is empty
- **Design tokens in use** — Follow established color, spacing patterns
- **Accessibility patterns established** — ARIA labels, semantic HTML

**Code patterns to follow:**

- **Import order**: React/framework → External libs → Internal (~/) → Relative (./) → Types
- **Component structure**: Semantic HTML button, loading state, error handling
- **Button styling**: Follow AddToCartButton patterns (accent-primary, loading states)
- **Error handling**: Warm messages, auto-dismiss, retry mechanism
- **Responsive**: Full-width button on all screen sizes

---

### Checkout Redirect Pattern

**Redirect to Shopify checkout:**

```typescript
// app/components/cart/CartDrawer.tsx
import {useOptimisticCart} from '@shopify/hydrogen';
import {useState} from 'react';

export function CartDrawer() {
  const cart = useOptimisticCart(originalCart);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = () => {
    if (!cart?.checkoutUrl) {
      setCheckoutError("Couldn't start checkout. Let's try again.");
      return;
    }

    try {
      setIsCheckingOut(true);
      setCheckoutError(null);

      // Redirect to Shopify checkout in same tab
      window.location.href = cart.checkoutUrl;
    } catch (error) {
      console.error('Checkout redirect failed:', error);
      setCheckoutError("Couldn't start checkout. Let's try again.");
      setIsCheckingOut(false);

      // Auto-dismiss error after 3 seconds
      setTimeout(() => setCheckoutError(null), 3000);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      {/* ... drawer content ... */}

      {/* Footer - only show if cart has items */}
      {cart?.lines?.nodes?.length > 0 && (
        <div className="border-t border-neutral-200 p-4 space-y-4">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Subtotal</span>
            <span className="text-lg font-semibold">
              {formatMoney(
                cart.cost.subtotalAmount.amount,
                cart.cost.subtotalAmount.currencyCode,
              )}
            </span>
          </div>

          {/* Error message */}
          {checkoutError && (
            <div
              role="alert"
              className="text-sm text-red-600"
              aria-live="assertive"
            >
              {checkoutError}
            </div>
          )}

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={cn(
              'w-full h-14 rounded',
              'bg-[var(--accent-primary)] text-white',
              'hover:bg-[var(--accent-primary-dark)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors',
              'font-medium text-base',
              'flex items-center justify-center',
            )}
            aria-label="Checkout, proceed to payment"
          >
            {isCheckingOut ? (
              <>
                <Spinner className="mr-2" />
                Processing...
              </>
            ) : (
              'Checkout'
            )}
          </button>
        </div>
      )}
    </Dialog.Root>
  );
}
```

---

### Cart Subtotal Pattern

**Display formatted subtotal:**

```tsx
import {formatMoney} from '~/utils/format-money';

// In CartDrawer footer
<div className="flex justify-between items-center mb-4">
  <span className="text-base font-medium text-[var(--text-primary)]">
    Subtotal
  </span>
  <span className="text-lg font-semibold text-[var(--text-primary)]">
    {cart?.cost?.subtotalAmount
      ? formatMoney(
          cart.cost.subtotalAmount.amount,
          cart.cost.subtotalAmount.currencyCode,
        )
      : '$0.00'}
  </span>
</div>
```

---

### Button Loading State Pattern

**Loading spinner component:**

```tsx
function Spinner({className}: {className?: string}) {
  return (
    <svg
      className={cn('animate-spin h-5 w-5', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
```

---

### Error Handling Pattern

**Auto-dismiss error with timeout:**

```tsx
// In handleCheckout catch block
catch (error) {
  console.error('Checkout redirect failed:', error);
  setCheckoutError(CART_MESSAGES.checkoutError);
  setIsCheckingOut(false);

  // Auto-dismiss error after 3 seconds
  const timer = setTimeout(() => setCheckoutError(null), 3000);
  return () => clearTimeout(timer);
}

// Centralized error message (app/content/cart.ts)
export const CART_MESSAGES = {
  checkoutError: "Couldn't start checkout. Let's try again.",
  // ... other cart messages
};
```

---

### Responsive Footer Layout

**Full-width button with padding:**

```tsx
<div className="border-t border-neutral-200 p-4 sm:p-6 space-y-4">
  {/* Subtotal row */}
  <div className="flex justify-between items-center">
    <span className="text-base font-medium">Subtotal</span>
    <span className="text-lg font-semibold">{formattedSubtotal}</span>
  </div>

  {/* Error message (if exists) */}
  {checkoutError && (
    <div role="alert" className="text-sm text-red-600">
      {checkoutError}
    </div>
  )}

  {/* Checkout button - full-width */}
  <button
    onClick={handleCheckout}
    disabled={isCheckingOut}
    className={cn(
      'w-full h-12 sm:h-14', // 48px mobile, 56px desktop
      'rounded',
      'bg-[var(--accent-primary)] text-white',
      'hover:bg-[var(--accent-primary-dark)] active:bg-[var(--accent-primary-darker)]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'transition-colors',
      'font-medium text-base',
      'flex items-center justify-center gap-2',
    )}
    aria-label="Checkout, proceed to payment"
  >
    {isCheckingOut ? (
      <>
        <Spinner />
        <span>Processing...</span>
      </>
    ) : (
      'Checkout'
    )}
  </button>
</div>
```

---

### Testing Strategy

**Unit Tests** (`CartDrawer.test.tsx`):

1. **Rendering tests:**
   - Renders checkout button in footer when cart has items
   - Button text is "Checkout"
   - Button is full-width with accent-primary color
   - Subtotal displays above button
   - Footer is hidden when cart is empty

2. **Interaction tests:**
   - Clicking button calls handleCheckout
   - Clicking button redirects to cart.checkoutUrl
   - Button shows loading state during redirect
   - Button is disabled during loading

3. **Error handling tests:**
   - Missing checkoutUrl shows error message
   - Error message auto-dismisses after 3 seconds
   - Error message displays near button

4. **Accessibility tests:**
   - Button has ARIA label: "Checkout, proceed to payment"
   - Keyboard navigation works (Tab, Enter)
   - Focus indicator is visible

**Integration Tests** (`CartDrawer.test.tsx`):

1. **Footer visibility:**
   - Footer displays when cart has items
   - Footer is hidden when cart is empty

2. **Subtotal calculation:**
   - Subtotal matches sum of line totals
   - Subtotal updates when items added/removed

**E2E Tests** (`checkout-flow.spec.ts`):

1. **Successful checkout redirect:**
   - Add item to cart
   - Open cart drawer
   - Click "Checkout" button
   - Verify redirect to Shopify checkout URL
   - Verify redirect happens in same tab

2. **Button disabled during loading:**
   - Add item to cart
   - Open cart drawer
   - Click "Checkout" button
   - Verify button shows loading state
   - Verify button is disabled (second click does nothing)

3. **Empty cart - no checkout button:**
   - Open cart drawer with no items
   - Verify checkout button is not visible
   - Verify footer is hidden

---

### Edge Cases to Handle

| Scenario                          | Expected Behavior                              | Test Location    |
| --------------------------------- | ---------------------------------------------- | ---------------- |
| **Cart has items**                | Checkout button displays in footer             | Unit test        |
| **Cart is empty**                 | Footer is hidden entirely                      | Unit test        |
| **checkoutUrl is missing**        | Error message displays, button disabled        | Unit test        |
| **Checkout redirect fails**       | Error message, button returns to normal        | Unit test        |
| **Double-click checkout**         | Second click does nothing (button disabled)    | E2E test         |
| **Keyboard user**                 | Tab + Enter activates button                   | Unit test        |
| **Screen reader user**            | Button announced correctly                     | Unit test        |
| **Mobile user**                   | Button is full-width, 48-56px height           | E2E test         |
| **Desktop user**                  | Hover state works, button is prominent         | E2E test         |

---

### Success Criteria

Story 5.9 is complete when:

1. ✅ Checkout button displays in CartDrawer footer
2. ✅ Button is full-width with accent-primary color
3. ✅ Button height is 48-56px (adequate touch target)
4. ✅ Cart subtotal displays above button
5. ✅ Clicking button redirects to `cart.checkoutUrl`
6. ✅ Redirect happens in same tab (NOT new tab)
7. ✅ Button shows loading state during redirect
8. ✅ Button is disabled during loading (prevents double-click)
9. ✅ Button is hidden when cart is empty (footer hidden)
10. ✅ Error message displays if redirect fails
11. ✅ Error auto-dismisses after 3 seconds
12. ✅ ARIA label: "Checkout, proceed to payment"
13. ✅ Keyboard navigation works (Tab, Enter)
14. ✅ Screen reader announcements work
15. ✅ All unit tests pass (10+ tests)
16. ✅ All integration tests pass (2+ tests)
17. ✅ All E2E tests pass (3+ tests)
18. ✅ Design follows Isla Suds warm aesthetic
19. ✅ Mobile-responsive layout works
20. ✅ Code review approved

---

### Latest Technical Intelligence (Web Research)

**Shopify Checkout URL:**

- **Field**: `cart.checkoutUrl` from Shopify Storefront API
- **Format**: Full URL to Shopify-managed checkout (e.g., `https://store.myshopify.com/checkout/...`)
- **Cart data**: Automatically passed via URL parameters
- **Redirect**: Use `window.location.href` for same-tab redirect
- **Security**: URL is signed and validated by Shopify

**Best practices for checkout redirect:**

- Redirect in same tab (better UX, expected behavior)
- Show loading state during redirect (provides feedback)
- Disable button during redirect (prevents double-click)
- Handle missing checkoutUrl gracefully (error message)
- Log errors for debugging (don't show technical details to user)

**Button UX Best Practices:**

- **Full-width**: Maximizes tap area, clear CTA
- **Prominent color**: Use accent-primary for high visibility
- **Adequate height**: 48-56px for mobile touch targets
- **Loading state**: Spinner or text ("Processing...")
- **Disabled state**: Reduced opacity, cursor-not-allowed

**Error Handling:**

- Warm, friendly error messages (not technical)
- Display error near button (inline in footer)
- Auto-dismiss after 3 seconds (don't require user action)
- Allow retry (button returns to normal state)
- Log technical errors to console for debugging

---

### Architecture Decision: Checkout Button Placement

**Option A: Footer below cart items (RECOMMENDED)**

- ✅ Standard e-commerce pattern
- ✅ Clear visual hierarchy (items → subtotal → checkout)
- ✅ Button always visible (sticky footer)
- ✅ Separate from cart content area
- ❌ None

**Option B: Floating button over content**

- ✅ Always visible while scrolling
- ❌ Covers cart content
- ❌ Less standard pattern
- ❌ More complex implementation

**Decision: Use Option A (footer below cart items)**

Reasoning:

- Standard e-commerce pattern users expect
- Clear visual hierarchy: review items → see subtotal → proceed to checkout
- Clean separation between cart content and checkout action
- Easier to implement and maintain
- Better accessibility (logical focus order)

---

### References

- **Epic definition:** `_bmad-output/planning-artifacts/epics.md` — Epic 5, Story 5.9, FR18
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` — Checkout redirect, Shopify integration
- **PRD:** `_bmad-output/planning-artifacts/prd.md` — FR18 (proceed to checkout)
- **Project context:** `_bmad-output/project-context.md` — Checkout patterns, error handling
- **Previous stories:** `5-4-build-cart-drawer-component.md`, `5-8-display-empty-cart-state.md`
- **CartDrawer component:** `app/components/cart/CartDrawer.tsx` — Parent component
- **Format money utility:** `app/utils/format-money.ts` — Currency formatting
- **Error messages:** `app/content/errors.ts` — Warm error messaging
- **Shopify Storefront API docs:** https://shopify.dev/docs/api/storefront/latest/objects/Cart#field-cart-checkouturl

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
