/**
 * Centralized error messages with warm, non-accusatory tone.
 * All user-facing error messages should come from this file.
 *
 * Brand voice: Farmers market energy, warm and personal.
 * Never blame the user, always guide to recovery.
 */

/**
 * Route-level error message (full page errors)
 * Displayed when: Page crashes, routing failures
 * Recovery: Retry or navigate back
 */
export const ROUTE_ERROR_MESSAGE =
  "Something's not quite right. Your cart is safe—let's try again.";

/**
 * Cart drawer error message
 * Displayed when: Cart drawer fails to load
 * Recovery: Link to /cart page
 */
export const CART_DRAWER_ERROR_MESSAGE =
  'Having trouble loading your cart. [View cart page →]';

/**
 * Texture reveal fallback message
 * Displayed when: TextureReveal component fails
 * Recovery: Silent fallback to static image (no message shown)
 */
export const TEXTURE_REVEAL_FALLBACK_MESSAGE = '';

/**
 * Payment retry message
 * Displayed when: Payment processing fails
 * Recovery: Retry payment
 */
export const PAYMENT_RETRY_MESSAGE =
  "That didn't go through. No worries—let's try again.";

/**
 * Collection prompt cart add error message
 * Displayed when: Adding variety pack from collection prompt fails
 * Recovery: User can retry by clicking button again
 */
export const COLLECTION_PROMPT_ADD_ERROR_MESSAGE =
  "Something went wrong. Let's try again.";

/**
 * Add to cart error message
 * Displayed when: Adding individual product to cart fails
 * Recovery: User can retry by clicking button again
 */
export const ADD_TO_CART_ERROR_MESSAGE =
  "Something went wrong. Let's try again.";

/**
 * Add to cart button state text
 * Displayed during: Button state transitions (loading, success)
 * Recovery: N/A (informational states)
 */
export const ADD_TO_CART_BUTTON_STATES = {
  LOADING: 'Adding...',
  SUCCESS: 'Added ✓',
} as const;

/**
 * Cart quantity update error messages (Story 5.6)
 * Displayed when: Updating cart line item quantity fails
 * Recovery: User can retry by clicking +/- button again
 */
export const CART_QUANTITY_UPDATE_ERROR_MESSAGE =
  "Couldn't update quantity. Let's try again.";

/**
 * Cart quantity update inventory error message
 * Displayed when: Requested quantity exceeds available inventory
 * Recovery: Quantity stays at current value, user informed of limit
 */
export const CART_QUANTITY_INVENTORY_ERROR_MESSAGE =
  "We don't have that many in stock right now.";

/**
 * Cart quantity update network error message
 * Displayed when: Network request fails or times out
 * Recovery: User can retry when connection is restored
 */
export const CART_QUANTITY_NETWORK_ERROR_MESSAGE =
  "Connection hiccup. Check your internet and try again.";

/**
 * Cart item removal error messages (Story 5.7)
 * Displayed when: Removing cart line item fails
 * Recovery: User can retry by clicking remove button again
 */
export const CART_REMOVE_ERROR_MESSAGE =
  "Couldn't remove this item. Let's try again.";

/**
 * Cart item removal generic fallback message
 * Displayed when: Removal fails with unspecified error
 * Recovery: User can retry removal
 */
export const CART_REMOVE_GENERIC_ERROR_MESSAGE =
  "Something went wrong. Please try again.";

/**
 * Checkout redirect error message (Story 5.9)
 * Displayed when: Checkout redirect fails or checkoutUrl is missing
 * Recovery: User can retry by clicking checkout button again
 */
export const CHECKOUT_ERROR_MESSAGE =
  "Couldn't start checkout. Let's try again.";
