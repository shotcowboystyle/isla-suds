---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
  - step-06-structure
  - step-07-validation
  - step-08-complete
inputDocuments:
  - prd.md
  - ux-design-specification.md
  - product-brief-isla-suds-2026-01-23.md
workflowType: 'architecture'
project_name: 'isla-suds'
user_name: 'Bubbles'
date: '2026-01-24'
author: 'Winston'
status: 'complete'
completedAt: '2026-01-24'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Architectural Soul: The Texture Reveal

The <100ms texture reveal is not merely a performance target—it is the core conversion mechanism that bridges the sensory gap between physical and digital product experience. All architectural decisions must protect this interaction.

**Texture Reveal Performance Contract:**
- Images must be preloaded before hover/tap is possible
- Animation must use GPU-composited properties only (transform, opacity)
- No network requests during the reveal interaction
- Fallback: static image reveal if animation fails

### Requirements Overview

**Functional Requirements (51 total):**
- Product Discovery & Exploration: 9 FRs (constellation layout, texture reveals, story fragments)
- Product Information: 3 FRs (product display, bundle presentation)
- Cart & Checkout (B2C): 10 FRs (Shopify-managed, cart persistence, retry flow)
- Wholesale Portal (B2B): 7 FRs (partner login, one-click reorder, acknowledgment)
- Attribution & Analytics: 7 FRs (booth code, survey, share tracking, event tracking)
- Post-Purchase: 4 FRs (manual email with emotional survey)
- Content & Navigation: 8 FRs (hero, sticky header, footer, utility pages)
- Accessibility: 3 FRs (keyboard, screen reader, reduced motion)

**Non-Functional Requirements (27 total):**
- Performance: 7 NFRs (Core Web Vitals, texture reveal <100ms, bundle <200KB)
- Accessibility: 7 NFRs (WCAG 2.1 AA, keyboard nav, contrast, touch targets)
- Integration: 4 NFRs (Shopify Storefront API, B2B app, analytics, CDN)
- Reliability: 3 NFRs (99.5% uptime, cart persistence, graceful degradation)
- UX Tone: 5 NFRs (warm errors, brand-aligned loading, personal confirmations)
- Compliance: 1 NFR (GDPR basics)

**Scale & Complexity:**
- Primary domain: E-commerce Frontend (Shopify Hydrogen)
- Complexity level: Low-Medium
- Estimated architectural components: 15-20 custom components
- Backend complexity: Minimal (Shopify-managed)

### Technical Constraints & Dependencies

| Constraint | Source | Impact |
|------------|--------|--------|
| Shopify Hydrogen | PRD | Framework choice locked |
| Shopify Oxygen hosting | PRD | Deployment target fixed |
| Storefront API | PRD | Cart/checkout integration pattern |
| Shopify B2B app | PRD | Wholesale portal approach |
| <200KB JS bundle | NFR6 | Library selection constrained |
| Framer Motion budget | NFR6 | Must be dynamically imported, <40KB contribution |
| <100ms texture reveal | NFR4 | Animation/image strategy critical |
| WCAG 2.1 AA | NFR8 | All components must be accessible |

### Bundle Budget Breakdown

| Library | Size (gzipped) | Status |
|---------|----------------|--------|
| Lenis | ~3KB | ✅ Acceptable |
| Framer Motion | ~30-40KB | ⚠️ Dynamic import required |
| Radix primitives | ~15-20KB | ⚠️ Selective use only |
| App code budget | ~120-140KB | Remaining after libraries |

**Constraint:** Framer Motion must be dynamically imported and only loaded after first meaningful paint.

### Cross-Cutting Concerns

1. **Performance Budget** - Every component must justify its bundle impact
2. **Accessibility** - Radix primitives for complex interactions, semantic HTML throughout
3. **Graceful Degradation** - Commerce flow must work if animations fail to load
4. **Analytics Integration** - Custom events woven through user journey
5. **Brand Consistency** - Warm tone enforced at error boundaries and system messages
6. **Performance Observability** - Lighthouse CI in pipeline, custom Performance API timing for texture reveals, synthetic monitoring for Core Web Vitals post-deploy

## Starter Template Evaluation

### Primary Technology Domain

E-commerce Frontend (Shopify Hydrogen) based on project requirements analysis.

### Starter Options Considered

