/**
 * Email Utility (Server-side only)
 *
 * Sends transactional emails via Resend.
 * Requires RESEND_API_KEY and FOUNDER_EMAIL env vars.
 */

import {Resend} from 'resend';
import {formatDate} from '~/utils/format-date';
import {formatMoney} from '~/utils/format-money';
import type {EmailOrder, EmailCustomer} from '~/types/wholesale';

const FROM_ADDRESS = 'Isla Suds <notifications@islasuds.com>';

function getResend(apiKey: string): Resend {
  return new Resend(apiKey);
}

// ── Contact Form ────────────────────────────────────────────────────────

interface ContactFormParams {
  apiKey: string;
  to: string;
  name: string;
  email: string;
  subject: string;
  orderNumber?: string;
  message: string;
}

export async function sendContactFormEmail({
  apiKey,
  to,
  name,
  email,
  subject,
  orderNumber,
  message,
}: ContactFormParams): Promise<void> {
  const resend = getResend(apiKey);

  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    replyTo: email,
    subject: `Contact: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Subject:</strong> ${subject}</p>
      ${orderNumber ? `<p><strong>Order #:</strong> ${orderNumber}</p>` : ''}
      <hr />
      <p>${message.replace(/\n/g, '<br />')}</p>
    `,
  });
}

// ── Invoice Request ─────────────────────────────────────────────────────

interface InvoiceRequestParams {
  apiKey: string;
  order: EmailOrder;
  customer: EmailCustomer;
  founderEmail: string;
}

export async function sendInvoiceRequestEmail({
  apiKey,
  order,
  customer,
  founderEmail,
}: InvoiceRequestParams): Promise<void> {
  const resend = getResend(apiKey);

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: founderEmail,
    subject: `Invoice Request: Order #${order.orderNumber} from ${customer.company?.name || customer.firstName}`,
    html: `
      <h2>Invoice Request from ${customer.firstName} ${customer.lastName}</h2>
      <p><strong>Company:</strong> ${customer.company?.name || 'N/A'}</p>
      <p><strong>Email:</strong> ${customer.email}</p>

      <h3>Order Details</h3>
      <p><strong>Order #:</strong> ${order.orderNumber}</p>
      <p><strong>Date:</strong> ${formatDate(order.processedAt)}</p>
      <p><strong>Total:</strong> ${formatMoney(order.currentTotalPrice)}</p>
      <p><strong>Status:</strong> ${order.fulfillmentStatus}</p>

      <h3>Items</h3>
      <ul>
        ${order.lineItems.edges
          .map(({node}) => `<li>${node.quantity}x ${node.title}</li>`)
          .join('')}
      </ul>

      <p>Log in to Shopify admin to generate and send the invoice.</p>
    `,
  });
}
