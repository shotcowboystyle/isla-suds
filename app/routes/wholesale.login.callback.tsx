import {redirect} from 'react-router';
import {wholesaleContent} from '~/content/wholesale';
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
    const customer = await context.customerAccount.query(CUSTOMER_QUERY);

    // Validate response structure
    if (!customer?.data?.customer) {
      console.error('Customer Account API returned invalid response structure', {
        hasData: !!customer?.data,
        hasCustomer: !!customer?.data?.customer,
      });
      return redirect('/wholesale/login');
    }

    const customerData = customer.data.customer;

    // Verify B2B status (company association required)
    if (customerData.company) {
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
  } catch (error) {
    // OAuth failed or customer query failed
    console.error('OAuth callback failed:', error);
    return redirect('/wholesale/login?error=auth_failed');
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
