/**
 * Format money amount with currency using Intl.NumberFormat
 *
 * Uses the runtime's locale (or provided override) and Shopify MoneyV2 data
 * to produce a properly localized currency string.
 *
 * @param amount - The numeric amount as a string
 * @param currencyCode - ISO 4217 currency code (USD, EUR, GBP, etc.)
 * @param locale - Optional BCP 47 locale tag (falls back to runtime default)
 * @returns Formatted price string with currency symbol (e.g., "$12.00", "€10.50")
 */
export function formatMoney(
  amount: string,
  currencyCode: string,
  locale?: string,
): string {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return amount;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(numericAmount);
  } catch {
    // Fallback to simple formatting if Intl throws (e.g., invalid currency code)
    return `${amount} ${currencyCode}`;
  }
}
