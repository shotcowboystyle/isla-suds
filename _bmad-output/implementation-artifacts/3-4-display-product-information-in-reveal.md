# Story 3.4: Display Product Information in Reveal

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to see product name, price, and description in the texture reveal**,
So that **I understand what I'm considering before adding to cart**.

## Acceptance Criteria

### AC1: Product name displayed in fluid-heading typography

**Given** a texture reveal is active (Stories 3.1–3.3 complete)
**When** viewing the reveal content
**Then** product name is displayed with `fluid-heading` typography
**And** name is sourced from Shopify Storefront API product data
**And** name has sufficient contrast (WCAG 2.1 AA)

### AC2: Price formatted with currency symbol

**Given** a texture reveal is active
**When** viewing the reveal content
**Then** price is displayed with currency symbol (e.g., $12.00)
**And** price comes from Storefront API (product or selected variant)
**And** price updates if product has variants and user selects a variant
**And** formatting respects store currency/locale

### AC3: Brief product description (1–2 sentences)

**Given** a texture reveal is active
**When** viewing the reveal content
**Then** a brief product description (1–2 sentences) is displayed
**And** description comes from Storefront API (product description or metafield)
**And** fallback exists in `app/content/products.ts` if description missing
**And** text meets 4.5:1 contrast

### AC4: Add to Cart button styled and placeholder until Epic 5

**Given** a texture reveal is active
**When** viewing the reveal content
**Then** an "Add to Cart" button is visible and styled (accent, prominent)
**And** button is a placeholder: no cart mutation until Epic 5
**And** button is keyboard-focusable with visible focus ring
**And** button has accessible label (e.g., "Add [Product name] to cart")

### AC5: All product data from Storefront API

**Given** constellation products are loaded from the home route
**When** texture reveal displays product information
**Then** name, price, description come from the same Storefront API response used for the constellation
**And** no additional network requests during reveal (data already in props)
**And** use generated types from `storefrontapi.generated.d.ts`

### AC6: Accessibility (WCAG 2.1 AA) and reduced motion

**Given** any user viewing the reveal
**When** product information is displayed
**Then** all text meets 4.5:1 contrast against background
**And** focus order is logical (image → narrative → name → price → description → Add to Cart)
**And** screen readers announce product name, price, description, and button
**And** any decorative transitions respect `prefers-reduced-motion`

**FRs addressed:** FR10 (Product name, price, description in reveal)

---

## Tasks / Subtasks

