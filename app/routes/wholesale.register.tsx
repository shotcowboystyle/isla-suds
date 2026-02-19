import {redirect, useActionData} from 'react-router';
import {WholesaleApplicationForm} from '~/components/wholesale/register/WholesaleApplicationForm';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {WHOLESALE_LAYOUT_CUSTOMER_QUERY} from '~/graphql/customer-account/WholesaleLayoutCustomer';
import type {Route} from './+types/wholesale.register';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Apply for Wholesale | Isla Suds'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const customerId = await context.session.get('customerId');

  if (customerId) {
    try {
      const customer = await context.customerAccount.query(WHOLESALE_LAYOUT_CUSTOMER_QUERY);
      if (customer?.data?.customer) {
        const company = customer.data.customer.companyContacts?.edges?.[0]?.node?.company;
        if (company) {
          // Already a wholesale customer, redirect to dashboard
          return redirect(WHOLESALE_ROUTES.DASHBOARD);
        }
      }
    } catch (e) {
      // Ignore errors, just render the application form
    }
  }

  return {};
}

export async function action({request}: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const phone = String(formData.get('phone') || '');
  const businessName = String(formData.get('businessName') || '');
  const message = String(formData.get('message') || '');

  // Basic validation
  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'Name is required';
  if (!email) fieldErrors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'Invalid email address';
  if (!phone) fieldErrors.phone = 'Phone is required';
  if (!businessName) fieldErrors.businessName = 'Business Name is required';
  if (!message) fieldErrors.message = 'Please tell us about your shop';

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
      error: 'Please fix the errors above.',
    };
  }

  // TODO: Send email or create customer record
  // For now, mock success
  console.warn('Wholesale application submitted:', Object.fromEntries(formData));

  return {success: true};
}

export default function WholesaleRegister() {
  const actionData = useActionData<typeof action>();

  return <WholesaleApplicationForm actionData={actionData} />;
}
