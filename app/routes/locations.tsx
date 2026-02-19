import {LocationsHeader} from '~/components/locations/LocationsHeader';
import {LocationsLogos} from '~/components/locations/LocationsLogos';
import {LocationsMap} from '~/components/locations/LocationsMap';
import {LOCATIONS_PAGE} from '~/content/stores';
import type {Route} from './+types/locations';

export const meta: Route.MetaFunction = () => {
  return [{title: LOCATIONS_PAGE.meta.title}, {name: 'description', content: LOCATIONS_PAGE.meta.description}];
};

export default function LocationsPage() {
  return (
    <div className="min-h-screen">
      <div className="px-6 sm:px-10 py-12 sm:py-20 max-w-5xl mx-auto">
        <LocationsHeader />

        <LocationsMap />

        <LocationsLogos />
      </div>
    </div>
  );
}