- [x] **Task 1: Ensure product fields in GraphQL and types** (AC: #1, #2, #3, #5)
  - [x] Confirm home route / constellation query includes: title, price (Money), description, variants (if any)
  - [x] Add product description to fragment if missing (description or metafield)
  - [x] Run `pnpm codegen` and use generated types in TextureReveal/product components
  - [x] Document which fragment/query supplies reveal product data

- [x] **Task 2: Create ProductRevealInfo component** (AC: #1, #2, #3, #4, #6)
  - [x] Create `app/components/product/ProductRevealInfo.tsx`
  - [x] Props: product (Storefront API product type), optional variant for price
  - [x] Render: product name (`text-fluid-heading`), formatted price, description (truncate if long)
  - [x] Add "Add to Cart" button (styled, onClick placeholder/no-op or console.log until Epic 5)
  - [x] Use `cn()` for classnames; accent button styling per design tokens
  - [x] Ensure focus ring and aria-label on button
  - [x] Export from `app/components/product/index.ts`
  - [x] Write unit tests for ProductRevealInfo

- [x] **Task 3: Price formatting utility** (AC: #2)
  - [x] Add or use existing price formatter (e.g., `formatMoney` from Hydrogen or custom in `app/utils/` or `app/lib/`)
  - [x] Format with currency symbol; respect Money type from Storefront API
  - [x] Use in ProductRevealInfo for display

- [x] **Task 4: Description fallback in content** (AC: #3)
  - [x] In `app/content/products.ts` (or extend), add brief description fallbacks keyed by handle if needed
  - [x] Helper e.g. `getProductDescription(handle, apiDescription)` — prefer API, fallback to content
  - [x] Keep descriptions 1–2 sentences

- [x] **Task 5: Integrate ProductRevealInfo into TextureReveal** (AC: #1–#6)
  - [x] In `TextureReveal.tsx`, add ProductRevealInfo below ScentNarrative (or alongside per layout)
  - [x] Pass product (and selected variant if applicable) from existing props
  - [x] Ensure layout does not obscure texture image; information complements scent narrative
  - [x] Update TextureRevealProps if new props needed
  - [x] Update TextureReveal tests for product info section

- [x] **Task 6: Accessibility and contrast verification** (AC: #6)
  - [x] Verify focus order and screen reader flow
  - [x] Confirm contrast for name, price, description (background may be overlay)
  - [x] Add or extend tests for keyboard navigation and ARIA

- [x] **Task 7: Run verification checks** (AC: #1–#6)
  - [x] Run `pnpm lint` — no errors
  - [x] Run `pnpm typecheck` — no errors
  - [x] Run `pnpm test` — all tests passing
  - [x] Manual check: reveal shows name, price, description, button on desktop and mobile

---

## Dev Notes

### Why this story matters

Story 3.3 gave visitors the scent narrative; this story gives them the **purchase context**: name, price, and description. Together with the texture image and scent copy, the reveal becomes a complete product card. The "Add to Cart" button is styled and in place so Epic 5 only wires the mutation—no layout or copy rework.

### Guardrails (don't let the dev agent drift)

- **DO NOT** add real add-to-cart API calls—placeholder only until Epic 5
- **DO NOT** fetch product data inside TextureReveal—use data already passed from constellation/route
- **DO NOT** hardcode product names/prices/descriptions in components—use API + `app/content/products.ts` fallbacks
- **DO NOT** use layout/width/height animations for this section—opacity or simple fade only if any
- **DO NOT** obscure the texture image or scent narrative—position product info to complement
- **DO NOT** skip contrast (4.5:1) or focus order
- **DO NOT** use static Framer Motion import—if animation needed, use `~/lib/motion`

### Architecture compliance

| Decision | Implementation |
|----------|----------------|
| Product data source | Storefront API via existing route/constellation query |
| Content fallbacks | `app/content/products.ts` for description if API empty |
| Typography | Fluid typography (`fluid-heading` for name, `fluid-body` for description) |
| Price | Money type from API; format with currency via Hydrogen or app utility |
| Accessibility | WCAG 2.1 AA contrast, keyboard focus, screen reader order |
| Component location | `app/components/product/ProductRevealInfo.tsx` |

**From project-context.md:**

- Path alias `~/` → `app/`
- Use `cn()` for classnames
- Content centralization: product copy in `app/content/products.ts`
- Add to Cart: styled only; no cart mutation in this story

### Previous story intelligence (Story 3.3: Scent Narrative)

**What Story 3.3 provides (ALREADY IMPLEMENTED):**

1. **TextureReveal** already shows texture image + ScentNarrative
2. **ConstellationGrid** passes product + scent narrative into TextureReveal
3. **Product data** is already available in TextureReveal props (same product used for image and narrative)
4. **GraphQL:** Product fragment may already include title, price; confirm description/variants
5. **Layout:** Narrative is positioned (e.g. bottom overlay). Product info should sit below or beside without crowding.

**Key files to extend:**

- `app/components/product/TextureReveal.tsx` — Add ProductRevealInfo section
- `app/components/product/ConstellationGrid.tsx` — No change if product already passed; ensure fragment has description/price
- `app/content/products.ts` — Add description fallback helper if needed
- `app/routes/_index.tsx` or product fragment — Confirm description (and variant price) in query

**Patterns to follow from 3.3:**

- Reuse same product prop for name/price/description
- Use fluid typography and design tokens
- Keep contrast (backdrop/gradient if over image)
- No new network requests in reveal

### Technical requirements (dev agent guardrails)

| Requirement | Detail |
|-------------|--------|
| Product name | From API `product.title`; display with `fluid-heading` |
| Price | From API product or selected variant; format with currency |
| Description | From API `product.description` or metafield; 1–2 sentences; fallback in content |
| Add to Cart | Styled button; no `cartLinesAdd` or mutation until Epic 5 |
| Types | Use `storefrontapi.generated.d.ts`; no hand-written Storefront types |
| Contrast | 4.5:1 for all text (use overlay/backdrop if needed) |

### File structure requirements

**New files (if any):**

- `app/components/product/ProductRevealInfo.tsx`
- `app/components/product/ProductRevealInfo.test.tsx`
- Optional: `app/utils/format-money.ts` or use Hydrogen helper

**Existing files to modify:**

- `app/components/product/TextureReveal.tsx` — Integrate ProductRevealInfo
- `app/components/product/TextureReveal.test.tsx` — Tests for product info
- `app/components/product/index.ts` — Export ProductRevealInfo
- `app/content/products.ts` — Description fallback if needed
- GraphQL (e.g. `_index.tsx` or fragment) — Ensure description/price/variants in query; run codegen

**Do NOT:**

- Implement real add-to-cart in this story
- Add new dependencies for formatting (use Hydrogen or small util)
- Static-import Framer Motion for this section

### Testing requirements

| Type | What to test |
|------|--------------|
| Unit | ProductRevealInfo renders name, price, description from props |
| Unit | Price formatted with currency |
| Unit | Description uses fallback when API description empty |
| Unit | Add to Cart button has focus ring and accessible name |
| Unit | TextureReveal includes ProductRevealInfo when product provided |
| Integration | Reveal shows full content (image + narrative + name + price + description + button) |
| Accessibility | Focus order and contrast |

### Project context reference

- **Project context:** `_bmad-output/project-context.md` — technology stack, content rules, accessibility, bundle budget
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` — texture reveal contract, Storefront API, component layout
- **Epics:** `_bmad-output/planning-artifacts/epics.md` — Story 3.4, FR10

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 3.4, FR10]
- [Source: `_bmad-output/project-context.md` — Content, typography, accessibility]
- [Source: `_bmad-output/implementation-artifacts/3-3-display-scent-narrative-copy-in-reveal.md` — TextureReveal + ScentNarrative integration]
- [Source: `app/components/product/TextureReveal.tsx` — Integration target]
- [Source: `app/content/products.ts` — Fallback content pattern]

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None - implementation completed without issues.

### Completion Notes List

✅ **All acceptance criteria satisfied**

- AC1: Product name displayed with fluid-heading typography
- AC2: Price formatted with currency symbol from Storefront API
- AC3: Brief product description (1-2 sentences) with fallback support
- AC4: Add to Cart button styled (placeholder until Epic 5)
- AC5: All product data from Storefront API (no extra network requests)
- AC6: WCAG 2.1 AA accessibility compliance

**Implementation approach:**

- Added `description` field to RecommendedProduct GraphQL fragment
- Created `ProductRevealInfo` component with product name, price, description, and Add to Cart button
- Created `formatMoney` utility for currency formatting
- Extended `app/content/products.ts` with `getProductDescription` helper for fallbacks
- Integrated ProductRevealInfo into TextureReveal below ScentNarrative
- All components use generated types from storefrontapi.generated.d.ts
- Button is placeholder (no-op) until Epic 5 cart implementation

**Testing:**

- Unit tests for ProductRevealInfo (9 tests)
- Integration test in TextureReveal for product info display
- All 222 tests passing
- Accessibility tests verify focus ring, aria-label, and keyboard navigation

### File List

**New files:**

- `app/components/product/ProductRevealInfo.tsx`
- `app/components/product/ProductRevealInfo.test.tsx`
- `app/utils/format-money.ts`

**Modified files:**

- `app/routes/_index.tsx` - Added description field to RecommendedProduct fragment
- `storefrontapi.generated.d.ts` - Regenerated with description field
- `app/components/product/TextureReveal.tsx` - Integrated ProductRevealInfo and documented AC6 focus/read order
- `app/components/product/TextureReveal.test.tsx` - Added test for product info
- `app/components/product/index.ts` - Exported ProductRevealInfo
- `app/content/products.ts` - Added getProductDescription helper and PRODUCT_DESCRIPTIONS
- `app/components/product/ConstellationGrid.test.tsx` - Added description field to mocks
- `app/components/product/ProductCard.test.tsx` - Added description field to mock
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - Synced story status to done
