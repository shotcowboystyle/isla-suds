# Story 1.2: Implement Design Token System

Status: ready-for-dev

---

## Story

As a **developer**,
I want **a CSS custom property-based design token system**,
So that **all components use consistent colors, spacing, and typography from a single source of truth**.

---

## Acceptance Criteria

### AC1: Design Token File Creation

**Given** the initialized Hydrogen project
**When** I create the design token system
**Then** `app/styles/tokens.css` exists with:

- Canvas tokens: `--canvas-base`, `--canvas-elevated` (cream tones)
- Text tokens: `--text-primary`, `--text-muted` (brown tones)
- Accent tokens: `--accent-primary`, `--accent-hover` (teal from logo)
- Spacing scale: `--space-xs` through `--space-2xl`
- Animation tokens: `--ease-out-expo`, `--duration-reveal`, `--duration-micro`

### AC2: Tailwind Configuration Integration

**Given** the design token file exists
**When** I configure Tailwind to use the tokens
**Then** `vite.config.ts` (or `tailwind.config.ts` if separate) extends theme with token references
**And** tokens are accessible via Tailwind utility classes

### AC3: Token Verification

**Given** the token system is configured
**When** I create a test component using the tokens
**Then** tokens render correctly in the browser
**And** CSS custom properties are applied as expected

---

## Tasks / Subtasks

