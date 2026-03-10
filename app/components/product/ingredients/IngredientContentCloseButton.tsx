import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {cn} from '~/utils/cn';
import styles from './IngredientContentCloseButton.module.css';

interface IngredientContentCloseButtonProps {
  isActive?: boolean;
  onClick?: () => void;
}

export function IngredientContentCloseButton({isActive, onClick}: IngredientContentCloseButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (!btnRef.current) return;

    if (isActive) {
      gsap.to(btnRef.current, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.5,
        ease: 'back.out(1.5)',
      });
    } else {
      gsap.to(btnRef.current, {
        scale: 0,
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }
  }, [isActive]);

  return (
    <button ref={btnRef} className={cn(styles['close-button-wrapper'])} onClick={onClick}>
      <div className={cn(styles['close-button-line'], styles['is-cl-1'])}></div>
      <div className={cn(styles['close-button-line'], styles['is-cl-2'])}></div>
    </button>
  );
}
