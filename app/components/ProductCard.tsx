import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {Image, Money} from '@shopify/hydrogen';
import gsap from 'gsap';
import LavenderElementsImage from '~/assets/images/lavender-elements.webp?responsive';
import {productsList} from '~/content/products';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {useVariantUrl} from '~/lib/variant-url';
import {cn} from '~/utils/cn';
import {AddToCartButton} from './cart/AddToCartButton';
import {Picture} from './Picture';
import styles from './ProductCard.module.css';
import type {
  CollectionItemFragment,
  ProductItemFragment,
  RecommendedProductFragment,
  ProductsListQuery,
} from 'storefrontapi.generated';

interface ProductCardProps {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment
    | ProductsListQuery['products']['nodes'][0];
  loading?: 'eager' | 'lazy';
  isHomePage?: boolean;
}

export const ProductCard = ({product, loading = 'lazy', isHomePage = false}: ProductCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const elementsRef = useRef<HTMLImageElement>(null);
  const subjectRef = useRef<HTMLImageElement>(null);

  const {isMobile, isLoading: isMobileLoading} = useIsMobile();
  const variantUrl = useVariantUrl(product.handle);

  // Look up styling info from the hardcoded productsList if available
  const productContent = productsList.find((p) => p.toUrl.split('/').pop() === product.handle);
  const color = productContent?.color || 'primary';
  const particlesUrl = productContent?.particlesUrl || LavenderElementsImage;
  const productImageUrl = productContent?.productImageUrl; // If not found, use Shopify image

  useGSAP(
    () => {
      // 3D hover effects only run on the home page and on non-mobile devices
      if (
        !isHomePage ||
        isMobile ||
        isMobileLoading ||
        !cardRef.current ||
        !subjectRef.current ||
        !elementsRef.current
      ) {
        return;
      }

      gsap.set(cardRef.current, {perspective: 650});

      const outerRX = gsap.quickTo(elementsRef.current, 'rotationX', {ease: 'power3'});
      const outerRY = gsap.quickTo(elementsRef.current, 'rotationY', {ease: 'power3'});
      const innerX = gsap.quickTo(subjectRef.current, 'x', {ease: 'power3'});
      const innerY = gsap.quickTo(subjectRef.current, 'y', {ease: 'power3'});

      const onPointerMove = (e: PointerEvent) => {
        outerRX(gsap.utils.interpolate(15, -15, e.y / window.innerHeight));
        outerRY(gsap.utils.interpolate(-15, 15, e.x / window.innerWidth));
        innerX(gsap.utils.interpolate(-30, 30, e.x / window.innerWidth));
        innerY(gsap.utils.interpolate(-30, 30, e.y / window.innerHeight));
      };

      const onPointerLeave = () => {
        outerRX(0);
        outerRY(0);
        innerX(0);
        innerY(0);
      };

      cardRef.current.addEventListener('pointermove', onPointerMove);
      cardRef.current.addEventListener('pointerleave', onPointerLeave);

      return () => {
        cardRef.current?.removeEventListener('pointermove', onPointerMove);
        cardRef.current?.removeEventListener('pointerleave', onPointerLeave);
      };
    },
    {dependencies: [isHomePage, isMobile, isMobileLoading]},
  );

  return (
    <div
      role="listitem"
      className={cn(styles['collection-item'], isHomePage && styles['is-home-page'], 'relative h-full')}
    >
      <a
        ref={cardRef}
        href={variantUrl}
        className={cn(styles['card'], isHomePage && styles['is-home-page'], `card-bg-${color}`)}
      >
        {/* Only pre-load Shopify Images if productImageUrl from the CMS list isn't present, or fallback to it */}
        {productImageUrl ? (
          <Picture
            ref={subjectRef}
            loading={loading}
            src={productImageUrl}
            alt={product.title}
            className={styles['card-soap-bar']}
          />
        ) : (
          'featuredImage' in product &&
          product.featuredImage && (
            <Image
              alt={product.featuredImage.altText || product.title}
              aspectRatio="5/3"
              data={product.featuredImage}
              loading={loading}
              className={styles['card-soap-bar']}
            />
          )
        )}

        <Picture
          ref={elementsRef}
          loading={loading}
          src={particlesUrl}
          alt="particles"
          className={styles['card-additional']}
        />

        <div className="w-full flex items-center justify-between flex-col sm:flex-row">
          <div className="flex flex-col">
            <h1 className={cn(styles['card-heading'], color === 'sea-salt' ? 'text-black!' : 'text-secondary')}>
              {product.title}
            </h1>

            {'priceRange' in product && (
              <small
                className={cn(
                  'block ml-[16px] md:ml-[50px] font-sans font-bold text-lg',
                  color === 'sea-salt' ? 'text-black!' : 'text-secondary',
                )}
              >
                <Money data={product.priceRange.minVariantPrice} />
              </small>
            )}
          </div>

          {'availableForSale' in product && (
            <AddToCartButton
              className={cn(styles['add-to-cart-button'], !product.availableForSale && 'opacity-50 cursor-not-allowed')}
              disabled={!product.availableForSale}
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
              {product.availableForSale ? 'Add to Cart' : 'Sold Out'}
            </AddToCartButton>
          )}
        </div>
      </a>
    </div>
  );
};
