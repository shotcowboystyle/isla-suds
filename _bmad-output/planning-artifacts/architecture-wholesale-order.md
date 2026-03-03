---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
  - step-06-structure
  - step-07-validation
  - step-08-complete
inputDocuments:
  - prd-wholesale-order.md
  - architecture.md
  - project-context.md
workflowType: 'architecture'
project_name: 'isla-suds'
user_name: 'Bubbles'
date: '2026-03-03'
author: 'Winston'
status: 'complete'
completedAt: '2026-03-03'
---

# Architecture Decision Document — Wholesale Order Page

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (27 total):**

- Product Browsing (FR1-4): Display 4 soap products with images, names, and wholesale pricing on a single order page
- Order Building (FR5-10): Quantity selectors starting at 0, increment/decrement and direct input, running order summary with line totals and subtotal, instant UI updates
- Order Validation (FR11-15): MOQ 6 per product, inline validation for quantities 1-5, checkout button disabled until at least one valid product, server-side validation before cart creation
- Order Submission (FR16-19): Cart creation with buyer identity, Shopify checkout redirect, wholesale pricing applied via B2B price list
- Navigation & Access (FR20-23): "Place New Order" CTA on dashboard, "New Order" in header nav, B2B auth-protected
- Product Availability (FR24-25): Unavailable products shown but disabled
- Error Handling (FR26-27): Cart creation failure messaging with quantity preservation

**Non-Functional Requirements (18 total):**

- Performance: <2.5s LCP, <50ms order summary updates, <3s cart creation + redirect, no new heavy dependencies
- Security: B2B auth on every request, server-side quantity validation, prices exclusively via Shopify buyer identity (no client-side price logic)
- Accessibility: WCAG 2.1 AA, keyboard-operable quantity selectors, aria-live validation announcements, 44x44px touch targets
- Integration: Storefront API with buyer identity context, same cart creation pattern as reorder flow, Shopify-hosted checkout
- UX Tone: Non-aggressive validation ("Minimum order is 6 units"), warm error recovery ("Something went wrong. Your order is safe — let's try again."), subtle loading states (button state change, not spinners)

**Scale & Complexity:**

- Primary domain: Web (brownfield feature addition to existing Shopify Hydrogen app)
- Complexity level: Low — single route, fixed 4-product catalog, no real-time features, no complex data relationships
- Estimated architectural components: 1 route, 3-4 new components, 1 server action, 1 GraphQL query, content additions

### Technical Constraints & Dependencies

- **Existing wholesale auth guards** — route must use the same B2B verification pattern as other `/wholesale/*` routes
- **Hydrogen Cart Context** — cart creation must use `context.cart.create()` with buyer identity, matching the reorder flow
- **Storefront API buyer identity** — wholesale prices returned only when products are queried with authenticated buyer identity context
- **Bundle budget <200KB** — no new heavy dependencies; this page is form inputs and a summary, not animation-heavy
- **No Framer Motion, no Lenis** — B2B portal uses native scroll and no animations per established dual-audience architecture
- **Content centralization** — all user-facing copy must live in `app/content/wholesale.ts`, not hardcoded in components
- **Generated types only** — Shopify types from codegen, never hand-written

### Cross-Cutting Concerns Identified

- **B2B authentication** — already solved; reuse existing wholesale route guard pattern
- **Cart API consistency** — cart creation must follow the same pattern as reorder to ensure buyer identity and wholesale pricing flow through correctly
- **Content management** — validation messages, error copy, and page copy all route through centralized content files
- **Responsive layout** — mobile-first (single column) → tablet (2-col) → desktop (2-col + sidebar), consistent with B2B portal patterns

## Starter Template Evaluation

### Not Applicable — Brownfield Feature Addition

This feature is built within the existing Isla Suds Shopify Hydrogen codebase. All technology decisions are inherited:

| Decision | Established Choice |
|----------|--------------------|
| Framework | Shopify Hydrogen (2025.7.3) + React Router 7 |
| Language | TypeScript 5.9.2 (strict mode) |
| Styling | Tailwind CSS v4 via Vite plugin + `cn()` utility |
| Build | Vite 6 with Hydrogen plugin |
| Runtime | Shopify Oxygen (Cloudflare Workers) |
| State | Hydrogen Cart Context (cart), Zustand (UI), React Router loaders (server) |
| Testing | Vitest (unit), Playwright (e2e) |
| Package Manager | pnpm |

