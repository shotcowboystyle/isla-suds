# Story 9.4: Color Contrast and Visual Accessibility Audit

Status: ready-for-dev

## Story

As a **low-vision user**,
I want **sufficient color contrast throughout the site**,
so that **I can read text and identify interactive elements**.

## Acceptance Criteria

1. **Given** the site is complete through Epic 8
   **When** I audit color contrast
   **Then** I verify:
   - All body text meets 4.5:1 contrast ratio against background
   - Large text (≥24px or ≥19px bold) meets 3:1 ratio
   - Interactive element boundaries are distinguishable
   - Error states are not indicated by color alone
   - Focus indicators have 3:1 contrast against adjacent colors
   - Scent narrative text on texture images is readable
   - Any contrast failures are fixed
   - Audit is performed with browser devtools or axe-core

## Tasks / Subtasks

- [ ] Task 1: Audit body text contrast ratios (AC: 1)
  - [ ] Measure all text colors against backgrounds
  - [ ] Verify body text (16px) meets 4.5:1 minimum
  - [ ] Check product descriptions and scent narratives
  - [ ] Verify wholesale portal text contrast
  - [ ] Test footer text contrast

- [ ] Task 2: Audit large text contrast ratios (AC: 1)
  - [ ] Verify headings (≥24px) meet 3:1 minimum
  - [ ] Check product titles contrast
  - [ ] Verify hero heading contrast
  - [ ] Test bold text (≥19px) contrast

- [ ] Task 3: Audit interactive element contrast (AC: 1)
  - [ ] Verify button text contrast (4.5:1)
  - [ ] Check button border/background contrast
  - [ ] Test link text contrast and differentiation
  - [ ] Verify form input borders are visible (3:1)
  - [ ] Check placeholder text contrast (if used)
  - [ ] Test disabled state contrast

- [ ] Task 4: Audit focus indicator contrast (AC: 1)
  - [ ] Verify focus outline has 3:1 contrast against background
  - [ ] Test focus indicator on light backgrounds
  - [ ] Test focus indicator on dark backgrounds
  - [ ] Check focus indicator on product images
  - [ ] Verify focus shadow/outline combination if used

- [ ] Task 5: Audit error and success state visibility (AC: 1)
  - [ ] Verify error messages use color + icon/text
  - [ ] Check form validation errors are not color-only
  - [ ] Test error states have sufficient contrast
  - [ ] Verify success messages are distinguishable
  - [ ] Check cart error states

- [ ] Task 6: Audit texture reveal and scent narrative contrast (AC: 1)
  - [ ] Verify scent narrative text on texture images is readable
  - [ ] Test text overlay backgrounds for sufficient contrast
  - [ ] Check product information overlay contrast
  - [ ] Verify texture reveal modal text contrast

- [ ] Task 7: Fix identified contrast issues (AC: 1)
  - [ ] Adjust colors that fail contrast requirements
  - [ ] Add text shadows or backgrounds where needed
  - [ ] Update design tokens with accessible color values
  - [ ] Verify brand colors maintain accessibility
  - [ ] Document color contrast decisions

## Dev Notes

### Architecture Compliance

**Design Token System:**
The project uses design tokens in `app/styles/globals.css` for colors. All color adjustments should be made to tokens first, then verified across all usages.

**Color Contrast Requirements:**
- **Normal text (<24px):** 4.5:1 minimum (WCAG AA)
- **Large text (≥24px or ≥19px bold):** 3:1 minimum (WCAG AA)
- **UI components (borders, icons):** 3:1 minimum
- **Focus indicators:** 3:1 minimum against adjacent colors

**Testing Tools:**
```typescript
// Browser DevTools Color Picker
// Chrome DevTools: Inspect element → Styles → Color picker → Contrast ratio

// Automated testing with axe-core
import { injectAxe, checkA11y } from 'axe-playwright';

test('color contrast audit', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);

  await checkA11y(page, null, {
    rules: {
      'color-contrast': { enabled: true },
    },
  });
});
```

