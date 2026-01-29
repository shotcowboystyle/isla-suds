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
  'citrus-sunrise': 'First light. Fresh squeezed. The promise of possibility.',
  'forest-calm':
    "Moss underfoot. Cedar overhead. The deep breath you've been holding.",
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

/**
 * Product descriptions (1-2 sentences)
 *
 * Fallback descriptions for products when Shopify product.description
 * is empty or missing. Keep descriptions brief and compelling.
 */
export const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  'lavender-dreams':
    'A soothing lavender soap with calming properties. Perfect for evening relaxation.',
  'citrus-sunrise':
    'Energizing citrus blend to start your day fresh. Awakens the senses.',
  'forest-calm':
    'Woodsy soap with cedar and moss notes. Grounding and peaceful.',
  'ocean-breeze':
    'Clean marine scent reminiscent of coastal air. Refreshing and crisp.',
  'honey-amber':
    'Warm honey and amber create a sweet, cozy lather. Comforting and rich.',
  'eucalyptus-mint':
    'Cooling eucalyptus and mint for clarity. Invigorating and fresh.',
  'vanilla-bean':
    'Classic vanilla with natural bean essence. Warm and familiar.',
  'rose-garden': 'Delicate rose petal soap, soft and romantic. Gentle on skin.',
};

/**
 * Default description for products without specific copy
 */
export const DEFAULT_DESCRIPTION =
  'Handcrafted soap made with premium natural ingredients.';

/**
 * Get product description with fallback
 *
 * Priority order:
 * 1. Shopify product.description (if provided)
 * 2. Fallback from PRODUCT_DESCRIPTIONS map (if handle matches)
 * 3. Default description (if handle unknown)
 *
 * @param handle - Product handle (e.g., 'lavender-dreams')
 * @param apiDescription - Optional description from Shopify API
 * @returns Product description (1-2 sentences)
 */
export function getProductDescription(
  handle: string,
  apiDescription?: string | null,
): string {
  // Prefer API description if provided
  if (apiDescription && apiDescription.trim()) {
    return apiDescription.trim();
  }

  // Fall back to hardcoded descriptions
  return PRODUCT_DESCRIPTIONS[handle] ?? DEFAULT_DESCRIPTION;
}
