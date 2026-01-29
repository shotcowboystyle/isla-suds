# Story 6.4: Add Booth Attribution Code Field

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **market customer**,
I want **to enter the booth attribution code at checkout**,
So that **the founder knows I discovered them at the farmers market**.

## Acceptance Criteria

**Given** I am in Shopify checkout
**When** I look for attribution options
**Then** I see a field for "Booth Code" or "Referral Code"

- Placeholder text: "e.g., FARMSTAND"
- Field is optional (not required)

**And** code is stored with order in Shopify
**And** founder can view attribution codes in Shopify admin
**And** field is implemented via Shopify checkout customization or app

## Tasks / Subtasks

- [ ] **Task 1: Research Shopify checkout customization options** (AC: All criteria)
  - [ ] Review Shopify Checkout Extensibility documentation
  - [ ] Identify methods to add custom fields to checkout
  - [ ] Check if Shopify plan supports checkout customizations
  - [ ] Document implementation approach (app vs. native customization)
- [ ] **Task 2: Add custom field to Shopify checkout** (AC: Field visible, optional)
  - [ ] Option A: Use Shopify Checkout Extensibility (if available)
  - [ ] Option B: Use third-party app (e.g., "Order Attributes" app)
  - [ ] Configure field label: "Booth Code" or "Referral Code"
  - [ ] Add placeholder text: "e.g., FARMSTAND"
  - [ ] Set field as optional (not required)
  - [ ] Position field appropriately in checkout flow
- [ ] **Task 3: Configure data storage in Shopify** (AC: Stored with order)
  - [ ] Verify code is captured as order attribute or note
  - [ ] Test that submitted codes appear in order details
  - [ ] Ensure codes are searchable in Shopify admin
- [ ] **Task 4: Test booth code submission** (AC: All criteria)
  - [ ] Complete test checkout with booth code "FARMSTAND"
  - [ ] Verify order appears in Shopify admin
  - [ ] Confirm booth code is visible in order details
  - [ ] Test checkout without booth code (optional field)
  - [ ] Test with various code formats (uppercase, lowercase, special chars)
- [ ] **Task 5: Create founder documentation** (AC: Founder can view codes)
  - [ ] Document how to view booth codes in Shopify admin
  - [ ] Create guide for exporting order attributes
  - [ ] Add instructions for tracking attribution over time
  - [ ] Update story completion notes

## Dev Notes

### Implementation Context

This story requires **Shopify checkout customization** to add a custom field. Implementation approach depends on Shopify plan:

**Shopify Plus:**
- Use Checkout Extensibility (native, recommended)
- Full control over checkout fields
- Can add custom fields via Shopify Functions

**Standard Shopify:**
- Use third-party app (e.g., "Order Attributes")
- Limited customization options
- May require paid app subscription

**No Hydrogen code changes needed** - customization happens in Shopify admin/apps.

### Shopify Checkout Extensibility

**For Shopify Plus merchants:**

Checkout Extensibility allows custom fields via Shopify Functions. This is the preferred approach.

**Steps:**
1. Create a Shopify Function (checkout UI extension)
2. Add custom field component
3. Store data as order attribute
4. Deploy via Shopify CLI

**Reference:** [Shopify Docs - Checkout UI Extensions](https://shopify.dev/docs/api/checkout-ui-extensions)

### Third-Party App Approach

**For Standard Shopify plans:**

Several apps provide custom checkout fields:

**Popular options:**
- **Order Attributes** by Zepto Apps (free tier available)
- **Custom Form Builder** by Hulk Apps
- **Checkout Customizer** by checkoutchamp

**Recommended:** Order Attributes (simple, free for basic use)

**Installation:**
1. Install app from Shopify App Store
2. Configure custom field in app dashboard
3. Set field label, placeholder, optional/required
4. Publish to checkout

### Field Configuration

**Label options:**
- "Booth Code" (preferred - clear for farmers market context)
- "Referral Code"
- "How did you find us?"

**Placeholder text:**
- "e.g., FARMSTAND"
- "Enter booth code if applicable"

**Field type:**
- Text input (single line)
- Optional (not required)
- No validation needed (accept any format)

### Data Storage in Shopify

**Order attributes:**

Custom checkout fields are typically stored as **order attributes** (key-value pairs).

**Access in Shopify Admin:**
- Order details page → Additional details section
- Shows as: "Booth Code: FARMSTAND"

**Export:**
- Shopify admin → Orders → Export
- Order attributes included in CSV export
- Can filter/search by attribute value

### Testing Scenarios

**Test cases:**

1. **Booth code provided:**
   - Enter "FARMSTAND" in booth code field
   - Complete checkout
   - Verify code appears in order details
2. **No booth code:**
   - Leave field blank
   - Complete checkout
   - Verify order processes normally (field is optional)
3. **Different code formats:**
   - Test: "farmstand", "FarmStand", "FARM-STAND"
   - Verify all formats are accepted
4. **Special characters:**
   - Test: "BOOTH#123", "SPRING_2026"
   - Verify no errors

### Founder Usage

**How founder views booth codes:**

1. **Individual orders:**
   - Shopify Admin → Orders
   - Click order number
   - Scroll to "Additional details"
   - See "Booth Code: [value]"
2. **Bulk export:**
   - Shopify Admin → Orders
   - Click "Export" button
   - Select "Current search" or "All orders"
   - Download CSV
   - View "Booth Code" column
3. **Analytics:**
   - Use Shopify Reports (if available on plan)
   - Filter orders by booth code value
   - Track attribution over time

### Project Structure Notes

**No codebase files modified** - Shopify admin/app configuration only.

**Related stories:**
- Story 6.5 adds "How did you find us?" survey (similar approach)
- Both can use same customization method (app or Checkout Extensibility)

**Alignment with architecture:**
- ✅ Uses Shopify's checkout system (Architecture.md)
- ✅ No custom form handling in Hydrogen (simplified)
- ✅ Data stored in Shopify (single source of truth)

### Alternative Approaches (Not Recommended)

**❌ Cart note field:**
- Could use Shopify cart note
- Less discoverable in checkout
- Not specific enough for attribution

**❌ Pre-checkout form:**
- Custom Hydrogen form before checkout
- Adds friction to checkout flow
- Requires state management across checkout redirect

**✅ Checkout customization:**
- Native to checkout flow
- No friction
- Data automatically stored with order

### References

- [Source: epics.md lines 1266-1286 - Story 6.4 requirements]
- [Source: epics.md line 43 - FR30: Booth attribution code]
- [Shopify Docs: Checkout UI Extensions](https://shopify.dev/docs/api/checkout-ui-extensions)
- [Shopify Help: Order Attributes](https://help.shopify.com/en/manual/orders/manage-orders#add-order-attributes)
- [Shopify App Store: Order Attributes Apps](https://apps.shopify.com/search?q=order%20attributes)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - Shopify admin/app configuration

### Completion Notes List

_To be filled by Dev agent during implementation_

**Configuration checklist:**
- [ ] Checkout customization method selected (app vs. Extensibility)
- [ ] Custom field added to checkout
- [ ] Field configuration verified (label, placeholder, optional)
- [ ] Test orders completed with booth codes
- [ ] Order attributes visible in Shopify admin
- [ ] Founder documentation created
- [ ] Export tested with booth code data

### File List

**No files modified** - Shopify admin/app configuration only

**Shopify Admin areas modified:**
- Checkout customization settings (if Shopify Plus)
- Installed apps (if using third-party app)
- Order export configuration (for founder analytics)