**No new dependencies required.** The wholesale order page uses HTML form inputs, client-side state for quantities, and existing cart creation APIs. Zero additions to the bundle.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Product data source strategy (Storefront API with buyer identity)
- Cart creation flow (reuse reorder pattern exactly)
- Component decomposition (clear boundaries for agent implementation)

**Important Decisions (Shape Architecture):**
- Client-side quantity state management (React useState)
- Validation strategy (dual-layer: client inline + server action)

**Deferred Decisions (Post-MVP):**
- Collection-based product querying (Phase 3 — when catalog grows)
- Saved/favorite orders state persistence (Phase 2)

### Data Architecture

**Decision: Storefront API with product handles + buyer identity**
- Rationale: 4 known products, no catalog browsing needed. Explicit handles are predictable and testable.
- Loader queries products by handle via `context.storefront.query()` with buyer identity context to surface wholesale pricing
- Variant IDs extracted in loader and passed to client alongside product data (each soap = single variant)
- Prices are NEVER computed or stored client-side — Shopify B2B price list is the sole source of truth (NFR7)
- Affects: Route loader, GraphQL query design

**Decision: React useState for quantity state**
- Rationale: Page-local form state that doesn't persist across navigations. Zustand reserved for app-wide UI state per project conventions.
- State shape: `Record<string, number>` keyed by variant ID
- Owned by route component, passed down to children via props
- Affects: Route component, OrderProductCard, OrderSummary

### Authentication & Security

**Decision: Inherit existing wholesale layout auth — zero new code**
- The `wholesale.tsx` layout loader already verifies B2B status via `customerAccount.query(WHOLESALE_CUSTOMER_QUERY)` + `getB2BCompany()` for all child routes
- The order page is a child route (`wholesale.order.tsx`) — auth is handled automatically
- `customerAccessToken` for buyer identity retrieved from session in the action, matching reorder pattern (line 141 of `wholesale._index.tsx`)
- Affects: Nothing — this is inherited

**Decision: Server-side quantity validation in action**
- All quantities validated before cart creation: each must be 0 or >= 6
- Client-side validation is UX-only — server is the enforcement layer (NFR6)
- Invalid quantities return `{ success: false, error: string }` — same error shape as reorder

### API & Communication Patterns

**Decision: New Storefront API GraphQL query for wholesale products**
- Query fetches products by handle with fields: id, title, handle, featuredImage, variants(first: 1) { id, price, availableForSale }
- Buyer identity context applied at query level to surface B2B pricing
- Query lives in `app/graphql/product/WholesaleProducts.ts` (new file, follows existing graphql directory pattern)
- Limit: explicit `first: 1` on variants since each soap has a single variant
- Affects: Route loader, codegen types

**Decision: Same useFetcher() + action pattern as reorder**
- Action validates quantities, builds `lines` array from variant IDs + quantities, calls `context.cart.create()` with `buyerIdentity`
- Returns `{ success: boolean, checkoutUrl?: string, error?: string }` — identical shape to reorder (line 17-21 of `wholesale._index.tsx`)
- Client redirects via `window.location.href` on success
- Quantities preserved in state on failure (FR27 — no data loss, state lives in React, not in form)
- Affects: Route action, route component useEffect

### Frontend Architecture

**Decision: 4-component decomposition with clear ownership boundaries**

| Component | Owns | Receives |
|-----------|------|----------|
| `wholesale.order.tsx` (route) | Quantities state, loader/action, page layout grid | — |
| `OrderProductCard` | Nothing — presentational | Product data, quantity, validation state, onQuantityChange callback |
| `QuantitySelector` | Nothing — presentational | value, min, onChange, error message, disabled state |
| `OrderSummary` | Checkout disabled logic (FR15) | Products array, quantities map, fetcher state, onCheckout callback |

