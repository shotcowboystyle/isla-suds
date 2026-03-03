---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - product-brief-isla-suds-2026-01-23.md
  - prd.md
  - project-context.md
documentCounts:
  briefs: 1
  research: 0
  projectDocs: 2
classification:
  projectType: web_app
  domain: retail_ecommerce
  complexity: low
  projectContext: brownfield
workflowType: 'prd'
date: 2026-03-03
author: Bubbles
status: complete
---

# Product Requirements Document - Isla Suds Wholesale Order Page

**Author:** Bubbles
**Date:** 2026-03-03
**Version:** 1.0

## Executive Summary

The Wholesale Order Page adds a dedicated order builder to the existing Isla Suds B2B wholesale portal, enabling partners to browse all 4 soap products, set quantities (MOQ 6 per product), view wholesale pricing, and proceed to Shopify checkout. This fills a critical gap where new wholesale partners hit a dead end after approval ("No orders yet") and existing partners can only clone past orders via the reorder button.

## Success Criteria

### User Success

| Metric | Target | How We'll Know |
|--------|--------|----------------|
| **Time to complete new order** | <2 minutes from page load to checkout redirect | Portal usage timing |
| **First-order completion rate** | New partners place an order on first login session | Analytics: first order within 24h of account activation |
| **Zero confusion** | No support calls/texts asking "how do I order?" | Founder tracking |
| **Simplicity "aha"** | Partners immediately understand: pick products, set quantities, checkout | No training or documentation needed |

### Business Success

| Metric | Target | How We'll Know |
|--------|--------|----------------|
| **New partner onboarding** | New wholesale partners can place their first order independently — no dead end after approval | First order placed without founder intervention |
| **Order flexibility** | Existing partners can build entirely different orders (not just clone past ones) | Orders with different product mixes appearing in Shopify |
| **Zero manual handling** | No phone/text orders for new or modified wholesale orders | Founder time tracking |
| **Wholesale portal adoption** | 100% of partners using portal for all order types (new + reorder) | Track order source |

### Technical Success

| Metric | Target |
|--------|--------|
| **Page load** | <2.5s LCP (consistent with site-wide CWV targets) |
| **Checkout redirect** | Cart creation + redirect in <3s |
| **Price accuracy** | Wholesale prices always match Shopify B2B price list (no stale data) |
| **Auth security** | B2B verification on every request (consistent with existing wholesale guards) |

### Measurable Outcomes

| Timeframe | What Success Looks Like |
|-----------|------------------------|
| **Launch** | New partners can place first order; existing partners can build custom orders |
| **30 days** | All partners have used the order page at least once |
| **90 days** | Order page is primary ordering method alongside reorder |

## User Journeys

### Journey 1: Alex Places His First Wholesale Order (New Partner - Success Path)

**The Setup:**
Alex owns a boutique yoga studio and wellness shop in town. He applied through the wholesale page two days ago after a member raved about Isla Suds. This morning, he got the approval email. He's between classes, has 10 minutes.

**Opening Scene:**
He taps the login link from his approval email. OAuth flow, quick. Dashboard loads. He sees: *"Isla Suds is in 4 local stores. Thanks for being one of them, Alex."*

That lands. He's not just a customer — he's part of something.

But where the old portal would've shown "No orders yet. Ready to stock up?" with nowhere to go, now there's a prominent button: **"Place New Order."**

He taps it.

**Rising Action:**
The order page loads. Four soap bars, clean grid. Each one has a photo, the name, and his wholesale price right there — no guessing, no "contact us for pricing." He knows exactly what he's working with.

Eucalyptus. Lemongrass. Lavender. Rosemary Sea Salt. Quantity starts at 0 for each. He taps the plus on Lavender — bumps it to 6. The order summary updates instantly: 6x Lavender, subtotal shown.

He adds 6 Eucalyptus too. His wellness crowd will love those two. The summary updates — 12 bars total, clear line items, clear subtotal.

**Climax:**
He taps "Proceed to Checkout." A beat. Shopify checkout loads with his wholesale prices already applied. Shipping, payment, done.

