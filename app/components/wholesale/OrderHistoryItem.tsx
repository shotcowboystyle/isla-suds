import {Link} from 'react-router';
import {wholesaleContent} from '~/content/wholesale';
import {cn} from '~/utils/cn';
import {formatDate} from '~/utils/format-date';
import {formatMoney, getCurrencyLabel} from '~/utils/format-money';
import {OrderStatusBadge} from './OrderStatusBadge';
import type {WholesaleOrder} from '~/types/wholesale';

interface OrderHistoryItemProps {
  order: WholesaleOrder;
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
          {formatMoney(order.currentTotalPrice)}
        </p>
      </div>

      {/* Status badge */}
      <div className={cn('mx-4')}>
        <OrderStatusBadge status={order.fulfillmentStatus} />
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
