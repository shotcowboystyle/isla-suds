/**
 * Format order date for display
 *
 * Converts ISO date string to human-readable format.
 * Example: "2026-01-15T10:30:00Z" → "January 15, 2026"
 *
 * Story: 7.7 - Extracted from duplicate implementations
 */

export function formatOrderDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
