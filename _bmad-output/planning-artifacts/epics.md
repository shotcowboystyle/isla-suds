---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - prd-wholesale-order.md
  - architecture-wholesale-order.md
workflowType: 'epics-and-stories'
project_name: 'isla-suds'
feature_name: 'Wholesale Order Page'
user_name: 'Bubbles'
date: '2026-03-03'
author: 'Claude'
status: 'complete'
completedAt: '2026-03-03'
totalEpics: 3
totalStories: 9
---

# Isla Suds Wholesale Order Page - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the Isla Suds Wholesale Order Page, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Product Browsing**
- FR1: Wholesale partners can view all 4 soap products on a single order page
- FR2: Wholesale partners can see the product image for each soap
- FR3: Wholesale partners can see the product name for each soap
- FR4: Wholesale partners can see their wholesale unit price for each soap

**Order Building**
- FR5: Wholesale partners can set a quantity for each product (starting at 0)
- FR6: Wholesale partners can increment and decrement quantities
- FR7: Wholesale partners can type a quantity directly into the input field
- FR8: Wholesale partners can skip a product by leaving its quantity at 0
- FR9: Wholesale partners can view a running order summary showing selected products, quantities, line totals, and order subtotal
- FR10: The order summary updates immediately as quantities change

**Order Validation**
- FR11: System validates that any non-zero quantity meets the minimum order of 6 units per product
- FR12: System displays inline validation feedback when a quantity is between 1 and 5
- FR13: System prevents order submission when any product has an invalid quantity (1-5)
- FR14: System validates quantities server-side before cart creation
- FR15: System disables the checkout button until at least one product has a valid quantity (>=6)

**Order Submission**
- FR16: Wholesale partners can submit their order via a "Proceed to Checkout" action
- FR17: System creates a Shopify cart with the selected line items and the partner's buyer identity
- FR18: System redirects the partner to Shopify checkout after successful cart creation
- FR19: Wholesale partners receive their B2B wholesale pricing at checkout (applied via buyer identity)

**Navigation & Access**
- FR20: Wholesale partners can access the order page via a "Place New Order" button on the dashboard
- FR21: Wholesale partners can access the order page via a "New Order" link in the wholesale header navigation
- FR22: The "Place New Order" button is visible on the dashboard regardless of whether the partner has past orders
- FR23: The order page is protected by B2B authentication (only verified wholesale partners can access it)

**Product Availability**
- FR24: System indicates when a product is temporarily unavailable
- FR25: System disables quantity selection for unavailable products

**Error Handling**
- FR26: System displays a clear error message if cart creation fails
- FR27: System preserves the partner's quantity selections if cart creation fails (no data loss)

### NonFunctional Requirements

**Performance**
- NFR1: Page load (LCP) <2.5s consistent with site-wide CWV targets
- NFR2: Order summary update <50ms after quantity change — must feel instant
- NFR3: Cart creation + checkout redirect <3s total
- NFR4: No new heavy dependencies — order page must not bloat the wholesale portal bundle

**Security**
- NFR5: Every request to the order page must verify wholesale partner status (B2B authentication)
- NFR6: All quantities validated server-side before cart creation — client-side validation alone is bypassable
- NFR7: Wholesale prices applied exclusively via Shopify B2B buyer identity — no client-side price logic

**Accessibility**
- NFR8: WCAG 2.1 AA compliance (site-wide commitment)
- NFR9: All quantity selectors and buttons fully keyboard-operable
- NFR10: Product names, prices, quantities, and validation errors announced to screen readers
- NFR11: Minimum 44x44px touch targets for increment/decrement buttons
- NFR12: Inline errors announced to assistive technology via aria-live

**Integration**
- NFR13: Products fetched with buyer identity context to display wholesale pricing via Storefront API
- NFR14: Cart creation uses same context.cart.create() pattern as existing reorder flow
- NFR15: Shopify-hosted checkout URL returned and navigated to seamlessly

**UX Tone & Brand Consistency**
- NFR16: Validation messaging tone: non-aggressive, helpful ("Minimum order is 6 units") — no red alerts or modal interruptions
- NFR17: Error recovery messaging: warm copy ("Something went wrong. Your order is safe — let's try again.")
- NFR18: Loading state: subtle feedback during cart creation (button state change, not spinners)

### Additional Requirements

