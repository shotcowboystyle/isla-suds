import {useEffect, useState} from 'react';
import {cn} from '~/utils/cn';

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  productName: string;
  disabled?: boolean;
}

export function QuantitySelector({
  value,
  onChange,
  productName,
  disabled = false,
}: QuantitySelectorProps) {
  const [displayValue, setDisplayValue] = useState(String(value));

  useEffect(() => {
    setDisplayValue(String(value));
  }, [value]);

  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    if (raw === '') {
      onChange(0);
    } else {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        onChange(parsed);
      }
    }
  };

  const isDecrementDisabled = disabled || value === 0;

  return (
    <div
      role="group"
      aria-label={`Quantity for ${productName}`}
      className={cn('flex items-center gap-2')}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
        aria-label={`Decrease quantity of ${productName}`}
        className={cn(
          'flex h-11 w-11 items-center justify-center',
          'rounded-md border border-[--text-muted]/20',
          'text-lg text-[--text-primary] transition-colors',
          isDecrementDisabled
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer hover:bg-[--canvas-elevated]',
        )}
      >
        −
      </button>

      <input
        type="number"
        value={displayValue}
        onChange={handleInputChange}
        disabled={disabled}
        min={0}
        aria-label={`Quantity of ${productName}`}
        className={cn(
          'h-11 w-16 rounded-md border border-[--text-muted]/20',
          'bg-[--canvas-base] text-center text-[--text-primary]',
          'disabled:cursor-not-allowed disabled:opacity-40',
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        )}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled}
        aria-label={`Increase quantity of ${productName}`}
        className={cn(
          'flex h-11 w-11 items-center justify-center',
          'rounded-md border border-[--text-muted]/20',
          'text-lg text-[--text-primary] transition-colors',
          disabled
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer hover:bg-[--canvas-elevated]',
        )}
      >
        +
      </button>
    </div>
  );
}
