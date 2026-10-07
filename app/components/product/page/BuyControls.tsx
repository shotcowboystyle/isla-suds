import {useState} from 'react';
import {AddToCartButton} from '~/components/cart/AddToCartButton';
import {cn} from '~/utils/cn';
import styles from './BuyControls.module.css';

interface Variant {
  id: string;
  availableForSale: boolean;
  [key: string]: unknown;
}

interface BuyControlsProps {
  selectedVariant: Variant | null | undefined;
  /** Show the quantity stepper (the hero keeps it to one tap). */
  withQuantity?: boolean;
  className?: string;
  label?: string;
}

/**
 * Add to cart for the selected variant. The old hero disabled the button when
 * the bar WAS in stock and built its line from `product.variants`, which the
 * product query never fetches, so it added nothing.
 */
export function BuyControls({
  selectedVariant,
  withQuantity = false,
  className,
  label = 'Add to cart',
}: BuyControlsProps) {
  const [quantity, setQuantity] = useState(1);
  const available = Boolean(selectedVariant?.availableForSale);

  return (
    <div className={cn(styles['controls'], className)}>
      {withQuantity && (
        <div className={styles['stepper']} role="group" aria-label="Quantity">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="One fewer bar"
            className={styles['step']}
          >
            −
          </button>
          <output aria-live="polite" className={styles['count']}>
            {quantity}
          </output>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="One more bar"
            className={styles['step']}
          >
            +
          </button>
        </div>
      )}

      <AddToCartButton
        // `undefined` when available, so the button keeps its own busy state while adding.
        disabled={available ? undefined : true}
        lines={selectedVariant ? [{merchandiseId: selectedVariant.id, quantity, selectedVariant}] : []}
        className={styles['add']}
      >
        {available ? label : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}
