# Story 7.8: Implement Invoice Request

Status: ready-for-dev

## Story

As a **wholesale partner**,
I want **to request invoices for my orders**,
so that **I can complete expense reporting without emailing the founder**.

## Acceptance Criteria

**Given** I am viewing an order in Order History
**When** I click "Request Invoice"
**Then** a request is sent to the founder (email notification)
**And** button changes to "Invoice Requested" (disabled)
**And** confirmation message: "We'll send your invoice within 1-2 business days."
**And** founder receives email with order details
**And** MVP: invoice is manually generated and sent by founder
**And** future: could be automated PDF generation

**FRs addressed:** FR28

## Tasks / Subtasks

- [ ] Add "Request Invoice" button to OrderDetails component (AC: 1)
  - [ ] Place near order summary
  - [ ] Use Button component from ui/
- [ ] Implement invoice request action (AC: 2)
  - [ ] Create React Router action
  - [ ] Record invoice request in state
- [ ] Send email notification to founder (AC: 3)
  - [ ] Use Shopify email API or external service
  - [ ] Include order details, customer info
  - [ ] Subject: "Invoice Request: Order #[number] from [Partner]"
- [ ] Update button state (AC: 4)
  - [ ] Change to "Invoice Requested" (disabled)
  - [ ] Persist state across page reloads
- [ ] Show confirmation message (AC: 5)
  - [ ] Display: "We'll send your invoice within 1-2 business days."
  - [ ] Message from `app/content/wholesale.ts`
- [ ] Store invoice request state (AC: 6)
  - [ ] Track which orders have requested invoices
  - [ ] Persist in Shopify order metafields (future)
  - [ ] MVP: Session storage or local storage

## Dev Notes

### Critical Architecture Requirements

**MVP Simplicity:**
- Manual invoice generation by founder (not automated)
- Email notification is the key deliverable
- State persistence nice-to-have but not critical
- Simple implementation, avoid over-engineering

**Email Strategy Options:**

1. **Shopify Email API (Recommended for MVP):**
   - Use Shopify's notification system
   - Send email to founder's admin email
   - Minimal setup required

2. **External Email Service (Future):**
   - SendGrid, Postmark, Resend, etc.
   - More control over template
   - Better for automated invoice generation

3. **Webhook to External Service:**
   - Trigger Zapier/Make workflow
   - Connects to invoice generation tool
   - Easiest no-code option for MVP

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Action | React Router 7 action in orders.$orderId.tsx |
| Email | Shopify Email API or external service |
| State | Session storage (MVP) or order metafields |
| Content | app/content/wholesale.ts |

### File Structure

```
app/
  routes/
    wholesale.orders.$orderId.tsx           # Add invoice request action
  components/
    wholesale/
      OrderDetails.tsx                      # Add Invoice Request button
  content/
    wholesale.ts                            # Invoice request messages
  lib/
    email.server.ts                         # Email sending utility (NEW)
```

### React Router 7 Action Implementation

```typescript
// app/routes/wholesale.orders.$orderId.tsx
export async function action({ request, params, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'requestInvoice') {
    const { orderId } = params;

    try {
      // Get order details
      const orderData = await context.customerAccount.query({
        query: GET_ORDER_DETAILS_QUERY,
        variables: { orderId },
      });

      const order = orderData.order;
      const customer = await getCurrentCustomer(context);

      // Send email to founder
      await sendInvoiceRequestEmail({
        order,
        customer,
        founderEmail: context.env.FOUNDER_EMAIL || 'wholesale@islasuds.com',
      });

      // Return success
      return {
        success: true,
        message: WHOLESALE_DASHBOARD.invoiceRequestConfirmation,
      };
    } catch (error) {
      console.error('Invoice request failed:', error);
      return {
        success: false,
        error: WHOLESALE_ERRORS.invoiceRequestFailed,
      };
    }
  }

  return { success: false };
}
```

### OrderDetails Component Extension

