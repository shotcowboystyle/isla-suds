import {data as remixData, useLoaderData} from 'react-router';
import {AccountPage} from '~/components/account/AccountPage';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import type {Route} from './+types/account';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  return <AccountPage customer={customer} />;
}
