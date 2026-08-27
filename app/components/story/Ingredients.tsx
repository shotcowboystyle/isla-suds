import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import ingredientsImage from '~/assets/images/ingredients-section-bg.webp';
import ingredientsDripImage from '~/assets/images/slider-dip.png';
import {
  CHAR_STAGGER,
  ENTER_EASE,
  MOTION_QUERY,
  REDUCED_MOTION_QUERY,
  REVEAL_START,
  WORD_STAGGER,
} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './Ingredients.module.css';
import {IngredientsTable} from '../IngredientsTable';

GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export function IngredientsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const clippedBoxRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const title1 = title1Ref.current;
      const clippedBox = clippedBoxRef.current;
      const paragraph = paragraphRef.current;

      if (!section || !title1 || !clippedBox || !paragraph) {
        return;
      }

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        const titleSplit = SplitText.create(title1, {type: 'chars', mask: 'chars', autoSplit: true});
        const paragraphSplit = SplitText.create(paragraph, {
          type: 'words, lines',
          linesClass: 'paragraph-line',
          aria: 'none',
          autoSplit: true,
        });

        const contentTl = GSAP.timeline({
          scrollTrigger: {
            trigger: section,
            start: REVEAL_START,
            once: true,
          },
        });

        contentTl
          .fromTo(
            titleSplit.chars,
            {yPercent: 100},
            {yPercent: 0, stagger: CHAR_STAGGER, ease: ENTER_EASE},
          )
          .fromTo(
            clippedBox,
            {opacity: 0, width: 0},
            {opacity: 1, width: 'auto', duration: 0.5, ease: 'circ.out'},
            '-=0.25',
          )
          .fromTo(
            paragraphSplit.words,
            {yPercent: 300, rotate: 3},
            {
              yPercent: 0,
              rotate: 0,
              ease: 'power1.inOut',
              duration: 1,
              stagger: WORD_STAGGER * 0.2,
            },
            '-=0.25',
          );

        return () => {
          titleSplit.revert();
          paragraphSplit.revert();
        };
      });

      mm.add(REDUCED_MOTION_QUERY, () => {
        GSAP.set(clippedBox, {opacity: 1, width: 'auto'});
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={sectionRef}>
      <div className={styles['ingredients-section-wrapper']}>
        <img
          src={ingredientsDripImage}
          alt=""
          width={1920}
          height={292}
          loading="lazy"
          decoding="async"
          className={cn(styles['ingredients-drip-image'], 'w-full object-cover z-1')}
        />

        <div className={styles['ingredients-section-headings']}>
          <h2 ref={title1Ref} className={styles['section-heading']}>
            Real Gentle
          </h2>

          <div ref={clippedBoxRef} className={styles['clipped-box']}>
            <h2 className={styles['clipped-heading-text']}>Simple Soap</h2>
          </div>
        </div>

        <div className={styles['paragraph-text-wrapper']}>
          <p ref={paragraphRef} className={styles['paragraph-text']}>
            Allergies and skin sensitivities have met their match. We skip the performance additives, dyes or scents,
            and always 100% clean and natural.
          </p>
        </div>

        <img
          src={ingredientsImage}
          alt=""
          width={1344}
          height={768}
          loading="lazy"
          decoding="async"
          className={styles['ingredients-section-image']}
        />

        <IngredientsTable className="mt-10" />
      </div>
    </section>
  );
}
