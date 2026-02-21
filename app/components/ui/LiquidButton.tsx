import {forwardRef, useId} from 'react';
import {useNavigate} from 'react-router';
import styles from './LiquidButton.module.css';

export interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  text: string;
  backgroundColor?: string;
}

const LiquidButton = forwardRef<HTMLDivElement, LiquidButtonProps>(
  ({id, href, text, className, backgroundColor, ...props}, ref) => {
    const liquidFilterId = useId();
    const navigate = useNavigate();

    return (
      <div
        ref={ref}
        id={id ?? liquidFilterId}
        className={`${styles['liquid-button-wrapper']} ${className || ''}`}
        style={backgroundColor ? ({'--button-bg': backgroundColor} as React.CSSProperties) : undefined}
      >
        <button className={styles['liquid-button']} onClick={href ? () => void navigate(href) : undefined} {...props}>
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
  },
);

LiquidButton.displayName = 'LiquidButton';

export {LiquidButton};
