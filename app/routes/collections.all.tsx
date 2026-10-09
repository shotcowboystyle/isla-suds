import {redirect} from 'react-router';

// The shop-all page is /collections/frontpage; this skeleton catalogue duplicated it.
export function loader() {
  return redirect('/collections/frontpage', 301);
}
