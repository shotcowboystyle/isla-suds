import {LOCATIONS_PAGE} from '~/content/stores';
import type {Route} from './+types/locations';

export const meta: Route.MetaFunction = () => {
  return [
    {title: LOCATIONS_PAGE.meta.title},
    {name: 'description', content: LOCATIONS_PAGE.meta.description},
  ];
};

export default function LocationsPage() {
  return (
    <div className="min-h-screen">
      <div className="px-6 sm:px-10 py-12 sm:py-20 max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-fluid-display mb-4 text-[var(--text-primary)]">
            {LOCATIONS_PAGE.heading}
          </h1>
          <p className="text-fluid-body text-[var(--text-muted)]">
            {LOCATIONS_PAGE.subheading}
          </p>
        </header>

        <div className="space-y-10">
          {LOCATIONS_PAGE.stores.map((store) => (
            <section key={store.name}>
              <h2 className="text-fluid-heading mb-1 text-[var(--text-primary)]">
                {store.website ? (
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--accent-primary)] transition-colors"
                  >
                    {store.name}
                  </a>
                ) : (
                  store.name
                )}
              </h2>

              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {store.locations.map((location) => (
                  <div
                    key={`${location.address}-${location.zip}`}
                    className="p-5 bg-[var(--canvas-elevated)] rounded-sm"
                  >
                    <p className="text-fluid-body text-[var(--text-primary)]">
                      {location.address}
                    </p>
                    <p className="text-fluid-body text-[var(--text-primary)]">
                      {location.city}, {location.state} {location.zip}
                    </p>
                    {location.phone && (
                      <p className="mt-2 text-fluid-body text-[var(--text-muted)]">
                        <a
                          href={`tel:${location.phone.replace(/[^\d+]/g, '')}`}
                          className="hover:text-[var(--accent-primary)] transition-colors"
                        >
                          {location.phone}
                        </a>
                      </p>
                    )}
                    {location.hours && (
                      <p className="mt-1 text-fluid-body text-[var(--text-muted)]">
                        {location.hours}
                      </p>
                    )}
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
