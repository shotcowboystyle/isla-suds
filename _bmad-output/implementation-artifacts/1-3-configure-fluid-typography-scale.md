# Story 1.3: Configure Fluid Typography Scale

Status: done

---

## Story

As a **developer**,
I want **a fluid typography system using CSS clamp()**,
So that **text scales smoothly from 320px mobile to 2560px ultrawide without breakpoints**.

---

## Acceptance Criteria

### AC1: Fluid typography utilities exist

**Given** the design token system is in place  
**When** I configure fluid typography in Tailwind  
**Then** the following font size utilities exist and can be used in markup:

- `text-fluid-small`: scales 0.75rem → 0.875rem
- `text-fluid-body`: scales 1rem → 1.25rem
- `text-fluid-heading`: scales 1.5rem → 2.5rem
- `text-fluid-display`: scales 2.5rem → 6rem

### AC2: Values use `clamp()` with viewport-relative middle value

**Given** the fluid utilities exist  
**When** I inspect the generated CSS  
**Then** each utility uses `clamp(min, <viewport-relative middle>, max)` (no breakpoint logic)

### AC3: Verification across target viewports

**Given** the utilities are implemented  
**When** I view a page using the utilities at 320px, 768px, 1440px, and 2560px widths  
**Then** the typography remains readable and scales smoothly between min/max values.

---

## Tasks / Subtasks

