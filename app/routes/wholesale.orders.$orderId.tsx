import {useEffect, useState} from 'react';
import {redirect, useFetcher, useLoaderData} from 'react-router';
import {Button} from '~/components/ui/Button';
import {wholesaleContent} from '~/content/wholesale';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {GET_CUSTOMER_QUERY} from '~/graphql/customer-account/GetCustomer';
import {GET_ORDER_DETAILS_QUERY} from '~/graphql/customer-account/GetOrderDetails';
import {sendInvoiceRequestEmail} from '~/lib/email.server';
import {cn} from '~/utils/cn';
import {formatCurrency, getCurrencyLabel} from '~/utils/format-currency';
import {formatDate} from '~/utils/format-date';
import type {Route} from './+types/wholesale.orders.$orderId';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Order Details | Wholesale | Isla Suds'}];
};

// TypeScript interfaces for Customer Account API response
interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

interface ProductVariant {
  id: string;
  title: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
}

interface LineItem {
  id: string;
  title: string;
  quantity: number;
  variant: ProductVariant | null;
  originalTotalPrice: MoneyV2;
  discountedTotalPrice: MoneyV2;
}

interface LineItemEdge {
  node: LineItem;
}

interface ShippingAddress {
  formatted: string[];
}

interface Order {
  id: string;
  name: string;
  orderNumber: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  currentTotalPrice: MoneyV2;
  subtotalPrice: MoneyV2;
  totalTax: MoneyV2;
  shippingCost: MoneyV2;
  lineItems: {
    edges: LineItemEdge[];
  };
  shippingAddress: ShippingAddress | null;
}

interface OrderDetailsResponse {
  data: {
    order: Order | null;
  };
}

export async function loader({params, context}: Route.LoaderArgs) {
  const customerId = await context.session.get('customerId');

  if (!customerId) {
    return redirect(WHOLESALE_ROUTES.LOGIN);
  }

  const {orderId} = params;

  try {
    const orderData = (await context.customerAccount.query(
      GET_ORDER_DETAILS_QUERY,
      {variables: {query: orderId}},
    )) as OrderDetailsResponse;

    if (!orderData?.data?.order) {
      throw new Response('Order not found', {status: 404});
    }

    return {order: orderData.data.order};
  } catch (_error) {
    throw new Response('Order not found', {status: 404});
  }
}

export async function action({request, params, context}: Route.ActionArgs) {
  const customerId = await context.session.get('customerId');

  if (!customerId) {
    return redirect(WHOLESALE_ROUTES.LOGIN);
  }

  const formData = await request.formData();
  const intent = formData.get('intent');

  // Validate intent is a string and matches expected value
  if (typeof intent !== 'string' || intent !== 'requestInvoice') {
    return {success: false};
  }

  const {orderId} = params;

  try {
    // Get order details
    const orderData = (await context.customerAccount.query(
      GET_ORDER_DETAILS_QUERY,
      {variables: {query: orderId}},
    )) as OrderDetailsResponse;

    const order = orderData?.data?.order;

    if (!order) {
      return {
        success: false,
        error: wholesaleContent.invoice.errorMessage,
      };
    }

    // Get customer details
    const customerData =
      await context.customerAccount.query(GET_CUSTOMER_QUERY);

    const customer = customerData?.data?.customer;

    if (!customer) {
      return {
        success: false,
        error: wholesaleContent.invoice.errorMessage,
      };
    }

    // Validate founder email is configured
    const founderEmail = context.env.FOUNDER_EMAIL;
    if (!founderEmail) {
      // Safe to return error to user: configuration issue prevents invoice requests
      // User should contact support if this occurs
      // Safe to return error: configuration issue prevents invoice requests
      return {
        success: false,
        error: wholesaleContent.invoice.errorMessage,
      };
    }

    await sendInvoiceRequestEmail({
      order,
      customer: {
        email: customer.emailAddress?.emailAddress ?? '',
        firstName: customer.firstName ?? null,
        lastName: customer.lastName ?? null,
        ...customer,
      },
      founderEmail,
    });

    // Return success
    return {
      success: true,
      message: wholesaleContent.invoice.confirmationMessage,
    };
  } catch (_error) {
    // Safe to continue: email sending is a graceful failure
    // User sees friendly error message, can retry or contact support directly
    return {
      success: false,
      error: wholesaleContent.invoice.errorMessage,
    };
  }
}

const INVOICE_STORAGE_KEY = 'wholesale-invoice-requests';