**Resolution:**
1 minute 38 seconds. His first wholesale order, placed between yoga classes, no phone call, no text, no waiting. The soap will be on his shelf by Friday.

He didn't need instructions. He didn't need help. He just... ordered.

### Journey 2: Jim Shifts His Mix (Existing Partner - Different Order)

**The Setup:**
Jim's general store. Saturday morning, going through last month's sales. Rosemary Sea Salt has been outselling everything 2-to-1 since summer started. His usual reorder is even across all four scents, but the numbers don't lie — he needs to shift the mix.

**Opening Scene:**
He logs into the wholesale portal. Dashboard shows his last order: 12x each of all four. The "Reorder" button is right there — but that's not what he needs today.

He spots **"Place New Order"** in the header nav. Taps it.

**Rising Action:**
The order page shows all four products with his wholesale pricing. He starts building:

- Rosemary Sea Salt: 18 (it's been flying)
- Lemongrass: 12 (steady seller)
- Lavender: 6 (slowed down a bit)
- Eucalyptus: 6 (keeping it on the shelf)

The order summary updates as he goes. 42 bars total. Subtotal clear. He glances at it — looks right.

**Climax:**
"Proceed to Checkout." Shopify checkout. Same as always. He confirms and he's done.

**Resolution:**
Jim adjusted his order mix for the first time without calling the founder, without explaining what he wants changed, without any back-and-forth. He saw the data, made the call, placed the order. Under 2 minutes.

Next month, if Lavender picks back up in fall, he'll shift again. Same page, same simplicity.

### Journey 3: Maria Hits a Snag (Edge Case - Validation)

**The Setup:**
Maria is placing an order for one of her four locations. She's moving quickly — she's got three other stores to manage today.

**Opening Scene:**
She logs in, navigates to "New Order," and starts punching in quantities fast.

**Rising Action:**
She types "4" for Eucalyptus — force of habit from her old per-case ordering days. A gentle inline message appears: *"Minimum order is 6 units."* Red border on the field, but nothing aggressive. No modal. No page reload.

She bumps it to 6. The message disappears. She fills in the rest — 12 Lemongrass, 6 Lavender, 0 Rosemary Sea Salt (that location doesn't carry it).

She taps "Proceed to Checkout." It works. Only the 3 products she selected go to checkout.

**Resolution:**
The validation caught her mistake without making her feel stupid. She fixed it in one tap and moved on. No lost time, no frustration.

### Journey Requirements Summary

| Journey | Key Capabilities Needed |
|---------|------------------------|
| **Alex - First Order** | "Place New Order" CTA on dashboard (solves dead-end), product grid with wholesale prices, quantity selectors, order summary, cart creation with buyerIdentity, checkout redirect |
| **Jim - Different Mix** | "New Order" in header nav (accessible from any wholesale page), flexible per-product quantities, running subtotal, independent from reorder flow |
| **Maria - Validation** | MOQ 6 inline validation, clear non-aggressive error messaging, 0 quantity = skip product, server-side validation backup |

## Web App Specific Requirements

### Project-Type Overview

Brownfield feature addition to an existing Shopify Hydrogen web app. The wholesale order page follows all established patterns from the existing wholesale portal — minimal B2B design, no animations, native scroll, mobile-first.

### Browser & Device Support

Same as site-wide standards: modern evergreen browsers (Chrome, Safari, Firefox, Edge — latest 2 versions), Safari iOS, Chrome Android. Mobile-first given wholesale partners order on the go.

### Responsive Design

| Breakpoint | Order Page Behavior |
|------------|-------------------|
| **<640px (Mobile)** | Single-column product cards, stacked quantity selectors, order summary below products |
| **640-1024px (Tablet)** | 2-column product grid, order summary sidebar or sticky bottom |
| **1024px+ (Desktop)** | 2-column product grid with order summary sidebar |

No Lenis smooth scroll, no Framer Motion — consistent with B2B portal patterns.

### SEO Strategy

Not applicable — page is behind B2B authentication.

_Performance, accessibility, and integration requirements are defined in the Non-Functional Requirements section below._

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP — eliminate the dead-end for new partners and the inflexibility for existing ones. No experimentation needed; the pattern is proven (product grid + quantities + checkout).

**Resource Requirements:** Solo developer. No new integrations, no new APIs, no new dependencies. Builds entirely on existing wholesale auth, cart creation, and Storefront API patterns.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Alex — New partner first order (success path)
- Jim — Existing partner different order (flexibility)
- Maria — Validation edge case (error recovery)

**Must-Have Capabilities:**

| Capability | Without It |
|-----------|-----------|
| Product grid with 4 soaps | Partners can't see what's available |
| Wholesale pricing display | Partners can't make informed decisions |
| Quantity selectors (MOQ 6) | Partners can't build orders |
| Order summary | Partners can't review before checkout |
| Cart creation + checkout redirect | No way to complete the order |
| Dashboard "Place New Order" CTA | New partners still hit dead end |
| Header nav "New Order" link | Existing partners can't find the page |

**Implementation Touchpoints:**
- New route: `/wholesale/order` → `app/routes/wholesale.order.tsx`
- Dashboard update: `app/routes/wholesale._index.tsx` — add "Place New Order" CTA
- Header update: `app/components/wholesale/WholesaleHeader.tsx` — add "New Order" nav link
- Content: `app/content/wholesale.ts` — add order page copy
- Route constant: `app/content/wholesale-routes.ts` — add `ORDER: '/wholesale/order'`

### Post-MVP Features

**Phase 2 (Growth):**
- Saved/favorite orders for quick re-use
- Order templates ("My usual order")
- Quantity presets (e.g., "small restock" vs "full restock")

**Phase 3 (Expansion):**
- Expanded product catalog for wholesale (if product line grows)
- Tiered pricing visibility (volume discounts shown in real-time)
- Order scheduling (place orders for future delivery dates)

### Pre-Development Dependencies

| Asset | Owner | Status |
|-------|-------|--------|
| Product images in Shopify | Founder | Already exists |
| Wholesale pricing in Shopify B2B | Founder | Already configured |
| 4 products in Shopify catalog | Founder | Already exists |

### Risk Mitigation Strategy

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| **Storefront API doesn't return wholesale prices with buyerIdentity** | Low — reorder flow already uses this pattern | Test with existing B2B customer token before building UI |
| **Product temporarily out of stock** | Medium | Show product but disable quantity selector with "Currently unavailable" message |
| **Partner enters non-numeric or negative quantities** | Low | HTML input type="number" with min=0, client + server validation |

## Functional Requirements

### Product Browsing

- **FR1:** Wholesale partners can view all 4 soap products on a single order page
- **FR2:** Wholesale partners can see the product image for each soap
- **FR3:** Wholesale partners can see the product name for each soap
- **FR4:** Wholesale partners can see their wholesale unit price for each soap

### Order Building

- **FR5:** Wholesale partners can set a quantity for each product (starting at 0)
- **FR6:** Wholesale partners can increment and decrement quantities
- **FR7:** Wholesale partners can type a quantity directly into the input field
- **FR8:** Wholesale partners can skip a product by leaving its quantity at 0
- **FR9:** Wholesale partners can view a running order summary showing selected products, quantities, line totals, and order subtotal
- **FR10:** The order summary updates immediately as quantities change

### Order Validation

- **FR11:** System validates that any non-zero quantity meets the minimum order of 6 units per product
- **FR12:** System displays inline validation feedback when a quantity is between 1 and 5
- **FR13:** System prevents order submission when any product has an invalid quantity (1-5)
- **FR14:** System validates quantities server-side before cart creation
- **FR15:** System disables the checkout button until at least one product has a valid quantity (>=6)

### Order Submission

- **FR16:** Wholesale partners can submit their order via a "Proceed to Checkout" action
- **FR17:** System creates a Shopify cart with the selected line items and the partner's buyer identity
- **FR18:** System redirects the partner to Shopify checkout after successful cart creation
- **FR19:** Wholesale partners receive their B2B wholesale pricing at checkout (applied via buyer identity)

### Navigation & Access

- **FR20:** Wholesale partners can access the order page via a "Place New Order" button on the dashboard
- **FR21:** Wholesale partners can access the order page via a "New Order" link in the wholesale header navigation
- **FR22:** The "Place New Order" button is visible on the dashboard regardless of whether the partner has past orders
- **FR23:** The order page is protected by B2B authentication (only verified wholesale partners can access it)

### Product Availability

- **FR24:** System indicates when a product is temporarily unavailable
- **FR25:** System disables quantity selection for unavailable products

### Error Handling

- **FR26:** System displays a clear error message if cart creation fails
- **FR27:** System preserves the partner's quantity selections if cart creation fails (no data loss)

## Non-Functional Requirements

### Performance

| Requirement | Target | Rationale |
|------------|--------|-----------|
| **NFR1:** Page load (LCP) | <2.5s | Consistent with site-wide CWV targets |
| **NFR2:** Order summary update | <50ms after quantity change | Must feel instant — no lag between input and summary |
| **NFR3:** Cart creation + checkout redirect | <3s total | Partners expect snappy checkout; anything longer feels broken |
| **NFR4:** JS bundle contribution | No new heavy dependencies | Order page must not bloat the wholesale portal bundle |

### Security

| Requirement | Target | Rationale |
|------------|--------|-----------|
| **NFR5:** B2B authentication | Every request to the order page must verify wholesale partner status | Prevents unauthorized access to wholesale pricing |
| **NFR6:** Server-side validation | All quantities validated server-side before cart creation | Client-side validation alone is bypassable |
| **NFR7:** Price integrity | Wholesale prices applied exclusively via Shopify B2B buyer identity — no client-side price logic | Prevents price manipulation |

### Accessibility

| Requirement | Target | Rationale |
|------------|--------|-----------|
| **NFR8:** WCAG compliance | 2.1 AA | Site-wide commitment |
| **NFR9:** Keyboard navigation | All quantity selectors and buttons fully keyboard-operable | Partners may use keyboard for fast data entry |
| **NFR10:** Screen reader support | Product names, prices, quantities, and validation errors announced | Inclusive access to ordering |
| **NFR11:** Touch targets | Minimum 44x44px for increment/decrement buttons | Mobile ordering with touch accuracy |
| **NFR12:** Validation announcements | Inline errors announced to assistive technology via aria-live | Partners using screen readers must know about MOQ violations |

### Integration

| Requirement | Target | Rationale |
|------------|--------|-----------|
| **NFR13:** Storefront API product fetch | Products fetched with buyer identity context to display wholesale pricing | Core pricing mechanism |
| **NFR14:** Cart API compatibility | Cart creation uses same `context.cart.create()` pattern as existing reorder flow | Consistency and proven reliability |
| **NFR15:** Checkout redirect | Shopify-hosted checkout URL returned and navigated to seamlessly | No custom checkout — Shopify handles payments |

### UX Tone & Brand Consistency

| Requirement | Target | Rationale |
|------------|--------|-----------|
| **NFR16:** Validation messaging tone | Non-aggressive, helpful ("Minimum order is 6 units") — no red alerts or modal interruptions | Warm brand voice, consistent with Isla Suds tone |
| **NFR17:** Error recovery messaging | Cart creation failures use warm copy ("Something went wrong. Your order is safe — let's try again.") | Farmers market energy, not corporate error pages |
| **NFR18:** Loading state | Subtle feedback during cart creation (button state change, not spinners) | Consistent with B2B portal patterns |

## Next Steps

### Immediate (Pre-Architecture)

1. **Verify wholesale pricing via Storefront API** — Confirm products return B2B prices when queried with `buyerIdentity` (test with existing partner token)
2. **Architecture phase begins** — Technical design based on this PRD, leveraging existing wholesale patterns

### Architecture Phase

- Route structure and loader/action design for `/wholesale/order`
- GraphQL query design for fetching products with wholesale pricing
- Cart creation flow (reuse existing pattern from reorder)
- Component architecture for product grid, quantity selectors, and order summary

### Development Phase

- Epic breakdown from FRs (likely a single epic with 4-6 stories)
- Story creation with acceptance criteria tied to FRs and NFRs
- Testing strategy: unit tests for validation logic, integration test for cart creation flow

---

_Document Complete. Ready for Architecture phase._
