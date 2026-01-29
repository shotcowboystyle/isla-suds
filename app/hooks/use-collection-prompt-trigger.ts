import {useExplorationStore} from '~/stores/exploration';

/**
 * Hook return interface
 */
export interface UseCollectionPromptTriggerResult {
  /** Whether the collection prompt should be shown */
  shouldShowPrompt: boolean;
}

/**
 * useCollectionPromptTrigger hook (Story 4.2, Task 3)
 *
 * Determines if collection prompt should be shown based on:
 * - AC1: User has explored 2+ products
 * - AC2: Prompt hasn't been shown before (storyMomentShown = false)
 * - AC3: Variety pack is NOT in cart (stub implementation - will be completed in Story 4.3)
 *
 * SSR-safe with graceful fallbacks for undefined cart data
 *
 * @returns {UseCollectionPromptTriggerResult} Object with shouldShowPrompt boolean
 *
 * @example
 * const { shouldShowPrompt } = useCollectionPromptTrigger();
 * if (shouldShowPrompt) {
 *   // Show collection prompt
 * }
 */
export function useCollectionPromptTrigger(): UseCollectionPromptTriggerResult {
  // Subscribe to Zustand exploration store
  const productsExplored = useExplorationStore((state) => state.productsExplored);
  const storyMomentShown = useExplorationStore((state) => state.storyMomentShown);

  // TODO Story 4.3: Get cart data from Hydrogen Cart Context via loader
  // For now, cart checking is stubbed out (always returns empty cart)
  const lines: any[] = [];

  // AC1: Check if user has explored 2+ products
  const hasExploredEnoughProducts = productsExplored.size >= 2;

  // AC2: Check if prompt hasn't been shown before
  const promptNotShownYet = !storyMomentShown;

  // AC3: Check if variety pack is NOT in cart
  // SSR-safe: If lines is undefined or null, default to true (show prompt)
  const varietyPackNotInCart = !checkForVarietyPackInCart(lines);

  // All conditions must be true to show prompt
  const shouldShowPrompt =
    hasExploredEnoughProducts && promptNotShownYet && varietyPackNotInCart;

  return {shouldShowPrompt};
}

/**
 * Helper function to check if variety pack is in cart
 * Identifies variety pack by:
 * - productType === "Bundle"
 * - handle === "variety-pack" or "four-bar-variety-pack"
 *
 * SSR-safe with graceful handling of undefined/null cart lines
 *
 * @param lines - Cart lines from Hydrogen Cart Context
 * @returns true if variety pack is in cart, false otherwise
 */
function checkForVarietyPackInCart(
  lines: Array<{merchandise: {product: {productType?: string; handle?: string}}}>| undefined | null,
): boolean {
  // SSR safety: If lines is undefined or null, return false (no variety pack)
  if (!lines || !Array.isArray(lines)) {
    return false;
  }

  // Check each cart line for variety pack
  return lines.some((line) => {
    const product = line?.merchandise?.product;
    if (!product) return false;

    // Check product type (Bundle indicates variety pack)
    if (product.productType === 'Bundle') {
      return true;
    }

    // Check product handle (variety-pack or four-bar-variety-pack)
    const handle = product.handle?.toLowerCase();
    if (handle === 'variety-pack' || handle === 'four-bar-variety-pack') {
      return true;
    }

    return false;
  });
}
