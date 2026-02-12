import styles from './LocalStores.module.css';
import StoreMap from '../../assets/images/store-map.svg';
import {LiquidButton} from '../ui/LiquidButton';

export function LocalStores() {
  return (
    <div className={styles['map-section-wrapper']}>
      <div className={styles['map-section-inner']}>
        <div className={styles['map-section-info']}>
          <div className={styles['heading-wrapper']}>
            <div id="heading-text-1" className={styles['heading-text']}>
              Right Around
            </div>
          </div>

          <div className={styles['clipped-text-box']}>
            <div className={styles['clipped-text']}>the corner</div>
          </div>

          <div className={styles['paragraph-text-wrapper']}>
            <p className={styles['paragraph-text']}>
              Buy our drinks at your local store or get them delivered (to your door).
            </p>

            <LiquidButton href="/products" text="Find a Store" />
          </div>
        </div>

        <img src={StoreMap} loading="lazy" width="1840" alt="Store Map" className={styles['background-image']} />
      </div>
    </div>
  );
}
