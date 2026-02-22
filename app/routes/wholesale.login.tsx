import {redirect} from 'react-router';
import {wholesaleContent} from '~/content/wholesale';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {WHOLESALE_CUSTOMER_QUERY} from '~/graphql/customer-account/WholesaleCustomer';
import {getB2BCompany} from '~/lib/wholesale';
import type {Route} from './+types/wholesale.login';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Wholesale Partner Login | Isla Suds'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  // Parse error messages from query params (from callback failures)
  const url = new URL(request.url);
  const errorParam = url.searchParams.get('error');

  // Check if customer is already logged in
  const customerId = await context.session.get('customerId');

  if (customerId) {
    // Verify B2B status for existing session
    try {
      const customer = await context.customerAccount.query(WHOLESALE_CUSTOMER_QUERY);

      // Validate response structure before accessing
      if (!customer?.data?.customer) {
        // Clear invalid session and restart auth
        context.session.unset('customerId');
        return context.customerAccount.login({
          countryCode: context.storefront.i18n.country,
        });
      }

      if (getB2BCompany(customer.data.customer)) {
        // B2B customer with valid session - redirect to dashboard
        return redirect(WHOLESALE_ROUTES.DASHBOARD);
      } else {
        // Logged in but not B2B - clear session and show error
        context.session.unset('customerId');
        const sessionCookie = await context.session.commit();

        return {
          error: wholesaleContent.auth.notWholesaleCustomer,
          headers: {
            'Set-Cookie': sessionCookie,
          },
        };
      }
    } catch (_error) {
      // Safe to continue: session invalid or customer fetch failed, clear and re-auth
      context.session.unset('customerId');
      // Fall through to initiate new OAuth flow
    }
  }

  // Handle error messages from callback
  if (errorParam) {
    const errorMessages: Record<string, string> = {
      not_b2b: wholesaleContent.auth.notWholesaleCustomer,
      auth_failed: wholesaleContent.auth.genericError,
    };

    return {
      error: errorMessages[errorParam] || wholesaleContent.auth.genericError,
    };
  }

  // Not logged in - initiate OAuth login flow
  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
  });
}

export async function action({request, context}: Route.ActionArgs) {
  // Handle logout action if needed
  const formData = await request.formData();
  const action = formData.get('action');

  if (action === 'logout') {
    context.session.unset('customerId');
    await context.customerAccount.logout();

    return redirect(WHOLESALE_ROUTES.LOGIN, {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    });
  }

  return new Response(JSON.stringify({error: 'Invalid action'}), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default function WholesaleLogin({loaderData}: Route.ComponentProps) {
  const error = loaderData?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full px-6">
        <h1 className="text-2xl font-semibold mb-2">
          {wholesaleContent.auth.loginTitle}
        </h1>

        {error ? (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800">{error}</p>
          </div>
        ) : (
          <p className="text-gray-600">Redirecting to login...</p>
        )}
      </div>
    </div>
  );
}
