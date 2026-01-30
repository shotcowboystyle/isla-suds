import {describe, it, expect, vi, beforeEach} from 'vitest';

/**
 * Integration tests for B2B Authentication (Story 7.1)
 *
 * Verifies:
 * - B2B customers can log in via /wholesale/login (OAuth flow)
 * - Authentication uses Shopify Customer Account API
 * - OAuth callback sets customerId in session for B2B customers
 * - B2B customer status is verified (company association)
 * - Non-B2B customers are rejected with friendly message
 * - Session persists across page navigation
 * - Logout works correctly
 */

describe('B2B Authentication Flow', () => {
  let mockCustomerAccount: any;
  let mockSession: any;
  let mockStorefront: any;
  let mockContext: any;

  beforeEach(() => {
    // Mock Hydrogen Customer Account API (OAuth-based)
    mockCustomerAccount = {
      login: vi.fn().mockResolvedValue(
        new Response(null, {
          status: 302,
          headers: {Location: 'https://shopify.com/oauth'},
        }),
      ),
      logout: vi.fn().mockResolvedValue('/wholesale/login'),
      query: vi.fn(),
    };

    // Mock AppSession (app/lib/session.ts)
    mockSession = {
      get: vi.fn(),
      set: vi.fn(),
      unset: vi.fn(),
      commit: vi.fn().mockResolvedValue('Set-Cookie: session=...'),
      isPending: false,
    };

    // Mock storefront for i18n
    mockStorefront = {
      i18n: {
        country: 'US',
        language: 'EN',
      },
    };

    // Mock Hydrogen context
    mockContext = {
      customerAccount: mockCustomerAccount,
      session: mockSession,
      storefront: mockStorefront,
    };
  });

  describe('OAuth Callback Flow', () => {
    it('sets session and redirects B2B customer to dashboard after OAuth', async () => {
      // Mock B2B customer response
      mockCustomerAccount.query.mockResolvedValue({
        data: {
          customer: {
            id: 'gid://shopify/Customer/123',
            email: 'buyer@b2bshop.com',
            displayName: 'Jane Buyer',
            company: {
              id: 'gid://shopify/Company/789',
              name: 'B2B Shop Inc',
            },
          },
        },
      });

      const {loader: callbackLoader} = await import(
        '~/routes/wholesale.login.callback'
      );

      const response = await callbackLoader({
        context: mockContext,
        params: {},
        request: new Request('http://localhost:3000/wholesale/login/callback'),
      } as any);

      // CRITICAL: Should set customerId in session
      expect(mockSession.set).toHaveBeenCalledWith(
        'customerId',
        'gid://shopify/Customer/123',
      );

      // Should commit session
      expect(mockSession.commit).toHaveBeenCalled();

      // Should redirect to dashboard
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('/wholesale');
    });

    it('rejects B2C customer at callback and redirects with error', async () => {
      // Mock B2C customer (no company)
      mockCustomerAccount.query.mockResolvedValue({
        data: {
          customer: {
            id: 'gid://shopify/Customer/999',
            email: 'consumer@gmail.com',
            displayName: 'John Consumer',
            // NO company field
          },
        },
      });

      const {loader: callbackLoader} = await import(
        '~/routes/wholesale.login.callback'
      );

      const response = await callbackLoader({
        context: mockContext,
        params: {},
        request: new Request('http://localhost:3000/wholesale/login/callback'),
      } as any);

      // Should NOT set session for B2C
      expect(mockSession.set).not.toHaveBeenCalled();

      // Should unset any existing session
      expect(mockSession.unset).toHaveBeenCalledWith('customerId');

      // Should redirect to login with error
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toContain('error=not_b2b');
    });
  });

  describe('Happy path: B2B customer login', () => {
    it('initiates OAuth login for unauthenticated users', async () => {
      // No existing session
      mockSession.get.mockResolvedValue(null);

      // Dynamic import to avoid module-level side effects
      const {loader} = await import('~/routes/wholesale.login');

      const response = await loader({
        context: mockContext,
        params: {},
        request: new Request('http://localhost:3000/wholesale/login'),
      } as any);

      // Should call customerAccount.login to initiate OAuth flow
      expect(mockCustomerAccount.login).toHaveBeenCalledWith({
        countryCode: 'US',
      });

      // Should return OAuth redirect response
      expect((response as Response).status).toBe(302);
    });

    it('redirects B2B customers with valid session to dashboard', async () => {
      // Existing B2B session
      mockSession.get.mockResolvedValue('gid://shopify/Customer/123');

      // Mock B2B customer response
      mockCustomerAccount.query.mockResolvedValue({
        data: {
          customer: {
            id: 'gid://shopify/Customer/123',
            email: 'buyer@b2bshop.com',
            displayName: 'Jane Buyer',
            company: {
              id: 'gid://shopify/Company/789',
              name: 'B2B Shop Inc',
            },
          },
        },
      });

      const {loader} = await import('~/routes/wholesale.login');

      const response = await loader({
        context: mockContext,
        params: {},
        request: new Request('http://localhost:3000/wholesale/login'),
      } as any);

      // Should query customer to verify B2B status
      expect(mockCustomerAccount.query).toHaveBeenCalled();

      // Should redirect to wholesale dashboard (Response object)
      expect((response as Response).status).toBe(302);
      expect((response as Response).headers.get('Location')).toBe('/wholesale');
    });
  });

  describe('Error path: Non-B2B customer rejected', () => {
    it('rejects B2C customer without company association with friendly message', async () => {
      // Existing session but B2C customer (no company field)
      mockSession.get.mockResolvedValue('gid://shopify/Customer/999');

      mockCustomerAccount.query.mockResolvedValue({
        data: {
          customer: {
            id: 'gid://shopify/Customer/999',
            email: 'consumer@gmail.com',
            displayName: 'John Consumer',
            // NO company field = B2C customer
          },
        },
      });

      const {loader} = await import('~/routes/wholesale.login');

      const response = (await loader({
        context: mockContext,
        params: {},
        request: new Request('http://localhost:3000/wholesale/login'),
      } as any)) as {error: string};

      // Should unset session for B2C customer
      expect(mockSession.unset).toHaveBeenCalledWith('customerId');

      // Should return error in loader data
      expect(response.error).toBeDefined();

      // Error message should be warm and friendly (from app/content/wholesale.ts)
      expect(response.error).not.toContain('unauthorized');
      expect(response.error).not.toContain('access denied');
      expect(response.error).toMatch(/wholesale|partner|business/i);
    });

    it('clears session when customer query fails', async () => {
      // Existing session but query fails (invalid session)
      mockSession.get.mockResolvedValue('gid://shopify/Customer/invalid');

      mockCustomerAccount.query.mockRejectedValue(new Error('Unauthorized'));

      const {loader} = await import('~/routes/wholesale.login');

      const response = await loader({
        context: mockContext,
        params: {},
        request: new Request('http://localhost:3000/wholesale/login'),
      } as any);

      // Should unset invalid session
      expect(mockSession.unset).toHaveBeenCalledWith('customerId');

      // Should initiate new OAuth login
      expect(mockCustomerAccount.login).toHaveBeenCalled();
    });
  });

  describe('Session persistence', () => {
    it('persists session across navigation', async () => {
      // Mock logged-in session
      mockSession.get.mockResolvedValue('gid://shopify/Customer/123');

      mockCustomerAccount.query.mockResolvedValue({
        data: {
          customer: {
            id: 'gid://shopify/Customer/123',
            email: 'buyer@acmecorp.com',
            displayName: 'Jane Buyer',
            company: {
              id: 'gid://shopify/Company/456',
              name: 'Acme Corp',
            },
          },
        },
      });

      const {loader} = await import('~/routes/wholesale.login');

      const response = await loader({
        context: mockContext,
        params: {},
        request: new Request('http://localhost:3000/wholesale/login'),
      } as any);

      // Should retrieve customer from session
      expect(mockSession.get).toHaveBeenCalledWith('customerId');

      // Should verify B2B status via query
      expect(mockCustomerAccount.query).toHaveBeenCalled();

      // Should redirect to dashboard (Response object)
      expect((response as Response).status).toBe(302);
    });
  });

  describe('Logout functionality', () => {
    it('clears session and redirects to login on logout', async () => {
      mockSession.unset.mockReturnValue(undefined);

      const {action: logoutAction} = await import('~/routes/wholesale.logout');

      const response = await logoutAction({
        context: mockContext,
        params: {},
        request: new Request('http://localhost:3000/wholesale/logout', {
          method: 'POST',
        }),
      } as any);

      // Should clear customer session
      expect(mockSession.unset).toHaveBeenCalledWith('customerId');

      // Should call customerAccount logout
      expect(mockCustomerAccount.logout).toHaveBeenCalled();

      // Should redirect to login
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('/wholesale/login');
    });

    it('handles logout via loader (GET request)', async () => {
      mockSession.unset.mockReturnValue(undefined);

      const {loader: logoutLoader} = await import('~/routes/wholesale.logout');

      const response = await logoutLoader({
        context: mockContext,
        params: {},
        request: new Request('http://localhost:3000/wholesale/logout'),
      } as any);

      // Should clear session
      expect(mockSession.unset).toHaveBeenCalledWith('customerId');

      // Should logout from Customer Account API
      expect(mockCustomerAccount.logout).toHaveBeenCalled();

      // Should redirect to login
      expect(response.status).toBe(302);
    });
  });
});