**Not creating:**
- No `OrderProductGrid` wrapper — Tailwind grid classes in route component
- No validation utility file — `quantity === 0 || quantity >= 6` inline
- No loading skeleton — loader is critical data, blocks render

**Validation UX flow:**
- Inline validation triggers on blur or when quantity is between 1-5
- Error message: content string from `wholesaleContent` (not hardcoded)
- `aria-live="polite"` region on each QuantitySelector for screen reader announcements (NFR12)
- Red border on invalid field, no modals, no page reloads (per Maria's journey)

### Infrastructure & Deployment

**Decision: No infrastructure changes**
- Same Oxygen deployment pipeline
- Same CI quality gates (typecheck, lint, bundle size, Lighthouse)
- Run `pnpm codegen` after adding the new GraphQL query
- No new environment variables required

### Decision Impact Analysis

**Implementation Sequence:**
1. Add route constant `ORDER: '/wholesale/order'` to `wholesale-routes.ts`
2. Add order page content to `wholesaleContent` in `wholesale.ts`
3. Create GraphQL query `WholesaleProducts.ts` + run codegen
4. Build `QuantitySelector` component (leaf node, no dependencies)
5. Build `OrderProductCard` component (depends on QuantitySelector)
6. Build `OrderSummary` component (independent of cards)
7. Create `wholesale.order.tsx` route with loader, action, and page assembly
8. Update `WholesaleHeader.tsx` — add "New Order" nav link
9. Update `wholesale._index.tsx` — add "Place New Order" CTA to dashboard

**Cross-Component Dependencies:**
- QuantitySelector ← used by OrderProductCard (composition)
- OrderProductCard and OrderSummary both receive quantities from route state (no direct dependency on each other)
- Route action depends on GraphQL query types from codegen
- WholesaleHeader and dashboard updates are independent of the order page components

## Implementation Patterns & Consistency Rules

### Inherited Patterns (from project-context.md)

All patterns from `project-context.md` apply. Key ones for this feature:
- Component naming: PascalCase.tsx (`OrderProductCard.tsx`)
- Props interfaces: `ComponentNameProps` pattern (`OrderProductCardProps`)
- Content strings: from `wholesaleContent` — never hardcoded
- Styling: `cn()` utility — never template literals for Tailwind
- Import order: React → external → `~/` absolute → relative → `import type`
- Tests: co-located (`OrderProductCard.test.tsx` next to component)
- Error handling: log + rethrow, or explicit justification comment

### Feature-Specific Patterns

#### Quantity State Shape

```typescript
// ✅ Correct: Keyed by Shopify variant ID (globally unique)
const [quantities, setQuantities] = useState<Record<string, number>>({});

// ✅ Correct: Functional update to avoid stale closures
setQuantities(prev => ({ ...prev, [variantId]: newQuantity }));

// ❌ Wrong: Keyed by product handle (not unique across Shopify)
// ❌ Wrong: Spread current state (stale in rapid updates)
```

#### Validation Timing

```typescript
// ✅ Correct: Validate on blur (user finished typing) and on change only
// when value is already invalid (immediate recovery feedback)
// Show error when: quantity > 0 && quantity < 6, triggered on blur
// Clear error when: quantity becomes 0 or >= 6, triggered on change

// ❌ Wrong: Validate on every keystroke (aggressive, blocks input)
// ❌ Wrong: Validate only on submit (Maria's journey requires inline feedback)
```

#### Action Response Shape

```typescript
// ✅ Correct: Matches reorder action exactly
interface OrderActionResponse {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

// ❌ Wrong: Different shape, different field names
```

#### Form Submission via useFetcher

```typescript
// ✅ Correct: Submit quantities as JSON string in formData
const formData = new FormData();
formData.set('intent', 'create-order');
formData.set('lines', JSON.stringify(lines));
fetcher.submit(formData, { method: 'POST' });

// ❌ Wrong: Individual form fields per product (messy parsing)
// ❌ Wrong: Direct fetch() call bypassing React Router (breaks conventions)
```

#### Price Display

```typescript
// ✅ Correct: Use Shopify's Money type directly from API response
// Display using Intl.NumberFormat or Hydrogen's <Money> component
// Prices come from the loader — never computed client-side

// ❌ Wrong: Parse price strings and do math client-side
// ❌ Wrong: Hardcode currency symbol or locale
```

#### Checkout Redirect

```typescript
// ✅ Correct: window.location.href for full-page redirect to Shopify checkout
useEffect(() => {
  if (fetcher.data?.success && fetcher.data.checkoutUrl) {
    window.location.href = fetcher.data.checkoutUrl;
  }
}, [fetcher.data]);

// ❌ Wrong: navigate() — Shopify checkout is external, not a React Router route
// ❌ Wrong: window.open() — opens new tab, breaks checkout flow
```

#### Accessible Quantity Selector

```typescript
// ✅ Correct: Full keyboard + screen reader support
<div role="group" aria-labelledby={`product-${variantId}-label`}>
  <button aria-label={`Decrease ${productName} quantity`}
          className="min-h-[44px] min-w-[44px]">−</button>
  <input type="number" min={0} step={6}
         aria-describedby={`${variantId}-error`} />
  <button aria-label={`Increase ${productName} quantity`}
          className="min-h-[44px] min-w-[44px]">+</button>
  <div id={`${variantId}-error`} aria-live="polite" role="status">
    {/* error message when invalid */}
  </div>
</div>

// ❌ Wrong: No aria-labels on buttons (screen reader says "button")
// ❌ Wrong: aria-live="assertive" (too aggressive for validation)
// ❌ Wrong: Touch targets < 44x44px
```

#### Unavailable Product Pattern

```typescript
// ✅ Correct: Show product, disable interaction, explain why
// Check variant.availableForSale from Storefront API
// Visual: reduced opacity, "Currently unavailable" text
// QuantitySelector receives disabled={true}

// ❌ Wrong: Hide unavailable products (partner won't know it exists)
// ❌ Wrong: Show but allow adding to cart (will fail at checkout)
```

### Anti-Patterns to Avoid

| Anti-Pattern | Why It's Wrong | Do This Instead |
|-------------|----------------|-----------------|
| Client-side price calculation | Wholesale prices must come from Shopify B2B (NFR7) | Display prices from loader data only |
| `useNavigate()` for checkout | Shopify checkout is an external URL | `window.location.href` |
| Zustand for quantities | Page-local state, doesn't cross boundaries | `useState` in route component |
| New CSS module file for order page | B2B portal uses Tailwind directly | `cn()` with Tailwind classes |
| Importing Framer Motion | B2B portal has no animations | Native CSS transitions if needed |
| `console.log` for debugging | Project rule: no client-side console | Use breakpoints or server-side logging |

## Project Structure & Boundaries

### Files Changed — Complete Inventory

```
app/
├── routes/
│   └── wholesale.order.tsx          # NEW — route: loader, action, page component
├── components/
│   └── wholesale/
│       ├── OrderProductCard.tsx      # NEW — product display + quantity selector
│       ├── OrderProductCard.test.tsx # NEW — unit tests
│       ├── QuantitySelector.tsx      # NEW — reusable quantity input
│       ├── QuantitySelector.test.tsx # NEW — unit tests
│       ├── OrderSummary.tsx          # NEW — line items + subtotal + checkout button
│       ├── OrderSummary.test.tsx     # NEW — unit tests
│       └── WholesaleHeader.tsx       # MODIFIED — add "New Order" nav link
├── graphql/
│   └── product/
│       └── WholesaleProducts.ts     # NEW — Storefront API query for products w/ buyer identity
├── content/
│   ├── wholesale.ts                 # MODIFIED — add order page content strings
│   └── wholesale-routes.ts          # MODIFIED — add ORDER route constant
└── routes/
    └── wholesale._index.tsx         # MODIFIED — add "Place New Order" CTA
```

**Total: 7 new files (3 components + 3 tests + 1 query), 3 modified files**

### Architectural Boundaries

**Data Flow (loader -> component -> action -> Shopify):**

```
wholesale.order.tsx LOADER
  context.storefront.query(WHOLESALE_PRODUCTS_QUERY)
  -> 4 products with wholesale pricing via buyerIdentity
  -> Returns: { products: Array<{id, title, handle,
               featuredImage, variant: {id, price,
               availableForSale}}> }
                    |
                    | useLoaderData()
                    v
wholesale.order.tsx COMPONENT
  State: quantities = Record<variantId, number>

  ┌──────────────────┐  ┌──────────────────┐
  │ OrderProductCard  │  │ OrderProductCard  │  (x4, grid)
  │  ┌──────────────┐│  │  ┌──────────────┐│
  │  │QuantitySelect││  │  │QuantitySelect││
  │  └──────────────┘│  │  └──────────────┘│
  └──────────────────┘  └──────────────────┘

  ┌──────────────────────────────────────────┐
  │ OrderSummary                              │
  │  Line items (qty > 0) + subtotal         │
  │  [Proceed to Checkout] button            │
  └──────────────────────────────────────────┘
                    |
                    | fetcher.submit({ intent, lines })
                    v
wholesale.order.tsx ACTION
  1. Validate quantities (each 0 or >= 6)
  2. Get customerAccessToken from session
  3. context.cart.create({ lines, buyerIdentity })
  4. Return { success, checkoutUrl } or { success: false, error }
                    |
                    | window.location.href
                    v
             Shopify Checkout (external)
```

**Component Boundaries:**

| Boundary | Rule |
|----------|------|
| Route -> OrderProductCard | Passes: product data, quantity value, validation state, onQuantityChange callback |
| Route -> OrderSummary | Passes: products array, quantities map, fetcher state, onCheckout callback |
| OrderProductCard -> QuantitySelector | Passes: value, min, onChange, error message, disabled flag |
| Components -> Content | All strings from `wholesaleContent` — components never own copy |
| Components -> Shopify API | NEVER — only the route loader/action talks to APIs |

**Auth Boundary:**

The `wholesale.tsx` layout loader is the auth gate. The order page route is a child — it inherits B2B verification automatically. The order route does NOT re-verify auth in its own loader. The action verifies `customerAccessToken` exists in session before cart creation (defensive, since session could expire between page load and form submit).

### Requirements to Structure Mapping

| FR Category | Files |
|-------------|-------|
| Product Browsing (FR1-4) | `WholesaleProducts.ts` (query), `OrderProductCard.tsx` (display) |
| Order Building (FR5-10) | `QuantitySelector.tsx` (input), route component (state), `OrderSummary.tsx` (summary) |
| Order Validation (FR11-15) | `QuantitySelector.tsx` (client), route action (server) |
| Order Submission (FR16-19) | Route action (cart creation), route component (redirect effect) |
| Navigation (FR20-23) | `WholesaleHeader.tsx` (nav link), `wholesale._index.tsx` (dashboard CTA) |
| Availability (FR24-25) | `OrderProductCard.tsx` (disabled state) |
| Error Handling (FR26-27) | Route action (error return), route component (error display) |

### Integration Points

**Storefront API (loader):**
- Query: `WHOLESALE_PRODUCTS_QUERY` with buyer identity
- Returns: product data with wholesale pricing
- Cache: default (not `CacheLong` — prices could change)

**Cart API (action):**
- `context.cart.create()` with `buyerIdentity: { customerAccessToken }`
- Same pattern as `wholesale._index.tsx` lines 140-149
- Returns: cart with `checkoutUrl`

**External:**
- Shopify Checkout — redirect only, no integration code needed

## Architecture Validation Results

### Coherence Validation

- Decision compatibility: All technology choices work together. Linear data flow from Storefront API -> React state -> cart action -> Shopify checkout.
- Pattern consistency: All patterns align with existing wholesale codebase. Naming, styling, content, and error handling conventions inherited from project-context.md.
- Structure alignment: New files follow established directory structure. Component boundaries are clean with no circular dependencies.

### Requirements Coverage

**Functional Requirements: 27/27 covered**
- All FRs mapped to specific files in the Requirements to Structure Mapping section
- No orphaned requirements

**Non-Functional Requirements: 18/18 covered**
- Performance: SSR loader, zero new deps, pure client-side state updates
- Security: Inherited layout auth, server-side validation, prices from buyer identity only
- Accessibility: Full keyboard + screen reader patterns defined
- Integration: Existing cart.create pattern reused
- UX Tone: Content centralization enforced

### Corrections Applied

**QuantitySelector step attribute:** Changed from `step={6}` to `step={1}`. MOQ 6 is a minimum threshold, not an increment. Partners can order 7, 12, 18 — any quantity >= 6. The +/- buttons increment by 1.

### Implementation Risk: Storefront API Buyer Identity

The order page is the first wholesale route to query the Storefront API for products with B2B pricing. The reorder flow uses Customer Account API (order history), not Storefront API (product catalog). The mechanism for passing buyer identity to Storefront API queries to surface wholesale pricing should be verified as the first implementation task — before building any UI components. This aligns with the PRD risk mitigation strategy.

**Recommended first task:** Write a standalone loader test that queries the Storefront API with buyer identity and confirms wholesale prices are returned correctly.

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context analyzed with 3 input documents
- [x] Scale assessed: low complexity, brownfield
- [x] Technical constraints from project-context.md integrated
- [x] Cross-cutting concerns mapped (auth, cart, content)

**Architectural Decisions**
- [x] Data source: Storefront API with product handles + buyer identity
- [x] Client state: React useState keyed by variant ID
- [x] Cart creation: Reuse reorder pattern (useFetcher + action)
- [x] Components: 4-component decomposition with clear boundaries

**Implementation Patterns**
- [x] Quantity state shape and update pattern
- [x] Validation timing (blur + recovery on change)
- [x] Action response shape (matches reorder)
- [x] Form submission via useFetcher
- [x] Price display (Shopify Money, never client-side)
- [x] Checkout redirect (window.location.href)
- [x] Accessible quantity selector (aria-live, 44px targets)
- [x] Unavailable product handling
- [x] Anti-patterns table

**Project Structure**
- [x] 7 new files, 3 modified files — complete inventory
- [x] Data flow diagram
- [x] Component boundary rules
- [x] FR-to-file mapping
- [x] Integration points documented

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — this architecture is mostly pattern-following, with one verification task (Storefront API buyer identity) as a prerequisite gate.

**Key Strengths:**
- Minimal surface area: 7 new files, 0 new dependencies
- Proven patterns: cart creation, auth, content centralization all exist in codebase
- Clear boundaries: agents can work on components independently
- Explicit anti-patterns: common mistakes documented with correct alternatives

**First Implementation Priority:**
1. Verify Storefront API buyer identity returns wholesale pricing
2. Add route constant and content strings (zero-risk scaffolding)
3. Build leaf components (QuantitySelector first)
4. Assemble route with loader, action, and page
5. Update navigation touchpoints (header + dashboard)

## Architecture Completion Summary

**Architecture Decision Workflow:** COMPLETED
**Total Steps Completed:** 8
**Date Completed:** 2026-03-03
**Document Location:** `_bmad-output/planning-artifacts/architecture-wholesale-order.md`

### Final Deliverables

- 4 core architectural decisions with rationale
- 8 feature-specific implementation patterns with code examples
- 7 anti-patterns documented
- Complete file inventory (7 new, 3 modified)
- Data flow diagram from loader to Shopify checkout
- FR-to-file mapping covering all 27 functional requirements
- NFR coverage verification for all 18 non-functional requirements
- 1 implementation risk flagged with mitigation strategy

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing the Wholesale Order Page. Follow all decisions, patterns, and structures exactly as documented. Reference `project-context.md` for project-wide conventions.

**Development Sequence:**
1. Verify Storefront API buyer identity returns wholesale pricing (risk gate)
2. Add `ORDER` route constant to `wholesale-routes.ts`
3. Add order page content strings to `wholesaleContent`
4. Create `WholesaleProducts.ts` GraphQL query + run `pnpm codegen`
5. Build `QuantitySelector` component + tests
6. Build `OrderProductCard` component + tests
7. Build `OrderSummary` component + tests
8. Create `wholesale.order.tsx` route (loader, action, page assembly)
9. Add "New Order" link to `WholesaleHeader.tsx`
10. Add "Place New Order" CTA to `wholesale._index.tsx`

---

**Architecture Status:** READY FOR IMPLEMENTATION
