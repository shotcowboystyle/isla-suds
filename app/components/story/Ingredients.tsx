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
    <section ref={sectionRef} className={styles['ingredients-section-wrapper']}>
      <Picture
        src={ingredientsDripImage}
        alt="ingredients drip bg"
        className={cn(styles['ingredients-drip-image'], 'w-full object-cover z-1')}
      />
      <Picture
        src={ingredientsImage}
        alt="ingredients background"
        className="w-full absolute h-auto bottom-0 left-0 object-bottom object-cover min-h-screen"
      />

      <div className="flex md:flex-row flex-col justify-between md:px-10 px-5 mt-14">
        <div className="relative inline-block md:translate-y-96">
          <div className="general-title relative flex flex-col justify-center items-center gap-24">
            <div className="mb-4 place-self-start">
              <h1 ref={title1Ref} className="xl:max-w-5xl md:py-0 py-3 md:pb-5 pb-0 lg:pb-0 md:text-center text-black">
                Real Gentle
              </h1>
            </div>

            <div ref={clippedBoxRef} className={styles['clipped-box']}>
              <h2 className={styles['clipped-heading-text']}>Simple Soap</h2>
            </div>
          </div>
        </div>

        <div className="flex md:justify-center items-center translate-y-12 md:translate-y-80">
          <div className="md:max-w-xl max-w-md">
            <p ref={paragraphRef} className={styles['paragraph-text']}>
              Allergies and skin sensitivities have met their match. We skip the performance additives, dyes or scents,
              and always 100% clean and natural.
            </p>
          </div>
        </div>

        <div ref={tableBoxRef} className="absolute left-1/2 -translate-x-1/2 md:bottom-16 bottom-5 w-full md:px-0 px-4">
          <IngredientsTable className="my-10" />
        </div>
      </div>
    </section>
  );
}
