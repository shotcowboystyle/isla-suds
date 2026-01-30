# Payment Retry Flow - Manual Test Plan

**Story:** 6.3 - Implement Payment Retry Flow
**Test Date:** _To be completed by QA_
**Tester:** _Name_
**Environment:** Shopify Development Store

---

## Test Overview

This test plan verifies that Shopify's built-in payment retry functionality works correctly for Isla Suds checkout. The payment retry flow is **fully managed by Shopify** - no custom code implementation required.

---

## Prerequisites

- [ ] Access to Isla Suds Shopify development store
- [ ] Shopify Payments test mode enabled
- [ ] At least one product available in store
- [ ] Test credit card numbers available (see below)

---

## Test Cards

### Declined Payment (Generic Decline)
```
Card Number: 4000 0000 0000 0002
Expiry: Any future date (e.g., 12/26)
CVC: Any 3 digits (e.g., 123)
Result: Generic card decline
```

### Insufficient Funds
```
Card Number: 4000 0000 0000 9995
Expiry: Any future date
CVC: Any 3 digits
Result: Card has insufficient funds
```

### Successful Payment (After Retry)
```
Card Number: 1 (Shopify Bogus Gateway success)
Or use any valid test card ending in even number
```

**Reference:** [Shopify Testing Shopify Payments](https://help.shopify.com/en/manual/payments/shopify-payments/testing-shopify-payments)

---

## Test Scenarios

### Scenario 1: Declined Payment - Cart Persistence

**Objective:** Verify cart items are preserved when payment is declined

**Steps:**
1. Navigate to Isla Suds store homepage
2. Add a product to cart (e.g., "Cedar & Sage Soap")
3. Open cart drawer - verify item is present
4. Click "Proceed to Checkout"
5. Fill out shipping information (use test address)
6. Enter payment details using **declined test card** (4000 0000 0000 0002)
7. Complete checkout form and submit

**Expected Results:**
- [ ] Checkout displays error message (e.g., "Your payment could not be processed")
- [ ] Error message is NOT harsh or accusatory (professional tone)
- [ ] Cart items remain visible in checkout
- [ ] User can edit payment method
- [ ] Shipping information remains filled in
- [ ] No need to re-add items to cart

---

### Scenario 2: Payment Retry with Different Card

**Objective:** Verify user can retry payment with a different card

**Steps:**
1. Complete Scenario 1 (declined payment)
2. Update payment method to **valid test card** (1 or any Bogus Gateway success card)
3. Click "Pay Now" or "Complete Order"

**Expected Results:**
- [ ] Payment processes successfully
- [ ] Order confirmation page appears
- [ ] Order appears in Shopify admin
- [ ] Cart items match original selection
- [ ] No duplicate charges

---

### Scenario 3: Multiple Payment Retries

**Objective:** Verify cart persists through multiple failed payment attempts

**Steps:**
1. Add product to cart
2. Proceed to checkout, enter shipping info
3. Attempt payment with **declined card** (4000 0000 0000 0002)
4. Verify error appears, cart persists
5. Attempt payment with **insufficient funds card** (4000 0000 0000 9995)
6. Verify error appears, cart still persists
7. Retry with **valid card**

**Expected Results:**
- [ ] Cart items preserved after first failure
- [ ] Cart items preserved after second failure
- [ ] Different error messages for different failure types (if available)
- [ ] Third attempt succeeds
- [ ] Order total matches original cart
- [ ] No cart items lost during retry process

---

### Scenario 4: Insufficient Funds Error

**Objective:** Verify specific error message for insufficient funds

**Steps:**
1. Add product to cart, proceed to checkout
2. Enter valid shipping information
3. Use **insufficient funds test card** (4000 0000 0000 9995)
4. Submit payment

**Expected Results:**
- [ ] Specific "insufficient funds" error message displays (if Shopify provides it)
- [ ] Cart items remain in checkout
- [ ] Can retry with different payment method
- [ ] Error message styling matches Shopify checkout theme

---

### Scenario 5: Mobile Retry Flow

**Objective:** Verify retry flow works on mobile devices

**Steps:**
1. Use mobile device or browser responsive mode (iPhone 12 viewport)
2. Add product to cart
3. Proceed to checkout
4. Use **declined test card** (4000 0000 0000 0002)
5. Verify error message is readable on mobile
6. Retry with valid card

**Expected Results:**
- [ ] Error message clearly visible on mobile screen
- [ ] Retry button accessible (no layout issues)
- [ ] Cart items visible on mobile checkout
- [ ] Payment retry works identically to desktop

---

### Scenario 6: Multiple Line Items

**Objective:** Verify cart with multiple products persists during retry

**Steps:**
1. Add 2-3 different products to cart
2. Proceed to checkout
3. Use **declined test card**
4. Verify all line items still present
5. Retry with valid card

**Expected Results:**
- [ ] All cart line items visible after failure
- [ ] Quantities preserved
- [ ] Variant selections preserved (if applicable)
- [ ] Total price remains correct
- [ ] Order confirms with all items

---

## Error Message Analysis

**Record the actual error messages displayed:**

### Declined Payment Error:
```
Actual message: _________________________________

Tone assessment (warm/neutral/harsh): _________

Matches brand voice (yes/no): _________________
```

### Insufficient Funds Error:
```
Actual message: _________________________________

Tone assessment: _____________________________

Matches brand voice: _________________________
```

### Error Styling:
- Error color: ___________
- Harsh red? (yes/no): ___________
- Matches Shopify checkout branding? ___________

---

## Customization Opportunities

### Error Message Customization
- [ ] Check Shopify admin → Settings → Checkout for error message options
- [ ] Check if Shopify Plus features available (Checkout Scripts)
- [ ] Document if customization is possible: __________________
- [ ] If not possible, document limitation

### Checkout Branding
- [ ] Verify checkout uses Isla Suds teal accent color (#3a8a8c)
- [ ] Verify error styling doesn't clash with brand
- [ ] Note any branding improvements available

---

## Pass/Fail Criteria

**Story passes if:**
- ✅ Cart items persist through payment failures (Shopify built-in)
- ✅ User can retry payment without re-adding items
- ✅ Error messages are professional and non-accusatory
- ✅ Retry flow works on mobile devices
- ✅ Multiple line items preserved correctly

**Story fails if:**
- ❌ Cart resets after payment failure
- ❌ User forced to re-add items
- ❌ Error messages are harsh or technical
- ❌ Retry button not accessible
- ❌ Cart items lost during retry

---

## Additional Notes

**Expected Behavior (Based on Shopify Documentation):**

Shopify's managed checkout includes built-in payment retry functionality:
1. Payment processor declines transaction
2. Checkout displays error message
3. Cart items remain in checkout (preserved by Shopify)
4. Customer can update payment method
5. Customer can retry without losing cart

**This is standard Shopify behavior** - no custom implementation needed.

**If cart persistence fails:**
- This would be a Shopify platform bug, not an Isla Suds code issue
- Escalate to Shopify support
- Check Storefront API cart recovery as potential workaround

---

## Test Results

**Overall Result:** [ ] PASS  [ ] FAIL  [ ] BLOCKED

**Blocking Issues:** _____________________________________________________

**Recommendations:** _____________________________________________________

**Tester Signature:** _________________ **Date:** _____________

---

**References:**
- [Shopify Testing Payments](https://help.shopify.com/en/manual/payments/shopify-payments/testing-shopify-payments)
- [Shopify Checkout Recovery](https://shopify.dev/docs/api/storefront/checkout)
- [Shopify Test Cards](https://help.shopify.com/en/partners/manage-clients-stores/client-transfer-stores/test-orders)
