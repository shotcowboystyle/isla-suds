# Code Review: Story 3-6 — Create Variety Pack Bundle Display

**Story:** 3-6-create-variety-pack-bundle-display.md  
**Story key:** 3-6-create-variety-pack-bundle-display  
**Git vs Story Discrepancies:** 1 found  
**Issues Found:** 0 Critical, 2 High, 5 Medium, 2 Low  

---

## Git vs Story

- **vite.config.ts** — Modified in git (`ssr.optimizeDeps.include`: added `expect-type`) but **not** listed in the story File List. Counts as incomplete documentation of changes.

---

## CRITICAL ISSUES

- None. All tasks marked [x] have implementation evidence; no false claims.

---

## HIGH ISSUES

1. **AC1 partial: “Shows all 4 product images (thumbnails or a composite)”**  
   `BundleCard` only renders a single `featuredImage`. AC1 allows either “thumbnails” or “a composite.” If the intended design is a **composite**, the bundle product in Shopify must use a composite featured image and that should be documented. If the intent is **four distinct thumbnails**, that is not implemented.  
   - **Files:** `app/components/product/BundleCard.tsx` (single `featuredImage` only).

2. **AC6: Bundle card announced as bundle option**  
   AC6 example: *“The Collection, all four soaps, activate to view details.”*  
   `BundleCard` uses `aria-label={View ${product.title}}`, so today it only announces the product title (e.g. “View The Collection”), not “all four soaps” or “activate to view details.”  
   - **File:** `app/components/product/BundleCard.tsx` line 92.

---

## MEDIUM ISSUES

1. **Story File List omits vite.config.ts**  
   `vite.config.ts` was changed (added `expect-type` to `ssr.optimizeDeps.include`) but is not in the story File List. Either add it to the File List and Dev Agent Record or revert if unrelated to 3-6.  
   - **File:** story Dev Agent Record → File List; `vite.config.ts`.

2. **Magic string `'four-bar-variety-pack'` duplicated**  
   Bundle handle is hardcoded in:  
   - `app/components/product/ConstellationGrid.tsx` (line 21)  
   - `app/components/product/ProductRevealInfo.tsx` (line 57)  
   and in tests/content. Extract a shared constant (e.g. in `app/content/products.ts` or `app/lib/constants.ts`) and reuse everywhere.  
   - **Files:** `ConstellationGrid.tsx:21`, `ProductRevealInfo.tsx:57`.

3. **No test for bundle value proposition in ProductRevealInfo**  
   Story 3.6 Task 4: bundle value proposition copy in the reveal. `ProductRevealInfo` shows `bundleValueProp` for the bundle, but `ProductRevealInfo.test.tsx` has no case with `handle: 'four-bar-variety-pack'` and no assertion that the value proposition text is rendered.  
   - **File:** `app/components/product/ProductRevealInfo.test.tsx`.

4. **Vitest runs generated type file as test**  
   `.react-router/types/app/routes/+types/_index.test.ts` is generated (no test suite). Vitest picks it up and fails with “No test suite found.” Exclude `.react-router` (or `**/.react-router/**`) from the Vitest file list so generated types are not treated as tests.  
   - **Config:** `vite.config.ts` or `vitest.setup.ts` / Vitest config.

5. **PRODUCT_DESCRIPTIONS has no bundle entry**  
   `app/content/products.ts` has no `'four-bar-variety-pack'` in `PRODUCT_DESCRIPTIONS`. For the bundle, `getProductDescription` falls back to `DEFAULT_DESCRIPTION`. Acceptable for now; consider adding a bundle-specific description for consistency with other content helpers.  
   - **File:** `app/content/products.ts`.

---

## LOW ISSUES

1. **Bundle card title vs “The Collection”**  
   AC1 asks for a label like “The Collection.” The card uses `product.title` from the API. If the Shopify product title is “The Collection,” this is satisfied; otherwise consider a display override or document that the store must set the bundle product title to “The Collection” (or equivalent).

2. **Test run failure is tooling, not 3-6**  
   Full suite fails due to the single generated `_index.test.ts` suite above. The 249 tests that run (including all 3-6 tests) pass. Fix by excluding generated types from Vitest as in Medium #4.

---

## What was verified

- **AC1:** Distinct bundle card, badge, “All 4 soaps” subtitle, same card architecture as ProductCard, keyboard focus. Gap: single image only; aria-label could be richer (see High #1, #2).
- **AC2:** Bundle price and value proposition in reveal via `ProductRevealInfo` and `getBundleValueProposition`; metafield + fallback. ✓
- **AC3:** Bundle uses same TextureReveal, same animation/IO/performance instrumentation. ✓
- **AC4:** Bundle reveal shows title, value prop, price, Add to Cart; CVA/accent styling. ✓
- **AC5:** Bundle in ConstellationGrid, same exploration state (product id). ✓
- **AC6:** Keyboard, focus, reduced motion via TextureReveal/Radix. Gap: bundle-specific aria-label (High #2).
- **AC7:** No new network at reveal, same Performance API marks, no new libs. ✓
- **Tasks 1–6:** Loader limit 5 + bundle metafield, BundleCard + ConstellationGrid wiring, TextureReveal reuse, value prop in content and reveal, accessibility and cart stub, File List present. ✓
- **Tests:** `_index.test.tsx` (loader), `BundleCard.test.tsx`, `ConstellationGrid.test.tsx` bundle case are substantive; ProductRevealInfo has no bundle/value-prop test (Medium #3).

---

## Recommendation

- **Status:** **done** — All HIGH and MEDIUM issues addressed (2026-01-28) (e.g. “single composite image only” and “current aria-label acceptable”).
- **Fixes applied:**  
  Bundle-specific aria-label, AC1 composite comment, BUNDLE_HANDLE constant, ProductRevealInfo bundle test, Vitest .react-router exclude, vite.config.ts in File List, PRODUCT_DESCRIPTIONS bundle entry.  
 BundleCard `aria-label` for bundle (e.g. “The Collection, all four soaps, activate to view details”) per AC6.  
 (File List, bundle handle constant, ProductRevealInfo bundle test, Vitest exclude, PRODUCT_DESCRIPTIONS).

---

*Reviewer: Dev Agent (Amelia) — adversarial code review per code-review workflow.*  
*Date: 2026-01-28. Fixes applied: 2026-01-28.*