#### Demo Store Template (`--template demo-store`)
- ~30 pre-built components, full customer journey
- Tailwind pre-configured, Shopify Analytics integrated
- **Rejected:** Pre-built UI conflicts with constellation layout; would remove more than we keep

#### Skeleton Template (default)
- Core Shopify integration without UI opinions
- TypeScript + Vite 6 + React Router ready
- **Selected:** Clean slate for custom immersive experience

### Selected Starter: Skeleton Template

**Rationale:** The Isla Suds experience is fundamentally custom—constellation layout, texture reveals, dual-audience routing. Starting with demo-store would mean removing more code than we keep. Skeleton gives us the Shopify integration plumbing without UI opinions.

**Initialization Command:**

```bash
npm create @shopify/hydrogen@latest -- \
  --language ts \
  --styling tailwind \
  --install-deps \
  --shortcut h2 \
  --markets subfolders
```

**Post-Init Setup Required (in order):**

1. Create design token system (tokens.css → tailwind.config.ts extend)
2. Add CVA for component variants
3. Add Radix UI primitives (Dialog, NavigationMenu)
4. Add Lenis for desktop smooth scroll
5. Add Framer Motion (dynamic import)
6. Configure fluid typography in tailwind.config.ts
7. Configure GraphQL codegen for custom queries (texture images, B2B pricing, metafields)
8. Configure Vitest + Testing Library for component tests
9. Add Playwright for visual regression testing
10. Set up Lighthouse CI in deployment pipeline

### Architectural Decisions Provided by Starter

| Category | What Skeleton Provides |
|----------|------------------------|
| **Language & Runtime** | TypeScript, Vite 6, React Router 7.x |
| **Styling Foundation** | Tailwind CSS via PostCSS |
| **Shopify Integration** | Storefront API client, cart utilities, checkout redirect |
| **Build Tooling** | Vite with Hydrogen plugin, codegen for GraphQL types |
| **Testing** | Vitest configured (needs component testing setup) |
| **Development Experience** | Hot reload, h2 CLI shortcuts, Oxygen deployment |
| **Project Structure** | `/app/routes`, `/app/components`, `/app/lib` conventions |

### What We Add

| Addition | Purpose | Bundle Impact |
|----------|---------|---------------|
| Design tokens | Foundation for all styling | 0 (CSS) |
| CVA | Type-safe component variants | ~2KB |
| Radix UI | Accessible primitives (Dialog, Navigation) | ~15-20KB |
| Lenis | Desktop smooth scroll physics | ~3KB |
| Framer Motion | GPU-accelerated animations | ~30-40KB (dynamic) |
| Fluid typography | CSS clamp() scale in Tailwind config | 0 (CSS) |
| Playwright | Visual regression testing | Dev only |
| Lighthouse CI | Performance regression prevention | CI only |

### Development Modes

| Mode | Use Case | Command |
|------|----------|---------|
| **Mock Shop** | UI development, no Shopify dependency | `npm run dev` (default) |
| **Connected** | Integration testing with real store | `npm run dev -- --env production` |

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- State management approach
- Image preloading strategy for texture reveals
- Cart persistence mechanism
- Error boundary architecture
- B2B portal routing
- Performance verification strategy

**Important Decisions (Shape Architecture):**
- Analytics implementation
- Component file structure
- Error message content
- B2B partner data source

**Deferred Decisions (Post-MVP):**
- Subscription billing integration
- Advanced caching strategies
- CDN failover configuration
- Dynamic store count for B2B

### State Management

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **UI State** | Zustand (~1KB) | Lightweight, handles exploration tracking, texture reveal state, story moment triggers |
| **Cart State** | Hydrogen Cart Context | Built-in, optimized for Storefront API |
| **Server State** | Remix loaders | SSR-first, automatic revalidation |

**Store Structure:**
```typescript
// stores/exploration.ts
interface ExplorationState {
  productsExplored: Set<string>;
  textureRevealsTriggered: number;
  storyMomentShown: boolean;
  sessionStartTime: number;
  cartDrawerOpen: boolean;
}
```

### Image Loading Strategy

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Preload Trigger** | Intersection Observer | Load when constellation enters viewport |
| **Priority** | `fetchpriority="high"` for first 2 visible | Optimize LCP |
| **Mobile** | Preload all 4 when visible | No hover intent available |
| **Format** | WebP/AVIF via Shopify CDN | Automatic optimization |

