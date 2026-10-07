import {getAdjacentAndFirstAvailableVariants, useOptimisticVariant} from '@shopify/hydrogen';
import {BuyClose} from '~/components/product/page/BuyClose';
import {Crafted} from '~/components/product/page/Crafted';
import {Hero} from '~/components/product/page/Hero';
import {Inside} from '~/components/product/page/Inside';
import {Lather} from '~/components/product/page/Lather';
import {Shelf} from '~/components/product/page/Shelf';
import {StickyBuy} from '~/components/product/page/StickyBuy';
import {Traveler} from '~/components/product/page/Traveler';
import {SCENTS, scentForHandle} from '~/content/product-page';
import {formatMoney} from '~/utils/format-money';
import type {ProductFragment} from 'storefrontapi.generated';

interface ProductLandingPageProps {
  product: ProductFragment;
}

/**
 * One bar, one trip down the page. Each act has a dock; the `Traveler` flies
 * the bar from dock to dock (scent world, cutting board, ingredients, tap,
 * shelf, buy box), which is what joins the acts together.
 */
export function ProductLandingPage({product}: ProductLandingPageProps) {
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const scentId = scentForHandle(product.handle);
  const scent = SCENTS[scentId];
  const money = selectedVariant?.price ?? product.selectedOrFirstAvailableVariant?.price;
  const price = money ? formatMoney(money.amount, money.currencyCode) : '';

  return (
    // `contents`: no box of its own, it only carries the bar's base rotation down to every dock.
    <div className="contents" style={{'--bar-rot': `${scent.barRot}deg`} as React.CSSProperties}>
      <Hero scent={scent} title={product.title} price={price} selectedVariant={selectedVariant} />
      <Crafted scent={scent} description={product.description} />
      <Inside scent={scent} />
      <Lather scent={scent} />
      <Shelf current={scentId} />
      <BuyClose scent={scent} price={price} selectedVariant={selectedVariant} />
      <Traveler key={scentId} src={scent.bar} baseRot={scent.barRot} handle={product.handle} />
      <StickyBuy scent={scent} price={price} selectedVariant={selectedVariant} />
    </div>
  );
}
