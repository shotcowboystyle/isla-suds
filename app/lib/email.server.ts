/**
 * Email Utility (Server-side only)
 *
 * Handles sending emails for invoice requests and other notifications.
 * MVP: Logs to console, ready for external service integration.
 */

import {formatCurrency} from '~/utils/format-currency';
import {formatOrderDate} from '~/utils/format-date';

interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

interface LineItem {
  id: string;
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
  } | null;
}

interface Order {
  id: string;
  name: string;
  orderNumber: string;
  processedAt: string;
  fulfillmentStatus: string;
  currentTotalPrice: MoneyV2;
  lineItems: {
    edges: Array<{node: LineItem}>;
  };
}

interface Customer {
  firstName: string | null;
  lastName: string | null;
  email: string;
  company?: {
    name: string;
  } | null;
}

interface InvoiceRequestParams {
  order: Order;
  customer: Customer;
  founderEmail: string;
}

/**
 * Send invoice request email to founder
 *
 * MVP Implementation: Logs email content to console
 * Future: Integrate with Resend, SendGrid, or Shopify Email API
 *
 * @param params - Order, customer, and recipient email information
 */
export async function sendInvoiceRequestEmail({
  order,
  customer,
  founderEmail,
}: InvoiceRequestParams): Promise<void> {
  const emailSubject = `Invoice Request: Order #${order.orderNumber} from ${customer.company?.name || customer.firstName}`;

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
${order.lineItems.edges
  .map(({node}) => `- ${node.quantity}x ${node.title}`)
  .join('\n')}

Log in to Shopify admin to generate and send the invoice.
  `.trim();

  // MVP: Log to console for debugging (using console.warn for visibility in production logs)
  // This is intentional MVP behavior - will be replaced with actual email service
  console.warn('='.repeat(80));
  console.warn('📧 INVOICE REQUEST EMAIL');
  console.warn('='.repeat(80));
  console.warn(`To: ${founderEmail}`);
  console.warn(`Subject: ${emailSubject}`);
  console.warn('-'.repeat(80));
  console.warn(emailBody);
  console.warn('='.repeat(80));

  // Simulate successful send (MVP behavior)
  // See story Dev Notes for production integration options:
  // Resend, SendGrid, Shopify Email API, or Zapier webhook
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Example Resend Integration (commented out)
 *
 * Uncomment and install 'resend' package when ready to use:
 * npm install resend
 */

/*
import { Resend } from 'resend';

export async function sendInvoiceRequestEmail({
  order,
  customer,
  founderEmail,
}: InvoiceRequestParams): Promise<void> {
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
      <p><strong>Status:</strong> ${order.fulfillmentStatus}</p>

      <h3>Items</h3>
      <ul>
        ${order.lineItems.edges.map(({ node }) =>
          `<li>${node.quantity}x ${node.title}</li>`
        ).join('')}
      </ul>

      <p>Log in to Shopify admin to generate and send the invoice.</p>
    `,
  });
}
*/
