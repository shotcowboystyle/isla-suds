import type {MoneyV2} from '~/types/wholesale';

/**
 * Format money for display with proper internationalization.
 *
 * Overloaded:
 *  - formatMoney(money: MoneyV2): string
 *  - formatMoney(amount: string, currencyCode: string, locale?: string): string
 */
export function formatMoney(money: MoneyV2): string;
export function formatMoney(
  amount: string,
  currencyCode: string,
  locale?: string,
): string;
export function formatMoney(
  amountOrMoney: string | MoneyV2,
  currencyCode?: string,
  locale?: string,
): string {
  const amount =
    typeof amountOrMoney === 'string'
      ? amountOrMoney
      : amountOrMoney.amount;
  const currency =
    typeof amountOrMoney === 'string'
      ? currencyCode!
      : amountOrMoney.currencyCode;

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return amount;
  }

  try {
    return new Intl.NumberFormat(locale ?? 'en-US', {
      style: 'currency',
      currency,
    }).format(numericAmount);
  } catch {
    // Fallback to simple formatting if Intl throws (e.g., invalid currency code)
    return `${amount} ${currency}`;
  }
}

/**
 * Get full currency label for accessibility (screen readers).
 * Example: {amount: "150.00", currencyCode: "USD"} -> "150.00 US dollars"
 */
export function getCurrencyLabel(money: MoneyV2): string {
  const amount = parseFloat(money.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
    currencyDisplay: 'name',
  }).format(amount);
}
