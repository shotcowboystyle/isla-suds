import {Link} from 'react-router';
import {BAR_FACTS, type Scent} from '~/content/product-page';
import {LOCATIONS_PAGE} from '~/content/stores';
import styles from './BuyClose.module.css';
import {BuyControls} from './BuyControls';
import {Dock} from './Dock';

interface BuyCloseProps {
  scent: Scent;
  price: string;
  selectedVariant: {id: string; availableForSale: boolean} | null | undefined;
}

/** The last dock: the bar lands on the buy box and the page stops to let you buy it. */
export function BuyClose({scent, price, selectedVariant}: BuyCloseProps) {
  const stores = LOCATIONS_PAGE.stores.map((store) => store.name).join(' and ');

  return (
    <section
      id="buy"
      className={styles['section']}
      aria-labelledby="buy-title"
      style={{'--scent': scent.color} as React.CSSProperties}
    >
      <div className={styles['card']}>
        <Dock id="buy" rot={-12} src={scent.bar} className={styles['dock']} />
        <h2 id="buy-title" className={styles['title']}>
          <span>This one&apos;s</span>
          <span className={styles['sticker']}>yours for {price}</span>
        </h2>
        <p className={styles['spec']}>
          {scent.name} · {BAR_FACTS.weight} · goat milk, essential oils, no added fragrance
        </p>
        <BuyControls selectedVariant={selectedVariant} withQuantity className={styles['controls']} />
        <p className={styles['stores']}>
          Rather pick it up in person? It&apos;s on shelves at {stores}. <Link to="/locations">Find a store</Link>
        </p>
      </div>
    </section>
  );
}
