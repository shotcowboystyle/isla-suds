import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {DESKTOP_QUERY, MOTION_QUERY, REVEAL_START, SCRUB_SCENE} from '~/lib/motion/tokens';
import {ClippedTextBox} from '../ClippedTextBox';
import styles from './Benefits.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

export const BenefitsSection = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const mm = GSAP.matchMedia();

      mm.add({isDesktop: DESKTOP_QUERY, allowMotion: MOTION_QUERY}, (context) => {
        const {isDesktop, allowMotion} = context.conditions as {isDesktop: boolean; allowMotion: boolean};
        if (!allowMotion) return;

        const boxes = Array.from(container.children)
          .map((box) => (box as HTMLElement).dataset.animationId)
          .filter(Boolean)
          .map((id) => `#${id}`);

        const tl = GSAP.timeline({
          scrollTrigger: {
            trigger: container,
            start: REVEAL_START,
            end: isDesktop ? '+=1000' : '+=300',
            scrub: SCRUB_SCENE,
            invalidateOnRefresh: true,
          },
        });

        boxes.forEach((selector) => {
          tl.fromTo(
            selector,
            {opacity: 0, width: 0},
            {opacity: 1, width: 'auto', duration: 5, ease: 'circ.out'},
          );
        });
      });

      return () => mm.revert();
    },
    {scope: rootRef},
  );

  return (
    <div ref={rootRef} className="relative">
      <div className={styles['benefits-section']}>
        <p id="paragraph-text-start" className={styles['paragraph-text-start']}>
          Unlock the Advantages:
          <br />
          Explore the Key Benefits of Choosing ISLA SUDS soap.
        </p>

        <div ref={containerRef} className={styles['clipped-boxes-wrapper']}>
          <ClippedTextBox
            id="benefit-title-1"
            text="Moisturizing"
            className={styles['wrapper-left']}
            index={1}
            textColor="secondary"
          />
          <ClippedTextBox id="benefit-title-2" text="Fragrance-free" className={styles['wrapper-right']} index={2} />
          <ClippedTextBox
            id="benefit-title-3"
            text="Natural Ingredients"
            className={styles['wrapper-left']}
            index={3}
            textColor="secondary"
          />
          <ClippedTextBox id="benefit-title-4" text="No Parabens" className={styles['wrapper-right']} index={4} />
        </div>

        <p id="paragraph-text-end" className={styles['paragraph-text-end']}>
          And much more...
        </p>
      </div>
    </div>
  );
};
