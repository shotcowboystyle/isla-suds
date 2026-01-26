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
