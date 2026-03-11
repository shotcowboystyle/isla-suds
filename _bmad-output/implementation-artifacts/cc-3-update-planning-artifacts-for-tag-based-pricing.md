# Story CC.3: Update Planning Artifacts for Tag-Based Pricing Strategy

Status: complete

## Story

As a development team member,
I want the architecture and epics documents updated to reflect the new tag-based wholesale pricing strategy,
so that documentation accurately describes the implemented system and future agents don't implement against the old B2B Plus approach.

## Context

**Why this exists:** The business decided to stay on Shopify Basic instead of upgrading to Shopify Plus. CC-1 (code changes) and CC-2 (Shopify Functions app deployment) are both **done**. The PRD (`prd-wholesale-order.md`) has already been updated to reflect the new strategy. Two planning artifacts still reference the old B2B Plus pricing approach and need to match the PRD.

**The new pricing model (already implemented):**
- **Display price:** `wholesale.price` variant metafield (set in Shopify Admin)
- **Checkout discount:** Shopify Functions app (`isla-suds-wholesale-discount`) applies 20% automatic discount when customer has `wholesale` tag
- **Authentication:** Customer tag-based (`wholesale` tag) — was already correct, unchanged

**What does NOT change:** buyerIdentity is still passed on cart creation — it's needed for Shopify Functions tag detection at checkout. Auth is still tag-based. All UI, validation, navigation, and error handling remain the same.

## Acceptance Criteria

1. **Given** the architecture document (`architecture-wholesale-order.md`), **when** referencing pricing decisions, **then** all mentions of "B2B price list," "buyer identity for pricing," and "B2B Plus" are replaced with metafield + Shopify Functions references.
2. **Given** the epics document (`epics.md`), **when** referencing FR19 and related NFRs, **then** they match the updated PRD language (metafield display + Shopify Functions checkout discount).
3. **Given** the architecture document's Implementation Risk section, **when** it references verifying Storefront API buyer identity returns wholesale pricing, **then** the risk is marked as resolved (the risk was about B2B Plus pricing — the new metafield approach has been verified in CC-1).
4. **Given** both documents after updates, **when** compared against the PRD (`prd-wholesale-order.md`), **then** there are zero contradictions between the three documents regarding the pricing strategy.

## Tasks / Subtasks

- [x] **Task 1: Update architecture-wholesale-order.md — Data Architecture section** (AC: 1)
  - [x] 1.1: Line ~37 in Requirements Overview — Update FR19 summary: change "wholesale pricing applied via B2B price list" to "20% automatic discount via Shopify Functions app when `wholesale` customer tag detected"
  - [x] 1.2: Lines ~45-46 in NFR summary — Update "prices exclusively via Shopify buyer identity" to "wholesale unit prices from variant metafields (`wholesale.price`); checkout discount via Shopify Functions"
  - [x] 1.3: Line ~47 — Update "Storefront API with buyer identity context" to "Storefront API with variant metafield for wholesale price display"
  - [x] 1.4: Line ~60 — Update constraint: "Storefront API buyer identity — wholesale prices returned only when products are queried with authenticated buyer identity context" to "Storefront API variant metafields — wholesale prices from `wholesale.price` metafield; buyerIdentity still needed for Shopify Functions discount at checkout"
  - [x] 1.5: Lines ~112-116 Data Architecture decision — Update rationale: change "Loader queries products by handle via `context.storefront.query()` with buyer identity context to surface wholesale pricing" to "Loader queries products by handle, extracts `wholesale.price` variant metafield, and maps to MoneyV2 for display. buyerIdentity still passed on cart creation for Shopify Functions tag detection"
  - [x] 1.6: Line ~115 — Update "Prices are NEVER computed or stored client-side — Shopify B2B price list is the sole source of truth (NFR7)" to "Prices are NEVER computed client-side — `wholesale.price` variant metafield is the display price source; checkout discount applied by Shopify Functions (NFR7)"