From Architecture document:
- Verify Storefront API buyer identity returns wholesale pricing before building UI (implementation risk gate)
- No new dependencies — zero additions to the bundle
- Content centralization: all user-facing copy in `app/content/wholesale.ts`, never hardcoded in components
- 4-component decomposition: route component, OrderProductCard, QuantitySelector, OrderSummary
- QuantitySelector step = 1 (MOQ 6 is a threshold, not an increment — partners can order 7, 12, 18, etc.)
- Same `useFetcher()` + action pattern as existing reorder flow
- Same `context.cart.create()` with `buyerIdentity` as reorder flow
- No Framer Motion, no Lenis — B2B portal uses no animations
- No new CSS module files — B2B portal uses Tailwind directly via `cn()`
- Generated types only from `pnpm codegen` — never hand-written Shopify types
- No new environment variables required
- Brownfield feature: inherits all existing wholesale auth guards, styling patterns, and conventions
- 10-step implementation sequence defined in architecture

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | View all 4 products on single page |
| FR2 | Epic 1 | See product image for each soap |
| FR3 | Epic 1 | See product name for each soap |
| FR4 | Epic 1 | See wholesale unit price for each soap |
| FR5 | Epic 1 | Set quantity for each product (starting at 0) |
| FR6 | Epic 1 | Increment and decrement quantities |
| FR7 | Epic 1 | Type quantity directly into input field |
| FR8 | Epic 1 | Skip a product by leaving quantity at 0 |
| FR9 | Epic 1 | View running order summary |
| FR10 | Epic 1 | Order summary updates immediately |
| FR11 | Epic 2 | Validate non-zero qty meets MOQ 6 |
| FR12 | Epic 2 | Inline validation feedback for qty 1-5 |
| FR13 | Epic 2 | Prevent submission with invalid qty |
| FR14 | Epic 2 | Server-side quantity validation |
| FR15 | Epic 2 | Disable checkout until valid qty exists |
| FR16 | Epic 2 | Submit via "Proceed to Checkout" |
| FR17 | Epic 2 | Create Shopify cart with buyer identity |
| FR18 | Epic 2 | Redirect to Shopify checkout |
| FR19 | Epic 2 | Receive B2B wholesale pricing at checkout |
| FR20 | Epic 3 | "Place New Order" button on dashboard |
| FR21 | Epic 3 | "New Order" link in header nav |
| FR22 | Epic 3 | CTA visible regardless of past orders |
| FR23 | Epic 1 | B2B authentication protection |
| FR24 | Epic 1 | Indicate unavailable products |
| FR25 | Epic 1 | Disable qty selection for unavailable products |
| FR26 | Epic 2 | Error message if cart creation fails |
| FR27 | Epic 2 | Preserve qty selections on failure |

## Epic List

### Epic 1: Product Browsing & Order Building
Partners can view all wholesale products with pricing and build an order using quantity selectors with a live order summary.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR23, FR24, FR25

### Epic 2: Order Validation & Checkout
Partners can validate their order against MOQ requirements, submit it, and proceed through Shopify checkout — with graceful error handling if something goes wrong.
**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR26, FR27

### Epic 3: Portal Navigation Integration
Partners can discover and reach the order page from the wholesale dashboard and header navigation — eliminating the "dead end" for new partners.
**FRs covered:** FR20, FR21, FR22

## Epic 1: Product Browsing & Order Building

Partners can view all wholesale products with pricing and build an order using quantity selectors with a live order summary.

### Story 1.1: View Wholesale Products with Pricing

As a wholesale partner,
I want to see all soap products with their wholesale prices on a dedicated order page,
So that I can see what's available and make informed ordering decisions.

**Acceptance Criteria:**

**Given** a verified wholesale partner is logged in
**When** they navigate to `/wholesale/order`
**Then** all 4 soap products are displayed in a grid layout
**And** each product shows its image, name, and wholesale unit price
**And** prices are fetched via Storefront API with buyer identity context (wholesale B2B pricing)
**And** the page is mobile-responsive (single column <640px, 2-column grid 640px+)

**Given** a non-wholesale visitor
**When** they attempt to access `/wholesale/order`
**Then** they are redirected by the existing wholesale layout auth guard

**Scope:** Route constant (`wholesale-routes.ts`), content strings (`wholesale.ts`), GraphQL query (`WholesaleProducts.ts` + codegen), `OrderProductCard` component (display only, no quantity selector yet), route file (`wholesale.order.tsx`) with loader. Includes verifying Storefront API returns wholesale prices with buyer identity as architecture risk gate.

