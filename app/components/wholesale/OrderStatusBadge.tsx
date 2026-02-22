import {cn} from '~/utils/cn';

const STATUS_LABELS: Record<string, string> = {
  FULFILLED: 'Fulfilled',
  UNFULFILLED: 'Processing',
  PARTIALLY_FULFILLED: 'Partially Fulfilled',
  SCHEDULED: 'Scheduled',
};

function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}

export function OrderStatusBadge({status}: {status: string}) {
  const label = getStatusLabel(status);
  const variant = status === 'FULFILLED' ? 'success' : 'default';

  return (
    <span
      className={cn(
        'inline-block px-3 py-1 rounded-full text-sm',
        variant === 'success'
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800',
      )}
    >
      {label}
    </span>
  );
}
