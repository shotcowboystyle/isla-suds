import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {SplitText} from 'gsap/SplitText';
import styles from './Ingredients.module.css';
import ingredientsImage from '../../assets/images/ingredients-section-bg.png?responsive';
import ingredientsDripImage from '../../assets/images/slider-dip.png?responsive';
import {cn} from '../../utils/cn';
import {IngredientsTable} from '../IngredientsTable';
import {Picture} from '../Picture';

export function IngredientsSection() {
  useGSAP(
    () => {
      const titleSplit = SplitText.create('#ingredients-section-heading-1', {type: 'chars'});
      const paragraphSplit = SplitText.create('#ingredients-section-paragraph', {
        type: 'words, lines',
        linesClass: 'paragraph-line',
        aria: 'none',
      });

      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#ingredients-section',
          start: 'top center',
        },
      });

      contentTl
        .from(titleSplit.chars, {
          yPercent: 100,
          stagger: 0.02,
          ease: 'power2.out',
        })
        .from(paragraphSplit.words, {
          yPercent: 300,
          rotate: 3,
          ease: 'power1.inOut',
          duration: 1,
          stagger: 0.01,
        });

      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#ingredients-section',
          start: 'top 80%',
        },
      });

      titleTl.to('#ingredients-clipped-box', {
        opacity: 1,
        duration: 0.5,
        width: 'auto',
        ease: 'circ.out',
      });
    },
    {dependencies: [], revertOnUpdate: true},
  );

  return (
    <section id="ingredients-section" className={styles['ingredients-section-wrapper']}>
      <Picture
        src={ingredientsDripImage}
        alt="ingredients drip bg"
        className={cn(styles['ingredients-drip-image'], 'w-full object-cover')}
      />
      <Picture
        src={ingredientsImage}
        alt="ingredients background"
        className="w-full absolute 2xl:h-full md:h-2/3 h-1/2 left-0 bottom-0 object-bottom 2xl:object-contain object-cover"
      />

      <div className="flex md:flex-row flex-col justify-between md:px-10 px-5 mt-14">
        <div className="relative inline-block md:translate-y-96">
          <div className="general-title relative flex flex-col justify-center items-center gap-24">
            <div className="mb-4 place-self-start">
              <h1
                id="ingredients-section-heading-1"
                className="xl:max-w-5xl md:py-0 py-3 md:pb-5 pb-0 lg:pb-0 md:text-center text-black"
              >
                Real Gentle
              </h1>
            </div>

            <div
              id="ingredients-clipped-box"
              className="-rotate-3 border-[.5vw] border-coral-light text-nowrap opacity-0 md:-mt-32 -mt-24 place-self-start"
            >
              <div className="bg-accent pb-5 md:pt-0 pt-3 md:px-5 px-3">
                <h2 className="text-secondary">Simple Soap</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:justify-center items-center translate-y-80">
          <div className="md:max-w-xl max-w-md">
            <p id="ingredients-section-paragraph" className="text-lg md:text-right text-balance font-paragraph">
              Allergies and skin sensitivities have met their match. We skip the performance additives, dyes or scents,
              and always 100% clean and natural.
            </p>
          </div>
        </div>

        <div
          id="ingredients-table-box"
          className="absolute left-1/2 -translate-x-1/2 md:bottom-16 bottom-5 w-full md:px-0 px-4"
        >
          <IngredientsTable className="my-10" />
        </div>
      </div>
    </section>
  );
}
