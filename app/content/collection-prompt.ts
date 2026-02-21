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

import EucalyptusBarImage from '~/assets/images/eucalyptus-soap-bar.webp?responsive';
import LavenderBarImage from '~/assets/images/lavender-soap-bar.webp?responsive';
import LemongrassBarImage from '~/assets/images/lemongrass-soap-bar.webp?responsive';
import RosemarySeaSaltBarImage from '~/assets/images/rosemary-sea-salt-soap-bar.webp?responsive';
import type {ImageData} from '@responsive-image/core';

/**
 * Variety pack product information
 * Used to display product grid in collection prompt
 */
export interface VarietyPackProduct {
  handle: string;
  name: string;
  image: ImageData;
}

/**
 * Variety pack products (all 4 soaps)
 * Displayed as 2x2 grid (mobile) or 4-column row (tablet+)
 */
export const VARIETY_PACK_PRODUCTS: VarietyPackProduct[] = [
  {handle: 'lavender', name: 'Lavender', image: LavenderBarImage},
  {handle: 'lemongrass', name: 'Lemongrass', image: LemongrassBarImage},
  {handle: 'eucalyptus', name: 'Eucalyptus', image: EucalyptusBarImage},
  {handle: 'rosemary-sea-salt', name: 'Rosemary Sea Salt', image: RosemarySeaSaltBarImage},
];
