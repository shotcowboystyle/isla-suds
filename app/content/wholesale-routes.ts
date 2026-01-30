/**
 * Wholesale Portal Route Constants
 *
 * Centralized route paths to avoid hardcoded strings.
 */

export const WHOLESALE_ROUTES = {
  LOGIN: '/wholesale/login',
  LOGOUT: '/wholesale/logout',
  DASHBOARD: '/wholesale',
  CALLBACK: '/wholesale/login/callback',
  ORDERS: '/wholesale/orders',
} as const;