- [x] **Task 2: Update architecture-wholesale-order.md — API & Patterns sections** (AC: 1, 3)
  - [x] 2.1: Lines ~139-144 API section — Update GraphQL query description to include `metafield(namespace: "wholesale", key: "price") { value type }` in variant fields
  - [x] 2.2: Line ~141 — Change "Buyer identity context applied at query level to surface B2B pricing" to "Variant metafield fetched for wholesale price display; buyerIdentity passed on cart creation (not on product query)"
  - [x] 2.3: Lines ~270-277 Price Display pattern — Update code example: replace "Shopify's Money type directly from API response" guidance with "Wholesale price from metafield, mapped in loader to MoneyV2. Show 'Price on request' fallback when metafield missing"
  - [x] 2.4: Lines ~330-331 Anti-patterns table — Update: "Client-side price calculation | Wholesale prices must come from Shopify B2B (NFR7)" to "Client-side price calculation | Wholesale prices from `wholesale.price` metafield via loader (NFR7)"
  - [x] 2.5: Lines ~438-441 Integration Points — Update Storefront API description to reflect metafield-based pricing
  - [x] 2.6: Lines ~475-479 Implementation Risk — Mark as **RESOLVED**: "The Storefront API buyer identity mechanism for wholesale pricing has been replaced by variant metafield approach. Implemented and verified in CC-1. Metafield + Shopify Functions approach confirmed working."

- [x] **Task 3: Update epics.md — FR19 and NFR references** (AC: 2)
  - [x] 3.1: Line ~57-58 — Update FR19: "Wholesale partners receive their B2B wholesale pricing at checkout (applied via buyer identity)" to "Wholesale partners receive an automatic 20% discount at checkout, applied by the Shopify Functions discount app when the partner's `wholesale` customer tag is detected via buyer identity"
  - [x] 3.2: Line ~84 — Update NFR7: "Wholesale prices applied exclusively via Shopify B2B buyer identity — no client-side price logic" to "Wholesale unit prices sourced from variant metafields (`wholesale.price`) — no client-side price calculation. Checkout discount applied exclusively via Shopify Functions"
  - [x] 3.3: Line ~94 — Update NFR13: "Products fetched with buyer identity context to display wholesale pricing via Storefront API" to "Products fetched with `wholesale.price` variant metafield for price display; customer access token passed as buyer identity so Shopify Functions can detect the `wholesale` tag at checkout"

- [x] **Task 4: Update epics.md — Story scope references** (AC: 2)
  - [x] 4.1: Lines ~182-183 Story 1.1 AC — Update "prices are fetched via Storefront API with buyer identity context (wholesale B2B pricing)" to "prices are sourced from variant `wholesale.price` metafield; 'Price on request' shown for missing metafields"
  - [x] 4.2: Line ~189 Story 1.1 Scope — Update "Includes verifying Storefront API returns wholesale prices with buyer identity as architecture risk gate" to "Architecture risk gate resolved — metafield approach verified in CC-1"
  - [x] 4.3: Lines ~343 Story 2.2 AC — Update "wholesale B2B pricing is applied at checkout (NFR7 — via buyer identity, not client-side)" to "20% wholesale discount is applied at checkout via Shopify Functions (NFR7 — Shopify Functions detects `wholesale` tag, not client-side)"

- [x] **Task 5: Cross-document verification** (AC: 4)
  - [x] 5.1: Read all three docs (PRD, architecture, epics) and verify zero contradictions on pricing strategy
  - [x] 5.2: Verify `buyerIdentity` is consistently described as needed for Shopify Functions (checkout discount), NOT for product price display

## Dev Notes

### This is a documentation-only story

No code changes. No tests. No codegen. Just updating two markdown files in `_bmad-output/planning-artifacts/`.

### Files to Modify (2 files only)

| File | What Changes |
|------|-------------|
| `_bmad-output/planning-artifacts/architecture-wholesale-order.md` | ~12 text replacements across Data Architecture, API, Patterns, Anti-patterns, Integration, and Risk sections |
| `_bmad-output/planning-artifacts/epics.md` | ~6 text replacements across FR19, NFR7, NFR13, and Story 1.1/2.2 scope references |

