// import {redirect, useActionData} from 'react-router';
import {useActionData, data} from 'react-router';
import {PartnersApplicationForm} from '~/components/partners/register/PartnersApplicationForm';
// import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
// import {WHOLESALE_CUSTOMER_QUERY} from '~/graphql/customer-account/WholesaleCustomer';
// import {getB2BCompany} from '~/lib/wholesale';
import {submitToShopify} from '~/lib/shopify-admin.server';
import {isValidEmail} from '~/utils/validation';
import type {Route} from './+types/partners.register';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Apply to be a Wholesale Partner | Isla Suds'}];
};

// export async function loader({context}: Route.LoaderArgs) {
//   const customerId = await context.session.get('customerId');

//   if (customerId) {
//     try {
//       const customer = await context.customerAccount.query(WHOLESALE_CUSTOMER_QUERY);
//       if (customer?.data?.customer) {
//         if (getB2BCompany(customer.data.customer)) {
//           // Already a wholesale customer, redirect to dashboard
//           return redirect(WHOLESALE_ROUTES.DASHBOARD);
//         }
//       }
//     } catch (e) {
//       // Ignore errors, just render the application form
//     }
//   }

//   return {};
// }

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const phone = String(formData.get('phone') || '');
  const businessName = String(formData.get('businessName') || '');
  const instagram = String(formData.get('instagram') || '');
  const website = String(formData.get('website') || '');
  const message = String(formData.get('message') || '');

  // Basic validation
  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'Name is required';
  if (!email) fieldErrors.email = 'Email is required';
  else if (!isValidEmail(email)) fieldErrors.email = 'Invalid email address';
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

  const note = [
    'Wholesale Partner Application',
    '',
    `Business: ${businessName}`,
    instagram ? `Instagram: ${instagram}` : null,
    website ? `Website: ${website}` : null,
    '',
    'Message:',
    message,
  ]
    .filter((line) => line !== null)
    .join('\n');

  try {
    const result = await submitToShopify(
      context.env.PUBLIC_STORE_DOMAIN,
      context.env.SHOPIFY_ADMIN_API_TOKEN,
      {
        email,
        firstName: name,
        phone,
        tags: 'wholesale-applicant',
        note,
        acceptsMarketing: true,
      },
    );

    if (!result.success) {
      return data({success: false, error: result.error}, {status: 500});
    }
  } catch {
    return data({success: false, error: 'Something went wrong. Please try again.'}, {status: 500});
  }

  return {success: true};
}

export default function PartnersRegister() {
  const actionData = useActionData<typeof action>();

  return <PartnersApplicationForm actionData={actionData} />;
}
