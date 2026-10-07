import {useId, useState} from 'react';
import {INGREDIENTS} from '~/content/ingredients';
import {cn} from '~/utils/cn';
import {Dock} from './Dock';
import styles from './Inside.module.css';
import type {Scent} from '~/content/product-page';

const BENEFITS = [
  'Gentle on sensitive skin',
  'Goat milk moisture',
  'Essential oils, no added fragrance',
  'Hands, face and body',
];

const OILS = INGREDIENTS.find((item) => /essential/i.test(item.name))?.id;

/** The bar parks in the middle of its ingredients; pick one to read about it. */
export function Inside({scent}: {scent: Scent}) {
  const [active, setActive] = useState(OILS ?? INGREDIENTS[0].id);
  const panelId = useId();
  const current = INGREDIENTS.find((item) => item.id === active) ?? INGREDIENTS[0];

  return (
    <section
      className={styles['section']}
      aria-labelledby="inside-title"
      style={{'--scent': scent.color} as React.CSSProperties}
    >
      <div className={styles['ring']} style={{'--count': INGREDIENTS.length} as React.CSSProperties}>
        <Dock id="inside" rot={0} src={scent.bar} className={styles['dock']} />
        <ul className={styles['chips']}>
          {INGREDIENTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className={styles['slot']} style={{'--i': index} as React.CSSProperties}>
                <button
                  type="button"
                  aria-expanded={item.id === active}
                  aria-controls={panelId}
                  onClick={() => setActive(item.id)}
                  className={cn(styles['chip'], item.id === active && styles['is-active'])}
                >
                  <Icon aria-hidden="true" className={styles['chip-icon']} strokeWidth={1.75} />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles['copy']}>
        <h2 id="inside-title" className={styles['title']}>
          Seven ingredients. <span className={styles['aside']}>You can pronounce all of them.</span>
        </h2>

        <div id={panelId} role="region" aria-live="polite" aria-label={current.name} className={styles['panel']}>
          <h3 className={styles['panel-title']}>{current.name}</h3>
          <p className={styles['panel-body']}>{current.description}</p>
          {current.id === OILS && (
            <p className={styles['panel-note']}>In this bar: {scent.oil}. No added fragrance, ever.</p>
          )}
        </div>

        <ul className={styles['benefits']}>
          {BENEFITS.map((benefit) => (
            <li key={benefit} className={styles['benefit']}>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
