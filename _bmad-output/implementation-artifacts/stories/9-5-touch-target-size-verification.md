# Story 9.5: Touch Target Size Verification

Status: ready-for-dev

## Story

As a **mobile user with motor impairments**,
I want **touch targets to be large enough to tap accurately**,
so that **I don't accidentally tap the wrong element**.

## Acceptance Criteria

1. **Given** the site is viewed on mobile devices
   **When** I audit touch targets
   **Then** I verify:
   - All buttons are at least 44x44px
   - All links have at least 44px tap height
   - Quantity +/- buttons are adequately sized
   - Close (X) buttons are at least 44x44px
   - Form inputs have adequate tap area
   - Spacing between targets prevents mis-taps
   - Any undersized targets are fixed
   - Verification includes: iPhone SE, Pixel 7

## Tasks / Subtasks

- [ ] Task 1: Audit button touch target sizes (AC: 1)
  - [ ] Measure "Add to Cart" button dimensions
  - [ ] Check "Proceed to Checkout" button size
  - [ ] Verify CTA buttons meet 44x44px minimum
  - [ ] Test wholesale portal action buttons
  - [ ] Check form submit buttons

- [ ] Task 2: Audit link touch target sizes (AC: 1)
  - [ ] Measure navigation link tap areas
  - [ ] Check footer link spacing and height
  - [ ] Verify product card link tap area
  - [ ] Test sticky header links on mobile
  - [ ] Check "skip to main content" link tap area

- [ ] Task 3: Audit quantity control touch targets (AC: 1)
  - [ ] Measure quantity +/- button dimensions
  - [ ] Verify spacing between +/- buttons
  - [ ] Test cart line item quantity controls
  - [ ] Check touch target overlap between controls

- [ ] Task 4: Audit modal and drawer close buttons (AC: 1)
  - [ ] Measure texture reveal close button (X)
  - [ ] Verify cart drawer close button size
  - [ ] Test modal close button tap area
  - [ ] Check spacing from other interactive elements

- [ ] Task 5: Audit form input touch targets (AC: 1)
  - [ ] Measure form input height
  - [ ] Verify input labels are tappable (expand focus area)
  - [ ] Test wholesale login form inputs
  - [ ] Check contact form input sizes
  - [ ] Verify checkbox/radio tap areas

- [ ] Task 6: Audit spacing between interactive elements (AC: 1)
  - [ ] Check button groupings have adequate spacing
  - [ ] Verify navigation links don't overlap tap areas
  - [ ] Test product grid spacing prevents mis-taps
  - [ ] Check footer link spacing
  - [ ] Verify cart item controls are spaced apart

- [ ] Task 7: Fix undersized touch targets (AC: 1)
  - [ ] Increase button padding to meet 44px minimum
  - [ ] Add transparent tap area extensions where needed
  - [ ] Adjust spacing between interactive elements
  - [ ] Update mobile-specific styles for better tap targets
  - [ ] Document touch target standards for future development

## Dev Notes

### Architecture Compliance

**Touch Target Minimum Size:**
- **WCAG 2.1 Level AA:** 44x44 CSS pixels (NFR14)
- **Apple HIG:** 44x44 points
- **Android Material:** 48x48 dp
- **Recommendation:** Use 44x44px minimum, 48x48px preferred

**Implementation Pattern:**
```typescript
// Button with minimum touch target
// app/components/ui/Button.tsx

interface ButtonProps {
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  // ... other props
}

export const Button = ({ size = 'md', ...props }: ButtonProps) => {
  const sizeClasses = {
    sm: 'min-h-[44px] min-w-[44px] px-4 text-sm', // Still meets 44px minimum
    md: 'min-h-[48px] min-w-[48px] px-6 text-base',
    lg: 'min-h-[56px] min-w-[56px] px-8 text-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-md font-medium',
        'focus-visible:outline focus-visible:outline-2',
        sizeClasses[size],
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

**Link Touch Target Extension:**
```typescript
// Extend tap area for small text links
// app/components/ui/Link.tsx

<a
  href={href}
  className={cn(
    'relative inline-block',
    'after:absolute after:inset-[-8px]', // Extend tap area
    'after:content-[""]',
  )}
>
  {children}
</a>

// Alternative: Use padding to increase tap area
<a
  href={href}
  className="inline-block py-3 px-2" // Ensures 44px+ height
>
  {children}
</a>
```

**Quantity Controls Pattern:**
```typescript
// app/components/cart/QuantitySelector.tsx

