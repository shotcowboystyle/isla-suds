import {Picture} from '../Picture';
import styles from './ProductsListCard.module.css';
import type {ImageData} from '@responsive-image/core';

interface ProductsListCardProps {
  productName: string;
  productImageUrl: ImageData;
  toUrl: string;
  bgUrl: ImageData;
  particlesUrl: ImageData;
  rotation: string;
}

export const ProductsListCard = ({
  bgUrl,
  productImageUrl,
  toUrl,
  particlesUrl,
  rotation,
  productName,
}: ProductsListCardProps) => {
  return (
    <div role="listitem" className={styles['collection-item']}>
      <a href={toUrl} className={styles['card']}>
        <Picture loading="lazy" src={bgUrl} alt="background" className={styles['card-background']} />
        <Picture loading="lazy" src={productImageUrl} alt={productName} className={styles['card-soap-bar']} />
        <Picture loading="lazy" src={particlesUrl} alt="particles" className={styles['card-additional']} />
        <div className={styles['card-heading']}>{productName}</div>
      </a>
    </div>
  );
};