**Design Token Pattern:**
```css
/* app/styles/globals.css */
:root {
  /* Base colors - verify these meet WCAG standards */
  --color-text-primary: hsl(0 0% 10%); /* Near black */
  --color-text-secondary: hsl(0 0% 30%); /* Dark gray */
  --color-background: hsl(0 0% 100%); /* White */

  /* Brand colors - teal palette */
  --color-teal-500: hsl(180 50% 40%); /* Primary teal */
  --color-teal-600: hsl(180 50% 30%); /* Darker teal for contrast */

  /* Interactive states */
  --color-link: var(--color-teal-600); /* Must meet 4.5:1 */
  --color-link-hover: var(--color-teal-700);

  /* Focus indicator */
  --color-focus-outline: var(--color-teal-500);
  --color-focus-shadow: hsl(180 50% 40% / 0.3);

  /* Error states */
  --color-error: hsl(0 70% 45%); /* Red with sufficient contrast */
  --color-error-bg: hsl(0 70% 95%); /* Light red background */
}

/* Dark mode considerations (if implemented) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: hsl(0 0% 95%);
    --color-background: hsl(0 0% 10%);
    /* Adjust all colors for dark mode contrast */
  }
}
```

**Scent Narrative Text Overlay:**
```typescript
// app/components/product/TextureReveal.tsx
// Ensure text on images has sufficient contrast

<div className="relative">
  <img src={product.textureImage} alt="" />

  {/* Text overlay with background for contrast */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
    <p className="text-white text-lg p-4 drop-shadow-lg">
      {product.scentNarrative}
    </p>
  </div>
</div>

// Alternative: Text on solid background
<div className="bg-white/90 backdrop-blur-sm p-4">
  <p className="text-gray-900">
    {product.scentNarrative}
  </p>
</div>
```

**Error State Pattern (Not Color Alone):**
```typescript
// Bad: Color only
<p className="text-red-600">Invalid email</p>

// Good: Color + icon + text
<div className="flex items-center gap-2 text-red-600">
  <AlertCircleIcon aria-hidden="true" />
  <p>
    <span className="font-semibold">Error:</span> Invalid email address
  </p>
</div>
```

### Testing Requirements

**Manual Testing Protocol:**

**Browser DevTools Method:**
1. Open Chrome DevTools (F12)
2. Inspect element with text
3. Click color swatch in Styles panel
4. Check "Contrast ratio" section
5. Verify meets WCAG AA (4.5:1 or 3:1 for large text)
6. Document failures with screenshots

**Color Contrast Analyzers:**
- **Chrome DevTools:** Built-in contrast ratio checker
- **WAVE:** Browser extension (wave.webaim.org)
- **Colour Contrast Analyser:** Standalone app
- **WebAIM Contrast Checker:** webaim.org/resources/contrastchecker

**Test Checklist:**
- [ ] Landing page hero text
- [ ] Product card titles and prices
- [ ] Scent narrative text on texture images
- [ ] Button text (primary, secondary, ghost)
- [ ] Link text in body content
- [ ] Form labels and input text
- [ ] Error messages
- [ ] Footer text and links
- [ ] Wholesale portal text
- [ ] Focus indicators on all interactive elements

**Automated Testing:**
```typescript
// tests/e2e/color-contrast.spec.ts
import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

const pages = [
  '/',
  '/about',
  '/contact',
  '/wholesale',
];

for (const path of pages) {
  test(`color contrast - ${path}`, async ({ page }) => {
    await page.goto(path);
    await injectAxe(page);

    await checkA11y(page, null, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });
}
```

### Project Structure Notes

