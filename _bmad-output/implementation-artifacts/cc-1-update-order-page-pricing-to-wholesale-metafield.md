# Story CC-1: Update Order Page Pricing from B2B Context to Wholesale Metafield

Status: review

## Story

As a wholesale partner,
I want to see my wholesale prices sourced from the product's wholesale price metafield,
so that I get accurate wholesale pricing on Shopify Basic without requiring Shopify Plus B2B features.

## Context

**Why this change:** The business decided to stay on Shopify Basic instead of upgrading to Shopify Plus. This eliminates access to Shopify's native B2B pricing features (buyer identity context pricing, B2B price lists). Wholesale prices now come from a `wholesale.price` variant metafield set manually in Shopify Admin. A Shopify Functions discount app (`isla-suds-wholesale-discount`) has already been deployed and handles the 20% checkout discount for `wholesale`-tagged customers.

**What already works (DO NOT touch):**
- Authentication — `isWholesaleCustomer()` checks customer tags, wholesale layout auth guard
- Cart creation with `buyerIdentity` — still needed for Shopify Functions tag detection at checkout
- All UI layout, validation logic, navigation, error handling
- `QuantitySelector` component — no pricing logic, no changes needed
- `WholesaleHeader.tsx`, `wholesale._index.tsx`, `wholesale.tsx` layout — unchanged
- Session management — `customerAccessToken` storage and retrieval

## Acceptance Criteria

