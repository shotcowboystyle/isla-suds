import {redirect, useLoaderData} from 'react-router';
import {PartnerAcknowledgment} from '~/components/wholesale/PartnerAcknowledgment';
import {wholesaleContent} from '~/content/wholesale';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
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
      return redirect(WHOLESALE_ROUTES.LOGIN);
    }

    const {firstName, company} = customer.data.customer;

    // Validate B2B status
    if (!company) {
      return redirect(WHOLESALE_ROUTES.LOGIN);
    }

    return {
      partnerName: firstName || 'Partner',
      storeCount: wholesaleContent.dashboard.storeCount,
    };
  } catch (error) {
    // API error - redirect to login
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
  const {partnerName, storeCount} = useLoaderData<typeof loader>();

  return (
    <div>
      <PartnerAcknowledgment
        partnerName={partnerName}
        storeCount={storeCount}
      />
      {/* Dashboard content will be added in future stories */}
    </div>
  );
}
