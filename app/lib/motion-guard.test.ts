import {describe, it, expect} from 'vitest';
import {isB2BRoute, shouldDisableMotion} from './motion-guard';

describe('motion-guard', () => {
  describe('isB2BRoute', () => {
    it('should return true for /wholesale root', () => {
      expect(isB2BRoute('/wholesale')).toBe(true);
    });

    it('should return true for /wholesale sub-routes', () => {
      expect(isB2BRoute('/wholesale/login')).toBe(true);
      expect(isB2BRoute('/wholesale/orders')).toBe(true);
      expect(isB2BRoute('/wholesale/orders/123')).toBe(true);
    });

    it('should return false for B2C routes', () => {
      expect(isB2BRoute('/')).toBe(false);
      expect(isB2BRoute('/products')).toBe(false);
      expect(isB2BRoute('/cart')).toBe(false);
      expect(isB2BRoute('/dev/motion')).toBe(false);
    });

    it('should return false for routes that contain "wholesale" but not as prefix', () => {
      expect(isB2BRoute('/about-wholesale')).toBe(false);
      expect(isB2BRoute('/products/wholesale-soap')).toBe(false);
    });
  });

  describe('shouldDisableMotion', () => {
    it('should return true for B2B routes', () => {
      expect(shouldDisableMotion('/wholesale')).toBe(true);
      expect(shouldDisableMotion('/wholesale/login')).toBe(true);
    });

    it('should return false for B2C routes', () => {
      expect(shouldDisableMotion('/')).toBe(false);
      expect(shouldDisableMotion('/products')).toBe(false);
      expect(shouldDisableMotion('/dev/motion')).toBe(false);
    });
  });
});