export function QuantitySelector({ quantity, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(quantity - 1)}
        aria-label="Decrease quantity"
        className="
          min-h-[44px] min-w-[44px]
          flex items-center justify-center
          rounded-md border border-gray-300
          hover:bg-gray-100
        "
      >
        <MinusIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      <span
        className="min-w-[44px] text-center text-lg font-medium"
        aria-live="polite"
      >
        {quantity}
      </span>

      <button
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
        className="
          min-h-[44px] min-w-[44px]
          flex items-center justify-center
          rounded-md border border-gray-300
          hover:bg-gray-100
        "
      >
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
```

**Close Button Pattern:**
```typescript
// app/components/ui/Dialog.tsx (or Radix Dialog wrapper)

<Dialog.Close
  aria-label="Close dialog"
  className="
    absolute top-4 right-4
    min-h-[44px] min-w-[44px]
    flex items-center justify-center
    rounded-full
    hover:bg-gray-100
    focus-visible:outline focus-visible:outline-2
  "
>
  <XIcon className="h-6 w-6" aria-hidden="true" />
</Dialog.Close>
```

**Form Input Pattern:**
```typescript
// Ensure inputs have adequate height

<label htmlFor="email" className="block mb-2">
  Email address
</label>
<input
  id="email"
  type="email"
  className="
    w-full
    min-h-[44px]
    px-4 py-3
    border border-gray-300 rounded-md
    text-base
  "
/>

// Clicking label should focus input (built-in HTML behavior)
```

### Testing Requirements

**Manual Testing Protocol:**

**Device Testing:**
- **iPhone SE (2nd gen):** Smallest modern iPhone (375x667)
- **iPhone 14 Pro:** Standard modern iPhone (393x852)
- **Pixel 7:** Standard Android (412x915)
- **iPad Mini:** Tablet testing (768x1024)

**Testing Procedure:**
1. Open site on physical device (not just DevTools)
2. Attempt to tap each interactive element
3. Note any buttons that are difficult to tap
4. Try tapping with thumb (larger target needed)
5. Test in portrait and landscape orientations
6. Verify spacing prevents mis-taps

**Measurement Tools:**
```typescript
// Browser DevTools measurement
// 1. Open DevTools (F12)
// 2. Select element
// 3. Check Computed styles for width/height
// 4. Verify >= 44px

// Automated measurement
test('button touch targets', async ({ page }) => {
  await page.goto('/');

  const buttons = await page.locator('button').all();

  for (const button of buttons) {
    const box = await button.boundingBox();

    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  }
});
```

**Visual Overlay Test:**
```typescript
// Add debug overlay to visualize touch targets
// tests/helpers/touch-target-overlay.ts

export async function showTouchTargetOverlay(page: Page) {
  await page.addStyleTag({
    content: `
      * {
        outline: 1px solid rgba(255, 0, 0, 0.3) !important;
      }

      button, a, input, [role="button"] {
        outline: 2px solid rgba(0, 255, 0, 0.8) !important;
        position: relative;
      }

      button::after, a::after {
        content: attr(aria-label);
        position: absolute;
        bottom: 100%;
        left: 0;
        background: black;
        color: white;
        font-size: 10px;
        padding: 2px 4px;
        white-space: nowrap;
        pointer-events: none;
      }
    `,
  });
}
```

**Automated Testing:**
```typescript
// tests/e2e/touch-targets.spec.ts
import { test, expect, devices } from '@playwright/test';

const mobileDevices = [
  devices['iPhone SE'],
  devices['Pixel 7'],
];

for (const device of mobileDevices) {
  test.describe(`Touch targets - ${device.name}`, () => {
    test.use({ ...device });

    test('all buttons meet minimum size', async ({ page }) => {
      await page.goto('/');

      const buttons = await page.locator('button, [role="button"]').all();

      for (const button of buttons) {
        const box = await button.boundingBox();

        if (box && await button.isVisible()) {
          expect(box.width, `Button width: ${await button.textContent()}`).toBeGreaterThanOrEqual(44);
          expect(box.height, `Button height: ${await button.textContent()}`).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('all links have adequate tap area', async ({ page }) => {
      await page.goto('/');

      const links = await page.locator('a').all();

      for (const link of links) {
        const box = await link.boundingBox();

        if (box && await link.isVisible()) {
          // Links should have at least 44px tap height
          expect(box.height, `Link height: ${await link.textContent()}`).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('spacing between interactive elements', async ({ page }) => {
      await page.goto('/');

      // Check quantity controls spacing
      const minusBtn = page.locator('[aria-label*="Decrease"]').first();
      const plusBtn = page.locator('[aria-label*="Increase"]').first();

      if (await minusBtn.isVisible() && await plusBtn.isVisible()) {
        const minusBox = await minusBtn.boundingBox();
        const plusBox = await plusBtn.boundingBox();

        if (minusBox && plusBox) {
          // At least 8px spacing between buttons
          const spacing = plusBox.x - (minusBox.x + minusBox.width);
          expect(spacing).toBeGreaterThanOrEqual(8);
        }
      }
    });
  });
}
```

### Project Structure Notes

**Files to Inspect:**
- `app/components/ui/Button.tsx` - Base button component with size variants
- `app/components/cart/QuantitySelector.tsx` - Quantity +/- controls
- `app/components/cart/CartDrawer.tsx` - Cart drawer close button
- `app/components/product/TextureReveal.tsx` - Texture reveal close button
- `app/components/layout/Header.tsx` - Mobile navigation links
- `app/components/layout/Footer.tsx` - Footer link spacing
- `app/routes/wholesale/_index.tsx` - Wholesale form inputs

**Files to Create/Modify:**
- Update button variants in `app/components/ui/Button.tsx`
- Create `app/components/ui/Link.tsx` if not exists (with tap area extension)
- Update quantity selector component for larger touch targets
- Add mobile-specific spacing utilities to Tailwind config
- Create touch target testing utilities

**Tailwind Configuration:**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      minHeight: {
        'touch': '44px', // Minimum touch target
        'touch-comfortable': '48px', // Comfortable touch target
      },
      minWidth: {
        'touch': '44px',
        'touch-comfortable': '48px',
      },
      spacing: {
        'touch-safe': '8px', // Minimum spacing between touch targets
      },
    },
  },
};

// Usage
<button className="min-h-touch min-w-touch">Click me</button>
```

### References

- [Source: prd.md#Accessibility] NFR14: Touch targets - Minimum 44x44px on mobile
- [Source: epics.md#Epic 9 Story 9.5] Verification includes: iPhone SE, Pixel 7
- [Source: architecture.md#Component File Structure] Button component in `/components/ui/`

### Common Touch Target Issues and Solutions

**Issue 1: Icon-only buttons too small**
- **Problem:** Icon (16px) inside button = small tap area
- **Solution:** Add padding to button, ensure 44x44px minimum
- **Example:**
  ```tsx
  <button className="min-h-[44px] min-w-[44px] p-3">
    <Icon className="h-4 w-4" />
  </button>
  ```

**Issue 2: Text links in body content**
- **Problem:** Single line of text (20px) < 44px height
- **Solution:** Add vertical padding to link
- **Example:**
  ```tsx
  <a className="inline-block py-3">Learn more</a>
  ```

**Issue 3: Quantity controls too close together**
- **Problem:** Risk of tapping wrong button
- **Solution:** Add gap between buttons (min 8px)
- **Example:**
  ```tsx
  <div className="flex gap-2">
    <button>-</button>
    <span>{quantity}</span>
    <button>+</button>
  </div>
  ```

**Issue 4: Close buttons (X) too small**
- **Problem:** X icon (12px) difficult to tap
- **Solution:** Increase button size, use larger tap area
- **Example:**
  ```tsx
  <button className="min-h-[44px] min-w-[44px] flex items-center justify-center">
    <XIcon className="h-6 w-6" />
  </button>
  ```

**Issue 5: Form inputs too short**
- **Problem:** Input height < 44px
- **Solution:** Increase padding, set min-height
- **Example:**
  ```tsx
  <input className="min-h-[44px] py-3 px-4" />
  ```

### Mobile-First Development Guidelines

**Design Principle:**
> "Design for thumb, test with thumb."

**Thumb Zones on Mobile:**
- **Easy to reach:** Bottom third of screen, center
- **Harder to reach:** Top corners, far edges
- **Primary actions:** Should be in easy-to-reach zones

**Mobile-Specific Considerations:**
- Touch targets should be larger on mobile than desktop
- Use responsive design to adjust button sizes
- Test in both portrait and landscape
- Consider one-handed use (bottom navigation)

**Responsive Touch Target Pattern:**
```typescript
<button
  className="
    min-h-[44px] min-w-[44px]
    md:min-h-[40px] md:min-w-[40px]
  "
>
  {/* Larger on mobile, can be smaller on desktop (mouse precision) */}
</button>
```

### Performance Considerations

- Larger touch targets don't impact performance
- Padding/min-height are CSS properties (no JS overhead)
- Test on actual devices, not just DevTools emulation
- Consider touch target size in initial design (not retrofit)

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent_
