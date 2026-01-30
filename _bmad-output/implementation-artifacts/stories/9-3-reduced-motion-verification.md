# Story 9.3: Reduced Motion Verification

Status: ready-for-dev

## Story

As a **motion-sensitive user**,
I want **simplified animations when I have prefers-reduced-motion enabled**,
so that **I don't experience discomfort or nausea from animations**.

## Acceptance Criteria

1. **Given** I have `prefers-reduced-motion: reduce` set in OS preferences
   **When** I browse the site
   **Then** I verify:
   - Parallax effects are disabled or minimal
   - Texture reveals appear instantly (no scale/fade animation)
   - Story fragments appear instantly (no fade-in)
   - Cart drawer appears instantly (no slide animation)
   - Sticky header appears instantly (no fade)
   - Lenis smooth scroll is disabled (native scroll only)
   - Collection prompt appears instantly
   - No auto-playing animations or carousels
   - Site remains fully functional and beautiful without motion
   - Any missing reduced-motion handling is fixed

## Tasks / Subtasks

- [ ] Task 1: Audit Lenis smooth scroll reduced-motion handling (AC: 1)
  - [ ] Verify Lenis is disabled when prefers-reduced-motion is set
  - [ ] Test native scroll fallback works correctly
  - [ ] Check scroll-triggered effects respect reduced motion
  - [ ] Verify scroll performance with native scroll

- [ ] Task 2: Audit Framer Motion reduced-motion support (AC: 1)
  - [ ] Verify Framer Motion respects prefers-reduced-motion
  - [ ] Test texture reveal animations are instant
  - [ ] Check story fragment animations are disabled
  - [ ] Verify cart drawer transitions are instant
  - [ ] Test collection prompt appears without animation

- [ ] Task 3: Audit CSS animation reduced-motion support (AC: 1)
  - [ ] Verify all CSS transitions respect @media (prefers-reduced-motion)
  - [ ] Test sticky header transitions are instant
  - [ ] Check button hover effects are minimal
  - [ ] Verify loading states are simplified
  - [ ] Test focus indicator transitions (minimal motion ok)

- [ ] Task 4: Audit parallax and scroll-linked effects (AC: 1)
  - [ ] Verify parallax effects are disabled
  - [ ] Test scroll-triggered animations don't fire
  - [ ] Check constellation grid stays static
  - [ ] Verify story moments appear without motion

- [ ] Task 5: Test full user journey with reduced motion (AC: 1)
  - [ ] Navigate landing page with reduced motion enabled
  - [ ] Trigger texture reveal and verify instant appearance
  - [ ] Add item to cart and verify drawer opens instantly
  - [ ] Test wholesale portal with reduced motion
  - [ ] Verify checkout flow works without animations

- [ ] Task 6: Implement missing reduced-motion handling (AC: 1)
  - [ ] Add Lenis disable check for prefers-reduced-motion
  - [ ] Configure Framer Motion reducedMotion setting
  - [ ] Update CSS animations with prefers-reduced-motion media query
  - [ ] Ensure all motion is optional, not required for functionality

- [ ] Task 7: Document reduced-motion implementation (AC: 1)
  - [ ] Create developer guide for adding animations
  - [ ] Document reduced-motion testing procedure
  - [ ] Add reduced-motion consideration to component template

## Dev Notes

### Architecture Compliance

**Lenis Configuration with Reduced Motion:**
```typescript
// app/lib/scroll.ts
import Lenis from '@studio-freight/lenis';

export function initLenis() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Don't initialize Lenis, use native scroll
    return null;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false, // Already disabled for mobile
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenis;
}
```

**Framer Motion Configuration:**
```typescript
// app/root.tsx or motion components
import { MotionConfig } from 'framer-motion';

export default function Root() {
  return (
    <MotionConfig reducedMotion="user">
      {/* This respects prefers-reduced-motion automatically */}
      {children}
    </MotionConfig>
  );
}

// Individual component with reduced motion handling
import { motion, useReducedMotion } from 'framer-motion';

export function TextureReveal({ product }) {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : variants}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
    >
      {/* Content */}
    </motion.div>
  );
}
```

**CSS Animations with Reduced Motion:**
```css
/* app/styles/globals.css */

/* Default animation */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Disable for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .fade-in {
    animation: none;
  }

  /* Disable all transitions and animations */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Allow minimal motion for focus indicators (accessibility need) */
  *:focus-visible {
    transition: outline-offset 0.1s ease;
  }
}
```

**Tailwind Configuration:**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      animation: {
        // All animations should have reduced-motion variants
      },
    },
  },
  plugins: [
    // Add motion-safe and motion-reduce variants
    require('tailwindcss-motion'),
  ],
};

// Usage in components
<div className="motion-safe:animate-fade-in motion-reduce:opacity-100">
  Content
