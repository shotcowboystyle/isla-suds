import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {SplitText} from 'gsap/SplitText';
import {ProductCard} from '~/components/ProductCard';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {productsList} from '~/content/products';
import {useIsDesktop} from '~/hooks/use-is-desktop';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {cn} from '~/utils/cn';
import styles from './ProductsList.module.css';
import type {ProductsListQuery} from 'storefrontapi.generated';

export const ProductsList = ({products}: {products: ProductsListQuery['products']['nodes']}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const clippedBox1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);

  const {isMobile, isLoading} = useIsMobile();
  const {isDesktop, isLoading: isLoadingDesktop} = useIsDesktop();

  useGSAP(
    () => {
      if (isLoading || !sectionRef.current || !text1Ref.current || !clippedBox1Ref.current || !text2Ref.current) {
        return;
      }

      const splittedText1 = SplitText.create(text1Ref.current, {
        type: ' chars',
      });
      const splittedText2 = SplitText.create(text2Ref.current, {
        type: ' chars',
      });

      const headingTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? 'top 75%' : 'top 35%',
          // end: isMobile ? 'top bottom' : '70% top',
          end: '+=700px',
          toggleActions: 'play none none reverse',
        },
      });

      headingTl
        .from(splittedText1.chars, {
          yPercent: 200,
          opacity: 0,
          stagger: 0.03,
          duration: 0.5,
          ease: 'power2.out',
        })
        .from(
          clippedBox1Ref.current,
          {
            opacity: 0,
            duration: 0.5,
            width: 0,
            ease: 'circ.out',
          },
          '-=0.25',
        )
        .from(
          splittedText2.chars,
          {
            yPercent: 200,
            opacity: 0,
            stagger: 0.03,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.5',
        );
    },
    {dependencies: [isLoading, isMobile, sectionRef, text1Ref, clippedBox1Ref, text2Ref]},
  );

  useGSAP(
    () => {
      if (!isDesktop || isLoadingDesktop || !sectionRef.current || !sliderRef.current) {
        return;
      }

      const pinWrapWidth = sliderRef.current?.scrollWidth ?? 0;
      const scrollAmount = pinWrapWidth - window.innerWidth;

      const horizontalScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${scrollAmount}px `,
          scrub: 1.5,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      horizontalScrollTl.to(sliderRef.current, {
        x: `-${scrollAmount}px`,
        ease: 'none',
      });
    },
    {dependencies: [isLoadingDesktop, isDesktop, sectionRef, sliderRef]},
  );

  return (
    <section>
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
