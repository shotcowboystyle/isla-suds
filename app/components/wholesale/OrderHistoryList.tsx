import {useNavigate} from 'react-router';
import {wholesaleContent} from '~/content/wholesale';
import {cn} from '~/utils/cn';
import {OrderHistoryItem} from './OrderHistoryItem';

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

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface OrderHistoryListProps {
  orders: Order[];
  pageInfo: PageInfo;
}

export function OrderHistoryList({orders, pageInfo}: OrderHistoryListProps) {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className={cn('text-center py-12')}>
        <p className={cn('text-text-muted')}>
          {wholesaleContent.orders.noOrdersMessage}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className={cn('text-2xl font-semibold mb-6')}>
        {wholesaleContent.orders.title}
      </h1>

      {/* Order list */}
      <div className={cn('space-y-4')}>
        {orders.map((order) => (
          <OrderHistoryItem key={order.id} order={order} />
        ))}
      </div>

      {/* Load more */}
      {pageInfo.hasNextPage && (
        <div className={cn('text-center mt-6')}>
          <button
            onClick={() => {
              void navigate(`/wholesale/orders?after=${pageInfo.endCursor}`);
            }}
            className={cn(
              'px-6 py-3',
              'bg-accent-primary text-white',
              'rounded-lg',
              'hover:bg-accent-primary/90',
              'transition-colors',
            )}
          >
            {wholesaleContent.orders.loadMoreButton}
          </button>
        </div>
      )}
    </div>
  );
}
