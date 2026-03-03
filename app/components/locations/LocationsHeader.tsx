import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}
import styles from './LocationsHeader.module.css';

export function LocationsHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const clippedBoxRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !headingRef.current || !clippedBoxRef.current) {
        return;
      }

      const titleSplit = SplitText.create(headingRef.current, {type: 'chars'});

      const tl = gsap.timeline({
        delay: 2,
      });

      tl.to(containerRef.current, {
        opacity: 1,
        y: 0,
        ease: 'power1.inOut',
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
          titleSplit.chars,
          {
            yPercent: 200,
            stagger: 0.02,
            ease: 'power2.out',
          },
          '-=0.5',
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
    {dependencies: [containerRef, headingRef, clippedBoxRef]},
  );

  return (
    <header ref={containerRef} className={styles['heading-wrapper']}>
      <div className={styles['heading-text-wrapper']}>
        <h1 ref={headingRef} className={styles['heading-text']}>
          Find Isla Suds
        </h1>
      </div>

      <div ref={clippedBoxRef} className={styles['clipped-box-wrapper']}>
        <h1 className={styles['clipped-heading']}>Near You</h1>
      </div>
    </header>
  );
}
