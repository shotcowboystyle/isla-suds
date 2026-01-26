/**
 * Utility to prevent Framer Motion usage in B2B routes
 * AC6: B2B routes (`/wholesale/*`) do NOT load Framer Motion
 */

/**
 * Check if current pathname is a B2B/wholesale route
 * @param pathname - Current pathname (from useLocation or window.location)
 * @returns true if pathname starts with /wholesale
 */
export function isB2BRoute(pathname: string): boolean {
  return pathname.startsWith('/wholesale');
}

/**
 * Guard function to prevent Framer Motion initialization in B2B routes
 * Use this before initializing any motion components
 * @param pathname - Current pathname
 * @returns true if motion should be disabled (B2B route)
 */
export function shouldDisableMotion(pathname: string): boolean {
  return isB2BRoute(pathname);
}
