import {redirect} from 'react-router';

/**
 * The application now lives at the bottom of /partners. This URL used to
 * render the landing page anyway (it nests under `partners.tsx`, which has no
 * outlet), so send any old links straight to the form.
 */
export function loader() {
  return redirect('/partners#apply');
}
