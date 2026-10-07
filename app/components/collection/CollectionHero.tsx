import {useRef} from 'react';
import {SCENTS, type ScentId} from '~/content/product-page';
import {useHeroLean} from '~/lib/motion/hero-planes';
import {cn} from '~/utils/cn';
import styles from './CollectionHero.module.css';

/** The fanned cluster, back to front: depth decides blur, size and pointer lean. */
const CLUSTER: {id: ScentId; slot: string; depth: 'far' | 'mid' | 'near'}[] = [
  {id: 'rosemary', slot: 'a', depth: 'far'},
  {id: 'lemongrass', slot: 'b', depth: 'far'},
  {id: 'eucalyptus', slot: 'c', depth: 'mid'},
  {id: 'lavender', slot: 'd', depth: 'near'},
];
const LEAN = {far: 8, mid: 18, near: 32};

/** Collections made of the four bars get the cluster; anything else keeps a plain header. */
const BAR_COLLECTIONS = new Set(['frontpage', 'variety-pack']);

const BAND = [
  'Lavender',
  'Lemongrass',
  'Eucalyptus',
  'Rosemary Sea Salt',
  'Goat milk',
  'Essential oils',
  'Cut by hand',
];

interface CollectionHeroProps {
  handle: string;
  title: string;
  description: string;
}

/**
 * One real heading for every collection. The shop-all collection gets the
 * brand line; any other collection gets its own Shopify title and description.
 * The word band underneath is decoration only, so it is hidden from assistive tech.
 */
export function CollectionHero({handle, title, description}: CollectionHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const isShopAll = handle === 'frontpage';
  useHeroLean(ref, LEAN);

  return (
    <header ref={ref} className={styles['hero']}>
      {BAR_COLLECTIONS.has(handle) && (
        <div className={styles['cluster']} aria-hidden="true">
          {CLUSTER.map((bar) => (
            <div key={bar.id} data-lean={bar.depth} className={cn(styles['bar'], styles[`bar-${bar.slot}`])}>
              <img
                src={SCENTS[bar.id].bar}
                alt=""
                width={1000}
                height={1000}
                className={styles['bar-img']}
                style={{rotate: `${SCENTS[bar.id].barRot}deg`}}
              />
            </div>
          ))}
        </div>
      )}

      <h1 className={styles['title']}>
        {isShopAll ? (
          <>
            <span>Four bars.</span>
            <span className={styles['sticker']}>Zero added fragrance.</span>
          </>
        ) : (
          <span>{title}</span>
        )}
      </h1>

      <p className={styles['lede']}>
        {isShopAll
          ? 'Goat milk, essential oils, poured as a loaf and cut by hand. Same gentle bar, four moods. Pick yours.'
          : description}
      </p>

      <div className={styles['band']} aria-hidden="true">
        <div className={styles['band-track']}>
          {[0, 1].map((copy) => (
            <span key={copy} className={styles['band-copy']}>
              {BAND.map((word) => (
                <span key={word} className={styles['band-word']}>
                  {word}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
