# Story 9.1: Keyboard Navigation Audit

Status: ready-for-dev

## Story

As a **keyboard-only user**,
I want **to navigate the entire site using only keyboard**,
so that **I can browse and purchase without a mouse**.

## Acceptance Criteria

1. **Given** the site is complete through Epic 8
   **When** I audit keyboard navigation
   **Then** I verify:
   - Tab order follows logical visual flow on all pages
   - All interactive elements are reachable via Tab
   - Focus indicators are visible on all focusable elements
   - No keyboard traps (can always Tab out except modals)
   - Enter/Space activates buttons and links
   - Escape closes modals and drawers
   - Arrow keys work for expected controls (quantity +/-)
   - Any issues found are documented and fixed
   - Focus indicator styling is consistent with brand (teal outline)
   - Skip link "Skip to main content" is present for screen reader users

## Tasks / Subtasks

- [ ] Task 1: Audit B2C landing page keyboard navigation (AC: 1)
  - [ ] Verify tab order through hero → sticky header → constellation grid → footer
  - [ ] Test focus indicators on product cards
  - [ ] Verify texture reveal can be triggered with Enter/Space
  - [ ] Test story fragments don't interrupt tab order

- [ ] Task 2: Audit product reveal keyboard interactions (AC: 1)
  - [ ] Verify Enter/Space activates texture reveal
  - [ ] Test Escape closes texture reveal modal
  - [ ] Verify focus returns to triggering element after close
  - [ ] Test scent narrative content is reachable via Tab
  - [ ] Verify "Add to Cart" button is keyboard accessible

- [ ] Task 3: Audit cart drawer keyboard navigation (AC: 1)
  - [ ] Verify cart icon in sticky header is keyboard accessible
  - [ ] Test Escape closes cart drawer
  - [ ] Verify quantity +/- buttons work with Enter/Space
  - [ ] Test arrow keys for quantity increment/decrement (if implemented)
  - [ ] Verify remove item buttons are keyboard accessible
  - [ ] Test "Proceed to Checkout" button is reachable and activatable

- [ ] Task 4: Audit wholesale portal keyboard navigation (AC: 1)
  - [ ] Verify login form fields are reachable via Tab
  - [ ] Test form submission with Enter key
  - [ ] Verify dashboard navigation is keyboard accessible
  - [ ] Test one-click reorder button with Enter/Space
  - [ ] Verify order history table is navigable
  - [ ] Test invoice request functionality with keyboard

- [ ] Task 5: Audit utility pages keyboard navigation (AC: 1)
  - [ ] Verify About page navigation and content focus order
  - [ ] Test Contact form keyboard accessibility
  - [ ] Verify footer links are keyboard accessible

- [ ] Task 6: Implement skip link and focus indicator improvements (AC: 1)
  - [ ] Add "Skip to main content" link (visually hidden until focused)
  - [ ] Verify skip link appears on focus at top of page
  - [ ] Ensure focus indicator uses teal brand color with sufficient contrast
  - [ ] Apply consistent focus styling across all interactive elements
  - [ ] Test focus indicators on Radix UI components (Dialog, Navigation)

- [ ] Task 7: Fix identified keyboard navigation issues (AC: 1)
  - [ ] Document all keyboard traps or navigation issues
  - [ ] Fix tab order problems
  - [ ] Resolve any missing focus indicators
  - [ ] Ensure modal focus management is correct
  - [ ] Verify no auto-focus that disrupts natural flow

## Dev Notes

### Architecture Compliance

**Focus Management Strategy:**
- Radix UI primitives (Dialog, NavigationMenu) provide built-in keyboard support and focus management
- Cart drawer should use Radix Dialog primitive for proper modal behavior
- Texture reveal overlay should trap focus when open, restore focus on close
- Focus indicator styling should use design tokens from `app/styles/globals.css`

