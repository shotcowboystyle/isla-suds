# Story 6.5: Add "How Did You Find Us?" Survey

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **customer**,
I want **to answer how I found Isla Suds**,
So that **the founder understands which channels are working**.

## Acceptance Criteria

**Given** I am in Shopify checkout
**When** I look for the survey question
**Then** I see: "How did you find us?"

- Options: Farmers Market, Friend/Family, Social Media, Search, Other
- Selection is optional

**And** response is stored with order in Shopify
**And** founder can view survey responses in Shopify admin
**And** implemented via Shopify checkout customization or post-purchase survey app

## Tasks / Subtasks

- [ ] **Task 1: Determine implementation approach** (AC: All criteria)
  - [ ] Review options: checkout field vs. post-purchase survey
  - [ ] Check if Story 6.4's customization method supports dropdowns
  - [ ] Decide: same approach as booth code (6.4) or separate survey app
  - [ ] Document chosen approach and rationale
- [ ] **Task 2: Configure survey question and options** (AC: Question and options)
  - [ ] Add question: "How did you find us?"
  - [ ] Configure options:
    - Farmers Market
    - Friend/Family
    - Social Media
    - Search
    - Other
  - [ ] Set as optional (not required)
  - [ ] Position appropriately in checkout or post-purchase flow
- [ ] **Task 3: Configure data storage** (AC: Stored with order)
  - [ ] Verify response is stored as order attribute or survey response
  - [ ] Test that responses appear in order details
  - [ ] Ensure responses are exportable for analytics
- [ ] **Task 4: Test survey submission** (AC: All criteria)
  - [ ] Complete checkout with each option selected
  - [ ] Verify responses appear in Shopify admin
  - [ ] Test checkout without selecting option (optional field)
  - [ ] Verify "Other" option if available
- [ ] **Task 5: Create analytics documentation** (AC: Founder can view responses)
  - [ ] Document how to view survey responses in Shopify admin
  - [ ] Create guide for exporting and analyzing responses
  - [ ] Provide sample analytics queries (e.g., "% from Farmers Market")
  - [ ] Update story completion notes

## Dev Notes

### Implementation Context

Similar to Story 6.4 (booth code), this requires **Shopify checkout customization**. Two approaches:

**Approach A: Checkout field (same as 6.4)**
- Add dropdown to checkout alongside booth code
- Uses same customization method (app or Extensibility)
- Data stored as order attribute

**Approach B: Post-purchase survey**
- Use post-purchase survey app (e.g., Zigpoll, OrderMetrics)
- Survey appears on order confirmation page
- May provide better analytics UI

**Recommendation:** Use **Approach A** (checkout field) for consistency with Story 6.4.

### Shopify Checkout Customization (Approach A)

**If using same method as Story 6.4:**

- Same app or Checkout Extensibility setup
- Add second custom field with dropdown type
- Options: Farmers Market, Friend/Family, Social Media, Search, Other

**Field configuration:**
```
Type: Dropdown (select)
Label: "How did you find us?"
Options:
  - Farmers Market
  - Friend/Family
  - Social Media
  - Search
  - Other
Required: No (optional)
```

### Post-Purchase Survey (Approach B - Alternative)

**If using dedicated survey app:**

**Popular options:**
- **Zigpoll** - Post-purchase surveys with analytics
- **OrderMetrics** - Customer acquisition tracking
- **Fairing** - Attribution surveys

**Benefits:**
- Better analytics UI
- More question types
- Dedicated reporting

**Drawbacks:**
- Separate from checkout flow
- Lower response rate
- Additional app cost

**Recommendation:** Only use if checkout approach not feasible.

### Data Storage Options

**Order attribute (Approach A):**
- Stored as: `referral_source: "Farmers Market"`
- Visible in order details
- Exportable via CSV

**Survey response (Approach B):**
- Stored in survey app database
- Linked to order by ID
- Analytics in app dashboard

### Survey Options Analysis

**From epics.md AC:**
> Options: Farmers Market, Friend/Family, Social Media, Search, Other

**Rationale for each:**
- **Farmers Market** - Primary offline channel
- **Friend/Family** - Word-of-mouth tracking
- **Social Media** - Instagram/Facebook attribution
- **Search** - Google/SEO effectiveness
- **Other** - Catch-all for unexpected sources

**Note:** These options cover all major acquisition channels.

### Testing Scenarios

**Test each option:**

1. **Farmers Market:**
   - Select option
   - Complete checkout
   - Verify response stored
2. **Friend/Family:**
   - Select option
   - Complete checkout
   - Verify response stored
3. **Social Media:**
   - Select option
   - Complete checkout
   - Verify response stored
4. **Search:**
   - Select option
   - Complete checkout
   - Verify response stored
5. **Other:**
   - Select option
   - Complete checkout
   - Verify response stored (if text input, test with custom value)
6. **No selection:**
   - Leave blank
   - Complete checkout
   - Verify order processes (field is optional)

### Founder Analytics

**How founder analyzes survey data:**

1. **Export orders:**
   - Shopify Admin → Orders → Export
   - Download CSV with order attributes
2. **Analyze in spreadsheet:**
   - Create pivot table
   - Count responses by source
   - Calculate percentages
3. **Example insights:**
   - "45% from Farmers Market" → focus on booth presence
   - "30% from Friend/Family" → word-of-mouth strong
   - "20% from Social Media" → increase social efforts
   - "5% from Search" → SEO opportunity

### Integration with Story 6.4

**If using same customization method:**

Both booth code (6.4) and survey (6.5) can be added together:

**Checkout fields:**
```
1. Booth Code (optional text input)
2. How did you find us? (optional dropdown)
```

**Benefits:**
- Single configuration step
- Consistent UI
- Combined analytics possible (e.g., "Farmers Market + FARMSTAND code")

### Project Structure Notes

**No codebase files modified** - Shopify admin/app configuration only.

**Related stories:**
- Story 6.4 adds booth code (same implementation approach)
- Can be configured together in single session

**Alignment with architecture:**
- ✅ Uses Shopify's checkout system
- ✅ No custom survey form in Hydrogen
- ✅ Data automatically stored with orders

### Alternative: Custom Hydrogen Form (Not Recommended)

**❌ Pre-checkout survey form:**
- Custom Hydrogen route with survey form
- Store response in session, pass to checkout
- Adds friction, complex state management

**✅ Checkout customization:**
- Native to checkout flow
- No additional steps
- Automatic data storage

### References

- [Source: epics.md lines 1288-1308 - Story 6.5 requirements]
- [Source: epics.md line 44 - FR31: Checkout survey]
- [Source: 6-4-add-booth-attribution-code-field.md - Related implementation]
- [Shopify Docs: Checkout UI Extensions](https://shopify.dev/docs/api/checkout-ui-extensions)
- [Shopify Help: Order Attributes](https://help.shopify.com/en/manual/orders/manage-orders#add-order-attributes)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - Shopify admin/app configuration

### Completion Notes List

_To be filled by Dev agent during implementation_

**Configuration checklist:**
- [ ] Implementation approach decided (checkout field vs. survey app)
- [ ] Survey question added to checkout
- [ ] All 5 options configured correctly
- [ ] Field set as optional
- [ ] Test orders completed for each option
- [ ] Responses visible in Shopify admin
- [ ] Founder analytics guide created
- [ ] Export tested with survey data

### File List

**No files modified** - Shopify admin/app configuration only

**Shopify Admin areas modified:**
- Checkout customization settings (if using same method as 6.4)
- Installed apps (if using survey app)
- Order export configuration (for founder analytics)
