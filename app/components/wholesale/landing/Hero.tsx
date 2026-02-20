import {forwardRef, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import WholesaleHeroBackground from '~/assets/images/wholesale-hero-background.webp';
import {LiquidButton} from '~/components/ui/LiquidButton';
if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}
import {cn} from '~/utils/cn';
import styles from './Hero.module.css';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const clippedBox1Ref = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !text1Ref.current || !clippedBox1Ref.current) {
        return;
      }

      const titleSplit = SplitText.create(text1Ref.current, {type: 'chars'});

      const tl = gsap.timeline({
        delay: 2,
      });

      tl.to(containerRef.current, {
        opacity: 1,
        y: 0,
        ease: 'power1.inOut',
      })
        .from(
          clippedBox1Ref.current,
          {
            opacity: 0,
            duration: 1,
            width: 0,
            ease: 'circ.out',
          },
          '-=0.5',
        )
        .from(
          titleSplit.chars,
          {
            yPercent: 200,
            stagger: 0.02,
            ease: 'power2.out',
          },
          '-=0.5',
        )
        .from(
          paragraphRef.current,
          {
            y: 20,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3',
        )
        .from(
          buttonRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4',
        );

      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      heroTl.to(containerRef.current, {
        rotate: 7,
        scale: 0.9,
        yPercent: 30,
        ease: 'power1.inOut',
      });
    },
    {dependencies: [containerRef, text1Ref, clippedBox1Ref, paragraphRef, buttonRef]},
  );

  return (
    <section className={styles['hero-section']}>
      <div ref={containerRef} className={styles['hero-section-container']}>
        {/* Background Image - converting the analysis description "lifestyle-oriented image" */}
        <div className="absolute inset-0 z-0">
          <img src={WholesaleHeroBackground} alt="Wholesale Hero" className="h-full w-full object-cover opacity-60" />
        </div>

        <div className={styles['hero-section-content']}>
          <div className={styles['letter-animation']}>
            <h1 ref={text1Ref} className={styles['hero-text']}>
              GET STARTED
            </h1>
          </div>

          <div ref={clippedBox1Ref} className={styles['clipped-box']}>
            <h1 className={styles['heading-1']}>SELLING ISLA SUDS</h1>
          </div>

          <p ref={paragraphRef} className={cn(styles['paragraph'], 'text-white!')}>
            GROCERY — GYM — OFFICE — CAFÉ — HOTEL — SPA — RESTAURANT
          </p>

          <LiquidButton
            ref={buttonRef}
            href="/wholesale/register" // This will be the application route
            text="APPLY TODAY"
            className="mt-16"
            backgroundColor="#D99E5C"
          />
        </div>
      </div>
    </section>
  );
}
