# Shopify Metafield Setup: Scent Narrative

This document describes how to configure the custom metafield for scent narrative copy in the Shopify admin.

## Metafield Configuration

### Definition Details

- **Name:** Scent Narrative
- **Namespace:** `custom`
- **Key:** `scent_narrative`
- **Type:** Single line text (or Multi-line text for longer narratives)
- **Description:** Evocative scent narrative copy displayed in the texture reveal

### Setup Instructions

1. **Navigate to Metafield Settings**
   - Log in to your Shopify admin
   - Go to **Settings** → **Custom data** → **Products**

2. **Add Metafield Definition**
   - Click **Add definition**
   - Enter the following details:
     - Name: `Scent Narrative`
     - Namespace and key: `custom.scent_narrative`
     - Type: Select **Single line text** or **Multi-line text**
     - Description: "Evocative scent narrative copy for texture reveal"
   - Click **Save**

3. **Add Narrative to Products**
   - Go to **Products** in your Shopify admin
   - Select a product to edit
   - Scroll down to the **Metafields** section
   - Find the **Scent Narrative** field
   - Enter evocative, sensory copy (see examples below)
   - Click **Save**

## Content Guidelines

### Writing Effective Scent Narratives

Scent narratives should be:
- **Evocative:** Transport the visitor to a specific place or moment
- **Sensory:** Engage multiple senses beyond just smell
- **Concise:** 1-3 short sentences (under 100 characters ideal)
- **Poetic:** Use fragment sentences, vivid imagery, and rhythm

### Example Narratives

```
Lavender Dreams:
"Close your eyes. A field at dusk. The last warmth of the day on your skin."

Citrus Sunrise:
"First light. Fresh squeezed. The promise of possibility."

Forest Calm:
"Moss underfoot. Cedar overhead. The deep breath you've been holding."

Ocean Breeze:
"Salt air. Horizon endless. Where the sky meets the sea."
```

## Technical Implementation

### GraphQL Query

The metafield is fetched via the Storefront API in `app/routes/_index.tsx`:

```graphql
fragment RecommendedProduct on Product {
  # ... other fields
  scentNarrative: metafield(namespace: "custom", key: "scent_narrative") {
    value
  }
}
```

### TypeScript Type

After running `pnpm codegen`, the metafield is available in the `RecommendedProductFragment` type:

```typescript
scentNarrative?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
```

### Fallback Behavior

If a product does not have the `scent_narrative` metafield configured:
- The app uses fallback copy from `app/content/products.ts`
- Fallbacks are mapped by product handle
- If no handle match, a generic default is used: "Discover the essence of craftsmanship."

### Usage in Components

The `getScentNarrative()` helper function prioritizes metafield values:

```typescript
import { getScentNarrative } from '~/content/products';

// In component
const narrative = getScentNarrative(
  product.handle,
  product.scentNarrative?.value
);
```

Priority order:
1. Shopify metafield value (if configured)
2. Fallback from `SCENT_NARRATIVES` map (by handle)
3. Default narrative

## Troubleshooting

### Metafield not appearing in admin

- Ensure you've created the metafield **definition** first (Settings → Custom data)
- Refresh the product edit page
- Check that the namespace and key exactly match: `custom.scent_narrative`

### Metafield not appearing in GraphQL response

- Run `pnpm codegen` to regenerate TypeScript types
- Verify the metafield query is in the GraphQL fragment
- Check the Shopify Storefront API version supports custom metafields

### Empty narrative displayed

- Verify the product has a value in the Scent Narrative metafield
- Check that fallback copy exists in `app/content/products.ts` for the product handle
- Ensure `getScentNarrative()` is called with both handle and metafield value

## Related Files

- `app/routes/_index.tsx` - GraphQL query with metafield
- `app/content/products.ts` - Fallback narratives
- `app/content/products.test.ts` - Tests for `getScentNarrative()`
- `storefrontapi.generated.d.ts` - Generated TypeScript types
