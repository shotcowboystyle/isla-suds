import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {MOTION_QUERY, REVEAL_START, WORD_STAGGER} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './IngredientsTable.module.css';
import {INGREDIENTS} from '../content/ingredients';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

interface IngredientsTableProps {
  className?: string;
}

export const IngredientsTable = ({className}: IngredientsTableProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // Each item starts collapsed at the centre of its group and fans out.
        const offsetToGroupCentre = (axis: 'x' | 'y') => (_index: number, target: Element) => {
          const group = target.closest(`.${styles['ingredient-group']}`);
          if (!group) return 0;
          const groupRect = group.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          return axis === 'x'
            ? groupRect.left + groupRect.width / 2 - (targetRect.left + targetRect.width / 2)
            : groupRect.top + groupRect.height / 2 - (targetRect.top + targetRect.height / 2);
        };

        GSAP.timeline({
          scrollTrigger: {
            trigger: container,
            start: REVEAL_START,
            once: true,
          },
        }).from('.animated-ingredient-item', {
          x: offsetToGroupCentre('x'),
          y: offsetToGroupCentre('y'),
          ease: 'power3.out',
          stagger: WORD_STAGGER,
        });
      });

      return () => mm.revert();
    },
    {scope: containerRef},
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
