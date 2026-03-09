import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {useOptimisticVariant, getAdjacentAndFirstAvailableVariants, Image, getProductOptions} from '@shopify/hydrogen';
import {gsap} from 'gsap';
import {Flip} from 'gsap/Flip';
import {LocalStores} from '~/components/LocalStores';
import {ProductIngredients} from '~/components/product/ingredients/ProductIngredients';
import {Marquee} from '~/components/product/landing/Marquee';
import {ProductHero} from '~/components/product/landing/ProductHero';
import {TestimonialsSection} from '~/components/Testimonials';
import {cn} from '~/utils/cn';
import {FallInLove} from './FallInLove';
import styles from './ProductLandingPage.module.css';

interface ProductLandingPageProps {
  product: any;
}

export function ProductLandingPage({product}: ProductLandingPageProps) {
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const variantImage = selectedVariant?.image ?? product.selectedOrFirstAvailableVariant?.image;

  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!imageRef.current) return;

      const tl = gsap.timeline();

      tl.from(
        imageRef.current,
        {
          scale: 0.8,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        '-=0.5',
      );
    },
    {scope: imageRef},
  );

  return (
    <section className={styles['section-wrapper']}>
      <div className={cn(styles['section-container'], `card-bg-${product.tags[0]}`)}>
        {variantImage && (
          <div ref={imageRef} className={styles['image-wrapper']}>
            <Image
              src={variantImage.url}
              alt={variantImage.altText || product.title}
              className={styles['hero-image']}
              width={variantImage.width}
              height={variantImage.height}
            />
          </div>
        )}

        <ProductHero product={product} productOptions={productOptions} selectedVariant={selectedVariant} />
      </div>
      <Marquee text="GENTLE & SOOTHING • MOISTURIZING • FRAGRANCE-FREE • " className="bg-black text-white" />
      <FallInLove />
      <ProductIngredients />
      <Marquee text="CLEAN & SAFE • EVERYDAY USE • " direction="right" className="bg-milk" />
      <TestimonialsSection />
      <LocalStores />
    </section>
  );
}
