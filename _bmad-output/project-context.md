---
project_name: 'isla-suds'
user_name: 'Bubbles'
date: '2026-01-24'
sections_completed: ['technology_stack', 'language_specific', 'framework_specific', 'testing', 'code_quality', 'workflow', 'critical_rules']
status: 'complete'
existing_patterns_found: 12
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Technology | Version | Notes |
|------------|---------|-------|
| Shopify Hydrogen | 2025.7.3 | Skeleton template, Oxygen hosting |
| React | 18.3.1 | |
| React Router | 7.12.0 | File-based routing |
| TypeScript | 5.9.2 | Strict mode enabled |
| Vite | 6.2.4 | With Hydrogen plugin |
| Tailwind CSS | 4.1.6 | PostCSS via @tailwindcss/vite |
| Node.js | ≥18.0.0 | Required runtime |

### Bundle Budget Constraints
- **Total JS budget:** <200KB gzipped
- **Framer Motion:** MUST be dynamically imported (contributes ~30-40KB)
- **Radix UI:** Selective use only (~15-20KB)
- **App code budget:** ~120-140KB remaining after libraries

### Performance Contract: Texture Reveal
- **Target:** <100ms from interaction to visual reveal
- **Mechanism:** Images MUST be preloaded via Intersection Observer before hover/tap is possible
- **Animation constraints:** GPU-composited properties ONLY (transform, opacity)
- **Zero network requests** during reveal interaction
- **Fallback:** Static image reveal if animation fails (graceful degradation)

### Path Aliases
- `~/` maps to `app/` directory (defined in tsconfig.json)
- Use `~/components/Header` not `../../../components/Header`

### Generated Types
- Shopify types are auto-generated via codegen
- `storefrontapi.generated.d.ts` - Storefront API types
- `customer-accountapi.generated.d.ts` - Customer Account API types
- **NEVER hand-write Shopify types** - run `npm run codegen`

### CI Quality Gates
- **Lighthouse CI:** Core Web Vitals must pass before merge
- **Bundle size:** Automated check against <200KB threshold
- **Texture reveal timing:** p95 < 100ms via Performance API in Playwright
- **TypeScript:** Strict mode violations fail the build

---

## Language-Specific Rules

### TypeScript Configuration
- **Strict mode:** Enabled - no implicit any, strict null checks
- **verbatimModuleSyntax:** Use `import type { X }` for type-only imports
- **Module:** ES2022 with Bundler resolution
- **Path alias:** `~/` resolves to `app/` directory

### Import Organization (enforced order)
1. React/framework imports (`react`, `react-router`)
2. External libraries (`framer-motion`, `zustand`)
3. Internal absolute imports (`~/components/...`)
4. Relative imports (`./`, `../`)
5. Type imports (always last, use `import type`)

### Naming Conventions
| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase.tsx | `TextureReveal.tsx` |
| Utilities | kebab-case.ts | `scroll-utils.ts` |
| Hooks | use-camelCase.ts | `use-exploration-state.ts` |
| Constants | SCREAMING_SNAKE | `TEXTURE_REVEAL_THRESHOLD` |
| Types/Interfaces | PascalCase | `Product`, `CartLine` |
| Props interfaces | ComponentNameProps | `TextureRevealProps` |

### Event Naming Conventions
| Context | Pattern | Example |
|---------|---------|---------|
| Analytics events | snake_case | `texture_reveal`, `cart_opened` |
| Internal handlers | camelCase | `handleTextureReveal`, `onCartOpen` |
| Custom hooks | useCamelCase | `useTextureReveal` |

### Promise Handling (ESLint enforced)
- `void` keyword required for intentionally unhandled promises
- Never pass async functions directly to event handlers without wrapping
- Example: `onClick={() => { void navigate(-1); }}`

### Class Name Composition
Always use the `cn()` utility from `~/utils/cn`:
```typescript
import { cn } from '~/utils/cn';
className={cn('base-class', conditional && 'conditional-class')}
```
**NEVER** use template literals for conditional Tailwind classes.