**FRs:** FR1, FR2, FR3, FR4, FR23

### Story 1.2: Set Product Quantities

As a wholesale partner,
I want to set a quantity for each product using +/- buttons or by typing directly,
So that I can build my order with the exact amounts I need.

**Acceptance Criteria:**

**Given** the order page is loaded with products
**When** a partner taps the "+" button on a product
**Then** the quantity increments by 1
**And** the quantity starts at 0 by default

**Given** a product has a quantity > 0
**When** the partner taps the "-" button
**Then** the quantity decrements by 1 (minimum 0)

**Given** a product quantity input field
**When** the partner types a number directly
**Then** the quantity updates to the typed value

**Given** a partner wants to skip a product
**When** they leave the quantity at 0
**Then** that product is not included in the order

**Given** the quantity selector buttons
**Then** each button has a minimum touch target of 44x44px (NFR11)
**And** all controls are fully keyboard-operable (NFR9)
**And** product names and quantities are announced to screen readers (NFR10)

**Scope:** `QuantitySelector` component + tests, integration into `OrderProductCard`, quantity state (`Record<string, number>`) in route component.

**FRs:** FR5, FR6, FR7, FR8

### Story 1.3: Live Order Summary

As a wholesale partner,
I want to see a running order summary that updates instantly as I change quantities,
So that I can review my selections and totals before proceeding.

**Acceptance Criteria:**

**Given** at least one product has a quantity > 0
**When** the order summary is displayed
**Then** it shows each selected product with name, quantity, and line total (qty x unit price)
**And** it shows the order subtotal

**Given** a partner changes a product quantity
**When** the summary updates
**Then** the update occurs in <50ms (NFR2) — feels instant, no visible lag

**Given** all quantities are 0
**When** the order summary is displayed
**Then** it shows an empty state (no line items, no subtotal)

**Given** a mobile viewport (<640px)
**When** the order summary is displayed
**Then** it appears below the product grid

**Given** a desktop viewport (1024px+)
**When** the order summary is displayed
**Then** it appears as a sidebar alongside the product grid

**Scope:** `OrderSummary` component + tests. Receives products array and quantities map from route. Checkout button present but non-functional until Epic 2.

**FRs:** FR9, FR10

### Story 1.4: Product Availability States

As a wholesale partner,
I want to see when a product is temporarily unavailable with its ordering disabled,
So that I know what I can and cannot order right now.

**Acceptance Criteria:**

**Given** a product's variant has `availableForSale: false` from the Storefront API
**When** the order page renders
**Then** the product card shows with reduced opacity
**And** a "Currently unavailable" message is displayed
**And** the quantity selector is disabled (no +/-, no typing)

**Given** an unavailable product
**When** a partner uses keyboard navigation
**Then** the disabled state is communicated to screen readers

**Scope:** Conditional disabled state in `OrderProductCard` and `QuantitySelector`. Content string for "Currently unavailable" from `wholesaleContent`.

**FRs:** FR24, FR25

## Epic 2: Order Validation & Checkout

Partners can validate their order against MOQ requirements, submit it, and proceed through Shopify checkout — with graceful error handling if something goes wrong.

### Story 2.1: MOQ Inline Validation

As a wholesale partner,
I want to see friendly feedback when I enter a quantity below the minimum of 6,
So that I can correct my order before submitting.

**Acceptance Criteria:**

**Given** a partner sets a product quantity to a value between 1 and 5
**When** the input loses focus (blur)
**Then** an inline message appears: "Minimum order is 6 units" (NFR16 — non-aggressive tone)
**And** the input field shows a red border
**And** no modal or page reload occurs

**Given** an invalid quantity (1-5) is showing an error
**When** the partner changes the quantity to 0 or >= 6
**Then** the error message and red border disappear immediately

**Given** a product has an invalid quantity (1-5)
**When** the partner views the checkout button in OrderSummary
**Then** the button is disabled (FR15)

**Given** all products have quantities of either 0 or >= 6 and at least one is >= 6
**When** the partner views the checkout button
**Then** the button is enabled

**Given** a validation error appears
**When** a screen reader is active
**Then** the error is announced via `aria-live="polite"` (NFR12)

**Scope:** Validation logic in `QuantitySelector` (blur trigger + immediate recovery on change), disabled checkout logic in `OrderSummary`, validation content strings from `wholesaleContent`. Tests for all validation states.

**FRs:** FR11, FR12, FR13, FR15

### Story 2.2: Submit Order & Checkout

