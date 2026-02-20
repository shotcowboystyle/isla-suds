import {cn} from '~/utils/cn';
import styles from './IntroSection.module.css';

export function IntroSection() {
  return (
    <section className={cn(styles['section-wrapper'])}>
      <img
        src="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66f1347d5d8229bf6480d266_Image-1.webp"
        loading="eager"
        width="531"
        sizes="(max-width: 767px) 100vw, 531px"
        alt=""
        srcSet="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66f1347d5d8229bf6480d266_Image-1-p-500.webp 500w, https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66f1347d5d8229bf6480d266_Image-1-p-800.webp 800w, https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66f1347d5d8229bf6480d266_Image-1.webp 1062w"
        className={styles['background-image-1']}
      />
      <img
        src="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66f1347d9d8e9af0306accdf_Image-2.webp"
        loading="eager"
        width="517"
        sizes="(max-width: 767px) 100vw, 517px"
        alt=""
        srcSet="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66f1347d9d8e9af0306accdf_Image-2-p-500.webp 500w, https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66f1347d9d8e9af0306accdf_Image-2-p-800.webp 800w, https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66f1347d9d8e9af0306accdf_Image-2.webp 1034w"
        className={styles['background-image-2']}
      />

      <div className={cn(styles['section-start-wrapper'])}>
        <h2 className={styles['heading-caption']}>ADD SOME SUDS TO YOUR SHELVES</h2>

        <p className={cn(styles['content-title'])}>
          Become a retailer/wholesaler and clean up on this lucrative market, offering a product that stands out for
          freshness and functionality.
        </p>
      </div>

      <div className={cn(styles['section-end-wrapper'])}>
        <p className={cn(styles['section-end-text'])}>
          Searching for a soap that stands out? Look no further. Isla Suds brings the finest ingredients and freshest
          scents to your customers. It&apos;s time to upgrade your inventory with a brand that people truly love.
        </p>
      </div>
    </section>
  );
}
