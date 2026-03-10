import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {useOptimisticVariant, getAdjacentAndFirstAvailableVariants, Image, getProductOptions} from '@shopify/hydrogen';
import {gsap} from 'gsap';
import {Flip} from 'gsap/Flip';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);
}
import {JumboMarquee} from '~/components/JumboMarquee';
import {LocalStores} from '~/components/LocalStores';
import {ProductIngredients} from '~/components/product/ingredients/ProductIngredients';
import {ProductHero} from '~/components/product/landing/ProductHero';
import {TestimonialsSection} from '~/components/Testimonials';
import {useIsMobile} from '~/hooks/use-is-mobile';
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

  const sectionRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const {isMobile, isLoading} = useIsMobile();

  useGSAP(
    () => {
      if (isMobile || isLoading || !imageWrapperRef.current || !sectionRef.current) {
        return;
      }

      gsap.to(imageWrapperRef.current, {
        rotation: 90,
        bottom: '-130%',
        ease: 'circ.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 5%',
          end: '+=200%',
          scrub: 1,
        },
      });
    },
    {dependencies: [isMobile, isLoading, sectionRef, imageWrapperRef]},
  );

  return (
    <section ref={sectionRef} className={styles['section-wrapper']}>
      <div className={cn(styles['section-container'], `card-bg-${product.tags[0]}`)}>
        {variantImage && (
          <div ref={imageWrapperRef} className={styles['image-wrapper']}>
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
      <ProductIngredients />
      <FallInLove color={product.tags[0]} />
      <JumboMarquee
        color={product.tags[0]}
        text="gentle & soothing, moisturizing, fragrance-free, clean & safe, everyday use"
      />
      <TestimonialsSection />
      <LocalStores />
    </section>
  );
}