```typescript
// app/components/wholesale/OrderDetails.tsx
export function OrderDetails({ order }: { order: Order }) {
  const fetcher = useFetcher<typeof action>();
  const [invoiceRequested, setInvoiceRequested] = useState(false);

  const isRequesting = fetcher.state === 'submitting';
  const hasRequested = invoiceRequested || fetcher.data?.success;

  // Persist state in session storage (MVP)
  useEffect(() => {
    const key = `invoice-requested-${order.id}`;
    if (fetcher.data?.success) {
      sessionStorage.setItem(key, 'true');
      setInvoiceRequested(true);
    } else {
      setInvoiceRequested(sessionStorage.getItem(key) === 'true');
    }
  }, [fetcher.data, order.id]);

  return (
    <div className={cn("space-y-6")}>
      {/* Order details (existing) */}
      {/* ... */}

      {/* Invoice request button */}
      <div className={cn("border-t pt-6")}>
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="requestInvoice" />

          <Button
            type="submit"
            disabled={hasRequested || isRequesting}
            variant={hasRequested ? 'secondary' : 'primary'}
          >
            {hasRequested
              ? 'Invoice Requested'
              : isRequesting
              ? 'Requesting...'
              : 'Request Invoice'}
          </Button>
        </fetcher.Form>

        {/* Confirmation message */}
        {fetcher.data?.success && (
          <p className={cn("mt-2 text-sm text-green-600")} role="status">
            {fetcher.data.message}
          </p>
        )}

        {/* Error message */}
        {fetcher.data?.error && (
          <p className={cn("mt-2 text-sm text-red-600")} role="alert">
            {fetcher.data.error}
          </p>
        )}
      </div>
    </div>
  );
}
```

### Email Implementation

**Option 1: Shopify Email API (Simple)**

```typescript
// app/lib/email.server.ts
export async function sendInvoiceRequestEmail({
  order,
  customer,
  founderEmail,
}: {
  order: Order;
  customer: Customer;
  founderEmail: string;
}) {
  // Use Shopify's notification system
  // This is a placeholder - actual implementation depends on Shopify setup
  // Shopify can send emails via Admin API or webhooks

  const emailBody = `
New invoice request from wholesale partner:

Partner: ${customer.firstName} ${customer.lastName}
Company: ${customer.company?.name || 'N/A'}
Email: ${customer.email}

Order Details:
- Order Number: ${order.orderNumber}
- Order Date: ${formatOrderDate(order.processedAt)}
- Total: ${formatCurrency(order.currentTotalPrice)}
- Status: ${order.fulfillmentStatus}

Items:
${order.lineItems.edges.map(({ node }) =>
  `- ${node.quantity}x ${node.title}`
).join('\n')}

Log in to Shopify admin to generate and send the invoice.
  `;

  // MVP: Log to console and use Shopify's built-in notifications
  console.log('Invoice request email:', emailBody);

  // TODO: Implement actual email sending
  // Options:
  // 1. Shopify Admin API notification
  // 2. External service (SendGrid, Postmark, Resend)
  // 3. Webhook to Zapier/Make
}
```

**Option 2: External Email Service (Resend Example)**

```typescript
// Requires: npm install resend

import { Resend } from 'resend';

export async function sendInvoiceRequestEmail({
  order,
  customer,
  founderEmail,
}: InvoiceRequestParams) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'wholesale@islasuds.com',
    to: founderEmail,
    subject: `Invoice Request: Order #${order.orderNumber} from ${customer.company?.name}`,
    html: `
      <h2>Invoice Request from ${customer.firstName} ${customer.lastName}</h2>
      <p><strong>Company:</strong> ${customer.company?.name}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <h3>Order Details</h3>
      <p><strong>Order #:</strong> ${order.orderNumber}</p>
      <p><strong>Date:</strong> ${formatOrderDate(order.processedAt)}</p>
      <p><strong>Total:</strong> ${formatCurrency(order.currentTotalPrice)}</p>
      <h3>Items</h3>
      <ul>
        ${order.lineItems.edges.map(({ node }) =>
          `<li>${node.quantity}x ${node.title}</li>`
        ).join('')}
      </ul>
    `,
  });
}
```

### Content Centralization

**app/content/wholesale.ts:**

```typescript
export const WHOLESALE_DASHBOARD = {
  invoiceRequestButton: 'Request Invoice',
  invoiceRequestedButton: 'Invoice Requested',
  invoiceRequestingButton: 'Requesting...',
  invoiceRequestConfirmation: "We'll send your invoice within 1-2 business days.",
} as const;

export const WHOLESALE_ERRORS = {
  invoiceRequestFailed: "Couldn't send your request. Please try again or email us directly.",
} as const;
```

### State Persistence Strategies

**MVP: Session Storage**
- Persists during browser session
- Cleared when browser closed
- Simple, no backend changes

**Better: Order Metafields (Future)**
```typescript
// Store invoice request in Shopify order metafield
await context.admin.query({
  mutation: UPDATE_ORDER_METAFIELD,
  variables: {
    orderId,
    namespace: 'wholesale',
    key: 'invoice_requested',
    value: new Date().toISOString(),
    type: 'date',
  },
});
```

**Read metafield in loader:**
```typescript
const order = await context.admin.query({
  query: GET_ORDER_WITH_METAFIELDS,
  variables: { orderId },
});