As a wholesale partner,
I want to submit my order and be redirected to Shopify checkout with my wholesale pricing,
So that I can complete my purchase.

**Acceptance Criteria:**

**Given** at least one product has a valid quantity (>= 6) and no invalid quantities exist
**When** the partner taps "Proceed to Checkout"
**Then** the button shows a subtle loading state (text/style change, not a spinner — NFR18)
**And** quantities are submitted to the server action via `useFetcher()`

**Given** the server action receives quantities
**When** it processes the order
**Then** it validates all quantities server-side: each must be 0 or >= 6 (NFR6)
**And** it builds a `lines` array from variant IDs + quantities (skipping 0s)
**And** it calls `context.cart.create()` with lines and `buyerIdentity: { customerAccessToken }` (NFR14)
**And** it returns `{ success: true, checkoutUrl }` on success

**Given** a successful cart creation response
**When** the component receives `fetcher.data`
**Then** the partner is redirected to the Shopify checkout URL via `window.location.href`
**And** wholesale B2B pricing is applied at checkout (NFR7 — via buyer identity, not client-side)

**Given** the full flow from button tap to checkout redirect
**Then** the total time is <3s (NFR3)

**Scope:** Route action (validate, build lines, cart.create, return response), `useFetcher()` submission in route component, `useEffect` for checkout redirect, button loading state in `OrderSummary`. Content string for button text from `wholesaleContent`.

**FRs:** FR14, FR16, FR17, FR18, FR19

### Story 2.3: Cart Creation Error Recovery

As a wholesale partner,
I want a helpful error message if checkout fails, with my selections preserved,
So that I can try again without re-entering my order.

**Acceptance Criteria:**

**Given** the server action fails to create a cart (API error, network issue, etc.)
**When** the action returns `{ success: false, error: string }`
**Then** a warm error message is displayed: "Something went wrong. Your order is safe — let's try again." (NFR17)
**And** the checkout button returns to its enabled state

**Given** a cart creation failure
**When** the partner views the order page
**Then** all quantity selections are preserved exactly as entered (FR27 — state lives in React, not in form)
**And** the partner can immediately retry without re-entering quantities

**Given** a server-side validation failure (quantity between 1-5 bypassing client validation)
**When** the action returns an error
**Then** the error is displayed with the same warm messaging pattern

**Scope:** Error display in route component, error return from action, button state reset in `OrderSummary`. Error content string from `wholesaleContent`.

**FRs:** FR26, FR27

## Epic 3: Portal Navigation Integration

Partners can discover and reach the order page from the wholesale dashboard and header navigation — eliminating the "dead end" for new partners.

### Story 3.1: Dashboard "Place New Order" CTA

As a wholesale partner,
I want to see a "Place New Order" button on my dashboard,
So that I can easily start a new order — especially on my first visit when I have no past orders.

**Acceptance Criteria:**

**Given** a wholesale partner is on the dashboard (`/wholesale`)
**When** the page renders
**Then** a prominent "Place New Order" button is displayed
**And** it links to `/wholesale/order`

**Given** a new partner with no past orders
**When** the dashboard renders
**Then** the "Place New Order" button is visible (FR22 — not hidden behind "no orders" state)

**Given** an existing partner with past orders
**When** the dashboard renders
**Then** the "Place New Order" button is visible alongside the existing reorder flow

**Given** the CTA button
**When** a partner activates it via keyboard
**Then** it is fully keyboard-accessible

**Scope:** Update `wholesale._index.tsx` to add CTA. Button text from `wholesaleContent`. Route path from `wholesale-routes.ts` `ORDER` constant.

**FRs:** FR20, FR22

### Story 3.2: Header Navigation "New Order" Link

As a wholesale partner,
I want a "New Order" link in the wholesale header navigation,
So that I can reach the order page from anywhere in the portal.

**Acceptance Criteria:**

**Given** a wholesale partner is on any wholesale page
**When** they view the header navigation
**Then** a "New Order" link is present
**And** it links to `/wholesale/order`

**Given** the partner is currently on the order page
**When** they view the header navigation
**Then** the "New Order" link shows as the active/current page

**Given** the navigation link
**When** a partner uses keyboard navigation
**Then** the link is accessible in the expected tab order

**Scope:** Update `WholesaleHeader.tsx` to add nav link. Link text from `wholesaleContent`. Route path from `wholesale-routes.ts` `ORDER` constant.

**FRs:** FR21
