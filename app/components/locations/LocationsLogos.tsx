import {LOCATIONS_PAGE} from '~/content/stores';
import styles from './LocationsLogos.module.css';

export function LocationsLogos() {
  return (
    <div className={styles['locations-logos-wrapper']}>
      <div className={styles['locations-logos-heading-wrapper']}>
        <h1 className={styles['section-heading']}>Isla Suds In Real Life</h1>
      </div>

      <div className={styles['locations-logos-content']}>
        <div className={styles['logos-grid']}>
          {LOCATIONS_PAGE.stores.map((store) => (
            <div className={styles['grid-item']} key={store.name}>
              {/* <img className={styles['location-logo']} src={store.logo} alt={store.name} /> */}
              <span>Location Logo</span>
              <div className="hidden">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
