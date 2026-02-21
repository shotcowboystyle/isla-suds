import {redirect} from 'react-router';
import {wholesaleContent} from '~/content/wholesale';
import {WHOLESALE_CALLBACK_CUSTOMER_QUERY} from '~/graphql/customer-account/WholesaleCallbackCustomer';
import type {Route} from './+types/wholesale.login.callback';

/**
 * OAuth callback handler for Shopify Customer Account API
 *
 * Flow:
 * 1. User completes Shopify OAuth on their end
 * 2. Shopify redirects back to this route with auth code
 * 3. We query customer data to verify B2B status
 * 4. If B2B (has company), set session and redirect to dashboard
 * 5. If B2C (no company), reject with friendly message
 */
export async function loader({request, context}: Route.LoaderArgs) {
  try {
    // Query customer after OAuth completion
    // Hydrogen's customerAccount context handles the OAuth token exchange
    const customer = await context.customerAccount.query(WHOLESALE_CALLBACK_CUSTOMER_QUERY);

    // Validate response structure
    if (!customer?.data?.customer) {
      return redirect('/wholesale/login');
    }

    const customerData = customer.data.customer;

    // Verify B2B status (company association required)
    const company = customerData.companyContacts?.edges?.[0]?.node?.company;
    if (company) {
      // B2B customer - set session and redirect to dashboard
      context.session.set('customerId', customerData.id);

      return redirect('/wholesale', {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      });
    } else {
      // B2C customer - reject with friendly message
      // Clear any existing session
      context.session.unset('customerId');

      return redirect(
        '/wholesale/login?error=not_b2b',
        {
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }
  } catch (_error) {
    // Safe to continue: OAuth failed, redirect to login with error
    return redirect('/wholesale/login?error=auth_failed');
  }
}