**Implementation Pattern:**
- IO observes constellation container
- On intersect: inject `<link rel="preload">` for texture macros
- Texture reveal uses already-cached images → <100ms guaranteed

### Cart Persistence

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Mechanism** | Shopify cart ID in localStorage | Cart lives on Shopify, survives browser close |
| **Recovery** | Fetch cart by ID on return visit | Graceful fallback if expired |
| **Fallback** | Create new cart if ID invalid | No error shown to user |

### Error Boundary Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Strategy** | Hybrid (route + component) | Granular recovery, warm messaging |
| **Route-level** | Catches page crashes | Warm full-page fallback |
| **Component-level** | Texture reveal, cart drawer, animation | Graceful degradation per NFR21 |

**Boundary Placement:**
- `TextureReveal` → fallback: static image reveal (silent)
- `CartDrawer` → fallback: link to `/cart` page
- `AnimationLayer` → fallback: no animation, commerce works
- Route boundary → warm "Something went wrong" with retry

### Error Message Content

| Boundary | Fallback Copy |
|----------|---------------|
| **Texture Reveal** | (silent—show static image, no message) |
| **Cart Drawer** | "Having trouble loading your cart. [View cart page →]" |
| **Route Error** | "Something's not quite right. Your cart is safe—let's try again." |
| **Payment Retry** | "That didn't go through. No worries—let's try again." |

**Location:** `app/content/errors.ts` (centralized, maintainable)

### Performance Verification

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Texture Timing** | Custom Performance API marks | `performance.mark()` → `performance.measure()` |
| **CI Verification** | Playwright + Performance API | Headless test measures reveal timing |
| **Threshold** | p95 < 100ms | Fail CI on consistent regression |

**Implementation:**
```typescript
// Texture reveal timing
performance.mark('texture-reveal-start');
// ... reveal animation
performance.mark('texture-reveal-end');
performance.measure('texture-reveal', 'texture-reveal-start', 'texture-reveal-end');
```

### Analytics Implementation

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Commerce Events** | Shopify Analytics | Built-in, zero config |
| **UX Events** | Custom sendBeacon | No third-party tracker, privacy-first |
| **Performance** | Performance API | Texture reveal timing instrumentation |
| **Storage** | Zustand → batch on unload | Minimal runtime overhead |

**Custom Events Tracked:**
- `texture_reveal` (product_id, duration_ms)
- `products_explored` (count, product_ids)
- `story_moment_shown` (timestamp)
- `session_duration` (seconds)
- `share_link_clicked` (source)

### Component File Structure

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Pattern** | Layer-based | Matches Hydrogen conventions |
| **Primitives** | `/components/ui/` | Radix wrappers with CVA |
| **Features** | `/components/product/`, `/cart/`, etc. | Clear ownership |

**Structure:**
```
app/
  components/
    ui/           # Button, Dialog, Input (Radix + CVA)
    product/      # ProductCard, TextureReveal, ConstellationGrid
    cart/         # CartDrawer, CartLine, CartSummary
    layout/       # Header, Footer, StickyNav
    story/        # StoryMoment, PausePoint
    wholesale/    # B2B portal components
  content/
    errors.ts     # Centralized error messages
    wholesale.ts  # B2B copy and templates
  lib/
    variants.ts   # CVA definitions
    analytics.ts  # sendBeacon utilities
    scroll.ts     # Lenis init/destroy
  stores/
    exploration.ts # Zustand UI state
```

### B2B Portal Routing

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Pattern** | Path prefix `/wholesale/*` | Single deployment, clean separation |
| **Layout** | Dedicated minimal layout | No Lenis, no animations, efficiency-first |
| **Auth** | Middleware gates all `/wholesale` routes | Shopify B2B customer check |

**Route Structure:**
```
app/routes/
  _index.tsx              # B2C immersive landing
  products.$handle.tsx    # B2C product pages
  cart.tsx                # B2C cart page
  wholesale/
    _layout.tsx           # Minimal B2B layout
    _index.tsx            # Dashboard + last order
    orders.tsx            # Order history
    orders.$id.tsx        # Order detail
```

### B2B Partner Data

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Partner Name** | Shopify B2B customer `firstName` | Already available via API |
| **Store Count** | Hardcoded config (MVP) | 3 partners, manual update |
| **Acknowledgment** | Template in `app/content/wholesale.ts` | Centralized copy |

