import {useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {cn} from '~/utils/cn';
import styles from './IngredientsTable.module.css';
import {INGREDIENTS, type IngredientItem} from '../content/ingredients';

interface IngredientsTableProps {
  className?: string;
}

export const IngredientsTable = ({className}: IngredientsTableProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ingredientGroupsRef = useRef<Array<Array<IngredientItem>>>([]);

  const {isMobile, isLoading} = useIsMobile();

  useEffect(() => {
    ingredientGroupsRef.current = [INGREDIENTS.slice(0, 4), INGREDIENTS.slice(4)];
  }, [isLoading, isMobile]);

  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom 10%',
          },
        })
        .to('.animated-ingredient-item', {
          xPercent: 0,
          yPercent: 0,
          ease: 'power2.out',
        });
    },
    {dependencies: [containerRef]},
  );

  return (
    <div ref={containerRef} className={cn(styles['ingredients-list-wrapper'], `relative ${className}`)}>
      <div className={styles['ingredients-list']}>
        {ingredientGroupsRef.current?.map((ingredientGroup, index) => (
          <div key={index} className={cn(styles['ingredient-group'], `ingredients-group-${index + 1}`)}>
            {ingredientGroup?.map((ingredient, idx) => (
              <div
                key={`${idx}-${ingredient.name}`}
                className={cn(
                  styles['ingredient-item'],
                  styles[`item-${index + 1}-${idx + 1}`],
                  `animated-ingredient-item`,
                )}
              >
                <div className={styles['ingredient-icon-wrapper']}>
                  <ingredient.icon
                    className={cn(styles['ingredient-icon'], 'relative z-10 w-1/2 h-1/2 text-black')}
                    strokeWidth={1.5}
                  />
                  <div className={cn(styles['ingredient-icon-circle'], styles[`is-${index + 1}-${idx + 1}`])}></div>
                </div>
                <p className={styles['ingredient-text']}>{ingredient.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
