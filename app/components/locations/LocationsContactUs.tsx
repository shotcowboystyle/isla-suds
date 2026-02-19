import styles from './LocationsContactUs.module.css';

export function LocationsContactUs() {
  return (
    <div className={styles['find-us-wrapper']}>
      <div className={styles['content-wrapper']}>
        <div className={styles['heading-wrapper']}>
          <h1 className={styles['heading-text']}>Can&apos;t find us</h1>

          <div className="near_div-block-for-mask">
            <img
              src="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66fabb6b9a2b94647110effc_Near%20you.svg"
              loading="lazy"
              width="Auto"
              alt=""
              className="near_you"
            />
          </div>

          <div className={styles['paragraph-wrapper']}>
            <p className={styles['paragraph-text']}>
              Spylt is now available at thousands of grocery stores around the country, but there are thousands more
              that we&apos;d love to be in.
            </p>

            <a href="/contact-us" className="liquid-button-true transperent w-button">
              contact us
            </a>
          </div>
        </div>
      </div>

      <img
        src="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66faba93d742c0f551290f34_pic.webp"
        loading="lazy"
        sizes="100vw"
        srcSet="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66faba93d742c0f551290f34_pic-p-500.webp 500w, https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66faba93d742c0f551290f34_pic-p-800.webp 800w, https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66faba93d742c0f551290f34_pic-p-1080.webp 1080w, https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66faba93d742c0f551290f34_pic-p-1600.webp 1600w, https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66faba93d742c0f551290f34_pic-p-2000.webp 2000w, https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66faba93d742c0f551290f34_pic-p-2600.webp 2600w, https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66faba93d742c0f551290f34_pic.webp 2760w"
        alt=""
        className="image-25"
      />
    </div>
  );
}
