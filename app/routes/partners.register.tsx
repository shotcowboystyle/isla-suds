// import {redirect, useActionData} from 'react-router';
import {useActionData, data} from 'react-router';
import {PartnersApplicationForm} from '~/components/partners/register/PartnersApplicationForm';
// import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
// import {WHOLESALE_CUSTOMER_QUERY} from '~/graphql/customer-account/WholesaleCustomer';
// import {getB2BCompany} from '~/lib/wholesale';
import {submitToShopify} from '~/lib/shopify-admin.server';
import {extractFields, validateFields, emailValidator} from '~/utils/form-validation';
import {createMeta} from '~/utils/meta';
import type {Route} from './+types/partners.register';

export const meta: Route.MetaFunction = createMeta({title: 'Apply to be a Wholesale Partner | Isla Suds'});

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
  const fields = extractFields(
    formData, 'name', 'email', 'phone', 'businessName', 'instagram', 'website', 'message',
  );

  const {fieldErrors, hasErrors} = validateFields(fields, [
    {name: 'name', required: true},
    {name: 'email', required: true, validate: emailValidator},
    {name: 'phone', required: true},
    {name: 'businessName', required: 'Business Name is required'},
    {name: 'message', required: 'Please tell us about your shop'},
  ]);

  if (hasErrors) {
    return {success: false, fieldErrors, error: 'Please fix the errors above.'};
  }

  const {name, email, phone, businessName, instagram, website, message} = fields;

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
