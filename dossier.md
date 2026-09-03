# Repository Dossier — `isla-suds`

**Generated:** 2026-09-03 · **Ref:** `main` @ `2dd2b3d` · **Scope:** static read of the working tree (dependencies were not installed, so no build, lint, typecheck, or test run backs the claims below — everything here is read from source).

---

## 1. What this is

A **Shopify Hydrogen headless storefront** for Isla Suds, a goat-milk soap brand. It is a single-package, single-author project deployed to **Shopify Oxygen** edge workers (workerd runtime).

It is not a generic storefront. Two things dominate the codebase:

1. **A heavily art-directed D2C landing experience** — a pinned, scroll-scored homepage driven by GSAP + Lenis, with a bespoke preloader animation. ~16k lines of the ~28.5k app lines are components, most of that presentational.
2. **A tag-gated B2B wholesale portal** at `/wholesale/*` — separate auth flow, order history, reorder, and invoice-request path, deliberately kept free of the motion stack.

| Metric | Value |
| --- | --- |
| App source (`app/**.ts,tsx`) | ~28,475 lines |
| Routes | 46 files |
| Components (non-test `.tsx`) | 86 |
| CSS Modules | 43 |
| Colocated Vitest specs | 39 |
| Playwright specs | 25 |
| Commits / authors | 50 / 1 (Curtis Blanton), squash-merged PRs up to #110 |
| Active period | 2026-02-13 → 2026-08-27 |
| Package manager | pnpm 10.30.2 (`packageManager` pinned) |

---

## 2. Stack

| Layer | Choice | Version |
| --- | --- | --- |
| Commerce framework | `@shopify/hydrogen` | 2026.1.3 |
| Router / SSR | React Router 7 (framework mode) | 7.12.0 |
| React | React | 18.3.1 (not 19) |
| Build | Vite 6 + `@shopify/mini-oxygen` | 6.4.1 |
| Runtime | Shopify Oxygen (workerd) | — |
| Styling | Tailwind CSS v4 (Vite plugin) + CSS Modules + `tokens.css` | 4.2.2 |
| Motion | GSAP 3.14 + `@gsap/react` + Lenis | — |
| Client state | Zustand (UI-only) | 5.0.12 |
| Primitives | Radix (`dialog`, `navigation-menu`), `lucide-react`, `class-variance-authority` | — |
| Maps | Leaflet + react-leaflet (client-only) | — |
| Transactional email | Resend | 6.10.0 |
| Images | `@responsive-image/*` + `vite-plugin-image-optimizer` + sharp/svgo | — |
| Unit tests | Vitest 4 + Testing Library + jsdom | — |
| Browser tests | Playwright 1.59 + `@axe-core/playwright` | — |
| Perf gate | Lighthouse CI 0.15 | — |
| Node | CI runs 24; `engines` says `>=18` | — |

**Mixed styling systems is deliberate but unenforced.** Tailwind utilities, 43 CSS Modules, and a token layer coexist with no documented rule for which to reach for. Read as: Tailwind for layout, CSS Modules for anything animated or scoped.

---

## 3. Architecture

### Request path

```
server.ts  (Oxygen fetch handler)
  └─ createHydrogenRouterContext()      app/lib/context.ts
       ├─ caches.open('hydrogen')
       ├─ AppSession.init()             app/lib/session.ts  (cookie, SESSION_SECRET)
       └─ createHydrogenContext()       storefront | customerAccount | cart | env | i18n
  └─ createRequestHandler()             React Router server build
  └─ session.isPending → Set-Cookie
  └─ 404 → storefrontRedirect()         Shopify URL redirects before giving up
```

`entry.server.tsx` builds a **nonce-based CSP** via `createContentSecurityPolicy()`, widening `imgSrc` for `cdn.shopify.com`, OpenStreetMap tiles, and `data:`. Bots get `await body.allReady` (full buffering); humans get the stream.

### Session

`AppSession` (`app/lib/session.ts`) wraps React Router's cookie session storage and implements `HydrogenSession`. Its one non-obvious behavior: `set`/`unset` getters flip `isPending = true`, and only then does `server.ts` emit `Set-Cookie`. Cookie is `httpOnly`, `sameSite: lax`, `secure` in production.

### Routing

