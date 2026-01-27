# Story 2.4: Enable Non-Linear Product Exploration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to explore products in any order by focusing on them**,
so that **I have agency over my discovery journey like at the booth**.

## Acceptance Criteria

### AC1: Focused state on hover (desktop) or tap (mobile)

**Given** I am viewing the constellation
**When** I hover (desktop ≥1024px) or tap (mobile <1024px) on a product card
**Then** that product enters a "focused" state with:

- Subtle scale increase (1.02x) — reuse or align with existing ProductCard hover scale from Story 2.3
- Elevated shadow (e.g. design token or Tailwind `shadow-lg` / elevated token)
- Other products slightly dim (e.g. `opacity` reduced via CSS or state-driven class)

**And** only one product is focused at a time (focus moves when user hovers/taps another)
**And** interactions use GPU-composited properties only (transform, opacity) per project-context
**And** breakpoint for desktop vs mobile is 1024px (`lg:`)

### AC2: Move focus freely between products

**Given** I have one product focused
**When** I hover (desktop) or tap (mobile) on a different product card
**Then** focus moves to the new product

**And** the previously focused product returns to default state
**And** no scroll or layout jump occurs
**And** focus state is driven by client state (e.g. `focusedProductId`) not URL

### AC3: Click/tap outside returns all to default

**Given** at least one product is focused
**When** I click or tap outside the constellation product cards (e.g. on background or non-card area)
**Then** all products return to default state

**And** focus is cleared (`focusedProductId` unset or equivalent)
**And** on mobile, tapping the same card again can be used to defocus (toggle) if that fits the interaction model — otherwise "tap outside" is sufficient per epics

### AC4: Keyboard navigation and activation

**Given** I navigate with keyboard only
**When** I Tab to a product card and press Enter or Space
**Then** that product enters focused state (same visual as hover/tap)

**And** Tab moves focus to next/previous product; Enter/Space activates focus for the currently focused card
**And** Escape clears focus (all products default) — consistent with modal/overlay patterns
**And** focus indicator remains visible (Story 2.3 `focus-visible:ring-2` or equivalent)
**And** cards are focusable in DOM order matching visual flow (already required in 2.3)

### AC5: Zustand store tracks explored products

**Given** I focus a product (via hover, tap, or keyboard)
**When** that product enters focused state
**Then** the exploration store records it as explored

**And** use `addProductExplored(productId)` from `app/hooks/use-exploration-state.ts` (or equivalent from `app/stores/exploration.ts`)
**And** productId is the Shopify product `id` (or stable GID) so Epic 4 collection prompt and analytics can use it
**And** do not clear `productsExplored` on defocus — exploration is cumulative for the session

**FRs addressed:** FR2

---

## Tasks / Subtasks

