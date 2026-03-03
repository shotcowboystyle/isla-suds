import {PRODUCT_USE} from '~/content/products';
// import {cn} from '~/utils/cn';
import styles from './ProductBenefitsUse.module.css';

export function ProductBenefitsUse() {
  return (
    <section className={styles['section-wrapper']}>
      <div className={styles.container}>
        <div className={styles.block}>
          <div className={styles.content}>
            <div className={styles['text-content']}>
              <h2 className={styles['text-content-heading-h2']}>When to Use</h2>

              {PRODUCT_USE.map((item) => (
                <>
                  <h4 className={styles['text-content-heading-h4']}>{item.title}</h4>
                  <p className={styles['text-content-text']}>{item.description}</p>
                </>
              ))}

              <h4 className={styles['text-content-heading-h4']}>Our advice</h4>

              <p className={styles['text-content-text']}>
                When theres dirt, theres germs. When theres germs, theres Isla Suds.
              </p>
            </div>
          </div>

          <div className={styles['visual-container']}>
            {/* <picture className={styles.visual}>
              <source
                data-srcset="https://www.leroux.com/wp-content/uploads/2023/07/madeinfrance.webp 100w"
                type="image/webp"
                srcSet="https://www.leroux.com/wp-content/uploads/2023/07/madeinfrance.webp 100w"
              />

              <img
                className="img-fluid ls-is-cached lazyloaded"
                data-src="https://www.leroux.com/wp-content/uploads/2023/07/madeinfrance.jpg"
                alt=""
                src="https://www.leroux.com/wp-content/uploads/2023/07/madeinfrance.jpg"
              />
            </picture> */}

            <div className="visual__phldr"></div>
          </div>
        </div>

        <div className={styles.block}>
          <div className={styles.content}>
            <div className={styles['text-content']}>
              <h4 className={styles['text-content-heading-h4']}>Weight</h4>

              <p className={styles['text-content-text']}>100 g</p>

              <h4 className={styles['text-content-heading-h4']}>Ingredients</h4>

              <p className={styles['text-content-text']}>
                Soluble chicory*: 60%.
                <br />
                Soluble coffee*: 40%.
              </p>

              <p className={styles['text-content-text']}>
                *chicory grown in France, coffee from non-EU countries, grown according to organic farming principles.
              </p>

              <h4 className={styles['text-content-heading-h4']}>Nutritional values</h4>

              <p className={styles['text-content-text']}>For 100g/ 100ml</p>

              <p className={styles['text-content-text']}>
                Energy: 349kcal / 1470kJ
                <br />
                Fat: &lt; 0.5g of which saturated fatty acids: &lt;0.1g Carbohydrates: 65g of which sugars*: 32g Fiber:
                22g Protein: 10g Salt*: 0.36g *Naturally occurring sugars and salt
              </p>

              <h4 className={styles['text-content-heading-h4']}>Conservation</h4>

              <p className={styles['text-content-text']}>
                To guarantee optimal consumption of our organic soluble chicory coffee, we recommend that you consume
                your jar within one month of opening. Remember to keep it in a dry place and close the lid tightly.
              </p>
            </div>
          </div>

          <div className={styles['visual-container']}>
            {/* <picture className={styles.visual}>
              <source
                data-srcset="https://www.leroux.com/wp-content/uploads/2023/07/origine-sources.webp 100w"
                type="image/webp"
                srcSet="https://www.leroux.com/wp-content/uploads/2023/07/origine-sources.webp 100w"
              />

              <img
                className="img-fluid lazyloaded"
                data-src="https://www.leroux.com/wp-content/uploads/2023/07/origine-sources.jpg"
                alt=""
                src="https://www.leroux.com/wp-content/uploads/2023/07/origine-sources.jpg"
              />
            </picture> */}

            <div className="visual__phldr"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
