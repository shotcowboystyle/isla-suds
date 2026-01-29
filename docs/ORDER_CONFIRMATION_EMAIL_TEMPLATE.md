📧 Isla Suds Order Confirmation Email Template

Subject Line Options

Choose one (or customize):

Your Isla Suds order is on its way 🧼
We're packing your soap right now
Thank you for your order from Isla Suds

Recommendation: Option 1 (warm + emoji appropriate for email subject)

---
Email Body Copy (Ready to Paste)

Hi {{ customer.first_name }},

Thank you for your order! We're excited to send you {{ line_items_count }} item{% if line_items_count > 1  
%}s{% endif %} from Isla Suds.

ORDER SUMMARY
{{ line_items }}

Subtotal: {{ subtotal_price }}
Shipping: {{ shipping_price }}
Total: {{ total_price }}

SHIPPING TO
{{ shipping_address }}

Your soap should arrive in 5-7 business days.

---

We'd love to hear about your first shower with Isla Suds.

In a few days, we'll send you a quick survey link to share your experience. Your feedback helps us make
better soap.

---

If you have any questions about your order, just reply to this email. We're here to help.

Your soap is on its way. We can't wait for you to try it.

– The Isla Suds Team

Order number: {{ order.name }}

---
Available Liquid Variables Reference

Use these in the Shopify notification template editor:

{{ shop.name }}                  # "Isla Suds"
{{ customer.first_name }}        # Customer's first name
{{ customer.last_name }}         # Customer's last name
{{ customer.email }}             # Customer's email

{{ order.name }}                 # Order number (e.g., "#1001")
{{ order.order_number }}         # Numeric ID (e.g., "1001")
{{ order.created_at }}           # Order timestamp

{{ line_items }}                 # Auto-formatted line items table
{{ line_items_count }}           # Number of items

{{ subtotal_price }}             # Subtotal with currency
{{ shipping_price }}             # Shipping cost
{{ total_price }}                # Total with currency

{{ shipping_address }}           # Formatted shipping address
{{ billing_address }}            # Formatted billing address

{{ tracking_url }}               # Fulfillment tracking (if available)
{{ tracking_number }}            # Tracking number (if available)

Shopify Docs: <https://help.shopify.com/en/manual/orders/notifications/email-variables>

---
Configuration Instructions

Step-by-step process:

1. Navigate: Shopify Admin → Settings → Notifications
2. Locate: "Order confirmation" template
3. Edit subject line: Replace with chosen subject from above
4. Edit email body:
    - Review existing template structure
    - Replace body content with provided copy above
    - Keep footer (contains legal requirements: address, unsubscribe)
5. Preview: Use "Preview" button to see formatting
6. Send test: Click "Send test email" → Enter your email
7. Verify test email: Check inbox, test on mobile

---
Testing Checklist

After configuration, verify:

Desktop Email Client:

- Subject line displays correctly (emoji renders or gracefully degrades)
- Personalized greeting shows customer first name
- Line items table is readable
- Order total displays correctly
- Shipping address formats properly
- Day 3 survey section is visible
- Warm closing message appears
- Footer includes store address and unsubscribe

Mobile Email App:

- Email is responsive (readable on small screen)
- No horizontal scrolling required
- All text is legible without zooming
- Line items don't break layout

Data Population:

- {{ customer.first_name }} renders actual name (not variable literal)
- {{ order.name }} shows order number
- {{ line_items }} generates proper table
- {{ total_price }} includes currency symbol

Full Checkout Test:

- Complete a test order using Shopify test payment
- Verify real confirmation email arrives
- Check all variables populate with actual order data

---
Documentation Template

After completing configuration, capture these details:

Screenshot Locations:

- Save screenshot of final email preview from Shopify Admin
- Save screenshot of test email in inbox (desktop)
- Save screenshot of test email on mobile

Configuration Notes:

## Shopify Notification Template Configuration

**Template:** Order confirmation
**Configured:** [DATE]
**Configured by:** [YOUR NAME]

### Subject Line

[Paste actual subject line used]

### Custom Liquid Variables Used

- {{ customer.first_name }} - Personalized greeting
- {{ line_items }} - Order summary table
- {{ shipping_address }} - Delivery destination
- {{ total_price }} - Order total
- [List any others if customized beyond template]

### Tone & Voice

- Warm, personal messaging per NFR27
- Avoided transactional language ("Order #1234 processed")
- Used first-person plural ("We're excited...")
- Included required closing: "Your soap is on its way. We can't wait for you to try it."

### Day 3 Survey Link

- Placeholder text added
- To be updated in Story 6.6 with actual survey link
- Section includes teaser: "We'd love to hear about your first shower with Isla Suds"