- [x] **Task 1: Add typography tokens** (AC: #1, #2)
  - [x] 1.1 Add fluid type tokens to `app/styles/tokens.css` using `--type-fluid-*` names
  - [x] 1.2 Add default line-height tokens (unitless) to `app/styles/tokens.css` using `--leading-fluid-*` names
  - [x] 1.3 Expose tokens to Tailwind v4 theme in `app/styles/tailwind.css` via `@theme` using `--text-fluid-*` variables
  - [x] 1.4 Confirm utilities `text-fluid-*` are available (Tailwind compile output)

- [x] **Task 2: Add a verification surface** (AC: #3)
  - [x] 2.1 Add persistent typography verification route at `/dev/typography`
  - [x] 2.2 Verify at 320px / 768px / 1440px / 2560px in browser responsive mode
  - [x] 2.3 Ensure verification route remains in codebase for foundation testing

---

## Dev Notes

### Critical Context

This story is **foundation work**: it sets the global typographic scale used throughout the storefront. The UX spec explicitly calls for a clamp-based “Utopia-inspired” fluid type scale from **320px → 2560px** with **zero breakpoint-specific text sizing**.

Tailwind in this repo is configured using **Tailwind v4 CSS-first** (`@theme` inside `app/styles/tailwind.css`). There is **no** `tailwind.config.*` file in the repo today; do **not** introduce one unless Tailwind v4 requires it for something you cannot do in CSS-first config.

### Fluid type values (EXACT)

Use these exact `clamp()` values from the UX design specification:

- `fluid-small`: `clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)`
- `fluid-body`: `clamp(1rem, 0.9rem + 0.5vw, 1.25rem)`
- `fluid-heading`: `clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem)`
- `fluid-display`: `clamp(2.5rem, 1.75rem + 3.75vw, 6rem)`

Recommended default line-heights (unitless) from the same UX spec:

- `fluid-small`: 1.4 (captions/meta)
- `fluid-body`: 1.6 (body text)
- `fluid-heading`: 1.2 (section headings)
- `fluid-display`: 1.1 (hero/display)

### Tailwind v4 implementation pattern (CSS-first)

Tailwind v4’s `font-size` utilities are driven by `--text-*` theme variables. Defining:

- `--text-fluid-body: <value>`

automatically enables:

- `class="text-fluid-body"`

Line-height can be provided with:

- `--text-fluid-body--line-height: <value>`

### Implementation sketch (copy/paste-friendly)

Add the tokens in `app/styles/tokens.css` (inside `:root { ... }`):

```css
/* ========================================
 * Typography Tokens
 * ======================================== */
--type-fluid-small: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--type-fluid-body: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
--type-fluid-heading: clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem);
--type-fluid-display: clamp(2.5rem, 1.75rem + 3.75vw, 6rem);

/* Default line-heights (unitless) */
--leading-fluid-small: 1.4;
--leading-fluid-body: 1.6;
--leading-fluid-heading: 1.2;
--leading-fluid-display: 1.1;
```

Then expose them to Tailwind in `app/styles/tailwind.css` (inside the existing `@theme { ... }` block):

```css
/* Fluid typography */
--text-fluid-small: var(--type-fluid-small);
--text-fluid-small--line-height: var(--leading-fluid-small);

--text-fluid-body: var(--type-fluid-body);
--text-fluid-body--line-height: var(--leading-fluid-body);

--text-fluid-heading: var(--type-fluid-heading);
--text-fluid-heading--line-height: var(--leading-fluid-heading);

--text-fluid-display: var(--type-fluid-display);
--text-fluid-display--line-height: var(--leading-fluid-display);
```

### File Location / Where to implement

- **Define** typography tokens in `app/styles/tokens.css` (single source of truth, alongside color/spacing/animation tokens).
- **Expose to Tailwind** in `app/styles/tailwind.css` inside the existing `@theme` block.

### Guardrails (avoid common implementation mistakes)

- **Do not** use fixed breakpoint font sizes to “fake” fluid type. The entire point is `clamp()`.
- **Do not** add additional font size names unless a real requirement emerges. Start with the 4 sizes above.
- **Do not** hardcode user-facing copy in verification artifacts; keep the markup minimal and remove it before completion.
- **Do not** introduce runtime JS for typography. This is CSS-only.

---

## Architecture Compliance

### From `epics.md`

- Story 1.3 requires Tailwind “fontSize entries” for `fluid-small`, `fluid-body`, `fluid-heading`, `fluid-display` using `clamp()` and a test page verified at 320/768/1440/2560 widths.

### From `ux-design-specification.md`

- “Fluid typography using CSS clamp() functions—text scales proportionally from 320px mobile to ultrawide monitors”
- “Fluid Type Scale” explicitly lists the clamp values for the 4 tokens above, with hierarchy and line-height guidance.

### From `architecture.md` / `project-context.md`

- Tailwind CSS v4 is configured via **CSS-first** in `app/styles/tailwind.css` using `@theme` variables.
- Design tokens live in `app/styles/tokens.css` and are imported before Tailwind.

---

## Testing Requirements

### Manual verification (required)

- Verify the `text-fluid-*` utilities compile and apply.
- In browser responsive mode, verify readability and smooth scaling at:
  - 320px
  - 768px
  - 1440px
  - 2560px

### What to look for

- ✅ No font size “jumps” at breakpoints (should be continuous)
- ✅ Body text never drops below 16px (fluid-body min is 1rem)
- ✅ Headings remain readable on ultrawide (fluid-display max 6rem)

---

## References

- [Source: `_bmad-output/planning-artifacts/epics.md` (Epic 1 → Story 1.3)]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` (Typography System → Fluid Type Scale)]
- [Source: `_bmad-output/planning-artifacts/architecture.md` (Tailwind v4 CSS-first configuration; typography)]
- [Source: `_bmad-output/project-context.md` (Tailwind v4 CSS-first configuration; project rules)]
- [Source: `app/styles/tailwind.css` (existing `@theme` configuration)]
- [Source: `app/styles/tokens.css` (design tokens)]
- [Source: `_bmad-output/implementation-artifacts/1-2-implement-design-token-system.md` (previous story patterns)]

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None - implementation completed without errors.

### Completion Notes List

- ✅ Added 4 fluid typography tokens to `app/styles/tokens.css` using exact UX spec `clamp()` values
- ✅ Added 4 corresponding line-height tokens (unitless: 1.1, 1.2, 1.4, 1.6)
- ✅ Exposed all typography tokens to Tailwind v4 theme via `@theme` in `app/styles/tailwind.css`
- ✅ Created utilities: `text-fluid-small`, `text-fluid-body`, `text-fluid-heading`, `text-fluid-display`
- ✅ Verified manual responsive behavior at 320px / 768px / 1440px / 2560px viewports (user confirmed)
- ✅ TypeScript validation passed (no type errors)
- ✅ All acceptance criteria satisfied (AC1: utilities exist, AC2: uses clamp(), AC3: verified across viewports)

### File List

- `app/styles/tokens.css` - Added typography tokens (--type-fluid-_, --leading-fluid-_) and base font-size
- `app/styles/tailwind.css` - Exposed tokens to Tailwind theme (--text-fluid-\* with line-heights)
- `app/routes/dev.typography.tsx` - Persistent verification route for fluid typography scale
- `app/routes/_index.tsx` - Restored to original state (temporary testing removed)

---

## Story Metadata

| Field                | Value                                         |
| -------------------- | --------------------------------------------- |
| Epic                 | 1 - Project Foundation & Design System        |
| Story ID             | 1.3                                           |
| Story Key            | 1-3-configure-fluid-typography-scale          |
| Priority             | P0 - Critical (foundation for all typography) |
| Estimated Complexity | Low                                           |
| Dependencies         | Story 1.2 (design tokens + Tailwind `@theme`) |
| Blocks               | Epic 2+ (hero, headers, product typography)   |

---

_Ultimate context engine analysis completed - comprehensive developer guide created._
