import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {cn} from '~/utils/cn';
import styles from './IngredientsTable.module.css';
import {INGREDIENTS} from '../content/ingredients';

if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface IngredientsTableProps {
  className?: string;
}

export const IngredientsTable = ({className}: IngredientsTableProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: '+=1000',
          },
        })
        .from('.animated-ingredient-item', {
          x: (index, target) => {
            const container = target.closest(`.${styles['ingredient-group']}`);
            if (!container) return 0;
            const cRect = container.getBoundingClientRect();
            const tRect = target.getBoundingClientRect();
            return cRect.left + cRect.width / 2 - (tRect.left + tRect.width / 2);
          },
          y: (index, target) => {
            const container = target.closest(`.${styles['ingredient-group']}`);
            if (!container) return 0;
            const cRect = container.getBoundingClientRect();
            const tRect = target.getBoundingClientRect();
            return cRect.top + cRect.height / 2 - (tRect.top + tRect.height / 2);
          },
          ease: 'power3.out',
          stagger: 0.05,
        });
    },
    {scope: containerRef, dependencies: [containerRef]},
  );

  return (
    <div ref={containerRef} className={cn(styles['ingredients-list-wrapper'], `relative ${className}`)}>
      <div className={styles['ingredients-list']}>
        <div className={cn(styles['ingredient-group'])}>
          {INGREDIENTS?.map((ingredient, idx) => (
            <div key={ingredient.id} className={cn(styles['ingredient-item'], 'animated-ingredient-item')}>
              <div className={styles['ingredient-icon-wrapper']}>
                <ingredient.icon
                  className={cn(styles['ingredient-icon'], 'relative z-10 w-1/2 h-1/2 text-black')}
                  strokeWidth={1.5}
                />
                <div className={cn(styles['ingredient-icon-circle'], styles[`is-${idx + 1}`])}></div>
              </div>
              <p className={styles['ingredient-text']}>{ingredient.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
