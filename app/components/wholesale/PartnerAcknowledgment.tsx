import {wholesaleContent} from '~/content/wholesale';
import {cn} from '~/utils/cn';

interface PartnerAcknowledgmentProps {
  partnerName: string;
  storeCount: number;
}

export function PartnerAcknowledgment({
  partnerName,
  storeCount,
}: PartnerAcknowledgmentProps) {
  const message = wholesaleContent.dashboard.acknowledgmentTemplate(
    partnerName,
    storeCount,
  );

  return (
    <div
      className={cn(
        'mb-8 rounded-lg bg-canvas-elevated p-6',
        'border border-gray-200',
      )}
    >
      <p className={cn('text-lg text-text-primary')}>{message}</p>
    </div>
  );
}
