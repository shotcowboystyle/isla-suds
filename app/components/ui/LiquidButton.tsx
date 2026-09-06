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
    const fallbackId = useId();
    const navigate = useNavigate();

    return (
      <div
        ref={ref}
        id={id ?? fallbackId}
        className={`${styles['liquid-button-wrapper']} ${className || ''}`}
        style={backgroundColor ? ({'--button-bg': backgroundColor} as React.CSSProperties) : undefined}
      >
        <button className={styles['liquid-button']} onClick={href ? () => void navigate(href) : undefined} {...props}>
          <div className={styles['liquid-button-bg']}>
            <span className={styles['button-text']}>{text}</span>
          </div>
        </button>
      </div>
    );
  },
);

LiquidButton.displayName = 'LiquidButton';

export {LiquidButton};