**Template:**
```typescript
// app/content/wholesale.ts
export const partnerAcknowledgment = (name: string, storeCount: number) =>
  `Isla Suds is in ${storeCount} local stores. Thanks for being one of them, ${name}.`;
```

### Decision Impact Analysis

**Implementation Sequence:**
1. Skeleton init + design tokens
2. Zustand store setup (including cartDrawerOpen)
3. Component structure scaffold
4. **GATE: Verify texture macro images in Shopify**
5. Texture reveal with IO preloading
6. Cart with persistence + drawer state
7. Error boundaries with centralized copy
8. Analytics instrumentation
9. Performance verification tests
10. B2B portal routes + partner data

**Cross-Component Dependencies:**
- Zustand exploration state → triggers StoryMoment
- Zustand cartDrawerOpen → controls CartDrawer visibility
- IO preloading → enables <100ms texture reveal
- Error boundaries → wrap TextureReveal, CartDrawer, AnimationLayer
- Performance API → feeds analytics + CI verification
- Analytics → reads from Zustand, fires on unload

## Implementation Patterns & Consistency Rules

_These patterns ensure AI agents produce consistent, conflict-free code._

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| **Components** | PascalCase.tsx | `TextureReveal.tsx`, `CartDrawer.tsx` |
| **Utilities** | kebab-case.ts | `analytics.ts`, `scroll-utils.ts` |
| **Hooks** | use-camelCase.ts | `use-exploration-state.ts` |
| **Constants** | SCREAMING_SNAKE_CASE | `TEXTURE_REVEAL_THRESHOLD` |
| **Types** | PascalCase (no suffix) | `Product`, `CartLine` |

### Test File Location

| Pattern | Location | Example |
|---------|----------|---------|
| **Unit tests** | Co-located with source | `TextureReveal.test.tsx` |
| **Integration tests** | `/tests/integration/` | `cart-flow.test.ts` |
| **E2E tests** | `/tests/e2e/` | `checkout.spec.ts` |
| **Visual regression** | `/tests/visual/` | `constellation.visual.ts` |

**Co-location Rule:** If test file exceeds 200 lines, move to `/tests/unit/` with matching path structure.

### Import Organization

```typescript
// 1. React/framework imports
import { useState, useEffect } from 'react';
import { useLoaderData } from '@remix-run/react';

// 2. External libraries
import { motion } from 'framer-motion';
import { create } from 'zustand';

// 3. Internal absolute imports (@/)
import { Button } from '@/components/ui/Button';
import { useExplorationStore } from '@/stores/exploration';

// 4. Relative imports (parent, then sibling)
import { TextureImage } from './TextureImage';

// 5. Type imports (last)
import type { Product } from '@/types';
```

**ESLint Config:**
```javascript
// eslint.config.js
'import/order': ['error', {
  groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'type'],
  pathGroups: [
    { pattern: 'react', group: 'builtin', position: 'before' },
    { pattern: '@remix-run/**', group: 'builtin' },
    { pattern: '@/**', group: 'internal', position: 'before' }
  ],
  'newlines-between': 'always',
  alphabetize: { order: 'asc', caseInsensitive: true }
}]
```

### CVA Organization

| Scenario | Location |
|----------|----------|
| **Single component** | Co-located in component file |
| **Shared variants** | `app/lib/variants.ts` |

**20-Line Rule:** If CVA definitions exceed 20 lines, extract to `app/lib/variants/[component].ts`.

### Event Naming Conventions

| Context | Pattern | Example |
|---------|---------|---------|
| **Analytics events** | snake_case | `texture_reveal`, `cart_opened` |
| **Internal handlers** | camelCase | `handleTextureReveal`, `onCartOpen` |
| **Custom hooks** | use + camelCase | `useTextureReveal` |

### Props Interface Pattern

```typescript
// Always ComponentNameProps
interface TextureRevealProps {
  product: Product;
  onReveal?: () => void;
}

// Extend HTML attributes when wrapping DOM elements
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}
```

### Loading State Pattern

| Scenario | Pattern |
|----------|---------|
| **Route loading** | Remix `useNavigation().state` |
| **Mutations** | Remix `useFetcher().state` |
| **Client-only** | Boolean state (`isLoading`) |
| **UI indication** | Skeleton components, not spinners |

