import {Link} from 'react-router';
import ShelfPlate from '~/assets/images/product/shelf.webp';
import {SCENTS, SCENT_IDS, type ScentId} from '~/content/product-page';
import {cn} from '~/utils/cn';
import {Dock} from './Dock';
import styles from './Shelf.module.css';

/** The bar slides into its own spot on a shelf with the other three. */
export function Shelf({current}: {current: ScentId}) {
  return (
    <section className={styles['section']} aria-labelledby="shelf-title">
      <h2 id="shelf-title" className={styles['title']}>
        It has siblings
      </h2>

      <div className={styles['shelf']}>
        <img src={ShelfPlate} alt="" width={2400} height={1333} loading="lazy" className={styles['plate']} />
        {SCENT_IDS.map((id, index) =>
          id === current ? (
            <Dock
              key={id}
              id="shelf"
              rot={-6}
              src={SCENTS[id].bar}
              className={cn(styles['slot'], styles[`slot-${index}`])}
            />
          ) : (
            <img
              key={id}
              src={SCENTS[id].bar}
              alt=""
              width={1000}
              height={1000}
              loading="lazy"
              className={cn(styles['slot'], styles['sibling'], styles[`slot-${index}`])}
              style={{'--bar-rot': `${SCENTS[id].barRot}deg`} as React.CSSProperties}
            />
          ),
        )}
      </div>

      <ul className={styles['tags']}>
        {SCENT_IDS.map((id) => (
          <li key={id}>
            {id === current ? (
              <span className={cn(styles['tag'], styles['is-current'])} aria-current="page">
                {SCENTS[id].name}
                <small>You&apos;re looking at it</small>
              </span>
            ) : (
              <Link to={`/products/${SCENTS[id].handle}`} prefetch="intent" className={styles['tag']}>
                {SCENTS[id].name}
                <small>Meet this one</small>
              </Link>
            )}
          </li>
        ))}
      </ul>

      <p className={styles['all']}>
        Can&apos;t pick? <Link to="/collections/variety-pack">Get all four</Link>
      </p>
    </section>
  );
}