export default function OrderDetailsPage() {
  const {order} = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [invoiceRequested, setInvoiceRequested] = useState(false);

  const isRequesting = fetcher.state === 'submitting';
  const hasRequested = invoiceRequested || fetcher.data?.success;

  // Persist state in session storage (MVP) using single storage key with JSON
  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem(INVOICE_STORAGE_KEY);
      const invoiceRequests = storedData
        ? (JSON.parse(storedData) as Record<string, boolean>)
        : {};

      if (fetcher.data?.success) {
        // Add this order to the requests object
        invoiceRequests[order.id] = true;
        sessionStorage.setItem(
          INVOICE_STORAGE_KEY,
          JSON.stringify(invoiceRequests),
        );
        setInvoiceRequested(true);
      } else {
        // Check if this order was previously requested
        setInvoiceRequested(invoiceRequests[order.id] === true);
      }
    } catch (_error) {
      // Safe to continue: session storage is optional enhancement, core flow works without it
    }
  }, [fetcher.data, order.id]);

  return (
    <div className={cn('space-y-6')}>
      {/* Order header */}
      <div>
        <h1 className={cn('text-2xl font-semibold')}>
          Order #{order.orderNumber}
        </h1>
        <p className={cn('text-sm text-text-muted')}>
          {formatDate(order.processedAt)}
        </p>
        <div className={cn('mt-2')}>
          <span
            className={cn(
              'inline-block px-3 py-1 rounded-full text-sm',
              order.fulfillmentStatus === 'FULFILLED'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800',
            )}
          >
            {order.fulfillmentStatus}
          </span>
        </div>
      </div>

      {/* Line items */}
      <div>
        <h2 className={cn('text-lg font-semibold mb-4')}>Items</h2>
        <div className={cn('space-y-3')}>
          {order.lineItems.edges.map(({node}) => (
            <div
              key={node.id}
              className={cn(
                'flex items-center gap-4 p-4',
                'rounded-lg bg-canvas-elevated',
                'border border-gray-200',
              )}
            >
              {/* Product image */}
              {node.variant?.image && (
                <img
                  src={node.variant.image.url}
                  alt={node.variant.image.altText || node.title}
                  className={cn('w-16 h-16 object-cover rounded')}
                />
              )}

              {/* Product info */}
              <div className={cn('flex-1')}>
                <p className={cn('font-medium text-text-primary')}>
                  {node.title}
                </p>
                <p className={cn('text-sm text-text-muted')}>
                  {node.variant?.title && node.variant.title !== 'Default'
                    ? node.variant.title
                    : ''}
                </p>
                <p className={cn('text-sm text-text-muted mt-1')}>
                  Qty: {node.quantity}
                </p>
              </div>

              {/* Price */}
              <div className={cn('text-right')}>
                <p
                  className={cn('font-semibold text-text-primary')}
                  aria-label={getCurrencyLabel(node.discountedTotalPrice)}
                >
                  {formatCurrency(node.discountedTotalPrice)}
                </p>
                {node.originalTotalPrice.amount !==
                  node.discountedTotalPrice.amount && (
                  <p
                    className={cn('text-sm text-text-muted line-through')}
                    aria-label={`Original price: ${getCurrencyLabel(node.originalTotalPrice)}`}
                  >
                    {formatCurrency(node.originalTotalPrice)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div className={cn('border-t pt-4')}>
        <h2 className={cn('text-lg font-semibold mb-4')}>Order Summary</h2>
        <div className={cn('space-y-2')}>
          <div className={cn('flex justify-between text-text-muted')}>
            <span>Subtotal</span>
            <span aria-label={getCurrencyLabel(order.subtotalPrice)}>
              {formatCurrency(order.subtotalPrice)}
            </span>
          </div>
          <div className={cn('flex justify-between text-text-muted')}>
            <span>Shipping</span>
            <span aria-label={getCurrencyLabel(order.shippingCost)}>
              {formatCurrency(order.shippingCost)}
            </span>
          </div>
          <div className={cn('flex justify-between text-text-muted')}>
            <span>Tax</span>
            <span aria-label={getCurrencyLabel(order.totalTax)}>
              {formatCurrency(order.totalTax)}
            </span>
          </div>
          <div
            className={cn(
              'flex justify-between text-lg font-semibold text-text-primary pt-2 border-t',
            )}
          >
            <span>Total</span>
            <span aria-label={getCurrencyLabel(order.currentTotalPrice)}>
              {formatCurrency(order.currentTotalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice request section */}
      <div className={cn('border-t pt-6')}>
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="requestInvoice" />

          <Button
            type="submit"
            disabled={hasRequested || isRequesting}
            variant={hasRequested ? 'secondary' : 'primary'}
            aria-live="polite"
            aria-atomic="true"
          >
            {hasRequested
              ? wholesaleContent.invoice.requestedButton
              : isRequesting
                ? wholesaleContent.invoice.requestingButton
                : wholesaleContent.invoice.requestButton}
          </Button>
        </fetcher.Form>

        {/* Confirmation message */}
        {fetcher.data?.success && (
          <p
            className={cn('mt-2 text-sm text-green-600')}
            role="status"
            aria-live="polite"
          >
            {fetcher.data.message}
          </p>
        )}

        {/* Error message */}
        {fetcher.data?.error && (
          <p
            className={cn('mt-2 text-sm text-red-600')}
            role="alert"
            aria-live="assertive"
          >
            {fetcher.data.error}
          </p>
        )}
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <div>
          <h2 className={cn('text-lg font-semibold mb-2')}>Shipping Address</h2>
          <address className={cn('not-italic text-text-muted')}>
            {order.shippingAddress.formatted.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </address>
        </div>
      )}
    </div>
  );
}
