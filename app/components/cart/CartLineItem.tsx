import * as React from 'react';
import {Link, useFetcher} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import GSAP from 'gsap';
import chunky from '~/components/ui/ChunkyButton.module.css';
import {
  CART_QUANTITY_UPDATE_ERROR_MESSAGE,
  CART_QUANTITY_INVENTORY_ERROR_MESSAGE,
  CART_QUANTITY_NETWORK_ERROR_MESSAGE,
  CART_REMOVE_ERROR_MESSAGE,
} from '~/content/errors';
import {cn} from '~/utils/cn';
import {formatMoney} from '~/utils/format-money';
import styles from './CartDrawer.module.css';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export function CartLineItem({
  line,
  cart,
  reducedMotion,
}: {
  line: CartApiQueryFragment['lines']['nodes'][0];
  cart: CartApiQueryFragment;
  reducedMotion: boolean;
}) {
  const {merchandise, quantity} = line;
  const {product, image, selectedOptions} = merchandise;

  const liRef = React.useRef<HTMLLIElement>(null);
  const [isRemoving, setIsRemoving] = React.useState(false);
  const fetcher = useFetcher();
  const isUpdating = fetcher.state === 'submitting' || isRemoving;

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const [inputValue, setInputValue] = React.useState<string>(String(quantity));

  React.useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  React.useEffect(() => {
    if (fetcher.data && 'errors' in fetcher.data && fetcher.data.errors) {
      const errors = fetcher.data.errors as Array<{message: string}>;
      if (errors.length > 0) {
        const errorMsg = errors[0].message.toLowerCase();

        const isRemoveError =
          errorMsg.includes('remove') ||
          errorMsg.includes('removal') ||
          errorMsg.includes('delete') ||
          errorMsg.includes('cart item');

        let message = isRemoveError ? CART_REMOVE_ERROR_MESSAGE : CART_QUANTITY_UPDATE_ERROR_MESSAGE;

        if (!isRemoveError) {
          if (errorMsg.includes('inventory') || errorMsg.includes('stock') || errorMsg.includes('available')) {
            message = CART_QUANTITY_INVENTORY_ERROR_MESSAGE;
          } else if (errorMsg.includes('network') || errorMsg.includes('connection') || errorMsg.includes('timeout')) {
            message = CART_QUANTITY_NETWORK_ERROR_MESSAGE;
          }
        }

        setErrorMessage(message);

        const timer = setTimeout(() => {
          setErrorMessage(null);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [fetcher.data]);

  React.useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && !('errors' in fetcher.data)) {
      const itemStillInCart = cart.lines.nodes.some((l) => l.id === line.id);
      if (!itemStillInCart) {
        const announcement = `${product.title} removed from cart`;
        setSuccessMessage(announcement);

        const timer = setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [fetcher.state, fetcher.data, cart.lines.nodes, line.id, product.title]);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;

    fetcher
      .submit(
        {
          action: CartForm.ACTIONS.LinesUpdate,
          inputs: {
            lines: [
              {
                id: line.id,
                quantity: newQuantity,
              },
            ],
          },
        },
        {
          method: 'POST',
          action: '/cart',
        },
      )
      .catch(() => {
        // Safe to continue: error state handled via fetcher.data
      });
  };

  const handleDecrement = () => {
    if (quantity <= 1) return;

    const newQuantity = quantity - 1;

    fetcher
      .submit(
        {
          action: CartForm.ACTIONS.LinesUpdate,
          inputs: {
            lines: [
              {
                id: line.id,
                quantity: newQuantity,
              },
            ],
          },
        },
        {
          method: 'POST',
          action: '/cart',
        },
      )
      .catch(() => {
        // Safe to continue: error state handled via fetcher.data
      });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const newQuantity = parseInt(value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) return;
    if (newQuantity === quantity) return;

    fetcher
      .submit(
        {
          action: CartForm.ACTIONS.LinesUpdate,
          inputs: {
            lines: [
              {
                id: line.id,
                quantity: newQuantity,
              },
            ],
          },
        },
        {
          method: 'POST',
          action: '/cart',
        },
      )
      .catch(() => {
        // Safe to continue: error state handled via fetcher.data
      });
  };

  const handleQuantityBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (inputValue === '' || isNaN(parsed) || parsed < 1) {
      setErrorMessage('Minimum quantity is 1');
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setInputValue(String(quantity));
      }, 2000);
      return () => clearTimeout(timer);
    }
  };

  const performRemove = () => {
    fetcher
      .submit(
        {
          action: CartForm.ACTIONS.LinesRemove,
          inputs: {
            lineIds: [line.id],
          },
        },
        {
          method: 'POST',
          action: '/cart',
        },
      )
      .catch(() => {
        // Safe to continue: error state handled via fetcher.data
        setIsRemoving(false);
        if (!reducedMotion && liRef.current) {
          GSAP.set(liRef.current, {opacity: 1, scale: 1});
        }
      });
  };

  const handleRemove = () => {
    setIsRemoving(true);
    if (reducedMotion || !liRef.current) {
      performRemove();
    } else {
      GSAP.to(liRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'expo.out',
        onComplete: performRemove,
      });
    }
  };

  const lineTotal = line.cost.totalAmount;
  const pricePerUnit = line.cost.amountPerQuantity;
  const compareAtPrice = line.cost.compareAtAmountPerQuantity;

  const formattedLineTotal = formatMoney(lineTotal.amount, lineTotal.currencyCode);
  const formattedUnitPrice = formatMoney(pricePerUnit.amount, pricePerUnit.currencyCode);
  const formattedComparePrice = compareAtPrice ? formatMoney(compareAtPrice.amount, compareAtPrice.currencyCode) : null;

  const productUrl = `/products/${product.handle}`;

  const imageUrl = image?.url ? `${image.url}?width=96&height=96&format=webp` : null;
  const altText = `${product.title} thumbnail`;

  return (
    <li ref={liRef} className={styles.line}>
      {successMessage && (
        <div role="status" aria-live="polite" className="sr-only">
          {successMessage}
        </div>
      )}

      {/* Product Image */}
      <div className={styles.thumb}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={altText}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) {
                (fallback as HTMLElement).style.display = 'flex';
              }
            }}
            className="size-full rounded-[8px] object-contain"
          />
        ) : null}

        <div
          style={{display: imageUrl ? 'none' : 'flex'}}
          className="flex size-full items-center justify-center rounded-[8px] text-(--color-black)/40"
          aria-label="No image available"
          role="img"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      </div>

      {/* Product Details & Controls */}
      <div className="flex-1 flex flex-col justify-between gap-4 sm:flex-row sm:gap-6">
        {/* Title and Remove Button */}
        <div className="flex items-start justify-between flex-1 gap-4">
          <Link to={productUrl} className={styles['line-title']} aria-label={`View details for ${product.title}`}>
            {product.title}
          </Link>

          {/* Remove Button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUpdating}
            className={cn(chunky.chunky, chunky.cream, styles['icon-button'], 'h-11 w-11')}
            aria-label={`Remove ${product.title} from cart`}
          >
            {isUpdating ? (
              <span className="sr-only">Removing...</span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            )}
          </button>
        </div>

        {/* Pricing and Quantity */}
        <div className="flex flex-col gap-3 sm:items-end">
          {/* Prices */}
          <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end sm:justify-start gap-1">
            <div className={styles['line-price']} aria-label={`Total price: ${formattedLineTotal}`}>
              {formattedLineTotal}
            </div>
            {(quantity > 1 || compareAtPrice) && (
              <div className="flex items-center gap-2 text-sm font-bold text-(--color-black)/60">
                {formattedComparePrice && (
                  <span
                    className="line-through sr-only sm:not-sr-only"
                    aria-label={`Original price: ${formattedComparePrice}`}
                  >
                    {formattedComparePrice}
                  </span>
                )}
                <span aria-label={`Unit price: ${formattedUnitPrice}`}>
                  {quantity > 1 ? `${formattedUnitPrice} \u00D7 ${quantity}` : formattedUnitPrice}
                </span>
              </div>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex flex-col sm:items-end gap-1">
            <div className={cn(styles.stepper, 'w-fit shrink-0')}>
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1 || isUpdating}
                className={styles.step}
                aria-label={`Decrease quantity for ${product.title}`}
                aria-disabled={quantity <= 1 || isUpdating}
              >
                {isUpdating ? <span className="sr-only">Updating...</span> : <span aria-hidden="true">−</span>}
              </button>

              <label htmlFor={`quantity-${line.id}`} className="sr-only">
                Quantity for {product.title}
              </label>
              <input
                id={`quantity-${line.id}`}
                type="number"
                min="1"
                value={inputValue}
                disabled={isUpdating}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                className={styles.qty}
              />

              <button
                type="button"
                onClick={handleIncrement}
                disabled={isUpdating}
                className={cn(styles.step, isUpdating && 'cursor-wait')}
                aria-label={`Increase quantity for ${product.title}`}
                aria-disabled={isUpdating}
              >
                {isUpdating ? <span className="sr-only">Updating...</span> : <span aria-hidden="true">+</span>}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div role="alert" aria-live="assertive" className={styles['line-error']}>
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
