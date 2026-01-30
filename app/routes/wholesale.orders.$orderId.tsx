import {redirect, useLoaderData} from 'react-router';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {GET_ORDER_DETAILS_QUERY} from '~/graphql/customer-account/GetOrderDetails';
import {cn} from '~/utils/cn';
import {formatCurrency, getCurrencyLabel} from '~/utils/format-currency';
import {formatOrderDate} from '~/utils/format-date';
import type {Route} from './+types/wholesale.orders.$orderId';

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
      {variables: {orderId}},
    )) as OrderDetailsResponse;

    if (!orderData?.data?.order) {
      throw new Response('Order not found', {status: 404});
    }

    return {order: orderData.data.order};
  } catch (error) {
    // Log error for debugging
    console.error('Failed to fetch order details:', error);
    throw new Response('Order not found', {status: 404});
  }
}

export default function OrderDetailsPage() {
  const {order} = useLoaderData<typeof loader>();

  return (
    <div className={cn('space-y-6')}>
      {/* Order header */}
      <div>
        <h1 className={cn('text-2xl font-semibold')}>
          Order #{order.orderNumber}
        </h1>
        <p className={cn('text-sm text-text-muted')}>
          {formatOrderDate(order.processedAt)}
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
