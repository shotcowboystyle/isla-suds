import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {AddToCartButton} from '../AddToCartButton';
import {Picture} from '../Picture';
import styles from './ProductsListCard.module.css';
import type {ImageData} from '@responsive-image/core';
import type {ProductsListQuery} from 'storefrontapi.generated';

interface ProductsListCardProps {
  productName: string;
  productImageUrl: ImageData;
  toUrl: string;
  bgUrl: ImageData;
  particlesUrl: ImageData;
  rotation: string;
  product?: ProductsListQuery['products']['nodes'][0];
}

export const ProductsListCard = ({
  bgUrl,
  productImageUrl,
  toUrl,
  particlesUrl,
  rotation,
  productName,
  product,
}: ProductsListCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const backgroundRef = useRef<HTMLImageElement>(null);
  const subjectRef = useRef<HTMLImageElement>(null);
  const elementsRef = useRef<HTMLImageElement>(null);
  // const titleRef = useRef<HTMLHeadingElement>(null);

  const {isMobile, isLoading} = useIsMobile();

  useGSAP(
    () => {
      if (
        isMobile ||
        isLoading ||
        !cardRef.current ||
        !backgroundRef.current ||
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

      cardRef.current.addEventListener('pointermove', (e) => {
        outerRX(gsap.utils.interpolate(15, -15, e.y / window.innerHeight));
        outerRY(gsap.utils.interpolate(-15, 15, e.x / window.innerWidth));
        innerX(gsap.utils.interpolate(-30, 30, e.x / window.innerWidth));
        innerY(gsap.utils.interpolate(-30, 30, e.y / window.innerHeight));
      });

      cardRef.current.addEventListener('pointerleave', (e) => {
        outerRX(0);
        outerRY(0);
        innerX(0);
        innerY(0);
      });
    },
    {dependencies: [cardRef, rotation, backgroundRef, subjectRef, elementsRef, isMobile, isLoading]},
  );

  return (
    <div role="listitem" className={styles['collection-item']}>
      <a ref={cardRef} href={toUrl} className={styles['card']}>
        <Picture
          ref={backgroundRef}
          loading="lazy"
          src={bgUrl}
          alt="background"
          className={styles['card-background']}
        />

        <Picture
          ref={subjectRef}
          loading="lazy"
          src={productImageUrl}
          alt={productName}
          className={styles['card-soap-bar']}
        />

        <Picture
          ref={elementsRef}
          loading="lazy"
          src={particlesUrl}
          alt="particles"
          className={styles['card-additional']}
        />

        <div className={styles['card-content']}>
          <h1 className={styles['card-heading']}>{productName}</h1>
          {product && (
            <div className="mt-4 pointer-events-auto relative z-20" onClick={(e) => e.stopPropagation()}>
              <AddToCartButton
                disabled={!product.availableForSale}
                lines={
                  product.variants.nodes.length > 0
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
                <span className="inline-block bg-black text-white px-6 py-2 rounded-full font-bold uppercase text-sm hover:bg-neutral-800 transition-colors">
                  {product.availableForSale ? 'Add to Cart' : 'Sold Out'}
                </span>
              </AddToCartButton>
            </div>
          )}
        </div>
      </a>
    </div>
  );
};
