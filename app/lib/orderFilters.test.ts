import {describe, it, expect} from 'vitest';
import {
  ORDER_FILTER_FIELDS,
  buildOrderSearchQuery,
  parseOrderFilters,
} from './orderFilters';

describe('orderFilters', () => {
  describe('ORDER_FILTER_FIELDS', () => {
    it('should have correct field names', () => {
      expect(ORDER_FILTER_FIELDS.NAME).toBe('name');
      expect(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER).toBe('confirmation_number');
    });
  });

  describe('buildOrderSearchQuery', () => {
    it('should return undefined for empty filters', () => {
      expect(buildOrderSearchQuery({})).toBeUndefined();
    });

    it('should return name query for name filter', () => {
      expect(buildOrderSearchQuery({name: '1001'})).toBe('name:1001');
    });

    it('should strip # prefix from name', () => {
      expect(buildOrderSearchQuery({name: '#1001'})).toBe('name:1001');
    });

    it('should handle confirmation number filter', () => {
      expect(buildOrderSearchQuery({confirmationNumber: 'ABC123'})).toBe(
        'confirmation_number:ABC123',
      );
    });

    it('should combine both filters with AND', () => {
      expect(
        buildOrderSearchQuery({name: '1001', confirmationNumber: 'ABC123'}),
      ).toBe('name:1001 AND confirmation_number:ABC123');
    });

    it('should sanitize special characters from name', () => {
      expect(buildOrderSearchQuery({name: 'order<script>'})).toBe(
        'name:orderscript',
      );
    });

    it('should sanitize special characters from confirmation number', () => {
      expect(
        buildOrderSearchQuery({confirmationNumber: 'ABC!@#$%^&*()123'}),
      ).toBe('confirmation_number:ABC123');
    });

    it('should allow alphanumeric, underscore, and dash through sanitization', () => {
      expect(buildOrderSearchQuery({name: 'order_123-abc'})).toBe(
        'name:order_123-abc',
      );
    });

    it('should return undefined when all values sanitize to empty strings', () => {
      expect(buildOrderSearchQuery({name: '!!!'})).toBeUndefined();
    });

    it('should return undefined for whitespace-only values', () => {
      expect(buildOrderSearchQuery({name: '   '})).toBeUndefined();
    });

    it('should handle whitespace-only confirmation number', () => {
      expect(
        buildOrderSearchQuery({confirmationNumber: '   '}),
      ).toBeUndefined();
    });
  });

  describe('parseOrderFilters', () => {
    it('should parse name from search params', () => {
      const params = new URLSearchParams('name=1001');
      expect(parseOrderFilters(params)).toEqual({name: '1001'});
    });

    it('should parse confirmation_number from search params', () => {
      const params = new URLSearchParams('confirmation_number=ABC123');
      expect(parseOrderFilters(params)).toEqual({
        confirmationNumber: 'ABC123',
      });
    });

    it('should parse both params together', () => {
      const params = new URLSearchParams(
        'name=1001&confirmation_number=ABC123',
      );
      expect(parseOrderFilters(params)).toEqual({
        name: '1001',
        confirmationNumber: 'ABC123',
      });
    });

    it('should return empty object for no params', () => {
      const params = new URLSearchParams();
      expect(parseOrderFilters(params)).toEqual({});
    });

    it('should ignore unrecognized params', () => {
      const params = new URLSearchParams('foo=bar&status=active');
      expect(parseOrderFilters(params)).toEqual({});
    });
  });
});