### CVA Organization
- **Single component:** Co-locate CVA in component file
- **Shared variants:** Extract to `app/lib/variants.ts`
- **20-line rule:** If CVA exceeds 20 lines, extract to `app/lib/variants/[component].ts`

### Content Centralization
| Content Type | Location |
|--------------|----------|
| Error messages | `app/content/errors.ts` |
| B2B copy | `app/content/wholesale.ts` |
| Story fragments | `app/content/story.ts` |
| Product copy | Shopify metafields (CMS) |

**NEVER** hardcode user-facing strings in components.

### Test Naming Convention
```typescript
// ✅ Behavior-focused, readable as documentation
it('reveals texture when user hovers on desktop')
it('preloads images when constellation enters viewport')

// ❌ Vague or implementation-focused
it('should work correctly')
it('test hover')
```

### Test File Location
- **Co-located:** `TextureReveal.test.tsx` next to `TextureReveal.tsx`
- **200-line rule:** If test exceeds 200 lines, move to `/tests/unit/` with matching path

---

## Framework-Specific Rules

### React Patterns
- **Props interface:** Always `ComponentNameProps` pattern
- **Extend HTML attributes** when wrapping DOM elements:
  ```typescript
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
  }
  ```
- **Suspense boundaries:** Use for async data with meaningful fallbacks
- **Error boundaries:** Wrap components that can fail gracefully

### Hydrogen-Specific Rules
- **Cart operations:** Use `useCart()` and `useOptimisticCart()` from `@shopify/hydrogen`
- **Analytics:** Use `useAnalytics()` for Shopify commerce events
- **Caching:** Use `storefront.CacheLong()` for header/footer, default for dynamic content
- **Critical vs Deferred data:**
  - Critical: `loadCriticalData()` - blocks render, must succeed
  - Deferred: `loadDeferredData()` - loads after paint, can fail gracefully

### React Router Patterns
- **Loaders:** SSR-first data fetching, use for all page data
- **Actions:** Form mutations via `useFetcher()`
- **Navigation state:** `useNavigation().state` for route loading indicators
- **Mutation state:** `useFetcher().state` for form submissions

### State Management Architecture
| State Type | Solution | Use Case |
|------------|----------|----------|
| UI State | Zustand | Exploration tracking, cart drawer open/close |
| Cart State | Hydrogen Cart Context | Cart operations, optimistic updates |
| Server State | React Router loaders | Product data, collections, user data |

### Loading State Pattern
| Scenario | Pattern |
|----------|---------|
| Route loading | `useNavigation().state` |
| Mutations | `useFetcher().state` |
| Client-only | Boolean state (`isLoading`) |
| UI indication | Skeleton components, NOT spinners |

### Smooth Scroll (Lenis)
- **B2C routes:** Initialize Lenis in `app/root.tsx` for desktop smooth scroll
- **B2B routes (`/wholesale/*`):** Lenis is NOT initialized - native scroll only
- **Mobile:** Lenis disabled (native scroll performs better)
- **Cleanup:** Always destroy Lenis instance on unmount

### Framer Motion (Dynamic Import Required)
```typescript
// ✅ Correct: Dynamic import (protects bundle budget)
const MotionDiv = lazy(() =>
  import('framer-motion').then(m => ({ default: m.motion.div }))
);

// ❌ Wrong: Static import breaks <200KB budget
import { motion } from 'framer-motion';
```

### Image Preloading Strategy
- **Trigger:** Intersection Observer when constellation enters viewport
- **Priority:** `fetchpriority="high"` for first 2 visible products
- **Mobile:** Preload all 4 products when grid is visible (no hover intent)
- **Format:** WebP/AVIF via Shopify CDN (automatic optimization)
- **Flow:** IO observes → inject `<link rel="preload">` → cache hit on reveal

### Error Boundary Placement
| Component | Fallback Behavior |
|-----------|-------------------|
| `TextureReveal` | Silent - show static image |
| `CartDrawer` | Link to `/cart` page |
| `AnimationLayer` | No animation, commerce works |
| Route boundary | Warm "Something went wrong" with retry |

