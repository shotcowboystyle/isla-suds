/**
 * Scent narrative copy for product reveals
 *
 * This file provides fallback scent narratives for products when
 * Shopify metafields are not configured. Narratives should be evocative
 * and sensory to help visitors imagine the scent experience.
 */

/**
 * Map of product handles to scent narrative copy
 */
export const SCENT_NARRATIVES: Record<string, string> = {
  'lavender-dreams':
    'Close your eyes. A field at dusk. The last warmth of the day on your skin.',
  'citrus-sunrise':
    'First light. Fresh squeezed. The promise of possibility.',
  'forest-calm':
    'Moss underfoot. Cedar overhead. The deep breath you\'ve been holding.',
  'ocean-breeze': 'Salt air. Horizon endless. Where the sky meets the sea.',
  'honey-amber':
    'Golden hour. Warm honey dripping slow. Sweet nostalgia wrapped in resin.',
  'eucalyptus-mint':
    'Breathe deep. Cool clarity cutting through. The forest after rain.',
  'vanilla-bean':
    'Smooth warmth. Scraped pods and memories. Comfort in every breath.',
  'rose-garden':
    'Petals unfold. Morning dew on velvet. Romance distilled to essence.',
};

/**
 * Default narrative for products without specific copy
 */
export const DEFAULT_NARRATIVE = 'Discover the essence of craftsmanship.';

/**
 * Get scent narrative for a product
 *
 * Priority order:
 * 1. Shopify metafield value (if provided)
 * 2. Fallback from SCENT_NARRATIVES map (if handle matches)
 * 3. Default narrative (if handle unknown)
 *
 * @param handle - Product handle (e.g., 'lavender-dreams')
 * @param metafieldValue - Optional scent narrative from Shopify metafield
 * @returns Scent narrative copy to display
 */
export function getScentNarrative(
  handle: string,
  metafieldValue?: string | null,
): string {
  // Prefer CMS metafield if provided
  if (metafieldValue) {
    return metafieldValue;
  }

  // Fall back to hardcoded narratives
  return SCENT_NARRATIVES[handle] ?? DEFAULT_NARRATIVE;
}
