# Story 6.3: Implement Payment Retry Flow

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to retry my payment if it fails without re-entering my cart**,
So that **a payment error doesn't make me start over**.

## Acceptance Criteria

**Given** my payment is declined during checkout
**When** I see the error message
**Then** the message is warm and non-accusatory:

- "That didn't go through. No worries—let's try again."

**And** my cart items are preserved
**And** I can update payment details and retry
**And** retry works without re-adding items to cart
**And** error message styling matches brand (no harsh red)

## Tasks / Subtasks

- [ ] **Task 1: Research Shopify checkout error handling** (AC: All criteria)
  - [ ] Review Shopify Checkout documentation for payment failure behavior
  - [ ] Test payment decline scenarios with test cards
  - [ ] Document default Shopify error handling
  - [ ] Identify customization options (if any)
- [ ] **Task 2: Verify cart persistence during payment failure** (AC: Cart preserved)
  - [ ] Trigger payment decline in test checkout
  - [ ] Verify cart items remain in checkout
  - [ ] Verify user can retry without losing cart state
  - [ ] Test with multiple line items
- [ ] **Task 3: Customize checkout error messaging (if possible)** (AC: Warm messaging)
  - [ ] Check if Shopify allows custom error messages in checkout
  - [ ] If available: Update payment error copy to brand-warm version
  - [ ] If not available: Document limitation and default behavior
  - [ ] Verify error message styling (avoid harsh red if possible)
- [ ] **Task 4: Test retry flow end-to-end** (AC: Retry works)
  - [ ] Use Shopify test card for declined payment (4000 0000 0000 0002)
  - [ ] Verify error message appears
  - [ ] Update payment method in checkout
  - [ ] Retry payment with valid card
  - [ ] Verify successful order completion
- [ ] **Task 5: Document retry flow behavior** (AC: All criteria)
  - [ ] Document default Shopify retry behavior
  - [ ] List customization limitations (if any)
  - [ ] Add testing instructions for future QA
  - [ ] Update story completion notes

## Dev Notes

### Implementation Context

**Shopify Checkout is fully managed** - payment retry flow is built into Shopify's checkout system. This story is primarily **verification and testing**, with optional customization if Shopify allows it.

**Key constraint:** Isla Suds uses **Shopify-managed checkout**, not custom checkout. This means:
- Payment processing handled by Shopify
- Error handling managed by Shopify
- Cart persistence managed by Shopify
- **Limited customization** of error messages/flow

**No Hydrogen code changes expected** unless testing reveals cart persistence issues.

### Shopify Checkout Error Behavior (Default)

**How Shopify handles payment failures:**

1. Payment processor declines transaction
2. Checkout displays error message
3. Cart items remain in checkout (preserved)
4. Customer can update payment method
5. Customer can retry without losing cart

**This is built-in behavior** - no custom implementation needed.

