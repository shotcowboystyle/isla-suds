import {Suspense, lazy} from 'react';
import styles from './LocationsMap.module.css';
import type {StorePostcard} from '~/content/stores';

// Leaflet touches `window` on import, so the map only ever loads in the browser.
const Map = lazy(() => import('~/components/Map.client').then((module) => ({default: module.Map})));

interface LocationsMapProps {
  stops: StorePostcard[];
  active: number;
  onPick: (index: number) => void;
  interactive: boolean;
  label: string;
}

export function LocationsMap({label, ...map}: LocationsMapProps) {
  return (
    <div className={styles.map} role="region" aria-label={label}>
      <Suspense fallback={<div className={styles.loading} />}>
        <Map {...map} />
      </Suspense>
    </div>
  );
}
