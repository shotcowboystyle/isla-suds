import {Image, Money} from '@shopify/hydrogen';
import {wholesaleContent} from '~/content/wholesale';
import {cn} from '~/utils/cn';
import type {WholesaleProductFieldsFragment} from 'storefrontapi.generated';
import {QuantitySelector} from './QuantitySelector';

type WholesaleVariant = WholesaleProductFieldsFragment['variants']['nodes'][0];

export interface OrderProductCardProps {
  product: Omit<WholesaleProductFieldsFragment, 'variants'> & {
    variant: WholesaleVariant;
  };
  quantity: number;
  onQuantityChange: (variantId: string, quantity: number) => void;
}

export function OrderProductCard({product, quantity, onQuantityChange}: OrderProductCardProps) {
  const {title, featuredImage, variant} = product;
  const isDisabled = !variant.availableForSale;

  return (
    <article
      className={cn(
        'flex flex-col gap-4',
        'rounded-lg border border-[--text-muted]/20',
        'bg-canvas-elevated p-4',
      )}
      aria-label={title}
    >
      <div className={cn('aspect-square overflow-hidden rounded-md bg-canvas-base')}>
        {featuredImage ? (
          <Image
            data={featuredImage}
            aspectRatio="1/1"
            className={cn('h-full w-full object-cover')}
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className={cn('h-full w-full')} aria-hidden="true" />
        )}
      </div>

      <div className={cn('flex flex-col gap-1')}>
        <h2 className={cn('text-base font-medium text-[--text-primary]')}>{title}</h2>
        <p className={cn('text-sm text-[--text-muted]')}>
          <Money data={variant.price} /> {wholesaleContent.order.pricePerUnit}
        </p>
      </div>

      <QuantitySelector
        value={quantity}
        onChange={(qty) => onQuantityChange(variant.id, qty)}
        productName={title}
        disabled={isDisabled}
      />
    </article>
  );
}
