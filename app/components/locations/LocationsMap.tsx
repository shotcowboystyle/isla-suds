import {Suspense, lazy} from 'react';
import {LOCATIONS_PAGE} from '~/content/stores';
import styles from './LocationsMap.module.css';

const Map = lazy(() => import('~/components/Map.client').then((module) => ({default: module.Map})));

export function LocationsMap() {
  return (
    <div className={styles['location-map-wrapper']}>
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
  );
}
