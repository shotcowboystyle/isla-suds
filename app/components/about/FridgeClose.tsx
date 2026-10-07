import {Link} from 'react-router';
import FridgeMobile from '~/assets/images/about/fridge-m.webp';
import Fridge from '~/assets/images/about/fridge.webp';
import Magnet from '~/assets/images/about/magnet.webp';
import {ABOUT_PAGE} from '~/content/about';
import {cn} from '~/utils/cn';
import styles from './FridgeClose.module.css';
import {RecipeCardFace} from './RecipeCard';

/**
 * Act 6: the close. The finished card, stamped, goes where every family keeps
 * the important stuff: on the fridge, under a goat magnet.
 */
export function FridgeClose() {
  const {close} = ABOUT_PAGE;

  return (
    <section className={styles['close']} aria-labelledby="close-title">
      <picture className={styles['plate']}>
        <source media="(max-width: 767px)" srcSet={FridgeMobile} width={1100} height={1530} />
        <img src={Fridge} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
      </picture>

      <div className={styles['inner']}>
        {/* The same card as act 2, so it is decorative here. */}
        <div className={styles['pinned']} aria-hidden="true">
          <RecipeCardFace stamped className={styles['card']} />
          <img src={Magnet} alt="" width={500} height={435} loading="lazy" className={styles['magnet']} />
        </div>

        <div className={styles['copy']}>
          <h2 id="close-title" className={styles['heading']}>
            {close.heading} <span className={styles['stamp']}>{close.stamp}</span>
          </h2>
          <p className={styles['body']}>{close.body}</p>
          <div className={styles['actions']}>
            <Link to={close.primary.href} prefetch="intent" className={cn(styles['cta'], styles['cta-primary'])}>
              {close.primary.label}
            </Link>
            <Link to={close.secondary.href} prefetch="intent" className={cn(styles['cta'], styles['cta-secondary'])}>
              {close.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