</div>
```

### Testing Requirements

**Manual Testing Protocol:**

**Enable Reduced Motion:**
- **macOS:** System Preferences → Accessibility → Display → Reduce motion
- **Windows:** Settings → Ease of Access → Display → Show animations
- **iOS:** Settings → Accessibility → Motion → Reduce Motion
- **Android:** Settings → Accessibility → Remove animations

**Test Scenarios:**
1. Enable reduced motion in OS
2. Reload site and navigate landing page
3. Verify no smooth scroll (immediate jump scrolling)
4. Click product card to trigger texture reveal
5. Verify instant appearance (no scale/fade)
6. Add to cart and verify drawer appears instantly
7. Scroll through page and verify story fragments appear instantly
8. Test wholesale portal with reduced motion
9. Verify all functionality works identically (no broken features)

**Automated Tests:**
```typescript
// tests/e2e/reduced-motion.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Reduced Motion Support', () => {
  test.use({
    // Emulate reduced motion preference
    reducedMotion: 'reduce',
  });

  test('disables Lenis smooth scroll', async ({ page }) => {
    await page.goto('/');

    // Check that Lenis is not initialized
    const lenisInstance = await page.evaluate(() => {
      return window.lenis !== undefined;
    });

    expect(lenisInstance).toBe(false);
  });

  test('texture reveal appears instantly', async ({ page }) => {
    await page.goto('/');

    const startTime = Date.now();

    // Click product card
    await page.click('[data-testid="product-card"]');

    // Reveal should be visible immediately
    await expect(page.locator('[data-testid="texture-reveal"]')).toBeVisible();

    const duration = Date.now() - startTime;

    // Should appear in less than 50ms (instant)
    expect(duration).toBeLessThan(50);
  });

  test('cart drawer opens instantly', async ({ page }) => {
    await page.goto('/');

    const startTime = Date.now();

    // Open cart drawer
    await page.click('[data-testid="cart-icon"]');

    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();

    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(50);
  });
});
```

### Project Structure Notes

**Files to Inspect:**
- `app/lib/scroll.ts` - Lenis initialization and reduced motion check
- `app/root.tsx` - Framer Motion MotionConfig wrapper
- `app/components/product/TextureReveal.tsx` - Framer Motion animations
- `app/components/cart/CartDrawer.tsx` - Drawer transition animations
- `app/components/story/StoryMoment.tsx` - Story fragment animations
- `app/styles/globals.css` - Global animation and transition rules

**Files to Create/Modify:**
- Update `app/lib/scroll.ts` with reduced motion check
- Wrap root with Framer Motion MotionConfig in `app/root.tsx`
- Add CSS media query to `app/styles/globals.css`
- Update all motion components with useReducedMotion hook
- Create utility hook `app/hooks/use-reduced-motion.ts` if needed

### References

- [Source: prd.md#Accessibility & Preferences] FR51: Visitors with reduced motion preferences see simplified animations
- [Source: prd.md#Accessibility] NFR13: Reduced motion - Animations simplified when prefers-reduced-motion
- [Source: architecture.md#Development Modes] Lenis smooth scroll physics (desktop only)
- [Source: architecture.md#What We Add] Framer Motion - GPU-accelerated animations
- [Source: epics.md#Epic 9 Story 9.3] Site remains fully functional and beautiful without motion

### Motion Reduction Strategy

**What to Disable:**
- Smooth scroll (Lenis)
- Scale/fade animations on texture reveals
- Slide transitions on drawers/modals
- Fade-in animations on story fragments
- Parallax scrolling effects
- Auto-playing animations
- Easing transitions (use instant or very fast)

**What to Keep (Minimal Motion):**
- Focus indicators (accessibility requirement)
- Loading spinners (can be simplified)
- Hover states (color/opacity changes ok)
- State changes (instant is ok)

**Implementation Principle:**
> "Motion should enhance the experience, not be required for it."

All functionality must work identically with reduced motion enabled. The only difference should be visual motion, not behavior or content availability.

### Performance Considerations

**Benefits of Reduced Motion:**
- No Lenis initialization saves ~3KB bundle + runtime overhead
- Fewer Framer Motion animations reduce CPU usage
- Instant transitions reduce paint/composite work
- Better performance on low-end devices

**Testing on Low-End Devices:**
- Reduced motion often correlates with low-end devices
- Test on iPhone SE, older Android devices
- Verify instant transitions don't cause layout shifts
- Ensure no CLS (Cumulative Layout Shift) from instant appearances

### Developer Guidelines

**When Adding New Animations:**
1. Always check `useReducedMotion()` hook
2. Provide instant alternative (duration: 0 or no animation)
3. Test with reduced motion enabled
4. Document motion behavior in component

**Component Template:**
```typescript
import { motion, useReducedMotion } from 'framer-motion';

export function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? undefined // No animation
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };

  return (
    <motion.div
      variants={variants}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
    >
      Content
    </motion.div>
  );
}
```

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent_
