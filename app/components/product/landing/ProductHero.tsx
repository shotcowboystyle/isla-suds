import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {AddToCartButton} from '~/components/cart/AddToCartButton';
// import {StickyAddToCart} from '~/components/product/spylt/StickyAddToCart';
import {ProductForm} from '~/components/ProductForm';
import {cn} from '~/utils/cn';
import {formatMoney} from '~/utils/format-money';
import styles from './ProductHero.module.css';

interface ProductHeroProps {
  product: any;
  productOptions: any;
  selectedVariant: any;
}

export function ProductHero({product, productOptions, selectedVariant}: ProductHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  console.log('PRODUCT', product);
  const pricePerUnit = product.selectedOrFirstAvailableVariant?.price;
  const formattedUnitPrice = formatMoney(pricePerUnit?.amount ?? 0, pricePerUnit?.currencyCode ?? 'USD');

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    },
    {scope: containerRef},
  );

  console.log('PRODUCT', product);

  return (
    <div ref={containerRef} className={styles['hero-wrapper']}>
      {/* <StickyAddToCart product={product} selectedVariant={selectedVariant} /> */}
      <div className={styles['hero-container']}>
        <div className={styles['heading-wrapper']}>
          <h1
            ref={titleRef}
            className={cn(
              styles['heading-text'],
              product.tags[0] === 'color-sea-salt' ? styles['description-black'] : '',
            )}
          >
            {product.title}
          </h1>
        </div>

        <div className={styles['description-wrapper']}>
          <div className={styles['description-content']}>
            <h2
              className={cn(
                styles['description-price'],
                product.tags[0] === 'color-sea-salt' ? styles['description-black'] : '',
              )}
            >
              {formattedUnitPrice || '$0.00'}
            </h2>

            <div className={styles['description-text-wrapper']}>
              <p
                className={cn(
                  styles['description-text'],
                  product.tags[0] === 'color-sea-salt' ? styles['description-black'] : '',
                  'leading-fluid-body',
                )}
              >
                {product.description || ''}
              </p>

              {/* <div className="inline-flex items-center border border-neutral-200 rounded shrink-0">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1 || isUpdating}
                className={cn(
                  'inline-flex items-center justify-center transition-colors',
                  'h-9 w-9 text-lg',
                  quantity <= 1 || isUpdating
                    ? 'text-neutral-300 bg-neutral-50 cursor-not-allowed'
                    : 'text-primary bg-neutral-100 hover:bg-neutral-200',
                )}
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
                className={cn(
                  'text-base font-medium w-12 text-center bg-transparent border-0 p-0 text-primary',
                  'focus:ring-2 focus:ring-primary focus:outline-none focus:z-10',
                  '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                )}
              />

              <button
                type="button"
                onClick={handleIncrement}
                disabled={isUpdating}
                className={cn(
                  'inline-flex items-center justify-center transition-colors',
                  'h-9 w-9 text-lg',
                  isUpdating
                    ? 'text-neutral-300 bg-neutral-50 cursor-wait'
                    : 'text-primary bg-neutral-100 hover:bg-neutral-200',
                )}
                aria-label={`Increase quantity for ${product.title}`}
                aria-disabled={isUpdating}
              >
                {isUpdating ? <span className="sr-only">Updating...</span> : <span aria-hidden="true">+</span>}
              </button>
            </div> */}

              <AddToCartButton
                className={cn(
                  'inline-block px-6 py-4 rounded-full',
                  'bg-accent text-secondary',
                  'font-bold uppercase text-2xl hover:bg-neutral-800 transition-colors',
                  !product.selectedOrFirstAvailableVariant?.availableForSale && 'opacity-50 cursor-not-allowed',
                )}
                disabled={product.selectedOrFirstAvailableVariant?.availableForSale}
                lines={
                  product.variants?.nodes?.length > 0
                    ? [
                        {
                          merchandiseId: product.variants.nodes[0].id,
                          quantity: 1,
                          selectedVariant: product.variants.nodes[0],
                        },
                      ]
                    : []
                }
              >
                {product.selectedOrFirstAvailableVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
              </AddToCartButton>
            </div>
          </div>

          <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} hideAddToCart={true} />
        </div>
      </div>
    </div>
  );
}
