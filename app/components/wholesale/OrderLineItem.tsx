import {cn} from '~/utils/cn';

interface OrderLineItemProps {
  item: {
    title: string;
    quantity: number;
    variant?: {
      title: string;
    } | null;
  };
}

export function OrderLineItem({item}: OrderLineItemProps) {
  const displayTitle = item.variant?.title
    ? `${item.title} - ${item.variant.title}`
    : item.title;

  return (
    <p className={cn('text-text-primary')}>
      {item.quantity}x {displayTitle}
    </p>
  );
}
