import {useId, useState, type CSSProperties, type ReactNode} from 'react';
import {cn} from '~/utils/cn';
import styles from './Postcard.module.css';

interface PostcardProps {
  /** The goat's handwritten note on the left half. */
  note: string;
  /** Who it's addressed to, as the card's heading. */
  heading: ReactNode;
  /** The address lines under the heading. */
  children: ReactNode;
  stamp: {src: string; width?: number; height?: number; background: string};
  /** Ring text of the postmark (the town), and its centre line. */
  postmark: {ring: string; centre?: string};
  /** The picture side. Without one, the card can't flip. */
  picture?: {src: string; greetings: string; town: string; flip: string; flipBack: string};
  /** Buttons and links under the card. */
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * A postcard, address side up: the goat's note on the left; the stamp, postmark
 * and address on the right. With a `picture` a second card peeks out behind it,
 * and the card flips over to its "Greetings from" side.
 */
export function Postcard({
  note,
  heading,
  children,
  stamp,
  postmark,
  picture,
  actions,
  className,
  style,
}: PostcardProps) {
  const [flipped, setFlipped] = useState(false);
  // useId's colons would need escaping inside the SVG href.
  const id = useId().replace(/:/g, '');

  return (
    <article className={cn(styles.postcard, className)} style={style} aria-labelledby={`${id}-heading`}>
      <div className={styles.stack}>
        {picture && (
          <div className={styles.peek} aria-hidden="true">
            <img src={picture.src} alt="" width={1200} height={800} loading="lazy" decoding="async" />
          </div>
        )}

        <div className={styles.flipper} data-flipped={flipped || undefined}>
          <div className={styles.address}>
            <p className={styles.note}>{note}</p>

            <div className={styles.right}>
              <span
                className={styles.stamp}
                style={{'--stamp-bg': stamp.background} as CSSProperties}
                aria-hidden="true"
              >
                <img src={stamp.src} alt="" width={stamp.width} height={stamp.height} loading="lazy" decoding="async" />
              </span>
              <svg className={styles.postmark} viewBox="0 0 200 100" aria-hidden="true">
                <defs>
                  <path id={`${id}-ring`} d="M 12,50 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <circle cx="50" cy="50" r="46" />
                <circle cx="50" cy="50" r="31" />
                <text className={styles['postmark-ring']}>
                  <textPath href={`#${id}-ring`} startOffset="50%" textAnchor="middle">
                    {postmark.ring}
                  </textPath>
                </text>
                {postmark.centre && (
                  <text x="50" y="54" textAnchor="middle" className={styles['postmark-centre']}>
                    {postmark.centre}
                  </text>
                )}
                <path
                  className={styles.waves}
                  d="M 98,34 q 12,-6 24,0 t 24,0 t 24,0 t 24,0 M 98,50 q 12,-6 24,0 t 24,0 t 24,0 t 24,0 M 98,66 q 12,-6 24,0 t 24,0 t 24,0 t 24,0"
                />
              </svg>

              <h3 id={`${id}-heading`} className={styles.to}>
                {heading}
              </h3>
              <div className={styles.lines}>{children}</div>
            </div>
          </div>

          {picture && (
            <div className={styles.picture} aria-hidden="true">
              <img src={picture.src} alt="" width={1200} height={800} loading="lazy" decoding="async" />
              <p className={styles.greetings}>
                <span>{picture.greetings}</span>
                <strong>{picture.town}</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {(actions || picture) && (
        <div className={styles.actions}>
          {actions}
          {picture && (
            <button type="button" onClick={() => setFlipped((f) => !f)} className={styles.flip}>
              {flipped ? picture.flipBack : picture.flip}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
