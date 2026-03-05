import {useState} from 'react';
import {useSearchParams} from 'react-router';
import {LocationsHeader} from '~/components/locations/LocationsHeader';
import {LocationsLogos} from '~/components/locations/LocationsLogos';
import {LocationsMap} from '~/components/locations/LocationsMap';
import {ProductCard} from '~/components/ProductCard';
import {LOCATIONS_PAGE} from '~/content/stores';
import {cn} from '~/utils/cn';
import styles from './LocationsPage.module.css';

interface LocationsPageProps {
  products: any;
}

export function LocationsPage({products}: LocationsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'in-store';

  const setTab = (newTab: string) => {
    setSearchParams(
      (prev) => {
        prev.set('tab', newTab);
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  return (
    <div className={styles['locations-page']}>
      <div className={styles['locations-page-wrapper']}>
        <LocationsHeader />

        <div className="flex border-b border-(--border-subtle) mb-12 mx-auto justify-center space-x-8">
          {[
            {id: 'in-store', label: 'In-Store'},
            {id: 'buy-online', label: 'Buy Online'},
            {id: 'map', label: 'Map'},
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'py-4 px-2 text-lg font-medium border-b-2 transition-colors duration-200',
                tab === t.id
                  ? 'border-(--text-primary) text-(--text-primary)'
                  : 'border-transparent text-(--text-muted) hover:text-(--text-primary) hover:border-(--border-base)',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div>
          {tab === 'in-store' && (
            <div className="animate-fade-in max-w-4xl mx-auto">
              <div className="grid gap-8 sm:grid-cols-2">
                {LOCATIONS_PAGE.stores.map((store) => (
                  <div
                    key={store.name}
                    className="bg-(--canvas-elevated) rounded-xl p-8 border border-(--border-subtle)"
                  >
                    <h3 className="text-2xl text-(--text-primary) font-bold mb-6">{store.name}</h3>
                    <div className="space-y-6">
                      {store.locations.map((loc, i) => (
                        <div key={loc.address || i} className="flex space-x-4">
                          <svg
                            className="w-6 h-6 text-(--text-secondary) shrink-0 mt-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>

                          <div>
                            <p className="font-semibold text-(--text-primary)">{loc.city}</p>
                            <p className="text-(--text-secondary)">{loc.address}</p>
                            <p className="text-(--text-secondary)">
                              {loc.city}, {loc.state} {loc.zip}
                            </p>
                            {loc.phone && <p className="text-(--text-muted) mt-1">{loc.phone}</p>}
                            {loc.hours && <p className="text-(--text-muted) text-sm mt-1">{loc.hours}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'buy-online' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.nodes.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {tab === 'map' && (
            <div className="animate-fade-in relative z-0">
              <LocationsMap />
            </div>
          )}
        </div>

        <div className="mt-20">
          <LocationsLogos />
        </div>
      </div>
    </div>
  );
}