**Reference:** [Shopify Docs - Checkout Recovery](https://shopify.dev/docs/api/storefront/checkout)

### Shopify Test Cards for Payment Failures

**Declined payment test card:**
```
Card Number: 4000 0000 0000 0002
Expiry: Any future date (e.g., 12/26)
CVC: Any 3 digits (e.g., 123)
Result: Generic decline
```

**Insufficient funds test card:**
```
Card Number: 4000 0000 0000 9995
Result: Card has insufficient funds
```

**Reference:** [Shopify Test Cards](https://shopify.dev/docs/apps/build/payments/testing-payment-flows)

### Error Message Customization Options

**Shopify Checkout error messages:**

- **Default errors** are managed by Shopify and payment processor
- **Customization very limited** on standard Shopify plans
- **Shopify Plus** may allow custom scripts/messaging
- **Checkout branding** can adjust colors, but error messaging is fixed

**Action plan:**
1. Test default error messages
2. If generic/harsh, document as limitation
3. If Shopify Plus available, explore customization
4. Otherwise, accept default Shopify errors (they're reasonable)

### Brand Tone Alignment

**Desired error message (from AC):**
> "That didn't go through. No worries—let's try again."

**Shopify default (approximate):**
> "Your payment could not be processed. Please try again or use a different payment method."

**Gap analysis:**
- Shopify default is professional but less warm
- Not harsh or accusatory
- Acceptable if customization not possible

**If customization possible:**
- Update to match brand voice
- Use warm, reassuring tone
- Avoid technical jargon

### Cart Persistence Verification

**Critical test scenario:**

1. Add product to cart
2. Start checkout
3. Enter valid shipping info
4. Use declined test card
5. **Verify:** Cart items still present
6. **Verify:** Can retry with different card
7. **Verify:** Successful order after retry

**Expected behavior:** Shopify preserves cart during payment failures. If this fails, it's a Shopify bug, not our code.

### Error Styling Considerations

**From AC:** "Error message styling matches brand (no harsh red)"

**Shopify checkout branding:**
- Can customize primary color (teal: #3a8a8c)
- Can customize button colors
- Error colors may be fixed by Shopify

**If error red is harsh:**
- Check Shopify checkout theme settings
- See if error color can be customized
- Document if not customizable

### Testing Approach

**Test scenarios:**

1. **Declined payment:**
   - Use 4000 0000 0000 0002
   - Verify error appears
   - Verify cart preserved
   - Retry with valid card
2. **Insufficient funds:**
   - Use 4000 0000 0000 9995
   - Verify specific error message
   - Retry with valid card
3. **Multiple retries:**
   - Fail payment twice
   - Succeed on third attempt
   - Verify cart never resets

**Mobile testing:**
- Test retry flow on mobile
- Verify error message is readable
- Confirm retry button is accessible

### Project Structure Notes

**No codebase files expected to change** unless testing reveals issues:

- Cart persistence is Shopify-managed (via checkoutUrl)
- Error handling is Shopify-managed (in checkout)
- Retry flow is built into Shopify Checkout

**If cart persistence fails (unlikely):**
- May need to investigate Shopify Storefront API cart recovery
- Check `app/lib/shopify/cart.ts` for persistence logic
- Ensure cart ID is correctly stored in localStorage

**Alignment with architecture:**
- ✅ Uses Shopify-managed checkout (Architecture.md)
- ✅ No custom payment handling (NFR15)
- ✅ Warm error messaging aligns with brand (NFR22)

### Acceptance Criteria Validation

**AC1: Warm error message**
- ✅ If customizable: Update to brand voice
- ⚠️ If not customizable: Document default Shopify message

**AC2: Cart items preserved**
- ✅ Built into Shopify Checkout
- ✅ Verify with test scenarios

**AC3: Can update payment details and retry**
- ✅ Built into Shopify Checkout
- ✅ Verify with test scenarios

**AC4: Retry works without re-adding items**
- ✅ Built into Shopify Checkout
- ✅ Verify cart never resets during retry

**AC5: Error styling matches brand**
- ✅ If customizable: Adjust error color
- ⚠️ If not customizable: Document limitation

### References

- [Source: epics.md lines 1244-1264 - Story 6.3 requirements]
- [Source: epics.md line 142 - NFR22: Warm error messaging tone]
- [Source: project-context.md lines 799-802 - User trust patterns]
- [Shopify Docs: Checkout Recovery](https://shopify.dev/docs/api/storefront/checkout)
- [Shopify Docs: Test Payment Cards](https://shopify.dev/docs/apps/build/payments/testing-payment-flows)
- [Shopify Help: Checkout Customization](https://help.shopify.com/en/manual/checkout-settings)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - Shopify-managed checkout verification

### Completion Notes List

_To be filled by Dev agent during testing_

**Testing checklist:**
- [ ] Declined payment error tested
- [ ] Cart persistence verified
- [ ] Payment retry successful
- [ ] Error message tone documented
- [ ] Mobile retry flow verified
- [ ] Customization options explored

### File List

**No files expected to be modified** - Shopify-managed checkout

**If cart persistence issues discovered:**
- `app/lib/shopify/cart.ts` - Cart recovery logic (if needed)
- `app/components/cart/CartDrawer.tsx` - Cart state handling (if needed)