### Test Naming Convention

```typescript
// ✅ Behavior-focused, readable as documentation
it('reveals texture when user hovers on desktop')
it('preloads images when constellation enters viewport')
it('persists cart ID to localStorage on cart creation')
it('falls back to static image when animation fails')

// ❌ Vague or implementation-focused
it('should work correctly')
it('test hover')
it('calls useState')
```

### Design Token Naming

CSS custom properties follow this pattern:

```css
/* Semantic color tokens */
--canvas-base: #FAF7F2;      /* Primary background */
--canvas-elevated: #F5F0E8;  /* Cards, modals */
--text-primary: #2C2416;     /* Body text */
--text-muted: #8C8578;       /* Secondary text */
--accent-primary: #3A8A8C;   /* CTAs, links */
--accent-hover: #2D6E70;     /* Interactive states */

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

### Content Location Rules

| Content Type | Location | Rationale |
|--------------|----------|-----------|
| **Error messages** | `app/content/errors.ts` | Warm tone, centralized |
| **B2B copy** | `app/content/wholesale.ts` | Partner-specific templates |
| **Product copy** | Shopify metafields | CMS-managed |
| **Story fragments** | `app/content/story.ts` | Brand narrative |
| **Accessibility labels** | Co-located with component | Context-dependent |

## Project Structure & Boundaries

### Requirements to Structure Mapping

| FR Category | Lives In |
|-------------|----------|
| Product Discovery & Exploration (9 FRs) | `app/components/product/`, `app/routes/_index.tsx` |
| Product Information (3 FRs) | `app/routes/products.$handle.tsx`, `app/components/product/` |
| Cart & Checkout B2C (10 FRs) | `app/components/cart/`, `app/routes/cart.tsx` |
| Wholesale Portal B2B (7 FRs) | `app/routes/wholesale/`, `app/components/wholesale/` |
| Attribution & Analytics (7 FRs) | `app/lib/analytics.ts`, `app/stores/exploration.ts` |
| Post-Purchase (4 FRs) | `app/routes/orders/`, `app/content/` |
| Content & Navigation (8 FRs) | `app/components/layout/`, `app/routes/` |
| Accessibility (3 FRs) | Cross-cutting, all components |

### Complete Project Directory Structure

```
isla-suds/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, type-check, test, Lighthouse CI
│       └── deploy.yml                # Oxygen deployment
├── .vscode/
│   ├── extensions.json               # Recommended extensions
│   └── settings.json                 # Project-specific settings
├── scripts/
│   └── verify-shopify-assets.ts      # Pre-implementation asset verification
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── fonts/
│       └── .gitkeep                  # Brand typography (if self-hosted)
├── app/
│   ├── root.tsx                      # App shell, error boundary, Lenis init
│   ├── entry.client.tsx              # Client hydration
│   ├── entry.server.tsx              # SSR entry
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx            # CVA variants, Radix Slot
│   │   │   ├── Button.test.tsx
│   │   │   ├── Dialog.tsx            # Radix Dialog wrapper
│   │   │   ├── Dialog.test.tsx
│   │   │   ├── Input.tsx             # Form input with validation
│   │   │   ├── Input.test.tsx
│   │   │   ├── NavigationMenu.tsx    # Radix NavigationMenu
│   │   │   ├── Skeleton.tsx          # Loading placeholder
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.tsx       # Constellation grid item
│   │   │   ├── ProductCard.test.tsx
│   │   │   ├── TextureReveal.tsx     # Core <100ms reveal interaction
│   │   │   ├── TextureReveal.test.tsx
│   │   │   ├── ConstellationGrid.tsx # 4-product layout
│   │   │   ├── ConstellationGrid.test.tsx
│   │   │   ├── BundleCard.tsx        # Variety pack display
│   │   │   ├── ProductGallery.tsx    # Product page images
│   │   │   └── index.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx        # Slide-out cart
│   │   │   ├── CartDrawer.test.tsx
│   │   │   ├── CartLine.tsx          # Individual cart item
│   │   │   ├── CartLine.test.tsx
│   │   │   ├── CartSummary.tsx       # Totals and checkout CTA
│   │   │   ├── CartEmpty.tsx         # Empty state with warm copy
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Sticky header + cart icon
│   │   │   ├── Header.test.tsx
│   │   │   ├── Footer.tsx            # Minimal footer
│   │   │   ├── StickyNav.tsx         # Scroll-aware navigation
│   │   │   ├── CartIcon.tsx          # Badge with count
│   │   │   └── index.ts
│   │   │
│   │   ├── story/
│   │   │   ├── StoryMoment.tsx       # Narrative pause point
│   │   │   ├── StoryMoment.test.tsx
│   │   │   ├── HeroSection.tsx       # Landing hero
│   │   │   ├── FounderStory.tsx      # About section
│   │   │   └── index.ts
│   │   │
│   │   ├── wholesale/
│   │   │   ├── PartnerDashboard.tsx  # B2B landing after login
│   │   │   ├── QuickReorder.tsx      # One-click reorder
│   │   │   ├── OrderHistory.tsx      # Past orders list
│   │   │   ├── OrderDetail.tsx       # Single order view
│   │   │   ├── PartnerHeader.tsx     # Minimal B2B header
│   │   │   └── index.ts
│   │   │
│   │   └── errors/
│   │       ├── RouteErrorBoundary.tsx    # Full-page fallback
│   │       ├── ComponentErrorBoundary.tsx # Graceful degradation
│   │       └── index.ts
│   │
│   ├── routes/
│   │   ├── _index.tsx                # B2C immersive landing
│   │   ├── products.$handle.tsx      # Product detail page
│   │   ├── cart.tsx                  # Full cart page
│   │   ├── collections.$handle.tsx   # Collection pages (future)
│   │   ├── policies.$handle.tsx      # Privacy, Terms, etc.
│   │   ├── about.tsx                 # Founder story page
│   │   │
│   │   ├── orders/
│   │   │   └── $id.tsx               # Order confirmation (B2C)
│   │   │
│   │   └── wholesale/
│   │       ├── _layout.tsx           # Minimal B2B layout (no Lenis)
│   │       ├── _index.tsx            # Partner dashboard
│   │       ├── login.tsx             # B2B authentication
│   │       ├── orders.tsx            # Order history list
│   │       └── orders.$id.tsx        # Order detail
│   │
│   ├── content/
│   │   ├── errors.ts                 # Centralized warm error messages
│   │   ├── wholesale.ts              # B2B copy and templates
│   │   ├── story.ts                  # Brand narrative fragments
│   │   └── products.ts               # Static product copy fallbacks
│   │
│   ├── lib/
│   │   ├── shopify/
│   │   │   ├── cart.ts               # Cart ID persistence helpers
│   │   │   ├── preload.ts            # Shopify CDN image preloading
│   │   │   └── index.ts              # Barrel export
│   │   ├── analytics.ts              # sendBeacon utilities
│   │   ├── scroll.ts                 # Lenis init/destroy
│   │   ├── performance.ts            # Performance API wrappers
│   │   └── variants/
│   │       ├── button.ts             # Button CVA (if >20 lines)
│   │       └── index.ts
│   │
│   ├── stores/
│   │   └── exploration.ts            # Zustand UI state
│   │
│   ├── hooks/
│   │   ├── use-texture-reveal.ts     # Texture reveal state + timing
│   │   ├── use-preload-images.ts     # IO-based image preloading
│   │   ├── use-exploration-state.ts  # Zustand selector
│   │   └── use-media-query.ts        # Responsive breakpoints
│   │
│   ├── graphql/
│   │   ├── fragments/
│   │   │   ├── product.ts            # Product fields fragment
│   │   │   └── cart.ts               # Cart fields fragment
│   │   ├── queries/
│   │   │   ├── products.ts           # Product queries
│   │   │   ├── collections.ts        # Collection queries
│   │   │   └── wholesale.ts          # B2B-specific queries
│   │   └── mutations/
│   │       ├── cart.ts               # Cart add/update/remove
│   │       └── wholesale.ts          # B2B order mutations
│   │
│   ├── types/
│   │   ├── product.ts                # Product types
│   │   ├── cart.ts                   # Cart types
│   │   ├── analytics.ts              # Event types
│   │   └── wholesale.ts              # B2B types
│   │
│   └── styles/
│       ├── tokens.css                # Design tokens (CSS custom properties)
│       ├── tailwind.css              # Tailwind imports + base
│       └── animations.css            # Keyframe definitions
│
├── tests/
│   ├── integration/
│   │   ├── cart-flow.test.ts         # Add to cart → checkout
│   │   ├── texture-reveal.test.ts    # IO → preload → reveal
│   │   └── b2b-reorder.test.ts       # Quick reorder flow
│   ├── e2e/
│   │   ├── checkout.spec.ts          # Full purchase flow
│   │   ├── wholesale-login.spec.ts   # B2B authentication
│   │   └── accessibility.spec.ts     # WCAG 2.1 AA checks
│   ├── visual/
│   │   ├── __snapshots__/            # Git-tracked visual baselines
│   │   ├── constellation.visual.ts   # Product grid states
│   │   ├── cart-drawer.visual.ts     # Cart UI states
│   │   └── texture-reveal.visual.ts  # Reveal animation frames
│   ├── performance/
│   │   ├── benchmarks/               # Baseline snapshots for trends
│   │   └── texture-reveal.perf.ts    # <100ms verification
│   └── fixtures/
│       ├── products.ts               # Mock product data
│       ├── cart.ts                   # Mock cart data
│       └── shopify/
│           ├── storefront-responses.ts       # Mock Storefront API
│           └── customer-account-responses.ts # Mock B2B API
│
├── .env.example                      # Environment template
├── .gitignore
├── eslint.config.js                  # ESLint flat config
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── playwright.config.ts              # E2E + visual test config
├── react-router.config.ts            # React Router config
├── server.ts                         # Hydrogen server entry
├── storefrontapi.generated.d.ts      # Generated Shopify types
├── customer-accountapi.generated.d.ts
├── tailwind.config.ts                # Tailwind + design tokens
├── tsconfig.json
└── vite.config.ts                    # Vite + Hydrogen plugin
```

### Architectural Boundaries

**API Boundaries:**

| Boundary | Responsibility | Location |
|----------|----------------|----------|
| Storefront API | Product, cart, checkout | `app/graphql/`, Hydrogen utilities |
| Customer Account API | B2B authentication | `app/routes/wholesale/login.tsx` |
| Analytics Endpoint | Custom UX events | `app/lib/analytics.ts` → external |

**Component Boundaries:**

| Boundary | Communication Pattern |
|----------|----------------------|
| Zustand ↔ Components | Selector hooks (`use-exploration-state.ts`) |
| Cart Context ↔ Components | Hydrogen `useCart()` hook |
| Route ↔ Components | Props via loader data |
| Error Boundary ↔ Children | React error boundary pattern |

**Data Flow:**

```
Shopify Storefront API
        ↓
  Remix Loaders (SSR)
        ↓
  Route Components
        ↓
  Feature Components ←→ Zustand Store
        ↓
  UI Primitives (Radix + CVA)
