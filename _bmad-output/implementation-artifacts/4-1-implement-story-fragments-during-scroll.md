# Story 4.1: Implement Story Fragments During Scroll

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to discover brand story fragments scattered throughout the page**,
So that **I absorb the Isla Suds story naturally without reading an "About" page**.

## Acceptance Criteria

### AC1: Story fragments fade in during scroll

**Given** I am scrolling through the home page
**When** story fragment elements enter the viewport
**Then** they fade in with subtle animation displaying:
- "Named for our daughter."
- "Made in our kitchen."
- "A family recipe passed down."
**And** fragments are positioned organically (not in a dedicated section)
**And** fragments use `fluid-body` or `fluid-heading` typography
**And** Intersection Observer triggers animations (not scroll listeners)
**And** screen readers can access fragment text in reading order

**FRs addressed:** FR7

### AC2: Fragments respect prefers-reduced-motion

**Given** I have `prefers-reduced-motion: reduce` set at the OS level
**When** story fragment elements enter the viewport
**Then** fragments appear instantly without animation
**And** all story content is still visible and accessible
**And** no animation jank or transitional effects

### AC3: Copy sourced from centralized content file

**Given** story fragments are implemented
**When** fragments are rendered
**Then** all copy is sourced from `app/content/story.ts`
**And** no story text is hardcoded in components
**And** fragments can be updated by editing content file only
**And** fragments display title, subtitle, content, and optional actions

### AC4: Fragments are accessible and performant

**Given** story fragments are displayed
**When** I interact with fragments via keyboard, screen reader, or pointer
**Then** fragments have sufficient color contrast (4.5:1 minimum)
**And** action buttons (if present) are keyboard-focusable with visible focus rings
**And** action buttons meet 44x44px minimum touch target size
**And** fragments use semantic HTML (`<article>`, `<section>`, not divs)
**And** fragment animation does not cause layout shift (CLS <0.1)
**And** fragment rendering does not block main thread or cause jank

### AC5: Fragments integrate with existing scroll behavior

**Given** the page uses Lenis smooth scroll (desktop) and native scroll (mobile)
**When** I scroll through story fragments
**Then** fragments trigger correctly on both Lenis and native scroll
**And** fragments do NOT appear on `/wholesale/*` B2B routes
**And** fragments do not interfere with texture reveal interactions
**And** fragments do not interfere with collection prompt (Story 4.2)
**And** SSR renders fragments without IntersectionObserver errors

## Tasks / Subtasks

- [ ] **Task 1: Create story fragment content structure** (AC3)
  - [ ] Review existing `app/content/story.ts` for STORY_FRAGMENTS array
  - [ ] Define TypeScript interface for StoryFragment type
  - [ ] Export STORY_FRAGMENTS as named export
  - [ ] Verify existing fragments have title, subtitle, content, optional actions

- [ ] **Task 2: Build StoryFragment component** (AC1, AC2, AC3, AC4)
  - [ ] Create `app/components/story/StoryFragment.tsx`
  - [ ] Import fragment data from `app/content/story.ts`
  - [ ] Use semantic HTML (`<article>` for each fragment)
  - [ ] Apply `fluid-body` or `fluid-heading` typography from design tokens
  - [ ] Ensure 4.5:1 color contrast
  - [ ] Make action buttons keyboard-focusable with 44x44px min touch targets
  - [ ] Add `data-testid` attributes for testing

- [ ] **Task 3: Implement Intersection Observer hook** (AC1, AC2, AC5)
  - [ ] Create `app/hooks/use-story-fragment-visibility.ts`
  - [ ] Follow pattern from `app/hooks/use-preload-images.ts`
  - [ ] Use IntersectionObserver with threshold: 0.5 (50% visible)
  - [ ] Check `isIntersecting && intersectionRatio >= 0.5` before triggering
  - [ ] Track "already shown" state with useRef (trigger only once)
  - [ ] Add SSR safety check: `typeof IntersectionObserver !== 'undefined'`
  - [ ] Clean up observer on unmount

