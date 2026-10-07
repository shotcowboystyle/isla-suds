import {Link} from 'react-router';
import {AddToCartButton} from '~/components/cart/AddToCartButton';
import {findScent} from '~/content/product-page';
import {LOCATIONS_PAGE} from '~/content/stores';
import {formatMoney} from '~/utils/format-money';
import styles from './CollectionClose.module.css';
import type {ProductItemFragment} from 'storefrontapi.generated';

/**
 * The page ends on the two real next steps: every bar in one tap, or a shop
 * nearby. "All of them" adds one of each available bar; there is no bundle
 * product or discount, so the total is just the bars' own prices added up.
 */
export function CollectionClose({products}: {products: ProductItemFragment[]}) {
  const stores = LOCATIONS_PAGE.stores.map((store) => store.name).join(' and ');
  const bars = products
    .filter((product) => findScent(product.handle))
    .map((product) => product.variants.nodes[0])
    .filter((variant) => variant?.availableForSale);
  const total = Math.round(bars.reduce((sum, variant) => sum + Number(variant.price.amount), 0) * 100) / 100;
  const currency = bars[0]?.price.currencyCode ?? 'USD';

  return (
    <section className={styles['section']} aria-labelledby="close-title">
      {bars.length > 1 && (
        <div className={styles['panel']}>
          <h2 id="close-title" className={styles['title']}>
            <span>Can&apos;t pick?</span>
            <span className={styles['sticker']}>Take all {bars.length}.</span>
          </h2>
          <p className={styles['body']}>One of each, so every sink in the house gets its own mood.</p>
          <AddToCartButton
            lines={bars.map((variant) => ({merchandiseId: variant.id, quantity: 1, selectedVariant: variant}))}
            className={styles['cta']}
          >
            Add all {bars.length} · {formatMoney(String(total), currency)}
          </AddToCartButton>
        </div>
      )}
      <p className={styles['stores']}>
        Rather sniff before you buy? We&apos;re on shelves at {stores}. <Link to="/locations">Find a store</Link>
      </p>
    </section>
  );
}
