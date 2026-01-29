/**
 * Collection prompt content structure
 * Warm, non-pushy copy for bundle upsell prompt after 2+ products explored
 */
export interface CollectionPromptContent {
  headline: string;
  description: string;
  buttonText: string;
  dismissLabel: string;
}

/**
 * Collection prompt copy (AC1 - warm, non-pushy tone)
 * Appears after user explores 2+ products
 */
export const COLLECTION_PROMPT_COPY: CollectionPromptContent = {
  headline: 'Loving what you see? Get the whole collection.',
  description:
    'Experience all four handcrafted scents together. Each bar tells its own story.',
  buttonText: 'Get the Collection',
  dismissLabel: 'Close',
};

/**
 * Variety pack product information
 * Used to display product grid in collection prompt
 */
export interface VarietyPackProduct {
  handle: string;
  name: string;
}

/**
 * Variety pack products (all 4 soaps)
 * Displayed as 2x2 grid (mobile) or 4-column row (tablet+)
 */
export const VARIETY_PACK_PRODUCTS: VarietyPackProduct[] = [
  {handle: 'lavender-soap', name: 'Lavender'},
  {handle: 'lemongrass-soap', name: 'Lemongrass'},
  {handle: 'eucalyptus-soap', name: 'Eucalyptus'},
  {handle: 'mint-soap', name: 'Mint'},
];
