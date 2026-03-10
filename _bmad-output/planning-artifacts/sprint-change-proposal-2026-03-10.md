---
workflowType: 'correct-course'
project_name: 'isla-suds'
feature_name: 'Wholesale Order Page - Pricing Migration'
user_name: 'Bubbles'
date: '2026-03-10'
author: 'John (PM Agent)'
status: 'approved'
approvedAt: '2026-03-10'
scopeClassification: 'minor'
totalStories: 3
triggeredBy: 'Strategic decision to stay on Shopify Basic instead of upgrading to Shopify Plus'
---

# Sprint Change Proposal — Wholesale Pricing Migration

**Author:** John (PM Agent)
**Date:** 2026-03-10
**Status:** Approved
**Scope Classification:** Minor — Direct implementation by dev team

## Section 1: Issue Summary

**Trigger:** Strategic business decision to remain on Shopify Basic subscription instead of upgrading to Shopify Plus. This eliminates access to Shopify's native B2B pricing features (buyer identity context pricing, B2B price lists) that the current wholesale order page implementation relies on.

**Discovery Context:** Decision made post-implementation. All 3 original epics (9 stories) have been completed. The PRD has already been updated to reflect the new strategy. The codebase and planning artifacts (architecture, epics) still use the old B2B Plus approach.

**Issue Category:** Strategic pivot — cost optimization by avoiding Shopify Plus subscription while maintaining wholesale functionality through alternative mechanisms.

**New Strategy:**
- **Display pricing:** Read from `wholesale.price` variant metafield (set manually in Shopify Admin)
- **Checkout discount:** Shopify Functions app (`isla-suds-wholesale-discount`) applies 20% automatic discount when customer has `wholesale` tag
- **Authentication:** Customer tag-based — already correctly implemented, no change needed

## Section 2: Impact Analysis

### Epic Impact

All 3 epics are complete. No epics need to be added, removed, or resequenced. The change is a targeted modification to the pricing data path within the existing implementation.

- **Epic 1 (Product Browsing & Order Building):** Affected — price display source changes from B2B context to metafield
- **Epic 2 (Order Validation & Checkout):** Affected — checkout discount mechanism changes from B2B pricing to Shopify Functions
- **Epic 3 (Portal Navigation Integration):** Not affected

### Artifact Conflicts

| Artifact | Status | Action Needed |
|----------|--------|---------------|
| PRD (`prd-wholesale-order.md`) | Already updated | None |
| Architecture (`architecture-wholesale-order.md`) | Conflicts — references B2B Plus pricing throughout | Update pricing strategy references |
| Epics (`epics.md`) | Conflicts — FR19 and NFRs reference B2B pricing | Update requirement language |
| UX Design (`ux-design-specification.md`) | Minimal impact — UI layout unchanged | Review for pricing display references |
| Codebase | Uses B2B context pricing | Modify GraphQL query, loader, and components |

### What's Already Correct (No Change Needed)

- Authentication — `isWholesaleCustomer()` in `app/lib/wholesale.ts` already checks customer tags
- Cart creation with `buyerIdentity` — still needed for Shopify Functions tag detection at checkout
- All UI layout, validation logic, navigation, and error handling
- Reorder flow — doesn't display individual product prices, cart creation pattern unchanged
- Session management — `customerAccessToken` storage and retrieval

### What Needs to Change

| Area | Current (B2B Plus) | New (Basic + Tag) |
|------|-------------------|-------------------|
| Product price source | `variant.price` via `@inContext(buyer)` returns B2B pricing | `variant.metafield(namespace:"wholesale", key:"price")` |
| Price display | `<Money data={variant.price} />` | `<Money data={wholesalePrice} />` from metafield |
| Line total calculation | `parseFloat(variant.price.amount) * qty` | `parseFloat(wholesalePrice.amount) * qty` |
| Checkout discount | B2B price list (automatic via buyer identity) | Shopify Functions app detects `wholesale` tag, applies 20% |
| Missing price fallback | N/A (B2B pricing always present) | "Price on request" + quantity selector disabled |