```

### Cross-Cutting Concerns Locations

| Concern | Files |
|---------|-------|
| **Performance** | `app/lib/performance.ts`, `app/lib/shopify/preload.ts`, `tests/performance/` |
| **Accessibility** | All components (semantic HTML), `tests/e2e/accessibility.spec.ts` |
| **Analytics** | `app/lib/analytics.ts`, `app/stores/exploration.ts` |
| **Error Handling** | `app/components/errors/`, `app/content/errors.ts` |
| **Brand Consistency** | `app/styles/tokens.css`, `app/content/` |

### Development Workflow Integration

**Development Server:**
- `npm run dev` — Mock shop mode for UI development
- `npm run dev -- --env production` — Connected mode with real Shopify store

**Build Process:**
- Vite builds to Oxygen-compatible output
- GraphQL codegen runs pre-build for type safety
- Tailwind processes `tokens.css` → utility classes

**CI Pipeline:**
- Lint + type-check → Unit tests → Integration tests → E2E tests
- Lighthouse CI gates on Core Web Vitals
- Performance tests verify <100ms texture reveal

**Deployment:**
- Push to `main` triggers Oxygen deployment
- Preview deployments on PRs for visual review

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices work together without conflicts:
- Shopify Hydrogen (React Router 7.x) + Zustand: Both React-based, no conflicts
- Tailwind CSS + CSS Custom Properties: Tailwind `extend` integrates tokens seamlessly
- Framer Motion + <200KB bundle: Dynamic import protects budget
- Radix UI + WCAG 2.1 AA: Radix is accessibility-first by design
- IO preloading + <100ms texture reveal: Preload guarantees cache hit before interaction

**Pattern Consistency:**
All implementation patterns align with technology conventions:
- PascalCase components match React/Hydrogen conventions
- kebab-case utilities match Node.js conventions
- snake_case analytics events match industry standards
- Co-located tests match Vitest + Testing Library patterns

**Structure Alignment:**
Project structure fully supports all architectural decisions:
- Layer-based components in `app/components/{domain}/`
- Centralized content in `app/content/`
- Shopify-specific utilities isolated in `app/lib/shopify/`
- Comprehensive test organization across unit, integration, E2E, visual, and performance

### Requirements Coverage Validation ✅

**Functional Requirements Coverage (51/51):**

| FR Category | Count | Architectural Support |
|-------------|-------|----------------------|
| Product Discovery & Exploration | 9 | `ConstellationGrid`, `TextureReveal`, `StoryMoment` |
| Product Information | 3 | `ProductGallery`, `products.$handle.tsx` |
| Cart & Checkout B2C | 10 | `CartDrawer`, `CartLine`, Hydrogen Cart Context |
| Wholesale Portal B2B | 7 | `wholesale/*` routes, `PartnerDashboard`, `QuickReorder` |
| Attribution & Analytics | 7 | `app/lib/analytics.ts`, `exploration.ts` store |
| Post-Purchase | 4 | `orders/$id.tsx`, `app/content/` |
| Content & Navigation | 8 | `Header`, `Footer`, `StickyNav`, route structure |
| Accessibility | 3 | Radix primitives, semantic HTML, `accessibility.spec.ts` |

**Non-Functional Requirements Coverage (27/27):**

| NFR Category | Count | Architectural Support |
|--------------|-------|----------------------|
| Performance | 7 | IO preloading, dynamic imports, Lighthouse CI, performance tests |
| Accessibility | 7 | Radix primitives, semantic HTML, E2E accessibility tests |
| Integration | 4 | Shopify Storefront/Customer APIs, analytics sendBeacon |
| Reliability | 3 | Error boundaries, cart persistence, graceful degradation |
| UX Tone | 5 | Centralized error copy, warm messaging |
| Compliance | 1 | GDPR basics via Shopify |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All technology versions specified (TypeScript, Vite 6, React Router 7.x)
- Library sizes documented with budget impact
- 11 implementation patterns with code examples
- ESLint config provided for automated enforcement

**Structure Completeness:**
- 70+ files and directories explicitly defined
- Test organization covers all testing levels
- CI/CD pipeline structure in `.github/workflows/`
- Asset verification script for implementation gate

**Pattern Completeness:**
- All naming conventions documented with examples
- Co-location rules with threshold triggers
- Import organization with ESLint enforcement
- Error handling patterns for all boundary types

### Gap Analysis Results

**Critical Gaps:** None identified

**Important Gaps:** None identified

**Future Enhancements (Post-MVP):**
- Subscription billing architecture
- Dynamic B2B partner data from CMS
- Advanced caching strategies at scale
- CDN failover configuration

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

**Key Strengths:**
- Texture reveal performance contract protects core conversion mechanism
- Bundle budget is explicit and enforced via CI
- Dual-audience routing cleanly separated with dedicated layouts
- Error boundaries ensure commerce flow survives component failures
- Performance verification integrated into CI pipeline

**Areas for Future Enhancement:**
- Subscription billing when ready for V2
- Dynamic B2B partner data from CMS
- Advanced caching strategies at scale

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions
- Protect the <100ms texture reveal performance contract

**First Implementation Priority:**
```bash
npm create @shopify/hydrogen@latest -- \
  --language ts \
  --styling tailwind \
  --install-deps \
  --shortcut h2 \
  --markets subfolders
```

Then follow the Post-Init Setup sequence documented in Starter Template Evaluation.

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-24
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### Final Architecture Deliverables

**📋 Complete Architecture Document**
- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with 70+ files and directories
- Requirements to architecture mapping (51 FRs, 27 NFRs)
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**
- 7 core architectural decisions made
- 11 implementation patterns defined
- 5 component domains specified
- 78 requirements fully supported

**📚 AI Agent Implementation Guide**
- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**
- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**
- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs to technical implementation.

**🏗️ Solid Foundation**
The Hydrogen skeleton template and architectural patterns provide a production-ready foundation following 2026 best practices.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.

