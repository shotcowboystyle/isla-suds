import {PartnersLandingPage} from '~/components/partners/landing/PartnersLandingPage';
import {PARTNERS_PAGE} from '~/content/partners';
import {createMeta} from '~/utils/meta';
import type {Route} from './+types/locations';

export const meta: Route.MetaFunction = createMeta(PARTNERS_PAGE.meta);

export default function Partners() {
  return <PartnersLandingPage />;
}
