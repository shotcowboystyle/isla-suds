# Wholesale Price Metafield Setup Guide

How to configure and maintain the `wholesale.price` variant metafield used to display wholesale unit prices on the order page (`/wholesale/order`).

---

## Step 1 — Create the Metafield Definition (one-time)

1. Go to **Shopify Admin → Settings → Custom data**
2. Click **Variants** (not Products — the price lives on the variant, not the product)
3. Click **Add definition**
4. Fill in:
   - **Name:** `Wholesale Price`
   - **Namespace and key:** `wholesale.price`
   - **Type:** Money
5. Click **Save**

This only needs to be done once. The field is then available on every variant in the store.

---

## Step 2 — Populate the Price on Each Variant

For each of the 4 soap products:

1. Go to **Shopify Admin → Products → [Product name]**
2. Scroll down to **Variants** and click the variant (e.g. "Default Title")
3. Scroll to the **Metafields** section at the bottom of the variant page
4. Find **Wholesale Price** and enter the amount (e.g. `4.50`)
5. Confirm the currency matches your store currency
6. Click **Save**

Repeat for all 4 variants (one per product).

---

## Bulk Edit Option (faster for many variants)

1. Go to **Shopify Admin → Products**
2. Select all 4 soap products using the checkboxes
3. Click **Edit products** (bulk editor)
4. Click **Add fields** → find **Wholesale Price**
5. Fill in the prices for each row
6. Save

---

## Step 3 — Verify

1. Go to **Settings → Custom data → Variants**
2. Click **Wholesale Price**
3. Confirm entries are populated for each variant

---

## Updating Prices

To change a wholesale price:

1. Go to **Shopify Admin → Products → [Product name] → [Variant]**
2. Scroll to **Metafields → Wholesale Price**
3. Update the value and save

No code changes or deployments needed — the order page reads the metafield value live from the Storefront API.

---

## Adding New Products to the Wholesale Catalog

When a new product is added to the wholesale order page:

1. Set the `wholesale.price` metafield on the new variant (same steps as Step 2)
2. Add the product handle to `app/content/wholesale.ts` → `catalog.productHandles`
3. Update the GraphQL query in `app/routes/wholesale.order.tsx` to include the new handle variable

---

## How It Works in Code

The metafield is queried in `app/routes/wholesale.order.tsx`:

```graphql
variants(first: 1) {
  nodes {
    metafield(namespace: "wholesale", key: "price") {
      value  # JSON string: "{\"amount\":\"4.50\",\"currencyCode\":\"USD\"}"
      type   # "money"
    }
  }
}
```

The `value` field returns a JSON string for Money type. Parse it before use:

```ts
const wholesalePrice = variant.metafield?.value
  ? JSON.parse(variant.metafield.value)
  : null;
// { amount: "4.50", currencyCode: "USD" }
```

---

## What Happens if the Metafield is Missing

If a variant's `wholesale.price` metafield is not set, the order page falls back to displaying "Price on request" and disables the quantity selector for that product until the metafield is populated.
