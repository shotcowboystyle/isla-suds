/**
 * Product Content Layer - Centralized content management with Shopify metafield fallbacks
 *
 * This module provides all product-related copy (scent narratives, descriptions,
 * bundle value propositions) with a consistent fallback strategy:
 *
 * **Priority Order (all content types):**
 * 1. Shopify metafield value (CMS-managed, preferred)
 * 2. Hardcoded fallback by product handle (development/staging safety net)
 * 3. Generic default (last resort for unknown handles)
 *
 * **Usage:**
 * - Scent narratives: `getScentNarrative(handle, metafieldValue)`
 * - Product descriptions: `getProductDescription(handle, apiDescription)`
 * - Bundle value props: `getBundleValueProposition(handle, metafieldValue)`
 *
 * **Adding new products:**
 * 1. Add handle to appropriate fallback map (SCENT_NARRATIVES, PRODUCT_DESCRIPTIONS, etc.)
 * 2. Configure metafields in Shopify Admin (preferred for production)
 *
 * @see Stories 3-3 (scent narratives), 3-4 (product descriptions), 3-6 (bundle content)
 */

// =============================================================================
// Bundle Configuration
// =============================================================================

/**
 * Product handle for the variety pack bundle (Story 3.6).
 * Single source of truth for bundle detection across constellation, reveal, and content.
 */
export const BUNDLE_HANDLE = 'four-bar-variety-pack';

// =============================================================================
// Scent Narratives (Story 3-3)
// Evocative sensory copy displayed in texture reveals
// =============================================================================

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
  [BUNDLE_HANDLE]:
    'Four distinct journeys. One complete experience. Every mood, every moment.',
};

/**
 * Default narrative for products without specific copy
 */
export const DEFAULT_NARRATIVE = 'Discover the essence of craftsmanship.';

/**
 * Get scent narrative for a product (follows standard priority order)
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

// =============================================================================
// Product Descriptions (Story 3-4)
// Brief product info displayed in texture reveals (1-2 sentences)
// =============================================================================

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
  [BUNDLE_HANDLE]:
    'All four handcrafted soaps together. Rotate scents with your mood.',
};

/**
 * Default description for products without specific copy
 */
export const DEFAULT_DESCRIPTION =
  'Handcrafted soap made with premium natural ingredients.';

/**
 * Get product description with fallback (follows standard priority order)
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

// =============================================================================
// Bundle Value Propositions (Story 3-6)
// Marketing copy for variety pack bundle (displayed in BundleCard)
// =============================================================================

/**
 * Bundle value proposition copy
 *
 * Fallback value proposition for the variety pack bundle when
 * Shopify metafield is not configured.
 */
export const BUNDLE_VALUE_PROPOSITIONS: Record<string, string> = {
  [BUNDLE_HANDLE]: 'All four soaps, one price. Rotate scents with your mood.',
};

/**
 * Default bundle value proposition
 */
export const DEFAULT_BUNDLE_VALUE_PROPOSITION =
  'Get all four handcrafted soaps together.';

/**
 * Get bundle value proposition for a product (follows standard priority order)
 *
 * @param handle - Product handle (e.g., 'four-bar-variety-pack')
 * @param metafieldValue - Optional value proposition from Shopify metafield
 * @returns Bundle value proposition copy to display
 */
export function getBundleValueProposition(
  handle: string,
  metafieldValue?: string | null,
): string {
  // Prefer CMS metafield if provided
  if (metafieldValue) {
    return metafieldValue;
  }

  // Fall back to hardcoded value propositions
  return BUNDLE_VALUE_PROPOSITIONS[handle] ?? DEFAULT_BUNDLE_VALUE_PROPOSITION;
}

// =============================================================================
// Content Helper Types (for consumers)
// =============================================================================

/**
 * Type for product content configuration
 * Use this when passing content to components that need multiple content types
 */
export type ProductContent = {
  scentNarrative: string;
  description: string;
  bundleValueProposition?: string;
};
