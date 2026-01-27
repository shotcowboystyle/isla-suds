# Story 2.3: Build Constellation Grid Layout

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to see all 4 soap products arranged in an organic constellation**,
so that **I can explore them in any order like at the farmers market booth**.

## Acceptance Criteria

### AC1: Organic constellation layout (desktop ≥1024px)

**Given** I scroll past the hero section on desktop (viewport ≥1024px)
**When** the constellation section enters the viewport
**Then** I see all 4 product cards in an organic, non-grid layout

**And** cards have subtle rotations (e.g. -3° to +3°) so the layout feels hand-placed, not rigid
**And** layout uses CSS (transform, grid/flex with custom positions) or Framer Motion layout—no scroll listeners; IO only for “in view” if needed
**And** design tokens (e.g. `--space-*`, `--ease-out-expo`) are used; no hardcoded px for spacing in the layout system
**And** breakpoint for “desktop” is 1024px (`lg:` in Tailwind) per project-context

### AC2: 2-column grid (mobile <1024px)

**Given** I view the constellation on mobile (viewport <1024px)
**When** the section is visible
**Then** I see a 2-column grid with no rotations

**And** cards stack in a simple 2×2 or 2-column flow
**And** layout is fluid from 320px up to just below 1024px
**And** scroll-snap from Story 2.2 applies to this section via `snap-start` (already used on home sections)

### AC3: Subtle float/hover on desktop

**Given** I am on desktop viewing the constellation
**When** I hover over a product card (or focus it)
**Then** the card has a subtle float/hover treatment

**And** treatment is GPU-composited (transform, opacity) only—no layout-triggering properties
**And** if Framer Motion is used, it MUST be via dynamic import per project-context (bundle budget)
**And** hover/focus state is optional “nice-to-have” emphasis; core requirement is layout and keyboard access

### AC4: Product image placeholder per card

**Given** I view the constellation
**When** each product card is shown
**Then** each card shows a product image (placeholder until Epic 3)

**And** use Hydrogen `Image` with data from Storefront API (same product shape as current RecommendedProducts/FeaturedCollection if reused)
**And** image uses `aspectRatio="1:1"` or equivalent so layout is reserved and CLS stays <0.1 (Story 2.2)
**And** alt text is meaningful (product title) or empty string if purely decorative

### AC5: Fluid layout 320px–2560px

**Given** I resize the viewport from 320px to 2560px
**When** the constellation is visible
**Then** the layout remains usable and readable at all widths

**And** no horizontal overflow; content reflows or scales within viewport
**And** typography uses fluid scale (`fluid-body`, `fluid-heading`) where text appears

### AC6: Keyboard navigation and focus order

**Given** I navigate with keyboard only
**When** I Tab through the page
**Then** all 4 product cards are focusable (Tab stop)

**And** focus order follows visual flow (e.g. top-left → top-right → bottom-left → bottom-right, or reading order of the constellation)
**And** focus indicator is visible (use design token or Tailwind ring/outline)
**And** Enter/Space on a card does not submit forms; cards are links or buttons with explicit semantics (e.g. “View [product name]” or “Explore [product name]”)

**FRs addressed:** FR1

---

## Tasks / Subtasks

