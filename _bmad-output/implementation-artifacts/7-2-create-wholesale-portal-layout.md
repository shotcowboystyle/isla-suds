# Story 7.2: Create Wholesale Portal Layout

Status: ready-for-dev

## Story

As a **wholesale partner**,
I want **a clean, efficient portal interface**,
so that **I can complete tasks quickly without unnecessary distractions**.

## Acceptance Criteria

**Given** I am logged into the wholesale portal
**When** any `/wholesale/*` page loads
**Then** the layout includes:

- Minimal header with logo and logout
- No Lenis smooth scroll (native only)
- No parallax or fancy animations
- Clean, functional typography
- Partner name displayed in header
  **And** layout is consistent across all wholesale pages
  **And** layout is mobile-friendly for on-the-go ordering
  **And** all elements are keyboard-accessible

## Tasks / Subtasks

- [ ] Create wholesale layout component (AC: 1)
  - [ ] Build minimal header with logo
  - [ ] Add logout button with friendly confirmation
  - [ ] Display partner name from customer data
- [ ] Disable Lenis smooth scroll for `/wholesale/*` routes (AC: 2)
  - [ ] Ensure native browser scroll only
  - [ ] Remove Lenis initialization on wholesale routes
- [ ] Remove animations for wholesale routes (AC: 3)
  - [ ] No Framer Motion imports
  - [ ] No parallax effects
  - [ ] Clean, instant transitions
- [ ] Apply clean typography system (AC: 4)
  - [ ] Use design tokens from `app/styles/`
  - [ ] Functional, readable type scale
  - [ ] No decorative fonts
- [ ] Test mobile responsiveness (AC: 5)
  - [ ] Verify header on mobile devices
  - [ ] Ensure touch-friendly navigation
  - [ ] Test on-the-go ordering experience
- [ ] Verify keyboard accessibility (AC: 6)
  - [ ] Tab navigation works
  - [ ] Focus states visible
  - [ ] Logout accessible via keyboard

## Dev Notes

### Critical Architecture Requirements

**THE FIVE COMMANDMENTS #5: B2B ≠ B2C**

**Dual-Audience Architecture - Wholesale Portal:**

| Aspect | B2B (Wholesale) Implementation |
|--------|-------------------------------|
| Layout | Minimal, efficient (NOT immersive) |
| Scroll | Native browser scroll (NO Lenis) |
| Animations | Disabled (NO Framer Motion) |
| Tone | Transactional, fast (NOT exploratory) |
| Navigation | Direct dashboard access (NOT constellation) |

**Critical Don'ts:**
- ❌ NO Lenis smooth scroll (causes performance issues, unnecessary)
- ❌ NO Framer Motion dynamic imports
- ❌ NO parallax or fancy animations
- ❌ NO shared components with B2C except `ui/` primitives
- ❌ NO decorative elements that slow task completion

**Critical Dos:**
- ✅ Native browser scroll only
- ✅ Clean, functional typography
- ✅ Fast load times (<200ms paint)
- ✅ Mobile-friendly for on-the-go ordering
- ✅ Keyboard accessible throughout

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Layout | React Router 7 parent route layout |
| Scroll | Native (Lenis NOT initialized) |
| Typography | Design tokens (--text-primary, --text-muted) |
| Styling | Tailwind CSS with cn() utility |
| Components | ui/ primitives only (Button, etc.) |

### File Structure

```
app/
  routes/
    wholesale.tsx                 # Parent layout route (NEW)
    wholesale._index.tsx          # Dashboard (Story 7.4+)
    wholesale.login.tsx           # Login (Story 7.3)
  components/
    wholesale/
      WholesaleHeader.tsx         # Minimal header (NEW)
      WholesaleLayout.tsx         # Layout wrapper (NEW - or inline in route)
  content/
    wholesale.ts                  # B2B copy
```

### Layout Implementation Pattern

**React Router 7 Nested Routing:**

```typescript
// app/routes/wholesale.tsx (Parent Layout)
export default function WholesaleLayout() {
  const customer = useCustomer(); // Get B2B customer data

  return (
    <div className={cn("min-h-screen bg-canvas-base")}>
      <WholesaleHeader customerName={customer?.firstName} />
      <main className={cn("container mx-auto px-4 py-8")}>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}
```

**Loader Pattern:**
- Use loader to verify B2B authentication
- Redirect to `/wholesale/login` if not authenticated
- Pass customer data to layout

