import {data} from 'react-router';
import {NEWSLETTER_SUBSCRIBE_MUTATION} from '~/graphql/storefront/NewsletterSubscribeMutation';
import {isValidEmail} from '~/utils/validation';
import type {Route} from './+types/api.newsletter';

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '').trim();

  if (!email) {
    return data({error: 'Email is required.'}, {status: 400});
  }

  if (!isValidEmail(email)) {
    return data({error: 'Please enter a valid email address.'}, {status: 400});
  }

  // Generate a random password since customerCreate requires one.
  // The subscriber doesn't need this — it's only to satisfy the API.
  // If they later create an account, they can use the "forgot password" flow.
  const password = crypto.randomUUID();

  const {customerCreate, errors} = await context.storefront.mutate(
    NEWSLETTER_SUBSCRIBE_MUTATION,
    {
      variables: {
        input: {
          email,
          password,
          acceptsMarketing: true,
        },
      },
    },
  );

  if (errors?.length) {
    return data({error: 'Something went wrong. Please try again.'}, {status: 500});
  }

  const userErrors = customerCreate?.customerUserErrors;
  if (userErrors?.length) {
    // If the customer already exists, treat it as a success —
    // they're already in Shopify and we don't want to leak that info.
    const alreadyExists = userErrors.some((e) => e.code === 'TAKEN');
    if (alreadyExists) {
      return data({success: true});
    }

    return data({error: userErrors[0].message}, {status: 400});
  }

  return data({success: true});
}