- [ ] **Task 4: Add animation with Framer Motion dynamic import** (AC1, AC2, AC4)
  - [ ] Import Framer Motion via dynamic import (use existing `~/lib/motion` pattern)
  - [ ] Provide Suspense fallback (static fragment, no animation)
  - [ ] Check `prefers-reduced-motion` before animating
  - [ ] If reduced motion: render static fragment
  - [ ] If motion allowed: fade-in animation (opacity: [0, 1], duration: 600ms)
  - [ ] Use design tokens: `--ease-out-expo`, `--duration-reveal`
  - [ ] Verify animation does not cause layout shift

- [ ] **Task 5: Create StoryFragmentContainer component** (AC1, AC5)
  - [ ] Create `app/components/story/StoryFragmentContainer.tsx`
  - [ ] Use `use-story-fragment-visibility` hook
  - [ ] Render multiple StoryFragment components with staggered animations
  - [ ] Position fragments organically in page layout (not in dedicated section)
  - [ ] Ensure fragments work with Lenis (desktop) and native scroll (mobile)
  - [ ] Verify no fragments on `/wholesale/*` routes

- [ ] **Task 6: Integrate fragments into home page** (AC1, AC5)
  - [ ] Update `app/routes/_index.tsx` to include StoryFragmentContainer
  - [ ] Position fragments between/around ConstellationGrid sections
  - [ ] Ensure fragments appear in logical scroll order
  - [ ] Verify fragments don't interfere with texture reveals or collection prompt

- [ ] **Task 7: Write tests** (AC1-AC5)
  - [ ] Unit tests for `StoryFragment.tsx`: rendering, accessibility, fallback state
  - [ ] Unit tests for `use-story-fragment-visibility.ts`: IO trigger, SSR safety, cleanup
  - [ ] Integration tests: scroll page → fragments appear in order
  - [ ] Visual regression tests: fragment baseline states (static, mid-animation)
  - [ ] Performance tests: animation doesn't block main thread
  - [ ] Verify all tests pass: `pnpm test`, `pnpm typecheck`, `pnpm lint`

## Dev Notes

### Why this story matters

Story 4.1 is the first story in Epic 4 (Story Moments & Site Navigation) and introduces the "narrative woven throughout" experience from the PRD. Rather than a traditional "About" page that visitors may never read, story fragments appear organically during the scroll journey. This aligns with the "permission to slow down" philosophy: Sarah discovers the Isla Suds story at her own pace, between product explorations.

Epic 3 established the texture reveal as the core conversion moment. Epic 4 builds on that foundation by adding the **brand story layer** that transforms a transactional experience into an emotional connection. Story fragments reinforce the family values, craftsmanship, and personal touch that differentiate Isla Suds from mass-market soaps.

### Guardrails (developer do/don't list)

- **DO** use Intersection Observer ONLY for scroll-triggered animations (no scroll event listeners)
- **DO** dynamically import Framer Motion (never static import - breaks bundle budget)
- **DO** check `prefers-reduced-motion` and provide static fallback
- **DO** source all story text from `app/content/story.ts` (no hardcoded copy in components)
- **DO** use semantic HTML (`<article>`, `<section>`) for story fragments
- **DO** ensure 4.5:1 color contrast and 44x44px touch targets
- **DO** verify SSR safety (`typeof IntersectionObserver !== 'undefined'`)
- **DO** clean up IntersectionObserver on unmount
- **DO NOT** use scroll event listeners for animation/visibility logic
- **DO NOT** static import Framer Motion (breaks <200KB bundle budget)
- **DO NOT** show story fragments on `/wholesale/*` B2B routes
- **DO NOT** cause layout shift during fragment reveal (CLS <0.1)
- **DO NOT** block main thread or cause jank during animation

### Architecture compliance

| Decision Area | Compliance Notes |
|--------------|-----------------|
| Content management | All story text sourced from `app/content/story.ts` (follows Epic 3 pattern) |
| Scroll behavior | Intersection Observer ONLY (follows `app/lib/scroll.ts` policy) |
| Animation | Framer Motion dynamic import, prefers-reduced-motion support (follows Epic 1/3 pattern) |
| Component structure | `app/components/story/` domain (follows project file organization) |
| Bundle budget | <5KB addition (fits within <200KB total budget) |
| Accessibility | WCAG 2.1 AA compliance (color contrast, keyboard nav, reduced motion) |
| Error boundaries | Static fallback if Framer Motion fails (follows AnimationLayer pattern) |
| Testing | Unit, integration, visual regression tests required (follows Epic 3 pattern) |

