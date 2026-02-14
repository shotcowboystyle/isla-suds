import {Outlet, redirect, useLoaderData} from 'react-router';
import {WholesaleHeader} from '~/components/wholesale/WholesaleHeader';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {WHOLESALE_LAYOUT_CUSTOMER_QUERY} from '~/graphql/customer-account/WholesaleLayoutCustomer';
import {cn} from '~/utils/cn';
import type {Route} from './+types/wholesale';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Wholesale Portal | Isla Suds'}];
};

export async function loader({context, request}: Route.LoaderArgs) {
  const url = new URL(request.url);

  // Skip auth for login and callback routes to prevent redirect loops
  // (these are child routes that share this layout loader)
  if (
    url.pathname === WHOLESALE_ROUTES.LOGIN ||
    url.pathname === WHOLESALE_ROUTES.CALLBACK
  ) {
    return {customer: null};
  }

  // Verify B2B customer is logged in
  const customerId = await context.session.get('customerId');

  if (!customerId) {
    // Not logged in - redirect to login
    return redirect(WHOLESALE_ROUTES.LOGIN);
  }

  // Verify customer still has B2B status
  try {
    const customer = await context.customerAccount.query(WHOLESALE_LAYOUT_CUSTOMER_QUERY);

    // Validate response structure before accessing
    if (!customer?.data?.customer) {
      // Clear invalid session and redirect
      context.session.unset('customerId');
      return redirect(WHOLESALE_ROUTES.LOGIN, {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      });
    }

    const company = customer.data.customer.companyContacts?.edges?.[0]?.node?.company;
    if (!company) {
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
    // Session invalid or customer query failed - redirect to login
    context.session.unset('customerId');
    return redirect(WHOLESALE_ROUTES.LOGIN, {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    });
  }
}

export default function WholesaleLayout() {
  const {customer} = useLoaderData<typeof loader>();

  // Login/callback routes render without the wholesale layout chrome
  if (!customer) {
    return <Outlet />;
  }

  // Extract customer first name for header display
  const customerName = customer.displayName?.split(' ')[0] || 'Partner';

  return (
    <div className={cn('min-h-screen bg-canvas-base')}>
      <WholesaleHeader customerName={customerName} />
      <main className={cn('mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8')}>
        <Outlet />
      </main>
    </div>
  );
}
