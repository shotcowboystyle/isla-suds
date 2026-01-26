---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
workflowType: 'epics-and-stories'
project_name: 'isla-suds'
user_name: 'Bubbles'
date: '2026-01-24'
author: 'Claude'
status: 'complete'
totalEpics: 9
totalStories: 66
---

# Isla Suds - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Isla Suds, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Product Discovery & Exploration (FR1-FR9)**
- FR1: Visitors can view all 4 products in a constellation layout on the home page
- FR2: Visitors can explore products in any order (non-linear discovery)
- FR3: Visitors can trigger a texture reveal by hovering (desktop) or tapping (mobile) on a product
- FR4: Visitors can view macro texture photography within the reveal state
- FR5: Visitors can read scent narrative copy for each product within the reveal state
- FR6: Visitors can close/dismiss a texture reveal and return to constellation view
- FR7: Visitors can discover story fragments scattered throughout the page during scroll
- FR8: Visitors can view a collection prompt after exploring 2+ products
- FR9: Visitors can add the variety pack directly from the collection prompt

**Product Information (FR10-FR12)**
- FR10: Visitors can view product name, price, and brief description for each product
- FR11: Visitors can view the variety pack bundle as a distinct purchasable option
- FR12: Visitors can understand the "all 4 soaps" value proposition of the bundle

**Cart & Checkout B2C (FR13-FR22)**
- FR13: Visitors can add individual products to cart via a button within the texture reveal state
- FR14: Visitors can add the variety pack bundle to cart
- FR15: Visitors can view cart contents via a slide-out cart drawer
- FR16: Visitors can modify cart quantities within the drawer
- FR17: Visitors can remove items from cart
- FR18: Visitors can proceed to Shopify checkout from cart drawer
- FR19: Visitors can complete purchase via Shopify-managed checkout
- FR20: Customers can receive order confirmation email after purchase
- FR21: Returning visitors can view their previously added cart items (cart persists across sessions)
- FR22: Visitors can retry payment after a failed attempt without re-entering cart items

**Wholesale Portal B2B (FR23-FR29)**
- FR23: Wholesale partners can log in to a dedicated wholesale portal
- FR24: Wholesale partners can view their last order summary on the dashboard
- FR25: Wholesale partners can reorder their last order with one click
- FR26: Wholesale partners can view a personalized partner acknowledgment message
- FR27: Wholesale partners can view their order history
- FR28: Wholesale partners can request invoices (manual fulfillment for MVP)
- FR29: Wholesale partners receive wholesale pricing automatically when logged in

**Attribution & Analytics (FR30-FR36)**
- FR30: Visitors can enter a booth attribution code at checkout (e.g., "FARMSTAND")
- FR31: Visitors can answer "How did you find us?" survey at checkout
- FR32: Visitors can access a shareable link to send to friends
- FR33: System can track share link clicks and conversions
- FR34: System can track texture reveal events per session
- FR35: System can track products explored per session
- FR36: System can track time on site

**Post-Purchase Communication (FR37-FR40)**
- FR37: Customers can receive a Day 3 post-purchase email from founder
- FR38: Customers can respond to "How was your first shower?" question in email
- FR39: Customers can select emotional response options (e.g., "I slept better")
- FR40: Customers can respond to story recall question in survey

**Content & Navigation (FR41-FR48)**
- FR41: Visitors can view the hero section with brand logo and tagline
- FR42: Visitors can scroll to discover the full page experience
- FR43: Visitors can access sticky header after scrolling past hero
- FR44: Visitors can access cart from sticky header
- FR45: Visitors can navigate to About page
- FR46: Visitors can navigate to Contact page
- FR47: Visitors can navigate to Wholesale portal login
- FR48: Visitors can view footer with navigation links

**Accessibility & Preferences (FR49-FR51)**
- FR49: Visitors can navigate entire site via keyboard
- FR50: Visitors can use screen readers to access all content
- FR51: Visitors with reduced motion preferences see simplified animations

### Non-Functional Requirements

**Performance (NFR1-NFR7)**
- NFR1: Largest Contentful Paint <2.5s
- NFR2: First Input Delay <100ms
- NFR3: Cumulative Layout Shift <0.1
- NFR4: Texture reveal response <100ms after interaction
- NFR5: Cart drawer open <200ms
- NFR6: Total JS bundle <200KB gzipped
- NFR7: Time to Interactive <3.5s on 4G

**Accessibility (NFR8-NFR14)**
- NFR8: WCAG compliance 2.1 AA
- NFR9: Keyboard navigation 100% of interactive elements
- NFR10: Screen reader compatibility - All content accessible
- NFR11: Focus indicators visible on all focusable elements
- NFR12: Color contrast 4.5:1 minimum for text
- NFR13: Reduced motion - animations simplified when prefers-reduced-motion
- NFR14: Touch targets minimum 44x44px on mobile

**Integration (NFR15-NFR18)**
- NFR15: Shopify Storefront API must support all cart/checkout operations
- NFR16: Shopify B2B app must integrate for wholesale pricing/portal
- NFR17: Analytics events must fire reliably for all tracked interactions
- NFR18: Image CDN must serve optimized images (WebP/AVIF with fallbacks)

**Reliability (NFR19-NFR21)**
- NFR19: Frontend uptime 99.5% (Shopify Oxygen SLA)
- NFR20: Cart persistence survive browser close/reopen
- NFR21: Graceful degradation - if Lenis or Framer Motion fails, core commerce works

**UX Tone & Brand Consistency (NFR22-NFR27)**
- NFR22: Error messaging tone warm, non-accusatory ("Your cart is safe - let's try again")
- NFR23: Loading states subtle, brand-aligned (no harsh spinners)
- NFR24: Empty cart state friendly message guiding user back to products
- NFR25: System feedback confirmation feels personal, not transactional
- NFR26: GDPR compliance (Privacy policy, explicit email opt-in, right to delete)
- NFR27: Order confirmation brand-warm messaging ("Your soap is on its way")

### Additional Requirements

**From Architecture Document:**
- Shopify Hydrogen skeleton template (NOT demo-store) is the project foundation
- Post-initialization setup sequence includes: design tokens, CVA, Radix UI, Lenis, Framer Motion (dynamic import), fluid typography, GraphQL codegen, Vitest, Playwright, Lighthouse CI
- Zustand (~1KB) for UI state management (exploration tracking, texture reveal state, cart drawer state)
- Intersection Observer-based image preloading for texture reveals
- Cart ID persistence in localStorage with Shopify cart recovery
- Error boundary architecture: route-level + component-level (TextureReveal, CartDrawer, AnimationLayer)
- B2B portal routing via path prefix `/wholesale/*` with dedicated minimal layout
- Performance verification in CI pipeline (Lighthouse CI + custom Performance API timing)
- Bundle budget: Lenis ~3KB, Framer Motion ~30-40KB (dynamic), Radix ~15-20KB, App code ~120-140KB

