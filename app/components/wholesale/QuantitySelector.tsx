import {useEffect, useState} from 'react';
import {wholesaleContent} from '~/content/wholesale';
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
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setDisplayValue(String(value));
    // Clear error immediately when value becomes valid externally (e.g. parent resets)
    if (value === 0 || value >= 6) {
      setIsInvalid(false);
    }
  }, [value]);

  const handleDecrement = () => {
    if (value > 0) {
      const newValue = value - 1;
      onChange(newValue);
      if (isInvalid && (newValue === 0 || newValue >= 6)) {
        setIsInvalid(false);
      }
    }
  };

  const handleIncrement = () => {
    const newValue = value + 1;
    onChange(newValue);
    if (isInvalid && newValue >= 6) {
      setIsInvalid(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    if (raw === '') {
      onChange(0);
      if (isInvalid) setIsInvalid(false);
    } else {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        onChange(parsed);
        if (isInvalid && (parsed === 0 || parsed >= 6)) {
          setIsInvalid(false);
        }
      }
    }
  };

  const handleBlur = () => {
    if (value > 0 && value < 6) {
      setIsInvalid(true);
    }
  };

  const isDecrementDisabled = disabled || value === 0;

  return (
    <div
      role="group"
      aria-label={`Quantity for ${productName}`}
      aria-disabled={disabled}
      className={cn('flex flex-col gap-1')}
    >
      <div className={cn('flex items-center gap-2')}>
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
          onBlur={handleBlur}
          disabled={disabled}
          min={0}
          aria-label={`Quantity of ${productName}`}
          aria-invalid={isInvalid}
          className={cn(
            'h-11 w-16 rounded-md border',
            isInvalid ? 'border-red-500' : 'border-[--text-muted]/20',
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

      <div aria-live="polite" role="status" className={cn('min-h-[1.25rem]')}>
        {isInvalid && (
          <p className={cn('text-xs text-red-500')}>{wholesaleContent.order.moqError}</p>
        )}
      </div>
    </div>
  );
}
