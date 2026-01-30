# Story 7.9: Apply Wholesale Pricing

Status: ready-for-dev

## Story

As a **wholesale partner**,
I want **to see wholesale pricing automatically when logged in**,
so that **I receive my partner discount without asking**.

## Acceptance Criteria

**Given** I am logged in as a B2B customer
**When** I view products or add to cart
**Then** prices reflect wholesale pricing tier
**And** pricing comes from Shopify B2B price lists
**And** cart shows wholesale prices
**And** checkout uses wholesale prices
**And** B2C visitors see regular retail prices
**And** no manual discount codes needed

**FRs addressed:** FR29

## Tasks / Subtasks

- [ ] Configure Shopify B2B price lists (AC: 1)
  - [ ] Set up B2B app in Shopify admin
  - [ ] Create wholesale price list
  - [ ] Assign price list to B2B companies
- [ ] Verify B2B customer token in requests (AC: 2)
  - [ ] Include customer access token in API calls
  - [ ] Shopify automatically applies B2B pricing
- [ ] Display wholesale prices on product pages (AC: 3)
  - [ ] Query products with B2B context
  - [ ] Show wholesale price to B2B customers
  - [ ] Show retail price to B2C customers
- [ ] Verify cart uses wholesale pricing (AC: 4)
  - [ ] Cart line items show discounted prices
  - [ ] Cart total reflects B2B pricing
- [ ] Verify checkout uses wholesale pricing (AC: 5)
  - [ ] Shopify managed checkout applies B2B prices
  - [ ] No additional configuration needed
- [ ] Test price isolation (AC: 6)
  - [ ] B2C customers see retail prices
  - [ ] B2B customers see wholesale prices
  - [ ] No cross-contamination

## Dev Notes

### Critical Architecture Requirements

**Shopify B2B Pricing Architecture:**
- Pricing is configured in Shopify admin (NOT in code)
- B2B app manages price lists per company
- Customer Account API provides B2B customer token
- Shopify automatically applies correct pricing based on customer context
- No manual discount codes or calculations needed

**Developer Responsibility:**
- Ensure B2B customer token is passed in API requests
- Display prices returned by Shopify (no price manipulation)
- Test that B2B pricing is applied correctly
- Document configuration requirements

**NOT Developer Responsibility:**
- Calculating wholesale discounts (Shopify handles this)
- Managing price lists (configured in admin)
- Applying discount codes (B2B pricing is automatic)

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Configuration | Shopify Admin (B2B app, price lists) |
| API | Shopify Storefront API with B2B context |
| Cart | Hydrogen Cart Context (automatic B2B pricing) |
| Checkout | Shopify managed checkout (automatic B2B pricing) |

### File Structure

```
app/
  routes/
    wholesale._index.tsx                    # Verify B2B context in loaders
  # No new files - configuration-only story
```

### Shopify B2B App Configuration

**Step 1: Enable B2B in Shopify Admin**
1. Install Shopify B2B app (if not already installed)
2. Navigate to Settings → Apps and sales channels → B2B
3. Enable B2B checkout

**Step 2: Create Price Lists**
1. Go to Products → Price lists
2. Create new price list: "Wholesale Partners"
3. Set pricing:
   - Option A: Percentage discount (e.g., 40% off retail)
   - Option B: Fixed prices per product
   - Option C: Bulk pricing tiers

**Step 3: Create Companies**
1. Go to Customers → Companies
2. Add wholesale partner companies
3. Assign customer accounts to companies

**Step 4: Assign Price Lists to Companies**
1. In company settings
2. Select "Wholesale Partners" price list
3. Save configuration

### API Implementation

**Customer Account API provides B2B token:**

```typescript
// When user logs in (Story 7.3)
const customer = await context.customerAccount.login({ email, password });

// Customer token includes B2B context
const customerAccessToken = customer.accessToken;

// Store in session
session.set('customerAccessToken', customerAccessToken);
```

**Storefront API uses B2B token:**

```typescript
// In product query
const products = await context.storefront.query({
  query: PRODUCTS_QUERY,
  variables: {
    // Include buyer identity for B2B pricing
    buyerIdentity: {
      customerAccessToken: session.get('customerAccessToken'),
    },
  },
});

// Prices returned will be B2B prices for B2B customers
```

### Cart API with B2B Context

**Hydrogen Cart Context automatically handles B2B pricing:**

```typescript
// When creating cart (Story 7.6 - Reorder)
const cartId = await context.cart.create({
  buyerIdentity: {
    customerAccessToken: session.get('customerAccessToken'),
  },
});

// Cart line items automatically use B2B pricing
// No additional code needed
```