**Implementation Pattern:**
```typescript
// Skip link implementation
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:ring-2 focus:ring-teal-500"
>
  Skip to main content
</a>

// Main content landmark
<main id="main-content" tabIndex={-1}>
  {/* Content */}
</main>
```

**Focus Indicator Styling:**
```css
/* Global focus indicator - app/styles/globals.css */
*:focus-visible {
  outline: 2px solid var(--color-teal-500);
  outline-offset: 2px;
}

/* Ensure 3:1 contrast against adjacent colors */
*:focus-visible {
  box-shadow: 0 0 0 3px rgba(var(--color-teal-500-rgb), 0.3);
}
```

### Testing Requirements

**Manual Testing Protocol:**
1. Disconnect mouse/trackpad
2. Start from browser address bar
3. Tab through entire page
4. Verify all interactive elements are reachable
5. Test Enter/Space activation on buttons, links, custom controls
6. Test Escape key on modals and drawers
7. Verify no keyboard traps (can always Tab out)
8. Document any issues with screenshots

**Test Devices:**
- macOS Safari, Chrome, Firefox
- Windows Chrome, Edge, Firefox
- Focus indicators may render differently across browsers

**Automated Tests (Playwright):**
```typescript
// tests/e2e/keyboard-navigation.spec.ts
test('can navigate constellation with keyboard', async ({ page }) => {
  await page.goto('/');

  // Tab to first product card
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab'); // Skip header links

  // First product should be focused
  const firstProduct = page.locator('[data-testid="product-card"]').first();
  await expect(firstProduct).toBeFocused();

  // Activate with Enter
  await page.keyboard.press('Enter');

  // Texture reveal should open
  await expect(page.locator('[data-testid="texture-reveal"]')).toBeVisible();

  // Escape should close
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-testid="texture-reveal"]')).not.toBeVisible();
});
```

### Project Structure Notes

**Files to Inspect:**
- `app/components/layout/Header.tsx` - Sticky header navigation
- `app/components/product/ConstellationGrid.tsx` - Product card focus order
- `app/components/product/TextureReveal.tsx` - Modal keyboard interactions
- `app/components/cart/CartDrawer.tsx` - Cart drawer focus management
- `app/routes/wholesale/*.tsx` - B2B portal keyboard navigation
- `app/styles/globals.css` - Global focus indicator styles

**Files to Create/Modify:**
- Create skip link component in `app/components/layout/SkipLink.tsx`
- Update root layout to include skip link
- Update focus indicator styles in global CSS
- Add keyboard event handlers where missing

### References

- [Source: prd.md#Accessibility & Preferences] FR49: Visitors can navigate entire site via keyboard
- [Source: prd.md#Accessibility] NFR9: Keyboard navigation - 100% of interactive elements
- [Source: prd.md#Accessibility] NFR11: Focus indicators - Visible on all focusable elements
- [Source: architecture.md#Cross-Cutting Concerns] Accessibility - Radix primitives for complex interactions
- [Source: epics.md#Epic 9] Validation epic - catches edge cases and polishes existing accessibility
- [Source: architecture.md#Component File Structure] `/components/ui/` - Radix wrappers with CVA

### Browser Compatibility Notes

**Focus-visible pseudo-class:**
- Modern browsers support `:focus-visible` (Safari 15.4+, Chrome 86+, Firefox 85+)
- Fallback to `:focus` for older browsers if needed
- Use CSS custom properties for focus colors for easy theme switching

**Radix UI Keyboard Support:**
- Dialog: Escape closes, focus trap active when open
- NavigationMenu: Arrow keys navigate menu items
- All Radix primitives follow WAI-ARIA keyboard patterns

### Performance Considerations

- Skip link should not impact page load performance
- Focus indicators are CSS-only (no JavaScript overhead)
- Keyboard event listeners should use passive event listeners where appropriate
- Tab order should follow DOM order (no manual tabIndex manipulation except -1 for main)

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent_