### Dual-Audience Architecture
| Aspect | B2C (Consumer) | B2B (Wholesale) |
|--------|----------------|-----------------|
| Layout | Immersive, animated | Minimal, efficient |
| Scroll | Lenis smooth scroll | Native browser scroll |
| Animations | Framer Motion enabled | Disabled |
| Tone | Exploratory, story-driven | Transactional, fast |
| Navigation | Constellation discovery | Direct dashboard access |

### Performance Instrumentation
```typescript
// Texture reveal timing - REQUIRED for all reveal implementations
performance.mark('texture-reveal-start');
// ... reveal animation
performance.mark('texture-reveal-end');
performance.measure('texture-reveal', 'texture-reveal-start', 'texture-reveal-end');
```

### Component Organization
```
app/components/
  ui/           # Button, Dialog, Input (Radix + CVA)
  product/      # ProductCard, TextureReveal, ConstellationGrid
  cart/         # CartDrawer, CartLine, CartSummary
  layout/       # Header, Footer, StickyNav
  story/        # StoryMoment, PausePoint
  wholesale/    # B2B portal components
  errors/       # RouteErrorBoundary, ComponentErrorBoundary
```

---

## Testing Rules

### Test Organization
| Test Type | Location | Example |
|-----------|----------|---------|
| Unit tests | Co-located with source | `TextureReveal.test.tsx` |
| Integration tests | `/tests/integration/` | `cart-flow.test.ts` |
| E2E tests | `/tests/e2e/` | `checkout.spec.ts` |
| Visual regression | `/tests/visual/` | `constellation.visual.ts` |
| Performance tests | `/tests/performance/` | `texture-reveal.perf.ts` |

### Test Priority Matrix
| Priority | What to Test | Coverage Level |
|----------|--------------|----------------|
| P0 - Critical | Texture reveal <100ms, cart persistence, checkout flow | 100% paths |
| P1 - High | Add to cart, product display, B2B login | All happy + main error paths |
| P2 - Medium | Navigation, search, story moments | Happy path + edge cases |
| P3 - Low | Footer links, static pages | Smoke tests only |

### Test Boundaries
- **Unit tests:** Single component/function in isolation
- **Integration tests:** Multiple components working together
- **E2E tests:** Full user journeys through real browser
- **Visual tests:** Screenshot comparisons for UI states

### Bug Fix Testing Protocol
Every bug fix MUST include a test that:
1. **Reproduces** the bug (fails before fix)
2. **Passes** after the fix is applied
3. **Prevents** regression in future

No exceptions unless: UI-only bugs requiring visual inspection.

### Mock Conventions
```typescript
// ✅ Correct: Use fixture factory
import { createMockProduct } from '~/tests/fixtures/products';
const product = createMockProduct({ title: 'Test Soap' });

// ❌ Wrong: Inline mock objects (missing required fields)
const product = { id: '123', title: 'Test' };
```

**Fixture Locations:**
- `/tests/fixtures/products.ts` - Product data factories
- `/tests/fixtures/cart.ts` - Cart data factories
- `/tests/fixtures/shopify/storefront-responses.ts` - Storefront API mocks
- `/tests/fixtures/shopify/customer-account-responses.ts` - B2B API mocks

### Texture Reveal Performance Test
```typescript
// tests/performance/texture-reveal.perf.ts
test('texture reveal completes under 100ms at p95', async ({ page }) => {
  await page.goto('/');
  await page.hover('[data-testid="product-card"]');

  const timing = await page.evaluate(() => {
    const entries = performance.getEntriesByName('texture-reveal');
    return entries.map(e => e.duration);
  });

  const p95 = calculateP95(timing);
  expect(p95).toBeLessThan(100);
});
```
**This is a CI gate. Failure blocks merge.**

### Cart Persistence Test Scenarios
1. Add item → close browser → reopen → cart should have item
2. Add item → cart ID expires → graceful recovery to empty cart
3. Add item → localStorage cleared → new cart created silently
4. B2B partner → cart should NOT persist between sessions (security)

### Visual Regression Test States
For `constellation.visual.ts`, capture:
- Default (all products visible)
- Hover state (texture revealed)
- Mobile layout (stacked, no hover)
- Loading state (skeleton placeholders)
- Error state (graceful degradation)

