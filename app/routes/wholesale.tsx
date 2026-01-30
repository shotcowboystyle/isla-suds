import {Outlet, redirect} from 'react-router';
import {wholesaleContent} from '~/content/wholesale';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';

import type {Route} from './+types/wholesale';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Wholesale Portal | Isla Suds'}];
};

export async function loader({context}: Route.LoaderArgs) {
  // Verify B2B customer is logged in
  const customerId = await context.session.get('customerId');

  if (!customerId) {
    // Not logged in - redirect to login
    return redirect(WHOLESALE_ROUTES.LOGIN);
  }

  // Verify customer still has B2B status
  try {
    const customer = await context.customerAccount.query(CUSTOMER_QUERY);

    // Validate response structure before accessing
    if (!customer?.data?.customer) {
      console.error(
        'Customer Account API returned invalid response structure in dashboard guard',
        {
          hasData: !!customer?.data,
          hasCustomer: !!customer?.data?.customer,
        },
      );
      // Clear invalid session and redirect
      context.session.unset('customerId');
      return redirect(WHOLESALE_ROUTES.LOGIN, {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      });
    }

    if (!customer.data.customer.company) {
      // No longer B2B - clear session and redirect
      context.session.unset('customerId');
      return redirect(WHOLESALE_ROUTES.LOGIN, {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      });
    }

    // Return customer data for dashboard
    return {
      customer: customer.data.customer,
    };
  } catch (error) {
    // Session invalid or customer query failed - log and redirect to login
    console.error('Session validation failed in wholesale dashboard:', error);
    context.session.unset('customerId');
    return redirect(WHOLESALE_ROUTES.LOGIN, {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    });
  }
}

// GraphQL query to fetch customer with B2B company field
const CUSTOMER_QUERY = `#graphql
  query CustomerWithCompany {
    customer {
      id
      email
      displayName
      company {
        id
        name
      }
    }
  }
`;

export default function WholesaleLayout() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">
          {wholesaleContent.dashboard.welcomeMessage.replace(
            '{partnerName}',
            'Partner',
          )}
        </h1>
        <p className="mt-2 text-gray-600">
          {wholesaleContent.dashboard.acknowledgment}
        </p>

        <Outlet />
      </div>
    </div>
  );
}
