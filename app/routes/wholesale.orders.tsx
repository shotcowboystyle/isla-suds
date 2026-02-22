import {useLoaderData} from 'react-router';
import {OrderHistoryList} from '~/components/wholesale/OrderHistoryList';
import {GET_ORDER_HISTORY_QUERY} from '~/graphql/customer-account/GetOrderHistory';
import {requireWholesaleSession} from '~/lib/wholesale';
import type {Route} from './+types/wholesale.orders';
import type {OrdersResponse} from '~/types/wholesale';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Order History | Wholesale | Isla Suds'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  await requireWholesaleSession(context);

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
        // cache: context.storefront.CacheShort(), // 5 min TTL per story requirements
      },
    )) as OrdersResponse;

    return {
      orders: ordersData.data.customer.orders.edges.map((edge) => edge.node),
      pageInfo: ordersData.data.customer.orders.pageInfo,
    };
  } catch (_error) {
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