Baselines stored in `/tests/visual/__snapshots__/` (git-tracked).

### Flakiness Policy
- Flaky tests are **immediately quarantined**, not skipped
- Root cause analysis required within 48 hours
- Three flaky failures = test rewrite required
- Never `test.skip()` without linked issue

### Accessibility Testing
- E2E accessibility in `/tests/e2e/accessibility.spec.ts`
- WCAG 2.1 AA compliance required
- All interactive elements keyboard navigable
- Touch targets minimum 44x44px on mobile

---

## Code Quality & Style Rules

### ESLint Configuration
- **Config format:** ESLint 9.x flat config (`eslint.config.js`)
- **no-console:** Warns - only `console.warn()` and `console.error()` allowed
- **Promise handling:** `@typescript-eslint/no-floating-promises: error`
- **Import order:** Enforced via `eslint-plugin-import`
- **Accessibility:** `eslint-plugin-jsx-a11y` for WCAG compliance

### Prettier Configuration
- Uses `@shopify/prettier-config`
- Run `prettier --write` before commit
- Integrated with ESLint via `eslint-config-prettier`

### Exception Handling
Every try/catch block MUST either:
- Log the error AND re-raise/rethrow, OR
- Have an explicit comment explaining why it's safe to continue

```typescript
// ❌ BAD: Silent failure
try { doThing(); } catch (e) { /* nothing */ }

// ✅ GOOD: Log and rethrow
try { doThing(); } catch (e) {
  console.error(e);
  throw e;
}

// ✅ GOOD: Explicit justification
try { doThing(); } catch (e) {
  // Safe to continue: optional analytics, failure doesn't affect core flow
}
```

### No Defensive Coding for Impossible Cases
```typescript
// ❌ BAD: Required dep can't be undefined
if (requiredService) { requiredService.call(); }

// ✅ GOOD: Just use it - fail fast if assumption violated
requiredService.call();
```

### Anti-Over-Engineering Rules
- **No speculative features:** Don't add what wasn't requested
- **No premature abstraction:** Three similar lines > unnecessary helper
- **No feature flags for new code:** Just change the code directly
- **No backwards-compat shims:** If unused, delete completely
- **No hypothetical edge cases:** Only handle what can actually happen

### Bounded Queries
All Shopify Storefront API queries MUST have explicit limits:
```typescript
// ❌ BAD: Unbounded
const { products } = await storefront.query(ALL_PRODUCTS_QUERY);

// ✅ GOOD: Explicit limit
const { products } = await storefront.query(PRODUCTS_QUERY, {
  variables: { first: 12 }
});
```

### File & Folder Structure
```
app/
  components/     # React components by domain
  content/        # Centralized copy and messages
  graphql/        # GraphQL fragments, queries, mutations
  hooks/          # Custom React hooks
  lib/            # Utilities and helpers
  routes/         # React Router file-based routes
  stores/         # Zustand state stores
  styles/         # CSS and design tokens
  types/          # TypeScript type definitions
  utils/          # Small utility functions
```

### Design Token Naming
```css
/* Semantic color tokens */
--canvas-base: #FAF7F2;      /* Primary background */
--canvas-elevated: #F5F0E8;  /* Cards, modals */
--text-primary: #2C2416;     /* Body text */
--text-muted: #8C8578;       /* Secondary text */
--accent-primary: #3A8A8C;   /* CTAs, links */

/* Spacing scale */
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;

/* Animation tokens */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--duration-reveal: 300ms;
```

### Documentation Philosophy
- **Code is documentation:** Self-documenting names over comments
- **Comments explain WHY, not WHAT:** The code shows what, comments explain why
- **No obvious comments:** Never `// increment counter` before `counter++`
- **No commented-out code:** Delete it, git has history
- **Type annotations ARE documentation:** Prefer types over JSDoc

### When to Add Comments
✅ Complex business logic that isn't obvious
✅ Performance optimizations with non-obvious tradeoffs
✅ Workarounds for external bugs (with link to issue)
✅ Security-sensitive code explaining the protection

❌ What the code literally does
❌ Closing brace labels (`// end if`)
❌ TODO without linked issue

