import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {SplitText} from 'gsap/SplitText';
import {useIsMobile} from '~/hooks/use-is-mobile';
import styles from './LocalStores.module.css';
import StoreMap from '../../assets/images/store-map.svg';
import {LiquidButton} from '../ui/LiquidButton';

export function LocalStores() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const clippedBoxRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);

  const {isMobile, isLoading} = useIsMobile();

  useGSAP(
    () => {
      if (
        isLoading ||
        !sectionRef.current ||
        !heading1Ref.current ||
        !clippedBoxRef.current ||
        !paragraphRef.current ||
        !buttonWrapperRef.current
      ) {
        return;
      }

      const heading1Split = SplitText.create(heading1Ref.current, {type: 'chars'});
      const paragraphSplit = SplitText.create(paragraphRef.current, {type: 'words'});

      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? 'top 70%' : 'top center',
          end: isMobile ? 'top 50%' : 'top center',
        },
      });

      contentTl
        .from(heading1Split.chars, {
          yPercent: 100,
          stagger: 0.02,
          ease: 'power2.out',
        })
        .from(
          clippedBoxRef.current,
          {
            opacity: 0,
            duration: 0.5,
            width: 0,
            ease: 'circ.out',
          },
          '-=0.5',
        )
        .from(
          paragraphSplit.words,
          {
            yPercent: 300,
            rotate: 3,
            ease: 'power1.inOut',
            duration: 1,
            stagger: 0.01,
          },
          '-=0.5',
        )
        .from(
          buttonWrapperRef.current,
          {
            opacity: 0,
            duration: 0.5,
            width: 0,
            ease: 'circ.out',
          },
          '-=0.5',
        );
    },
    {dependencies: [sectionRef, heading1Ref, clippedBoxRef, paragraphRef, buttonWrapperRef, isLoading, isMobile]},
  );

  return (
    <section ref={sectionRef} className={styles['map-section-wrapper']}>
      <div className={styles['map-section-inner']}>
        <div className={styles['map-section-info']}>
          <div className={styles['heading-text-wrapper']}>
            <h2 ref={heading1Ref} className={styles['heading-text']}>
              Right Around
            </h2>
          </div>

          <div ref={clippedBoxRef} className={styles['clipped-text-box']}>
            <h1 className={styles['clipped-text']}>the corner</h1>
          </div>

          <div className={styles['paragraph-text-wrapper']}>
            <p ref={paragraphRef} className={styles['paragraph-text']}>
              Buy our soaps at your local store or get them delivered (to your door).
            </p>
          </div>

          <div className="mt-6">
            <LiquidButton href="/locations" text="Find a Store" />
          </div>
        </div>

        <img src={StoreMap} loading="lazy" width="1840" alt="Store Map" className={styles['background-image']} />
      </div>
    </section>
  );
}
