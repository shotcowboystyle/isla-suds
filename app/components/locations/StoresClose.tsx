import {Link} from 'react-router';
import Logo from '~/assets/images/isla-suds-logo-stacked.svg';
import {LOCATIONS_PAGE} from '~/content/stores';
import {Postcard} from './Postcard';
import styles from './StoresClose.module.css';

const {close} = LOCATIONS_PAGE;

/** Act 3: the last postcard is addressed to the visitor. Too far? We'll mail it. */
export function StoresClose() {
  return (
    <section className={styles.close} aria-labelledby="close-heading">
      <div className={styles.inner}>
        <h2 id="close-heading" className={styles['heading-tilt']}>
          <span className={styles.heading}>{close.heading}</span>
        </h2>

        <Postcard
          className={styles.card}
          note={close.note}
          heading={close.to}
          stamp={{src: Logo, width: 180, height: 140, background: 'var(--color-accent-secondary)'}}
          postmark={{ring: close.postmark}}
          actions={
            <Link to={close.shop.href} prefetch="intent">
              {close.shop.label}
            </Link>
          }
        >
          {close.addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </Postcard>

        <p className={styles.stockist}>
          {close.stockist.lead}{' '}
          <Link to={close.stockist.href} prefetch="intent">
            {close.stockist.label}
          </Link>
        </p>
      </div>
    </section>
  );
}
