import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import BrownBgImage from '~/assets/images/brown-bg.png?responsive';
import LavenderElementsImage from '~/assets/images/lavender-elements.webp?responsive';
import {Picture} from '~/components/Picture';
import {useVariantUrl} from '~/lib/variant-url';
import {cn} from '~/utils/cn';
import styles from './ProductItem.module.css';
import type {ProductItemFragment, CollectionItemFragment, RecommendedProductFragment} from 'storefrontapi.generated';

export function ProductItem({
  product,
  loading,
}: {
  product: CollectionItemFragment | ProductItemFragment | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <div className={cn(styles['product-wrapper'], 'relative h-full')}>
      <Link className={styles['product-item']} key={product.id} prefetch="intent" to={variantUrl}>
        <Picture
          // ref={backgroundRef}
          loading="lazy"
          src={BrownBgImage}
          alt="background"
          className={styles['product-background']}
        />

        <h4 className={styles['product-heading']}>{product.title}</h4>
        <small>
          <Money data={product.priceRange.minVariantPrice} />
        </small>

        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="5/3"
            data={image}
            loading={loading}
            className={styles['product-image']}
            // sizes="(min-width: 10em) 100px, 50vw"
          />
        )}

        <Picture
          // ref={elementsRef}
          loading="lazy"
          src={LavenderElementsImage}
          alt="elements"
          className={styles['product-elements']}
        />
      </Link>
    </div>
  );
}