### CI Quality Gates (PR Blockers)
| Check | Tool | Failure Threshold |
|-------|------|-------------------|
| Type errors | `tsc --noEmit` | Any error |
| Lint errors | `eslint` | Any error |
| Format | `prettier --check` | Any diff |
| Unit tests | `vitest` | Any failure |
| Bundle size | Custom check | >200KB gzipped |
| Lighthouse | Lighthouse CI | Core Web Vitals fail |

### Pre-Commit Behavior
- If pre-commit hook fails: **fix and create NEW commit**
- **NEVER** use `--no-verify` to skip hooks
- **NEVER** amend after hook failure (destroys previous work)

---

## Development Workflow Rules

### Development Modes
| Mode | Command | Use Case |
|------|---------|----------|
| Mock Shop | `npm run dev` | UI development, no Shopify dependency |
| Connected | `npm run dev -- --env production` | Integration testing with real store |

### Available Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build with codegen |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run codegen` | Generate Shopify + React Router types |

### Hydrogen CLI Shortcuts
| Command | Purpose |
|---------|---------|
| `h2 dev` | Start dev server |
| `h2 build` | Production build |
| `h2 preview` | Preview build locally |
| `h2 codegen` | Generate GraphQL types |
| `h2 env pull` | Pull env vars from Shopify |

### GraphQL Codegen Workflow
1. Write/modify GraphQL query in `app/graphql/`
2. Run `npm run codegen` to regenerate types
3. Import types from generated files
4. **NEVER** manually type Shopify responses

```typescript
// ✅ Correct: Use generated types
import type { ProductQuery } from 'storefrontapi.generated';

// ❌ Wrong: Manual typing
interface Product { id: string; title: string; }
```

### Environment Variables
- **NEVER** access `process.env` directly in components
- Use Hydrogen's context pattern via loaders
- Pull from Shopify: `h2 env pull`

### Implementation Sequence (Dependency Order)
1. Skeleton init + design tokens
2. Zustand store setup
3. Component structure scaffold
4. **GATE: Verify texture macro images in Shopify**
5. Texture reveal with IO preloading
6. Cart with persistence + drawer state
7. Error boundaries with centralized copy
8. Analytics instrumentation
9. Performance verification tests
10. B2B portal routes + partner data

**Steps 1-4 MUST complete before 5-10 can begin.**

### Git Workflow
- **Main branch:** `main` - production deployments
- **Feature branches:** `feature/[ticket-id]-brief-description`
- **Fix branches:** `fix/[ticket-id]-brief-description`

### Commit Message Format
```
<type>: <description>

[optional body]

Co-Authored-By: Claude <noreply@anthropic.com>
```
Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

### PR Requirements
- All CI checks passing
- At least one approval
- No unresolved conversations
- Preview deployment reviewed

### Hot Reload Behavior
**Auto-reloads on change:**
- Component files, Route files, CSS/Tailwind, GraphQL queries (after codegen)

**Requires dev server restart:**
- `vite.config.ts`, `tailwind.config.ts`, env var changes, new dependencies

**Requires full rebuild:**
- `tsconfig.json`, React Router config changes

### Debugging Workflow
1. Check browser DevTools console first
2. Check Vite terminal for SSR errors
3. For Shopify API issues: check Network tab for GraphQL responses
4. For hydration mismatches: compare SSR output vs client render

### Pre-Implementation Gate
Before implementing texture reveal or product features:
1. Run `scripts/verify-shopify-assets.ts`
2. Confirm texture macro images exist in Shopify
3. Verify image URLs are accessible

### Deployment Pipeline
1. Push to feature branch
2. PR triggers: lint → typecheck → test → Lighthouse CI
3. Preview deployment created for visual review
4. Merge to `main` triggers Oxygen production deployment

---

## Critical Don't-Miss Rules

### THE FIVE COMMANDMENTS

1. **Protect the <100ms texture reveal** - It's not a feature, it's THE conversion mechanism
2. **Bundle budget is law** - >200KB = PR rejected, no exceptions
3. **Commerce MUST work** - If animations fail, cart and checkout still function
4. **Warm tone always** - No generic errors, no technical jargon to users
5. **B2B ≠ B2C** - Different audiences, different experiences, clean separation