- [x] **Task 1: Add focused-state UX to constellation** (AC: #1, #2)
  - [x] Introduce `focusedProductId: string | null` (or equivalent) for the constellation section — component state or small wrapper; keep state local to constellation/ProductCard tree unless a shared context is already planned
  - [x] When user hovers (desktop) or taps (mobile) a card: set `focusedProductId` to that product's id; apply focused styles (scale 1.02x, elevated shadow, dim others via opacity)
  - [x] Ensure only one product is focused; moving hover/tap to another card updates `focusedProductId`
  - [x] Use GPU-composited properties only; use `cn()` and design tokens; no new dependencies that affect bundle budget

- [x] **Task 2: Click/tap outside to clear focus** (AC: #3)
  - [x] On click/tap outside the constellation cards, clear `focusedProductId` (e.g. listener on container with `stopPropagation` on cards, or use "click outside" pattern)
  - [x] Ensure mobile tap-on-card and tap-outside behave correctly (no accidental double-toggle if you add toggle semantics)
  - [x] Prefer "tap outside clears" as the primary behavior per epics

- [x] **Task 3: Keyboard activation and Escape** (AC: #4)
  - [x] Ensure product cards are reachable by Tab and that Enter/Space set focused state (same as hover/tap)
  - [x] Add Escape key handler to clear `focusedProductId` when constellation or a card has focus
  - [x] Keep focus order and focus-visible styling from Story 2.3; no form submit on Enter/Space (cards are links/buttons with `type="button"` or role/label as needed)

- [x] **Task 4: Persist explored products in Zustand** (AC: #5)
  - [x] When a product enters focused state, call `addProductExplored(productId)` (from `useExplorationActions()` or `useExplorationStore.getState().addProductExplored`)
  - [x] Use Shopify product `id` (GID) as the key; ensure it matches what Epic 4 and analytics expect
  - [x] Do not remove from `productsExplored` when focus moves or clears — exploration is session-cumulative

- [x] **Task 5: Integrate and test** (AC: #1–#5)
  - [x] Wire focused state and handlers into `ConstellationGrid` / `ProductCard` in `app/routes/_index.tsx` (or current constellation entrypoint)
  - [x] Preserve existing layout, scroll-snap, and loader data from Story 2.3
  - [x] Add/update unit tests for focus logic and exploration store updates; ensure no regressions in 2.3 tests
  - [x] Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:smoke`

---

## Dev Notes

### Why this story matters

FR2 is agency over discovery: the visitor explores in any order, like at the booth. This story adds the “focused” moment (scale, shadow, dimming) and wires it to the existing exploration store so Epic 4’s “collection prompt after 2+ products” and future analytics can rely on `productsExplored`.

### Guardrails (don’t let the dev agent drift)

- **Do NOT** use scroll listeners for focus or exploration — use pointer and keyboard events only.
- **Do NOT** static-import Framer Motion for this story — CSS/GPU-only (transform, opacity) is enough for focus state; if animation is added later, keep dynamic import per project-context.
- **Do NOT** change the structure or semantics of ProductCard/ConstellationGrid in a way that breaks keyboard order or focus from Story 2.3.
- **Do NOT** clear `productsExplored` on defocus — exploration is cumulative.
- **Do NOT** add new dependencies without checking bundle impact (<200KB gzipped total).

### Architecture compliance

**From architecture.md:**

- Product discovery lives in `app/components/product/` and `app/routes/_index.tsx`.
- Zustand exploration store: `productsExplored`, `addProductExplored`; hooks in `app/hooks/use-exploration-state.ts`.

**From project-context.md:**

- Path alias `~/` → `app/`.
- `cn()` for classNames; no template literals for conditional Tailwind.
- GPU-only for animations (transform, opacity).
- State: Zustand for UI (exploration), React state for local UI (e.g. focused id).

**From epics / UX:**

- Non-linear exploration: user focuses any product; focus state (scale, shadow, dim); click outside resets; keyboard Tab/Enter/Space/Escape; Zustand tracks explored products.

### Previous story intelligence (Story 2.3: Constellation grid)

**Relevant patterns:**

- `ConstellationGrid` and `ProductCard` in `app/components/product/`; ProductCard uses `Link`, aspect-ratio, subtle desktop hover scale (`lg:hover:scale-[1.02]`).
- Organic placement via `placementClasses`; 2-col mobile grid; `snap-start` on section; design tokens for spacing.
- Focus: cards are focusable (Link), `focus-visible:ring-2`, `aria-label="View [product name]"`, section `aria-label="Product constellation grid"`.
- Home: `_index.tsx` uses HeroSection → FeaturedCollection → ConstellationProducts (ConstellationGrid); loader data unchanged.

**For this story:**

- Reuse or extend ProductCard/ConstellationGrid to support “focused” state (owned by parent or shared via props/context) so one card can be scale+shadow while others dim.
- Keep ProductCard as Link or button for accessibility; add `onFocus`/`onBlur`/`onMouseEnter`/`onMouseLeave`/pointer handlers as needed for focused state, without breaking navigation if cards later link to product pages.
- If the current card is only “explore” and has no href, use `role="button"` and Enter/Space; if it’s a Link, consider keeping link and adding a separate “preview/focus” interaction that doesn’t navigate — clarify with product: for MVP, “focus” = visual state only, navigation can stay in Epic 3.

### Technical requirements (dev agent guardrails)

| Requirement | Detail |
| ----------- |--------|
| **Focus state** | One product focused at a time; scale 1.02x, elevated shadow, others dim (opacity). |
| **Input** | Desktop: hover; mobile: tap; keyboard: Tab + Enter/Space; Escape clears. |
| **State** | Local `focusedProductId` (or equivalent) for UI; Zustand `addProductExplored(productId)` when entering focused state. |
| **Performance** | GPU-only (transform, opacity); no new libs that grow bundle. |
| **Breakpoint** | 1024px (`lg:`) for desktop vs mobile. |

### File structure requirements

**Existing (do not duplicate):**

- `app/components/product/ConstellationGrid.tsx`, `ProductCard.tsx` — extend for focus behavior.
- `app/stores/exploration.ts` — `addProductExplored`; do not change store shape for this story.
- `app/hooks/use-exploration-state.ts` — use `useExplorationActions().addProductExplored` or store directly.
- `app/routes/_index.tsx` — constellation section; keep loader and layout.

**Likely to add or touch:**

- `app/components/product/ConstellationGrid.tsx` — manage `focusedProductId`, pass to cards, handle click-outside and Escape.
- `app/components/product/ProductCard.tsx` — accept `isFocused`, `onFocus`/`onBlur` or similar; apply focused/dim styles.
- Optional: `app/hooks/use-focus-outside.ts` or inline “click outside” logic in ConstellationGrid.
- `app/components/product/*.test.tsx` — tests for focus state, exploration store updates.

**Do not:**

- Add scroll listeners for this story.
- Static-import Framer Motion.
- Clear `productsExplored` when focus is cleared.

### Testing requirements

| Type | What to test |
|------|---------------|
| **Unit** | ConstellationGrid/ProductCard: setting focused id applies focused/dim styles; only one focused; Escape clears. |
| **Unit** | When a product becomes focused, `addProductExplored` is called with its id; id format matches store. |
| **Integration** | Home: hover/tap focuses one card, others dim; click outside clears; keyboard Enter/Space focuses, Escape clears. |
| **Manual** | 320px, 1024px: tap/hover and keyboard behavior; no layout shift. |

### Project context reference

- [Source: `_bmad-output/project-context.md` – Motion/bundle, path aliases, cn(), breakpoints, Zustand for exploration]
- [Source: `_bmad-output/planning-artifacts/architecture.md` – product/ layout, exploration store, hooks]
- [Source: `_bmad-output/planning-artifacts/epics.md` – Story 2.4, FR2]
- [Source: `_bmad-output/implementation-artifacts/2-3-build-constellation-grid-layout.md` – ConstellationGrid, ProductCard, focus order, hover scale]
- [Source: `app/stores/exploration.ts`, `app/hooks/use-exploration-state.ts` – productsExplored, addProductExplored]

---

## References

- [Source: `_bmad-output/planning-artifacts/epics.md#Story 2.4` – User story and AC]
- [Source: `_bmad-output/planning-artifacts/architecture.md` – exploration store, product components]
- [Source: `_bmad-output/project-context.md` – Motion, state, a11y, testing]
- [Source: `app/components/product/ConstellationGrid.tsx`, `ProductCard.tsx` – Current layout and card API]
- [Source: `app/stores/exploration.ts`, `app/hooks/use-exploration-state.ts` – Exploration store and hooks]

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

#### Task 1-4 Completion (2026-01-27)

- Implemented focus state management in ConstellationGrid using React state
- Added focus, dimmed, and exploration tracking to ProductCard
- Focus state applies scale-[1.02], shadow-lg (GPU-composited)
- Dimmed state applies opacity-60 to non-focused cards
- Mouse, touch, and keyboard interactions (Enter/Space/Escape) all functional
- Click-outside handler clears focus
- Exploration store integration: `addProductExplored` called on focus
- All 11 new focus-related tests passing (18/18 total)
- No bundle impact, no new dependencies
- TDD approach: wrote failing tests first, then implementation

#### Task 5 Completion (2026-01-27)

- All tests passing: 14 test files, 130 tests
- Smoke tests passed: production build, typecheck
- No regressions in Story 2.3 tests
- Lint and typecheck clean
- Focus behavior integrated and functional

#### Code Review Fixes (2026-01-27)

- **H1 (AC3):** Click-outside now clears when click is anywhere not on a product card (including outside section). Logic changed from `section.contains(target) && !target.closest('.product-card')` to `!target.closest?.('.product-card')` so hero/header/footer clicks also clear focus.
- **M1/M2:** Renamed test to "clears focus when clicking on section background (not on a card)" and added test "clears focus when clicking outside section (e.g. elsewhere on page)" to verify AC3 fully.
- Removed unused `sectionRef` from ConstellationGrid after logic change.

### File List

#### Modified

- app/components/product/ConstellationGrid.tsx - Added focus state management, handlers, and effects
- app/components/product/ProductCard.tsx - Added focus/dimmed props and keyboard handlers

#### Added

- app/components/product/ConstellationGrid.test.tsx - Added 11 focus state tests (Story 2.4 describe block)
