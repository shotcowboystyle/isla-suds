import {redirect, useLoaderData} from 'react-router';
import {OrderHistoryList} from '~/components/wholesale/OrderHistoryList';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {GET_ORDER_HISTORY_QUERY} from '~/graphql/customer-account/GetOrderHistory';
import type {Route} from './+types/wholesale.orders';

// TypeScript interfaces for Customer Account API response
interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

interface Order {
  id: string;
  name: string;
  orderNumber: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  currentTotalPrice: MoneyV2;
}

interface OrderEdge {
  cursor: string;
  node: Order;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface OrdersResponse {
  data: {
    customer: {
      orders: {
        edges: OrderEdge[];
        pageInfo: PageInfo;
      };
    };
  };
}

export async function loader({request, context}: Route.LoaderArgs) {
  const customerId = await context.session.get('customerId');

  if (!customerId) {
    return redirect(WHOLESALE_ROUTES.LOGIN);
  }

  // Get cursor from URL for pagination
  const url = new URL(request.url);
  const after = url.searchParams.get('after') || undefined;

  try {
    const ordersData = (await context.customerAccount.query(
      GET_ORDER_HISTORY_QUERY,
      {
        variables: {
          first: 10, // BOUNDED QUERY: MUST have limit
          after,
        },
        cache: context.storefront.CacheShort(), // 5 min TTL per story requirements
      },
    )) as OrdersResponse;

    return {
      orders: ordersData.data.customer.orders.edges.map((edge) => edge.node),
      pageInfo: ordersData.data.customer.orders.pageInfo,
    };
  } catch (error) {
    // Log error for debugging but gracefully degrade (order history is optional)
    console.error('Failed to fetch order history:', error);
    // Safe to continue: order history is optional, graceful degradation
    return {
      orders: [],
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    };
  }
}

export default function OrderHistoryPage() {
  const {orders, pageInfo} = useLoaderData<typeof loader>();

  return <OrderHistoryList orders={orders} pageInfo={pageInfo} />;
}
