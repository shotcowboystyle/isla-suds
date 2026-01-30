import {wholesaleContent} from '~/content/wholesale';
import {cn} from '~/utils/cn';
import {OrderLineItem} from './OrderLineItem';
import {OrderStatusBadge} from './OrderStatusBadge';

interface LastOrderProps {
  order: {
    id: string;
    name: string;
    processedAt: string;
    fulfillmentStatus: string;
    currentTotalPrice: {
      amount: string;
      currencyCode: string;
    };
    lineItems: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          quantity: number;
          variant?: {
            id: string;
            title: string;
          } | null;
        };
      }>;
    };
  } | null;
}

function formatOrderDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Recent order';
    }
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('[LastOrder] Failed to format date:', error);
    return 'Recent order';
  }
}

function formatCurrency(price: {
  amount: string;
  currencyCode: string;
}): string {
  try {
    const amount = parseFloat(price.amount);
    if (isNaN(amount)) {
      return 'See order details';
    }
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: price.currencyCode,
    }).format(amount);
  } catch (error) {
    console.error('[LastOrder] Failed to format currency:', error);
    return 'See order details';
  }
}

export function LastOrder({order}: LastOrderProps) {
  if (!order) {
    return (
      <div className={cn('mb-8 rounded-lg bg-canvas-elevated p-6')}>
        <p className={cn('text-text-muted')}>
          {wholesaleContent.dashboard.noOrdersMessage}
        </p>
      </div>
    );
  }

  // Truncation logic: show first 4 items, then "+X more"
  const MAX_DISPLAY_ITEMS = 4;
  const allItems = order.lineItems.edges;
  const visibleItems = allItems.slice(0, MAX_DISPLAY_ITEMS);
  const remainingCount = allItems.length - MAX_DISPLAY_ITEMS;

  return (
    <div className={cn('mb-8 rounded-lg bg-canvas-elevated p-6')}>
      <h2 className={cn('text-xl font-semibold mb-4')}>Last Order</h2>

      <dl className={cn('space-y-2')}>
        {/* Order date */}
        <div>
          <dt className={cn('sr-only')}>Order Date</dt>
          <dd className={cn('text-sm text-text-muted')}>
            {formatOrderDate(order.processedAt)}
          </dd>
        </div>

        {/* Order items */}
        <div>
          <dt className={cn('sr-only')}>Items</dt>
          <dd className={cn('space-y-1')}>
            {visibleItems.map(({node}) => (
              <OrderLineItem key={node.id} item={node} />
            ))}
            {remainingCount > 0 && (
              <p className={cn('text-text-muted text-sm')}>
                +{remainingCount} more item{remainingCount !== 1 ? 's' : ''}
              </p>
            )}
          </dd>
        </div>

        {/* Order total */}
        <div>
          <dt className={cn('sr-only')}>Total</dt>
          <dd className={cn('text-lg font-semibold')}>
            {formatCurrency(order.currentTotalPrice)}
          </dd>
        </div>

        {/* Order status */}
        <div>
          <dt className={cn('sr-only')}>Status</dt>
          <dd>
            <OrderStatusBadge status={order.fulfillmentStatus} />
          </dd>
        </div>
      </dl>
    </div>
  );
}
