import CratePhoto from '~/assets/images/partners/crate-display.webp';
import {BAR_FACTS, splitDescription, type Scent} from '~/content/product-page';
import styles from './Crafted.module.css';
import {Dock} from './Dock';

interface CraftedProps {
  scent: Scent;
  description: string;
}

/** Where the bar came from: it lands beside the loaf it was cut from. */
export function Crafted({scent, description}: CraftedProps) {
  const {lede, rest} = splitDescription(description);

  return (
    <section className={styles['section']} aria-labelledby="crafted-title">
      <div className={styles['board']}>
        <img
          src={scent.cut}
          alt={`A whole ${scent.name} soap loaf on a cutting board, sliced into bars`}
          width={2000}
          height={1111}
          loading="lazy"
          className={styles['board-img']}
        />
        <Dock id="cut" rot={14} src={scent.bar} className={styles['dock']} />
      </div>

      <div className={styles['copy']}>
        <h2 id="crafted-title" className={styles['title']}>
          <span>Poured as a loaf.</span>
          <span className={styles['sticker']}>Cut by hand.</span>
        </h2>
        <p className={styles['body']}>
          Every bar starts as one big loaf of goat milk soap, made in small batches from our family recipe, then sliced
          into {BAR_FACTS.weight} bars and wrapped one at a time.
        </p>
        {lede && <p className={styles['description']}>{lede}</p>}
        {rest && (
          <details className={styles['more']}>
            <summary>Read the full description</summary>
            <p>{rest}</p>
          </details>
        )}

        <figure className={styles['proof']}>
          <img
            src={CratePhoto}
            alt="Real Isla Suds bars in a wooden display crate, whole loaves standing behind them"
            width={1600}
            height={1200}
            loading="lazy"
          />
          <figcaption>The real ones, loaves and all.</figcaption>
        </figure>
      </div>
    </section>
  );
}
