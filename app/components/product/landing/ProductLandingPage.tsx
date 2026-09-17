import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {useOptimisticVariant, getAdjacentAndFirstAvailableVariants, Image, getProductOptions} from '@shopify/hydrogen';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}
import {JumboMarquee} from '~/components/JumboMarquee';
import {LocalStores} from '~/components/LocalStores';
import {ProductIngredients} from '~/components/product/ingredients/ProductIngredients';
import {ProductHero} from '~/components/product/landing/ProductHero';
import {TestimonialsSection} from '~/components/Testimonials';
import {MOTION_QUERY, SCRUB_SCENE} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import {FallInLove} from './FallInLove';
import styles from './ProductLandingPage.module.css';

/** Where the soap bar switches from in-flow to fixed. Matches the CSS above it. */
const FLOATING_QUERY = '(min-width: 480px)';

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

  // The bar's journey from the hero down to the "Why you'll love our soap" circle.
  //
  // Transforms only. The previous version tweened `bottom`, which did nothing at
  // all: the element is `position: fixed` with `top` and an explicit `height`, and
  // CSS drops `bottom` when all three are set. So the bar rotated in place and
  // never travelled. It also animated with `circ.inOut` on a scrubbed trigger,
  // which fights the wheel — a scrubbed tween is linear and the smoothing comes
  // from `scrub` plus the Lenis lerp.
  useGSAP(
    () => {
      const wrapper = imageWrapperRef.current;
      const section = sectionRef.current;

      if (!wrapper || !section) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add({isFloating: FLOATING_QUERY, allowMotion: MOTION_QUERY}, (context) => {
        const {isFloating, allowMotion} = context.conditions as {isFloating: boolean; allowMotion: boolean};
        if (!isFloating || !allowMotion) return;

        const journey = gsap.timeline({
          defaults: {ease: 'none'},
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=300%',
            scrub: SCRUB_SCENE,
            invalidateOnRefresh: true,
          },
        });

        journey
          // Settle: the bar eases back as the hero copy takes the foreground.
          .to(wrapper, {yPercent: -8, rotation: -6, scale: 0.92})
          // Drift: down and slightly off-axis through the ingredients, so it
          // reads as travel rather than a lift shaft.
          .to(wrapper, {yPercent: 30, xPercent: -6, rotation: 14})
          // Sink: hands off to the rotating circle, which is this page's peak.
          .to(wrapper, {yPercent: 180, rotation: 42, scale: 0.78, opacity: 0});
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
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
      <JumboMarquee text="gentle & soothing, moisturizing, fragrance-free, clean & safe, everyday use" />
      <TestimonialsSection />
      <LocalStores />
    </section>
  );
}