- [x] **Task 1: Create constellation layout component** (AC: #1, #2, #5)
  - [x] Add `app/components/product/` if it does not exist; create `ConstellationGrid.tsx` (or equivalent name per architecture)
  - [x] Implement desktop layout: organic positions with subtle rotations (CSS transform or Framer Motion with dynamic import)
  - [x] Implement mobile layout: 2-column grid, no rotations, fluid 320–1024px
  - [x] Use `cn()` for classNames; design tokens for spacing; `lg:` breakpoint for desktop
  - [x] Ensure section has `snap-start` when used on home (Story 2.2 snap points)
  - [x] Co-locate `ConstellationGrid.test.tsx` for layout/keyboard behavior

- [x] **Task 2: Product card with image placeholder** (AC: #4)
  - [x] Create or reuse a card component (e.g. `ProductCard.tsx` in `app/components/product/`) that renders one product
  - [x] Use Hydrogen `Image` with Storefront product data; `aspectRatio="1:1"` (or equivalent) to avoid CLS
  - [x] Provide meaningful alt or `alt=""` when decorative
  - [x] Ensure card is a single focusable unit (link or button) for AC6

- [x] **Task 3: Desktop hover/focus treatment** (AC: #3)
  - [x] Add subtle scale/shadow or equivalent on hover and focus (desktop only if desired)
  - [x] Use only transform/opacity; no layout-affecting changes
  - [x] If using Framer Motion: dynamic import only; do not add static import (bundle budget)

- [x] **Task 4: Keyboard accessibility and focus order** (AC: #6)
  - [x] Make each card focusable (appropriate role and tabIndex or native focusable element)
  - [x] Order DOM or use `order`/grid so focus order matches visual flow
  - [x] Visible focus style (e.g. `focus-visible:ring-2` with accent token)
  - [x] Ensure no form submit on Enter/Space (use `<Link>` or `<button type="button">`)

- [x] **Task 5: Integrate into home route** (AC: #1–#6)
  - [x] Use constellation component in `app/routes/_index.tsx` with the same product/collection data as current FeaturedCollection/RecommendedProducts (or replace one section with constellation)
  - [x] Keep HeroSection first; constellation section second with `snap-start`
  - [x] Preserve deferred/async data pattern if currently used; avoid CLS with min-height or skeleton
  - [x] Run `pnpm lint` and `pnpm typecheck`; run `pnpm test` and `pnpm test:smoke`

---

## Dev Notes

### Why this story matters

The constellation is the “farmers market booth” moment: all 4 soaps visible at once, explorable in any order. Getting layout (organic desktop, 2-col mobile), images, and keyboard access right here sets up Story 2.4 (non-linear exploration) and Epic 3 (texture reveals).

### Guardrails (don’t let the dev agent drift)

- **Do NOT** use scroll event listeners for layout or “in view” logic—use Intersection Observer only (Story 2.2).
- **Do NOT** static-import Framer Motion—dynamic import only (project-context bundle budget).
- **Do NOT** break scroll-snap on home: keep `snap-start` on the constellation section.
- **Do NOT** introduce CLS: reserve space for images (e.g. aspect-ratio, min-height).
- **Do NOT** add new dependencies without checking bundle impact (<200KB gzipped total).
- **Do NOT** hardcode copy; use `app/content/` or placeholders from content/errors patterns.

### Architecture compliance

**From architecture.md:**

- Component structure: `app/components/product/` contains `ProductCard`, `ConstellationGrid`, etc.
- Product discovery lives in `app/components/product/` and `app/routes/_index.tsx`.
- File naming: PascalCase.tsx for components; `ConstellationGrid`, `ProductCard`.

**From project-context.md:**

- Path alias `~/` → `app/` (e.g. `~/components/product/ConstellationGrid`).
- `cn()` for classNames; no template literals for conditional Tailwind.
- Framer Motion: dynamic import only; contributes ~30–40KB, must not be in main bundle.
- CVA: co-locate in component or use `app/lib/variants.ts` if shared.

**From epics / UX:**

- Constellation: all 4 products visible, organic layout desktop, 2-col mobile; fluid 320–2560px; keyboard navigable, focus order follows visual flow.

### Previous story intelligence (Story 2.2: Scroll experience)

**Relevant patterns:**

- Home structure in `app/routes/_index.tsx`: HeroSection → FeaturedCollection → RecommendedProducts; sections use `snap-start`.
- FeaturedCollection and RecommendedProducts are inline in `_index.tsx`; RecommendedProducts already shows 4 products in a 2/4-col grid with ProductItem.
- Scroll-snap is on `html` in `app/styles/app.css` for mobile; sections use `snap-start`.
- IO only for scroll-linked behavior; no scroll listeners (documented in `app/lib/scroll.ts`).
- RecommendedProducts uses Suspense + min-h grid fallback to avoid CLS; ProductItem and Hydrogen Image are used.

**For this story:**

- Constellation can replace or wrap the “4 products” part of the home (e.g. replace RecommendedProducts’ layout with ConstellationGrid, or add a new section that uses the same product data).
- Reuse loader data (e.g. `recommendedProducts` or `featuredCollection.products`) so no new loader contract is required unless we intentionally change data shape.
- Keep `snap-start` on the constellation section so mobile scroll-snap still works.

### Technical requirements (dev agent guardrails)

| Requirement | Detail |
| ----------- |--------|
| **Layout** | Desktop: organic positions + rotations; mobile: 2-col grid. Use CSS or dynamically imported Framer Motion. |
| **Images** | Hydrogen `Image`, aspect ratio reserved, CLS <0.1. |
| **Motion** | Framer Motion only via dynamic import; GPU-only (transform, opacity). |
| **Breakpoint** | 1024px (`lg:`) for desktop vs mobile. |
| **Focus** | All cards focusable; order follows visual flow; visible focus ring. |

### File structure requirements

**Existing (do not duplicate):**

- `app/routes/_index.tsx` – HeroSection, FeaturedCollection, RecommendedProducts; loader with featuredCollection and recommendedProducts.
- `app/components/ProductItem.tsx` – used in RecommendedProducts; can be reused or wrapped by ProductCard.
- `app/components/story/HeroSection.tsx` – first section; keep as-is.
- `app/lib/scroll.ts` – IO-only policy; no changes needed.
- `app/styles/app.css` – scroll-snap on html; no changes needed for this story.

**Likely to add or touch:**

- `app/components/product/ConstellationGrid.tsx` – constellation layout wrapper.
- `app/components/product/ProductCard.tsx` – single product card (or alias/wrapper around ProductItem if sufficient).
- `app/components/product/index.ts` – barrel export if needed.
- `app/routes/_index.tsx` – swap or add constellation section; keep loader and deferred data pattern.

**Do not:**

- Add scroll listeners for layout or “in view”; use IO only.
- Static-import Framer Motion.
- Create a new `app/components/product/` layout that conflicts with architecture (product/ is the right place).

### Testing requirements

| Type | What to test |
|------|---------------|
| **Unit** | ConstellationGrid: renders 4 cards; layout class/role correct. ProductCard: image and focusable. |
| **Integration** | Home: constellation section visible after hero; no CLS; keyboard Tab order matches visual order. |
| **Manual** | 320px, 768px, 1024px, 2560px: layout correct; keyboard through all 4 cards; focus visible. |
| **Lighthouse** | CLS <0.1 on home with constellation in view (if in CI scope). |

### Project context reference

- [Source: `_bmad-output/project-context.md` – Framer Motion dynamic import, path aliases, cn(), breakpoints, bundle budget]
- [Source: `_bmad-output/planning-artifacts/architecture.md` – Component structure, product/ layout, ConstellationGrid/ProductCard]
- [Source: `_bmad-output/planning-artifacts/epics.md` – Story 2.3 Acceptance Criteria, FR1]
- [Source: `_bmad-output/implementation-artifacts/2-2-implement-scroll-experience-with-lenis-native-hybrid.md` – Scroll-snap, IO-only, section structure]
- [Source: `app/routes/_index.tsx` – Current FeaturedCollection, RecommendedProducts, ProductItem usage]

---

## References

- [Source: `_bmad-output/planning-artifacts/epics.md#Story 2.3` – User story and AC]
- [Source: `_bmad-output/planning-artifacts/architecture.md` – product/ components, ConstellationGrid, ProductCard]
- [Source: `_bmad-output/project-context.md` – Motion, layout, a11y, testing]
- [Source: `app/routes/_index.tsx` – Loader, FeaturedCollection, RecommendedProducts]
- [Source: `app/components/ProductItem.tsx` – Current product tile]

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None

### Completion Notes List

**Task 1: Constellation Layout Component**
- Created `app/components/product/` directory structure
- Implemented `ConstellationGrid.tsx` with organic desktop layout (rotations: -2°, 3°, -3°, 2°) and 2-column mobile grid
- Used CSS transforms with `lg:` breakpoint (1024px) for desktop-only rotations
- Applied `cn()` utility for classNames composition
- Maintained `snap-start` class for mobile scroll-snap integration
- Co-located comprehensive tests in `ConstellationGrid.test.tsx` (7 tests, all passing)

**Task 2: Product Card Component**
- Created `ProductCard.tsx` component with Hydrogen Image integration
- Configured `aspectRatio="1/1"` to prevent CLS
- Implemented meaningful alt text fallback (uses altText or empty string for decorative)
- Made card a single focusable unit using React Router `Link` component
- Co-located tests in `ProductCard.test.tsx` (8 tests, all passing)

**Task 3: Desktop Hover/Focus Treatment**
- Added subtle scale transform (`lg:hover:scale-[1.02]`) on desktop hover
- Used GPU-composited properties only (transform, no layout-affecting changes)
- Did NOT use Framer Motion (kept bundle budget intact with pure CSS)
- Applied z-index lift on hover for visual hierarchy

**Task 4: Keyboard Accessibility**
- All cards are native focusable elements (Link components)
- Focus order follows grid flow (left-to-right, top-to-bottom)
- Implemented `focus-visible:ring-2` with accent primary color token
- Added meaningful `aria-label` on links (`View [product name]`)
- Section has `aria-label="Product constellation grid"` for screen readers

**Task 5: Home Route Integration**
- Replaced `RecommendedProducts` component with `ConstellationProducts` wrapper in `app/routes/_index.tsx`
- Preserved HeroSection → FeaturedCollection → ConstellationGrid order
- Maintained `snap-start` class on constellation section for mobile scroll-snap
- Kept deferred data loading pattern with Suspense boundary
- Created skeleton fallback matching constellation layout (prevents CLS)
- All tests passing: lint ✅, typecheck ✅, unit tests (119/119) ✅, smoke tests ✅

**Test Coverage:**
- Unit: 15 new tests (7 ConstellationGrid + 8 ProductCard)
- Integration: Home route component integration tested via existing test suite
- All tests use proper mocking for Hydrogen, React Router, and variant URL hooks
- No regressions: all existing tests continue to pass

### File List

**New files:**
- `app/components/product/ConstellationGrid.tsx`
- `app/components/product/ConstellationGrid.test.tsx`
- `app/components/product/ProductCard.tsx`
- `app/components/product/ProductCard.test.tsx`
- `app/components/product/index.ts`

**Modified files:**
- `app/routes/_index.tsx`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Code Review Fixes (AI)

**HIGH:** Desktop rotations not applied in production — Replaced dynamic Tailwind class `lg:rotate-[${rotation}deg]` with parent-supplied full class strings (`lg:rotate-[-2deg]`, `lg:rotate-[3deg]`, etc.) in `ConstellationGrid.tsx` so JIT includes them. `ProductCard` now accepts `rotationClass?: string` instead of `rotation?: number`.

**HIGH:** AC1 organic non-grid layout — Added custom grid placement on desktop: `placementClasses` with `lg:col-start-* lg:row-start-*` so cards sit in irregular positions (e.g. (1,1), (3,1), (2,2), (1,3)). Each card wrapped in a div with placement; grid remains 4-col on desktop with organic arrangement.

**MEDIUM:** Rotation tests misleading — Updated `ProductCard.test.tsx` to use `rotationClass` prop and assert full class strings; tests now reflect build-time behaviour.

**MEDIUM:** AC5 fluid typography — ProductCard title uses `text-fluid-small` instead of `text-sm` [ProductCard.tsx].

**MEDIUM:** Unused import — Removed `ProductItem` from `app/routes/_index.tsx`.

**MEDIUM:** Design tokens for spacing — ConstellationGrid section uses `py-[var(--space-2xl)] px-[var(--space-md)]`, grid `gap-[var(--space-md)] lg:gap-[var(--space-lg)]`. ProductCard uses `mt-[var(--space-sm)] px-[var(--space-sm)]` for caption spacing.

**LOW (included):** Null `featuredImage` — ProductCard always renders an `aspect-square` wrapper; when `featuredImage` is null it shows a placeholder div to reserve space and avoid CLS.
