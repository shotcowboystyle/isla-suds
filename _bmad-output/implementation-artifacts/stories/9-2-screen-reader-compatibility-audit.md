# Story 9.2: Screen Reader Compatibility Audit

Status: ready-for-dev

## Story

As a **screen reader user**,
I want **all content to be accessible and announced properly**,
so that **I can understand and use the site without seeing it**.

## Acceptance Criteria

1. **Given** the site is complete through Epic 8
   **When** I audit with VoiceOver (Mac/iOS) and NVDA (Windows)
   **Then** I verify:
   - All images have meaningful alt text (or decorative alt="")
   - Headings follow proper hierarchy (h1 → h2 → h3)
   - Form inputs have associated labels
   - Buttons have accessible names
   - Links have descriptive text (not "click here")
   - Dynamic content changes are announced (cart updates, reveals)
   - Modals announce their role and title
   - Error messages are announced when they appear
   - Any issues found are documented and fixed
   - ARIA attributes are used only where HTML semantics are insufficient
   - Product cards announce: name, price, "activate to view details"

## Tasks / Subtasks

- [ ] Task 1: Audit image alt text across all pages (AC: 1)
  - [ ] Verify product texture macro images have descriptive alt text
  - [ ] Ensure hero images have meaningful alt text
  - [ ] Check story fragment images for appropriate alt attributes
  - [ ] Verify decorative images use alt=""
  - [ ] Test logo image has appropriate alt text

- [ ] Task 2: Audit heading hierarchy and semantic structure (AC: 1)
  - [ ] Verify single h1 per page (page title)
  - [ ] Check heading hierarchy follows h1 → h2 → h3 order
  - [ ] Audit landing page heading structure
  - [ ] Verify wholesale portal heading hierarchy
  - [ ] Check About and Contact pages for proper headings

- [ ] Task 3: Audit form accessibility (AC: 1)
  - [ ] Verify all inputs have associated `<label>` elements
  - [ ] Check aria-describedby for input hints/instructions
  - [ ] Test error message association with inputs
  - [ ] Verify wholesale login form labels
  - [ ] Check Contact form field labels and error announcements
  - [ ] Test checkout survey field accessibility

- [ ] Task 4: Audit button and link accessibility (AC: 1)
  - [ ] Verify all buttons have accessible names (text or aria-label)
  - [ ] Check icon-only buttons have aria-label
  - [ ] Verify links have descriptive text (avoid "click here")
  - [ ] Test cart icon button has meaningful name
  - [ ] Check quantity +/- buttons have accessible names
  - [ ] Verify "Add to Cart" buttons announce product name

- [ ] Task 5: Audit dynamic content announcements (AC: 1)
  - [ ] Test cart updates announce to screen readers (aria-live)
  - [ ] Verify texture reveal modal announces on open
  - [ ] Check story fragment appearances are announced
  - [ ] Test collection prompt announcement
  - [ ] Verify error messages are announced
  - [ ] Check loading states are announced

- [ ] Task 6: Audit modal and interactive component accessibility (AC: 1)
  - [ ] Verify texture reveal modal announces role="dialog"
  - [ ] Test cart drawer announces role and title
  - [ ] Check modal title is announced via aria-labelledby
  - [ ] Verify focus is moved to modal on open
  - [ ] Test modal close button is announced
  - [ ] Verify product cards announce: name, price, "activate to view details"

- [ ] Task 7: Fix identified screen reader issues (AC: 1)
  - [ ] Add missing alt text to images
  - [ ] Correct heading hierarchy violations
  - [ ] Add missing form labels
  - [ ] Improve button and link accessible names
  - [ ] Implement aria-live regions for dynamic content
  - [ ] Add appropriate ARIA attributes where needed (sparingly)

## Dev Notes

### Architecture Compliance

**Semantic HTML First:**
- Use semantic HTML elements before adding ARIA attributes
- Only add ARIA when HTML semantics are insufficient
- Follow principle: "No ARIA is better than bad ARIA"

**ARIA Live Regions Pattern:**
```typescript
// Cart update announcement
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {cartItemCount} items in cart. Total: {formatPrice(cartTotal)}
</div>

// Error announcements
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

**Product Card Accessibility:**
```typescript
// app/components/product/ProductCard.tsx
<article aria-label={`${product.title}, ${formatPrice(product.price)}`}>
  <button
    onClick={onRevealTexture}
    aria-label={`View texture details for ${product.title}`}
  >
    <img
      src={product.image}
      alt={`${product.title} - handmade goat milk soap`}
    />
    <h2>{product.title}</h2>
    <p className="sr-only">Activate to view texture details and scent narrative</p>
  </button>