### Anti-Patterns to Avoid
- **Static Framer Motion import** - Breaks bundle budget, MUST use dynamic import
- **Hardcoded user-facing strings** - All copy must come from `app/content/`
- **Manual Shopify types** - Use generated types from codegen
- **Unbounded API queries** - Always include `first:` or `limit` parameter
- **Silent exception swallowing** - Log and rethrow, or justify in comment
- **Template literals for Tailwind** - Use `cn()` utility instead
- **Direct process.env access** - Use Hydrogen context via loaders

### Hydration Mismatch Prevention
Common causes agents must avoid:
- `Date.now()` or `Math.random()` in render
- Browser-only APIs (`window`, `localStorage`) without `useEffect`
- Conditional rendering based on `typeof window`

```typescript
// ❌ BAD: Causes hydration mismatch
const isClient = typeof window !== 'undefined';
return isClient ? <ClientComponent /> : null;

// ✅ GOOD: Use useEffect for client-only
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return <Skeleton />;
return <ClientComponent />;
```

### Shopify Image URLs
- **NEVER** hardcode image dimensions in URL
- Use Shopify's `Image` component or `getImageLoadingProperties`
- CDN automatically serves WebP/AVIF based on browser

### Architectural Boundaries (DO NOT CROSS)
| Boundary | Rule |
|----------|------|
| Components → Shopify API | NEVER call API directly; use loaders |
| UI State → Cart State | Zustand for UI, Hydrogen Context for cart |
| B2C → B2B code | No shared components except `ui/` primitives |
| Client → Server secrets | NEVER import server modules in client code |

### The Single Source of Truth
| Data | Source |
|------|--------|
| Product data | Shopify Storefront API via loaders |
| Cart state | Hydrogen Cart Context |
| UI state | Zustand `exploration` store |
| Error messages | `app/content/errors.ts` |
| B2B copy | `app/content/wholesale.ts` |

### Performance Gotchas
- **Texture reveal images not preloaded** - <100ms is impossible without IO preloading
- **Framer Motion on initial load** - Must be lazy loaded after first paint
- **Lenis on mobile** - Hurts performance, disable on touch devices
- **Large component bundles** - Split by route, lazy load non-critical

### Security Rules
- **B2B cart persistence** - Must NOT persist between sessions
- **Environment variables** - Never expose in client bundle
- **Shopify tokens** - Only access via server-side loaders

### Test Data Rules
- **NEVER** use real Shopify product IDs in tests
- **NEVER** depend on specific product inventory levels
- **ALWAYS** use fixture factories with deterministic data
- **NEVER** test against production Shopify store in CI

### Accessibility Gotchas
- **Texture reveal:** MUST have keyboard equivalent (Enter/Space triggers reveal)
- **Cart drawer:** Focus trap required when open, return focus on close
- **Animations:** MUST respect `prefers-reduced-motion`
- **Touch targets:** Minimum 44x44px, even on decorative elements if clickable
- **Color contrast:** 4.5:1 for normal text, 3:1 for large text

### Reduced Motion Pattern
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  showStaticReveal();
} else {
  animateReveal();
}
```

### Conversion-Critical Rules
- **Texture reveal IS the product:** <100ms is non-negotiable
- **Cart persistence:** Abandoned carts = lost revenue. Test cart recovery.
- **Checkout redirect:** NEVER break the Shopify checkout redirect
- **Error recovery:** Warm messaging turns frustration into trust

### User Trust Patterns
- Payment failure: "That didn't go through. No worries—let's try again."
- Cart error: "Having trouble loading your cart. [View cart page →]"
- **NEVER** show stack traces or technical errors to users

### Edge Cases to Handle
- **Cart ID expired on Shopify** - Graceful recovery to new cart
- **Texture image fails to load** - Show static image, don't break reveal
- **Animation fails** - Commerce flow must still work
- **Network timeout** - Warm retry messaging, not generic errors

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Reference `architecture.md` for detailed architectural decisions

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

---

*Last Updated: 2026-01-24*