**From UX Design Document:**
- Constellation layout: all 4 products visible, user-driven exploration (not linear scroll)
- Lenis smooth-scroll (desktop only) + native scroll with CSS scroll-snap (mobile)
- Fluid typography using CSS clamp() across 4 sizes (fluid-small, fluid-body, fluid-heading, fluid-display)
- Design token system: canvas tokens (cream background), text tokens (rich brown), accent tokens (teal from logo)
- CVA for type-safe component variants (ProductCard states: idle, hovered, selected)
- Framer Motion for element animations triggered via Intersection Observer
- Radix primitives for Dialog (cart drawer) and NavigationMenu (accessibility-first)
- Muted canvas palette (#FAF7F2) with products as only vibrant color elements
- Mobile-first, desktop-enhanced responsive approach
- prefers-reduced-motion support required for all animations
- Anti-patterns: no pop-ups, no urgency tactics, no dark patterns, no Lenis on mobile

**From Party Mode Collaboration:**
- Epic 1 needs verification gates (design tokens, Radix accessibility, Framer Motion bundle)
- Accessibility criteria embedded in every story, not just Epic 9
- About page is fallback for direct traffic, not primary story vehicle
- Contact page serves "need help?" flow in checkout context
- Day 3 survey link must be included in confirmation email template
- Smoke test story required at end of Epic 4 (full journey verification)
- Epic 8 (Analytics) can be deprioritized if timeline is tight
- Epic 9 is validation/audit focused, not implementation

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 2 | Constellation layout |
| FR2 | Epic 2 | Non-linear exploration |
| FR3 | Epic 3 | Texture reveal hover/tap |
| FR4 | Epic 3 | Macro texture photography |
| FR5 | Epic 3 | Scent narrative copy |
| FR6 | Epic 3 | Close/dismiss texture reveal |
| FR7 | Epic 4 | Story fragments during scroll |
| FR8 | Epic 4 | Collection prompt after 2+ products |
| FR9 | Epic 4 | Add variety pack from prompt |
| FR10 | Epic 3 | Product name, price, description |
| FR11 | Epic 3 | Variety pack bundle display |
| FR12 | Epic 3 | Bundle value proposition |
| FR13 | Epic 5 | Add individual products to cart |
| FR14 | Epic 5 | Add variety pack to cart |
| FR15 | Epic 5 | Cart drawer |
| FR16 | Epic 5 | Modify cart quantities |
| FR17 | Epic 5 | Remove cart items |
| FR18 | Epic 5 | Proceed to checkout |
| FR19 | Epic 6 | Shopify checkout |
| FR20 | Epic 6 | Order confirmation email |
| FR21 | Epic 5 | Cart persistence |
| FR22 | Epic 6 | Payment retry |
| FR23 | Epic 7 | Wholesale login |
| FR24 | Epic 7 | Last order dashboard |
| FR25 | Epic 7 | One-click reorder |
| FR26 | Epic 7 | Partner acknowledgment |
| FR27 | Epic 7 | Order history |
| FR28 | Epic 7 | Invoice request |
| FR29 | Epic 7 | Wholesale pricing |
| FR30 | Epic 6 | Booth attribution code |
| FR31 | Epic 6 | Checkout survey |
| FR32 | Epic 8 | Shareable link |
| FR33 | Epic 8 | Share link tracking |
| FR34 | Epic 8 | Texture reveal tracking |
| FR35 | Epic 8 | Products explored tracking |
| FR36 | Epic 8 | Time on site tracking |
| FR37-40 | Manual | Post-purchase (survey link in Epic 6) |
| FR41 | Epic 2 | Hero section |
| FR42 | Epic 2 | Scroll experience |
| FR43 | Epic 2 | Sticky header |
| FR44 | Epic 5 | Cart from header |
| FR45 | Epic 4 | About page (fallback) |
| FR46 | Epic 6 | Contact page |
| FR47 | Epic 4 | Wholesale portal link |
| FR48 | Epic 4 | Footer navigation |
| FR49 | Epic 9 | Keyboard navigation (validation) |
| FR50 | Epic 9 | Screen reader support (validation) |
| FR51 | Epic 9 | Reduced motion (validation) |

## Epic List

| Epic | Title | FRs | Stories |
|------|-------|-----|---------|
| 1 | Project Foundation & Design System | 0 | 10 |
| 2 | Landing & Constellation Layout | 5 | 5 |
| 3 | Texture Reveals & Product Discovery | 7 | 6 |
| 4 | Story Moments & Site Navigation | 6 | 7 |
| 5 | Cart Experience | 8 | 10 |
| 6 | Checkout & Communication | 6 | 7 |
| 7 | Wholesale Partner Portal | 7 | 9 |
| 8 | Analytics & Attribution | 5 | 6 |
| 9 | Accessibility Validation | 3 | 6 |
| **Total** | | **47 + 4 manual** | **66** |

## Epic Dependencies

```
Epic 1 (Foundation)
    ↓
Epic 2 (Landing) → Epic 3 (Texture Reveals) → Epic 4 (Story/Nav)
                                                    ↓
                                            Epic 5 (Cart) → Epic 6 (Checkout)
    ↓
Epic 7 (Wholesale) ─────────────────────────────────┘
    ↓
Epic 8 (Analytics) ← can run parallel after Epic 3
    ↓
Epic 9 (Accessibility) ← validation after Epics 2-7
```

---

## Epic 1: Project Foundation & Design System

**Goal:** Establish the development foundation with verification gates ensuring all tooling, design tokens, and component architecture meet quality standards before building features.

**User Outcome:** Development team can build consistent, performant, accessible components with confidence that the foundation is solid.

**FRs covered:** None directly (infrastructure enables all)
**NFRs addressed:** NFR6, NFR8-14, NFR19-21

---

### Story 1.1: Initialize Hydrogen Project with Skeleton Template

As a **developer**,
I want **a Shopify Hydrogen project initialized with the skeleton template and TypeScript**,
So that **I have a clean foundation without opinionated UI that would conflict with our custom immersive experience**.

**Acceptance Criteria:**

**Given** no existing Hydrogen project
**When** I run the initialization command with skeleton template, TypeScript, and Tailwind options
**Then** a new Hydrogen project is created with:
- TypeScript configuration
- Tailwind CSS via PostCSS
- Vite 6 + React Router 7.x
- Shopify Storefront API client configured
- `npm run dev` starts successfully in mock shop mode
**And** the project structure follows Hydrogen conventions (`/app/routes`, `/app/components`, `/app/lib`)

---

### Story 1.2: Implement Design Token System

As a **developer**,
I want **a CSS custom property-based design token system**,
So that **all components use consistent colors, spacing, and typography from a single source of truth**.

**Acceptance Criteria:**

**Given** the initialized Hydrogen project
**When** I create the design token system
**Then** `app/styles/tokens.css` exists with:
- Canvas tokens: `--canvas-base`, `--canvas-elevated` (cream tones)
- Text tokens: `--text-primary`, `--text-muted` (brown tones)
- Accent tokens: `--accent-primary`, `--accent-hover` (teal from logo)
- Spacing scale: `--space-xs` through `--space-2xl`
- Animation tokens: `--ease-out-expo`, `--duration-reveal`, `--duration-micro`
**And** Tailwind config extends theme with token references
**And** tokens render correctly in a test component

---

### Story 1.3: Configure Fluid Typography Scale

As a **developer**,
I want **a fluid typography system using CSS clamp()**,
So that **text scales smoothly from 320px mobile to 2560px ultrawide without breakpoints**.

**Acceptance Criteria:**

**Given** the design token system is in place
**When** I configure fluid typography in Tailwind
**Then** Tailwind config includes fontSize entries:
- `fluid-small`: scales 0.75rem → 0.875rem
- `fluid-body`: scales 1rem → 1.25rem
- `fluid-heading`: scales 1.5rem → 2.5rem
- `fluid-display`: scales 2.5rem → 6rem
**And** all sizes use `clamp()` with viewport-relative middle value
**And** a test page renders readable text at 320px, 768px, 1440px, and 2560px viewports

---

### Story 1.4: Add CVA for Component Variants

As a **developer**,
I want **Class Variance Authority (CVA) configured for type-safe component variants**,
So that **component states are self-documenting and TypeScript-enforced**.

**Acceptance Criteria:**

**Given** the Tailwind configuration is complete
**When** I add CVA to the project
**Then** CVA is installed and configured
**And** `app/lib/variants.ts` exists with example variant (Button)
**And** TypeScript enforces valid variant combinations
**And** bundle contribution is ≤2KB gzipped

---

### Story 1.5: Add Radix UI Primitives with Accessibility Verification

As a **developer**,
I want **Radix UI primitives (Dialog, NavigationMenu) installed and verified for accessibility**,
So that **complex interactions are accessible by default without custom ARIA implementation**.

**Acceptance Criteria:**

**Given** the project has CVA configured
**When** I add Radix UI primitives
**Then** `@radix-ui/react-dialog` and `@radix-ui/react-navigation-menu` are installed
**And** wrapper components exist in `app/components/ui/`
**And** Dialog component passes axe-core accessibility audit
**And** Dialog traps focus and closes on Escape key
**And** bundle contribution is ≤20KB gzipped

---

### Story 1.6: Add Lenis Smooth Scroll (Desktop Only)

As a **developer**,
I want **Lenis smooth scroll configured for desktop with native scroll on mobile**,
So that **desktop users experience premium scroll physics while mobile users retain native momentum**.

**Acceptance Criteria:**

**Given** the project has Radix primitives
**When** I add Lenis smooth scroll
**Then** `app/lib/scroll.ts` exports `initLenis()` and `destroyLenis()` utilities
**And** Lenis initializes only when `window.matchMedia('(min-width: 1024px)')` matches
**And** mobile uses native scroll behavior
**And** bundle contribution is ≤3KB gzipped
**And** graceful fallback if Lenis fails to load (native scroll works)

---

### Story 1.7: Add Framer Motion with Dynamic Import

As a **developer**,
I want **Framer Motion dynamically imported to protect the bundle budget**,
So that **animations don't block first meaningful paint and bundle stays under 200KB**.

**Acceptance Criteria:**

**Given** the project has Lenis configured
**When** I add Framer Motion with dynamic import
**Then** Framer Motion is installed but NOT in main bundle
**And** animation components use `React.lazy()` or equivalent dynamic import
**And** a test animation component renders after hydration
**And** initial bundle (before Framer loads) is verified ≤160KB gzipped
**And** graceful fallback renders static content if Framer fails to load

---

### Story 1.8: Configure Zustand Store Structure

As a **developer**,
I want **Zustand configured for UI state management**,
So that **exploration tracking, texture reveal state, and cart drawer visibility are managed consistently**.

**Acceptance Criteria:**

**Given** the project has Framer Motion configured
**When** I configure Zustand
**Then** `app/stores/exploration.ts` exports an exploration store with:
- `productsExplored: Set<string>`
- `textureRevealsTriggered: number`
- `storyMomentShown: boolean`
- `sessionStartTime: number`
- `cartDrawerOpen: boolean`
**And** selector hooks exist in `app/hooks/use-exploration-state.ts`
**And** bundle contribution is ≤1KB gzipped

---

### Story 1.9: Implement Error Boundary Architecture

As a **developer**,
I want **error boundaries at route and component levels**,
So that **failures are contained and users see warm error messages instead of crashes**.

**Acceptance Criteria:**

**Given** the Zustand store is configured
**When** I implement error boundaries
**Then** `app/components/errors/RouteErrorBoundary.tsx` exists for page-level errors
**And** `app/components/errors/ComponentErrorBoundary.tsx` exists for feature isolation
**And** `app/content/errors.ts` contains warm error messages:
- Route error: "Something's not quite right. Your cart is safe—let's try again."
- Cart drawer: "Having trouble loading your cart. [View cart page →]"
**And** error boundaries log errors but display friendly UI
**And** commerce flow works even when TextureReveal or AnimationLayer fails

---

### Story 1.10: Configure CI/CD Pipeline with Quality Gates

As a **developer**,
I want **CI/CD configured with Lighthouse, Vitest, and Playwright**,
So that **performance regressions, test failures, and accessibility issues are caught before merge**.

**Acceptance Criteria:**

**Given** the error boundaries are implemented
**When** I configure the CI/CD pipeline
**Then** `.github/workflows/ci.yml` runs on every PR:
- TypeScript type checking
- ESLint with import order rules
- Vitest unit tests
- Lighthouse CI with Core Web Vitals thresholds (LCP <2.5s, FID <100ms, CLS <0.1)
- axe-core accessibility checks
**And** `.github/workflows/deploy.yml` deploys to Shopify Oxygen on main branch
**And** Playwright is configured in `playwright.config.ts` for future E2E tests
**And** `size-limit` or equivalent verifies bundle ≤200KB gzipped

---

## Epic 2: Landing & Constellation Layout

**Goal:** Visitors land on an immersive hero, scroll into the constellation layout, and can explore products in any order with a sticky header for navigation.

**User Outcome:** Sarah arrives, exhales, and sees all 4 soaps floating in space—ready to explore at her pace.

**FRs covered:** FR1, FR2, FR41, FR42, FR43 (5 FRs)
**NFRs addressed:** NFR1-3, NFR7

---

### Story 2.1: Create Hero Section with Brand Identity

As a **visitor**,
I want **to land on an immersive hero with the Isla Suds brand**,
So that **I immediately feel the warmth and authenticity of the brand before scrolling**.

**Acceptance Criteria:**

**Given** I navigate to the home page
**When** the page loads
**Then** I see a full-bleed hero section with:
- Brand logo prominently displayed
- Tagline or brand essence message
- Warm cream canvas background (#FAF7F2)
- Hero imagery (placeholder until real assets)
**And** the hero uses fluid typography (`fluid-display` for headline)
**And** LCP is <2.5s on mobile 4G connection
**And** hero is keyboard-focusable with visible focus indicator

**FRs addressed:** FR41

---

### Story 2.2: Implement Scroll Experience with Lenis/Native Hybrid

As a **visitor**,
I want **smooth, premium scrolling on desktop and native momentum on mobile**,
So that **the scroll feels intentional and unhurried regardless of my device**.

**Acceptance Criteria:**

**Given** I am on the home page
**When** I scroll past the hero section
**Then** on desktop (≥1024px): Lenis smooth scroll provides fluid deceleration
**And** on mobile (<1024px): native scroll with CSS scroll-snap at key sections
**And** scroll-linked animations trigger via Intersection Observer (not scroll listeners)
**And** CLS remains <0.1 during scroll
**And** if Lenis fails to load, native scroll works without errors

**FRs addressed:** FR42

---

### Story 2.3: Build Constellation Grid Layout

As a **visitor**,
I want **to see all 4 soap products arranged in an organic constellation**,
So that **I can explore them in any order like at the farmers market booth**.

**Acceptance Criteria:**

**Given** I scroll past the hero section
**When** the constellation section enters the viewport
**Then** I see all 4 product cards arranged in:
- Organic, non-grid layout with subtle rotations (desktop)
- 2-column grid without rotations (mobile)
**And** products have subtle float/hover animations on desktop
**And** each product card shows product image (placeholder until Epic 3)
**And** layout is fluid from 320px to 2560px
**And** all product cards are keyboard-navigable with Tab key
**And** focus order follows visual flow

**FRs addressed:** FR1

---

### Story 2.4: Enable Non-Linear Product Exploration

As a **visitor**,
I want **to explore products in any order by focusing on them**,
So that **I have agency over my discovery journey like at the booth**.

**Acceptance Criteria:**

**Given** I am viewing the constellation
**When** I hover (desktop) or tap (mobile) on a product card
**Then** that product enters a "focused" state with:
- Subtle scale increase (1.02x)
- Elevated shadow
- Other products slightly dim
**And** I can move focus to any other product freely
**And** clicking/tapping elsewhere returns all products to default state
**And** keyboard users can focus products with Tab and activate with Enter/Space
**And** Zustand store tracks which products have been explored

**FRs addressed:** FR2

---

### Story 2.5: Implement Sticky Header with Scroll Trigger

As a **visitor**,
I want **a minimal header to appear after scrolling past the hero**,
So that **I can always access navigation and cart without scrolling back up**.

**Acceptance Criteria:**

**Given** I am on the home page
**When** I scroll past the hero section (hero exits viewport)
**Then** a sticky header appears with:
- Brand logo (small)
- Cart icon (placeholder, functionality in Epic 5)
- Hamburger menu icon (mobile)
**And** header uses subtle fade-in animation
**And** header has warm canvas background with slight transparency
**And** header is accessible: all elements keyboard-focusable
**And** header respects `prefers-reduced-motion` (no animation if set)
**And** when I scroll back to hero, header fades out

**FRs addressed:** FR43

---

## Epic 3: Texture Reveals & Product Discovery

**Goal:** Visitors can trigger texture reveals, experience macro photography, read scent narratives, and understand each product's value—including the variety pack bundle.

**User Outcome:** Sarah hovers on the purple soap. Lavender buds fill her screen. *"Close your eyes. A field at dusk."* She wants to touch it.

**FRs covered:** FR3, FR4, FR5, FR6, FR10, FR11, FR12 (7 FRs)
**NFRs addressed:** NFR4 (<100ms texture reveal), NFR18

**Note:** This is the **core conversion mechanism**. The <100ms texture reveal is a performance contract.

---

### Story 3.1: Implement Image Preloading with Intersection Observer

As a **developer**,
I want **texture macro images preloaded when the constellation enters viewport**,
So that **texture reveals are instant (<100ms) because images are already cached**.

**Acceptance Criteria:**

**Given** the constellation section is approaching the viewport
**When** Intersection Observer detects constellation within 200px of viewport
**Then** all 4 texture macro images begin preloading via `<link rel="preload">`
**And** images use Shopify CDN with WebP/AVIF format
**And** preload completes before user can interact with products (on reasonable connection)
**And** `app/lib/shopify/preload.ts` exports reusable preload utilities
**And** preloading works on both desktop and mobile
**And** if preload fails, texture reveal still works (just slower)

---

### Story 3.2: Build Texture Reveal Interaction

As a **visitor**,
I want **to trigger a texture reveal by hovering or tapping on a product**,
So that **I can see the soap's texture up close and feel the tactile promise**.

**Acceptance Criteria:**

**Given** I am viewing the constellation with images preloaded
**When** I hover (desktop) or tap (mobile) on a product card
**Then** the texture reveal animates in within <100ms:
- Product card expands smoothly
- Macro texture image fills the reveal area
- Animation uses GPU-composited properties only (transform, opacity)
**And** Performance API marks capture reveal timing
**And** reveal timing is logged: `performance.measure('texture-reveal', ...)`
**And** p95 reveal time is <100ms (verified in tests)
**And** keyboard users can trigger reveal with Enter/Space
**And** screen readers announce "Texture view expanded for [product name]"

**FRs addressed:** FR3, FR4

---

### Story 3.3: Display Scent Narrative Copy in Reveal

As a **visitor**,
I want **to read evocative scent narrative copy within the texture reveal**,
So that **I can imagine where the scent takes me before I buy**.

**Acceptance Criteria:**

**Given** a texture reveal is active
**When** the reveal animation completes
**Then** scent narrative copy fades in with:
- Evocative, sensory copy (e.g., "Close your eyes. A field at dusk.")
- Fluid typography (`fluid-body` or `fluid-heading`)
- Positioned to complement the texture image
**And** copy is fetched from Shopify product metafields
**And** fallback copy exists in `app/content/products.ts` if metafield missing
**And** copy has sufficient color contrast (4.5:1) against image
**And** screen readers read the narrative after image announcement

**FRs addressed:** FR5

---

### Story 3.4: Display Product Information in Reveal

As a **visitor**,
I want **to see product name, price, and description in the texture reveal**,
So that **I understand what I'm considering before adding to cart**.

**Acceptance Criteria:**

**Given** a texture reveal is active
**When** viewing the reveal content
**Then** I see:
- Product name in `fluid-heading` typography
- Price formatted with currency symbol
- Brief product description (1-2 sentences)
- "Add to Cart" button (styled, placeholder action until Epic 5)
**And** all product data comes from Shopify Storefront API
**And** price updates if product has variants
**And** all text meets WCAG 2.1 AA contrast requirements
**And** Add to Cart button is keyboard-focusable with visible focus ring

**FRs addressed:** FR10

---

### Story 3.5: Implement Close/Dismiss Reveal Behavior

As a **visitor**,
I want **to close the texture reveal and return to the constellation**,
So that **I can explore other products or continue scrolling**.

**Acceptance Criteria:**

**Given** a texture reveal is active
**When** I click outside the reveal, press Escape, or click a close button
**Then** the reveal animates closed smoothly
**And** the constellation returns to default state
**And** focus returns to the product card that was revealed (for keyboard users)
**And** other products become interactive again
**And** closing respects `prefers-reduced-motion` (instant close if set)
**And** Zustand store records that this product was explored

**FRs addressed:** FR6

---

### Story 3.6: Create Variety Pack Bundle Display

As a **visitor**,
I want **to see the variety pack as a distinct purchasable option**,
So that **I can easily choose to get all 4 soaps together**.

**Acceptance Criteria:**

**Given** I am viewing the constellation
**When** the variety pack bundle is displayed
**Then** it appears as a distinct card in the constellation with:
- Visual treatment that differentiates it from individual products
- "The Collection" or similar title
- All 4 product images shown (thumbnails or composite)
- Bundle price displayed
- Clear "all 4 soaps" messaging
**And** tapping/hovering triggers a bundle-specific reveal
**And** bundle reveal shows value proposition copy
**And** "Add to Cart" button is prominent
**And** bundle is keyboard-accessible like individual products

**FRs addressed:** FR11, FR12

---

## Epic 4: Story Moments & Site Navigation

**Goal:** Visitors absorb the brand story through scattered fragments, see the collection prompt after exploring, and can navigate to About page, footer links, and wholesale portal.

**User Outcome:** After exploring 2+ soaps, Sarah sees: *"Named for our daughter. Made in our kitchen."* These are her people.

**FRs covered:** FR7, FR8, FR9, FR45, FR47, FR48 (6 FRs)
**NFRs addressed:** NFR26 (GDPR - privacy policy)

---

### Story 4.1: Implement Story Fragments During Scroll

As a **visitor**,
I want **to discover brand story fragments scattered throughout the page**,
So that **I absorb the Isla Suds story naturally without reading an "About" page**.

**Acceptance Criteria:**

**Given** I am scrolling through the home page
**When** story fragment elements enter the viewport
**Then** they fade in with subtle animation:
- "Named for our daughter."
- "Made in our kitchen."
- "A family recipe passed down."
**And** fragments are positioned organically (not in a dedicated section)
**And** fragments use `fluid-body` or `fluid-heading` typography
**And** Intersection Observer triggers animations (not scroll listeners)
**And** fragments respect `prefers-reduced-motion` (appear instantly if set)
**And** screen readers can access fragment text in reading order
**And** copy is sourced from `app/content/story.ts`

**FRs addressed:** FR7

---

### Story 4.2: Display Collection Prompt After 2+ Products Explored

As a **visitor**,
I want **to see a collection prompt after I've explored 2 or more products**,
So that **I'm gently invited to get all 4 without being pressured**.

**Acceptance Criteria:**

**Given** I have explored 2+ products (tracked in Zustand)
**When** I close the second texture reveal
**Then** a collection prompt appears with:
- Warm, non-pushy copy: "Loving what you see? Get the whole collection."
- Visual of all 4 soaps together
- "Get the Collection" button
- Easy dismiss option (X or click outside)
**And** prompt appears only once per session
**And** prompt does NOT appear if variety pack already in cart
**And** prompt uses subtle fade-in animation
**And** prompt respects `prefers-reduced-motion`
**And** prompt is accessible: focus trapped, Escape to close, screen reader announced

**FRs addressed:** FR8

---

### Story 4.3: Add Variety Pack from Collection Prompt

As a **visitor**,
I want **to add the variety pack directly from the collection prompt**,
So that **I can act on my desire without navigating away**.

**Acceptance Criteria:**

**Given** the collection prompt is displayed
**When** I click "Get the Collection"
**Then** the variety pack is added to cart (Shopify Storefront API)
**And** button shows loading state during API call
**And** on success: button changes to "Added!" with checkmark
**And** on success: prompt closes after 1 second
**And** on success: Zustand updates `storyMomentShown: true`
**And** on error: warm error message displayed, button resets
**And** cart icon in header updates with new count

**FRs addressed:** FR9

---

### Story 4.4: Create About Page (Fallback for Direct Traffic)

As a **visitor arriving directly to the About page**,
I want **to read the full Isla Suds story**,
So that **I understand the brand even if I missed the scroll journey**.

**Acceptance Criteria:**

**Given** I navigate to `/about`
**When** the page loads
**Then** I see:
- Extended founder story with personal details
- Isla's namesake explanation
- Family recipe heritage
- Local craftsmanship details
- Photos of founder/family (placeholder until real assets)
**And** page uses consistent design tokens and typography
**And** navigation allows return to home page
**And** page is accessible: proper heading hierarchy, alt text for images
**And** page loads with LCP <2.5s

**FRs addressed:** FR45

---

### Story 4.5: Implement Footer with Navigation Links

As a **visitor**,
I want **a footer with navigation links**,
So that **I can access utility pages and legal information**.

**Acceptance Criteria:**

**Given** I scroll to the bottom of any page
**When** the footer is displayed
**Then** I see:
- Navigation links: Home, About, Contact, Wholesale
- Legal links: Privacy Policy, Terms of Service
- Copyright notice
- Social links (placeholder icons)
**And** footer uses muted canvas background
**And** all links are keyboard-accessible with visible focus
**And** footer is consistent across all pages
**And** Privacy Policy link exists (content placeholder for GDPR)

**FRs addressed:** FR48, NFR26

---

### Story 4.6: Add Wholesale Portal Link in Header/Footer

As a **wholesale partner**,
I want **to easily find the wholesale portal login link**,
So that **I can access the B2B portal without hunting for it**.

**Acceptance Criteria:**

**Given** I am on any page
**When** I look for wholesale access
**Then** "Wholesale" link appears in:
- Footer navigation
- Mobile hamburger menu
- (Optional) Small text link in sticky header
**And** clicking the link navigates to `/wholesale/login`
**And** link is visible but not prominent (B2C experience is primary)
**And** link is keyboard-accessible

**FRs addressed:** FR47

---

### Story 4.7: Smoke Test - Full Journey Verification

As a **QA engineer**,
I want **to verify the complete B2C scroll journey works across devices**,
So that **we catch any integration issues before moving to cart functionality**.

**Acceptance Criteria:**

**Given** the landing, constellation, texture reveals, and story moments are implemented
**When** I run the smoke test suite
**Then** tests pass on:
- iPhone SE (375px) - smallest supported mobile
- Pixel 7 (412px) - common Android
- Desktop (1440px) - standard desktop
**And** tests verify:
- Hero loads with LCP <2.5s
- Constellation displays all 4 products
- Texture reveal triggers <100ms
- Story fragments appear on scroll
- Collection prompt appears after 2+ products
- Footer navigation works
**And** no console errors or accessibility violations
**And** tests run in Playwright CI pipeline

---

## Epic 5: Cart Experience

**Goal:** Visitors can add products to cart, view and manage cart via slide-out drawer, and have their cart persist across sessions.

**User Outcome:** Sarah taps "Get the Collection." Cart drawer slides in—clean, no upsells. Just her soap, ready to go.

**FRs covered:** FR13, FR14, FR15, FR16, FR17, FR18, FR21, FR44 (8 FRs)
**NFRs addressed:** NFR5 (<200ms drawer), NFR15, NFR20, NFR24

---

### Story 5.1: Implement Cart Creation and Persistence

As a **returning visitor**,
I want **my cart to persist across browser sessions**,
So that **I don't lose items I added if I close the browser and return later**.

**Acceptance Criteria:**

**Given** I add a product to cart
**When** a cart is created via Shopify Storefront API
**Then** the cart ID is stored in localStorage
**And** on subsequent visits, the cart is fetched by ID
**And** if cart ID is invalid/expired, a new cart is created silently
**And** no error is shown to user if cart recovery fails
**And** `app/lib/shopify/cart.ts` exports cart persistence utilities
**And** cart state is available via Hydrogen's cart context

**FRs addressed:** FR21

---

### Story 5.2: Add Individual Product to Cart

As a **visitor**,
I want **to add an individual product to cart from the texture reveal**,
So that **I can purchase the specific soap I'm interested in**.

**Acceptance Criteria:**

**Given** I am viewing a texture reveal for an individual product
**When** I click the "Add to Cart" button
**Then** the product is added to cart via Shopify Storefront API
**And** button shows loading state during API call (<200ms feel)
**And** on success: button changes to "Added ✓" briefly
**And** on success: cart icon in header updates with new count
**And** on success: cart drawer opens automatically (Zustand `cartDrawerOpen: true`)
**And** on error: warm error message "Something went wrong. Let's try again."
**And** keyboard users can trigger add with Enter/Space

**FRs addressed:** FR13

---

### Story 5.3: Add Variety Pack Bundle to Cart

As a **visitor**,
I want **to add the variety pack bundle to cart**,
So that **I can get all 4 soaps in one purchase**.

**Acceptance Criteria:**

**Given** I am viewing the variety pack (in constellation, reveal, or collection prompt)
**When** I click "Add to Cart" or "Get the Collection"
**Then** the variety pack bundle is added to cart via Shopify Storefront API
**And** bundle appears as a single line item in cart
**And** bundle price reflects the bundle discount (if any)
**And** same loading/success/error states as individual products
**And** cart drawer opens on success

**FRs addressed:** FR14

---

### Story 5.4: Build Cart Drawer Component

As a **visitor**,
I want **to view my cart in a slide-out drawer**,
So that **I can review my items without leaving the current page**.

**Acceptance Criteria:**

**Given** items are in my cart
**When** the cart drawer opens (via add-to-cart or header icon click)
**Then** a drawer slides in from the right within <200ms:
- Radix Dialog for accessibility
- Semi-transparent backdrop
- Cart contents displayed
- Close button (X) in corner
**And** drawer traps focus (keyboard users can't Tab outside)
**And** Escape key closes drawer
**And** clicking backdrop closes drawer
**And** screen reader announces "Shopping cart, X items"
**And** drawer respects `prefers-reduced-motion` (no slide animation if set)

**FRs addressed:** FR15

---

### Story 5.5: Display Cart Line Items

As a **visitor**,
I want **to see each item in my cart with details**,
So that **I know exactly what I'm about to purchase**.

**Acceptance Criteria:**

**Given** the cart drawer is open with items
**When** I view the cart contents
**Then** each line item shows:
- Product image (thumbnail)
- Product name
- Price per item
- Quantity
- Line total
**And** variety pack shows as single line with "The Collection" name
**And** cart subtotal is displayed at bottom
**And** all prices are formatted consistently with currency
**And** line items are announced to screen readers

---

### Story 5.6: Modify Cart Quantities

As a **visitor**,
I want **to change the quantity of items in my cart**,
So that **I can buy more or fewer of a product without removing and re-adding**.

**Acceptance Criteria:**

**Given** the cart drawer is open with items
**When** I click +/- buttons or enter a number for quantity
**Then** quantity updates via Shopify Storefront API
**And** optimistic UI: quantity updates immediately
**And** if API fails: quantity reverts with warm error message
**And** subtotal updates after quantity change
**And** cart icon count updates
**And** quantity cannot go below 1 (use remove for 0)
**And** +/- buttons are keyboard-accessible

**FRs addressed:** FR16

---

### Story 5.7: Remove Items from Cart

As a **visitor**,
I want **to remove items from my cart**,
So that **I can change my mind before checkout**.

**Acceptance Criteria:**

**Given** the cart drawer is open with items
**When** I click the remove button (trash icon or "Remove")
**Then** item is removed via Shopify Storefront API
**And** optimistic UI: item disappears immediately with fade
**And** if API fails: item reappears with warm error message
**And** subtotal updates
**And** cart icon count updates
**And** if last item removed, empty cart state appears
**And** remove button is keyboard-accessible with confirmation for screen readers

**FRs addressed:** FR17

---

### Story 5.8: Display Empty Cart State

As a **visitor**,
I want **to see a friendly message when my cart is empty**,
So that **I'm guided back to products instead of seeing a dead end**.

**Acceptance Criteria:**

**Given** the cart drawer opens with no items
**When** I view the empty cart
**Then** I see:
- Warm, friendly message: "Your cart is empty. Let's find something you'll love."
- Button or link: "Explore the Collection" → returns to constellation
**And** no sad/empty imagery, just warm encouragement
**And** message is accessible to screen readers

**FRs addressed:** NFR24

---

### Story 5.9: Implement Proceed to Checkout

As a **visitor**,
I want **to proceed to Shopify checkout from the cart drawer**,
So that **I can complete my purchase**.

**Acceptance Criteria:**

**Given** the cart drawer is open with items
**When** I click "Checkout" button
**Then** I am redirected to Shopify-managed checkout
**And** checkout URL comes from cart's `checkoutUrl` field
**And** button shows loading state during redirect
**And** checkout opens in same tab (not new tab)
**And** button is prominent (accent color, full width)
**And** button is disabled if cart is empty

**FRs addressed:** FR18

---

### Story 5.10: Add Cart Icon to Sticky Header

As a **visitor**,
I want **to access my cart from the sticky header**,
So that **I can review my cart at any time while browsing**.

**Acceptance Criteria:**

**Given** I have scrolled past the hero and sticky header is visible
**When** I look at the header
**Then** I see a cart icon with:
- Item count badge (if items in cart)
- Badge hidden if cart is empty
**And** clicking icon opens cart drawer
**And** icon is keyboard-accessible (Tab + Enter)
**And** icon has accessible label "Shopping cart, X items"
**And** count updates in real-time when items added/removed

**FRs addressed:** FR44

---

## Epic 6: Checkout & Communication

**Goal:** Visitors complete purchases via Shopify checkout with attribution tracking, can retry failed payments, access help, and receive follow-up with survey link.

**User Outcome:** Checkout takes 90 seconds. Confirmation arrives with warmth. Day 3: *"How was your first shower?"*

**FRs covered:** FR19, FR20, FR22, FR30, FR31, FR46 (6 FRs)
**NFRs addressed:** NFR15, NFR22, NFR25, NFR27

---

### Story 6.1: Integrate Shopify-Managed Checkout

As a **visitor**,
I want **to complete my purchase through Shopify checkout**,
So that **I have a secure, trusted payment experience**.

**Acceptance Criteria:**

**Given** I click "Checkout" from the cart drawer
**When** I am redirected to Shopify checkout
**Then** checkout loads with:
- All cart items displayed correctly
- Correct prices and quantities
- Shipping options available
- Payment methods (Shopify Payments)
**And** checkout URL uses the cart's `checkoutUrl`
**And** checkout respects Shopify store's theme/branding settings
**And** checkout completes successfully with test payment

**FRs addressed:** FR19

---

### Story 6.2: Configure Order Confirmation Email

As a **customer**,
I want **to receive a warm order confirmation email**,
So that **I feel good about my purchase and know what to expect**.

**Acceptance Criteria:**

**Given** I complete a purchase
**When** the order is confirmed
**Then** I receive an email with:
- Brand-warm subject line (not generic "Order Confirmed")
- Personalized greeting
- Order summary with items and total
- Shipping information
- Warm closing: "Your soap is on its way. We can't wait for you to try it."
**And** email is configured in Shopify admin notification templates
**And** email includes Day 3 survey link (see Story 6.6)

**FRs addressed:** FR20, NFR27

---

### Story 6.3: Implement Payment Retry Flow

As a **visitor**,
I want **to retry my payment if it fails without re-entering my cart**,
So that **a payment error doesn't make me start over**.

**Acceptance Criteria:**

**Given** my payment is declined during checkout
**When** I see the error message
**Then** the message is warm and non-accusatory:
- "That didn't go through. No worries—let's try again."
**And** my cart items are preserved
**And** I can update payment details and retry
**And** retry works without re-adding items to cart
**And** error message styling matches brand (no harsh red)

**FRs addressed:** FR22, NFR22

---

### Story 6.4: Add Booth Attribution Code Field

As a **market customer**,
I want **to enter the booth attribution code at checkout**,
So that **the founder knows I discovered them at the farmers market**.

**Acceptance Criteria:**

**Given** I am in Shopify checkout
**When** I look for attribution options
**Then** I see a field for "Booth Code" or "Referral Code"
- Placeholder text: "e.g., FARMSTAND"
- Field is optional (not required)
**And** code is stored with order in Shopify
**And** founder can view attribution codes in Shopify admin
**And** field is implemented via Shopify checkout customization or app

**FRs addressed:** FR30

---

### Story 6.5: Add "How Did You Find Us?" Survey

As a **customer**,
I want **to answer how I found Isla Suds**,
So that **the founder understands which channels are working**.

**Acceptance Criteria:**

**Given** I am in Shopify checkout
**When** I look for the survey question
**Then** I see: "How did you find us?"
- Options: Farmers Market, Friend/Family, Social Media, Search, Other
- Selection is optional
**And** response is stored with order in Shopify
**And** founder can view survey responses in Shopify admin
**And** implemented via Shopify checkout customization or post-purchase survey app

**FRs addressed:** FR31

---

### Story 6.6: Include Day 3 Survey Link in Confirmation Email

As a **customer**,
I want **to receive a survey link in my order confirmation**,
So that **I can share my experience after trying the soap**.

**Acceptance Criteria:**

**Given** I complete a purchase
**When** I receive the order confirmation email
**Then** the email includes:
- Teaser text: "We'd love to hear about your first shower with Isla Suds."
- Link to external survey (Typeform or similar)
- Survey link is trackable (UTM parameters or unique ID)
**And** survey asks:
- "How was your first shower?" (emotional options: "I slept better", "I felt like myself again", etc.)
- Story recall question: "What do you remember about Isla Suds?" (open text)
**And** survey is configured in external tool (Typeform/Google Forms)
**And** link is added to Shopify order confirmation template

**FRs addressed:** FR37-40 (enables manual process)

---

### Story 6.7: Create Contact Page

As a **visitor**,
I want **to access a Contact page if I need help**,
So that **I can reach the founder with questions or issues**.

**Acceptance Criteria:**

**Given** I navigate to `/contact`
**When** the page loads
**Then** I see:
- Warm heading: "Let's Talk" or "Get in Touch"
- Contact form with: Name, Email, Message fields
- Alternative: Direct email address displayed
- Expected response time: "We'll get back to you within 24-48 hours"
**And** form submission sends email to founder (Shopify Forms or third-party)
**And** success message: "Thanks for reaching out! We'll be in touch soon."
**And** form is accessible: proper labels, error messages, keyboard navigation
**And** page is linked from footer and checkout error states

**FRs addressed:** FR46

---

## Epic 7: Wholesale Partner Portal (B2B)

**Goal:** Wholesale partners can log in, view their last order, reorder with one click, view order history, and request invoices.

**User Outcome:** Jim reorders in <60 seconds. Maria accesses invoice history for expense reporting.

**FRs covered:** FR23, FR24, FR25, FR26, FR27, FR28, FR29 (7 FRs)
**NFRs addressed:** NFR16

**Note:** `/wholesale/*` routing with minimal layout (no Lenis, no animations). Story 1 gates on auth validation.

---

### Story 7.1: Validate Shopify B2B Authentication

As a **developer**,
I want **to validate that Shopify B2B customer authentication works**,
So that **we can proceed with portal features knowing auth is solid**.

**Acceptance Criteria:**

**Given** Shopify B2B app is configured in admin
**When** I test the authentication flow
**Then** B2B customers can log in via `/wholesale/login`
**And** authentication uses Shopify Customer Account API
**And** B2B customer status is verified (company association)
**And** non-B2B customers are rejected with friendly message
**And** session persists across page navigation
**And** logout works correctly
**And** this validation gates all subsequent Epic 7 stories

**FRs addressed:** FR23 (partial - auth foundation)

---

### Story 7.2: Create Wholesale Portal Layout

As a **wholesale partner**,
I want **a clean, efficient portal interface**,
So that **I can complete tasks quickly without unnecessary distractions**.

**Acceptance Criteria:**

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

---

### Story 7.3: Implement Wholesale Login Page

As a **wholesale partner**,
I want **to log in to the dedicated wholesale portal**,
So that **I can access my account and place orders**.

**Acceptance Criteria:**

**Given** I navigate to `/wholesale/login`
**When** the page loads
**Then** I see:
- Clean login form (email, password)
- "Log In" button
- Link: "Forgot password?"
- Clear indication this is the wholesale portal
**And** successful login redirects to `/wholesale` dashboard
**And** failed login shows friendly error: "That didn't work. Check your email and password."
**And** form is accessible with proper labels and error announcements

**FRs addressed:** FR23

---

### Story 7.4: Display Partner Acknowledgment Message

As a **wholesale partner**,
I want **to see a personalized acknowledgment when I log in**,
So that **I feel valued as a partner, not just a transaction**.

**Acceptance Criteria:**

**Given** I am logged into the wholesale portal
**When** I view the dashboard
**Then** I see a personalized message:
- "Isla Suds is in [X] local stores. Thanks for being one of them, [Partner Name]."
**And** partner name comes from Shopify B2B customer `firstName`
**And** store count is configured (hardcoded for MVP: 3)
**And** message template is in `app/content/wholesale.ts`
**And** message appears at top of dashboard

**FRs addressed:** FR26

---

### Story 7.5: Display Last Order on Dashboard

As a **wholesale partner**,
I want **to see my last order front and center when I log in**,
So that **I can reorder instantly without searching**.

**Acceptance Criteria:**

**Given** I am logged into the wholesale portal
**When** I view the dashboard
**Then** I see my last order displayed prominently:
- Order date
- Items with quantities (e.g., "12x Lavender, 12x Lemongrass...")
- Order total
- Order status (Fulfilled, etc.)
**And** last order is fetched via Shopify Customer Account API
**And** if no previous orders, message: "No orders yet. Ready to stock up?"
**And** last order section is above the fold on desktop

**FRs addressed:** FR24

---

### Story 7.6: Implement One-Click Reorder

As a **wholesale partner**,
I want **to reorder my last order with one click**,
So that **I can restock in under 60 seconds**.

**Acceptance Criteria:**

**Given** my last order is displayed on the dashboard
**When** I click the "Reorder" button
**Then** all items from last order are added to a new cart
**And** cart uses wholesale pricing automatically
**And** I am redirected to checkout (or shown confirmation)
**And** button shows loading state during API calls
**And** reorder completes in <60 seconds total (including checkout)
**And** on error: warm message "Something went wrong. Let's try again."
**And** confirmation: "Another batch heading to [Store Name]. Your customers are lucky."

**FRs addressed:** FR25

---

### Story 7.7: Display Order History

As a **wholesale partner**,
I want **to view my order history**,
So that **I can reference past orders and track my purchases**.

**Acceptance Criteria:**

**Given** I am logged into the wholesale portal
**When** I navigate to Order History (link or tab)
**Then** I see a list of past orders:
- Order date
- Order number
- Total amount
- Status (Fulfilled, Processing, etc.)
- "View Details" link
**And** orders are sorted newest first
**And** pagination or "Load more" if many orders
**And** clicking "View Details" shows full order breakdown

**FRs addressed:** FR27

---

### Story 7.8: Implement Invoice Request

As a **wholesale partner**,
I want **to request invoices for my orders**,
So that **I can complete expense reporting without emailing the founder**.

**Acceptance Criteria:**

**Given** I am viewing an order in Order History
**When** I click "Request Invoice"
**Then** a request is sent to the founder (email notification)
**And** button changes to "Invoice Requested" (disabled)
**And** confirmation message: "We'll send your invoice within 1-2 business days."
**And** founder receives email with order details
**And** MVP: invoice is manually generated and sent by founder
**And** future: could be automated PDF generation

**FRs addressed:** FR28

---

### Story 7.9: Apply Wholesale Pricing

As a **wholesale partner**,
I want **to see wholesale pricing automatically when logged in**,
So that **I receive my partner discount without asking**.

**Acceptance Criteria:**

**Given** I am logged in as a B2B customer
**When** I view products or add to cart
**Then** prices reflect wholesale pricing tier
**And** pricing comes from Shopify B2B price lists
**And** cart shows wholesale prices
**And** checkout uses wholesale prices
**And** B2C visitors see regular retail prices
**And** no manual discount codes needed

**FRs addressed:** FR29

---

## Epic 8: Analytics & Attribution

**Goal:** System can track user engagement, texture reveal interactions, and share link conversions for business optimization.

**User Outcome:** Founder can monitor what's working and make data-driven decisions.

**FRs covered:** FR32, FR33, FR34, FR35, FR36 (5 FRs)
**NFRs addressed:** NFR17

**⚠️ CAN BE DEPRIORITIZED** if timeline is tight - ship MVP without, add in Sprint 2.

---

### Story 8.1: Implement Analytics Event Infrastructure

As a **developer**,
I want **a reliable analytics event system using sendBeacon**,
So that **events are captured even when users navigate away or close the tab**.

**Acceptance Criteria:**

**Given** the analytics infrastructure is needed
**When** I implement the event system
**Then** `app/lib/analytics.ts` exports:
- `trackEvent(name: string, data: object)` function
- `flushEvents()` for manual batch send
- Automatic flush on `beforeunload`
**And** events use `navigator.sendBeacon` for reliability
**And** events batch in memory and send periodically (every 30s) or on unload
**And** events include session ID and timestamp
**And** analytics endpoint is configurable (placeholder for MVP)
**And** no third-party trackers (privacy-first approach)

---

### Story 8.2: Track Texture Reveal Events

As a **founder**,
I want **to know how many texture reveals are triggered per session**,
So that **I can measure if the core UX is engaging users**.

**Acceptance Criteria:**

**Given** the analytics infrastructure is in place
**When** a visitor triggers a texture reveal
**Then** an event is tracked with:
- Event name: `texture_reveal`
- Product ID
- Reveal duration (how long it stayed open)
- Reveal timing (Performance API measurement)
**And** events aggregate per session (total reveals count)
**And** events fire via the analytics system
**And** Zustand `textureRevealsTriggered` counter updates

**FRs addressed:** FR34

---

### Story 8.3: Track Products Explored

As a **founder**,
I want **to know how many products visitors explore per session**,
So that **I can measure discovery depth and identify drop-off points**.

**Acceptance Criteria:**

**Given** the analytics infrastructure is in place
**When** a visitor explores a product (triggers reveal)
**Then** an event is tracked with:
- Event name: `product_explored`
- Product ID
- Exploration order (1st, 2nd, 3rd, 4th)
**And** session summary includes:
- Total products explored
- List of product IDs explored
- Whether collection prompt was shown
**And** Zustand `productsExplored` Set is updated

**FRs addressed:** FR35

---

### Story 8.4: Track Session Duration

As a **founder**,
I want **to know how long visitors spend on the site**,
So that **I can measure if the "permission to slow down" philosophy is working**.

**Acceptance Criteria:**

**Given** the analytics infrastructure is in place
**When** a visitor's session ends (close tab, navigate away, or 30min idle)
**Then** a session summary event is tracked with:
- Event name: `session_end`
- Session duration in seconds
- Pages viewed
- Products explored count
- Texture reveals triggered count
- Whether add-to-cart occurred
- Whether checkout was reached
**And** session start time is captured in Zustand `sessionStartTime`
**And** event fires on `beforeunload` or idle timeout

**FRs addressed:** FR36

---

### Story 8.5: Generate Shareable Links

As a **visitor**,
I want **to share Isla Suds with friends via a shareable link**,
So that **I can spread the word about products I love**.

**Acceptance Criteria:**

**Given** I want to share the site
**When** I look for a share option
**Then** I find a "Share" or "Tell a Friend" link:
- In footer
- On order confirmation page
- (Optional) After add-to-cart
**And** clicking generates a shareable URL with tracking parameter:
- Example: `islasuds.com/?ref=share_[uniqueId]`
**And** share options include: Copy Link, native share (mobile)
**And** share modal is accessible (Radix Dialog)

**FRs addressed:** FR32

---

### Story 8.6: Track Share Link Clicks and Conversions

As a **founder**,
I want **to track share link clicks and resulting conversions**,
So that **I can measure word-of-mouth effectiveness**.

**Acceptance Criteria:**

**Given** a visitor arrives via a share link (URL contains `ref=share_*`)
**When** the page loads
**Then** a tracking event is fired:
- Event name: `share_link_click`
- Referral ID from URL
**And** if this visitor makes a purchase, conversion is attributed to share
**And** founder can see in analytics:
- Total share link clicks
- Conversion rate from shares
- Which share links perform best
**And** attribution persists across session (stored in localStorage)

**FRs addressed:** FR33

---

## Epic 9: Accessibility Validation & Polish

**Goal:** Systematic audit verifying all users can access the site regardless of ability, with specific focus on reduced motion, screen reader, and keyboard navigation edge cases.

**User Outcome:** Users with disabilities experience the same quality journey. Motion-sensitive users aren't overwhelmed.

**FRs covered:** FR49, FR50, FR51 (3 FRs)
**NFRs addressed:** NFR8-14 (all accessibility NFRs - validation pass)

**Note:** This is a **validation/audit epic**, not implementation. Core accessibility is built into Epics 2-8. This epic validates, catches edge cases, and polishes.

---

### Story 9.1: Keyboard Navigation Audit

As a **keyboard-only user**,
I want **to navigate the entire site using only keyboard**,
So that **I can browse and purchase without a mouse**.

**Acceptance Criteria:**

**Given** the site is complete through Epic 8
**When** I audit keyboard navigation
**Then** I verify:
- Tab order follows logical visual flow on all pages
- All interactive elements are reachable via Tab
- Focus indicators are visible on all focusable elements
- No keyboard traps (can always Tab out except modals)
- Enter/Space activates buttons and links
- Escape closes modals and drawers
- Arrow keys work for expected controls (quantity +/-)
**And** any issues found are documented and fixed
**And** focus indicator styling is consistent with brand (teal outline)
**And** skip link "Skip to main content" is present for screen reader users

**FRs addressed:** FR49, NFR9, NFR11

---

### Story 9.2: Screen Reader Compatibility Audit

As a **screen reader user**,
I want **all content to be accessible and announced properly**,
So that **I can understand and use the site without seeing it**.

**Acceptance Criteria:**

**Given** the site is complete through Epic 8
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
**And** any issues found are documented and fixed
**And** ARIA attributes are used only where HTML semantics are insufficient
**And** product cards announce: name, price, "activate to view details"

**FRs addressed:** FR50, NFR10

---

### Story 9.3: Reduced Motion Verification

As a **motion-sensitive user**,
I want **simplified animations when I have prefers-reduced-motion enabled**,
So that **I don't experience discomfort or nausea from animations**.

**Acceptance Criteria:**

**Given** I have `prefers-reduced-motion: reduce` set in OS preferences
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
**And** site remains fully functional and beautiful without motion
**And** any missing reduced-motion handling is fixed

**FRs addressed:** FR51, NFR13

---

### Story 9.4: Color Contrast and Visual Accessibility Audit

As a **low-vision user**,
I want **sufficient color contrast throughout the site**,
So that **I can read text and identify interactive elements**.

**Acceptance Criteria:**

**Given** the site is complete through Epic 8
**When** I audit color contrast
**Then** I verify:
- All body text meets 4.5:1 contrast ratio against background
- Large text (≥24px or ≥19px bold) meets 3:1 ratio
- Interactive element boundaries are distinguishable
- Error states are not indicated by color alone
- Focus indicators have 3:1 contrast against adjacent colors
- Scent narrative text on texture images is readable
**And** any contrast failures are fixed
**And** audit is performed with browser devtools or axe-core

**FRs addressed:** NFR12

---

### Story 9.5: Touch Target Size Verification

As a **mobile user with motor impairments**,
I want **touch targets to be large enough to tap accurately**,
So that **I don't accidentally tap the wrong element**.

**Acceptance Criteria:**

**Given** the site is viewed on mobile devices
**When** I audit touch targets
**Then** I verify:
- All buttons are at least 44x44px
- All links have at least 44px tap height
- Quantity +/- buttons are adequately sized
- Close (X) buttons are at least 44x44px
- Form inputs have adequate tap area
- Spacing between targets prevents mis-taps
**And** any undersized targets are fixed
**And** verification includes: iPhone SE, Pixel 7

**FRs addressed:** NFR14

---

### Story 9.6: Automated Accessibility CI Validation

As a **developer**,
I want **automated accessibility checks in CI**,
So that **future changes don't introduce accessibility regressions**.

**Acceptance Criteria:**

**Given** the accessibility audits are complete
**When** the CI pipeline runs
**Then** axe-core runs on key pages:
- Home page (landing, constellation, reveals)
- About page
- Contact page
- Wholesale login and dashboard
- Cart drawer (when open)
**And** CI fails if any critical/serious axe violations are found
**And** results are reported in PR comments
**And** baseline is established for acceptable issues (if any)
**And** Playwright accessibility tests exist for key flows

**FRs addressed:** NFR8

---

## Summary

| Epic | Title | FRs | Stories |
|------|-------|-----|---------|
| 1 | Project Foundation & Design System | 0 | 10 |
| 2 | Landing & Constellation Layout | 5 | 5 |
| 3 | Texture Reveals & Product Discovery | 7 | 6 |
| 4 | Story Moments & Site Navigation | 6 | 7 |
| 5 | Cart Experience | 8 | 10 |
| 6 | Checkout & Communication | 6 | 7 |
| 7 | Wholesale Partner Portal | 7 | 9 |
| 8 | Analytics & Attribution | 5 | 6 |
| 9 | Accessibility Validation | 3 | 6 |
| **Total** | | **47 + 4 manual** | **66** |

---

*Document Complete. Ready for final validation.*
