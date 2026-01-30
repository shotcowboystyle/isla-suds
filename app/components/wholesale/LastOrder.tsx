import {useEffect, useState} from 'react';
import {useFetcher} from 'react-router';
import {Button} from '~/components/ui/Button';
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
    // Safe to continue: fallback to generic message on date parsing failure
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
    // Safe to continue: fallback to generic message on currency formatting failure
    return 'See order details';
  }
}

export function LastOrder({order}: LastOrderProps) {
  const fetcher = useFetcher<{success: boolean; checkoutUrl?: string; error?: string}>();
  const isReordering = fetcher.state === 'submitting';
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect to checkout on successful reorder with timeout protection
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.checkoutUrl) {
      // Show success message briefly before redirect
      setShowSuccess(true);

      // Redirect with timeout protection (max 3s wait)
      const redirectTimer = setTimeout(() => {
        window.location.href = fetcher.data.checkoutUrl!;
      }, 1500);

      // Cleanup timeout if component unmounts
      return () => clearTimeout(redirectTimer);
    }
  }, [fetcher.data]);

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
    <div
      className={cn('mb-8 rounded-lg bg-canvas-elevated p-6')}
      data-testid="last-order-section"
    >
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
              <div key={node.id} data-testid="line-item">
                <OrderLineItem item={node} />
              </div>
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
          <dd
            className={cn('text-lg font-semibold')}
            data-testid="order-total"
          >
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

      {/* Success message - displayed briefly before redirect */}
      {showSuccess && (
        <div
          className={cn('mt-4 p-3 rounded-md bg-green-50 text-green-800')}
          role="status"
          data-testid="reorder-success"
        >
          {wholesaleContent.reorder.successMessage('your store')}
        </div>
      )}

      {/* Reorder button */}
      <fetcher.Form method="post">
        <input type="hidden" name="intent" value="reorder" />
        <input type="hidden" name="orderId" value={order.id} />

        <Button
          type="submit"
          disabled={isReordering || showSuccess}
          className={cn('mt-4 w-full')}
          data-testid="reorder-button"
        >
          {isReordering
            ? wholesaleContent.reorder.buttonLoading
            : wholesaleContent.reorder.button}
        </Button>
      </fetcher.Form>

      {/* Error message */}
      {fetcher.data?.error && (
        <p
          className={cn('mt-2 text-sm text-red-600')}
          role="alert"
          data-testid="reorder-error"
        >
          {fetcher.data.error}
        </p>
      )}
    </div>
  );
}