### Source of Truth for New Language

The PRD (`_bmad-output/planning-artifacts/prd-wholesale-order.md`) is the canonical source. It's already been updated. Match its language exactly:

- **FR4:** "wholesale unit price for each soap, sourced from the variant's `wholesale.price` metafield configured in Shopify Admin"
- **FR19:** "automatic 20% discount at checkout, applied by the Shopify Functions discount app when the partner's `wholesale` customer tag is detected via buyer identity"
- **NFR7:** "Wholesale unit prices sourced from variant metafields (`wholesale.price`) — no client-side price calculation. Checkout discount applied exclusively via Shopify Functions"
- **NFR13:** "Products fetched with `wholesale.price` variant metafield for price display; customer access token passed as buyer identity so Shopify Functions can detect the `wholesale` tag at checkout"

### Key Distinction to Preserve

`buyerIdentity` is still used — but its purpose changed:
- **Old (B2B Plus):** buyerIdentity on product query → Shopify returns wholesale prices
- **New (Basic + Tags):** buyerIdentity on cart creation → Shopify Functions detects `wholesale` tag → applies 20% discount at checkout

Do NOT remove buyerIdentity references. Update them to clarify the new purpose.

### What NOT To Do

- **DO NOT** modify the PRD — it's already correct
- **DO NOT** modify any code files — this is documentation only
- **DO NOT** change structural formatting, YAML frontmatter, or section headers in the architecture/epics docs
- **DO NOT** rewrite sections wholesale — make targeted text replacements only
- **DO NOT** remove the Implementation Risk section — update it to show resolved status
- **DO NOT** change FR/NFR numbering — only update the text content
- **DO NOT** update `project-context.md` — it doesn't reference wholesale pricing strategy specifics

### Previous Story Intelligence (CC-1)

CC-1 implemented the actual code changes. Key learnings relevant to this doc update:
- Metafield type can be `number_decimal` or `money` — the loader handles both
- `wholesalePrice` is a derived value created in the loader (type: `{ amount: string; currencyCode: string } | null`)
- "Price on request" fallback was added for missing metafields
- Products without wholesale price have disabled quantity selectors
- `buyerIdentity` was kept on cart creation (needed for Shopify Functions)
- `variant.price` (retail) was kept in the GraphQL fragment — used for currency source

### CC-2 Context

The Shopify Functions discount app (`isla-suds-wholesale-discount`) is deployed and active. It detects the `wholesale` customer tag via buyerIdentity and applies a 20% automatic discount to all line items.

### References

- [Source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-10.md` — CC Story 3 requirements and scope]
- [Source: `_bmad-output/planning-artifacts/prd-wholesale-order.md` — Canonical pricing language (FR4, FR19, NFR7, NFR13)]
- [Source: `_bmad-output/planning-artifacts/architecture-wholesale-order.md` — Target file for updates]
- [Source: `_bmad-output/planning-artifacts/epics.md` — Target file for updates]
- [Source: `_bmad-output/implementation-artifacts/cc-1-update-order-page-pricing-to-wholesale-metafield.md` — Previous story implementation details]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — documentation-only story, no code execution.

### Completion Notes List

- All 18 text replacements across 2 files completed as specified
- Architecture doc: 12 replacements (6 Data Architecture + 6 API/Patterns)
- Epics doc: 6 replacements (3 FR/NFR refs + 3 Story scope refs)
- Cross-document verification passed: zero contradictions between PRD, architecture, and epics
- buyerIdentity consistently described as needed for Shopify Functions (checkout discount), NOT for product price display
- No structural changes, no header changes, no numbering changes — targeted text only

### File List

| File | Action |
|------|--------|
| `_bmad-output/planning-artifacts/architecture-wholesale-order.md` | MODIFIED — 12 text replacements |
| `_bmad-output/planning-artifacts/epics.md` | MODIFIED — 6 text replacements |
| `_bmad-output/implementation-artifacts/cc-3-update-planning-artifacts-for-tag-based-pricing.md` | MODIFIED — tasks marked complete, dev agent record filled |
