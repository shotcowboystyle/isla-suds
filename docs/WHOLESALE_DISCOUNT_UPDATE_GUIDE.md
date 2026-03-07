# Wholesale Discount Update Guide

How to change the wholesale automatic discount percentage in the Shopify Functions app (`isla-suds-wholesale-discount`).

## When to use this guide

- The wholesale discount percentage needs to change (e.g., from 20% to 25%)
- The discount message shown at checkout needs updating

---

## Steps

### 1. Edit the discount value

Open `extensions/wholesale-discount/src/cart_lines_discounts_generate_run.js` in the `isla-suds-wholesale-discount` project.

Change the constant at the top of the `cartLinesDiscountsGenerateRun` function:

```js
const WHOLESALE_DISCOUNT_PERCENTAGE = 20; // change this number
```

Save the file.

### 2. (Optional) Update the discount message

In the same file, update the `message` string if needed:

```js
message: 'Wholesale partner discount',
```

### 3. Run typegen to validate the schema

From the `isla-suds-wholesale-discount` project root:

```bash
shopify app function typegen
```

This should complete with no errors. If it fails, the GraphQL input query is out of sync — see Troubleshooting below.

### 4. Deploy the updated function

```bash
shopify app deploy
```

Follow the prompts. Confirm the deployment when asked.

This pushes a new version of the Shopify Function to Shopify's infrastructure. The existing automatic discount will automatically use the new function version.

### 5. Verify in Shopify Admin

1. Go to **Shopify Admin → Discounts**
2. Find the automatic discount named e.g. `Wholesale Partner Discount`
3. Confirm it shows the correct app and is still active
4. Test by logging in as a customer tagged `wholesale` and checking out — the new percentage should appear in the order summary

---

## Troubleshooting

### typegen fails: `Cannot query field "buyerIdentity" on type "Input"`

The GraphQL input query has `buyerIdentity` at the wrong level. It must be inside `cart {}`.

Correct structure in `cart_lines_discounts_generate_run.graphql`:

```graphql
query Input {
  cart {
    buyerIdentity {
      customer {
        hasAnyTag(tags: ["wholesale"])
      }
    }
    lines {
      id
    }
  }
}
```

### Discount not applying after deploy

- Confirm the automatic discount is still active in **Admin → Discounts**
- Confirm the customer has the `wholesale` tag in **Admin → Customers → [customer] → Tags**
- Check that the function target is `cart_lines_discounts_generate_run` (not an older target type)

### Deploy prompts to create a new discount

If the app was reinstalled or the discount was deleted, recreate it via the GraphiQL explorer:

1. Start the local dev server: `shopify app dev`, then press `g` to open GraphiQL
2. Run:

```graphql
mutation {
  discountAutomaticAppCreate(automaticAppDiscount: {
    title: "Wholesale Partner Discount"
    functionId: "<your-function-id>"
    startsAt: "2024-01-01T00:00:00Z"
  }) {
    automaticAppDiscount {
      discountId
    }
    userErrors {
      field
      message
    }
  }
}
```

Replace `<your-function-id>` with the ID shown after `shopify app deploy` completes.

---

## Key files in `isla-suds-wholesale-discount`

| File | Purpose |
|------|---------|
| `extensions/wholesale-discount/src/cart_lines_discounts_generate_run.js` | Discount logic — edit `WHOLESALE_DISCOUNT_PERCENTAGE` here |
| `extensions/wholesale-discount/src/cart_lines_discounts_generate_run.graphql` | GraphQL input query — defines what cart data is available to the function |
| `shopify.app.toml` | App config including scopes and function registration |
