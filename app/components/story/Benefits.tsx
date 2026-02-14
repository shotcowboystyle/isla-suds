import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {ClippedTextBox} from '../ClippedTextBox';
import styles from './Benefits.module.css';

export const BenefitsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {isMobile, isLoading} = useIsMobile();

  useGSAP(() => {
    if (isLoading || !containerRef.current) {
      return;
    }

    const children = Array.from(containerRef.current?.children || []);

    const tl = gsap.timeline({
      delay: isMobile ? 0 : 1.3,
      scrollTrigger: {
        trigger: containerRef.current,
        start: isMobile ? 'top 80%' : 'top 60%',
        // start: 'top 60%',
        end: isMobile ? 'bottom 80%' : 'top top',
        // end: 'top top',
        scrub: 1.5,
      },
    });

    children.forEach((box) => {
      tl.from(`#${(box as HTMLElement).dataset.animationId}`, {
        // clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        opacity: 0,
        duration: 5,
        width: 0,
        ease: 'circ.out',
      });
    });
  }, [isLoading, isMobile, containerRef]);

  return (
    <div className={styles['benefits-section']}>
      <p id="paragraph-text-start" className={styles['paragraph-text-start']}>
        Unlock the Advantages:
        <br />
        Explore the Key Benefits of Choosing ISLA SUDS soap.
      </p>

      <div ref={containerRef} className={styles['clipped-boxes-wrapper']}>
        <ClippedTextBox id="benefit-title-1" text="Moisturizing" className={styles['wrapper-left']} index={1} />
        <ClippedTextBox id="benefit-title-2" text="Fragrance-free" className={styles['wrapper-right']} index={2} />
        <ClippedTextBox
          id="benefit-title-3"
          text="No artificial anything"
          className={styles['wrapper-left']}
          index={3}
        />
        <ClippedTextBox id="benefit-title-4" text="No Parabens" className={styles['wrapper-right']} index={4} />
      </div>

      <p id="paragraph-text-end" className={styles['paragraph-text-end']}>
        And much more...
      </p>
    </div>
  );
};
