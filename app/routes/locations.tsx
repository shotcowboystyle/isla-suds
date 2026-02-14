import {Suspense, lazy} from 'react';
import {LOCATIONS_PAGE} from '~/content/stores';
import type {Route} from './+types/locations';

const Map = lazy(() => import('~/components/Map.client').then((module) => ({default: module.Map})));

export const meta: Route.MetaFunction = () => {
  return [{title: LOCATIONS_PAGE.meta.title}, {name: 'description', content: LOCATIONS_PAGE.meta.description}];
};

export default function LocationsPage() {
  return (
    <div className="min-h-screen">
      <div className="px-6 sm:px-10 py-12 sm:py-20 max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-fluid-display mb-4 text-(--text-primary)">{LOCATIONS_PAGE.heading}</h1>
          <p className="text-fluid-body text-(--text-muted) max-w-xl mx-auto">{LOCATIONS_PAGE.subheading}</p>
        </header>

        <div className="mb-16">
          <Suspense
            fallback={
              <div className="h-[400px] w-full bg-(--canvas-elevated) rounded-md animate-pulse flex items-center justify-center text-(--text-muted)">
                Loading Map...
              </div>
            }
          >
            <Map stores={LOCATIONS_PAGE.stores} />
          </Suspense>
        </div>

        <div className="space-y-10">
          {LOCATIONS_PAGE.stores.map((store) => (
            <section key={store.name}>
              <h2 className="text-fluid-heading mb-4 text-(--text-primary) border-b border-(--border-subtle) pb-2">
                {store.website ? (
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-(--accent-primary) transition-colors"
                  >
                    {store.name}
                  </a>
                ) : (
                  store.name
                )}
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {store.locations.map((location, index) => (
                  <div
                    key={`${location.address}-${index}`}
                    className="p-6 bg-(--canvas-elevated) rounded-md shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-lg mb-2 text-(--text-primary)">{location.city}</h3>
                    <p className="text-fluid-body text-(--text-primary) mb-1">{location.address}</p>
                    <p className="text-fluid-body text-(--text-primary) mb-4">
                      {location.city}, {location.state} {location.zip}
                    </p>

                    <div className="space-y-2 text-sm text-(--text-muted)">
                      {location.phone && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Phone:</span>
                          <a
                            href={`tel:${location.phone.replace(/[^\d+]/g, '')}`}
                            className="hover:text-(--accent-primary) transition-colors"
                          >
                            {location.phone}
                          </a>
                        </p>
                      )}

                      {location.hours && (
                        <div className="flex gap-2">
                          <span className="font-medium">Hours:</span>
                          <span>{location.hours}</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm font-medium text-(--accent-primary) hover:underline"
                    >
                      Get Directions &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
