import {useState, useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import ingredientsDripImage from '~/assets/images/slider-dip.png?responsive';
import {Picture} from '~/components/Picture';
import {INGREDIENTS, type IngredientItem} from '~/content/ingredients';
import {cn} from '~/utils/cn';
import {FloatingIngredientButton} from './FloatingIngredientButton';
import {IngredientContent} from './IngredientContent';
import {IngredientContentCloseButton} from './IngredientContentCloseButton';
import styles from './ProductIngredients.module.css';

export function ProductIngredients() {
  const [activeIngredientId, setActiveIngredientId] = useState<number | null>(null);

  const ingredientsGroup1Ref = useRef<Array<IngredientItem>>();
  const ingredientsGroup2Ref = useRef<Array<IngredientItem>>();

  const sectionRef = useRef<HTMLDivElement>(null);
  const circleLargeRef = useRef<HTMLDivElement>(null);
  const circleMidRef = useRef<HTMLDivElement>(null);
  const circleCenterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ingredientsGroup1Ref.current = INGREDIENTS.slice(0, 4);
    ingredientsGroup2Ref.current = INGREDIENTS.slice(4);
  }, []);

  useGSAP(
    () => {
      if (!circleLargeRef.current || !circleMidRef.current || !circleCenterRef.current) {
        return;
      }

      const revealTl = gsap.timeline({
        delay: 0.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
        },
      });

      revealTl
        .from(circleLargeRef.current, {
          duration: 0.7,
          scale: 0,
          stagger: 0.15,
          ease: 'power1.out',
        })
        .from(
          circleMidRef.current,
          {
            duration: 0.7,
            scale: 0,
            ease: 'power1.out',
          },
          '-=1.1',
        )
        .from(
          circleCenterRef.current,
          {
            duration: 0.7,
            scale: 0,
            ease: 'power1.out',
          },
          '-=0.55',
        )
        // use the shortcut string syntax or call the util methods in a tween
        .from(
          '[data-product-item-wrapper]',
          {
            opacity: 0,
            stagger: 0.035,
          },
          '>',
        )
        .to(
          '[data-product-item-wrapper]',
          {
            x: 'random(-10, 25, 0.55)',
            repeat: -1,
            repeatRefresh: true,
            duration: 1,
            repeatDelay: 0.2,
          },
          '<',
        );
    },
    {dependencies: [sectionRef, circleLargeRef, circleMidRef, circleCenterRef]},
  );

  return (
    <section ref={sectionRef} className={styles['section-ingredients']}>
      <Picture
        src={ingredientsDripImage}
        alt="ingredients drip bg"
        className={cn(styles['ingredients-drip-image'], 'w-full object-cover z-1')}
      />

      <div className={cn(styles['container-click-ingredients'])}>
        <div className={cn(styles['ingredient-click-main'])}>
          <div data-animated-circle ref={circleLargeRef} className={cn(styles['circle-large'])}>
            {ingredientsGroup2Ref.current?.map((ingredient, index) => (
              <FloatingIngredientButton
                key={ingredient.id}
                ingredient={ingredient}
                groupIndex={2}
                itemIndex={index + 1}
                isActive={activeIngredientId === ingredient.id}
                isAnyActive={!!activeIngredientId}
                onClick={() => setActiveIngredientId(ingredient.id)}
              />
            ))}

            <div data-animated-circle ref={circleMidRef} className={cn(styles['circle-mid'])}>
              {ingredientsGroup1Ref.current?.map((ingredient, index) => (
                <FloatingIngredientButton
                  key={ingredient.id}
                  ingredient={ingredient}
                  groupIndex={1}
                  itemIndex={index + 1}
                  isActive={activeIngredientId === ingredient.id}
                  isAnyActive={!!activeIngredientId}
                  onClick={() => setActiveIngredientId(ingredient.id)}
                />
              ))}
            </div>

            <div data-animated-circle ref={circleCenterRef} className={cn(styles['circle-center'])}>
              <IngredientContent activeIngredientId={activeIngredientId} />
            </div>

            <IngredientContentCloseButton isActive={!!activeIngredientId} onClick={() => setActiveIngredientId(null)} />
          </div>
        </div>
      </div>
    </section>
  );
}