**Key architectural references:**
- `_bmad-output/planning-artifacts/architecture.md` — Scroll policy, animation patterns, content management
- `_bmad-output/project-context.md` — File structure, bundle budget, accessibility requirements
- `_bmad-output/planning-artifacts/prd.md` — FR7 (story fragments), brand narrative requirements

### Previous story intelligence (Epic 3)

**Story 3.1 (Image Preloading with Intersection Observer):**
- Established Intersection Observer pattern in `app/hooks/use-preload-images.ts`
- Key pattern: `rootMargin: '200px'`, `isIntersecting && boundingClientRect.top > 0` for scroll direction
- SSR safety: `typeof IntersectionObserver !== 'undefined'` check
- Cleanup: `observer.disconnect()` on unmount
- **Lesson for 4.1:** Reuse this IO hook pattern for fragment visibility detection, adjust `threshold` to 0.5 (50% visible)

**Story 3.3 (Scent Narrative Copy):**
- Established centralized content pattern in `app/content/products.ts`
- Priority: Shopify metafield → hardcoded fallback → default
- **Lesson for 4.1:** Story fragments should follow same pattern in `app/content/story.ts`, but no metafields needed (brand story is static, not CMS-managed)

**Story 1.7 (Framer Motion Dynamic Import):**
- Framer Motion must be dynamically imported to protect bundle budget
- Pattern: `React.lazy()` or similar, provide Suspense fallback
- **Lesson for 4.1:** Use existing `~/lib/motion` dynamic import if available, or create similar pattern for story fragments

**Story 2.2 (Scroll Experience with Lenis):**
- Lenis on desktop, native on mobile
- B2B routes (`/wholesale/*`) use native scroll only
- **Lesson for 4.1:** Story fragments must work with both Lenis and native scroll, must not appear on B2B routes

### Technical requirements (dev agent guardrails)

| Requirement | Detail |
|------------|--------|
| Content source | `app/content/story.ts` - STORY_FRAGMENTS array with title, subtitle, content, actions |
| Component location | `app/components/story/StoryFragment.tsx`, `StoryFragmentContainer.tsx` |
| Hook location | `app/hooks/use-story-fragment-visibility.ts` |
| Scroll detection | Intersection Observer with `threshold: 0.5` (50% visible) |
| Animation | Framer Motion dynamic import, fade-in (opacity: [0, 1], duration: 600ms) |
| Reduced motion | Check `prefers-reduced-motion`, render static if enabled |
| Semantic HTML | Use `<article>` for fragments, `<section>` for container |
| Color contrast | 4.5:1 minimum (WCAG 2.1 AA) |
| Touch targets | 44x44px minimum for action buttons |
| Layout shift | CLS <0.1 (no layout shift during reveal) |
| Bundle impact | <5KB addition (fits within <200KB total) |
| SSR safety | Check `typeof IntersectionObserver !== 'undefined'` |
| Testing | Unit, integration, visual regression, performance tests |
| Types | TypeScript interface for StoryFragment type |

### Project structure notes

**Primary implementation files (expected):**
- `app/content/story.ts` — Story fragment data (already exists, may need type export)
- `app/components/story/StoryFragment.tsx` — Individual fragment display component
- `app/components/story/StoryFragmentContainer.tsx` — Container with IO triggers
- `app/hooks/use-story-fragment-visibility.ts` — Custom hook for IO-based visibility
- `app/routes/_index.tsx` — Integrate fragments into home page layout

**Supporting files that may need minor updates:**
- `app/components/story/StoryFragment.test.tsx` — Unit tests for fragment component
- `app/hooks/use-story-fragment-visibility.test.tsx` — Unit tests for visibility hook
- `tests/integration/story-fragments-scroll.test.ts` — Integration tests for scroll behavior
- `tests/visual/story-fragments.visual.ts` — Visual regression baselines

