import {cn} from '~/utils/cn';
import styles from './Dock.module.css';
import type {CSSProperties} from 'react';

interface DockProps {
  /** Unique per page; the traveler visits docks in DOM order. */
  id: string;
  /** The bar's rotation when it sits here, in degrees. */
  rot?: number;
  /** Shown only when the traveler isn't running (reduced motion), so every act still has its bar. */
  src?: string;
  className?: string;
  style?: CSSProperties;
}

/** A place the traveling bar lands. See `Traveler`. */
export function Dock({id, rot = 0, src, className, style}: DockProps) {
  return (
    <div data-dock={id} data-dock-rot={rot} className={cn(styles['dock'], className)} style={style} aria-hidden="true">
      {src && (
        <img
          src={src}
          alt=""
          width={1000}
          height={1000}
          loading="lazy"
          decoding="async"
          className={styles['img']}
          style={{rotate: `calc(var(--bar-rot, 0deg) + ${rot}deg)`}}
        />
      )}
    </div>
  );
}