### Files Affected

| File | Change Type | What Changes |
|------|-------------|-------------|
| `app/routes/wholesale.order.tsx` | MODIFY | GraphQL fragment adds metafield; loader maps wholesale price |
| `app/components/wholesale/OrderProductCard.tsx` | MODIFY | Price display uses metafield wholesale price |
| `app/components/wholesale/OrderSummary.tsx` | MODIFY | Line total/subtotal uses metafield wholesale price |
| `app/content/wholesale.ts` | MODIFY | Add "Price on request" content string |
| `_bmad-output/planning-artifacts/architecture-wholesale-order.md` | MODIFY | Update pricing strategy references |
| `_bmad-output/planning-artifacts/epics.md` | MODIFY | Update FR19 and NFR references |

### Files NOT Affected

- `app/lib/wholesale.ts` — auth already tag-based
- `app/routes/wholesale._index.tsx` — reorder uses order history prices, cart creation unchanged
- `app/components/wholesale/QuantitySelector.tsx` — no pricing logic
- `app/components/wholesale/WholesaleHeader.tsx` — no pricing logic
- `app/routes/wholesale.tsx` — layout auth unchanged
- `app/routes/wholesale.login.tsx` — login flow unchanged
- `app/routes/wholesale.login.callback.tsx` — callback unchanged

## Section 3: Recommended Approach

**Selected:** Option 1 — Direct Adjustment

**Rationale:**
- The existing implementation is 90% correct — UI, validation, navigation, auth all work
- Only the pricing data source (metafield vs B2B context) and discount mechanism (Shopify Functions vs B2B pricing) need to change
- Surgical changes to 3-4 code files, focused on how prices are fetched and displayed
- No rollback needed — existing code is a solid foundation
- MVP scope unchanged — same features, different pricing mechanism underneath

**Effort:** Low
**Risk:** Low
**Timeline Impact:** None

## Section 4: Detailed Change Proposals

### CC Story 1: Update Order Page Pricing from B2B Context to Wholesale Metafield

**As a** wholesale partner,
**I want** to see my wholesale prices sourced from the product's wholesale price metafield,
**So that** I get accurate wholesale pricing on Shopify Basic without requiring Shopify Plus B2B features.

**Acceptance Criteria:**

