/**
 * Format currency for display with proper internationalization
 *
 * Uses Intl.NumberFormat to respect currency codes (USD, CAD, EUR, etc.)
 * Handles wholesale partners with different currencies.
 *
 * Story: 7.7 - Fix hardcoded $ symbol issue
 */

interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

/**
 * Format a MoneyV2 object as currency string
 * Example: {amount: "150.00", currencyCode: "USD"} → "$150.00"
 * Example: {amount: "150.00", currencyCode: "CAD"} → "CA$150.00"
 */
export function formatCurrency(money: MoneyV2): string {
  const amount = parseFloat(money.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(amount);
}

/**
 * Get full currency label for accessibility (screen readers)
 * Example: {amount: "150.00", currencyCode: "USD"} → "150.00 US dollars"
 */
export function getCurrencyLabel(money: MoneyV2): string {
  const amount = parseFloat(money.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
    currencyDisplay: 'name', // "US dollars" instead of "$"
  }).format(amount);
}
