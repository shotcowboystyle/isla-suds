import {describe, expect, it} from 'vitest';

import {
  CART_DRAWER_ERROR_MESSAGE,
  PAYMENT_RETRY_MESSAGE,
  ROUTE_ERROR_MESSAGE,
  TEXTURE_REVEAL_FALLBACK_MESSAGE,
} from './errors';

describe('Error Messages', () => {
  it('exports route error message with warm tone', () => {
    expect(ROUTE_ERROR_MESSAGE).toBeDefined();
    expect(ROUTE_ERROR_MESSAGE).toContain('cart is safe');
    expect(ROUTE_ERROR_MESSAGE).not.toContain('error');
    expect(ROUTE_ERROR_MESSAGE.length).toBeGreaterThan(0);
  });

  it('exports cart drawer error message with recovery action', () => {
    expect(CART_DRAWER_ERROR_MESSAGE).toBeDefined();
    expect(CART_DRAWER_ERROR_MESSAGE).toContain('cart');
    expect(CART_DRAWER_ERROR_MESSAGE.length).toBeGreaterThan(0);
  });

  it('exports texture reveal fallback message as empty string (silent)', () => {
    expect(TEXTURE_REVEAL_FALLBACK_MESSAGE).toBeDefined();
    expect(TEXTURE_REVEAL_FALLBACK_MESSAGE).toBe('');
  });

  it('exports payment retry message with warm tone', () => {
    expect(PAYMENT_RETRY_MESSAGE).toBeDefined();
    expect(PAYMENT_RETRY_MESSAGE).toContain('try again');
    expect(PAYMENT_RETRY_MESSAGE).not.toContain('error');
    expect(PAYMENT_RETRY_MESSAGE.length).toBeGreaterThan(0);
  });

  it('all messages use warm, non-accusatory tone', () => {
    const messages = [
      ROUTE_ERROR_MESSAGE,
      CART_DRAWER_ERROR_MESSAGE,
      PAYMENT_RETRY_MESSAGE,
    ];

    messages.forEach((message) => {
      // Should not contain accusatory or corporate language
      expect(message.toLowerCase()).not.toContain('please contact support');
      expect(message.toLowerCase()).not.toContain('an error occurred');
      expect(message.toLowerCase()).not.toContain('something went wrong');
    });
  });

  it('messages guide users to recovery actions', () => {
    expect(ROUTE_ERROR_MESSAGE).toMatch(/try again|retry|let's/i);
    expect(PAYMENT_RETRY_MESSAGE).toMatch(/try again|retry|let's/i);
  });
});
