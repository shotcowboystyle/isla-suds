import {Link} from 'react-router';
import {AddToCartButton} from '~/components/cart/AddToCartButton';
import {BAR_FACTS, SCENTS, type ScentId} from '~/content/product-page';
import {cn} from '~/utils/cn';
import {formatMoney} from '~/utils/format-money';
import styles from './ScentCard.module.css';
import type {ProductItemFragment} from 'storefrontapi.generated';

interface ScentCardProps {
  product: ProductItemFragment;
  scentId: ScentId | null;
  state?: 'picked' | 'dimmed';
}

/**
 * A window into the bar's product page: its scent room behind it, its joke,
 * its price. The bar carries a view-transition name that the product page's
 * traveling bar shares, so opening the card glides the bar into the hero.
 */
export function ScentCard({product, scentId, state}: ScentCardProps) {
  const scent = scentId ? SCENTS[scentId] : null;
  const variant = product.variants.nodes[0];
  const money = variant?.price ?? product.priceRange.minVariantPrice;
  const available = Boolean(variant?.availableForSale);
  const href = `/products/${product.handle}`;

  return (
    <article
      data-card={scentId ?? product.handle}
      data-state={state}
      className={styles['card']}
      style={scent ? ({'--scent': scent.color} as React.CSSProperties) : undefined}
    >
      <div className={styles['window']}>
        {scent && (
          <img src={scent.heroMobile} alt="" width={1360} height={1520} loading="lazy" className={styles['room']} />
        )}
        <div data-hop className={styles['hop']}>
          <img
            src={scent?.bar ?? product.featuredImage?.url}
            alt=""
            width={1000}
            height={1000}
            loading="lazy"
            className={styles['bar']}
            style={{
              rotate: `${(scent?.barRot ?? 0) - 8}deg`,
              viewTransitionName: `bar-${product.handle}`,
            }}
          />
        </div>
      </div>

      <div className={styles['body']}>
        <h2 className={styles['name']}>
          <Link to={href} prefetch="intent" viewTransition className={styles['link']}>
            {scent?.name ?? product.title}
          </Link>
        </h2>
        {scent && <p className={styles['line']}>{scent.line}</p>}
        <div className={styles['row']}>
          <p className={styles['price']}>
            {formatMoney(money.amount, money.currencyCode)}
            {scent && <span className={styles['weight']}>{BAR_FACTS.weight}</span>}
          </p>
          <AddToCartButton
            disabled={available ? undefined : true}
            lines={variant ? [{merchandiseId: variant.id, quantity: 1, selectedVariant: variant}] : []}
            className={styles['add']}
            aria-label={`Add ${scent?.name ?? product.title} to cart`}
          >
            {available ? 'Add to cart' : 'Sold out'}
          </AddToCartButton>
        </div>
      </div>
    </article>
  );
}
