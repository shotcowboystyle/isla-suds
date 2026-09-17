import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {ProductCard} from '~/components/ProductCard';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {productsList} from '~/content/products';
import {
  CHAR_STAGGER,
  DESKTOP_QUERY,
  ENTER_EASE,
  MOTION_QUERY,
  PIN_PRIORITY,
  REDUCED_MOTION_QUERY,
  SCRUB_PIN,
  SCRUB_REVEAL,
} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './ProductsList.module.css';
import type {ProductsListQuery} from 'storefrontapi.generated';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export const ProductsList = ({products}: {products: ProductsListQuery['products']['nodes']}) => {
  const outerRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const clippedBox1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);

  // Heading reveal.
  //
  // Triggers on the outer <section>, not on the element the horizontal scene
  // pins. A pinned trigger gets wrapped in a pin-spacer, which moves the very
  // positions this timeline measured — the reveal then fires inside the pin.
  //
  // `end: 'top top'` is the important half: the horizontal scene pins at
  // `top top`, so the reveal now lands its last character exactly as the pin
  // engages. With a bare `start` + `once` it finished ~18vh before the section
  // was even parked, which read as the heading animating "too early".
  useGSAP(
    () => {
      const outer = outerRef.current;
      const text1 = text1Ref.current;
      const clippedBox1 = clippedBox1Ref.current;
      const text2 = text2Ref.current;

      if (!outer || !text1 || !clippedBox1 || !text2) {
        return;
      }

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // `autoSplit` re-splits on font load and on resize. Rebuild the timeline
        // when that happens so the scrubbed trigger never points at dead nodes.
        const splits: {heading1?: SplitText; heading2?: SplitText} = {};
        let headingTl: gsap.core.Timeline | undefined;

        const build = () => {
          const {heading1: splittedText1, heading2: splittedText2} = splits;
          if (!splittedText1 || !splittedText2) return;

          headingTl?.scrollTrigger?.kill();
          headingTl?.kill();

          headingTl = GSAP.timeline({
            scrollTrigger: {
              trigger: outer,
              start: 'top 80%',
              end: 'top top',
              scrub: SCRUB_REVEAL,
              invalidateOnRefresh: true,
            },
          });

          headingTl
            .fromTo(
              splittedText1.chars,
              {yPercent: 120, opacity: 0},
              {yPercent: 0, opacity: 1, stagger: CHAR_STAGGER, duration: 0.5, ease: ENTER_EASE},
            )
            .fromTo(
              clippedBox1,
              {opacity: 0, width: 0},
              {opacity: 1, width: 'auto', duration: 0.5, ease: 'circ.out'},
              '-=0.25',
            )
            .fromTo(
              splittedText2.chars,
              {yPercent: 120, opacity: 0},
              {yPercent: 0, opacity: 1, stagger: CHAR_STAGGER, duration: 0.5, ease: ENTER_EASE},
              '-=0.5',
            );
        };

        splits.heading1 = SplitText.create(text1, {
          type: 'chars',
          mask: 'chars',
          autoSplit: true,
          onSplit: build,
        });
        splits.heading2 = SplitText.create(text2, {
          type: 'chars',
          mask: 'chars',
          autoSplit: true,
          onSplit: build,
        });

        build();

        return () => {
          headingTl?.scrollTrigger?.kill();
          headingTl?.kill();
          splits.heading1?.revert();
          splits.heading2?.revert();
        };
      });

      mm.add(REDUCED_MOTION_QUERY, () => {
        GSAP.set(clippedBox1, {opacity: 1, width: 'auto'});
      });

      return () => mm.revert();
    },
    {scope: outerRef},
  );

  // Horizontal scene — the track pins and the slider travels sideways.
  useGSAP(
    () => {
      const section = sectionRef.current;
      const slider = sliderRef.current;
      if (!section || !slider) return;

      const mm = GSAP.matchMedia();

      mm.add(`${DESKTOP_QUERY} and ${MOTION_QUERY}`, () => {
        // Measured through functions so `invalidateOnRefresh` actually
        // re-reads them; a baked-in string would keep the stale distance.
        const distance = () => Math.max(0, slider.scrollWidth - window.innerWidth);

        GSAP.to(slider, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: SCRUB_PIN,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: PIN_PRIORITY.productsList,
          },
        });
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={outerRef}>
      <div ref={sectionRef} className={cn(styles['track'], 'relative', 'md:overflow-hidden')}>
        <div className={styles['camera']}>
          <div className={styles['frame']}>
            <div ref={sliderRef} className={styles['item']}>
              <div className={styles['text-wrapper']}>
                <h1 ref={text1Ref} className={styles['heading-text']}>
                  We have 4
                </h1>

                <div ref={clippedBox1Ref} className={styles['clipped-box']}>
                  <h1 className={styles['clipped-heading-text']}>Silky Smooth</h1>
                </div>

                <h1 ref={text2Ref} className={styles['heading-text']}>
                  Sudsy Soap Bars
                </h1>
              </div>

              <div className="hidden"></div>

              <div className={styles['collection-list-wrapper']}>
                <div role="list" className={styles['collection-list']}>
                  {productsList.map((product) => {
                    const shopifyProduct = products?.find((p) => p.handle === product.toUrl.split('/').pop());
                    if (!shopifyProduct) return null;
                    return <ProductCard key={product.name} product={shopifyProduct} isHomePage={true} />;
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className={cn(styles['actions-wrapper'])}>
            <div className={styles['actions-container']}>
              <div className={styles['actions-content']}>
                <LiquidButton href="/collections/frontpage" text="SHOP ALL PRODUCTS" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
