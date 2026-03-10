import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {cn} from '~/utils/cn';
import styles from './FloatingIngredientButton.module.css';
import type {IngredientItem} from '~/content/ingredients';

interface FloatingIngredientButtonProps {
  ingredient: IngredientItem;
  groupIndex?: number;
  itemIndex?: number;
  isActive?: boolean;
  isAnyActive?: boolean;
  onClick?: () => void;
}

export function FloatingIngredientButton({
  ingredient,
  groupIndex,
  itemIndex,
  isActive,
  isAnyActive,
  onClick,
}: FloatingIngredientButtonProps) {
  const {isMobile} = useIsMobile();
  const itemRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!itemRef.current) return;

    if (isAnyActive && !isActive) {
      gsap.to(itemRef.current, {
        autoAlpha: 0,
        scale: 0.5,
        duration: 0.4,
        ease: 'power2.inOut',
      });
    } else {
      gsap.to(itemRef.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.5)',
      });
    }
  }, [isActive, isAnyActive]);

  return (
    <div
      ref={itemRef}
      data-product-item-wrapper
      className={cn(styles['ingredient-item-wrapper'], 'animated-item', isActive && 'is-active')}
      style={isMobile ? {...ingredient.startingPositionsMobile} : {...ingredient.startingPositions}}
    >
      <button className={styles['ingredient-item-button']} onClick={onClick}>
        <div className={cn(styles['item-icon-wrapper'], ingredient.iconOrder !== 1 && 'order-last')}>
          <div className={cn(styles['item-icon-circle'], styles[`is-${groupIndex}-${itemIndex}`])}>
            <ingredient.icon
              className={cn(styles['item-icon'], 'relative z-10 w-1/2 h-1/2 text-black')}
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className={styles['item-text-wrapper']}>
          <div className={styles['item-text']}>{ingredient.name}</div>
        </div>
      </button>
    </div>
  );
}
