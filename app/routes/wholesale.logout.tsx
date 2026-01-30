import {redirect} from 'react-router';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';

import type {Route} from './+types/wholesale.logout';

export async function loader({context}: Route.LoaderArgs) {
  // Clear wholesale session
  context.session.unset('customerId');

  // Logout from Customer Account API
  await context.customerAccount.logout();

  // Redirect to login page
  return redirect(WHOLESALE_ROUTES.LOGIN, {
    headers: {
      'Set-Cookie': await context.session.commit(),
    },
  });
}

export async function action({context}: Route.ActionArgs) {
  // Same as loader - handle both GET and POST
  context.session.unset('customerId');

  await context.customerAccount.logout();

  return redirect(WHOLESALE_ROUTES.LOGIN, {
    headers: {
      'Set-Cookie': await context.session.commit(),
    },
  });
}
