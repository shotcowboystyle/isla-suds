import {describe, expect, it, vi} from 'vitest';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {loader} from '../wholesale._index';

/**
 * Integration tests for wholesale dashboard
 * Tests loader behavior, authentication, and B2B validation
 */

describe('Wholesale Dashboard Integration', () => {
  describe('WHOLESALE_ROUTES constant', () => {
    it('validates LOGIN route exists', () => {
      expect(WHOLESALE_ROUTES).toHaveProperty('LOGIN');
      expect(WHOLESALE_ROUTES.LOGIN).toBe('/wholesale/login');
    });
  });

  describe('loader authentication', () => {
    it('redirects to login when not authenticated', async () => {
      const mockContext = {
        session: {
          get: vi.fn().mockResolvedValue(null),
        },
        customerAccount: {
          query: vi.fn(),
        },
      };

      const response = await loader({
        context: mockContext,
        request: new Request('http://localhost/wholesale'),
        params: {},
      } as any);

      // Should redirect to login
      expect(response).toBeInstanceOf(Response);
      if (response instanceof Response) {
        expect(response.status).toBe(302);
        expect(response.headers.get('Location')).toBe('/wholesale/login');
      }
    });

    it('loads customer data when authenticated', async () => {
      const mockCustomerResponse = {
        data: {
          customer: {
            id: 'gid://shopify/Customer/123',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah@example.com',
            company: {
              id: 'gid://shopify/Company/456',
              name: 'Artisan Market',
            },
          },
        },
      };

      const mockOrdersResponse = {
        data: {
          customer: {
            orders: {
              edges: [],
            },
          },
        },
      };

      const mockContext = {
        session: {
          get: vi.fn().mockResolvedValue('customer-123'),
        },
        customerAccount: {
          query: vi
            .fn()
            .mockResolvedValueOnce(mockCustomerResponse)
            .mockResolvedValueOnce(mockOrdersResponse),
        },
      };

      const response = await loader({
        context: mockContext,
        request: new Request('http://localhost/wholesale'),
        params: {},
      } as any);

      expect(response).toEqual({
        partnerName: 'Sarah',
        storeCount: 3,
        lastOrder: null,
      });
    });

    it('uses fallback name when firstName is missing', async () => {
      const mockCustomerResponse = {
        data: {
          customer: {
            id: 'gid://shopify/Customer/123',
            firstName: null,
            lastName: 'Johnson',
            email: 'sarah@example.com',
            company: {
              id: 'gid://shopify/Company/456',
              name: 'Artisan Market',
            },
          },
        },
      };

      const mockOrdersResponse = {
        data: {
          customer: {
            orders: {
              edges: [],
            },
          },
        },
      };

      const mockContext = {
        session: {
          get: vi.fn().mockResolvedValue('customer-123'),
        },
        customerAccount: {
          query: vi
            .fn()
            .mockResolvedValueOnce(mockCustomerResponse)
            .mockResolvedValueOnce(mockOrdersResponse),
        },
      };

      const response = await loader({
        context: mockContext,
        request: new Request('http://localhost/wholesale'),
        params: {},
      } as any);

      expect(response).not.toBeInstanceOf(Response);
      if (!(response instanceof Response)) {
        expect(response.partnerName).toBe('Partner');
      }
    });

    it('redirects to login when customer has no company', async () => {
      const mockCustomerResponse = {
        data: {
          customer: {
            id: 'gid://shopify/Customer/123',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah@example.com',
            company: null, // Not a B2B customer
          },
        },
      };

      const mockContext = {
        session: {
          get: vi.fn().mockResolvedValue('customer-123'),
        },
        customerAccount: {
          query: vi.fn().mockResolvedValue(mockCustomerResponse),
        },
      };

      const response = await loader({
        context: mockContext,
        request: new Request('http://localhost/wholesale'),
        params: {},
      } as any);

      expect(response).toBeInstanceOf(Response);
      if (response instanceof Response) {
        expect(response.status).toBe(302);
        expect(response.headers.get('Location')).toBe('/wholesale/login');
      }
    });

    it('redirects to login when API query fails', async () => {
      const mockContext = {
        session: {
          get: vi.fn().mockResolvedValue('customer-123'),
        },
        customerAccount: {
          query: vi.fn().mockRejectedValue(new Error('API Error')),
        },
      };

      const response = await loader({
        context: mockContext,
        request: new Request('http://localhost/wholesale'),
        params: {},
      } as any);

      expect(response).toBeInstanceOf(Response);
      if (response instanceof Response) {
        expect(response.status).toBe(302);
        expect(response.headers.get('Location')).toBe('/wholesale/login');
      }
    });
  });

  describe('loader data structure', () => {
    it('returns partnerName, storeCount, and lastOrder', async () => {
      const mockCustomerResponse = {
        data: {
          customer: {
            id: 'gid://shopify/Customer/123',
            firstName: 'Michael',
            lastName: 'Chen',
            email: 'michael@example.com',
            company: {
              id: 'gid://shopify/Company/456',
              name: 'Corner Store',
            },
          },
        },
      };

      const mockOrdersResponse = {
        data: {
          customer: {
            orders: {
              edges: [],
            },
          },
        },
      };

      const mockContext = {
        session: {
          get: vi.fn().mockResolvedValue('customer-123'),
        },
        customerAccount: {
          query: vi
            .fn()
            .mockResolvedValueOnce(mockCustomerResponse)
            .mockResolvedValueOnce(mockOrdersResponse),
        },
      };

      const response = await loader({
        context: mockContext,
        request: new Request('http://localhost/wholesale'),
        params: {},
      } as any);

      expect(response).toHaveProperty('partnerName', 'Michael');
      expect(response).toHaveProperty('storeCount', 3);
      expect(response).toHaveProperty('lastOrder', null);
    });
  });
});
