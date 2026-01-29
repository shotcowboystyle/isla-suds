# Epic 2 Retrospective: Landing & Constellation Layout

**Date:** 2026-01-28
**Facilitator:** Bob (Scrum Master)
**Participants:** Bubbles (Project Lead), Charlie (Senior Dev), Dana (QA Engineer), Alice (Product Owner)

---

## Epic Summary

| Metric | Value |
|--------|-------|
| Epic | 2 - Landing & Constellation Layout |
| Stories Completed | 5/5 (100%) |
| New Tests Added | +45 tests |
| Agent Used | Claude Sonnet 4.5 |
| Duration | Epic complete ahead of schedule |

---

## Stories Delivered

| Story | Title | Status |
|-------|-------|--------|
| 2.1 | Create hero section with brand identity | Done |
| 2.2 | Implement scroll experience with Lenis native hybrid | Done |
| 2.3 | Build constellation grid layout | Done |
| 2.4 | Enable non-linear product exploration | Done |
| 2.5 | Implement sticky header with scroll trigger | Done |

---

## What Went Well

### Velocity & Delivery
- **Ahead of schedule** - All 5 stories completed with strong momentum
- **100% completion** - No stories deferred or descoped
- **Test discipline** - 45 new tests added across the epic

### Technical Patterns Established

1. **IntersectionObserver-based Patterns**
   - `usePastHero` hook for scroll-triggered visibility
   - IO-only policy for scroll-linked animations (no scroll event listeners)

2. **Focus State Architecture**
   - Zustand exploration store integration
   - Click-outside handling with proper scope
   - Keyboard navigation (Enter/Space/Escape)

3. **Accessibility Foundation**
   - Skip links in hero section
   - prefers-reduced-motion support throughout
   - aria-labels on interactive elements

4. **Mobile-First Responsive**
   - CSS scroll-snap for mobile (`snap-proximity`)
   - Lenis desktop-only (1024px+ breakpoint)
   - 2-column mobile grid, organic desktop constellation

### Quality Achievements

- **Code review discipline** - Every story had AI-assisted code review with fixes applied
- **SSR-safe patterns** - Consistent use of client-side checks, zero hydration issues
- **TypeScript strict mode** - Maintained throughout all 5 stories

---

## What Could Be Improved

### Pattern 1: Code Review Fixes Were Significant

Every story had HIGH or CRITICAL issues caught in code review:

| Story | Critical Issues |
|-------|-----------------|
| 2.1 | Duplicate h1 (HIGH), tagline hardcoded (HIGH) |
| 2.2 | Scroll-snap on wrong container |
| 2.3 | Dynamic Tailwind classes not JIT'd (HIGH), organic layout incomplete (HIGH) |
| 2.4 | Click-outside scope wrong (HIGH) |
| 2.5 | HomeScrollProvider not wrapping Header (CRITICAL), missing aria-labels (HIGH) |

**Lesson:** Story 2.5's CRITICAL bug (context provider in wrong location) would have broken the entire feature. The AI code review caught it, but we need to be more careful about component hierarchy during initial implementation.

### Pattern 2: Tailwind JIT Class Discovery

Dynamic Tailwind classes like `lg:rotate-[${rotation}deg]` don't work because JIT doesn't scan template literals. Had to use full class strings.

**Lesson:** Document this gotcha in project-context.md for future stories.

### Pattern 3: Accessibility Added in Review, Not Implementation

Accessibility features (skip links, aria-labels, focus-visible) were consistently added during code review rather than during initial implementation.

**Lesson:** Treat accessibility as primary implementation, not review catch.

### Pattern 4: CI Quality Gates Failing

Two GitHub Actions workflows are failing:
- **Lighthouse CI** - Configuration issues
- **Accessibility (axe-core)** - Missing environment variables

**Status:** Branch `fix/github-ci-actions` created with partial fixes. Requires GitHub secrets to be configured.

---

## Technical Debt

| Issue | Priority | Status |
|-------|----------|--------|
| CI: Accessibility job needs `PUBLIC_*` secrets in GitHub | HIGH | Branch created |
| CI: Lighthouse CI needs verification | MEDIUM | Workflow updated |
| Add GitHub secrets: `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, `PUBLIC_STOREFRONT_ID` | HIGH | Pending manual action |
| Document Tailwind JIT gotcha in project-context.md | LOW | Pending |

---

## Previous Retrospective Follow-Through

From Epic 1 Retrospective:

| Action Item | Priority | Status |
|-------------|----------|--------|
| Migrate `@studio-freight/lenis` to `lenis` | HIGH | ✅ Completed (now using `lenis` package) |
| Analyze bundle for optimization opportunities | MEDIUM | ⏳ Deferred |
| Document React Router 7 + Hydrogen patterns | LOW | ⏳ Deferred |

**Assessment:** Completed the critical Lenis migration. Lower priority items deferred but not blocking.

---

## Epic 3 Preview

**Epic 3: Texture Reveals & Product Discovery** (6 stories)

**Goal:** Visitors can trigger texture reveals, experience macro photography, read scent narratives, and understand each product's value.

**User Outcome:** Sarah hovers on the purple soap. Lavender buds fill her screen. _"Close your eyes. A field at dusk."_ She wants to touch it.

**Stories:**
1. 3.1: Implement image preloading with Intersection Observer
2. 3.2: Build texture reveal interaction
3. 3.3: Display scent narrative copy in reveal
4. 3.4: Display product information in reveal
5. 3.5: Implement close/dismiss reveal behavior
6. 3.6: Create variety pack bundle display

**Critical Requirement:** <100ms texture reveal response time (performance contract)

**Dependencies on Epic 2:**
- ConstellationGrid component (Story 2.3)
- ProductCard component with focus state (Story 2.4)
- Zustand exploration store integration

---

## Action Items for Epic 3

| # | Action | Priority | Owner |
|---|--------|----------|-------|
| 1 | Configure GitHub secrets for CI (`PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, `PUBLIC_STOREFRONT_ID`) | HIGH | Bubbles |
| 2 | Merge `fix/github-ci-actions` branch after secrets configured | HIGH | Bubbles |
| 3 | Verify CI passes before marking Epic 2 fully complete | HIGH | Bubbles |
| 4 | Add Tailwind JIT gotcha to project-context.md | LOW | Dev Team |
| 5 | Treat accessibility as primary implementation in Epic 3 stories | MEDIUM | Dev Team |

---

## Key Takeaways

1. **Code review is catching critical issues** - Keep the discipline, but aim to catch these patterns earlier in implementation
2. **Accessibility must be first-class** - Not an afterthought caught in review
3. **CI quality gates need operational attention** - Configuration and secrets management is real work
4. **Velocity is strong** - Team delivered ahead of schedule with good quality

---

## Retrospective Outcome

**Epic 2 Status:** ✅ Code Complete (CI fixes pending as tech debt)
**Foundation Quality:** Strong
**Ready for Epic 3:** Yes

---

_Retrospective facilitated by Bob (Scrum Master) using BMAD workflow._
