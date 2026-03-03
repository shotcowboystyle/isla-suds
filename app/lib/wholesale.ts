import {redirect} from 'react-router';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';

const WHOLESALE_TAG = 'wholesale';

/**
 * Check whether a customer has the "wholesale" tag, granting portal access.
 * Tag is set manually in Shopify Admin → Customers → [customer] → Tags.
 */
export function isWholesaleCustomer(customer: {tags?: Array<string> | null}) {
  return customer.tags?.includes(WHOLESALE_TAG) ?? false;
}

/**
 * @deprecated Use isWholesaleCustomer() — kept temporarily to surface call sites at compile time.
 */
export function getB2BCompany(customer: {tags?: Array<string> | null}) {
  return isWholesaleCustomer(customer) ? {id: 'tag-based', name: WHOLESALE_TAG} : null;
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
