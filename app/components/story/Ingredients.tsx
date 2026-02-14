import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {SplitText} from 'gsap/SplitText';
import ingredientsImage from '~/assets/images/ingredients-section-bg.png?responsive';
import ingredientsDripImage from '~/assets/images/slider-dip.png?responsive';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {cn} from '~/utils/cn';
import styles from './Ingredients.module.css';
import {IngredientsTable} from '../IngredientsTable';
import {Picture} from '../Picture';

export function IngredientsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const clippedBoxRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const tableBoxRef = useRef<HTMLDivElement>(null);

  const {isMobile, isLoading} = useIsMobile();

  useGSAP(
    () => {
      if (
        isLoading ||
        !sectionRef.current ||
        !title1Ref.current ||
        !clippedBoxRef.current ||
        !paragraphRef.current ||
        !tableBoxRef.current
      ) {
        return;
      }

      const titleSplit = SplitText.create(title1Ref.current, {type: 'chars'});
      const paragraphSplit = SplitText.create(paragraphRef.current, {
        type: 'words, lines',
        linesClass: 'paragraph-line',
        aria: 'none',
      });

      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? 'top 70%' : 'top center',
        },
      });

      contentTl
        .from(titleSplit.chars, {
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
          '-=0.25',
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
          '-=0.25',
        );
    },
    {dependencies: [sectionRef, title1Ref, clippedBoxRef, paragraphRef, tableBoxRef, isLoading, isMobile]},
  );

  return (
    <section>
      <div ref={sectionRef} className={styles['ingredients-section-wrapper']}>
        <Picture
          src={ingredientsDripImage}
          alt="ingredients drip bg"
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

        <Picture src={ingredientsImage} alt="ingredients background" className={styles['ingredients-section-image']} />

        <IngredientsTable className="my-10" />
      </div>
    </section>
  );
}
