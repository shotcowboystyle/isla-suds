import {PartnersLandingPage} from '~/components/partners/landing/PartnersLandingPage';
import {PARTNERS_PAGE} from '~/content/partners';
import type {Route} from './+types/locations';

export const meta: Route.MetaFunction = () => {
  return [{title: PARTNERS_PAGE.meta.title}, {name: 'description', content: PARTNERS_PAGE.meta.description}];
};

export default function Partners() {
  return <PartnersLandingPage />;
}
