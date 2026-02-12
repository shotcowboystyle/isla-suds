import {useId} from 'react';
import styles from './LiquidButton.module.css';

interface LiquidButtonProps {
  id?: string;
  href: string;
  text: string;
}

function LiquidButton({id, href, text}: LiquidButtonProps) {
  const liquidFilterId = useId();

  return (
    <div id={id ?? liquidFilterId} className={styles['liquid-button-wrapper']}>
      <button className={styles['liquid-button']}>
        <div className={styles['liquid-button-bg']}>
          <span className={styles['button-text']}>{text}</span>
        </div>

        <div className={styles['drops']}>
          <div className={styles['drop1']}></div>
          <div className={styles['drop2']}></div>
          <div className={styles['drop3']}></div>
        </div>
      </button>

      <svg xmlns="http://www.w3.org/2000/svg" className={styles['liquid-filter']}>
        <defs>
          <filter id="liquid">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="liquid"
            ></feColorMatrix>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export {LiquidButton};