`app/routes.ts` = `hydrogenRoutes([...await flatRoutes()])`. Flat-file convention, 46 route modules. Route types come from `react-router typegen` (`./+types/<route>`); GraphQL types from `shopify hydrogen codegen` into two generated `.d.ts` files at the repo root (~94k lines combined, committed).

### Data-fetching convention

Consistent and worth preserving: every non-trivial route splits `loadCriticalData()` (awaited, blocks TTFB, page may 500) from `loadDeferredData()` (streamed, must not throw). `root.tsx` awaits the header query and defers the footer. Root `shouldRevalidate` returns `false` on GET navigation — a deliberate perf trade that risks stale UI, and the code says so.

### GraphQL organization — split, and inconsistently

- `app/lib/fragments.ts` — shared fragments + `HEADER_QUERY` / `FOOTER_QUERY` / `CART_QUERY_FRAGMENT`.
- `app/graphql/{storefront,product,customer-account}/` — 14 extracted operation files.
- **13 route files still declare `#graphql` operations inline.** Both patterns are live; nothing decides between them.

`.graphqlrc.ts` runs two codegen projects (storefront + customer-account) with the customer-account documents explicitly excluded from the default project.

### Content layer

`app/content/*.ts` holds copy, FAQs, testimonials, ingredient data, store lists, and route constants as typed modules — ~1,637 lines. Several have their own unit tests. This keeps marketing copy out of JSX and is one of the cleaner decisions in the repo.

### Motion architecture

- `app/lib/scroll.ts` — Lenis initialized **desktop-only (≥1024px)**, driven from `gsap.ticker` (not its own rAF) so ScrollTrigger and Lenis share a clock; bails on `prefers-reduced-motion`; dynamically imported so mobile never pays the bundle.
- `app/lib/motion/` — `prefersReducedMotion()`, tokens, and `refresh.ts` (`observeLayoutShifts`, `requestScrollRefresh`).
- `app/lib/motion-guard.ts` — `isB2BRoute()` / `shouldDisableMotion()` keep `/wholesale/*` off the animation path.
- **Oxygen hazard, documented in `CLAUDE.md` and honored in code:** `gsap.registerPlugin()` is always wrapped in `if (typeof document !== 'undefined')`. Unguarded, `useGSAP` starts a ticker rAF at module scope and workerd fails the deploy with `Disallowed operation called within global scope`.
- `app/root.tsx` preloads the Antonio variable font because `font-display: swap` on vw-sized display headings reflows the page and invalidates every ScrollTrigger measurement below the fold.

The homepage (`app/routes/_index.tsx`) renders all sections **eagerly, not via `React.lazy`** — the comment explains why: lazy sections mean ScrollTrigger measures a one-viewport document, and CSS-module extraction is lost. That is a real constraint, correctly reasoned.

### Wholesale (B2B)

Gate is a **Shopify customer tag**, not Shopify B2B companies:

```ts
// app/lib/wholesale.ts
const WHOLESALE_TAG = 'wholesale';
isWholesaleCustomer(customer)          // customer.tags.includes('wholesale')
requireWholesaleSession(context)       // throws redirect to /wholesale/login
```

Flow: `/wholesale/login` → Customer Account API OAuth → `/wholesale/login/callback` verifies the tag → `session.set('customerId')` → `/wholesale`. Non-tagged customers are bounced with `?error=not_b2b`. Order history, order detail, reorder, and a `/wholesale/order` form live behind it, backed by 11 customer-account GraphQL documents.

`app/lib/shopify-admin.server.ts` reaches the **Admin REST API** (`2025-01`, `write_customers`) to create/tag customers on partner registration — the Storefront API can't set tags.

### Build tuning

`vite.config.ts` does real work: manual chunks for `gsap`, `@responsive-image`, and `tailwind-merge`+`clsx`; `assetsInlineLimit: 0` so a strict CSP holds; sourcemaps off; responsive image generation at 6 widths in avif/webp with thumbhash LQIP; `ANALYZE=1` opt-in bundle analyzer; the React Router plugin swapped for plain `@vitejs/plugin-react` in test mode.

---

## 4. Quality gates

### CI (`.github/workflows/ci.yml`)

Strictly sequential fail-fast chain:

```
lint (ESLint) → typecheck (tsc) → test (Vitest) → bundle-size (build + gzip budget)
                                                     ├→ lighthouse       ┐
                                                     ├→ accessibility    ├ secret-gated
                                                     └→ smoke-tests      ┘
playwright-verify (config existence only) ← lint
```