- [ ] **Task 1: Create Design Token File** (AC: #1)
  - [ ] 1.1 Create `app/styles/tokens.css` file
  - [ ] 1.2 Define canvas color tokens (cream tones)
  - [ ] 1.3 Define text color tokens (brown tones)
  - [ ] 1.4 Define accent color tokens (teal from logo)
  - [ ] 1.5 Define spacing scale tokens (xs through 2xl)
  - [ ] 1.6 Define animation tokens (easing and duration)

- [ ] **Task 2: Integrate with Tailwind** (AC: #2)
  - [ ] 2.1 Import tokens.css in main stylesheet
  - [ ] 2.2 Extend Tailwind theme with token references
  - [ ] 2.3 Verify token values are accessible via Tailwind classes

- [ ] **Task 3: Verify Token System** (AC: #3)
  - [ ] 3.1 Create test component using tokens
  - [ ] 3.2 Verify tokens render in browser DevTools
  - [ ] 3.3 Confirm CSS custom properties are applied

---

## Dev Notes

### Critical Context

This story establishes the **design foundation** for all future styling work. Every component will reference these tokens, so accuracy and completeness are critical. The design token system enables:

1. **Consistency** - Single source of truth for all design values
2. **Maintainability** - Change colors/spacing in one place, affects entire app
3. **Theme Support** - Foundation for potential future theme switching
4. **Type Safety** - Tokens referenced in Tailwind config provide autocomplete

### Design Token Values (EXACT)

From project-context.md and architecture.md, these are the **exact values** to use:

```css
/* Semantic color tokens */
--canvas-base: #faf7f2; /* Primary background */
--canvas-elevated: #f5f0e8; /* Cards, modals */
--text-primary: #2c2416; /* Body text */
--text-muted: #8c8578; /* Secondary text */
--accent-primary: #3a8a8c; /* CTAs, links */
--accent-hover: #2d6e70; /* Interactive states */

/* Spacing scale */
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
--space-2xl: 3rem;

/* Animation tokens */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--duration-reveal: 300ms;
--duration-micro: 150ms;
```

**CRITICAL:** Use these exact hex values and spacing values. Do not approximate or guess.

### File Location

**Create:** `app/styles/tokens.css`

**Import in:** `app/styles/tailwind.css` (or `app/styles/app.css` if that's the main entry)

The existing styles directory structure:

- `app/styles/app.css` - Main stylesheet
- `app/styles/reset.css` - CSS reset
- `app/styles/tailwind.css` - Tailwind imports

**Decision:** Import `tokens.css` in `app/styles/tailwind.css` or `app/styles/app.css` (whichever is imported in `app/root.tsx`).

### Tailwind Integration Pattern

**For Tailwind CSS v4+ (using Vite plugin):**

Tailwind v4 uses the `@tailwindcss/vite` plugin and may not have a separate `tailwind.config.ts`. Check `vite.config.ts` for Tailwind configuration.

**If using Tailwind config file (`tailwind.config.ts`):**

```typescript
// tailwind.config.ts
import type {Config} from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        canvas: {
          base: 'var(--canvas-base)',
          elevated: 'var(--canvas-elevated)',
        },
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          hover: 'var(--accent-hover)',
        },
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
      },
      transitionDuration: {
        reveal: 'var(--duration-reveal)',
        micro: 'var(--duration-micro)',
      },
    },
  },
} satisfies Config;
```

**If using Tailwind v4 CSS-first approach:**

Define tokens in CSS and reference directly in Tailwind classes using `var(--token-name)`.

### Test Component Pattern

Create a simple test component to verify tokens work:

```tsx
// app/components/TokenTest.tsx (temporary, can delete after verification)
export function TokenTest() {
  return (
    <div className="bg-canvas-base p-space-lg">
      <h1 className="text-text-primary">Primary Text</h1>
      <p className="text-text-muted">Muted Text</p>
      <button className="bg-accent-primary hover:bg-accent-hover text-white px-space-md py-space-sm transition-colors duration-reveal ease-out-expo">
        Test Button
      </button>
    </div>
  );
}
```

**Note:** This is a temporary verification component. Delete after confirming tokens work.

### Color Rationale

- **Canvas colors (cream tones):** Warm, natural background that evokes artisanal quality
- **Text colors (brown tones):** High contrast for readability while maintaining warmth
- **Accent colors (teal):** From Isla Suds logo, provides brand consistency

### Spacing Scale Rationale

Uses a consistent rem-based scale that works across all viewport sizes. The scale provides:

- `xs` (0.25rem) - Tight spacing for icons, badges
- `sm` (0.5rem) - Small gaps, padding
- `md` (1rem) - Standard spacing (matches 1rem base)
- `lg` (1.5rem) - Comfortable spacing
- `xl` (2rem) - Section spacing
- `2xl` (3rem) - Large section gaps

### Animation Token Rationale

- **ease-out-expo:** Smooth, natural deceleration for premium feel
- **duration-reveal (300ms):** Matches texture reveal animation timing
- **duration-micro (150ms):** Quick feedback for interactive elements

---

## Architecture Compliance

### From architecture.md

**Design Token Naming Pattern:**

> "CSS custom properties follow semantic naming: `--canvas-base`, `--text-primary`, `--accent-primary`"

**Content Location Rules:**

> "Design tokens live in `app/styles/tokens.css`"

**Tailwind Integration:**

> "Tailwind config extends theme with token references"

### From project-context.md

**Design Token Naming Convention:**

> "Semantic color tokens: `--canvas-base`, `--canvas-elevated`, `--text-primary`, `--text-muted`, `--accent-primary`"

**Spacing Scale:**

> "`--space-xs` through `--space-2xl` with exact rem values"

**Animation Tokens:**

> "`--ease-out-expo`, `--duration-reveal`, `--duration-micro`"

### Bundle Budget Context

Design tokens are **CSS only** - zero JavaScript bundle impact. This is pure CSS custom properties, no runtime cost.

---

## Previous Story Intelligence

### From Story 1.1

**Key Learnings:**

1. ✅ **Project Structure:** Hydrogen skeleton template is initialized with TypeScript strict mode
2. ✅ **Tailwind Setup:** Tailwind CSS v4+ is configured via `@tailwindcss/vite` plugin in `vite.config.ts`
3. ✅ **Path Aliases:** `~/` maps to `app/` directory (defined in `tsconfig.json`)
4. ✅ **File Organization:** Styles live in `app/styles/` directory
5. ✅ **Import Pattern:** Use `import type` for type-only imports (verbatimModuleSyntax)

**Files Created/Modified in Story 1.1:**

- `app/utils/cn.ts` - Class name utility (uses clsx + tailwind-merge)
- `.env` - Environment variables
- `scripts/smoke-test-*.mjs` - Smoke test scripts

**Patterns Established:**

- TypeScript strict mode is enabled
- Tailwind v4 uses Vite plugin (no separate config file unless needed)
- Use `~/` path alias for app imports

**What NOT to Do:**

- ❌ Don't create a separate `tailwind.config.ts` unless Tailwind v4 requires it
- ❌ Don't use template literals for Tailwind classes (use `cn()` utility from Story 1.1)
- ❌ Don't hardcode color values in components (use tokens)

**Integration Points:**

- Tokens will be imported in `app/styles/tailwind.css` or `app/styles/app.css`
- Tokens will be referenced in Tailwind theme extension (if config file exists)
- Components will use tokens via Tailwind classes (e.g., `bg-canvas-base`, `text-text-primary`)

---

## File Structure Requirements

### Files to Create

1. **`app/styles/tokens.css`** - Design token definitions

### Files to Modify

1. **`app/styles/tailwind.css`** (or `app/styles/app.css`) - Import tokens.css
2. **`vite.config.ts`** or **`tailwind.config.ts`** (if exists) - Extend theme with token references

### Directory Structure

```
app/
  styles/
    tokens.css        # NEW - Design token definitions
    tailwind.css      # MODIFY - Import tokens.css
    app.css           # (may need to import tokens if tailwind.css doesn't)
    reset.css         # (no changes)
```

---

## Testing Requirements

### Manual Verification Steps

1. **Token File Exists:**

   ```bash
   ls app/styles/tokens.css
   # Expected: File exists
   ```

2. **Tokens Imported:**
   - Check `app/styles/tailwind.css` (or `app/styles/app.css`) imports `tokens.css`
   - Verify import statement: `@import './tokens.css';` or similar

3. **Browser DevTools Verification:**
   - Open browser DevTools → Elements tab
   - Inspect any element
   - Check Computed styles for CSS custom properties
   - Verify `--canvas-base`, `--text-primary`, etc. are defined

4. **Tailwind Class Test:**
   - Create temporary test component using `bg-canvas-base`, `text-text-primary`
   - Verify classes apply correct colors
   - Check that Tailwind recognizes token-based theme values

### What to Look For

- ✅ All token names match exactly (case-sensitive)
- ✅ Token values match exact hex codes and rem values
- ✅ Tokens are accessible in browser DevTools
- ✅ Tailwind classes using tokens work correctly
- ✅ No console errors about undefined CSS variables

---

## References

- [Source: epics.md#Story-1.2] - Original story definition and acceptance criteria
- [Source: architecture.md#Design-Token-Naming] - Token naming conventions
- [Source: architecture.md#Content-Location-Rules] - File location requirements
- [Source: project-context.md#Design-Token-Naming] - Exact token values and naming patterns
- [Source: project-context.md#Spacing-Scale] - Spacing token values
- [Source: project-context.md#Animation-Tokens] - Animation token values
- [Source: 1-1-initialize-hydrogen-project-with-skeleton-template.md] - Previous story learnings

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent_

---

## Story Metadata

| Field                | Value                                     |
| -------------------- | ----------------------------------------- |
| Epic                 | 1 - Project Foundation & Design System    |
| Story ID             | 1.2                                       |
| Story Key            | 1-2-implement-design-token-system         |
| Priority             | P0 - Critical (foundation for all styles) |
| Estimated Complexity | Low                                       |
| Dependencies         | Story 1.1 (project initialization)        |
| Blocks               | Stories 1.3-1.10 (all styling work)       |

---

_Ultimate context engine analysis completed - comprehensive developer guide created._
