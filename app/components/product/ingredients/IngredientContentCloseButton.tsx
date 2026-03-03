import {cn} from '~/utils/cn';
import styles from './IngredientContentCloseButton.module.css';

interface IngredientContentCloseButtonProps {
  isActive?: boolean;
  onClick?: () => void;
}

export function IngredientContentCloseButton({isActive, onClick}: IngredientContentCloseButtonProps) {
  return (
    <button className={cn(styles['close-button-wrapper'], isActive && 'flex!')} onClick={onClick}>
      <div className={cn(styles['close-button-line'], styles['is-cl-1'])}></div>
      <div className={cn(styles['close-button-line'], styles['is-cl-2'])}></div>
    </button>
  );
}