The `check-storefront-secrets` job reads `secrets.PUBLIC_STOREFRONT_API_TOKEN` and **skips Lighthouse, axe, and smoke tests when it's absent**, emitting a `::notice::`. Sensible for forks; it also means those three gates are silently inert on any repo without the Shopify custom-app integration. Verify they actually run before trusting them.

### Deploy (`.github/workflows/deploy.yml`)

Triggers on `workflow_run` **completion** of CI on `main`, not on push — the header comment records the bug this fixed: a prior `verify-ci` job enumerated completed check runs while CI was still starting, saw an empty list, and passed vacuously, shipping red builds. It now checks out `github.event.workflow_run.head_sha` so it deploys the exact commit CI validated. That is the correct fix.

### Budgets

- **Bundle:** `scripts/check-bundle-size.mjs`, gzipped `dist/client/**/*.js`. Constant is `MAX_BUNDLE_SIZE_KB = 400`; the docstring above it still says 200KB. One of the two is wrong.
- **Lighthouse:** perf ≥ 0.90 and a11y ≥ 0.90 as **errors**; best-practices/SEO as warnings. LCP < 2.5s, CLS < 0.1, FID < 100ms as errors.
- **Playwright:** 10 projects — smoke across iPhone SE / Pixel 7 / desktop; e2e across chromium/firefox/webkit/mobile-chrome/mobile-safari; plus `accessibility` and `performance` projects. CI: 2 retries, 1 worker, `forbidOnly`.

### Test shape

39 colocated Vitest specs (components, hooks, stores, content, lib) + 25 Playwright specs across e2e / accessibility / performance / integration / smoke, with `tests/support/{factories,fixtures,helpers}`. Priority tagging (`[P0]`, `[P1]`) is used and wired to `test:e2e:p0` / `:p1` scripts.

---

## 5. Tooling and process scaffolding

This repo carries an unusually large AI-agent surface, checked in:

- **`_bmad/`** — the BMAD agent framework (`bmm`, `cis`, `core`, `_config`, `_memory`), exposed as skills.
- **`_bmad-output/`** — ~40 implementation artifacts, story files, code reviews, and epic retrospectives. This is the real project history: epics 1–8 covering scroll experience, product reveals, cart, wholesale, and sharing.
- **`.claude/`** — 10 slash commands, GSAP skills, plus two enforcement hooks: `prevent-direct-push.py` and `conventional-commits.py`.
- **`.serena/memories/`** — 7 curated context files (tech stack, conventions, codebase structure, task-completion checklist).
- **`.gemini/commands/`** — BMAD workflows mirrored as TOML.
- **`.agents/skills/`** + `skills-lock.json` — 7 pinned GSAP skills from `greensock/gsap-skills`, hash-locked.
- **`.mcp.json`** — one MCP server: `@modelcontextprotocol/server-memory`.

Cost of this: `_bmad*`, `.claude`, `.gemini`, `.serena`, `guides`, `docs` all have to be explicitly excluded in `vite.config.ts`'s Vitest `exclude` array. That list is load-bearing and brittle.

`docs/` holds six operational runbooks (wholesale metafield setup, discount updates, payment-retry behavior, order-confirmation email template). `CHANGELOG.md` (106KB) is the **upstream Hydrogen skeleton changelog**, not this project's.

---

## 6. Findings

Ordered by how much they'd cost you. Every item was read in source; none is inferred.

### High

**1. `/dev/preloader` and `/dev/preloader-scene` ship to production.**
`app/routes/dev.preloader.tsx` and `dev.preloader-scene.tsx` are ordinary flat routes with animation-tuning UI (replay button, freeze checkbox, min-display slider). There is no `NODE_ENV` check, no `throw new Response(null, {status: 404})`, no route-config exclusion. They are publicly reachable on the deployed store. Fix: guard the loader on `process.env.NODE_ENV !== 'production'` or drop them from `flatRoutes()`.

**2. Unescaped user input interpolated into outbound email HTML.**
`app/lib/email.server.ts` builds the contact-form email as a template literal:

```ts
html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p> ... ${message}`
```

`app/routes/contact.tsx` validates only that the email is well-formed; `name`, `subject`, and `message` go through raw. Any submitter can inject arbitrary HTML — links, styled spoof content — into an email that arrives at `FOUNDER_EMAIL` from `notifications@islasuds.com`. Low blast radius (one internal recipient), but it's a free phishing primitive. Fix: an `escapeHtml()` helper applied to every interpolation.

### Medium

**3. The deprecated wholesale helper is still the only one called.**
`getB2BCompany()` is marked `@deprecated ... kept temporarily to surface call sites at compile time`. It is called in **four route files at six sites**; `isWholesaleCustomer()` — the intended replacement — has **zero callers outside its own definition**. The migration was set up and never executed, and `getB2BCompany` returns a fake `{id: 'tag-based', name: 'wholesale'}` object purely so old truthiness checks keep working. Delete the shim and fix the call sites.

**4. `package.json` advertises seven test commands whose files don't exist.**
`test:e2e:wholesale`, `test:integration:wholesale`, `test:perf:wholesale`, and `test:wholesale` point at `tests/**/*wholesale-reorder*.spec.ts` — none present. `test:component` points at `tests/component/` — directory absent (those tests were moved to colocation under `app/`). Each fails or silently matches nothing. `tests/README.md` documents the same phantom files plus `wholesale.fixture.ts` and `wholesale-order.factory.ts`, neither of which exists. The wholesale portal is the highest-risk surface in the app and its browser-level coverage is the part that went missing.

**5. `README.md` is still the stock Hydrogen skeleton README.**
It describes "Hydrogen template: Skeleton," tells you to run `npm create @shopify/hydrogen@latest`, and points at Remix v1 docs. Nothing in it mentions Isla Suds, pnpm, the wholesale portal, or the required env vars. `CLAUDE.md` and `.serena/memories/` are the actual onboarding documents — which means a human contributor gets worse instructions than an agent does.

### Low

**6. `.actrc` points at a directory that isn't in the repo.**
`--workflows tools/scripts/github/workflows/`; `tools/` does not exist. Local `act` runs won't find anything. Also duplicates `--container-architecture` and `-P/--platform`.

**7. Bundle-budget docstring contradicts the constant.** Docstring: 200KB gzipped. Code: `MAX_BUNDLE_SIZE_KB = 400`.

**8. `motion-guard.ts` documents a dependency that isn't installed.** Every comment says "Framer Motion" ("prevent Framer Motion usage in B2B routes"). The project uses GSAP; `framer-motion` is not in `package.json`. The guard works — the doc is a fossil from an earlier stack decision.

**9. `ThemeSwitcher` is dead code.** `app/components/ThemeSwitcher.tsx` exists and `CLAUDE.md` lists it under Styling, but nothing imports it.

**10. `app/cookie.server.ts` is entirely commented out** — a file of dead code referencing a non-existent `@shopify/react` package.

**11. 48 `any`/`as any` sites and 17 `@ts-expect-error`/`@ts-ignore`** across `app/` and `tests/`, against otherwise `strict: true` TypeScript. Not alarming for the size, but it is where the type safety leaks. On the credit side: exactly **1 TODO/FIXME** and **1 `eslint-disable`** in the entire app — unusually disciplined.

**12. `CHANGELOG.md` (106KB) is upstream Shopify's, not this project's.** It will keep drifting and confusing anyone who opens it looking for release history.

---

## 7. If you own this next

Highest value per hour, in order:

1. Guard or delete the `/dev/*` routes. One-line fix, currently live.
2. Escape HTML in `email.server.ts`. One helper, four call sites.
3. Either restore the wholesale Playwright specs or delete the scripts and the `tests/README.md` section that claim them. Right now the test suite lies about its coverage of your revenue-critical B2B path.
4. Finish the `getB2BCompany` → `isWholesaleCustomer` migration and delete the shim.
5. Rewrite `README.md` from `CLAUDE.md` + `.env.example`. Fold `docs/` runbooks into it by link.
6. Pick one GraphQL convention — `app/graphql/` or inline — and move the 13 stragglers.
7. Confirm the secret-gated CI jobs actually execute. If `PUBLIC_STOREFRONT_API_TOKEN` isn't set, your Lighthouse, axe, and smoke gates are decoration.

**What not to touch without reading the comments first:** the eager-render decision in `_index.tsx`, the `gsap.ticker`-driven Lenis loop in `lib/scroll.ts`, the font preload in `root.tsx`, and the `workflow_run` trigger in `deploy.yml`. Each is a non-obvious fix for a specific failure, and each is documented at the site. They look like things worth "simplifying." They aren't.