1. **Given** a product variant has a `wholesale.price` metafield set in Shopify Admin, **when** the order page loads, **then** the wholesale price from the metafield is displayed (not the variant's retail price).
2. **Given** the order page is loaded with wholesale prices, **when** a partner adds quantities, **then** line totals in the order summary are calculated using the metafield wholesale price.
3. **Given** products with wholesale prices, **when** the order summary calculates the subtotal, **then** it reflects wholesale pricing from metafields.
4. **Given** a product variant does NOT have a `wholesale.price` metafield, **when** the order page loads, **then** "Price on request" is displayed instead of a price.
5. **Given** a product without a wholesale price metafield, **when** the order page renders, **then** the quantity selector for that product is disabled and the product cannot be added to the order.
6. **Given** `pnpm codegen` is run after GraphQL changes, **then** the build succeeds with no type errors.

## Tasks / Subtasks

- [x] **Task 1: Add content string** (AC: 4)
  - [x] Add `priceOnRequest: 'Price on request'` to `wholesaleContent.order` in `app/content/wholesale.ts`

- [x] **Task 2: Update GraphQL fragment** (AC: 1, 6)
  - [x] Add `metafield(namespace: "wholesale", key: "price") { value type }` to variant fields in `WHOLESALE_PRODUCT_FRAGMENT` in `app/routes/wholesale.order.tsx`
  - [x] Run `pnpm codegen` to regenerate types

- [x] **Task 3: Update loader to map wholesale price** (AC: 1, 4)
  - [x] In `wholesale.order.tsx` loader, extract metafield value from each product's variant
  - [x] Parse metafield into a `MoneyV2`-compatible object: `{ amount: string, currencyCode: CurrencyCode }`
  - [x] Use `variant.price.currencyCode` as the currency source (retail price always has currency)
  - [x] Set `wholesalePrice` to `null` when metafield is missing or empty
  - [x] Return `wholesalePrice` alongside existing product data in the mapped products array

- [x] **Task 4: Update OrderProductCard price display** (AC: 1, 4, 5)
  - [x] Accept `wholesalePrice` prop (type: `WholesaleVariant['price'] | null`)
  - [x] Display `<Money data={wholesalePrice} />` when available, or `wholesaleContent.order.priceOnRequest` when null
  - [x] Disable quantity selector when `wholesalePrice` is null (in addition to existing `!variant.availableForSale` check)

- [x] **Task 5: Update OrderSummary line total calculation** (AC: 2, 3)
  - [x] Accept `wholesalePrice` on each product (via the products array prop)
  - [x] Use `wholesalePrice.amount` instead of `variant.price.amount` for line total calculation
  - [x] Skip products without wholesale price when computing selected items and subtotal

- [x] **Task 6: Run codegen and verify types** (AC: 6)
  - [x] Run `pnpm codegen`
  - [x] Run `pnpm typecheck` — zero new errors (3 pre-existing in Header.test.tsx, contact.test.tsx)
  - [x] Run `pnpm lint` — zero errors (41 pre-existing warnings)

## Dev Notes

### Files to Modify (4 files only)

| File | Change |
|------|--------|
| `app/content/wholesale.ts:87` | Add `priceOnRequest` string to `order` section |
| `app/routes/wholesale.order.tsx:13-35` | Add metafield to GraphQL fragment |
| `app/routes/wholesale.order.tsx:69-91` | Loader: parse metafield, add `wholesalePrice` to product map |
| `app/components/wholesale/OrderProductCard.tsx` | Use `wholesalePrice` prop for display + disable logic |
| `app/components/wholesale/OrderSummary.tsx` | Use `wholesalePrice` for line total + subtotal calculation |

### GraphQL Fragment Change

Current fragment (`wholesale.order.tsx:13-35`):
```graphql
fragment WholesaleProductFields on Product {
  id
  title
  handle
  featuredImage { url altText width height }
  variants(first: 1) {
    nodes {
      id
      availableForSale
      price { amount currencyCode }
    }
  }
}
```

Add to `variants.nodes`:
```graphql
metafield(namespace: "wholesale", key: "price") {
  value
  type
}
```

### Loader Mapping Logic

In `wholesale.order.tsx:83-88`, the current `.map()` transforms products. Add wholesale price parsing:

```typescript
.map(({variants, ...rest}) => {
  const variant = variants.nodes[0];
  const metafieldValue = variant.metafield?.value;

  // Parse metafield value into MoneyV2 shape
  // Metafield type is "number_decimal" — value is a plain decimal string like "8.00"
  const wholesalePrice = metafieldValue
    ? { amount: metafieldValue, currencyCode: variant.price.currencyCode }
    : null;

  return { ...rest, variant, wholesalePrice };
})
```

**Important:** If the metafield type is `money` instead of `number_decimal`, the value is JSON: `{"amount":"8.00","currency":"USD"}`. Check what the founder set up in Shopify Admin. The `type` field on the metafield will tell you. Handle both:

```typescript
let wholesalePrice = null;
if (metafieldValue) {
  if (variant.metafield?.type === 'money') {
    const parsed = JSON.parse(metafieldValue);
    wholesalePrice = { amount: parsed.amount, currencyCode: parsed.currency };
  } else {
    wholesalePrice = { amount: metafieldValue, currencyCode: variant.price.currencyCode };
  }
}
```

### OrderProductCard Changes

Current price display (`OrderProductCard.tsx:46-48`):
```tsx
<p className={cn('text-sm text-[--text-muted]')}>
  <Money data={variant.price} /> {wholesaleContent.order.pricePerUnit}
</p>
```

Replace with:
```tsx
<p className={cn('text-sm text-[--text-muted]')}>
  {wholesalePrice ? (
    <><Money data={wholesalePrice} /> {wholesaleContent.order.pricePerUnit}</>
  ) : (
    wholesaleContent.order.priceOnRequest
  )}
</p>
```

Update disabled check (`OrderProductCard.tsx:19`):
```typescript
// Before
const isDisabled = !variant.availableForSale;

// After — also disable when no wholesale price
const isDisabled = !variant.availableForSale || !wholesalePrice;
```

Update props interface to accept `wholesalePrice`:
```typescript
export interface OrderProductCardProps {
  product: Omit<WholesaleProductFieldsFragment, 'variants'> & {
    variant: WholesaleVariant;
  };
  wholesalePrice: { amount: string; currencyCode: string } | null;
  quantity: number;
  onQuantityChange: (variantId: string, quantity: number) => void;
}
```

### OrderSummary Changes

The current line total calculation (`OrderSummary.tsx:27`):
```typescript
const lineAmount = (parseFloat(p.variant.price.amount) * qty).toFixed(2);
```

Must use wholesale price instead. The products array passed to OrderSummary needs to include `wholesalePrice`. Two options:

**Option A (recommended):** Add `wholesalePrice` to the product type passed to OrderSummary. Filter out products with null wholesale price from selected items.

```typescript
// In selectedItems filter, additionally check wholesalePrice exists
const selectedItems = products
  .filter((p) => (quantities[p.variant.id] ?? 0) > 0 && p.wholesalePrice)
  .map((p) => {
    const qty = quantities[p.variant.id];
    const lineAmount = (parseFloat(p.wholesalePrice!.amount) * qty).toFixed(2);
    return {
      id: p.id,
      title: p.title,
      quantity: qty,
      lineTotal: { amount: lineAmount, currencyCode: p.wholesalePrice!.currencyCode },
    };
  });
```

### Route Component (wholesale.order.tsx) — Passing New Props

Update the JSX to pass `wholesalePrice` to both children:

```tsx
<OrderProductCard
  key={product.id}
  product={product}
  wholesalePrice={product.wholesalePrice}
  quantity={quantities[product.variant.id] ?? 0}
  onQuantityChange={handleQuantityChange}
/>
```

The `OrderSummary` already receives the `products` array — just ensure the type includes `wholesalePrice`.

### Type Updates

After `pnpm codegen`, the `WholesaleProductFieldsFragment` type will automatically include the `metafield` field. The `wholesalePrice` is a derived value created in the loader, not a generated type — define it locally or use inline typing.

Suggested type for the mapped product (in `wholesale.order.tsx`):
```typescript
type WholesaleProduct = {
  id: string;
  title: string;
  handle: string;
  featuredImage: { url: string; altText?: string | null; width?: number; height?: number } | null;
  variant: WholesaleProductFieldsFragment['variants']['nodes'][0];
  wholesalePrice: { amount: string; currencyCode: string } | null;
};
```

### Project Structure Notes

- All changes stay within existing file boundaries — no new files, no new dependencies
- Props interface naming follows `ComponentNameProps` convention
- Content strings centralized in `app/content/wholesale.ts`
- Styling uses `cn()` utility — no changes to CSS
- Import order: React > external (`@shopify/hydrogen`) > internal (`~/`) > relative > types

### What NOT To Do

- **DO NOT** remove `buyer` / `@inContext` from the GraphQL query — `buyerIdentity` is still needed for Shopify Functions wholesale discount at checkout
- **DO NOT** remove `variant.price` from the fragment — it's still needed as fallback currency source and for potential retail price comparison
- **DO NOT** create new files, utilities, or abstractions — this is a surgical 4-file change
- **DO NOT** modify `QuantitySelector.tsx` — it has no pricing logic
- **DO NOT** modify the action or cart creation logic — checkout discount is handled by Shopify Functions, not code changes
- **DO NOT** use Framer Motion or add CSS modules — B2B portal is Tailwind-only via `cn()`
- **DO NOT** hardcode strings — use `wholesaleContent` for all user-facing copy

### References

- [Source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-03-10.md` — CC Story 1 requirements]
- [Source: `_bmad-output/planning-artifacts/architecture-wholesale-order.md` — component boundaries, data flow]
- [Source: `_bmad-output/planning-artifacts/prd-wholesale-order.md` — FR4, NFR7, NFR13 updated for metafield pricing]
- [Source: `_bmad-output/project-context.md` — naming conventions, import order, content centralization rules]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- TypeScript `CurrencyCode` mismatch: `wholesalePrice` typed as `{currencyCode: string}` failed `<Money>` prop check (expects `CurrencyCode` enum). Fixed by using `typeof variant.price | null` which preserves the `CurrencyCode` type from the generated fragment.
- `JSON.parse` returns `unknown`: typed the parsed money metafield as `{amount: string}` and always used `variant.price.currencyCode` for currency (avoids needing to parse currency from JSON).

### Completion Notes List
- All 6 tasks complete, 49 tests passing (19 OrderProductCard + 30 OrderSummary)
- 3 new tests added for AC4/AC5: "Price on request" display, disabled selector, opacity when wholesalePrice is null
- Handles both `number_decimal` and `money` metafield types per dev notes
- Zero new type errors, zero lint errors introduced
- Pre-existing type errors in Header.test.tsx (viewport prop) and contact.test.tsx (unstable_pattern) are unrelated

### File List
- `app/content/wholesale.ts` — Added `priceOnRequest` string
- `app/routes/wholesale.order.tsx` — GraphQL metafield fragment, loader mapping, wholesalePrice prop pass-through
- `app/components/wholesale/OrderProductCard.tsx` — wholesalePrice prop, conditional price/disabled display
- `app/components/wholesale/OrderSummary.tsx` — wholesalePrice on SummaryProduct type, line total calculation
- `app/components/wholesale/OrderProductCard.test.tsx` — Added wholesalePrice to mocks, 3 new tests
- `app/components/wholesale/OrderSummary.test.tsx` — Added wholesalePrice to mock products
- `storefrontapi.generated.d.ts` — Auto-regenerated by codegen
