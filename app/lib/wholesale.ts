import {redirect} from 'react-router';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';

/**
 * Extract the B2B company from a customer's companyContacts edge.
 * Returns null if the customer has no company association.
 */
export function getB2BCompany(customer: {
  companyContacts?: {
    edges?: Array<{
      node?: {
        company?: {id: string; name: string} | null;
      } | null;
    }> | null;
  } | null;
}) {
  return customer.companyContacts?.edges?.[0]?.node?.company ?? null;
}

/**
 * Require an authenticated wholesale session.
 * Throws a redirect to the login page if no customerId is in the session.
 */
export async function requireWholesaleSession(context: {
  session: {get: (key: string) => Promise<string | undefined>};
}): Promise<string> {
  const customerId = await context.session.get('customerId');
  if (!customerId) {
    throw redirect(WHOLESALE_ROUTES.LOGIN);
  }
  return customerId;
}
