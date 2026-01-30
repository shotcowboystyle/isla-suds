import {redirect, useLoaderData} from 'react-router';
import {LastOrder} from '~/components/wholesale/LastOrder';
import {PartnerAcknowledgment} from '~/components/wholesale/PartnerAcknowledgment';
import {wholesaleContent} from '~/content/wholesale';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {GET_LAST_ORDER_QUERY} from '~/graphql/customer-account/GetLastOrder';
import type {Route} from './+types/wholesale._index';

export async function loader({context}: Route.LoaderArgs) {
  const customerId = await context.session.get('customerId');

  if (!customerId) {
    return redirect(WHOLESALE_ROUTES.LOGIN);
  }

  // Fetch B2B customer data including firstName
  try {
    const customer = await context.customerAccount.query(CUSTOMER_QUERY);

    // Validate response structure
    if (!customer?.data?.customer) {
      console.error('[Wholesale Dashboard] Invalid customer response structure');
      return redirect(WHOLESALE_ROUTES.LOGIN);
    }

    const {firstName, company} = customer.data.customer;

    // Validate B2B status
    if (!company) {
      console.error('[Wholesale Dashboard] Customer is not a B2B customer');
      return redirect(WHOLESALE_ROUTES.LOGIN);
    }

    // Fetch last order
    let lastOrder = null;
    try {
      const ordersData = await context.customerAccount.query(
        GET_LAST_ORDER_QUERY,
      );
      lastOrder = ordersData?.data?.customer?.orders?.edges[0]?.node || null;
    } catch (orderError) {
      // Log error but continue - show dashboard without order history
      console.error('[Wholesale Dashboard] Failed to fetch last order:', orderError);
    }

    return {
      partnerName: firstName || 'Partner',
      storeCount: wholesaleContent.dashboard.storeCount,
      lastOrder,
    };
  } catch (error) {
    console.error('[Wholesale Dashboard] Failed to load customer data:', error);
    // Only redirect on auth/customer errors - user session likely invalid
    return redirect(WHOLESALE_ROUTES.LOGIN);
  }
}

// GraphQL query to fetch customer with firstName for personalization
const CUSTOMER_QUERY = `#graphql
  query GetCustomer {
    customer {
      id
      firstName
      lastName
      email
      company {
        id
        name
      }
    }
  }
`;

export default function WholesaleDashboard() {
  const {partnerName, storeCount, lastOrder} = useLoaderData<typeof loader>();

  return (
    <div>
      <PartnerAcknowledgment
        partnerName={partnerName}
        storeCount={storeCount}
      />
      <LastOrder order={lastOrder} />
    </div>
  );
}
