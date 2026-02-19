// import {LOCATIONS_PAGE} from '~/content/stores';
import styles from './LocationsHeader.module.css';

export function LocationsHeader() {
  return (
    <header className={styles['heading-wrapper']}>
      <div className={styles['heading-text-wrapper']}>
        {/* <h1 className="text-fluid-display mb-4 text-(--text-primary)">{LOCATIONS_PAGE.heading}</h1> */}
        <h1 className={styles['heading-text']}>Find Isla Suds</h1>
      </div>
      <div className={styles['clipped-box-wrapper']}>
        {/* <h1 className={styles['clipped-heading']}>{LOCATIONS_PAGE.subheading}</h1> */}
        <h1 className={styles['clipped-heading']}>Near You</h1>
      </div>
    </header>
  );
}
