import {useRef} from 'react';
import {Link, useLoaderData, useNavigation, useSearchParams} from 'react-router';
import {Money, getPaginationVariables, flattenConnection} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import type {Route} from './+types/account.orders._index';
import type {CustomerOrdersFragment, OrderItemFragment} from 'customer-accountapi.generated';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer, filters};
}

export default function Orders() {
  const {customer, filters} = useLoaderData<OrdersLoaderData>();
  const {orders} = customer;

  return (
    <div className="orders">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Order History</h2>
        <p className="mt-2 text-gray-600">Review your past purchases and track current orders.</p>
      </div>
      <div className="space-y-8">
        <OrderSearchForm currentFilters={filters} />
        <OrdersTable orders={orders} filters={filters} />
      </div>
    </div>
  );
}

function OrdersTable({orders, filters}: {orders: CustomerOrdersFragment['orders']; filters: OrderFilterParams}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div aria-live="polite">
      {orders?.nodes.length ? (
        <div className="grid gap-4">
          <PaginatedResourceSection connection={orders}>
            {({node: order}) => <OrderItem key={order.id} order={order} />}
          </PaginatedResourceSection>
        </div>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({hasFilters = false}: {hasFilters?: boolean}) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
      {hasFilters ? (
        <div className="space-y-4">
          <p className="text-lg text-gray-600">No orders found matching your search.</p>
          <Link to="/account/orders" className="inline-flex items-center text-black font-semibold hover:underline">
            Clear filters &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-lg text-gray-600">You haven&apos;t placed any orders yet.</p>
          <Link
            to="/collections"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}

function OrderSearchForm({currentFilters}: {currentFilters: OrderFilterParams}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching = navigation.state !== 'idle' && navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData.get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)?.toString().trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber) params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
      aria-label="Search orders"
    >
      <fieldset className="flex flex-col md:flex-row gap-4">
        <legend className="sr-only">Filter Orders</legend>

        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.NAME}
            placeholder="Order #"
            aria-label="Order number"
            defaultValue={currentFilters.name || ''}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
          />
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
            placeholder="Confirmation #"
            aria-label="Confirmation number"
            defaultValue={currentFilters.confirmationNumber || ''}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          {hasFilters && (
            <button
              type="button"
              disabled={isSearching}
              onClick={() => {
                setSearchParams(new URLSearchParams());
                formRef.current?.reset();
              }}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:items-center justify-between transition-shadow hover:shadow-md mb-4 last:mb-0 w-full overflow-hidden">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-gray-900">Order #{order.number}</h3>
          {fulfillmentStatus && (
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wider rounded-full">
              {fulfillmentStatus}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm">Placed on {new Date(order.processedAt).toLocaleDateString()}</p>
        {order.confirmationNumber && <p className="text-gray-500 text-sm">Confirmation: {order.confirmationNumber}</p>}
      </div>
      <div className="flex sm:flex-col sm:items-end justify-between items-center gap-4">
        <div className="text-left sm:text-right">
          <p className="font-semibold text-gray-900 text-lg">
            <Money data={order.totalPrice} />
          </p>
          <p className="text-sm text-gray-500 capitalize">{order.financialStatus.toLowerCase()}</p>
        </div>
        <Link
          to={`/account/orders/${btoa(order.id)}`}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors whitespace-nowrap"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