</article>
```

**Modal Accessibility Pattern (Radix Dialog):**
```typescript
// Radix Dialog provides built-in accessibility
<Dialog.Root>
  <Dialog.Trigger>View Details</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content aria-describedby="texture-description">
      <Dialog.Title>{product.title} Texture Reveal</Dialog.Title>
      <Dialog.Description id="texture-description">
        {product.scentNarrative}
      </Dialog.Description>
      <Dialog.Close aria-label="Close texture reveal">×</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Testing Requirements

**Screen Reader Testing Protocol:**

**VoiceOver (macOS/iOS):**
- Enable: System Preferences → Accessibility → VoiceOver
- Navigate: VO + Right/Left arrows
- Activate: VO + Space
- Read all: VO + A
- Test on Safari (primary) and Chrome

**NVDA (Windows):**
- Download free from nvaccess.org
- Navigate: Arrow keys
- Activate: Enter
- Browse mode: Auto
- Test on Chrome and Firefox

**Test Scenarios:**
1. Navigate landing page from top to bottom
2. Trigger texture reveal and verify announcement
3. Add item to cart and verify announcement
4. Open cart drawer and navigate items
5. Complete wholesale login form
6. Test error message announcements

**Automated Tests (axe-core):**
```typescript
// tests/e2e/accessibility.spec.ts
import { injectAxe, checkA11y } from 'axe-playwright';

test('screen reader compatibility - landing page', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);

  await checkA11y(page, null, {
    rules: {
      'image-alt': { enabled: true },
      'label': { enabled: true },
      'aria-allowed-attr': { enabled: true },
      'aria-valid-attr-value': { enabled: true },
    },
  });
});
```

### Project Structure Notes

**Files to Inspect:**
- `app/components/product/ProductCard.tsx` - Product card announcements
- `app/components/product/TextureReveal.tsx` - Modal ARIA attributes
- `app/components/cart/CartDrawer.tsx` - Cart update announcements
- `app/components/layout/Header.tsx` - Navigation landmarks
- `app/routes/_index.tsx` - Landing page heading hierarchy
- `app/routes/wholesale/*.tsx` - Form labels and error announcements

**Files to Create/Modify:**
- Add `app/components/ui/ScreenReaderOnly.tsx` - sr-only utility component
- Create `app/components/ui/LiveRegion.tsx` - reusable aria-live component
- Update all image components with proper alt text
- Add ARIA labels to icon-only buttons
- Implement heading hierarchy corrections

**Utility Component Pattern:**
```typescript
// app/components/ui/ScreenReaderOnly.tsx
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// app/components/ui/LiveRegion.tsx
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive';
  atomic?: boolean;
}

export function LiveRegion({
  children,
  politeness = 'polite',
  atomic = true,
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
}
```

### References

- [Source: prd.md#Accessibility & Preferences] FR50: Visitors can use screen readers to access all content
- [Source: prd.md#Accessibility] NFR10: Screen reader compatibility - All content accessible
- [Source: architecture.md#Cross-Cutting Concerns] Accessibility - Radix primitives for complex interactions, semantic HTML throughout
- [Source: epics.md#Epic 9 Story 9.2] Product cards announce: name, price, "activate to view details"
- [Source: architecture.md#Component File Structure] Radix wrappers in `/components/ui/`

### Common Screen Reader Issues to Watch For

**Anti-patterns to avoid:**
- Buttons without accessible names (`<button><Icon /></button>`)
- Images without alt text or with redundant alt text
- Form inputs without labels (placeholder is not a label)
- Links with "click here" or "read more" text
- Redundant ARIA (aria-label on elements that already have text)
- Incorrect heading hierarchy (h1 → h3 skip)

**Best practices:**
- Use semantic HTML first (nav, main, article, aside)
- Associate labels with inputs using `for/id` or wrapping
- Provide context in link text ("Read more about Isla Suds story")
- Use aria-describedby for additional context
- Keep aria-label concise (screen readers read punctuation)
- Test with actual screen readers, not just automated tools

### Dynamic Content Announcement Strategy

**Cart Updates:**
```typescript
// app/components/cart/CartDrawer.tsx
const [announcement, setAnnouncement] = useState('');

const handleAddToCart = async (product) => {
  await addToCart(product);
  setAnnouncement(`${product.title} added to cart. ${cartItemCount} items total.`);
};

return (
  <>
    <LiveRegion>{announcement}</LiveRegion>
    {/* Cart UI */}
  </>
);
```

**Form Validation:**
```typescript
// Error messages should be announced
<input
  aria-describedby={error ? 'email-error' : undefined}
  aria-invalid={!!error}
/>
{error && (
  <div id="email-error" role="alert">
    {error}
  </div>
)}
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