**Given** a product variant has a `wholesale.price` metafield set in Shopify Admin
**When** the order page loads
**Then** the wholesale price from the metafield is displayed (not the variant's retail price)
**And** line totals in the order summary are calculated using the metafield wholesale price
**And** the order subtotal reflects wholesale pricing

**Given** a product variant does NOT have a `wholesale.price` metafield
**When** the order page loads
**Then** "Price on request" is displayed instead of a price
**And** the quantity selector for that product is disabled
**And** the product cannot be added to the order

**Scope:**

```
wholesale.order.tsx:
  - GraphQL fragment: Add `metafield(namespace: "wholesale", key: "price") { value }` to variant fields
  - Loader: Map metafield value + currencyCode into a `wholesalePrice` MoneyV2 object
  - Loader: Handle null metafield (no wholesale price set)

OrderProductCard.tsx:
  - Display `wholesalePrice` instead of `variant.price`
  - Show "Price on request" fallback when wholesalePrice is null
  - Disable quantity selector when no wholesale price

OrderSummary.tsx:
  - Use `wholesalePrice.amount` for line total calculation
  - Skip products without wholesale price in summary

wholesale.ts:
  - Add content string: `priceOnRequest: 'Price on request'`

Run `pnpm codegen` after GraphQL changes
```

**FRs:** FR4 (updated), NFR7 (updated), NFR13 (updated)

---

### CC Story 2: Deploy Shopify Functions Wholesale Discount App

**As a** wholesale partner,
**I want** my 20% wholesale discount applied automatically at checkout,
**So that** I pay wholesale prices without needing Shopify Plus B2B pricing.

**Acceptance Criteria:**

**Given** the `isla-suds-wholesale-discount` Shopify Functions app is deployed
**And** an automatic discount is configured via GraphQL
**When** a customer with the `wholesale` tag proceeds to checkout with `buyerIdentity`
**Then** a 20% discount is applied to all line items

**Given** a customer WITHOUT the `wholesale` tag
**When** they proceed to checkout
**Then** no wholesale discount is applied

**Scope:**
- Build the Shopify Functions discount extension
- Deploy via `shopify app deploy`
- Create automatic discount via GraphQL Admin API
- Document setup steps in `docs/wholesale-discount-update-guide.md`
- Verify `buyerIdentity: {customerAccessToken}` on cart creation carries customer tag through to Shopify Functions

**FRs:** FR19 (updated)

**Pre-development dependency from PRD — blocks checkout pricing accuracy**

---

### CC Story 3: Update Planning Artifacts for Tag-Based Pricing Strategy

**As a** development team member,
**I want** the architecture and epics documents updated to reflect the new pricing strategy,
**So that** documentation accurately describes the implemented system.

**Acceptance Criteria:**

**Given** the architecture document
**When** I reference pricing decisions
**Then** all mentions of "B2B price list," "buyer identity for pricing," and "B2B Plus" are replaced with metafield + Shopify Functions references

**Given** the epics document
**When** I reference FR19 and related NFRs
**Then** they match the updated PRD language (metafield display + Shopify Functions checkout discount)

**Scope:**

```
architecture-wholesale-order.md:
  - Data Architecture section: metafield source instead of buyer identity pricing
  - NFR7 references: metafield + Shopify Functions instead of B2B
  - GraphQL query description: include metafield fetch
  - Implementation risk: verify metafield + Shopify Functions instead of B2B pricing

epics.md:
  - FR19: "20% automatic discount via Shopify Functions" instead of "B2B wholesale pricing via buyer identity"
  - NFR7, NFR13 references updated
  - Story 1.1 scope: metafield query instead of buyer identity pricing
  - Story 2.2 scope: Shopify Functions discount instead of B2B pricing
```

## Section 5: Implementation Handoff

### Scope Classification: Minor

Direct implementation by development team. No backlog reorganization or strategic replan required.

### Implementation Sequence

| Order | Story | Depends On | Assignee |
|-------|-------|-----------|----------|
| 1 | CC Story 2 (Shopify Functions app) | Nothing — pre-development dependency | Developer |
| 2 | CC Story 1 (Code changes) | CC Story 2 deployed for end-to-end testing | Developer |
| 3 | CC Story 3 (Doc updates) | CC Stories 1 & 2 complete | Developer / PM |

### Founder Tasks (Pre-Development)

| Task | Owner | Notes |
|------|-------|-------|
| Add `wholesale.price` metafield to each of the 4 product variants | Founder | Via Shopify Admin > Products > [product] > Variants > Metafields |
| Set wholesale price values for all 4 products | Founder | Values should match intended wholesale pricing |

### Success Criteria

- Order page displays wholesale prices from metafields (not retail prices)
- "Price on request" shown for any product missing the metafield
- Line totals and subtotal calculated correctly with wholesale prices
- 20% discount applied at checkout for `wholesale`-tagged customers
- No discount applied for non-wholesale customers
- All existing validation, navigation, and error handling continues to work
- Architecture and epics documents accurately reflect the implemented system

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `wholesale.price` metafield not set on a variant | Medium | Product shows "Price on request" — correct fallback | Founder task to set metafields before launch |
| Shopify Functions app not deployed | Low | Partners see retail price at checkout | CC Story 2 is first priority; blocks CC Story 1 testing |
| `buyerIdentity` doesn't carry customer tag to Shopify Functions | Low | Discount not applied at checkout | Verify in CC Story 2 before proceeding |

---

**Proposal Status:** APPROVED by Bubbles on 2026-03-10
**Handoff:** Development team for direct implementation
