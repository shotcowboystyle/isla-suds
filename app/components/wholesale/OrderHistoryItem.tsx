import {Link} from 'react-router';
import {wholesaleContent} from '~/content/wholesale';
import {cn} from '~/utils/cn';
import {formatCurrency, getCurrencyLabel} from '~/utils/format-currency';
import {formatDate} from '~/utils/format-date';

interface Order {
  id: string;
  name: string;
  orderNumber: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  currentTotalPrice: {
    amount: string;
    currencyCode: string;
  };
}

interface OrderHistoryItemProps {
  order: Order;
}

export function OrderHistoryItem({order}: OrderHistoryItemProps) {
  return (
    <div
      data-testid="order-item"
      className={cn(
        'rounded-lg bg-canvas-elevated p-6',
        'border border-gray-200',
        'flex items-center justify-between',
      )}
    >
      <div className={cn('flex-1')}>
        {/* Order date */}
        <p className={cn('text-sm text-text-muted mb-1')}>
          {formatDate(order.processedAt)}
        </p>

        {/* Order number */}
        <p className={cn('font-semibold text-text-primary')}>
          Order #{order.orderNumber}
        </p>

        {/* Order total */}
        <p
          className={cn('text-sm text-text-muted mt-1')}
          aria-label={getCurrencyLabel(order.currentTotalPrice)}
        >
          {formatCurrency(order.currentTotalPrice)}
        </p>
      </div>

      {/* Status badge */}
      <div className={cn('mx-4')}>
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

      {/* View details link */}
      <Link
        to={`/wholesale/orders/${order.id}`}
        className={cn('ml-4 text-accent-primary hover:underline')}
      >
        {wholesaleContent.orders.viewDetailsLink}
      </Link>
    </div>
  );
}