**Do not scatter logic** across multiple components; keep story fragment rendering and visibility detection cleanly separated (component vs hook).

### Intersection Observer Configuration

**Recommended configuration for Story 4.1:**

```typescript
{
  threshold: 0.5,      // Trigger when 50% of fragment is visible
  rootMargin: '0px'    // No buffer (trigger when actually visible)
}
```

**Rationale:**
- `threshold: 0.5` ensures fragment is clearly visible before animation starts
- `rootMargin: '0px'` (vs. `200px` from preloading) because story moments should be intentional, not preemptive
- Aligns with "permission to slow down" philosophy - story appears when user is ready to see it

### Animation Tokens

From `app/styles/app.css` (existing design tokens):
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--duration-reveal: 300ms;
--duration-micro: 150ms;
```

**Proposed for Story 4.1:**
- Duration: 600ms (slower than texture reveal, gives narrative breathing room)
- Easing: `--ease-out-expo` (smooth, welcoming entrance)
- Opacity: [0, 1] (simple fade-in, no complex transforms)

**Optional staggered animation:**
- If multiple fragments appear simultaneously, stagger by 120ms per fragment
- Use Framer Motion `staggerChildren` variant if needed

### Testing Strategy

**Unit Tests (StoryFragment.tsx):**
- ✅ Renders fragment with title, subtitle, content
- ✅ Renders action buttons with correct links
- ✅ Applies correct typography classes
- ✅ Has sufficient color contrast
- ✅ Action buttons are keyboard-focusable
- ✅ Touch targets meet 44x44px minimum
- ✅ Fallback state when Framer Motion fails
- ✅ Static rendering when prefers-reduced-motion enabled

**Unit Tests (use-story-fragment-visibility hook):**
- ✅ IntersectionObserver triggers when element 50% visible
- ✅ Animation triggers only once (useRef tracking)
- ✅ SSR safety - no crash when IntersectionObserver undefined
- ✅ Cleanup disconnects observer on unmount
- ✅ Multiple fragments don't interfere with each other

**Integration Tests:**
- ✅ Scroll down page → fragments appear in correct order
- ✅ Fragment animation completes before next fragment starts
- ✅ Mobile: no IntersectionObserver errors
- ✅ Lenis scroll (desktop) + native scroll (mobile) both work
- ✅ Fragments do not appear on `/wholesale/*` routes
- ✅ Fragments do not interfere with texture reveals
- ✅ Fragments do not interfere with collection prompt (Story 4.2)

**Visual Regression Tests:**
- ✅ Baseline: Static story fragment (no animation)
- ✅ Baseline: Fragment mid-animation (25%, 50%, 75% opacity)
- ✅ Baseline: Multiple fragments on page
- ✅ Mobile variant: Fragment layout on 320px, 768px, 1024px
- ✅ prefers-reduced-motion: Static rendering

**Performance Tests:**
- ✅ Fragment animation doesn't block main thread
- ✅ Multiple fragments in viewport don't cause jank
- ✅ Framer Motion dynamic import doesn't slow page load
- ✅ IntersectionObserver doesn't cause excessive callbacks
- ✅ CLS <0.1 (no layout shift during reveal)

### References

- **Epic definition:** `_bmad-output/planning-artifacts/epics.md` — Epic 4, Story 4.1, FR7
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` — Scroll policy, animation patterns, content management
- **PRD:** `_bmad-output/planning-artifacts/prd.md` — FR7 (story fragments), brand narrative requirements
- **Project context:** `_bmad-output/project-context.md` — File structure, bundle budget, accessibility requirements
- **Testing guidelines:** `_bmad-output/testing-guidelines.md` — Testing patterns, mocking strategies, quality gates
- **Previous story:** `_bmad-output/implementation-artifacts/3-1-implement-image-preloading-with-intersection-observer.md` — IO pattern reference
- **Previous story:** `_bmad-output/implementation-artifacts/3-3-display-scent-narrative-copy-in-reveal.md` — Content management pattern

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
