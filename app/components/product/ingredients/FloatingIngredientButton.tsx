import {useIsMobile} from '~/hooks/use-is-mobile';
import {cn} from '~/utils/cn';
import styles from './FloatingIngredientButton.module.css';
import type {IngredientItem} from '~/content/ingredients';

interface FloatingIngredientButtonProps {
  ingredient: IngredientItem;
  groupIndex?: number;
  itemIndex?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function FloatingIngredientButton({
  ingredient,
  groupIndex,
  itemIndex,
  isActive,
  onClick,
}: FloatingIngredientButtonProps) {
  const {isMobile} = useIsMobile();

  return (
    <div
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
