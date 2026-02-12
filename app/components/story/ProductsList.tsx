import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {SplitText} from 'gsap/SplitText';
import {useIsMobile} from '~/hooks/use-is-mobile';
import styles from './ProductsList.module.css';
import {productsList} from '../../content/products';
import {cn} from '../../utils/cn';
import {ProductsListCard} from '../product/ProductsListCard';
import {LiquidButton} from '../ui/LiquidButton';

export const ProductsList = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const {isMobile, isLoading} = useIsMobile();

  useGSAP(
    () => {
      if (!isLoading && !isMobile) {
        const pinWrapWidth = sliderRef.current?.scrollWidth ?? 0;
        const scrollAmount = pinWrapWidth - window.innerWidth;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 2%',
            end: `+=${scrollAmount}px `,
            scrub: 1.5,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        tl.to(sliderRef.current, {
          x: `-${scrollAmount}px`,
          ease: 'none',
        });
      }
    },
    {dependencies: [isLoading, isMobile], revertOnUpdate: true},
  );

  useGSAP(
    () => {
      if (!isLoading) {
        const splittedText1 = SplitText.create('#products-title-text1', {
          type: ' chars',
        });
        const splittedText2 = SplitText.create('#products-title-text2', {
          type: ' chars',
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#products-section',
            start: isMobile ? 'top 90%' : 'top 60%',
            end: isMobile ? 'bottom bottom' : '70% top',
            toggleActions: 'play none none reverse',
          },
        });

        tl.from(splittedText1.chars, {
          yPercent: 200,
          opacity: 0,
          stagger: 0.03,
          duration: 0.05,
          ease: 'power2.out',
        })
          .from(
            '#products-clipped-box',
            {
              opacity: 0,
              duration: 0.05,
              width: 0,
              ease: 'power3.inOut',
            },
            '=0.25',
          )
          .from(
            splittedText2.chars,
            {
              yPercent: 200,
              opacity: 0,
              stagger: 0.03,
              duration: 0.05,
              ease: 'power2.out',
            },
            '=0.25',
          );
      }
    },
    {dependencies: [isLoading, isMobile], revertOnUpdate: true},
  );

  return (
    <section>
      <div ref={sectionRef} className={cn(styles['track'], 'relative', 'overflow-hidden')}>
        <div id="products-section" className={styles['camera']}>
          <div ref={sliderRef} className={styles['frame']}>
            <div className={styles['item']}>
              <div className={styles['text-wrapper']}>
                <h1 id="products-title-text1" className={styles['heading-text']}>
                  We have 4
                </h1>

                <div id="products-clipped-box" className={styles['clipped-box']}>
                  <h1 className={styles['clipped-heading-text']}>Silky Smooth</h1>
                </div>

                <h1 id="products-title-text2" className={styles['heading-text']}>
                  Sudsy Soap Bars
                </h1>
              </div>

              <div className="hidden"></div>

              <div className={styles['collection-list-wrapper']}>
                <div role="list" className={styles['collection-list']}>
                  {productsList.map((product) => (
                    <ProductsListCard
                      key={product.name}
                      bgUrl={product.bgUrl}
                      toUrl={product.toUrl}
                      productName={product.name}
                      particlesUrl={product.particlesUrl}
                      productImageUrl={product.productImageUrl}
                      rotation={product.rotation}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="fixed-btn" className={cn(styles['actions-wrapper'])}>
          <div className={styles['actions-container']}>
            <div className={styles['actions-content']}>
              <LiquidButton href="/shop" text="GET IT NOW" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