### GraphQL Query with B2B Context

```graphql
#graphql
query GetProducts($buyerIdentity: BuyerIdentityInput) {
  products(first: 10) {
    edges {
      node {
        id
        title
        priceRange(buyerIdentity: $buyerIdentity) {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price(buyerIdentity: $buyerIdentity) {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
```

**Key Points:**
- Pass `buyerIdentity` with `customerAccessToken` in variables
- Shopify returns B2B prices automatically
- Same query works for B2C (omit buyerIdentity) and B2B

### Testing B2B Pricing

**Test Scenarios:**

1. **B2B Customer Login:**
   - Log in as B2B customer
   - View product → See wholesale price
   - Add to cart → Cart shows wholesale price
   - Proceed to checkout → Checkout shows wholesale price

2. **B2C Customer Browse:**
   - Browse as guest or B2C customer
   - View product → See retail price
   - Add to cart → Cart shows retail price

3. **Price Isolation:**
   - B2B customer sees 40% off retail
   - B2C customer sees full retail
   - Prices don't mix between customer types

4. **Checkout Verification:**
   - Complete checkout as B2B customer
   - Verify order confirmation shows wholesale prices
   - Check Shopify admin order → Prices are wholesale

### Configuration Validation

**Before Implementation:**
1. Verify Shopify B2B app is installed
2. Confirm price lists are created
3. Verify companies are set up
4. Test with test B2B customer account

**Documentation Requirements:**
- Document Shopify admin configuration steps
- Create test B2B customer account
- Provide founder with configuration checklist
- Include screenshots of admin setup

### Hydrogen Cart Context

**Cart automatically respects B2B context:**

```typescript
// Hydrogen's useCart() hook
const cart = useCart();

// When adding items, include buyer identity
await cart.addLines({
  buyerIdentity: {
    customerAccessToken: session.get('customerAccessToken'),
  },
  lines: [
    {
      merchandiseId: 'gid://shopify/ProductVariant/123',
      quantity: 12,
    },
  ],
});

// Cart line items automatically have B2B pricing
```

### Displaying Prices in UI

**Product Display (Future - if wholesale catalog added):**

```typescript
// Component showing product price
export function ProductPrice({ product, isB2B }: ProductPriceProps) {
  const price = product.priceRange.minVariantPrice;

  return (
    <div>
      <span className={cn("text-2xl font-semibold")}>
        {formatCurrency(price)}
      </span>
      {isB2B && (
        <span className={cn("text-sm text-text-muted ml-2")}>
          (Wholesale Price)
        </span>
      )}
    </div>
  );
}
```

### Error Handling

**Price Not Available:**
- If B2B price list not configured
- Shopify falls back to retail price
- Log warning for debugging
- Alert founder of configuration issue

**Customer Not in Company:**
- If B2B customer not assigned to company
- Prices may not apply
- Show friendly error: "Your wholesale account needs setup. Contact us."

**Token Expired:**
- Customer access token can expire
- Refresh token via Customer Account API
- Or redirect to login

### Testing Requirements

**Configuration Tests:**
- Verify B2B app installed
- Verify price lists created
- Verify test customer has company association
- Verify price list assigned to company

**Integration Tests:**
- B2B customer logs in → receives access token
- Product query with B2B context → returns wholesale prices
- Cart with B2B context → shows wholesale prices
- Checkout with B2B → applies wholesale prices

**Manual Tests:**
- Log in as B2B customer → see wholesale prices in orders
- Log in as B2C customer → see retail prices
- Compare prices between customer types

**Test Location:**
- `tests/integration/wholesale-pricing.test.ts`
- Manual test checklist in story documentation

### Configuration Checklist for Founder

**Create file: docs/wholesale-pricing-setup.md**

```markdown
# Wholesale Pricing Setup Checklist

## Shopify Admin Configuration

### 1. Enable B2B App
- [ ] Go to Settings → Apps and sales channels
- [ ] Search for "B2B" and install if not present
- [ ] Enable B2B checkout

### 2. Create Wholesale Price List
- [ ] Go to Products → Price lists
- [ ] Click "Create price list"
- [ ] Name: "Wholesale Partners"
- [ ] Set discount: 40% off retail (or custom prices)
- [ ] Save price list

### 3. Create Test Company
- [ ] Go to Customers → Companies
- [ ] Click "Create company"
- [ ] Name: "Test Wholesale Partner"
- [ ] Assign price list: "Wholesale Partners"
- [ ] Save company

### 4. Create Test B2B Customer
- [ ] In company settings, click "Add customer"
- [ ] Email: test-b2b@islasuds.com
- [ ] Password: [set secure password]
- [ ] Save customer

### 5. Verify Configuration
- [ ] Log in as test B2B customer
- [ ] View products → See wholesale prices
- [ ] Add to cart → Cart shows wholesale prices
- [ ] Complete test order → Verify pricing in admin

## For Each New Wholesale Partner

1. Create company for partner's store
2. Assign "Wholesale Partners" price list
3. Add partner's email to company
4. Send login credentials
5. Verify pricing on first order
```