const invoiceRequested = order.metafield?.value || false;
```

### Environment Variables

Add to `.env`:
```
FOUNDER_EMAIL=wholesale@islasuds.com
RESEND_API_KEY=re_xxxx  # If using Resend
```

### Testing Requirements

**Unit Tests:**
- Invoice Request button renders
- Button disabled after click
- Confirmation message displays
- Error message displays

**Integration Tests:**
- Invoice request action sends email
- Button state persists across reloads (if using metafields)
- Error handled gracefully
- Email contains correct order details

**Manual Tests (MVP):**
- Click button → check founder email inbox
- Verify email contains all order details
- Test button disabled state
- Test confirmation message

**Test Location:**
- `app/components/wholesale/OrderDetails.test.tsx`
- `tests/integration/wholesale-invoice-request.test.ts`

### Email Testing Strategy

**Development:**
- Use console.log to verify email content
- Or use email testing service (Mailtrap, MailHog)

**Production:**
- Test with real email to founder
- Verify email deliverability
- Check spam folder if not received

### Error Handling

**Email Send Failures:**
- Catch error from email service
- Show friendly message to user
- Log error for debugging
- Provide fallback: "Email us at wholesale@islasuds.com"

**Network Errors:**
- Timeout after 10s
- Show retry option
- Don't disable button permanently

**Rate Limiting:**
- Prevent spam: 1 request per order per session
- Or: 1 request per order ever (if using metafields)

### Future Enhancements (Document as TODOs)

1. **Automated Invoice Generation:**
   - Generate PDF invoice from order data
   - Attach to email automatically
   - Use library like pdfkit or react-pdf

2. **Invoice Download:**
   - Allow partners to download invoice directly
   - Store generated PDFs in Shopify Files

3. **Batch Invoice Requests:**
   - Request invoices for multiple orders at once
   - Useful for monthly accounting

4. **Invoice Status Tracking:**
   - Show when invoice was requested
   - Show when invoice was sent
   - Link to view/download invoice

### Project Context Critical Rules

1. **Content Centralization:** ALL messages in `app/content/wholesale.ts`
2. **Error Handling:** Catch errors, show friendly message, log for debugging
3. **Environment Variables:** Email config in env vars (NEVER hardcode)
4. **User Trust:** Clear confirmation messaging builds confidence
5. **Simplicity:** MVP manual process, automate later

### Anti-Patterns to Avoid

- ❌ Don't build automated invoice generation for MVP (over-engineering)
- ❌ Don't allow multiple requests per order (spam prevention)
- ❌ Don't show technical email errors to users
- ❌ Don't hardcode founder email (use env var)
- ❌ Don't forget to log email sending (debugging critical)

### MVP Implementation Recommendation

**Simplest Path:**
1. Use Shopify's built-in email notifications (if available)
2. Or use webhook to Zapier → Email → Founder
3. State persistence: Session storage (good enough for MVP)
4. Manual invoice generation by founder (not automated)

**Future Iteration:**
- Upgrade to Resend/SendGrid for better templates
- Add automated PDF invoice generation
- Store invoice request in order metafields
- Download invoice directly from portal

### References

- [Source: project-context.md#Content Centralization] - B2B copy location
- [Source: project-context.md#Error Handling] - Catch and log pattern
- [Source: project-context.md#Environment Variables] - Config pattern
- [Source: project-context.md#User Trust Patterns] - Confirmation messaging
- [Source: CLAUDE.md#React Router Patterns] - Action pattern

### Dependencies

**Story 7.7:** Order History and Order Details page must exist

**Validation:** Test email sending in development environment before deploying.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- React Router 7 action pattern for invoice request
- Email sending strategies (Shopify API, external services, webhooks)
- Button state management with session storage
- Confirmation messaging with warm, trustful tone
- Error handling with friendly fallback messages
- Testing strategy for email delivery
- Future enhancements for automated invoice generation
- MVP simplicity emphasized (manual process acceptable)
- Anti-patterns highlighted to prevent over-engineering
- Environment variable configuration for email settings

**Expense reporting enabler** - Removes friction from partner accounting workflows.

### File List

Files to create:
- app/lib/email.server.ts (email sending utility)
- tests/integration/wholesale-invoice-request.test.ts

Files to modify:
- app/routes/wholesale.orders.$orderId.tsx (add invoice request action)
- app/components/wholesale/OrderDetails.tsx (add Request Invoice button)
- app/content/wholesale.ts (add invoice request messages)
- .env (add FOUNDER_EMAIL, optional RESEND_API_KEY)