### Smooth Scroll Disabling

**Root Layout Check (app/root.tsx):**
- Lenis is initialized in `app/root.tsx` for B2C routes
- MUST detect `/wholesale/*` routes and skip Lenis initialization
- Use `useLocation()` to check pathname

```typescript
// In app/root.tsx useEffect for Lenis
const location = useLocation();
const isWholesale = location.pathname.startsWith('/wholesale');

if (!isWholesale && !isMobile) {
  // Initialize Lenis for B2C only
}
```

### Typography System

Use existing design tokens (no new tokens needed):

```css
/* Clean, functional wholesale typography */
--text-primary: #2c2416;      /* Body text */
--text-muted: #8c8578;         /* Secondary text */
--canvas-base: #faf7f2;        /* Background */
--canvas-elevated: #f5f0e8;    /* Cards */
```

**Font usage:**
- Headers: Clean, readable (no decorative fonts)
- Body: Comfortable for quick reading
- Scale: Standard, not fluid (wholesale is functional)

### Header Component Requirements

**Minimal Header:**
- Logo (link to /wholesale dashboard)
- Partner name display: "Welcome, {firstName}"
- Logout button with confirmation dialog

**Logout Pattern:**
```typescript
// Use React Router action for logout
// Clear session, redirect to /wholesale/login
```

### Accessibility Requirements (WCAG 2.1 AA)

- All interactive elements keyboard navigable
- Focus states clearly visible
- Touch targets minimum 44x44px
- Color contrast 4.5:1 for text
- Skip to content link (optional but recommended)

### Testing Requirements

**Integration Tests:**
- Layout renders on all `/wholesale/*` routes
- Lenis NOT initialized on wholesale routes
- Partner name displays correctly
- Logout clears session and redirects
- Mobile responsive (header, navigation)
- Keyboard navigation works

**Visual Tests:**
- Screenshot comparison: wholesale vs B2C layout
- Verify NO animations present
- Mobile layout comparison

**Test Location:**
- `tests/integration/wholesale-layout.test.ts`
- `tests/visual/wholesale-layout.visual.ts`

### Project Context Critical Rules

1. **Bundle Budget:** Wholesale routes should be LIGHTER than B2C (no Framer Motion)
2. **Performance:** <200KB bundle, NO dynamic animation imports
3. **No Over-Engineering:** Simple layout, no premature abstractions
4. **Accessibility:** Keyboard navigation MUST work throughout
5. **Mobile-First:** Wholesale partners order on-the-go

### Anti-Patterns to Avoid

- ❌ Don't share B2C layout components (Header, Footer)
- ❌ Don't import Framer Motion (static imports OR dynamic)
- ❌ Don't add decorative elements (focus on task completion)
- ❌ Don't use complex state management (simple loader data)
- ❌ Don't create abstractions for single-use components

### References

- [Source: project-context.md#Dual-Audience Architecture] - B2B vs B2C table
- [Source: project-context.md#Smooth Scroll (Lenis)] - Lenis disabling pattern
- [Source: project-context.md#THE FIVE COMMANDMENTS] - B2B ≠ B2C rule
- [Source: project-context.md#Component Organization] - wholesale/ directory
- [Source: CLAUDE.md#Architecture] - React Router nested routing

### Dependency: Story 7.1

**Blocker:** This story requires Story 7.1 (B2B authentication) to be completed first.
- Need authenticated B2B customer context
- Need session verification in layout loader
- Need redirect logic for unauthenticated users

**Validation:** Verify Story 7.1 tests passing before implementation.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- B2B vs B2C architectural separation thoroughly documented
- Lenis smooth scroll disabling strategy provided
- Typography and design token usage clarified
- Mobile-first approach emphasized for wholesale partners
- Accessibility requirements aligned with WCAG 2.1 AA
- React Router 7 nested routing pattern documented
- Testing strategy defined (integration + visual tests)
- Anti-patterns highlighted to prevent over-engineering

**Layout foundation** - Establishes clean, efficient interface for all wholesale features.

### File List

Files to create:
- app/routes/wholesale.tsx (parent layout route)
- app/components/wholesale/WholesaleHeader.tsx
- tests/integration/wholesale-layout.test.ts
- tests/visual/wholesale-layout.visual.ts

Files to modify:
- app/root.tsx (disable Lenis for /wholesale/* routes)
- app/content/wholesale.ts (add header copy, logout confirmation)