### Project Context Critical Rules

1. **No Manual Calculations:** Shopify handles all B2B pricing (trust the platform)
2. **Configuration Over Code:** Pricing is admin configuration, not code logic
3. **Security:** Customer access tokens are sensitive (NEVER expose in client bundle)
4. **Testing:** Manual testing required (automated tests can't configure Shopify admin)
5. **Documentation:** Configuration steps MUST be documented for founder

### Anti-Patterns to Avoid

- ❌ Don't calculate wholesale prices in code (Shopify does this)
- ❌ Don't apply manual discount codes (B2B pricing is automatic)
- ❌ Don't hardcode wholesale discount percentages
- ❌ Don't skip configuration testing (pricing bugs are critical)
- ❌ Don't forget to document Shopify admin setup

### Edge Cases

**Customer Not in Company:**
- Shows retail prices (Shopify default)
- Log warning to alert founder
- Show message: "Contact us to activate wholesale pricing"

**Price List Not Assigned:**
- Company exists but no price list
- Falls back to retail prices
- Founder needs to assign price list in admin

**Multiple Price Lists:**
- Advanced use case (different tiers)
- Shopify supports multiple price lists per company
- MVP: Single "Wholesale Partners" price list

**Product Not in Price List:**
- New products might not be in price list
- Falls back to retail price
- Founder should add to price list

### Future Enhancements (Document as TODOs)

1. **Tiered Wholesale Pricing:**
   - Bronze, Silver, Gold partner tiers
   - Different discount levels
   - Assigned based on order volume

2. **Custom Product Catalog for B2B:**
   - Show different products to wholesale vs retail
   - B2B-only bulk products (e.g., 24-pack boxes)
   - Hide retail-only products (e.g., gift sets)

3. **Volume Discounts:**
   - Additional discounts for large orders
   - E.g., 10% off orders >$500

4. **Seasonal Wholesale Promotions:**
   - Special B2B pricing for holidays
   - Temporary price adjustments

### References

- [Source: Shopify B2B Documentation] - B2B app configuration and price lists
- [Source: project-context.md#Hydrogen-Specific Rules] - Cart operations
- [Source: CLAUDE.md#Hydrogen Context] - Customer Account API integration
- [Source: project-context.md#Security Rules] - Token handling
- [Source: project-context.md#Environment Variables] - Configuration pattern

### Dependencies

**Story 7.1:** B2B authentication (provides customer access token)
**Story 7.6:** One-click reorder (uses B2B pricing in cart)

**Critical Blocker:** Shopify B2B app MUST be configured before testing any B2B functionality.

**Validation:** Manual test with configured B2B customer account required.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- Shopify B2B pricing architecture explained (configuration over code)
- Developer responsibilities clearly scoped (pass token, display prices)
- Shopify admin configuration steps documented
- API integration pattern with buyerIdentity context
- Hydrogen Cart Context automatic B2B pricing handling
- Testing strategy focused on configuration validation
- Configuration checklist created for founder
- Edge cases for misconfiguration scenarios
- Future enhancements for tiered pricing documented
- Anti-patterns highlighted (no manual price calculations)

**Foundation for wholesale business** - Automatic pricing enables seamless B2B experience.

**IMPORTANT:** This story is primarily configuration-driven. Developer tasks:
1. Verify customer access token is passed in API calls
2. Test that B2B pricing is applied correctly
3. Document configuration requirements for founder
4. Create configuration checklist and test customer account

### File List

Files to create:
- docs/wholesale-pricing-setup.md (configuration checklist)
- tests/integration/wholesale-pricing.test.ts

Files to modify:
- app/routes/wholesale._index.tsx (verify buyerIdentity in queries)
- app/lib/context.ts (ensure customer token available in context)

Files to verify (should already be correct from Story 7.6):
- Cart operations include buyerIdentity
- Checkout redirect uses B2B context
