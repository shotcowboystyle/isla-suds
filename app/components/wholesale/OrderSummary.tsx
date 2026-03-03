import {Money} from '@shopify/hydrogen';
import {wholesaleContent} from '~/content/wholesale';
import {cn} from '~/utils/cn';
import type {WholesaleProductFieldsFragment} from 'storefrontapi.generated';

type WholesaleVariant = WholesaleProductFieldsFragment['variants']['nodes'][0];

type SummaryProduct = Omit<WholesaleProductFieldsFragment, 'variants'> & {
  variant: WholesaleVariant;
};

export interface OrderSummaryProps {
  products: SummaryProduct[];
  quantities: Record<string, number>;
  onCheckout: () => void;
  isLoading?: boolean;
}

export function OrderSummary({products, quantities, onCheckout, isLoading = false}: OrderSummaryProps) {
  const {summary} = wholesaleContent.order;

  const selectedItems = products
    .filter((p) => (quantities[p.variant.id] ?? 0) > 0)
    .map((p) => {
      const qty = quantities[p.variant.id];
      const lineAmount = (parseFloat(p.variant.price.amount) * qty).toFixed(2);
      return {
        id: p.id,
        title: p.title,
        quantity: qty,
        lineTotal: {
          amount: lineAmount,
          currencyCode: p.variant.price.currencyCode,
        },
      };
    });

  const subtotalMoney =
    selectedItems.length > 0
      ? {
          amount: selectedItems
            .reduce((sum, item) => sum + parseFloat(item.lineTotal.amount), 0)
            .toFixed(2),
          currencyCode: selectedItems[0].lineTotal.currencyCode,
        }
      : null;

  const hasInvalidQuantity = products.some((p) => {
    const qty = quantities[p.variant.id] ?? 0;
    return qty > 0 && qty < 6;
  });

  const hasAtLeastOneValidQuantity = products.some((p) => {
    const qty = quantities[p.variant.id] ?? 0;
    return qty >= 6;
  });

  const checkoutDisabled = hasInvalidQuantity || !hasAtLeastOneValidQuantity;

  return (
    <aside
      aria-label={summary.title}
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-[--text-muted]/20',
        'bg-[--canvas-elevated] p-6',
      )}
    >
      <h2 className={cn('text-base font-semibold text-[--text-primary]')}>{summary.title}</h2>

      {selectedItems.length === 0 ? (
        <p className={cn('text-sm text-[--text-muted]')}>{summary.emptyState}</p>
      ) : (
        <ul className={cn('flex flex-col gap-3')} aria-label="Selected items">
          {selectedItems.map((item) => (
            <li
              key={item.id}
              className={cn('flex items-baseline justify-between gap-2 text-sm')}
            >
              <span className={cn('text-[--text-primary]')}>
                {item.title}
                <span className={cn('ml-1 text-[--text-muted]')}>× {item.quantity}</span>
              </span>
              <span className={cn('shrink-0 text-[--text-primary]')}>
                <Money data={item.lineTotal} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {subtotalMoney && (
        <div
          className={cn(
            'flex items-center justify-between border-t border-[--text-muted]/20 pt-3',
          )}
        >
          <span className={cn('text-sm font-medium text-[--text-primary]')}>
            {summary.subtotalLabel}
          </span>
          <span className={cn('text-sm font-semibold text-[--text-primary]')}>
            <Money data={subtotalMoney} />
          </span>
        </div>
      )}

      <button
        type="button"
        disabled={checkoutDisabled || isLoading}
        onClick={onCheckout}
        className={cn(
          'mt-2 w-full rounded-md px-4 py-3',
          'bg-[--text-primary] text-sm font-medium text-[--canvas-base]',
          checkoutDisabled || isLoading ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        )}
      >
        {isLoading ? summary.checkoutButtonLoading : summary.checkoutButton}
      </button>
    </aside>
  );
}