**Files to Inspect:**
- `app/styles/globals.css` - Design tokens and color definitions
- `app/components/ui/Button.tsx` - Button color variants
- `app/components/product/ProductCard.tsx` - Product text and pricing
- `app/components/product/TextureReveal.tsx` - Scent narrative text overlay
- `app/components/layout/Header.tsx` - Navigation link colors
- `app/components/layout/Footer.tsx` - Footer text and link colors
- `app/routes/_index.tsx` - Hero text and landing page content
- `app/lib/variants.ts` - CVA color variants

**Files to Create/Modify:**
- Update color tokens in `app/styles/globals.css`
- Adjust CVA variants in `app/lib/variants.ts` for accessible colors
- Add text overlay backgrounds to texture reveals if needed
- Update button variants for better contrast
- Document color decisions in design system

### References

- [Source: prd.md#Accessibility] NFR12: Color contrast - 4.5:1 minimum for text
- [Source: prd.md#Accessibility] NFR11: Focus indicators - Visible on all focusable elements
- [Source: architecture.md#Core Architectural Decisions] Design token system in tokens.css
- [Source: architecture.md#Component File Structure] CVA definitions in `app/lib/variants.ts`
- [Source: epics.md#Epic 9 Story 9.4] Scent narrative text on texture images is readable

### Common Contrast Issues and Solutions

**Issue 1: Light gray text on white background**
- **Problem:** 3:1 contrast (fails WCAG AA)
- **Solution:** Darken gray to achieve 4.5:1
- **Example:** Change `hsl(0 0% 60%)` to `hsl(0 0% 45%)`

**Issue 2: Teal brand color on white background**
- **Problem:** Light teal may not meet 4.5:1
- **Solution:** Use darker teal variant for text
- **Example:** Use `--color-teal-600` instead of `--color-teal-500` for text

**Issue 3: Text on product images**
- **Problem:** Variable image colors make contrast unpredictable
- **Solution:** Add semi-transparent background or strong text shadow
- **Example:**
  ```css
  .scent-narrative {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    /* or */
    background: rgba(0, 0, 0, 0.7);
    padding: 1rem;
  }
  ```

**Issue 4: Placeholder text**
- **Problem:** Placeholders often have low contrast
- **Solution:** Use actual labels instead of placeholders, or increase contrast
- **Note:** Placeholders should NOT be the only label (accessibility issue)

**Issue 5: Disabled buttons**
- **Problem:** Intentionally low contrast
- **Solution:** This is acceptable for disabled states (WCAG exception)
- **Note:** Ensure disabled state is also indicated by aria-disabled

### Brand Color Accessibility Strategy

**Teal Palette (Primary Brand Color):**
```css
/* Generate accessible teal variants */
--color-teal-50: hsl(180 50% 97%);   /* Very light - backgrounds */
--color-teal-100: hsl(180 50% 90%);  /* Light backgrounds */
--color-teal-500: hsl(180 50% 40%);  /* Brand - use for focus, borders */
--color-teal-600: hsl(180 50% 30%);  /* Dark enough for text (4.5:1) */
--color-teal-700: hsl(180 50% 25%);  /* Hover states, high contrast */
```

**Usage Guidelines:**
- **Text on white:** Use teal-600 or darker
- **Focus indicators:** teal-500 (3:1 minimum ok for UI components)
- **Backgrounds:** teal-50 or teal-100
- **Buttons:** teal-600 background with white text

**Verify with calculation:**
```javascript
// Contrast ratio formula (simplified check)
function getContrastRatio(foreground, background) {
  // Use online tool: webaim.org/resources/contrastchecker
  // or Chrome DevTools color picker
}
```

### CI Integration

**Add color contrast checks to CI:**
```typescript
// .github/workflows/accessibility.yml
- name: Run accessibility tests
  run: pnpm test:a11y

// package.json
"scripts": {
  "test:a11y": "playwright test --grep @a11y"
}

// tests/e2e/accessibility.spec.ts
test.describe('Accessibility Compliance @a11y', () => {
  // Color contrast tests
});
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
