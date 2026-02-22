# Remaining Code Quality Work

Items identified during full site review. Work through each, creating a feature branch per item.

## Medium Priority

### 1. Fix LiquidButton type error - `href` required but used as submit button
- **Files**: `app/components/contact/ContactForm.tsx:83`, `app/components/wholesale/register/WholesaleApplicationForm.tsx:243`
- **Issue**: `LiquidButton` requires `href` prop but these forms use it as `type="submit"` without `href`. Pre-existing TypeScript error.
- **Fix**: Make `href` optional in `LiquidButtonProps` when `type="submit"` is passed, or use a different component for form submission.
- **Branch**: `feature/fix-liquid-button-types`

### 2. Replace `any` types in root.tsx loader and PageLayout props
- **Files**: `app/root.tsx:92-108`, `app/components/PageLayout.tsx:18-19`
- **Issue**: Loader return type uses `any` for `cart`, `footer`, `header`, `country`, `language`. PageLayout uses `any` for `theme` and `setTheme`.
- **Fix**: Import proper types from `storefrontapi.generated` and `@shopify/hydrogen`. Type theme props properly.
- **Branch**: `feature/fix-root-loader-types`

### 3. Fix NewsletterSignup form - handleSubmit not wired up
- **Files**: `app/components/ui/NewsletterSignup.tsx`
- **Issue**: `handleSubmit` function exists but is never called. Form uses `method="get"` and the native submit input. The `email` state is set via `onChange` but never submitted anywhere.
- **Fix**: Wire up form submission properly or remove the dead `handleSubmit` and `email` state if the form relies on native form action.
- **Branch**: `feature/fix-newsletter-form`

### 4. Remove placeholder external URLs from spylt/Hero.tsx
- **Files**: `app/components/product/spylt/Hero.tsx:91-175`
- **Issue**: Contains hardcoded leroux.com product image URLs and WooCommerce markup as placeholder content. This is leftover from a design reference and should use actual Shopify product data.
- **Fix**: Replace the WooCommerce gallery markup with proper Shopify product image rendering.
- **Branch**: `feature/clean-hero-placeholders`

### 5. Fix `FetcherWithComponents<any>` type in AddToCartButton
- **Files**: `app/components/AddToCartButton.tsx:18,144`
- **Issue**: Uses `FetcherWithComponents<any>` instead of a proper cart action response type.
- **Fix**: Define a `CartActionResponse` type and use it as the generic parameter.
- **Branch**: `feature/fix-add-to-cart-types`

## Low Priority

### 6. Create `.env.example` for developer onboarding
- **Files**: Root directory (new file)
- **Issue**: `.gitignore` expects `.env.example` but it doesn't exist. New developers have no reference for required env vars.
- **Fix**: Create `.env.example` with documented placeholders for `SESSION_SECRET`, `PUBLIC_STORE_DOMAIN`, `PUBLIC_CHECKOUT_DOMAIN`, `FOUNDER_EMAIL`, etc.
- **Branch**: `feature/add-env-example`

### 7. Add missing tests for utility modules
- **Files**: `app/utils/orderFilters.ts`, `app/lib/variant-url.ts`, `app/lib/context.ts`
- **Issue**: These modules have no test coverage. `orderFilters.ts` has sanitization logic, `variant-url.ts` has URL construction, both are good candidates for unit tests.
- **Branch**: `feature/add-utility-tests`

### 8. CollectionPrompt shows placeholder divs instead of product images
- **Files**: `app/components/product/CollectionPrompt.tsx:155-168`
- **Issue**: The variety pack product grid renders placeholder `<div>` elements with product names instead of actual Shopify product images. Has a TODO comment.
- **Fix**: Pass actual product image data from the parent and render `<Image>` components.
- **Branch**: `feature/collection-prompt-images`
