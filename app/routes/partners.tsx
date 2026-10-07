import {data, useActionData} from 'react-router';
import {PartnersLandingPage} from '~/components/partners/landing/PartnersLandingPage';
import {PARTNERS_PAGE} from '~/content/partners';
import {submitToShopify} from '~/lib/shopify-admin.server';
import {extractFields, validateFields, emailValidator} from '~/utils/form-validation';
import type {Route} from './+types/partners';

export const meta: Route.MetaFunction = ({location}) => [
  {title: PARTNERS_PAGE.meta.title},
  {name: 'description', content: PARTNERS_PAGE.meta.description},
  // `?shop=gym` and friends are the same page; point every variant at one URL.
  {tagName: 'link', rel: 'canonical', href: location.pathname},
];

/**
 * The wholesale application. It posts here, from the form at the bottom of the
 * page, so the visitor never leaves /partners.
 */
export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const fields = extractFields(
    formData,
    'name',
    'email',
    'phone',
    'businessName',
    'shopType',
    'instagram',
    'website',
    'message',
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

  const {name, email, phone, businessName, shopType, instagram, website, message} = fields;

  const note = [
    'Wholesale Partner Application',
    '',
    `Business: ${businessName}`,
    shopType ? `Shop type: ${shopType}` : null,
    instagram ? `Instagram: ${instagram}` : null,
    website ? `Website: ${website}` : null,
    '',
    'Message:',
    message,
  ]
    .filter((line) => line !== null)
    .join('\n');

  try {
    const result = await submitToShopify(context.env.PUBLIC_STORE_DOMAIN, context.env.SHOPIFY_ADMIN_API_TOKEN, {
      email,
      firstName: name,
      phone,
      tags: 'wholesale-applicant',
      note,
      acceptsMarketing: true,
    });

    if (!result.success) {
      return data({success: false, error: result.error}, {status: 500});
    }
  } catch (error) {
    // Server-side log; the visitor gets a retry message instead of a crash.
    console.error('[partners] application submit failed', error);
    return data({success: false, error: 'Something went wrong. Please try again.'}, {status: 500});
  }

  return {success: true};
}

export default function Partners() {
  const actionData = useActionData<typeof action>();
  return <PartnersLandingPage actionData={actionData} />;
}
